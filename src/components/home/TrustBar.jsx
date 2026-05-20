import React from "react";

const logos = ["Accenture", "Deloitte", "Infosys", "Wipro", "TCS", "HCL", "Cognizant", "Capgemini", "Accenture", "Deloitte", "Infosys", "Wipro", "TCS", "HCL", "Cognizant", "Capgemini"];

export default function TrustBar() {
  return (
    <section className="py-12 border-y border-white/5 overflow-hidden relative">
      <div className="absolute inset-0 bg-white/[0.01]" />
      <p className="text-center text-xs font-semibold text-foreground/25 uppercase tracking-[0.2em] mb-8">
        Hiring teams from these companies trust TalentTurbo
      </p>
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="marquee-inner">
          {logos.map((logo, i) => (
            <div
              key={i}
              className="mx-10 shrink-0 font-heading font-bold text-lg tracking-wide text-foreground/15 hover:text-primary/60 transition-colors cursor-default select-none"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}