import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import NewProject from "../../components/NewProject";

const formatTargetComponent = targetComponent => {
  return <BrowserRouter>{targetComponent}</BrowserRouter>;
};

describe("NewProject Component Test", () => {
  beforeEach(() => {
    render(formatTargetComponent(<NewProject />));
  });

  it("모달 창이 초기에 렌더링 되어야 합니다", () => {
    const modalElement = screen.getByText(/Figci를 바로 사용할 수 있어요!/);

    expect(modalElement.toBeInTheDocument);
  });

  it("모달 창 내 '좋아요!' 버튼을 누르면 모달이 닫혀야 합니다", () => {
    const modalElement = screen.getByText(/Figci를 바로 사용할 수 있어요!/);
    const closeModalButton = screen.getByText(/좋아요!/);

    fireEvent.click(closeModalButton);

    expect(modalElement).not.toBeInTheDocument();
  });
});
