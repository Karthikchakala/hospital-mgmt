'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Patient {
    patient_id: number;
    name: string;
    blood_group: string;
    age: number;
}

export default function DoctorPatientsPage() {
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('Doctor');

    const doctorNavLinks = [
        { name: 'Profile', href: '/dashboard/doctor/profile' },
        { name: 'Appointments', href: '/dashboard/doctor/appointments' },
        { name: 'Patients', href: '/dashboard/doctor/patients' },
    ];

    useEffect(() => {
        const fetchPatients = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                // 1. Fetch doctor's name (for the navbar)
                const userResponse = await axios.get('http://localhost:5000/api/doctor/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserName(userResponse.data.name);

                // 2. Fetch unique patient list
                const patientsResponse = await axios.get('http://localhost:5000/api/doctor/patients', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPatients(patientsResponse.data);
            } catch (error) {
                console.error('Failed to fetch patient data:', error);
                localStorage.removeItem('token');
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatients();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold">Loading Patient List...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Doctor Portal" navLinks={doctorNavLinks} userName={userName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold mb-8 text-gray-800">My Patients</h1>
                
                {patients.length === 0 ? (
                    <div className="bg-white p-10 rounded-lg shadow-md text-center">
                        <p className="text-xl text-gray-600">You currently have no patients assigned via appointments.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {patients.map(patient => (
                            <div key={patient.patient_id} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center transition-shadow duration-300 hover:shadow-xl">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">{patient.name}</h2>
                                    <p className="text-sm text-gray-500">Age: {patient.age} | Blood Group: {patient.blood_group || 'N/A'}</p>
                                </div>
                                <div>
                                    {/* Link to view the detailed medical record for this patient */}
                                    <Link 
                                        href={`/dashboard/doctor/patient-record/${patient.patient_id}`}
                                        className="text-blue-600 font-semibold hover:underline"
                                    >
                                        View Record &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}