import styled from "styled-components";

import Button from "../shared/Button";
import Description from "../shared/Description";

import welcomeIcon from "../../assets/welcome_icon.png";

function Welcome({ handleClick }) {
  return (
    <Wrapper>
      <img src={welcomeIcon} alt="welcome-modal-icon" />
      <TextWrapper>
        <h1 className="title">Ready to use Figci? Let's get started!</h1>
        <Description
          className="description"
          size="large"
          text="Just share your Figma design file link and pick the old and new versions.\n
          Figci will instantly show you what's changed between them.\n
          Want to give it a spin?"
        />
      </TextWrapper>
      <Button handleClick={handleClick} size="large" usingCase="solid">
        Sounds good!
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
