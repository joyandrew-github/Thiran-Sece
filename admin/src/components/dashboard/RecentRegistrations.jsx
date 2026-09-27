import { useNavigate } from 'react-router-dom';
import { User, CheckCircle2, Clock, ArrowRight, Users } from 'lucide-react';
import { RECENT_REGISTRATIONS_DATA } from '../../constants/mockData';
import './RecentRegistrations.css';

export default function RecentRegistrations() {
    const navigate = useNavigate();

    return (
        <div className="admin-table-card">
            <div className="admin-table-header">
                <div>
                    <h3 className="admin-table-title">Recent Registrations</h3>
                    <p className="admin-table-sub">Live student signups for upcoming events</p>
                </div>
                <button
                    type="button"
                    className="admin-table-view-all"
                    onClick={() => navigate('/dashboard/registrations')}>
                    <span>Manage Registrations</span>
                    <ArrowRight size={14} />
                </button>
            </div>

            <div className="admin-table-scroll-wrapper">
                <table className="admin-data-table">
                    <thead>
                        <tr>
                            <th>Participant</th>
                            <th>Email</th>
                            <th>Event Title</th>
                            <th>Registration Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {RECENT_REGISTRATIONS_DATA.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="admin-table-empty-cell">
                                    <div className="admin-empty-state">
                                        <Users
                                            size={32}
                                            className="admin-empty-icon"
                                        />
                                        <p className="admin-empty-title">No student registrations recorded yet</p>
                                        <p className="admin-empty-desc">Registrations will appear here once participants sign up</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            RECENT_REGISTRATIONS_DATA.map((reg) => (
                                <tr key={reg.id}>
                                    <td>
                                        <div className="admin-user-cell">
                                            <div className="admin-user-avatar">
                                                <User size={15} />
                                            </div>
                                            <span className="admin-user-cell-name">{reg.name}</span>
                                        </div>
                                    </td>

                                    <td>
                                        <span className="admin-email-text">{reg.email}</span>
                                    </td>

                                    <td>
                                        <span className="admin-event-tag">{reg.eventTitle}</span>
                                    </td>

                                    <td>
                                        <span className="admin-time-text">{reg.date}</span>
                                    </td>

                                    <td>
                                        <span
                                            className={`admin-status-badge ${
                                                reg.status === 'Confirmed' ? 'admin-status-badge--success' : 'admin-status-badge--pending'
                                            }`}>
                                            {reg.status === 'Confirmed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                            {reg.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
