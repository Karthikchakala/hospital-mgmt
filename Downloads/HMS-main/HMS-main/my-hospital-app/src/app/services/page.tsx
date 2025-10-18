// src/app/services/page.tsx

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Comprehensive Care Across All Specialties</h1>
        <p className="mb-4 text-lg text-gray-700">
          **[Hospital Name]** offers a full spectrum of advanced medical services, ensuring you receive specialized care without having to travel. Our multidisciplinary teams collaborate to provide integrated and personalized treatment plans.
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-4 border-t">Key Services Offered:</h2>
        <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
          <li>**Emergency & Trauma:** Open 24/7, staffed by board-certified emergency physicians.</li>
          <li>**Cardiology:** Advanced heart care, including non-invasive diagnostics.</li>
          <li>**Orthopedics:** Specializing in joint replacement, sports medicine, and spine care.</li>
          <li>**Diagnostic Imaging & Lab:** Equipped with modern MRI, CT, and advanced laboratory testing services.</li>
          <li>**Maternity & Pediatrics:** Dedicated wings offering compassionate care for mothers and children.</li>
        </ul>
      </main>
      <Footer />
    </div>
  );
}