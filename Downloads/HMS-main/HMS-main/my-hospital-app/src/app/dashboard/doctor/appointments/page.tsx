'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface PatientSummary {
    name: string;
}

interface Appointment {
    appointment_id: number;
    appointment_date: string;
    appointment_time: string;
    reason: string;
    status: string;
    Patient: PatientSummary; 
}

export default function DoctorAppointmentsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('Doctor'); // Placeholder until we fetch name

    const doctorNavLinks = [
        { name: 'Profile', href: '/dashboard/doctor/profile' },
        { name: 'Appointments', href: '/dashboard/doctor/appointments' },
        { name: 'Patients', href: '/dashboard/doctor/patients' },
    ];

    useEffect(() => {
        const fetchAppointments = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                // Fetch doctor's name (for the navbar)
                const userResponse = await axios.get('http://localhost:5000/api/doctor/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserName(userResponse.data.name);

                // Fetch appointments list
                const apptsResponse = await axios.get('http://localhost:5000/api/doctor/appointments', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAppointments(apptsResponse.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                localStorage.removeItem('token');
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAppointments();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold">Loading Schedule...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Doctor Portal" navLinks={doctorNavLinks} userName={userName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold mb-8 text-gray-800">Today's Appointment Schedule</h1>
                <div className="space-y-6">
                    {appointments.length === 0 ? (
                        <div className="bg-white p-8 rounded-lg shadow-md text-center">
                            <p className="text-xl text-gray-600">You have no appointments scheduled.</p>
                        </div>
                    ) : (
                        appointments.map(appt => (
                            <div key={appt.appointment_id} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center transition-shadow duration-300 hover:shadow-xl">
                                <div>
                                    <h2 className="text-xl font-semibold text-blue-600">{appt.Patient.name}</h2>
                                    <p className="text-gray-600">Reason: {appt.reason}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">{appt.appointment_time}</p>
                                    <p className="text-sm text-gray-500">{appt.appointment_date}</p>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full mt-1 inline-block ${
                                        appt.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                        {appt.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}