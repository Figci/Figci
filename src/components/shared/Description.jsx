import React from "react";
import styled, { css } from "styled-components";
import { nanoid } from "nanoid";

const DESCRIPTION_SIZES = {
  medium: css`
    --description-font-size: 1rem;
    --description-line-height: 24px;
  `,
  large: css`
    --description-font-size: 1.25rem;
    --description-line-height: 30px;
  `,
};

function Description({ className, size, text }) {
  const descriptionSize = DESCRIPTION_SIZES[size];

  return (
    <StyledSpan className={className} $descriptionSize={descriptionSize}>
      {text.split("\\n").map(txt => (
        <React.Fragment key={nanoid(10)}>
          {txt}
          <br />
        </React.Fragment>
      ))}
    </StyledSpan>
  );
}

const StyledSpan = styled.span`
  ${props => props.$descriptionSize}

  display: block;

  color: #495057;
  font-size: var(--description-font-size);
  text-align: center;
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 500;
  line-height: var(--description-line-height);
`;

export default Description;
