// src/app/dashboard/patient/medical-history/page.tsx

'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { DocumentTextIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'; // Icons for file types

// Define the structure of a single file link object within the JSONB array
interface FileLink {
    type: string;
    url: string;
    public_id: string;
    // other fields
}

interface EMR {
    record_id: number;
    visit_date: string;
    diagnosis: string;
    notes: string;
    file_links: FileLink[]; // Array of file links (JSONB)
    doctor_name: string;
}

export default function PatientMedicalHistoryPage() {
    const router = useRouter();
    const [records, setRecords] = useState<EMR[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('Patient'); 

    // Patient Navbar Links
    const patientNavLinks = [
        { name: 'Appointments', href: '/dashboard/patient/appointments' },
        { name: 'Profile', href: '/dashboard/patient/profile' },
        { name: 'Bills', href: '/dashboard/patient/bills' },
        { name: 'History', href: '/dashboard/patient/medical-history' },
    ];

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) { router.push('/login'); return; }

            try {
                // Fetch user name (for navbar) and medical history data
                const [userResponse, historyResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/patient/profile', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/patient/history', { headers: { Authorization: `Bearer ${token}` } }),
                ]);
                
                setUserName(userResponse.data.name);

                // CRITICAL FIX: Ensure file_links is parsed as an array if it's a JSON string
                setRecords(historyResponse.data.map((record: any) => ({
                    ...record,
                    // If the backend returns file_links as a string (which sometimes happens with JSONB), parse it
                    file_links: typeof record.file_links === 'string' ? JSON.parse(record.file_links) : record.file_links || []
                })));

            } catch (error) {
                console.error('Failed to fetch medical history:', error);
                localStorage.removeItem('token');
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, [router]);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-100"><h1 className="text-2xl font-bold">Loading Medical History...</h1></div>;
    }

    // Helper function to get the correct icon based on file type
    const getFileIcon = (type: string) => {
        if (type.includes('LabResult')) return <ClipboardDocumentListIcon className="w-5 h-5 mr-1 text-teal-600" />;
        return <DocumentTextIcon className="w-5 h-5 mr-1 text-indigo-600" />;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Patient Portal" navLinks={patientNavLinks} userName={userName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">My Medical History</h1>
                
                {records.length === 0 ? (
                    <p className="text-xl text-gray-600 text-center bg-white p-6 rounded-lg shadow-md">No medical records found.</p>
                ) : (
                    <div className="space-y-8">
                        {records.map((record) => (
                            <div key={record.record_id} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-teal-500">
                                <div className="flex justify-between items-center mb-3 border-b pb-2">
                                    <h2 className="text-xl font-bold text-gray-800">
                                        Visit: {new Date(record.visit_date).toLocaleDateString()}
                                    </h2>
                                    <span className="text-sm font-medium text-gray-600">
                                        Physician: Dr. {record.doctor_name}
                                    </span>
                                </div>
                                
                                <p className="text-sm text-gray-700 mb-3">
                                    <span className="font-semibold">Diagnosis:</span> {record.diagnosis}
                                </p>
                                <p className="text-sm text-gray-700 mb-4">
                                    <span className="font-semibold">Notes:</span> {record.notes}
                                </p>

                                {/* File Links Section */}
                                {record.file_links && record.file_links.length > 0 && (
                                    <div className="pt-3 border-t">
                                        <p className="font-semibold text-gray-700 mb-2">Attached Documents:</p>
                                        <div className="flex flex-wrap gap-3">
                                            {record.file_links.map((file, index) => (
                                                <a 
                                                    key={index}
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition duration-150"
                                                >
                                                    {getFileIcon(file.type)}
                                                    {file.type === 'DoctorNote' ? 'Prescription/Note' : 'Lab Results'}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}