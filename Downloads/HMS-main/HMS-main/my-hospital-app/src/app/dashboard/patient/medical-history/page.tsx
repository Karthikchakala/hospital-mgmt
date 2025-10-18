// // src/app/dashboard/patient/medical-history/page.tsx

// 'use client';

// import DashboardNavbar from '../../../../components/DashboardNavbar';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { DocumentTextIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'; // Icons for file types

// // Define the structure of a single file link object within the JSONB array
// interface FileLink {
//     type: string;
//     url: string;
//     public_id: string;
//     // other fields
// }

// interface EMR {
//     record_id: number;
//     visit_date: string;
//     diagnosis: string;
//     notes: string;
//     file_links: FileLink[]; // Array of file links (JSONB)
//     doctor_name: string;
// }

// export default function PatientMedicalHistoryPage() {
//     const router = useRouter();
//     const [records, setRecords] = useState<EMR[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [userName, setUserName] = useState('Patient'); 

//     // Patient Navbar Links
//     const patientNavLinks = [
//         { name: 'Appointments', href: '/dashboard/patient/appointments' },
//         { name: 'Profile', href: '/dashboard/patient/profile' },
//         { name: 'Bills', href: '/dashboard/patient/bills' },
//         { name: 'History', href: '/dashboard/patient/medical-history' },
//     ];

//     useEffect(() => {
//         const fetchHistory = async () => {
//             const token = localStorage.getItem('token');
//             if (!token) { router.push('/login'); return; }

//             try {
//                 // Fetch user name (for navbar) and medical history data
//                 const [userResponse, historyResponse] = await Promise.all([
//                     axios.get('http://localhost:5000/api/patient/profile', { headers: { Authorization: `Bearer ${token}` } }),
//                     axios.get('http://localhost:5000/api/patient/history', { headers: { Authorization: `Bearer ${token}` } }),
//                 ]);
                
//                 setUserName(userResponse.data.name);

//                 // CRITICAL FIX: Ensure file_links is parsed as an array if it's a JSON string
//                 setRecords(historyResponse.data.map((record: any) => ({
//                     ...record,
//                     // If the backend returns file_links as a string (which sometimes happens with JSONB), parse it
//                     file_links: typeof record.file_links === 'string' ? JSON.parse(record.file_links) : record.file_links || []
//                 })));

//             } catch (error) {
//                 console.error('Failed to fetch medical history:', error);
//                 localStorage.removeItem('token');
//                 router.push('/login');
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchHistory();
//     }, [router]);

//     if (isLoading) {
//         return <div className="flex justify-center items-center min-h-screen bg-gray-100"><h1 className="text-2xl font-bold">Loading Medical History...</h1></div>;
//     }

//     // Helper function to get the correct icon based on file type
//     const getFileIcon = (type: string) => {
//         if (type.includes('LabResult')) return <ClipboardDocumentListIcon className="w-5 h-5 mr-1 text-teal-600" />;
//         return <DocumentTextIcon className="w-5 h-5 mr-1 text-indigo-600" />;
//     };

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <DashboardNavbar title="Patient Portal" navLinks={patientNavLinks} userName={userName} />
//             <main className="container mx-auto py-12 px-6">
//                 <h1 className="text-4xl font-bold text-gray-800 mb-8">My Medical History</h1>
                
//                 {records.length === 0 ? (
//                     <p className="text-xl text-gray-600 text-center bg-white p-6 rounded-lg shadow-md">No medical records found.</p>
//                 ) : (
//                     <div className="space-y-8">
//                         {records.map((record) => (
//                             <div key={record.record_id} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-teal-500">
//                                 <div className="flex justify-between items-center mb-3 border-b pb-2">
//                                     <h2 className="text-xl font-bold text-gray-800">
//                                         Visit: {new Date(record.visit_date).toLocaleDateString()}
//                                     </h2>
//                                     <span className="text-sm font-medium text-gray-600">
//                                         Physician: Dr. {record.doctor_name}
//                                     </span>
//                                 </div>
                                
//                                 <p className="text-sm text-gray-700 mb-3">
//                                     <span className="font-semibold">Diagnosis:</span> {record.diagnosis}
//                                 </p>
//                                 <p className="text-sm text-gray-700 mb-4">
//                                     <span className="font-semibold">Notes:</span> {record.notes}
//                                 </p>

//                                 {/* File Links Section */}
//                                 {record.file_links && record.file_links.length > 0 && (
//                                     <div className="pt-3 border-t">
//                                         <p className="font-semibold text-gray-700 mb-2">Attached Documents:</p>
//                                         <div className="flex flex-wrap gap-3">
//                                             {record.file_links.map((file, index) => (
//                                                 <a 
//                                                     key={index}
//                                                     href={file.url}
//                                                     target="_blank"
//                                                     rel="noopener noreferrer"
//                                                     className="inline-flex items-center px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition duration-150"
//                                                 >
//                                                     {getFileIcon(file.type)}
//                                                     {file.type === 'DoctorNote' ? 'Prescription/Note' : 'Lab Results'}
//                                                 </a>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// }

