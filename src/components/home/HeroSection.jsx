import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Users, Briefcase, ChevronDown, Search, MapPin } from "lucide-react";

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  dur: Math.random() * 8 + 6,
  delay: Math.random() * 5,
}));

function CountUp({ end, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = end / 60;
        const timer = setInterval(() => {
          start = Math.min(start + step, end);
          setCount(Math.floor(start));
          if (start >= end) clearInterval(timer);
        }, 20);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const QUICK_SEARCHES = ["Software Engineer", "Product Manager", "Data Scientist", "UX Designer", "DevOps", "Marketing"];

export default function HeroSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / 20);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / 20);
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-pattern z-0"
      onMouseMove={handleMouseMove}
    >
      {/* Deep radial bg */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(199,89%,48%,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_80%,hsl(265,89%,70%,0.1),transparent)]" />

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: 0.3,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Glowing orbs */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ x: springX, y: springY }}
        className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass border border-primary/20 text-primary px-5 py-2 rounded-full text-sm font-medium mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            On-Demand Recruitment · AI Matching · 48hr Delivery
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-heading text-5xl sm:text-6xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6 max-w-5xl"
          >
            <span className="text-foreground">Recruitment, </span>
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, hsl(199,89%,55%) 0%, hsl(265,89%,75%) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              on demand.
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-lg sm:text-xl text-foreground/50 max-w-2xl leading-relaxed mb-10"
          >
            Hire faster. Screen smarter. Find better roles.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38 }}
            className="w-full max-w-3xl mb-4"
          >
            <div className="flex flex-col sm:flex-row gap-0 glass border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.4)] focus-within:border-primary/40 transition-all">
              {/* Job title input */}
              <div className="flex items-center gap-3 flex-1 px-5 py-4 border-b sm:border-b-0 sm:border-r border-white/8">
                <Search className="w-5 h-5 text-primary shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, keyword, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/jobs?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationQuery)}`)}
                  className="bg-transparent w-full text-sm text-foreground placeholder:text-foreground/35 focus:outline-none"
                />
              </div>
              {/* Location input */}
              <div className="flex items-center gap-3 sm:w-52 px-5 py-4 border-b sm:border-b-0 sm:border-r border-white/8">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Location or Remote"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/jobs?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationQuery)}`)}
                  className="bg-transparent w-full text-sm text-foreground placeholder:text-foreground/35 focus:outline-none"
                />
              </div>
              {/* Search button */}
              <button
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationQuery)}`)}
                className="px-7 py-4 font-heading font-bold text-sm text-black/90 flex items-center justify-center gap-2 shrink-0 transition-all"
                style={{ background: "linear-gradient(135deg, hsl(199,89%,48%) 0%, hsl(199,89%,38%) 100%)" }}
              >
                <Search className="w-4 h-4" />
                Search Jobs
              </button>
            </div>

            {/* Quick search chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              <span className="text-xs text-foreground/30 mr-1">Popular:</span>
              {QUICK_SEARCHES.map((q) => (
                <button
                  key={q}
                  onClick={() => navigate(`/jobs?search=${encodeURIComponent(q)}`)}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-foreground/50 hover:border-primary/40 hover:text-primary transition-all bg-white/[0.02] hover:bg-primary/5"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-16"
          >
            <Link to="/employers">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative px-8 py-4 rounded-2xl font-heading font-bold text-base flex items-center gap-2 overflow-hidden group glow-primary"
                style={{ background: "linear-gradient(135deg, hsl(199,89%,48%) 0%, hsl(199,89%,38%) 100%)" }}
              >
                <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                <Briefcase className="w-5 h-5 text-black/80" />
                <span className="text-black/90">Start Hiring</span>
                <ArrowRight className="w-4 h-4 text-black/80 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link to="/jobs">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-2xl font-heading font-bold text-base flex items-center gap-2 glass border border-white/10 text-foreground hover:border-primary/40 transition-all"
              >
                <Users className="w-5 h-5 text-primary" />
                Browse Jobs
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="flex items-center gap-8 sm:gap-16"
          >
            {[
              { end: 10000, suffix: "+", label: "Candidates" },
              { end: 500, suffix: "+", label: "Companies" },
              { end: 95, suffix: "%", label: "Match Rate" },
              { end: 48, suffix: "hr", label: "Avg. Delivery" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-heading text-2xl sm:text-3xl font-bold text-primary">
                  <CountUp end={s.end} suffix={s.suffix} />
                </p>
                <p className="text-xs text-foreground/40 mt-0.5 font-medium uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating UI card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <div className="glass border border-white/8 rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
            {/* Window bar */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5 bg-white/[0.02]">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-foreground/30 font-mono">talentturbo.us — Talent Pipeline</span>
            </div>
            <div className="p-6 space-y-3">
              {/* Header row */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="font-heading font-bold text-foreground">Talent Pipeline</p>
                  <p className="text-xs text-foreground/40">AI-matched roles · updated continuously</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/20">
                  AI Matching ●
                </span>
              </div>
              {[
                { role: "Sr. React Developer", level: "Senior · Remote", match: 96, color: "from-cyan-500 to-blue-600", delay: 0.8 },
                { role: "Product Designer", level: "Mid · Hybrid", match: 94, color: "from-violet-500 to-purple-600", delay: 0.95 },
                { role: "Data Engineer", level: "Senior · Onsite", match: 91, color: "from-emerald-500 to-teal-600", delay: 1.1 },
              ].map((c) => (
                <motion.div
                  key={c.role}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: c.delay }}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/20 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-xs font-bold`}>
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{c.role}</p>
                      <p className="text-xs text-foreground/40">{c.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${c.match}%` }}
                        transition={{ delay: c.delay + 0.3, duration: 0.8 }}
                        className={`h-full rounded-full bg-gradient-to-r ${c.color}`}
                      />
                    </div>
                    <span className="text-sm font-bold text-primary w-10 text-right">{c.match}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-foreground/20"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
}