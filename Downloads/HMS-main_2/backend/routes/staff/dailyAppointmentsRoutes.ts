// // backend/routes/staff/dailyAppointmentsRoutes.ts

import { Router, Request, Response, NextFunction } from 'express';
import { protect } from '../../middleware/authMiddleware';
import { supabase } from '../../db';

const router = Router();

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// Middleware to restrict access to Staff roles (Receptionists)
const restrictToStaff = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'staff') {
    return res.status(403).json({ message: 'Access denied: Must be Staff.' });
  }
  next();
};

// @route   GET /api/staff/appointments/today
// @desc    Get all scheduled appointments for the current day across the hospital
// @access  Private (Staff Only)
router.get('/appointments/today', protect, restrictToStaff, async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: appointments, error } = await supabase
      .from('Appointments')
      .select(`
        appointment_id,
        appointment_time,
        reason,
        status,
        appointment_date,
        Patient:patient_id (
          patient_id,
          user_id,
          User:user_id (
            name
          )
        ),
        Doctor:doctor_id (
          doctor_id,
          user_id,
          User:user_id (
            name
          )
        )
      `)
      .eq('appointment_date', today)
      .neq('status', 'Canceled')
      .order('appointment_time', { ascending: true });

    if (error) {
      console.error('Supabase Appointments Fetch Error:', error);
      throw error;
    }

    console.log(JSON.stringify(appointments, null, 2));

    const formattedAppts = (appointments as any[] || []).map((appt: any) => {
      
      const patientName = appt.Patient?.User?.name || 'N/A';
      const doctorName = appt.Doctor?.User?.name || 'N/A';

      return {
        id: appt.appointment_id,
        time: appt.appointment_time,
        patientName,
        doctorName,
        reason: appt.reason,
        status: appt.status,
      };
    });

    res.status(200).json(formattedAppts);
  } catch (err: any) {
    console.error('Daily Appointments Fetch Error:', err);
    res.status(500).json({ message: 'Failed to fetch appointments.' });
  }
});

export default router;
