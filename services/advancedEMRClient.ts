/**
 * Advanced EMR API Client - Enterprise-Grade Integration
 * Features: Real-time sync, WebSocket, batch operations, caching, retry logic, FHIR, analytics
 */

import type { APIResponse, EMRConfig } from '../src/types';

// Types for advanced features
export interface RealTimeEvent {
  eventId: string;
  type: 'PATIENT_UPDATE' | 'APPOINTMENT_CHANGE' | 'PRESCRIPTION_UPDATE' | 'LAB_RESULT' | 'ALERT' | 'SYNC_COMPLETE';
  resourceType: string;
  resourceId: string;
  data: any;
  timestamp: string;
  source: 'EMR' | 'LOCAL' | 'EXTERNAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface BatchOperation {
  id: string;
  operations: Array<{
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    endpoint: string;
    data?: any;
  }>;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'PARTIAL' | 'FAILED';
  results: any[];
  errors: Array<{ operationIndex: number; error: string }>;
  createdAt: string;
  completedAt?: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

export interface ConflictResolution {
  resourceId: string;
  localVersion: any;
  remoteVersion: any;
  strategy: 'LOCAL' | 'REMOTE' | 'MERGE' | 'MANUAL';
  resolvedAt?: string;
  resolvedVersion?: any;
}

export interface AdvancedQueryOptions {
  search?: string;
  filter?: Record<string, any>;
  sort?: { field: string; direction: 'ASC' | 'DESC' }[];
  pagination?: { page: number; limit: number };
  includeArchived?: boolean;
  includeDeleted?: boolean;
  expandRelations?: string[];
  aggregation?: {
    type: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'GROUP_BY';
    field?: string;
    groupBy?: string;
  };
  timeRange?: { startDate: string; endDate: string };
}

export interface AnalyticsData {
  metric: string;
  value: number;
  timestamp: string;
  dimension?: string;
  trend?: 'UP' | 'DOWN' | 'STABLE';
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes: Record<string, { oldValue: any; newValue: any }>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'SUCCESS' | 'FAILED' | 'UNAUTHORIZED';
}

export class AdvancedEMRClient {
  private baseUrl: string;
  private apiKey: string;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private cacheTimeout: ReturnType<typeof setInterval> | null = null;
  private ws: WebSocket | null = null;
  private wsReconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private reconnectDelay: number = 5000;
  private eventListeners: Map<string, Function[]> = new Map();
  private pendingBatches: Map<string, BatchOperation> = new Map();
  private conflicts: Map<string, ConflictResolution> = new Map();
  private requestQueue: Array<{ fn: Function; timestamp: number }> = [];
  private rateLimitState = { requests: 0, resetTime: 0 };
  private syncState = { lastSync: 0, isSyncing: false, pendingChanges: 0 };
  private config: {
    cacheTTL: number;
    retryAttempts: number;
    retryDelay: number;
    batchSize: number;
    requestTimeout: number;
    wsUrl?: string;
  };

  constructor(baseUrl: string, apiKey: string, config?: Partial<typeof this.config>) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
    this.config = {
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      retryAttempts: 3,
      retryDelay: 1000,
      batchSize: 20,
      requestTimeout: 30000,
      ...config,
    };

    this.initializeCacheCleanup();
  }

  /**
   * === CORE API OPERATIONS ===
   */

