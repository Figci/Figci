import { nanoid } from "nanoid";
import styled from "styled-components";

import Button from "./Button";

function BottomNavigator({ buttons }) {
  return (
    <BottomNavWrapper>
      {buttons.map(button => (
        <Button
          className={button.className}
          key={nanoid(10)}
          handleClick={button.handleClick}
          size="medium"
          usingCase={button.usingCase}
          disabled={button.disabled}
        >
          {button.text}
        </Button>
      ))}
    </BottomNavWrapper>
  );
}

const BottomNavWrapper = styled.div`
  position: absolute;
  bottom: 0px;

  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  box-sizing: border-box;
  width: 100%;
  padding: 24px 48px;
  border-top: 2px solid #000000;

  button {
    margin-left: 16px;
  }
`;

export default BottomNavigator;
