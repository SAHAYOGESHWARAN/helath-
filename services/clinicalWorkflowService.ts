/**
 * Clinical Workflow Service
 * 
 * Manages end-to-end clinical workflow including:
 * - Appointment scheduling
 * - Clinical note creation
 * - Electronic prescribing (e-prescribing)
 * - Payment processing
 * - Seamless integration between all modules
 */

import {
  Appointment,
  ProgressNote,
  Prescription,
  BillingInvoice,
  LabOrder,
  User,
} from '../types';
import { EMRAPIClient, EMRAPIResponse } from './emrApiClient';
import { getPatientRecordService } from './patientRecordService';

// Visit workflow data
export interface VisitWorkflow {
  appointment: Appointment;
  progressNote?: ProgressNote;
  prescriptions: Prescription[];
  labOrders: LabOrder[];
  invoice?: BillingInvoice;
  paymentStatus: 'pending' | 'partial' | 'paid';
}

// Clinical workflow steps
export enum WorkflowStep {
  SCHEDULED = 'scheduled',
  CHECKED_IN = 'checked_in',
  IN_PROGRESS = 'in_progress',
  NOTE_COMPLETED = 'note_completed',
  PRESCRIPTIONS_SENT = 'prescriptions_sent',
  LAB_ORDERS_PLACED = 'lab_orders_placed',
  BILLING_COMPLETED = 'billing_completed',
  VISIT_COMPLETED = 'visit_completed',
}

// Workflow status
export interface WorkflowStatus {
  currentStep: WorkflowStep;
  completedSteps: WorkflowStep[];
  isComplete: boolean;
  canProceed: boolean;
  nextStep?: WorkflowStep;
}

/**
 * Clinical Workflow Service Class
 */
export class ClinicalWorkflowService {
  private emrClient = EMRAPIClient.getInstance();
  private patientRecordService = getPatientRecordService();
  private activeWorkflows: Map<string, VisitWorkflow> = new Map();

