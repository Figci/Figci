import styled from "styled-components";

import Button from "./Button";

function BottomNavigator({ buttons }) {
  return (
    <BottomNavWrapper>
      {buttons.map(button => (
        <Button
          className={button.className}
          key={button.text}
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
  box-sizing: border-box;
  position: absolute;
  bottom: 0px;

  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 24px 48px;
  border-top: 2px solid #000000;

  button {
    margin-left: 16px;
  }
`;

export default BottomNavigator;
