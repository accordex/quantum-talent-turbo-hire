import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { id: "post_job",    label: "Post your first job",         desc: "Create a job posting to start attracting candidates.",  path: "/employers",      cta: "Post Job" },
  { id: "profile",     label: "Complete your company info",  desc: "Add your company name and logo to job postings.",        path: "/profile/edit",   cta: "Edit Profile" },
  { id: "review",      label: "Review matched candidates",   desc: "Check your applicants and see AI-ranked matches.",       path: "#jobs",           cta: "View Applicants" },
  { id: "shortlist",   label: "Shortlist your top picks",    desc: "Bookmark standout candidates for easy comparison.",      path: "#shortlist",      cta: "View Shortlist" },
  { id: "interview",   label: "Move a candidate to interview", desc: "Update a candidate's status to Interview.",            path: "#pipeline",       cta: "Open Pipeline" },
];

export default function EmployerOnboarding({ hasJobs, hasApplicants, hasShortlisted, hasInterview }) {
  const [collapsed, setCollapsed] = useState(false);

  const completed = {
    post_job:  hasJobs,
    profile:   true, // always mark as done — they're logged in
    review:    hasApplicants,
    shortlist: hasShortlisted,
    interview: hasInterview,
  };

  const doneCount = Object.values(completed).filter(Boolean).length;
  const allDone = doneCount === STEPS.length;

  if (allDone) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary/8 to-accent/5 border border-primary/20 rounded-2xl mb-8 overflow-hidden"
    >
      <button
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
            <Rocket className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm">Get started checklist</p>
            <p className="text-xs text-muted-foreground">{doneCount}/{STEPS.length} steps completed</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress bar */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(doneCount / STEPS.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium">{Math.round((doneCount / STEPS.length) * 100)}%</span>
          </div>
          {collapsed ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronUp className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-6 pb-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {STEPS.map((step) => {
                const done = completed[step.id];
                return (
                  <div
                    key={step.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${done ? "bg-chart-3/5 border-chart-3/20 opacity-60" : "bg-card border-border/50 hover:border-primary/30"}`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {done
                        ? <CheckCircle2 className="w-4 h-4 text-chart-3" />
                        : <Circle className="w-4 h-4 text-muted-foreground" />
                      }
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium ${done ? "line-through text-muted-foreground" : ""}`}>{step.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.desc}</p>
                      {!done && (
                        <Link to={step.path} className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-1.5 hover:underline">
                          {step.cta} →
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}