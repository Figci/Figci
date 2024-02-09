import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Loading from "../shared/Loading";
import Modal from "../shared/Modal";
import Title from "../shared/Title";
import Select from "../shared/Select";
import BottomNavigator from "../shared/BottomNavigator";

import { getDiffingResult } from "../../../services/pages";
import usePageListStore from "../../../store/projectPage";
import usePageStatusStore from "../../../store/projectInit";

function ProjectPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [targetPageId, setTargetPageId] = useState("");
  const { status, setStatus } = usePageStatusStore(state => state);
  const { byPageIds } = usePageListStore();
  const navigate = useNavigate();

  setStatus({ pageId: targetPageId });

  const handleChange = ev => {
    setTargetPageId(ev.target.value);
  };

  const handleClick = ev => {
    ev.preventDefault();

    if (ev.target.classList.contains("prev")) {
      navigate("/version");

      return;
    }

    const { projectKey, beforeVersion, afterVersion, pageId } = status;

    const targetPage = {
      projectKey,
      beforeVersion,
      afterVersion,
      pageId,
    };

    try {
      setIsLoaded(true);

      getDiffingResult(targetPage);

      setIsLoaded(false);

      navigate("/result");
    } catch (err) {
      setIsLoaded(false);
    }
  };

  const selectOptionRenderList = () => {
    const optionRenderList = [];

    for (const pageId in byPageIds) {
      const pageName = byPageIds[pageId];

      optionRenderList.push(
        <option key={pageId} value={pageId}>
          {pageName}
        </option>,
      );
    }

    return optionRenderList;
  };

  const contents = {
    title: {
      step: "03",
      firstSentence: "비교할 페이지를",
      secondSentence: "선택해주세요.",
    },
    selectInfo: {
      id: "selectedPage",
      label: "비교 페이지 선택",
      selects: [
        {
          className: "selectedPage",
          options: selectOptionRenderList(),
          handleChange,
          placeholder: "페이지 선택",
        },
      ],
      description: "이전 버전과 비교할 수 있는 페이지만 보여요!",
    },
    buttons: [
      {
        text: "이전",
        usingCase: "line",
        handleClick,
        className: "prev",
      },
      {
        text: "비교하기",
        usingCase: "solid",
        handleClick,
        className: "diffing",
      },
    ],
  };

  return (
    <>
      {isLoaded && (
        <Modal>
          <Loading />
        </Modal>
      )}
      <ProjectPageWrapper>
        <Title title={contents.title} />
        <Select selectInfo={contents.selectInfo} />
        <BottomNavigator buttons={contents.buttons} />
      </ProjectPageWrapper>
    </>
  );
}

const ProjectPageWrapper = styled.div`
  box-sizing: border-box;

  width: 100%;
  height: 100%;
  padding: 64px;
`;

export default ProjectPage;
