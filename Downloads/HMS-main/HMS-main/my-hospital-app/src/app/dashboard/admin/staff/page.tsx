'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface StaffSummary {
    id: number;
    name: string;
    email: string;
    designation: string;
    user_id: number; // CRITICAL: Added user_id here
}

const ALL_DESIGNATIONS = ['Receptionist', 'Lab Technician', 'Pharmacist', 'Unassigned'];

export default function AdminStaffManagementPage() {
    const router = useRouter();
    const [staff, setStaff] = useState<StaffSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [adminName, setAdminName] = useState('Admin User'); 
    
    // States for inline editing
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ 
        name: '', 
        email: '', 
        designation: '', 
        user_id: 0, 
        staff_id: 0 
    });

    // Admin navigation links
    const adminNavLinks = [
        { name: 'Dashboard', href: '/dashboard/admin' },
        { name: 'Doctors', href: '/dashboard/admin/doctors' },
        { name: 'Patients', href: '/dashboard/admin/patients' },
        { name: 'Staff', href: '/dashboard/admin/staff' },
    ];

    // --- Data Fetching ---
    const fetchStaff = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/api/admin/staff', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStaff(response.data);
        } catch (error) {
            console.error('Failed to fetch staff data:', error);
            alert('Access denied or failed to load data.');
            router.push('/dashboard/admin');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [router]);


    // --- CRUD Handlers ---

    const handleEditClick = (member: StaffSummary) => {
        setEditingId(member.id);
        setEditForm({
            name: member.name,
            email: member.email,
            designation: member.designation,
            user_id: member.user_id,
            staff_id: member.id,
        });
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token || !editingId) return;

        // Validation Check
        if (!editForm.name || !editForm.email || !editForm.designation) {
            alert("All fields must be filled.");
            return;
        }

        try {
            // CRITICAL: Call the backend PUT endpoint with the full payload
            const response = await axios.put(`http://localhost:5000/api/admin/staff/${editingId}`, {
                name: editForm.name,
                email: editForm.email,
                designation: editForm.designation,
                user_id: editForm.user_id, // Pass the User ID to update the User table
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const updatedData = response.data;
            
            // Update local state immediately after successful save
            setStaff(staff.map(member => 
                member.id === editingId ? { 
                    ...member, 
                    name: updatedData.name, 
                    email: updatedData.email,
                    designation: updatedData.designation 
                } : member
            ));
            
            setEditingId(null); // Exit editing mode
            alert('Staff profile updated successfully!');

        } catch (error) {
            console.error('Update failed:', error);
            alert('Failed to save changes. Check server logs.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold">Loading Staff Directory...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Admin Portal" navLinks={adminNavLinks} userName={adminName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold mb-8 text-gray-800">Staff Management</h1>
                
                {staff.length === 0 ? (
                    <div className="bg-white p-10 rounded-lg shadow-md text-center">
                        <p className="text-xl text-gray-600">No staff members found in the system.</p>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {staff.map((member) => (
                                    <tr key={member.id} className={editingId === member.id ? 'bg-indigo-50' : 'hover:bg-gray-50'}>
                                        
                                        {/* NAME CELL */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {editingId === member.id ? (
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                    className="p-1 border rounded-md"
                                                />
                                            ) : (
                                                <span className="text-gray-900">{member.name}</span>
                                            )}
                                        </td>
                                        
                                        {/* EMAIL CELL */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {editingId === member.id ? (
                                                <input
                                                    type="email"
                                                    value={editForm.email}
                                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                                    className="p-1 border rounded-md"
                                                />
                                            ) : (
                                                <span className="text-gray-500">{member.email}</span>
                                            )}
                                        </td>
                                        
                                        {/* DESIGNATION CELL */}
                                        <td className="px-6 py-3 whitespace-nowrap text-sm">
                                            {editingId === member.id ? (
                                                <select
                                                    value={editForm.designation}
                                                    onChange={(e) => setEditForm({...editForm, designation: e.target.value})}
                                                    className="p-1 border rounded-md text-gray-900 focus:ring-indigo-500"
                                                >
                                                    {ALL_DESIGNATIONS.map(d => (
                                                        <option key={d} value={d}>{d}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="text-gray-900">{member.designation}</span>
                                            )}
                                        </td>

                                        {/* ACTIONS CELL */}
                                        <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            {editingId === member.id ? (
                                                <>
                                                    <button 
                                                        onClick={() => handleSave()}
                                                        className="text-green-600 hover:text-green-900 font-semibold"
                                                    >
                                                        Save
                                                    </button>
                                                    <button 
                                                        onClick={() => setEditingId(null)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <button 
                                                    onClick={() => handleEditClick(member)}
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

