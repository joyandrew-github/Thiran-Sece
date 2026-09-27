import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './AdminLayout.css';

export default function AdminLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="admin-layout-shell">
            {/* Sidebar Navigation Drawer */}
            <Sidebar
                isOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
            />

            {/* Main Content Area */}
            <div className="admin-layout-main">
                <Header onToggleMobile={() => setMobileOpen(!mobileOpen)} />
                <main className="admin-layout-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
