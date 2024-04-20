import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { expect, afterEach } from "vitest";

import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

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

describe("ProjectPage Component Test", () => {
  it("fetches and renders common project pages from global state", () => {
    const selectBoxElement = screen.getByRole("combobox");

    fireEvent.click(selectBoxElement);

    const optionsElement = screen.getAllByRole("option");

    expect(optionsElement[0].textContent).toBe(allPages[0].pageName);
    expect(optionsElement[1].textContent).toBe(allPages[1].pageName);
  });

  it("renders title and select on compare page selection page", () => {
    const titleElement = screen.getByText("Select pages to compare.");
    const selectBoxElement = screen.getByRole("combobox");

    expect(titleElement).toBeInTheDocument();
    expect(selectBoxElement).toBeInTheDocument();
  });

  it("renders previous and compare buttons on compare page selection page", () => {
    const backButtonElement = screen.getByText("Previous");
    const compareButtonElement = screen.getByText("Compare");

    expect(backButtonElement).toBeInTheDocument();
    expect(compareButtonElement).toBeInTheDocument();
  });
});
