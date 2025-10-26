// // backend/routes/patient/billingRoutes.ts
// import { Router, Request, Response } from 'express';
// import { protect } from '../../middleware/authMiddleware';
// import { supabase } from '../../db';


// const PaytmChecksum = require('paytmchecksum');

// const router = Router();

// const PAYTM_MID = process.env.PAYTM_MID;
// const PAYTM_KEY = process.env.PAYTM_KEY;
// const PAYTM_WEBSITE = process.env.PAYTM_WEBSITE ;

// interface AuthRequest extends Request { user?: { id: string; role: string; }; }

// // Helper to look up Patient ID (assuming this is already defined)
// const getPatientId = async (userId: string) => {
//     const numericUserId = parseInt(userId);
//     const { data } = await supabase.from('Patient').select('patient_id').eq('user_id', numericUserId).single();
//     return data?.patient_id;
// };

// // @route   GET /api/patient/bills
// // @desc    Get all billing records for the authenticated patient
// // @access  Private
// router.get('/bills', protect, async (req: AuthRequest, res: Response) => {
//     try {
//         const userId = req.user?.id;
//         if (!userId) return res.status(401).json({ message: 'User not authenticated' });

//         // 1. Get the patient_id from the Patient table
//         const numericUserId = parseInt(userId);
//         const { data: patientRecord, error: patientError } = await supabase
//             .from('Patient')
//             .select('patient_id')
//             .eq('user_id', numericUserId)
//             .single();

//         if (patientError || !patientRecord) {
//             return res.status(404).json({ message: 'Patient record not found.' });
//         }
//         const patientId = patientRecord.patient_id;

//         // 2. Fetch all bills for that patient_id
//         const { data: bills, error } = await supabase
//             .from('Billing')
//             .select('*')
//             .eq('patient_id', patientId)
//             .order('created_at', { ascending: false });

//         if (error) throw error;

//         res.status(200).json(bills);
//     } catch (err: any) {
//         console.error('Billing GET Error:', err);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // @route   POST /api/patient/payment/initiate
// // @desc    Simulates payment gateway interaction and returns a success status
// // @access  Private (Patient Only)
// router.post('/payment/initiate', protect, async (req: AuthRequest, res: Response) => {
//     try {
//         const { billId, amount } = req.body;
        
//         // --- MOCK PAYMENT GATEWAY SUCCESS ---
//         // In a real application, a call to a service like Stripe/Razorpay would happen here.
//         // We simulate a successful transaction:
//         const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

//         res.status(200).json({ 
//             message: 'Payment simulated successfully.', 
//             transactionId,
//             billId: billId,
//             amount: amount,
//             status: 'Success'
//         });
//         // --- END MOCK ---

//     } catch (err: any) {
//         console.error('Payment Initiation Error:', err);
//         res.status(500).json({ message: 'Failed to initiate payment.' });
//     }
// });

// // @route   PUT /api/patient/bills/:billId/pay
// // @desc    Updates the final status of a bill after successful payment
// // @access  Private (Patient Only)
// router.put('/bills/:billId/pay', protect, async (req: AuthRequest, res: Response) => {
//     try {
//         const userId = req.user?.id;
//         const billId = req.params.billId;
//         const { transactionId, paymentMethod = 'Online' } = req.body;

//         const patientId = await getPatientId(userId as string);
//         if (!patientId) {
//             return res.status(404).json({ message: 'Patient record not found.' });
//         }
        
//         // 1. Update the Billing record
//         const { data: updatedBill, error } = await supabase
//             .from('Billing')
//             .update({ 
//                 status: 'Paid', 
//                 payment_date: new Date().toISOString(),
//                 payment_method: paymentMethod 
//             })
//             .eq('bill_id', billId)
//             .eq('patient_id', patientId) // Security check: Ensure patient owns the bill
//             .select();

//         if (error) throw error;
//         if (!updatedBill || updatedBill.length === 0) {
//             return res.status(404).json({ message: 'Bill not found or already paid.' });
//         }

//         // NOTE: A record for the transaction ID would ideally be inserted into PaymentGateway table here.

//         res.status(200).json({ message: 'Bill status updated to Paid.', transactionId });
//     } catch (err: any) {
//         console.error('Bill Update Error:', err);
//         res.status(500).json({ message: 'Failed to update bill status.' });
//     }
// });

