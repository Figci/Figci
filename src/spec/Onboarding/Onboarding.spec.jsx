import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Onboarding from "../../components/Onboarding";

const formatTagerComponent = targetComponent => {
  return <BrowserRouter>{targetComponent}</BrowserRouter>;
};

describe("Onboarding Component Test", () => {
  beforeEach(() => {
    render(formatTagerComponent(<Onboarding />));
  });

  it("온보딩 페이지에서 메인설명이 렌더 되어야 합니다", () => {
    const mainDescription = screen.getByText(
      /피그마 계정으로 로그인하시면 파일버전을 비교해*디자인 화면의 변경사항을 쉽게 보여드려요!/,
    );

    expect(mainDescription.toBeInTheDocument);
  });

  it("온보딩 페이지에서 서브설명이 렌더 되어야 합니다", () => {
    const subDescription = screen.getByText(
      /비교할 두 피그마 버전을 알려주시면*버전 별 디자인 화면 변경사항을 바로 알려드려요/,
    );

    expect(subDescription.toBeInTheDocument);
  });

  it("온보딩 페이지에서 로그인 버튼이 렌더 되어야 합니다", () => {
    const loginButtonEl = screen.getByText("피그마 계정으로 로그인");

    expect(loginButtonEl.type).toBe("submit");
  });
});
