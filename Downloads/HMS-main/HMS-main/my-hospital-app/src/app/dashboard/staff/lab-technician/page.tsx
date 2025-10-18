// src/app/dashboard/staff/lab-technician/page.tsx

'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState } from 'react';
import Link from 'next/link';

export default function LabTechnicianDashboard() {
  // NOTE: In a real app, userName would be fetched from the profile API
  const userName = 'Alice Clark'; 
  const technicianNavLinks = [
    { name: 'Results', href: '/dashboard/staff/lab-technician/results-management' },
    { name: 'Help/Feedback', href: '/dashboard/feedback' },
  ];

  const TaskCard = ({ title, description, link, color }: { title: string, description: string, link: string, color: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
        <h2 className={`text-2xl font-semibold mb-4 ${color.replace('bg', 'text')}`}>{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link href={link} className={`block text-right text-blue-500 hover:underline font-semibold`}>
            Go to Module &rarr;
        </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar title="Lab Technician Portal" navLinks={technicianNavLinks} userName={userName} />
      <main className="container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Welcome, {userName} - Lab Portal
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
            <TaskCard 
                title="Results Management" 
                description="Input, validate, and manage all patient test results." 
                link="/dashboard/staff/lab-technician/results-management" 
                color="bg-purple-500"
            />
            <TaskCard 
                title="Sample Tracking" 
                description="View and track the status of pending lab samples." 
                link="/dashboard/staff/lab-technician/sample-tracking" 
                color="bg-indigo-500"
            />
        </div>
      </main>
    </div>
  );
}