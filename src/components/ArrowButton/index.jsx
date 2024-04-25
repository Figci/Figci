// ArrowButton.js
import React from "react";
import styled from "styled-components";

function ArrowButton({ direction, onClick }) {
  return (
    <ArrowButtonWrapper direction={direction} onClick={onClick}>
      {direction === "left" ? "<" : ">"}
    </ArrowButtonWrapper>
  );
}

const ArrowButtonWrapper = styled.button`
  position: absolute;
  top: 50%;
  ${({ direction }) => (direction === "left" ? "left: 10px;" : "right: 10px;")}
  transform: translateY(-50%);
  background-color: #fff;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

export default ArrowButton;
