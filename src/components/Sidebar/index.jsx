import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Button from "../shared/Button";
import Modal from "../shared/Modal";
import Description from "../shared/Description";

function Sidebar({ page, framesInfo }) {
  const [selectedFrameId, setSelectedFrameId] = useState(framesInfo[0]);
  const [isClickedNewProject, setIsClickedNewPorject] = useState(false);

  const navigate = useNavigate();

  const handleFrameClick = ev => {
    setSelectedFrameId(ev.target.id);
  };

  const handlePageSelectModalOpen = ev => {
    ev.preventDefault();
  };

  const handleCurrentFigmaUrlOpen = ev => {
    ev.preventDefault();
  };

  const handleNewProjectModalOpen = ev => {
    ev.preventDefault();

    setIsClickedNewPorject(true);
  };

  return (
    <>
      {isClickedNewProject && (
        <Modal>
          <TextWrapper>
            <h1 className="reversion-title">새 프로젝트를 비교하시겠어요?</h1>
            <Description
              className="reversion-description"
              size="medium"
              text="비교하기 버튼을 누루면 현재 화면에서 벗어나게 됩니다.\n보고계신 정보는 저장되지 않아요."
            />
          </TextWrapper>
          <ButtonWrapper>
            <Button
              className="close"
              size="medium"
              usingCase="line"
              handleClick={ev => {
                ev.preventDefault();
                setIsClickedNewPorject(false);
              }}
            >
              아니오
            </Button>
            <Button
              className="reVersion"
              size="medium"
              usingCase="solid"
              handleClick={ev => {
                ev.preventDefault();

                navigate("/New");
              }}
            >
              비교할래요!
            </Button>
          </ButtonWrapper>
        </Modal>
      )}
      <SidebarWrapper>
        <div className="page">
          <h3 className="title" key={page.id}>
            {page.name}
          </h3>
          <Button
            handleClick={handlePageSelectModalOpen}
            size="small"
            usingCase="gray"
          >
            페이지 재선택
          </Button>
        </div>
        <div className="frame-list">
          <div className="titles">
            <h3 className="title">전체 변경 화면</h3>
            <h3 className="title-number"> {framesInfo.frameCount}</h3>
          </div>
          <ul role="presentation" onClick={handleFrameClick}>
            {framesInfo.map(frame => (
              <li
                key={frame.id}
                id={frame.id}
                className={`frame-name ${
                  selectedFrameId === frame.id ? "active" : ""
                }`}
              >
                {frame.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="buttons">
          <Button
            handleClick={handleCurrentFigmaUrlOpen}
            size="medium"
            usingCase="solid"
          >
            현재 화면 피그마로 이동하기
          </Button>
          <Button
            handleClick={handleNewProjectModalOpen}
            size="medium"
            usingCase="line"
          >
            새 프로젝트 비교하기
          </Button>
        </div>
      </SidebarWrapper>
    </>
  );
}

const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 305px;
  border-right: 2px solid #000000;

  .page {
    padding: 32px;

    background-color: #f1f3f5;
  }

  .frame-list {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 32px;
  }

  .frame-name {
    padding: 12px 0px;

    color: #343e40;
    font-size: 1rem;
    font-style: normal;
    line-height: 28px;

    &:active {
      color: #4f4dfb;
      font-size: 1rem;
      font-style: normal;
      font-weight: 700;
      line-height: 28px;
    }
  }

  .titles {
    display: flex;
    flex-direction: row;
  }

  .buttons {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    row-gap: 12px;
    padding: 32px;
  }

  .title {
    margin-bottom: 16px;

    color: #000000;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 700;
    line-height: 28px;
  }

  .title-number {
    margin-bottom: 16px;

    color: #2623fb;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 700;
    line-height: 28px;
  }

  .logo {
    width: 70px;
    margin-right: 21px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TextWrapper = styled.div`
  margin-bottom: 48px;
  width: 500px;

  .reversion-title {
    margin-bottom: 28px;

    color: #000000;
    font-size: 1.75rem;
    font-weight: 900;
    font-style: normal;
    line-height: 32px;
    text-align: center;
  }

  .reversion-content {
    display: block;

    color: #495057;
    font-size: 1rem;
    font-weight: 500;
    font-style: normal;
    text-align: center;
    line-height: 24px;
  }
`;

export default Sidebar;
