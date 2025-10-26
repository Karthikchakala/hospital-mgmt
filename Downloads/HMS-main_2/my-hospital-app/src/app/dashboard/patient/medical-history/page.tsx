'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import ParticlesBackground from '../../../../components/ParticlesBackground';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { DocumentTextIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

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

    const patientNavLinks = [
        { name: 'Home', href: '/' },
        { name: 'Dashboard', href: '/dashboard/patient' },
        { name: 'Appointments', href: '/dashboard/patient/appointments' },
        { name: 'Profile', href: '/dashboard/patient/profile' },
    ];

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) { router.push('/login'); return; }

            try {
                const [userResponse, emrResponse, labResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/patient/profile', { 
                        headers: { Authorization: `Bearer ${token}` } 
                    }),
                    axios.get('http://localhost:5000/api/patient/history', { 
                        headers: { Authorization: `Bearer ${token}` } 
                    }),
                    axios.get('http://localhost:5000/api/patient/lab-results', { 
                        headers: { Authorization: `Bearer ${token}` } 
                    }),
                ]);
                
                setUserName(userResponse.data.name);

                setEmrRecords(emrResponse.data.map((record: any) => ({
                    ...record,
                    file_links: (typeof record.file_links === 'string' 
                        ? JSON.parse(record.file_links) 
                        : record.file_links) || []
                })));
                
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

    const getFileIcon = (type: string) => {
        if (type.includes('LabResult')) 
            return <ClipboardDocumentListIcon className="w-5 h-5 mr-1 text-teal-300" />;
        return <DocumentTextIcon className="w-5 h-5 mr-1 text-purple-300" />;
    };
    
    const getResultColor = (value: string, range: string) => {
        const numValue = parseFloat(value);
        return numValue > 150 ? 'text-rose-400 font-bold' : 'text-emerald-400';
    };

    const formatDate = (dateStr: string) => {
        // Splits "DD/MM/YYYY" and rearranges to "MM/DD/YYYY" for reliable parsing
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            // Rearrange to YYYY-MM-DD for standard parsing, then format
            const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`; 
            return new Date(isoDate).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        }
        return dateStr;
    };

    const handleDownload = async (url: string, fileName: string) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error('Download failed:', error);
        alert('Download failed. Please try again.');
    }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-900">
                <h1 className="text-2xl font-bold text-slate-100">Loading Medical History...</h1>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-slate-900 text-slate-100 overflow-hidden">
            <ParticlesBackground />

            <DashboardNavbar 
                title="Patient Portal" 
                navLinks={patientNavLinks} 
                userName={userName} 
            />

            <main className="relative z-10 container mx-auto py-12 px-6">
                {/* Page Title */}
                <h1 className="text-5xl font-extrabold text-cyan-200 mb-10 drop-shadow-lg">
                    Medical History & Records
                </h1>
                
                {/* --- Lab Results Section --- */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-emerald-300 mb-6 pb-3 flex items-center">
                        <ClipboardDocumentListIcon className="w-8 h-8 mr-3" />
                        Lab Results
                    </h2>
                    
                    {labRecords.length === 0 ? (
                        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-md border-2 border-emerald-400/40 p-6 rounded-xl shadow-lg">
                            <p className="text-slate-200 text-center">No lab results available.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {labRecords.map((result) => (
                                <div 
                                    key={result.lab_test_id} 
                                    className="bg-gradient-to-br from-emerald-500/25 to-teal-500/25 backdrop-blur-md border-2 border-emerald-400/50 p-5 rounded-xl shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <ClipboardDocumentListIcon className="w-7 h-7 text-emerald-300 flex-shrink-0" />
                                            <div>
                                                <p className="font-bold text-lg text-emerald-100">
                                                    {result.test_name}
                                                </p>
                                                <p className="text-xs text-emerald-200/70">
                                                    {formatDate(result.test_date)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-emerald-400/30">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-emerald-200">Result:</span>
                                            <p className={`text-2xl font-bold ${getResultColor(result.result_value, result.normal_range)}`}>
                                                {result.result_value} {result.unit}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-sm text-emerald-200">Normal Range:</span>
                                            <span className="text-sm font-semibold text-emerald-100">
                                                {result.normal_range}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- EMR Records Section --- */}
                <div>
                    <h2 className="text-3xl font-bold text-purple-300 mb-6 pb-3 flex items-center">
                        <DocumentTextIcon className="w-8 h-8 mr-3" />
                        Visit History
                    </h2>
                    
                    {emrRecords.length === 0 ? (
                        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border-2 border-purple-400/40 p-6 rounded-xl shadow-lg">
                            <p className="text-slate-200 text-center">No visit records found.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {emrRecords.map((record) => (
                                <div 
                                    key={record.record_id} 
                                    className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-l-4 border-purple-400 p-6 rounded-xl shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300"
                                >
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4 pb-3 border-b border-purple-400/30">
                                        <h3 className="text-2xl font-bold text-purple-100">
                                            {record.diagnosis}
                                        </h3>
                                        <span className="text-sm font-medium text-purple-200 bg-purple-500/30 px-3 py-1 rounded-full border border-purple-400/40">
                                            {new Date(record.visit_date).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    
                                    {/* Details */}
                                    <div className="space-y-3 mb-4">
                                        <p className="text-slate-100">
                                            <span className="font-semibold text-purple-300">Prescriptions:</span>{' '}
                                            {record.prescriptions || 'N/A'}
                                        </p>
                                        <p className="text-slate-100">
                                            <span className="font-semibold text-purple-300">Notes:</span>{' '}
                                            {record.notes || 'No additional notes.'}
                                        </p>
                                        <p className="text-purple-200 text-sm">
                                            <span className="font-semibold">Doctor:</span> Dr. {record.doctor_name}
                                        </p>
                                    </div>

                                    {/* File Links
                                    {record.file_links && (record.file_links as FileLink[]).length > 0 && (
                                        <div className="pt-4 border-t border-purple-400/30">
                                            <p className="font-semibold text-purple-300 mb-3">
                                                Attached Documents:
                                            </p>
                                            <div className="flex flex-wrap gap-3">
                                                {(record.file_links as FileLink[]).map((file, index) => (
                                                    <a 
                                                        key={index}
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-4 py-2 bg-purple-500/30 border-2 border-purple-400/50 rounded-full text-sm font-medium text-purple-100 hover:bg-purple-500/40 hover:border-purple-300/70 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/40"
                                                    >
                                                        {getFileIcon(file.type)}
                                                        {file.type === 'DoctorNote' ? 'Prescription' : 'Lab Results'}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )} */}
                                    {/* File Links */}
                                    {record.file_links && (record.file_links as FileLink[]).length > 0 && (
                                    <div className="pt-4 border-t border-purple-400/30">
                                        <p className="font-semibold text-purple-300 mb-3">
                                        Attached Documents:
                                        </p>
                                        <div className="flex flex-col gap-6">
                                        {(record.file_links as FileLink[]).map((file, index) => {
                                            const isPDF = file.url.endsWith('.pdf');
                                            const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file.url);

                                            return (
                                            <div key={index} className="bg-purple-800/20 border border-purple-400/30 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                <span className="font-semibold text-purple-300">
                                                    {file.type === 'DoctorNote' ? 'Prescription' : 'Lab Results'}
                                                </span>
                                                <div className="flex gap-2">
                                                    {/* Preview Button */}
                                                    <a
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1 bg-purple-500/30 border border-purple-400/50 rounded-full text-sm text-purple-100 hover:bg-purple-500/40 transition-all duration-300"
                                                    >
                                                    Preview
                                                    </a>
                                                    {/* Download Button */}
                                                    <button
                                                    onClick={() => handleDownload(file.url, `${file.type}.pdf`)}
                                                    className="px-3 py-1 bg-green-500/30 border border-green-400/50 rounded-full text-sm text-green-100 hover:bg-green-500/40 transition-all duration-300"
                                                    >
                                                    Download
                                                    </button>
                                                </div>
                                                </div>

                                                {/* Inline Preview */}
                                                {isPDF && (
                                                <iframe
                                                    src={file.url}
                                                    className="w-full h-[400px] border border-purple-400/50 rounded-lg"
                                                />
                                                )}
                                                {isImage && (
                                                <img
                                                    src={file.url}
                                                    alt="Document Preview"
                                                    className="w-full max-h-[400px] object-contain rounded-lg border border-purple-400/50"
                                                />
                                                )}
                                            </div>
                                            );
                                        })}
                                        </div>
                                    </div>
                                    )}

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
