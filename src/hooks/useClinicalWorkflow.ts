/**
 * React Hook for Clinical Workflow
 * 
 * Provides easy access to clinical workflow functionality
 */

import { useState, useCallback } from 'react';
import {
  getClinicalWorkflowService,
  ClinicalWorkflowService,
  VisitWorkflow,
  WorkflowStatus,
} from '@/services/clinicalWorkflowService';
import {
  ProgressNote,
  Prescription,
  LabOrder,
  BillingInvoice,
} from '@/types';
import { EMRAPIResponse } from '@/services/emrApiClient';

export interface UseClinicalWorkflowReturn {
  // State
  workflow: VisitWorkflow | null;
  workflowStatus: WorkflowStatus | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  startVisit: (appointmentId: string) => Promise<EMRAPIResponse<VisitWorkflow>>;
  checkIn: (appointmentId: string) => Promise<EMRAPIResponse<any>>;
  createNote: (
    appointmentId: string,
    note: Omit<ProgressNote, 'id' | 'date'>
  ) => Promise<EMRAPIResponse<ProgressNote>>;
  addPrescription: (
    appointmentId: string,
    prescription: Omit<Prescription, 'id' | 'status' | 'datePrescribed'>
  ) => Promise<EMRAPIResponse<Prescription>>;
  addLabOrder: (
    appointmentId: string,
    labOrder: Omit<LabOrder, 'id' | 'date' | 'status'>
  ) => Promise<EMRAPIResponse<LabOrder>>;
  createInvoice: (
    appointmentId: string,
    invoiceData: {
      totalAmount: number;
      description: string;
      lineItems: Array<{ service: string; amount: number }>;
    }
  ) => Promise<EMRAPIResponse<BillingInvoice>>;
  processPayment: (
    appointmentId: string,
    paymentData: {
      amount: number;
      method: 'credit_card' | 'debit_card' | 'cash' | 'check' | 'online';
      transactionId?: string;
    }
  ) => Promise<EMRAPIResponse<{ success: boolean; transactionId: string }>>;
  completeVisit: (appointmentId: string) => Promise<EMRAPIResponse<VisitWorkflow>>;
  
  // Utilities
  refreshWorkflow: (appointmentId: string) => void;
  service: ClinicalWorkflowService;
}

/**
 * Hook for Clinical Workflow
 */
