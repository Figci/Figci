import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";

import Button from "../shared/Button";
import ToastPopup from "../shared/Toast";

import { getAuth, fetchToken } from "../../../services/auth";
import figciLogo from "../../../assets/logo_figci.jpg";
import onBoardingIcon from "../../../assets/onboarding.png";

function Onboarding() {
  const [isClicked, setIsClicked] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToageMessage] = useState("");
  const [query] = useSearchParams();
  const navigate = useNavigate();

  const code = query.get("code");
  const state = query.get("state");

  useEffect(() => {
    if (isClicked) {
      getAuth();

      setIsClicked(false);
    }
  }, [isClicked]);

  const getAccessToken = async () => {
    await fetchToken(code);

    navigate("/new");
  };

  if (code && state) {
    try {
      getAccessToken(code);
    } catch (err) {
      setToageMessage("로그인에 실패하였습니다.");
    }
  }

  const onClickButtonHandler = ev => {
    ev.preventDefault();

    setIsClicked(true);
  };

  return (
    <Container>
      <Wrapper className="onboarding-left">
        <img
          className="logo-image"
          src={figciLogo}
          alt="figci-logo-img"
          width="150"
        />
        <span className="description">
          피그마 계정으로 로그인하시면 파일버전을 비교해
          <br />
          디자인 화면의 변경사항을 쉽게 보여드려요!
        </span>
        <Button handleClick={onClickButtonHandler} size="large">
          피그마 계정으로 로그인
        </Button>
      </Wrapper>
      <Wrapper className="onboarding-right">
        <img src={onBoardingIcon} alt="figci-onboarding-img" width="400" />
        <h1 className="description main">
          비교할 두 피그마 버전을 알려주시면
          <br />
          버전 별 디자인 화면 변경사항을 바로 알려드려요
        </h1>
        <span className="description sub">
          피그마 이전 버전과 최신 버전을 비교해
          <br />
          변경사항을 확인해보세요
        </span>
      </Wrapper>
      {toast && <ToastPopup setToast={setToast} message={toastMessage} />}
    </Container>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  padding: 80px;
  border-left: 2px solid #000000;

  .description {
    padding: 24px;
    margin-bottom: 24px;

    font-size: 1.2rem;
    font-style: normal;
    font-weight: 500;
    line-height: 30px;
    text-align: center;
  }

  .description.main {
    padding: 0;
    margin-bottom: 12px;

    color: #000000;
    font-weight: 700;
  }

  .description.sub {
    padding: 0;

    color: #868e96;
    font-size: 1rem;
    line-height: 24px;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;

  .onboarding-left {
    flex-grow: 6;
  }

  .onboarding-right {
    flex-grow: 4;

    background-color: #f8f9fa;

    img {
      margin-bottom: 48px;
    }
  }
`;

export default Onboarding;
