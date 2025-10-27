import React from "react";
import Map from "../../components/Map";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* <Navbar /> */}

      <main className="flex-grow container mx-auto py-12 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-8 text-center">
          Get in Touch: We’re Here to Help
        </h1>

        {/* Contact Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left - Contact Details */}
          <div className="bg-gray-50 p-8 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
              General Enquiries
            </h2>
            <p className="text-lg mb-2">
              <strong>📞 Phone:</strong>{" "}
              <span className="text-gray-900">(+91) 8328134131</span> <br />
              (Main Switchboard)
            </p>
            <p className="text-lg mb-2">
              <strong>✉️ Email:</strong>{" "}
              <a
                href="mailto:info@yourhospitalname.com"
                className="text-blue-600 hover:underline"
              >
                contactus@hospify.com
              </a>
            </p>

            <p className="text-lg mb-2">
              <strong>📍 Address:</strong> IIITDM Kurnool, Andhra Pradesh, India.
              
            </p>

            <p className="text-sm text-gray-600 mt-4">
              <strong>🕒 Visiting Hours:</strong> Daily: 11:00 AM – 1:00 PM and
              4:00 PM – 8:00 PM
            </p>
          </div>

          {/* Right - Emergency Info */}
          <div className="bg-blue-50 p-8 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">
              Emergency & Quick Assistance
            </h2>
            <p className="text-lg mb-2">
              <strong>🚨 Emergency Helpline:</strong>{" "}
              <span className="text-red-600 font-semibold">(+91) 8328134131</span>
            </p>
            <p className="text-lg mb-2">
              <strong>🏥 Ambulance Service:</strong>{" "}
              <span className="text-gray-700">(+91) 8328134131</span>
            </p>
            <p className="text-lg mb-2">
              <strong>📧 Emergency Email:</strong>{" "}
              <a
                href="mailto:emergency@hospify.com"
                className="text-blue-600 hover:underline"
              >
                emergency@hospify.com
              </a>
            </p>

            <p className="text-sm text-gray-600 mt-4">
              <strong>24×7 Emergency Department:</strong> Fully equipped trauma
              and critical care unit with on-call specialists.
            </p>
          </div>
        </div>

        {/* Divider */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pt-10 border-t mt-12 text-center">
          Find Us on the Map
        </h2>

        {/* Map Section */}
        <div className="h-[1000px] mb-12 shadow-lg rounded-xl overflow-hidden">
          <Map />
        </div>

        {/* Optional Contact Note */}
        <div className="text-center max-w-2xl mx-auto text-gray-700">
          <p className="text-lg">
            For appointment scheduling or specialist consultations, please
            contact our front desk or fill out the online appointment form.  
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Our support team responds to all inquiries within 24 hours (excluding Sundays & holidays).
          </p>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