export const useClinicalWorkflow = (appointmentId?: string): UseClinicalWorkflowReturn => {
  const [workflow, setWorkflow] = useState<VisitWorkflow | null>(null);
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const service = getClinicalWorkflowService();

  // Refresh workflow
  const refreshWorkflow = useCallback((id: string) => {
    const wf = service.getWorkflow(id);
    const status = service.getWorkflowStatus(id);
    setWorkflow(wf || null);
    setWorkflowStatus(status);
  }, [service]);

  // Start visit
  const startVisit = useCallback(async (id: string): Promise<EMRAPIResponse<VisitWorkflow>> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await service.startVisitWorkflow(id);
      if (response.success && response.data) {
        setWorkflow(response.data);
        setWorkflowStatus(service.getWorkflowStatus(id));
      } else {
        setError(response.error?.message || 'Failed to start visit');
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return {
        success: false,
        error: { code: 'ERROR', message: errorMsg },
        timestamp: new Date().toISOString(),
      };
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  // Check in
  const checkIn = useCallback(async (id: string): Promise<EMRAPIResponse<any>> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await service.checkInPatient(id);
      if (response.success) {
        refreshWorkflow(id);
      } else {
        setError(response.error?.message || 'Failed to check in');
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return {
        success: false,
        error: { code: 'ERROR', message: errorMsg },
        timestamp: new Date().toISOString(),
      };
    } finally {
      setIsLoading(false);
    }
  }, [service, refreshWorkflow]);

  // Create note
  const createNote = useCallback(async (
    id: string,
    note: Omit<ProgressNote, 'id' | 'date'>
  ): Promise<EMRAPIResponse<ProgressNote>> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await service.createProgressNote(id, note);
      if (response.success) {
        refreshWorkflow(id);
      } else {
        setError(response.error?.message || 'Failed to create note');
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return {
        success: false,
        error: { code: 'ERROR', message: errorMsg },
        timestamp: new Date().toISOString(),
      };
    } finally {
      setIsLoading(false);
    }
  }, [service, refreshWorkflow]);

  // Add prescription
  const addPrescription = useCallback(async (
    id: string,
    prescription: Omit<Prescription, 'id' | 'status' | 'datePrescribed'>
  ): Promise<EMRAPIResponse<Prescription>> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await service.addPrescription(id, prescription);
      if (response.success) {
        refreshWorkflow(id);
      } else {
        setError(response.error?.message || 'Failed to add prescription');
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return {
        success: false,
        error: { code: 'ERROR', message: errorMsg },
        timestamp: new Date().toISOString(),
      };
    } finally {
      setIsLoading(false);
    }
  }, [service, refreshWorkflow]);

  // Add lab order
  const addLabOrder = useCallback(async (
    id: string,
    labOrder: Omit<LabOrder, 'id' | 'date' | 'status'>
  ): Promise<EMRAPIResponse<LabOrder>> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await service.addLabOrder(id, labOrder);
      if (response.success) {
        refreshWorkflow(id);
      } else {
        setError(response.error?.message || 'Failed to add lab order');
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return {
        success: false,
        error: { code: 'ERROR', message: errorMsg },
        timestamp: new Date().toISOString(),
      };
    } finally {
      setIsLoading(false);
    }
  }, [service, refreshWorkflow]);

  // Create invoice
  const createInvoice = useCallback(async (
    id: string,
    invoiceData: {
      totalAmount: number;
      description: string;
      lineItems: Array<{ service: string; amount: number }>;
    }
  ): Promise<EMRAPIResponse<BillingInvoice>> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await service.createInvoice(id, invoiceData);
      if (response.success) {
        refreshWorkflow(id);
      } else {
        setError(response.error?.message || 'Failed to create invoice');
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return {
        success: false,
        error: { code: 'ERROR', message: errorMsg },
        timestamp: new Date().toISOString(),
      };
    } finally {
      setIsLoading(false);
    }
  }, [service, refreshWorkflow]);

  // Process payment
  const processPayment = useCallback(async (
    id: string,
    paymentData: {
      amount: number;
      method: 'credit_card' | 'debit_card' | 'cash' | 'check' | 'online';
      transactionId?: string;
    }
  ): Promise<EMRAPIResponse<{ success: boolean; transactionId: string }>> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await service.processPayment(id, paymentData);
      if (response.success) {
        refreshWorkflow(id);
      } else {
        setError(response.error?.message || 'Failed to process payment');
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return {
        success: false,
        error: { code: 'ERROR', message: errorMsg },
        timestamp: new Date().toISOString(),
      };
    } finally {
      setIsLoading(false);
    }
  }, [service, refreshWorkflow]);

  // Complete visit
  const completeVisit = useCallback(async (id: string): Promise<EMRAPIResponse<VisitWorkflow>> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await service.completeVisit(id);
      if (response.success) {
        setWorkflow(null);
        setWorkflowStatus(null);
      } else {
        setError(response.error?.message || 'Failed to complete visit');
      }
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return {
        success: false,
        error: { code: 'ERROR', message: errorMsg },
        timestamp: new Date().toISOString(),
      };
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  // Initialize workflow if appointmentId provided
  if (appointmentId && !workflow) {
    const existing = service.getWorkflow(appointmentId);
    if (existing) {
      setWorkflow(existing);
      setWorkflowStatus(service.getWorkflowStatus(appointmentId));
    }
  }

  return {
    workflow,
    workflowStatus,
    isLoading,
    error,
    startVisit,
    checkIn,
    createNote,
    addPrescription,
    addLabOrder,
    createInvoice,
    processPayment,
    completeVisit,
    refreshWorkflow,
    service,
  };
};

export default useClinicalWorkflow;
