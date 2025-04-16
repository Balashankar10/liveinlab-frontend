import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RoleSelector from './RoleSelector';
import AuthPage from './AuthPage';
import VillagerDashboard from './pages/villagers/VillagerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import FileComplaint from './pages/villagers/FileComplaint';
import ViewComplaints from './pages/villagers/ViewComplaints';
import AdminComplaints from './pages/admin/AdminComplaints';
import MyComplaints from './pages/villagers/MyComplaints';
import './App.css'; // Import global styles

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<RoleSelector />} />
          <Route path="/auth/:role" element={<AuthPage />} />
          <Route path="/villager/dashboard" element={<VillagerDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/complaints" element={<AdminComplaints />} />
          <Route path="/villager/file-complaint" element={<FileComplaint />} />
          <Route path="/villager/view-complaints" element={<ViewComplaints />} />
          <Route path="/villager/my-complaints" element={<MyComplaints />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
