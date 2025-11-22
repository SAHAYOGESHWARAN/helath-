/**
 * Advanced EMR Features Service - 100+ Clinical & Administrative Features
 * Includes: Search, Analytics, Reporting, Workflows, Notifications, AI/ML, Scheduling, etc.
 */

import { AdvancedEMRClient } from '../src/services/advancedEMRClient';

// ============================================================================
// SEARCH & FILTERING (15+ Features)
// ============================================================================

export class SearchService {
  constructor(private client: AdvancedEMRClient) {}

  async fullTextSearch(query: string, resourceTypes?: string[]): Promise<any> {
    return this.client.request('GET', `/search/full-text?q=${encodeURIComponent(query)}${resourceTypes ? `&types=${resourceTypes.join(',')}` : ''}`);
  }

  async advancedFilterSearch(filters: Record<string, any>): Promise<any> {
    return this.client.request('POST', '/search/advanced', { filters });
  }

  async semanticSearch(query: string): Promise<any> {
    return this.client.request('POST', '/search/semantic', { query });
  }

  async fuzzySearch(term: string, resourceType: string): Promise<any> {
    return this.client.request('GET', `/search/fuzzy?term=${encodeURIComponent(term)}&type=${resourceType}`);
  }

  async searchByMetadata(metadata: Record<string, any>): Promise<any> {
    return this.client.request('POST', '/search/metadata', { metadata });
  }

  async getSearchSuggestions(term: string): Promise<any> {
    return this.client.request('GET', `/search/suggestions?term=${encodeURIComponent(term)}`);
  }

  async saveSearch(name: string, criteria: any): Promise<any> {
    return this.client.request('POST', '/search/saved', { name, criteria });
  }

  async getSavedSearches(): Promise<any> {
    return this.client.request('GET', '/search/saved');
  }

  async recentSearches(limit: number = 10): Promise<any> {
    return this.client.request('GET', `/search/recent?limit=${limit}`);
  }

  async getSearchHistory(userId: string): Promise<any> {
    return this.client.request('GET', `/search/history/${userId}`);
  }

  async searchByLocation(coordinates: [number, number], radius: number): Promise<any> {
    return this.client.request('POST', '/search/location', { coordinates, radius });
  }

  async searchByTimeRange(startDate: string, endDate: string): Promise<any> {
    return this.client.request('GET', `/search/time-range?start=${startDate}&end=${endDate}`);
  }

  async searchSimilarPatients(patientId: string): Promise<any> {
    return this.client.request('GET', `/search/similar-patients/${patientId}`);
  }

  async searchByCondition(condition: string): Promise<any> {
    return this.client.request('GET', `/search/conditions/${condition}`);
  }

  async advancedPatientSearch(criteria: {
    age?: { min: number; max: number };
    gender?: string;
    conditions?: string[];
    medications?: string[];
    allergies?: string[];
  }): Promise<any> {
    return this.client.request('POST', '/search/patients/advanced', { criteria });
  }
}

// ============================================================================
// ANALYTICS & REPORTING (15+ Features)
// ============================================================================

export class AnalyticsService {
  constructor(private client: AdvancedEMRClient) {}

  async getPatientDemographics(filters?: any): Promise<any> {
    return this.client.request('POST', '/analytics/demographics', filters || {});
  }

  async getDiseaseTrends(disease: string, timeframe: string): Promise<any> {
    return this.client.request('GET', `/analytics/trends/${disease}?timeframe=${timeframe}`);
  }

  async getMedicationUsageAnalytics(): Promise<any> {
    return this.client.request('GET', '/analytics/medications/usage');
  }

  async getAppointmentAnalytics(): Promise<any> {
    return this.client.request('GET', '/analytics/appointments');
  }

  async getLabResultsAnalytics(): Promise<any> {
    return this.client.request('GET', '/analytics/lab-results');
  }

  async getProviderPerformance(providerId: string): Promise<any> {
    return this.client.request('GET', `/analytics/providers/${providerId}/performance`);
  }

  async getDepartmentMetrics(departmentId: string): Promise<any> {
    return this.client.request('GET', `/analytics/departments/${departmentId}/metrics`);
  }

  async getPatientSatisfactionMetrics(): Promise<any> {
    return this.client.request('GET', '/analytics/satisfaction');
  }

