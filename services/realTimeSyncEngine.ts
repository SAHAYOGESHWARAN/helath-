/**
 * Advanced Real-Time Synchronization Engine
 * Features: WebSocket sync, offline support, change detection, conflict resolution, local storage
 */

import { AdvancedEMRClient, type RealTimeEvent } from '../src/services/advancedEMRClient';
import type { APIResponse } from '../src/types';

export interface SyncConfig {
  enableAutoSync: boolean;
  autoSyncInterval: number;
  enableWebSocket: boolean;
  enableOfflineMode: boolean;
  conflictResolutionStrategy: 'LOCAL' | 'REMOTE' | 'MERGE' | 'MANUAL';
  maxSyncRetries: number;
  compressionEnabled: boolean;
}

export interface LocalChange {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  resourceType: string;
  resourceId: string;
  data: Record<string, unknown>;
  timestamp: string;
  synced: boolean;
  attempts: number;
}

export interface SyncState {
  isSyncing: boolean;
  lastSyncTime: string | null;
  nextSyncTime: string | null;
  pendingChanges: number;
  syncErrors: Array<{ error: string; timestamp: string }>;
  offlineMode: boolean;
  lastHeartbeat: string | null;
  syncStats: {
    totalSyncs: number;
    successfulSyncs: number;
    failedSyncs: number;
    averageSyncTime: number;
  };
}

export class RealTimeSyncEngine {
  private client: AdvancedEMRClient;
  private config: SyncConfig;
  private state: SyncState;
  private autoSyncTimer: ReturnType<typeof setInterval> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private localChanges: Map<string, LocalChange> = new Map();
  private syncQueue: string[] = [];
  private networkListener: ((online: boolean) => void) | null = null;
  private syncListeners: Array<(state: SyncState) => void> = [];

  constructor(client: AdvancedEMRClient, config?: Partial<SyncConfig>) {
    this.client = client;
    this.config = {
      enableAutoSync: true,
      autoSyncInterval: 30000,
      enableWebSocket: true,
      enableOfflineMode: true,
      conflictResolutionStrategy: 'MERGE',
      maxSyncRetries: 3,
      compressionEnabled: false,
      ...config,
    };

    this.state = {
      isSyncing: false,
      lastSyncTime: null,
      nextSyncTime: null,
      pendingChanges: 0,
      syncErrors: [],
      offlineMode: typeof navigator !== 'undefined' ? !navigator.onLine : false,
      lastHeartbeat: null,
      syncStats: {
        totalSyncs: 0,
        successfulSyncs: 0,
        failedSyncs: 0,
        averageSyncTime: 0,
      },
    };

    this.initializeListeners();
    this.loadLocalChanges();
  }

  /**
   * === INITIALIZATION ===
   */

  private initializeListeners(): void {
    // Network listener
    this.networkListener = (online: boolean) => {
      this.state.offlineMode = !online;
      this.notifyListeners();
      if (online && this.config.enableAutoSync) {
        this.syncNow();
      }
    };

    window.addEventListener('online', () => this.networkListener?.(true));
    window.addEventListener('offline', () => this.networkListener?.(false));

    // WebSocket setup
    if (this.config.enableWebSocket) {
      this.setupWebSocketSync();
    }
  }

  private setupWebSocketSync(): void {
    const unsubscribeConnect = this.client.subscribeToEvents('ws-connected', () => {
      console.log('WebSocket connected, starting sync');
      this.syncNow();
    });

    const unsubscribeEvent = this.client.subscribeToEvents('event', (event: RealTimeEvent) => {
      this.handleRemoteChange(event);
    });

    const unsubscribeError = this.client.subscribeToEvents('ws-error', (error: RealTimeEvent) => {
      this.addSyncError(`WebSocket error: ${error.data?.message || 'Unknown error'}`);
    });

    // Store unsubscribe functions
    this.wsUnsubscribers = [unsubscribeConnect, unsubscribeEvent, unsubscribeError];
  }

  private wsUnsubscribers: Array<() => void> = [];

  /**
   * === SYNC CONTROL ===
   */

  async startAutoSync(interval?: number): Promise<void> {
    const syncInterval = interval || this.config.autoSyncInterval;
    this.config.autoSyncInterval = syncInterval;
    this.config.enableAutoSync = true;

    // Initial sync
    await this.syncNow();

    // Periodic sync
    this.autoSyncTimer = setInterval(() => this.syncNow(), syncInterval);
  }

