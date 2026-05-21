import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import moment from "moment";

export default function NotificationBell({ userEmail }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", userEmail],
    queryFn: () => base44.entities.Notification.filter({ user_email: userEmail, is_read: false }, "-created_date", 20),
    enabled: !!userEmail,
    refetchInterval: 60000,
  });

  const unread = notifications.filter(n => !n.is_read).length;

  const markAllRead = async () => {
    for (const n of notifications.filter(n => !n.is_read)) {
      await base44.entities.Notification.update(n.id, { is_read: true });
    }
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-xl text-foreground/60 hover:text-foreground hover:bg-white/5 transition-all">
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full text-[10px] font-bold text-primary-foreground flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 bg-card border-border shadow-xl rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <p className="font-heading font-semibold text-sm">Notifications</p>
          {unread > 0 && (
            <button onClick={markAllRead} className="text-xs text-primary hover:underline">
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto divide-y divide-border/30">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No new notifications</p>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className={`px-4 py-3 hover:bg-muted/30 transition-colors ${!n.is_read ? "bg-primary/5" : ""}`}
              >
                {n.job_id ? (
                  <Link to={`/jobs/${n.job_id}`} onClick={() => { base44.entities.Notification.update(n.id, { is_read: true }); setOpen(false); queryClient.invalidateQueries({ queryKey: ["notifications"] }); }}>
                    <p className="text-sm font-medium text-foreground leading-snug">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{moment(n.created_date).fromNow()}</p>
                  </Link>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{moment(n.created_date).fromNow()}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <div className="px-4 py-2.5 border-t border-border/50">
          <Link to="/dashboard" onClick={() => setOpen(false)}>
            <p className="text-xs text-primary text-center hover:underline">View all alerts in Dashboard</p>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}