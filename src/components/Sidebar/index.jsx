import { useState } from "react";
import styled from "styled-components";

import Button from "../shared/Button";

function Sidebar({ page, framesInfo }) {
  const [selectedFrameId, setSelectedFrameId] = useState(framesInfo[0]);

  const handleFrameClick = ev => {
    setSelectedFrameId(ev.target.id);
  };

  const handleOpenPageSelectModal = ev => {
    ev.preventDefault();
  };

  const handleOpenCurrentFigmaUrl = ev => {
    ev.preventDefault();
  };

  const handleOpenNewProjectModal = ev => {
    ev.preventDefault();
  };

  return (
    <SidebarWrapper>
      <div className="page">
        <h3 className="title" key={page.id}>
          {page.name}
        </h3>
        <Button
          handleClick={handleOpenPageSelectModal}
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
          handleClick={handleOpenCurrentFigmaUrl}
          size="medium"
          usingCase="solid"
        >
          현재 화면 피그마로 이동하기
        </Button>
        <Button
          handleClick={handleOpenNewProjectModal}
          size="medium"
          usingCase="line"
        >
          새 프로젝트 비교하기
        </Button>
      </div>
    </SidebarWrapper>
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

export default Sidebar;
