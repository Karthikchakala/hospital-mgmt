// 'use client';

// import DashboardNavbar from '../../../../components/DashboardNavbar';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// interface PatientDetails {
//   aadhaar_number: string;
//   father_name: string;
//   mother_name: string;
//   additional_phone_number: string;
//   blood_group: string;
//   age: number;
//   gender: string;
//   street: string;
//   city: string;
//   district: string;
//   state: string;
//   country: string;
// }

// interface UserProfile {
//   name: string;
//   email: string;
//   role: string;
//   Patient: PatientDetails;
// }

// export default function PatientProfilePage() {
//   const router = useRouter();
//   const [profileData, setProfileData] = useState<UserProfile | null>(null);
//   const [formData, setFormData] = useState<PatientDetails>({
//     aadhaar_number: '',
//     father_name: '',
//     mother_name: '',
//     additional_phone_number: '',
//     blood_group: '',
//     age: 0,
//     gender: '',
//     street: '',
//     city: '',
//     district: '',
//     state: '',
//     country: '',
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode

//   // Define navigation links for the navbar
//   const patientNavLinks = [
//     { name: 'Appointments', href: '/dashboard/patient/appointments' },
//     { name: 'Profile', href: '/dashboard/patient/profile' },
//     { name: 'Bills', href: '/dashboard/patient/bills' },
//     { name: 'History', href: '/dashboard/patient/medical-history' },
//   ];

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         router.push('/login');
//         return;
//       }

//       try {
//         const response = await axios.get('http://localhost:5000/api/patient/profile', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setProfileData(response.data);
//         setFormData(response.data.Patient);
//       } catch (error) {
//         console.error('Failed to fetch profile data:', error);
//         localStorage.removeItem('token');
//         router.push('/login');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [router]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const handleCancel = () => {
//     // Reset form data to original profile data
//     if (profileData) {
//       setFormData(profileData.Patient);
//     }
//     setIsEditing(false);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     if (!token) return;
//     try {
//       // You will create this PUT endpoint on the backend later
//       await axios.put('http://localhost:5000/api/patient/profile', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       alert('Profile updated successfully!');
//       setIsEditing(false); // Exit edit mode on success
//     } catch (error) {
//       console.error('Failed to update profile:', error);
//       alert('Failed to update profile.');
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <h1 className="text-2xl font-bold">Loading Profile...</h1>
//       </div>
//     );
//   }

//   if (!profileData) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <h1 className="text-2xl font-bold">Profile not found.</h1>
//       </div>
//     );
//   }
  
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <DashboardNavbar
//         title="Patient Portal"
//         navLinks={patientNavLinks}
//         userName={profileData.name}
//       />
//       <main className="container mx-auto py-12 px-6">
//         <h1 className="text-4xl font-bold mb-8">My Profile</h1>
//         <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Personal Information</h2>
//             {/* Display user's name and email as read-only */}
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">Name</label>
//               <input type="text" value={profileData.name} disabled className="w-full p-3 border border-gray-300 rounded-md bg-gray-200" />
//             </div>
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">Email</label>
//               <input type="email" value={profileData.email} disabled className="w-full p-3 border border-gray-300 rounded-md bg-gray-200" />
//             </div>
            
//             {/* Dynamic fields for patient-specific data */}
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">Aadhaar Number</label>
//               <input type="text" name="aadhaar_number" value={formData.aadhaar_number || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border border-gray-300 rounded-md" />
//             </div>
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">Father's Name</label>
//               <input type="text" name="father_name" value={formData.father_name || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border border-gray-300 rounded-md" />
//             </div>
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">Mother's Name</label>
//               <input type="text" name="mother_name" value={formData.mother_name || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border border-gray-300 rounded-md" />
//             </div>
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">Additional Phone Number</label>
//               <input type="tel" name="additional_phone_number" value={formData.additional_phone_number || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border border-gray-300 rounded-md" />
//             </div>
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">Blood Group</label>
//               <input type="text" name="blood_group" value={formData.blood_group || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border border-gray-300 rounded-md" />
//             </div>
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">Age</label>
//               <input type="number" name="age" value={formData.age || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border border-gray-300 rounded-md" />
//             </div>
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">Gender</label>
//               <select name="gender" value={formData.gender || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border border-gray-300 rounded-md">
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//             <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Address</h2>
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">Street</label>
//               <input type="text" name="street" value={formData.street || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border border-gray-300 rounded-md" />
//             </div>
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">City</label>
//               <input type="text" name="city" value={formData.city || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border border-gray-300 rounded-md" />
//             </div>
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">District</label>
//               <input type="text" name="district" value={formData.district || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border border-gray-300 rounded-md" />
//             </div>
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">State</label>
//               <input type="text" name="state" value={formData.state || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border border-gray-300 rounded-md" />
//             </div>
//             <div>
//               <label className="block text-gray-700 font-semibold mb-2">Country</label>
//               <input type="text" name="country" value={formData.country || ''} onChange={handleChange} disabled={!isEditing} className="w-full p-3 border border-gray-300 rounded-md" />
//             </div>
            
