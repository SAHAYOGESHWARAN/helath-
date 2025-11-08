/**
 * Patient Record Service
 * 
 * Consolidates all patient data into a comprehensive digital file including:
 * - Demographics
 * - Visit history
 * - Clinical notes
 * - Prescriptions
 * - Lab results
 * - Vitals
 * - All other clinical data
 */

import { 
  User, 
  Appointment, 
  ProgressNote, 
  Prescription, 
  LabResult, 
  VitalsRecord,
  LabOrder,
  Message,
  MedicalCondition,
  Allergy,
  Medication,
  Surgery,
  Immunization,
  FamilyHistory,
  Lifestyle,
  HealthGoal
} from '@/types';
import { EMRAPIClient, EMRAPIResponse } from '@/services/emrApiClient';

// Comprehensive patient record
export interface ConsolidatedPatientRecord {
  // Basic Information
  patient: User;
  
  // Demographics
  demographics: {
    name: string;
    email: string;
    phone?: string;
    dob?: string;
    address?: string;
    state?: string;
    emergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
    };
  };

  // Clinical Data
  clinicalData: {
    conditions: MedicalCondition[];
    allergies: Allergy[];
    medications: Medication[];
    surgeries: Surgery[];
    immunizations: Immunization[];
    familyHistory: FamilyHistory[];
    lifestyle: Lifestyle | null;
    healthGoals: HealthGoal[];
  };

  // Visit History
  visitHistory: {
    appointments: Appointment[];
    progressNotes: ProgressNote[];
    prescriptions: Prescription[];
    labResults: LabResult[];
    labOrders: LabOrder[];
    vitals: VitalsRecord[];
  };

  // Communication
  communications: {
    messages: Message[];
    unreadCount: number;
  };

  // Summary Statistics
  summary: {
    totalVisits: number;
    totalPrescriptions: number;
    totalLabResults: number;
    lastVisitDate: string | null;
    nextAppointment: Appointment | null;
    activeMedicationsCount: number;
    pendingLabResults: number;
  };

  // Metadata
  metadata: {
    createdAt: string;
    lastUpdated: string;
    recordVersion: number;
  };
}

/**
 * Patient Record Service Class
 */
