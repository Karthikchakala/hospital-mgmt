'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import ParticlesBackground from '../../../../components/ParticlesBackground';
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
        { name: 'Home', href: '/' },
        { name: 'Dashboard', href: '/dashboard/patient' },
        { name: 'Appointments', href: '/dashboard/patient/appointments' },
        { name: 'Profile', href: '/dashboard/patient/profile' },
    ];

    const isUnpaid = (status: string) => status?.toLowerCase().trim() === 'unpaid';

    const fetchBills = async () => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/login'); return; }

        try {
            const userResponse = await axios.get('http://localhost:5000/api/patient/profile', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setUserName(userResponse.data.name);

            const billsResponse = await axios.get('http://localhost:5000/api/patient/bills', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
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
            const amountInPaise = Math.round(bill.total_amount * 100);

            const txnResponse = await axios.post('http://localhost:5000/api/patient/payment/generate-txn', {
                billId: bill.bill_id,
                amount: amountInPaise,
            }, { headers: { Authorization: `Bearer ${token}` } });

            const { orderId, keyId, amount, currency, userEmail } = txnResponse.data;

            const options = {
                key: keyId,
                amount: amount,
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
                    contact: '8328134131'
                },
                theme: { color: '#06b6d4' }
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
            <div className="flex justify-center items-center min-h-screen bg-slate-900">
                <h1 className="text-2xl font-bold text-slate-100">Loading Bills...</h1>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-slate-900 text-slate-100 overflow-hidden">
            {/* Plexus Background */}
            <ParticlesBackground />

            {/* Navigation */}
            <DashboardNavbar 
                title="Patient Portal" 
                navLinks={patientNavLinks} 
                userName={userName} 
            />

            {/* Main Content */}
            <main className="relative z-10 container mx-auto py-12 px-6">
                {/* Page Title */}
                <h1 className="text-5xl font-extrabold mb-10 text-cyan-200 drop-shadow-lg">
                    My Bills
                </h1>

                {/* Bills Table Card */}
                <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-lg border border-cyan-500/30 p-8 rounded-2xl shadow-2xl shadow-cyan-500/20">
                    {bills.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-2xl text-slate-300">
                                No billing records found.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                {/* Table Header */}
                                <thead>
                                    <tr className="border-b-2 border-cyan-500/40">
                                        <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300 uppercase tracking-wider">
                                            Bill ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300 uppercase tracking-wider">
                                            Services
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-cyan-300 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-4 text-center text-sm font-bold text-cyan-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-center text-sm font-bold text-cyan-300 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody>
                                    {bills.map((bill) => (
                                        <tr 
                                            key={bill.bill_id} 
                                            className={`border-b border-cyan-900/20 transition-all duration-300 ${
                                                isUnpaid(bill.status) 
                                                    ? 'bg-red-500/10 hover:bg-red-500/20' 
                                                    : 'hover:bg-cyan-500/5'
                                            }`}
                                        >
                                            {/* Bill ID */}
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className="text-base font-bold text-cyan-400">
                                                    #{bill.bill_id}
                                                </span>
                                            </td>

                                            {/* Date */}
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className="text-base text-slate-200">
                                                    {new Date(bill.created_at).toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </td>

                                            {/* Services */}
                                            <td className="px-6 py-5">
                                                <span className="text-base text-slate-100">
                                                    {bill.services}
                                                </span>
                                            </td>

                                            {/* Amount */}
                                            <td className="px-6 py-5 whitespace-nowrap text-right">
                                                <span className="text-lg font-bold text-cyan-300">
                                                    ₹{bill.total_amount.toFixed(2)}
                                                </span>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-5 whitespace-nowrap text-center">
                                                <span className={`px-4 py-2 inline-flex text-sm font-bold rounded-full ${
                                                    bill.status === 'Paid'
                                                        ? 'bg-emerald-500/30 text-emerald-200 border-2 border-emerald-400/50 shadow-lg shadow-emerald-500/30'
                                                        : isUnpaid(bill.status)
                                                        ? 'bg-red-500/30 text-red-200 border-2 border-red-400/50 shadow-lg shadow-red-500/30'
                                                        : 'bg-amber-500/30 text-amber-200 border-2 border-amber-400/50 shadow-lg shadow-amber-500/30'
                                                }`}>
                                                    {bill.status}
                                                </span>
                                            </td>

                                            {/* Action Button */}
                                            <td className="px-6 py-5 whitespace-nowrap text-center">
                                                {isUnpaid(bill.status) ? (
                                                    <button
                                                        onClick={() => handlePayment(bill)}
                                                        disabled={isProcessing}
                                                        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2.5 px-6 rounded-full font-bold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-110 shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/70 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                                    >
                                                        {isProcessing ? 'Processing...' : 'Pay Now'}
                                                    </button>
                                                ) : (
                                                    <span className="text-slate-400 text-sm">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
