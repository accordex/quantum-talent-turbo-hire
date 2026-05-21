import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2, Save, Plus, Pencil, Trash2, Briefcase,
  ChevronDown, ChevronUp, Building2
} from "lucide-react";
import SectionShell from "./SectionShell";
import { motion, AnimatePresence } from "framer-motion";

const blankEntry = () => ({
  id: crypto.randomUUID(),
  title: "", company: "", location: "",
  start_date: "", end_date: "",
  is_current: false, description: "",
});

export default function ExperienceSection({ user, onSaved }) {
  const { toast } = useToast();
  const [entries, setEntries] = useState(user?.experience || []);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const startAdd = () => {
    const e = blankEntry();
    setDraft(e);
    setEditingId(e.id);
  };

  const startEdit = (entry) => {
    setDraft({ ...entry });
    setEditingId(entry.id);
  };

  const cancelEdit = () => { setDraft(null); setEditingId(null); };

  const setDraftField = (k) => (e) =>
    setDraft((p) => ({ ...p, [k]: e?.target ? e.target.value : e }));

  const saveDraft = () => {
    if (!draft.title || !draft.company) {
      toast({ title: "Title and company are required.", variant: "destructive" });
      return;
    }
    setEntries((prev) => {
      const exists = prev.find(e => e.id === draft.id);
      return exists
        ? prev.map(e => e.id === draft.id ? draft : e)
        : [draft, ...prev];
    });
    cancelEdit();
  };

  const deleteEntry = (id) => setEntries((prev) => prev.filter(e => e.id !== id));

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe({ experience: entries });
    setSaving(false);
    onSaved?.({ ...user, experience: entries });
    toast({ title: "Experience saved!" });
  };

  return (
    <SectionShell
      title="Work Experience"
      description="List your professional experience. Most recent first."
    >
      <div className="space-y-4">
        {entries.length === 0 && !editingId && (
          <div className="rounded-xl border-2 border-dashed border-border p-10 text-center">
            <Briefcase className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No experience added yet.</p>
          </div>
        )}

        <AnimatePresence>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
            >
              {editingId === entry.id ? (
                <DraftForm
                  draft={draft}
                  setDraftField={setDraftField}
                  onSave={saveDraft}
                  onCancel={cancelEdit}
                />
              ) : (
                <ExperienceCard
                  entry={entry}
                  onEdit={() => startEdit(entry)}
                  onDelete={() => deleteEntry(entry.id)}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {editingId && !entries.find(e => e.id === editingId) && (
          <DraftForm
            draft={draft}
            setDraftField={setDraftField}
            onSave={saveDraft}
            onCancel={cancelEdit}
          />
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {!editingId && (
            <Button variant="outline" onClick={startAdd} className="rounded-xl gap-2">
              <Plus className="w-4 h-4" /> Add Experience
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving || !!editingId} className="rounded-xl gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Experience"}
          </Button>
        </div>
      </div>
    </SectionShell>
  );
}

function ExperienceCard({ entry, onEdit, onDelete }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-xl border border-border/50 hover:border-primary/20 transition-colors group">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Building2 className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold">{entry.title}</p>
        <p className="text-sm text-muted-foreground">{entry.company}{entry.location ? ` · ${entry.location}` : ""}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {entry.start_date}{entry.is_current ? " – Present" : entry.end_date ? ` – ${entry.end_date}` : ""}
        </p>
        {entry.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{entry.description}</p>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
          <Pencil className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function DraftForm({ draft, setDraftField, onSave, onCancel }) {
  return (
    <div className="p-6 rounded-xl border-2 border-primary/30 bg-primary/5 space-y-4">
      <p className="font-heading font-semibold text-sm text-primary">
        {draft.company ? `Editing: ${draft.company}` : "New Experience"}
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="mb-1.5 block text-xs">Job Title *</Label>
          <Input value={draft.title} onChange={setDraftField("title")} placeholder="Senior Developer" className="rounded-xl" />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs">Company *</Label>
          <Input value={draft.company} onChange={setDraftField("company")} placeholder="Acme Inc." className="rounded-xl" />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs">Location</Label>
          <Input value={draft.location} onChange={setDraftField("location")} placeholder="New York, NY" className="rounded-xl" />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs">Start Date</Label>
          <Input type="month" value={draft.start_date} onChange={setDraftField("start_date")} className="rounded-xl" />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs">End Date</Label>
          <Input type="month" value={draft.end_date} onChange={setDraftField("end_date")} disabled={draft.is_current} className="rounded-xl" />
        </div>
        <div className="flex items-center gap-2 mt-5">
          <Checkbox
            id="is_current"
            checked={draft.is_current}
            onCheckedChange={(v) => setDraftField("is_current")(v)}
          />
          <Label htmlFor="is_current" className="text-sm cursor-pointer">I currently work here</Label>
        </div>
      </div>
      <div>
        <Label className="mb-1.5 block text-xs">Description</Label>
        <Textarea
          value={draft.description}
          onChange={setDraftField("description")}
          placeholder="Describe your responsibilities and achievements..."
          className="rounded-xl min-h-[90px] resize-none"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={onSave} className="rounded-xl">Save Entry</Button>
        <Button variant="ghost" onClick={onCancel} className="rounded-xl">Cancel</Button>
      </div>
    </div>
  );
}