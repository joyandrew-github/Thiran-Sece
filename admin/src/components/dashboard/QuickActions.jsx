import { useNavigate } from 'react-router-dom';
import { PlusCircle, Megaphone, UserPlus, ClipboardList, ArrowUpRight } from 'lucide-react';
import { QUICK_ACTIONS_DATA } from '../../constants/mockData';
import './QuickActions.css';

const ICON_MAP = {
    PlusCircle,
    Megaphone,
    UserPlus,
    ClipboardList
};

export default function QuickActions() {
    const navigate = useNavigate();

    return (
        <div className="admin-quick-actions-section">
            <div className="admin-section-header">
                <div>
                    <h2 className="admin-section-title">Quick Actions</h2>
                    <p className="admin-section-sub">Frequent administrative shortcuts</p>
                </div>
            </div>

            <div className="admin-quick-actions-grid">
                {QUICK_ACTIONS_DATA.map((action) => {
                    const IconComponent = ICON_MAP[action.iconName] || PlusCircle;
                    return (
                        <button
                            key={action.id}
                            type="button"
                            className={`admin-quick-btn ${action.primary ? 'admin-quick-btn--primary' : ''}`}
                            onClick={() => navigate(action.path)}>
                            <div className="admin-quick-btn-icon">
                                <IconComponent size={20} />
                            </div>
                            <div className="admin-quick-btn-text">
                                <span className="admin-quick-btn-label">{action.label}</span>
                                <span className="admin-quick-btn-desc">{action.description}</span>
                            </div>
                            <ArrowUpRight
                                size={16}
                                className="admin-quick-btn-arrow"
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
