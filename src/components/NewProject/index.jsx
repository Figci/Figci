import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Welcome from "../Welcome";
import Modal from "../shared/Modal";
import Title from "../shared/Title";
import Input from "../shared/Input";
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
    setVersion(newVersions);
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
      setToastMessage("유효하지 않은 URL입니다.");
      setToast(true);

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
      firstSentence: "디자인 변경사항을 확인할",
      secondSentence: "피그마 프로젝트 URL을 입력해주세요.",
    },
    inputInfo: {
      id: "project",
      label: "피그마 프로젝트 URL 입력",
      inputs: [
        {
          id: "address",
          placeholder: "url 주소를 입력해주세요. (예: www.figma.com/abc)",
        },
      ],
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
      <ContentsWrapper>
        <form>
          <Title title={contents.title} />
          <Input
            inputInfo={contents.inputInfo}
            onInputChange={handleChangeInput}
          />
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
`;

export default NewProject;
