import cron from 'node-cron';
import { supabase } from '../db';
import { sendMail } from '../mailer/transport';

function toDateTime(dateStr: string, timeStr: string) {
  // dateStr: YYYY-MM-DD, timeStr: HH:mm:ss or HH:mm
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mm, ss] = timeStr.split(':').map(Number);
  const dt = new Date(y, (m - 1), d, hh || 0, mm || 0, ss || 0, 0);
  return dt;
}

export function startAppointmentReminderJob() {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const in60 = new Date(now.getTime() + 60 * 60 * 1000);

      // Fetch appointments with reminder_sent=false for today (and possibly tomorrow edge)
      const todayStr = now.toISOString().slice(0, 10);
      const tomorrowStr = new Date(now.getTime() + 24*60*60*1000).toISOString().slice(0, 10);

      const { data: appts, error } = await supabase
        .from('Appointments')
        .select('appointment_id, patient_id, doctor_id, appointment_date, appointment_time, remainder_sent, Patient(User(name,email)), Doctor(User(name))')
        .in('appointment_date', [todayStr, tomorrowStr])
        .eq('remainder_sent', false);

      if (error) {
        console.error('[ReminderJob] fetch error', error.message);
        return;
      }

      const list = (appts || []);

      for (const appt of list as any[]) {
        const visitDate: string = appt.visit_date;
        const apptTime: string = appt.appointment_time;
        if (!visitDate || !apptTime) continue;

        const startAt = toDateTime(visitDate, apptTime);
        const diffMs = startAt.getTime() - now.getTime();
        if (diffMs <= 60 * 60 * 1000 && diffMs > 0) {
          const to = appt.Patient?.User?.[0]?.email;
          const patientName = appt.Patient?.User?.[0]?.name || 'Patient';
          const doctorName = appt.Doctor?.User?.[0]?.name || 'Doctor';

          if (!to) {
            console.warn(`[ReminderJob] No email for patient_id=${appt.patient_id}, skipping`);
          } else {
            const when = startAt.toLocaleString();
            const html = `
              <div style="font-family:Arial,Helvetica,sans-serif">
                <h2>Appointment Reminder</h2>
                <p>Dear ${patientName},</p>
                <p>This is a reminder for your appointment in approximately 1 hour.</p>
                <ul>
                  <li><b>Doctor:</b> ${doctorName}</li>
                  <li><b>Date & Time:</b> ${when}</li>
                </ul>
                <p>Please arrive atleast 15 minutes early.</p>
                <p>— Hospify</p>
              </div>`;
            try {
              await sendMail({ to, subject: 'Appointment reminder (in 1 hour)', html });
              await supabase.from('Appointments').update({ reminder_sent: true }).eq('appointment_id', appt.appointment_id);
              console.log(`[ReminderJob] Reminder sent for appointment_id=${appt.appointment_id}`);
            } catch (e:any) {
              console.error('[ReminderJob] sendMail failed', e?.message || e);
            }
          }
        }
      }
    } catch (e:any) {
      console.error('[ReminderJob] Unhandled error', e?.message || e);
    }
  });
}
