import React from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight, Star, DollarSign, Calendar, Users, CheckCircle2,
  Briefcase, TrendingUp, Award, Zap, Globe, FileText
} from "lucide-react";

const perks = [
  { icon: DollarSign, title: "Earn Per Screening", desc: "Straight pay for every completed evaluation. No quotas, no commission splits." },
  { icon: Calendar, title: "Work Your Own Hours", desc: "Pick up assignments on your schedule — mornings, evenings, weekends. You set the pace." },
  { icon: Star, title: "Build Your Reputation", desc: "Ratings grow with every evaluation. Top screeners unlock better-paying roles." },
  { icon: Globe, title: "100% Remote", desc: "All screenings are online. Reliable internet and a quiet space is all you need." },
  { icon: TrendingUp, title: "Work Across Industries", desc: "Tech, finance, healthcare, ops, and more — diversify your screening portfolio." },
  { icon: Award, title: "Certify & Earn More", desc: "Complete our online certification to unlock higher-paying assignments." },
];

const howItWorks = [
  { step: "1", title: "Apply & Get Certified", desc: "Create your screener profile and highlight your domain expertise. Complete TalentTurbo's online certification — takes about 2 hours — and you're approved within 48 hours." },
  { step: "2", title: "Pick Your Assignments", desc: "Browse open screening requests that match your skills and availability. Claim the ones you want — it's first-come, first-served, so the best roles go fast." },
  { step: "3", title: "Conduct the Interview & Submit a Scorecard", desc: "Run a structured interview using our platform. Submit your evaluation using a standardized scorecard framework — clear, consistent, and fair for every candidate." },
  { step: "4", title: "Get Paid Within 7 Days", desc: "Payment is released within 7 days of a completed, accepted scorecard. Top performers also earn bonuses for candidates who go on to get hired." },
];

const earningsTiers = [
  { tier: "Associate Screener", rate: "$15–$30", per: "per screening", color: "border-border/50", badge: "bg-muted text-muted-foreground" },
  { tier: "Certified Screener", rate: "$30–$60", per: "per screening", color: "border-primary/40", badge: "bg-primary/10 text-primary", popular: true },
  { tier: "Expert Screener", rate: "$60–$120", per: "per screening", color: "border-accent/40", badge: "bg-accent/10 text-accent" },
];

export default function Recruiters() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-primary/5" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Briefcase className="w-4 h-4" />
                <span>For Independent Recruiters & Screeners</span>
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Screen candidates.{" "}
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  Get paid per eval.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
                Join TalentTurbo's on-demand screening network. Pick assessments that match your expertise, 
                work on your schedule, and earn per completed evaluation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-xl px-8 h-13 text-base gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => base44.auth.redirectToLogin()}>
                  Apply as a Screener <ArrowRight className="w-4 h-4" />
                </Button>
                <Link to="/jobs">
                  <Button size="lg" variant="outline" className="rounded-xl px-8 h-13 text-base w-full sm:w-auto">
                    View Open Roles
                  </Button>
                </Link>
              </div>
              {/* Quick stats */}
              <div className="flex flex-wrap gap-8 mt-12">
                {[
                  { value: "2,400+", label: "Active Screeners" },
                  { value: "$850", label: "Avg. Monthly Earnings" },
                  { value: "48hr", label: "First Payment" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-heading text-2xl font-bold text-primary">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Why join us</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">Built to support your growth</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-7 border border-border/50 hover:border-accent/30 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-5">
                  <p.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Getting started</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">How it works for screeners</h2>
          </div>
          <div className="space-y-8">
            {howItWorks.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex gap-6 items-start"
              >
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-heading font-bold text-lg shrink-0">
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

      {/* Earnings Tiers */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Earnings</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold">What you can earn</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Rates increase as you build reputation and complete certification milestones. 
              Top screeners average 12–20 screenings per month.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {earningsTiers.map((t, i) => (
              <motion.div
                key={t.tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-card rounded-2xl p-8 border-2 ${t.color} relative text-center`}
              >
                {t.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                    Most Common
                  </div>
                )}
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${t.badge}`}>{t.tier}</span>
                <p className="font-heading text-4xl font-bold mb-1">{t.rate}</p>
                <p className="text-sm text-muted-foreground">{t.per}</p>
                <div className="mt-6 space-y-2 text-sm text-muted-foreground text-left">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0" />Standard role access</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0" />Flexible scheduling</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent shrink-0" />Performance bonuses</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Requirements</p>
              <h2 className="font-heading text-3xl font-bold mb-6">Who can join as a screener?</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We work with experienced recruiters, HR professionals, technical leads, and domain experts 
                who know how to assess candidates fairly and thoroughly.
              </p>
              <div className="space-y-3">
                {[
                  "3+ years in recruiting, HR, or a relevant domain",
                  "Strong interviewing and structured evaluation skills",
                  "Reliable internet and a quiet space to conduct interviews",
                  "Completion of TalentTurbo's online certification",
                  "Availability for at least 5 screenings per month",
                ].map((req) => (
                  <div key={req} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm">{req}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-8 border border-border/50"
            >
              <FileText className="w-10 h-10 text-accent mb-4" />
              <h3 className="font-heading font-semibold text-xl mb-3">Ready to apply?</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Set up your profile, complete the online certification (about 2 hours), and start 
                picking up screening assignments within 48 hours of approval.
              </p>
              <Button className="w-full rounded-xl gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => base44.auth.redirectToLogin()}>
                Apply Now <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Zap className="w-12 h-12 text-accent mx-auto mb-6" />
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Turn expertise into a reliable income stream</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join 2,400+ screeners already earning on TalentTurbo — on their own terms.
          </p>
          <Button size="lg" className="rounded-xl px-8 h-13 text-base gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => base44.auth.redirectToLogin()}>
            Join as a Screener <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}