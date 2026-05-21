import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, X } from "lucide-react";

const workModes = [
  { value: "all", label: "All Modes" },
  { value: "remote", label: "🌐 Remote" },
  { value: "hybrid", label: "🏙 Hybrid" },
  { value: "onsite", label: "🏢 On-site" },
];

const jobTypes = [
  { value: "all", label: "All Types" },
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const expLevels = [
  { value: "all", label: "All Levels" },
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "executive", label: "Executive" },
];

const industries = [
  { value: "all", label: "All Industries" },
  { value: "Technology", label: "Technology" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Finance", label: "Finance" },
  { value: "Marketing", label: "Marketing" },
  { value: "Engineering", label: "Engineering" },
  { value: "Design", label: "Design" },
  { value: "Sales", label: "Sales" },
  { value: "Education", label: "Education" },
  { value: "Legal", label: "Legal" },
];

const postedOptions = [
  { value: "all", label: "Any Time" },
  { value: "1", label: "Last 24 hours" },
  { value: "7", label: "Last 7 days" },
  { value: "14", label: "Last 2 weeks" },
  { value: "30", label: "Last 30 days" },
];

export default function JobFilters({ filters, onFilterChange, onReset }) {
  const activeCount = [
    filters.search, filters.location,
    filters.work_mode !== "all" ? filters.work_mode : "",
    filters.job_type !== "all" ? filters.job_type : "",
    filters.experience_level !== "all" ? filters.experience_level : "",
    filters.industry !== "all" ? filters.industry : "",
    filters.posted !== "all" ? filters.posted : "",
    filters.salary_min > 0 ? "y" : "",
  ].filter(Boolean).length;

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-heading font-semibold text-sm">Filters</h3>
          {activeCount > 0 && (
            <Badge className="text-xs h-5 px-1.5">{activeCount}</Badge>
          )}
        </div>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset} className="text-xs gap-1 h-7 text-destructive hover:text-destructive">
            <X className="w-3 h-3" /> Clear all
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Job title, skill, or keyword..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="pl-10 rounded-xl text-sm"
        />
      </div>

      {/* Location */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wide">Location</label>
        <Input
          placeholder="City, state, or country"
          value={filters.location}
          onChange={(e) => onFilterChange("location", e.target.value)}
          className="rounded-xl text-sm"
        />
      </div>

      {/* Work Mode — quick pills */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wide">Work Mode</label>
        <div className="flex flex-wrap gap-1.5">
          {workModes.map((m) => (
            <button
              key={m.value}
              onClick={() => onFilterChange("work_mode", m.value)}
              className={`text-xs px-3 py-1 rounded-full border transition-all ${
                filters.work_mode === m.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/60 text-muted-foreground hover:border-primary/50"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Job Type */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wide">Job Type</label>
        <Select value={filters.job_type} onValueChange={(v) => onFilterChange("job_type", v)}>
          <SelectTrigger className="rounded-xl text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {jobTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Experience Level */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wide">Experience Level</label>
        <Select value={filters.experience_level} onValueChange={(v) => onFilterChange("experience_level", v)}>
          <SelectTrigger className="rounded-xl text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {expLevels.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Salary min */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wide">
          Min Salary
          {filters.salary_min > 0 && (
            <span className="ml-2 text-primary normal-case font-semibold">
              ${Math.round(filters.salary_min / 1000)}K+
            </span>
          )}
        </label>
        <Slider
          min={0}
          max={300000}
          step={10000}
          value={[filters.salary_min || 0]}
          onValueChange={([v]) => onFilterChange("salary_min", v)}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>$0</span>
          <span>$300K+</span>
        </div>
      </div>

      {/* Industry */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wide">Industry</label>
        <Select value={filters.industry} onValueChange={(v) => onFilterChange("industry", v)}>
          <SelectTrigger className="rounded-xl text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {industries.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Posted Date */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wide">Date Posted</label>
        <Select value={filters.posted} onValueChange={(v) => onFilterChange("posted", v)}>
          <SelectTrigger className="rounded-xl text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {postedOptions.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}