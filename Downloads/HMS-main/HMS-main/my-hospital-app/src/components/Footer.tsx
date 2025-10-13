import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
        {/* Hospital Info & Logo */}
        <div>
          <Link href="/" className="flex items-center space-x-2 mb-4 transition duration-300 transform hover:scale-105">
            <Image src="/images/logo.png" alt="Hospital Logo" width={40} height={40} />
            <span className="text-2xl font-extrabold text-white">HEALTHCARE</span>
          </Link>
          <p className="text-sm">Providing exceptional care to our community since 1998.</p>
        </div>
        
        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:text-blue-400 transition duration-300 transform hover:scale-105 inline-block">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-blue-400 transition duration-300 transform hover:scale-105 inline-block">
                Our Services
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-400 transition duration-300 transform hover:scale-105 inline-block">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Support Links */}
        <div>
          <h4 className="text-lg font-bold text-white mb-4">Support</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/faq" className="hover:text-blue-400 transition duration-300 transform hover:scale-105 inline-block">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-blue-400 transition duration-300 transform hover:scale-105 inline-block">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-blue-400 transition duration-300 transform hover:scale-105 inline-block">
                Terms of Use
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-bold text-white mb-4">Contact Info</h4>
          <ul className="space-y-2">
            <li>123 Hospital Lane, Health City, CA 12345</li>
            <li>(123) 456-7890</li>
            <li>info@healthcare.com</li>
          </ul>
          {/* Social Media Icons (with zoom effect) */}
          <div className="flex space-x-4 mt-4 text-2xl">
            <a href="#" aria-label="Facebook" className="hover:text-blue-400 transition duration-300 transform hover:scale-125">
              <i className="fab fa-facebook-square"></i>
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-blue-400 transition duration-300 transform hover:scale-125">
              <i className="fab fa-twitter-square"></i>
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-blue-400 transition duration-300 transform hover:scale-125">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-4 border-t border-gray-700 text-center text-sm">
        <p>&copy; 2025 Healthcare. All Rights Reserved.</p>
      </div>
    </footer>
  );
}