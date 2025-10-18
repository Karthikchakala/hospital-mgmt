// // src/app/dashboard/staff/pharmacist/dispensary-management/page.tsx

// 'use client';

// import DashboardNavbar from '../../../../../components/DashboardNavbar';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// interface AppointmentForDispense {
//     appointment_id: number;
//     patient_id: number;
//     doctor_name: string;
//     patient_name: string;
//     prescription_text: string;
//     appointment_date: string;
// }

// export default function DispensaryManagementPage() {
//     const router = useRouter();
//     const [pendingAppointments, setPendingAppointments] = useState<AppointmentForDispense[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [userName, setUserName] = useState('Pharmacist'); 
    
//     // State for the currently selected prescription and billing details
//     const [selectedAppt, setSelectedAppt] = useState<AppointmentForDispense | null>(null);
//     const [medicineCost, setMedicineCost] = useState(0);
//     const [consultationCharge, setConsultationCharge] = useState(0); // Optional: if pharmacist adds initial fee

//     const pharmacistNavLinks = [
//         { name: 'Dispense & Bill', href: '/dashboard/staff/pharmacist/dispensary-management' },
//     ];

//     // --- Fetch Pending Appointments ---
//     const fetchPrescriptions = async () => {
//         const token = localStorage.getItem('token');
//         if (!token) { router.push('/login'); return; }

//         try {
//             const userResponse = await axios.get('http://localhost:5000/api/staff/profile', { headers: { Authorization: `Bearer ${token}` } });
//             setUserName(userResponse.data.name);

//             const apptResponse = await axios.get('http://localhost:5000/api/staff/pharmacy/pending', { headers: { Authorization: `Bearer ${token}` } });
//             setPendingAppointments(apptResponse.data);
//         } catch (error) {
//             console.error('Failed to fetch pending dispensing tasks:', error);
//             localStorage.removeItem('token');
//             router.push('/login'); 
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPrescriptions();
//     }, [router]);

//     // --- Billing and Dispensing Handler ---
//     const handleDispense = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!selectedAppt || medicineCost <= 0) {
//             alert('Please select an appointment and enter a valid medicine cost.');
//             return;
//         }

//         const token = localStorage.getItem('token');
//         if (!token) return;

//         const totalBillAmount = medicineCost + consultationCharge;
        
//         try {
//             await axios.put(`http://localhost:5000/api/staff/pharmacy/dispense/${selectedAppt.appointment_id}`, {
//                 patientId: selectedAppt.patient_id, 
//                 medicineCost: medicineCost,
//                 totalBillAmount: totalBillAmount,
//             }, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             alert(`Dispensed for ${selectedAppt.patient_name}. Bill of ₹${totalBillAmount.toFixed(2)} generated.`);
            
//             // Update local state to remove the item instantly
//             setPendingAppointments(prev => prev.filter(p => p.appointment_id !== selectedAppt.appointment_id));
//             setSelectedAppt(null); // Clear selected prescription

//         } catch (error) {
//             console.error('Dispensing failed:', error);
//             alert('Failed to dispense and generate bill. Check console.');
//         }
//     };

//     if (isLoading) {
//         // ... (Loading UI)
//     }

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <DashboardNavbar title="Pharmacist Portal" navLinks={pharmacistNavLinks} userName={userName} />
//             <main className="container mx-auto py-12 px-6">
//                 <h1 className="text-4xl font-bold text-gray-800 mb-8">Prescription Dispensing & Billing</h1>
                
//                 {/* --- Selected Prescription / Billing Form --- */}
//                 <div className="bg-white p-8 rounded-lg shadow-xl mb-10 border-t-4 border-red-500">
//                     <h2 className="text-2xl font-semibold mb-4">
//                         {selectedAppt ? `Billing Patient: ${selectedAppt.patient_name}` : 'Select a Prescription Below'}
//                     </h2>
                    
//                     {selectedAppt && (
//                         <form onSubmit={handleDispense} className="space-y-6">
                            
