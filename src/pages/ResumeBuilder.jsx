import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, Download, Sparkles, Loader2,
  Mail, Phone, MapPin, Globe, Github, Linkedin,
  Briefcase, GraduationCap, Wrench, Star
} from "lucide-react";

const TEMPLATES = [
  { id: "classic", label: "Classic", description: "Clean single-column layout" },
  { id: "modern", label: "Modern", description: "Two-column with sidebar" },
  { id: "minimal", label: "Minimal", description: "Ultra-clean typographic" },
];

export default function ResumeBuilder() {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState("classic");
  const [generating, setGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const previewRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then((u) => { setUser(u); setLoading(false); });
  }, []);

  const generateAISummary = async () => {
    if (!user) return;
    setGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Write a professional resume summary (3-4 sentences) for this candidate:
Name: ${user.full_name}
Headline: ${user.headline || ""}
Skills: ${(user.skills || []).join(", ")}
Experience: ${(user.experience || []).map(e => `${e.title} at ${e.company}`).join("; ")}
Bio: ${user.bio || ""}

Write a compelling, concise professional summary in first person. No fluff.`,
    });
    setAiSummary(result);
    setGenerating(false);
    toast({ title: "AI Summary generated!", description: "Review and it will appear on your resume." });
  };

  const handleDownload = () => {
    toast({ title: "Preparing download…", description: "Use your browser's Print → Save as PDF for best results." });
    setTimeout(() => window.print(), 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-[600px] rounded-2xl lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold">Resume Builder</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Build your resume from your profile data</p>
            </div>
          </div>
          <Button onClick={handleDownload} className="rounded-xl gap-2 hidden sm:flex print:hidden">
            <Download className="w-4 h-4" /> Download PDF
          </Button>
        </div>

        <div className="flex gap-8 items-start">
          {/* Controls sidebar */}
          <div className="w-72 shrink-0 space-y-5 print:hidden">
            {/* Template picker */}
            <div className="bg-card rounded-2xl border border-border/50 p-5">
              <h3 className="font-heading font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">Template</h3>
              <div className="space-y-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      template === t.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <p className="font-medium text-sm">{t.label}</p>
                    <p className="text-xs opacity-70 mt-0.5">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-card rounded-2xl border border-border/50 p-5">
              <h3 className="font-heading font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">AI Summary</h3>
              <p className="text-xs text-muted-foreground mb-4">Generate a professional summary tailored to your profile.</p>
              <Button
                onClick={generateAISummary}
                disabled={generating}
                variant="outline"
                className="w-full rounded-xl gap-2"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-primary" />}
                {generating ? "Generating…" : "Generate with AI"}
              </Button>
              {aiSummary && (
                <p className="text-xs text-muted-foreground mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20 leading-relaxed">
                  {aiSummary}
                </p>
              )}
            </div>

            {/* Profile completeness tip */}
            {(!user?.experience?.length || !user?.skills?.length) && (
              <div className="bg-chart-4/5 border border-chart-4/20 rounded-2xl p-5">
                <p className="text-xs font-semibold text-chart-4 mb-1">Profile Incomplete</p>
                <p className="text-xs text-muted-foreground mb-3">Add more profile data for a better resume.</p>
                <Link to="/profile/edit">
                  <Button variant="outline" size="sm" className="w-full rounded-xl text-xs">Complete Profile</Button>
                </Link>
              </div>
            )}

            <Button onClick={handleDownload} className="w-full rounded-xl gap-2 sm:hidden">
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </div>

          {/* Resume Preview */}
          <div className="flex-1 min-w-0">
            <div ref={previewRef} className="print:shadow-none">
              {template === "classic" && <ClassicTemplate user={user} aiSummary={aiSummary} />}
              {template === "modern" && <ModernTemplate user={user} aiSummary={aiSummary} />}
              {template === "minimal" && <MinimalTemplate user={user} aiSummary={aiSummary} />}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #resume-print, #resume-print * { visibility: visible; }
          #resume-print { position: fixed; top: 0; left: 0; width: 100%; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function ClassicTemplate({ user, aiSummary }) {
  return (
    <div id="resume-print" className="bg-white text-gray-900 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-10">
        <h1 className="text-3xl font-bold">{user?.full_name || "Your Name"}</h1>
        {user?.headline && <p className="text-blue-100 text-lg mt-1">{user.headline}</p>}
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-sm text-blue-200">
          {user?.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {user.email}</span>}
          {user?.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {user.phone}</span>}
          {user?.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {user.location}</span>}
          {user?.portfolio_url && <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {user.portfolio_url}</span>}
          {user?.linkedin_url && <span className="flex items-center gap-1"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</span>}
          {user?.github_url && <span className="flex items-center gap-1"><Github className="w-3.5 h-3.5" /> GitHub</span>}
        </div>
      </div>

      <div className="px-8 py-8 space-y-7">
        {/* Summary */}
        {(aiSummary || user?.bio) && (
          <ResumeSection title="Summary" icon={Star}>
            <p className="text-gray-600 leading-relaxed text-sm">{aiSummary || user.bio}</p>
          </ResumeSection>
        )}

        {/* Experience */}
        {user?.experience?.length > 0 && (
          <ResumeSection title="Experience" icon={Briefcase}>
            <div className="space-y-5">
              {user.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{exp.title}</p>
                      <p className="text-blue-600 text-sm">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                    </div>
                    <p className="text-xs text-gray-500 shrink-0">
                      {exp.start_date} — {exp.is_current ? "Present" : exp.end_date}
                    </p>
                  </div>
                  {exp.description && <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </ResumeSection>
        )}

        {/* Education */}
        {user?.education?.length > 0 && (
          <ResumeSection title="Education" icon={GraduationCap}>
            <div className="space-y-4">
              {user.education.map((edu, i) => (
                <div key={i} className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{edu.degree}{edu.field_of_study ? ` in ${edu.field_of_study}` : ""}</p>
                    <p className="text-blue-600 text-sm">{edu.institution}</p>
                  </div>
                  <p className="text-xs text-gray-500 shrink-0">
                    {edu.start_year} — {edu.is_current ? "Present" : edu.end_year}
                  </p>
                </div>
              ))}
            </div>
          </ResumeSection>
        )}

        {/* Skills */}
        {user?.skills?.length > 0 && (
          <ResumeSection title="Skills" icon={Wrench}>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((s) => (
                <span key={s} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">{s}</span>
              ))}
            </div>
          </ResumeSection>
        )}
      </div>
    </div>
  );
}

function ModernTemplate({ user, aiSummary }) {
  return (
    <div id="resume-print" className="bg-white text-gray-900 rounded-2xl shadow-xl overflow-hidden flex">
      {/* Sidebar */}
      <div className="w-56 bg-gray-900 text-white px-5 py-8 shrink-0 space-y-6">
        <div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white mb-3">
            {(user?.full_name || "U")[0]}
          </div>
          <h1 className="text-lg font-bold leading-tight">{user?.full_name || "Your Name"}</h1>
          {user?.headline && <p className="text-gray-400 text-xs mt-1 leading-relaxed">{user.headline}</p>}
        </div>

        <div className="space-y-2 text-xs text-gray-300">
          {user?.email && <p className="flex items-center gap-1.5 break-all"><Mail className="w-3 h-3 text-purple-400 shrink-0" />{user.email}</p>}
          {user?.phone && <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-purple-400 shrink-0" />{user.phone}</p>}
          {user?.location && <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-purple-400 shrink-0" />{user.location}</p>}
          {user?.linkedin_url && <p className="flex items-center gap-1.5"><Linkedin className="w-3 h-3 text-purple-400 shrink-0" />LinkedIn</p>}
          {user?.github_url && <p className="flex items-center gap-1.5"><Github className="w-3 h-3 text-purple-400 shrink-0" />GitHub</p>}
        </div>

        {user?.skills?.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Skills</p>
            <div className="space-y-1">
              {user.skills.slice(0, 12).map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-purple-400 shrink-0" />
                  <span className="text-xs text-gray-300">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 px-7 py-8 space-y-6 min-w-0">
        {(aiSummary || user?.bio) && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-2">Profile</p>
            <p className="text-sm text-gray-600 leading-relaxed">{aiSummary || user.bio}</p>
          </div>
        )}

        {user?.experience?.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-3">Experience</p>
            <div className="space-y-5">
              {user.experience.map((exp, i) => (
                <div key={i} className="border-l-2 border-purple-100 pl-4">
                  <p className="font-semibold text-gray-900 text-sm">{exp.title}</p>
                  <p className="text-purple-600 text-xs">{exp.company} · <span className="text-gray-500">{exp.start_date} — {exp.is_current ? "Present" : exp.end_date}</span></p>
                  {exp.description && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {user?.education?.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-3">Education</p>
            <div className="space-y-3">
              {user.education.map((edu, i) => (
                <div key={i}>
                  <p className="font-semibold text-gray-900 text-sm">{edu.degree}{edu.field_of_study ? ` · ${edu.field_of_study}` : ""}</p>
                  <p className="text-xs text-gray-500">{edu.institution} · {edu.start_year}–{edu.is_current ? "Present" : edu.end_year}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MinimalTemplate({ user, aiSummary }) {
  return (
    <div id="resume-print" className="bg-white text-gray-900 rounded-2xl shadow-xl px-12 py-10 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-4xl font-light tracking-tight text-gray-900">{user?.full_name || "Your Name"}</h1>
        {user?.headline && <p className="text-gray-500 mt-1">{user.headline}</p>}
        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-xs text-gray-400">
          {user?.email && <span>{user.email}</span>}
          {user?.phone && <span>{user.phone}</span>}
          {user?.location && <span>{user.location}</span>}
          {user?.linkedin_url && <span>LinkedIn</span>}
          {user?.github_url && <span>GitHub</span>}
        </div>
      </div>

      {(aiSummary || user?.bio) && (
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">About</p>
          <p className="text-sm text-gray-600 leading-relaxed">{aiSummary || user.bio}</p>
        </div>
      )}

      {user?.experience?.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Experience</p>
          <div className="space-y-6">
            {user.experience.map((exp, i) => (
              <div key={i} className="grid grid-cols-4 gap-4">
                <p className="text-xs text-gray-400 col-span-1 pt-0.5">{exp.start_date}<br />{exp.is_current ? "Present" : exp.end_date}</p>
                <div className="col-span-3">
                  <p className="font-medium text-sm">{exp.title}</p>
                  <p className="text-xs text-gray-500">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
                  {exp.description && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{exp.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {user?.education?.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Education</p>
          <div className="space-y-3">
            {user.education.map((edu, i) => (
              <div key={i} className="grid grid-cols-4 gap-4">
                <p className="text-xs text-gray-400">{edu.start_year}–{edu.is_current ? "Now" : edu.end_year}</p>
                <div className="col-span-3">
                  <p className="font-medium text-sm">{edu.degree}{edu.field_of_study ? `, ${edu.field_of_study}` : ""}</p>
                  <p className="text-xs text-gray-500">{edu.institution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {user?.skills?.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Skills</p>
          <p className="text-sm text-gray-600">{user.skills.join(" · ")}</p>
        </div>
      )}
    </div>
  );
}

function ResumeSection({ title, icon: SectionIcon, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <SectionIcon className="w-4 h-4 text-blue-600" />
        <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide">{title}</h2>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      {children}
    </div>
  );
}