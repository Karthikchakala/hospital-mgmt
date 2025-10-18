'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PatientSummary {
    id: number;
    name: string;
    email: string;
    age: number;
    blood_group: string;
    city: string;
}

export default function AdminPatientManagementPage() {
    const router = useRouter();
    const [patients, setPatients] = useState<PatientSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const adminName = 'Admin User'; // Placeholder

    // Admin navigation links
    const adminNavLinks = [
        { name: 'Dashboard', href: '/dashboard/admin' },
        { name: 'User Management', href: '/dashboard/admin/doctors' },
        // ...
    ];

    useEffect(() => {
        const fetchPatients = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                // Fetch the list of all patients
                const response = await axios.get('http://localhost:5000/api/admin/patients', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPatients(response.data);
            } catch (error) {
                console.error('Failed to fetch patient data:', error);
                // Redirect on unauthorized access
                router.push('/dashboard/admin');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatients();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold">Loading Patient Directory...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Admin Portal" navLinks={adminNavLinks} userName={adminName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold mb-8 text-gray-800">Patient Management</h1>
                
                {patients.length === 0 ? (
                    <div className="bg-white p-10 rounded-lg shadow-md text-center">
                        <p className="text-xl text-gray-600">No patient records found in the system.</p>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age/Blood</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {patients.map((patient) => (
                                    <tr key={patient.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.age} / {patient.blood_group}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.city}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link href={`/dashboard/admin/patients/${patient.id}`} className="text-indigo-600 hover:text-indigo-900">
                                                View/Edit
                                            </Link>
                                        </td>
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

