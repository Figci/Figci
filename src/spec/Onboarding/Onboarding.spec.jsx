import { render, screen, cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import { BrowserRouter } from "react-router-dom";

import Onboarding from "../../components/Onboarding";

const formatTargetComponent = targetComponent => {
  return <BrowserRouter>{targetComponent}</BrowserRouter>;
};

beforeEach(() => {
  render(formatTargetComponent(<Onboarding />));
});

afterEach(() => {
  cleanup();
});

describe("Onboarding Component Test", () => {
  it("The main description should render on the onboarding page", () => {
    const mainDescriptionElement = screen.getByText(
      /Sign in with Figma to easily compare versions and* spot design changes across screens!/,
    );

    expect(mainDescriptionElement).toBeInTheDocument();
  });

  it("The sub-description should render on the onboarding page", () => {
    const subDescriptionElement = screen.getByText(
      /Select two versions to instantly see*the design differences between them/,
    );

    expect(subDescriptionElement).toBeInTheDocument;
  });

  it("The login button should render on the onboarding page", () => {
    const loginButtonElement = screen.getByText("Sign in with Figma");

    expect(loginButtonElement.type).toBe("submit");
  });
});
