import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Notification from "@/components/ui/Notifications";
import { ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const backendAPI = import.meta.env.VITE_BACKEND_API;

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notification, setNotification] = useState(null);

  const handleError = (err) => {
    const message =
      err?.response?.data?.message ||
      err?.response?.message ||
      err?.message ||
      "Unknown error";

    setNotification({ type: "error", message });
  };

  const sendOtp = async () => {
    try {
      const res = await axios.post(`${backendAPI}/auth/forgotten-password`, {
        email,
      });
      if (res.status === 200) {
        setNotification({ type: "success", message: "OTP Sent Successfully" });
      }
    } catch (err) {
      handleError(err);
    }
  };

  const verifyOTP = async () => {
    try {
      const res = await axios.post(`${backendAPI}/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });
      if (res.status === 200) {
        setNotification({
          type: "success",
          message: "Password reset successfully",
        });
        setEmail("");
        setOtp("");
        setNewPassword("");
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col px-6">
      {/* Top Nav */}
      <nav className="pt-6">
        <button
          onClick={() => navigate("/", { replace: true })}
          className="text-zinc-400 hover:text-white transition-colors duration-150"
        >
          <ArrowLeft size={20} />
        </button>
      </nav>

      {/* Main Container */}
      <div className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-sm space-y-6">
          {/* Heading */}
          <div className="space-y-1 mb-8 text-center">
            <h1 className="text-3xl font-semibold text-white tracking-tight">
              Forgot Password
            </h1>
            <p className="text-sm text-secondary-text">
              Enter your email to receive a one-time password
            </p>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
              />
              <button
                onClick={sendOtp}
                className="bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors whitespace-nowrap"
              >
                Send OTP
              </button>
            </div>
          </div>

          {/* OTP */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              OTP
            </label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          {/* Verify Button */}
          <button
            onClick={verifyOTP}
            className="w-full bg-white text-black py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors mt-2"
          >
            Verify
          </button>

          {/* Notification */}
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          )}

          {/* Divider */}
          <div className="border-t border-zinc-800" />

          {/* Back to login */}
          <p className="text-center text-xs text-zinc-500">
            Remember your password?{" "}
            <button
              onClick={() => navigate("/login", { replace: true })}
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
