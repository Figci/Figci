import styled, { keyframes } from "styled-components";

import Description from "./Description";

function Loading() {
  return (
    <Wrapper>
      <Circle />
      <TextWrapper>
        <h1 className="title">Comparing files...</h1>
        <Description
          className="description"
          size="medium"
          text="Depending on the file size and number of pages,\n comparing the entire file may take a while."
        />
      </TextWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 720px;
  height: 366px;
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

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Circle = styled.div`
  animation: ${rotate} 2s linear infinite;

  width: 90px;
  height: 90px;
  border-radius: 50%;
  border-top: 6px solid #ced4da;
  border-right: 6px solid #ced4da;
  border-bottom: 6px solid #ced4da;
  border-left: 6px solid #2623fb;

  background-color: transparent;
`;

export default Loading;
