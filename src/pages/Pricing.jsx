import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Zap, HelpCircle } from "lucide-react";

const plans = {
  employers: [
    {
      name: "Starter",
      price: { monthly: 0, annual: 0 },
      desc: "Great for small teams making a few hires a year.",
      badge: null,
      color: "border-border/50",
      features: [
        "Up to 3 active job postings",
        "Candidate search and filtering",
        "Application tracking dashboard",
        "Standard listing visibility",
        "Email support",
      ],
      cta: "Get Started Free",
    },
    {
      name: "Growth",
      price: { monthly: 299, annual: 249 },
      desc: "For teams that are actively scaling their hiring pipeline.",
      badge: "Most Popular",
      color: "border-primary/60",
      features: [
        "Up to 25 active job postings",
        "AI-powered candidate matching",
        "Candidate scorecards from screeners",
        "Featured job listing placement",
        "Advanced filters and sorting",
        "Hiring analytics dashboard",
        "Priority support",
      ],
      cta: "Start 14-Day Free Trial",
    },
    {
      name: "Enterprise",
      price: { monthly: null, annual: null },
      desc: "Built for large teams, high-volume hiring, or agencies.",
      badge: null,
      color: "border-accent/40",
      features: [
        "Unlimited job postings",
        "Dedicated account manager",
        "Custom screening workflows",
        "ATS and HRIS integrations",
        "White-label options",
        "SLA guarantees",
        "Custom reporting and exports",
      ],
      cta: "Contact Sales",
    },
  ],
  jobseekers: [
    {
      name: "Free",
      price: { monthly: 0, annual: 0 },
      desc: "Everything you need to start your job search today.",
      badge: null,
      color: "border-border/50",
      features: [
        "Browse all job listings",
        "Apply to unlimited roles",
        "Resume builder (basic)",
        "Up to 3 job alerts",
        "Application tracking",
      ],
      cta: "Sign Up Free",
    },
    {
      name: "Pro",
      price: { monthly: 19, annual: 14 },
      desc: "Get noticed faster and land offers sooner.",
      badge: "Best Value",
      color: "border-primary/60",
      features: [
        "Everything in Free",
        "Priority applicant badge on your profile",
        "AI resume review and improvement tips",
        "Unlimited job alerts",
        "Unlimited interview prep sessions",
        "Salary negotiation guide",
        "Boosted profile visibility to employers",
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Career Coach",
      price: { monthly: 49, annual: 39 },
      desc: "Personal support from a real career expert.",
      badge: null,
      color: "border-accent/40",
      features: [
        "Everything in Pro",
        "1-on-1 coaching sessions",
        "Professional resume writing",
        "LinkedIn profile review and optimization",
        "Mock interview sessions with feedback",
        "Custom job search strategy",
      ],
      cta: "Get a Coach",
    },
  ],
};

const faqs = [
  { q: "Can I switch plans later?", a: "Yes, anytime. Upgrade or downgrade and the change takes effect at the start of your next billing cycle. No penalties." },
  { q: "Do the paid plans come with a free trial?", a: "Yes — the Employer Growth plan and Job Seeker Pro both include a 14-day free trial. No credit card required to start." },
  { q: "How does Enterprise pricing work?", a: "We scope a custom package based on your hiring volume, team size, and workflow needs. Get in touch and we'll put together a proposal." },
  { q: "Are there discounts for startups or non-profits?", a: "Yes. Verified startups under 50 employees and registered non-profits get 30% off all paid plans. Contact our support team to apply." },
  { q: "What payment methods do you accept?", a: "All major credit and debit cards. Enterprise clients can pay via bank transfer or invoice on annual plans." },
];

export default function Pricing() {
  const [audience, setAudience] = useState("employers");
  const [annual, setAnnual] = useState(false);

  const currentPlans = plans[audience];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
              Simple, transparent{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">pricing</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Start free. Scale when you're ready. No hidden fees, no lock-in.
            </p>

            {/* Audience toggle */}
            <div className="inline-flex bg-muted rounded-xl p-1 mb-8">
              {["employers", "jobseekers"].map((a) => (
                <button
                  key={a}
                  onClick={() => setAudience(a)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    audience === a ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {a === "employers" ? "For Employers" : "For Job Seekers"}
                </button>
              ))}
            </div>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-3 text-sm">
              <span className={annual ? "text-muted-foreground" : "font-medium"}>Monthly</span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`w-11 h-6 rounded-full transition-colors relative ${annual ? "bg-primary" : "bg-muted-foreground/30"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${annual ? "left-6" : "left-1"}`} />
              </button>
              <span className={annual ? "font-medium" : "text-muted-foreground"}>
                Annual <span className="text-primary font-semibold">Save 20%</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {currentPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-card rounded-2xl p-8 border-2 ${plan.color} relative flex flex-col`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                    {plan.badge}
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="font-heading font-bold text-xl mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-5">{plan.desc}</p>
                  {plan.price.monthly === null ? (
                    <p className="font-heading text-3xl font-bold">Custom</p>
                  ) : plan.price.monthly === 0 ? (
                    <p className="font-heading text-4xl font-bold">Free</p>
                  ) : (
                    <div>
                      <span className="font-heading text-4xl font-bold">
                        ${annual ? plan.price.annual : plan.price.monthly}
                      </span>
                      <span className="text-muted-foreground text-sm ml-1">/mo</span>
                      {annual && <p className="text-xs text-primary mt-1">Billed annually</p>}
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/get-started">
                  <Button
                    className="w-full rounded-xl"
                    variant={plan.badge ? "default" : "outline"}
                  >
                    {plan.cta} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <HelpCircle className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-3xl font-bold">Pricing FAQs</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-card rounded-2xl p-6 border border-border/50"
              >
                <h4 className="font-semibold mb-2">{f.q}</h4>
                <p className="text-sm text-muted-foreground">{f.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-background">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">Not sure where to start?</h2>
          <p className="text-muted-foreground mb-6">Talk to us — we'll help you find the right plan for your goals in under 10 minutes.</p>
          <Link to="/get-started">
            <Button size="lg" className="rounded-xl px-8 gap-2">
              Talk to Us <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}