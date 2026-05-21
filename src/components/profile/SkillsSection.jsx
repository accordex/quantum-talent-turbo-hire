import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save, Plus, X } from "lucide-react";
import SectionShell from "./SectionShell";

const SUGGESTED_SKILLS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS",
  "Docker", "Kubernetes", "GraphQL", "PostgreSQL", "MongoDB", "Redis",
  "Next.js", "Vue.js", "Go", "Java", "Figma", "SQL", "Git", "REST APIs",
  "Machine Learning", "TensorFlow", "PyTorch", "Spark", "Airflow",
];

export default function SkillsSection({ user, onSaved }) {
  const { toast } = useToast();
  const [skills, setSkills] = useState(user?.skills || []);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  const addSkill = (skill) => {
    const s = skill.trim();
    if (s && !skills.includes(s)) {
      setSkills((prev) => [...prev, s]);
    }
    setInput("");
  };

  const removeSkill = (s) => setSkills((prev) => prev.filter(x => x !== s));

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(input);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe({ skills });
    setSaving(false);
    onSaved?.({ ...user, skills });
    toast({ title: "Skills saved!", description: `${skills.length} skills on your profile.` });
  };

  const suggestions = SUGGESTED_SKILLS.filter(s => !skills.includes(s));

  return (
    <SectionShell
      title="Skills"
      description="Add your technical and professional skills. These power recruiter search and job matching."
    >
      <div className="space-y-6">
        {/* Current skills */}
        <div>
          <p className="text-sm font-medium mb-3">Your Skills <span className="text-muted-foreground font-normal">({skills.length})</span></p>
          {skills.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">No skills added yet. Type below or pick from suggestions.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-muted/40 min-h-[80px]">
              {skills.map((s) => (
                <Badge
                  key={s}
                  variant="secondary"
                  className="gap-1.5 px-3 py-1.5 text-sm rounded-lg cursor-default group"
                >
                  {s}
                  <button
                    onClick={() => removeSkill(s)}
                    className="opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div>
          <p className="text-sm font-medium mb-2">Add a skill</p>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. React, Python, SQL…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="rounded-xl"
            />
            <Button
              variant="outline"
              onClick={() => addSkill(input)}
              disabled={!input.trim()}
              className="rounded-xl gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">Press Enter or comma to add</p>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-3">Suggested Skills</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0, 16).map((s) => (
                <button
                  key={s}
                  onClick={() => addSkill(s)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border border-dashed border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                >
                  <Plus className="w-3 h-3" /> {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <Button onClick={handleSave} disabled={saving} className="rounded-xl gap-2 w-full sm:w-auto">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Skills"}
        </Button>
      </div>
    </SectionShell>
  );
}