import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Reset } from "styled-reset";

import Onboarding from "./Onboarding";
import NewProject from "./NewProject";
import ProjectVersion from "./ProjectVersion";
import ProjectPage from "./ProjectPage";
import DiffingResult from "./DiffingResult";
import Layout from "./Layout";
import NotFound from "./NotFound";
import MobileErrorPage from "./MobileErrorPage";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const isMobileDevice = () => {
      const { userAgent } = navigator;

      const mobileEnvironment = ["Mobi", "Android", "iPhone"];

      for (const keyword of mobileEnvironment) {
        if (userAgent.includes(keyword)) {
          return true;
        }
      }

      return false;
    };

    const isMobile = isMobileDevice();

    if (isMobile) {
      navigate("/mobileError");
    }
  }, [navigate]);

  return (
    <>
      <Reset />
      <Routes>
        <Route path="/" exact element={<Onboarding />} />
        <Route element={<Layout />}>
          <Route path="/new" element={<NewProject />} />
          <Route path="/version" element={<ProjectVersion />} />
          <Route path="/page" element={<ProjectPage />} />
          <Route path="/*" element={<NotFound />} />
        </Route>
        <Route path="/result" element={<DiffingResult />} />
        <Route path="/mobileError" element={<MobileErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
