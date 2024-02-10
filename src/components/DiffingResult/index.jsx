import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fabric } from "fabric";
import styled from "styled-components";

import Modal from "../shared/Modal";
import Loading from "../shared/Loading";
import Sidebar from "../Sidebar";
import Button from "../shared/Button";
import ToastPopup from "../shared/Toast";

import usePageStatusStore from "../../../store/projectInit";
import usePageListStore from "../../../store/projectPage";
import useProjectVersionStore from "../../../store/projectVersion";
import getDiffingResult from "../../../services/getDiffingResult";
import figciLogo from "../../../assets/logo_figci.jpg";

function DiffingResult() {
  const [canvas, setCanvas] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const [frameList, setFrameList] = useState([]);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();

  const {
    projectKey,
    beforeDate,
    beforeVersion,
    afterDate,
    afterVersion,
    pageId,
  } = usePageStatusStore(state => state.status);
  const { byPageIds } = usePageListStore();
  const versionStatus = useProjectVersionStore(state => state.byDates);

  const getVersionLabel = (date, versionId) => {
    if (versionStatus[date] && versionStatus[date][versionId]) {
      return `${date} ${versionStatus[date][versionId].label}`;
    }

    return null;
  };

  const beforeVersionLabel = getVersionLabel(beforeDate, beforeVersion);
  const afterVersionLabel = getVersionLabel(afterDate, afterVersion);
  const pageInfo = { id: "pageId", name: byPageIds[pageId] };

  useEffect(() => {
    const fetchDiffingResult = async () => {
      setIsLoaded(true);

      const diffingResult = await getDiffingResult(
        projectKey,
        beforeVersion,
        afterVersion,
        pageId,
      );

      if (diffingResult.result === "error") {
        setIsLoaded(false);

        setToastMessage(diffingResult.message);
        setToast(true);

        navigate(-1);
      }

      const frames = diffingResult.content.frames.map(frame => {
        return {
          name: frame.name,
          id: frame.frameId,
        };
      });

      setFrameList(frames);

      setIsLoaded(false);
    };

    fetchDiffingResult();
  }, []);

  const initCanvas = () =>
    new fabric.Canvas("canvas", {
      width: 400,
      height: 400,
      backgroundColor: "#CED4DA",
    });

  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  return (
    <>
      {isLoaded && (
        <Modal>
          <Loading />
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
              >
                버전 재선택
              </Button>
            </div>
            <div className="profile">
              <div className="line" />
              <div className="profile-image"></div>
              <p className="username">username</p>
            </div>
          </div>
        </header>
        <div className="content">
          {frameList && (
            <Sidebar
              page={pageInfo}
              framesInfo={frameList}
              frameCount={frameList.length}
            />
          )}
          <canvas id="canvas" />
        </div>
      </ResultWrapper>
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
    padding: 24px 40px;
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
    width: 48px;
    height: 48px;
    border-radius: 48px;
    border: 2px solid #000000;
    margin-left: 40px;
    margin-right: 12px;

    background-color: #ffffff;
  }

  .label {
    margin-right: 12px;

    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
  }

  .version {
    display: flex;
    flex-direction: row;
    align-items: center;

    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    text-align: left;
  }

  .username {
    font-size: 1.125rem;
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

  .reselect-version {
    box-sizing: border-box;
    padding: 8px 16px;
    border: 2px solid #000000;
    border-radius: 24px;
    white-space: pre-line;

    background-color: #ffffff;
    color: #000000;
    font-size: 1rem;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
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

export default DiffingResult;
