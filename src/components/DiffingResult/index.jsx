import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fabric } from "fabric";
import styled from "styled-components";

import Modal from "../shared/Modal";
import Loading from "../shared/Loading";
import Sidebar from "../Sidebar";
import Button from "../shared/Button";
import Description from "../shared/Description";
import ToastPopup from "../shared/Toast";

import useProjectStore from "../../store/project";
import useProjectVersionStore from "../../store/projectVersion";

import getDiffingResultQuery from "../../services/getDiffingResultQuery";
import renderFabricDifference from "../../services/renderFabricDifference";
import renderFabricFrame from "../../services/renderFabricFrame";

import fetchImageUrl from "../../utils/fetchImage";
import fixCoordinate from "../../utils/fixCoordinate";
import isOwnProperty from "../../utils/isOwnProperty";

import SIZE from "../../constants/sizeConstants";

import figciLogo from "../../assets/logo_figci.png";
import prevButton from "../../assets/prev_button_icon.png";
import nextButton from "../../assets/next_button_icon.png";

function DiffingResult() {
  const [frameList, setFrameList] = useState([]);
  const [frameId, setFrameId] = useState("");
  const [frameName, setFrameName] = useState("");
  const [toast, setToast] = useState({});
  const [imageUrl, setImageUrl] = useState({});
  const [isClickedNewVersion, setIsClickedNewVersion] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const versionStatus = useProjectVersionStore(state => state.byDates);
  const {
    userName,
    userProfile,
    projectKey,
    projectUrl,
    beforeDate,
    beforeVersion,
    afterDate,
    afterVersion,
    pageId,
  } = useProjectStore(state => state.project);

  const {
    isLoading,
    data: diffingResult,
    isError,
    error,
  } = getDiffingResultQuery(projectKey, beforeVersion, afterVersion, pageId);

  if (isError) {
    setToast({ status: true, message: error.toString() });

    return;
  }

  const getVersionLabel = (date, versionId) => {
    if (versionStatus[date] && versionStatus[date][versionId]) {
      return `${date} ${versionStatus[date][versionId].label}`;
    }

    return null;
  };

  const changeFrame = frameIndex => {
    const currentFrame = frameList[frameIndex];

    setCurrentPage(frameIndex);
    setFrameId(currentFrame.id);
    setFrameName(currentFrame.name);
  };

  const beforeVersionLabel = getVersionLabel(beforeDate, beforeVersion);
  const afterVersionLabel = getVersionLabel(afterDate, afterVersion);

  const handleClickPagination = ev => {
    const direction = ev.currentTarget.getAttribute("direction");
    const offsetIndex = direction === "left" ? frameList.length - 1 : 1;
    const nextIndex = (currentPage + offsetIndex) % frameList.length;

    changeFrame(nextIndex);
  };

  const handleFrameClick = ev => {
    ev.preventDefault();

    const clickedFrame = ev.target;

    const frameIndex = Array.from(clickedFrame.parentNode.children).indexOf(
      clickedFrame,
    );

    changeFrame(frameIndex);
  };

  useEffect(() => {
    const initCanvas = () => {
      const canvasInit = new fabric.Canvas("canvas", {
        width: window.innerWidth - SIZE.FIXED_SIDEBAR_WIDTH,
        height: window.innerHeight - SIZE.FIXED_HEADER_HEIGHT,
        backgroundColor: "#CED4DA",
        setZoom: SIZE.SET_ZOOM,
        selection: false,
      });

      return canvasInit;
    };

    const newCanvas = initCanvas();

    newCanvas.on("mouse:wheel", ev => {
      ev.e.preventDefault();
      ev.e.stopPropagation();

      if (ev.e.ctrlKey) {
        const delta = ev.e.deltaY;

        let Zoom = canvasRef.current.getZoom();

        Zoom *= 0.999 ** delta;
        Zoom = Math.max(0.01, Math.min(30, Zoom));

        canvasRef.current.zoomToPoint(
          { x: ev.e.offsetX, y: ev.e.offsetY },
          Zoom,
        );
      } else {
        const viewport = canvasRef.current.viewportTransform;

        viewport[4] += ev.e.deltaX;
        viewport[5] += ev.e.deltaY;

        canvasRef.current.requestRenderAll();
      }
    });

    canvasRef.current = newCanvas;

    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.setHeight(
          window.innerHeight - SIZE.FIXED_HEADER_HEIGHT,
        );
        canvasRef.current.setWidth(
          window.innerWidth - SIZE.FIXED_SIDEBAR_WIDTH,
        );

        canvasRef.current.calcOffset();
        canvasRef.current.renderAll();
      }
    };

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);

      if (canvasRef.current) {
        canvasRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (frameList.length > 0) {
      changeFrame(0);
    }
  }, [frameList]);

  useEffect(() => {
    if (!diffingResult) {
      return;
    }

    if (diffingResult.result === "error") {
      setToast({ status: true, message: diffingResult.message });

      return;
    }

    const frames = [];

    for (const frameId in diffingResult.content.frames) {
      if (isOwnProperty(diffingResult.content.frames, frameId)) {
        const frame = diffingResult.content.frames[frameId];

        frames.push({ name: frame.name, id: frameId });
      }
    }

    setFrameList(frames);
  }, [diffingResult]);

  useEffect(() => {
    const fetchImageURLToFigma = async () => {
      const imageUrlObject = await fetchImageUrl(projectKey, setToast);

      setImageUrl({ ...imageUrlObject });

      return imageUrlObject;
    };

    const renderFabricOnCanvas = async content => {
      const imgURls =
        Object.keys(imageUrl).length === 0
          ? await fetchImageURLToFigma()
          : imageUrl;

      const isChangedFrame = Object.values(content.differences).map(
        differenceNode => differenceNode.frameId,
      );

      const offsetCoordinates = fixCoordinate(
        diffingResult.content.frames[frameId],
      );

      await renderFabricFrame.call(
        canvasRef.current,
        content.frames[frameId],
        imgURls,
      );

      if (isChangedFrame.includes(frameId)) {
        await renderFabricDifference.call(
          canvasRef.current,
          content.differences,
          offsetCoordinates,
          frameId,
        );
      } else {
        content.frames[frameId].isNew = true;

        await renderFabricDifference.call(
          canvasRef.current,
          content.frames[frameId],
          offsetCoordinates,
          frameId,
        );
      }
    };

    const renderFabricAfterFetch = async () => {
      if (diffingResult && frameId) {
        if (canvasRef.current) {
          canvasRef.current.remove(...canvasRef.current.getObjects());
        }

        await renderFabricOnCanvas(diffingResult.content);

        canvasRef.current.renderAll();
      }
    };

    renderFabricAfterFetch();
  }, [frameId]);

  return (
    <>
      {isLoading && (
        <Modal>
          <Loading />
        </Modal>
      )}
      {isClickedNewVersion && (
        <Modal>
          <TextWrapper>
            <h1 className="re-version-title">Compare a new version?</h1>
            <Description
              className="re-version-description"
              size="medium"
              text="Clicking Compare will exit this screen.\nUnsaved information will be lost."
            />
          </TextWrapper>
          <ButtonWrapper>
            <Button
              className="close-button"
              size="medium"
              usingCase="line"
              handleClick={ev => {
                ev.preventDefault();

                setIsClickedNewVersion(false);
              }}
            >
              No
            </Button>
            <Button
              className="re-version"
              size="medium"
              usingCase="solid"
              handleClick={ev => {
                ev.preventDefault();

                navigate("/version");
              }}
            >
              Let's compare!
            </Button>
          </ButtonWrapper>
        </Modal>
      )}
      <ResultWrapper>
        <header className="result-header">
          <div className="logo-content">
            <Link to="/">
              <img className="logo" src={figciLogo} alt="figci-logo-img" />
            </Link>
          </div>
          <div className="header-information">
            <div className="version-information">
              <div className="versions">
                <p className="label">Before</p>
                <p className="version">{beforeVersionLabel}</p>
              </div>
              <div className="versions">
                <p className="label">After</p>
                <p className="version">{afterVersionLabel}</p>
              </div>
              <Button
                className="reselect-version"
                size="small"
                usingCase="line"
                handleClick={ev => {
                  ev.preventDefault();

                  setIsClickedNewVersion(true);
                }}
              >
                Reselect Versions
              </Button>
            </div>
            <div className="profile">
              <div className="line" />
              <img
                src={userProfile}
                alt="user-profile"
                className="profile-image"
              />
              <p className="username">{userName}</p>
            </div>
          </div>
        </header>
        <div className="content">
          <Sidebar
            framesInfo={frameList}
            projectUrl={projectUrl}
            onFrameSelect={handleFrameClick}
            selectedFrameId={frameId}
            selectedFrameName={frameName}
          />
          <CanvasWrapper>
            <canvas id="canvas" ref={canvasRef} />
            <PaginationButton
              direction="left"
              src={prevButton}
              onClick={handleClickPagination}
            />
            <PaginationButton
              direction="right"
              src={nextButton}
              onClick={handleClickPagination}
            />
            {frameList.length ? (
              <PaginationWrapper>
                <span>
                  {currentPage + 1} / {frameList.length}
                </span>
              </PaginationWrapper>
            ) : (
              <PaginationWrapper>
                <span>- / -</span>
              </PaginationWrapper>
            )}
          </CanvasWrapper>
        </div>
      </ResultWrapper>
      {toast.status && (
        <ToastPopup setToast={setToast} message={toast.message} />
      )}
    </>
  );
}

