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

// @route   GET /api/admin/tickets
// @desc    Get all support tickets and feedback from all users
// @access  Private (Admin Only)
router.get('/tickets', protect, restrictToAdmin, async (req: AuthRequest, res: Response) => {
    try {
        // 1. Fetch Support Tickets (Urgent Issues)
        const { data: tickets, error: ticketError } = await supabase
            .from('SupportTickets')
            .select(`
                ticket_id,
                type,
                description,
                status,
                timestamp,
                User!inner(name, email)
            `)
            .order('timestamp', { ascending: false });

        if (ticketError) throw ticketError;

        // 2. Fetch General Feedback (Suggestions)
        const { data: feedback, error: feedbackError } = await supabase
            .from('Feedback')
            .select(`
                feedback_id,
                subject,
                comments,
                timestamp,
                User!inner(name, email)
            `)
            .order('timestamp', { ascending: false });

        if (feedbackError) throw feedbackError;

        // 3. Format and combine the data for frontend display
        const combinedData = [
            // Map Support Tickets
            ...(tickets || []).map((t: any) => ({
                id: t.ticket_id,
                type: 'Support Ticket',
                subject: `${t.type} (Status: ${t.status})`,
                content: t.description,
                submitter: t.User?.[0]?.name || 'Deleted User',
                email: t.User?.[0]?.email || 'N/A',
                timestamp: t.timestamp,
                status: t.status,
                isUrgent: true,
            })),
            // Map General Feedback
            ...(feedback || []).map((f: any) => ({
                id: f.feedback_id,
                type: 'Feedback',
                subject: f.subject,
                content: f.comments,
                submitter: f.User?.[0]?.name || 'Deleted User',
                email: f.User?.[0]?.email || 'N/A',
                timestamp: f.timestamp,
                status: 'Closed', // Assuming feedback is "closed" upon review
                isUrgent: false,
            })),
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Sort by newest first

        res.status(200).json(combinedData);

    } catch (err: any) {
        console.error('Admin Ticket/Feedback Fetch Error:', err);
        res.status(500).json({ message: 'Failed to fetch tickets/feedback.' });
    }
});

export default router;