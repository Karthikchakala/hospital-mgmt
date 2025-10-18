'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '../../../components/DashboardNavbar';
import Link from 'next/link';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  Patient: {
    // Details here
  };
}

export default function PatientDashboard() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Define navigation links for the navbar
  const navbarLinks = [
    { name: 'Appointments', href: '/dashboard/patient/appointments' },
    { name: 'Profile', href: '/dashboard/patient/profile' },
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
        const response = await axios.get('http://localhost:5000/api/patient/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
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
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

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
        title="Patient Portal"
        navLinks={navbarLinks}
        userName={profileData.name}
      />
      <main className="container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Welcome to your Patient Portal
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Appointments Card */}
          <div className="bg-white p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Appointments</h2>
            <p className="text-gray-600 mb-4">View your upcoming appointments or book a new one.</p>
            <Link href="/dashboard/patient/appointments" className="text-blue-500 hover:underline font-semibold">
              Manage Appointments &rarr;
            </Link>
          </div>
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">My Profile</h2>
            <p className="text-gray-600 mb-4">Update your personal information and contact details.</p>
            <Link href="/dashboard/patient/profile" className="text-green-500 hover:underline font-semibold">
              View Profile &rarr;
            </Link>
          </div>
          {/* Bills Card */}
          <div className="bg-white p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600">My Bills</h2>
            <p className="text-gray-600 mb-4">Access your bills and payment history.</p>
            <Link href="/dashboard/patient/bills" className="text-purple-500 hover:underline font-semibold">
              View Bills &rarr;
            </Link>
          </div>
          {/* Medical History Card */}
          <div className="bg-white p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4 text-orange-600">Medical History</h2>
            <p className="text-gray-600 mb-4">Review your past diagnoses, prescriptions, and lab results.</p>
            <Link href="/dashboard/patient/medical-history" className="text-orange-500 hover:underline font-semibold">
              View History &rarr;
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}