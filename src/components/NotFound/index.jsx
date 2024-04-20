import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Button from "../shared/Button";
import Description from "../shared/Description";

import notFoundImage from "../../assets/not-found-image.png";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Container>
      <Wrapper>
        <img className="logo-image" src={notFoundImage} alt="figci-logo-icon" />
        <h1 className="title">Can't find the page you're looking for</h1>
        <Description
          className="description"
          size="medium"
          text="The page URL may be incorrect.\nPlease double-check the URL."
        />
        <Button
          className="home-button"
          handleClick={() => {
            navigate("/");
          }}
          size="large"
          usingCase="line"
        >
          Go back to Home
        </Button>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 80px 80px 80px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .title {
    margin-bottom: 16px;

    color: #000000;
    text-align: center;
    font-size: 2rem;
    font-style: normal;
    font-weight: 900;
    line-height: 48px;
  }

  .description {
    margin-bottom: 48px;
  }

  .home-button {
    font-weight: 700;
  }
`;

export default NotFound;
