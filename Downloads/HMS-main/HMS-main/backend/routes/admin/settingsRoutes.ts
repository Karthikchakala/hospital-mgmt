// backend/routes/admin/settingsRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { protect } from '../../middleware/authMiddleware';
import { supabase } from '../../db';

const router = Router();

interface AuthRequest extends Request {
  user?: { id: string; role: string; };
}

// Middleware to ensure only Admins can access these routes
const restrictToAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Must be an Admin' });
    }
    next();
};

// --- GET ALL SETTINGS (READ) ---
router.get('/settings', protect, restrictToAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { data: settings, error } = await supabase
            .from('Settings')
            .select('*')
            .limit(1) // CRITICAL: Gets the single settings row
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
            throw error;
        }
        
        if (!settings) {
            // If no settings found, return an error (or a defined default set)
            return res.status(404).json({ message: 'Settings record not found.' });
        }

        res.status(200).json(settings);
    } catch (err: any) {
        console.error('Settings GET Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- UPDATE SETTINGS (PUT) ---
router.put('/settings', protect, restrictToAdmin, async (req: Request, res: Response) => {
    try {
        const updatedData = req.body;

        const { data: updatedSettings, error } = await supabase
            .from('Settings')
            .update(updatedData)
            .limit(1) // CRITICAL: Updates the single settings row
            .select();

        if (error) throw error;
        if (!updatedSettings || updatedSettings.length === 0) {
             return res.status(404).json({ message: 'Settings record not found.' });
        }

        res.status(200).json({ message: 'Settings updated successfully', settings: updatedSettings[0] });
    } catch (err: any) {
        console.error('Settings PUT Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;