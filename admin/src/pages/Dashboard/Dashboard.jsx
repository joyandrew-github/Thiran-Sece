import StatCard from '../../components/dashboard/StatCard';
import QuickActions from '../../components/dashboard/QuickActions';
import UpcomingEvents from '../../components/dashboard/UpcomingEvents';
import RecentRegistrations from '../../components/dashboard/RecentRegistrations';
import { STAT_CARDS_DATA } from '../../constants/mockData';
import './Dashboard.css';

export default function Dashboard() {
    return (
        <div className="admin-dashboard-page">
            {/* Top Stat Cards Grid */}
            <div className="admin-stats-grid">
                {STAT_CARDS_DATA.map((stat) => (
                    <StatCard
                        key={stat.id}
                        title={stat.title}
                        value={stat.value}
                        change={stat.change}
                        changeType={stat.changeType}
                        iconName={stat.iconName}
                        glowColor={stat.glowColor}
                    />
                ))}
            </div>

            {/* Quick Administrative Actions Shortcuts */}
            <QuickActions />

            {/* Data Tables Overview */}
            <UpcomingEvents />
            <RecentRegistrations />
        </div>
    );
}
