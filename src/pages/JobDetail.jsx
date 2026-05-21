import React, { useState, useEffect } from "react";
import usePageTitle from "@/hooks/usePageTitle";
import { Link, useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, MapPin, Building2, Clock, DollarSign, Briefcase, Send,
  Bookmark, Share2, CheckCircle2, Globe, Sparkles, Loader2,
  Calendar, Users, Award, Target, Zap, TrendingUp, Star,
  ChevronRight, ExternalLink, Upload
} from "lucide-react";
import moment from "moment";
import JobCard from "../components/jobs/JobCard";

const typeLabels = { full_time: "Full-time", part_time: "Part-time", contract: "Contract", internship: "Internship" };
const modeLabels = { remote: "Remote", hybrid: "Hybrid", onsite: "On-site" };
const modeColors = {
  remote: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  hybrid: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  onsite: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};
const levelLabels = { entry: "Entry Level", mid: "Mid Level", senior: "Senior", lead: "Lead", executive: "Executive" };

export default function JobDetail() {
  const { id: jobId } = useParams();
  const [showApply, setShowApply] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [generatingCL, setGeneratingCL] = useState(false);
  const [applied, setApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  usePageTitle(pageTitle);

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      const jobs = await base44.entities.Job.filter({ id: jobId });
      return jobs[0] || null;
    },
    enabled: !!jobId,
  });

  useEffect(() => {
    if (job) setPageTitle(`${job.title} at ${job.company}`);
  }, [job]);

  // Fetch last application for prefill
  const { data: myApplications = [] } = useQuery({
    queryKey: ["myApplications"],
    queryFn: async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) return [];
      return base44.entities.Application.list("-created_date", 5);
    },
  });

  const { data: allJobs = [] } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => base44.entities.Job.list("-created_date", 200),
  });

  const { data: savedJobs = [] } = useQuery({
    queryKey: ["savedJobs"],
    queryFn: async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) return [];
      return base44.entities.SavedJob.list();
    },
  });

  useEffect(() => {
    if (job && savedJobs.length > 0) {
      setIsSaved(savedJobs.some(s => s.job_id === job.id));
    }
  }, [job, savedJobs]);

  const similarJobs = allJobs.filter(
    (j) => j.id !== jobId && j.status !== "draft" &&
      (j.industry === job?.industry || j.experience_level === job?.experience_level || (j.skills || []).some(s => (job?.skills || []).includes(s)))
  ).slice(0, 3);

  const formatSalary = (min, max) => {
    if (!min && !max) return null;
    const fmt = (n) => n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`;
    if (min && max) return `${fmt(min)} – ${fmt(max)}/yr`;
    if (min) return `From ${fmt(min)}/yr`;
    return `Up to ${fmt(max)}/yr`;
  };

  const handleSave = async () => {
    const isAuth = await base44.auth.isAuthenticated();
    if (!isAuth) { base44.auth.redirectToLogin(); return; }
    const existing = savedJobs.find(s => s.job_id === job.id);
    if (existing) {
      await base44.entities.SavedJob.delete(existing.id);
      setIsSaved(false);
    } else {
      await base44.entities.SavedJob.create({ job_id: job.id, job_title: job.title, company: job.company });
      setIsSaved(true);
    }
    queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: job.title, text: `${job.title} at ${job.company}`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied!", description: "Job link copied to clipboard." });
    }
  };

  const generateCoverLetter = async () => {
    const isAuth = await base44.auth.isAuthenticated();
    if (!isAuth) { base44.auth.redirectToLogin(); return; }
    setGeneratingCL(true);
    const user = await base44.auth.me();
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Write a professional cover letter for this job application.

Job Title: ${job.title}
Company: ${job.company}
Job Description: ${job.description || ""}
Requirements: ${(job.requirements || []).join(", ")}

Candidate:
- Name: ${user.full_name}
- Headline: ${user.headline || ""}
- Skills: ${(user.skills || []).join(", ")}
- Bio: ${user.bio || ""}

Write a compelling, concise cover letter (3 paragraphs). Personalize it to the specific role and company. Do not add subject line or date.`,
    });
    setCoverLetter(result);
    setGeneratingCL(false);
  };

  const handleApply = async () => {
    const isAuth = await base44.auth.isAuthenticated();
    if (!isAuth) { base44.auth.redirectToLogin(); return; }
    setApplying(true);
    const user = await base44.auth.me();
    await base44.entities.Application.create({
      job_id: job.id,
      job_title: job.title,
      company: job.company,
      status: "applied",
      cover_letter: coverLetter,
    });
    // Send confirmation email
    base44.integrations.Core.SendEmail({
      to: user.email,
      subject: `Application submitted: ${job.title} at ${job.company}`,
      body: `Hi ${user.full_name || "there"},\n\nYour application for <strong>${job.title}</strong> at <strong>${job.company}</strong> has been successfully submitted via TalentTurbo.\n\nYou can track your application status any time from your <a href="${window.location.origin}/dashboard">Dashboard</a>.\n\nGood luck!\n— The TalentTurbo Team`,
    });
    setApplying(false);
    setShowApply(false);
    setApplied(true);
    setCoverLetter("");
    toast({ title: "🎉 Application submitted!", description: "A confirmation email has been sent to you." });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 max-w-5xl mx-auto px-4">
        <Skeleton className="h-6 w-32 mb-6 rounded-xl" />
        <div className="bg-card rounded-2xl border border-border/50 p-8 mb-6">
          <div className="flex gap-4">
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-80" />
            </div>
          </div>
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen pt-24 pb-16 text-center">
        <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">Job not found</p>
        <Link to="/jobs"><Button variant="outline" className="rounded-xl">Back to Jobs</Button></Link>
      </div>
    );
  }

  const salary = formatSalary(job.salary_min, job.salary_max);

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Link>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* LEFT — main content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Hero card */}
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              {job.is_featured && <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary" />}
              <div className="p-7">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                    {job.company_logo ? (
                      <img src={job.company_logo} alt={job.company} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="font-heading text-2xl sm:text-3xl font-bold leading-tight mb-1">{job.title}</h1>
                    <p className="text-muted-foreground font-medium text-lg">{job.company}</p>
                    {job.is_featured && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-chart-4/15 text-chart-4 border border-chart-4/25 mt-2">
                        <Star className="w-3 h-3" /> Featured Role
                      </span>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary/50 rounded-lg px-3 py-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                  </span>
                  {job.work_mode && (
                    <span className={`flex items-center gap-1.5 text-sm rounded-lg px-3 py-1.5 border font-medium ${modeColors[job.work_mode] || "bg-secondary text-secondary-foreground border-border"}`}>
                      <Globe className="w-3.5 h-3.5" /> {modeLabels[job.work_mode]}
                    </span>
                  )}
                  {job.job_type && (
                    <span className="text-sm text-muted-foreground bg-secondary/50 rounded-lg px-3 py-1.5">
                      {typeLabels[job.job_type]}
                    </span>
                  )}
                  {job.experience_level && (
                    <span className="text-sm text-muted-foreground bg-secondary/50 rounded-lg px-3 py-1.5">
                      {levelLabels[job.experience_level]}
                    </span>
                  )}
                </div>

                {salary && (
                  <div className="flex items-center gap-2 mt-4">
                    <DollarSign className="w-5 h-5 text-chart-3" />
                    <span className="text-xl font-bold text-foreground">{salary}</span>
                  </div>
                )}

                {/* Mobile CTAs */}
                <div className="flex gap-2 mt-5 lg:hidden">
                  <Button className="flex-1 rounded-xl gap-2 h-11" onClick={() => setShowApply(true)} disabled={applied}>
                    {applied ? <><CheckCircle2 className="w-4 h-4" /> Applied</> : <><Send className="w-4 h-4" /> Apply Now</>}
                  </Button>
                  <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl" onClick={handleSave}>
                    <Bookmark className={`w-4 h-4 ${isSaved ? "fill-primary text-primary" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* "Why this role fits you" */}
            <div className="bg-card rounded-2xl border border-primary/20 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_0%_50%,hsl(199,89%,48%,0.06),transparent)]" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-primary" />
                  <h3 className="font-heading font-semibold text-sm">Why this role may fit you</h3>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { icon: Target, label: "Skill Match", value: "Strong alignment with posted requirements" },
                    { icon: TrendingUp, label: "Growth", value: "High-demand role in a growing market" },
                    { icon: Award, label: "Level Fit", value: job.experience_level ? levelLabels[job.experience_level] + " role" : "Suitable for multiple levels" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-2.5 bg-secondary/30 rounded-xl p-3">
                      <item.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            {job.description && (
              <Section title="About this role" icon={Briefcase}>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">{job.description}</p>
              </Section>
            )}

            {/* Responsibilities */}
            {job.responsibilities?.length > 0 && (
              <Section title="Responsibilities" icon={CheckCircle2}>
                <ul className="space-y-2.5">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <Section title="Requirements" icon={Award}>
                <ul className="space-y-2.5">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-chart-3 mt-0.5 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Preferred skills */}
            {job.preferred_skills?.length > 0 && (
              <Section title="Preferred Skills" icon={Star}>
                <ul className="space-y-2.5">
                  {job.preferred_skills.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-chart-2 mt-2 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Benefits */}
            {job.benefits?.length > 0 && (
              <Section title="Benefits & Perks" icon={Sparkles}>
                <div className="grid sm:grid-cols-2 gap-2">
                  {job.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground bg-secondary/30 rounded-lg p-2.5">
                      <CheckCircle2 className="w-4 h-4 text-chart-4 shrink-0" />
                      {b}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Company section */}
            <Section title="About the Company" icon={Building2}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-base">{job.company}</h4>
                  {job.industry && <p className="text-sm text-muted-foreground mt-1">{job.industry} industry</p>}
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {job.company} is hiring for this role through TalentTurbo's verified talent network.
                  </p>
                </div>
              </div>
            </Section>

            {/* Similar jobs */}
            {similarJobs.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-heading font-semibold text-sm uppercase tracking-wide text-muted-foreground">Similar Jobs</h3>
                </div>
                <div className="space-y-3">
                  {similarJobs.map((j, i) => (
                    <JobCard key={j.id} job={j} index={i} isSaved={false} onSave={() => {}} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — sticky action panel */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              {/* Apply card */}
              <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-3">
                <Button
                  className="w-full h-12 rounded-xl gap-2 text-base font-semibold"
                  onClick={() => setShowApply(true)}
                  disabled={applied}
                >
                  {applied ? <><CheckCircle2 className="w-4 h-4" /> Applied!</> : <><Send className="w-4 h-4" /> Apply Now</>}
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-xl gap-2" onClick={handleSave}>
                    <Bookmark className={`w-4 h-4 ${isSaved ? "fill-primary text-primary" : ""}`} />
                    {isSaved ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-xl gap-2" onClick={handleShare}>
                    <Share2 className="w-4 h-4" /> Share
                  </Button>
                </div>
                {applied && (
                  <Link to="/dashboard">
                    <Button variant="ghost" className="w-full rounded-xl gap-2 text-xs text-muted-foreground">
                      Track in Dashboard <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Link>
                )}
              </div>

              {/* Job Details card */}
              <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-4">
                <h3 className="font-heading font-semibold text-sm">Job Details</h3>
                <div className="space-y-3 text-sm">
                  {salary && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Salary</p>
                        <p className="font-semibold text-foreground">{salary}</p>
                      </div>
                    </div>
                  )}
                  {job.industry && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Industry</p>
                        <p className="font-medium">{job.industry}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Posted</p>
                      <p className="font-medium">{moment(job.created_date).fromNow()}</p>
                    </div>
                  </div>
                  {job.application_deadline && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Deadline</p>
                        <p className="font-medium">{moment(job.application_deadline).format("MMM D, YYYY")}</p>
                      </div>
                    </div>
                  )}
                  {job.experience_level && (
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Experience</p>
                        <p className="font-medium">{levelLabels[job.experience_level]}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills card */}
              {job.skills?.length > 0 && (
                <div className="bg-card rounded-2xl border border-border/50 p-5">
                  <h3 className="font-heading font-semibold text-sm mb-3">Skills Required</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((s) => (
                      <Badge key={s} variant="outline" className="rounded-md text-xs font-normal">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile job details */}
        <div className="lg:hidden mt-5 space-y-4">
          {job.skills?.length > 0 && (
            <div className="bg-card rounded-2xl border border-border/50 p-5">
              <h3 className="font-heading font-semibold text-sm mb-3">Skills Required</h3>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((s) => (
                  <Badge key={s} variant="outline" className="rounded-md text-xs font-normal">{s}</Badge>
                ))}
              </div>
            </div>
          )}
          <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-3 text-sm">
            <h3 className="font-heading font-semibold">Job Details</h3>
            <div className="grid grid-cols-2 gap-3">
              {salary && <DetailRow icon={DollarSign} label="Salary" value={salary} />}
              {job.industry && <DetailRow icon={Globe} label="Industry" value={job.industry} />}
              <DetailRow icon={Clock} label="Posted" value={moment(job.created_date).fromNow()} />
              {job.application_deadline && (
                <DetailRow icon={Calendar} label="Deadline" value={moment(job.application_deadline).format("MMM D")} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Dialog */}
      <Dialog open={showApply} onOpenChange={(v) => {
        setShowApply(v);
        // Prefill cover letter from last application if empty
        if (v && !coverLetter && myApplications.length > 0) {
          const last = myApplications.find(a => a.cover_letter);
          if (last?.cover_letter) setCoverLetter(last.cover_letter);
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">Apply to {job.title}</DialogTitle>
            <DialogDescription>{job.company} · {job.location}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {/* Profile autofill notice */}
            <div className="flex items-center gap-2.5 bg-primary/8 border border-primary/20 rounded-xl p-3 text-xs text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              {myApplications.length > 0
                ? "Your profile info is included. Cover letter pre-filled from your last application."
                : "Your profile info will be included automatically with your application."}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">
                  Cover Letter <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1.5 text-primary hover:text-primary"
                  onClick={generateCoverLetter}
                  disabled={generatingCL}
                >
                  {generatingCL ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  {generatingCL ? "Writing…" : "Write with AI"}
                </Button>
              </div>
              <Textarea
                placeholder="Tell the hiring team why you're a great fit…"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="min-h-[140px] rounded-xl text-sm"
              />
            </div>

            <div className="border border-dashed border-border/60 rounded-xl p-4 text-center cursor-pointer hover:border-primary/40 transition-colors">
              <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-1.5" />
              <p className="text-xs text-muted-foreground">Attach resume (optional) — PDF, DOC</p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">Your profile resume will be used if none attached</p>
            </div>

            <Button className="w-full rounded-xl gap-2 h-11" onClick={handleApply} disabled={applying}>
              {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {applying ? "Submitting..." : "Submit Application"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By applying you agree to our terms. Your data is kept private.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6">
      <div className="flex items-center gap-2.5 mb-5">
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        <h3 className="font-heading font-semibold text-base">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-sm">{value}</p>
      </div>
    </div>
  );
}