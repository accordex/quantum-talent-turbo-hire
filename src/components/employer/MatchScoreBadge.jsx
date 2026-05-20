import React from "react";

export function computeMatchScore(candidate, job) {
  if (!candidate || !job) return 0;

  let score = 0;
  let total = 0;

  // Skills match (50 pts)
  const jobSkills = (job.skills || []).map(s => s.toLowerCase());
  const candidateSkills = (candidate.skills || []).map(s => s.toLowerCase());
  if (jobSkills.length > 0) {
    total += 50;
    const matched = jobSkills.filter(s => candidateSkills.includes(s)).length;
    score += Math.round((matched / jobSkills.length) * 50);
  }

  // Experience level match (25 pts)
  const expMap = { entry: 1, mid: 3, senior: 6, lead: 9, executive: 12 };
  const jobExpYears = expMap[job.experience_level] || 0;
  const candidateExpEntries = candidate.experience || [];
  let candidateYears = 0;
  candidateExpEntries.forEach(e => {
    if (e.start_date) {
      const start = new Date(e.start_date);
      const end = e.is_current ? new Date() : (e.end_date ? new Date(e.end_date) : new Date());
      candidateYears += Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
    }
  });
  if (jobExpYears > 0) {
    total += 25;
    const ratio = Math.min(1, candidateYears / jobExpYears);
    score += Math.round(ratio * 25);
  }

  // Work mode preference match (15 pts)
  total += 15;
  if (!job.work_mode || !candidate.desired_work_mode || candidate.desired_work_mode === "any") {
    score += 15;
  } else if (job.work_mode === candidate.desired_work_mode) {
    score += 15;
  }

  // Profile completeness bonus (10 pts)
  total += 10;
  if (candidate.resume_url) score += 5;
  if (candidateSkills.length > 0) score += 3;
  if (candidate.headline) score += 2;

  return total > 0 ? Math.min(100, Math.round((score / total) * 100)) : 0;
}

export default function MatchScoreBadge({ score, size = "md" }) {
  const color =
    score >= 80 ? "text-chart-3 bg-chart-3/10 border-chart-3/30" :
    score >= 60 ? "text-primary bg-primary/10 border-primary/30" :
    score >= 40 ? "text-chart-4 bg-chart-4/10 border-chart-4/30" :
    "text-muted-foreground bg-muted border-border";

  const ring =
    score >= 80 ? "stroke-chart-3" :
    score >= 60 ? "stroke-primary" :
    score >= 40 ? "stroke-chart-4" :
    "stroke-muted-foreground";

  const r = size === "lg" ? 22 : 16;
  const cx = size === "lg" ? 28 : 20;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${color}`}>
      <svg width={cx * 2} height={cx * 2} className="-rotate-90" style={{ width: size === "lg" ? 28 : 20, height: size === "lg" ? 28 : 20 }}>
        <circle cx={cx} cy={cx} r={r} strokeWidth="3" className="stroke-muted" fill="none" />
        <circle
          cx={cx} cy={cx} r={r}
          strokeWidth="3"
          className={ring}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>
      <span>{score}% Match</span>
    </div>
  );
}