const PaginationButton = styled.img`
  position: absolute;
  top: 50%;
  ${({ direction }) => (direction === "left" ? "left: 24px;" : "right: 24px;")}
  transform: translateY(-50%);

  width: 48px;
  height: 48px;

  cursor: pointer;
`;

const PaginationWrapper = styled.div`
  position: absolute;
  bottom: 30px;
  right: 30px;

  padding: 10px 20px;
  border-radius: 20px;

  background-color: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

const CanvasWrapper = styled.div`
  position: relative;

  flex: 1;
`;

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .result-header {
    display: flex;
    justify-content: space-between;
  }

  .header-information {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 16px 32px;
    border-bottom: 2px solid #000000;
  }

  .version-information {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  }

  .versions {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    margin-right: 24px;
  }

  .content {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
  }

  .profile {
    display: flex;
    align-items: center;
  }

  .profile-image {
    width: 40px;
    height: 40px;
    border-radius: 48px;
    border: 2px solid #000000;
    margin-left: 40px;
    margin-right: 12px;

    background-color: #ffffff;
  }

  .label {
    margin-right: 12px;

    color: #000000;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
  }

  .version {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 12px;

    color: #495057;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    text-align: left;
  }

  .username {
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    text-align: left;
  }

  .logo-content {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 295px;
    min-width: 295px;
    padding: 24px 40px;
    border-right: 2px solid #000000;
    border-bottom: 2px solid #000000;
  }

  .logo {
    width: 60px;
    margin-right: 21px;
  }

  .line {
    width: 2px;
    height: 20px;

    background-color: #000000;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TextWrapper = styled.div`
  margin-bottom: 48px;
  width: 500px;

  .re-version-title {
    margin-bottom: 28px;

    color: #000000;
    font-size: 1.75rem;
    font-weight: 900;
    font-style: normal;
    line-height: 32px;
    text-align: center;
  }

  .re-version-content {
    display: block;

    color: #495057;
    font-size: 1rem;
    font-weight: 500;
    font-style: normal;
    text-align: center;
    line-height: 24px;
  }
`;

export default DiffingResult;
