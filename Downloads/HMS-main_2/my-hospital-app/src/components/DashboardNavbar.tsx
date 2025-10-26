'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { BellIcon } from '@heroicons/react/24/outline';

interface NavLink {
  name: string;
  href: string;
}

interface DashboardNavbarProps {
  title: string;
  navLinks: NavLink[];
  userName: string;
}

export default function DashboardNavbar({ title, navLinks, userName }: DashboardNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="bg-slate-900/30 backdrop-blur-md border-b border-white/10 shadow-lg p-5 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Dashboard Home link */}
        <Link 
          href="/dashboard/patient" 
          className="flex items-center space-x-2 transition duration-300 transform hover:scale-105"
        >
          <Image 
            src="/images/HMS.ico" 
            alt="Hospital Logo" 
            width={40} 
            height={40} 
            className="rounded-full object-cover"
          />
          <span className="text-2xl font-extrabold text-cyan-300 tracking-wide">
            {title}
          </span>
        </Link>

        <div className="flex items-center space-x-6 text-lg">
          {/* Navigation Links */}
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition duration-300 transform hover:scale-105 ${
                  isActive 
                    ? 'text-cyan-400 font-semibold' 
                    : 'text-gray-200 hover:text-cyan-300'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Notification icon */}
          <div className="relative text-gray-200 hover:text-cyan-300 cursor-pointer transition duration-300">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-cyan-500 rounded-full">
              0
            </span>
          </div>

          {/* User's Name */}
          <span className="text-gray-100 font-semibold">{userName}</span>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
