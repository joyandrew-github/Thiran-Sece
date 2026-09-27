import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Edit3, ArrowRight, Clock, PlusCircle } from 'lucide-react';
import { UPCOMING_EVENTS_DATA } from '../../constants/mockData';
import './UpcomingEvents.css';

export default function UpcomingEvents() {
    const navigate = useNavigate();

    return (
        <div className="admin-table-card">
            <div className="admin-table-header">
                <div>
                    <h3 className="admin-table-title">Upcoming Events</h3>
                    <p className="admin-table-sub">Scheduled events & live registration statuses</p>
                </div>
                <button
                    type="button"
                    className="admin-table-view-all"
                    onClick={() => navigate('/dashboard/events')}>
                    <span>View All Events</span>
                    <ArrowRight size={14} />
                </button>
            </div>

            <div className="admin-table-scroll-wrapper">
                <table className="admin-data-table">
                    <thead>
                        <tr>
                            <th>Event Details</th>
                            <th>Category</th>
                            <th>Date & Time</th>
                            <th>Venue</th>
                            <th>Status</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {UPCOMING_EVENTS_DATA.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="admin-table-empty-cell">
                                    <div className="admin-empty-state">
                                        <Calendar
                                            size={32}
                                            className="admin-empty-icon"
                                        />
                                        <p className="admin-empty-title">No upcoming events created yet</p>
                                        <p className="admin-empty-desc">Get started by creating your first event</p>
                                        <button
                                            type="button"
                                            className="admin-empty-btn"
                                            onClick={() => navigate('/dashboard/events')}>
                                            <PlusCircle size={14} />
                                            <span>Add Event</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            UPCOMING_EVENTS_DATA.map((evt) => (
                                <tr key={evt.id}>
                                    <td>
                                        <div className="admin-event-cell">
                                            <div className="admin-event-cell-icon">
                                                <Calendar size={16} />
                                            </div>
                                            <div className="admin-event-cell-info">
                                                <span className="admin-event-cell-title">{evt.title}</span>
                                                <span className="admin-event-cell-sub">{evt.registrationsCount} Registered</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <span className="admin-cat-pill">{evt.category}</span>
                                    </td>

                                    <td>
                                        <div className="admin-date-cell">
                                            <Clock size={13} />
                                            <span>{evt.date}</span>
                                        </div>
                                    </td>

                                    <td>
                                        <div className="admin-venue-cell">
                                            <MapPin size={13} />
                                            <span>{evt.venue}</span>
                                        </div>
                                    </td>

                                    <td>
                                        <span
                                            className={`admin-status-badge ${
                                                evt.status === 'Closing Soon' ? 'admin-status-badge--warning' : 'admin-status-badge--success'
                                            }`}>
                                            {evt.status}
                                        </span>
                                    </td>

                                    <td className="text-right">
                                        <button
                                            type="button"
                                            className="admin-table-action-btn"
                                            onClick={() => navigate('/dashboard/events')}
                                            title="Edit Event">
                                            <Edit3 size={14} />
                                            <span>Edit</span>
                                        </button>
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
