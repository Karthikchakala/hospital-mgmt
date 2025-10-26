'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DashboardNavbar from '../../../components/DashboardNavbar';
import Link from 'next/link';
import ParticlesBackground from '../../../components/ParticlesBackground';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  Patient: {};
}

export default function PatientDashboard() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const { data } = await axios.get('http://localhost:5000/api/patient/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(data);
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
      <div className="flex justify-center items-center min-h-screen bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-100">Loading...</h1>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center p-8 bg-slate-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-slate-100">Profile Not Found</h1>
          <p className="text-slate-300">Please log in again or contact support.</p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: 'Appointments',
      desc: 'Check and manage your upcoming appointments.',
      gradient: 'from-sky-400/30 via-cyan-400/20 to-blue-500/30', // soft sky blue
      border: 'border-sky-400/30',
      glow: 'hover:shadow-sky-400/40',
      text: 'text-sky-200',
      link: '/dashboard/patient/appointments',
    },
    {
      title: 'Profile',
      desc: 'View and update your account and medical details.',
      gradient: 'from-teal-400/30 via-emerald-400/20 to-green-500/30', // soft teal/green
      border: 'border-teal-300/30',
      glow: 'hover:shadow-teal-400/40',
      text: 'text-teal-200',
      link: '/dashboard/patient/profile',
    },
    {
      title: 'Bills',
      desc: 'Access and monitor your payment history securely.',
      gradient: 'from-amber-300/25 via-yellow-300/20 to-yellow-400/25', // muted warm yellow
      border: 'border-amber-200/30',
      glow: 'hover:shadow-amber-300/40',
      text: 'text-amber-100',
      link: '/dashboard/patient/bills',
    },
    {
      title: 'Medical History',
      desc: 'Track your previous treatments and lab results.',
      gradient: 'from-orange-400/30 via-amber-400/20 to-orange-500/30', // soft orange
      border: 'border-orange-300/30',
      glow: 'hover:shadow-orange-400/40',
      text: 'text-orange-200',
      link: '/dashboard/patient/medical-history',
    },
    {
      title: 'Help & Feedback',
      desc: 'Share your thoughts to help us serve you better.',
      gradient: 'from-pink-400/30 via-rose-400/20 to-red-400/30', // soft coral/pink
      border: 'border-pink-300/30',
      glow: 'hover:shadow-pink-400/40',
      text: 'text-pink-200',
      link: '/dashboard/feedback',
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* 🌐 Plexus Background Animation */}
      <ParticlesBackground />

      {/* 📋 Navigation */}
      <DashboardNavbar
        title="Patient Portal"
        navLinks={[
          { name: 'Home', href: '/dashboard/patient' },
          { name: 'Appointments', href: '/dashboard/patient/appointments' },
          { name: 'Profile', href: '/dashboard/patient/profile' },
        ]}
        userName={profileData.name}
      />

      <main className="relative z-10 container mx-auto py-16 px-6">
        <h1 className="text-4xl font-extrabold mb-10 text-cyan-200">
          Welcome, {profileData.name}
        </h1>

        {/* 💎 Glassmorphic Cards with Soft Colors */}
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
