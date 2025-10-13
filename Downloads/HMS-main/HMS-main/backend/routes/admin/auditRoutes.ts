// backend/routes/admin/auditRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
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

// Middleware to ensure only Admins can access these routes
const restrictToAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role?.toLowerCase();

    if (userRole !== 'admin') {
        console.warn(`ACCESS DENIED: User ID ${req.user?.id} attempted to access Audit Logs with role: ${req.user?.role}`);
        return res.status(403).json({ message: 'Access denied: Must be an Admin' });
    }
    next();
};

// @route   GET /api/admin/logs
// @desc    Get all audit/login logs for review
// @access  Private (Admin Only)
router.get('/logs', protect, restrictToAdmin, async (req: AuthRequest, res: Response) => {
    try {
        // Fetch all logs, joining with the User table to display the user's name (optional join)
        const { data: logs, error } = await supabase
            .from('AuditLogs')
            // NOTE: We select all columns from AuditLogs
            .select(`*`) 
            .order('timestamp', { ascending: false }); // Show newest entries first

        if (error) throw error;

        // In a complex app, you would fetch user names separately if needed for display.
        // For now, we rely on the user_id stored in the log.

        res.status(200).json(logs);
    } catch (err: any) {
        console.error('Audit Logs GET Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;