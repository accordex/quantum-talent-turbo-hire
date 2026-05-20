import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Briefcase, Search, ArrowRight, CheckCircle2, ChevronLeft } from "lucide-react";

const roles = [
  {
    id: "employer",
    icon: Building2,
    title: "I'm hiring for my company",
    desc: "I need qualified candidates — fast. I want pre-screened people, not a pile of resumes to sort through.",
    color: "border-primary/50 hover:border-primary bg-primary/5",
    activeColor: "border-primary bg-primary/10",
    accent: "text-primary",
    benefits: [
      "Post a role and receive matched candidates within 48 hours",
      "Every candidate is assessed by a certified interviewer",
      "Detailed scorecards so you can make confident decisions",
      "Manage your full hiring pipeline in one dashboard",
      "Insights and analytics at every stage",
    ],
    cta: "Post a Job",
    link: "/employers",
  },
  {
    id: "recruiter",
    icon: Briefcase,
    title: "I'm a recruiter or interviewer",
    desc: "I want to earn by assessing candidates — on my schedule, without the overhead of running my own agency.",
    color: "border-accent/50 hover:border-accent bg-accent/5",
    activeColor: "border-accent bg-accent/10",
    accent: "text-accent",
    benefits: [
      "Earn $15–$120 per completed screening",
      "Work remotely, fully on your own schedule",
      "Build a verified rating and unlock better-paying roles",
      "Access opportunities across industries globally",
      "Certification program to increase your earning potential",
    ],
    cta: "See How It Works",
    link: "/recruiters",
  },
  {
    id: "jobseeker",
    icon: Search,
    title: "I'm looking for a job",
    desc: "I want to find roles that actually match my skills, apply without hassle, and know where I stand.",
    color: "border-chart-3/50 hover:border-chart-3 bg-chart-3/5",
    activeColor: "border-chart-3 bg-chart-3/10",
    accent: "text-chart-3",
    benefits: [
      "Browse verified job listings matched to your skills",
      "Apply in minutes — no lengthy forms",
      "Track every application from one dashboard",
      "Build your resume with our free resume builder",
      "Prep for interviews with AI-powered practice tools",
    ],
    cta: "Browse Jobs",
    link: "/jobs",
  },
];

export default function GetStarted() {
  const [selected, setSelected] = useState(null);
  const selectedRole = roles.find((r) => r.id === selected);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="relative pt-24 pb-16 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
              Get started with{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">TalentTurbo</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Who are you? We'll point you in the right direction.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!selected ? (
              <motion.div
                key="role-select"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid sm:grid-cols-3 gap-5"
              >
                {roles.map((role, i) => (
                  <motion.button
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelected(role.id)}
                    className={`text-left rounded-2xl border-2 p-7 transition-all group ${role.color}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-card flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                      <role.icon className={`w-6 h-6 ${role.accent}`} />
                    </div>
                    <h3 className="font-heading font-bold text-lg mb-3 leading-snug">{role.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{role.desc}</p>
                    <div className={`mt-5 flex items-center gap-2 text-sm font-semibold ${role.accent}`}>
                      Learn more <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="role-detail"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="max-w-2xl mx-auto"
              >
                <button
                  onClick={() => setSelected(null)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                <div className={`rounded-2xl border-2 p-8 ${selectedRole.activeColor}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-card flex items-center justify-center">
                      <selectedRole.icon className={`w-7 h-7 ${selectedRole.accent}`} />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-2xl">{selectedRole.title}</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">{selectedRole.desc}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {selectedRole.benefits.map((b) => (
                      <div key={b} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${selectedRole.accent}`} />
                        <span className="text-sm">{b}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/dashboard" className="flex-1">
                      <Button size="lg" className="w-full rounded-xl gap-2">
                        Create Free Account <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to={selectedRole.link} className="flex-1">
                      <Button size="lg" variant="outline" className="w-full rounded-xl">
                        {selectedRole.cta}
                      </Button>
                    </Link>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer note */}
          {!selected && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-muted-foreground mt-8"
            >
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}