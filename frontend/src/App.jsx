import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import RequestLibrary from './pages/RequestLibrary';
import CreateRequest from './pages/CreateRequest';
import ReplayRunner from './pages/ReplayRunner';
import ReplayResults from './pages/ReplayResults';
import Reports from './pages/Reports';
import ReportDetails from './pages/ReportDetails';
import DiffViewer from './pages/DiffViewer';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes (No Layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes (With Layout) */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/requests" element={<Layout><RequestLibrary /></Layout>} />
        <Route path="/requests/create" element={<Layout><CreateRequest /></Layout>} />
        <Route path="/requests/edit/:id" element={<Layout><CreateRequest /></Layout>} />
        <Route path="/replay" element={<Layout><ReplayRunner /></Layout>} />
        <Route path="/replay/results/:id" element={<Layout><ReplayResults /></Layout>} />
        <Route path="/reports" element={<Layout><Reports /></Layout>} />
        <Route path="/reports/:id" element={<Layout><ReportDetails /></Layout>} />
        <Route path="/diff/:runId" element={<Layout><DiffViewer /></Layout>} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
