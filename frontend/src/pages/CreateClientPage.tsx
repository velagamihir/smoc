import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000";

export default function CreateClientPage() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Auth guard - only managers can create clients
  if (!loading && (!profile || profile.role !== "manager")) {
    navigate("/");
    return null;
  }

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Get token from localStorage
      const sessionJSON = localStorage.getItem("calendar_session");
      if (!sessionJSON) {
        setError("Not authenticated. Please log in.");
        setIsLoading(false);
        return;
      }

      const session = JSON.parse(sessionJSON);
      const token = session.token;

      // Make API request to create client
      const response = await axios.post(
        `${API_BASE_URL}/manager/clients`,
        {
          username,
          email,
          full_name: fullName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        setSuccess(
          `Client "${fullName}" created successfully! Credentials have been sent to ${email}.`,
        );
        // Clear form
        setUsername("");
        setEmail("");
        setFullName("");

        // Redirect after success
        setTimeout(() => {
          navigate("/app");
        }, 2000);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Server responded with error
          console.error("Error creating client:", err.response.data);
          setError(
            err.response.data.error ||
              "Failed to create client. Please try again.",
          );
        } else if (err.request) {
          // Network error
          console.error("Network error:", err);
          setError("Could not connect to server. Please try again.");
        } else {
          console.error("Error:", err.message);
          setError("An unexpected error occurred.");
        }
      } else {
        console.error("Error:", err);
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-2">Create New Client</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Create a new client account. Login credentials will be sent to their
          email.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleCreateClient} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Smith"
              className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isLoading}
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="janesmith"
              className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isLoading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@company.com"
              className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isLoading}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-md bg-button-bg text-white hover:bg-button-bg-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Client..." : "Create Client"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
          <p className="font-semibold mb-2">ℹ️ How it works:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Client account is created with a temporary password</li>
            <li>Login credentials are sent to their email</li>
            <li>They must change the password on first login</li>
            <li>They can then view posts created for them</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
