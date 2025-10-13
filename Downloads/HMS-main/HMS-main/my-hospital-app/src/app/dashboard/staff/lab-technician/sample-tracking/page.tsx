// src/app/dashboard/staff/lab-technician/sample-tracking/page.tsx

'use client';

import DashboardNavbar from '../../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface SampleTest {
    test_id: number;
    test_name: string;
    patient_name: string;
    patient_id: number;
}

export default function SampleTrackingPage() {
    const router = useRouter();
    const [pendingSamples, setPendingSamples] = useState<SampleTest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('Lab Technician'); 

    const technicianNavLinks = [
        { name: 'Results', href: '/dashboard/staff/lab-technician/results-management' },
        { name: 'Samples', href: '/dashboard/staff/lab-technician/sample-tracking' },
    ];

    // --- Fetch Pending Samples and User Profile ---
    useEffect(() => {
        const fetchSamples = async () => {
            const token = localStorage.getItem('token');
            if (!token) { router.push('/login'); return; }

            try {
                // Fetch profile data (for the navbar)
                const userResponse = await axios.get('http://localhost:5000/api/staff/profile', { headers: { Authorization: `Bearer ${token}` } });
                setUserName(userResponse.data.name);

                // Fetch pending samples from the new API
                const samplesResponse = await axios.get('http://localhost:5000/api/staff/lab/samples', { headers: { Authorization: `Bearer ${token}` } });
                setPendingSamples(samplesResponse.data);
            } catch (error) {
                console.error('Failed to fetch samples:', error);
                localStorage.removeItem('token');
                router.push('/login'); 
            } finally {
                setIsLoading(false);
            }
        };
        fetchSamples();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold">Loading Sample Tracker...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Lab Technician Portal" navLinks={technicianNavLinks} userName={userName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Sample Tracking Portal</h1>
                <p className="text-xl text-gray-600 mb-6">Showing all tests awaiting collection or processing.</p>

                {/* Pending Samples List */}
                {pendingSamples.length === 0 ? (
                    <div className="bg-white p-10 rounded-lg shadow-md text-center">
                        <p className="text-xl text-green-600">No samples are currently awaiting processing.</p>
                    </div>
                ) : (
                    <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
                        {pendingSamples.map(test => (
                            <div key={test.test_id} className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold">{test.test_name}</h3>
                                    <p className="text-sm text-gray-600">Patient: {test.patient_name} (ID: {test.patient_id})</p>
                                </div>
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
                                    PENDING STATUS
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

