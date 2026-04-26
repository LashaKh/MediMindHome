import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { Landing } from './components/Landing';
import { SignIn } from './components/Auth/SignIn';
import { SignUp } from './components/Auth/SignUp';
import { RequestDemo } from './components/Demo/RequestDemo';
import { BriefingGate } from './pages/BriefingGate';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

// Wrapper element that renders nested routes inside MainLayout via <Outlet />.
function MainLayoutShell() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Standalone routes — no header/footer chrome */}
        <Route path="/briefing/:token" element={<BriefingGate />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Existing site routes — wrapped in MainLayout (Header + Footer) */}
        <Route element={<MainLayoutShell />}>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/request-demo" element={<RequestDemo />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
