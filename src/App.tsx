import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import Dashboard from "./pages/dashboard";
import LoginPage from "./pages/LoginPage";
import AuthVerifyPage from "./pages/AuthVerifyPage";
import OnboardingPage from "./pages/OnboardingPage";
import PaymentsPage from "./pages/PaymentsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/verify" element={<AuthVerifyPage />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/payments" element={<PaymentsPage />} />
    </Routes>
  );
}

export default App;
