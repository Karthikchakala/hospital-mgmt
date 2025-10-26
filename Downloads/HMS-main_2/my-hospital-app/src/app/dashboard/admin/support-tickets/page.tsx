// src/app/dashboard/admin/support-tickets/page.tsx
'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface TicketSummary {
    id: number;
    type: string;
    subject: string;
    content: string;
    submitter: string;
    email: string;
    timestamp: string;
    status: string;
    isUrgent: boolean;
}

export default function AdminSupportTicketsPage() {
    const router = useRouter();
    const [tickets, setTickets] = useState<TicketSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const adminName = 'Alex Chen'; // Placeholder for Navbar

    const adminNavLinks = [
        { name: 'Dashboard', href: '/dashboard/admin' },
        { name: 'Tickets/Feedback', href: '/dashboard/feedback' },
    ];

    useEffect(() => {
        const fetchTickets = async () => {
            const token = localStorage.getItem('token');
            if (!token) { router.push('/login'); return; }

            try {
                // NOTE: We assume the Admin name is fetched separately or from a layout
                
                // Fetch combined tickets and feedback
                const response = await axios.get('http://localhost:5000/api/admin/tickets', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTickets(response.data);
            } catch (error) {
                console.error('Failed to fetch tickets:', error);
                alert('Access denied or failed to load tickets.');
                router.push('/dashboard/admin');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTickets();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold">Loading Support Tickets...</h1>
            </div>
        );
    }

    const formatTimestamp = (ts: string) => new Date(ts).toLocaleString();

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Admin Portal" navLinks={adminNavLinks} userName={adminName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Helpdesk & Feedback Portal</h1>
                
                {tickets.length === 0 ? (
                    <div className="bg-white p-10 rounded-lg shadow-md text-center">
                        <p className="text-xl text-green-600">No new tickets or feedback have been submitted.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${
                                ticket.isUrgent ? 'border-red-600' : 'border-blue-600'
                            }`}>
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className={`text-xl font-bold ${ticket.isUrgent ? 'text-red-700' : 'text-gray-800'}`}>
                                        {ticket.subject} 
                                    </h2>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        ticket.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                        {ticket.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{ticket.content}</p>
                                <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t mt-3">
                                    <p>Submitted by: <span className="font-semibold">{ticket.submitter}</span> ({ticket.email})</p>
                                    <p>Date: {formatTimestamp(ticket.timestamp)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}