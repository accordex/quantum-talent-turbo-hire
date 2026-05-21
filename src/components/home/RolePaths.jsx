import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, Users, Briefcase, ArrowUpRight } from "lucide-react";

const paths = [
  {
    icon: Building2,
    tag: "For Employers",
    title: "Hire in days, not months.",
    description: "Post a role, get pre-screened candidates within 48 hours. Certified interviewers do the hard work — you make the final call.",
    features: ["Ranked, skill-matched candidates", "Detailed interviewer scorecards", "Live pipeline dashboard"],
    cta: "Start Hiring",
    path: "/employers",
    accent: "hsl(199,89%,48%)",
    gradient: "from-cyan-500/10 via-blue-500/5 to-transparent",
  },
  {
    icon: Users,
    tag: "For Recruiters",
    title: "Screen candidates. Earn per eval.",
    description: "Join our on-demand screening network. Choose your assignments, work remotely, and get paid for every completed evaluation.",
    features: ["Earn $15–$120 per screening", "Fully remote & flexible", "Certification unlocks higher rates"],
    cta: "Join as Recruiter",
    path: "/recruiters",
    accent: "hsl(265,89%,70%)",
    gradient: "from-violet-500/10 via-purple-500/5 to-transparent",
    featured: true,
  },
  {
    icon: Briefcase,
    tag: "For Job Seekers",
    title: "Find jobs that match your skills.",
    description: "Browse matched listings, apply in minutes, and track every application. Built-in resume builder and AI interview prep included.",
    features: ["Skill-based job matching", "One-dashboard application tracking", "Resume builder + interview prep"],
    cta: "Find Jobs",
    path: "/jobs",
    accent: "hsl(158,64%,52%)",
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
  },
];

export default function RolePaths() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">Who It's For</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">
            One platform.<br />
            <span style={{ background: "linear-gradient(135deg, hsl(265,89%,75%), hsl(199,89%,55%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Built for everyone.
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {paths.map((p, i) => (
            <motion.div
              key={p.tag}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className="group relative"
            >
              {p.featured && (
                <div
                  className="absolute -inset-px rounded-3xl z-0"
                  style={{ background: `linear-gradient(135deg, ${p.accent}40, transparent 50%)` }}
                />
              )}
              <div className={`relative glass border rounded-3xl p-8 h-full flex flex-col transition-all duration-300 ${p.featured ? "border-white/15" : "border-white/6 hover:border-white/12"}`}>
                {/* Icon + tag */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
                    style={{ background: `${p.accent}15`, border: `1px solid ${p.accent}25` }}
                  >
                    <p.icon className="w-7 h-7" style={{ color: p.accent }} />
                  </div>
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: `${p.accent}12`, color: p.accent, border: `1px solid ${p.accent}20` }}
                  >
                    {p.tag}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold text-foreground mb-3 leading-tight">{p.title}</h3>
                <p className="text-sm text-foreground/45 leading-relaxed mb-6">{p.description}</p>

                <ul className="space-y-2 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/60">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: p.accent }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link to={p.path}>
                  <motion.div
                    whileHover={{ gap: "10px" }}
                    className="flex items-center gap-2 font-heading font-semibold text-sm transition-all"
                    style={{ color: p.accent }}
                  >
                    {p.cta}
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}