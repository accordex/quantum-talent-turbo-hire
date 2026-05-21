import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save, Plus, Pencil, Trash2, GraduationCap } from "lucide-react";
import SectionShell from "./SectionShell";
import { motion, AnimatePresence } from "framer-motion";

const blankEntry = () => ({
  id: crypto.randomUUID(),
  institution: "", degree: "", field_of_study: "",
  start_year: "", end_year: "", is_current: false, description: "",
});

export default function EducationSection({ user, onSaved }) {
  const { toast } = useToast();
  const [entries, setEntries] = useState(user?.education || []);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const startAdd = () => { const e = blankEntry(); setDraft(e); setEditingId(e.id); };
  const startEdit = (entry) => { setDraft({ ...entry }); setEditingId(entry.id); };
  const cancelEdit = () => { setDraft(null); setEditingId(null); };
  const setDraftField = (k) => (e) => setDraft((p) => ({ ...p, [k]: e?.target ? e.target.value : e }));

  const saveDraft = () => {
    if (!draft.institution) {
      toast({ title: "Institution name is required.", variant: "destructive" });
      return;
    }
    setEntries((prev) => {
      const exists = prev.find(e => e.id === draft.id);
      return exists ? prev.map(e => e.id === draft.id ? draft : e) : [draft, ...prev];
    });
    cancelEdit();
  };

  const deleteEntry = (id) => setEntries((prev) => prev.filter(e => e.id !== id));

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe({ education: entries });
    setSaving(false);
    onSaved?.({ ...user, education: entries });
    toast({ title: "Education saved!" });
  };

  return (
    <SectionShell
      title="Education"
      description="Add your academic background, certifications, and degrees."
    >
      <div className="space-y-4">
        {entries.length === 0 && !editingId && (
          <div className="rounded-xl border-2 border-dashed border-border p-10 text-center">
            <GraduationCap className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No education added yet.</p>
          </div>
        )}

        <AnimatePresence>
          {entries.map((entry) => (
            <motion.div key={entry.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}>
              {editingId === entry.id ? (
                <DraftForm draft={draft} setDraftField={setDraftField} onSave={saveDraft} onCancel={cancelEdit} />
              ) : (
                <EducationCard entry={entry} onEdit={() => startEdit(entry)} onDelete={() => deleteEntry(entry.id)} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {editingId && !entries.find(e => e.id === editingId) && (
          <DraftForm draft={draft} setDraftField={setDraftField} onSave={saveDraft} onCancel={cancelEdit} />
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {!editingId && (
            <Button variant="outline" onClick={startAdd} className="rounded-xl gap-2">
              <Plus className="w-4 h-4" /> Add Education
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving || !!editingId} className="rounded-xl gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Education"}
          </Button>
        </div>
      </div>
    </SectionShell>
  );
}

function EducationCard({ entry, onEdit, onDelete }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-xl border border-border/50 hover:border-primary/20 transition-colors group">
      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
        <GraduationCap className="w-5 h-5 text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold">{entry.degree}{entry.field_of_study ? ` in ${entry.field_of_study}` : ""}</p>
        <p className="text-sm text-muted-foreground">{entry.institution}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {entry.start_year}{entry.is_current ? " – Present" : entry.end_year ? ` – ${entry.end_year}` : ""}
        </p>
        {entry.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{entry.description}</p>}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}><Pencil className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={onDelete}><Trash2 className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}

function DraftForm({ draft, setDraftField, onSave, onCancel }) {
  return (
    <div className="p-6 rounded-xl border-2 border-accent/30 bg-accent/5 space-y-4">
      <p className="font-heading font-semibold text-sm text-accent">
        {draft.institution ? `Editing: ${draft.institution}` : "New Education"}
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label className="mb-1.5 block text-xs">Institution *</Label>
          <Input value={draft.institution} onChange={setDraftField("institution")} placeholder="MIT, Harvard, Coursera..." className="rounded-xl" />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs">Degree</Label>
          <Input value={draft.degree} onChange={setDraftField("degree")} placeholder="B.S., M.S., Ph.D., Certificate..." className="rounded-xl" />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs">Field of Study</Label>
          <Input value={draft.field_of_study} onChange={setDraftField("field_of_study")} placeholder="Computer Science" className="rounded-xl" />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs">Start Year</Label>
          <Input value={draft.start_year} onChange={setDraftField("start_year")} placeholder="2018" className="rounded-xl" />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs">End Year</Label>
          <Input value={draft.end_year} onChange={setDraftField("end_year")} placeholder="2022" disabled={draft.is_current} className="rounded-xl" />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="edu_current" checked={draft.is_current} onCheckedChange={(v) => setDraftField("is_current")(v)} />
          <Label htmlFor="edu_current" className="text-sm cursor-pointer">Currently enrolled</Label>
        </div>
      </div>
      <div>
        <Label className="mb-1.5 block text-xs">Notes</Label>
        <Textarea value={draft.description} onChange={setDraftField("description")} placeholder="Relevant courses, honors, thesis..." className="rounded-xl min-h-[80px] resize-none" />
      </div>
      <div className="flex gap-2">
        <Button onClick={onSave} className="rounded-xl">Save Entry</Button>
        <Button variant="ghost" onClick={onCancel} className="rounded-xl">Cancel</Button>
      </div>
    </div>
  );
}