import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft, Sparkles, Loader2, TrendingUp, DollarSign,
  MapPin, Briefcase, BarChart3, Info
} from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level (0–2 yrs)" },
  { value: "mid", label: "Mid Level (3–5 yrs)" },
  { value: "senior", label: "Senior (6–10 yrs)" },
  { value: "lead", label: "Lead / Principal (10+ yrs)" },
];

export default function SalaryInsights() {
  const { toast } = useToast();
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("mid");
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    if (!jobTitle.trim()) {
      toast({ title: "Please enter a job title.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setInsights(null);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Provide comprehensive salary insights for the following role:
Job Title: ${jobTitle}
Location: ${location || "United States (national average)"}
Experience Level: ${experience}

Provide realistic, data-driven salary information. Include:
1. Salary range (min, median, max) in USD/year
2. Percentile breakdown (25th, 50th, 75th, 90th percentile)
3. Comparison by 4 top cities/locations for this role with their medians
4. Top 5 skills that command the highest salaries for this role
5. Year-over-year trend (is it growing, stable, declining?) with % change
6. Total compensation breakdown (base, bonus, equity, benefits as %)
7. 3 key negotiation tips specific to this role

Be specific and realistic based on current market data.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          salary_range: {
            type: "object",
            properties: {
              min: { type: "number" },
              median: { type: "number" },
              max: { type: "number" },
              currency: { type: "string" }
            }
          },
          percentiles: {
            type: "object",
            properties: {
              p25: { type: "number" },
              p50: { type: "number" },
              p75: { type: "number" },
              p90: { type: "number" }
            }
          },
          by_location: {
            type: "array",
            items: {
              type: "object",
              properties: { city: { type: "string" }, median: { type: "number" } }
            }
          },
          top_paying_skills: {
            type: "array",
            items: { type: "string" }
          },
          yoy_trend: {
            type: "object",
            properties: {
              direction: { type: "string" },
              percentage: { type: "number" },
              summary: { type: "string" }
            }
          },
          compensation_breakdown: {
            type: "object",
            properties: {
              base_pct: { type: "number" },
              bonus_pct: { type: "number" },
              equity_pct: { type: "number" },
              benefits_pct: { type: "number" }
            }
          },
          negotiation_tips: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    });
    setInsights(result);
    setLoading(false);
  };

  const fmt = (n) => n ? `$${Math.round(n / 1000)}K` : "—";

  const percentileData = insights ? [
    { name: "25th", value: insights.percentiles?.p25 },
    { name: "50th", value: insights.percentiles?.p50 },
    { name: "75th", value: insights.percentiles?.p75 },
    { name: "90th", value: insights.percentiles?.p90 },
  ] : [];

  const locationData = insights?.by_location || [];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold">Salary Insights</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Real-time market data for any role and location</p>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 mb-6">
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Job Title *</label>
              <input
                type="text"
                placeholder="e.g. Product Manager"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchInsights()}
                className="w-full h-10 rounded-xl border border-input bg-transparent px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Location</label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-10 rounded-xl border border-input bg-transparent px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Experience</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full h-10 rounded-xl border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {EXPERIENCE_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>
          <Button onClick={fetchInsights} disabled={loading} className="w-full rounded-xl gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Fetching market data…" : "Get Salary Insights"}
          </Button>
        </div>

        {/* Results */}
        {loading && (
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border/50 p-5 h-24 animate-pulse" />
            ))}
          </div>
        )}

        {insights && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Salary Range */}
            <div className="bg-card rounded-2xl border border-border/50 p-6">
              <h3 className="font-heading font-semibold mb-5 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" /> Salary Range
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Minimum", value: fmt(insights.salary_range?.min), color: "text-muted-foreground" },
                  { label: "Median", value: fmt(insights.salary_range?.median), color: "text-primary text-2xl" },
                  { label: "Maximum", value: fmt(insights.salary_range?.max), color: "text-chart-3" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p className={`font-heading font-bold ${item.color}`}>{item.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
              {/* Percentile bar */}
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={percentileData} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}K`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip formatter={(v) => [`$${Math.round(v / 1000)}K`, "Salary"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* By Location */}
              {locationData.length > 0 && (
                <div className="bg-card rounded-2xl border border-border/50 p-6">
                  <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" /> By Location
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={locationData} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 10 }}>
                        <XAxis type="number" tickFormatter={(v) => `$${Math.round(v / 1000)}K`} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis type="category" dataKey="city" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={80} />
                        <Tooltip formatter={(v) => [`$${Math.round(v / 1000)}K`, "Median"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                        <Bar dataKey="median" fill="hsl(var(--accent))" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Trend */}
              {insights.yoy_trend && (
                <div className="bg-card rounded-2xl border border-border/50 p-6">
                  <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-chart-3" /> Market Trend
                  </h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`text-3xl font-heading font-bold ${
                      insights.yoy_trend.direction === "growing" ? "text-chart-3" :
                      insights.yoy_trend.direction === "declining" ? "text-destructive" : "text-chart-4"
                    }`}>
                      {insights.yoy_trend.direction === "growing" ? "+" : insights.yoy_trend.direction === "declining" ? "-" : "~"}
                      {insights.yoy_trend.percentage}%
                    </div>
                    <Badge className={`capitalize ${
                      insights.yoy_trend.direction === "growing" ? "bg-chart-3/10 text-chart-3" :
                      insights.yoy_trend.direction === "declining" ? "bg-destructive/10 text-destructive" : "bg-chart-4/10 text-chart-4"
                    }`}>
                      {insights.yoy_trend.direction}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{insights.yoy_trend.summary}</p>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Top paying skills */}
              {insights.top_paying_skills?.length > 0 && (
                <div className="bg-card rounded-2xl border border-border/50 p-6">
                  <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-chart-4" /> Top Paying Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {insights.top_paying_skills.map((s, i) => (
                      <Badge key={s} variant="outline" className={`rounded-lg ${i === 0 ? "border-chart-4/50 text-chart-4" : ""}`}>
                        {i === 0 && "⭐ "}{s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Comp breakdown */}
              {insights.compensation_breakdown && (
                <div className="bg-card rounded-2xl border border-border/50 p-6">
                  <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" /> Total Comp Breakdown
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "Base Salary", pct: insights.compensation_breakdown.base_pct, color: "bg-primary" },
                      { label: "Bonus", pct: insights.compensation_breakdown.bonus_pct, color: "bg-chart-4" },
                      { label: "Equity", pct: insights.compensation_breakdown.equity_pct, color: "bg-accent" },
                      { label: "Benefits", pct: insights.compensation_breakdown.benefits_pct, color: "bg-chart-3" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-medium">{item.pct}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Negotiation tips */}
            {insights.negotiation_tips?.length > 0 && (
              <div className="bg-card rounded-2xl border border-border/50 p-6">
                <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" /> Negotiation Tips
                </h3>
                <div className="space-y-3">
                  {insights.negotiation_tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}