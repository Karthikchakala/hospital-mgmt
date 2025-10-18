// backend/routes/staff/dailyAppointmentsRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { protect } from '../../middleware/authMiddleware';
import { supabase } from '../../db';

const router = Router();

interface AuthRequest extends Request { user?: { id: string; role: string; }; }

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
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

        // Fetch all appointments for today, joining Patient and Doctor names
        const { data: appointments, error } = await supabase
            .from('Appointments')
            .select(`
                appointment_id,
                appointment_time,
                reason,
                status,
                Patient!inner(name),
                Doctor!inner(User(name)) // Join Doctor's User table for name
            `)
            .eq('appointment_date', today)
            .neq('status', 'Canceled') // Exclude canceled appointments
            .order('appointment_time', { ascending: true }); // Order by time

        if (error) throw error;
        
        // Flatten and format data for the frontend
        const formattedAppts = (appointments as any[] || []).map(appt => ({
            id: appt.appointment_id,
            time: appt.appointment_time,
            patientName: appt.Patient.name,
            doctorName: appt.Doctor.User[0].name, // Safe access: assumes doctor and user exist due to !inner join
            reason: appt.reason,
            status: appt.status,
        }));

        res.status(200).json(formattedAppts);
    } catch (err: any) {
        console.error('Daily Appointments Fetch Error:', err);
        res.status(500).json({ message: 'Failed to fetch appointments.' });
    }
});

export default router;