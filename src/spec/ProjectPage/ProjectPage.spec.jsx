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
  it("글로벌 상태에 저장된 프로젝트의 공통된 페이지들을 가져와서 렌더링 해야 합니다", () => {
    const selectBoxElement = screen.getByRole("combobox");

    fireEvent.click(selectBoxElement);

    const optionsElement = screen.getAllByRole("option");

    expect(optionsElement[0].textContent).toBe(allPages[0].pageName);
    expect(optionsElement[1].textContent).toBe(allPages[1].pageName);
  });

  it("비교 페이지 선택 페이지에서 타이틀과 셀렉트가 렌더 되어야 합니다", () => {
    const titleElement = screen.getByText("비교할 페이지를 선택해주세요.");
    const selectBoxElement = screen.getByRole("combobox");

    expect(titleElement).toBeInTheDocument();
    expect(selectBoxElement).toBeInTheDocument();
  });

  it("비교 페이지 선택 페이지에서 이전, 비교하기 버튼이 렌더 되어야 합니다", () => {
    const backButtonElement = screen.getByText("이전");
    const compareButtonElement = screen.getByText("비교하기");

    expect(backButtonElement).toBeInTheDocument();
    expect(compareButtonElement).toBeInTheDocument();
  });
});
