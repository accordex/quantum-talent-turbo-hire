import React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  User, Sparkles, Briefcase, GraduationCap,
  FileText, Settings, Globe
} from "lucide-react";

const sections = [
  { id: "basic",       label: "Basic Info",      icon: User },
  { id: "skills",      label: "Skills",          icon: Sparkles },
  { id: "experience",  label: "Experience",      icon: Briefcase },
  { id: "education",   label: "Education",       icon: GraduationCap },
  { id: "resume",      label: "Resume",          icon: FileText },
  { id: "preferences", label: "Job Preferences", icon: Settings },
  { id: "visibility",  label: "Visibility",      icon: Globe },
];

export default function ProfileSidebar({ activeSection, onSectionChange, completeness }) {
  return (
    <aside className="w-64 shrink-0">
      <div className="sticky top-24 space-y-2">
        {/* Completeness card */}
        <div className="bg-card rounded-2xl border border-border/50 p-5 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Profile strength</span>
            <span className="text-sm font-bold text-primary">{completeness}%</span>
          </div>
          <Progress value={completeness} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">
            {completeness < 40 ? "Add more details to get discovered by recruiters." :
             completeness < 80 ? "Looking good! A few more sections to go." :
             "Great profile! Recruiters can find you easily."}
          </p>
        </div>

        {/* Nav */}
        <nav className="bg-card rounded-2xl border border-border/50 p-2">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                activeSection === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}