'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Department {
    department_id: number;
    name: string;
    description: string;
}

export default function AdminDepartmentsPage() {
    const router = useRouter();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // State for CRUD form
    const [formState, setFormState] = useState({
        id: null as number | null,
        name: '',
        description: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [adminName, setAdminName] = useState('Admin User'); 

    const adminNavLinks = [
        { name: 'Dashboard', href: '/dashboard/admin' },
        { name: 'User Management', href: '/dashboard/admin/doctors' },
        { name: 'Settings', href: '/dashboard/admin/settings' },
    ];

    // --- Fetch Departments ---
    const fetchDepartments = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            // NOTE: In a final app, the admin name fetching would be separate
            const response = await axios.get('http://localhost:5000/api/admin/departments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDepartments(response.data);
        } catch (error) {
            console.error('Failed to fetch departments:', error);
            // On failure, navigate back to admin dashboard
            router.push('/dashboard/admin');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, [router]);

    // --- Form Handlers ---
    const handleEdit = (dept: Department) => {
        setFormState({
            id: dept.department_id,
            name: dept.name,
            description: dept.description,
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setFormState({ id: null, name: '', description: '' });
        setIsEditing(false);
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Are you sure you want to delete the department: ${name}?`)) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await axios.delete(`http://localhost:5000/api/admin/departments/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Department deleted successfully!');
            fetchDepartments(); // Refresh the list
        } catch (error) {
            console.error('Deletion error:', error);
            alert('Failed to delete department. Check if doctors/staff are still assigned.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!formState.name || !token) return;

        const url = isEditing ? 
            `http://localhost:5000/api/admin/departments/${formState.id}` : 
            'http://localhost:5000/api/admin/departments';
        const method = isEditing ? axios.put : axios.post;

        try {
            await method(url, { name: formState.name, description: formState.description }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert(`Department ${isEditing ? 'updated' : 'created'} successfully!`);
            handleCancel(); // Clear form
            fetchDepartments(); // Refresh list
        } catch (error) {
            alert(`Failed to ${isEditing ? 'update' : 'create'} department. Check console for details.`);
            console.error('Submission error:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold">Loading Departments...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Admin Portal" navLinks={adminNavLinks} userName={adminName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">{isEditing ? 'Edit Existing Department' : 'Department Management'}</h1>

                {/* --- Add/Edit Department Form --- */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-t-4 border-indigo-500">
                    <h2 className="text-2xl font-semibold mb-4">{isEditing ? `Editing: ${formState.name}` : 'Add New Department'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Department Name</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formState.name} 
                                onChange={(e) => setFormState({...formState, name: e.target.value})} 
                                required 
                                className="w-full p-3 border rounded-md" 
                                placeholder="e.g., Cardiology, Radiology"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Description (Optional)</label>
                            <textarea 
                                name="description"
                                value={formState.description} 
                                onChange={(e) => setFormState({...formState, description: e.target.value})} 
                                rows={2}
                                className="w-full p-3 border rounded-md"
                            ></textarea>
                        </div>
                        <div className="flex space-x-4">
                            <button type="submit" className={`flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-300`}>
                                {isEditing ? 'Save Changes' : 'Create Department'}
                            </button>
                            {isEditing && (
                                <button type="button" onClick={handleCancel} className="py-3 px-6 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400 transition duration-300">
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* --- Existing Departments List --- */}
                <h2 className="text-2xl font-semibold mb-4">Existing Departments ({departments.length})</h2>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {departments.map((dept) => (
                                <tr key={dept.department_id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.department_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{dept.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.description || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-2">
                                        <button 
                                            onClick={() => handleEdit(dept)}
                                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(dept.department_id, dept.name)}
                                            className="text-red-600 hover:text-red-900 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}