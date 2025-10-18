// "use client";

// import DashboardNavbar from "../../../../components/DashboardNavbar";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// // --- Interfaces ---
// interface DoctorDetails {
//   specialization: string;
//   license_number: string;
//   phone_number: string;
//   bio: string;
//   profile_picture_url: string;
//   education: string;
//   languages_spoken: string;
//   experience_years: number | null;
//   department_id: number | null;
// }

// interface DoctorProfile {
//   name: string;
//   email: string;
//   role: string;
//   Doctor: DoctorDetails;
// }

// export default function DoctorProfilePage() {
//   const router = useRouter();
//   const [profileData, setProfileData] = useState<DoctorProfile | null>(null);
//   const [formData, setFormData] = useState<DoctorDetails | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);

//   const API_BASE_URL = "http://localhost:5000"; // ✅ critical fix
//   const doctorNavLinks = [
//     { name: "Profile", href: "/dashboard/doctor/profile" },
//     { name: "Appointments", href: "/dashboard/doctor/appointments" },
//     { name: "Patients", href: "/dashboard/doctor/patients" },
//   ];

//     const testDoctorAPI = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/test`);
//       alert(`✅ API Working: ${res.data.message || 'Response OK'}`);
//       console.log('✅ Doctor Test API Response:', res.data);
//     } catch (error: any) {
//       console.error('❌ Doctor Test API Error:', error);
//       alert('Doctor Test API failed. Check console for details.');
//     }
//   };

//   // --- Fetch Profile ---
//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         router.push("/login");
//         return;
//       }

//       try {
//         console.log("🔹 Fetching doctor profile...");
//         const response = await axios.get(`${API_BASE_URL}/api/doctor/profile`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         console.log("✅ Profile response:", response.data);
//         const data = response.data;

//         setProfileData(data);
//         setFormData({
//           ...data.Doctor,
//           experience_years: Number(data.Doctor.experience_years) || null,
//           department_id: Number(data.Doctor.department_id) || null,
//         });
//       } catch (error: any) {
//         console.error("❌ Failed to fetch doctor profile:", error);
//         localStorage.removeItem("token");
//         router.push("/login");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [router]);

//   // --- Input Change Handler ---
//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     if (!formData) return;

//     const { name, value, type } = e.target;
//     let newValue: string | number | null = value;

//     if (type === "number") {
//       newValue = value === "" ? null : parseInt(value);
//       if (isNaN(newValue as number)) newValue = null;
//     } else {
//       newValue = value === "" ? null : value;
//     }

//     setFormData({ ...formData, [name]: newValue });
//   };

//   // --- Edit + Cancel Handlers ---
//   const handleEdit = () => setIsEditing(true);

//   const handleCancel = () => {
//     if (profileData) setFormData(profileData.Doctor);
//     setIsEditing(false);
//   };

  
// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   const token = localStorage.getItem("token");
//   if (!token || !formData) return;

//   const finalPayload = {
//     specialization: formData.specialization || null,
//     license_number: formData.license_number || null,
//     phone_number: formData.phone_number || null,
//     bio: formData.bio || null,
//     profile_picture_url: formData.profile_picture_url || null,
//     education: formData.education || null,
//     languages_spoken: formData.languages_spoken || null,
//     experience_years:
//       formData.experience_years !== null && formData.experience_years !== 0
//         ? formData.experience_years
//         : null,
//     department_id: formData.department_id || null,
//   };

//   try {
//     console.log("🔹 Sending update payload:", finalPayload);

//     const response = await axios.put(
//       `${API_BASE_URL}/api/doctor/profile`,
//       finalPayload,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     console.log("✅ Update response:", response.data);
//     alert("✅ Profile updated successfully!");
//     setProfileData({ ...profileData!, Doctor: finalPayload as DoctorDetails });
//     setIsEditing(false);
//   } catch (err: any) {
//     console.error("❌ PUT profile error full object:", err);
    
//     // Try to get message from all possible places
//     let msg = "Unknown error";
//     if (axios.isAxiosError(err)) {
//       msg =
//         err.response?.data?.message || // normal server message
//         JSON.stringify(err.response?.data) || // fallback to full response body
//         err.message || 
//         "Unknown Axios error";
//     } else if (err instanceof Error) {
//       msg = err.message;
//     }

//     alert(`Failed to update profile: ${msg}`);
//   }
// };


  
//   // --- Loading + Error Handling ---
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <h1 className="text-2xl font-bold">Loading Doctor Profile...</h1>
//       </div>
//     );
//   }

//   if (!profileData || !formData) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <h1 className="text-2xl font-bold text-red-500">
//           Error: Profile data not found.
//         </h1>
//       </div>
//     );
//   }

