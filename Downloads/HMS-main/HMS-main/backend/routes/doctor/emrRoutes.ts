// // backend/routes/doctor/emrRoutes.ts
// import { Router, Request, Response } from 'express';
// import { protect } from '../../middleware/authMiddleware';
// import { supabase } from '../../db';

// const router = Router();

// interface AuthRequest extends Request { user?: { id: string; role: string; }; }

// // Helper to look up ID
// const getDoctorId = async (userId: string) => {
//     const numericUserId = parseInt(userId);
//     const { data } = await supabase.from('Doctor').select('doctor_id').eq('user_id', numericUserId).single();
//     return data?.doctor_id;
// };

// // @route   POST /api/doctor/emr
// // @desc    Creates a new EMR record and links the uploaded document(s)
// // @access  Private (Doctor Only)
// router.post('/emr', protect, async (req: AuthRequest, res: Response) => {
//     const { 
//         patientId, diagnosis, prescriptions, notes, 
//         uploadedDocument // Metadata from the successful Cloudinary upload
//     } = req.body;
    
//     try {
//         const userId = req.user?.id;
//         const doctorId = userId ? await getDoctorId(userId) : null;

//         if (!doctorId) {
//             return res.status(403).json({ message: 'Doctor ID not found. Cannot create EMR.' });
//         }

//         // Construct the file_links JSONB object
//         const file_links = uploadedDocument ? [
//             {
//                 type: 'DoctorNote',
//                 url: uploadedDocument.url,
//                 public_id: uploadedDocument.public_id,
//                 uploaded_at: new Date().toISOString()
//             }
//         ] : [];
        
//         // Insert data into the EMR table
//         const { data: newEMR, error } = await supabase
//             .from('EMR')
//             .insert([{
//                 patient_id: patientId,
//                 doctor_id: doctorId,
//                 visit_date: new Date().toISOString(),
//                 diagnosis,
//                 prescriptions,
//                 notes,
//                 file_links: file_links, // Insert the JSONB array
//             }])
//             .select();

//         if (error) throw error;
//         res.status(201).json({ message: 'EMR created and document linked successfully', record: newEMR[0] });

//     } catch (err: any) {
//         console.error('EMR Post Error:', err);
//         res.status(500).json({ message: 'Failed to create EMR. Check database and input fields.' });
//     }
// });

// export default router;

// backend/routes/doctor/doctorEmrRoutes.ts
import { Router, Request, Response } from 'express';
import { protect } from '../../middleware/authMiddleware';
import { supabase } from '../../db';

const router = Router();

interface AuthRequest extends Request { user?: { id: string; role: string; }; }

// Helper to look up Doctor ID
const getDoctorId = async (userId: string) => {
    const numericUserId = parseInt(userId);
    const { data } = await supabase.from('Doctor').select('doctor_id').eq('user_id', numericUserId).single();
    return data?.doctor_id;
};

// --- EMR Record Interfaces (For Type Assertion) ---
interface DoctorUser { name: string; }
interface DoctorData { User: DoctorUser[]; }
interface RawEMRRecord {
    record_id: number;
    visit_date: string;
    diagnosis: string;
    prescriptions: string;
    notes: string;
    file_links: any; 
    Doctor: DoctorData;
    Patient: { name: string };
}
// ----------------------------------------------------


// @route   POST /api/doctor/emr
// @desc    Creates a new EMR record and links the uploaded document(s)
// @access  Private (Doctor Only)
// router.post('/emr', protect, async (req: AuthRequest, res: Response) => {
//     const { 
//         patientId, diagnosis, prescriptions, notes, 
//         uploadedDocument // Metadata from the successful Cloudinary upload
//     } = req.body;
    
//     try {
//         const userId = req.user?.id;
//         // CRITICAL: Get doctorId from user ID
//         const doctorId = userId ? await getDoctorId(userId) : null; 

//         if (!doctorId) {
//             return res.status(403).json({ message: 'Doctor ID not found. Cannot create EMR.' });
//         }
//         if (!patientId) {
//             return res.status(400).json({ message: 'Patient ID is required.' });
//         }