  async getReadmissionRates(): Promise<any> {
    return this.client.request('GET', '/analytics/readmissions');
  }

  async getMortalityRates(): Promise<any> {
    return this.client.request('GET', '/analytics/mortality');
  }

  async getWaitTimeAnalytics(): Promise<any> {
    return this.client.request('GET', '/analytics/wait-times');
  }

  async getLabTurnaroundTimeMetrics(): Promise<any> {
    return this.client.request('GET', '/analytics/lab-turnaround-time');
  }

  async getRevenueAnalytics(): Promise<any> {
    return this.client.request('GET', '/analytics/revenue');
  }

  async getOutcomeMetrics(): Promise<any> {
    return this.client.request('GET', '/analytics/outcomes');
  }

  async generateCustomAnalysis(definition: any): Promise<any> {
    return this.client.request('POST', '/analytics/custom', definition);
  }

  async getTopConditions(limit: number = 10): Promise<any> {
    return this.client.request('GET', `/analytics/conditions/top?limit=${limit}`);
  }
}

// ============================================================================
// REPORTING (15+ Features)
// ============================================================================

export class ReportingService {
  constructor(private client: AdvancedEMRClient) {}

  async generatePatientReport(patientId: string): Promise<any> {
    return this.client.request('GET', `/reports/patients/${patientId}`);
  }

  async generateClinicalReport(patientId: string, reportType: string): Promise<any> {
    return this.client.request('GET', `/reports/clinical/${patientId}?type=${reportType}`);
  }

  async generateLabReport(labOrderId: string): Promise<any> {
    return this.client.request('GET', `/reports/lab/${labOrderId}`);
  }

  async generateMedicationReport(patientId: string): Promise<any> {
    return this.client.request('GET', `/reports/medications/${patientId}`);
  }

  async generateAppointmentReport(dateRange: { start: string; end: string }): Promise<any> {
    return this.client.request('POST', '/reports/appointments', dateRange);
  }

  async generateProviderReport(providerId: string, dateRange: any): Promise<any> {
    return this.client.request('POST', `/reports/providers/${providerId}`, dateRange);
  }

  async generateDepartmentReport(departmentId: string): Promise<any> {
    return this.client.request('GET', `/reports/departments/${departmentId}`);
  }

  async generateComplianceReport(complianceType: string): Promise<any> {
    return this.client.request('GET', `/reports/compliance/${complianceType}`);
  }

  async generateFinancialReport(dateRange: any): Promise<any> {
    return this.client.request('POST', '/reports/financial', dateRange);
  }

  async generateQualityReport(): Promise<any> {
    return this.client.request('GET', '/reports/quality');
  }

  async generateBulkReport(reportConfigs: any[]): Promise<any> {
    return this.client.request('POST', '/reports/bulk', { reports: reportConfigs });
  }

  async scheduleReportGeneration(reportConfig: any, schedule: string): Promise<any> {
    return this.client.request('POST', '/reports/schedule', { config: reportConfig, schedule });
  }

  async getScheduledReports(): Promise<any> {
    return this.client.request('GET', '/reports/scheduled');
  }

  async downloadReport(reportId: string, format: 'PDF' | 'EXCEL' | 'CSV'): Promise<any> {
    return this.client.request('GET', `/reports/${reportId}/download?format=${format}`, undefined, { bypassCache: true });
  }

  async shareReport(reportId: string, recipients: string[], message?: string): Promise<any> {
    return this.client.request('POST', `/reports/${reportId}/share`, { recipients, message });
  }

  async getReportHistory(): Promise<any> {
    return this.client.request('GET', '/reports/history');
  }
}

// ============================================================================
// WORKFLOW MANAGEMENT (15+ Features)
// ============================================================================

export class WorkflowService {
  constructor(private client: AdvancedEMRClient) {}

  async createWorkflow(workflowConfig: any): Promise<any> {
    return this.client.request('POST', '/workflows', workflowConfig);
  }

  async getWorkflows(): Promise<any> {
    return this.client.request('GET', '/workflows');
  }

  async getWorkflowTemplates(): Promise<any> {
    return this.client.request('GET', '/workflows/templates');
  }

