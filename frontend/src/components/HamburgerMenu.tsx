import { AnimatePresence, motion } from "framer-motion";
import { X, LogOutIcon, UserPlus, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
  profile: any;
  signOut: () => void;
}

export function HamburgerMenu({ open, onClose, profile, signOut }: Props) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* DRAWER */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.25 }}
            className="fixed left-0 top-0 h-full w-[260px] bg-background border-r border-border/40 z-50 flex flex-col"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between p-4 border-b border-border/40">
              <span className="font-semibold">Menu</span>
              <button onClick={onClose}>
                <X className="size-5" />
              </button>
            </div>

            {/* USER */}
            <div className="p-4 border-b border-border/40">
              <div className="text-sm font-medium">{profile.full_name}</div>
              <div className="text-xs text-muted-foreground capitalize">
                {profile.role}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col p-2 gap-1">
              {profile.role === "manager" && (
                <button
                  onClick={() => {
                    navigate("/manager/create-client");
                    onClose();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-button-bg-hover transition duration-500"
                >
                  <UserPlus className="size-4" />
                  Create Client
                </button>
              )}
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-button-bg-hover transition duration-500"
                onClick={() => {
                  navigate("/change-password");
                }}
              >
                <Lock className="size-4" />
                Change Password
              </button>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-red-500 hover:bg-red-500/10 transition"
              >
                <LogOutIcon className="size-4" />
                Logout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
