import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Notification from "@/components/ui/Notifications";
// ── Types ──────────────────────────────────────────────────────
export interface SignInPageProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  error?: string | null;
  loading?: boolean;
}

// ── Sub-components ─────────────────────────────────────────────
const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
    {children}
  </div>
);

// ── Main component ─────────────────────────────────────────────
export const SignInPage: React.FC<SignInPageProps> = ({
  onSignIn,
  error,
  loading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [notification, setNotification] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSignIn(email, password);
  };

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row w-[100dvw] ">
      {/* ── Left: form ── */}
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            {/* Brand */}
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tighter">
                Welcome back
              </h1>
              <p className="text-muted-foreground text-sm">
                Sign in to your SMOC workspace
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                  Email Address
                </label>
                <GlassInputWrapper>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                  />
                </GlassInputWrapper>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                  Password
                </label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Eye className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-button-bg py-4 font-medium text-primary-foreground hover:bg-button-bg-hover transition-colors disabled:opacity-50 duration-700 transition-all hover:text-black"
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
            <a
              href="/forgot_password"
              className="text-center text-secondary-text"
            >
              Forgot Password?
            </a>

            <div className="text-center text-xs text-muted-foreground">
              Contact your workspace admin to get access.
            </div>
          </div>
        </div>
      </section>

      {/* ── Right: hero panel ── */}
      <section className="hidden md:flex flex-1 relative p-4 overflow-hidden">
        <div
          className="absolute inset-4 rounded-3xl bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80)`,
          }}
        />
        {/* Overlay with brand message */}
        <div className="absolute inset-4 rounded-3xl bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-10">
          <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-2">
            SMOC
          </p>
          <h2 className="text-white text-3xl font-semibold leading-tight max-w-xs">
            Social Media Optimised Calendar.
          </h2>
        </div>
      </section>
    </div>
  );
};
