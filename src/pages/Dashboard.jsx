import React, { useState, useEffect } from "react";
import usePageTitle from "@/hooks/usePageTitle";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase, Bookmark, FileText, Bell, Search,
  ChevronRight, Building2, MapPin, UserCog,
  Sparkles, ArrowRight, Globe, Lock, FileEdit, Brain, TrendingUp
} from "lucide-react";
import AlertsTab from "../components/alerts/AlertsTab";
import EmployerDashboard from "../components/employer/EmployerDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";

const statusColors = {
  applied: "bg-primary/10 text-primary",
  reviewed: "bg-chart-4/10 text-chart-4",
  interview: "bg-accent/10 text-accent",
  offered: "bg-chart-3/10 text-chart-3",
  rejected: "bg-destructive/10 text-destructive",
  withdrawn: "bg-muted text-muted-foreground",
};

export default function Dashboard() {
  usePageTitle("Dashboard");
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: applications = [], isLoading: loadingApps } = useQuery({
    queryKey: ["myApplications"],
    queryFn: () => base44.entities.Application.list("-created_date"),
  });

  const { data: savedJobs = [], isLoading: loadingSaved } = useQuery({
    queryKey: ["mySavedJobs"],
    queryFn: () => base44.entities.SavedJob.list("-created_date"),
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["allJobs"],
    queryFn: () => base44.entities.Job.list("-created_date", 5),
  });

  const COMPLETENESS_FIELDS = [
    { key: "headline",           weight: 10 },
    { key: "location",           weight: 5  },
    { key: "bio",                weight: 10 },
    { key: "skills",             weight: 20, check: (v) => Array.isArray(v) && v.length > 0 },
    { key: "experience",         weight: 20, check: (v) => Array.isArray(v) && v.length > 0 },
    { key: "education",          weight: 15, check: (v) => Array.isArray(v) && v.length > 0 },
    { key: "resume_url",         weight: 10 },
    { key: "work_authorization", weight: 5  },
    { key: "desired_job_type",   weight: 5  },
  ];
  const profileCompleteness = user
    ? Math.min(100, COMPLETENESS_FIELDS.reduce((acc, f) => {
        const val = user[f.key];
        return acc + (f.check ? (f.check(val) ? f.weight : 0) : (val ? f.weight : 0));
      }, 0))
    : 0;

  const missingFields = user
    ? COMPLETENESS_FIELDS.filter(f => {
        const val = user[f.key];
        return !(f.check ? f.check(val) : !!val);
      })
    : [];

  const isEmployer = user?.role === "admin";

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">
            Welcome back{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEmployer ? "Manage your job postings and review matched candidates." : "Track your applications, saved jobs, and more."}
          </p>
        </div>

        {/* Employer Dashboard */}
        {isEmployer && <EmployerDashboard />}
        {isEmployer && <div className="mt-10 border-t border-border/50 pt-8"><p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-6">Your Job Seeker Activity</p></div>}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FileText} label="Applications" value={applications.length} color="text-primary bg-primary/10" />
          <StatCard icon={Bookmark} label="Saved Jobs" value={savedJobs.length} color="text-accent bg-accent/10" />
          <StatCard icon={Bell} label="Interviews" value={applications.filter(a => a.status === "interview").length} color="text-chart-4 bg-chart-4/10" />
          <StatCard icon={Briefcase} label="Offers" value={applications.filter(a => a.status === "offered").length} color="text-chart-3 bg-chart-3/10" />
        </div>

        {/* Profile completeness */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <UserCog className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold">Profile Completeness</h3>
                <p className="text-xs text-muted-foreground">
                  {profileCompleteness < 100 ? "Complete your profile to get discovered by recruiters" : "Your profile is fully complete!"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-lg font-bold ${profileCompleteness >= 80 ? "text-chart-3" : profileCompleteness >= 40 ? "text-chart-4" : "text-destructive"}`}>
                {profileCompleteness}%
              </span>
              <Link to="/profile/edit">
                <Button size="sm" variant="outline" className="rounded-xl gap-1.5 hidden sm:flex">
                  Edit Profile <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          <Progress value={profileCompleteness} className="h-2.5 mb-4" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {user?.is_public ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-chart-3 font-medium">
                  <Globe className="w-3.5 h-3.5" /> Public · Visible to recruiters
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Lock className="w-3.5 h-3.5" /> Private · Hidden from recruiters
                </span>
              )}
            </div>
            <Link to="/profile/edit">
              <Button size="sm" variant="outline" className="rounded-xl gap-1.5 sm:hidden">
                Edit <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {missingFields.length > 0 && profileCompleteness < 100 && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Suggested next steps
              </p>
              <div className="flex flex-wrap gap-2">
                {missingFields.slice(0, 4).map(f => {
                  const labelMap = { headline: "Add headline", location: "Add location", bio: "Write bio", skills: "Add skills", experience: "Add experience", education: "Add education", resume_url: "Upload resume", work_authorization: "Set work auth", desired_job_type: "Set job preferences" };
                  const sectionMap = { headline: "basic", location: "basic", bio: "basic", skills: "skills", experience: "experience", education: "education", resume_url: "resume", work_authorization: "preferences", desired_job_type: "preferences" };
                  return (
                    <Link key={f.key} to={`/profile/edit#${sectionMap[f.key] || "basic"}`}>
                      <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors cursor-pointer">
                        + {labelMap[f.key] || f.key}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Career Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: FileEdit, label: "Resume Builder", desc: "Build & download a polished resume", path: "/resume-builder", color: "text-primary bg-primary/10" },
            { icon: Brain, label: "Interview Prep", desc: "AI-powered practice questions", path: "/interview-prep", color: "text-accent bg-accent/10" },
            { icon: TrendingUp, label: "Salary Insights", desc: "Market rates for any role", path: "/salary-insights", color: "text-chart-3 bg-chart-3/10" },
          ].map((tool) => (
            <Link key={tool.path} to={tool.path}>
              <div className="bg-card rounded-2xl border border-border/50 p-5 flex items-center gap-4 hover:border-primary/30 transition-colors group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tool.color}`}>
                  <tool.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm">{tool.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{tool.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0 group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="bg-muted p-1 rounded-xl">
            <TabsTrigger value="applications" className="rounded-lg">Applications</TabsTrigger>
            <TabsTrigger value="saved" className="rounded-lg">Saved Jobs</TabsTrigger>
            <TabsTrigger value="recommended" className="rounded-lg">Recommended</TabsTrigger>
            <TabsTrigger value="alerts" className="rounded-lg gap-1.5">
              <Bell className="w-3.5 h-3.5" /> Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            {loadingApps ? (
              <LoadingSkeleton />
            ) : applications.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No applications yet"
                description="Start browsing jobs and apply to roles that match your skills."
                ctaLabel="Browse Jobs"
                ctaPath="/jobs"
              />
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="bg-card rounded-xl border border-border/50 p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{app.job_title}</p>
                        <p className="text-sm text-muted-foreground">{app.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge className={`${statusColors[app.status]} capitalize text-xs`}>
                        {app.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {moment(app.created_date).fromNow()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved">
            {loadingSaved ? (
              <LoadingSkeleton />
            ) : savedJobs.length === 0 ? (
              <EmptyState
                icon={Bookmark}
                title="No saved jobs"
                description="Save jobs you're interested in to review them later."
                ctaLabel="Browse Jobs"
                ctaPath="/jobs"
              />
            ) : (
              <div className="space-y-3">
                {savedJobs.map((sj) => (
                  <Link key={sj.id} to={`/jobs/${sj.job_id}`}>
                    <div className="bg-card rounded-xl border border-border/50 p-5 flex items-center justify-between gap-4 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                          <Bookmark className="w-5 h-5 text-accent" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{sj.job_title}</p>
                          <p className="text-sm text-muted-foreground">{sj.company}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommended">
            {jobs.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No recommendations yet"
                description="Complete your profile to receive personalized job recommendations."
              />
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <Link key={job.id} to={`/jobs/${job.id}`}>
                    <div className="bg-card rounded-xl border border-border/50 p-5 flex items-center justify-between gap-4 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-chart-3/10 flex items-center justify-center shrink-0">
                          <Briefcase className="w-5 h-5 text-chart-3" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{job.title}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{job.company}</span>
                            {job.location && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="alerts">
            <AlertsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-heading text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, ctaLabel = null, ctaPath = null }) {
  return (
    <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
      <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      {ctaLabel && ctaPath && (
        <Link to={ctaPath}>
          <Button className="rounded-xl">{ctaLabel}</Button>
        </Link>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="bg-card rounded-xl border border-border/50 p-5 flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}