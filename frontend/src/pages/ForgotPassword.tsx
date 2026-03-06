import { useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import axios from "axios";
//component imports
import Notification from "@/components/ui/Notifications";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const backendAPI = import.meta.env.VITE_BACKEND_API;
  const sendOtp = async () => {
    try {
      console.log(backendAPI);
      const response = await axios.post(
        `${backendAPI}/auth/forgotten-password`,
        {
          email: email,
        },
      );
      if (response.status === 200) {
        setNotification({
          type: "success",
          message: "OTP Sent Successfully",
        });
      }
    } catch (err) {
      const statusCode = err.response.statusCode || err.statusCode || 500;
      const message = err.response.message || err.message || "Unknown error";
      setNotification({
        type: "error",
        message: message,
      });
    }
  };
  const verifyOTP = async () => {
    try {
      const response = await axios.post(`${backendAPI}/auth/reset-password`, {
        email: email,
        otp: otp,
        newPassword: newPassword,
      });
      if (response.status === 200) {
        setNotification({
          type: "success",
          message: "Password reset successfully",
        });
      }
    } catch (err) {
      const statusCode = err.response.statusCode || err.statusCode || 500;
      const message = err.response.message || err.message || "Unknown error";
      setNotification({
        type: "error",
        message: message,
      });
    }
  };
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Heading */}
        <h1 className="text-4xl font-semibold text-white mb-2">
          Forgot Password
        </h1>

        <p className="text-gray-400 mb-8">Enter your email to receive an OTP</p>

        {/* Email Field + Send OTP */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Email Address</label>

          <div className="flex gap-3">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-zinc-600"
            />

            <button
              className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl text-white hover:bg-zinc-800 transition"
              onClick={sendOtp}
            >
              Send OTP
            </button>
          </div>
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          )}
        </div>

        {/* OTP */}
        <div className="mb-8">
          <label className="block text-gray-300 mb-2">OTP</label>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-zinc-600"
          />
        </div>
        <div className="mb-8">
          <label className="block text-gray-300 mb-2">New Password</label>

          <input
            type="text"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-zinc-600"
          />
        </div>

        {/* Verify */}
        <button
          className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-3 rounded-xl transition"
          onClick={verifyOTP}
        >
          Verify
        </button>

        {/* Back */}
        <p className="text-center text-gray-400 mt-8 text-sm">
          Remember your password?{" "}
          <button
            onClick={() => {
              navigate("/login", { replace: true });
            }}
          >
            <span className="text-gray-200 cursor-pointer hover:underline">
              Sign In
            </span>
          </button>
        </p>
      </div>
    </div>
  );
}
