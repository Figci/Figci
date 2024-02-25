import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

import Button from "../shared/Button";
import Description from "../shared/Description";
import ToastPopup from "../shared/Toast";

import { getAuth, fetchToken } from "../../services/auth";

import figciLogo from "../../assets/logo_figci.png";
import onBoardingIcon from "../../assets/onboarding.png";

function Onboarding() {
  const [isClicked, setIsClicked] = useState(false);
  const [toast, setToast] = useState({});
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
      setToast({ status: true, message: "로그인에 실패하였습니다." });
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
        <Description
          className="description"
          size="large"
          text="피그마 계정으로 로그인하시면 파일버전을 비교해\n디자인 화면의 변경사항을 쉽게 보여드려요!"
        />
        <Button handleClick={onClickButtonHandler} size="large">
          피그마 계정으로 로그인
        </Button>
      </Wrapper>
      <Wrapper className="onboarding-right">
        <img src={onBoardingIcon} alt="figci-onboarding-img" width="360" />
        <h1 className="description main">
          비교할 두 피그마 버전을 알려주시면
          <br />
          버전 별 디자인 화면 변경사항을 바로 알려드려요
        </h1>
        <Description
          className="description sub"
          size="medium"
          text="피그마 이전 버전과 최신 버전을 비교해\n변경사항을 확인해보세요"
        />
      </Wrapper>
      {toast.status && (
        <ToastPopup setToast={setToast} message={toast.message} />
      )}
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

  .logo-image {
    margin-bottom: 24px;
  }

  .description {
    margin-bottom: 48px;
  }

  .description.main {
    padding: 0;
    margin-bottom: 12px;

    color: #000000;
    font-size: 1.2rem;
    font-weight: 700;
    font-style: normal;
    line-height: 30px;
    text-align: center;
  }

  .description.sub {
    padding: 0;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;

  .onboarding-left {
    flex-grow: 7;
  }

  .onboarding-right {
    flex-grow: 3;

    background-color: #e9ecef;

    img {
      margin-bottom: 48px;
    }
  }
`;

export default Onboarding;
