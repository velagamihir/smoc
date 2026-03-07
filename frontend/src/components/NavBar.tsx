import { ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
interface NavBarProps {
  title?: string;
}

export default function NavBar({ title = "Dashboard" }: NavBarProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isManager, setIsManager] = useState(profile.role === "manager");
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
      {isManager && (
        <button
          onClick={() => {
            navigate(-1, { replace: true });
          }}
        >
          <ArrowLeft />
        </button>
      )}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {profile && (
          <span className="text-sm text-muted-foreground">
            Welcome, {profile.full_name}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {profile && (
          <span className="text-sm text-muted-foreground">
            Role: {profile.role}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
