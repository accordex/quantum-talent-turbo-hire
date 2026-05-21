import React, { useState } from "react";
import { Link } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";
import EmployerOnboarding from "@/components/employer/EmployerOnboarding";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Briefcase, Users, PlusCircle, TrendingUp, ChevronDown, ChevronUp,
  Building2, MapPin, Sparkles, Eye, XCircle, CheckCircle2, Clock,
  UserCheck, MessageSquare, Star, BarChart2, ArrowRight, Bookmark
} from "lucide-react";
import MatchScoreBadge, { computeMatchScore } from "@/components/employer/MatchScoreBadge";
import moment from "moment";

const PIPELINE_STAGES = [
  { key: "applied",   label: "Applied",   icon: Clock,        color: "text-primary",     bg: "bg-primary/10"     },
  { key: "reviewed",  label: "Reviewed",  icon: Eye,          color: "text-chart-4",     bg: "bg-chart-4/10"     },
  { key: "interview", label: "Interview", icon: MessageSquare,color: "text-accent",       bg: "bg-accent/10"      },
  { key: "offered",   label: "Offered",   icon: Star,         color: "text-chart-3",     bg: "bg-chart-3/10"     },
  { key: "rejected",  label: "Rejected",  icon: XCircle,      color: "text-destructive", bg: "bg-destructive/10" },
];

