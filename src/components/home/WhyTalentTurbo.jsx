import React from "react";
import { motion } from "framer-motion";

const metrics = [
  { value: "60%", label: "Faster Hiring", desc: "Fill roles in days, not months, with pre-screened candidates ready to review." },
  { value: "95%", label: "Match Accuracy", desc: "Every candidate is assessed by a certified interviewer using structured scorecards." },
  { value: "70%", label: "Less Screening Work", desc: "We handle assessments. Your team only sees verified, qualified candidates." },
  { value: "3×", label: "More Efficient", desc: "Integrated tracking and communication replace the usual hiring back-and-forth." },
];

const stages = [
  { label: "Sourced",     value: 248, pct: 100 },
  { label: "Screened",    value: 186, pct: 75  },
  { label: "Interviewed", value: 94,  pct: 38  },
  { label: "Offered",     value: 42,  pct: 17  },
  { label: "Hired",       value: 38,  pct: 15  },
];

export default function WhyTalentTurbo() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: text + stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">Why TalentTurbo</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
              Proven results.<br />
              <span style={{ background: "linear-gradient(135deg, hsl(158,64%,52%), hsl(199,89%,55%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                At every scale.
              </span>
            </h2>
            <p className="text-foreground/40 leading-relaxed mb-12 max-w-lg">
              Hiring doesn't have to be slow or unpredictable. TalentTurbo delivers consistent outcomes — whether you're filling one role or a hundred.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group"
                >
                  <p
                    className="font-heading text-4xl font-bold mb-1"
                    style={{ background: "linear-gradient(135deg, hsl(199,89%,55%), hsl(265,89%,70%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                  >
                    {m.value}
                  </p>
                  <p className="font-heading font-semibold text-sm text-foreground mb-1">{m.label}</p>
                  <p className="text-xs text-foreground/35 leading-relaxed">{m.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: funnel viz */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass border border-white/8 rounded-3xl p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-heading font-bold text-foreground mb-1">Hiring Funnel</h3>
                <p className="text-xs text-foreground/35">Q1 2026 · All Clients</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Live Data
              </span>
            </div>
            <div className="space-y-4">
              {stages.map((stage, i) => {
                const colors = [
                  "from-cyan-400 to-blue-500",
                  "from-blue-400 to-indigo-500",
                  "from-violet-400 to-purple-500",
                  "from-purple-400 to-fuchsia-500",
                  "from-fuchsia-400 to-pink-500",
                ];
                return (
                  <div key={stage.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-foreground/60">{stage.label}</span>
                      <span className="text-sm font-bold text-foreground/80">{stage.value}</span>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${stage.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.12, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${colors[i]}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="font-heading font-bold text-primary text-lg">15%</span>
              </div>
              <div>
                <p className="font-heading font-bold text-foreground text-sm">Industry-leading conversion</p>
                <p className="text-xs text-foreground/35">vs. 8% market average</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}