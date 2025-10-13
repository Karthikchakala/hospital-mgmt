// src/app/dashboard/staff/lab-technician/results-management/page.tsx

'use client';

import DashboardNavbar from '../../../../../components/DashboardNavbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface PendingTest {
    test_id: number;
    test_name: string;
    patient_name: string;
    patient_id: number;
    normal_range: string; // CRITICAL: Added normal_range for display
}

export default function ResultsManagementPage() {
    const router = useRouter();
    const [pendingTests, setPendingTests] = useState<PendingTest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('Lab Technician'); 
    
    // State for result submission form
    const [resultForm, setResultForm] = useState({
        testId: null as number | null,
        resultValue: '',
        unit: '',
    });
    const [selectedTestName, setSelectedTestName] = useState('');
    const [selectedTestNormalRange, setSelectedTestNormalRange] = useState(''); // New state for normal range

    const technicianNavLinks = [
        { name: 'Results', href: '/dashboard/staff/lab-technician/results-management' },
        { name: 'Samples', href: '/dashboard/staff/lab-technician/sample-tracking' },
    ];

    // --- Fetch Pending Tests and User Profile ---
    useEffect(() => {
        const fetchTests = async () => {
            const token = localStorage.getItem('token');
            if (!token) { router.push('/login'); return; }

            try {
                // Fetch profile data (for the navbar)
                const userResponse = await axios.get('http://localhost:5000/api/staff/profile', { headers: { Authorization: `Bearer ${token}` } });
                setUserName(userResponse.data.name);

                // Fetch pending tests
                const testResponse = await axios.get('http://localhost:5000/api/staff/lab/pending', { headers: { Authorization: `Bearer ${token}` } });
                setPendingTests(testResponse.data);
            } catch (error) {
                console.error('Failed to fetch tests:', error);
                // Redirect on authorization failure
                localStorage.removeItem('token');
                router.push('/login'); 
            } finally {
                setIsLoading(false);
            }
        };
        fetchTests();
    }, [router]);

    // Handles selecting a test from the list, populating the form
    const handleSelectTest = (test: PendingTest) => {
        setResultForm({ testId: test.test_id, resultValue: '', unit: '' });
        setSelectedTestName(test.test_name);
        setSelectedTestNormalRange(test.normal_range); // CRITICAL: Set the normal range
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the form
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResultForm({ ...resultForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resultForm.testId || !resultForm.resultValue || !resultForm.unit) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await axios.put(`http://localhost:5000/api/staff/lab/result/${resultForm.testId}`, {
                resultValue: resultForm.resultValue,
                unit: resultForm.unit,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert(`Result for ${selectedTestName} submitted successfully!`);
            
            // Remove completed test from list and clear form
            setPendingTests(pendingTests.filter(t => t.test_id !== resultForm.testId));
            setResultForm({ testId: null, resultValue: '', unit: '' });
            setSelectedTestName('');
            setSelectedTestNormalRange('');

        } catch (error) {
            console.error('Submission failed:', error);
            alert('Failed to submit result.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold">Loading Lab Portal...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Lab Technician Portal" navLinks={technicianNavLinks} userName={userName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Test Results Management</h1>

                {/* Result Submission Form (Top Section) */}
                <div className="bg-white p-8 rounded-lg shadow-xl mb-10 border-t-4 border-purple-500">
                    <h2 className="text-2xl font-semibold mb-6">{selectedTestName ? `Submit Result for: ${selectedTestName}` : 'Select a Pending Test Below'}</h2>
                    
                    {/* Display Normal Range (NEW UI ELEMENT) */}
                    {selectedTestNormalRange && (
                        <p className="mb-4 text-md font-medium text-purple-700">
                            Reference Range: <span className="font-bold">{selectedTestNormalRange}</span>
                        </p>
                    )}

                    {resultForm.testId && (
                        <form onSubmit={handleSubmit} className="space-y-4 md:flex md:space-x-4 md:space-y-0">
                            <div className="flex-1">
                                <label className="block text-gray-700 font-medium mb-1">Result Value</label>
                                <input type="text" name="resultValue" value={resultForm.resultValue} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                            </div>
                            <div className="w-1/4">
                                <label className="block text-gray-700 font-medium mb-1">Unit (e.g., mg/dL)</label>
                                <input type="text" name="unit" value={resultForm.unit} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                            </div>
                            <button type="submit" className="w-1/4 md:mt-6 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-300">
                                Submit Result
                            </button>
                        </form>
                    )}
                </div>

                {/* Pending Tests List */}
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Pending Tests ({pendingTests.length})</h2>
                {pendingTests.length === 0 ? (
                    <div className="bg-white p-10 rounded-lg shadow-md text-center">
                        <p className="text-xl text-green-600">No lab tests are currently pending.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pendingTests.map(test => (
                            <div key={test.test_id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center transition-all duration-200 hover:shadow-md border-l-4 border-gray-200 hover:border-purple-500">
                                <div>
                                    <h3 className="text-lg font-semibold">{test.test_name}</h3>
                                    <p className="text-sm text-gray-600">Patient: {test.patient_name} (ID: {test.patient_id})</p>
                                </div>
                                <button
                                    onClick={() => handleSelectTest(test)}
                                    className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full hover:bg-blue-200 transition duration-200"
                                >
                                    Record Result
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}