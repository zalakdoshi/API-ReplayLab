import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { requestsAPI } from '../services/api';
import { toast } from 'react-toastify';

const CreateRequest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    method: 'GET',
    url: '',
    headers: {},
    body: null,
    category: 'Uncategorized',
    isCritical: false,
  });

  useEffect(() => {
    if (id) fetchRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchRequest = async () => {
    try {
      const response = await requestsAPI.getById(id);
      setFormData(response.data);
    } catch (error) {
      toast.error('Failed to fetch request');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await requestsAPI.update(id, formData);
        toast.success('Request updated successfully');
      } else {
        await requestsAPI.create(formData);
        toast.success('Request created successfully');
      }
      navigate('/requests');
    } catch (error) {
      toast.error('Failed to save request');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{id ? 'Edit Request' : 'Create New Request'}</h1>
      
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Request Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Method *</label>
            <select
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              className="input-field"
              required
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL *</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="input-field"
            placeholder="https://api.example.com/endpoint"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isCritical}
            onChange={(e) => setFormData({ ...formData, isCritical: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Mark as Critical (failures will block CI/CD)
          </label>
        </div>

        <div className="flex space-x-3 pt-4">
          <button type="submit" className="btn-primary">
            {id ? 'Update Request' : 'Create Request'}
          </button>
          <button type="button" onClick={() => navigate('/requests')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequest;
