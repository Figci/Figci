/* eslint-disable consistent-return */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { nanoid } from "nanoid";

import Modal from "../shared/Modal";
import Button from "../shared/Button";
import Description from "../shared/Description";

import usePageListStore from "../../store/projectPage";
import useProjectStore from "../../store/project";

import updateFigmaUrl from "../../utils/updateFigmaUrl";

import DELAY_TIME from "../../constants/timeConstants";

function Sidebar({
  selectedFrameId,
  selectedFrameName,
  framesInfo,
  projectUrl,
  onFrameSelect,
}) {
  const [isClickedNewProject, setIsClickedNewProject] = useState(false);
  const [isClickedOpenFigmaButton, setIsClickedOpenFigmaButton] =
    useState(false);

  const navigate = useNavigate();

  const { project, setProject, clearPageId } = useProjectStore();
  const { byPageIds } = usePageListStore();

  const currentFigmaUrlOpen = () => {
    const figmaUrl = updateFigmaUrl(projectUrl, selectedFrameId);

    return setTimeout(() => {
      window.open(figmaUrl, "_blank");

      setIsClickedOpenFigmaButton(false);
    }, DELAY_TIME.OPEN_ON_FIGMA);
  };

  const handleNewProjectModalOpen = ev => {
    ev.preventDefault();

    setIsClickedNewProject(true);
  };

  const handlePageSelect = ev => {
    const newSelectedPageId = ev.target.value;

    clearPageId();
    setProject({ pageId: newSelectedPageId });
  };
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
            <h1 className="reversion-title">Compare a new project?</h1>
            <Description
              className="reversion-description"
              size="medium"
              text="Clicking Compare will exit this screen.\nUnsaved information will be lost."
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
              No
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
              Let's compare!
            </Button>
          </ButtonWrapper>
        </Modal>
      )}
      {isClickedOpenFigmaButton && (
        <Modal>
          <TextWrapper>
            <h1 className="figma-url-title">
              Opening {selectedFrameName} in Figma
            </h1>
            <Description
              className="re-version-description"
              size="medium"
              text="I'll take you to the Figma link containing the current screen.\nThe Figma file will open in a new window."
            />
          </TextWrapper>
        </Modal>
      )}
      <SidebarWrapper>
        <div className="page">
          <label className="title" htmlFor="page">
            Current Page
            <select
              id="page"
              type="select"
              aria-label="select"
              onChange={handlePageSelect}
              value={project.pageId || ""}
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
            <h3 className="title">All Changed Screens</h3>
            <h3 className="title-number">{framesInfo.length}</h3>
          </div>
          <ul
            role="presentation"
            className="frame-list-scroll"
            onClick={onFrameSelect}
          >
            {framesInfo.map(frame => (
              <li
                key={nanoid(10)}
                data-id={frame.id}
                data-name={frame.name}
                className={`frame-name ${selectedFrameId === frame.id ? "active" : ""}`}
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
            Current Screen in Figma
          </Button>
          <Button
            handleClick={handleNewProjectModalOpen}
            size="medium"
            usingCase="line"
          >
            Compare New Project
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
  width: 295px;
  min-width: 295px;
  border-right: 2px solid #000000;

  select {
    width: 100%;
    height: 50px;
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

  .frame-list-scroll {
    overflow-y: auto;
  }

  .frame-list {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 470px);
    overflow-y: auto;
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
