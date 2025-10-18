// src/app/dashboard/staff/pharmacist/page.tsx

'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface StaffProfile {
  name: string;
  designation: string;
}

export default function PharmacistDashboard() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<StaffProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Updated navigation links: Only Dispensing/Billing
  const pharmacistNavLinks = [
    { name: 'Dispense & Bill', href: '/dashboard/staff/pharmacist/dispensary-management' },
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
        const response = await axios.get('http://localhost:5000/api/staff/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
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
        <h1 className="text-2xl font-bold">Loading Pharmacy Portal...</h1>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <h1 className="text-2xl font-bold">Error loading profile data.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar title="Pharmacist Portal" navLinks={pharmacistNavLinks} userName={profileData.name} />
      <main className="container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Welcome, {profileData.name} - Pharmacy Portal
        </h1>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            <TaskCard 
                title="Dispense & Billing" 
                description="Process prescriptions, dispense medicine, and finalize patient bills." 
                link="/dashboard/staff/pharmacist/dispensary-management" 
                color="bg-red-500"
            />
            {/* The second card (Inventory) has been removed as requested */}
        </div>
      </main>
    </div>
  );
}

// Reusing TaskCard defined in the previous response
const TaskCard = ({ title, description, link, color }: { title: string, description: string, link: string, color: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
        <h2 className={`text-2xl font-semibold mb-4 ${color.replace('bg', 'text')}`}>{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link href={link} className={`block text-right text-blue-500 hover:underline font-semibold`}>
            Go to Module &rarr;
        </Link>
    </div>
);