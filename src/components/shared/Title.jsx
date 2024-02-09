import styled from "styled-components";

function Title({ title }) {
  return (
    <TitleWrapper>
      {title.step && <h2 className="step">STEP {title.step}</h2>}
      <h2 className="title spacing">{title.text}</h2>
    </TitleWrapper>
  );
}

const TitleWrapper = styled.div`
  h2 {
    font-size: 2rem;
    font-style: normal;
    font-weight: 900;
    line-height: 48px;
    text-align: left;
  }

  .step {
    color: #2623fb;
  }

  .title {
    color: #000000;
  }

  .spacing {
    white-space: pre;
  }
`;

export default Title;
