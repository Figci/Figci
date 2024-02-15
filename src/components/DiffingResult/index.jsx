import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fabric } from "fabric";
import styled from "styled-components";

import Modal from "../shared/Modal";
import Loading from "../shared/Loading";
import Sidebar from "../Sidebar";
import Button from "../shared/Button";
import Description from "../shared/Description";
import ToastPopup from "../shared/Toast";

import useProjectStore from "../../../store/project";
import useProjectVersionStore from "../../../store/projectVersion";
import getDiffingResultQuery from "../../../services/getDiffingResultQuery";

import figciLogo from "../../../assets/logo_figci.png";
import typeMapper from "../../../services/renderFabric";
import getDiffingResult from "../../../services/getDiffingResult";

function DiffingResult() {
  const [frameList, setFrameList] = useState([]);
  const [selectedFrame, setSelectedFrame] = useState("");
  const [canvas, setCanvas] = useState("");
  const [toast, setToast] = useState({});
  const [isClickedNewVersion, setIsClickedNewVersion] = useState(false);

  const navigate = useNavigate();

  const versionStatus = useProjectVersionStore(state => state.byDates);
  const {
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

  const beforeVersionLabel = getVersionLabel(beforeDate, beforeVersion);
  const afterVersionLabel = getVersionLabel(afterDate, afterVersion);

  useEffect(() => {
    if (diffingResult) {
      if (diffingResult.result === "error") {
        setToast({ status: true, message: diffingResult.message });

        return;
      }

      const frames = [];

      for (const frameId in diffingResult.content.frames) {
        const frame = diffingResult.content.frames[frameId];

        frames.push({ name: frame.name, id: frameId });
      }

      setFrameList(frames);
    }
  }, [diffingResult]);

  useEffect(() => {
    const newCanvas = new fabric.Canvas("canvas", {
      width: 1600,
      height: 1600,
      backgroundColor: "#CED4DA",
    });

    setCanvas(newCanvas);
  }, []);

  const matchType = async (el, number) => {
    if (!el.type) {
      const getDefaultFunction = typeMapper.RECTANGLE;
      const fabricObject = await getDefaultFunction(el, number);

      return fabricObject;
    }

    const getTypeFunction = typeMapper[el.type];

    if (getTypeFunction) {
      const fabricObject = await getTypeFunction(el, number);

      return fabricObject;
    }
    console.log("지원하지 않는 타입입니다.");
  };

  const createFabric = async frameJSON => {
    const devProjectKey = "x7GJK9PUJZMKB0tB7RqEc3";

    const baseFigmaURL = `/v1/files/${devProjectKey}/images`;
    const token = JSON.parse(localStorage.getItem("FigmaToken")).access_token;

    const requestFetch = async () => {
      const fetchData = await fetch(baseFigmaURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchJson = await fetchData.json();

      return fetchJson.meta.images;
    };

    const imageURLs = await requestFetch();
    const fabricObject = {};

    const fixCoord = frameSubtree => {
      const { x, y } = frameSubtree.property.absoluteBoundingBox;

      return {
        dx: x < 0 ? Math.abs(x) + 20 : -1 * x + 20,
        dy: y < 0 ? Math.abs(y) + 20 : -1 * y + 20,
      };
    };

    const parent = await matchType(frameJSON, fixCoord(frameJSON));

    parent.stroke = "black";
    parent.strokeWidth = 2;

    fabricObject[frameJSON.frameId] = parent;

    for (const nodeId in frameJSON.nodes) {
      if (frameJSON.nodes[nodeId].property.fills[0]?.imageRef) {
        const { imageRef } = frameJSON.nodes[nodeId].property.fills[0];

        if (imageURLs[imageRef]) {
          frameJSON.nodes[nodeId].property.imageURL = imageURLs[imageRef];
        }
      }

      fabricObject[nodeId] = matchType(
        frameJSON.nodes[nodeId],
        fixCoord(frameJSON),
      );
    }

    for (const nodeId in frameJSON.nodes) {
      const targetNode = frameJSON.nodes[nodeId];
      const childrenIds = [];

      if (
        targetNode.property.clipsContent &&
        targetNode.property.clipsContent === true
      ) {
        fabricObject[nodeId].absolutePositioned = true;

        targetNode.property.overrides?.forEach(node => {
          if (node.overriddenFields.includes("fills")) {
            childrenIds.push(node.id);
          }
        });
      }

      while (childrenIds.length) {
        const clipTargetId = childrenIds.pop();

        fabricObject[clipTargetId].clipPath = fabricObject[nodeId];
      }
    }

    if (frameJSON.property.clipsContent === true) {
      fabricObject[frameJSON.frameId].absolutePositioned = true;

      for (const nodeId in fabricObject) {
        if (nodeId !== frameJSON.frameId && !fabricObject[nodeId].clipPath) {
          fabricObject[nodeId].clipPath = fabricObject[frameJSON.frameId];
        }
      }
    }

    for (const nodeId in fabricObject) {
      canvas.add(fabricObject[nodeId]);
    }
  };

  const handleFrameSelect = (frameId, frameName) => {
    setSelectedFrame({ id: frameId, name: frameName });
  };

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
            <h1 className="re-version-title">새 버전을 비교하시겠어요?</h1>
            <Description
              className="re-version-description"
              size="medium"
              text="비교하기 버튼을 누르면 현재 화면에서 벗어나게 됩니다.\n보고계신 정보는 저장되지 않아요."
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
              아니오
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
              비교할래요!
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
                버전 재선택
              </Button>
            </div>
            <div className="profile">
              <div className="line" />
              <div className="profile-image"></div>
              <p className="username"></p>
            </div>
          </div>
        </header>
        <div className="content">
          <Sidebar
            framesInfo={frameList}
            projectUrl={projectUrl}
            onFrameSelect={handleFrameSelect}
          />
          <canvas id="canvas" />
        </div>
      </ResultWrapper>
      {toast.status && (
        <ToastPopup setToast={setToast} message={toast.message} />
      )}
    </>
  );
}

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
    padding: 24px 32px;
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
    width: 305px;
    min-width: 305px;
    padding: 24px 40px;
    border-right: 2px solid #000000;
    border-bottom: 2px solid #000000;
  }

  .logo {
    width: 70px;
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