//                             {/* Prescription Text Display */}
//                             <div className="p-4 bg-red-50 border border-red-200 rounded-md">
//                                 <p className="font-bold text-red-700 mb-1">Prescription Details (from Doctor):</p>
//                                 <pre className="text-sm whitespace-pre-wrap">{selectedAppt.prescription_text}</pre>
//                             </div>
                            
//                             {/* Cost Input */}
//                             <h3 className="text-lg font-bold border-b pb-2">Billing Details</h3>
//                             <div className="grid md:grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-gray-700">Medicine Cost (₹)</label>
//                                     <input 
//                                         type="number" 
//                                         value={medicineCost} 
//                                         onChange={(e) => setMedicineCost(parseFloat(e.target.value) || 0)} 
//                                         required 
//                                         className="w-full p-3 border rounded-md"
//                                         placeholder="Enter total cost of dispensed medicines"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-gray-700">Other Charge (₹)</label>
//                                     <input 
//                                         type="number" 
//                                         value={consultationCharge} 
//                                         onChange={(e) => setConsultationCharge(parseFloat(e.target.value) || 0)} 
//                                         className="w-full p-3 border rounded-md"
//                                         placeholder="0.00"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Total Display */}
//                             <div className="flex justify-between items-center text-xl font-bold text-gray-800 pt-2 border-t border-gray-200">
//                                 <span>TOTAL BILL:</span>
//                                 <span className="text-red-600">₹{(medicineCost + consultationCharge).toFixed(2)}</span>
//                             </div>

//                             <button
//                                 type="submit"
//                                 className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300"
//                             >
//                                 DISPENSE MEDICINES & GENERATE BILL
//                             </button>
//                         </form>
//                     )}
//                 </div>

//                 {/* --- Pending Prescriptions List --- */}
//                 <h2 className="text-3xl font-bold text-gray-800 mb-6">Pending Prescriptions ({pendingAppointments.length})</h2>
//                 {pendingAppointments.length === 0 ? (
//                     <div className="bg-white p-10 rounded-lg shadow-md text-center">
//                         <p className="text-xl text-green-600">No prescriptions are currently pending dispense.</p>
//                     </div>
//                 ) : (
//                     <div className="space-y-4">
//                         {pendingAppointments.map(appt => (
//                             <div key={appt.appointment_id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center transition-all duration-200 hover:shadow-md border-l-4 border-gray-200">
//                                 <div>
//                                     <h3 className="text-lg font-semibold">{appt.patient_name}</h3>
//                                     <p className="text-sm text-gray-600">Date: {new Date(appt.appointment_date).toLocaleDateString()}</p>
//                                 </div>
//                                 <button
//                                     onClick={() => setSelectedAppt(appt)}
//                                     className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full hover:bg-blue-200 transition duration-200"
//                                 >
//                                     Process & Bill
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// }

// src/app/dashboard/staff/pharmacist/dispensary-management/page.tsx

'use client';

import DashboardNavbar from '../../../../../components/DashboardNavbar';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'; // Icons for add/remove

interface MedicineCatalog {
    pharmacy_id: number;
    medicine_details: string; // Name of the medicine
    price: number;           // Price per unit
}

interface SelectedMedicine {
    id: number; // Unique local ID for React key/management
    medicineId: string; // ID of the medicine selected from catalog
    quantity: number;
    price: number; // Price per unit
}

interface AppointmentForDispense {
    appointment_id: number;
    patient_id: number;
    patient_name: string;
    prescription_text: string;
    appointment_date: string;
    // doctor_name is added on backend
}

