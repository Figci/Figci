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
        <h1 className="title">원하시는 페이지를 찾을 수 없어요</h1>
        <Description
          className="description"
          size="medium"
          text="찾으시려는 페이지 주소가 잘못 입력되었거나\n입력한 페이지 주소가 정확한지 다시 한번 확인해 주세요."
        />
        <Button
          className="home-button"
          handleClick={() => {
            navigate("/");
          }}
          size="large"
          usingCase="line"
        >
          홈 으로 돌아가기
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
