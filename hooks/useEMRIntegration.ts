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
  startAutoSync: (intervalMs?: number) => () => void; // returns stop fn
  stopAutoSync: () => void;
  isAutoSyncActive: boolean;
  
  // Health check
  checkHealth: () => Promise<boolean>;
  
  // Integration service instance
  service: EMRIntegrationService | null;

  // Observability (simple listener API)
  addProgressListener: (l: (progress: { type: string; message?: string }) => void) => void;
  removeProgressListener: (l: (progress: { type: string; message?: string }) => void) => void;
}

/**
 * Hook for EMR Integration (improved)
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
  const mountedRef = useRef(true);
  const intervalRef = useRef<number | null>(null);
  const ongoingRef = useRef<Map<string, Promise<any>>>(new Map());
  const controllersRef = useRef<Map<string, AbortController>>(new Map());
  const listenersRef = useRef<Set<(p: { type: string; message?: string }) => void>>(new Set());

  useEffect(() => {
    mountedRef.current = true;
    try {
      serviceRef.current = getEMRIntegrationService();
      // initial health check
      serviceRef.current.checkEMRHealth?.().then(isHealthy => {
        if (!mountedRef.current) return;
        setState(prev => ({ ...prev, isConnected: !!isHealthy }));
      }).catch(err => {
        if (!mountedRef.current) return;
        setState(prev => ({ ...prev, error: err instanceof Error ? err.message : String(err) }));
      });
    } catch (error) {
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to initialize EMR integration',
        }));
      }
    }

    return () => {
      mountedRef.current = false;
      // stop any auto-sync interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // abort controllers (best-effort)
      controllersRef.current.forEach(ctrl => {
        try { ctrl.abort(); } catch { /* ignore */ }
      });
      controllersRef.current.clear();
      ongoingRef.current.clear();
      listenersRef.current.clear();
    };
  }, []);

  // utility: notify listeners
  const notify = useCallback((p: { type: string; message?: string }) => {
    listenersRef.current.forEach(l => {
      try { l(p); } catch { /* swallow listener errors */ }
    });
  }, []);

  // helper: centralized retry wrapper with exponential backoff
  async function runWithRetry<T>(fn: () => Promise<T>, retries = 2, baseDelay = 200): Promise<T> {
    let attempt = 0;
    while (true) {
      try {
        return await fn();
      } catch (err) {
        attempt++;
        if (attempt > retries) throw err;
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }

  // centralized sync runner to avoid duplication and concurrent identical requests
  async function doSync<T>(key: string, runner: (signal?: AbortSignal) => Promise<EMRAPIResponse<T>>): Promise<EMRAPIResponse<T>> {
    // dedupe concurrent same-key requests
    const existing = ongoingRef.current.get(key);
    if (existing) return existing as Promise<EMRAPIResponse<T>>;

    const controller = new AbortController();
    controllersRef.current.set(key, controller);

    const p = (async () => {
      if (!mountedRef.current) {
        throw new Error('unmounted');
      }
      // mark syncing state
      if (mountedRef.current) {
        setState(prev => ({ ...prev, isSyncing: true, error: null }));
        notify({ type: 'start', message: key });
      }
      try {
        const result = await runWithRetry(() => runner(controller.signal));
        if (mountedRef.current) {
          setState(prev => ({
            ...prev,
            isSyncing: false,
            lastSyncTime: new Date(),
            isConnected: result?.success ?? prev.isConnected,
            error: result?.error?.message || null,
          }));
          notify({ type: 'success', message: key });
        }
        return result;
      } catch (err) {
        if (mountedRef.current) {
          setState(prev => ({
            ...prev,
            isSyncing: false,
            error: err instanceof Error ? err.message : 'Unknown error',
          }));
          notify({ type: 'error', message: key });
        }
        throw err;
      } finally {
        controllersRef.current.delete(key);
        ongoingRef.current.delete(key);
      }
    })();

    ongoingRef.current.set(key, p);
    return p;
  }

  // per-operation wrappers
  const syncPatientData = useCallback(async (patientId?: string): Promise<EMRAPIResponse<User>> => {
    const id = patientId || user?.id;
    if (!id) {
      return {
        success: false,
        error: { code: 'NO_PATIENT_ID', message: 'Patient ID is required' },
        timestamp: new Date().toISOString(),
      };
    }
    const svc = serviceRef.current;
    if (!svc?.syncPatientData) {
      return {
        success: false,
        error: { code: 'SERVICE_ERROR', message: 'EMR service not available' },
        timestamp: new Date().toISOString(),
      };
    }
    return doSync< User >(`patient:${id}`, (signal) => svc.syncPatientData(id/*, { signal }*/));
  }, [user?.id]);

  const syncAppointments = useCallback(async (patientId?: string): Promise<EMRAPIResponse<Appointment[]>> => {
    const id = patientId || user?.id;
    if (!id) {
      return {
        success: false,
        error: { code: 'NO_PATIENT_ID', message: 'Patient ID is required' },
        timestamp: new Date().toISOString(),
      };
    }
    const svc = serviceRef.current;
    if (!svc?.syncAppointments) {
      return {
        success: false,
        error: { code: 'SERVICE_ERROR', message: 'EMR service not available' },
        timestamp: new Date().toISOString(),
      };
    }
    return doSync< Appointment[] >(`appointments:${id}`, (signal) => svc.syncAppointments(id/*, { signal }*/));
  }, [user?.id]);

  const syncPrescriptions = useCallback(async (patientId?: string): Promise<EMRAPIResponse<Prescription[]>> => {
    const id = patientId || user?.id;
    if (!id) {
      return {
        success: false,
        error: { code: 'NO_PATIENT_ID', message: 'Patient ID is required' },
        timestamp: new Date().toISOString(),
      };
    }
    const svc = serviceRef.current;
    if (!svc?.syncPrescriptions) {
      return {
        success: false,
        error: { code: 'SERVICE_ERROR', message: 'EMR service not available' },
        timestamp: new Date().toISOString(),
      };
    }
    return doSync< Prescription[] >(`prescriptions:${id}`, (signal) => svc.syncPrescriptions(id/*, { signal }*/));
  }, [user?.id]);

  const syncLabResults = useCallback(async (patientId?: string): Promise<EMRAPIResponse<LabResult[]>> => {
    const id = patientId || user?.id;
    if (!id) {
      return {
        success: false,
        error: { code: 'NO_PATIENT_ID', message: 'Patient ID is required' },
        timestamp: new Date().toISOString(),
      };
    }
    const svc = serviceRef.current;
    if (!svc?.syncLabResults) {
      return {
        success: false,
        error: { code: 'SERVICE_ERROR', message: 'EMR service not available' },
        timestamp: new Date().toISOString(),
      };
    }
    return doSync< LabResult[] >(`lab:${id}`, (signal) => svc.syncLabResults(id/*, { signal }*/));
  }, [user?.id]);

  const syncVitals = useCallback(async (patientId?: string): Promise<EMRAPIResponse<VitalsRecord[]>> => {
    const id = patientId || user?.id;
    if (!id) {
      return {
        success: false,
        error: { code: 'NO_PATIENT_ID', message: 'Patient ID is required' },
        timestamp: new Date().toISOString(),
      };
    }
    const svc = serviceRef.current;
    if (!svc?.syncVitals) {
      return {
        success: false,
        error: { code: 'SERVICE_ERROR', message: 'EMR service not available' },
        timestamp: new Date().toISOString(),
      };
    }
    return doSync< VitalsRecord[] >(`vitals:${id}`, (signal) => svc.syncVitals(id/*, { signal }*/));
  }, [user?.id]);

  const syncAll = useCallback(async (patientId?: string): Promise<void> => {
    const id = patientId || user?.id;
    if (!id) return;
    const svc = serviceRef.current;
    if (!svc?.syncAllPatientData) {
      setState(prev => ({ ...prev, error: 'EMR service not available' }));
      return;
    }
    await doSync<void>(`all:${id}`, async (signal) => {
      await svc.syncAllPatientData(id/*, { signal }*/);
      return { success: true, timestamp: new Date().toISOString() } as EMRAPIResponse<void>;
    });
  }, [user?.id]);

  // Auto-sync: returns a stop function
  const startAutoSync = useCallback((intervalMs: number = 60000) => {
    const id = user?.id;
    if (!id || !serviceRef.current) return () => {};
    // clear previous
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const doTick = () => {
      // fire syncAll but don't await
      syncAll(id).catch(() => { /* errors reflected in state/listeners */ });
    };

    // run immediately then schedule
    doTick();
    const iid = window.setInterval(doTick, intervalMs);
    intervalRef.current = iid;
    setIsAutoSyncActive(true);
    notify({ type: 'autosync:start', message: `interval=${intervalMs}` });

    const stop = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsAutoSyncActive(false);
      notify({ type: 'autosync:stop' });
    };

    return stop;
  }, [user?.id, syncAll, notify]);

  const stopAutoSync = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsAutoSyncActive(false);
    notify({ type: 'autosync:stop' });
  }, [notify]);

  const checkHealth = useCallback(async (): Promise<boolean> => {
    try {
      const isHealthy = await serviceRef.current?.checkEMRHealth?.();
      if (mountedRef.current) setState(prev => ({ ...prev, isConnected: !!isHealthy }));
      return !!isHealthy;
    } catch {
      if (mountedRef.current) setState(prev => ({ ...prev, isConnected: false }));
      return false;
    }
  }, []);

  const addProgressListener = useCallback((l: (p: { type: string; message?: string }) => void) => {
    listenersRef.current.add(l);
  }, []);

  const removeProgressListener = useCallback((l: (p: { type: string; message?: string }) => void) => {
    listenersRef.current.delete(l);
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
    addProgressListener,
    removeProgressListener,
  };
};

export default useEMRIntegration;

