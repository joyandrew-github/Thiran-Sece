import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Login from './pages/Login/Login';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import NavigationManager from './pages/Navigation/NavigationManager';
import SectionPageManager from './pages/SectionManager/SectionPageManager';
import PlaceholderPage from './pages/PlaceholderPage/PlaceholderPage';
import './index.css';

function ProtectedRoute({ children }) {
    const isAuthenticated = localStorage.getItem('thiran_admin_authenticated') === 'true';
    return isAuthenticated ? (
        children
    ) : (
        <Navigate
            to="/login"
            replace
        />
    );
}

// Dynamic Wrapper for Section Page Manager
function DynamicSectionWrapper() {
    const { sectionSlug } = useParams();
    return <SectionPageManager sectionSlug={sectionSlug || 'hackathons'} />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Admin Login Route */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Protected Admin Shell Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }>
                    {/* Dashboard Overview Main View */}
                    <Route
                        index
                        element={<Dashboard />}
                    />

                    {/* Event Sections & Categories */}
                    <Route
                        path="homepage"
                        element={<PlaceholderPage />}
                    />
                    <Route
                        path="hackathons"
                        element={<SectionPageManager sectionSlug="hackathons" />}
                    />
                    <Route
                        path="tech-fest"
                        element={<SectionPageManager sectionSlug="tech-fest" />}
                    />
                    <Route
                        path="spotlight-events"
                        element={<SectionPageManager sectionSlug="spotlight-events" />}
                    />
                    <Route
                        path="events"
                        element={<SectionPageManager sectionSlug="events" />}
                    />
                    <Route
                        path="cultural-contests"
                        element={<SectionPageManager sectionSlug="cultural-contests" />}
                    />
                    <Route
                        path="guest-lounge"
                        element={<SectionPageManager sectionSlug="guest-lounge" />}
                    />
                    <Route
                        path="celebrity-shows"
                        element={<SectionPageManager sectionSlug="celebrity-shows" />}
                    />
                    <Route
                        path="event-categories"
                        element={<NavigationManager />}
                    />
                    <Route
                        path="speakers"
                        element={<PlaceholderPage />}
                    />
                    <Route
                        path="schedules"
                        element={<PlaceholderPage />}
                    />
                    <Route
                        path="announcements"
                        element={<PlaceholderPage />}
                    />
                    <Route
                        path="faq"
                        element={<PlaceholderPage />}
                    />
                    <Route
                        path="gallery"
                        element={<PlaceholderPage />}
                    />
                    <Route
                        path="sponsors"
                        element={<PlaceholderPage />}
                    />

                    {/* Registration Routes */}
                    <Route
                        path="registrations"
                        element={<PlaceholderPage />}
                    />

                    {/* Settings Routes */}
                    <Route
                        path="site-settings"
                        element={<PlaceholderPage />}
                    />
                    <Route
                        path="contact-info"
                        element={<PlaceholderPage />}
                    />

                    {/* Dynamic Fallback Route for any Custom Section */}
                    <Route
                        path=":sectionSlug"
                        element={<DynamicSectionWrapper />}
                    />
                </Route>

                {/* Fallback Catch-all Route */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
