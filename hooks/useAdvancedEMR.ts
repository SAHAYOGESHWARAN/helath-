/**
 * Advanced EMR React Hooks - Real-time Integration
 * Features: State management, real-time updates, offline support, caching
 */

import React, { useState, useCallback, useEffect, useRef, useContext, createContext, type ReactNode } from 'react';
import { AdvancedEMRClient, getAdvancedEMRClient } from '../services/advancedEMRClient';
import { RealTimeSyncEngine } from '../services/realTimeSyncEngine';
import { AdvancedEMRFeaturesFactory } from '../services/advancedEMRFeatures';

// ============================================================================
// CONTEXT & PROVIDERS
// ============================================================================

export const EMRContext = createContext<{
  client: AdvancedEMRClient | null;
  syncEngine: RealTimeSyncEngine | null;
  services: any;
}>({
  client: null,
  syncEngine: null,
  services: null,
});

export interface EMRProviderProps {
  baseUrl?: string;
  apiKey?: string;
  enableAutoSync?: boolean;
  autoSyncInterval?: number;
  enableOfflineMode?: boolean;
  children: React.ReactNode;
}

export function EMRProvider({
  baseUrl,
  apiKey,
  enableAutoSync = true,
  autoSyncInterval = 30000,
  enableOfflineMode = true,
  children,
}: EMRProviderProps) {
  const [client] = useState(() => new AdvancedEMRClient(
    baseUrl || 'https://api.emr.local/api/v1',
    apiKey || ''
  ));

  const [syncEngine] = useState(() => new RealTimeSyncEngine(client, {
    enableAutoSync,
    autoSyncInterval,
    enableOfflineMode,
  }));

  const [services] = useState(() => AdvancedEMRFeaturesFactory.createAllServices(client));

  useEffect(() => {
    if (enableAutoSync) {
      syncEngine.startAutoSync(autoSyncInterval);
    }
    return () => syncEngine.destroy();
  }, [enableAutoSync, autoSyncInterval, syncEngine]);

  return (
    <EMRContext.Provider value={{ client, syncEngine, services }}>
      {children}
    </EMRContext.Provider>
  );
}

// ============================================================================
// CORE HOOKS
// ============================================================================

export function useEMR() {
  const context = useContext(EMRContext);
  if (!context || !context.client) {
    throw new Error('useEMR must be used within EMRProvider');
  }
  return context as {
    client: AdvancedEMRClient;
    syncEngine: RealTimeSyncEngine;
    services: any;
  };
}

// ============================================================================
// PATIENT HOOKS (8+ features)
// ============================================================================

export interface UsePatientState {
  patient: any | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export function usePatient(patientId: string, autoRefresh: boolean = true) {
  const { client, syncEngine } = useEMR();
  const [state, setState] = useState<UsePatientState>({
    patient: null,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const fetchPatient = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await client.getPatient(patientId);
      if (response.success) {
        setState((prev) => ({
          ...prev,
          patient: response.data,
          loading: false,
          lastUpdated: new Date().toISOString(),
        }));
      } else {
        const errorMsg = typeof response.error === 'string' 
          ? response.error 
          : (response.error as any)?.message || 'Failed to fetch patient';
        setState((prev) => ({
          ...prev,
          error: errorMsg,
          loading: false,
        }));
      }
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        loading: false,
      }));
    }
  }, [client, patientId]);

  const updatePatient = useCallback(
    async (updates: any) => {
      try {
        const response = await client.updatePatient(patientId, updates);
        if (response.success) {
          setState((prev) => ({
            ...prev,
            patient: { ...prev.patient, ...updates },
            lastUpdated: new Date().toISOString(),
          }));
          syncEngine.trackLocalChange('Patient', patientId, updates, 'UPDATE');
        }
        return response;
      } catch (error: any) {
        setState((prev) => ({ ...prev, error: error.message }));
        throw error;
      }
    },
    [client, patientId, syncEngine]
  );

  useEffect(() => {
    if (patientId) {
      fetchPatient();

      if (autoRefresh) {
        const interval = setInterval(fetchPatient, 30000);
        return () => clearInterval(interval);
      }
    }
  }, [patientId, fetchPatient, autoRefresh]);

  return {
    ...state,
    refetch: fetchPatient,
    updatePatient,
    timeline: usePatientTimeline(patientId),
    summary: usePatientSummary(patientId),
  };
}

export function usePatientTimeline(patientId: string) {
  const { client } = useEMR();
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await client.getPatientTimeline(patientId);
      if (response.success) setTimeline(response.data || []);
    } finally {
      setLoading(false);
    }
  }, [client, patientId]);

  useEffect(() => {
    if (patientId) fetch();
  }, [patientId, fetch]);

  return { timeline, loading, refetch: fetch };
}

