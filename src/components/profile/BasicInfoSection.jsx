import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save, Linkedin, Github, Globe2 } from "lucide-react";
import SectionShell from "./SectionShell";

export default function BasicInfoSection({ user, onSaved }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    headline:      user?.headline      || "",
    location:      user?.location      || "",
    bio:           user?.bio           || "",
    linkedin_url:  user?.linkedin_url  || "",
    github_url:    user?.github_url    || "",
    portfolio_url: user?.portfolio_url || "",
  });

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe(form);
    setSaving(false);
    onSaved?.({ ...user, ...form });
    toast({ title: "Basic info saved!" });
  };

  return (
    <SectionShell
      title="Basic Information"
      description="Your public-facing identity. This is the first thing recruiters see."
    >
      {/* Avatar placeholder */}
      <div className="flex items-center gap-5 pb-6 border-b border-border/50 mb-6">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-2xl shrink-0">
          {(user?.full_name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold">{user?.full_name}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <p className="text-xs text-muted-foreground mt-1">Name and email are managed by your account settings.</p>
        </div>
      </div>

      <div className="space-y-5">
        <Field label="Professional Headline" hint="e.g. Senior React Developer at Meta">
          <Input
            placeholder="What do you do professionally?"
            value={form.headline}
            onChange={set("headline")}
            className="rounded-xl"
          />
        </Field>

        <Field label="Location" hint="City, state, or 'Remote'">
          <Input
            placeholder="San Francisco, CA"
            value={form.location}
            onChange={set("location")}
            className="rounded-xl"
          />
        </Field>

        <Field label="Professional Summary" hint="2–4 sentences about your background and goals">
          <Textarea
            placeholder="Experienced full-stack developer with 5+ years building scalable web applications..."
            value={form.bio}
            onChange={set("bio")}
            className="rounded-xl min-h-[110px] resize-none"
          />
          <p className="text-xs text-muted-foreground text-right mt-1">{form.bio.length} / 600 chars</p>
        </Field>

        <div className="border-t border-border/50 pt-5">
          <p className="text-sm font-medium mb-4">Social & Portfolio Links</p>
          <div className="space-y-3">
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="linkedin.com/in/yourprofile" value={form.linkedin_url} onChange={set("linkedin_url")} className="rounded-xl pl-10" />
            </div>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="github.com/yourusername" value={form.github_url} onChange={set("github_url")} className="rounded-xl pl-10" />
            </div>
            <div className="relative">
              <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="yourportfolio.com" value={form.portfolio_url} onChange={set("portfolio_url")} className="rounded-xl pl-10" />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="rounded-xl gap-2 w-full sm:w-auto">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Basic Info"}
        </Button>
      </div>
    </SectionShell>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <Label className="mb-1.5 block font-medium">{label}</Label>
      {hint && <p className="text-xs text-muted-foreground mb-2">{hint}</p>}
      {children}
    </div>
  );
}