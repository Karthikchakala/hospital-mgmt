'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import ParticlesBackground from '../../../../components/ParticlesBackground';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { 
    ShieldCheckIcon, 
    ShieldExclamationIcon, 
    ClockIcon 
} from '@heroicons/react/24/outline';

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
    const adminName = 'Admin User';

    const adminNavLinks = [
        { name: 'Home', href: '/' },
        { name: 'Dashboard', href: '/dashboard/admin' },
        { name: 'User Management', href: '/dashboard/admin/doctors' },
        { name: 'Settings', href: '/dashboard/admin/settings' },
    ];

    useEffect(() => {
        const fetchLogs = async () => {
            const token = localStorage.getItem('token');
            if (!token) { router.push('/login'); return; }

            try {
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
            <div className="flex justify-center items-center min-h-screen bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 rounded-full border-2 border-slate-700 border-t-cyan-400 animate-spin" />
                    <h1 className="text-slate-300 text-sm">Loading Audit Logs...</h1>
                </div>
            </div>
        );
    }

    const formatTimestamp = (ts: string) => {
        return new Date(ts).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Calculate statistics
    const totalLogs = logs.length;
    const failedLogins = logs.filter(log => log.action.toLowerCase().includes('failed')).length;
    const successfulLogins = logs.filter(log => 
        log.action.toLowerCase().includes('success') || 
        log.action.toLowerCase().includes('login')
    ).length;

    return (
        <div className="relative min-h-screen bg-slate-900 text-slate-100 overflow-hidden">
            {/* <ParticlesBackground /> */}

            <div className="relative z-10">
                <DashboardNavbar
                    title="Admin Portal"
                    navLinks={adminNavLinks}
                    userName={adminName}
                />

                <main className="container mx-auto py-12 px-6">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-5xl font-extrabold text-cyan-200 mb-3 drop-shadow-lg">
                            Security Audit & Login Logs
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Monitor all system access attempts and user activities
                        </p>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* Total Logs */}
                        <div className="bg-gradient-to-br from-blue-500/25 to-indigo-500/25 backdrop-blur-md border-2 border-blue-400/50 p-6 rounded-xl shadow-xl">
                            <div className="flex items-center justify-between mb-2">
                                <ClockIcon className="w-8 h-8 text-blue-300" />
                                <span className="text-3xl font-bold text-white">{totalLogs}</span>
                            </div>
                            <p className="text-blue-200 font-semibold">Total Events</p>
                        </div>

                        {/* Successful Logins */}
                        <div className="bg-gradient-to-br from-emerald-500/25 to-teal-500/25 backdrop-blur-md border-2 border-emerald-400/50 p-6 rounded-xl shadow-xl">
                            <div className="flex items-center justify-between mb-2">
                                <ShieldCheckIcon className="w-8 h-8 text-emerald-300" />
                                <span className="text-3xl font-bold text-white">{successfulLogins}</span>
                            </div>
                            <p className="text-emerald-200 font-semibold">Successful Logins</p>
                        </div>

                        {/* Failed Attempts */}
                        <div className="bg-gradient-to-br from-rose-500/25 to-red-500/25 backdrop-blur-md border-2 border-rose-400/50 p-6 rounded-xl shadow-xl">
                            <div className="flex items-center justify-between mb-2">
                                <ShieldExclamationIcon className="w-8 h-8 text-rose-300" />
                                <span className="text-3xl font-bold text-white">{failedLogins}</span>
                            </div>
                            <p className="text-rose-200 font-semibold">Failed Attempts</p>
                        </div>
                    </div>

                    {/* Logs Table */}
                    {logs.length === 0 ? (
                        <div className="bg-slate-800/80 backdrop-blur-md border border-cyan-700/30 p-10 rounded-2xl shadow-lg text-center">
                            <p className="text-xl text-slate-300">No audit records found.</p>
                        </div>
                    ) : (
                        <div className="bg-slate-800/80 backdrop-blur-md border border-cyan-700/30 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b-2 border-cyan-500/40 bg-slate-700/50">
                                            <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300 uppercase">
                                                Timestamp
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300 uppercase">
                                                Action / Event
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300 uppercase">
                                                User ID
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300 uppercase">
                                                IP Address
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.map((log) => {
                                            const isFailed = log.action.toLowerCase().includes('failed');
                                            const isSuccess = log.action.toLowerCase().includes('success') ||
                                                log.action.toLowerCase().includes('login');

                                            return (
                                                <tr
                                                    key={log.log_id}
                                                    className={`border-b border-slate-700/50 transition-all duration-200 ${
                                                        isFailed
                                                            ? 'bg-rose-500/15 hover:bg-rose-500/25'
                                                            : 'hover:bg-slate-700/30'
                                                    }`}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <ClockIcon className="w-4 h-4 text-slate-400" />
                                                            <span className="text-slate-200 font-medium">
                                                                {formatTimestamp(log.timestamp)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold ${
                                                            isFailed
                                                                ? 'bg-rose-500/30 text-rose-200 border-2 border-rose-400/60 shadow-lg shadow-rose-500/30'
                                                                : isSuccess
                                                                ? 'bg-emerald-500/30 text-emerald-200 border-2 border-emerald-400/60 shadow-lg shadow-emerald-500/30'
                                                                : 'bg-blue-500/30 text-blue-200 border-2 border-blue-400/60 shadow-lg shadow-blue-500/30'
                                                        }`}>
                                                            {isFailed ? (
                                                                <ShieldExclamationIcon className="w-4 h-4" />
                                                            ) : isSuccess ? (
                                                                <ShieldCheckIcon className="w-4 h-4" />
                                                            ) : null}
                                                            {log.action}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {log.user_id ? (
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-500/20 border border-cyan-400/40 rounded-full">
                                                                <span className="font-bold text-cyan-300">
                                                                    #{log.user_id}
                                                                </span>
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-500 italic">Anonymous</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <code className="px-3 py-1 bg-slate-700/50 rounded-md font-mono text-amber-300 border border-slate-600/50">
                                                            {log.ip_address}
                                                        </code>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
