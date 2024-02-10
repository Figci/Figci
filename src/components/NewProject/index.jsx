import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Welcome from "../Welcome";
import Modal from "../shared/Modal";
import Title from "../shared/Title";
import BottomNavigator from "../shared/BottomNavigator";
import ToastPopup from "../shared/Toast";

import getVersions from "../../../services/versions";
import getProjectKeyFromURI from "../../../utils/getProjectKeyFromURI";

import useProjectVersionStore from "../../../store/projectVersion";
import usePageStatusStore from "../../../store/projectInit";

function NewProject() {
  const navigate = useNavigate();
  const [isModalOpened, setIsModalOpened] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { setStatus } = usePageStatusStore();
  const { setVersion } = useProjectVersionStore();

  const setVersionList = newVersions => {
    if (newVersions.result === "error") {
      setToastMessage(newVersions.message);
      setToast(true);

      return;
    }

    setVersion(newVersions.content);
  };

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

  const handleSubmitURI = async ev => {
    ev.preventDefault();

    if (!isValidFigmaUrl(inputValue)) {
      setToastMessage("피그마 파일 URL 주소가 아니에요. 다시 입력해주세요🥲");
      setToast(true);
      setIsModalOpened(false);

      return;
    }

    const projectKey = getProjectKeyFromURI(inputValue);

    setStatus({ projectKey });
    setVersionList(await getVersions(projectKey));

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
        <form>
          <Title title={contents.title} />
          <label htmlFor="projectUrl" className="label">
            피그마 프로젝트 URL 입력
            <input
              id="projectUrl"
              placeholder="url 주소를 입력해주세요. (예: www.figma.com/abc)"
              onChange={handleChangeInput}
            />
          </label>
        </form>
      </ContentsWrapper>
      <BottomNavigator buttons={contents.buttons} />
      {toast && <ToastPopup setToast={setToast} message={toastMessage} />}
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
