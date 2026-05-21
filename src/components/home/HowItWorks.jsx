import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserCheck, Handshake } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Post Your Job in Minutes",
    description: "Describe the role — title, skills, experience level, work mode. Go live instantly and start matching against a pre-vetted talent pool. Most employers see top candidates within 2 hours.",
    detail: "First matches in under 2 hours",
    color: "hsl(199,89%,48%)",
    gradient: "from-cyan-500/20 to-blue-600/5",
  },
  {
    icon: UserCheck,
    step: "02",
    title: "Certified Interviewers Screen for You",
    description: "Our on-demand screeners conduct structured assessments — covering technical skills, communication, and culture fit. You receive a clear scorecard for every candidate. No unvetted CVs.",
    detail: "Every candidate is human-verified",
    color: "hsl(265,89%,70%)",
    gradient: "from-violet-500/20 to-purple-600/5",
  },
  {
    icon: Handshake,
    step: "03",
    title: "Pick the Best. Make the Offer.",
    description: "Review ranked candidates with full scorecards, compare side by side, and extend an offer — all from one dashboard. Most clients close their first hire within 5 days of posting.",
    detail: "95% offer acceptance rate",
    color: "hsl(158,64%,52%)",
    gradient: "from-emerald-500/20 to-teal-600/5",
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-28 relative overflow-hidden z-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,hsl(199,89%,48%,0.04),transparent)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">How It Works</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Post. Screen. Hire.<br />
            <span style={{ background: "linear-gradient(135deg, hsl(199,89%,55%), hsl(265,89%,70%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Done in days.
            </span>
          </h2>
          <p className="text-foreground/40 max-w-xl mx-auto">
            Three steps. No back-and-forth. No wasted time.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Step selectors */}
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div
                key={i}
                onClick={() => setActive(i)}
                className={`p-6 rounded-2xl border transition-all duration-300 border-white/15 bg-gradient-to-br ${step.gradient}`}
              >
                <div className="flex items-start gap-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all"
                    style={{
                      background: `${step.color}20`,
                      border: `1px solid ${step.color}30`,
                    }}
                  >
                    <step.icon className="w-5 h-5" style={{ color: step.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-heading font-bold text-lg text-foreground">
                        {step.title}
                      </h3>
                      <span className="text-3xl font-heading font-bold text-white/10">{step.step}</span>
                    </div>
                    <p className="text-sm text-foreground/50 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          <div className="relative hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                transition={{ duration: 0.35 }}
                className="glass border border-white/8 rounded-3xl p-10 relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-5"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${steps[active].color}, transparent 70%)` }}
                />
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center mb-8"
                  style={{ background: `${steps[active].color}15`, border: `1px solid ${steps[active].color}25` }}
                >
                  {React.createElement(steps[active].icon, { className: "w-10 h-10", style: { color: steps[active].color } })}
                </div>
                <p className="font-heading text-3xl font-bold text-foreground mb-4">{steps[active].title}</p>
                <p className="text-foreground/50 leading-relaxed mb-8">{steps[active].description}</p>
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                  style={{ background: `${steps[active].color}15`, color: steps[active].color, border: `1px solid ${steps[active].color}25` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: steps[active].color }} />
                  {steps[active].detail}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}