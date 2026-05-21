import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { q: "How does TalentTurbo match candidates?", a: "We match candidates by skills, experience, and role criteria — then certified interviewers assess each one with a structured evaluation. Every candidate you see comes with a human-reviewed scorecard." },
  { q: "How fast will I get candidates after posting a job?", a: "Most employers receive screened candidates within 48–72 hours. Our on-demand screener network eliminates the usual sourcing wait." },
  { q: "Does TalentTurbo work for non-tech roles?", a: "Yes. We cover tech, finance, healthcare, marketing, operations, and more. Any role with clear skills criteria can be matched and screened on our platform." },
  { q: "How does the on-demand screener model work?", a: "Certified screeners pick up assignments that match their expertise, conduct structured interviews, submit scorecards, and get paid per completed evaluation — on their own schedule, fully remote." },
  { q: "Can job seekers apply directly?", a: "Yes. Create a free profile, upload your resume, and apply directly to any listing. All applications are tracked in real time with built-in resume and interview prep tools." },
  { q: "What does it cost?", a: "There's a free tier for individuals and job seekers. Employer plans start at $299/mo. Enterprise pricing is custom. No hidden fees, no lock-in." },
];

export default function FAQSection() {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-28 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">FAQ</p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-foreground">
            Questions?<br />
            <span style={{ background: "linear-gradient(135deg, hsl(265,89%,75%), hsl(199,89%,55%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              We've got answers.
            </span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                open === i ? "border-primary/25 bg-primary/5" : "border-white/6 bg-white/[0.02] hover:border-white/12"
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className={`font-heading font-semibold text-base pr-4 transition-colors ${open === i ? "text-foreground" : "text-foreground/70"}`}>
                  {faq.q}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  open === i ? "bg-primary text-primary-foreground" : "bg-white/5 text-foreground/40"
                }`}>
                  {open === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="px-6 pb-6 text-sm text-foreground/45 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}