import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, Sparkles, Loader2, ChevronDown, ChevronUp,
  Lightbulb, Target, MessageSquare, Brain, CheckCircle2, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { id: "behavioral", label: "Behavioral", icon: MessageSquare, color: "text-primary bg-primary/10" },
  { id: "technical", label: "Technical", icon: Brain, color: "text-accent bg-accent/10" },
  { id: "situational", label: "Situational", icon: Target, color: "text-chart-4 bg-chart-4/10" },
  { id: "culture", label: "Culture Fit", icon: Lightbulb, color: "text-chart-3 bg-chart-3/10" },
];

export default function InterviewPrep() {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [questions, setQuestions] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [activeCategory, setActiveCategory] = useState("behavioral");
  const [expandedIdx, setExpandedIdx] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const generateQuestions = async () => {
    if (!jobDesc.trim()) {
      toast({ title: "Please paste a job description first.", variant: "destructive" });
      return;
    }
    setGenerating(true);
    setQuestions(null);
    setExpandedIdx(null);

    const skills = (user?.skills || []).join(", ");
    const experience = (user?.experience || []).map(e => `${e.title} at ${e.company}`).join("; ");

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate interview questions and model answers for this role.

Job Title: ${jobTitle || "the role"}
Job Description: ${jobDesc}

Candidate Background:
- Skills: ${skills || "not specified"}
- Experience: ${experience || "not specified"}

Generate 3 questions for EACH of these categories: behavioral, technical, situational, culture_fit.
For each question, provide:
1. The question text
2. Why the interviewer asks it
3. A strong model answer (4-6 sentences) personalized to the candidate's background

Make technical questions specific to the job's tech stack. Make behavioral questions use STAR format.`,
      response_json_schema: {
        type: "object",
        properties: {
          behavioral: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                why: { type: "string" },
                model_answer: { type: "string" }
              }
            }
          },
          technical: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                why: { type: "string" },
                model_answer: { type: "string" }
              }
            }
          },
          situational: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                why: { type: "string" },
                model_answer: { type: "string" }
              }
            }
          },
          culture_fit: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                why: { type: "string" },
                model_answer: { type: "string" }
              }
            }
          }
        }
      }
    });
    setQuestions(result);
    setGenerating(false);
  };

  const currentQuestions = questions?.[activeCategory === "culture" ? "culture_fit" : activeCategory] || [];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold">Interview Prep</h1>
            <p className="text-sm text-muted-foreground mt-0.5">AI-powered practice questions tailored to your target role</p>
          </div>
        </div>

        {/* Input */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 mb-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Job Title <span className="text-muted-foreground font-normal">(optional)</span></label>
            <input
              type="text"
              placeholder="e.g. Senior Frontend Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full h-10 rounded-xl border border-input bg-transparent px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Job Description <span className="text-destructive">*</span></label>
            <Textarea
              placeholder="Paste the full job description here…"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              className="min-h-[140px] rounded-xl resize-none"
            />
          </div>
          <Button
            onClick={generateQuestions}
            disabled={generating || !jobDesc.trim()}
            className="w-full rounded-xl gap-2"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? "Generating Questions…" : "Generate Interview Questions"}
          </Button>
        </div>

        {/* Results */}
        {generating && (
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        )}

        {questions && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {/* Category tabs */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setExpandedIdx(null); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                    activeCategory === cat.id
                      ? `${cat.color} border border-current/20`
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <cat.icon className="w-3.5 h-3.5" /> {cat.label}
                  <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
                    {(questions[cat.id === "culture" ? "culture_fit" : cat.id] || []).length}
                  </Badge>
                </button>
              ))}
            </div>

            {/* Questions */}
            <div className="space-y-3">
              {currentQuestions.map((q, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                  <button
                    className="w-full text-left p-5 flex items-start gap-4"
                    onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                  >
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium leading-snug">{q.question}</p>
                      {q.why && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" /> {q.why}
                        </p>
                      )}
                    </div>
                    {expandedIdx === i
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    }
                  </button>

                  <AnimatePresence>
                    {expandedIdx === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-0">
                          <div className="border-t border-border/50 pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="w-4 h-4 text-chart-3" />
                              <p className="text-sm font-semibold text-chart-3">Model Answer</p>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{q.model_answer}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={generateQuestions}
              className="w-full mt-4 rounded-xl gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Regenerate Questions
            </Button>
          </motion.div>
        )}

        {/* Tips when no questions yet */}
        {!questions && !generating && (
          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            {[
              { icon: Target, title: "Tailored to the JD", desc: "Questions are generated based on the exact job description you paste." },
              { icon: Brain, title: "Personalized Answers", desc: "Model answers reference your specific experience and skills." },
              { icon: MessageSquare, title: "4 Question Types", desc: "Behavioral, Technical, Situational, and Culture Fit questions." },
              { icon: Lightbulb, title: "Understand Intent", desc: "Each question explains why the interviewer is asking it." },
            ].map((item) => (
              <div key={item.title} className="bg-card rounded-2xl border border-border/50 p-5 flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}