import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import Login from './components/Login';
import MainPage from './components/MainPage';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mainpage" element = {<MainPage></MainPage>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