// // @route   POST /api/patient/payment/generate-txn
// router.post('/payment/generate-txn', protect, async (req: AuthRequest, res: Response) => {
//     try {
//         const userId = req.user?.id;
//         const { billId, amount } = req.body; // Removed 'email' from destructuring

//         if (!userId) { return res.status(401).json({ message: 'User not authenticated.' }); }

//         // CRITICAL STEP 1: Look up the user's email from the User table
//         const { data: userRecord, error: userError } = await supabase
//             .from('User')
//             .select('email')
//             .eq('user_id', userId) // Use the user ID from the JWT
//             .single();

//         if (userError || !userRecord || !userRecord.email) {
//              console.error('User Email Lookup Failed:', userError);
//              return res.status(404).json({ message: 'User email not found for transaction.' });
//         }
        
//         const userEmail = userRecord.email; // Get the email securely from the DB
        
//         // 2. Generate a unique Order ID
//         const orderId = `HMS_BILL_${billId}_${Date.now()}`;
        
//         // 3. Prepare transaction parameters
//         const paytmParams = {
//             // ... other parameters
//             'ORDER_ID': orderId,
//             'CUST_ID': String(userId),
//             'TXN_AMOUNT': String(amount.toFixed(2)),
//             // CRITICAL STEP 2: Use the fetched email
//             'CALLBACK_URL': process.env.PAYTM_CALLBACK_URL,
//             'EMAIL': userEmail, // Use the fetched email
//             'MOBILE_NO': '9876543210' 
//         };
        
//         // 4. Generate Checksum
//         const checksum = await PaytmChecksum.generateSignature(paytmParams, PAYTM_KEY);

//         // 5. Send the data needed for frontend redirection
//         res.status(200).json({ paytmParams, checksum, txnUrl: 'https://securegw-stage.paytm.in/order/process' });

//     } catch (err: any) {
//         console.error('TXN Generation Error:', err);
//         res.status(500).json({ message: 'Failed to generate payment link.' });
//     }
// });

// export default router;


// // backend/routes/patient/billingRoutes.ts
// import { Router, Request, Response, NextFunction } from 'express';
// import { protect } from '../../middleware/authMiddleware';
// import { supabase } from '../../db';

// // CRITICAL FIX: Use Razorpay SDK
// const Razorpay = require('razorpay'); 

// const router = Router();

// // Environment variables for Razorpay (Ensure these are in your .env file)
// const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
// const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
// const RAZORPAY_CURRENCY = 'INR'; // Standard currency

// // Initialize Razorpay instance
// const razorpayInstance = new Razorpay({
//     key_id: RAZORPAY_KEY_ID,
//     key_secret: RAZORPAY_KEY_SECRET,
// });

// interface AuthRequest extends Request { user?: { id: string; role: string; }; }

// // Helper to look up Patient ID (used for security and bill retrieval)
// const getPatientId = async (userId: string) => {
//     const numericUserId = parseInt(userId);
//     if (isNaN(numericUserId)) return null; 
//     
//     const { data } = await supabase.from('Patient').select('patient_id').eq('user_id', numericUserId).single();
//     return data?.patient_id;
// };

// // Helper to look up User Email (required for payment modal)
// const getUserEmail = async (userId: string) => {
//     const { data } = await supabase.from('User').select('email').eq('user_id', userId).single();
//     return data?.email;
// };


// // @route   GET /api/patient/bills
// router.get('/bills', protect, async (req: AuthRequest, res: Response) => {
//     try {
//         const userId = req.user?.id;
//         if (!userId) return res.status(401).json({ message: 'User not authenticated' });

//         const patientId = await getPatientId(userId);

//         if (!patientId) {
//             return res.status(404).json({ message: 'Patient record not found.' });
//         }

//         // Fetch all bills for that patient_id
//         const { data: bills, error } = await supabase
//             .from('Billing')
//             .select('*')
//             .eq('patient_id', patientId)
//             .order('created_at', { ascending: false });

//         if (error) throw error;

//         res.status(200).json(bills);
//     } catch (err: any) {
//         console.error('Billing GET Error:', err);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // @route   PUT /api/patient/bills/:billId/pay
// router.put('/bills/:billId/pay', protect, async (req: AuthRequest, res: Response) => {
//     try {
//         const userId = req.user?.id;
//         const billId = req.params.billId;
//         const { transactionId, paymentMethod = 'Online' } = req.body;