//   // --- Render Profile Form ---
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <DashboardNavbar
//         title="Doctor Portal"
//         navLinks={doctorNavLinks}
//         userName={profileData.name}
//       />

//       <main className="container mx-auto py-12 px-6">
//         <h1 className="text-4xl font-bold mb-8">
//           Dr. {profileData.name}'s Profile
//         </h1>

//         <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* --- BASIC INFO --- */}
//             <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
//               Credentials & Basics
//             </h2>

//             <div className="grid md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-gray-700 font-semibold mb-2">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   value={profileData.name}
//                   disabled
//                   className="w-full p-3 border rounded-md bg-gray-100"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-semibold mb-2">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={profileData.email}
//                   disabled
//                   className="w-full p-3 border rounded-md bg-gray-100"
//                 />
//               </div>
//             </div>

//             {/* --- PROFESSIONAL INFO --- */}
//             <h2 className="text-xl font-bold text-gray-800 border-b pb-2 pt-6">
//               Professional Information
//             </h2>

//             <div className="grid md:grid-cols-2 gap-6">
//               {[
//                 ["specialization", "Specialization"],
//                 ["license_number", "License Number"],
//                 ["phone_number", "Phone Number"],
//               ].map(([field, label]) => (
//                 <div key={field}>
//                   <label className="block text-gray-700 font-semibold mb-2">
//                     {label}
//                   </label>
//                   <input
//                     type="text"
//                     name={field}
//                     value={(formData as any)[field] || ""}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className="w-full p-3 border rounded-md"
//                   />
//                 </div>
//               ))}

//               <div>
//                 <label className="block text-gray-700 font-semibold mb-2">
//                   Years of Experience
//                 </label>
//                 <input
//                   type="number"
//                   name="experience_years"
//                   value={formData.experience_years ?? ""}
//                   onChange={handleChange}
//                   disabled={!isEditing}
//                   className="w-full p-3 border rounded-md"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-gray-700 font-semibold mb-2">
//                   Education
//                 </label>
//                 <input
//                   type="text"
//                   name="education"
//                   value={formData.education || ""}
//                   onChange={handleChange}
//                   disabled={!isEditing}
//                   className="w-full p-3 border rounded-md"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-gray-700 font-semibold mb-2">
//                   Bio
//                 </label>
//                 <textarea
//                   name="bio"
//                   value={formData.bio || ""}
//                   onChange={handleChange}
//                   disabled={!isEditing}
//                   rows={4}
//                   className="w-full p-3 border rounded-md"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-gray-700 font-semibold mb-2">
//                   Languages Spoken (comma-separated)
//                 </label>
//                 <input
//                   type="text"
//                   name="languages_spoken"
//                   value={formData.languages_spoken || ""}
//                   onChange={handleChange}
//                   disabled={!isEditing}
//                   className="w-full p-3 border rounded-md"
//                 />
//               </div>
//             </div>

//             {/* --- ACTION BUTTONS --- */}
//             {!isEditing ? (
//               <button
//                 type="button"
//                 onClick={handleEdit}
//                 className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
//               >
//                 Edit Profile
//               </button>
//             ) : (
//               <div className="flex space-x-4 pt-4">
//                 <button
//                   type="submit"
//                   className="w-1/2 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition"
//                 >
//                   Save Changes
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="w-1/2 py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             )}
//           </form>
//         </div>
//       </main>
//     </div>
//   );
// }
 
'use client';

import DashboardNavbar from '../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// --- Interfaces ---
interface Department {
    department_id: number;
    name: string;
}

interface DoctorDetails {
  specialization: string;
  license_number: string;
  phone_number: string;
  bio: string;
  profile_picture_url: string;
  education: string;
  languages_spoken: string;
  experience_years: number | string | null; 
  department_id: number | null; // CRITICAL: This is the FK ID
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
  const [departments, setDepartments] = useState<Department[]>([]); // New state for departments list
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const API_BASE_URL = "http://localhost:5000"; 
  const doctorNavLinks = [
    { name: "Profile", href: "/dashboard/doctor/profile" },
    { name: "Appointments", href: "/dashboard/doctor/appointments" },
    { name: "Patients", href: "/dashboard/doctor/patients" },
  ];

