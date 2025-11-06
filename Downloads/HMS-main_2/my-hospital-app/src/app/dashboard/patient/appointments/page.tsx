'use client';

import { useState, useEffect } from 'react';
import DashboardNavbar from '../../../../components/DashboardNavbar';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Razorpay global object
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Department {
  department_id: number;
  name: string;
}

interface Doctor {
  doctor_id: number;
  name: string;
  specialization: string;
}

export default function AppointmentsPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [price, setPrice] = useState(0);

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const patientNavLinks = [
    { name: 'Appointments', href: '/dashboard/patient/appointments' },
    { name: 'Profile', href: '/dashboard/patient/profile' },
    { name: 'Bills', href: '/dashboard/patient/bills' },
    { name: 'History', href: '/dashboard/patient/medical-history' },
  ];

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const [userResponse, deptResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/patient/profile', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/patient/appointments/departments', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUserName(userResponse.data.name);
        setUserEmail(userResponse.data.email);
        setDepartments(deptResponse.data);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [router]);

  useEffect(() => {
    if (selectedDepartment) {
      const fetchDoctors = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          const response = await axios.get(
            `http://localhost:5000/api/patient/appointments/doctors/${selectedDepartment}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setDoctors(
            response.data.map((doc: any) => ({
              doctor_id: doc.doctor_id,
              name: doc.User.name,
              specialization: doc.specialization,
            }))
          );
        } catch (error) {
          console.error('Failed to fetch doctors:', error);
        }
      };
      fetchDoctors();
    } else {
      setDoctors([]);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const fetchTimeSlots = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
          const response = await axios.get(
            `http://localhost:5000/api/patient/appointments/times/${selectedDoctor}/${selectedDate}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setTimeSlots(response.data.timeSlots);
          setPrice(response.data.price);
        } catch (error) {
          console.error('Failed to fetch time slots:', error);
        }
      };
      fetchTimeSlots();
    } else {
      setTimeSlots([]);
      setPrice(0);
    }
  }, [selectedDoctor, selectedDate]);

  const finalizeAppointmentAndBill = async (
    paymentResponse: any,
    orderId: string,
    amount: number
  ) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.post(
        'http://localhost:5000/api/patient/appointments',
        {
          doctorId: selectedDoctor,
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
          reason,
          paymentDetails: {
            orderId,
            paymentId: paymentResponse.razorpay_payment_id,
            signature: paymentResponse.razorpay_signature,
            amount,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      try {
        await axios.post(
          'http://localhost:5000/api/video/invite',
          { doctorId: selectedDoctor, roomId: `appt-${orderId}`, paymentMode: 'Razorpay' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch {}
      alert('✅ Appointment booked successfully! Check your bills.');
      router.push('/dashboard/patient/bills');
    } catch (error) {
      console.error('Appointment Finalization Failed:', error);
      alert('Appointment booked but failed to finalize payment status. Contact support.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token || price <= 0) return;

    if (!selectedDepartment || !selectedDoctor || !selectedDate || !selectedTime || !reason) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      const txnResponse = await axios.post(
        'http://localhost:5000/api/patient/payment/generate-txn',
        { amount: price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { orderId, keyId, amount, currency } = txnResponse.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: 'Global Health Center',
        description: `Consultation Fee for Dr. ${
          doctors.find((d) => String(d.doctor_id) === selectedDoctor)?.name || ''
        }`,
        order_id: orderId,
        handler: async (response: any) => {
          await finalizeAppointmentAndBill(response, orderId, price);
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: '9876543210',
        },
        theme: { color: '#3B82F6' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Payment Initiation Failed:', error);
      alert(
        `Payment initiation failed: ${error.response?.data?.message || 'Check backend logs.'}`
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900 text-white">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-gray-100 bg-slate-900">
      <DashboardNavbar title="Patient Portal" navLinks={patientNavLinks} userName={userName} />
      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-cyan-300 text-center sm:text-left">
          Appointments
        </h1>

        <div className="bg-slate-800 border border-cyan-700 p-6 sm:p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center sm:text-left">
            Book a New Appointment
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Department Selection */}
            <div>
              <label className="block text-gray-200 font-semibold mb-2">Select Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">-- Choose a Department --</option>
                {departments.map((dept) => (
                  <option key={dept.department_id} value={dept.department_id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="block text-gray-200 font-semibold mb-2">Select Doctor</label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                disabled={!selectedDepartment || doctors.length === 0}
                className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
              >
                <option value="">-- Choose a Doctor --</option>
                {doctors.map((doctor) => (
                  <option key={doctor.doctor_id} value={doctor.doctor_id}>
                    {doctor.name} ({doctor.specialization})
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Slots */}
            <div>
              <label className="block text-gray-200 font-semibold mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-400"
                disabled={!selectedDoctor}
              />
            </div>

            <div>
              <label className="block text-gray-200 font-semibold mb-2">Available Time Slots</label>
              <div className="flex flex-wrap gap-2">
                {timeSlots.length > 0 ? (
                  timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`px-4 py-2 border rounded-md transition-all duration-300 ${
                        selectedTime === time
                          ? 'bg-cyan-500 text-white border-cyan-400'
                          : 'bg-gray-800 text-gray-200 hover:bg-gray-700 border-gray-600'
                      }`}
                    >
                      {time}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">
                    {selectedDate
                      ? 'No time slots for this date.'
                      : 'Choose a date to view times.'}
                  </p>
                )}
              </div>
            </div>

            {/* Price */}
            {price > 0 && (
              <div className="flex justify-between items-center text-lg sm:text-xl font-bold mt-4">
                <span>Consultation Fee:</span>
                <span className="text-cyan-400">₹{price}</span>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-gray-200 font-semibold mb-2">
                Reason for Appointment
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedDoctor || !selectedTime || !reason || price <= 0}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-md hover:from-teal-400 hover:to-cyan-400 shadow-lg transition-all"
            >
              Pay ₹{price} & Book Appointment
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
