// backend/server.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import ALL necessary route files
import authRoutes from './routes/authRoutes';
import utilsRoutes from './routes/utilsRoutes';
import patientProfileRoutes from './routes/patient/profileRoutes';
import patientAppointmentRoutes from './routes/patient/appointmentRoutes';
import medicalHistoryRoutes from './routes/patient/medicalHistoryRoutes';
import billingRoutes from './routes/patient/billingRoutes';
import doctorProfileRoutes from './routes/doctor/profileRoutes';
import doctorAppointmentRoutes from './routes/doctor/appointmentRoutes';
import doctorUploadRoutes from './routes/doctor/uploadRoutes'; // NEW IMPORT
import doctorEmrRoutes from './routes/doctor/emrRoutes';


// --- Admin Module Imports (CRITICAL SECTION) ---
import adminDoctorRoutes from './routes/admin/doctorRoutes'; 
import adminPatientRoutes from './routes/admin/patientRoutes'; 
import adminProfileRoutes from './routes/admin/profileRoutes';
import adminStaffRoutes from './routes/admin/staffRoutes';
import staffProfileRoutes from './routes/staff/profileRoutes';
import labRoutes from './routes/staff/labRoutes'; 
import patientRegistrationRoutes from './routes/staff/patientRegistrationRoutes';
import pharmacyRoutes from './routes/staff/pharmacyRoutes';
import dailyAppointmentsRoutes from './routes/staff/dailyAppointmentsRoutes';
import adminDepartmentRoutes from './routes/admin/departmentsRoutes';
import adminSettingsRoutes from './routes/admin/settingsRoutes';
import adminAuditRoutes from './routes/admin/auditRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/utils', utilsRoutes);

// --- Patient Routes ---
app.use('/api/patient', patientProfileRoutes);
app.use('/api/patient', patientAppointmentRoutes);
app.use('/api/patient', medicalHistoryRoutes);
app.use('/api/patient', billingRoutes);

// --- Doctor Routes ---
app.use('/api/doctor', doctorProfileRoutes);
// console.log("✅ Doctor profile routes loaded");
app.use('/api/doctor', doctorAppointmentRoutes);
app.use('/api/doctor', doctorUploadRoutes); // NEW LINE
app.use('/api/doctor', doctorEmrRoutes);

// --- Admin Routes (FIX: Link all files explicitly) ---
app.use('/api/admin', adminDoctorRoutes); 
app.use('/api/admin', adminPatientRoutes); // Ensures /api/admin/patients is found
app.use('/api/admin', adminStaffRoutes);   // Ensures /api/admin/staff is found
app.use('/api/admin', adminProfileRoutes);
app.use('/api/admin', adminDepartmentRoutes);
app.use('/api/admin', adminSettingsRoutes);



app.use('/api/staff', staffProfileRoutes); 
app.use('/api/staff', labRoutes);
app.use('/api/staff', patientRegistrationRoutes);
app.use('/api/admin', adminAuditRoutes);
app.use('/api/staff', pharmacyRoutes);
app.use('/api/staff', dailyAppointmentsRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});