//         // 1. Construct the file_links JSONB object
//         const file_links = uploadedDocument ? [
//             {
//                 type: 'DoctorNote',
//                 url: uploadedDocument.url,
//                 public_id: uploadedDocument.public_id,
//                 uploaded_at: new Date().toISOString()
//             }
//         ] : [];
        
//         // 2. Insert data into the EMR table
//         const { data: newEMR, error } = await supabase
//             .from('EMR')
//             .insert([{
//                 patient_id: patientId,
//                 doctor_id: doctorId,
//                 visit_date: new Date().toISOString(),
//                 diagnosis,
//                 prescriptions,
//                 notes,
//                 file_links: file_links, // Insert the JSONB array
//             }])
//             .select();

//         if (error) throw error;
//         res.status(201).json({ message: 'EMR created and document linked successfully', record: newEMR[0] });

//     } catch (err: any) {
//         console.error('EMR Post Error:', err);
//         res.status(500).json({ message: 'Failed to create EMR. Check database and input fields.' });
//     }
// });

router.post('/emr', protect, async (req: Request, res: Response) => {
    const { 
        patientId, doctorId, diagnosis, prescriptions, notes, 
        uploadedDocument,
        labRequests // Array of test requests: [{ testId: 1, ... }, ...]
    } = req.body;
    
    try {
        // ... (Existing logic for user check, EMR insert, etc.)
        
        // --- CRITICAL FIX: INSERT INTO LABTESTS TABLE ---
        if (labRequests && labRequests.length > 0) {
            
            // Get numeric IDs for insertion safety
            
            const numericPatientId = parseInt(patientId);
            const numericDoctorId = doctorId; 

            const labTestsToInsert = labRequests.map((req: any) => ({
                // CRITICAL FIX: Use the Foreign Key ID from the catalog
                test_catalog_id: parseInt(req.testId), 
                
                // Foreign Keys
                patient_id: numericPatientId,
                requested_by_doctor_id: numericDoctorId,
                
                // Status
                status: 'Pending', 
            }));

            const { error: labError } = await supabase
                .from('LabTests')
                .insert(labTestsToInsert);
            
            if (labError) throw labError;
        }

        res.status(201).json({ message: 'EMR created and lab requests placed successfully' });

    } catch (error: any) {
        // ... (Error handling)
    }
});


// --- NEW: FETCH SINGLE PATIENT'S EMR RECORDS ---
// @route   GET /api/doctor/patient-emrs/:patientId
// @desc    Get all EMR records for a specific patient, limited to the logged-in doctor
// @access  Private (Doctor Only)
router.get('/patient-emrs/:patientId', protect, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const patientId = req.params.patientId; // Patient ID from URL parameter
        
        if (!userId || !patientId) return res.status(400).json({ message: 'Missing user or patient ID.' });

        const doctorId = await getDoctorId(userId);

        if (!doctorId) {
            return res.status(403).json({ message: 'Doctor ID not found.' });
        }

        // Fetch EMRs: Select records only if the patient and doctor IDs match (for security)
        const { data: records, error } = await supabase
            .from('EMR')
            .select(`
                record_id,
                visit_date,
                diagnosis,
                prescriptions,
                notes,
                file_links,
                Doctor(User(name)),
                Patient(name, patient_id)
            `)
            .eq('patient_id', patientId)
            .eq('doctor_id', doctorId) // CRITICAL: Restricts visibility to this doctor
            .order('visit_date', { ascending: false }) as { data: RawEMRRecord[] | null, error: any };

        if (error) throw error;
        
        // Format the data for the frontend
        const formattedRecords = (records || []).map((record: any) => ({
            ...record,
            // Safely extract names from nested joins
            doctor_name: record.Doctor?.User[0]?.name || 'N/A',
            patient_name: record.Patient?.name,
            file_links: record.file_links || [], 
        }));

        res.status(200).json(formattedRecords);

    } catch (err: any) {
        console.error('Doctor Patient EMRs GET Error:', err);
        res.status(500).json({ message: 'Failed to fetch patient records.' });
    }
});


export default router;