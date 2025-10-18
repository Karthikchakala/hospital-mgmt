// 'use client';

// import DashboardNavbar from '../../../../components/DashboardNavbar';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// interface DoctorSummary {
//     id: number;
//     name: string;
//     email: string;
//     specialization: string;
//     license: string;
// }

// export default function AdminDoctorManagementPage() {
//     const router = useRouter();
//     const [doctors, setDoctors] = useState<DoctorSummary[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const adminName = 'Admin User'; // Placeholder - fetch this via API later

//     // Admin navigation links
//     const adminNavLinks = [
//         { name: 'Dashboard', href: '/dashboard/admin' },
//         { name: 'User Management', href: '/dashboard/admin/doctors' },
//     ];

//     useEffect(() => {
//         const fetchDoctors = async () => {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 router.push('/login');
//                 return;
//             }

//             try {
//                 // Fetch the list of all doctors
//                 const response = await axios.get('http://localhost:5000/api/admin/doctors', {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setDoctors(response.data);
//             } catch (error) {
//                 console.error('Failed to fetch doctor data:', error);
//                 // Admin access will fail if not authenticated or not an admin
//                 alert('Access denied or failed to load data.');
//                 router.push('/dashboard/admin'); // Redirect back to admin dashboard
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchDoctors();
//     }, [router]);

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center min-h-screen bg-gray-100">
//                 <h1 className="text-2xl font-bold">Loading Doctor Directory...</h1>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <DashboardNavbar title="Admin Portal" navLinks={adminNavLinks} userName={adminName} />
//             <main className="container mx-auto py-12 px-6">
//                 <h1 className="text-4xl font-bold mb-8 text-gray-800">Doctor Management</h1>
                
