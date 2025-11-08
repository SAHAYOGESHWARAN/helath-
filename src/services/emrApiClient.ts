/**
 * EMR API Client
 * 
 * Enterprise-grade API client for connecting to the EMR system.
 * Provides secure RESTful endpoints with API key authentication,
 * real-time data synchronization, and FHIR-compatible data structures.
 */

import { 
  User, 
  Appointment, 
  Prescription, 
  LabResult, 
  VitalsRecord,
  ProgressNote,
  LabOrder,
  Message,
  Claim,
  BillingInvoice
} from '@/types';

// Web API types for browser compatibility
type RequestInit = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  signal?: AbortSignal;
};

type HeadersInit = Record<string, string>;

// API Configuration Interface
export interface EMRAPIConfig {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
  retryAttempts?: number;
  enableCaching?: boolean;
}

// API Error Response Structure
export interface EMRAPIError { code?: string; message: string; }

// API Response Wrapper
export interface EMRAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: EMRAPIError;
  timestamp?: string;
  requestId?: string;
}

/**
 * FHIR-Compatible Response Structure
 */
export interface FHIRBundle {
  resourceType: string;
  type: string;
  total: number;
  entry: Array<{
    resource: Record<string, unknown>;
    fullUrl?: string;
  }>;
}

/**
 * EMR API Client Class
 * Handles all communication with the EMR system
 */
export class EMRAPIClient {
  // Static method to get an instance
  static getInstance(config?: EMRAPIConfig): EMRAPIClient {
    return new EMRAPIClient(config || { baseUrl: '', apiKey: '' });
  }
  private config: Required<EMRAPIConfig>;
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(config: EMRAPIConfig) {
    this.config = {
      baseUrl: config.baseUrl || process.env.VITE_EMR_API_URL || 'https://emr-api.example.com/api/v1',
      apiKey: config.apiKey || process.env.VITE_EMR_API_KEY || '',
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
      enableCaching: config.enableCaching ?? true,
    };

    if (!this.config.apiKey) {
      console.warn('EMR API Key not configured. Some features may not work.');
    }
  }

  /**
   * Base HTTP request method with authentication and error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<EMRAPIResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'x-api-key': this.config.apiKey,
      'X-Request-ID': `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...options.headers,
    };

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < this.config.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();
        
        return {
          success: true,
          data: data as T,
          timestamp: new Date().toISOString(),
          requestId: headers['X-Request-ID'] as string,
        };
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx)
        if (error instanceof Error && 'status' in error) {
          const status = (error as { status: number }).status;
          if (status >= 400 && status < 500) {
            break;
          }
        }

        // Exponential backoff for retries
        if (attempt < this.config.retryAttempts - 1) {
          await new Promise(resolve => 
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }
    }

    clearTimeout(timeoutId);

    return {
      success: false,
      error: {
        code: 'REQUEST_FAILED',
        message: lastError?.message || 'Unknown error occurred',
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Cache management
   */
  private getCached<T>(key: string): T | null {
    if (!this.config.enableCaching) return null;
    
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    
    this.cache.delete(key);
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    if (this.config.enableCaching) {
      this.cache.set(key, { data, timestamp: Date.now() });
    }
  }

  /**
   * Patient Records Endpoints
   */
  async getPatient(patientId: string): Promise<EMRAPIResponse<User>> {
    const cacheKey = `patient_${patientId}`;
    const cached = this.getCached<User>(cacheKey);
    if (cached) {
      return { success: true, data: cached, timestamp: new Date().toISOString() };
    }

    const response = await this.request<User>(`/patients/${patientId}`);
    if (response.success && response.data) {
      this.setCache(cacheKey, response.data);
    }
    return response;
  }

  async getPatientRecords(patientId: string): Promise<EMRAPIResponse<User>> {
    return this.getPatient(patientId);
  }

