import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Briefcase, LayoutDashboard, Users, FileEdit, Brain, TrendingUp, Info, DollarSign, Building2, ChevronRight, X } from "lucide-react";

const STATIC_ITEMS = [
  { id: "jobs",       label: "Browse Jobs",        path: "/jobs",            icon: Briefcase,      group: "Pages"   },
  { id: "dashboard",  label: "Dashboard",          path: "/dashboard",       icon: LayoutDashboard,group: "Pages"   },
  { id: "employers",  label: "For Employers",      path: "/employers",       icon: Building2,      group: "Pages"   },
  { id: "recruiters", label: "For Recruiters",     path: "/recruiters",      icon: Users,          group: "Pages"   },
  { id: "about",      label: "About",              path: "/about",           icon: Info,           group: "Pages"   },
  { id: "resume",     label: "Resume Builder",     path: "/resume-builder",  icon: FileEdit,       group: "Tools"   },
  { id: "interview",  label: "Interview Prep",     path: "/interview-prep",  icon: Brain,          group: "Tools"   },
  { id: "salary",     label: "Salary Insights",    path: "/salary-insights", icon: DollarSign,     group: "Tools"   },
  { id: "pricing",    label: "Pricing",            path: "/pricing",         icon: TrendingUp,     group: "Pages"   },
];

export default function CommandPalette({ jobs = [] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const q = query.toLowerCase();
  const jobItems = jobs
    .filter(j => j.status !== "draft" && (j.title.toLowerCase().includes(q) || j.company?.toLowerCase().includes(q)))
    .slice(0, 5)
    .map(j => ({ id: j.id, label: j.title, sub: j.company, path: `/jobs/${j.id}`, icon: Briefcase, group: "Jobs" }));

  const staticFiltered = q
    ? STATIC_ITEMS.filter(i => i.label.toLowerCase().includes(q))
    : STATIC_ITEMS;

  const allItems = [...staticFiltered, ...jobItems];

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, allItems.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && allItems[selectedIdx]) {
      navigate(allItems[selectedIdx].path);
      setOpen(false);
    }
  };

  const grouped = allItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.15 }}
              className="fixed top-[20vh] left-1/2 -translate-x-1/2 w-full max-w-lg z-[101] px-4"
            >
              <div className="bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden">
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
                  <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={e => { setQuery(e.target.value); setSelectedIdx(0); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search pages, jobs, tools…"
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <kbd className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border/50">ESC</kbd>
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto py-2">
                  {allItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No results found</p>
                  ) : (
                    Object.entries(grouped).map(([group, items]) => (
                      <div key={group}>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-1.5">{group}</p>
                        {items.map((item) => {
                          const globalIdx = allItems.indexOf(item);
                          const isSelected = globalIdx === selectedIdx;
                          return (
                            <button
                              key={item.id}
                              onMouseEnter={() => setSelectedIdx(globalIdx)}
                              onClick={() => { navigate(item.path); setOpen(false); }}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${isSelected ? "bg-primary/10" : "hover:bg-muted/50"}`}
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "bg-primary/20" : "bg-muted"}`}>
                                <item.icon className={`w-3.5 h-3.5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className={`text-sm font-medium truncate ${isSelected ? "text-primary" : "text-foreground"}`}>{item.label}</p>
                                {item.sub && <p className="text-xs text-muted-foreground truncate">{item.sub}</p>}
                              </div>
                              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                            </button>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-border/50 px-4 py-2 flex items-center gap-4">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1"><kbd className="bg-muted border border-border/50 px-1 rounded text-[10px]">↑↓</kbd> navigate</span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1"><kbd className="bg-muted border border-border/50 px-1 rounded text-[10px]">↵</kbd> open</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">⌘K to toggle</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}