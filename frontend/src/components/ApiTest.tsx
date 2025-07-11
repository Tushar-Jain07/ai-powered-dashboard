import React, { useState } from 'react';
import { apiUtils } from '../services/api';

interface ApiTestProps {
  onClose?: () => void;
}

const ApiTest: React.FC<ApiTestProps> = ({ onClose }) => {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [connectivityStatus, setConnectivityStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [apiConfig, setApiConfig] = useState(apiUtils.getApiConfig());

  const testHealth = async () => {
    setLoading(true);
    try {
      const result = await apiUtils.checkApiHealth();
      setHealthStatus(result);
    } catch (error) {
      setHealthStatus({ status: 'error', error: error });
    } finally {
      setLoading(false);
    }
  };

  const testConnectivity = async () => {
    setLoading(true);
    try {
      const result = await apiUtils.testConnectivity(5000);
      setConnectivityStatus(result);
    } catch (error) {
      setConnectivityStatus({ connected: false, error: error });
    } finally {
      setLoading(false);
    }
  };

  const refreshConfig = () => {
    setApiConfig(apiUtils.getApiConfig());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">API Connectivity Test</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* API Configuration */}
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">API Configuration</h3>
          <div className="text-sm space-y-1">
            <div><strong>Base URL:</strong> {apiConfig.baseURL}</div>
            <div><strong>Timeout:</strong> {apiConfig.timeout}ms</div>
            <div><strong>Environment:</strong> {apiConfig.environment.isProduction ? 'Production' : 'Development'}</div>
          </div>
          <button
            onClick={refreshConfig}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Refresh Config
          </button>
        </div>

        {/* Health Check */}
        <div className="mb-4">
          <button
            onClick={testHealth}
            disabled={loading}
            className="w-full mb-2 px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test API Health'}
          </button>
          {healthStatus && (
            <div className={`p-3 rounded text-sm ${
              healthStatus.status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <div><strong>Status:</strong> {healthStatus.status}</div>
              {healthStatus.error && <div><strong>Error:</strong> {healthStatus.error}</div>}
              {healthStatus.data && <div><strong>Response:</strong> {JSON.stringify(healthStatus.data, null, 2)}</div>}
            </div>
          )}
        </div>

        {/* Connectivity Test */}
        <div className="mb-4">
          <button
            onClick={testConnectivity}
            disabled={loading}
            className="w-full mb-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Connectivity'}
          </button>
          {connectivityStatus && (
            <div className={`p-3 rounded text-sm ${
              connectivityStatus.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <div><strong>Connected:</strong> {connectivityStatus.connected ? 'Yes' : 'No'}</div>
              {connectivityStatus.error && <div><strong>Error:</strong> {connectivityStatus.error}</div>}
              {connectivityStatus.timeout && <div><strong>Timeout:</strong> Yes</div>}
              {connectivityStatus.responseTime && <div><strong>Response Time:</strong> {connectivityStatus.responseTime}ms</div>}
            </div>
          )}
        </div>

        {/* Troubleshooting Tips */}
        <div className="text-sm text-gray-600">
          <h4 className="font-semibold mb-2">Troubleshooting Tips:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Ensure backend server is running on port 5003</li>
            <li>Check if proxy is correctly configured in vite.config.ts</li>
            <li>Verify CORS settings on the backend</li>
            <li>Check network connectivity and firewall settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApiTest; 