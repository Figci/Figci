import { Link } from "react-router-dom";
import styled from "styled-components";

import figciLogo from "../../assets/logo_figci.png";

function Header() {
  return (
    <Wrapper>
      <Link to="/">
        <img className="logo" src={figciLogo} alt="figci-logo-img" />
      </Link>
      <span className="slogan">
        Compare Figma versions to see
        <br />
        design changes at a glance!
      </span>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 64px;

  .logo {
    width: 70px;
    margin-right: 21px;
  }

  .slogan {
    color: #000000;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
  }
`;

export default Header;
