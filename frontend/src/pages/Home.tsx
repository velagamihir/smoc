import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HeroGeometric } from "../components/ui/shape-landing-hero";
import { CalendarDays, MessageSquare, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Visual Content Calendar",
    description:
      "See every post at a glance — colour-coded by format, organised by date. No spreadsheets, no guesswork.",
  },
  {
    icon: MessageSquare,
    title: "Field-Level Feedback",
    description:
      "Clients comment directly on headlines, captions, and visuals. Every note is pinned to the exact copy it refers to.",
  },
  {
    icon: CheckCircle2,
    title: "One-Click Approvals",
    description:
      "Managers edit, approve, and update post status in real time — keeping the whole team on the same page.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <main className="bg-[#030303]">
      {/* ── Hero ── */}
      <HeroGeometric
        badge="Social Media Optimised Calendar"
        title1="SMOC."
        title2="Plan. Review. Publish."
        description="The command centre for social media agencies — one workspace for your entire content pipeline, shared with every client."
        cta={
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
            <button
              onClick={handleNavigateToLogin}
              className="inline-flex items-center justify-center px-10 py-4 rounded-full text-base font-medium bg-white text-black hover:bg-white/90 transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={handleNavigateToLogin}
              className="inline-flex items-center justify-center px-10 py-4 rounded-full text-base font-medium bg-white/[0.05] border border-white/[0.12] text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors"
            >
              Sign In
            </button>
          </div>
        }
      />

      {/* ── Features ── */}
      <section className="relative py-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* section label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-xs font-medium uppercase tracking-[0.2em] text-white/30 mb-4"
          >
            Everything your team needs
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center text-4xl sm:text-5xl font-bold text-white mb-12 tracking-tight"
          >
            Built for agencies.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              Loved by clients.
            </span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-10 flex flex-col gap-8 hover:bg-white/[0.05] transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/[0.10] flex items-center justify-center">
                  <f.icon className="w-7 h-7 text-white/60" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-white font-semibold text-xl">
                    {f.title}
                  </h3>
                  <p className="text-white/40 text-base leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="border-t border-white/[0.06]" />
      </div>

      {/* ── CTA strip ── */}
      <section className="py-20 px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
            Ready to take control?
          </h2>
          <p className="text-white/40 text-lg leading-relaxed mb-10">
            Log in to your SMOC workspace and start planning your next month of
            content.
          </p>
          <button
            onClick={handleNavigateToLogin}
            className="inline-flex items-center justify-center px-12 py-4 rounded-full text-base font-medium bg-white text-black hover:bg-white/90 transition-colors"
          >
            Open SMOC
          </button>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] py-10 px-8 text-center">
        <p className="text-white/20 text-sm tracking-wide">
          © {new Date().getFullYear()} SMOC · Social Media Optimised Calendar
        </p>
      </footer>
    </main>
  );
}
