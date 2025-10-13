// backend/routes/doctor/appointmentRoutes.ts
import { Router, Request, Response } from 'express';
import { protect } from '../../middleware/authMiddleware';
import { supabase } from '../../db';

const router = Router();

// Define a type for the authenticated request user
// Assuming this is defined globally or imported, but repeated here for clarity
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// @route   GET /api/doctor/appointments
// @desc    Get all appointments for the authenticated doctor
// @access  Private
router.get('/appointments', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // 1. Find the doctor_id from the Doctor table using the user_id
    const { data: doctorRecord, error: doctorError } = await supabase
      .from('Doctor')
      .select('doctor_id')
      .eq('user_id', userId)
      .single();

    if (doctorError || !doctorRecord) {
    console.log(doctorError)
    console.log(doctorRecord)
      return res.status(404).json({ message: 'Doctor record not found. Please complete your profile.' });
    }
    
    const doctorId = doctorRecord.doctor_id;

    // 2. Fetch appointments using the doctor_id and join with Patient table to get the name
    const { data: appointments, error } = await supabase
      .from('Appointments')
      .select(`
        appointment_id,
        appointment_date,
        appointment_time,
        reason,
        status,
        Patient!inner (name) 
      `)
      .eq('doctor_id', doctorId)
      .order('appointment_date', { ascending: true });

    if (error) {
      console.error("Supabase Appointment Fetch Error:", error);
      throw error;
    }

    res.status(200).json(appointments);
  } catch (err) {
    console.error('Doctor Appointments Request Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/doctor/patients
// @desc    Get all patients assigned to the authenticated doctor
// @access  Private
router.get('/patients', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // 1. Find the doctor_id from the Doctor table
    const { data: doctorRecord, error: doctorError } = await supabase
      .from('Doctor')
      .select('doctor_id')
      .eq('user_id', userId)
      .single();

    if (doctorError || !doctorRecord) {
      return res.status(404).json({ message: 'Doctor record not found.' });
    }
    
    const doctorId = doctorRecord.doctor_id;

    // 2. Fetch all unique patients associated with this doctor's appointments
    const { data: patientAppointments, error: apptError } = await supabase
      .from('Appointments')
      .select(`
        patient_id,
        Patient!inner (name, blood_group, age)
      `)
      .eq('doctor_id', doctorId)
      .not('status', 'eq', 'Canceled');

    if (apptError) {
      console.error("Supabase Patient Fetch Error:", apptError);
      throw apptError;
    }

    // 3. Extract unique patient records
    const uniquePatientsMap = new Map();
    patientAppointments.forEach((appt: any) => {
      if (appt.Patient) {
        uniquePatientsMap.set(appt.patient_id, {
            patient_id: appt.patient_id,
            name: appt.Patient.name,
            blood_group: appt.Patient.blood_group,
            age: appt.Patient.age
        });
      }
    });
    
    const patients = Array.from(uniquePatientsMap.values());

    res.status(200).json(patients);
  } catch (err) {
    console.error('Doctor Patients List Request Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;