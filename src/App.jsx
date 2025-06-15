import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardPastor from './pages/DashboardPastor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard-pastor" element={<DashboardPastor />} />
      </Routes>
    </Router>
  );
}

export default App;