import styled from "styled-components";

import Button from "../shared/Button";

function Sidebar({ page, frames }) {
  const handleOpenPageSelectModal = () => {};
  const handleOpenCurrentFrame = () => {};
  const handleOpenNewProjectModal = () => {};

  return (
    <SidebarWrapper>
      <div className="page">
        <h3 className="page-title">{page.name}</h3>
        <button className="reselection" onClick={handleOpenPageSelectModal}>
          페이지 재선택
        </button>
      </div>
      <div className="frame-list">
        <p className="all-frames">전체 변경된 화면</p>
        <ul>
          {frames.frameIdsList &&
            frames.frameIdsList.map(frame => (
              <li key={frame.id} className="frame">
                {frame.name}
              </li>
            ))}
        </ul>
      </div>
      <div className="buttons">
        <Button
          handleClick={handleOpenCurrentFrame}
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
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  border-right: 2px solid #000000;

  .page {
    padding: 24px;
    display: flex;
    flex-direction: column;

    background-color: #f1f3f5;
  }

  .frame-list {
    height: 100%;
    padding: 24px;
    display: flex;
    flex-direction: column;
  }

  .frame {
    display: flex;
    padding: 12px 0px;

    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
    color: #000000;

    &:active {
      font-size: 1rem;
      font-style: normal;
      font-weight: 700;
      line-height: 28px;
      color: #4f4dfb;
    }
  }

  .all-frames {
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 700;
    line-height: 28px;
    color: #000000;
  }

  .buttons {
    padding: 40px 32px;
    display: flex;
    flex-direction: column;
  }

  .reselection {
    box-sizing: border-box;

    padding: 8px 16px;
  }

  .logo {
    width: 70px;
    margin-right: 21px;
  }
`;

export default Sidebar;
