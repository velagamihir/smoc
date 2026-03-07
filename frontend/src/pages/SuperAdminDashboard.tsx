import { useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";

const API_BASE_URL = "http://localhost:8000";

export default function SuperAdminDashboard() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreateManager = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Get token from localStorage
      const sessionJSON = localStorage.getItem("calendar_session");
      if (!sessionJSON) {
        setError("Not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      const session = JSON.parse(sessionJSON);
      const token = session.token;

      // Make API request to create manager
      const response = await axios.post(
        `${API_BASE_URL}/superadmin/managers`,
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
          `Manager "${fullName}" created successfully! Credentials have been sent to ${email}.`,
        );
        // Clear form
        setUsername("");
        setEmail("");
        setFullName("");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Server responded with error
          console.error("Error creating manager:", err.response.data);
          setError(
            err.response.data.error ||
              "Failed to create manager. Please try again.",
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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar title="Super Admin Dashboard" />
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-2">Create Manager</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Create a new manager account. Login credentials will be sent to
            their email.
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

          <form onSubmit={handleCreateManager} className="space-y-5">
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
                placeholder="John Doe"
                className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={loading}
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
                placeholder="johndoe"
                className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={loading}
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
                placeholder="john@example.com"
                className="w-full px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={loading}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md bg-button-bg text-white hover:bg-button-bg-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Manager..." : "Create Manager"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
            <p className="font-semibold mb-2">ℹ️ How it works:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Manager account is created with a temporary password</li>
              <li>Login credentials are sent to their email</li>
              <li>They must change the password on first login</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
