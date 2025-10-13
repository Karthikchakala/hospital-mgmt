'use client';

import DashboardNavbar from '../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DoctorProfile {
  name: string;
  email: string;
  role: string;
  // Ensure your backend query fetches this Doctor object
  Doctor: {
    specialization: string;
  };
}

export default function DoctorDashboard() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<DoctorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Doctor's specific navigation links
  const doctorNavLinks = [
    { name: 'Profile', href: '/dashboard/doctor/profile' },
    { name: 'Appointments', href: '/dashboard/doctor/appointments' },
    { name: 'Patients', href: '/dashboard/doctor/patients' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // This fetches the doctor's name and details
        const response = await axios.get('http://localhost:5000/api/doctor/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Failed to fetch doctor profile data:', error);
        // On failure (e.g., token expired), clear token and redirect
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
        <h1 className="text-2xl font-bold">Loading Doctor Portal...</h1>
      </div>
    );
  }

  // Handle case where profile data is not found
  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Profile data not found.</h1>
          <p>Please log in again or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar 
        title="Doctor Portal" 
        navLinks={doctorNavLinks} 
        userName={profileData.name} 
      />
      <main className="container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Welcome, Dr. {profileData.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">My Profile</h2>
            <p className="text-gray-600 mb-4">View and update your professional information and credentials.</p>
            <Link href="/dashboard/doctor/profile" className="text-blue-500 hover:underline font-semibold">
              View Profile &rarr;
            </Link>
          </div>
          
          {/* Appointments Card */}
          <div className="bg-white p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">Appointments</h2>
            <p className="text-gray-600 mb-4">View and manage your upcoming appointments and patient schedules.</p>
            <Link href="/dashboard/doctor/appointments" className="text-green-500 hover:underline font-semibold">
              View Appointments &rarr;
            </Link>
          </div>
          
          {/* Patients Card */}
          <div className="bg-white p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600">My Patients</h2>
            <p className="text-gray-600 mb-4">Access a list of your patients and their medical records.</p>
            <Link href="/dashboard/doctor/patients" className="text-purple-500 hover:underline font-semibold">
              View Patients &rarr;
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}