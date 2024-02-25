import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Welcome from "../Welcome";
import Modal from "../shared/Modal";
import Title from "../shared/Title";
import BottomNavigator from "../shared/BottomNavigator";
import ToastPopup from "../shared/Toast";

import useProjectStore from "../../store/project";
import useProjectVersionStore from "../../store/projectVersion";

import getAllVersions from "../../services/getAllVersions";
import getUserProfile from "../../services/getUserProfile";

import getProjectKeyFromURI from "../../utils/getProjectKeyFromURI";

function NewProject() {
  const navigate = useNavigate();

  const { project, setProject, clearProject } = useProjectStore();
  const { setVersion, clearVersion } = useProjectVersionStore();

  const [isModalOpened, setIsModalOpened] = useState(true);
  const [inputValue, setInputValue] = useState(project.projectUrl);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    clearProject();
    clearVersion();
  }, []);

  const handleModalClick = ev => {
    ev.preventDefault();

    setIsModalOpened(false);
  };

  const handleChangeInput = ev => {
    setInputValue(ev.target.value);
  };

  const isValidFigmaUrl = figmaUrl => {
    const figmaUrlPattern =
      /^(?:https:\/\/)?(?:www\.)?figma\.com\/file\/([0-9a-zA-Z]{22,128})(?:\/?([^?]+)?(.*))?$/;

    return figmaUrlPattern.test(figmaUrl);
  };

  const getUserInformation = async () => {
    const userInfo = await getUserProfile();

    if (userInfo.result === "error") {
      setToast({ statue: true, message: userInfo.message });

      return;
    }

    setProject({
      userName: userInfo.content.handle,
      userProfile: userInfo.content.img_url,
    });
  };

  const handleSubmitURI = async ev => {
    ev.preventDefault();

    if (!isValidFigmaUrl(inputValue)) {
      setToast({
        status: true,
        message: "피그마 파일 URL 주소가 아니에요. 다시 입력해주세요🥲",
      });
      setIsModalOpened(false);

      return;
    }

    const projectKey = getProjectKeyFromURI(inputValue);
    const allVersions = await getAllVersions(projectKey);
    const projectUrl = inputValue;

    if (allVersions.result === "error") {
      setToast({ status: true, message: allVersions.message });

      return;
    }

    await getUserInformation();

    setProject({ projectKey, projectUrl });
    setVersion(allVersions.content);

    navigate("/version");
  };

  const contents = {
    title: {
      step: "01",
      text: "디자인 변경사항을 확인할\n피그마 프로젝트 URL을 입력해주세요.",
    },
    buttons: [
      { text: "다음", usingCase: "solid", handleClick: handleSubmitURI },
    ],
  };

  return (
    <>
      {isModalOpened && (
        <Modal>
          <Welcome handleClick={handleModalClick} />
        </Modal>
      )}
      l
      <ContentsWrapper>
        <form onSubmit={handleSubmitURI}>
          <Title title={contents.title} />
          <label htmlFor="projectUrl" className="label">
            피그마 프로젝트 URL 입력
            <input
              id="projectUrl"
              defaultValue={inputValue}
              placeholder="url 주소를 입력해주세요. (예: www.figma.com/abc)"
              onChange={handleChangeInput}
            />
          </label>
        </form>
      </ContentsWrapper>
      <BottomNavigator buttons={contents.buttons} />
      {toast.status && (
        <ToastPopup setToast={setToast} message={toast.message} />
      )}
    </>
  );
}

const ContentsWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 64px;

  input {
    display: flex;
    width: 560px;
    height: 64px;
    padding: 0px 24px;
    border-radius: 8px;
    border: 2px solid #000000;
    margin-top: 12px;
    margin-bottom: 12px;

    background-color: #ffffff;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
  }

  .projectUrl {
    margin-top: 64;
  }

  .label {
    display: block;
    margin-top: 64px;
    margin-bottom: 12px;

    color: #000000;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
  }

  .description {
    display: block;

    color: #868e96;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
  }
`;

export default NewProject;