  async executeWorkflow(workflowId: string, context: any): Promise<any> {
    return this.client.request('POST', `/workflows/${workflowId}/execute`, context);
  }

  async getWorkflowStatus(workflowId: string): Promise<any> {
    return this.client.request('GET', `/workflows/${workflowId}/status`);
  }

  async pauseWorkflow(workflowId: string): Promise<any> {
    return this.client.request('POST', `/workflows/${workflowId}/pause`);
  }

  async resumeWorkflow(workflowId: string): Promise<any> {
    return this.client.request('POST', `/workflows/${workflowId}/resume`);
  }

  async getWorkflowHistory(): Promise<any> {
    return this.client.request('GET', '/workflows/history');
  }

  async validateWorkflow(workflowConfig: any): Promise<any> {
    return this.client.request('POST', '/workflows/validate', workflowConfig);
  }

  async getWorkflowMetrics(workflowId: string): Promise<any> {
    return this.client.request('GET', `/workflows/${workflowId}/metrics`);
  }

  async createWorkflowTask(workflowId: string, taskConfig: any): Promise<any> {
    return this.client.request('POST', `/workflows/${workflowId}/tasks`, taskConfig);
  }

  async assignWorkflowTask(taskId: string, userId: string): Promise<any> {
    return this.client.request('POST', `/workflows/tasks/${taskId}/assign`, { userId });
  }

  async completeWorkflowTask(taskId: string, result: any): Promise<any> {
    return this.client.request('POST', `/workflows/tasks/${taskId}/complete`, result);
  }

  async getMyWorkflowTasks(): Promise<any> {
    return this.client.request('GET', '/workflows/tasks/mine');
  }

  async escalateWorkflowTask(taskId: string, reason: string): Promise<any> {
    return this.client.request('POST', `/workflows/tasks/${taskId}/escalate`, { reason });
  }

  async getWorkflowAnalytics(workflowId: string): Promise<any> {
    return this.client.request('GET', `/workflows/${workflowId}/analytics`);
  }
}

// ============================================================================
// NOTIFICATIONS & ALERTS (12+ Features)
// ============================================================================

export class NotificationService {
  constructor(private client: AdvancedEMRClient) {}

  async createAlert(alertConfig: any): Promise<any> {
    return this.client.request('POST', '/alerts', alertConfig);
  }

  async getAlerts(filter?: any): Promise<any> {
    return this.client.request('POST', '/alerts/list', filter || {});
  }

  async getMyAlerts(): Promise<any> {
    return this.client.request('GET', '/alerts/mine');
  }

  async acknowledgeAlert(alertId: string): Promise<any> {
    return this.client.request('POST', `/alerts/${alertId}/acknowledge`);
  }

  async dismissAlert(alertId: string, reason?: string): Promise<any> {
    return this.client.request('POST', `/alerts/${alertId}/dismiss`, { reason });
  }

  async escalateAlert(alertId: string): Promise<any> {
    return this.client.request('POST', `/alerts/${alertId}/escalate`);
  }

  async sendNotification(userId: string, message: string, type: string): Promise<any> {
    return this.client.request('POST', '/notifications', { userId, message, type });
  }

  async getNotificationPreferences(): Promise<any> {
    return this.client.request('GET', '/notifications/preferences');
  }

  async updateNotificationPreferences(preferences: any): Promise<any> {
    return this.client.request('PATCH', '/notifications/preferences', preferences);
  }

  async getUnreadNotifications(): Promise<any> {
    return this.client.request('GET', '/notifications/unread');
  }

  async markNotificationAsRead(notificationId: string): Promise<any> {
    return this.client.request('POST', `/notifications/${notificationId}/read`);
  }

  async createNotificationRule(rule: any): Promise<any> {
    return this.client.request('POST', '/notifications/rules', rule);
  }
}

// ============================================================================
// SCHEDULING & APPOINTMENTS (12+ Features)
// ============================================================================

export class SchedulingService {
  constructor(private client: AdvancedEMRClient) {}

  async getProviderSchedule(providerId: string, date: string): Promise<any> {
    return this.client.request('GET', `/scheduling/providers/${providerId}/schedule?date=${date}`);
  }

  async findAvailableSlots(criteria: any): Promise<any> {
    return this.client.request('POST', '/scheduling/find-slots', criteria);
  }

