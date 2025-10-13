import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Map from '../components/Map';
import EventsCarousel from '../components/EventsCarousel';
import Departments from '../components/Departments';
import NewsCarousel from '../components/NewsCarousel';
import SignupBoxes from '../components/SignupBoxes'; // New Import
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative w-full h-[600px] overflow-hidden">
          <Image
            src="/images/hero-bg.jpg"
            alt="Modern Hospital Building"
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-transparent flex items-center p-10 md:p-20">
            <div className="text-white max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate-fadeIn">
                Comprehensive Care, Right Here.
              </h1>
              <p className="text-lg md:text-xl mb-6 leading-relaxed animate-fadeIn delay-300">
                Providing world-class healthcare with compassion and dedication. Your well-being is at the heart of everything we do.
              </p>
              <Link href="/contact" className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-full text-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 animate-slideInUp delay-500">
                Book an Appointment
              </Link>
            </div>
          </div>
        </section>

        {/* Signup Boxes Section */}
        <SignupBoxes />

        {/* Departments Section */}
        <Departments />

        {/* Services Overview */}
        <section className="container mx-auto py-20 px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Core Services</h2>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div className="p-8 bg-white rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">Emergency Services</h3>
              <p className="text-gray-600">
                24/7 emergency care with a dedicated team of specialists ready to help.
              </p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">Advanced Diagnostics</h3>
              <p className="text-gray-600">
                State-of-the-art diagnostic imaging and lab services for accurate results.
              </p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">Expert Surgery</h3>
              <p className="text-gray-600">
                Our team of experienced surgeons performs a wide range of procedures.
              </p>
            </div>
          </div>
        </section>

        {/* News & Events Section */}
        <section className="bg-white py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">What's Happening</h2>
            <div className="space-y-12">
              <NewsCarousel />
              <div>
                <EventsCarousel />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Map />
      <Footer />
    </div>
  );
}