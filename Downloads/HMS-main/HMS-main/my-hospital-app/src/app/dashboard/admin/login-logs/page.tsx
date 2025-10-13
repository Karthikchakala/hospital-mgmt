'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface LogEntry {
    log_id: number;
    user_id: number | null;
    action: string;
    timestamp: string;
    ip_address: string;
}

export default function AdminLoginLogsPage() {
    const router = useRouter();
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const adminName = 'Admin User'; // Placeholder

    const adminNavLinks = [
        { name: 'Dashboard', href: '/dashboard/admin' },
        { name: 'User Management', href: '/dashboard/admin/doctors' },
        { name: 'Settings', href: '/dashboard/admin/settings' },
    ];

    useEffect(() => {
        const fetchLogs = async () => {
            const token = localStorage.getItem('token');
            if (!token) { router.push('/login'); return; }

            try {
                // Fetch log data from the backend API
                const response = await axios.get('http://localhost:5000/api/admin/logs', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLogs(response.data);
            } catch (error) {
                console.error('Failed to fetch logs:', error);
                alert('Failed to load logs. Check admin permissions.');
                router.push('/dashboard/admin');
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold">Loading Audit Logs...</h1>
            </div>
        );
    }

    const formatTimestamp = (ts: string) => {
        return new Date(ts).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'medium' });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Admin Portal" navLinks={adminNavLinks} userName={adminName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Audit and Login Logs</h1>
                
                {logs.length === 0 ? (
                    <p className='text-xl text-gray-600'>No audit records found.</p>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {logs.map((log) => (
                                    <tr key={log.log_id} className={log.action.includes('FAILED') ? 'bg-red-50' : 'hover:bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatTimestamp(log.timestamp)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-center">{log.action}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.user_id || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ip_address}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}