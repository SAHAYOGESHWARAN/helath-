/**
 * Laboratory Integration Service
 * 
 * Handles third-party laboratory integrations with automated result imports,
 * structured data mapping, and result tracking within patient records.
 */

import { LabResult, LabResultComponent, LabOrder } from '../types';
import { getEMRAPIClient, EMRAPIResponse } from './emrApiClient';

// Third-party lab result format (varies by provider)
export interface ThirdPartyLabResult {
  patientId: string;
  patientName?: string;
  orderId?: string;
  accessionNumber: string;
  collectionDate: string;
  resultDate: string;
  testName: string;
  testCode?: string;
  results: Array<{
    componentName: string;
    componentCode?: string;
    value: string | number;
    unit?: string;
    referenceRange?: string;
    flag?: 'N' | 'H' | 'L' | 'A'; // Normal, High, Low, Abnormal
    status?: string;
  }>;
  status: 'Preliminary' | 'Final' | 'Corrected';
  labName: string;
  labId?: string;
  provider?: string;
  notes?: string;
}

// Lab integration provider configuration
export interface LabIntegrationProvider {
  id: string;
  name: string;
  apiUrl: string;
  apiKey: string;
  mappingRules: LabDataMappingRules;
  autoImport: boolean;
  pollingInterval?: number; // in milliseconds
  lastSync?: string;
}

// Data mapping rules for transforming third-party formats
export interface LabDataMappingRules {
  patientIdField: string;
  testNameField: string;
  resultDateField: string;
  componentMapping: {
    name: string;
    value: string;
    unit?: string;
    referenceRange?: string;
    flag?: string;
  };
  normalizationRules?: {
    unitConversions?: Record<string, string>;
    valueTransformations?: Record<string, (value: any) => any>;
  };
}

// Import result
export interface LabImportResult {
  success: boolean;
  imported: number;
  failed: number;
  results: Array<{
    labResult: LabResult;
    thirdPartyId: string;
    status: 'success' | 'failed';
    error?: string;
  }>;
}

/**
 * Laboratory Integration Service Class
 */
export class LaboratoryIntegrationService {
  private providers: Map<string, LabIntegrationProvider> = new Map();
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();
  private emrClient = getEMRAPIClient();

  /**
   * Register a laboratory integration provider
   */
  registerProvider(provider: LabIntegrationProvider): void {
    this.providers.set(provider.id, provider);
    
    if (provider.autoImport && provider.pollingInterval) {
      this.startPolling(provider.id);
    }
  }