export function usePatientSummary(patientId: string) {
  const { client } = useEMR();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patientId) {
      setLoading(true);
      client.getPatientSummary(patientId).then((response) => {
        if (response.success) setSummary(response.data);
        setLoading(false);
      });
    }
  }, [client, patientId]);

  return { summary, loading };
}

// ============================================================================
// APPOINTMENT HOOKS (6+ features)
// ============================================================================

export interface UseAppointmentsState {
  appointments: any[];
  loading: boolean;
  error: string | null;
  totalCount?: number;
}

export function useAppointments(filters?: any, autoRefresh: boolean = true) {
  const { client } = useEMR();
  const [state, setState] = useState<UseAppointmentsState>({
    appointments: [],
    loading: false,
    error: null,
  });

  const fetchAppointments = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await client.getAppointments(filters);
      if (response.success) {
        setState((prev) => ({
          ...prev,
          appointments: Array.isArray(response.data) ? response.data : [],
          loading: false,
        }));
      }
    } catch (error: any) {
      setState((prev) => ({ ...prev, error: error.message, loading: false }));
    }
  }, [client, filters]);

  const bookAppointment = useCallback(
    async (appointmentData: any) => {
      try {
        const response = await client.createAppointment(appointmentData);
        if (response.success) {
          setState((prev) => ({
            ...prev,
            appointments: [...prev.appointments, response.data],
          }));
        }
        return response;
      } catch (error: any) {
        throw error;
      }
    },
    [client]
  );

  const rescheduleAppointment = useCallback(
    async (appointmentId: string, newTime: any) => {
      try {
        const response = await client.rescheduleAppointment(appointmentId, newTime);
        if (response.success) {
          setState((prev) => ({
            ...prev,
            appointments: prev.appointments.map((apt) =>
              apt.id === appointmentId ? response.data : apt
            ),
          }));
        }
        return response;
      } catch (error: any) {
        throw error;
      }
    },
    [client]
  );

  const cancelAppointment = useCallback(
    async (appointmentId: string) => {
      try {
        const response = await client.cancelAppointment(appointmentId);
        if (response.success) {
          setState((prev) => ({
            ...prev,
            appointments: prev.appointments.filter((apt) => apt.id !== appointmentId),
          }));
        }
        return response;
      } catch (error: any) {
        throw error;
      }
    },
    [client]
  );

  useEffect(() => {
    fetchAppointments();
    if (autoRefresh) {
      const interval = setInterval(fetchAppointments, 60000);
      return () => clearInterval(interval);
    }
  }, [fetchAppointments, autoRefresh]);

  return {
    ...state,
    refetch: fetchAppointments,
    bookAppointment,
    rescheduleAppointment,
    cancelAppointment,
  };
}

export function useAvailableSlots(providerId: string, date: string) {
  const { client } = useEMR();
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (providerId && date) {
      setLoading(true);
      client.getAvailableSlots(providerId, date).then((response) => {
        if (response.success) setSlots(response.data || []);
        setLoading(false);
      });
    }
  }, [client, providerId, date]);

  return { slots, loading };
}

// ============================================================================
// PRESCRIPTION HOOKS (5+ features)
// ============================================================================

export function usePrescriptions(patientId: string) {
  const { client, syncEngine } = useEMR();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await client.getPrescriptions(patientId);
      if (response.success) {
        setPrescriptions(Array.isArray(response.data) ? response.data : []);
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, [client, patientId]);

  const refillPrescription = useCallback(
    async (prescriptionId: string) => {
      try {
        const response = await client.refillPrescription(prescriptionId);
        if (response.success) {
          syncEngine.trackLocalChange('Prescription', prescriptionId, { action: 'refill' }, 'UPDATE');
        }
        return response;
      } catch (error) {
        throw error;
      }
    },
    [client, syncEngine]
  );

  const checkInteractions = useCallback(
    async (medications: string[]) => {
      return client.checkDrugInteractions(medications);
    },
    [client]
  );

  useEffect(() => {
    if (patientId) fetch();
  }, [patientId, fetch]);

  return { prescriptions, loading, error, refetch: fetch, refillPrescription, checkInteractions };
}

// ============================================================================
// VITALS HOOKS (4+ features)
// ============================================================================