  // --- Fetch Profile and Departments ---
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Fetch all data concurrently
        const [profileResponse, deptResponse] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/doctor/profile`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${API_BASE_URL}/api/doctor/departments`, { headers: { Authorization: `Bearer ${token}` } }), // Fetch Departments
        ]);

        const data = profileResponse.data;

        setProfileData(data);
        setDepartments(deptResponse.data); // Set departments list
        
        // Set form data, ensuring nulls/0s are converted to empty strings for inputs
        setFormData({
          ...data.Doctor,
          experience_years: data.Doctor.experience_years || '', 
          department_id: data.Doctor.department_id || '', // Use '' for select default
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
    
    // Handle number inputs (like experience_years) to store string or null temporarily
    if (type === "number" || name === "experience_years" || name === "department_id") {
        setFormData({ ...formData, [name]: value === "" ? null : value });
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  // --- Edit + Cancel Handlers ---
  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    // Reset form data to original profile data
    if (profileData) setFormData(profileData.Doctor);
    setIsEditing(false);
  };

  
// --- Submit Handler (CRITICAL) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !formData) return;

    // --- Payload Filtering and Type Conversion ---
    const updatePayload: { [key: string]: any } = {};

    const updateableFields = [
        'specialization', 'license_number', 'phone_number', 'experience_years',
        'education', 'bio', 'languages_spoken', 'department_id'
    ];

    updateableFields.forEach(key => {
        let value = (formData as any)[key];

        // Convert value for database (null if empty/zero, number if numeric)
        if (key === 'experience_years' || key === 'department_id') {
            const num = Number(value);
            value = isNaN(num) || num === 0 ? null : num;
        } else if (value === '' || value === '0') {
             value = null; // Convert empty strings to null for text fields
        }

        if (value !== null && value !== undefined) {
            updatePayload[key] = value;
        }
    });

    if (Object.keys(updatePayload).length === 0) {
        alert("No changes detected.");
        setIsEditing(false);
        return;
    }
    // --- End Payload Filtering ---


    try {
      console.log("🔹 Sending update payload:", updatePayload);

      const response = await axios.put(
        `${API_BASE_URL}/api/doctor/profile`,
        updatePayload, // Send the clean, filtered payload
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Update response:", response.data);
      alert("✅ Profile updated successfully!");
        
      // Update the state with the exact values sent to the DB
      setProfileData({ ...profileData!, Doctor: updatePayload as DoctorDetails }); 
      setIsEditing(false);
    } catch (err: any) {
      console.error("❌ PUT profile error full object:", err);
      
      let msg = err.response?.data?.message || "Unknown error";
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

            <div className="grid md:grid-cols-1 gap-6">
              {/* Full Name & Email (Read-Only) */}
              <div><label className="block text-gray-700 font-semibold mb-2">Full Name</label><input type="text" value={profileData.name} disabled className="w-full p-3 border border-gray-100 rounded-md" /></div>
              <div><label className="block text-gray-700 font-semibold mb-2">Email</label><input type="email" value={profileData.email} disabled className="w-full p-3 border border-gray-100 rounded-md" /></div>
            </div>

            {/* --- PROFESSIONAL INFO --- */}
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2 pt-6">
              Professional Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Department Dropdown (NEW) */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Assigned Department</label>
                <select 
                    name="department_id" 
                    value={formData.department_id || ''} 
                    onChange={handleChange} 
                    disabled={!isEditing} 
                    className="w-full p-3 border rounded-md"
                >
                    <option value="">-- Select Department --</option>
                    {/* CRITICAL: Loop through fetched departments */}
                    {departments.map(dept => (
                        <option key={dept.department_id} value={dept.department_id}>
                            {dept.name}
                        </option>
                    ))}
                </select>
              </div>

              {/* Specialization Input (Now separate from Department FK) */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Specialization (Field)</label>
                <input type="text" name="specialization" value={formData.specialization || ""} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border rounded-md" />
              </div>
              
              {/* License Number */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">License Number</label>
                <input type="text" name="license_number" value={formData.license_number || ""} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border rounded-md" />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                <input type="tel" name="phone_number" value={formData.phone_number || ""} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border rounded-md" />
              </div>

              {/* Experience Years */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Years of Experience</label>
                <input type="number" name="experience_years" value={formData.experience_years || 0} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border rounded-md" />
              </div>

              {/* Education (Full Width) */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Education</label>
                <input type="text" name="education" value={formData.education || ""} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border rounded-md" />
              </div>

              {/* Bio (Full Width - Textarea) */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Bio</label>
                <textarea name="bio" value={formData.bio || ""} onChange={handleChange} disabled={!isEditing} rows={4} className="w-full p-3 border rounded-md" />
              </div>

              {/* Languages Spoken (Full Width) */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Languages Spoken (comma-separated)</label>
                <input type="text" name="languages_spoken" value={formData.languages_spoken || ""} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border rounded-md" />
              </div>
            </div>

            {/* --- ACTION BUTTONS --- */}
            <div className="pt-4">
                {!isEditing ? (
                    <button
                        type="button"
                        onClick={handleEdit}
                        className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300"
                    >
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="w-1/2 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition duration-300"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="w-1/2 py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition duration-300"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}