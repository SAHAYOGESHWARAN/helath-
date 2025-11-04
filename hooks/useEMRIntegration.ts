/**
 * React Hook for EMR Integration
 * 
 * Provides easy access to EMR API functionality in React components.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getEMRIntegrationService, 
  EMRIntegrationService 
} from '../services/emrIntegrationService';
import { EMRAPIResponse } from '../services/emrApiClient';
import { 
  User, 
  Appointment, 
  Prescription, 
  LabResult, 
  VitalsRecord 
} from '../types';
import { useAuth } from './useAuth';

export interface EMRIntegrationState {
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  error: string | null;
}

export interface UseEMRIntegrationReturn {
  // State
  state: EMRIntegrationState;
  
  // Sync functions
  syncPatientData: (patientId?: string) => Promise<EMRAPIResponse<User>>;
  syncAppointments: (patientId?: string) => Promise<EMRAPIResponse<Appointment[]>>;
  syncPrescriptions: (patientId?: string) => Promise<EMRAPIResponse<Prescription[]>>;
  syncLabResults: (patientId?: string) => Promise<EMRAPIResponse<LabResult[]>>;
  syncVitals: (patientId?: string) => Promise<EMRAPIResponse<VitalsRecord[]>>;
  syncAll: (patientId?: string) => Promise<void>;
  
  // Auto-sync
  startAutoSync: (intervalMs?: number) => void;
  stopAutoSync: () => void;
  isAutoSyncActive: boolean;
  
  // Health check
  checkHealth: () => Promise<boolean>;
  
  // Integration service instance
  service: EMRIntegrationService | null;
}

/**
 * Hook for EMR Integration
 */
