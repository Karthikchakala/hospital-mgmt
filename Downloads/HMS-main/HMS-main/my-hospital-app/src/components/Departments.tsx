"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  HeartIcon,
  UserGroupIcon,
  EyeIcon,
  BoltIcon,
  BeakerIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

const departments = [
  {
    name: "Cardiology",
    Icon: HeartIcon,
    color: "bg-red-100 text-red-600",
    description: "Heart health, diagnostics, and treatment services.",
  },
  {
    name: "Neurology",
    Icon: BoltIcon,
    color: "bg-purple-100 text-purple-600",
    description: "Brain and nervous system care for all ages.",
  },
  {
    name: "Pediatrics",
    Icon: UserGroupIcon,
    color: "bg-yellow-100 text-yellow-600",
    description: "Comprehensive care for infants, children, and teens.",
  },
  {
    name: "Oncology",
    Icon: BeakerIcon,
    color: "bg-pink-100 text-pink-600",
    description: "Advanced cancer treatment and support services.",
  },
  {
    name: "Orthopedics",
    Icon: HandThumbUpIcon,
    color: "bg-green-100 text-green-600",
    description: "Bone, joint, and musculoskeletal care.",
  },
  {
    name: "Eye Care",
    Icon: EyeIcon,
    color: "bg-blue-100 text-blue-600",
    description: "Vision exams, eye surgeries, and optical care.",
  },
];

const overlayVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, delay: i * 0.05 },
  }),
};

export default function Departments() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="py-16 px-6 bg-blue-50">
      <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
        Our Departments
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {departments.map((dept, idx) => (
          <motion.div
            key={idx}
            className={`relative rounded-xl flex flex-col items-center justify-center p-10 cursor-pointer overflow-hidden transition-all
              shadow-md
              ${hovered === idx ? "bg-blue-100 shadow-2xl" : "bg-white"}
            `}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Icon with subtle bounce & rotate on hover */}
            <motion.div
              className={`p-6 rounded-full mb-4 ${dept.color}`}
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <dept.Icon className="w-12 h-12" />
            </motion.div>

            <h3 className="text-xl font-semibold text-blue-900">{dept.name}</h3>

            {/* Hover overlay with slide-up */}
            <motion.div
              className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center text-center p-6 rounded-xl"
              variants={overlayVariants}
              initial="hidden"
              whileHover="visible"
              custom={idx}
            >
              <p className="text-gray-800">{dept.description}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
