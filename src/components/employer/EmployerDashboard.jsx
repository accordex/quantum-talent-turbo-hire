import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Briefcase, Users, PlusCircle, ChevronDown, ChevronUp,
  Building2, MapPin, Globe, Lock, Sparkles, ArrowRight
} from "lucide-react";
import MatchScoreBadge, { computeMatchScore } from "./MatchScoreBadge";
import moment from "moment";

const workModeColors = {
  remote: "bg-chart-3/10 text-chart-3",
  hybrid: "bg-chart-4/10 text-chart-4",
  onsite: "bg-primary/10 text-primary",
};

export default function EmployerDashboard() {
  const [expandedJob, setExpandedJob] = useState(null);

  // Fetch jobs posted by the current employer
  const { data: myJobs = [], isLoading: loadingJobs } = useQuery({
    queryKey: ["employerJobs"],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Job.filter({ created_by: user.email }, "-created_date", 20);
    },
  });

  // Fetch all applications
  const { data: allApplications = [], isLoading: loadingApps } = useQuery({
    queryKey: ["employerApplications"],
    queryFn: () => base44.entities.Application.list("-created_date", 200),
  });

  // Fetch public user profiles (candidates)
  const { data: candidates = [], isLoading: loadingCandidates } = useQuery({
    queryKey: ["publicCandidates"],
    queryFn: () => base44.entities.User.list(),
  });

  const isLoading = loadingJobs || loadingApps || loadingCandidates;

  // Group applications by job_id
  const appsByJob = allApplications.reduce((acc, app) => {
    if (!acc[app.job_id]) acc[app.job_id] = [];
    acc[app.job_id].push(app);
    return acc;
  }, {});

  // Find candidate profile by email (created_by)
  const candidateMap = candidates.reduce((acc, c) => {
    acc[c.email] = c;
    return acc;
  }, {});

  const totalApplicants = myJobs.reduce((sum, j) => sum + (appsByJob[j.id]?.length || 0), 0);
  const activeJobs = myJobs.filter(j => j.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Employer Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <p className="font-heading text-2xl font-bold">{activeJobs}</p>
          <p className="text-sm text-muted-foreground">Active Jobs</p>
        </div>
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-accent" />
          </div>
          <p className="font-heading text-2xl font-bold">{totalApplicants}</p>
          <p className="text-sm text-muted-foreground">Total Applicants</p>
        </div>
        <div className="bg-card rounded-2xl border border-border/50 p-5 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-chart-3/10 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-chart-3" />
          </div>
          <p className="font-heading text-2xl font-bold">
            {totalApplicants > 0
              ? `${Math.round(allApplications.filter(a => {
                  const job = myJobs.find(j => j.id === a.job_id);
                  const cand = candidateMap[a.created_by];
                  return job && cand && computeMatchScore(cand, job) >= 70;
                }).length / Math.max(1, totalApplicants) * 100)}%`
              : "—"}
          </p>
          <p className="text-sm text-muted-foreground">Strong Matches ≥70%</p>
        </div>
      </div>

      {/* Post New Job CTA */}
      <Link to="/employers">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-5 flex items-center justify-between hover:border-primary/40 transition-colors group">
          <div>
            <p className="font-semibold text-sm">Post a New Job</p>
            <p className="text-xs text-muted-foreground mt-0.5">Reach pre-screened, skill-verified candidates</p>
          </div>
          <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Post Job</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>

      {/* Job Listings with Candidates */}
      <div>
        <h3 className="font-heading font-semibold text-lg mb-4">Your Job Postings & Candidates</h3>

        {isLoading ? (
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border/50 p-5">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
        ) : myJobs.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
            <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-heading font-semibold mb-2">No jobs posted yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Post your first job to start receiving matched candidates.</p>
            <Link to="/employers">
              <Button className="rounded-xl gap-2"><PlusCircle className="w-4 h-4" /> Post a Job</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myJobs.map((job) => {
              const jobApps = appsByJob[job.id] || [];
              const isExpanded = expandedJob === job.id;

              // Score and sort candidates
              const scoredApps = jobApps.map(app => {
                const cand = candidateMap[app.created_by] || {};
                return { ...app, candidate: cand, matchScore: computeMatchScore(cand, job) };
              }).sort((a, b) => b.matchScore - a.matchScore);

              return (
                <div key={job.id} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                  {/* Job Header */}
                  <button
                    className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold truncate">{job.title}</p>
                          <Badge
                            className={`text-xs capitalize ${job.status === "active" ? "bg-chart-3/10 text-chart-3" : job.status === "draft" ? "bg-muted text-muted-foreground" : "bg-destructive/10 text-destructive"}`}
                          >
                            {job.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                          {job.work_mode && <span className={`px-2 py-0.5 rounded-md capitalize ${workModeColors[job.work_mode] || ""}`}>{job.work_mode}</span>}
                          <span>Posted {moment(job.created_date).fromNow()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="font-semibold text-sm">{jobApps.length}</p>
                        <p className="text-xs text-muted-foreground">applicant{jobApps.length !== 1 ? "s" : ""}</p>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </button>

                  {/* Candidates Panel */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="border-t border-border/50 p-5">
                        {jobApps.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-6">No applicants yet for this role.</p>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" /> Candidates ranked by match score
                            </p>
                            {scoredApps.map((app, idx) => (
                              <CandidateRow key={app.id} app={app} rank={idx + 1} job={job} />
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
      </div>
    </div>
  );
}

function CandidateRow({ app, rank, job }) {
  const { candidate, matchScore } = app;
  const hasProfile = !!candidate?.email;

  const statusColors = {
    applied: "bg-primary/10 text-primary",
    reviewed: "bg-chart-4/10 text-chart-4",
    interview: "bg-accent/10 text-accent",
    offered: "bg-chart-3/10 text-chart-3",
    rejected: "bg-destructive/10 text-destructive",
    withdrawn: "bg-muted text-muted-foreground",
  };

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
          {/* Rank badge */}
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${rank === 1 ? "bg-chart-4 text-background" : rank === 2 ? "bg-muted-foreground/30 text-foreground" : "bg-muted text-muted-foreground"}`}>
            {rank}
          </div>

          {/* Avatar */}
          {candidate?.avatar_url ? (
            <img src={candidate.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0 text-sm font-semibold text-accent">
              {(candidate?.full_name || app.created_by || "?")[0]?.toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-sm truncate">
                {candidate?.full_name || app.created_by || "Anonymous Candidate"}
              </p>
              {candidate?.is_public ? (
                <span className="inline-flex items-center gap-1 text-xs text-chart-3"><Globe className="w-3 h-3" />Public</span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Lock className="w-3 h-3" />Private</span>
              )}
            </div>
            {candidate?.headline && (
              <p className="text-xs text-muted-foreground truncate">{candidate.headline}</p>
            )}
            {candidate?.location && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{candidate.location}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <MatchScoreBadge score={matchScore} />
          <Badge className={`text-xs capitalize ${statusColors[app.status]}`}>{app.status}</Badge>
        </div>
      </div>

      {/* Skills breakdown */}
      {(job.skills || []).length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/30 space-y-2">
          {matchedSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-chart-3 font-medium shrink-0">✓ Matched:</span>
              {matchedSkills.map(s => (
                <span key={s} className="text-xs bg-chart-3/10 text-chart-3 px-2 py-0.5 rounded-md">{s}</span>
              ))}
            </div>
          )}
          {missingSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-muted-foreground font-medium shrink-0">✗ Missing:</span>
              {missingSkills.map(s => (
                <span key={s} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md">{s}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Applied time */}
      <p className="text-xs text-muted-foreground mt-2">Applied {moment(app.created_date).fromNow()}</p>
    </div>
  );
}