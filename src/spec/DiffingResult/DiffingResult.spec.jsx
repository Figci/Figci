import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { expect, afterEach } from "vitest";
import "vitest-canvas-mock";

import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import DiffingResult from "../../components/DiffingResult";

const queryClient = new QueryClient();

const formatTargetComponent = targetComponent => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{targetComponent}</BrowserRouter>
    </QueryClientProvider>
  );
};

beforeEach(() => {
  render(formatTargetComponent(<DiffingResult />));
});

afterEach(() => {
  cleanup();
});

describe("DiffingResult Component Test", () => {
  it("renders 3 buttons on mount", () => {
    const allButtonElements = screen.getAllByRole("button");

    expect(allButtonElements.length).toBe(3);
  });

  it("renders a dropdown to select pages", () => {
    const selectElement = screen.getByRole("combobox");

    expect(selectElement).toBeInTheDocument();
  });

  it("renders the logged-in user's image", () => {
    const userImageElement = screen.getByAltText("user-profile");

    expect(userImageElement).toBeInTheDocument();
  });

  it("renders a modal when clicking Compare New Project", () => {
    const newProjectElement = screen.getByText("Compare New Project");

    fireEvent.click(newProjectElement);

    const newProjectModal = screen.getByText("Compare a new project?");

    expect(newProjectModal).toBeInTheDocument();
  });

  it("renders a modal when clicking Reselect Versions", () => {
    const newVersionElement = screen.getByText("Reselect Versions");

    fireEvent.click(newVersionElement);

    const newVersionModal = screen.getByText("Compare a new project?");

    expect(newVersionModal).toBeInTheDocument();
  });

  it("closes the modal and returns to diffingResult screen when clicking No in the modal", () => {
    const newVersionElement = screen.getByText("Reselect Versions");

    fireEvent.click(newVersionElement);

    const modalTitleElement = screen.getByText("Compare a new project?");

    const closeButton = screen.getByText("No");

    fireEvent.click(closeButton);

    expect(modalTitleElement).not.toBeInTheDocument();
  });
});