  async bookAppointment(bookingData: any): Promise<any> {
    return this.client.request('POST', '/scheduling/book', bookingData);
  }

  async getWaitingPatients(): Promise<any> {
    return this.client.request('GET', '/scheduling/waiting-patients');
  }

  async getScheduleConflicts(): Promise<any> {
    return this.client.request('GET', '/scheduling/conflicts');
  }

  async optimizeSchedule(providerId: string): Promise<any> {
    return this.client.request('POST', `/scheduling/providers/${providerId}/optimize`);
  }

  async blockProviderTime(providerId: string, blockData: any): Promise<any> {
    return this.client.request('POST', `/scheduling/providers/${providerId}/block`, blockData);
  }

  async getSchedulingMetrics(): Promise<any> {
    return this.client.request('GET', '/scheduling/metrics');
  }

  async syncExternalCalendar(providerId: string, calendarUrl: string): Promise<any> {
    return this.client.request('POST', `/scheduling/sync-calendar/${providerId}`, { calendarUrl });
  }

  async getAppointmentReminders(): Promise<any> {
    return this.client.request('GET', '/scheduling/reminders');
  }

  async configureReminderPolicy(policy: any): Promise<any> {
    return this.client.request('POST', '/scheduling/reminder-policy', policy);
  }

  async rescheduleAppointmentAuto(appointmentId: string): Promise<any> {
    return this.client.request('POST', `/scheduling/appointments/${appointmentId}/auto-reschedule`);
  }
}

// ============================================================================
// CLINICAL DECISION SUPPORT (10+ Features)
// ============================================================================

export class ClinicalDecisionService {
  constructor(private client: AdvancedEMRClient) {}

  async getPatientGuidelines(patientId: string): Promise<any> {
    return this.client.request('GET', `/clinical-decision/guidelines/${patientId}`);
  }

  async getInteractionWarnings(medications: string[]): Promise<any> {
    return this.client.request('POST', '/clinical-decision/interactions', { medications });
  }

  async checkContraindications(patientId: string, medication: string): Promise<any> {
    return this.client.request('POST', '/clinical-decision/contraindications', { patientId, medication });
  }

  async getDoseRecommendations(medication: string, patientInfo: any): Promise<any> {
    return this.client.request('POST', '/clinical-decision/dose-recommendations', { medication, patientInfo });
  }

  async getAlternativeMedications(medication: string): Promise<any> {
    return this.client.request('GET', `/clinical-decision/alternatives/${medication}`);
  }

  async checkClinicalGuidelines(condition: string): Promise<any> {
    return this.client.request('GET', `/clinical-decision/guidelines/${condition}`);
  }

  async getRiskScore(patientId: string, riskType: string): Promise<any> {
    return this.client.request('GET', `/clinical-decision/risk-score/${patientId}?type=${riskType}`);
  }

  async getEvidenceBasedPractices(condition: string): Promise<any> {
    return this.client.request('GET', `/clinical-decision/evidence/${condition}`);
  }

  async validateOrder(orderId: string): Promise<any> {
    return this.client.request('GET', `/clinical-decision/validate-order/${orderId}`);
  }

  async getLabOrderSuggestions(patientId: string, condition: string): Promise<any> {
    return this.client.request('POST', '/clinical-decision/lab-suggestions', { patientId, condition });
  }
}

// ============================================================================
// DATA EXPORT & INTEGRATION (10+ Features)
// ============================================================================

export class DataExportService {
  constructor(private client: AdvancedEMRClient) {}

  async exportPatientData(patientId: string, format: string): Promise<any> {
    return this.client.request('GET', `/export/patient/${patientId}?format=${format}`, undefined, { bypassCache: true });
  }

  async exportContinuityOfCare(patientId: string): Promise<any> {
    return this.client.request('GET', `/export/ccda/${patientId}`);
  }

  async exportFHIR(resourceType: string, patientId?: string): Promise<any> {
    const url = patientId 
      ? `/export/fhir/${resourceType}?patient=${patientId}`
      : `/export/fhir/${resourceType}`;
    return this.client.request('GET', url, undefined, { bypassCache: true });
  }

  async exportLabResults(patientId: string, format: string): Promise<any> {
    return this.client.request('GET', `/export/lab-results/${patientId}?format=${format}`, undefined, { bypassCache: true });
  }