export function useVitals(patientId: string, options?: any) {
  const { client, syncEngine } = useEMR();
  const [vitals, setVitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await client.getVitals(patientId, options);
      if (response.success) setVitals(Array.isArray(response.data) ? response.data : []);
    } finally {
      setLoading(false);
    }
  }, [client, patientId, options]);

  const recordVital = useCallback(
    async (vitalData: any) => {
      try {
        const response = await client.recordVital(patientId, vitalData);
        if (response.success) {
          setVitals((prev) => [response.data, ...prev]);
          syncEngine.trackLocalChange('Vital', response.data.id, vitalData, 'CREATE');
        }
        return response;
      } catch (error) {
        throw error;
      }
    },
    [client, patientId, syncEngine]
  );

  const getTrends = useCallback(
    async (vitalType: string) => {
      return client.getVitalTrends(patientId, vitalType);
    },
    [client, patientId]
  );

  useEffect(() => {
    if (patientId) fetch();
  }, [patientId, fetch]);

  return { vitals, loading, refetch: fetch, recordVital, getTrends };
}

// ============================================================================
// SYNC & OFFLINE HOOKS (4+ features)
// ============================================================================

export function useSyncState() {
  const { syncEngine } = useEMR();
  const [syncState, setSyncState] = useState(syncEngine?.getState());

  useEffect(() => {
    return syncEngine?.onStateChange(setSyncState);
  }, [syncEngine]);

  return syncState;
}

export function useOfflineMode() {
  const { syncEngine } = useEMR();
  const syncState = useSyncState();

  return {
    isOffline: syncState?.offlineMode || false,
    pendingChanges: syncState?.pendingChanges || 0,
    syncNow: () => (syncEngine as any).syncNow?.(),
  };
}

export function useLocalChange(resourceType: string, resourceId: string) {
  const { syncEngine } = useEMR();

  return useCallback(
    (data: any, type: 'CREATE' | 'UPDATE' | 'DELETE') => {
      syncEngine?.trackLocalChange(resourceType, resourceId, data, type);
    },
    [syncEngine, resourceType, resourceId]
  );
}

// ============================================================================
// SEARCH HOOKS (3+ features)
// ============================================================================

export function useSearch(initialQuery?: string) {
  const { services } = useEMR();
  const [query, setQuery] = useState(initialQuery || '');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(
    async (q: string) => {
      setQuery(q);
      setLoading(true);
      try {
        const response = await services.search.fullTextSearch(q);
        if (response.success) {
          setResults(response.data || []);
        }
      } finally {
        setLoading(false);
      }
    },
    [services.search]
  );

  return { query, results, loading, search };
}

// ============================================================================
// ANALYTICS HOOKS (2+ features)
// ============================================================================

export function useAnalytics(metric: string, filters?: any) {
  const { services } = useEMR();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    services.analytics
      .getAnalytics(metric, metric, filters)
      .then((response: any) => {
        if (response.success) setData(response.data);
        setLoading(false);
      });
  }, [services.analytics, metric, filters]);

  return { data, loading };
}

// ============================================================================
// NOTIFICATION HOOKS (2+ features)
// ============================================================================

export function useAlerts() {
  const { services } = useEMR();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await services.notifications.getAlerts();
      if (response.success) setAlerts(response.data || []);
    } finally {
      setLoading(false);
    }
  }, [services.notifications]);

  const acknowledgeAlert = useCallback(
    async (alertId: string) => {
      await services.notifications.acknowledgeAlert(alertId);
      await fetchAlerts();
    },
    [services.notifications, fetchAlerts]
  );

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  return { alerts, loading, acknowledgeAlert };
}

// ============================================================================
// CUSTOM HOOK FACTORY
// ============================================================================

export function createCustomHook(resourceType: string) {
  return function useResource(resourceId: string, autoRefresh: boolean = true) {
    const { client, syncEngine } = useEMR();
    const [resource, setResource] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
      setLoading(true);
      try {
        const response = await (client as any).request('GET', `/${resourceType}/${resourceId}`);
        if (response.success) {
          setResource(response.data);
        } else {
          setError(response.error?.message || 'Failed to fetch');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, [client, resourceId]);

    const update = useCallback(
      async (updates: any) => {
        try {
          const response = await (client as any).request('PATCH', `/${resourceType}/${resourceId}`, updates);
          if (response.success) {
            setResource(response.data);
            syncEngine.trackLocalChange(resourceType, resourceId, updates, 'UPDATE');
          }
          return response;
        } catch (error) {
          throw error;
        }
      },
      [client, resourceId, resourceType, syncEngine]
    );

    useEffect(() => {
      if (resourceId) {
        fetch();
        if (autoRefresh) {
          const interval = setInterval(fetch, 30000);
          return () => clearInterval(interval);
        }
      }
    }, [resourceId, fetch, autoRefresh]);

    return { resource, loading, error, refetch: fetch, update };
  };
}

export default {
  EMRProvider,
  useEMR,
  usePatient,
  useAppointments,
  usePrescriptions,
  useVitals,
  useSyncState,
  useOfflineMode,
  useLocalChange,
  useSearch,
  useAnalytics,
  useAlerts,
  createCustomHook,
};
