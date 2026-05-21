import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, User } from "lucide-react";
import { motion } from "framer-motion";

import ProfileSidebar from "../components/profile/ProfileSidebar";
import BasicInfoSection from "../components/profile/BasicInfoSection";
import SkillsSection from "../components/profile/SkillsSection";
import ExperienceSection from "../components/profile/ExperienceSection";
import EducationSection from "../components/profile/EducationSection";
import ResumeSection from "../components/profile/ResumeSection";
import PreferencesSection from "../components/profile/PreferencesSection";
import VisibilitySection from "../components/profile/VisibilitySection";

// Weights for profile completeness score
const COMPLETENESS_FIELDS = [
  { key: "headline",       weight: 10 },
  { key: "location",       weight: 5  },
  { key: "bio",            weight: 10 },
  { key: "skills",         weight: 20, check: (v) => Array.isArray(v) && v.length > 0 },
  { key: "experience",     weight: 20, check: (v) => Array.isArray(v) && v.length > 0 },
  { key: "education",      weight: 15, check: (v) => Array.isArray(v) && v.length > 0 },
  { key: "resume_url",     weight: 10 },
  { key: "work_authorization", weight: 5 },
  { key: "desired_job_type",   weight: 5 },
];

function calcCompleteness(user) {
  if (!user) return 0;
  let score = 0;
  for (const f of COMPLETENESS_FIELDS) {
    const val = user[f.key];
    const filled = f.check ? f.check(val) : !!val;
    if (filled) score += f.weight;
  }
  return Math.min(100, score);
}

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("basic");

  useEffect(() => {
    base44.auth.me().then((u) => { setUser(u); setLoading(false); });
  }, []);

  const handleSaved = useCallback((updated) => setUser(updated), []);

  // Handle hash-based section from URL
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) setActiveSection(hash);
  }, []);

  const onSectionChange = (id) => {
    setActiveSection(id);
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const completeness = calcCompleteness(user);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="flex gap-8">
            <Skeleton className="w-64 h-96 rounded-2xl hidden lg:block" />
            <Skeleton className="flex-1 h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const sectionProps = { user, onSaved: handleSaved };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold">Edit Profile</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Keep your profile up-to-date to improve recruiter discoverability
              </p>
            </div>
          </div>

          {/* Public badge */}
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
            user?.is_public
              ? "border-chart-3/30 bg-chart-3/10 text-chart-3"
              : "border-border bg-muted text-muted-foreground"
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${user?.is_public ? "bg-chart-3" : "bg-muted-foreground/50"}`} />
            {user?.is_public ? "Public · Visible to recruiters" : "Private · Hidden from recruiters"}
          </div>
        </div>

        <div className="flex gap-8 items-start">
          {/* Sidebar — desktop */}
          <div className="hidden lg:block">
            <ProfileSidebar
              activeSection={activeSection}
              onSectionChange={onSectionChange}
              completeness={completeness}
            />
          </div>

          {/* Mobile section nav */}
          <div className="lg:hidden w-full mb-4 overflow-x-auto">
            <div className="flex gap-2 pb-1">
              {[
                { id: "basic", label: "Info" },
                { id: "skills", label: "Skills" },
                { id: "experience", label: "Experience" },
                { id: "education", label: "Education" },
                { id: "resume", label: "Resume" },
                { id: "preferences", label: "Preferences" },
                { id: "visibility", label: "Visibility" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => onSectionChange(id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                    activeSection === id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Section content */}
          <div className="flex-1 min-w-0">
            {activeSection === "basic"       && <BasicInfoSection   {...sectionProps} />}
            {activeSection === "skills"      && <SkillsSection      {...sectionProps} />}
            {activeSection === "experience"  && <ExperienceSection  {...sectionProps} />}
            {activeSection === "education"   && <EducationSection   {...sectionProps} />}
            {activeSection === "resume"      && <ResumeSection      {...sectionProps} />}
            {activeSection === "preferences" && <PreferencesSection {...sectionProps} />}
            {activeSection === "visibility"  && <VisibilitySection  {...sectionProps} />}
          </div>
        </div>
      </div>
    </div>
  );
}