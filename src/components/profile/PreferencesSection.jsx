import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save, DollarSign, Briefcase } from "lucide-react";
import SectionShell from "./SectionShell";

const workAuthOptions = [
  { value: "us_citizen",  label: "U.S. Citizen" },
  { value: "green_card",  label: "Green Card" },
  { value: "h1b",         label: "H-1B Visa" },
  { value: "h4_ead",      label: "H-4 EAD" },
  { value: "opt",         label: "OPT (F-1)" },
  { value: "stem_opt",    label: "STEM OPT" },
  { value: "tn_permit",   label: "TN Permit" },
  { value: "other",       label: "Other" },
];

export default function PreferencesSection({ user, onSaved }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    work_authorization:  user?.work_authorization  || "",
    desired_job_type:    user?.desired_job_type    || "",
    desired_work_mode:   user?.desired_work_mode   || "",
    desired_salary_min:  user?.desired_salary_min  || "",
    desired_salary_max:  user?.desired_salary_max  || "",
  });

  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      desired_salary_min: form.desired_salary_min ? Number(form.desired_salary_min) : null,
      desired_salary_max: form.desired_salary_max ? Number(form.desired_salary_max) : null,
    };
    await base44.auth.updateMe(payload);
    setSaving(false);
    onSaved?.({ ...user, ...payload });
    toast({ title: "Job preferences saved!" });
  };

  return (
    <SectionShell
      title="Job Preferences"
      description="Tell us what you're looking for. This improves job match quality."
    >
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <Label className="mb-2 block">Work Authorization</Label>
            <Select value={form.work_authorization} onValueChange={set("work_authorization")}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select authorization" />
              </SelectTrigger>
              <SelectContent>
                {workAuthOptions.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block">Desired Job Type</Label>
            <Select value={form.desired_job_type} onValueChange={set("desired_job_type")}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="full_time">Full-time</SelectItem>
                <SelectItem value="part_time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block">Work Mode</Label>
            <Select value={form.desired_work_mode} onValueChange={set("desired_work_mode")}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Salary range */}
        <div>
          <Label className="mb-2 block">Desired Salary Range (USD/year)</Label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="Min (e.g. 90000)"
                value={form.desired_salary_min}
                onChange={(e) => setForm(p => ({ ...p, desired_salary_min: e.target.value }))}
                className="rounded-xl pl-9"
              />
            </div>
            <span className="text-muted-foreground text-sm shrink-0">to</span>
            <div className="relative flex-1">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="Max (e.g. 140000)"
                value={form.desired_salary_max}
                onChange={(e) => setForm(p => ({ ...p, desired_salary_max: e.target.value }))}
                className="rounded-xl pl-9"
              />
            </div>
          </div>
        </div>

        {/* Info callout */}
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 flex items-start gap-3">
          <Briefcase className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Your job preferences are used to improve match quality and surface relevant opportunities. 
            They are not shown publicly unless your profile is set to visible.
          </p>
        </div>

        <Button onClick={handleSave} disabled={saving} className="rounded-xl gap-2 w-full sm:w-auto">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </SectionShell>
  );
}