  async updatePatient(patientId: string, updates: Partial<User>): Promise<EMRAPIResponse<User>> {
    const response = await this.request<User>(`/patients/${patientId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    
    // Invalidate cache
    this.cache.delete(`patient_${patientId}`);
    return response;
  }

  async searchPatients(query: {
    name?: string;
    email?: string;
    dob?: string;
    limit?: number;
    offset?: number;
  }): Promise<EMRAPIResponse<User[]>> {
    const params = new URLSearchParams();
    if (query.name) params.append('name', query.name);
    if (query.email) params.append('email', query.email);
    if (query.dob) params.append('dob', query.dob);
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.offset) params.append('offset', query.offset.toString());

    return this.request<User[]>(`/patients?${params.toString()}`);
  }

  /**
   * Appointments Endpoints
   */
  async getAppointments(params?: {
    patientId?: string;
    providerId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<EMRAPIResponse<Appointment[]>> {
    const queryParams = new URLSearchParams();
    if (params?.patientId) queryParams.append('patientId', params.patientId);
    if (params?.providerId) queryParams.append('providerId', params.providerId);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.status) queryParams.append('status', params.status);

    const endpoint = queryParams.toString() 
      ? `/appointments?${queryParams.toString()}`
      : '/appointments';

    return this.request<Appointment[]>(endpoint);
  }

  async getAppointment(appointmentId: string): Promise<EMRAPIResponse<Appointment>> {
    return this.request<Appointment>(`/appointments/${appointmentId}`);
  }

  async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<EMRAPIResponse<Appointment>> {
    return this.request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
  }

  async updateAppointment(
    appointmentId: string,
    updates: Partial<Appointment>
  ): Promise<EMRAPIResponse<Appointment>> {
    return this.request<Appointment>(`/appointments/${appointmentId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async cancelAppointment(appointmentId: string): Promise<EMRAPIResponse<Appointment>> {
    return this.updateAppointment(appointmentId, { status: 'Cancelled' });
  }

  /**
   * Prescriptions Endpoints
   */
  async getPrescriptions(patientId?: string): Promise<EMRAPIResponse<Prescription[]>> {
    const endpoint = patientId 
      ? `/prescriptions?patientId=${patientId}`
      : '/prescriptions';
    return this.request<Prescription[]>(endpoint);
  }

  async getPrescription(prescriptionId: string): Promise<EMRAPIResponse<Prescription>> {
    return this.request<Prescription>(`/prescriptions/${prescriptionId}`);
  }

  async createPrescription(prescription: Omit<Prescription, 'id' | 'status'>): Promise<EMRAPIResponse<Prescription>> {
    return this.request<Prescription>('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescription),
    });
  }

  async updatePrescription(
    prescriptionId: string,
    updates: Partial<Prescription>
  ): Promise<EMRAPIResponse<Prescription>> {
    return this.request<Prescription>(`/prescriptions/${prescriptionId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Lab Results Endpoints
   */
  async getLabResults(patientId?: string): Promise<EMRAPIResponse<LabResult[]>> {
    const endpoint = patientId 
      ? `/lab-results?patientId=${patientId}`
      : '/lab-results';
    return this.request<LabResult[]>(endpoint);
  }

  async getLabResult(labResultId: string): Promise<EMRAPIResponse<LabResult>> {
    return this.request<LabResult>(`/lab-results/${labResultId}`);
  }

  async createLabResult(labResult: Omit<LabResult, 'id'>): Promise<EMRAPIResponse<LabResult>> {
    return this.request<LabResult>('/lab-results', {
      method: 'POST',
      body: JSON.stringify(labResult),
    });
  }

  async getLabOrders(patientId?: string): Promise<EMRAPIResponse<LabOrder[]>> {
    const endpoint = patientId 
      ? `/lab-orders?patientId=${patientId}`
      : '/lab-orders';
    return this.request<LabOrder[]>(endpoint);
  }

  /**
   * Vitals Records Endpoints
   */
  async getVitals(patientId: string, params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<EMRAPIResponse<VitalsRecord[]>> {
    const queryParams = new URLSearchParams({ patientId });
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return this.request<VitalsRecord[]>(`/vitals?${queryParams.toString()}`);
  }

  async createVital(patientId: string, vital: Omit<VitalsRecord, 'date'>): Promise<EMRAPIResponse<VitalsRecord>> {
    const vitalWithDate = { ...vital, date: new Date().toISOString().split('T')[0] };
    return this.request<VitalsRecord>(`/patients/${patientId}/vitals`, {
      method: 'POST',
      body: JSON.stringify(vitalWithDate),
    });
  }

  /**
   * Progress Notes Endpoints
   */
  async getProgressNotes(patientId?: string): Promise<EMRAPIResponse<ProgressNote[]>> {
    const endpoint = patientId 
      ? `/progress-notes?patientId=${patientId}`
      : '/progress-notes';
    return this.request<ProgressNote[]>(endpoint);
  }

  async createProgressNote(note: Omit<ProgressNote, 'id'>): Promise<EMRAPIResponse<ProgressNote>> {
    return this.request<ProgressNote>('/progress-notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
  }

  /**
   * Messages Endpoints
   */
  async getMessages(patientId: string, providerId?: string): Promise<EMRAPIResponse<Message[]>> {
    const queryParams = new URLSearchParams({ patientId });
    if (providerId) queryParams.append('providerId', providerId);
    
    return this.request<Message[]>(`/messages?${queryParams.toString()}`);
  }

  async sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'isRead'>): Promise<EMRAPIResponse<Message>> {
    return this.request<Message>('/messages', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  /**
   * Claims and Billing Endpoints
   */
  async getClaims(patientId?: string): Promise<EMRAPIResponse<Claim[]>> {
    const endpoint = patientId 
      ? `/claims?patientId=${patientId}`
      : '/claims';
    return this.request<Claim[]>(endpoint);
  }

  async getInvoices(patientId?: string): Promise<EMRAPIResponse<BillingInvoice[]>> {
    const endpoint = patientId 
      ? `/invoices?patientId=${patientId}`
      : '/invoices';
    return this.request<BillingInvoice[]>(endpoint);
  }

  /**
   * FHIR-Compatible Endpoints
   */
  async getFHIRPatient(patientId: string): Promise<EMRAPIResponse<FHIRBundle>> {
    return this.request<FHIRBundle>(`/fhir/Patient/${patientId}`);
  }

  async getFHIRAppointments(patientId?: string): Promise<EMRAPIResponse<FHIRBundle>> {
    const endpoint = patientId 
      ? `/fhir/Appointment?patient=${patientId}`
      : '/fhir/Appointment';
    return this.request<FHIRBundle>(endpoint);
  }

  async getFHIRMedications(patientId?: string): Promise<EMRAPIResponse<FHIRBundle>> {
    const endpoint = patientId 
      ? `/fhir/MedicationStatement?patient=${patientId}`
      : '/fhir/MedicationStatement';
    return this.request<FHIRBundle>(endpoint);
  }

  async getFHIRLabResults(patientId?: string): Promise<EMRAPIResponse<FHIRBundle>> {
    const endpoint = patientId 
      ? `/fhir/Observation?patient=${patientId}&category=laboratory`
      : '/fhir/Observation?category=laboratory';
    return this.request<FHIRBundle>(endpoint);
  }

  /**
   * Health Check
   */
  async healthCheck(): Promise<EMRAPIResponse<{ status: string; version: string }>> {
    return this.request<{ status: string; version: string }>('/health');
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear specific cache entry
   */
  clearCacheEntry(key: string): void {
    this.cache.delete(key);
  }
}
