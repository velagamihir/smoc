import { useEffect } from "react";

export default function Notification({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-green-500/10 border-green-500 text-green-400",
    error: "bg-red-500/10 border-red-500 text-red-400",
    info: "bg-blue-500/10 border-blue-500 text-blue-400",
  };

  return (
    <div className="fixed top-6 right-6 z-50 animate-fadeIn">
      <div
        className={`px-5 py-3 rounded-xl border backdrop-blur-md shadow-lg ${styles[type]}`}
      >
        {message}
      </div>
    </div>
  );
}