export class PatientRecordService {
  private emrClient = EMRAPIClient.getInstance();
  private cache: Map<string, { record: ConsolidatedPatientRecord; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get comprehensive patient record
   */
  async getConsolidatedRecord(patientId: string): Promise<EMRAPIResponse<ConsolidatedPatientRecord>> {
    // Check cache
    const cached = this.cache.get(patientId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return {
        success: true,
        data: cached.record,
        timestamp: new Date().toISOString(),
      };
    }

    try {
      // Fetch all patient data in parallel
      const [
        patientResponse,
        appointmentsResponse,
        progressNotesResponse,
        prescriptionsResponse,
        labResultsResponse,
        labOrdersResponse,
        vitalsResponse,
      ] = await Promise.all([
        this.emrClient.getPatient(patientId),
        this.emrClient.getAppointments({ patientId }),
        this.emrClient.getProgressNotes(patientId),
        this.emrClient.getPrescriptions(patientId),
        this.emrClient.getLabResults(patientId),
        this.emrClient.getLabOrders(patientId),
        this.emrClient.getVitals(patientId),
      ]);

      // Check if patient fetch was successful
      if (!patientResponse.success || !patientResponse.data) {
        return {
          success: false,
          error: {
            code: 'PATIENT_NOT_FOUND',
            message: `Patient with ID ${patientId} not found`,
          },
          timestamp: new Date().toISOString(),
        };
      }

      const patient = patientResponse.data;

      // Consolidate all data
      const consolidatedRecord: ConsolidatedPatientRecord = {
        patient,
        demographics: {
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          dob: patient.dob,
          address: patient.address,
          state: patient.state,
        },
        clinicalData: {
          conditions: patient.conditions || [],
          allergies: patient.allergies || [],
          medications: patient.medications || [],
          surgeries: patient.surgeries || [],
          immunizations: patient.immunizations || [],
          familyHistory: patient.familyHistory || [],
          lifestyle: patient.lifestyle || null,
          healthGoals: patient.healthGoals || [],
        },
        visitHistory: {
          appointments: appointmentsResponse.success ? (appointmentsResponse.data || []) : [],
          progressNotes: progressNotesResponse.success ? (progressNotesResponse.data || []) : [],
          prescriptions: prescriptionsResponse.success ? (prescriptionsResponse.data || []) : [],
          labResults: labResultsResponse.success ? (labResultsResponse.data || []) : [],
          labOrders: labOrdersResponse.success ? (labOrdersResponse.data || []) : [],
          vitals: vitalsResponse.success ? (vitalsResponse.data || []) : [],
        },
        communications: {
          messages: [], // Would be fetched separately
          unreadCount: 0,
        },
        summary: this.calculateSummary(
          patient,
          appointmentsResponse.success ? (appointmentsResponse.data || []) : [],
          prescriptionsResponse.success ? (prescriptionsResponse.data || []) : [],
          labResultsResponse.success ? (labResultsResponse.data || []) : [],
          labOrdersResponse.success ? (labOrdersResponse.data || []) : [],
        ),
        metadata: {
          createdAt: patient.createdAt || new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          recordVersion: 1,
        },
      };

      // Cache the record
      this.cache.set(patientId, {
        record: consolidatedRecord,
        timestamp: Date.now(),
      });

      return {
        success: true,
        data: consolidatedRecord,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CONSOLIDATION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Calculate summary statistics
   */
  private calculateSummary(
    patient: User,
    appointments: Appointment[],
    prescriptions: Prescription[],
    labResults: LabResult[],
    labOrders: LabOrder[]
  ): ConsolidatedPatientRecord['summary'] {
    const now = new Date();
    
    // Sort appointments by date
    const sortedAppointments = [...appointments].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Find next appointment
    const nextAppointment = sortedAppointments.find(
      apt => new Date(apt.date) >= now && apt.status !== 'Cancelled'
    ) || null;

    // Find last visit
    const completedAppointments = sortedAppointments.filter(
      apt => apt.status === 'Completed'
    );
    const lastVisitDate = completedAppointments.length > 0
      ? completedAppointments[completedAppointments.length - 1].date
      : null;

    // Count active medications
    const activeMedications = patient.medications?.filter(
      med => med.status === 'Active'
    ) || [];
    const activeMedicationsCount = activeMedications.length;

    // Count pending lab results
    const pendingLabResults = labOrders.filter(
      order => order.status === 'Ordered' || order.status === 'Results Ready'
    ).length;

    return {
      totalVisits: completedAppointments.length,
      totalPrescriptions: prescriptions.length,
      totalLabResults: labResults.length,
      lastVisitDate,
      nextAppointment,
      activeMedicationsCount,
      pendingLabResults,
    };
  }

  /**
   * Get patient record summary (lightweight)
   */
  async getRecordSummary(patientId: string): Promise<EMRAPIResponse<ConsolidatedPatientRecord['summary']>> {
    const recordResponse = await this.getConsolidatedRecord(patientId);
    
    if (!recordResponse.success || !recordResponse.data) {
      return {
        success: false,
        error: recordResponse.error,
        timestamp: recordResponse.timestamp,
      };
    }

    return {
      success: true,
      data: recordResponse.data.summary,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Clear cache for a patient
   */
  clearCache(patientId: string): void {
    this.cache.delete(patientId);
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.cache.clear();
  }

  /**
   * Export patient record as JSON
   */
  async exportRecord(patientId: string, format: 'json' | 'csv' = 'json'): Promise<string> {
    const recordResponse = await this.getConsolidatedRecord(patientId);
    
    if (!recordResponse.success || !recordResponse.data) {
      throw new Error('Failed to fetch patient record');
    }

    if (format === 'json') {
      return JSON.stringify(recordResponse.data, null, 2);
    }

    // CSV export would be implemented here
    throw new Error('CSV export not yet implemented');
  }

  /**
   * Get timeline view of patient record
   */
  async getTimeline(patientId: string): Promise<EMRAPIResponse<Array<{
    date: string;
    type: 'appointment' | 'prescription' | 'lab' | 'note' | 'vital';
    title: string;
    description: string;
    data: any;
  }>>> {
    const recordResponse = await this.getConsolidatedRecord(patientId);
    
    if (!recordResponse.success || !recordResponse.data) {
      return {
        success: false,
        error: recordResponse.error,
        timestamp: recordResponse.timestamp,
      };
    }

    const record = recordResponse.data;
    const timeline: Array<{
      date: string;
      type: 'appointment' | 'prescription' | 'lab' | 'note' | 'vital';
      title: string;
      description: string;
      data: any;
    }> = [];

    // Add appointments
    record.visitHistory.appointments.forEach(apt => {
      timeline.push({
        date: apt.date,
        type: 'appointment',
        title: `Appointment with ${apt.providerName}`,
        description: apt.reason,
        data: apt,
      });
    });

    // Add prescriptions
    record.visitHistory.prescriptions.forEach(rx => {
      timeline.push({
        date: rx.datePrescribed,
        type: 'prescription',
        title: `Prescription: ${rx.drug}`,
        description: `${rx.dosage} - ${rx.frequency}`,
        data: rx,
      });
    });

    // Add lab results
    record.visitHistory.labResults.forEach(lab => {
      timeline.push({
        date: lab.date,
        type: 'lab',
        title: `Lab Result: ${lab.testName}`,
        description: `${lab.components.length} components tested`,
        data: lab,
      });
    });

    // Add progress notes
    record.visitHistory.progressNotes.forEach(note => {
      timeline.push({
        date: note.date,
        type: 'note',
        title: `Progress Note`,
        description: note.content.subjective.substring(0, 100) + '...',
        data: note,
      });
    });

    // Add vitals
    record.visitHistory.vitals.forEach(vital => {
      timeline.push({
        date: vital.date,
        type: 'vital',
        title: `Vital Signs`,
        description: `BP: ${vital.bloodPressure}, HR: ${vital.heartRate}, Weight: ${vital.weight}lbs`,
        data: vital,
      });
    });

    // Sort by date (most recent first)
    timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      success: true,
      data: timeline,
      timestamp: new Date().toISOString(),
    };
  }
}

// Singleton instance
let patientRecordServiceInstance: PatientRecordService | null = null;

/**
 * Get or create Patient Record Service instance
 */
export const getPatientRecordService = (): PatientRecordService => {
  if (!patientRecordServiceInstance) {
    patientRecordServiceInstance = new PatientRecordService();
  }
  return patientRecordServiceInstance;
};

export default PatientRecordService;
