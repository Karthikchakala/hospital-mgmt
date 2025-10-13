// // backend/routes/doctor/profileRoutes.ts
// import { Router, Request, Response, NextFunction } from 'express';
// import { protect } from '../../middleware/authMiddleware';
// import { supabase } from '../../db';

// const router = Router();

// // Extend the Request type for the user property (assuming it's defined in middleware)
// interface AuthRequest extends Request {
//   user?: {
//     id: string;
//     role: string;
//   };
// }

// router.get('/test', (req, res) => {
//   res.json({ message: 'Doctor route working ✅' });
// });


// // --- GET PROFILE (READ) ---
// // @route   GET /api/doctor/profile
// // @desc    Get the profile of the authenticated doctor
// // @access  Private
// router.get('/profile', protect, async (req: AuthRequest, res: Response) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) {
//       return res.status(401).json({ message: 'User not authenticated' });
//     }

//     // CRITICAL FIX: Convert the string userId to a number for the database comparison
//     const numericUserId = parseInt(userId);
//     if (isNaN(numericUserId)) {
//         return res.status(400).json({ message: 'Invalid User ID format.' });
//     }

//     // Fetch data from both User and Doctor tables using a nested select (join)
//     const { data: doctorProfile, error } = await supabase
//       .from('User')
//       .select(`
//         user_id,
//         name,
//         email,
//         role,
//         Doctor(
//           doctor_id,
//           specialization,
//           license_number,
//           phone_number,
//           bio,
//           profile_picture_url,
//           education,
//           languages_spoken,
//           experience_years,
//           department_id
//         )
//       `)
//       .eq('user_id', numericUserId) // Use the converted numeric ID
//       .single();

//     if (error) {
//       console.error("Supabase Doctor Fetch Error:", error);
//       throw error;
//     }

//     if (!doctorProfile) {
//       return res.status(404).json({ message: 'Doctor profile not found' });
//     }

//     res.status(200).json(doctorProfile);
//   } catch (err: any) {
//     console.error('Doctor Profile GET Error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // --- UPDATE PROFILE (PUT) ---
// // @route   PUT /api/doctor/profile
// // @desc    Update the profile of the authenticated doctor (professional details only)
// // @access  Private
// router.put('/profile', protect, async (req: AuthRequest, res: Response) => {
//   res.json({message:"put route hit!"})
//   // try {
//   //   const userId = req.user?.id;
//   //   if (!userId) {
//   //     return res.status(401).json({ message: 'User not authenticated' });
//   //   }

//   //   // CRITICAL FIX: Convert the string userId to a number for the database comparison
//   //   const numericUserId = parseInt(userId);
//   //   if (isNaN(numericUserId)) {
//   //       return res.status(400).json({ message: 'Invalid User ID format.' });
//   //   }

//   //   // The frontend sends the Doctor-specific data in the body
//   //   const updatedData = req.body;

//   //   // Use the `update` query on the Doctor table
//   //   const { data: updatedDoctor, error } = await supabase
//   //     .from('Doctor')
//   //     .update(updatedData)
//   //     .eq('user_id', numericUserId) // Use the converted numeric ID for update query
//   //     .select();

//   //   if (error) {
//   //     console.error("Supabase Doctor Update Error:", error);
//   //     throw error;
//   //   }

//   //   if (!updatedDoctor || updatedDoctor.length === 0) {
//   //     return res.status(404).json({ message: 'Doctor record not found or no changes made' });
//   //   }

//   //   // NOTE: The update query only returns the Doctor record; name/email update is not done here.
//   //   res.status(200).json({ message: 'Profile updated successfully', updatedDoctor: updatedDoctor[0] });
//   // } catch (err: any) {
//   //   console.error('Update request handler error:', err);
//   //   res.status(500).json({ message: 'Server error' });
//   // }
// });

// export default router;


// backend/routes/doctor/profileRoutes.ts
import { Router, Request, Response } from 'express';
import { protect } from '../../middleware/authMiddleware';
import { supabase } from '../../db';

const router = Router();

// Extend the Request type for TypeScript
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// --- TEST ROUTE ---
router.get('/test', (req, res) => {
  res.json({ message: 'Doctor route working ✅' });
});

// --- GET PROFILE (READ) ---
// @route   GET /api/doctor/profile
// @desc    Get the profile of the authenticated doctor
// @access  Private
router.get('/profile', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'User not authenticated' });

    const numericUserId = parseInt(userId);
    if (isNaN(numericUserId)) return res.status(400).json({ message: 'Invalid User ID format' });

    // Fetch doctor profile from User + Doctor tables
    const { data: doctorProfile, error } = await supabase
      .from('User')
      .select(`
        user_id,
        name,
        email,
        role,
        Doctor(
          doctor_id,
          specialization,
          license_number,
          phone_number,
          bio,
          profile_picture_url,
          education,
          languages_spoken,
          experience_years,
          department_id
        )
      `)
      .eq('user_id', numericUserId)
      .single();

    if (error) {
      console.error('Supabase Doctor Fetch Error:', error);
      return res.status(500).json({ message: 'Failed to fetch profile', error });
    }

    if (!doctorProfile) return res.status(404).json({ message: 'Doctor profile not found' });

    res.status(200).json(doctorProfile);
  } catch (err: any) {
    console.error('Doctor Profile GET Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- UPDATE PROFILE (PUT / UPSERT) ---
// @route   PUT /api/doctor/profile
// @desc    Update the profile of the authenticated doctor
// @access  Private
router.put('/profile', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'User not authenticated' });

    const numericUserId = parseInt(userId);
    if (isNaN(numericUserId)) return res.status(400).json({ message: 'Invalid User ID format' });

    const updatedData = req.body;

    // console.log('PUT /profile hit');
    // console.log('JWT userId:', numericUserId);
    // console.log('Request body:', updatedData);

    // UPSERT: creates row if not exists, updates if exists
    const { data: updatedDoctor, error } = await supabase
      .from('Doctor')
      .upsert({ user_id: numericUserId, ...updatedData })
      .select();

    if (error) {
      // console.error('Supabase Doctor Upsert Error:', error);
      return res.status(500).json({ message: 'Failed to update profile', error });
    }

    if (!updatedDoctor || updatedDoctor.length === 0) {
      return res.status(404).json({ message: 'Doctor record not found or no changes made' });
    }

    res.status(200).json({ message: 'Profile updated successfully', updatedDoctor: updatedDoctor[0] });
  } catch (err: any) {
    // console.error('Doctor Profile PUT Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