//             {/* Buttons for edit mode */}
//             {!isEditing ? (
//               <button
//                 type="button"
//                 onClick={handleEdit}
//                 className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300"
//               >
//                 Edit Profile
//               </button>
//             ) : (
//               <div className="flex space-x-4">
//                 <button
//                   type="submit"
//                   className="w-1/2 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition duration-300"
//                 >
//                   Save Changes
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="w-1/2 py-3 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition duration-300"
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

interface PatientDetails {
  aadhaar_number: string;
  father_name: string;
  mother_name: string;
  additional_phone_number: string;
  blood_group: string;
  age: number;
  gender: string;
  street: string;
  city: string;
  district: string;
  state: string;
  country: string;
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
  Patient: PatientDetails;
}

export default function PatientProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<PatientDetails>({
    aadhaar_number: '',
    father_name: '',
    mother_name: '',
    additional_phone_number: '',
    blood_group: '',
    age: 0,
    gender: '',
    street: '',
    city: '',
    district: '',
    state: '',
    country: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const patientNavLinks = [
    { name: 'Appointments', href: '/dashboard/patient/appointments' },
    { name: 'Profile', href: '/dashboard/patient/profile' },
    { name: 'Bills', href: '/dashboard/patient/bills' },
    { name: 'History', href: '/dashboard/patient/medical-history' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/patient/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data);
        setFormData(response.data.Patient);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (profileData) {
      setFormData(profileData.Patient);
    }
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    // ✅ Construct the final payload manually
    const finalPayload = {
      aadhaar_number: formData.aadhaar_number || null,
      father_name: formData.father_name || null,
      mother_name: formData.mother_name || null,
      additional_phone_number: formData.additional_phone_number || null,
      blood_group: formData.blood_group || null,
      age: formData.age !== null && formData.age !== 0 ? formData.age : null,
      gender: formData.gender || null,
      street: formData.street || null,
      city: formData.city || null,
      district: formData.district || null,
      state: formData.state || null,
      country: formData.country || null,
    };

    try {
      await axios.put('http://localhost:5000/api/patient/profile', finalPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold">Loading Profile...</h1>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold">Profile not found.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar
        title="Patient Portal"
        navLinks={patientNavLinks}
        userName={profileData.name}
      />
      <main className="container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Personal Information</h2>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                value={profileData.name}
                disabled
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-200"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-200"
              />
            </div>

            {/* Editable patient-specific fields */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Aadhaar Number</label>
              <input
                type="text"
                name="aadhaar_number"
                value={formData.aadhaar_number || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Father's Name</label>
              <input
                type="text"
                name="father_name"
                value={formData.father_name || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Mother's Name</label>
              <input
                type="text"
                name="mother_name"
                value={formData.mother_name || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Additional Phone Number</label>
              <input
                type="tel"
                name="additional_phone_number"
                value={formData.additional_phone_number || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Blood Group</label>
              <input
                type="text"
                name="blood_group"
                value={formData.blood_group || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Address</h2>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Street</label>
              <input
                type="text"
                name="street"
                value={formData.street || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">District</label>
              <input
                type="text"
                name="district"
                value={formData.district || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">State</label>
              <input
                type="text"
                name="state"
                value={formData.state || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

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
          </form>
        </div>
      </main>
    </div>
  );
}