  stopAutoSync(): void {
    if (this.autoSyncTimer) {
      clearInterval(this.autoSyncTimer);
      this.autoSyncTimer = null;
    }
    this.config.enableAutoSync = false;
  }

  async syncNow(): Promise<void> {
    if (this.state.isSyncing) return;
    if (this.state.offlineMode) {
      console.log('Offline mode: queueing sync for later');
      return;
    }

    this.state.isSyncing = true;
    const startTime = Date.now();

    try {
      // Process pending local changes first
      await this.processPendingChanges();

      // Then sync all data
      const result = await this.performFullSync();

      if (result) {
        this.state.syncStats.successfulSyncs++;
        this.state.lastSyncTime = new Date().toISOString();
      } else {
        this.state.syncStats.failedSyncs++;
      }

      this.state.syncStats.totalSyncs++;
      const syncTime = Date.now() - startTime;
      this.state.syncStats.averageSyncTime =
        (this.state.syncStats.averageSyncTime * (this.state.syncStats.totalSyncs - 1) + syncTime) / this.state.syncStats.totalSyncs;

      // Clear old sync errors
      this.state.syncErrors = this.state.syncErrors.slice(-10);
    } finally {
      this.state.isSyncing = false;
      this.state.nextSyncTime = new Date(Date.now() + this.config.autoSyncInterval).toISOString();
      this.notifyListeners();
    }
  }

  /**
   * === CHANGE TRACKING ===
   */

  trackLocalChange(resourceType: string, resourceId: string, data: Record<string, unknown>, type: 'CREATE' | 'UPDATE' | 'DELETE'): void {
    const changeId = `${resourceType}:${resourceId}:${Date.now()}`;
    const change: LocalChange = {
      id: changeId,
      type,
      resourceType,
      resourceId,
      data,
      timestamp: new Date().toISOString(),
      synced: false,
      attempts: 0,
    };

    this.localChanges.set(changeId, change);
    this.state.pendingChanges = this.localChanges.size;
    this.saveLocalChanges();
    this.notifyListeners();
  }

  private async processPendingChanges(): Promise<void> {
    const unsyncedChanges = Array.from(this.localChanges.values()).filter((c) => !c.synced);

    for (const change of unsyncedChanges) {
      if (change.attempts >= this.config.maxSyncRetries) {
        this.addSyncError(`Max retries exceeded for ${change.resourceType}:${change.resourceId}`);
        continue;
      }

      try {
        let response: APIResponse;
        const endpoint = `/${change.resourceType}/${change.resourceId}`;

        switch (change.type) {
          case 'CREATE':
            response = await (this.client as unknown as { request: (method: string, endpoint: string, data: Record<string, unknown>) => Promise<APIResponse> }).request('POST', `/${change.resourceType}`, change.data);
            break;
          case 'UPDATE':
            response = await (this.client as unknown as { request: (method: string, endpoint: string, data: Record<string, unknown>) => Promise<APIResponse> }).request('PATCH', endpoint, change.data);
            break;
          case 'DELETE':
            response = await (this.client as unknown as { request: (method: string, endpoint: string) => Promise<APIResponse> }).request('DELETE', endpoint);
            break;
        }

        if (response.success) {
          change.synced = true;
          this.localChanges.delete(change.id);
        } else {
          change.attempts++;
        }
      } catch (error: unknown) {
        change.attempts++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.addSyncError(`Failed to sync ${change.resourceType}: ${errorMessage}`);
      }
    }

    this.state.pendingChanges = this.localChanges.size;
    this.saveLocalChanges();
  }

  /**
   * === REMOTE CHANGE HANDLING ===
   */

  private handleRemoteChange(event: RealTimeEvent): void {
    const { resourceType, resourceId, data, timestamp } = event;

    // Check for local changes to the same resource
    const localChange = Array.from(this.localChanges.values()).find(
      (c) => c.resourceType === resourceType && c.resourceId === resourceId && !c.synced
    );

    if (localChange) {
      this.handleConflict(localChange, data);
    } else {
      // Apply remote change
      this.applyRemoteChange(resourceType, resourceId, data, timestamp);
    }
  }

  private handleConflict(localChange: LocalChange, remoteData: Record<string, unknown>): void {
    console.log(`Conflict detected for ${localChange.resourceType}:${localChange.resourceId}`);

    let resolvedData = remoteData;

    switch (this.config.conflictResolutionStrategy) {
      case 'LOCAL':
        resolvedData = localChange.data;
        break;
      case 'REMOTE':
        resolvedData = remoteData;
        break;
      case 'MERGE':
        resolvedData = this.mergeChanges(localChange.data, remoteData);
        break;
      case 'MANUAL':
        this.notifyListeners(); // Let UI handle it
        return;
    }

    // Update local change with resolved data
    localChange.data = resolvedData;
    localChange.attempts = 0; // Reset attempts
  }

