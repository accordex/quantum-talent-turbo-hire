import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const defaultForm = {
  name: "",
  keywords: "",
  location: "",
  work_mode: "all",
  job_type: "all",
  experience_level: "all",
  salary_min: "",
  skills: [],
  notify_email: true,
  notify_inapp: true,
  is_active: true,
};

export default function AlertFormModal({ open, onClose, existing }) {
  const [form, setForm] = useState(existing ? { ...existing, salary_min: existing.salary_min || "" } : defaultForm);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      set("skills", [...form.skills, s]);
    }
    setSkillInput("");
  };

  const removeSkill = (s) => set("skills", form.skills.filter(x => x !== s));

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ title: "Alert name is required", variant: "destructive" }); return; }
    setSaving(true);
    const payload = { ...form, salary_min: form.salary_min ? Number(form.salary_min) : null };
    if (existing) {
      await base44.entities.JobAlert.update(existing.id, payload);
    } else {
      await base44.entities.JobAlert.create(payload);
    }
    queryClient.invalidateQueries({ queryKey: ["myAlerts"] });
    toast({ title: existing ? "Alert updated" : "Alert created!", description: "You'll be notified when matching jobs are posted." });
    setSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">{existing ? "Edit Alert" : "Create Job Alert"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <Field label="Alert Name *">
            <Input placeholder="e.g. Remote React Jobs" value={form.name} onChange={e => set("name", e.target.value)} />
          </Field>

          <Field label="Keywords / Job Title">
            <Input placeholder="e.g. React Developer, Product Manager" value={form.keywords} onChange={e => set("keywords", e.target.value)} />
          </Field>

          <Field label="Location">
            <Input placeholder="e.g. New York, Remote" value={form.location} onChange={e => set("location", e.target.value)} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Work Mode">
              <Select value={form.work_mode} onValueChange={v => set("work_mode", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="onsite">Onsite</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Job Type">
              <Select value={form.job_type} onValueChange={v => set("job_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Experience Level">
              <Select value={form.experience_level} onValueChange={v => set("experience_level", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="entry">Entry</SelectItem>
                  <SelectItem value="mid">Mid</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Min. Salary (USD)">
              <Input type="number" placeholder="e.g. 80000" value={form.salary_min} onChange={e => set("salary_min", e.target.value)} />
            </Field>
          </div>

          <Field label="Required Skills">
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add a skill…"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())}
              />
              <Button type="button" size="icon" variant="outline" onClick={addSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skills.map(s => (
                <Badge key={s} variant="secondary" className="gap-1 pr-1.5">
                  {s}
                  <button onClick={() => removeSkill(s)} className="hover:text-destructive transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </Field>

          <div className="space-y-3 pt-2 border-t border-border">
            <p className="text-sm font-medium text-foreground">Notification channels</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Email notifications</p>
                <p className="text-xs text-muted-foreground">Get an email for every new match</p>
              </div>
              <Switch checked={form.notify_email} onCheckedChange={v => set("notify_email", v)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">In-app notifications</p>
                <p className="text-xs text-muted-foreground">See alerts in your dashboard</p>
              </div>
              <Switch checked={form.notify_inapp} onCheckedChange={v => set("notify_inapp", v)} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>Cancel</Button>
            <Button className="flex-1 rounded-xl" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : existing ? "Save Changes" : "Create Alert"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm text-foreground/70">{label}</Label>
      {children}
    </div>
  );
}