import React, { useState, useMemo, useEffect } from "react";
import usePageTitle from "@/hooks/usePageTitle";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { computeMatchScore } from "@/components/employer/MatchScoreBadge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SlidersHorizontal, Briefcase, Search, TrendingUp, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";
import moment from "moment";
import JobFilters from "../components/jobs/JobFilters";
import JobCard from "../components/jobs/JobCard";

const defaultFilters = {
  search: "",
  location: "",
  work_mode: "all",
  job_type: "all",
  experience_level: "all",
  industry: "all",
  posted: "all",
  salary_min: 0,
};

const JOBS_PER_PAGE = 12;

export default function Jobs() {
  usePageTitle("Browse Jobs");
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const [filters, setFilters] = useState({
    ...defaultFilters,
    search: urlParams.get("search") || "",
    location: urlParams.get("location") || "",
  });
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // Sync filters when URL search params change (e.g. navigating from hero search bar)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get("search") || "";
    const l = params.get("location") || "";
    if (s || l) {
      setFilters((prev) => ({ ...prev, search: s, location: l }));
      setPage(1);
    }
  }, [location.search]);

  const { data: jobs = [], isLoading } = useQuery({
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

  const savedJobIds = useMemo(() => new Set(savedJobs.map((s) => s.job_id)), [savedJobs]);

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) return null;
      return base44.auth.me();
    },
  });

  const matchScoreMap = useMemo(() => {
    if (!currentUser) return {};
    return jobs.reduce((acc, job) => {
      acc[job.id] = computeMatchScore(currentUser, job);
      return acc;
    }, {});
  }, [jobs, currentUser]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSave = async (job) => {
    const isAuth = await base44.auth.isAuthenticated();
    if (!isAuth) { base44.auth.redirectToLogin(); return; }
    if (savedJobIds.has(job.id)) {
      const saved = savedJobs.find((s) => s.job_id === job.id);
      if (saved) await base44.entities.SavedJob.delete(saved.id);
    } else {
      await base44.entities.SavedJob.create({ job_id: job.id, job_title: job.title, company: job.company });
    }
    queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
  };

  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      if (job.status === "draft") return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        const match =
          (job.title || "").toLowerCase().includes(s) ||
          (job.company || "").toLowerCase().includes(s) ||
          (job.description || "").toLowerCase().includes(s) ||
          (job.skills || []).some((sk) => sk.toLowerCase().includes(s));
        if (!match) return false;
      }
      if (filters.location && !(job.location || "").toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.work_mode !== "all" && job.work_mode !== filters.work_mode) return false;
      if (filters.job_type !== "all" && job.job_type !== filters.job_type) return false;
      if (filters.experience_level !== "all" && job.experience_level !== filters.experience_level) return false;
      if (filters.industry !== "all" && job.industry !== filters.industry) return false;
      if (filters.salary_min > 0 && (!job.salary_max || job.salary_max < filters.salary_min)) return false;
      if (filters.posted !== "all") {
        const days = parseInt(filters.posted);
        if (moment().diff(moment(job.created_date), "days") > days) return false;
      }
      return true;
    });

    // Sort
    if (sortBy === "latest") result = [...result].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    else if (sortBy === "salary") result = [...result].sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
    else if (sortBy === "featured") result = [...result].sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));

    return result;
  }, [jobs, filters, sortBy]);

  const featuredJobs = useMemo(() => jobs.filter((j) => j.is_featured && j.status !== "draft").slice(0, 3), [jobs]);
  const trendingJobs = useMemo(() => jobs.filter((j) => j.status !== "draft").slice(0, 6), [jobs]);

  const paginatedJobs = filteredJobs.slice(0, page * JOBS_PER_PAGE);
  const hasMore = paginatedJobs.length < filteredJobs.length;

  const activeFilterCount = [
    filters.search, filters.location,
    filters.work_mode !== "all" ? "y" : "",
    filters.job_type !== "all" ? "y" : "",
    filters.experience_level !== "all" ? "y" : "",
    filters.industry !== "all" ? "y" : "",
    filters.posted !== "all" ? "y" : "",
    filters.salary_min > 0 ? "y" : "",
  ].filter(Boolean).length;

  const FiltersPanel = (
    <JobFilters filters={filters} onFilterChange={handleFilterChange} onReset={() => { setFilters(defaultFilters); setPage(1); }} />
  );

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      {/* Hero search bar */}
      <div className="bg-gradient-to-b from-card/80 to-transparent border-b border-border/30 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2 text-center">
            Find your next role
          </h1>
          <p className="text-muted-foreground text-center mb-6 text-sm">
            Browse <span className="text-primary font-semibold">{jobs.filter(j => j.status !== "draft").length}</span> open positions
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search job title, company, or skill..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 h-12 rounded-xl text-sm bg-card border-border/60 focus:border-primary"
              />
              {filters.search && (
                <button onClick={() => handleFilterChange("search", "")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" style={{ display: "none" }} />
              <Input
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-44 h-12 rounded-xl text-sm bg-card border-border/60"
              />
            </div>
            <Button className="h-12 px-5 rounded-xl shrink-0" onClick={() => { setPage(1); }}>Search</Button>
          </div>

          {/* Quick mode pills */}
          <div className="flex gap-2 mt-4 justify-center flex-wrap">
            {["all", "remote", "hybrid", "onsite"].map((m) => (
              <button
                key={m}
                onClick={() => handleFilterChange("work_mode", m)}
                className={`text-xs px-4 py-1.5 rounded-full border transition-all ${
                  filters.work_mode === m
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border/50 text-muted-foreground hover:border-primary/40"
                }`}
              >
                {m === "all" ? "All Modes" : m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Recommended / Featured strip */}
        {!isLoading && featuredJobs.length > 0 && !filters.search && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="font-heading font-semibold text-sm uppercase tracking-wide text-muted-foreground">Featured & Recommended</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredJobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} isSaved={savedJobIds.has(job.id)} onSave={handleSave} matchScore={matchScoreMap[job.id] > 0 ? matchScoreMap[job.id] : undefined} />
              ))}
            </div>
          </motion.div>
        )}

        <div className="flex gap-7">
          {/* Sidebar filters — desktop */}
          <div className="hidden lg:block w-68 shrink-0" style={{ width: "272px" }}>
            <div className="sticky top-24">{FiltersPanel}</div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 gap-3">
              <div className="flex items-center gap-2">
                {/* Mobile filter trigger */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden gap-1.5 rounded-xl">
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ml-0.5">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-5 overflow-y-auto">
                    {FiltersPanel}
                  </SheetContent>
                </Sheet>

                <span className="text-sm text-muted-foreground">
                  <span className="text-foreground font-semibold">{filteredJobs.length}</span> jobs found
                </span>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 h-8 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Most Recent</SelectItem>
                  <SelectItem value="salary">Highest Salary</SelectItem>
                  <SelectItem value="featured">Featured First</SelectItem>
                  <SelectItem value="relevance">Relevance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Job list */}
            {isLoading ? (
              <div className="space-y-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl border border-border/50 p-5">
                    <div className="flex items-start gap-3">
                      <Skeleton className="w-11 h-11 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-64" />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Skeleton className="h-6 w-20 rounded-md" />
                      <Skeleton className="h-6 w-16 rounded-md" />
                      <Skeleton className="h-6 w-24 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">No jobs match your filters</h3>
                <p className="text-muted-foreground text-sm mb-5">Try broadening your search or clearing some filters</p>
                <Button variant="outline" className="rounded-xl" onClick={() => { setFilters(defaultFilters); setPage(1); }}>
                  Clear all filters
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="space-y-3">
                  {paginatedJobs.map((job, i) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      index={i}
                      isSaved={savedJobIds.has(job.id)}
                      onSave={handleSave}
                      matchScore={matchScoreMap[job.id] > 0 ? matchScoreMap[job.id] : undefined}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center mt-8">
                    <Button
                      variant="outline"
                      className="rounded-xl px-8"
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Load more jobs ({filteredJobs.length - paginatedJobs.length} remaining)
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Trending jobs section */}
            {!isLoading && filteredJobs.length > 0 && trendingJobs.length > 0 && !filters.search && (
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 pt-8 border-t border-border/40">
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp className="w-4 h-4 text-chart-2" />
                  <h2 className="font-heading font-semibold text-sm uppercase tracking-wide text-muted-foreground">Trending Right Now</h2>
                </div>
                <div className="space-y-3">
                  {trendingJobs.map((job, i) => (
                    <JobCard key={job.id} job={job} index={i} isSaved={savedJobIds.has(job.id)} onSave={handleSave} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}