import styled from "styled-components";

import Button from "../shared/Button";
import Description from "../shared/Description";

import welcomeIcon from "../../assets/welcome_icon.png";

function Welcome({ handleClick }) {
  return (
    <Wrapper>
      <img src={welcomeIcon} alt="welcome-modal-icon" />
      <TextWrapper>
        <h1 className="title">Figci를 바로 사용할 수 있어요!</h1>
        <Description
          className="description"
          size="large"
          text="Figci는 피그마 디자인 파일 링크와 파일의 이전/최신 버전을\n
          선택해주시면 같은 디자인 파일의 변경사항을 바로 볼 수 있어요!\n
          지금 바로 이용해볼까요?"
        />
      </TextWrapper>
      <Button handleClick={handleClick} size="large" usingCase="solid">
        좋아요!
      </Button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;

  width: 720px;
  height: 366px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TextWrapper = styled.div`
  padding: 28px;

  .title {
    margin-bottom: 18px;

    color: #000000;
    text-align: center;
    font-size: 2rem;
    font-style: normal;
    font-weight: 900;
    line-height: 48px;
  }
`;

export default Welcome;
