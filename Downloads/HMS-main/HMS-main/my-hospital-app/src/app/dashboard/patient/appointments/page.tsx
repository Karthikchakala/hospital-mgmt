// 'use client';

// import { useState, useEffect } from 'react';
// import DashboardNavbar from '../../../../components/DashboardNavbar';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// interface Department {
//     department_id: number;
//     name: string;
// }

// interface Doctor {
//     doctor_id: number;
//     name: string;
//     specialization: string;
// }

// interface UserProfile {
//     name: string;
// }

// export default function AppointmentsPage() {
//     const router = useRouter();
//     const [departments, setDepartments] = useState<Department[]>([]);
//     const [doctors, setDoctors] = useState<Doctor[]>([]);
//     const [timeSlots, setTimeSlots] = useState<string[]>([]);
//     const [price, setPrice] = useState(0);

//     const [selectedDepartment, setSelectedDepartment] = useState('');
//     const [selectedDoctor, setSelectedDoctor] = useState('');
//     const [selectedDate, setSelectedDate] = useState('');
//     const [selectedTime, setSelectedTime] = useState('');
//     const [reason, setReason] = useState('');
    
//     const [isLoading, setIsLoading] = useState(true);
//     const [userName, setUserName] = useState('');

//     // Define navigation links for the navbar
//     const patientNavLinks = [
//         { name: 'Appointments', href: '/dashboard/patient/appointments' },
//         { name: 'Profile', href: '/dashboard/patient/profile' },
//         { name: 'Bills', href: '/dashboard/patient/bills' },
//         { name: 'History', href: '/dashboard/patient/medical-history' },
//     ];

//     // Fetch user data and departments when the page loads
//     useEffect(() => {
//         const fetchData = async () => {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 router.push('/login');
//                 return;
//             }

//             try {
//                 // Fetch user profile data to get the name
//                 const userResponse = await axios.get('http://localhost:5000/api/patient/profile', {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setUserName(userResponse.data.name);

//                 // Fetch departments
//                 const deptResponse = await axios.get('http://localhost:5000/api/patient/appointments/departments', {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setDepartments(deptResponse.data);
//             } catch (error) {
//                 console.error('Failed to fetch initial data:', error);
//                 localStorage.removeItem('token');
//                 router.push('/login');
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchData();
//     }, [router]);

//     // Fetch doctors when a department is selected
//     useEffect(() => {
//         if (selectedDepartment) {
//             const fetchDoctors = async () => {
//                 const token = localStorage.getItem('token');
//                 if (!token) return;

//                 try {
//                     const response = await axios.get(`http://localhost:5000/api/patient/appointments/doctors/${selectedDepartment}`, {
//                         headers: { Authorization: `Bearer ${token}` },
//                     });
//                     setDoctors(response.data.map((doc: any) => ({
//                         doctor_id: doc.doctor_id,
//                         name: doc.User.name,
//                         specialization: doc.specialization
//                     })));
//                 } catch (error) {
//                     console.error('Failed to fetch doctors:', error);
//                 }
//             };
//             fetchDoctors();
//         } else {
//             setDoctors([]);
//         }
//     }, [selectedDepartment]);

//     // Fetch time slots when a doctor and date are selected
//     useEffect(() => {
//         if (selectedDoctor && selectedDate) {
//             const fetchTimeSlots = async () => {
//                 const token = localStorage.getItem('token');
//                 if (!token) return;
//                 try {
//                     const response = await axios.get(`http://localhost:5000/api/patient/appointments/times/${selectedDoctor}/${selectedDate}`, {
//                         headers: { Authorization: `Bearer ${token}` },
//                     });
//                     setTimeSlots(response.data.timeSlots);
//                     setPrice(response.data.price);
//                 } catch (error) {
//                     console.error('Failed to fetch time slots:', error);
//                 }
//             };
//             fetchTimeSlots();
//         } else {
//             setTimeSlots([]);
//             setPrice(0);
//         }
//     }, [selectedDoctor, selectedDate]);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         const token = localStorage.getItem('token');
//         if (!token) return;

//         if (!selectedDepartment || !selectedDoctor || !selectedDate || !selectedTime || !reason) {
//             alert('Please fill out all fields.');
//             return;
//         }

//         try {
//             const response = await axios.post(
//                 'http://localhost:5000/api/patient/appointments',
//                 {
//                     doctorId: selectedDoctor,
//                     appointmentDate: selectedDate,
//                     appointmentTime: selectedTime,
//                     reason: reason,
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
            
