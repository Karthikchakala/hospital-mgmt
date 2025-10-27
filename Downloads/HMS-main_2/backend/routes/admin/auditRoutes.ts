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
        const { data: logs, error } = await supabase
            .from('AuditLogs')
            .select(`*`) 
            .order('timestamp', { ascending: false });

        if (error) throw error;

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

        const combinedData = [

            ...(tickets || []).map((t: any) => {
                const user = Array.isArray(t.User) ? t.User[0] : t.User;
                const submitterName = user?.name || 'Deleted User';
                const submitterEmail = user?.email || 'N/A';

                return {
                    id: t.ticket_id,
                    type: 'Support Ticket',
                    subject: `${t.type} (Status: ${t.status})`,
                    content: t.description,
                    submitter: submitterName,
                    email: submitterEmail,
                    timestamp: t.timestamp,
                    status: t.status,
                    isUrgent: true,
                };
            }),
            ...(feedback || []).map((f: any) => {
                const user = Array.isArray(f.User) ? f.User[0] : f.User;
                const submitterName = user?.name || 'Deleted User';
                const submitterEmail = user?.email || 'N/A';

                return {
                    id: f.feedback_id,
                    type: 'Feedback',
                    subject: f.subject,
                    content: f.comments,
                    submitter: submitterName,
                    email: submitterEmail,
                    timestamp: f.timestamp,
                    status: 'Closed',
                    isUrgent: false,
                };
            }),
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Sort by newest first

        res.status(200).json(combinedData);

    } catch (err: any) {
        console.error('Admin Ticket/Feedback Fetch Error:', err);
        res.status(500).json({ message: 'Failed to fetch tickets/feedback.' });
    }
});

// @route   GET /api/admin/stats
// @desc    Get key hospital statistics for the Admin dashboard
// @access  Private (Admin Only)
router.get('/stats', protect, restrictToAdmin, async (req: AuthRequest, res: Response) => {
    try {

        const { data: doctors, error: docError } = await supabase
        .from('User')
        .select('user_id')
        .eq('role', 'doctor');
        if (docError) throw docError;
        const totalDoctors = doctors?.length || 0;

        const { data: patients, error: patientError } = await supabase
        .from('User')
        .select('user_id')
        .eq('role', 'patient');
        if (patientError) throw patientError;
        const totalPatients = patients?.length || 0;

        const { data: staff, error: staffError } = await supabase
        .from('User')
        .select('user_id')
        .in('role', ['admin', 'staff']);
        if (staffError) throw staffError;
        const totalStaff = staff?.length || 0;

        const { data: incomeData, error: incomeError } = await supabase
            .from('Billing')   
            .select('total_amount,status')
            .eq('status', 'Paid'); 
        
        if (incomeError) throw incomeError;

        const incomeGenerated = incomeData.reduce((sum, payment) => sum + (payment.total_amount || 0), 0);

        res.status(200).json({
            totalDoctors: totalDoctors || 0,
            totalPatients: totalPatients || 0,
            totalStaff: totalStaff || 0, 
            incomeGenerated: parseFloat(incomeGenerated.toFixed(2)),
        });

    } catch (err: any) {
        console.error('Admin Stats Fetch Error:', err);
        res.status(500).json({ message: 'Failed to fetch dashboard statistics.' });
    }
});

export default router;