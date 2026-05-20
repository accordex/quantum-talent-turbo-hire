import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Zap, Target, ArrowRight, Shield, Award, Heart } from "lucide-react";

const values = [
  { icon: Target, title: "Precision", desc: "Every candidate is skill-matched and human-assessed before you see them. No noise, just quality." },
  { icon: Zap, title: "Speed", desc: "Screened candidates in 48–72 hours. Fast without cutting corners." },
  { icon: Shield, title: "Transparency", desc: "Clear scorecards, structured evals, no hidden fees. What you see is what you get." },
  { icon: Heart, title: "People First", desc: "Built equally for employers, recruiters, and job seekers. Everyone should win." },
];

const stats = [
  { value: "10,000+", label: "Candidates in Network" },
  { value: "500+", label: "Companies Served" },
  { value: "95%", label: "Client Satisfaction" },
  { value: "48hr", label: "Avg. First Candidates" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-primary/5" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              <span>Our Story</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight mb-6">
              On-demand recruitment,{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">built to scale</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              TalentTurbo is a recruitment and interviewing platform that helps employers hire faster, 
              recruiters earn from their expertise, and job seekers find roles that actually fit.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/30 border-y border-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-heading text-3xl sm:text-4xl font-bold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Our Mission</p>
              <h2 className="font-heading text-3xl font-bold mb-6">
                Recruitment that works for everyone
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most hiring is slow, expensive, and unreliable. We built TalentTurbo to fix that — 
                for employers, recruiters, and job seekers alike.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Certified interviewers screen candidates on demand. Employers get accurate scorecards fast. 
                Job seekers get matched to roles that fit. Less noise, better outcomes.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-border/50"
            >
              <div className="space-y-6">
                {["On-demand candidate screening", "Certified human interviewers at scale", "Skill-based job matching for candidates", "Full hiring pipeline in one platform", "Pay-per-screening model for recruiters"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Our Values</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">What drives us</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-7 border border-border/50 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-background">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Whether you're hiring, screening candidates for pay, or looking for your next role — TalentTurbo is built for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/employers">
              <Button size="lg" className="rounded-xl px-8 h-13 text-base gap-2">
                Start Hiring <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/jobs">
              <Button size="lg" variant="outline" className="rounded-xl px-8 h-13 text-base">
                Find Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}