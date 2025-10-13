'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DoctorSummary {
    id: number;
    name: string;
    email: string;
    specialization: string;
    license: string;
}

export default function AdminDoctorManagementPage() {
    const router = useRouter();
    const [doctors, setDoctors] = useState<DoctorSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const adminName = 'Admin User'; // Placeholder - fetch this via API later

    // Admin navigation links
    const adminNavLinks = [
        { name: 'Dashboard', href: '/dashboard/admin' },
        { name: 'User Management', href: '/dashboard/admin/doctors' },
    ];

    useEffect(() => {
        const fetchDoctors = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                // Fetch the list of all doctors
                const response = await axios.get('http://localhost:5000/api/admin/doctors', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDoctors(response.data);
            } catch (error) {
                console.error('Failed to fetch doctor data:', error);
                // Admin access will fail if not authenticated or not an admin
                alert('Access denied or failed to load data.');
                router.push('/dashboard/admin'); // Redirect back to admin dashboard
            } finally {
                setIsLoading(false);
            }
        };
        fetchDoctors();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold">Loading Doctor Directory...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Admin Portal" navLinks={adminNavLinks} userName={adminName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold mb-8 text-gray-800">Doctor Management</h1>
                
                {doctors.length === 0 ? (
                    <div className="bg-white p-10 rounded-lg shadow-md text-center">
                        <p className="text-xl text-gray-600">No doctor profiles found in the system.</p>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License No.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {doctors.map((doctor) => (
                                    <tr key={doctor.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.specialization}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.license}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link href={`/dashboard/admin/doctors/${doctor.id}`} className="text-indigo-600 hover:text-indigo-900">
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