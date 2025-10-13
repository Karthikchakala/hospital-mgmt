'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface HospitalSettings {
    consultationFee: number;
    hospitalName: string;
    defaultCurrency: string;
    maxAppointmentsPerDay: number;
    id: number; // Include the primary key for update query efficiency (though limit(1) works too)
}

export default function AdminSettingsPage() {
    const router = useRouter();
    const [settings, setSettings] = useState<HospitalSettings | null>(null);
    const [initialSettings, setInitialSettings] = useState<HospitalSettings | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [adminName, setAdminName] = useState('Admin User'); 

    const adminNavLinks = [
        { name: 'Dashboard', href: '/dashboard/admin' },
        { name: 'User Management', href: '/dashboard/admin/doctors' },
        { name: 'Settings', href: '/dashboard/admin/settings' },
    ];

    // --- Data Fetching ---
    useEffect(() => {
        const fetchSettings = async () => {
            const token = localStorage.getItem('token');
            if (!token) { router.push('/login'); return; }

            try {
                // Fetch admin name and settings data in parallel
                const [profileResponse, settingsResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/profile', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/admin/settings', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                
                setAdminName(profileResponse.data.name);
                setSettings(settingsResponse.data);
                setInitialSettings(settingsResponse.data); // Save copy for cancel
            } catch (error) {
                console.error('Failed to fetch settings:', error);
                router.push('/dashboard/admin');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, [router]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Safely parse numbers, assuming they are always required
        const newValue = (name === 'consultationFee' || name === 'maxAppointmentsPerDay') ? parseInt(value) || 0 : value;
        setSettings({ ...settings!, [name]: newValue });
    };

    const handleCancel = () => {
        setSettings(initialSettings);
        setIsEditing(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token || !settings) return;

        try {
            await axios.put('http://localhost:5000/api/admin/settings', settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert('Settings saved successfully!');
            setInitialSettings(settings); // Update the reset state
            setIsEditing(false);
        } catch (error) {
            alert('Failed to save settings. Check console for details.');
            console.error('Submission error:', error);
        }
    };

    if (isLoading || !settings) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold">Loading Settings...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Admin Portal" navLinks={adminNavLinks} userName={adminName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">System Settings</h1>

                <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Financial & Operational Parameters</h2>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            
                            {/* Consultation Fee */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Default Consultation Fee ({settings.defaultCurrency})</label>
                                <input 
                                    type="number" 
                                    name="consultationFee"
                                    value={settings.consultationFee} 
                                    onChange={handleChange} 
                                    disabled={!isEditing}
                                    className="w-full p-3 border rounded-md" 
                                    required
                                />
                            </div>

                            {/* Hospital Name */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Hospital Name</label>
                                <input 
                                    type="text" 
                                    name="hospitalName"
                                    value={settings.hospitalName} 
                                    onChange={handleChange} 
                                    disabled={!isEditing}
                                    className="w-full p-3 border rounded-md"
                                />
                            </div>

                            {/* Max Appointments */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Max Appointments Per Day (Total)</label>
                                <input 
                                    type="number" 
                                    name="maxAppointmentsPerDay"
                                    value={settings.maxAppointmentsPerDay} 
                                    onChange={handleChange} 
                                    disabled={!isEditing}
                                    className="w-full p-3 border rounded-md"
                                    required
                                />
                            </div>
                            
                            {/* Default Currency */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Default Currency</label>
                                <select 
                                    name="defaultCurrency"
                                    value={settings.defaultCurrency} 
                                    onChange={handleChange} 
                                    disabled={!isEditing}
                                    className="w-full p-3 border rounded-md"
                                >
                                    <option value="INR">INR (Indian Rupee)</option>
                                    <option value="USD">USD (US Dollar)</option>
                                </select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {!isEditing ? (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300"
                            >
                                Edit System Settings
                            </button>
                        ) : (
                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="w-1/2 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition duration-300"
                                >
                                    Save Configuration
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleCancel()}
                                    className="w-1/2 py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </main>
        </div>
    );
}