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
  it("마운트 시 버튼이 3개 렌더링 되어야 합니다", () => {
    const allButtonElements = screen.getAllByRole("button");

    expect(allButtonElements.length).toBe(3);
  });

  it("페이지를 선택할 수 있는 드롭박스가 렌더링 되어야 합니다", () => {
    const selectElement = screen.getByRole("combobox");

    expect(selectElement).toBeInTheDocument();
  });

  it("로그인 된 유저의 이미지가 렌더링 되어야 합니다", () => {
    const userImageElement = screen.getByAltText("user-profile");

    expect(userImageElement).toBeInTheDocument();
  });

  it("새 프로젝트 비교하기 클릭 시 모달창이 렌더링 되어야 합니다", () => {
    const newProjectElement = screen.getByText("새 프로젝트 비교하기");

    fireEvent.click(newProjectElement);

    const newProjectModal = screen.getByText("새 프로젝트를 비교하시겠어요?");

    expect(newProjectModal).toBeInTheDocument();
  });

  it("버전 재선택 버튼을 클릭 시 모달창이 렌더링 되어야 합니다", () => {
    const newVersionElement = screen.getByText("버전 재선택");

    fireEvent.click(newVersionElement);

    const newVersionModal = screen.getByText("새 버전을 비교하시겠어요?");

    expect(newVersionModal).toBeInTheDocument();
  });

  it("모달창에서 아니오 버튼을 클릭 시 모달 창이 닫히고, diffingResult화면으로 돌아와야 합니다", () => {
    const newVersionElement = screen.getByText("버전 재선택");

    fireEvent.click(newVersionElement);

    const modalTitleElement = screen.getByText("새 버전을 비교하시겠어요?");

    const closeButton = screen.getByText("아니오");

    fireEvent.click(closeButton);

    expect(modalTitleElement).not.toBeInTheDocument();
  });
});
