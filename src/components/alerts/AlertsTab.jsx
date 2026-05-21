import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Bell, Plus, Pencil, Trash2, MapPin, DollarSign,
  Briefcase, Wifi, WifiOff, Mail, BellRing
} from "lucide-react";
import AlertFormModal from "./AlertFormModal";
import { useToast } from "@/components/ui/use-toast";

const workModeLabel = { all: "Any mode", remote: "Remote", hybrid: "Hybrid", onsite: "Onsite" };
const jobTypeLabel = { all: "Any type", full_time: "Full Time", part_time: "Part Time", contract: "Contract", internship: "Internship" };
const expLabel = { all: "Any level", entry: "Entry", mid: "Mid", senior: "Senior", lead: "Lead", executive: "Executive" };

export default function AlertsTab() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["myAlerts"],
    queryFn: () => base44.entities.JobAlert.list("-created_date"),
  });

  const handleDelete = async (id) => {
    await base44.entities.JobAlert.delete(id);
    queryClient.invalidateQueries({ queryKey: ["myAlerts"] });
    toast({ title: "Alert deleted" });
  };

  const handleToggle = async (alert) => {
    await base44.entities.JobAlert.update(alert.id, { is_active: !alert.is_active });
    queryClient.invalidateQueries({ queryKey: ["myAlerts"] });
  };

  const openEdit = (alert) => { setEditing(alert); setModalOpen(true); };
  const openNew = () => { setEditing(null); setModalOpen(true); };

  if (isLoading) {
    return <div className="space-y-3">{Array(2).fill(0).map((_, i) => <div key={i} className="h-28 bg-card rounded-2xl border border-border/50 animate-pulse" />)}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm text-muted-foreground">{alerts.length} alert{alerts.length !== 1 ? "s" : ""} configured</p>
        </div>
        <Button onClick={openNew} className="rounded-xl gap-2">
          <Plus className="w-4 h-4" /> New Alert
        </Button>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-heading font-semibold text-lg mb-2">No alerts yet</h3>
          <p className="text-muted-foreground text-sm mb-5 max-w-xs mx-auto">
            Save your search criteria and get notified instantly when matching jobs are posted.
          </p>
          <Button onClick={openNew} className="rounded-xl gap-2">
            <Plus className="w-4 h-4" /> Create your first alert
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className={`bg-card rounded-2xl border p-5 transition-all ${alert.is_active ? "border-border/50" : "border-border/20 opacity-60"}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${alert.is_active ? "bg-primary/10" : "bg-muted"}`}>
                    <BellRing className={`w-5 h-5 ${alert.is_active ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-semibold truncate">{alert.name}</p>
                    {alert.keywords && <p className="text-xs text-muted-foreground truncate">"{alert.keywords}"</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch checked={!!alert.is_active} onCheckedChange={() => handleToggle(alert)} />
                  <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEdit(alert)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={() => handleDelete(alert.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {alert.location && (
                  <Badge variant="outline" className="gap-1 text-xs border-border/50">
                    <MapPin className="w-3 h-3" /> {alert.location}
                  </Badge>
                )}
                {alert.work_mode && alert.work_mode !== "all" && (
                  <Badge variant="outline" className="text-xs border-border/50">
                    {workModeLabel[alert.work_mode]}
                  </Badge>
                )}
                {alert.job_type && alert.job_type !== "all" && (
                  <Badge variant="outline" className="text-xs border-border/50">
                    <Briefcase className="w-3 h-3 mr-1" />{jobTypeLabel[alert.job_type]}
                  </Badge>
                )}
                {alert.experience_level && alert.experience_level !== "all" && (
                  <Badge variant="outline" className="text-xs border-border/50">
                    {expLabel[alert.experience_level]}
                  </Badge>
                )}
                {alert.salary_min && (
                  <Badge variant="outline" className="gap-1 text-xs border-border/50">
                    <DollarSign className="w-3 h-3" /> {Number(alert.salary_min).toLocaleString()}+
                  </Badge>
                )}
                {(alert.skills || []).slice(0, 3).map(s => (
                  <Badge key={s} className="text-xs bg-primary/10 text-primary border-primary/20">{s}</Badge>
                ))}
                {(alert.skills || []).length > 3 && (
                  <Badge variant="secondary" className="text-xs">+{alert.skills.length - 3} more</Badge>
                )}
              </div>

              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/30">
                <span className={`inline-flex items-center gap-1 text-xs ${alert.notify_email ? "text-primary" : "text-muted-foreground"}`}>
                  <Mail className="w-3 h-3" /> Email {alert.notify_email ? "on" : "off"}
                </span>
                <span className={`inline-flex items-center gap-1 text-xs ${alert.notify_inapp ? "text-primary" : "text-muted-foreground"}`}>
                  <Bell className="w-3 h-3" /> In-app {alert.notify_inapp ? "on" : "off"}
                </span>
                {alert.is_active ? (
                  <span className="inline-flex items-center gap-1 text-xs text-chart-3 ml-auto">
                    <Wifi className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                    <WifiOff className="w-3 h-3" /> Paused
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        existing={editing}
      />
    </div>
  );
}