import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * checkJobAlerts — matches active job alerts against new jobs and sends notifications.
 * Scheduled daily via an automation. Admin-only if called manually.
 *
 * NOTE: Update YOUR_DOMAIN to your production domain when self-hosting.
 */

const YOUR_DOMAIN = "talentturbo.us";

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Allow scheduled invocation (no user) or admin user
  try {
    const user = await base44.auth.me();
    if (user && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
  } catch {
    // Called from automation (no auth token) — allow via service role
  }

  const svc = base44.asServiceRole;

  const alerts = await svc.entities.JobAlert.filter({ is_active: true });
  if (!alerts.length) return Response.json({ processed: 0 });

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const recentJobs = await svc.entities.Job.filter({ status: 'active' });
  const newJobs = recentJobs.filter(j => j.created_date >= since);

  if (!newJobs.length) return Response.json({ processed: 0, message: 'No new jobs in the last 24h' });

  let notified = 0;

  for (const alert of alerts) {
    const matched = newJobs.filter(job => {
      if (alert.keywords) {
        const kw = alert.keywords.toLowerCase();
        const inTitle = (job.title || '').toLowerCase().includes(kw);
        const inSkills = (job.skills || []).some(s => s.toLowerCase().includes(kw));
        if (!inTitle && !inSkills) return false;
      }
      if (alert.location) {
        if (!(job.location || '').toLowerCase().includes(alert.location.toLowerCase())) return false;
      }
      if (alert.work_mode && alert.work_mode !== 'all') {
        if (job.work_mode !== alert.work_mode) return false;
      }
      if (alert.job_type && alert.job_type !== 'all') {
        if (job.job_type !== alert.job_type) return false;
      }
      if (alert.experience_level && alert.experience_level !== 'all') {
        if (job.experience_level !== alert.experience_level) return false;
      }
      if (alert.salary_min && job.salary_max) {
        if (job.salary_max < alert.salary_min) return false;
      }
      if (alert.skills && alert.skills.length > 0) {
        const jobSkills = (job.skills || []).map(s => s.toLowerCase());
        if (!alert.skills.some(s => jobSkills.includes(s.toLowerCase()))) return false;
      }
      return true;
    });

    if (!matched.length) continue;

    const ownerEmail = alert.created_by;
    if (!ownerEmail) continue;

    for (const job of matched) {
      if (alert.notify_inapp !== false) {
        await svc.entities.Notification.create({
          user_email: ownerEmail,
          title: `New match: ${job.title}`,
          message: `${job.company} · ${job.location || 'Location not specified'} · Matches your "${alert.name}" alert`,
          type: 'job_alert',
          job_id: job.id,
          alert_id: alert.id,
          is_read: false,
        });
      }

      if (alert.notify_email !== false) {
        const salaryLine = job.salary_min
          ? `Salary: $${Number(job.salary_min).toLocaleString()} – $${Number(job.salary_max || job.salary_min).toLocaleString()}`
          : '';
        await svc.integrations.Core.SendEmail({
          to: ownerEmail,
          subject: `New job match: ${job.title} at ${job.company}`,
          body: `Hi there,\n\nA new job matching your "${alert.name}" alert was just posted:\n\nRole: ${job.title}\nCompany: ${job.company}\nLocation: ${job.location || 'Not specified'}\nType: ${job.job_type ? job.job_type.replace('_', ' ') : 'Not specified'}\n${salaryLine}\n\nView and apply: https://${YOUR_DOMAIN}/jobs/${job.id}\n\n—\nManage your alerts at https://${YOUR_DOMAIN}/dashboard`.trim(),
        });
      }

      notified++;
    }

    await svc.entities.JobAlert.update(alert.id, { last_notified_at: new Date().toISOString() });
  }

  return Response.json({ processed: alerts.length, notified });
});