//                 {doctors.length === 0 ? (
//                     <div className="bg-white p-10 rounded-lg shadow-md text-center">
//                         <p className="text-xl text-gray-600">No doctor profiles found in the system.</p>
//                     </div>
//                 ) : (
//                     <div className="bg-white p-6 rounded-lg shadow-md">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead>
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License No.</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {doctors.map((doctor) => (
//                                     <tr key={doctor.id}>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.name}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.specialization}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.license}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                             <Link href={`/dashboard/admin/doctors/${doctor.id}`} className="text-indigo-600 hover:text-indigo-900">
//                                                 View/Edit
//                                             </Link>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// }

'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DoctorSummary {
    id: number; // doctor_id
    user_id: number; // CRITICAL: The user_id is needed for the User table update
    name: string;
    email: string;
    specialization: string;
    license: string; // license_number
}

// Global list of specializations for the frontend (simplified)
const ALL_SPECIALIZATIONS = ['Pending', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine'];


export default function AdminDoctorManagementPage() {
    const router = useRouter();
    const [doctors, setDoctors] = useState<DoctorSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [adminName, setAdminName] = useState('Admin User'); // Placeholder
    
    // States for inline editing
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Omit<DoctorSummary, 'id' | 'user_id'> & { user_id: number, staff_id: number }>({
        name: '', 
        email: '', 
        specialization: '', 
        license: '', 
        user_id: 0,
        staff_id: 0, // This is not strictly necessary but keeps the structure clean
    } as any); // Use as any to satisfy initial complex type
    

    // Admin navigation links
    const adminNavLinks = [
        { name: 'Dashboard', href: '/dashboard/admin' },
        { name: 'User Management', href: '/dashboard/admin/doctors' },
        { name: 'Settings', href: '/dashboard/admin/settings' },
    ];

    // --- Data Fetching ---
    const fetchDoctors = async () => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/login'); return; }

        try {
            // NOTE: Add admin name fetching here if needed
            const response = await axios.get('http://localhost:5000/api/admin/doctors', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Ensure the backend sends user_id, which is essential for this feature
            setDoctors(response.data); 
        } catch (error) {
            console.error('Failed to fetch doctor data:', error);
            alert('Access denied or failed to load data.');
            router.push('/dashboard/admin'); 
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, [router]);


    // --- CRUD Handlers ---

    const handleEditClick = (doctor: DoctorSummary) => {
        setEditingId(doctor.id);
        // CRITICAL: Set all necessary fields for the form, including user_id
        setEditForm({
            name: doctor.name,
            email: doctor.email,
            specialization: doctor.specialization,
            license: doctor.license,
            user_id: doctor.user_id, 
            staff_id: doctor.id, // Using doctor.id as a reference
        });
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token || !editingId) return;

        // Validation Check
        if (!editForm.name || !editForm.email || !editForm.specialization) {
            alert("Name, Email, and Specialization are required.");
            return;
        }

        try {
            // CRITICAL: Call the backend PUT endpoint with the full payload
            const response = await axios.put(`http://localhost:5000/api/admin/doctors/${editingId}`, {
                name: editForm.name,
                email: editForm.email,
                specialization: editForm.specialization,
                license: editForm.license,
                user_id: editForm.user_id, // CRITICAL: Pass User ID to update the User table
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const updatedData = response.data;
            
            // Update local state immediately after successful save
            setDoctors(doctors.map(member => 
                member.id === editingId ? { 
                    ...member, 
                    name: updatedData.name, 
                    email: updatedData.email,
                    specialization: updatedData.specialization,
                    license: updatedData.license,
                } : member
            ));
            
            setEditingId(null); // Exit editing mode
            alert('Doctor profile updated successfully!');

        } catch (error) {
            console.error('Update failed:', error);
            alert('Failed to save changes. Check console.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold">Loading Doctor Directory...</h1>
            </div>
        );
    }

    // Helper to get and display data reliably from form state
    // const getFieldValue = (obj: any, field: string) => {
    //     // Safely convert values to string for input display, handling nulls/undefineds
    //     const value = obj[field];
    //     return value === null || value === undefined ? '' : String(value);
    // };

    // const DataCell = ({ member, field, isEditing, type = 'text' }: { 
    //     member: DoctorSummary, 
    //     field: keyof DoctorSummary, // This is the string key (e.g., "name", "email")
    //     isEditing: boolean, 
    //     type?: string 
    // }) => {

    //     const fieldString = field as string; // Safely treat the key as a string for bracket notation
    //     const currentValue = getFieldValue(editForm, fieldString);

    //     return (
    //         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
    //             {isEditing ? (
    //                 fieldString === 'specialization' ? (
    //                     // Special Dropdown for Specialization
    //                     <select
    //                         value={currentValue}
    //                         onChange={(e) => setEditForm(prev => ({ 
    //                             ...prev, 
    //                             [field]: e.target.value 
    //                         } as any))} // Use as any for the dynamic key update
    //                         className="p-1 border rounded-md w-full focus:ring-indigo-500"
    //                     >
    //                         {ALL_SPECIALIZATIONS.map(s => (
    //                             <option key={s} value={s}>{s}</option>
    //                         ))}
    //                     </select>
    //                 ) : (
    //                     // Standard Input Field
    //                     <input
    //                         type={type}
    //                         value={currentValue}
    //                         // CRITICAL FIX: Update state using the key name and the new value
    //                         onChange={(e) => {
    //                             setEditForm(prev => ({
    //                                 ...prev, 
    //                                 [field]: e.target.value
    //                             } as any)); // Use as any to assert the type for the dynamic key
    //                         }}
    //                         className="p-1 border rounded-md w-full focus:ring-indigo-500"
    //                     />
    //                 )
    //             ) : (
    //                 <span className="text-gray-900">{getFieldValue(member, fieldString)}</span>
    //             )}
    //         </td>
    //     );
    // };

    // Helper function to extract and convert the value based on the field name
const getFieldValue = (obj: any, field: string) => {
    // Safely convert values to string for input display
    const value = obj[field];
    return value === null || value === undefined ? '' : String(value);
};


// Reusable Cell Component for Read-only/Edit Mode
const DataCell = ({ member, field, isEditing, type = 'text' }: { 
    member: DoctorSummary, 
    field: keyof DoctorSummary, 
    isEditing: boolean, 
    type?: string 
}) => {

    const fieldString = field as string;
    const currentValue = getFieldValue(editForm, fieldString);

    return (
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            {isEditing ? (
                fieldString === 'specialization' ? (
                    // Special Dropdown for Specialization
                    <select
                        value={currentValue}
                        // FIX: Use the specific field key in the handler
                        onChange={(e) => setEditForm(prev => ({ ...prev, [field]: e.target.value as any}))}
                        className="p-1 border rounded-md w-full focus:ring-indigo-500"
                    >
                        {ALL_SPECIALIZATIONS.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                ) : (
                    // Standard Input Field
                    <input
                        type={type}
                        value={currentValue}
                        // FIX: Use the specific field key in the handler
                        onChange={(e) => {
                            setEditForm(prev => ({
                                ...prev, 
                                [field]: e.target.value as any
                            }));
                        }}
                        // CRITICAL: Adding the key attribute forces React to reuse the same DOM element
                        key={fieldString + member.id}
                        className="p-1 border rounded-md w-full focus:ring-indigo-500"
                    />
                )
            ) : (
                <span className="text-gray-900">{getFieldValue(member, fieldString)}</span>
            )}
        </td>
    );
};


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
                    <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License No.</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {doctors.map((doctor) => (
                                    <tr key={doctor.id} className={editingId === doctor.id ? 'bg-indigo-50' : 'hover:bg-gray-50'}>
                                        
                                        <DataCell member={doctor} field="name" isEditing={editingId === doctor.id} />
                                        <DataCell member={doctor} field="email" isEditing={editingId === doctor.id} type="email" />
                                        <DataCell member={doctor} field="specialization" isEditing={editingId === doctor.id} />
                                        <DataCell member={doctor} field="license" isEditing={editingId === doctor.id} />

                                        {/* ACTIONS CELL */}
                                        <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            {editingId === doctor.id ? (
                                                <>
                                                    <button 
                                                        onClick={handleSave}
                                                        className="text-green-600 hover:text-green-900 font-semibold"
                                                    >
                                                        <CheckIcon className="w-5 h-5 inline" /> Save
                                                    </button>
                                                    <button 
                                                        onClick={() => setEditingId(null)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <XMarkIcon className="w-5 h-5 inline" /> Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <button 
                                                    onClick={() => handleEditClick(doctor)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Edit
                                                </button>
                                            )}
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