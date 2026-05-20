import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save, Globe, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import SectionShell from "./SectionShell";

export default function VisibilitySection({ user, onSaved }) {
  const { toast } = useToast();
  const [isPublic, setIsPublic] = useState(user?.is_public ?? false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe({ is_public: isPublic });
    setSaving(false);
    onSaved?.({ ...user, is_public: isPublic });
    toast({
      title: isPublic ? "Profile is now public!" : "Profile set to private.",
      description: isPublic
        ? "Recruiters can now discover and view your profile."
        : "Your profile is hidden from recruiter search.",
    });
  };

  return (
    <SectionShell
      title="Profile Visibility"
      description="Control who can see your profile and contact you through TalentTurbo."
    >
      <div className="space-y-6">
        {/* Toggle card */}
        <div className={`rounded-2xl border-2 p-6 transition-all duration-300 ${
          isPublic
            ? "border-chart-3/30 bg-chart-3/5"
            : "border-border/50 bg-muted/30"
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isPublic ? "bg-chart-3/15" : "bg-muted"
              }`}>
                {isPublic
                  ? <Globe className="w-6 h-6 text-chart-3" />
                  : <Lock className="w-6 h-6 text-muted-foreground" />
                }
              </div>
              <div>
                <p className="font-heading font-semibold">
                  {isPublic ? "Public Profile" : "Private Profile"}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {isPublic
                    ? "Recruiters can discover and view your profile in search results."
                    : "Your profile is hidden. Only you can see it."}
                </p>
              </div>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={setIsPublic}
              className="shrink-0 mt-1"
            />
          </div>
        </div>

        {/* What's visible */}
        <div>
          <p className="text-sm font-semibold mb-3">
            {isPublic ? "What recruiters can see:" : "When public, recruiters will see:"}
          </p>
          <div className="space-y-2">
            {[
              { label: "Name & professional headline", always: true },
              { label: "Location", always: true },
              { label: "Professional summary", always: true },
              { label: "Skills & experience", always: true },
              { label: "Education history", always: true },
              { label: "Resume PDF", note: "Only if uploaded" },
              { label: "Portfolio & social links", note: "Only if provided" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2.5">
                {isPublic || item.always ? (
                  <CheckCircle2 className="w-4 h-4 text-chart-3 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                )}
                <span className="text-sm">{item.label}</span>
                {item.note && <span className="text-xs text-muted-foreground">({item.note})</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Never visible */}
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Never shared with recruiters</p>
          <div className="space-y-1.5">
            {["Email address", "Phone number", "Application history", "Salary preferences"].map(item => (
              <div key={item} className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                <span className="text-xs text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="rounded-xl gap-2 w-full sm:w-auto">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Visibility Settings"}
        </Button>
      </div>
    </SectionShell>
  );
}