import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import { Profile, ManagerClient } from "../types/auth";

const BASE = "http://localhost:8000";
const SESSION_KEY = "calendar_session";

interface Session {
  token: string;
  user_id: string;
  full_name: string;
  email: string;
  role: "manager" | "client";
  brand_id: string;
  manager_clients: ManagerClient[];
}

interface AuthContextValue {
  profile: Profile | null;
  managerClients: ManagerClient[];
  activeBrandId: string | null;
  setActiveBrandId: (id: string) => void;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function sessionToProfile(s: Session): Profile {
  return {
    id: s.user_id,
    full_name: s.full_name,
    email: s.email,
    role: s.role,
    created_at: "",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [managerClients, setManagerClients] = useState<ManagerClient[]>([]);
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function applySession(s: Session) {
    setProfile(sessionToProfile(s));
    setManagerClients(s.manager_clients);
    setActiveBrandId(s.brand_id);
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const s: Session = JSON.parse(raw);
        applySession(s);
      }
    } catch (error) {
      console.error("Error loading session from localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async (
    email: string,
    password: string,
  ): Promise<string | null> => {
    try {
      const response = await axios.post(`${BASE}/auth/login`, {
        email,
        password,
      });
      const s: Session = response.data;
      localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      applySession(s);
      return response.data.role;
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        console.error("Sign in failed with server error:", error.response.data);
        return error.response.data || "Invalid credentials";
      } else if (error.request) {
        // Network error
        console.error("Sign in network error:", error);
        return "Could not connect to server";
      } else {
        // Other error
        console.error("Sign in error:", error);
        return null;
      }
    }
  };

  const signOut = async () => {
    localStorage.removeItem(SESSION_KEY);
    setProfile(null);
    setManagerClients([]);
    setActiveBrandId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        managerClients,
        activeBrandId,
        setActiveBrandId,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
