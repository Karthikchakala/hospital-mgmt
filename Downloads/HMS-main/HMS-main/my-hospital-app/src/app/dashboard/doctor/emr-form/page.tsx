// src/app/dashboard/doctor/emr-form/page.tsx
'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState } from 'react';
import axios from 'axios';

// NOTE: We need a way to pass patientId and doctorId (from JWT) to this form.
// For testing, we'll use placeholders.

export default function NewEMRPage() {
    const [file, setFile] = useState<File | null>(null);
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');
    const [prescriptions, setPrescriptions] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');
    const [uploadedFile, setUploadedFile] = useState<any>(null); // Stores Cloudinary response

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setUploadedFile(null); // Reset upload status if file changes
            setUploadStatus('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploadStatus('Uploading...');

        const formData = new FormData();
        formData.append('document', file); // 'document' must match upload.single('document')
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/doctor/upload/document', formData, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    // Content-Type is set automatically for FormData
                },
            });
            
            setUploadedFile(response.data); // Stores public_id and URL
            setUploadStatus('Upload Complete!');
            return response.data;
        } catch (error) {
            setUploadStatus('Upload Failed.');
            console.error('File Upload Error:', error);
            return null;
        }
    };
    
    // --- Combined Submission: Upload then Save EMR ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!diagnosis) return alert('Diagnosis is required.');

        // Placeholders: In a real flow, these IDs would be selected from a patient list.
        const patientId = 1; 
        const doctorId = 101; 

        // 1. Handle File Upload if a new file is selected
        let fileMetadata = uploadedFile;
        if (file && !uploadedFile) {
            fileMetadata = await handleUpload();
            if (!fileMetadata) return; // Stop if upload failed
        }
        
        const token = localStorage.getItem('token');

        // 2. Save EMR record
        try {
            await axios.post('http://localhost:5000/api/doctor/emr', {
                patientId,
                doctorId,
                diagnosis,
                prescriptions,
                notes,
                fileMetadata, // Sends the Cloudinary URL/ID
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('EMR created and document linked successfully!');
        } catch (error) {
            console.error('EMR Save Error:', error);
            alert('Failed to save EMR. Check server console.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Doctor Portal" navLinks={[]} userName="Dr. EMR" />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold mb-8">Create New EMR & Document Linkage</h1>
                <p className="mb-6 text-gray-600">Patient ID: **{1}** (Placeholder) | Doctor ID: **{101}** (Placeholder)</p>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto space-y-6">
                    
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Medical Notes</h2>
                    
                    {/* Diagnosis */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Final Diagnosis</label>
                        <textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} rows={2} className="w-full p-3 border rounded-md" required />
                    </div>

                    {/* Prescriptions */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Prescriptions (Medication List)</label>
                        <textarea value={prescriptions} onChange={(e) => setPrescriptions(e.target.value)} rows={3} className="w-full p-3 border rounded-md" />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Internal Doctor Notes</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full p-3 border rounded-md" />
                    </div>

                    {/* File Upload Section */}
                    <div className="pt-4 border-t">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Attach Document (Lab Results / Prescription PDF)</h2>
                        
                        <input type="file" onChange={handleFileChange} className="w-full p-3 border rounded-md bg-gray-50" />
                        
                        {uploadStatus && <p className={`text-sm mt-2 ${uploadStatus.includes('Complete') ? 'text-green-600' : uploadStatus.includes('Failed') ? 'text-red-600' : 'text-yellow-600'}`}>{uploadStatus}</p>}
                        
                        {uploadedFile && (
                            <p className="text-sm text-blue-600 mt-2">
                                Document Ready: **{uploadedFile.public_id}** (<a href={uploadedFile.url} target="_blank" rel="noopener noreferrer" className="underline">View Link</a>)
                            </p>
                        )}
                    </div>

                    <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                        Finalize EMR & Save
                    </button>
                </form>
            </main>
        </div>
    );
}