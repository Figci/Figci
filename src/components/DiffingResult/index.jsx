import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fabric } from "fabric";
import styled from "styled-components";

import Sidebar from "../Sidebar";

import figciLogo from "../../../assets/logo_figci.jpg";

function DiffingResult() {
  const [canvas, setCanvas] = useState("");
  const [frameUrl, setFrameUrl] = useState("");

  const initCanvas = () =>
    new fabric.Canvas("canvas", {
      height: 1000,
      width: 800,
      backgroundColor: "#CED4DA",
    });

  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  return (
    <ResultWrapper>
      <header className="result-header">
        <div className="logo-content">
          <Link to="/">
            <img className="logo" src={figciLogo} alt="figci-logo-img" />
          </Link>
        </div>
        <div className="header-information">
          <div className="versions">
            <p className="label">Before</p>
            <span className="version"></span>
          </div>
          <div className="versions">
            <p className="label">After</p>
            <span className="version"></span>
          </div>
          <button>버전 재선택</button>
          <div className="line"></div>
          <div className="profile">
            <p>username</p>
          </div>
        </div>
      </header>
      <div className="content">
        <Sidebar className="sidebar" />
        <canvas id="canvas" />
      </div>
    </ResultWrapper>
  );
}

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .result-header {
    display: flex;
  }

  .header-information {
    box-sizing: border-box;
    width: 100%;
    padding: 24px 40px;
    display: flex;
    align-items: center;

    border-bottom: 2px solid #000000;
  }

  .versions {
    box-sizing: border-box;

    margin-left: 24px;
    display: flex;
    flex-direction: row;
  }

  .content {
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
  }

  .profile {
    display: flex;
    align-items: center;
  }

  .label {
    margin-right: 12px;

    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
  }

  .version {
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
  }

  .logo-content {
    width: 305px;
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

export default DiffingResult;
