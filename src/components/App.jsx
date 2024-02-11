import { Route, Routes } from "react-router-dom";
import { Reset } from "styled-reset";

import Onboarding from "./Onboarding";
import NewProject from "./NewProject";
import ProjectVersion from "./ProjectVersion";
import ProjectPage from "./ProjectPage";
import DiffingResult from "./DiffingResult";
import Layout from "./Layout";
import NotFound from "./NotFound";

function App() {
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
      </Routes>
    </>
  );
}

export default App;
