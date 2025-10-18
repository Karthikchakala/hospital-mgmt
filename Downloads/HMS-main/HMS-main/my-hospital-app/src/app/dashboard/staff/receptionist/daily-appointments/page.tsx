// // src/app/dashboard/staff/appointments/page.tsx

// 'use client';

// import DashboardNavbar from '../../../../../components/DashboardNavbar';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// interface AppointmentSummary {
//     id: number;
//     time: string;
//     patientName: string;
//     doctorName: string;
//     reason: string;
//     status: string;
// }

// export default function StaffDailyAppointmentsPage() {
//     const router = useRouter();
//     const [appointments, setAppointments] = useState<AppointmentSummary[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [userName, setUserName] = useState('Receptionist'); 

//     const staffNavLinks = [
//         { name: 'Patient Reg', href: '/dashboard/staff/receptionist/patient-registration' },
//         { name: 'Appointments', href: '/dashboard/staff/appointments' },
//     ];

//     useEffect(() => {
//         const fetchSchedule = async () => {
//             const token = localStorage.getItem('token');
//             if (!token) { router.push('/login'); return; }

//             try {
//                 // Fetch profile data (for the navbar)
//                 const userResponse = await axios.get('http://localhost:5000/api/staff/profile', { headers: { Authorization: `Bearer ${token}` } });
//                 setUserName(userResponse.data.name);

//                 // Fetch today's appointments
//                 const apptsResponse = await axios.get('http://localhost:5000/api/staff/appointments/today', { headers: { Authorization: `Bearer ${token}` } });
//                 setAppointments(apptsResponse.data);
//             } catch (error) {
//                 console.error('Failed to fetch daily schedule:', error);
//                 localStorage.removeItem('token');
//                 router.push('/login'); 
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchSchedule();
//     }, [router]);

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center min-h-screen bg-gray-100">
//                 <h1 className="text-2xl font-bold">Loading Daily Schedule...</h1>
//             </div>
//         );
//     }

//     const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <DashboardNavbar title="Staff Portal" navLinks={staffNavLinks} userName={userName} />
//             <main className="container mx-auto py-12 px-6">
//                 <h1 className="text-4xl font-bold text-gray-800 mb-2">Today's Appointment Schedule</h1>
//                 <p className="text-lg text-gray-600 mb-8">{todayDate}</p>
                
//                 {appointments.length === 0 ? (
//                     <div className="bg-white p-10 rounded-lg shadow-md text-center">
//                         <p className="text-xl text-green-600">No appointments scheduled for today.</p>
//                     </div>
//                 ) : (
//                     <div className="bg-white p-6 rounded-lg shadow-md">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead>
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
//                                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {appointments.map((appt) => (
//                                     <tr key={appt.id} className="hover:bg-gray-50">
//                                         <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-blue-600">{appt.time}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appt.patientName}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appt.doctorName}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.reason}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-right">
//                                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                                                 appt.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
//                                             }`}>
//                                                 {appt.status}
//                                             </span>
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

// src/app/dashboard/staff/receptionist/daily-appointments/page.tsx

'use client';

import DashboardNavbar from '../../../../../components/DashboardNavbar'; // Correct path
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface AppointmentSummary {
    id: number;
    time: string;
    patientName: string;
    doctorName: string;
    reason: string;
    status: string;
}

export default function ReceptionistDailyAppointmentsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<AppointmentSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('Receptionist'); 

    // Navigation links for the Receptionist Portal
    const receptionistNavLinks = [
        { name: 'Patient Reg', href: '/dashboard/staff/receptionist/patient-registration' },
        // Link points to the specific, deep URL
        { name: 'Appointments', href: '/dashboard/staff/receptionist/daily-appointments' }, 
    ];

    useEffect(() => {
        const fetchSchedule = async () => {
            const token = localStorage.getItem('token');
            if (!token) { router.push('/login'); return; }

            try {
                // Fetch profile data (for the navbar)
                const userResponse = await axios.get('http://localhost:5000/api/staff/profile', { headers: { Authorization: `Bearer ${token}` } });
                setUserName(userResponse.data.name);

                // Fetch today's appointments from the backend API
                const apptsResponse = await axios.get('http://localhost:5000/api/staff/appointments/today', { headers: { Authorization: `Bearer ${token}` } });
                setAppointments(apptsResponse.data);
            } catch (error) {
                console.error('Failed to fetch daily schedule:', error);
                localStorage.removeItem('token');
                router.push('/login'); 
            } finally {
                setIsLoading(false);
            }
        };
        fetchSchedule();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold">Loading Daily Schedule...</h1>
            </div>
        );
    }

    const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Receptionist Portal" navLinks={receptionistNavLinks} userName={userName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Today's Appointment Schedule</h1>
                <p className="text-lg text-gray-600 mb-8">{todayDate}</p>
                
                {appointments.length === 0 ? (
                    <div className="bg-white p-10 rounded-lg shadow-md text-center">
                        <p className="text-xl text-green-600">No appointments scheduled for today.</p>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {appointments.map((appt) => (
                                    <tr key={appt.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-blue-600">{appt.time}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appt.patientName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appt.doctorName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.reason}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                appt.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {appt.status}
                                            </span>
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