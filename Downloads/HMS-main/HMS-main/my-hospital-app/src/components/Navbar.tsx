'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Navbar() {
  const navLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg p-5 sticky top-0 z-50"
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and hospital name with hover effect */}
        <Link href="/" className="flex items-center space-x-2 transition duration-300 transform hover:scale-110">
          <Image src="/images/logo.png" alt="Hospital Logo" width={40} height={40} />
          <span className="text-2xl font-extrabold text-blue-700 tracking-wide">HEALTHCARE</span>
        </Link>
        
        {/* Navigation links with zoom on hover */}
        <div className="space-x-6 text-lg">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-gray-700 hover:text-blue-700 hover:scale-110 transition duration-300 transform inline-block"
            >
              {link.name}
            </Link>
          ))}
          
          {/* Login button with its own unique hover effect */}
          <Link 
            href="/login" 
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300 transform hover:scale-110 inline-block"
          >
            Login
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}