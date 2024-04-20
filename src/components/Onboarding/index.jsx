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
      setToast({ status: true, message: "Login failed." });
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
          text="Sign in with Figma to easily compare versions and\n spot design changes across screens!"
        />
        <Button handleClick={onClickButtonHandler} size="large">
          Sign in with Figma
        </Button>
      </Wrapper>
      <Wrapper className="onboarding-right">
        <img src={onBoardingIcon} alt="figci-onboarding-img" width="360" />
        <h1 className="description main">
          Select two versions to instantly see
          <br />
          the design differences between them.
        </h1>
        <Description
          className="description sub"
          size="medium"
          text="Compare previous and current versions \n of your Figma file to see what's changed."
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
