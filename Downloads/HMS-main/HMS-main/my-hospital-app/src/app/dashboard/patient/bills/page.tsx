// // src/app/dashboard/patient/bills/page.tsx

// 'use client';

// import DashboardNavbar from '../../../../components/DashboardNavbar';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// interface Bill {
//     bill_id: number;
//     created_at: string;
//     services: string;
//     total_amount: number;
//     status: string;
// }

// export default function PatientBillsPage() {
//     const router = useRouter();
//     const [bills, setBills] = useState<Bill[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [userName, setUserName] = useState('Patient'); 

//     // Patient Navbar Links (same as other patient pages)
//     const patientNavLinks = [
//         { name: 'Appointments', href: '/dashboard/patient/appointments' },
//         { name: 'Profile', href: '/dashboard/patient/profile' },
//         { name: 'Bills', href: '/dashboard/patient/bills' },
//         { name: 'History', href: '/dashboard/patient/medical-history' },
//     ];

//     useEffect(() => {
//         const fetchBills = async () => {
//             const token = localStorage.getItem('token');
//             if (!token) { router.push('/login'); return; }

//             try {
//                 // Fetch user name (for navbar)
//                 const userResponse = await axios.get('http://localhost:5000/api/patient/profile', { headers: { Authorization: `Bearer ${token}` } });
//                 setUserName(userResponse.data.name);

//                 // Fetch billing data
//                 const billsResponse = await axios.get('http://localhost:5000/api/patient/bills', { headers: { Authorization: `Bearer ${token}` } });
//                 setBills(billsResponse.data);
//             } catch (error) {
//                 console.error('Failed to fetch bills:', error);
//                 // On critical error, redirect
//                 localStorage.removeItem('token');
//                 router.push('/login');
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchBills();
//     }, [router]);

//     if (isLoading) {
//         return <div className="flex justify-center items-center min-h-screen bg-gray-100"><h1 className="text-2xl font-bold">Loading Bills...</h1></div>;
//     }

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <DashboardNavbar title="Patient Portal" navLinks={patientNavLinks} userName={userName} />
//             <main className="container mx-auto py-12 px-6">
//                 <h1 className="text-4xl font-bold mb-8">My Bills</h1>
//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     {bills.length === 0 ? (
//                         <p className="text-xl text-gray-600 text-center">No billing records found.</p>
//                     ) : (
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead>
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill ID</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
//                                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {bills.map((bill) => (
//                                     <tr key={bill.bill_id} className={bill.status === 'Unpaid' ? 'bg-red-50' : ''}>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill.bill_id}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(bill.created_at).toLocaleDateString()}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bill.services}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">₹{bill.total_amount.toFixed(2)}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
//                                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                                                 bill.status === 'Paid' ? 'bg-green-100 text-green-800' : 
//                                                 bill.status === 'Unpaid' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
//                                             }`}>
//                                                 {bill.status}
//                                             </span>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     )}
//                 </div>
//             </main>
//         </div>
//     );
// }


'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface Bill {
    bill_id: number;
    created_at: string;
    services: string;
    total_amount: number;
    status: string;
    Prescriptions: any | null;
}

export default function PatientBillsPage() {
    const router = useRouter();
    const [bills, setBills] = useState<Bill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('Patient');
    const [isProcessing, setIsProcessing] = useState(false);

    const patientNavLinks = [
        { name: 'Appointments', href: '/dashboard/patient/appointments' },
        { name: 'Profile', href: '/dashboard/patient/profile' },
        { name: 'Bills', href: '/dashboard/patient/bills' },
        { name: 'History', href: '/dashboard/patient/medical-history' },
    ];

    const isUnpaid = (status: string) => status?.toLowerCase().trim() === 'unpaid';

    const fetchBills = async () => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/login'); return; }

        try {
            const userResponse = await axios.get('http://localhost:5000/api/patient/profile', { headers: { Authorization: `Bearer ${token}` } });
            setUserName(userResponse.data.name);

            const billsResponse = await axios.get('http://localhost:5000/api/patient/bills', { headers: { Authorization: `Bearer ${token}` } });
            setBills(billsResponse.data);
        } catch (error) {
            console.error('Failed to fetch bills:', error);
            localStorage.removeItem('token');
            router.push('/login');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, [router]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handlePayment = async (bill: Bill) => {
        if (!window.Razorpay) {
            alert("Payment gateway not loaded. Please wait and try again.");
            return;
        }

        setIsProcessing(true);
        const token = localStorage.getItem('token');
        if (!token) return;

        if (!confirm(`Confirm payment of ₹${bill.total_amount.toFixed(2)} for Bill ID ${bill.bill_id}?`)) {
            setIsProcessing(false);
            return;
        }

        try {
            // Convert amount to paise before sending to backend
            const amountInPaise = Math.round(bill.total_amount * 100);

            const txnResponse = await axios.post('http://localhost:5000/api/patient/payment/generate-txn', {
                billId: bill.bill_id,
                amount: amountInPaise, // Send amount in paise
            }, { headers: { Authorization: `Bearer ${token}` } });

            const { orderId, keyId, amount, currency, userEmail } = txnResponse.data;

            const options = {
                key: keyId,
                amount: amount, // Already in paise
                currency: currency,
                name: 'Global Health Center',
                description: `Hospital Bill #${bill.bill_id}`,
                order_id: orderId,
                handler: async (response: any) => {
                    await axios.put(`http://localhost:5000/api/patient/bills/${bill.bill_id}/pay`, {
                        transactionId: response.razorpay_payment_id,
                        paymentMethod: 'Razorpay Online'
                    }, { headers: { Authorization: `Bearer ${token}` } });

                    alert(`✅ Payment successful! Bill ID ${bill.bill_id} marked as paid.`);
                    fetchBills();
                },
                prefill: {
                    name: userName,
                    email: userEmail,
                    contact: '8328134131' // Optional: Replace with real patient contact
                },
                theme: { color: '#3B82F6' }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error: any) {
            console.error('Payment Error:', error);
            alert(`Payment failed: ${error.response?.data?.message || 'Check network and backend logs.'}`);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold">Loading Bills...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Patient Portal" navLinks={patientNavLinks} userName={userName} />

            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold mb-8">My Bills</h1>

                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    {bills.length === 0 ? (
                        <p className="text-xl text-gray-600 text-center">No billing records found.</p>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {bills.map((bill) => (
                                    <tr key={bill.bill_id} className={isUnpaid(bill.status) ? 'bg-red-50' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill.bill_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(bill.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{bill.services}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">₹{bill.total_amount.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                bill.status === 'Paid'
                                                    ? 'bg-green-100 text-green-800'
                                                    : isUnpaid(bill.status)
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {bill.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {isUnpaid(bill.status) && (
                                                <button
                                                    onClick={() => handlePayment(bill)}
                                                    disabled={isProcessing}
                                                    className="text-white bg-green-500 hover:bg-green-600 py-1 px-3 rounded-md transition duration-300 disabled:opacity-50"
                                                >
                                                    {isProcessing ? 'Processing...' : 'Pay Now'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
}
