// backend/routes/patient/billingRoutes.ts
import { Router, Request, Response } from 'express';
import { protect } from '../../middleware/authMiddleware';
import { supabase } from '../../db';

const router = Router();

interface AuthRequest extends Request { user?: { id: string; role: string; }; }

// @route   GET /api/patient/bills
// @desc    Get all billing records for the authenticated patient
// @access  Private
router.get('/bills', protect, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'User not authenticated' });

        // 1. Get the patient_id from the Patient table
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

        // 2. Fetch all bills for that patient_id
        const { data: bills, error } = await supabase
            .from('Billing')
            .select('*')
            .eq('patient_id', patientId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json(bills);
    } catch (err: any) {
        console.error('Billing GET Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;