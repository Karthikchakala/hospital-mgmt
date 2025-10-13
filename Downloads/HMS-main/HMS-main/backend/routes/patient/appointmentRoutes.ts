// backend/routes/patient/appointmentRoutes.ts
import { Router, Request, Response } from 'express';
import { protect } from '../../middleware/authMiddleware';
import { supabase } from '../../db';

const router = Router();

// Extend the Request type for the user property (from authMiddleware)
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// @route   GET /api/patient/appointments/departments
// @desc    Get all available departments for appointment booking
// @access  Private
router.get('/appointments/departments', protect, async (req: Request, res: Response) => {
  try {
    const { data: departments, error } = await supabase
      .from('Departments')
      .select('department_id, name');

    if (error) {
      throw error;
    }

    res.status(200).json(departments);
  } catch (err: any) {
    console.error('Departments GET Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/patient/appointments/doctors/:departmentId
// @desc    Get doctors within a specific department
// @access  Private
router.get('/appointments/doctors/:departmentId', protect, async (req: Request, res: Response) => {
  try {
    const departmentId = req.params.departmentId;

    const { data: doctors, error } = await supabase
      .from('Doctor')
      .select(`
        doctor_id,
        specialization,
        User(name)
      `)
      .eq('department_id', departmentId);

    if (error) {
      throw error;
    }

    res.status(200).json(doctors);
  } catch (err: any) {
    console.error('Doctors GET Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/patient/appointments/times/:doctorId/:date
// @desc    Get available time slots and price for a specific doctor on a given date
// @access  Private
router.get('/appointments/times/:doctorId/:date', protect, async (req: Request, res: Response) => {
  try {
    const mockTimeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00'];
    const mockPrice = 300; 

    res.status(200).json({ timeSlots: mockTimeSlots, price: mockPrice });
  } catch (err: any) {
    console.error('Times GET Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/patient/appointments
// @desc    Book a new appointment
// @access  Private
router.post('/appointments', protect, async (req: AuthRequest, res: Response) => {
    try {
        const { doctorId, appointmentDate, appointmentTime, reason } = req.body;
        const userId = req.user?.id; // This is the user_id from the JWT

        if (!userId || !doctorId || !appointmentDate || !appointmentTime || !reason) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // CRITICAL FIX: Convert user_id to numeric type for database comparison
        const numericUserId = parseInt(userId);
        if (isNaN(numericUserId)) {
            return res.status(400).json({ message: 'Invalid User ID format.' });
        }

        // 1. LOOKUP: Find the patient_id (Primary Key) from the Patient table using the user_id (Foreign Key)
        const { data: patientRecord, error: patientError } = await supabase
            .from('Patient')
            .select('patient_id') // <-- Fetch the correct PK
            .eq('user_id', numericUserId)
            .single();

        if (patientError || !patientRecord) {
            // If the patient record doesn't exist, we cannot book the appointment
            return res.status(404).json({ message: 'Patient record not found. Cannot book appointment.' });
        }

        const patientId = patientRecord.patient_id; // <-- CORRECT patient_id IS NOW USED

        // 2. INSERT: Book the new appointment using the correct patient_id
        const { data, error: apptError } = await supabase
            .from('Appointments')
            .insert([
                {
                    patient_id: patientId, // Using the correct PK from Patient table
                    doctor_id: doctorId,
                    appointment_date: appointmentDate,
                    appointment_time: appointmentTime,
                    reason: reason,
                    status: 'Scheduled', // Default status for a new appointment
                },
            ])
            .select();

        if (apptError) {
            throw apptError;
        }

        res.status(201).json({ message: 'Appointment booked successfully', appointment: data[0] });
    } catch (err: any) {
        console.error('Appointment POST Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;