  /**
   * Import lab results from third-party provider
   */
  async importLabResults(
    providerId: string,
    results: ThirdPartyLabResult[]
  ): Promise<LabImportResult> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Lab provider ${providerId} not found`);
    }

    const importResult: LabImportResult = {
      success: true,
      imported: 0,
      failed: 0,
      results: [],
    };

    for (const thirdPartyResult of results) {
      try {
        // Map third-party format to internal format
        const mappedResult = this.mapLabResult(thirdPartyResult, provider.mappingRules);
        
        // Validate mapped result
        if (!this.validateLabResult(mappedResult)) {
          importResult.failed++;
          importResult.results.push({
            labResult: mappedResult,
            thirdPartyId: thirdPartyResult.accessionNumber,
            status: 'failed',
            error: 'Validation failed',
          });
          continue;
        }

        // Import to EMR
        const emrResponse = await this.emrClient.createLabResult(mappedResult);
        
        if (emrResponse.success && emrResponse.data) {
          importResult.imported++;
          importResult.results.push({
            labResult: emrResponse.data,
            thirdPartyId: thirdPartyResult.accessionNumber,
            status: 'success',
          });

          // Update lab order status if order exists
          if (thirdPartyResult.orderId) {
            await this.updateLabOrderStatus(thirdPartyResult.orderId, 'Results Ready');
          }
        } else {
          importResult.failed++;
          importResult.results.push({
            labResult: mappedResult,
            thirdPartyId: thirdPartyResult.accessionNumber,
            status: 'failed',
            error: emrResponse.error?.message || 'EMR import failed',
          });
        }
      } catch (error) {
        importResult.failed++;
        importResult.results.push({
          labResult: {} as LabResult,
          thirdPartyId: thirdPartyResult.accessionNumber,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    importResult.success = importResult.failed === 0;

    // Update provider last sync
    if (provider) {
      provider.lastSync = new Date().toISOString();
    }

    return importResult;
  }

  /**
   * Map third-party lab result to internal format
   */
  private mapLabResult(
    thirdPartyResult: ThirdPartyLabResult,
    mappingRules: LabDataMappingRules
  ): LabResult {
    const components: LabResultComponent[] = thirdPartyResult.results.map(result => {
      // Determine if abnormal based on flag or value comparison
      let isAbnormal = false;
      if (result.flag) {
        isAbnormal = ['H', 'L', 'A'].includes(result.flag);
      } else if (result.referenceRange) {
        // Parse reference range and compare (simplified)
        const range = this.parseReferenceRange(result.referenceRange);
        if (range && typeof result.value === 'number') {
          isAbnormal = result.value < range.min || result.value > range.max;
        }
      }

      // Apply normalization rules
      let normalizedValue = result.value;
      if (mappingRules.normalizationRules?.valueTransformations) {
        const transform = mappingRules.normalizationRules.valueTransformations[result.componentName];
        if (transform) {
          normalizedValue = transform(result.value);
        }
      }

      return {
        name: result.componentName,
        value: String(normalizedValue),
        referenceRange: result.referenceRange || 'N/A',
        isAbnormal,
      };
    });

    return {
      id: `lab_${thirdPartyResult.accessionNumber}`,
      testName: thirdPartyResult.testName,
      date: thirdPartyResult.resultDate,
      components,
    };
  }

  /**
   * Parse reference range string (e.g., "10-20 mg/dL")
   */
  private parseReferenceRange(range: string): { min: number; max: number } | null {
    const match = range.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
    if (match) {
      return {
        min: parseFloat(match[1]),
        max: parseFloat(match[2]),
      };
    }
    return null;
  }

  /**
   * Validate lab result before import
   */
  private validateLabResult(result: LabResult): boolean {
    if (!result.testName || !result.date) {
      return false;
    }
    if (!result.components || result.components.length === 0) {
      return false;
    }
    return true;
  }

  /**
   * Update lab order status
   */
  private async updateLabOrderStatus(orderId: string, status: LabOrder['status']): Promise<void> {
    try {
      // This would typically update via the EMR API
      // For now, we'll log it
      console.log(`Updating lab order ${orderId} to status: ${status}`);
    } catch (error) {
      console.error(`Failed to update lab order ${orderId}:`, error);
    }
  }

  /**
   * Fetch results from third-party lab API
   */
  async fetchFromProvider(providerId: string): Promise<ThirdPartyLabResult[]> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Lab provider ${providerId} not found`);
    }

    try {
      const response = await fetch(`${provider.apiUrl}/results`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${provider.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch from ${provider.name}: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error(`Error fetching from ${provider.name}:`, error);
      throw error;
    }
  }

  /**
   * Start automatic polling for a provider
   */
  private startPolling(providerId: string): void {
    const provider = this.providers.get(providerId);
    if (!provider || !provider.pollingInterval) return;

    const interval = setInterval(async () => {
      try {
        const results = await this.fetchFromProvider(providerId);
        if (results.length > 0) {
          await this.importLabResults(providerId, results);
        }
      } catch (error) {
        console.error(`Error polling ${provider.name}:`, error);
      }
    }, provider.pollingInterval);

    this.pollingIntervals.set(providerId, interval);
    console.log(`Started polling for ${provider.name} (interval: ${provider.pollingInterval}ms)`);
  }

  /**
   * Stop automatic polling for a provider
   */
  stopPolling(providerId: string): void {
    const interval = this.pollingIntervals.get(providerId);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(providerId);
      const provider = this.providers.get(providerId);
      console.log(`Stopped polling for ${provider?.name || providerId}`);
    }
  }

  /**
   * Get all registered providers
   */
  getProviders(): LabIntegrationProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Get provider by ID
   */
  getProvider(providerId: string): LabIntegrationProvider | undefined {
    return this.providers.get(providerId);
  }

  /**
   * Remove provider
   */
  removeProvider(providerId: string): void {
    this.stopPolling(providerId);
    this.providers.delete(providerId);
  }

  /**
   * Manually trigger import for all providers
   */
  async importAllProviders(): Promise<Map<string, LabImportResult>> {
    const results = new Map<string, LabImportResult>();

    for (const providerId of this.providers.keys()) {
      try {
        const thirdPartyResults = await this.fetchFromProvider(providerId);
        const importResult = await this.importLabResults(providerId, thirdPartyResults);
        results.set(providerId, importResult);
      } catch (error) {
        console.error(`Failed to import from ${providerId}:`, error);
        results.set(providerId, {
          success: false,
          imported: 0,
          failed: 0,
          results: [],
        });
      }
    }

    return results;
  }
}

// Singleton instance
let laboratoryIntegrationInstance: LaboratoryIntegrationService | null = null;

/**
 * Get or create Laboratory Integration Service instance
 */
export const getLaboratoryIntegrationService = (): LaboratoryIntegrationService => {
  if (!laboratoryIntegrationInstance) {
    laboratoryIntegrationInstance = new LaboratoryIntegrationService();
  }
  return laboratoryIntegrationInstance;
};

export default LaboratoryIntegrationService;

