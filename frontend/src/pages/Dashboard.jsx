import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDatabase, FiPlay, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
import { requestsAPI, replayAPI, reportsAPI } from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    requests: { total: 0, active: 0, critical: 0 },
    replays: { total: 0, completed: 0, failed: 0, regressionsDetected: 0 },
    reports: { total: 0, passed: 0, failed: 0, warnings: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [requestsRes, replaysRes, reportsRes] = await Promise.all([
        requestsAPI.getStats(),
        replayAPI.getStats(),
        reportsAPI.getStats()
      ]);

      setStats({
        requests: requestsRes.data,
        replays: replaysRes.data,
        reports: reportsRes.data
      });

      // Get recent activity
      const recentRuns = await replayAPI.getAllRuns({ limit: 5 });
      setRecentActivity(recentRuns.data.runs);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      // Log suppressed for production
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/replay" className="btn-primary">
          Run New Replay
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-3xl font-bold text-gray-900">{stats.requests.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiDatabase className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">
              {stats.requests.active} active · {stats.requests.critical} critical
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Replays</p>
              <p className="text-3xl font-bold text-gray-900">{stats.replays.total}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiPlay className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">
              {stats.replays.completed} completed · {stats.replays.failed} failed
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Regressions</p>
              <p className="text-3xl font-bold text-red-600">{stats.replays.regressionsDetected}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FiAlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">
              Detected across all runs
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reports</p>
              <p className="text-3xl font-bold text-gray-900">{stats.reports.total}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiCheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">
              {stats.reports.passed} passed · {stats.reports.failed} failed
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Replay Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((run) => (
              <div key={run._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    run.status === 'completed' ? 'bg-green-100' :
                    run.status === 'failed' ? 'bg-red-100' :
                    'bg-yellow-100'
                  }`}>
                    {run.status === 'completed' ? (
                      <FiCheckCircle className="h-5 w-5 text-green-600" />
                    ) : run.status === 'failed' ? (
                      <FiAlertCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <FiClock className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {run.requestId?.name || 'Unknown Request'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {run.requestId?.method} · {new Date(run.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {run.regression?.detected && (
                    <span className="badge badge-error">
                      Regression Detected
                    </span>
                  )}
                  <Link 
                    to={`/replay/results/${run._id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/requests/create" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FiDatabase className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Request</h3>
            <p className="text-sm text-gray-600">Add a new API request to your library</p>
          </div>
        </Link>

        <Link to="/replay" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FiPlay className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Run Replay</h3>
            <p className="text-sm text-gray-600">Execute replay tests on your APIs</p>
          </div>
        </Link>

        <Link to="/reports" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <FiCheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Reports</h3>
            <p className="text-sm text-gray-600">Check regression reports and trends</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
