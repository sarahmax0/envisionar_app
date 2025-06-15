import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard-pastor" element={<div>Dashboard Pastor (Em construção)</div>} />
        <Route path="/dashboard-membro" element={<div>Dashboard Membro (Em construção)</div>} />
      </Routes>
    </Router>
  );
}

export default App;