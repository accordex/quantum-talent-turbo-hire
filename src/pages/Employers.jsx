import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight, Users, Zap, BarChart3, Shield, Clock,
  Target, CheckCircle2, Building2, Globe, PlusCircle, Loader2
} from "lucide-react";

const benefits = [
  { icon: Clock, title: "Hire 60% Faster", desc: "Stop waiting weeks. Pre-screened candidates land in your inbox within 48–72 hours of posting." },
  { icon: Target, title: "95% Match Accuracy", desc: "Every candidate is matched to your exact role requirements — skills, experience, and work preference." },
  { icon: Shield, title: "Human-Verified Screening", desc: "Certified interviewers assess technical ability and communication. You get detailed scorecards, not gut feelings." },
  { icon: BarChart3, title: "Live Pipeline Visibility", desc: "See every candidate's status in real time. Know exactly where your hiring stands at any moment." },
  { icon: Globe, title: "Talent Across Geographies", desc: "Remote, hybrid, or onsite — access candidates with the right skills and work authorization for your needs." },
  { icon: Users, title: "Scales With You", desc: "Hiring one person or fifty? The platform handles it — without adding overhead to your team." },
];

const steps = [
  { step: "1", title: "Post Your Role", desc: "Describe the position — title, required skills, experience level, and work mode. It takes under 5 minutes and goes live immediately." },
  { step: "2", title: "We Handle the Screening", desc: "Certified interviewers assess each candidate using a structured framework. You receive clear, consistent scorecards covering skills, communication, and role fit." },
  { step: "3", title: "Review, Choose, Hire", desc: "Browse ranked candidates with full scorecards. Compare side by side, extend an offer, and manage onboarding — all from your dashboard." },
];

export default function Employers() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                <span>For Employers & Hiring Teams</span>
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Great candidates,{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ready in 48 hours
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
                Tell us what you need and TalentTurbo delivers pre-screened, skill-matched candidates — 
                assessed by certified interviewers so you can skip the noise and focus on 
                making the right hire.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-xl px-8 h-13 text-base gap-2" onClick={() => base44.auth.redirectToLogin()}>
                  Start Hiring <ArrowRight className="w-4 h-4" />
                </Button>
                <Link to="/jobs">
                  <Button size="lg" variant="outline" className="rounded-xl px-8 h-13 text-base w-full sm:w-auto">
                    See How It Works
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Why choose TalentTurbo</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">Built for teams that can't afford to hire wrong</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-7 border border-border/50 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">The process</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">Three steps to your next hire</h2>
          </div>
          <div className="space-y-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-6 items-start"
              >
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-lg shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Post a Job CTA section */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Start today</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Post your first role in under 5 minutes</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Fill in the basics and we'll start matching you with pre-screened candidates. Most employers see their first matches within 48 hours.
            </p>
          </div>
          <PostJobForm />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Ready to hire without the headache?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join hundreds of companies already using TalentTurbo to hire faster, smarter, and with more confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-started">
              <Button size="lg" className="rounded-xl px-8 h-13 text-base gap-2">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="rounded-xl px-8 h-13 text-base">
                See Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PostJobForm() {
  const [form, setForm] = useState({ title: "", company: "", location: "", work_mode: "remote", job_type: "full_time" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isAuth = await base44.auth.isAuthenticated();
    if (!isAuth) { base44.auth.redirectToLogin("/employers"); return; }
    setLoading(true);
    await base44.entities.Job.create({ ...form, status: "draft" });
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl border border-primary/30 p-10 text-center">
        <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
        <h3 className="font-heading text-2xl font-bold mb-2">Job posted successfully!</h3>
        <p className="text-muted-foreground mb-6">Your job listing has been saved as a draft. Go to your dashboard to publish it.</p>
        <Link to="/dashboard">
          <Button className="rounded-xl gap-2">Go to Dashboard <ArrowRight className="w-4 h-4" /></Button>
        </Link>
      </motion.div>
    );
  }

  const inputClass = "w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors";
  const selectClass = inputClass;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={handleSubmit}
      className="bg-card rounded-2xl border border-border/50 p-8 space-y-5"
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-medium block mb-2">Job Title *</label>
          <input required className={inputClass} placeholder="e.g. Senior Product Designer"
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Company Name *</label>
          <input required className={inputClass} placeholder="e.g. Acme Corp"
            value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Location *</label>
          <input required className={inputClass} placeholder="e.g. New York, NY or Remote"
            value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Work Mode</label>
          <select className={selectClass} value={form.work_mode} onChange={(e) => setForm({ ...form, work_mode: e.target.value })}>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Job Type</label>
          <select className={selectClass} value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value })}>
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full rounded-xl gap-2" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
        {loading ? "Posting…" : "Post This Job"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">You'll be able to add full details (salary, description, skills) from your dashboard.</p>
    </motion.form>
  );
}