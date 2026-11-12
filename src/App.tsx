import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { Landing } from './components/Landing';

// Everything except the landing page loads on demand, so admin, CRM,
// walkthrough, briefing and the demo form stay out of the landing bundle.
const SignIn = lazy(() => import('./components/Auth/SignIn').then((m) => ({ default: m.SignIn })));
const SignUp = lazy(() => import('./components/Auth/SignUp').then((m) => ({ default: m.SignUp })));
const RequestDemo = lazy(() => import('./components/Demo/RequestDemo').then((m) => ({ default: m.RequestDemo })));
const PrivacyNotice = lazy(() => import('./components/Legal/PrivacyNotice').then((m) => ({ default: m.PrivacyNotice })));
const BriefingGate = lazy(() => import('./pages/BriefingGate').then((m) => ({ default: m.BriefingGate })));
const BriefingLocked = lazy(() => import('./pages/BriefingLocked').then((m) => ({ default: m.BriefingLocked })));
const AdminLogin = lazy(() => import('./pages/AdminLogin').then((m) => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminCrm = lazy(() => import('./pages/AdminCrm').then((m) => ({ default: m.AdminCrm })));
const Walkthrough = lazy(() => import('./pages/Walkthrough').then((m) => ({ default: m.Walkthrough })));
const FounderDemo = lazy(() => import('./pages/FounderDemo').then((m) => ({ default: m.FounderDemo })));

// Quiet placeholder while a lazy route loads (keeps the footer from jumping up).
const RouteFallback = () => <div className="min-h-[60vh]" aria-busy="true" />;

// Wrapper element that renders nested routes inside MainLayout via <Outlet />.
function MainLayoutShell() {
  return (
    <MainLayout>
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    </MainLayout>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Standalone routes — no header/footer chrome */}
          <Route path="/briefing" element={<BriefingLocked />} />
          <Route path="/briefing/:token" element={<BriefingGate />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/crm" element={<AdminCrm />} />
          <Route path="/walkthrough" element={<Walkthrough />} />
          <Route path="/founder-demo" element={<FounderDemo />} />

          {/* Site routes — wrapped in MainLayout (Header + Footer) */}
          <Route element={<MainLayoutShell />}>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/request-demo" element={<RequestDemo />} />
            <Route path="/privacy" element={<PrivacyNotice />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
