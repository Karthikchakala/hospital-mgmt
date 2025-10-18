// src/app/dashboard/staff/receptionist/page.tsx

'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface StaffProfile {
  name: string;
  designation: string;
  // Include other necessary fields here
}

export default function ReceptionistDashboard() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<StaffProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const receptionistNavLinks = [
      { name: 'Register Patient', href: '/dashboard/staff/receptionist/patient-registration' },
      { name: 'Appointments', href: '/dashboard/staff/receptionist/daily-appointments' },
      { name: 'Help/Feedback', href: '/dashboard/feedback' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        // API call to fetch staff profile (name and designation)
        const response = await axios.get('http://localhost:5000/api/staff/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // Assuming the backend returns { name: '...', designation: '...' }
        setProfileData(response.data); 
      } catch (error) {
        console.error('Failed to fetch staff profile data:', error);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [router]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold">Loading Receptionist Portal...</h1>
      </div>
    );
  }

  // Handle case where profile data is not found
  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <h1 className="text-2xl font-bold">Error loading profile data.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Pass the dynamically fetched name to the navbar */}
      <DashboardNavbar title="Receptionist Portal" navLinks={receptionistNavLinks} userName={profileData.name} />
      <main className="container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Welcome, {profileData.name} ({profileData.designation})
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
            {/* Patient Registration Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <h2 className="text-2xl font-semibold mb-3">Patient Intake</h2>
                <p className="text-gray-600 mb-4">Start the full registration process for new hospital patients.</p>
                <Link href="/dashboard/staff/receptionist/patient-registration" className="text-blue-500 hover:underline font-semibold">
                    Start Registration &rarr;
                </Link>
            </div>
            {/* Appointments View Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <h2 className="text-2xl font-semibold mb-3">Daily Appointments</h2>
                <p className="text-gray-600 mb-4">View the current day's appointment list for all doctors.</p>
                <Link href="/dashboard/staff/receptionist/daily-appointments" className="text-green-500 hover:underline font-semibold">
                    View Schedule &rarr;
                </Link>
            </div>
        </div>
      </main>
    </div>
  );
}

// src/app/dashboard/staff/receptionist/page.tsx

// 'use client';

// import DashboardNavbar from '../../../../components/DashboardNavbar';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// interface StaffProfile {
//   name: string;
//   designation: string;
//   // Include other necessary fields here
// }

// export default function ReceptionistDashboard() {
//   const router = useRouter();
//   const [profileData, setProfileData] = useState<StaffProfile | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const receptionistNavLinks = [
//       { name: 'Register Patient', href: '/dashboard/staff/receptionist/patient-registration' },
//       { name: 'Appointments', href: '/dashboard/staff/appointments' }, // Link to generic staff appointments page
//   ];

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         router.push('/login');
//         return;
//       }
//       try {
//         // API call to fetch staff profile (name and designation)
//         const response = await axios.get('http://localhost:5000/api/staff/profile', {
//             headers: { Authorization: `Bearer ${token}` }
//         });
//         
//         // Assuming the backend returns { name: '...', designation: '...' }
//         setProfileData(response.data); 
//       } catch (error) {
//         console.error('Failed to fetch staff profile data:', error);
//         localStorage.removeItem('token');
//         router.push('/login');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [router]);


//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <h1 className="text-2xl font-bold">Loading Receptionist Portal...</h1>
//       </div>
//     );
//   }

//   // Handle case where profile data is not found
//   if (!profileData) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <h1 className="text-2xl font-bold">Error loading profile data.</h1>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Pass the dynamically fetched name to the navbar */}
//       <DashboardNavbar title="Receptionist Portal" navLinks={receptionistNavLinks} userName={profileData.name} />
//       <main className="container mx-auto py-12 px-6">
//         <h1 className="text-4xl font-bold text-gray-800 mb-8">
//           Welcome, {profileData.name} ({profileData.designation})
//         </h1>
//         <div className="grid md:grid-cols-2 gap-8">
//             {/* Patient Registration Card */}
//             <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
//                 <h2 className="text-2xl font-semibold mb-3">Patient Intake</h2>
//                 <p className="text-gray-600 mb-4">Start the full registration process for new hospital patients.</p>
//                 <Link href="/dashboard/staff/receptionist/patient-registration" className="text-blue-500 hover:underline font-semibold">
//                     Start Registration &rarr;
//                 </Link>
//             </div>
//             {/* Appointments View Card */}
//             <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
//                 <h2 className="text-2xl font-semibold mb-3">Daily Appointments</h2>
//                 <p className="text-gray-600 mb-4">View the current day's appointment list for all doctors.</p>
//                 <Link href="/dashboard/staff/appointments" className="text-green-500 hover:underline font-semibold">
//                     View Schedule &rarr;
//                 </Link>
//             </div>
//         </div>
//       </main>
//     </div>
//   );
// }