export default function DispensaryManagementPage() {
    const router = useRouter();
    const [pendingAppointments, setPendingAppointments] = useState<AppointmentForDispense[]>([]);
    const [medicineCatalog, setMedicineCatalog] = useState<MedicineCatalog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('Pharmacist'); 
    
    // State for the currently selected appointment
    const [selectedAppt, setSelectedAppt] = useState<AppointmentForDispense | null>(null);
    
    // CRITICAL STATE: Array to hold dynamic medicine selections
    const [selectedMedicines, setSelectedMedicines] = useState<SelectedMedicine[]>([{ 
        id: Date.now(), medicineId: '', quantity: 1, price: 0 
    }]);

    const pharmacistNavLinks = [
        { name: 'Dispense & Bill', href: '/dashboard/staff/pharmacist/dispensary-management' },
    ];

    // --- Data Fetching ---
    useEffect(() => {
        const fetchInitialData = async () => {
            const token = localStorage.getItem('token');
            if (!token) { router.push('/login'); return; }

            try {
                // 1. Fetch Profile
                const userResponse = await axios.get('http://localhost:5000/api/staff/profile', { headers: { Authorization: `Bearer ${token}` } });
                setUserName(userResponse.data.name);

                // 2. Fetch Pending Appointments (from the previous logic)
                const apptResponse = await axios.get('http://localhost:5000/api/staff/pharmacy/pending', { headers: { Authorization: `Bearer ${token}` } });
                setPendingAppointments(apptResponse.data);

                // 3. Fetch Medicine Catalog
                const medResponse = await axios.get('http://localhost:5000/api/staff/pharmacy/medicines', { headers: { Authorization: `Bearer ${token}` } });
                setMedicineCatalog(medResponse.data);

            } catch (error) {
                console.error('Failed to fetch initial data:', error);
                // On any critical failure, clear and redirect
                localStorage.removeItem('token');
                router.push('/login'); 
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [router]);

    // --- Dynamic Form Handlers ---
    
    // Add new row to the medicines list
    const handleAddMedicine = () => {
        setSelectedMedicines([...selectedMedicines, { id: Date.now(), medicineId: '', quantity: 1, price: 0 }]);
    };

    // Remove row from the medicines list
    const handleRemoveMedicine = (id: number) => {
        setSelectedMedicines(selectedMedicines.filter(med => med.id !== id));
    };

    // Update medicine quantity or selection
    const handleMedicineChange = (id: number, field: keyof SelectedMedicine, value: string | number) => {
        setSelectedMedicines(selectedMedicines.map(med => {
            if (med.id === id) {
                if (field === 'medicineId') {
                    // When a medicine is selected, lookup its price from the catalog
                    const selectedItem = medicineCatalog.find(cat => String(cat.pharmacy_id) === String(value));
                    return { ...med, medicineId: String(value), price: selectedItem ? selectedItem.price : 0 };
                }
                if (field === 'quantity') {
                    return { ...med, quantity: Math.max(1, Number(value)) };
                }
            }
            return med;
        }));
    };

    // Calculate Total Cost dynamically
    const totalMedicineCost = useMemo(() => {
        return selectedMedicines.reduce((total, med) => total + (med.price * med.quantity), 0);
    }, [selectedMedicines]);


    // --- Billing and Dispensing Handler ---
    const handleDispense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAppt || totalMedicineCost <= 0) {
            alert('Please select an appointment and add medicines with a total cost greater than zero.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await axios.put(`http://localhost:5000/api/staff/pharmacy/dispense/${selectedAppt.appointment_id}`, {
                patientId: selectedAppt.patient_id, 
                // Send the total calculated cost
                medicineCost: totalMedicineCost,
                totalBillAmount: totalMedicineCost, // Simplified: assuming no other charges
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert(`Dispensed for ${selectedAppt.patient_name}. Bill of ₹${totalMedicineCost.toFixed(2)} generated.`);
            
            // Update local state to remove the item and reset form
            setPendingAppointments(prev => prev.filter(p => p.appointment_id !== selectedAppt.appointment_id));
            setSelectedAppt(null);
            setSelectedMedicines([{ id: Date.now(), medicineId: '', quantity: 1, price: 0 }]); // Reset form

        } catch (error) {
            console.error('Dispensing failed:', error);
            alert('Failed to dispense and generate bill.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold">Loading Pharmacy Portal...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Pharmacist Portal" navLinks={pharmacistNavLinks} userName={userName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Prescription Dispensing & Billing</h1>
                
                {/* --- Selected Prescription / Billing Form --- */}
                <div className="bg-white p-8 rounded-lg shadow-xl mb-10 border-t-4 border-red-500">
                    <h2 className="text-2xl font-semibold mb-4">
                        {selectedAppt ? `Billing Patient: ${selectedAppt.patient_name}` : 'Select a Prescription Below'}
                    </h2>
                    
                    {selectedAppt && (
                        <form onSubmit={handleDispense} className="space-y-6">
                            
                            {/* Prescription Text Display */}
                            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                <p className="font-bold text-red-700 mb-1">Prescription (from Doctor):</p>
                                <pre className="text-sm whitespace-pre-wrap">{selectedAppt.prescription_text}</pre>
                            </div>

                            {/* --- Dynamic Medicine List --- */}
                            <h3 className="text-lg font-bold border-b pb-2">Dispensed Items</h3>
                            <div className="space-y-3">
                                {selectedMedicines.map((med, index) => (
                                    <div key={med.id} className="grid grid-cols-12 gap-3 items-center">
                                        
                                        {/* Medicine Dropdown */}
                                        <div className="col-span-6">
                                            <select
                                                value={med.medicineId}
                                                onChange={(e) => handleMedicineChange(med.id, 'medicineId', e.target.value)}
                                                required
                                                className="w-full p-2 border rounded-md"
                                            >
                                                <option value="">-- Select Medicine --</option>
                                                {medicineCatalog.map(item => (
                                                    <option key={item.pharmacy_id} value={item.pharmacy_id}>
                                                        {item.medicine_details} (₹{item.price.toFixed(2)})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        {/* Quantity Input */}
                                        <div className="col-span-3">
                                            <input
                                                type="number"
                                                value={med.quantity}
                                                onChange={(e) => handleMedicineChange(med.id, 'quantity', e.target.value)}
                                                min="1"
                                                required
                                                className="w-full p-2 border rounded-md text-center"
                                            />
                                        </div>
                                        
                                        {/* Subtotal */}
                                        <div className="col-span-2 text-right font-medium">
                                            ₹{(med.price * med.quantity).toFixed(2)}
                                        </div>

                                        {/* Remove Button */}
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveMedicine(med.id)}
                                            className="col-span-1 p-2 text-red-600 hover:bg-red-100 rounded-full"
                                        >
                                            <XMarkIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Column Button and Total */}
                            <div className="flex justify-between items-center pt-2">
                                <button
                                    type="button"
                                    onClick={handleAddMedicine}
                                    className="flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                                >
                                    <PlusIcon className="w-5 h-5 mr-1" /> Add Medicine
                                </button>
                                
                                <div className="text-xl font-bold">
                                    Total: <span className="text-red-600">₹{totalMedicineCost.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={totalMedicineCost <= 0}
                                className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300"
                            >
                                DISPENSE & GENERATE BILL
                            </button>
                        </form>
                    )}
                </div>

                {/* --- Pending Prescriptions List (Remains the same) --- */}
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Pending Prescriptions ({pendingAppointments.length})</h2>
                {pendingAppointments.length === 0 ? (
                    <div className="bg-white p-10 rounded-lg shadow-md text-center">
                        <p className="text-xl text-green-600">No prescriptions are currently pending dispense.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingAppointments.map(appt => (
                            <div key={appt.appointment_id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center border-l-4 border-gray-200">
                                <div>
                                    <h3 className="text-lg font-semibold">{appt.patient_name} (ID: {appt.patient_id})</h3>
                                    <p className="text-sm text-gray-600">Prescribed: {new Date(appt.appointment_date).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedAppt(appt)}
                                    className="bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-red-600 transition duration-200"
                                >
                                    Process & Bill
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}