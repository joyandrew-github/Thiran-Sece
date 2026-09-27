import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import Layout from './Layout/Layout';
import HomePage from './Pages/Homepage/Homepage';
import DynamicSectionPage from './Pages/DynamicSection/DynamicSectionPage';
import DynamicEventDetailPage from './Pages/DynamicSection/DynamicEventDetailPage';
import Loader from './Components/Loader/Loader';
import 'lenis/dist/lenis.css';
import './index.css';

export default function App() {
    return (
        <ReactLenis
            root
            options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
            <Loader />
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route
                            path="/"
                            element={<HomePage />}
                        />

                        {/* Dynamic Section Page Routes */}
                        <Route
                            path="/hackathons"
                            element={<DynamicSectionPage sectionSlug="hackathons" />}
                        />
                        <Route
                            path="/hackathons/:eventSlug"
                            element={<DynamicEventDetailPage />}
                        />

                        {/* Universal Dynamic Section Catch-all Routes */}
                        <Route
                            path="/:sectionSlug"
                            element={<DynamicSectionPage />}
                        />
                        <Route
                            path="/:sectionSlug/:eventSlug"
                            element={<DynamicEventDetailPage />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ReactLenis>
    );
}
