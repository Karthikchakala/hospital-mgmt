'use client';

import DashboardNavbar from '../../../components/DashboardNavbar';
import Link from 'next/link';
import { useState, useEffect } from 'react'; // NEW IMPORTS
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Admin specific navigation links (Define outside component for simplicity)
const adminNavLinks = [
    { name: 'Dashboard', href: '/dashboard/admin' },
    { name: 'User Management', href: '/dashboard/admin/doctors' },
    { name: 'Settings', href: '/dashboard/admin/settings' },
];

interface AdminProfile {
    name: string;
    email: string;
    role: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [adminName, setAdminName] = useState('Alex Chen'); // Default/Loading name
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAdminProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }
            try {
                // Fetch name from the new profile API
                const response = await axios.get('http://localhost:5000/api/admin/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAdminName(response.data.name); // Set the real name
            } catch (error) {
                console.error('Failed to fetch admin profile:', error);
                localStorage.removeItem('token');
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAdminProfile();
    }, [router]);
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold">Loading Admin Portal...</h1>
            </div>
        );
    }

    // --- Statistics Cards and other helper components (keep these as they were) ---

    // Reusable Stat Card Component (defined earlier)
    const StatCard = ({ title, value, color }: { title: string, value: number, color: string }) => (
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
        </div>
    );

    // Reusable Management Card Component (defined earlier)
    const ManagementCard = ({ title, link, description, color }: { title: string, link: string, description: string, color: string }) => (
        <div className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02] border-t-4 border-b-4 border-gray-200">
            <h3 className={`text-xl font-bold mb-2 ${color.replace('bg', 'text')}`}>{title}</h3>
            <p className="text-gray-600 mb-4 text-sm">{description}</p>
            <Link href={link} className={`block w-full text-center py-2 text-white font-semibold rounded-md transition-colors ${color} hover:${color.replace('500', '600')}`}>
                Access Portal &rarr;
            </Link>
        </div>
    );

    const mockStats = { totalDoctors: 45, totalPatients: 1250, pendingAppointments: 18, staffCount: 30, };


    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Admin Portal" navLinks={adminNavLinks} userName={adminName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">
                    Welcome, {adminName} - Management Dashboard
                </h1>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <StatCard title="Total Doctors" value={mockStats.totalDoctors} color="text-green-600" />
                    <StatCard title="Total Patients" value={mockStats.totalPatients} color="text-blue-600" />
                    <StatCard title="Pending Appointments" value={mockStats.pendingAppointments} color="text-yellow-600" />
                    <StatCard title="Total Staff" value={mockStats.staffCount} color="text-purple-600" />
                </div>

                {/* User Management Links (Existing) */}
                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Management & Oversight</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ManagementCard title="Manage Doctors" link="/dashboard/admin/doctors" description="Add, edit, and view doctor profiles and specializations." color="bg-green-500" />
                    <ManagementCard title="Manage Patients" link="/dashboard/admin/patients" description="Access all patient records, history, and billing data." color="bg-blue-500" />
                    <ManagementCard title="Manage Staff" link="/dashboard/admin/staff" description="Oversee administrative, lab, and pharmacy staff accounts." color="bg-purple-500" />
                </div>

                {/* System Management Links (NEW) */}
                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2 pt-8">System Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ManagementCard title="Department Configuration" link="/dashboard/admin/departments" description="Create, edit, and manage hospital departments." color="bg-indigo-500" />
                    <ManagementCard title="System Settings" link="/dashboard/admin/settings" description="Configure consultation fees, site parameters, and defaults." color="bg-teal-500" />
                    <ManagementCard title="Audit & Login Logs" link="/dashboard/admin/login-logs" description="Review all user login attempts and system activity for security." color="bg-red-500" />
                </div>
            </main>
        </div>
    );
}