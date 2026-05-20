import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2, Upload, FileText, Download, Trash2,
  Sparkles, CheckCircle2, X
} from "lucide-react";
import SectionShell from "./SectionShell";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeSection({ user, onSaved }) {
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Please upload a PDF file.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large. Max 5MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.auth.updateMe({ resume_url: file_url, resume_filename: file.name });
    onSaved?.({ ...user, resume_url: file_url, resume_filename: file.name });
    setUploading(false);

    toast({ title: "Resume uploaded!", description: "Now parsing your resume with AI…" });
    parseResume(file_url, file.name);
  };

  const parseResume = async (url, filename) => {
    setParsing(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Parse the resume at this URL and extract structured data. Resume filename: ${filename}. Resume URL: ${url}
      
      Extract all available information into the exact JSON schema provided. Be thorough.
      For skills, extract all technical and professional skills mentioned.
      For experience, extract each job with title, company, location, dates, and description.
      For education, extract each degree with institution, degree type, field of study, and years.
      Extract the professional headline from job title or summary.
      Extract the professional bio/summary if present.`,
      file_urls: [url],
      response_json_schema: {
        type: "object",
        properties: {
          headline: { type: "string" },
          location: { type: "string" },
          bio: { type: "string" },
          skills: { type: "array", items: { type: "string" } },
          experience: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                company: { type: "string" },
                location: { type: "string" },
                start_date: { type: "string" },
                end_date: { type: "string" },
                is_current: { type: "boolean" },
                description: { type: "string" }
              }
            }
          },
          education: {
            type: "array",
            items: {
              type: "object",
              properties: {
                institution: { type: "string" },
                degree: { type: "string" },
                field_of_study: { type: "string" },
                start_year: { type: "string" },
                end_year: { type: "string" },
                is_current: { type: "boolean" }
              }
            }
          },
          linkedin_url: { type: "string" },
          github_url: { type: "string" },
          portfolio_url: { type: "string" }
        }
      }
    });
    setParsedData(result);
    setParsing(false);
  };

  const applyParsedData = async () => {
    if (!parsedData) return;
    const cleaned = {
      ...parsedData,
      experience: (parsedData.experience || []).map(e => ({ ...e, id: crypto.randomUUID() })),
      education: (parsedData.education || []).map(e => ({ ...e, id: crypto.randomUUID() })),
    };
    await base44.auth.updateMe(cleaned);
    onSaved?.({ ...user, ...cleaned });
    setParsedData(null);
    toast({ title: "Profile updated from resume!", description: "Review each section to confirm the details." });
  };

  const removeResume = async () => {
    await base44.auth.updateMe({ resume_url: null, resume_filename: null });
    onSaved?.({ ...user, resume_url: null, resume_filename: null });
    toast({ title: "Resume removed." });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  return (
    <SectionShell
      title="Resume"
      description="Upload your resume PDF. Our AI will auto-fill your profile from it."
    >
      <div className="space-y-6">
        {/* Current resume */}
        {user?.resume_url && (
          <div className="flex items-center gap-4 p-5 rounded-xl border border-border/50 bg-muted/30">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.resume_filename || "resume.pdf"}</p>
              <p className="text-xs text-muted-foreground">PDF · Uploaded to your profile</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a href={user.resume_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
                  <Download className="w-3.5 h-3.5" /> View
                </Button>
              </a>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={removeResume}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Upload area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`rounded-2xl border-2 border-dashed p-10 text-center transition-all cursor-pointer
            ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"}
            ${uploading ? "opacity-50 pointer-events-none" : ""}`}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm font-medium">Uploading resume…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="font-medium mb-1">{user?.resume_url ? "Replace resume" : "Upload your resume"}</p>
                <p className="text-sm text-muted-foreground">Drag & drop or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">PDF only · Max 5MB</p>
              </div>
            </div>
          )}
        </div>

        {/* AI Parsing status */}
        <AnimatePresence>
          {parsing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-4 p-5 rounded-xl border border-primary/30 bg-primary/5"
            >
              <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
              <div>
                <p className="font-medium text-sm text-primary">AI is parsing your resume…</p>
                <p className="text-xs text-muted-foreground">Extracting skills, experience, and education</p>
              </div>
            </motion.div>
          )}

          {parsedData && !parsing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-xl border border-chart-3/30 bg-chart-3/5 p-5 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-chart-3/15 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-chart-3" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Resume parsed successfully!</p>
                    <p className="text-xs text-muted-foreground">Review and apply the extracted data to your profile</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setParsedData(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Preview extracted data */}
              <div className="grid sm:grid-cols-3 gap-3 text-sm">
                {parsedData.skills?.length > 0 && (
                  <ParsedItem icon={CheckCircle2} label="Skills" value={`${parsedData.skills.length} found`} color="text-chart-3" />
                )}
                {parsedData.experience?.length > 0 && (
                  <ParsedItem icon={CheckCircle2} label="Experience" value={`${parsedData.experience.length} positions`} color="text-chart-3" />
                )}
                {parsedData.education?.length > 0 && (
                  <ParsedItem icon={CheckCircle2} label="Education" value={`${parsedData.education.length} entries`} color="text-chart-3" />
                )}
                {parsedData.headline && (
                  <ParsedItem icon={CheckCircle2} label="Headline" value="Extracted" color="text-chart-3" />
                )}
                {parsedData.bio && (
                  <ParsedItem icon={CheckCircle2} label="Summary" value="Extracted" color="text-chart-3" />
                )}
              </div>

              <div className="flex gap-3">
                <Button onClick={applyParsedData} className="rounded-xl gap-2 bg-chart-3 hover:bg-chart-3/90 text-white">
                  <Sparkles className="w-4 h-4" />
                  Apply to Profile
                </Button>
                <Button variant="ghost" onClick={() => setParsedData(null)} className="rounded-xl">
                  Dismiss
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips */}
        <div className="rounded-xl bg-muted/50 p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tips for best AI parsing</p>
          {["Use a clean, text-based PDF (not scanned images)", "Include dates in your experience (Month Year format)", "List skills in a dedicated skills section", "Ensure contact info is clearly labeled"].map(tip => (
            <div key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-1.5 shrink-0" />
              {tip}
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function ParsedItem({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-white/50 border border-border/30">
      <Icon className={`w-4 h-4 ${color} shrink-0`} />
      <div>
        <p className="font-medium text-xs">{label}</p>
        <p className="text-xs text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}