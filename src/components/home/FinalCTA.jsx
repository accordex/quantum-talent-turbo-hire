import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Animated gradient bg */}
          <div className="absolute inset-0 animated-border" style={{ opacity: 0.7 }} />
          <div className="absolute inset-[1px] rounded-[23px] bg-background" />

          {/* Inner glow */}
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(199,89%,48%,0.15),transparent)]" />
          <div className="absolute inset-0 grid-pattern opacity-40 rounded-3xl" />

          {/* Particles */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/40"
              style={{ left: `${10 + i * 6}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ y: [0, -20, 0], opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 3 + i * 0.3, delay: i * 0.2, repeat: Infinity }}
            />
          ))}

          <div className="relative text-center px-8 py-20 sm:py-28">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex justify-center mb-8"
            >
              <img
                src="https://media.base44.com/images/public/69f587c9f467b13ad869c8aa/e72cf9038_logo167cb2cb4cd603d42c23.png"
                alt="TalentTurbo"
                className="h-10 w-auto object-contain opacity-80"
              />
            </motion.div>

            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Start hiring smarter<br />
              <span style={{ background: "linear-gradient(135deg, hsl(199,89%,55%), hsl(265,89%,70%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                today. For free.
              </span>
            </h2>
            <p className="text-foreground/45 max-w-xl mx-auto text-lg mb-12">
              Employers, recruiters, and job seekers — get started in minutes, no credit card needed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.location.href = '/get-started'}
                className="px-10 py-4 rounded-2xl font-heading font-bold text-base flex items-center gap-2 glow-primary relative overflow-hidden group"
                style={{ background: "linear-gradient(135deg, hsl(199,89%,48%) 0%, hsl(199,89%,38%) 100%)" }}
              >
                <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative text-black/90">Get Started — It's Free</span>
                <ArrowRight className="w-5 h-5 text-black/80 relative group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <Link to="/jobs">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-10 py-4 rounded-2xl font-heading font-bold text-base glass border border-white/10 text-foreground hover:border-primary/40 transition-all"
                >
                  Browse Open Roles
                </motion.button>
              </Link>
            </div>

            <p className="text-foreground/25 text-sm mt-8">No credit card required · Cancel anytime</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}