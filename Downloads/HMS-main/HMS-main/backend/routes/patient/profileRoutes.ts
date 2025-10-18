// backend/routes/patient/profileRoutes.ts
import { Router, Request, Response } from 'express';
import { protect } from '../../middleware/authMiddleware';
import { supabase } from '../../db';

const router = Router();


// @route   GET /api/patient/profile
// @desc    Get the profile of the authenticated patient
// @access  Private
router.get('/profile', protect, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { data: userProfile, error } = await supabase
      .from('User')
      .select(`
        user_id,
        name,
        email,
        role,
        Patient(
          patient_id,
          aadhaar_number,
          father_name,
          mother_name,
          additional_phone_number,
          blood_group,
          age,
          gender,
          street,
          city,
          district,
          state,
          country
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error) {
      throw error;
    }

    if (!userProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(userProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/patient/profile
// @desc    Update the profile of the authenticated patient
// @access  Private
router.put('/profile', protect, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const updatedData = req.body;

    // Use the `update` query to save changes to the Patient table
    const { data: updatedPatient, error } = await supabase
      .from('Patient')
      .update(updatedData)
      .eq('user_id', userId) // Find the patient record by user ID
      .select();

    if (error) {
      throw error;
    }

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient record not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', updatedPatient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;