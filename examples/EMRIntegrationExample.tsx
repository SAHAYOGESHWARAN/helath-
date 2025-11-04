/**
 * EMR Integration Example Component
 * 
 * Example showing how to use the EMR API integration in a React component.
 */

import React, { useEffect, useState } from 'react';
import { useEMRIntegration } from '../hooks/useEMRIntegration';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/shared/Card';
import { SparklesIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '../components/shared/Icons';

const EMRIntegrationExample: React.FC = () => {
  const { user } = useAuth();
  const {
    state,
    syncPatientData,
    syncAppointments,
    syncPrescriptions,
    syncLabResults,
    syncAll,
    startAutoSync,
    stopAutoSync,
    isAutoSyncActive,
    checkHealth,
  } = useEMRIntegration();

  const [healthStatus, setHealthStatus] = useState<boolean | null>(null);

  useEffect(() => {
    // Check EMR health on mount
    checkHealth().then(setHealthStatus);
  }, [checkHealth]);

  const handleSyncAll = async () => {
    if (user?.id) {
      await syncAll(user.id);
    }
  };

  const handleToggleAutoSync = () => {
    if (isAutoSyncActive) {
      stopAutoSync();
    } else if (user?.id) {
      startAutoSync(60000); // Sync every 60 seconds
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">EMR Integration Status</h2>
          <div className="flex items-center gap-2">
            {healthStatus === true ? (
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
            ) : healthStatus === false ? (
              <XCircleIcon className="w-6 h-6 text-red-500" />
            ) : (
              <div className="w-6 h-6 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
            )}
            <span className="text-sm text-gray-600">
              {state.isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Sync Status</p>
            <p className="text-lg font-semibold">
              {state.isSyncing ? (
                <span className="flex items-center gap-2">
                  <ArrowPathIcon className="w-5 h-5 animate-spin text-primary-600" />
                  Syncing...
                </span>
              ) : (
                <span className="text-green-600">Idle</span>
              )}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Auto Sync</p>
            <p className="text-lg font-semibold">
              {isAutoSyncActive ? (
                <span className="text-green-600">Active</span>
              ) : (
                <span className="text-gray-400">Inactive</span>
              )}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Last Sync</p>
            <p className="text-lg font-semibold">
              {state.lastSyncTime ? (
                state.lastSyncTime.toLocaleTimeString()
              ) : (
                <span className="text-gray-400">Never</span>
              )}
            </p>
          </div>
        </div>

        {state.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm">
              <strong>Error:</strong> {state.error}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSyncAll}
            disabled={state.isSyncing || !user?.id}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <SparklesIcon className="w-5 h-5" />
            Sync All Data
          </button>

          <button
            onClick={() => user?.id && syncPatientData(user.id)}
            disabled={state.isSyncing || !user?.id}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Sync Patient Data
          </button>

          <button
            onClick={() => user?.id && syncAppointments(user.id)}
            disabled={state.isSyncing || !user?.id}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Sync Appointments
          </button>

          <button
            onClick={() => user?.id && syncPrescriptions(user.id)}
            disabled={state.isSyncing || !user?.id}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Sync Prescriptions
          </button>

          <button
            onClick={() => user?.id && syncLabResults(user.id)}
            disabled={state.isSyncing || !user?.id}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Sync Lab Results
          </button>

          <button
            onClick={handleToggleAutoSync}
            disabled={!user?.id || !state.isConnected}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isAutoSyncActive
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            } disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed`}
          >
            {isAutoSyncActive ? 'Stop Auto Sync' : 'Start Auto Sync'}
          </button>

          <button
            onClick={() => checkHealth().then(setHealthStatus)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Check Health
          </button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Integration Information</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>API URL:</strong>{' '}
            {process.env.VITE_EMR_API_URL || 'Not configured'}
          </p>
          <p>
            <strong>API Key:</strong>{' '}
            {process.env.VITE_EMR_API_KEY ? '***configured***' : 'Not configured'}
          </p>
          <p>
            <strong>Connection Status:</strong>{' '}
            {state.isConnected ? (
              <span className="text-green-600">Connected</span>
            ) : (
              <span className="text-red-600">Disconnected</span>
            )}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default EMRIntegrationExample;

