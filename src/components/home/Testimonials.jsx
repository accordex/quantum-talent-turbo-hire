import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    role: "VP of Engineering",
    company: "Tech Enterprise",
    content: "We filled 15 positions in 6 weeks — roles that sat open for months before TalentTurbo. Detailed scorecards, accurate matches, zero wasted interviews.",
    rating: 5,
    color: "from-cyan-500 to-blue-600",
    initials: "VP",
  },
  {
    role: "Head of Talent",
    company: "SaaS Scale-up",
    content: "Every candidate matched exactly what we needed. Screening reports replaced hours of phone screens. Faster decisions, better hires.",
    rating: 5,
    color: "from-violet-500 to-purple-600",
    initials: "HT",
  },
  {
    role: "HR Director",
    company: "Growth-stage Startup",
    content: "Time-to-hire dropped 65%. TalentTurbo's screeners handled the assessment work — we just picked from the best. Easiest hiring process we've run.",
    rating: 5,
    color: "from-emerald-500 to-teal-600",
    initials: "HR",
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIdx((i) => (i + 1) % testimonials.length);

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,hsl(199,89%,48%,0.05),transparent)]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">What Customers Say</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground">
            Real results from<br />
            <span style={{ background: "linear-gradient(135deg, hsl(38,92%,60%), hsl(199,89%,55%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              real hiring teams.
            </span>
          </h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 40, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="glass border border-white/8 rounded-3xl p-10 sm:p-14 relative overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  background: `radial-gradient(circle at 10% 10%, hsl(38,92%,60%), transparent 50%)`,
                }}
              />
              {/* Stars */}
              <div className="flex gap-1 mb-8">
                {Array(testimonials[idx].rating).fill(0).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="font-heading text-xl sm:text-2xl text-foreground/80 leading-relaxed mb-10 font-medium">
                "{testimonials[idx].content}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${testimonials[idx].color} flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">{testimonials[idx].initials}</span>
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground">{testimonials[idx].role}</p>
                  <p className="text-sm text-foreground/40">{testimonials[idx].company}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === idx ? "w-8 h-2 bg-primary" : "w-2 h-2 bg-white/15 hover:bg-white/30"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={prev}
                className="w-11 h-11 rounded-2xl glass border border-white/8 flex items-center justify-center text-foreground/50 hover:text-foreground hover:border-white/20 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="w-11 h-11 rounded-2xl glass border border-white/8 flex items-center justify-center text-foreground/50 hover:text-foreground hover:border-white/20 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}