//         const patientId = await getPatientId(userId as string);
//         if (!patientId) {
//             return res.status(404).json({ message: 'Patient record not found.' });
//         }
//         
//         // 1. Update the Billing record
//         const { data: updatedBill, error } = await supabase
//             .from('Billing')
//             .update({ 
//                 status: 'Paid', 
//                 payment_date: new Date().toISOString(),
//                 payment_method: paymentMethod 
//             })
//             .eq('bill_id', billId)
//             .eq('patient_id', patientId) // Security check: Ensure patient owns the bill
//             .select();

//         if (error) throw error;
//         if (!updatedBill || updatedBill.length === 0) {
//             return res.status(404).json({ message: 'Bill not found or already paid.' });
//         }

//         res.status(200).json({ message: 'Bill status updated to Paid.', transactionId });
//     } catch (err: any) {
//         console.error('Bill Update Error:', err);
//         res.status(500).json({ message: 'Failed to update bill status.' });
//     }
// });



// // @route   POST /api/patient/payment/generate-txn (RAZORPAY ORDER GENERATION)
// // @desc    Generates a Razorpay Order ID for payment
// // @access  Private (Patient Only)
// router.post('/payment/generate-txn', protect, async (req: AuthRequest, res: Response) => {
//     try {
//         const userId = req.user?.id;
//         const { billId, amount } = req.body; 

//         if (!userId) { return res.status(401).json({ message: 'User not authenticated.' }); }

//         // Fetch email for the payment modal (UX requirement)
//         const userEmail = await getUserEmail(userId as string);
//         if (!userEmail) { return res.status(404).json({ message: 'User email not found.' }); }

//         // Convert amount to the smallest currency unit (paise) and ensure it's an integer
//         const amountInPaise = Math.round(amount * 100); 

//         // 1. Generate a unique Receipt/Order ID
//         const receiptId = `HMS_BILL_${billId}_${Date.now()}`;

//         // 2. Prepare Razorpay Order Creation Options
//         const options = {
//             amount: amountInPaise,
//             currency: RAZORPAY_CURRENCY,
//             receipt: receiptId,
//             payment_capture: 1, // Auto-capture payment after successful transaction
//             notes: {
//                 bill_id: billId,
//                 user_id: userId
//             }
//         };

//         // 3. Create Order via Razorpay SDK
//         const order = await razorpayInstance.orders.create(options);

//         // 4. Send back the Order ID and Key ID (from .env) to the frontend
//         res.status(200).json({
//             orderId: order.id,
//             keyId: RAZORPAY_KEY_ID,
//             amount: options.amount,
//             currency: options.currency,
//             userEmail: userEmail
//         });

//     } catch (err: any) {
//         console.error('Razorpay Order Creation Error:', err);
//         res.status(500).json({ message: 'Failed to generate payment order.' });
//     }
// });

// export default router;

// backend/routes/patient/billingRoutes.ts
import { Router, Request, Response } from 'express';
import { protect } from '../../middleware/authMiddleware';
import { supabase } from '../../db';
import Razorpay from 'razorpay';

const router = Router();

// Environment variables (ensure these exist in your .env)
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
const RAZORPAY_CURRENCY = 'INR';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID!,
  key_secret: RAZORPAY_KEY_SECRET!,
});

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// Helper to fetch Patient ID
const getPatientId = async (userId: string) => {
  const numericUserId = parseInt(userId);
  if (isNaN(numericUserId)) return null;
  const { data } = await supabase.from('Patient').select('patient_id').eq('user_id', numericUserId).single();
  return data?.patient_id;
};

// =====================
// GET /api/patient/bills
// =====================
router.get('/bills', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'User not authenticated.' });

    const patientId = await getPatientId(userId);
    if (!patientId) return res.status(404).json({ message: 'Patient record not found.' });

    const { data: bills, error } = await supabase
      .from('Billing')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(bills);
  } catch (err: any) {
    console.error('Billing GET Error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// =====================
// PUT /api/patient/bills/:billId/pay
// =====================
router.put('/bills/:billId/pay', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const billId = req.params.billId;
    const { transactionId, paymentMethod = 'Online' } = req.body;

    const patientId = await getPatientId(userId!);
    if (!patientId) return res.status(404).json({ message: 'Patient record not found.' });

    const { data: updatedBill, error } = await supabase
      .from('Billing')
      .update({
        status: 'Paid',
        payment_date: new Date().toISOString(),
        payment_method: paymentMethod
      })
      .eq('bill_id', billId)
      .eq('patient_id', patientId)
      .select();

    if (error) throw error;
    if (!updatedBill || updatedBill.length === 0) return res.status(404).json({ message: 'Bill not found or already paid.' });

    res.status(200).json({ message: 'Bill status updated to Paid.', transactionId });
  } catch (err: any) {
    console.error('Bill Update Error:', err);
    res.status(500).json({ message: 'Failed to update bill status.' });
  }
});

