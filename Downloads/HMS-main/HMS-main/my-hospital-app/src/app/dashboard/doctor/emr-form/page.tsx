// // src/app/dashboard/doctor/emr-form/page.tsx
// 'use client';

// import DashboardNavbar from '../../../../components/DashboardNavbar';
// import { useState } from 'react';
// import axios from 'axios';

// // NOTE: We need a way to pass patientId and doctorId (from JWT) to this form.
// // For testing, we'll use placeholders.

// export default function NewEMRPage() {
//     const [file, setFile] = useState<File | null>(null);
//     const [diagnosis, setDiagnosis] = useState('');
//     const [notes, setNotes] = useState('');
//     const [prescriptions, setPrescriptions] = useState('');
//     const [uploadStatus, setUploadStatus] = useState('');
//     const [uploadedFile, setUploadedFile] = useState<any>(null); // Stores Cloudinary response

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) {
//             setFile(e.target.files[0]);
//             setUploadedFile(null); // Reset upload status if file changes
//             setUploadStatus('');
//         }
//     };

//     const handleUpload = async () => {
//         if (!file) return;
//         setUploadStatus('Uploading...');

//         const formData = new FormData();
//         formData.append('document', file); // 'document' must match upload.single('document')
        
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.post('http://localhost:5000/api/doctor/upload/document', formData, {
//                 headers: { 
//                     'Authorization': `Bearer ${token}`,
//                     // Content-Type is set automatically for FormData
//                 },
//             });
            
//             setUploadedFile(response.data); // Stores public_id and URL
//             setUploadStatus('Upload Complete!');
//             return response.data;
//         } catch (error) {
//             setUploadStatus('Upload Failed.');
//             console.error('File Upload Error:', error);
//             return null;
//         }
//     };
    
//     // --- Combined Submission: Upload then Save EMR ---
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!diagnosis) return alert('Diagnosis is required.');

//         // Placeholders: In a real flow, these IDs would be selected from a patient list.
//         const patientId = 1; 
//         const doctorId = 101; 

//         // 1. Handle File Upload if a new file is selected
//         let fileMetadata = uploadedFile;
//         if (file && !uploadedFile) {
//             fileMetadata = await handleUpload();
//             if (!fileMetadata) return; // Stop if upload failed
//         }
        
//         const token = localStorage.getItem('token');

//         // 2. Save EMR record
//         try {
//             await axios.post('http://localhost:5000/api/doctor/emr', {
//                 patientId,
//                 doctorId,
//                 diagnosis,
//                 prescriptions,
//                 notes,
//                 fileMetadata, // Sends the Cloudinary URL/ID
//             }, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             alert('EMR created and document linked successfully!');
//         } catch (error) {
//             console.error('EMR Save Error:', error);
//             alert('Failed to save EMR. Check server console.');
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <DashboardNavbar title="Doctor Portal" navLinks={[]} userName="Dr. EMR" />
//             <main className="container mx-auto py-12 px-6">
//                 <h1 className="text-4xl font-bold mb-8">Create New EMR & Document Linkage</h1>
//                 <p className="mb-6 text-gray-600">Patient ID: **{1}** (Placeholder) | Doctor ID: **{101}** (Placeholder)</p>

//                 <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto space-y-6">
                    
//                     <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Medical Notes</h2>
                    
//                     {/* Diagnosis */}
//                     <div>
//                         <label className="block text-gray-700 font-semibold mb-2">Final Diagnosis</label>
//                         <textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} rows={2} className="w-full p-3 border rounded-md" required />
//                     </div>

//                     {/* Prescriptions */}
//                     <div>
//                         <label className="block text-gray-700 font-semibold mb-2">Prescriptions (Medication List)</label>
//                         <textarea value={prescriptions} onChange={(e) => setPrescriptions(e.target.value)} rows={3} className="w-full p-3 border rounded-md" />
//                     </div>

//                     {/* Notes */}
//                     <div>
//                         <label className="block text-gray-700 font-semibold mb-2">Internal Doctor Notes</label>
//                         <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full p-3 border rounded-md" />
//                     </div>

//                     {/* File Upload Section */}
//                     <div className="pt-4 border-t">
//                         <h2 className="text-xl font-bold text-gray-800 mb-4">Attach Document (Lab Results / Prescription PDF)</h2>
                        
//                         <input type="file" onChange={handleFileChange} className="w-full p-3 border rounded-md bg-gray-50" />
                        
//                         {uploadStatus && <p className={`text-sm mt-2 ${uploadStatus.includes('Complete') ? 'text-green-600' : uploadStatus.includes('Failed') ? 'text-red-600' : 'text-yellow-600'}`}>{uploadStatus}</p>}
                        
//                         {uploadedFile && (
//                             <p className="text-sm text-blue-600 mt-2">
//                                 Document Ready: **{uploadedFile.public_id}** (<a href={uploadedFile.url} target="_blank" rel="noopener noreferrer" className="underline">View Link</a>)
//                             </p>
//                         )}
//                     </div>

//                     <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
//                         Finalize EMR & Save
//                     </button>
//                 </form>
//             </main>
//         </div>
//     );
// }

'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface PatientSummary {
    patient_id: number;
    name: string;
}

interface LabTestCatalog {
    test_id: number;
    test_name: string;
    normal_range: string;
}

interface SelectedLabTest {
    localId: number;
    testId: string; 
    test_name: string; 
    normal_range: string;
}

export default function NewEMRPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');
    const [prescriptions, setPrescriptions] = useState('');
    const [labCatalog, setLabCatalog] = useState<LabTestCatalog[]>([]);
    const [selectedLabTests, setSelectedLabTests] = useState<SelectedLabTest[]>([]);
    
    // Dynamic State
    const [patients, setPatients] = useState<PatientSummary[]>([]);
    const [doctorId, setDoctorId] = useState<number | null>(null);
    const [selectedPatientId, setSelectedPatientId] = useState(''); // Stores the selected patient_id
    const [doctorName, setDoctorName] = useState('Dr. Loading...');
    
    // UI State
    const [uploadStatus, setUploadStatus] = useState('');
    const [uploadedFile, setUploadedFile] = useState<any>(null); 
    const [isLoading, setIsLoading] = useState(true);

    // --- 1. Fetch Doctor ID and Patient List on Load ---
    // useEffect(() => {
    //     const fetchInitialData = async () => {
    //         const token = localStorage.getItem('token');
    //         if (!token) { router.push('/login'); return; }

    //         try {
    //             // Fetch patient list and profile in parallel
    //             const [patientsResponse, profileResponse] = await Promise.all([
    //                 axios.get('http://localhost:5000/api/doctor/patients', { headers: { Authorization: `Bearer ${token}` } }),
    //                 axios.get('http://localhost:5000/api/doctor/profile', { headers: { Authorization: `Bearer ${token}` } }),
    //             ]);
                
    //             setPatients(patientsResponse.data);
                
    //             // CRITICAL: Automatically fetch doctor's name and ID from profile response
    //             setDoctorName(profileResponse.data.name);
    //             const fetchedDoctorId = profileResponse.data.Doctor.doctor_id;
    //             setDoctorId(fetchedDoctorId);

    //         } catch (error) {
    //             console.error('Failed to fetch initial data:', error);
    //             alert('Failed to load data. Please check network or log in again.');
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
    //     fetchInitialData();
    // }, [router]);
    useEffect(() => {
    const fetchInitialData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            // CRITICAL: Fetch all three required data sets concurrently
            const [patientsResponse, profileResponse, catalogResponse] = await Promise.all([
                // 1. Fetch Patient List
                axios.get('http://localhost:5000/api/doctor/patients', { headers: { Authorization: `Bearer ${token}` } }),
                
                // 2. Fetch Doctor Profile (for name and doctor_id)
                axios.get('http://localhost:5000/api/doctor/profile', { headers: { Authorization: `Bearer ${token}` } }),
                
                // 3. Fetch Lab Catalog
                axios.get('http://localhost:5000/api/doctor/lab-catalog', { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            
            // --- Process Responses ---
            
            // Patient List
            setPatients(patientsResponse.data);
            
            // Doctor Profile (CRITICAL: Extract Doctor ID)
            setDoctorName(profileResponse.data.name);
            const fetchedDoctorId = profileResponse.data.Doctor.doctor_id;
            setDoctorId(fetchedDoctorId); // Set the doctor ID
            
            // Lab Catalog
            setLabCatalog(catalogResponse.data);
            
        } catch (error) {
            console.error('Failed to fetch initial data:', error);
            // On any failure, alert user and handle session
            alert('Failed to load data. Please check network or log in again.');
        } finally {
            setIsLoading(false);
        }
    };
    fetchInitialData();
}, [router]);


    // --- 2. Cloudinary Upload Handler (unchanged) ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setUploadedFile(null); 
            setUploadStatus('');
        }
    };

       const handleRemoveTest = (localId: number) => {
        // Filters the array, keeping only the elements whose localId does NOT match 
        // the ID of the test row being removed. This creates a new array reference, 
        // triggering a re-render.
        setSelectedLabTests(selectedLabTests.filter(test => test.localId !== localId));
    };

    // --- Lab Test Handlers ---
    const handleAddTest = () => {
        setSelectedLabTests([...selectedLabTests, { localId: Date.now(), testId: '', test_name: '', normal_range: '' }]);
    };

        const handleTestChange = (localId: number, testId: string) => {
        // Find the selected item in the catalog
        const selectedItem = labCatalog.find(item => String(item.test_id) === testId);
        
        setSelectedLabTests(selectedLabTests.map(test => 
            test.localId === localId ? { 
                ...test, 
                testId: testId, // Store the catalog ID
                test_name: selectedItem ? selectedItem.test_name : '',
                normal_range: selectedItem ? selectedItem.normal_range : '',
            } : test
        ));
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploadStatus('Uploading...');

        const formData = new FormData();
        formData.append('document', file); 
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/doctor/upload/document', formData, {
                headers: { 'Authorization': `Bearer ${token}`, },
            });
            
            setUploadedFile(response.data);
            setUploadStatus('Upload Complete!');
            return response.data;
        } catch (error) {
            setUploadStatus('Upload Failed.');
            console.error('File Upload Error:', error);
            return null;
        }
    };
    
    // --- 3. Combined Submission: Upload then Save EMR ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validation check uses dynamic IDs
        if (!diagnosis || !selectedPatientId ) return alert('Diagnosis and patient selection are required.');

        let fileMetadata = uploadedFile;
        
        if (file && !uploadedFile) {
            fileMetadata = await handleUpload();
            if (!fileMetadata) return; 
        }
        
        const token = localStorage.getItem('token');
        // 1. Prepare Lab Test Array for Backend
        const labRequests = selectedLabTests
            .filter(t => t.testId) // Only send tests that were actually selected
            .map(t => ({
                testId: t.testId, // CRITICAL: Send the test_catalog_id
            }));

        try {
            await axios.post('http://localhost:5000/api/doctor/emr', {
                patientId: selectedPatientId, // DYNAMICALLY SELECTED
                doctorId: doctorId,           // DYNAMICALLY FETCHED
                diagnosis,
                prescriptions,
                notes,
                fileMetadata, 
                labRequests: labRequests,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('EMR created and document linked successfully!');
            
            // Clear form state
            setDiagnosis('');
            setNotes('');
            setPrescriptions('');
            setFile(null);
            setUploadedFile(null);
            setSelectedPatientId('');
        } catch (error) {
            console.error('EMR Save Error:', error);
            alert('Failed to save EMR. Check server console.');
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-100"><h1 className="text-2xl font-bold">Loading Patient Data...</h1></div>;
    }


    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Doctor Portal" navLinks={[]} userName={doctorName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold mb-8">Create New EMR & Document Linkage</h1>
                <p className="mb-6 text-gray-600">Attending Physician: **Dr. {doctorName}**</p>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto space-y-6">
                    
                    {/* CRITICAL: PATIENT SELECTION DROPDOWN (Dynamic PatientId) */}
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Select Patient</h2>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Patient</label>
                        <select
                            value={selectedPatientId}
                            onChange={(e) => setSelectedPatientId(String(e.target.value))}
                            className="w-full p-3 border rounded-md"
                            required
                        >
                            <option value="">-- Choose an Assigned Patient --</option>
                            {patients.map(p => (
                                <option key={p.patient_id} value={p.patient_id}>
                                    (name: {p.name}) (ID: {p.patient_id})
                                </option>
                            ))}
                        </select>
                        {patients.length === 0 && <p className="text-red-500 mt-1">No patients assigned to your schedule yet.</p>}
                    </div>

                    <h2 className="text-xl font-bold text-gray-800 border-b pb-2 pt-4">Medical Notes</h2>
                    
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

                    {/* --- LAB REQUEST SECTION (JSX update) --- */}
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-2 pt-4">Lab Tests Ordered</h2>
                    <div className="space-y-3">
                        {selectedLabTests.map((test, index) => (
                            <div key={test.localId} className="flex space-x-3 items-center">
                                <select
                                    value={test.testId}
                                    onChange={(e) => handleTestChange(test.localId, e.target.value)}
                                    className="flex-1 p-2 border rounded-md"
                                >
                                    <option value="">-- Select Lab Test --</option>
                                    {labCatalog.map(item => (
                                        <option key={item.test_id} value={item.test_id}>
                                            {item.test_name} (Range: {item.normal_range})
                                        </option>
                                    ))}
                                </select>
                                <span className="text-sm text-gray-500 w-1/3">Range: {test.normal_range || 'N/A'}</span>
                                <button type="button" onClick={() => handleRemoveTest(test.localId)} className="text-red-500 hover:text-red-700">
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddTest} className="text-blue-600 hover:text-blue-800 font-semibold">
                            + Add Another Test
                        </button>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Internal Doctor Notes</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full p-3 border rounded-md" />
                    </div>

                    {/* File Upload Section */}
                    <div className="pt-4 border-t">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Attach Document (Lab Results / Prescription PDF)</h2>
                        
                        <input type="file" onChange={handleFileChange} className="w-full" name="document" />
                        
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