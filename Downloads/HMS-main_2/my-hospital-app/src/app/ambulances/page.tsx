"use client";
import React from "react";

const AMBULANCES = [
  { number: "AMB-01", driver: "Rajesh Kumar", phone: "9876543210", type: "Advanced" },
  { number: "AMB-02", driver: "Meena Reddy", phone: "9876501234", type: "Basic" },
  { number: "AMB-03", driver: "Aman Singh", phone: "9822001122", type: "ICU" },
  { number: "AMB-04", driver: "Karthik", phone: "9811112222", type: "Advanced" },
];

const badgeClass = (t: string) => {
  const map: Record<string, string> = {
    Basic: "bg-slate-100 text-slate-700",
    Advanced: "bg-blue-100 text-blue-700",
    ICU: "bg-red-100 text-red-700",
  };
  return `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[t] || "bg-slate-100 text-slate-700"}`;
};

export default function AmbulancesPage() {
  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Our Ambulance Services</h1>
      <p className="text-slate-600 mb-3">
        Rapid response ambulances staffed by trained drivers—ready to reach you when every second matters.
        For emergencies, please dial your local emergency number immediately.
      </p>
      <blockquote className="mb-5 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-3 text-blue-700 text-sm">
        “In an emergency, preparation is the best medicine.”
      </blockquote>
      <div className="grid gap-3 sm:gap-4">
        {AMBULANCES.map((a) => (
          <div key={a.number} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="space-y-1">
              <div className="text-slate-900 font-semibold">🚑 {a.number}</div>
              <div className="text-slate-600 text-sm">Driver: {a.driver}</div>
              <div className="text-slate-600 text-sm">📞 {a.phone}</div>
            </div>
            <span className={badgeClass(a.type)}>{a.type} Life Support</span>
          </div>
        ))}
      </div>
    </div>
  );
}