// ============================================
// POST /api/patient/payment/generate-txn
// Creates Razorpay order (sandbox ready)
// ============================================
// router.post('/payment/generate-txn', protect, async (req: AuthRequest, res: Response) => {
//   try {
//     const userId = req.user?.id;
//     const { billId, amount } = req.body;

//     if (!userId) return res.status(401).json({ message: 'User not authenticated.' });
//     if (!billId || !amount) return res.status(400).json({ message: 'billId and amount required.' });

//     const userEmail = await getUserEmail(userId);
//     if (!userEmail) return res.status(404).json({ message: 'User email not found.' });

//     // Convert amount to paise (integer)
//     const amountInPaise = Math.round(Number(amount) * 100);

//     // Create a unique receipt ID
//     const receiptId = `HMS_BILL_${billId}_${Date.now()}`;

//     // Razorpay order options
//     const options = {
//       amount: amountInPaise,
//       currency: RAZORPAY_CURRENCY,
//       receipt: receiptId,
//       payment_capture: 1,
//       notes: {
//         bill_id: billId,
//         user_id: userId
//       }
//     };

//     // Create order
//     const order = await razorpay.orders.create(options);

//     // Send order details to frontend
//     res.status(200).json({
//       orderId: order.id,
//       keyId: RAZORPAY_KEY_ID,
//       amount: options.amount,
//       currency: options.currency,
//       userEmail
//     });
//   } catch (err: any) {
//     console.error('Razorpay Order Creation Error:', err);
//     res.status(500).json({ message: err?.error?.description || 'Failed to generate payment order.' });
//   }
// });


// Helper to look up User Email (required for payment modal)
const getUserEmail = async (userId: string) => {
    const { data } = await supabase.from('User').select('email').eq('user_id', userId).single();
    return data?.email;
};

// ... (Existing GET /bills and PUT /bills/:billId/pay routes)


// @route   POST /api/patient/payment/generate-txn
// @desc    Generates a Razorpay Order ID for appointment payment
// @access  Private (Patient Only)
router.post('/payment/generate-txn', protect, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { amount } = req.body; // Only expect 'amount' from frontend

        if (!userId) { return res.status(401).json({ message: 'User not authenticated.' }); }
        if (!amount || amount <= 0) { return res.status(400).json({ message: 'Valid amount is required.' }); }

        // 1. Fetch user email for the payment modal
        const userEmail = await getUserEmail(userId as string); 
        if (!userEmail) { return res.status(404).json({ message: 'User email not found.' }); }

        // 2. Convert amount to the smallest currency unit (paise) and ensure it's an integer
        // This is mandatory for Razorpay
        const amountInPaise = Math.round(amount * 100); 

        // 3. Generate a unique Order ID based on User and Timestamp
        const orderId = `HMS_TXN_${userId}_${Date.now()}`;
        
        // 4. Prepare Razorpay Order Creation Options
        const options = {
            amount: amountInPaise,
            currency: RAZORPAY_CURRENCY,
            receipt: orderId, // Use the generated order ID as receipt
            payment_capture: 1, 
            notes: {
                user_id: userId // Embed the user ID for security/reference
            }
        };

        // 5. Create Order via Razorpay SDK
        const order = await razorpay.orders.create(options);

        // 6. Send back the Order ID and Key ID (from .env) to the frontend
        res.status(200).json({
            orderId: order.id,
            keyId: RAZORPAY_KEY_ID,
            amount: options.amount, // Amount in paise
            currency: options.currency,
            userEmail: userEmail
        });

    } catch (err: any) {
        console.error('Razorpay Order Creation Error:', err);
        res.status(500).json({ message: err?.error?.description || 'Failed to generate payment order.' });
    }
});

// export default router;

export default router;
