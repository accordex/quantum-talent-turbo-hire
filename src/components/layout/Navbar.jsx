import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown, FileEdit, Brain, TrendingUp, Sun, Moon, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useTheme } from "@/lib/ThemeContext";
import NotificationBell from "@/components/alerts/NotificationBell";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Jobs", path: "/jobs" },
  { label: "For Employers", path: "/employers" },
  { label: "For Recruiters", path: "/recruiters" },
  { label: "Pricing", path: "/pricing" },
  { label: "About", path: "/about" },
];

const TOOLS = [
  { icon: FileEdit, label: "Resume Builder", path: "/resume-builder", desc: "Build & download your resume" },
  { icon: Brain, label: "Interview Prep", path: "/interview-prep", desc: "AI-powered practice questions" },
  { icon: TrendingUp, label: "Salary Insights", path: "/salary-insights", desc: "Market salary data" },
];

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      setIsAuthenticated(authed);
      if (authed) {
        const me = await base44.auth.me();
        setUserEmail(me?.email || null);
      }
    });
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="https://media.base44.com/images/public/69f587c9f467b13ad869c8aa/a49e43def_logo167cb2cb4cd603d42c23.png"
              alt="TalentTurbo"
              className="h-8 lg:h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 group ${
                  isActive(link.path) ? "text-primary" : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                  />
                )}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-primary group-hover:w-4/5 transition-all duration-300" />
              </Link>
            ))}
            {/* Tools dropdown */}
            <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
              <button className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                toolsOpen ? "text-primary" : "text-foreground/60 hover:text-foreground"
              }`}>
                Career Tools <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {toolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-64 bg-card border border-border/60 rounded-2xl shadow-xl overflow-hidden z-50 p-2"
                  >
                    {TOOLS.map((tool) => (
                      <Link key={tool.path} to={tool.path} onClick={() => setToolsOpen(false)}>
                        <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/5 transition-colors group">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <tool.icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium group-hover:text-primary transition-colors">{tool.label}</p>
                            <p className="text-xs text-muted-foreground">{tool.desc}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Cmd+K hint */}
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/50 border border-border/40 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-xs">Search</span>
              <kbd className="text-[10px] bg-background border border-border/50 px-1 rounded ml-1">⌘K</kbd>
            </button>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg bg-muted/50 border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {isAuthenticated && userEmail && <NotificationBell userEmail={userEmail} />}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/profile/edit">
                  <Button variant="ghost" className="text-foreground/70 hover:text-foreground rounded-xl">
                    Edit Profile
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button className="rounded-xl px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                    Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-foreground/70 hover:text-foreground rounded-xl"
                  onClick={() => base44.auth.redirectToLogin()}
                >
                  Sign In
                </Button>
                <Link to="/get-started">
                  <button className="relative px-6 py-2.5 rounded-xl font-semibold text-sm overflow-hidden group">
                    <div className="animated-border absolute inset-0 rounded-xl" />
                    <div className="absolute inset-[1.5px] bg-background rounded-[10px]" />
                    <span className="relative text-foreground group-hover:text-primary transition-colors">
                      Get Started →
                    </span>
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background border-border">
              <div className="flex flex-col gap-1 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive(link.path)
                        ? "text-primary bg-primary/10"
                        : "text-foreground/70 hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-border mt-2 pt-2">
                  <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Career Tools</p>
                  {TOOLS.map((tool) => (
                    <Link key={tool.path} to={tool.path} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors">
                      <tool.icon className="w-4 h-4" /> {tool.label}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-border mt-2 pt-4 flex flex-col gap-3">
                  {/* Theme toggle always visible */}
                  <Button variant="outline" className="w-full rounded-xl border-border gap-2" onClick={toggleTheme}>
                    {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </Button>
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile/edit" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full rounded-xl border-border">Edit Profile</Button>
                      </Link>
                      <Link to="/dashboard" onClick={() => setOpen(false)}>
                        <Button className="w-full rounded-xl">Dashboard</Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full rounded-xl border-border" onClick={() => base44.auth.redirectToLogin()}>
                        Sign In
                      </Button>
                      <Link to="/get-started" onClick={() => setOpen(false)}>
                        <Button className="w-full rounded-xl">Get Started</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}