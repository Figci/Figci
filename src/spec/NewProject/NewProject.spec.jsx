import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { afterEach } from "vitest";

import { BrowserRouter } from "react-router-dom";

import Header from "../../components/Header/Header";
import NewProject from "../../components/NewProject";

const formatTargetComponent = targetComponent => {
  return <BrowserRouter>{targetComponent}</BrowserRouter>;
};

beforeEach(() => {
  render(formatTargetComponent(<Header />));
  render(formatTargetComponent(<NewProject />));
});

afterEach(() => {
  cleanup();
});

describe("NewProject Component Test", () => {
  it("Modal window renders on initial load", () => {
    const modalElement = screen.getByText("Ready to use Figci? Let's get started!");

    expect(modalElement.toBeInTheDocument);
  });

  it("Clicking 'Sounds good!' closes the modal", () => {
    const modalElement = screen.getByText("Ready to use Figci? Let's get started!");
    const closeModalButtonElement = screen.getByText("Sounds good!");

    fireEvent.click(closeModalButtonElement);

    expect(modalElement).not.toBeInTheDocument();
  });

  it("Service logo and catchphrase render in URL input page header URL", () => {
    const logoElement = screen.getByAltText("figci-logo-img");
    const catchphraseElement = screen.getByText(
      /Compare Figma versions to see*design changes at a glance!/,
    );

    expect(logoElement).toBeInTheDocument();
    expect(catchphraseElement).toBeInTheDocument();
  });

  it("Title and input field render on URL input page URL", () => {
    const titleElement = screen.getByText(
      "Enter the Figma project URL to see design changes.",
    );
    const inputElement = screen.getByPlaceholderText(/Please enter the URL/);

    expect(titleElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
  });

  it("Next button renders on URL input page URL", () => {
    const nextButtonElement = screen.getByText("Next");

    expect(nextButtonElement).toBeInTheDocument();
  });

  it("Invalid URL triggers error message in toast popup", async () => {
    const closeModalButtonElement = screen.getByText("Sounds good!");

    fireEvent.click(closeModalButtonElement);

    const invalidUrl = "https://www.figma.com/1234";
    const inputElement = screen.getByPlaceholderText(
      "Please enter the URL. (e.g., www.figma.com/abc)",
    );

    fireEvent.change(inputElement, { target: { value: invalidUrl } });

    const submitButtonElement = screen.getByText("Next");

    fireEvent.click(submitButtonElement);

    await waitFor(() => {
      expect(
        screen.getByText(
          "That's not a valid Figma file URL. Please try again 🥲",
        ),
      ).toBeInTheDocument();
    });
  });
});
