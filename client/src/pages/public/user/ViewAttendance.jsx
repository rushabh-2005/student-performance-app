import React, { useState, useEffect } from 'react';
import { getAllStudents, getSubjectsBySem, getStudentAttendance } from '../../../services/api';


import UserNav from '../../../components/UserNav';
import '../../../Css_Files/HomeCss.css';

const ViewAttendance = () => {
    const [loading, setLoading] = useState(true);
    const [attendance, setAttendance] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [dataCount, setDataCount] = useState(-1);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            setUser(loggedInUser);
            fetchData(loggedInUser.id, loggedInUser.current_sem);
        }
    }, []);

    const [derivedSem, setDerivedSem] = useState('');

    const fetchData = async (userId, localSem) => {
        try {
            // Check if user still exists in database just in case of stale cache
            const studentCheck = await getAllStudents();
            const userExists = studentCheck.data.find(s => String(s.id) === String(userId));
            if (!userExists) {
                // The logged in user no longer exists in DB! It's a stale login session.
                localStorage.clear();
                window.location.href = '/login';
                return; // stop execution
            }

            // 1. Fetch all attendance for this user first
            const attRes = await getStudentAttendance(userId);

            // Set debugging var so we know API successfully returned an array vs crash
            setDataCount(Array.isArray(attRes.data) ? attRes.data.length : -2);

            // 2. Figure out the actual semester (use local if valid, else pick from DB records)
            let actualSem = localSem;
            if ((!actualSem || actualSem === 'undefined') && attRes.data.length > 0) {
                // Find latest semester from records
                actualSem = attRes.data[attRes.data.length - 1].semester;
            }
            if (!actualSem || actualSem === 'undefined') {
                actualSem = 'Sem 1'; // Safe default
            }

            setDerivedSem(actualSem);

            // 3. Filter attendance by that semester
            const currentAtt = attRes.data.filter(a => String(a.semester).trim().toLowerCase() === String(actualSem).trim().toLowerCase());

            // IF it fails to filter but data exists, fallback to ALL data or debug info
            if (currentAtt.length === 0 && attRes.data.length > 0) {
                setAttendance(attRes.data); // Fallback: show all if semester match fails but records exist
                console.warn("Semester match failed.", { 'actual': actualSem, 'found': attRes.data[0].semester });
            } else {
                setAttendance(currentAtt);
            }

            // 4. Fetch the subjects for this semester (also trim for saftey)
            const cleanSem = actualSem ? actualSem.trim() : 'Sem 1';
            const subRes = await getSubjectsBySem(encodeURIComponent(cleanSem));
            setSubjects(subRes.data);

        } catch (err) {
            console.error("Error fetching attendance data", err);
            setErrorMessage(err.message || String(err));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', fontFamily: 'Arial, sans-serif' }}>
                <p>Loading attendance data...</p>
            </div>
        );
    }

    return (
        <div className="home-container" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="home-bg-gradient"></div>
            <div className="moving-blob blob-1"></div>
            <div className="moving-blob blob-2"></div>
            <div className="moving-blob blob-3"></div>
            <UserNav />
            <div style={{ maxWidth: '800px', margin: '40px auto', width: '90%', flexGrow: 1, position: 'relative', zIndex: 10 }}>
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ color: '#1976d2', margin: '0 0 10px 0', fontFamily: 'Arial, sans-serif' }}>
                            {user?.name ? `${user.name}'s Attendance Report` : 'Attendance Report'}
                        </h2>
                        <span style={{ color: '#666', fontSize: '14px', fontFamily: 'Arial, sans-serif' }}>{user?.current_sem || derivedSem} | Attendance Records</span>
                    </div>

                    <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '30px' }} />

                    {errorMessage && (
                        <div style={{ padding: '15px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '20px' }}>
                            <strong>Error Loading Data:</strong> {errorMessage}
                        </div>
                    )}

                    {subjects.length === 0 && attendance.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666', fontFamily: 'Arial, sans-serif' }}>
                            Attendance records for this semester have not been published yet.
                            <br /><br /><small style={{ color: '#aaa', display: 'none' }}>(API Data checked for UserId: {user?.id}, ActualSem: {derivedSem}, Total Fetched API Rows: {dataCount})</small>
                        </p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Arial, sans-serif' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #ddd' }}>
                                        <th style={{ padding: '12px', textAlign: 'left', color: '#333' }}>Subject</th>
                                        <th style={{ padding: '12px', textAlign: 'center', color: '#333' }}>Attended</th>
                                        <th style={{ padding: '12px', textAlign: 'center', color: '#333' }}>Total</th>
                                        <th style={{ padding: '12px', textAlign: 'center', color: '#333' }}>Percentage</th>
                                        <th style={{ padding: '12px', textAlign: 'center', color: '#333' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjects.map((sub) => {
                                        const record = attendance.find(a => String(a.subject_id) === String(sub.id)) || { attended_lectures: 0, total_lectures: 0 };
                                        const attended = parseInt(record.attended_lectures);
                                        const total = parseInt(record.total_lectures);
                                        const percentage = total > 0 ? ((attended / total) * 100).toFixed(1) : 0;

                                        const isLow = percentage > 0 && percentage < 75;
                                        const statusColor = percentage === 0 && total === 0 ? '#999' : (isLow ? '#d32f2f' : '#2e7d32');
                                        const statusText = percentage === 0 && total === 0 ? 'N/A' : (isLow ? 'Low' : 'Good');
                                        const badgeBg = percentage === 0 && total === 0 ? '#eee' : (isLow ? '#ffebee' : '#e8f5e9');

                                        return (
                                            <tr key={sub.id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '15px 12px', color: '#444' }}><strong>{sub.subject_name}</strong></td>
                                                <td style={{ padding: '15px 12px', textAlign: 'center', color: '#444' }}>{attended}</td>
                                                <td style={{ padding: '15px 12px', textAlign: 'center', color: '#444' }}>{total}</td>
                                                <td style={{ padding: '15px 12px', textAlign: 'center', color: '#444', fontWeight: 'bold' }}>
                                                    {total > 0 ? `${percentage}%` : '-'}
                                                </td>
                                                <td style={{ padding: '15px 12px', textAlign: 'center' }}>
                                                    <span style={{
                                                        backgroundColor: badgeBg,
                                                        color: statusColor,
                                                        padding: '4px 10px',
                                                        borderRadius: '12px',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold',
                                                        display: 'inline-block'
                                                    }}>
                                                        {statusText}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '6px' }}>
                                <p style={{ margin: 0, fontSize: '13px', color: '#1976d2', fontFamily: 'Arial, sans-serif', lineHeight: '1.5' }}>
                                    * These attendance records are updated by the administrator.<br />
                                    * A minimum of 75% attendance is typically required.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default ViewAttendance;
