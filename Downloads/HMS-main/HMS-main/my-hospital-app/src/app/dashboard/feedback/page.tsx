// src/app/dashboard/feedback/page.tsx

'use client';

import DashboardNavbar from '../../../components/DashboardNavbar';
import { useState } from 'react';
import axios from 'axios';

export default function FeedbackHelpdeskPage() {
    const [view, setView] = useState('feedback'); // 'feedback' or 'support'
    const [feedbackData, setFeedbackData] = useState({ subject: '', comments: '' });
    const [supportData, setSupportData] = useState({ type: 'Bug Report', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userName = 'User'; // NOTE: Ideally fetched from a layout/context

    // NOTE: Navbar links should be dynamic based on user role
    const mockNavLinks = [{ name: 'Help/Feedback', href: '/dashboard/feedback' }]; 

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedbackData.subject || !feedbackData.comments) return;
        setIsSubmitting(true);
        const token = localStorage.getItem('token');

        try {
            await axios.post('http://localhost:5000/api/utils/feedback', feedbackData, { headers: { Authorization: `Bearer ${token}` } });
            alert('Thank you! Your feedback has been recorded.');
            setFeedbackData({ subject: '', comments: '' });
        } catch (error) {
            alert('Failed to send feedback. Check console.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSupportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supportData.type || !supportData.description) return;
        setIsSubmitting(true);
        const token = localStorage.getItem('token');

        try {
            await axios.post('http://localhost:5000/api/utils/support', supportData, { headers: { Authorization: `Bearer ${token}` } });
            alert('Support ticket created successfully. An admin will review it shortly.');
            setSupportData({ type: 'Bug Report', description: '' });
        } catch (error) {
            alert('Failed to create support ticket.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFeedbackData({...feedbackData, [e.target.name]: e.target.value});
    };

    const handleSupportChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setSupportData({...supportData, [e.target.name]: e.target.value});
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNavbar title="Utilities" navLinks={mockNavLinks} userName={userName} />
            <main className="container mx-auto py-12 px-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">System Support</h1>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-300 mb-8">
                    <button
                        onClick={() => setView('feedback')}
                        className={`py-2 px-6 text-lg font-medium ${view === 'feedback' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Feedback & Suggestions
                    </button>
                    <button
                        onClick={() => setView('support')}
                        className={`py-2 px-6 text-lg font-medium ${view === 'support' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Urgent Helpdesk Ticket
                    </button>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                    {/* --- Feedback Form --- */}
                    {view === 'feedback' && (
                        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                            <h2 className="text-2xl font-semibold">Share Your Thoughts</h2>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Subject</label>
                                <input type="text" name="subject" value={feedbackData.subject} onChange={handleFeedbackChange} required className="w-full p-3 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Detailed Comments</label>
                                <textarea name="comments" value={feedbackData.comments} onChange={handleFeedbackChange} rows={5} required className="w-full p-3 border rounded-md" />
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                                Send Feedback
                            </button>
                        </form>
                    )}

                    {/* --- Support Ticket Form --- */}
                    {view === 'support' && (
                        <form onSubmit={handleSupportSubmit} className="space-y-4">
                            <h2 className="text-2xl font-semibold text-red-600">Report an Issue</h2>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Issue Type</label>
                                <select name="type" value={supportData.type} onChange={handleSupportChange} required className="w-full p-3 border rounded-md">
                                    <option value="Bug Report">Bug Report</option>
                                    <option value="Access Problem">Access Problem</option>
                                    <option value="Data Error">Data Error / Inaccuracy</option>
                                    <option value="General Query">General Technical Query</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Describe the Problem (Urgent)</label>
                                <textarea name="description" value={supportData.description} onChange={handleSupportChange} rows={5} required className="w-full p-3 border rounded-md" />
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700">
                                Submit Ticket
                            </button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}