  /**
   * Start a new visit workflow
   */
  async startVisitWorkflow(
    appointmentId: string
  ): Promise<EMRAPIResponse<VisitWorkflow>> {
    try {
      // Get appointment
      const appointmentResponse = await this.emrClient.getAppointment(appointmentId);
      if (!appointmentResponse.success || !appointmentResponse.data) {
        return {
          success: false,
          error: {
            code: 'APPOINTMENT_NOT_FOUND',
            message: `Appointment ${appointmentId} not found`,
          },
          timestamp: new Date().toISOString(),
        };
      }

      const appointment = appointmentResponse.data;

      // Create workflow
      const workflow: VisitWorkflow = {
        appointment,
        prescriptions: [],
        labOrders: [],
        paymentStatus: 'pending',
      };

      this.activeWorkflows.set(appointmentId, workflow);

      return {
        success: true,
        data: workflow,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'WORKFLOW_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Check in patient
   */
  async checkInPatient(appointmentId: string): Promise<EMRAPIResponse<Appointment>> {
    return this.updateAppointmentStatus(appointmentId, 'Checked-In');
  }

  /**
   * Update appointment status
   */
  private async updateAppointmentStatus(
    appointmentId: string,
    checkInStatus: 'Waiting' | 'Checked-In'
  ): Promise<EMRAPIResponse<Appointment>> {
    return this.emrClient.updateAppointment(appointmentId, {
      checkInStatus,
    });
  }

  /**
   * Create progress note during visit
   */
  async createProgressNote(
    appointmentId: string,
    noteData: Omit<ProgressNote, 'id' | 'date'>
  ): Promise<EMRAPIResponse<ProgressNote>> {
    try {
      const workflow = this.activeWorkflows.get(appointmentId);
      if (!workflow) {
        return {
          success: false,
          error: {
            code: 'WORKFLOW_NOT_FOUND',
            message: `Workflow for appointment ${appointmentId} not found`,
          },
          timestamp: new Date().toISOString(),
        };
      }

      // Create note with appointment data
      const note: Omit<ProgressNote, 'id'> = {
        ...noteData,
        date: new Date().toISOString().split('T')[0],
        patientId: workflow.appointment.patientId,
        patientName: workflow.appointment.patientName,
        providerId: workflow.appointment.providerId,
      };

      const noteResponse = await this.emrClient.createProgressNote(note);
      
      if (noteResponse.success && noteResponse.data) {
        workflow.progressNote = noteResponse.data;
        this.activeWorkflows.set(appointmentId, workflow);
      }

      return noteResponse;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NOTE_CREATION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Add prescription to workflow
   */
  async addPrescription(
    appointmentId: string,
    prescription: Omit<Prescription, 'id' | 'status' | 'datePrescribed'>
  ): Promise<EMRAPIResponse<Prescription>> {
    try {
      const workflow = this.activeWorkflows.get(appointmentId);
      if (!workflow) {
        return {
          success: false,
          error: {
            code: 'WORKFLOW_NOT_FOUND',
            message: `Workflow for appointment ${appointmentId} not found`,
          },
          timestamp: new Date().toISOString(),
        };
      }

      const prescriptionData: Omit<Prescription, 'id' | 'status'> = {
        ...prescription,
        datePrescribed: new Date().toISOString().split('T')[0],
      };

      const prescriptionResponse = await this.emrClient.createPrescription(prescriptionData);
      
      if (prescriptionResponse.success && prescriptionResponse.data) {
        workflow.prescriptions.push(prescriptionResponse.data);
        this.activeWorkflows.set(appointmentId, workflow);
      }

      return prescriptionResponse;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PRESCRIPTION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Add lab order to workflow
   */
  async addLabOrder(
    appointmentId: string,
    labOrder: Omit<LabOrder, 'id' | 'date' | 'status'>
  ): Promise<EMRAPIResponse<LabOrder>> {
    try {
      const workflow = this.activeWorkflows.get(appointmentId);
      if (!workflow) {
        return {
          success: false,
          error: {
            code: 'WORKFLOW_NOT_FOUND',
            message: `Workflow for appointment ${appointmentId} not found`,
          },
          timestamp: new Date().toISOString(),
        };
      }

      const labOrderData: Omit<LabOrder, 'id'> = {
        ...labOrder,
        date: new Date().toISOString().split('T')[0],
        status: 'Ordered',
      };

      // Lab orders are typically created through the lab orders endpoint
      // For now, we'll add it to the workflow
      workflow.labOrders.push(labOrderData as LabOrder);
      this.activeWorkflows.set(appointmentId, workflow);

      return {
        success: true,
        data: labOrderData as LabOrder,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'LAB_ORDER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Create invoice for visit
   */
  async createInvoice(
    appointmentId: string,
    invoiceData: {
      totalAmount: number;
      description: string;
      lineItems: Array<{ service: string; amount: number }>;
    }
  ): Promise<EMRAPIResponse<BillingInvoice>> {
    try {
      const workflow = this.activeWorkflows.get(appointmentId);
      if (!workflow) {
        return {
          success: false,
          error: {
            code: 'WORKFLOW_NOT_FOUND',
            message: `Workflow for appointment ${appointmentId} not found`,
          },
          timestamp: new Date().toISOString(),
        };
      }

      const invoice: Omit<BillingInvoice, 'id'> = {
        patientId: workflow.appointment.patientId,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
        totalAmount: invoiceData.totalAmount,
        amountDue: invoiceData.totalAmount,
        status: 'Due',
        description: invoiceData.description,
      };

      // In a real system, this would create the invoice via the EMR API
      // For now, we'll add it to the workflow
      workflow.invoice = invoice as BillingInvoice;
      this.activeWorkflows.set(appointmentId, workflow);

      return {
        success: true,
        data: invoice as BillingInvoice,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'INVOICE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Process payment
   */
  async processPayment(
    appointmentId: string,
    paymentData: {
      amount: number;
      method: 'credit_card' | 'debit_card' | 'cash' | 'check' | 'online';
      transactionId?: string;
    }
  ): Promise<EMRAPIResponse<{ success: boolean; transactionId: string }>> {
    try {
      const workflow = this.activeWorkflows.get(appointmentId);
      if (!workflow || !workflow.invoice) {
        return {
          success: false,
          error: {
            code: 'INVOICE_NOT_FOUND',
            message: 'Invoice not found for this appointment',
          },
          timestamp: new Date().toISOString(),
        };
      }

      // Process payment (in real system, this would integrate with payment processor)
      const newAmountDue = workflow.invoice.amountDue - paymentData.amount;
      const transactionId = paymentData.transactionId || `txn_${Date.now()}`;

      // Update invoice
      workflow.invoice.amountDue = Math.max(0, newAmountDue);
      workflow.invoice.status = workflow.invoice.amountDue === 0 ? 'Paid' : 'Due';
      workflow.paymentStatus = workflow.invoice.amountDue === 0 ? 'paid' : 
                                 paymentData.amount > 0 ? 'partial' : 'pending';

      this.activeWorkflows.set(appointmentId, workflow);

      // Log payment (in production, this would be stored securely)
      console.log(`Payment processed: ${paymentData.amount} via ${paymentData.method}`, {
        appointmentId,
        transactionId,
        remainingBalance: workflow.invoice.amountDue,
      });

      return {
        success: true,
        data: {
          success: true,
          transactionId,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Complete visit workflow
   */
  async completeVisit(appointmentId: string): Promise<EMRAPIResponse<VisitWorkflow>> {
    try {
      const workflow = this.activeWorkflows.get(appointmentId);
      if (!workflow) {
        return {
          success: false,
          error: {
            code: 'WORKFLOW_NOT_FOUND',
            message: `Workflow for appointment ${appointmentId} not found`,
          },
          timestamp: new Date().toISOString(),
        };
      }

      // Update appointment status
      await this.emrClient.updateAppointment(appointmentId, {
        status: 'Completed',
      });

      // Clear patient record cache
      this.patientRecordService.clearCache(workflow.appointment.patientId);

      // Remove from active workflows
      this.activeWorkflows.delete(appointmentId);

      return {
        success: true,
        data: workflow,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'COMPLETION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get workflow status
   */
  getWorkflowStatus(appointmentId: string): WorkflowStatus {
    const workflow = this.activeWorkflows.get(appointmentId);
    if (!workflow) {
      return {
        currentStep: WorkflowStep.SCHEDULED,
        completedSteps: [],
        isComplete: false,
        canProceed: false,
      };
    }

    const completedSteps: WorkflowStep[] = [];
    let currentStep = WorkflowStep.SCHEDULED;

    if (workflow.appointment.checkInStatus === 'Checked-In') {
      completedSteps.push(WorkflowStep.CHECKED_IN);
      currentStep = WorkflowStep.IN_PROGRESS;
    }

    if (workflow.progressNote) {
      completedSteps.push(WorkflowStep.NOTE_COMPLETED);
    }

    if (workflow.prescriptions.length > 0) {
      completedSteps.push(WorkflowStep.PRESCRIPTIONS_SENT);
    }

    if (workflow.labOrders.length > 0) {
      completedSteps.push(WorkflowStep.LAB_ORDERS_PLACED);
    }

    if (workflow.invoice) {
      completedSteps.push(WorkflowStep.BILLING_COMPLETED);
    }

    const isComplete = workflow.appointment.status === 'Completed';
    if (isComplete) {
      completedSteps.push(WorkflowStep.VISIT_COMPLETED);
      currentStep = WorkflowStep.VISIT_COMPLETED;
    }

    return {
      currentStep,
      completedSteps,
      isComplete,
      canProceed: !isComplete,
      nextStep: isComplete ? undefined : this.getNextStep(completedSteps),
    };
  }

  /**
   * Get next workflow step
   */
  private getNextStep(completedSteps: WorkflowStep[]): WorkflowStep | undefined {
    if (!completedSteps.includes(WorkflowStep.CHECKED_IN)) {
      return WorkflowStep.CHECKED_IN;
    }
    if (!completedSteps.includes(WorkflowStep.NOTE_COMPLETED)) {
      return WorkflowStep.NOTE_COMPLETED;
    }
    if (!completedSteps.includes(WorkflowStep.BILLING_COMPLETED)) {
      return WorkflowStep.BILLING_COMPLETED;
    }
    return WorkflowStep.VISIT_COMPLETED;
  }

  /**
   * Get active workflow
   */
  getWorkflow(appointmentId: string): VisitWorkflow | undefined {
    return this.activeWorkflows.get(appointmentId);
  }

  /**
   * Get all active workflows
   */
  getActiveWorkflows(): VisitWorkflow[] {
    return Array.from(this.activeWorkflows.values());
  }
}

// Singleton instance
let clinicalWorkflowServiceInstance: ClinicalWorkflowService | null = null;

/**
 * Get or create Clinical Workflow Service instance
 */
export const getClinicalWorkflowService = (): ClinicalWorkflowService => {
  if (!clinicalWorkflowServiceInstance) {
    clinicalWorkflowServiceInstance = new ClinicalWorkflowService();
  }
  return clinicalWorkflowServiceInstance;
};

export default ClinicalWorkflowService;