export default function EmployerDashboard() {
  usePageTitle("Recruiter Dashboard");
  const [expandedJob, setExpandedJob] = useState(null);
  const queryClient = useQueryClient();

  const { data: myJobs = [], isLoading: loadingJobs } = useQuery({
    queryKey: ["employerJobs"],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Job.filter({ created_by: user.email }, "-created_date", 50);
    },
  });

  const { data: allApplications = [], isLoading: loadingApps } = useQuery({
    queryKey: ["employerApplications"],
    queryFn: () => base44.entities.Application.list("-created_date", 500),
  });

  const { data: candidates = [] } = useQuery({
    queryKey: ["publicCandidates"],
    queryFn: () => base44.entities.User.list(),
  });

  const updateAppMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Application.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employerApplications"] }),
  });

  const toggleShortlistMutation = useMutation({
    mutationFn: ({ id, is_shortlisted }) => base44.entities.Application.update(id, { is_shortlisted }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employerApplications"] }),
  });

  const isLoading = loadingJobs || loadingApps;

  const appsByJob = allApplications.reduce((acc, app) => {
    if (!acc[app.job_id]) acc[app.job_id] = [];
    acc[app.job_id].push(app);
    return acc;
  }, {});

  const candidateMap = candidates.reduce((acc, c) => { acc[c.email] = c; return acc; }, {});

  const totalApplicants = myJobs.reduce((sum, j) => sum + (appsByJob[j.id]?.length || 0), 0);
  const activeJobs = myJobs.filter(j => j.status === "active").length;
  const interviewCount = allApplications.filter(a => a.status === "interview" && myJobs.find(j => j.id === a.job_id)).length;
  const offeredCount = allApplications.filter(a => a.status === "offered" && myJobs.find(j => j.id === a.job_id)).length;

  // All apps across my jobs for pipeline view
  const myApps = allApplications.filter(a => myJobs.find(j => j.id === a.job_id));
  const shortlistedApps = myApps.filter(a => a.is_shortlisted);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Recruiter Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your postings and hiring pipeline</p>
          </div>
          <Link to="/employers">
            <Button className="gap-2 rounded-xl">
              <PlusCircle className="w-4 h-4" /> Post a Job
            </Button>
          </Link>
        </div>

        {/* Onboarding checklist */}
        {!isLoading && (
          <EmployerOnboarding
            hasJobs={myJobs.length > 0}
            hasApplicants={totalApplicants > 0}
            hasShortlisted={shortlistedApps.length > 0}
            hasInterview={interviewCount > 0}
          />
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Jobs",    value: activeJobs,      icon: Briefcase,    color: "text-primary",   bg: "bg-primary/10"  },
            { label: "Total Applicants", value: totalApplicants, icon: Users,        color: "text-accent",    bg: "bg-accent/10"   },
            { label: "In Interview",   value: interviewCount,  icon: UserCheck,    color: "text-chart-4",   bg: "bg-chart-4/10"  },
            { label: "Offers Extended",value: offeredCount,    icon: CheckCircle2, color: "text-chart-3",   bg: "bg-chart-3/10"  },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border/50 p-5"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className={`font-heading text-2xl font-bold ${isLoading ? "opacity-30" : ""}`}>
                {isLoading ? "—" : value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="jobs">
          <TabsList className="mb-6 bg-card border border-border/50">
            <TabsTrigger value="jobs" className="gap-2"><Briefcase className="w-4 h-4" />Job Postings</TabsTrigger>
            <TabsTrigger value="pipeline" className="gap-2"><BarChart2 className="w-4 h-4" />Pipeline</TabsTrigger>
            <TabsTrigger value="shortlist" className="gap-2">
              <Bookmark className="w-4 h-4" />Shortlist
              {shortlistedApps.length > 0 && (
                <span className="ml-1 bg-accent text-accent-foreground text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {shortlistedApps.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Jobs Tab ── */}
          <TabsContent value="jobs">
            {isLoading ? (
              <div className="space-y-3">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl border border-border/50 p-5">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))}
              </div>
            ) : myJobs.length === 0 ? (
              <EmptyJobs />
            ) : (
              <div className="space-y-3">
                {myJobs.map((job) => {
                  const jobApps = appsByJob[job.id] || [];
                  const isExpanded = expandedJob === job.id;
                  const scoredApps = jobApps
                    .map(app => ({ ...app, candidate: candidateMap[app.created_by] || {}, matchScore: computeMatchScore(candidateMap[app.created_by], job) }))
                    .sort((a, b) => b.matchScore - a.matchScore);

                  return (
                    <div key={job.id} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                      <button
                        className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
                        onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold truncate">{job.title}</p>
                              <StatusBadge status={job.status} />
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                              {job.work_mode && <span className="capitalize">{job.work_mode}</span>}
                              <span>{moment(job.created_date).fromNow()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <PipelineMiniBar apps={jobApps} />
                          <div className="text-right min-w-[48px]">
                            <p className="font-bold text-sm">{jobApps.length}</p>
                            <p className="text-xs text-muted-foreground">applicant{jobApps.length !== 1 ? "s" : ""}</p>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                          <div className="border-t border-border/50 p-5">
                            {jobApps.length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-8">No applicants yet for this role.</p>
                            ) : (
                              <div className="space-y-3">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
                                  <Sparkles className="w-3.5 h-3.5" /> Candidates ranked by match
                                </p>
                                {scoredApps.map((app, idx) => (
                                 <CandidateRow
                                   key={app.id}
                                   app={app}
                                   rank={idx + 1}
                                   job={job}
                                   onStatusChange={(status) => updateAppMutation.mutate({ id: app.id, status })}
                                   onToggleShortlist={() => toggleShortlistMutation.mutate({ id: app.id, is_shortlisted: !app.is_shortlisted })}
                                 />
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* ── Shortlist Tab ── */}
          <TabsContent value="shortlist">
            {isLoading ? (
              <div className="space-y-3">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
            ) : shortlistedApps.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
                <Bookmark className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold mb-1">No shortlisted candidates yet</p>
                <p className="text-sm text-muted-foreground">Click the bookmark icon on any candidate to add them here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Bookmark className="w-3.5 h-3.5" /> {shortlistedApps.length} shortlisted candidate{shortlistedApps.length !== 1 ? "s" : ""}
                </p>
                {shortlistedApps
                  .map(app => ({ ...app, candidate: candidateMap[app.created_by] || {}, matchScore: computeMatchScore(candidateMap[app.created_by], myJobs.find(j => j.id === app.job_id)) }))
                  .sort((a, b) => b.matchScore - a.matchScore)
                  .map((app, idx) => {
                    const job = myJobs.find(j => j.id === app.job_id);
                    return (
                      <div key={app.id}>
                        <p className="text-xs text-muted-foreground mb-1.5 px-1">{app.job_title || job?.title}</p>
                        <CandidateRow
                          app={app}
                          rank={idx + 1}
                          job={job || {}}
                          onStatusChange={(status) => updateAppMutation.mutate({ id: app.id, status })}
                          onToggleShortlist={() => toggleShortlistMutation.mutate({ id: app.id, is_shortlisted: false })}
                        />
                      </div>
                    );
                  })}
              </div>
            )}
          </TabsContent>

          {/* ── Pipeline Tab ── */}
          <TabsContent value="pipeline">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
              </div>
            ) : (
              <PipelineBoard apps={myApps} jobs={myJobs} candidateMap={candidateMap} onStatusChange={(id, status) => updateAppMutation.mutate({ id, status })} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function StatusBadge({ status }) {
  const map = {
    active: "bg-chart-3/10 text-chart-3",
    draft:  "bg-muted text-muted-foreground",
    closed: "bg-destructive/10 text-destructive",
  };
  return <Badge className={`text-xs capitalize ${map[status] || ""}`}>{status}</Badge>;
}

function PipelineMiniBar({ apps }) {
  const counts = PIPELINE_STAGES.slice(0, 4).map(s => apps.filter(a => a.status === s.key).length);
  const max = Math.max(...counts, 1);
  return (
    <div className="hidden sm:flex items-end gap-1 h-8">
      {counts.map((c, i) => (
        <div
          key={i}
          className={`w-2 rounded-sm transition-all ${PIPELINE_STAGES[i].bg}`}
          style={{ height: `${Math.max(4, (c / max) * 32)}px` }}
          title={`${PIPELINE_STAGES[i].label}: ${c}`}
        />
      ))}
    </div>
  );
}

function CandidateRow({ app, rank, job, onStatusChange, onToggleShortlist }) {
  const { candidate, matchScore } = app;

  const matchedSkills = (job.skills || []).filter(s =>
    (candidate?.skills || []).map(cs => cs.toLowerCase()).includes(s.toLowerCase())
  );
  const missingSkills = (job.skills || []).filter(s =>
    !(candidate?.skills || []).map(cs => cs.toLowerCase()).includes(s.toLowerCase())
  );

  return (
    <div className="bg-background rounded-xl border border-border/50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${rank === 1 ? "bg-chart-4 text-background" : rank === 2 ? "bg-muted-foreground/30 text-foreground" : "bg-muted text-muted-foreground"}`}>
            {rank}
          </div>
          <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0 text-sm font-semibold text-accent">
            {(candidate?.full_name || app.created_by || "?")[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{candidate?.full_name || app.created_by || "Anonymous"}</p>
            {candidate?.headline && <p className="text-xs text-muted-foreground truncate">{candidate.headline}</p>}
            <p className="text-xs text-muted-foreground mt-0.5">Applied {moment(app.created_date).fromNow()}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleShortlist}
              title={app.is_shortlisted ? "Remove from shortlist" : "Add to shortlist"}
              className={`p-1.5 rounded-lg transition-colors ${app.is_shortlisted ? "bg-accent/20 text-accent" : "text-muted-foreground hover:text-accent hover:bg-accent/10"}`}
            >
              <Bookmark className={`w-4 h-4 ${app.is_shortlisted ? "fill-accent" : ""}`} />
            </button>
            <MatchScoreBadge score={matchScore} />
          </div>
          <select
            value={app.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="text-xs bg-muted border border-border/50 rounded-lg px-2 py-1 text-foreground cursor-pointer"
          >
            {PIPELINE_STAGES.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {(job.skills || []).length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/30 space-y-1.5">
          {matchedSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-chart-3 font-medium shrink-0">✓</span>
              {matchedSkills.map(s => <span key={s} className="text-xs bg-chart-3/10 text-chart-3 px-2 py-0.5 rounded-md">{s}</span>)}
            </div>
          )}
          {missingSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-muted-foreground font-medium shrink-0">✗</span>
              {missingSkills.map(s => <span key={s} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md">{s}</span>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PipelineBoard({ apps, jobs, candidateMap, onStatusChange }) {
  if (apps.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
        <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="font-semibold mb-1">No applicants yet</p>
        <p className="text-sm text-muted-foreground">Post a job to start building your pipeline.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {PIPELINE_STAGES.map(({ key, label, icon: Icon, color, bg }) => {
        const stageApps = apps.filter(a => a.status === key);
        return (
          <div key={key} className="bg-card rounded-2xl border border-border/50 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                </div>
                <span className="font-semibold text-sm">{label}</span>
              </div>
              <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{stageApps.length}</span>
            </div>
            <div className="space-y-2 flex-1">
              {stageApps.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">None</p>
              ) : (
                stageApps.map(app => {
                  const cand = candidateMap[app.created_by] || {};
                  const job = jobs.find(j => j.id === app.job_id);
                  const score = computeMatchScore(cand, job);
                  return (
                    <div key={app.id} className="bg-background rounded-xl border border-border/40 p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent shrink-0">
                          {(cand?.full_name || app.created_by || "?")[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate">{cand?.full_name || "Anonymous"}</p>
                          <p className="text-xs text-muted-foreground truncate">{app.job_title || job?.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-semibold ${score >= 70 ? "text-chart-3" : score >= 40 ? "text-chart-4" : "text-muted-foreground"}`}>
                          {score}% match
                        </span>
                        <select
                          value={app.status}
                          onChange={(e) => onStatusChange(app.id, e.target.value)}
                          className="text-xs bg-muted border border-border/40 rounded-md px-1.5 py-0.5 text-foreground cursor-pointer"
                        >
                          {PIPELINE_STAGES.map(s => (
                            <option key={s.key} value={s.key}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EmptyJobs() {
  return (
    <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
      <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Briefcase className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="font-heading font-semibold mb-2">No jobs posted yet</h3>
      <p className="text-sm text-muted-foreground mb-4">Post your first job to start receiving matched candidates.</p>
      <Link to="/employers">
        <Button className="rounded-xl gap-2"><PlusCircle className="w-4 h-4" /> Post a Job</Button>
      </Link>
    </div>
  );
}