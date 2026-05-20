import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Allow scheduled invocation (no user) or admin user
  let isScheduled = false;
  try {
    const user = await base44.auth.me();
    if (user && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
  } catch {
    // Called from automation (no auth token) — allow via service role
    isScheduled = true;
  }

  const svc = base44.asServiceRole;

  // Fetch all active alerts
  const alerts = await svc.entities.JobAlert.filter({ is_active: true });
  if (!alerts.length) return Response.json({ processed: 0 });

  // Fetch jobs posted in last 24 hours
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const recentJobs = await svc.entities.Job.filter({ status: 'active' });
  const newJobs = recentJobs.filter(j => j.created_date >= since);

  if (!newJobs.length) return Response.json({ processed: 0, message: 'No new jobs in the last 24h' });

  let notified = 0;

  for (const alert of alerts) {
    // Match jobs against this alert's criteria
    const matched = newJobs.filter(job => {
      // Keywords / title
      if (alert.keywords) {
        const kw = alert.keywords.toLowerCase();
        const inTitle = (job.title || '').toLowerCase().includes(kw);
        const inSkills = (job.skills || []).some(s => s.toLowerCase().includes(kw));
        if (!inTitle && !inSkills) return false;
      }
      // Location
      if (alert.location) {
        if (!(job.location || '').toLowerCase().includes(alert.location.toLowerCase())) return false;
      }
      // Work mode
      if (alert.work_mode && alert.work_mode !== 'all') {
        if (job.work_mode !== alert.work_mode) return false;
      }
      // Job type
      if (alert.job_type && alert.job_type !== 'all') {
        if (job.job_type !== alert.job_type) return false;
      }
      // Experience level
      if (alert.experience_level && alert.experience_level !== 'all') {
        if (job.experience_level !== alert.experience_level) return false;
      }
      // Salary min
      if (alert.salary_min && job.salary_max) {
        if (job.salary_max < alert.salary_min) return false;
      }
      // Skills
      if (alert.skills && alert.skills.length > 0) {
        const jobSkills = (job.skills || []).map(s => s.toLowerCase());
        const hasSkill = alert.skills.some(s => jobSkills.includes(s.toLowerCase()));
        if (!hasSkill) return false;
      }
      return true;
    });

    if (!matched.length) continue;

    // Get the alert owner's email from created_by
    const ownerEmail = alert.created_by;
    if (!ownerEmail) continue;

    for (const job of matched) {
      // Create in-app notification
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

      // Send email
      if (alert.notify_email !== false) {
        await svc.integrations.Core.SendEmail({
          to: ownerEmail,
          subject: `New job match: ${job.title} at ${job.company}`,
          body: `
Hi there,

A new job that matches your "${alert.name}" alert was just posted on TalentTurbo:

Role: ${job.title}
Company: ${job.company}
Location: ${job.location || 'Not specified'}
Type: ${job.job_type ? job.job_type.replace('_', ' ') : 'Not specified'}
${job.salary_min ? `Salary: $${job.salary_min.toLocaleString()} – $${(job.salary_max || job.salary_min).toLocaleString()}` : ''}

View and apply: https://talentturbo.us/jobs/${job.id}

—
TalentTurbo · Manage your alerts at https://talentturbo.us/dashboard
          `.trim(),
        });
      }

      notified++;
    }

    // Update last_notified_at
    await svc.entities.JobAlert.update(alert.id, { last_notified_at: new Date().toISOString() });
  }

  return Response.json({ processed: alerts.length, notified });
});