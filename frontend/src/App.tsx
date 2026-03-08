import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Home from "@/pages/Home";
import LoginPage from "@/pages/LoginPage";
import { CalendarPage } from "@/components/CalendarPage";
import ForgotPassword from "./pages/ForgotPassword";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import CreateClientPage from "./pages/CreateClientPage";

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
}) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(profile.role)) {
    return <Navigate to="/" replace />; // Or to an unauthorized page
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route
            path="/super_admin/dashboard"
            element={
              <ProtectedRoute requiredRoles={["super_admin"]}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/create-client"
            element={
              <ProtectedRoute requiredRoles={["manager"]}>
                <CreateClientPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