  private mergeChanges(localData: Record<string, unknown>, remoteData: Record<string, unknown>): Record<string, unknown> {
    return {
      ...remoteData,
      ...localData,
      _mergedAt: new Date().toISOString(),
      _mergedFrom: { local: localData, remote: remoteData },
    };
  }

  private applyRemoteChange(resourceType: string, resourceId: string, data: unknown, timestamp: string): void {
    const cacheKey = `${resourceType}:${resourceId}`;
    // This would typically update local storage or state management
    console.log(`Applying remote change: ${cacheKey} at ${timestamp}`);
  }

  /**
   * === FULL SYNC ===
   */

  private async performFullSync(): Promise<boolean> {
    try {
      // Could sync various resources in parallel
      const results = await Promise.all([
        this.syncPatients(),
        this.syncAppointments(),
        this.syncPrescriptions(),
        this.syncLabResults(),
      ]);

      return results.every((r) => r === true);
    } catch (error) {
      console.error('Full sync failed:', error);
      return false;
    }
  }

  private async syncPatients(): Promise<boolean> {
    try {
      const response = await (this.client as unknown as { request: (method: string, endpoint: string) => Promise<APIResponse> }).request('GET', '/patients/sync');
      return response.success ?? false;
    } catch {
      return false;
    }
  }

  private async syncAppointments(): Promise<boolean> {
    try {
      const response = await (this.client as unknown as { request: (method: string, endpoint: string) => Promise<APIResponse> }).request('GET', '/appointments/sync');
      return response.success ?? false;
    } catch {
      return false;
    }
  }

  private async syncPrescriptions(): Promise<boolean> {
    try {
      const response = await (this.client as unknown as { request: (method: string, endpoint: string) => Promise<APIResponse> }).request('GET', '/prescriptions/sync');
      return response.success ?? false;
    } catch {
      return false;
    }
  }

  private async syncLabResults(): Promise<boolean> {
    try {
      const response = await (this.client as unknown as { request: (method: string, endpoint: string) => Promise<APIResponse> }).request('GET', '/lab-results/sync');
      return response.success ?? false;
    } catch {
      return false;
    }
  }

  /**
   * === HEARTBEAT ===
   */

  startHeartbeat(interval: number = 30000): void {
    this.heartbeatTimer = setInterval(() => {
      this.state.lastHeartbeat = new Date().toISOString();
      this.notifyListeners();
    }, interval);
  }

  stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * === LOCAL STORAGE ===
   */

  private saveLocalChanges(): void {
    const changes = Array.from(this.localChanges.values());
    localStorage.setItem('emr_local_changes', JSON.stringify(changes));
  }

  private loadLocalChanges(): void {
    try {
      const stored = localStorage.getItem('emr_local_changes');
      if (stored) {
        const changes = JSON.parse(stored);
        changes.forEach((change: LocalChange) => {
          this.localChanges.set(change.id, change);
        });
        this.state.pendingChanges = this.localChanges.size;
      }
    } catch (error) {
      console.error('Failed to load local changes:', error);
    }
  }

  /**
   * === STATE & LISTENERS ===
   */

  getState(): SyncState {
    return { ...this.state };
  }

  onStateChange(listener: (state: SyncState) => void): () => void {
    this.syncListeners.push(listener);
    return () => {
      const index = this.syncListeners.indexOf(listener);
      if (index > -1) this.syncListeners.splice(index, 1);
    };
  }

  private notifyListeners(): void {
    this.syncListeners.forEach((listener) => {
      try {
        listener(this.getState());
      } catch (error) {
        console.error('Error in sync state listener:', error);
      }
    });
  }

  private addSyncError(error: string): void {
    this.state.syncErrors.push({
      error,
      timestamp: new Date().toISOString(),
    });
    this.state.syncErrors = this.state.syncErrors.slice(-10);
  }

  /**
   * === CLEANUP ===
   */

  destroy(): void {
    this.stopAutoSync();
    this.stopHeartbeat();
    if (this.networkListener) {
      window.removeEventListener('online', () => this.networkListener?.(true));
      window.removeEventListener('offline', () => this.networkListener?.(false));
    }
    this.syncListeners = [];
    this.localChanges.clear();
  }
}

export default RealTimeSyncEngine;
