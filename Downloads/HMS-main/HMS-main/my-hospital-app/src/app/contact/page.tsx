// src/app/contact/page.tsx

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Map from '../../components/Map';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold text-gray-100 mb-6">Get in Touch: We're Here to Help</h1>
        
        <div className="mb-8 p-6 bg-grey shadow-md rounded-lg">
            <p className="text-lg font-semibold mb-2">General Enquiries:</p>
            <p>Phone: **(123) 456-7890** (Main Switchboard)</p>
            <p>Email: info@yourhospitalname.com</p>
            <p className="mt-4 text-sm text-gray-600">**Visiting Hours:** Daily: 11:00 AM – 1:00 PM and 4:00 PM – 8:00 PM</p>
        </div>

        <h2 className="text-2xl font-bold text-gray mb-4 pt-4 border-t"></h2>
        <div className="h-[4050px] mb-8 shadow-lg rounded-lg overflow-hidden">
            <Map />
        </div>
        
      </main>
      <Footer />
    </div>
  );
}