// backend/routes/staff/labRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { protect } from '../../middleware/authMiddleware';
import { supabase } from '../../db';

const router = Router();

// Extend the Request type for the user property (from authMiddleware)
interface AuthRequest extends Request {
  user?: { id: string; role: string; };
}

// --- INTERFACE DEFINITIONS (Used for Type Assertion) ---
interface PatientData {
    patient_id: number;
    name: string;
    blood_group: string;
}

interface TestRecord {
    test_id: number;
    test_name: string;
    normal_range: string;
    requested_by_doctor_id: number;
    Patient: PatientData[]; // Defined as an array to correctly type the Supabase join result
}

// Middleware to restrict access to only Staff (Lab Technician)
const restrictToLab = (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role?.toLowerCase();
    if (userRole !== 'staff') { 
        return res.status(403).json({ message: 'Access denied.' });
    }
    next();
};

// --- Helper function to safely extract Patient data from Supabase join result ---
const extractPatientData = (patientArray: PatientData[] | null) => {
    // Check if array exists, is an array, and has at least one element.
    if (patientArray && Array.isArray(patientArray) && patientArray.length > 0) {
        return patientArray[0];
    }
    return { patient_id: null, name: 'N/A', blood_group: 'N/A' };
};


// @route   GET /api/staff/lab/pending
// @desc    Get all lab tests that are still pending (for results submission)
// @access  Private (Staff Only)
router.get('/lab/pending', protect, restrictToLab, async (req: AuthRequest, res: Response) => {
    try {
        // Fetch pending tests and join with Patient table
        const { data: pendingTests, error } = await supabase
            .from('LabTests')
            .select(`
                test_id,
                test_name,
                normal_range,
                requested_by_doctor_id,
                Patient!inner(patient_id, name, blood_group)
            `)
            .eq('status', 'Pending')
            .order('test_id', { ascending: true }) as { data: TestRecord[] | null, error: any };

        if (error) throw error;

        // Flatten data for the frontend
        const formattedTests = (pendingTests || []).map(test => {
            const patient = extractPatientData(test.Patient);
            return {
                test_id: test.test_id,
                test_name: test.test_name,
                normal_range: test.normal_range,
                patient_name: patient.name,
                patient_id: patient.patient_id,
            };
        });

        res.status(200).json(formattedTests);
    } catch (err) {
        console.error('Pending Tests Fetch Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/staff/lab/result/:testId
// @desc    Update a lab test with the result and mark as completed
// @access  Private (Staff Only)
router.put('/lab/result/:testId', protect, restrictToLab, async (req: AuthRequest, res: Response) => {
    try {
        const testId = req.params.testId;
        const { resultValue, unit } = req.body;
        // In a real app, you would fetch staff_id from the Staff table using req.user.id
        const technicianId = 1; // Placeholder for logged-in technician ID

        const { data: updatedTest, error } = await supabase
            .from('LabTests')
            .update({
                result_value: resultValue,
                unit: unit,
                status: 'Completed',
                technician_id: technicianId,
            })
            .eq('test_id', testId)
            .select();

        if (error) throw error;

        res.status(200).json({ message: 'Test result submitted successfully', test: updatedTest[0] });
    } catch (err) {
        console.error('Test Result Update Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


// @route   GET /api/staff/lab/samples (For Sample Tracking Portal)
// @desc    Get all lab tests that are currently awaiting sample collection or processing
// @access  Private (Staff Only)
router.get('/lab/samples', protect, restrictToLab, async (req: AuthRequest, res: Response) => {
    try {
        const { data: pendingTests, error } = await supabase
            .from('LabTests')
            .select(`
                test_id,
                test_name,
                requested_by_doctor_id,
                Patient!inner(patient_id, name, blood_group)
            `)
            // Filters for 'Pending' status to show samples that need action
            .eq('status', 'Pending') 
            .order('test_id', { ascending: true }) as { data: TestRecord[] | null, error: any }; // Use TestRecord[] type

        if (error) throw error;

        // Flatten data for the frontend
        const formattedTests = (pendingTests || []).map(test => {
            const patient = extractPatientData(test.Patient);
            return {
                test_id: test.test_id,
                test_name: test.test_name,
                patient_name: patient.name,
                patient_id: patient.patient_id,
            };
        });

        res.status(200).json(formattedTests);
    } catch (err) {
        console.error('Pending Samples Fetch Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;