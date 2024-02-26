import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";

import ProjectVersion from "../../components/ProjectVersion";

const formatTagertComponent = targetComponent => {
  return <BrowserRouter>{targetComponent}</BrowserRouter>;
};

beforeEach(() => {
  render(formatTagertComponent(<ProjectVersion />));
});

afterEach(() => {
  cleanup();
});

describe.only("ProjectVersion Component Test", () => {
  it("마운트 시 버전선택 페이지의 타이틀이 렌더링 되어야 합니다", () => {
    const titleEl = screen.getByText(
      "비교할 해당 피그마 파일의 이전 / 최신 버전을 입력해 주세요",
    );

    expect(titleEl.toBeInTheDocument);
  });

  it("마운트 시 셀렉트 박스가 렌더링 되어야 합니다.", () => {
    const selectBoxEls = screen.getAllByRole("combobox");

    expect(selectBoxEls.toBeInTheDocument);
  });

  it("마운트 시 이전, 다음 버튼이 렌더링 되어야 합니다.", () => {
    const nextButtonEl = screen.getByText("다음");
    const prevButtonEl = screen.getByText("이전");

    expect(prevButtonEl.type).toBe("submit");
    expect(nextButtonEl.type).toBe("submit");
  });

  it("선택된 버전이 없을 시, 에러 토스트를 띄워야 합니다", () => {
    const nextButtonEl = screen.getByText("다음");

    fireEvent.click(nextButtonEl);

    const toastEl = screen.getByText("선택하지 않은 버전이 존재합니다.");

    expect(toastEl.toBeInTheDocument);
  });
});