  async scheduleExport(config: any): Promise<any> {
    return this.client.request('POST', '/export/schedule', config);
  }

  async getExportHistory(): Promise<any> {
    return this.client.request('GET', '/export/history');
  }

  async requestDataToPortability(patientId: string): Promise<any> {
    return this.client.request('POST', `/export/portability/${patientId}`);
  }

  async integrateWithEHR(config: any): Promise<any> {
    return this.client.request('POST', '/integration/ehr', config);
  }

  async syncWithHL7(config: any): Promise<any> {
    return this.client.request('POST', '/integration/hl7', config);
  }

  async subscribeToDataUpdates(resourceType: string, callback: string): Promise<any> {
    return this.client.request('POST', '/integration/subscribe', { resourceType, callback });
  }
}

// ============================================================================
// PATIENT ENGAGEMENT (10+ Features)
// ============================================================================

export class PatientEngagementService {
  constructor(private client: AdvancedEMRClient) {}

  async getPatientPortal(patientId: string): Promise<any> {
    return this.client.request('GET', `/patient-engagement/portal/${patientId}`);
  }

  async shareRecordsWithPatient(patientId: string, recordIds: string[]): Promise<any> {
    return this.client.request('POST', `/patient-engagement/${patientId}/share-records`, { recordIds });
  }

  async getPatientEducationResources(condition: string): Promise<any> {
    return this.client.request('GET', `/patient-engagement/education/${condition}`);
  }

  async trackPatientGoals(patientId: string): Promise<any> {
    return this.client.request('GET', `/patient-engagement/goals/${patientId}`);
  }

  async createPatientGoal(patientId: string, goal: any): Promise<any> {
    return this.client.request('POST', `/patient-engagement/goals/${patientId}`, goal);
  }

  async getPatientPreferences(patientId: string): Promise<any> {
    return this.client.request('GET', `/patient-engagement/preferences/${patientId}`);
  }

  async updatePatientPreferences(patientId: string, preferences: any): Promise<any> {
    return this.client.request('PATCH', `/patient-engagement/preferences/${patientId}`, preferences);
  }

  async sendPatientMessage(patientId: string, message: string): Promise<any> {
    return this.client.request('POST', `/patient-engagement/messages/${patientId}`, { message });
  }

  async getPatientSurveys(patientId: string): Promise<any> {
    return this.client.request('GET', `/patient-engagement/surveys/${patientId}`);
  }

  async submitSurveyResponse(surveyId: string, responses: any): Promise<any> {
    return this.client.request('POST', `/patient-engagement/surveys/${surveyId}/submit`, responses);
  }
}

// ============================================================================
// COMPLIANCE & AUDIT (12+ Features)
// ============================================================================

export class ComplianceService {
  constructor(private client: AdvancedEMRClient) {}

  async getAuditLog(filters?: any): Promise<any> {
    return this.client.request('POST', '/compliance/audit-log', filters || {});
  }

  async trackAccessLog(resourceId: string): Promise<any> {
    return this.client.request('GET', `/compliance/access-log/${resourceId}`);
  }

  async checkHIPAACompliance(entityId: string): Promise<any> {
    return this.client.request('GET', `/compliance/hipaa/${entityId}`);
  }

  async checkGDPRCompliance(patientId: string): Promise<any> {
    return this.client.request('GET', `/compliance/gdpr/${patientId}`);
  }

  async generateComplianceReport(reportType: string, dateRange: any): Promise<any> {
    return this.client.request('POST', `/compliance/reports/${reportType}`, dateRange);
  }

  async trackConsentHistory(patientId: string): Promise<any> {
    return this.client.request('GET', `/compliance/consent/${patientId}`);
  }

  async recordConsent(patientId: string, consentData: any): Promise<any> {
    return this.client.request('POST', `/compliance/consent/${patientId}`, consentData);
  }

  async revokeConsent(consentId: string): Promise<any> {
    return this.client.request('DELETE', `/compliance/consent/${consentId}`);
  }

  async trackDataRetention(patientId: string): Promise<any> {
    return this.client.request('GET', `/compliance/retention/${patientId}`);
  }

