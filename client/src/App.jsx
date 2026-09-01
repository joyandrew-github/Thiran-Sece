import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import Layout from "./Layout/Layout";
import HomePage from "./Pages/Homepage/Homepage";
import Loader from "./Components/Loader/Loader";
import "lenis/dist/lenis.css";
import "./index.css";

// Add further routes (Hackathons, TechFest, etc.) as pages get built —
// they'll automatically inherit the Navbar + Footer via the Layout route.
export default function App() {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <Loader />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ReactLenis>
  );
}