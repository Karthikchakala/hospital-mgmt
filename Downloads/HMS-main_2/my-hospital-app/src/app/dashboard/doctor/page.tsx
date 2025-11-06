'use client';

import DashboardNavbar from '../../../components/DashboardNavbar';
import ParticlesBackground from '../../../components/ParticlesBackground'; // ✅ Added
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DoctorProfile {
  name: string;
  email: string;
  role: string;
  Doctor: {
    specialization: string;
  };
}

export default function DoctorDashboard() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<DoctorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const doctorNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard/doctor' },
    { name: 'Profile', href: '/dashboard/doctor/profile' },
    { name: 'Appointments', href: '/dashboard/doctor/appointments' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/doctor/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Failed to fetch doctor profile data:', error);
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
      <div className="flex justify-center items-center min-h-screen bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-100">Loading Doctor Portal...</h1>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center p-8 bg-slate-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-slate-100">Profile data not found.</h1>
          <p className="text-slate-300">Please log in again or contact support.</p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: 'My Profile',
      desc: 'View and update your professional information and credentials.',
      gradient: 'from-sky-400/30 via-cyan-400/20 to-blue-500/30',
      border: 'border-sky-400/30',
      glow: 'hover:shadow-sky-400/40',
      text: 'text-sky-200',
      link: '/dashboard/doctor/profile',
    },
    {
      title: 'Create New EMR',
      desc: 'Digitally record patient diagnosis, prescriptions, and upload documents.',
      gradient: 'from-rose-400/30 via-pink-400/20 to-red-400/30',
      border: 'border-rose-300/30',
      glow: 'hover:shadow-rose-400/40',
      text: 'text-rose-200',
      link: '/dashboard/doctor/emr-form',
    },
    {
      title: 'Appointments',
      desc: 'View and manage your upcoming appointments and patient schedules.',
      gradient: 'from-teal-400/30 via-emerald-400/20 to-green-500/30',
      border: 'border-teal-300/30',
      glow: 'hover:shadow-teal-400/40',
      text: 'text-teal-200',
      link: '/dashboard/doctor/appointments',
    },
    {
      title: 'Virtual Appointments',
      desc: 'View and join your scheduled virtual consultations.',
      gradient: 'from-violet-400/30 via-purple-400/20 to-fuchsia-500/30',
      border: 'border-violet-300/30',
      glow: 'hover:shadow-violet-400/40',
      text: 'text-violet-200',
      link: '/dashboard/doctor/appointments',
    },
    {
      title: 'Home Visits',
      desc: 'See and manage home visit appointments assigned to you.',
      gradient: 'from-indigo-400/30 via-blue-400/20 to-indigo-500/30',
      border: 'border-indigo-300/30',
      glow: 'hover:shadow-indigo-400/40',
      text: 'text-indigo-200',
      link: '/dashboard/doctor/home-visit',
    },
    {
      title: 'My Patients',
      desc: 'Access a list of your patients and their medical records.',
      gradient: 'from-purple-400/30 via-violet-400/20 to-indigo-500/30',
      border: 'border-purple-300/30',
      glow: 'hover:shadow-purple-400/40',
      text: 'text-purple-200',
      link: '/dashboard/doctor/patients',
    },
    {
      title: 'Feeback and Help',
      desc: 'View and update your professional information and credentials.',
      gradient: 'from-sky-400/30 via-cyan-400/20 to-blue-500/30',
      border: 'border-sky-400/30',
      glow: 'hover:shadow-sky-400/40',
      text: 'text-sky-200',
      link: '/dashboard/feedback',
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* ✅ Plexus Background Animation */}
      <ParticlesBackground />

      <DashboardNavbar 
        title="Doctor Portal" 
        navLinks={doctorNavLinks} 
        userName={profileData.name} 
      />

      <main className="relative z-10 container mx-auto py-16 px-6">
        <h1 className="text-5xl font-extrabold mb-10 text-cyan-200 drop-shadow-lg">
          Welcome, Dr. {profileData.name}
        </h1>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`p-6 rounded-xl bg-gradient-to-br ${card.gradient} 
              backdrop-blur-md border ${card.border} shadow-xl transition-all duration-300 
              hover:scale-105 ${card.glow} border-l-6 border-white-900`}
            >
              <h2 className={`text-2xl font-semibold mb-3 ${card.text}`}>
                {card.title}
              </h2>
              <p className="text-slate-200 mb-5">{card.desc}</p>
              <Link
                href={card.link}
                className={`font-semibold underline-offset-2 hover:underline ${card.text}`}
              >
                Open →
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