//             alert('Appointment booked successfully!');
//             router.push('/dashboard/patient');
//             console.log('Booking response:', response.data);
//         } catch (error) {
//             console.error('Booking failed:', error);
//             alert('Failed to book appointment. Please try again.');
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center min-h-screen bg-gray-100">
//                 <h1 className="text-2xl font-bold">Loading...</h1>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <DashboardNavbar
//                 title="Patient Portal"
//                 navLinks={patientNavLinks}
//                 userName={userName}
//             />
//             <main className="container mx-auto py-12 px-6">
//                 <h1 className="text-4xl font-bold mb-8">Appointments</h1>
//                 <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
//                     <h2 className="text-2xl font-semibold mb-6">Book a New Appointment</h2>
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         <div>
//                             <label className="block text-gray-700 font-semibold mb-2">Select Department</label>
//                             <select
//                                 value={selectedDepartment}
//                                 onChange={(e) => {
//                                     setSelectedDepartment(e.target.value);
//                                     setSelectedDoctor('');
//                                     setSelectedDate('');
//                                     setSelectedTime('');
//                                 }}
//                                 className="w-full p-3 border border-gray-300 rounded-md"
//                             >
//                                 <option value="">-- Choose a Department --</option>
//                                 {departments.map(dept => (
//                                     <option key={dept.department_id} value={dept.department_id}>
//                                         {dept.name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div>
//                             <label className="block text-gray-700 font-semibold mb-2">Select Doctor</label>
//                             <select
//                                 value={selectedDoctor}
//                                 onChange={(e) => {
//                                     setSelectedDoctor(e.target.value);
//                                     setSelectedDate('');
//                                     setSelectedTime('');
//                                 }}
//                                 className="w-full p-3 border border-gray-300 rounded-md"
//                                 disabled={!selectedDepartment}
//                             >
//                                 <option value="">-- Choose a Doctor --</option>
//                                 {doctors.map(doctor => (
//                                     <option key={doctor.doctor_id} value={doctor.doctor_id}>
//                                         {doctor.name} - ({doctor.specialization})
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div>
//                             <label className="block text-gray-700 font-semibold mb-2">Select Date</label>
//                             <input
//                                 type="date"
//                                 value={selectedDate}
//                                 onChange={(e) => setSelectedDate(e.target.value)}
//                                 className="w-full p-3 border border-gray-300 rounded-md"
//                                 disabled={!selectedDoctor}
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700 font-semibold mb-2">Available Time Slots</label>
//                             <div className="flex flex-wrap gap-2">
//                                 {timeSlots.length > 0 ? (
//                                     timeSlots.map(time => (
//                                         <button
//                                             key={time}
//                                             type="button"
//                                             onClick={() => setSelectedTime(time)}
//                                             className={`px-4 py-2 border rounded-md transition-colors duration-200 ${
//                                                 selectedTime === time ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                                             }`}
//                                         >
//                                             {time}
//                                         </button>
//                                     ))
//                                 ) : (
//                                     <p className="text-gray-500">No time slots available for this date.</p>
//                                 )}
//                             </div>
//                         </div>
//                         {price > 0 && (
//                             <div className="flex justify-between items-center text-xl font-bold mt-4">
//                                 <span>Consultation Fee:</span>
//                                 <span className="text-blue-600">₹{price}</span>
//                             </div>
//                         )}
//                         <div>
//                             <label className="block text-gray-700 font-semibold mb-2">Reason for Appointment</label>
//                             <textarea
//                                 value={reason}
//                                 onChange={(e) => setReason(e.target.value)}
//                                 rows={3}
//                                 className="w-full p-3 border border-gray-300 rounded-md"
//                             />
//                         </div>
//                         <button
//                             type="submit"
//                             className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300"
//                             disabled={!selectedDoctor || !selectedDate || !selectedTime || !reason}
//                         >
//                             Book Appointment
//                         </button>
//                     </form>
//                 </div>
//             </main>
//         </div>
//     );
// }

'use client';

import { useState, useEffect } from 'react';
import DashboardNavbar from '../../../../components/DashboardNavbar';
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

interface UserProfile {
    name: string;
}

