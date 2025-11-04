/**
 * EMR Integration Service
 * 
 * High-level service layer that integrates the healthcare app with the EMR API.
 * Provides real-time synchronization, data transformation, and error recovery.
 */

import { getEMRAPIClient, EMRAPIClient, EMRAPIResponse } from './emrApiClient';
import { 
  User, 
  Appointment, 
  Prescription, 
  LabResult, 
  VitalsRecord,
  ProgressNote,
  Message,
  Claim,
  BillingInvoice
} from '../types';
import { useAuth } from '../hooks/useAuth';

/**
 * Integration Service Class
 * Handles bidirectional sync between healthcare app and EMR
 */
export class EMRIntegrationService {
  private client: EMRAPIClient;
  private syncInterval: NodeJS.Timeout | null = null;
  private isSyncing: boolean = false;

  constructor(apiKey?: string, baseUrl?: string) {
    this.client = getEMRAPIClient({
      apiKey: apiKey || process.env.VITE_EMR_API_KEY || '',
      baseUrl: baseUrl || process.env.VITE_EMR_API_URL || '',
      enableCaching: true,
      retryAttempts: 3,
    });
  }

  /**
   * Real-time Patient Data Synchronization
   */
  async syncPatientData(patientId: string): Promise<EMRAPIResponse<User>> {
    try {
      const response = await this.client.getPatient(patientId);
      
      if (response.success && response.data) {
        // Update local state with EMR data
        console.log(`Patient data synced for ${patientId}`, response.data);
      }
      
      return response;
    } catch (error) {
      console.error('Error syncing patient data:', error);
      return {
        success: false,
        error: {
          code: 'SYNC_ERROR',
          message: error instanceof Error ? error.message : 'Unknown sync error',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Sync Appointments
   */
  async syncAppointments(patientId?: string): Promise<EMRAPIResponse<Appointment[]>> {
    try {
      const response = await this.client.getAppointments({ patientId });
      
      if (response.success && response.data) {
        console.log(`Synced ${response.data.length} appointments`);
      }
      
      return response;
    } catch (error) {
      console.error('Error syncing appointments:', error);
      return {
        success: false,
        error: {
          code: 'SYNC_ERROR',
          message: error instanceof Error ? error.message : 'Unknown sync error',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Sync Prescriptions
   */
  async syncPrescriptions(patientId: string): Promise<EMRAPIResponse<Prescription[]>> {
    try {
      const response = await this.client.getPrescriptions(patientId);
      
      if (response.success && response.data) {
        console.log(`Synced ${response.data.length} prescriptions`);
      }
      
      return response;
    } catch (error) {
      console.error('Error syncing prescriptions:', error);
      return {
        success: false,
        error: {
          code: 'SYNC_ERROR',
          message: error instanceof Error ? error.message : 'Unknown sync error',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Sync Lab Results
   */
  async syncLabResults(patientId: string): Promise<EMRAPIResponse<LabResult[]>> {
    try {
      const response = await this.client.getLabResults(patientId);
      
      if (response.success && response.data) {
        console.log(`Synced ${response.data.length} lab results`);
      }
      
      return response;
    } catch (error) {
      console.error('Error syncing lab results:', error);
      return {
        success: false,
        error: {
          code: 'SYNC_ERROR',
          message: error instanceof Error ? error.message : 'Unknown sync error',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Sync Vitals
   */
  async syncVitals(patientId: string): Promise<EMRAPIResponse<VitalsRecord[]>> {
    try {
      const response = await this.client.getVitals(patientId);
      
      if (response.success && response.data) {
        console.log(`Synced ${response.data.length} vital records`);
      }
      
      return response;
    } catch (error) {
      console.error('Error syncing vitals:', error);
      return {
        success: false,
        error: {
          code: 'SYNC_ERROR',
          message: error instanceof Error ? error.message : 'Unknown sync error',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Full Patient Data Sync
   */
  async syncAllPatientData(patientId: string): Promise<{
    patient: EMRAPIResponse<User>;
    appointments: EMRAPIResponse<Appointment[]>;
    prescriptions: EMRAPIResponse<Prescription[]>;
    labResults: EMRAPIResponse<LabResult[]>;
    vitals: EMRAPIResponse<VitalsRecord[]>;
  }> {
    if (this.isSyncing) {
      throw new Error('Sync already in progress');
    }

    this.isSyncing = true;

    try {
      const [patient, appointments, prescriptions, labResults, vitals] = await Promise.all([
        this.syncPatientData(patientId),
        this.syncAppointments(patientId),
        this.syncPrescriptions(patientId),
        this.syncLabResults(patientId),
        this.syncVitals(patientId),
      ]);

      return {
        patient,
        appointments,
        prescriptions,
        labResults,
        vitals,
      };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Start Automatic Sync
   */
  startAutoSync(patientId: string, intervalMs: number = 60000): void {
    if (this.syncInterval) {
      this.stopAutoSync();
    }

    this.syncInterval = setInterval(() => {
      if (!this.isSyncing) {
        this.syncAllPatientData(patientId).catch(error => {
          console.error('Auto-sync error:', error);
        });
      }
    }, intervalMs);

    console.log(`Auto-sync started for patient ${patientId} (interval: ${intervalMs}ms)`);
  }

  /**
   * Stop Automatic Sync
   */
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('Auto-sync stopped');
    }
  }

  /**
   * Push Local Changes to EMR
   */
  async pushAppointment(appointment: Omit<Appointment, 'id'>): Promise<EMRAPIResponse<Appointment>> {
    return this.client.createAppointment(appointment);
  }

  async pushVital(patientId: string, vital: Omit<VitalsRecord, 'date'>): Promise<EMRAPIResponse<VitalsRecord>> {
    return this.client.createVital(patientId, vital);
  }

  async pushPrescription(prescription: Omit<Prescription, 'id' | 'status'>): Promise<EMRAPIResponse<Prescription>> {
    return this.client.createPrescription(prescription);
  }

  async pushMessage(message: Omit<Message, 'id' | 'timestamp' | 'isRead'>): Promise<EMRAPIResponse<Message>> {
    return this.client.sendMessage(message);
  }

  /**
   * Health Check
   */
  async checkEMRHealth(): Promise<boolean> {
    try {
      const response = await this.client.healthCheck();
      return response.success && response.data?.status === 'ok';
    } catch {
      return false;
    }
  }

  /**
   * Get API Client (for direct access if needed)
   */
  getClient(): EMRAPIClient {
    return this.client;
  }
}

// Singleton instance
let emrIntegrationServiceInstance: EMRIntegrationService | null = null;

/**
 * Get or create EMR Integration Service instance
 */
export const getEMRIntegrationService = (): EMRIntegrationService => {
  if (!emrIntegrationServiceInstance) {
    emrIntegrationServiceInstance = new EMRIntegrationService();
  }
  return emrIntegrationServiceInstance;
};

export default EMRIntegrationService;

