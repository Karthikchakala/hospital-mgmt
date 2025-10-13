"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  UserIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

// Data for each role
const roles = [
  {
    name: "Patient",
    icon: UserIcon,
    description: "Register to manage your appointments and health records.",
    link: "/signup/patient",
    color: "bg-blue-500",
  },
  {
    name: "Doctor",
    icon: ShieldCheckIcon,
    description: "Sign up to manage your patient charts and schedules.",
    link: "/signup/doctor",
    color: "bg-green-500",
  },
  {
    name: "Admin",
    icon: PencilSquareIcon,
    description: "Access administrative tools and hospital management features.",
    link: "/signup/admin",
    color: "bg-purple-500",
  },
  {
    name: "Staff",
    icon: UserGroupIcon,
    description: "Join our team to manage patient information and tasks.",
    link: "/signup/staff",
    color: "bg-yellow-500",
  },
];

export default function SignupBoxes() {
  return (
    <section className="py-16 px-6 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Join Our System
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 text-center flex flex-col items-center transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white ${role.color}`}
              >
                <role.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{role.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{role.description}</p>
              <Link
                href={role.link}
                className={`mt-auto px-6 py-2 rounded-full text-white font-semibold transition-colors duration-300 ${role.color} hover:${role.color.replace('500', '600')}`}
              >
                Sign Up
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}