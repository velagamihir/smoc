import { useState } from "react";
import axios from "axios";
import { Menu } from "lucide-react";
import { HamburgerMenu } from "../components/HamburgerMenu";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import Notification from "@/components/ui/Notifications";

export default function ChangePassword() {
  const handleError = (err) => {
    const message =
      err?.response?.data?.message ||
      err?.response?.message ||
      err?.message ||
      "Unknown error";

    setNotification({ type: "error", message });
  };
  const { profile, signOut } = useAuth();
  const frontendAPI = import.meta.env.VITE_BASE_URL;
  const [menuOpen, setMenuOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    const email = profile?.email;
    e.preventDefault();

    try {
      setLoading(true);
      console.log(frontendAPI);
      const res = await axios.post(
        `${frontendAPI}/auth/change-password`,
        {
          email,
          password,
          newPassword,
          confirmNewPassword,
        },
        {
          withCredentials: true,
        },
      );

      setMessage(res.data.message || "Password changed successfully");

      setPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      if (res.status === 200) {
        setNotification({
          type: "success",
          message: "Password changed successfully",
        });
        setPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* HAMBURGER MENU */}
      <HamburgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        profile={profile}
        signOut={signOut}
      />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* PAGE CONTENT */}
      <div className="flex flex-col flex-1">
        {/* HEADER */}
        <header className="flex items-center gap-4 px-6 py-3 border-b border-border/40">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-md hover:bg-button-bg-hover transition-all ease-out duration-500"
          >
            <Menu className="size-5" />
          </button>

          <h1 className="text-sm font-semibold">Change Password</h1>
        </header>

        {/* FORM AREA */}
        <div className="flex flex-1 items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-card border border-border/40 rounded-xl p-6 space-y-5"
          >
            <h2 className="text-lg font-semibold">Update your password</h2>

            {/* CURRENT PASSWORD */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">
                Current Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="px-3 py-2 rounded-md border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* NEW PASSWORD */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="px-3 py-2 rounded-md border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                className="px-3 py-2 rounded-md border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* MESSAGE */}
            {message && (
              <div className="text-xs text-muted-foreground">{message}</div>
            )}

            {/* BUTTON */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Updating..." : "Change Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