// src/app/dashboard/patient/medical-history/page.tsx

// 'use client';

// import DashboardNavbar from '../../../../components/DashboardNavbar';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { DocumentTextIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'; // Icons for file types

// // Define the structure of a single file link object within the JSONB array
// interface FileLink {
//     type: string;
//     url: string;
//     public_id: string;
//     // other fields
// }

// interface EMR {
//     record_id: number;
//     visit_date: string;
//     diagnosis: string;
//     notes: string;
//     file_links: FileLink[]; // Array of file links (JSONB)
//     doctor_name: string;
// }

// export default function PatientMedicalHistoryPage() {
//     const router = useRouter();
//     const [records, setRecords] = useState<EMR[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [userName, setUserName] = useState('Patient'); 

//     // Patient Navbar Links
//     const patientNavLinks = [
//         { name: 'Appointments', href: '/dashboard/patient/appointments' },
//         { name: 'Profile', href: '/dashboard/patient/profile' },
//         { name: 'Bills', href: '/dashboard/patient/bills' },
//         { name: 'History', href: '/dashboard/patient/medical-history' },
//     ];

//     useEffect(() => {
//         const fetchHistory = async () => {
//             const token = localStorage.getItem('token');
//             if (!token) { router.push('/login'); return; }

//             try {
//                 // Fetch user name (for navbar) and medical history data
//                 const [userResponse, historyResponse] = await Promise.all([
//                     axios.get('http://localhost:5000/api/patient/profile', { headers: { Authorization: `Bearer ${token}` } }),
//                     axios.get('http://localhost:5000/api/patient/history', { headers: { Authorization: `Bearer ${token}` } }),
//                 ]);
                
//                 setUserName(userResponse.data.name);

//                 // CRITICAL FIX: Ensure file_links is parsed as an array if it's a JSON string
//                 setRecords(historyResponse.data.map((record: any) => ({
//                     ...record,
//                     // If the backend returns file_links as a string (which sometimes happens with JSONB), parse it
//                     file_links: typeof record.file_links === 'string' ? JSON.parse(record.file_links) : record.file_links || []
//                 })));

//             } catch (error) {
//                 console.error('Failed to fetch medical history:', error);
//                 localStorage.removeItem('token');
//                 router.push('/login');
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchHistory();
//     }, [router]);

//     if (isLoading) {
//         return <div className="flex justify-center items-center min-h-screen bg-gray-100"><h1 className="text-2xl font-bold">Loading Medical History...</h1></div>;
//     }

//     // Helper function to get the correct icon based on file type
//     const getFileIcon = (type: string) => {
//         if (type.includes('LabResult')) return <ClipboardDocumentListIcon className="w-5 h-5 mr-1 text-teal-600" />;
//         return <DocumentTextIcon className="w-5 h-5 mr-1 text-indigo-600" />;
//     };

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <DashboardNavbar title="Patient Portal" navLinks={patientNavLinks} userName={userName} />
//             <main className="container mx-auto py-12 px-6">
//                 <h1 className="text-4xl font-bold text-gray-800 mb-8">My Medical History</h1>
                
//                 {records.length === 0 ? (
//                     <p className="text-xl text-gray-600 text-center bg-white p-6 rounded-lg shadow-md">No medical records found.</p>
//                 ) : (
//                     <div className="space-y-8">
//                         {records.map((record) => (
//                             <div key={record.record_id} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-teal-500">
//                                 <div className="flex justify-between items-center mb-3 border-b pb-2">
//                                     <h2 className="text-xl font-bold text-gray-800">
//                                         Visit: {new Date(record.visit_date).toLocaleDateString()}
//                                     </h2>
//                                     <span className="text-sm font-medium text-gray-600">
//                                         Physician: Dr. {record.doctor_name}
//                                     </span>
//                                 </div>
                                
//                                 <p className="text-sm text-gray-700 mb-3">
//                                     <span className="font-semibold">Diagnosis:</span> {record.diagnosis}
//                                 </p>
//                                 <p className="text-sm text-gray-700 mb-4">
//                                     <span className="font-semibold">Notes:</span> {record.notes}
//                                 </p>

//                                 {/* File Links Section */}
//                                 {record.file_links && record.file_links.length > 0 && (
//                                     <div className="pt-3 border-t">
//                                         <p className="font-semibold text-gray-700 mb-2">Attached Documents:</p>
//                                         <div className="flex flex-wrap gap-3">
//                                             {record.file_links.map((file, index) => (
//                                                 <a 
//                                                     key={index}
//                                                     href={file.url}
//                                                     target="_blank"
//                                                     rel="noopener noreferrer"
//                                                     className="inline-flex items-center px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition duration-150"
//                                                 >
//                                                     {getFileIcon(file.type)}
//                                                     {file.type === 'DoctorNote' ? 'Prescription/Note' : 'Lab Results'}
//                                                 </a>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// }

// src/app/dashboard/patient/medical-history/page.tsx

'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { DocumentTextIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

