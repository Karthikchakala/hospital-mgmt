// src/app/about/page.tsx

// import Navbar from '../../components/Navbar';
// import Footer from '../../components/Footer';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* <Navbar /> */}
      <main className="flex-grow container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Committed to Your Health, Driven by Compassion</h1>
        <p className="mb-4 text-lg text-gray-700">
          At **[Hospital Name]**, our mission is simple: to provide accessible, exceptional, and compassionate healthcare to every member of our community. Founded in [Year], we have grown to be a trusted leader in medical innovation and patient-centered care.
        </p>
        <p className="mb-4 text-lg text-gray-700">
          Our foundation rests on three pillars: **Integrity**, **Innovation**, and **Compassion**. We believe true healing encompasses physical well-being and emotional support. We are more than just a hospital—we are your partners in health.
        </p>
      </main>
      {/* <Footer /> */}
    </div>
  );
}