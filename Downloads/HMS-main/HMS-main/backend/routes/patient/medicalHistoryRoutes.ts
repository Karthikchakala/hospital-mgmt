// backend/routes/patient/medicalHistoryRoutes.ts
import { Router, Request, Response } from 'express';
import { protect } from '../../middleware/authMiddleware';
import { supabase } from '../../db';

const router = Router();

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// --- INTERFACE DEFINITIONS ---
interface DoctorUser {
  name: string;
}

interface DoctorData {
  User?: DoctorUser[]; // optional because join can return null
}

interface RawEMRRecord {
  record_id: number;
  visit_date: string;
  diagnosis: string;
  prescriptions: string;
  notes: string;
  file_links: any; // JSONB field
  Doctor?: DoctorData; // optional because join can return null
}
// ----------------------------------------------------

// --- Helper function to safely extract Doctor Name ---
const extractDoctorName = (doctorData?: DoctorData): string => {
  const doctorUserArray = doctorData?.User;
  if (doctorUserArray && doctorUserArray.length > 0) {
    return doctorUserArray[0].name;
  }
  return 'N/A';
};

// @route   GET /api/patient/history
// @desc    Get all EMR records for the authenticated patient
// @access  Private
router.get('/history', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'User not authenticated' });

    // 1. Get the patient_id
    const numericUserId = parseInt(userId);
    const { data: patientRecord, error: patientError } = await supabase
      .from('Patient')
      .select('patient_id')
      .eq('user_id', numericUserId)
      .single();

    if (patientError || !patientRecord) {
      return res.status(404).json({ message: 'Patient record not found.' });
    }

    const patientId = patientRecord.patient_id;

    // 2. Fetch all EMRs
const { data: records, error } = (await supabase
  .from('EMR')
  .select(`
      record_id,
      visit_date,
      diagnosis,
      prescriptions,
      notes,
      file_links,
      Doctor(User(name))
  `)
  .eq('patient_id', patientId)
  .order('visit_date', { ascending: false })) as {
    data: RawEMRRecord[] | null;
    error: any;
  };


    if (error) throw error;

    // 3. Flatten the doctor's name into the main record object
    const formattedRecords = (records || []).map((record) => ({
      ...record,
      doctor_name: extractDoctorName(record.Doctor),
    }));

    res.status(200).json(formattedRecords);
  } catch (err: any) {
    console.error('EMR GET Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