export const useEMRIntegration = (): UseEMRIntegrationReturn => {
  const { user } = useAuth();
  const [state, setState] = useState<EMRIntegrationState>({
    isConnected: false,
    isSyncing: false,
    lastSyncTime: null,
    error: null,
  });
  
  const [isAutoSyncActive, setIsAutoSyncActive] = useState(false);
  const serviceRef = useRef<EMRIntegrationService | null>(null);

  // Initialize service
  useEffect(() => {
    try {
      serviceRef.current = getEMRIntegrationService();
      
      // Check connection on mount
      serviceRef.current.checkEMRHealth().then(isHealthy => {
        setState(prev => ({ ...prev, isConnected: isHealthy }));
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to initialize EMR integration',
      }));
    }
  }, []);

  // Sync patient data
  const syncPatientData = useCallback(async (patientId?: string): Promise<EMRAPIResponse<User>> => {
    const id = patientId || user?.id;
    if (!id) {
      return {
        success: false,
        error: { code: 'NO_PATIENT_ID', message: 'Patient ID is required' },
        timestamp: new Date().toISOString(),
      };
    }

    setState(prev => ({ ...prev, isSyncing: true, error: null }));
    
    try {
      const response = await serviceRef.current?.syncPatientData(id);
      setState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        isConnected: response?.success ?? false,
        error: response?.error?.message || null,
      }));
      return response || {
        success: false,
        error: { code: 'SERVICE_ERROR', message: 'EMR service not available' },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSyncing: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      return {
        success: false,
        error: {
          code: 'SYNC_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }, [user?.id]);

  // Sync appointments
  const syncAppointments = useCallback(async (patientId?: string): Promise<EMRAPIResponse<Appointment[]>> => {
    const id = patientId || user?.id;
    if (!id) {
      return {
        success: false,
        error: { code: 'NO_PATIENT_ID', message: 'Patient ID is required' },
        timestamp: new Date().toISOString(),
      };
    }

    setState(prev => ({ ...prev, isSyncing: true, error: null }));
    
    try {
      const response = await serviceRef.current?.syncAppointments(id);
      setState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        isConnected: response?.success ?? false,
      }));
      return response || {
        success: false,
        error: { code: 'SERVICE_ERROR', message: 'EMR service not available' },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSyncing: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      return {
        success: false,
        error: {
          code: 'SYNC_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }, [user?.id]);

  // Sync prescriptions
  const syncPrescriptions = useCallback(async (patientId?: string): Promise<EMRAPIResponse<Prescription[]>> => {
    const id = patientId || user?.id;
    if (!id) {
      return {
        success: false,
        error: { code: 'NO_PATIENT_ID', message: 'Patient ID is required' },
        timestamp: new Date().toISOString(),
      };
    }

    setState(prev => ({ ...prev, isSyncing: true }));
    
    try {
      const response = await serviceRef.current?.syncPrescriptions(id);
      setState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
      }));
      return response || {
        success: false,
        error: { code: 'SERVICE_ERROR', message: 'EMR service not available' },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSyncing: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      return {
        success: false,
        error: {
          code: 'SYNC_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }, [user?.id]);

  // Sync lab results
  const syncLabResults = useCallback(async (patientId?: string): Promise<EMRAPIResponse<LabResult[]>> => {
    const id = patientId || user?.id;
    if (!id) {
      return {
        success: false,
        error: { code: 'NO_PATIENT_ID', message: 'Patient ID is required' },
        timestamp: new Date().toISOString(),
      };
    }

    setState(prev => ({ ...prev, isSyncing: true }));
    
    try {
      const response = await serviceRef.current?.syncLabResults(id);
      setState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
      }));
      return response || {
        success: false,
        error: { code: 'SERVICE_ERROR', message: 'EMR service not available' },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSyncing: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      return {
        success: false,
        error: {
          code: 'SYNC_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }, [user?.id]);

  // Sync vitals
  const syncVitals = useCallback(async (patientId?: string): Promise<EMRAPIResponse<VitalsRecord[]>> => {
    const id = patientId || user?.id;
    if (!id) {
      return {
        success: false,
        error: { code: 'NO_PATIENT_ID', message: 'Patient ID is required' },
        timestamp: new Date().toISOString(),
      };
    }

    setState(prev => ({ ...prev, isSyncing: true }));
    
    try {
      const response = await serviceRef.current?.syncVitals(id);
      setState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
      }));
      return response || {
        success: false,
        error: { code: 'SERVICE_ERROR', message: 'EMR service not available' },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSyncing: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      return {
        success: false,
        error: {
          code: 'SYNC_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }, [user?.id]);

  // Sync all data
  const syncAll = useCallback(async (patientId?: string): Promise<void> => {
    const id = patientId || user?.id;
    if (!id) return;

    setState(prev => ({ ...prev, isSyncing: true, error: null }));
    
    try {
      await serviceRef.current?.syncAllPatientData(id);
      setState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSyncing: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, [user?.id]);

  // Auto-sync
  const startAutoSync = useCallback((intervalMs: number = 60000) => {
    const id = user?.id;
    if (!id) return;

    serviceRef.current?.startAutoSync(id, intervalMs);
    setIsAutoSyncActive(true);
  }, [user?.id]);

  const stopAutoSync = useCallback(() => {
    serviceRef.current?.stopAutoSync();
    setIsAutoSyncActive(false);
  }, []);

  // Health check
  const checkHealth = useCallback(async (): Promise<boolean> => {
    try {
      const isHealthy = await serviceRef.current?.checkEMRHealth();
      setState(prev => ({ ...prev, isConnected: isHealthy ?? false }));
      return isHealthy ?? false;
    } catch {
      setState(prev => ({ ...prev, isConnected: false }));
      return false;
    }
  }, []);

  return {
    state,
    syncPatientData,
    syncAppointments,
    syncPrescriptions,
    syncLabResults,
    syncVitals,
    syncAll,
    startAutoSync,
    stopAutoSync,
    isAutoSyncActive,
    checkHealth,
    service: serviceRef.current,
  };
};

export default useEMRIntegration;

