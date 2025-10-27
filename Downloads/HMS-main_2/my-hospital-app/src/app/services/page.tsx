// src/app/services/page.tsx

// import Navbar from '../../components/Navbar';
// import Footer from '../../components/Footer';

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* <Navbar /> */}
      <main className="flex-grow container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Our Medical Services
        </h1>

        <p className="text-center text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
          At <span className="font-semibold text-blue-700">Hospify</span>, 
          we are committed to providing world-class healthcare across a wide range of specialties.
          Our expert doctors, modern infrastructure, and compassionate staff ensure that every
          patient receives the highest quality of care.
        </p>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Service 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold text-blue-700 mb-3">Emergency & Trauma Care</h2>
            <p className="text-gray-700">
              Our 24/7 Emergency Department is equipped with advanced life-saving equipment
              and staffed by experienced professionals trained in trauma management,
              critical care, and emergency response.
            </p>
          </div>

          {/* Service 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold text-blue-700 mb-3">Cardiology</h2>
            <p className="text-gray-700">
              From preventive screenings to complex heart surgeries,
              our Cardiology Department offers comprehensive heart care
              supported by advanced diagnostic tools and experienced cardiologists.
            </p>
          </div>

          {/* Service 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold text-blue-700 mb-3">Orthopedics & Joint Care</h2>
            <p className="text-gray-700">
              Our orthopedic specialists provide advanced care for bone,
              joint, and muscle conditions including arthritis, fractures,
              sports injuries, and joint replacements.
            </p>
          </div>

          {/* Service 4 */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold text-blue-700 mb-3">Maternity & Child Care</h2>
            <p className="text-gray-700">
              Our maternity unit offers safe and comfortable birthing experiences,
              neonatal care, and pediatric services to ensure the health of both mother and child.
            </p>
          </div>

          {/* Service 5 */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold text-blue-700 mb-3">Neurology</h2>
            <p className="text-gray-700">
              Our neurology team provides diagnosis and treatment for disorders
              of the brain, spine, and nervous system, using cutting-edge imaging
              and surgical techniques.
            </p>
          </div>

          {/* Service 6 */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold text-blue-700 mb-3">Diagnostic & Imaging</h2>
            <p className="text-gray-700">
              Equipped with the latest MRI, CT, and ultrasound technologies,
              our diagnostic department ensures accurate and timely test results
              to support treatment decisions.
            </p>
          </div>

          {/* Service 7 */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold text-blue-700 mb-3">Cancer Care (Oncology)</h2>
            <p className="text-gray-700">
              Our oncology specialists offer comprehensive cancer treatment including
              chemotherapy, radiation, and surgery, along with emotional and psychological support.
            </p>
          </div>

          {/* Service 8 */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold text-blue-700 mb-3">Physiotherapy & Rehabilitation</h2>
            <p className="text-gray-700">
              Our physiotherapy unit helps patients recover strength, mobility, and function
              after surgery, injury, or illness through personalized therapy programs.
            </p>
          </div>

          {/* Service 9 */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold text-blue-700 mb-3">Dental & Oral Care</h2>
            <p className="text-gray-700">
              From preventive dental checkups to cosmetic and restorative treatments,
              our dental team provides comprehensive oral healthcare for all ages.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-blue-700 text-white text-center p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Need Specialized Care?</h2>
          <p className="text-lg mb-6">
            Schedule an appointment with one of our expert doctors today.
            Your health is our top priority.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition"
          >
            Contact Us
          </a>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}