export default function AppointmentsPage() {
    const router = useRouter();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    const [price, setPrice] = useState(0);

    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [reason, setReason] = useState('');
    
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('');

    const patientNavLinks = [
        { name: 'Appointments', href: '/dashboard/patient/appointments' },
        { name: 'Profile', href: '/dashboard/patient/profile' },
        { name: 'Bills', href: '/dashboard/patient/bills' },
        { name: 'History', href: '/dashboard/patient/medical-history' },
    ];

    // --- 1. Fetch User Data and Departments ---
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                // Fetch profile data and departments in parallel
                const [userResponse, deptResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/patient/profile', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/patient/appointments/departments', { headers: { Authorization: `Bearer ${token}` } }),
                ]);
                
                setUserName(userResponse.data.name);
                setDepartments(deptResponse.data);
            } catch (error) {
                console.error('Failed to fetch initial data:', error);
                localStorage.removeItem('token');
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [router]);

    // --- 2. Fetch Doctors (Cascading Logic) ---
    useEffect(() => {
        if (selectedDepartment) {
            const fetchDoctors = async () => {
                const token = localStorage.getItem('token');
                if (!token) return;

                try {
                    // CRITICAL: API call sends the selected Department ID
                    const response = await axios.get(`http://localhost:5000/api/patient/appointments/doctors/${selectedDepartment}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    
                    // Maps the complex nested response to a clean Doctor interface
                    setDoctors(response.data.map((doc: any) => ({
                        doctor_id: doc.doctor_id,
                        name: doc.User.name, // Fetches name from the joined User table
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
    }, [selectedDepartment]);

    // --- 3. Fetch Time Slots ---
    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            const fetchTimeSlots = async () => {
                const token = localStorage.getItem('token');
                if (!token) return;
                try {
                    const response = await axios.get(`http://localhost:5000/api/patient/appointments/times/${selectedDoctor}/${selectedDate}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
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
    }, [selectedDoctor, selectedDate]);

    // --- Unified Change Handlers ---
    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDepartment(e.target.value);
        setSelectedDoctor('');
        setSelectedDate('');
        setSelectedTime('');
    };

    const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDoctor(e.target.value);
        setSelectedDate('');
        setSelectedTime('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return;

        if (!selectedDepartment || !selectedDoctor || !selectedDate || !selectedTime || !reason) {
            alert('Please fill out all fields.');
            return;
        }

        try {
            // CRITICAL: POST call to book the appointment
            await axios.post(
                'http://localhost:5000/api/patient/appointments',
                {
                    doctorId: selectedDoctor,
                    appointmentDate: selectedDate,
                    appointmentTime: selectedTime,
                    reason: reason,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            alert('Appointment booked successfully!');
            router.push('/dashboard/patient');
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Failed to book appointment. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold">Loading...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar
                title="Patient Portal"
                navLinks={patientNavLinks}
                userName={userName}
            />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold mb-8">Appointments</h1>
                <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-6">Book a New Appointment</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Department Selection */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Select Department</label>
                            <select
                                value={selectedDepartment}
                                onChange={handleDepartmentChange}
                                className="w-full p-3 border border-gray-300 rounded-md"
                            >
                                <option value="">-- Choose a Department --</option>
                                {departments.map(dept => (
                                    <option key={dept.department_id} value={dept.department_id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Doctor Selection */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Select Doctor</label>
                            <select
                                value={selectedDoctor}
                                onChange={handleDoctorChange}
                                className="w-full p-3 border border-gray-300 rounded-md"
                                // CRITICAL: Disabled until a department is selected AND doctors are loaded
                                disabled={!selectedDepartment || doctors.length === 0} 
                            >
                                <option value="">-- Choose a Doctor --</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.doctor_id} value={doctor.doctor_id}>
                                        {doctor.name} - ({doctor.specialization})
                                    </option>
                                ))}
                            </select>
                            {selectedDepartment && doctors.length === 0 && !selectedDoctor && (
                                <p className="text-sm text-red-500 mt-1">No doctors available in this department.</p>
                            )}
                        </div>
                        {/* Date Selection */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Select Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md"
                                disabled={!selectedDoctor}
                            />
                        </div>
                        {/* Time Slot Selection */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Available Time Slots</label>
                            <div className="flex flex-wrap gap-2">
                                {timeSlots.length > 0 ? (
                                    timeSlots.map(time => (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => setSelectedTime(time)}
                                            className={`px-4 py-2 border rounded-md transition-colors duration-200 ${
                                                selectedTime === time ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            {time}
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-gray-500">
                                        {selectedDate ? 'No time slots available for this date.' : 'Select a date to view slots.'}
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* Price Display */}
                        {price > 0 && (
                            <div className="flex justify-between items-center text-xl font-bold mt-4">
                                <span>Consultation Fee:</span>
                                <span className="text-blue-600">₹{price}</span>
                            </div>
                        )}
                        {/* Reason for Appointment */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Reason for Appointment</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-md"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300"
                            disabled={!selectedDoctor || !selectedDate || !selectedTime || !reason}
                        >
                            Book Appointment
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}