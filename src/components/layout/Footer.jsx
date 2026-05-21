import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Find Jobs", path: "/jobs" },
    { label: "For Employers", path: "/employers" },
    { label: "For Recruiters", path: "/recruiters" },
    { label: "Pricing", path: "/pricing" },
    { label: "About Us", path: "/about" },
  ],
  "Career Tools": [
    { label: "Resume Builder", path: "/resume-builder" },
    { label: "Interview Prep", path: "/interview-prep" },
    { label: "Salary Insights", path: "/salary-insights" },
    { label: "Get Started", path: "/get-started" },
  ],
  Legal: [
    { label: "Privacy Policy", path: "/" },
    { label: "Terms of Service", path: "/" },
    { label: "Cookie Policy", path: "/" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,hsl(199,89%,48%,0.06),transparent)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex mb-6">
              <img
                src="https://media.base44.com/images/public/69f587c9f467b13ad869c8aa/a49e43def_logo167cb2cb4cd603d42c23.png"
                alt="TalentTurbo"
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-foreground/35 text-sm leading-relaxed max-w-sm mb-6">
              The on-demand recruitment platform connecting employers with verified, skill-matched candidates faster than ever before.
            </p>
            <div className="space-y-2 text-sm text-foreground/25">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@talentturbo.us</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>United States</span>
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-heading font-semibold text-xs uppercase tracking-[0.15em] mb-5 text-foreground/50">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-foreground/30 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-foreground/20">
            © 2026 TalentTurbo. All rights reserved.
          </p>
          <p className="text-xs text-foreground/15">Built for the future of hiring.</p>
        </div>
      </div>
    </footer>
  );
}