// src/app/dashboard/doctor/patient-record/[patientId]/page.tsx
'use client';

import DashboardNavbar from '../../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface FileLink {
    type: string;
    url: string;
    public_id: string;
}

interface EMR {
    record_id: number;
    visit_date: string;
    diagnosis: string;
    prescriptions: string;
    notes: string;
    file_links: FileLink[];
    doctor_name: string;
    patient_name: string; // Fetched for display
}

export default function DoctorPatientRecordPage() {
    const router = useRouter();
    const params = useParams();
    const patientId = params.patientId as string;
    
    const [records, setRecords] = useState<EMR[]>([]);
    const [patientName, setPatientName] = useState('Loading Patient...');
    const [isLoading, setIsLoading] = useState(true);
    const doctorName = 'Dr. User'; 

    const doctorNavLinks = [
        { name: 'Profile', href: '/dashboard/doctor/profile' },
        { name: 'Patients', href: '/dashboard/doctor/patients' },
    ];

    useEffect(() => {
        const fetchRecords = async () => {
            const token = localStorage.getItem('token');
            if (!token || !patientId) { router.push('/login'); return; }

            try {
                // Fetch the EMRs specific to this patient and doctor
                const response = await axios.get(`http://localhost:5000/api/doctor/patient-emrs/${patientId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setRecords(response.data);
                
                if (response.data.length > 0) {
                    setPatientName(response.data[0].patient_name); 
                }

            } catch (error) {
                console.error('Failed to fetch patient records:', error);
                alert('Failed to load records. Check patient ID or authorization.');
                router.push('/dashboard/doctor/patients'); 
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecords();
    }, [router, patientId]);

    const getFileIcon = (type: string) => {
        if (type.includes('LabResult')) return <DocumentTextIcon className="w-5 h-5 mr-1 text-teal-600" />;
        return <DocumentTextIcon className="w-5 h-5 mr-1 text-indigo-600" />;
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-100"><h1 className="text-2xl font-bold">Loading Patient History...</h1></div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Doctor Portal" navLinks={doctorNavLinks} userName={doctorName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Medical History for {patientName}</h1>
                <p className="mb-8 text-lg text-gray-500">Patient ID: {patientId}</p>
                
                {records.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="text-xl text-gray-600">No medical records found that you have authored for this patient.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {records.map((record) => (
                            <div key={record.record_id} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-600">
                                <div className="flex justify-between items-start mb-3 border-b pb-2">
                                    <h2 className="text-xl font-bold text-gray-800">
                                        Diagnosis: {record.diagnosis}
                                    </h2>
                                    <span className="text-sm font-medium text-gray-600">
                                        Visit Date: {new Date(record.visit_date).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">
                                    <span className="font-semibold">Prescriptions:</span> {record.prescriptions || 'None recorded.'}
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    **Doctor Notes:** {record.notes || 'No internal notes.'}
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
                                                    {file.type === 'DoctorNote' ? 'Doctor Note' : 'Lab Result'}
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