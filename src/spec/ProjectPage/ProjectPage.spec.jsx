import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { afterEach, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";

import ProjectPage from "../../components/ProjectPage";

import useProjectPageStore from "../../store/projectPage";

const allPages = [
  {
    pageId: "1:2",
    pageName: "morkup flow",
  },
  {
    pageId: "333:1118",
    pageName: "flow chart",
  },
  {
    pageId: "223:398",
    pageName: "design",
  },
];

const queryClient = new QueryClient();

const formatTargetComponent = targetComponent => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{targetComponent}</BrowserRouter>
    </QueryClientProvider>
  );
};

beforeEach(() => {
  const { setPages } = useProjectPageStore.getState();

  setPages(allPages);

  render(formatTargetComponent(<ProjectPage pages={allPages} />));
});

afterEach(() => {
  cleanup();
});
