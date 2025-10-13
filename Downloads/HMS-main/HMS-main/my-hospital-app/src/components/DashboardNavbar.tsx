'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BellIcon } from '@heroicons/react/24/outline'; // Importing the BellIcon

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-lg p-5 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Dashboard Home link */}
        <Link href="/dashboard" className="flex items-center space-x-2 transition duration-300 transform hover:scale-105">
          <Image src="/images/logo.png" alt="Hospital Logo" width={40} height={40} />
          <span className="text-2xl font-extrabold text-blue-700 tracking-wide">{title}</span>
        </Link>
        <div className="flex items-center space-x-6 text-lg">
          {/* User-specific links from props */}
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-gray-700 hover:text-blue-700 hover:scale-105 transition duration-300">
              {link.name}
            </Link>
          ))}
          {/* Notification icon with a count */}
          <div className="relative text-gray-700 hover:text-blue-700 cursor-pointer">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">3</span>
          </div>
          {/* User's Name */}
          <span className="text-gray-800 font-semibold">{userName}</span>
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition duration-300 transform hover:-translate-y-1"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}