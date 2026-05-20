import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Building2, Bookmark, Share2, Send, DollarSign, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import moment from "moment";

const typeLabels = { full_time: "Full-time", part_time: "Part-time", contract: "Contract", internship: "Internship" };
const modeColors = {
  remote: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  hybrid: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  onsite: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};
const modeLabels = { remote: "Remote", hybrid: "Hybrid", onsite: "On-site" };

export default function JobCard({ job, onSave, isSaved, index = 0, matchScore = null }) {
  const formatSalary = (min, max) => {
    if (!min && !max) return null;
    const fmt = (n) => n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`;
    if (min && max) return `${fmt(min)} – ${fmt(max)}/yr`;
    if (min) return `From ${fmt(min)}/yr`;
    return `Up to ${fmt(max)}/yr`;
  };

  const salary = formatSalary(job.salary_min, job.salary_max);
  const isNew = moment().diff(moment(job.created_date), "days") <= 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3) }}
    >
      <div className="bg-card rounded-2xl border border-border/50 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group overflow-hidden">
        {/* Top bar for featured */}
        {job.is_featured && (
          <div className="h-0.5 w-full bg-gradient-to-r from-primary via-accent to-primary" />
        )}

        <div className="p-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Logo */}
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                {job.company_logo ? (
                  <img src={job.company_logo} alt={job.company} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-5 h-5 text-primary" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link to={`/jobs/${job.id}`}>
                    <h3 className="font-heading font-semibold text-base group-hover:text-primary transition-colors leading-tight">
                      {job.title}
                    </h3>
                  </Link>
                  {isNew && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25 shrink-0">NEW</span>
                  )}
                  {job.is_featured && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-chart-4/15 text-chart-4 border border-chart-4/25 flex items-center gap-1 shrink-0">
                      <Star className="w-2.5 h-2.5" /> Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{job.company}</p>
              </div>
            </div>

            {/* Match score */}
            {matchScore && (
              <div className="shrink-0 text-right">
                <div className="flex items-center gap-1 text-xs font-semibold text-chart-3">
                  <Zap className="w-3 h-3" />
                  {matchScore}% match
                </div>
              </div>
            )}
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 shrink-0" />
              {job.location}
            </span>

            {job.work_mode && (
              <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${modeColors[job.work_mode] || "bg-secondary text-secondary-foreground border-border"}`}>
                {modeLabels[job.work_mode] || job.work_mode}
              </span>
            )}

            {job.job_type && (
              <span className="text-xs px-2 py-0.5 rounded-md border border-border/60 text-muted-foreground">
                {typeLabels[job.job_type] || job.job_type}
              </span>
            )}

            {salary && (
              <span className="flex items-center gap-1 text-xs font-semibold text-foreground ml-auto">
                <DollarSign className="w-3 h-3 text-chart-3" />
                {salary}
              </span>
            )}
          </div>

          {/* Description preview */}
          {job.description && (
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed line-clamp-2">
              {job.description}
            </p>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {job.skills.slice(0, 5).map((skill) => (
                <Badge key={skill} variant="outline" className="text-[11px] rounded-md font-normal border-border/50 text-muted-foreground px-2 py-0">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 5 && (
                <Badge variant="outline" className="text-[11px] rounded-md font-normal border-border/50 text-muted-foreground px-2 py-0">
                  +{job.skills.length - 5} more
                </Badge>
              )}
            </div>
          )}

          {/* Footer row */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {moment(job.created_date).fromNow()}
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  if (navigator.share) {
                    navigator.share({ title: job.title, text: `${job.title} at ${job.company}`, url: window.location.origin + `/jobs/${job.id}` });
                  } else {
                    navigator.clipboard.writeText(window.location.origin + `/jobs/${job.id}`);
                  }
                }}
              >
                <Share2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-primary"
                onClick={(e) => { e.preventDefault(); onSave?.(job); }}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-primary text-primary" : ""}`} />
              </Button>
              <Link to={`/jobs/${job.id}`} onClick={(e) => e.stopPropagation()}>
                <Button size="sm" className="h-7 rounded-lg text-xs gap-1 ml-1">
                  <Send className="w-3 h-3" /> Apply
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}