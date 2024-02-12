/* eslint-disable consistent-return */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { nanoid } from "nanoid";

import Modal from "../shared/Modal";
import Button from "../shared/Button";
import Description from "../shared/Description";

import usePageListStore from "../../../store/projectPage";
import usePageStatusStore from "../../../store/projectInit";
import updateFigmaUrl from "../../../utils/updateFigmaUrl";
import DELAY_TIME from "../../../constants/timeConstants";

function Sidebar({ framesInfo, projectUrl, onPageSelect, onFrameSelect }) {
  const [frameInformation, setFrameInformation] = useState({});
  const [isClickedNewProject, setIsClickedNewProject] = useState(false);
  const [isClickedOpenFigmaButton, setIsClickedOpenFigmaButton] =
    useState(false);

  const navigate = useNavigate();

  const { status } = usePageStatusStore();
  const { byPageIds } = usePageListStore();

  const handleFrameClick = ev => {
    ev.preventDefault();

    const frameId = ev.target.getAttribute("data-id");
    const frameName = ev.target.getAttribute("data-name");

    setFrameInformation({ frameId, frameName });

    onFrameSelect(frameId, frameName);
  };

  const currentFigmaUrlOpen = () => {
    const figmaUrl = updateFigmaUrl(projectUrl, frameInformation.frameId);

    return setTimeout(() => {
      window.open(figmaUrl, "_blank");

      setIsClickedOpenFigmaButton(false);
    }, DELAY_TIME.OPEN_ON_FIGMA);
  };

  const handleNewProjectModalOpen = ev => {
    ev.preventDefault();

    setIsClickedNewProject(true);
  };

  useEffect(() => {
    if (framesInfo.length > 0) {
      const firstFrame = framesInfo[0];

      setFrameInformation({
        frameId: firstFrame.id,
        frameName: firstFrame.name,
      });
    }
  }, [framesInfo]);

  useEffect(() => {
    const timerId = (() => {
      if (isClickedOpenFigmaButton) {
        return currentFigmaUrlOpen();
      }
    })();

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [isClickedOpenFigmaButton]);

  return (
    <>
      {isClickedNewProject && (
        <Modal>
          <TextWrapper>
            <h1 className="reversion-title">새 프로젝트를 비교하시겠어요?</h1>
            <Description
              className="reversion-description"
              size="medium"
              text="비교하기 버튼을 누르면 현재 화면에서 벗어나게 됩니다.\n보고계신 정보는 저장되지 않아요."
            />
          </TextWrapper>
          <ButtonWrapper>
            <Button
              className="close"
              size="medium"
              usingCase="line"
              handleClick={ev => {
                ev.preventDefault();

                setIsClickedNewProject(false);
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
      {isClickedOpenFigmaButton && (
        <Modal>
          <TextWrapper>
            <h1 className="figma-url-title">
              피그마에서 {frameInformation.frameName} 여는 중
            </h1>
            <Description
              className="re-version-description"
              size="medium"
              text="현재 보고계신 화면이 있는 피그마 링크로 이동할게요.\n피그마 파일은 새 창으로 열려요."
            />
          </TextWrapper>
        </Modal>
      )}
      <SidebarWrapper>
        <div className="page">
          <label className="title" htmlFor="page">
            현재 페이지
            <select
              id="page"
              type="select"
              aria-label="select"
              onChange={onPageSelect}
              value={status.pageId || ""}
            >
              {byPageIds &&
                Object.keys(byPageIds).map(pageId => (
                  <option key={pageId} value={pageId}>
                    {byPageIds[pageId]}
                  </option>
                ))}
            </select>
          </label>
        </div>
        <div className="frame-list">
          <div className="titles">
            <h3 className="title">전체 변경 화면</h3>
            <h3 className="title-number">{framesInfo.length}</h3>
          </div>
          <ul role="presentation" onClick={handleFrameClick}>
            {framesInfo.map(frame => (
              <li
                key={nanoid(10)}
                data-id={frame.id}
                data-name={frame.name}
                className={`frame-name ${frameInformation.frameId === frame.id ? "active" : ""}`}
              >
                {frame.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="buttons">
          <Button
            handleClick={() => {
              setIsClickedOpenFigmaButton(true);
            }}
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

  select {
    width: 100%;
    height: 64px;
    padding: 0px 24px;
    border-radius: 8px;
    border: 2px solid #000000;
    margin-top: 12px;
    margin-bottom: 12px;

    background-color: #ffffff;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
  }

  .page {
    padding: 24px;

    background-color: #f1f3f5;
  }

  .frame-list {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 24px;
  }

  .frame-name {
    padding: 12px 0px;

    color: #343e40;
    font-size: 1rem;
    font-style: normal;
    line-height: 28px;

    &.active {
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
    padding: 24px;
  }

  .title {
    color: #000000;
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 700;
    line-height: 28px;
  }

  .title-number {
    margin-left: 8px;
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

  .figma-url-title {
    width: 100%;
    margin: 40px 0 12px;

    color: #000000;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 700;
    text-align: center;
    line-height: 32px;
  }
`;

export default Sidebar;
