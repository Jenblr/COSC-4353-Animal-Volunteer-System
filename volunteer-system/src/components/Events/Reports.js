import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import '../../styles/Reports.css';

const Reports = () => {
    const [selectedReport, setSelectedReport] = useState('');
    const [selectedVolunteerOption, setSelectedVolunteerOption] = useState('');
    const [selectedVolunteer, setSelectedVolunteer] = useState('');
    const [volunteers, setVolunteers] = useState([]);
    const [selectedFormat, setSelectedFormat] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/auth/registered-volunteers', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                setVolunteers(data);
            } catch (err) {
                setError('Failed to fetch volunteers');
            }
        };

        fetchVolunteers();
    }, []);

    const handleGenerateReport = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            let endpoint = 'http://localhost:5000/api/auth/reports/volunteers';
            if (selectedVolunteerOption === 'specific') {
                endpoint += `/${selectedVolunteer}`;
            }
            endpoint += `?format=${selectedFormat}`;

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate report');
            }

            // Get current date for filename
            const today = new Date();
            const dateString = `${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}${today.getFullYear().toString().substring(2)}`;

            // Generate filename based on selected option
            let filename;
            if (selectedVolunteerOption === 'specific') {
                const volunteer = volunteers.find(v => v.id.toString() === selectedVolunteer.toString());
                filename = `Volunteer Participation Report_${volunteer.email}_${dateString}`;
            } else {
                filename = `Volunteer Participation Report_All_${dateString}`;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(
                new Blob([blob], {
                    type: selectedFormat === 'PDF' ? 'application/pdf' : 'text/csv'
                })
            );
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.${selectedFormat.toLowerCase()}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error generating report:', err);
            setError(err.message || 'Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reports-container">
            <h1 className="reports-title">Generate Reports</h1>

            <div className="form-section">
                <label className="form-label">
                    Select Report Type
                </label>
                <div className="select-container">
                    <select
                        value={selectedReport}
                        onChange={(e) => setSelectedReport(e.target.value)}
                        className="select-input"
                    >
                        <option value="">Select a report type...</option>
                        <option value="volunteer-history">List of volunteers and their participation history</option>
                        <option value="event-details" disabled>Event details and volunteer assignments</option>
                    </select>
                    <ChevronDown className="select-arrow" />
                </div>
            </div>

            {selectedReport === 'volunteer-history' && (
                <>
                    <div className="form-section">
                        <label className="form-label">
                            Select Volunteer Option
                        </label>
                        <div className="select-container">
                            <select
                                value={selectedVolunteerOption}
                                onChange={(e) => setSelectedVolunteerOption(e.target.value)}
                                className="select-input"
                            >
                                <option value="">Select an option...</option>
                                <option value="all">All volunteers</option>
                                <option value="specific">Specific volunteer</option>
                            </select>
                            <ChevronDown className="select-arrow" />
                        </div>
                    </div>

                    {selectedVolunteerOption === 'specific' && (
                        <div className="form-section">
                            <label className="form-label">
                                Select Volunteer
                            </label>
                            <div className="select-container">
                                <select
                                    value={selectedVolunteer}
                                    onChange={(e) => setSelectedVolunteer(e.target.value)}
                                    className="select-input"
                                >
                                    <option value="">Select a volunteer...</option>
                                    {volunteers.map((volunteer) => (
                                        <option key={volunteer.id} value={volunteer.id}>
                                            {volunteer.email}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="select-arrow" />
                            </div>
                        </div>
                    )}

                    {selectedVolunteerOption && (
                        <div className="form-section">
                            <label className="form-label">
                                Select Format
                            </label>
                            <div className="select-container">
                                <select
                                    value={selectedFormat}
                                    onChange={(e) => setSelectedFormat(e.target.value)}
                                    className="select-input"
                                >
                                    <option value="">Select a format...</option>
                                    <option value="PDF">PDF</option>
                                    <option value="CSV">CSV</option>
                                </select>
                                <ChevronDown className="select-arrow" />
                            </div>
                        </div>
                    )}

                    {selectedFormat && (
                        <button
                            onClick={handleGenerateReport}
                            disabled={loading}
                            className="generate-button"
                        >
                            {loading && <span className="loading-spinner" />}
                            {loading ? 'Generating...' : 'Generate Report'}
                        </button>
                    )}
                </>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Reports;