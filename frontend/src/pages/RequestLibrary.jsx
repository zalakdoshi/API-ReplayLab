import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiPlay } from 'react-icons/fi';
import { requestsAPI } from '../services/api';
import { toast } from 'react-toastify';

const RequestLibrary = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestsAPI.getAll({ search });
      setRequests(response.data.requests);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    
    try {
      await requestsAPI.delete(id);
      toast.success('Request deleted successfully');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to delete request');
    }
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: 'bg-green-100 text-green-800',
      POST: 'bg-blue-100 text-blue-800',
      PUT: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800',
      PATCH: 'bg-purple-100 text-purple-800',
    };
    return colors[method] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Request Library</h1>
        <Link to="/requests/create" className="btn-primary flex items-center space-x-2">
          <FiPlus /> <span>New Request</span>
        </Link>
      </div>

      <div className="card">
        <input
          type="text"
          placeholder="Search requests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && fetchRequests()}
          className="input-field"
        />
      </div>

      <div className="grid gap-4">
        {requests.map((request) => (
          <div key={request._id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`badge ${getMethodColor(request.method)}`}>
                    {request.method}
                  </span>
                  <h3 className="text-lg font-semibold">{request.name}</h3>
                  {request.isCritical && (
                    <span className="badge badge-error">Critical</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{request.url}</p>
                {request.description && (
                  <p className="text-sm text-gray-500">{request.description}</p>
                )}
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-gray-500">Category: {request.category}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link to={`/replay?requestId=${request._id}`} className="btn-secondary p-2">
                  <FiPlay className="h-5 w-5" />
                </Link>
                <Link to={`/requests/edit/${request._id}`} className="btn-secondary p-2">
                  <FiEdit className="h-5 w-5" />
                </Link>
                <button onClick={() => handleDelete(request._id)} className="btn-danger p-2">
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestLibrary;
