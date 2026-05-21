import React from "react";
import { motion } from "framer-motion";

export default function SectionShell({ title, description, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-card rounded-2xl border border-border/50 p-6 sm:p-8"
    >
      <div className="mb-6 pb-5 border-b border-border/50">
        <h2 className="font-heading text-xl font-bold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children}
    </motion.div>
  );
}