// --- INTERFACE DEFINITIONS ---

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
    file_links: FileLink[] | string | null;
    doctor_name: string;
}

interface LabResult {
    lab_test_id: number;
    test_name: string;
    result_value: string;
    unit: string;
    normal_range: string;
    test_date: string;
}

export default function PatientMedicalHistoryPage() {
    const router = useRouter();
    const [emrRecords, setEmrRecords] = useState<EMR[]>([]);
    const [labRecords, setLabRecords] = useState<LabResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('Patient'); 

    // Patient Navbar Links
    const patientNavLinks = [
        { name: 'Appointments', href: '/dashboard/patient/appointments' },
        { name: 'Profile', href: '/dashboard/patient/profile' },
        { name: 'Bills', href: '/dashboard/patient/bills' },
        { name: 'History', href: '/dashboard/patient/medical-history' },
    ];

    // --- Data Fetching Logic (EMR + Lab Results) ---
    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) { router.push('/login'); return; }

            try {
                // Fetch three data sources concurrently: Profile, EMR History, and Lab Results
                const [userResponse, emrResponse, labResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/patient/profile', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/patient/history', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/patient/lab-results', { headers: { Authorization: `Bearer ${token}` } }),
                ]);
                
                setUserName(userResponse.data.name);

                // Process EMR Records (Visit History)
                setEmrRecords(emrResponse.data.map((record: any) => ({
                    ...record,
                    // Robustly handle the file_links JSONB column
                    file_links: (typeof record.file_links === 'string' ? JSON.parse(record.file_links) : record.file_links) || []
                })));
                
                // Set Lab Results
                setLabRecords(labResponse.data);

            } catch (error) {
                console.error('Failed to fetch medical history data:', error);
                localStorage.removeItem('token');
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, [router]);

    // Helper function to get the correct icon based on file type
    const getFileIcon = (type: string) => {
        if (type.includes('LabResult')) return <ClipboardDocumentListIcon className="w-5 h-5 mr-1 text-teal-600" />;
        return <DocumentTextIcon className="w-5 h-5 mr-1 text-indigo-600" />;
    };
    
    // Helper function for status styling (simple red for high numbers)
    const getResultColor = (value: string, range: string) => {
        const numValue = parseFloat(value);
        return numValue > 150 ? 'text-red-600 font-bold' : 'text-gray-900';
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-100"><h1 className="text-2xl font-bold">Loading Medical History...</h1></div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Patient Portal" navLinks={patientNavLinks} userName={userName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">My Medical History & Records</h1>
                
                {/* --- 1. Lab Results Section --- */}
                <h2 className="text-3xl font-bold text-gray-700 mb-4 border-b pb-2">Completed Lab Results</h2>
                <div className="space-y-4 mb-10">
                    {labRecords.length === 0 ? (
                        <p className="text-gray-600 bg-white p-4 rounded-lg shadow-sm">No completed lab results available.</p>
                    ) : (
                        <div className="bg-white p-4 rounded-lg shadow-md divide-y divide-gray-100">
                            {labRecords.map((result) => (
                                <div key={result.lab_test_id} className="py-3 flex justify-between items-center hover:bg-gray-50">
                                    <div className="flex items-center space-x-3">
                                        <ClipboardDocumentListIcon className="w-6 h-6 text-teal-600 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold">{result.test_name}</p>
                                            <p className="text-xs text-gray-500">Date: {result.test_date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-bold ${getResultColor(result.result_value, result.normal_range)}`}>
                                            {result.result_value} {result.unit}
                                        </p>
                                        <p className="text-sm text-gray-500">Normal Range: {result.normal_range}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- 2. EMR Records Section (Visit History) --- */}
                <h2 className="text-3xl font-bold text-gray-700 mb-4 border-b pb-2">Visit History & Doctor Notes</h2>
                {emrRecords.length === 0 ? (
                    <p className="text-gray-600 bg-white p-4 rounded-lg shadow-sm">No visit records found.</p>
                ) : (
                    <div className="space-y-6">
                        {emrRecords.map((record) => (
                            <div key={record.record_id} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-600">
                                <div className="flex justify-between items-start mb-3 border-b pb-2">
                                    <h2 className="text-xl font-bold text-gray-800">
                                        Diagnosis: {record.diagnosis}
                                    </h2>
                                    <span className="text-sm font-medium text-gray-600">
                                        Visit Date: {new Date(record.visit_date).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                <p className="text-sm text-gray-700 mb-3">
                                    <span className="font-semibold">Prescriptions:</span> {record.prescriptions || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-700 mb-4">
                                    <span className="font-semibold">Notes:</span> {record.notes || 'No internal notes.'}
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Attending Physician: Dr. {record.doctor_name}
                                </p>

                                {/* File Links Section */}
                                {record.file_links && (record.file_links as FileLink[]).length > 0 && (
                                    <div className="pt-3 border-t">
                                        <p className="font-semibold text-gray-700 mb-2">Attached Documents:</p>
                                        <div className="flex flex-wrap gap-3">
                                            {(record.file_links as FileLink[]).map((file, index) => (
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
