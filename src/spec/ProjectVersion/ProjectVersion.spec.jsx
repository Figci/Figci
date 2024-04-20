import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { expect, afterEach } from "vitest";

import { BrowserRouter } from "react-router-dom";

import ProjectVersion from "../../components/ProjectVersion";

import useProjectVersionStore from "../../store/projectVersion";

const allVersionsMock = [
  {
    id: "5221851390",
    created_at: "2024-02-26T06:45:48Z",
    label: "4:26 PM",
    description: "",
    user: {
      handle: "유교남",
      img_url:
        "https://www.gravatar.com/avatar/a97c4be8d0106d0daf68b8ebfd642452?size=240&default=https%3A%2F%2Fs3-alpha.figma.com%2Fstatic%2Fuser_3.png",
      id: "1233700594030844503",
    },
    thumbnail_url:
      "https://s3-alpha-sig.figma.com/thumbnails/66ef72ef-6aa8-461d-8344-e1cdb9f50d65?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=buJviXGc~UaeXPSn7ycRMKDe2SmdX~NUGq~lFcUal31~kc19pkQSVJyReBWCVsqPxKFcRXJNEB2zYka0Pi7XoJjJys5L~gdUP5aw0drfWT8O0B8atABnxPrjCa56~dhR22Rg-L3swR5jhgUZjJWekbRP4-M7wlL55a59~FZ3n4CN4-afMWfYIm7g-FPZAgAN6WPke0uTWBD8cD6b~sps-ZdeVgAp~KvWJvmjDMeFCQuIV4LPKuFOHrtAsr02KxcoE8Ml9zcQPSFBGmkyA65QDKfVg5BGHAJWpYh51o7wjHzt7C0qI7ZLuQl8jBb0mQtVHJFtUv1IbSokQ6jJOdwWcg__",
  },
  {
    id: "5220656984",
    created_at: "2024-02-26T01:36:25Z",
    label: "11:02 AM",
    description: "",
    user: {
      handle: "유교남",
      img_url:
        "https://www.gravatar.com/avatar/a97c4be8d0106d0daf68b8ebfd642452?size=240&default=https%3A%2F%2Fs3-alpha.figma.com%2Fstatic%2Fuser_3.png",
      id: "1233700594030844503",
    },
    thumbnail_url:
      "https://s3-alpha-sig.figma.com/thumbnails/8a81e548-5327-4a7b-8fae-077e4f5264e9?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iPAOWBuIZMPiggkyjN4HDecpNaUExFdacBZMwcKKF1uLOGTjMiVoXTyJypXSFXxWwGXRnECAU7GJWTvFv2Mbf9yHpNSfg3gP-RhmI9Ebe2BY6-WQsuEtwKmC0n-ZQeYecdJJZ8PZTLkjWksqeWFQbbx1Oep9PBFyzLjRAf2vJr1Ng2AM0DR-yJKfVeapVYrtC7hZBpfz334qwJeW3sY2XZNyElJG~KUh8QwMw7wEGwGcyl9Gl~NXtm3bDX71KPl-tkyIjFZBMZaMu64mJvhPr0qlfrE64pVYSu0KNkvhEIqhzH4DCdUBnnc0BusFwJUJvNCv4e8gPH2NkbCvhQVM3Q__",
  },
  {
    id: "5219231173",
    created_at: "2024-02-25T14:56:26Z",
    label: "10:33 AM",
    description: "",
    user: {
      handle: "유교남",
      img_url:
        "https://www.gravatar.com/avatar/a97c4be8d0106d0daf68b8ebfd642452?size=240&default=https%3A%2F%2Fs3-alpha.figma.com%2Fstatic%2Fuser_3.png",
      id: "1233700594030844503",
    },
    thumbnail_url:
      "https://s3-alpha-sig.figma.com/thumbnails/d923c899-b7f7-4819-9e95-ef4d9ff62916?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Erf5z1Lj8cl8TIyFjxirKzfgo6wVkt76REb4NYOEmXDEPQ1vacu6jqeURXIX3oFr1QCDi6z8i88k0BKVGgUnc06wtDTF219tPP4mAxHqfQCUnxjccxfinvYcJJ0Usj6UoJe1x0nN7LQJeVHAhMWdPdHeaOB6QWhP7uTKGkKTKn6TloEVnU8nCV3vQuMzaS6sRfvfiQpCoUWMThTPn16mCfsrAsDR42tY7xINbf~ZRQsRjuzBx7ZDfU7A0emgMa8yxM4nuAYIajRVdukTyqw13F859deLkVSrKWFOA2XCCwDg3966~X4cmlpP6lJ7eYoW5Zb7Q9MwenMeVB1UgjHVJA__",
  },
];

const formatTargetComponent = targetComponent => {
  return <BrowserRouter>{targetComponent}</BrowserRouter>;
};

beforeEach(() => {
  const { setVersion } = useProjectVersionStore.getState();

  setVersion(allVersionsMock);

  render(formatTargetComponent(<ProjectVersion />));
});

afterEach(() => {
  cleanup();
});

describe("ProjectVersion Component Test", () => {
  it("renders version selection page title on mount", () => {
    const titleElement = screen.getByText(
      "Choose previous and latest versions to compare",
    );

    expect(titleElement).toBeInTheDocument();
  });

  it("renders select boxes on mount", () => {
    const selectBoxElements = screen.getAllByRole("combobox");

    expect(selectBoxElements.length).toBe(4);
  });

  it("renders previous and next buttons on mount", () => {
    const prevButtonElement = screen.getByText("Previous");
    const nextButtonElement = screen.getByText("Next");

    expect(prevButtonElement.type).toBe("submit");
    expect(nextButtonElement.type).toBe("submit");
  });

  it("fetches and renders project versions from global state", () => {
    const selectBoxElements = screen.getAllByRole("combobox");
    const beforeDateSelectBoxElement = selectBoxElements[0];

    fireEvent.click(beforeDateSelectBoxElement);

    const optionsElements = screen.getAllByRole("option");

    expect(optionsElements[0].value).toBe("2024-2-26");
    expect(optionsElements[1].value).toBe("2024-2-25");
  });

  it("displays error toast when no versions are selected", async () => {
    const nextButtonElement = screen.getByText("Next");

    fireEvent.click(nextButtonElement);

    await waitFor(() => {
      const toastElement = screen.getByText("A version is not selected.");

      expect(toastElement).toBeInTheDocument();
    });
  });

  it("displays error toast when previous version is newer than latest version", async () => {
    const selectBoxElements = screen.getAllByRole("combobox");
    const [
      beforeDateSelectBoxElement,
      beforeVersionSelectBoxElement,
      afterDateSelectBoxElement,
      afterVersionSelectBoxElement,
    ] = selectBoxElements;

    fireEvent.change(beforeDateSelectBoxElement, {
      target: { value: "2024-2-26" },
    });

    fireEvent.change(beforeVersionSelectBoxElement, {
      target: { value: "5220656984" },
    });

    fireEvent.change(afterDateSelectBoxElement, {
      target: { value: "2024-2-25" },
    });

    fireEvent.change(afterVersionSelectBoxElement, {
      target: { value: "5219231173" },
    });

    const nextButtonElement = screen.getByText("Next");

    fireEvent.click(nextButtonElement);

    await waitFor(() => {
      const toastElement = screen.getByText(
        "The latest version must be newer than the previous version.",
      );

      expect(toastElement).toBeInTheDocument();
    });
  });
});