  public async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    options?: { retries?: number; bypassCache?: boolean; priority?: number }
  ): Promise<APIResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = `${method}:${endpoint}`;
    const retries = options?.retries ?? this.config.retryAttempts;
    const bypassCache = options?.bypassCache ?? false;

    // Check cache for GET requests
    if (method === 'GET' && !bypassCache) {
      const cached = this.getCachedData<T>(cacheKey);
      if (cached) {
        return { success: true, data: cached, timestamp: new Date().toISOString() };
      }
    }

    let lastError: any;
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
            'X-Request-ID': this.generateRequestId(),
            'X-Retry-Attempt': attempt.toString(),
          },
          body: data ? JSON.stringify(data) : undefined,
          signal: AbortSignal.timeout(this.config.requestTimeout),
        });

        const responseData = await response.json();

        if (!response.ok) {
          lastError = responseData.error || { code: response.status, message: response.statusText };
          
          if (attempt < retries - 1) {
            await this.delay(this.config.retryDelay * Math.pow(2, attempt));
            continue;
          }
        } else {
          // Cache successful GET requests
          if (method === 'GET') {
            this.setCachedData(cacheKey, responseData.data, this.config.cacheTTL);
          }

          return {
            success: true,
            data: responseData.data || responseData,
            timestamp: new Date().toISOString(),
            requestId: response.headers.get('X-Request-ID') || this.generateRequestId(),
          };
        }
      } catch (error: any) {
        lastError = error;
        if (attempt < retries - 1) {
          await this.delay(this.config.retryDelay * Math.pow(2, attempt));
        }
      }
    }

    return {
      success: false,
      error: {
        code: 'REQUEST_FAILED',
        message: lastError?.message || 'Request failed after all retries',
        details: lastError,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * === PATIENT OPERATIONS ===
   */

  async getPatient(patientId: string): Promise<APIResponse<any>> {
    return this.request('GET', `/patients/${patientId}`);
  }

  async getPatients(options?: AdvancedQueryOptions): Promise<APIResponse<any[]>> {
    const params = this.buildQueryParams(options);
    return this.request('GET', `/patients?${params}`);
  }

  async searchPatients(query: string): Promise<APIResponse<any[]>> {
    return this.request('GET', `/patients/search?q=${encodeURIComponent(query)}`);
  }

  async createPatient(patientData: any): Promise<APIResponse<any>> {
    return this.request('POST', '/patients', patientData);
  }

  async updatePatient(patientId: string, updates: any): Promise<APIResponse<any>> {
    return this.request('PATCH', `/patients/${patientId}`, updates);
  }

  async deletePatient(patientId: string): Promise<APIResponse<void>> {
    return this.request('DELETE', `/patients/${patientId}`);
  }

  async getPatientTimeline(patientId: string): Promise<APIResponse<any[]>> {
    return this.request('GET', `/patients/${patientId}/timeline`);
  }

  async getPatientSummary(patientId: string): Promise<APIResponse<any>> {
    return this.request('GET', `/patients/${patientId}/summary`);
  }

  /**
   * === APPOINTMENT OPERATIONS ===
   */

  async getAppointments(options?: AdvancedQueryOptions): Promise<APIResponse<any[]>> {
    const params = this.buildQueryParams(options);
    return this.request('GET', `/appointments?${params}`);
  }

  async getAppointment(appointmentId: string): Promise<APIResponse<any>> {
    return this.request('GET', `/appointments/${appointmentId}`);
  }

  async createAppointment(appointmentData: any): Promise<APIResponse<any>> {
    return this.request('POST', '/appointments', appointmentData);
  }

  async updateAppointment(appointmentId: string, updates: any): Promise<APIResponse<any>> {
    return this.request('PATCH', `/appointments/${appointmentId}`, updates);
  }

  async cancelAppointment(appointmentId: string): Promise<APIResponse<void>> {
    return this.request('PATCH', `/appointments/${appointmentId}`, { status: 'CANCELLED' });
  }

  async rescheduleAppointment(appointmentId: string, newTime: any): Promise<APIResponse<any>> {
    return this.request('PATCH', `/appointments/${appointmentId}/reschedule`, newTime);
  }

  async getAvailableSlots(providerId: string, date: string): Promise<APIResponse<any[]>> {
    return this.request('GET', `/providers/${providerId}/available-slots?date=${date}`);
  }

  /**
   * === PRESCRIPTION OPERATIONS ===
   */

  async getPrescriptions(patientId: string): Promise<APIResponse<any[]>> {
    return this.request('GET', `/prescriptions?patientId=${patientId}`);
  }

  async getPrescription(prescriptionId: string): Promise<APIResponse<any>> {
    return this.request('GET', `/prescriptions/${prescriptionId}`);
  }

  async createPrescription(prescriptionData: any): Promise<APIResponse<any>> {
    return this.request('POST', '/prescriptions', prescriptionData);
  }

  async updatePrescription(prescriptionId: string, updates: any): Promise<APIResponse<any>> {
    return this.request('PATCH', `/prescriptions/${prescriptionId}`, updates);
  }

  async refillPrescription(prescriptionId: string): Promise<APIResponse<any>> {
    return this.request('POST', `/prescriptions/${prescriptionId}/refill`, {});
  }

  async checkDrugInteractions(medications: string[]): Promise<APIResponse<any[]>> {
    return this.request('POST', '/prescriptions/check-interactions', { medications });
  }

  /**
   * === LAB & VITALS OPERATIONS ===
   */

  async getLabResults(patientId: string): Promise<APIResponse<any[]>> {
    return this.request('GET', `/lab-results?patientId=${patientId}`);
  }

  async getLabResult(resultId: string): Promise<APIResponse<any>> {
    return this.request('GET', `/lab-results/${resultId}`);
  }

  async createLabResult(labData: any): Promise<APIResponse<any>> {
    return this.request('POST', '/lab-results', labData);
  }

  async getVitals(patientId: string, options?: AdvancedQueryOptions): Promise<APIResponse<any[]>> {
    const params = this.buildQueryParams(options);
    return this.request('GET', `/vitals?patientId=${patientId}&${params}`);
  }

  async recordVital(patientId: string, vitalData: any): Promise<APIResponse<any>> {
    return this.request('POST', `/patients/${patientId}/vitals`, vitalData);
  }

  async getVitalTrends(patientId: string, vitalType: string): Promise<APIResponse<any[]>> {
    return this.request('GET', `/patients/${patientId}/vitals/${vitalType}/trends`);
  }

  /**
   * === CLINICAL NOTES ===
   */

  async getClinicalNotes(patientId: string): Promise<APIResponse<any[]>> {
    return this.request('GET', `/patients/${patientId}/clinical-notes`);
  }

  async createClinicalNote(patientId: string, noteData: any): Promise<APIResponse<any>> {
    return this.request('POST', `/patients/${patientId}/clinical-notes`, noteData);
  }

  async updateClinicalNote(noteId: string, updates: any): Promise<APIResponse<any>> {
    return this.request('PATCH', `/clinical-notes/${noteId}`, updates);
  }

  /**
   * === DOCUMENT MANAGEMENT ===
   */

  async uploadDocument(patientId: string, file: File, metadata?: any): Promise<APIResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) formData.append('metadata', JSON.stringify(metadata));

    const response = await fetch(`${this.baseUrl}/patients/${patientId}/documents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'X-Request-ID': this.generateRequestId(),
      },
      body: formData,
    });

    const data = await response.json();
    return { success: response.ok, data, timestamp: new Date().toISOString() };
  }

  async getDocuments(patientId: string): Promise<APIResponse<any[]>> {
    return this.request('GET', `/patients/${patientId}/documents`);
  }

  async deleteDocument(documentId: string): Promise<APIResponse<void>> {
    return this.request('DELETE', `/documents/${documentId}`);
  }

  /**
   * === BATCH OPERATIONS ===
   */

  async createBatchOperation(operations: BatchOperation['operations']): Promise<APIResponse<string>> {
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const batch: BatchOperation = {
      id: batchId,
      operations,
      status: 'PENDING',
      results: [],
      errors: [],
      createdAt: new Date().toISOString(),
    };

    this.pendingBatches.set(batchId, batch);
    
    // Process batch
    await this.processBatch(batch);
    
    return { success: true, data: batchId, timestamp: new Date().toISOString() };
  }

  private async processBatch(batch: BatchOperation): Promise<void> {
    batch.status = 'PROCESSING';
    const chunks = this.chunkArray(batch.operations, this.config.batchSize);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const promises = chunk.map(async (op, index) => {
        try {
          const response = await this.request(
            op.method as any,
            op.endpoint,
            op.data
          );
          return { success: true, data: response, operationIndex: i * this.config.batchSize + index };
        } catch (error: any) {
          return { success: false, error, operationIndex: i * this.config.batchSize + index };
        }
      });

      const results = await Promise.all(promises);
      results.forEach((result) => {
        if (result.success) {
          batch.results.push(result.data);
        } else {
          batch.errors.push({ operationIndex: result.operationIndex, error: result.error?.message });
        }
      });
    }

    batch.status = batch.errors.length === 0 ? 'SUCCESS' : 'PARTIAL';
    batch.completedAt = new Date().toISOString();
  }

  async getBatchStatus(batchId: string): Promise<BatchOperation | null> {
    return this.pendingBatches.get(batchId) || null;
  }

  /**
   * === REAL-TIME WEBSOCKET ===
   */

  connectWebSocket(wsUrl?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = wsUrl || this.config.wsUrl || `${this.baseUrl.replace('http', 'ws')}/ws?token=${this.apiKey}`;
      
      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log('EMR WebSocket connected');
          this.wsReconnectAttempts = 0;
          this.emit('ws-connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          this.handleRealTimeEvent(message);
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.emit('ws-error', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.emit('ws-disconnected');
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private attemptReconnect(): void {
    if (this.wsReconnectAttempts < this.maxReconnectAttempts) {
      this.wsReconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(1.5, this.wsReconnectAttempts - 1);
      setTimeout(() => this.connectWebSocket(), delay);
    }
  }

  private handleRealTimeEvent(event: RealTimeEvent): void {
    this.emit('event', event);
    this.emit(`event:${event.type}`, event);
    this.handleConflictDetection(event);
  }

  subscribeToEvents(eventType: string, callback: (event: RealTimeEvent) => void): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) listeners.splice(index, 1);
      }
    };
  }

  private emit(eventType: string, data?: any): void {
    const listeners = this.eventListeners.get(eventType) || [];
    listeners.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${eventType}:`, error);
      }
    });
  }

  disconnectWebSocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * === CONFLICT RESOLUTION ===
   */

  private handleConflictDetection(event: RealTimeEvent): void {
    if (event.source === 'EXTERNAL' && event.type.endsWith('UPDATE')) {
      // Check for local changes
      const cacheKey = `${event.resourceType}:${event.resourceId}`;
      if (this.cache.has(cacheKey)) {
        const conflict: ConflictResolution = {
          resourceId: event.resourceId,
          localVersion: this.cache.get(cacheKey)?.data,
          remoteVersion: event.data,
          strategy: 'MERGE',
        };
        this.conflicts.set(event.resourceId, conflict);
        this.emit('conflict-detected', conflict);
      }
    }
  }

  async resolveConflict(
    resourceId: string,
    strategy: ConflictResolution['strategy'],
    customResolution?: any
  ): Promise<APIResponse<any>> {
    const conflict = this.conflicts.get(resourceId);
    if (!conflict) {
      return { success: false, error: { code: 'NO_CONFLICT', message: 'No conflict found' }, timestamp: new Date().toISOString() };
    }

    let resolvedVersion;
    switch (strategy) {
      case 'LOCAL':
        resolvedVersion = conflict.localVersion;
        break;
      case 'REMOTE':
        resolvedVersion = conflict.remoteVersion;
        break;
      case 'MERGE':
        resolvedVersion = { ...conflict.remoteVersion, ...conflict.localVersion };
        break;
      case 'MANUAL':
        resolvedVersion = customResolution;
        break;
    }

    conflict.strategy = strategy;
    conflict.resolvedAt = new Date().toISOString();
    conflict.resolvedVersion = resolvedVersion;

    // Update EMR with resolved version
    const result = await this.request('PATCH', `/conflicts/${resourceId}/resolve`, {
      strategy,
      resolvedVersion,
    });

    if (result.success) {
      this.conflicts.delete(resourceId);
    }

    return result;
  }

  /**
   * === ADVANCED SEARCH & FILTERING ===
   */

  async advancedSearch(resourceType: string, options: AdvancedQueryOptions): Promise<APIResponse<any[]>> {
    const params = new URLSearchParams();
    
    if (options.search) params.append('search', options.search);
    if (options.filter) params.append('filter', JSON.stringify(options.filter));
    if (options.sort) params.append('sort', JSON.stringify(options.sort));
    if (options.pagination) params.append('page', options.pagination.page.toString());
    if (options.pagination) params.append('limit', options.pagination.limit.toString());
    if (options.timeRange) params.append('timeRange', JSON.stringify(options.timeRange));

    return this.request('GET', `/advanced-search/${resourceType}?${params.toString()}`);
  }

  /**
   * === ANALYTICS & REPORTING ===
   */

  async getAnalytics(
    resourceType: string,
    metric: string,
    options?: { startDate?: string; endDate?: string; groupBy?: string }
  ): Promise<APIResponse<AnalyticsData[]>> {
    const params = new URLSearchParams();
    params.append('metric', metric);
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);
    if (options?.groupBy) params.append('groupBy', options.groupBy);

    return this.request('GET', `/analytics/${resourceType}?${params.toString()}`);
  }

  async generateReport(
    reportType: string,
    params: Record<string, any>
  ): Promise<APIResponse<any>> {
    return this.request('POST', `/reports/${reportType}/generate`, params);
  }

  async exportData(
    resourceType: string,
    format: 'CSV' | 'JSON' | 'XML' | 'PDF',
    options?: AdvancedQueryOptions
  ): Promise<APIResponse<any>> {
    const queryParams = this.buildQueryParams(options);
    return this.request('GET', `/${resourceType}/export?format=${format}&${queryParams}`, undefined, { bypassCache: true });
  }

  /**
   * === AUDIT & COMPLIANCE ===
   */

  async getAuditLogs(options?: {
    resourceType?: string;
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<APIResponse<AuditLog[]>> {
    const params = new URLSearchParams();
    if (options?.resourceType) params.append('resourceType', options.resourceType);
    if (options?.userId) params.append('userId', options.userId);
    if (options?.action) params.append('action', options.action);
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);
    if (options?.limit) params.append('limit', options.limit.toString());

    return this.request('GET', `/audit-logs?${params.toString()}`);
  }

  async checkCompliance(resourceId: string, complianceType: string): Promise<APIResponse<any>> {
    return this.request('GET', `/compliance/${resourceId}?type=${complianceType}`);
  }

  /**
   * === SYNCHRONIZATION ===
   */

  async sync(patientId: string): Promise<APIResponse<any>> {
    if (this.syncState.isSyncing) {
      return { success: false, error: { code: 'SYNC_IN_PROGRESS', message: 'Sync already in progress' }, timestamp: new Date().toISOString() };
    }

    this.syncState.isSyncing = true;
    try {
      const response = await this.request('POST', `/patients/${patientId}/sync`, {});
      if (response.success) {
        this.syncState.lastSync = Date.now();
      }
      return response;
    } finally {
      this.syncState.isSyncing = false;
    }
  }

  /**
   * === CACHING ===
   */

  private getCachedData<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    entry.hits++;
    return entry.data;
  }

  private setCachedData<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0,
    });
  }

  clearCache(pattern?: string): void {
    if (pattern) {
      const regex = new RegExp(pattern);
      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  private initializeCacheCleanup(): void {
    this.cacheTimeout = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          this.cache.delete(key);
        }
      }
    }, 60000); // Clean every minute
  }

  /**
   * === UTILITY METHODS ===
   */

  private buildQueryParams(options?: AdvancedQueryOptions): string {
    const params = new URLSearchParams();
    
    if (!options) return '';
    if (options.search) params.append('search', options.search);
    if (options.filter) params.append('filter', JSON.stringify(options.filter));
    if (options.sort) params.append('sort', JSON.stringify(options.sort));
    if (options.pagination?.page) params.append('page', options.pagination.page.toString());
    if (options.pagination?.limit) params.append('limit', options.pagination.limit.toString());
    if (options.includeArchived) params.append('includeArchived', 'true');
    if (options.includeDeleted) params.append('includeDeleted', 'true');
    if (options.expandRelations) params.append('expand', options.expandRelations.join(','));
    if (options.timeRange) params.append('timeRange', JSON.stringify(options.timeRange));

    return params.toString();
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * === HEALTH CHECK ===
   */

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * === CLEANUP ===
   */

  destroy(): void {
    this.disconnectWebSocket();
    if (this.cacheTimeout) {
      clearInterval(this.cacheTimeout);
    }
    this.cache.clear();
    this.eventListeners.clear();
    this.conflicts.clear();
  }
}

// Singleton instance
let clientInstance: AdvancedEMRClient | null = null;

export function getAdvancedEMRClient(baseUrl?: string, apiKey?: string, config?: any): AdvancedEMRClient {
  if (!clientInstance) {
    const url = baseUrl || 'https://api.emr.local/api/v1';
    const key = apiKey || '';
    clientInstance = new AdvancedEMRClient(url, key, config);
  }
  return clientInstance;
}

export default AdvancedEMRClient;
