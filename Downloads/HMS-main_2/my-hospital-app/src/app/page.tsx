'use client';

import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Map from '../components/Map';
import EventsCarousel from '../components/EventsCarousel';
import Departments from '../components/Departments';
import NewsCarousel from '../components/NewsCarousel';
import SignupBoxes from '../components/SignupBoxes';
import Image from 'next/image';
import Link from 'next/link';
import ParticlesBackground from '../components/BubbleBackground';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen font-sans text-white overflow-hidden bg-gradient-to-br from-sky-950 via-slate-900 to-teal-950">
      <main>
        {/* ===== HERO SECTION (NO PARTICLES HERE) ===== */}
        <section className="relative w-full h-[90vh] md:h-screen flex flex-col">
          <Image
            src="/images/mainbg.png"
            alt="Healthcare professionals"
            fill
            priority
            className="object-cover object-center brightness-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent" />

          {/* Navbar */}
          <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute top-6 left-1/2 z-50 w-[95%] md:w-[90%] 
                       -translate-x-1/2 bg-transparent backdrop-blur-sm 
                       rounded-3xl px-6 py-4 md:px-10 flex items-center justify-between"
          >
            <Link
              href="/"
              className="flex items-center gap-3 transition-transform duration-300 hover:scale-105"
            >
              <Image
                src="/images/HMS.ico"
                alt="Hospital Logo"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="text-2xl font-extrabold tracking-tight text-cyan-300">
                MediCare+
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8 ml-auto text-[17px] font-medium">
              {['About', 'Services', 'Contact'].map((item, i) => (
                <Link
                  key={i}
                  href={`/${item.toLowerCase()}`}
                  className="text-gray-200 hover:text-cyan-300 transition-colors"
                >
                  {item}
                </Link>
              ))}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-400 
                             to-teal-400 text-white font-semibold shadow-md 
                             hover:shadow-cyan-400/50 transition-all"
                >
                  Login
                </Link>
              </motion.div>
            </div>
          </motion.nav>

          {/* Hero Text */}
          <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-16 max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="text-6xl md:text-8xl font-extrabold leading-tight text-white mb-4 drop-shadow-xl"
            >
              Care that <br /> Shines Brighter
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-base md:text-lg font-medium text-gray-200 mb-6 leading-relaxed max-w-2xl"
            >
              “Comprehensive, connected healthcare built around your journey — blending innovation and compassion.”
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r 
                           from-teal-400 via-cyan-400 to-blue-500 text-white font-semibold 
                           rounded-full shadow-lg hover:shadow-cyan-400/50 hover:scale-105 transition-all"
              >
                Get Started
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ===== PARTICLE ANIMATION AFTER HERO ONLY ===== */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <ParticlesBackground /> {/* ✅ only active for sections after hero */}
          </div>

          {/* Signup Section */}
          <section className="container mx-auto px-4 md:px-6 lg:px-8 pt-10 relative z-10">
            <div className="rounded-3xl bg-white/5 border border-cyan-700 backdrop-blur-md p-4 md:p-6 hover:shadow-cyan-400/30 transition-all">
              <SignupBoxes />
            </div>
          </section>

          {/* Departments */}
          <section className="container mx-auto px-4 md:px-6 lg:px-8 pt-10 relative z-10">
            <div className="rounded-3xl bg-white/5 border border-cyan-700 backdrop-blur-md p-4 md:p-6">
              <Departments />
            </div>
          </section>

          {/* Services */}
          <section className="container mx-auto py-20 px-4 md:px-6 lg:px-8 relative z-10">
            <h2 className="text-4xl font-bold text-center text-cyan-300 mb-12">
              Our Core Services
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Emergency Services', desc: '24/7 care with top specialists ready to assist.' },
                { title: 'Advanced Diagnostics', desc: 'Precision imaging and laboratory services.' },
                { title: 'Expert Surgery', desc: 'Excellence in surgical care with compassion.' },
              ].map((service, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.04 }}
                  className="p-8 bg-gradient-to-br from-slate-900/70 to-sky-900/60 
                             rounded-xl border border-sky-800 shadow-lg hover:shadow-cyan-400/20 transition-all"
                >
                  <h3 className="text-2xl font-bold text-cyan-400 mb-3">{service.title}</h3>
                  <p className="text-gray-300">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* News + Events */}
          <section className="py-16 px-4 md:px-6 lg:px-8 bg-slate-950/80 border-t border-sky-900 relative z-10">
            <div className="container mx-auto">
              <h2 className="text-4xl font-bold text-center text-cyan-300 mb-12">
                What&apos;s Happening
              </h2>
              <div className="space-y-10">
                <div className="rounded-2xl bg-gradient-to-br from-slate-900/70 to-sky-950/70 border border-cyan-700 p-4 md:p-6">
                  <NewsCarousel />
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-slate-900/70 to-sky-950/70 border border-cyan-700 p-4 md:p-6">
                  <EventsCarousel />
                </div>
              </div>
            </div>
          </section>

          {/* Map + Footer */}
          <div className="bg-gradient-to-r from-teal-950 to-sky-950 border-t border-teal-800 relative z-10">
            <Map />
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
