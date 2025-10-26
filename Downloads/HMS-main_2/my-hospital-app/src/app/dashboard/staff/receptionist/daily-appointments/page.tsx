'use client';

import DashboardNavbar from '../../../../../components/DashboardNavbar';
import ParticlesBackground from '../../../../../components/ParticlesBackground'; // ✅ Added
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

interface AppointmentSummary {
    id: number;
    time: string;
    patientName: string;
    doctorName: string;
    reason: string;
    status: string;
}

export default function ReceptionistDailyAppointmentsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<AppointmentSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('Receptionist');

    const receptionistNavLinks = [
        { name: 'Dashboard', href: '/dashboard/staff/receptionist' },
        { name: 'Patient Registration', href: '/dashboard/staff/receptionist/patient-registration' },
        { name: 'Appointments', href: '/dashboard/staff/receptionist/daily-appointments' },
    ];

    useEffect(() => {
        const fetchSchedule = async () => {
            const token = localStorage.getItem('token');
            if (!token) { router.push('/login'); return; }

            try {
                const userResponse = await axios.get('http://localhost:5000/api/staff/profile', { 
                    headers: { Authorization: `Bearer ${token}` } 
                });
                setUserName(userResponse.data.name);

                const apptsResponse = await axios.get('http://localhost:5000/api/staff/appointments/today', { 
                    headers: { Authorization: `Bearer ${token}` } 
                });
                setAppointments(apptsResponse.data);
            } catch (error) {
                console.error('Failed to fetch daily schedule:', error);
                localStorage.removeItem('token');
                router.push('/login'); 
            } finally {
                setIsLoading(false);
            }
        };
        fetchSchedule();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 rounded-full border-2 border-slate-700 border-t-cyan-400 animate-spin" />
                    <h1 className="text-slate-300 text-sm">Loading Daily Schedule...</h1>
                </div>
            </div>
        );
    }

    const todayDate = new Date().toLocaleDateString('en-IN', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    return (
        <div className="relative min-h-screen bg-slate-900 text-slate-100 overflow-hidden">
            {/* ✅ Plexus Background */}
            <ParticlesBackground />

            <div className="relative z-10">
                <DashboardNavbar 
                    title="Receptionist Portal" 
                    navLinks={receptionistNavLinks} 
                    userName={userName} 
                />

                <main className="container mx-auto py-12 px-6">
                    <div className="flex items-center gap-3 mb-10">
                        <CalendarDaysIcon className="w-10 h-10 text-cyan-400" />
                        <h1 className="text-5xl font-extrabold text-cyan-200 drop-shadow-lg">
                            Today's Appointments
                        </h1>
                    </div>
                    <p className="text-slate-400 text-lg mb-8">{todayDate}</p>

                    {appointments.length === 0 ? (
                        <div className="bg-slate-800/80 backdrop-blur-md border border-emerald-700/30 p-10 rounded-2xl shadow-lg text-center">
                            <CalendarDaysIcon className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
                            <p className="text-xl text-emerald-300">✅ No appointments scheduled for today.</p>
                        </div>
                    ) : (
                        <div className="bg-slate-800/80 backdrop-blur-md border border-cyan-700/30 p-6 rounded-2xl shadow-2xl overflow-hidden">
                            <table className="min-w-full text-slate-100">
                                <thead>
                                    <tr className="border-b-2 border-cyan-500/40 bg-slate-700/50">
                                        <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300 uppercase">Time</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300 uppercase">Patient</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300 uppercase">Doctor</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300 uppercase">Reason</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-cyan-300 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appt) => (
                                        <tr
                                            key={appt.id}
                                            className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors duration-200"
                                        >
                                            <td className="px-6 py-4 font-bold text-cyan-300">{appt.time}</td>
                                            <td className="px-6 py-4 font-semibold text-white">{appt.patientName}</td>
                                            <td className="px-6 py-4 text-slate-300">{appt.doctorName}</td>
                                            <td className="px-6 py-4 text-slate-400">{appt.reason}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span
                                                    className={`px-3 py-1.5 text-xs font-bold rounded-full ${
                                                        appt.status === 'Scheduled'
                                                            ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/50'
                                                            : 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50'
                                                    }`}
                                                >
                                                    {appt.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
