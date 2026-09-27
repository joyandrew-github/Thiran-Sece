import { Calendar, Users, Flame, Mic, TrendingUp } from 'lucide-react';
import './StatCard.css';

const ICON_MAP = {
    Calendar,
    Users,
    Flame,
    Mic
};

export default function StatCard({ title, value, change, changeType, iconName, glowColor }) {
    const IconComponent = ICON_MAP[iconName] || Calendar;

    return (
        <div className={`admin-stat-card admin-stat-card--${glowColor}`}>
            <div className="admin-stat-top">
                <div className="admin-stat-label">{title}</div>
                <div className={`admin-stat-icon-wrap admin-stat-icon-wrap--${glowColor}`}>
                    <IconComponent size={20} />
                </div>
            </div>

            <div className="admin-stat-body">
                <div className="admin-stat-value">{value}</div>
                <div className={`admin-stat-change admin-stat-change--${changeType}`}>
                    {changeType === 'positive' && <TrendingUp size={13} />}
                    <span>{change}</span>
                </div>
            </div>

            <div className={`admin-stat-bottom-line admin-stat-bottom-line--${glowColor}`} />
        </div>
    );
}
