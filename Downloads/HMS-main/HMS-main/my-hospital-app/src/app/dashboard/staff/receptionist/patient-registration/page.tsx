'use client';

import DashboardNavbar from '../../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Department {
    department_id: number;
    name: string;
}

interface Doctor {
    doctor_id: number;
    name: string;
    specialization: string;
}

export default function ReceptionistPatientRegistrationPage() {
    const router = useRouter();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    const [price, setPrice] = useState(0);

    const [formData, setFormData] = useState({
        // User fields
        name: '', email: '', 
        // Basic Patient Profile fields
        age: '', gender: '', street: '', city: '', state: '', country: '',
        // Appointment fields
        selectedDepartment: '', selectedDoctor: '', selectedDate: '', selectedTime: '', reason: '',
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [staffName, setStaffName] = useState('Receptionist User'); // Dynamic fetching needed for prod

    const staffNavLinks = [
        { name: 'Patient Reg', href: '/dashboard/staff/receptionist/patient-registration' },
        { name: 'Appointments', href: '/dashboard/staff/appointments' },
    ];
    
    // --- Data Fetching Logic (Same as Appointments Page, but simplified) ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const fetchData = async () => {
            try {
                // Fetch profile for navbar name (Assuming a profile API exists for Staff)
                const userResponse = await axios.get('http://localhost:5000/api/staff/profile', { headers: { Authorization: `Bearer ${token}` } });
                setStaffName(userResponse.data.name);

                // Fetch departments
                const deptResponse = await axios.get('http://localhost:5000/api/patient/appointments/departments', { headers: { Authorization: `Bearer ${token}` } });
                setDepartments(deptResponse.data);
            } catch (err) {
                console.error('Failed to fetch initial data:', err);
            }
        };
        fetchData();
    }, [router]);

    // Fetch doctors when a department is selected
    useEffect(() => {
        if (formData.selectedDepartment) {
            const fetchDoctors = async () => {
                const token = localStorage.getItem('token');
                try {
                    const response = await axios.get(`http://localhost:5000/api/patient/appointments/doctors/${formData.selectedDepartment}`, { headers: { Authorization: `Bearer ${token}` } });
                    setDoctors(response.data.map((doc: any) => ({
                        doctor_id: doc.doctor_id,
                        name: doc.User.name,
                        specialization: doc.specialization
                    })));
                } catch (error) {
                    console.error('Failed to fetch doctors:', error);
                }
            };
            fetchDoctors();
        } else {
            setDoctors([]);
        }
    }, [formData.selectedDepartment]);

    // Fetch time slots when a doctor and date are selected
    useEffect(() => {
        if (formData.selectedDoctor && formData.selectedDate) {
            const fetchTimeSlots = async () => {
                const token = localStorage.getItem('token');
                try {
                    const response = await axios.get(`http://localhost:5000/api/patient/appointments/times/${formData.selectedDoctor}/${formData.selectedDate}`, { headers: { Authorization: `Bearer ${token}` } });
                    setTimeSlots(response.data.timeSlots);
                    setPrice(response.data.price);
                } catch (error) {
                    console.error('Failed to fetch time slots:', error);
                }
            };
            fetchTimeSlots();
        } else {
            setTimeSlots([]);
            setPrice(0);
        }
    }, [formData.selectedDoctor, formData.selectedDate]);
    
    
    // --- Unified Change Handler ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const token = localStorage.getItem('token');
        if (!token) { setError('Session expired.'); setIsSubmitting(false); return; }

        // --- Frontend Validation Check ---
        if (!formData.name || !formData.email || !formData.selectedDoctor || !formData.selectedDate || !formData.selectedTime) {
            setError('Please fill out all required fields (Name, Email, Doctor, Date, Time).');
            setIsSubmitting(false);
            return;
        }

        try {
            // 1. Unified Registration and Booking Payload
            const payload = {
                // User Table Data
                name: formData.name,
                email: formData.email,
                role: 'patient', 
                
                // Patient Table Data (simplified)
                age: formData.age ? parseInt(formData.age) : null, 
                gender: formData.gender,
                street: formData.street,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                
                // Appointment Data
                doctorId: formData.selectedDoctor,
                appointmentDate: formData.selectedDate,
                appointmentTime: formData.selectedTime,
                reason: formData.reason || 'Initial consultation.',
            };
            
            const response = await axios.post('http://localhost:5000/api/staff/register-patient', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            // 2. Success Feedback
            const tempPassword = response.data.tempPassword;
            alert(`Patient ${formData.name} registered and appointment booked!\n\nTemp Password: ${tempPassword}`);
            
            // 3. Clear form
            setFormData({
                name: '', email: '', 
                age: '', gender: '', street: '', city: '', state: '', country: '',
                selectedDepartment: '', selectedDoctor: '', selectedDate: '', selectedTime: '', reason: '',
            });

        } catch (err) {
            setError('Registration failed. Check console for details.');
            console.error('Staff Patient Reg Error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Receptionist Portal" navLinks={staffNavLinks} userName={staffName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Patient Intake & Booking</h1>
                
                <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                    {error && <p className="text-red-500 text-center mb-4 p-2 border border-red-300 rounded-md">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* --- REGISTRATION DETAILS --- */}
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Patient Details</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-gray-700">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Email (Login ID)</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Age</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-3 border rounded-md" />
                            </div>
                            
                            <div>
                                <label className="block text-gray-700">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border rounded-md">
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-700">Street Address</label>
                                <input type="text" name="street" value={formData.street} onChange={handleChange} className="w-full p-3 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-gray-700">City</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-3 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-gray-700">State</label>
                                <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full p-3 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-gray-700">Country</label>
                                <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full p-3 border rounded-md" />
                            </div>
                        </div>

                        {/* --- APPOINTMENT BOOKING --- */}
                        <h2 className="text-xl font-bold text-gray-800 border-b pb-2 pt-4">Appointment Booking</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700">Select Department</label>
                                <select name="selectedDepartment" value={formData.selectedDepartment} onChange={handleChange} className="w-full p-3 border rounded-md">
                                    <option value="">-- Choose Department --</option>
                                    {departments.map(dept => (
                                        <option key={dept.department_id} value={dept.department_id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">Select Doctor</label>
                                <select name="selectedDoctor" value={formData.selectedDoctor} onChange={handleChange} className="w-full p-3 border rounded-md" disabled={!formData.selectedDepartment}>
                                    <option value="">-- Choose Doctor --</option>
                                    {doctors.map(doctor => (
                                        <option key={doctor.doctor_id} value={doctor.doctor_id}>
                                            Dr. {doctor.name} - ({doctor.specialization})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Date, Time, Reason */}
                            <div>
                                <label className="block text-gray-700">Appointment Date</label>
                                <input type="date" name="selectedDate" value={formData.selectedDate} onChange={handleChange} className="w-full p-3 border rounded-md" disabled={!formData.selectedDoctor} />
                            </div>
                            <div>
                                <label className="block text-gray-700">Time Slot</label>
                                <select name="selectedTime" value={formData.selectedTime} onChange={handleChange} className="w-full p-3 border rounded-md" disabled={!formData.selectedDate}>
                                    <option value="">-- Select Time --</option>
                                    {timeSlots.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-700">Reason for Visit</label>
                                <textarea name="reason" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} rows={2} className="w-full p-3 border rounded-md" />
                            </div>
                        </div>

                        {/* Price and Submit */}
                        {price > 0 && (
                            <div className="flex justify-end items-center text-xl font-bold mt-4">
                                Consultation Fee: <span className="text-blue-600 ml-2">₹{price}</span>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting || !formData.selectedTime}
                            className={`w-full py-3 text-white rounded-md font-semibold transition duration-300 ${isSubmitting || !formData.selectedTime ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {isSubmitting ? 'Registering & Booking...' : 'Register Patient & Book Appointment'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}