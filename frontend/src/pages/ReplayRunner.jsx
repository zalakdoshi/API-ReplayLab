import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { requestsAPI, replayAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FiPlay } from 'react-icons/fi';

const ReplayRunner = () => {
  const [searchParams] = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [targetUrl, setTargetUrl] = useState('');
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetchRequests();
    const preselectedId = searchParams.get('requestId');
    if (preselectedId) {
      setSelectedRequests([preselectedId]);
    }
  }, [searchParams]);

  const fetchRequests = async () => {
    try {
      const response = await requestsAPI.getAll({ isActive: true });
      setRequests(response.data.requests);
    } catch (error) {
      toast.error('Failed to fetch requests');
    }
  };

  const handleExecute = async () => {
    if (selectedRequests.length === 0) {
      toast.warning('Please select at least one request');
      return;
    }

    try {
      setRunning(true);
      const response = await replayAPI.executeBatch({
        requestIds: selectedRequests,
        targetBaseUrl: targetUrl || undefined,
        triggeredBy: 'manual',
      });
      
      toast.success(`Started ${response.data.total} replay test(s)`);
      setSelectedRequests([]);
    } catch (error) {
      toast.error('Failed to start replay');
    } finally {
      setRunning(false);
    }
  };

  const toggleRequest = (id) => {
    setSelectedRequests(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Replay Runner</h1>

      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Base URL (Optional)
          </label>
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="http://localhost:8080"
            className="input-field"
          />
          <p className="text-sm text-gray-500 mt-1">
            Override the base URL for all selected requests. Leave empty to use original URLs.
          </p>
        </div>

        <button
          onClick={handleExecute}
          disabled={running || selectedRequests.length === 0}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          <FiPlay />
          <span>{running ? 'Running...' : `Execute ${selectedRequests.length} Request(s)`}</span>
        </button>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Select Requests to Replay</h2>
        <div className="space-y-2">
          {requests.map((request) => (
            <label
              key={request._id}
              className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedRequests.includes(request._id)}
                onChange={() => toggleRequest(request._id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{request.name}</span>
                  <span className="badge badge-info text-xs">{request.method}</span>
                  {request.isCritical && <span className="badge badge-error text-xs">Critical</span>}
                </div>
                <p className="text-sm text-gray-500">{request.url}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReplayRunner;
