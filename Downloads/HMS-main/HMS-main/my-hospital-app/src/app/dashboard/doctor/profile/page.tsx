"use client";

import DashboardNavbar from "../../../../components/DashboardNavbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// --- Interfaces ---
interface DoctorDetails {
  specialization: string;
  license_number: string;
  phone_number: string;
  bio: string;
  profile_picture_url: string;
  education: string;
  languages_spoken: string;
  experience_years: number | null;
  department_id: number | null;
}

interface DoctorProfile {
  name: string;
  email: string;
  role: string;
  Doctor: DoctorDetails;
}

export default function DoctorProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<DoctorProfile | null>(null);
  const [formData, setFormData] = useState<DoctorDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const API_BASE_URL = "http://localhost:5000"; // ✅ critical fix
  const doctorNavLinks = [
    { name: "Profile", href: "/dashboard/doctor/profile" },
    { name: "Appointments", href: "/dashboard/doctor/appointments" },
    { name: "Patients", href: "/dashboard/doctor/patients" },
  ];

    const testDoctorAPI = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/test`);
      alert(`✅ API Working: ${res.data.message || 'Response OK'}`);
      console.log('✅ Doctor Test API Response:', res.data);
    } catch (error: any) {
      console.error('❌ Doctor Test API Error:', error);
      alert('Doctor Test API failed. Check console for details.');
    }
  };

  // --- Fetch Profile ---
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        console.log("🔹 Fetching doctor profile...");
        const response = await axios.get(`${API_BASE_URL}/api/doctor/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Profile response:", response.data);
        const data = response.data;

        setProfileData(data);
        setFormData({
          ...data.Doctor,
          experience_years: Number(data.Doctor.experience_years) || null,
          department_id: Number(data.Doctor.department_id) || null,
        });
      } catch (error: any) {
        console.error("❌ Failed to fetch doctor profile:", error);
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // --- Input Change Handler ---
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!formData) return;

    const { name, value, type } = e.target;
    let newValue: string | number | null = value;

    if (type === "number") {
      newValue = value === "" ? null : parseInt(value);
      if (isNaN(newValue as number)) newValue = null;
    } else {
      newValue = value === "" ? null : value;
    }

    setFormData({ ...formData, [name]: newValue });
  };

  // --- Edit + Cancel Handlers ---
  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (profileData) setFormData(profileData.Doctor);
    setIsEditing(false);
  };

  // --- Save Changes (PUT /api/doctor/profile) ---
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const token = localStorage.getItem("token");
  //   if (!token || !formData) return;

  //   // Clean payload (remove undefined)
  //   const finalPayload = Object.fromEntries(
  //     Object.entries(formData).map(([key, value]) => {
  //       if (key === "experience_years") {
  //         const numValue = Number(value);
  //         return [key, isNaN(numValue) || numValue === 0 ? null : numValue];
  //       }
  //       return [key, value === "" || value === null ? null : value];
  //     })
  //   );

  //   try {
  //     console.log("🔹 Sending update payload:", finalPayload);

  //     const response = await axios.put(
  //       `${API_BASE_URL}/api/doctor/profile`,
  //       finalPayload,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     console.log("✅ Update response:", response.data);
  //     alert("✅ Profile updated successfully!");
  //     setProfileData({ ...profileData!, Doctor: finalPayload as DoctorDetails });
  //     setIsEditing(false);
  //   } catch (error: any) {
  //     console.error("❌ Failed to update profile:", error.response || error);
  //     alert(
  //       `Failed to update profile: ${
  //         error.response?.data?.message || "Unknown error"
  //       }`
  //     );
  //   }
  // };

  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token || !formData) return;

  const finalPayload = {
    specialization: formData.specialization || null,
    license_number: formData.license_number || null,
    phone_number: formData.phone_number || null,
    bio: formData.bio || null,
    profile_picture_url: formData.profile_picture_url || null,
    education: formData.education || null,
    languages_spoken: formData.languages_spoken || null,
    experience_years:
      formData.experience_years !== null && formData.experience_years !== 0
        ? formData.experience_years
        : null,
    department_id: formData.department_id || null,
  };

  try {
    console.log("🔹 Sending update payload:", finalPayload);

    const response = await axios.put(
      `${API_BASE_URL}/api/doctor/profile`,
      finalPayload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("✅ Update response:", response.data);
    alert("✅ Profile updated successfully!");
    setProfileData({ ...profileData!, Doctor: finalPayload as DoctorDetails });
    setIsEditing(false);
  } catch (err: any) {
    console.error("❌ PUT profile error full object:", err);
    
    // Try to get message from all possible places
    let msg = "Unknown error";
    if (axios.isAxiosError(err)) {
      msg =
        err.response?.data?.message || // normal server message
        JSON.stringify(err.response?.data) || // fallback to full response body
        err.message || 
        "Unknown Axios error";
    } else if (err instanceof Error) {
      msg = err.message;
    }

    alert(`Failed to update profile: ${msg}`);
  }
};


  
  // --- Loading + Error Handling ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold">Loading Doctor Profile...</h1>
      </div>
    );
  }

  if (!profileData || !formData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold text-red-500">
          Error: Profile data not found.
        </h1>
      </div>
    );
  }

  // --- Render Profile Form ---
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar
        title="Doctor Portal"
        navLinks={doctorNavLinks}
        userName={profileData.name}
      />

      <main className="container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold mb-8">
          Dr. {profileData.name}'s Profile
        </h1>

        <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- BASIC INFO --- */}
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
              Credentials & Basics
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  disabled
                  className="w-full p-3 border rounded-md bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full p-3 border rounded-md bg-gray-100"
                />
              </div>
            </div>

            {/* --- PROFESSIONAL INFO --- */}
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2 pt-6">
              Professional Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                ["specialization", "Specialization"],
                ["license_number", "License Number"],
                ["phone_number", "Phone Number"],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className="block text-gray-700 font-semibold mb-2">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={(formData as any)[field] || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-md"
                  />
                </div>
              ))}

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experience_years"
                  value={formData.experience_years ?? ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-md"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Education
                </label>
                <input
                  type="text"
                  name="education"
                  value={formData.education || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-md"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full p-3 border rounded-md"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Languages Spoken (comma-separated)
                </label>
                <input
                  type="text"
                  name="languages_spoken"
                  value={formData.languages_spoken || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-md"
                />
              </div>
            </div>

            {/* --- ACTION BUTTONS --- */}
            {!isEditing ? (
              <button
                type="button"
                onClick={handleEdit}
                className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-1/2 py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}


