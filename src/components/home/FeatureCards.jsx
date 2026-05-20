import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, BarChart3, MessageSquare, Shield, Zap, Globe } from "lucide-react";

const features = [
  { icon: Brain,         title: "AI Candidate Matching",    description: "Ranked by skills and experience — not just keywords.", accent: "hsl(199,89%,48%)" },
  { icon: Shield,        title: "Certified Screening",      description: "Every candidate assessed by a human interviewer. Clear scorecards, every time.", accent: "hsl(265,89%,70%)" },
  { icon: BarChart3,     title: "Live Pipeline Dashboard",  description: "Track every candidate from applied to hired in real time.", accent: "hsl(158,64%,52%)" },
  { icon: MessageSquare, title: "Unified Workspace",        description: "Hiring teams, recruiters, and screeners in one shared platform.", accent: "hsl(38,92%,60%)" },
  { icon: Zap,           title: "48-Hour Delivery",         description: "Post a role. Receive screened, ranked candidates in 2 business days.", accent: "hsl(199,89%,48%)" },
  { icon: Globe,         title: "Global-Ready",             description: "Remote, hybrid, onsite — with work authorization filters built in.", accent: "hsl(265,89%,70%)" },
];

export default function FeatureCards() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="py-28 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,hsl(265,89%,70%,0.04),transparent)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">Platform Features</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Everything you need<br />
            <span style={{ background: "linear-gradient(135deg, hsl(199,89%,55%), hsl(265,89%,70%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              to hire with confidence.
            </span>
          </h2>
          <p className="text-foreground/40 max-w-xl mx-auto">
            Built for speed and quality — from first post to final offer.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              className="relative p-7 rounded-3xl border border-white/6 bg-white/[0.02] hover:border-white/12 transition-all duration-300 overflow-hidden group cursor-default"
            >
              {/* Glow on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hovered === i ? 1 : 0 }}
                className="absolute inset-0 pointer-events-none rounded-3xl"
                style={{ background: `radial-gradient(circle at 30% 30%, ${feature.accent}12, transparent 70%)` }}
              />

              <div
                className="w-13 h-13 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300"
                style={{
                  width: 52,
                  height: 52,
                  background: hovered === i ? `${feature.accent}20` : `${feature.accent}10`,
                  border: `1px solid ${hovered === i ? feature.accent + "35" : feature.accent + "15"}`,
                }}
              >
                <feature.icon className="w-6 h-6 transition-transform group-hover:scale-110" style={{ color: feature.accent }} />
              </div>

              <h3 className="font-heading font-bold text-lg text-foreground mb-2.5 group-hover:text-white transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-foreground/40 leading-relaxed group-hover:text-foreground/55 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}