  async requestDataDeletion(patientId: string): Promise<any> {
    return this.client.request('POST', `/compliance/deletion/${patientId}`);
  }

  async verifyDataIntegrity(resourceId: string): Promise<any> {
    return this.client.request('GET', `/compliance/integrity/${resourceId}`);
  }

  async getComplianceMetrics(): Promise<any> {
    return this.client.request('GET', '/compliance/metrics');
  }
}

// ============================================================================
// ML/AI ANALYTICS (10+ Features)
// ============================================================================

export class AIAnalyticsService {
  constructor(private client: AdvancedEMRClient) {}

  async predictReadmissionRisk(patientId: string): Promise<any> {
    return this.client.request('GET', `/ai/readmission-risk/${patientId}`);
  }

  async detectAnomalies(patientId: string): Promise<any> {
    return this.client.request('GET', `/ai/anomalies/${patientId}`);
  }

  async predictDiseaseProbability(patientId: string, disease: string): Promise<any> {
    return this.client.request('GET', `/ai/disease-probability/${patientId}?disease=${disease}`);
  }

  async getPersonalizedRecommendations(patientId: string): Promise<any> {
    return this.client.request('GET', `/ai/recommendations/${patientId}`);
  }

  async analyzeTreatmentResponse(patientId: string, treatmentId: string): Promise<any> {
    return this.client.request('GET', `/ai/treatment-response/${patientId}/${treatmentId}`);
  }

  async getProviderInsights(providerId: string): Promise<any> {
    return this.client.request('GET', `/ai/provider-insights/${providerId}`);
  }

  async detectOutliersInData(resourceType: string): Promise<any> {
    return this.client.request('GET', `/ai/outliers/${resourceType}`);
  }

  async predictNoShowRate(appointmentId: string): Promise<any> {
    return this.client.request('GET', `/ai/no-show-risk/${appointmentId}`);
  }

  async classifyDocuments(documentIds: string[]): Promise<any> {
    return this.client.request('POST', '/ai/classify-documents', { documentIds });
  }

  async extractEntitiesFromNotes(noteId: string): Promise<any> {
    return this.client.request('GET', `/ai/extract-entities/${noteId}`);
  }
}

// ============================================================================
// SERVICE FACTORY
// ============================================================================

export class AdvancedEMRFeaturesFactory {
  static createSearchService(client: AdvancedEMRClient): SearchService {
    return new SearchService(client);
  }

  static createAnalyticsService(client: AdvancedEMRClient): AnalyticsService {
    return new AnalyticsService(client);
  }

  static createReportingService(client: AdvancedEMRClient): ReportingService {
    return new ReportingService(client);
  }

  static createWorkflowService(client: AdvancedEMRClient): WorkflowService {
    return new WorkflowService(client);
  }

  static createNotificationService(client: AdvancedEMRClient): NotificationService {
    return new NotificationService(client);
  }

  static createSchedulingService(client: AdvancedEMRClient): SchedulingService {
    return new SchedulingService(client);
  }

  static createClinicalDecisionService(client: AdvancedEMRClient): ClinicalDecisionService {
    return new ClinicalDecisionService(client);
  }

  static createDataExportService(client: AdvancedEMRClient): DataExportService {
    return new DataExportService(client);
  }

  static createPatientEngagementService(client: AdvancedEMRClient): PatientEngagementService {
    return new PatientEngagementService(client);
  }

  static createComplianceService(client: AdvancedEMRClient): ComplianceService {
    return new ComplianceService(client);
  }

  static createAIAnalyticsService(client: AdvancedEMRClient): AIAnalyticsService {
    return new AIAnalyticsService(client);
  }

  static createAllServices(client: AdvancedEMRClient) {
    return {
      search: this.createSearchService(client),
      analytics: this.createAnalyticsService(client),
      reporting: this.createReportingService(client),
      workflows: this.createWorkflowService(client),
      notifications: this.createNotificationService(client),
      scheduling: this.createSchedulingService(client),
      clinicalDecision: this.createClinicalDecisionService(client),
      dataExport: this.createDataExportService(client),
      patientEngagement: this.createPatientEngagementService(client),
      compliance: this.createComplianceService(client),
      aiAnalytics: this.createAIAnalyticsService(client),
    };
  }
}

export default AdvancedEMRFeaturesFactory;
