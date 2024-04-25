import styled from "styled-components";

import Description from "../shared/Description";

import mobileErrorImage from "../../assets/mobile_error_image.png";
import figciLogo from "../../assets/logo_figci.png";

function MobileErrorPage() {
  return (
    <>
      <Header>
        <img className="logo" src={figciLogo} alt="figci-logo-img" />
        <Description
          className="description"
          size="small"
          text="Compare Figma versions to see.\nDesign changes at a glance!"
        />
      </Header>
      <Container>
        <Image src={mobileErrorImage} alt="mobile-support-error" />
        <h1 className="title">Sorry, Mobile is Not Supported.</h1>
        <Description
          className="description"
          size="medium"
          text="Mobile devices are not supported.\nPlease use a desktop browser."
        />
      </Container>
    </>
  );
}

const Header = styled.header`
  display: flex;
  justify-content: flex-start;

  margin-bottom: 20px;
  margin-left: 30px;
  margin-top: 40px;

  .logo {
    width: 80px;
    margin-right: 20px;
  }

  .description {
    color: black;
    font-weight: 800;
    text-align: left;
  }
`;

const Image = styled.img`
  width: 250px;
  height: 250px;
  margin-bottom: 40px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;

  box-sizing: border-box;
  height: calc(100vh - 150px);
  justify-content: center;
  align-items: center;

  .title {
    margin-bottom: 20px;

    color: #000000;
    text-align: center;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 900;
    line-height: 20px;
  }

  .description {
    font-size: 20px;
  }
`;

export default MobileErrorPage;
