import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import Login from './components/Login';
import MainPage from './components/MainPage';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Redirect root path to Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Login Page */}
          <Route path="/login" element={<Login />} />
          
          {/* Main Dashboard Page */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Main Trading Platform */}
          <Route path="/mainpage" element={<MainPage />} />
          
          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
