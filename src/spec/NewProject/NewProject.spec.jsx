import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Header from "../../components/Header/Header";
import NewProject from "../../components/NewProject";

const formatTargetComponent = targetComponent => {
  return <BrowserRouter>{targetComponent}</BrowserRouter>;
};

describe("NewProject Component Test", () => {
  beforeEach(() => {
    render(formatTargetComponent(<Header />));
    render(formatTargetComponent(<NewProject />));
  });

  it("모달 창이 초기에 렌더링 되어야 합니다", () => {
    const modalElement = screen.getByText("Figci를 바로 사용할 수 있어요!");

    expect(modalElement.toBeInTheDocument);
  });

  it("모달 창 내 '좋아요!' 버튼을 누르면 모달이 닫혀야 합니다", () => {
    const modalElement = screen.getByText("Figci를 바로 사용할 수 있어요!");
    const closeModalButton = screen.getByText("좋아요!");

    fireEvent.click(closeModalButton);

    expect(modalElement).not.toBeInTheDocument();
  });

  it("URL 입력 페이지 헤더에 서비스 로고와 캐치프라이즈가 렌더 되어야 합니다.", () => {
    const logo = screen.getByAltText("figci-logo-img");
    const catchphrase = screen.getByText(
      /피그마 버전을 비교해*디자인 변경사항을 한눈에!/,
    );

    expect(logo).toBeInTheDocument();
    expect(catchphrase).toBeInTheDocument();
  });

  it("URL 입력 페이지에서 타이틀과 입력 필드가 렌더 되어야 합니다", () => {
    const title = screen.getByText(
      "디자인 변경사항을 확인할 피그마 프로젝트 URL을 입력해주세요.",
    );
    const inputElement = screen.getByPlaceholderText(/url 주소를 입력해주세요/);

    expect(title).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
  });

  it("URL 입력 페이지에서 다음 버튼이 렌더 되어야 합니다", () => {
    const nextButtonElement = screen.getByText("다음");

    expect(nextButtonElement).toBeInTheDocument();
  });

  it("유효하지 않은 URL일 경우 토스트 팝업 내 에러 메시지가 띄어져야 합니다", async () => {
    const closeModalButton = screen.getByText("좋아요!");

    fireEvent.click(closeModalButton);

    const invalidUrl = "https://www.figma.com/1234";
    const inputElement = screen.getByPlaceholderText(
      "url 주소를 입력해주세요. (예: www.figma.com/abc)",
    );

    fireEvent.change(inputElement, { target: { value: invalidUrl } });

    const submitButton = screen.getByText("다음");

    fireEvent.click(submitButton);

    waitFor(() => {
      expect(
        screen.queryByText(
          "피그마 파일 URL 주소가 아니에요. 다시 입력해주세요🥲",
        ),
      ).toBeInTheDocument();
    });
  });
});
