import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Loading from "../shared/Loading";
import Modal from "../shared/Modal";
import Title from "../shared/Title";
import Select from "../shared/Select";
import BottomNavigator from "../shared/BottomNavigator";
import ToastPopup from "../shared/Toast";

import usePageListStore from "../../store/projectPage";
import useProjectStore from "../../store/project";

import getDiffingResultQuery from "../../services/getDiffingResultQuery";

function ProjectPage() {
  const [toast, setToast] = useState({});
  const [selectedPageId, setSelectedPageId] = useState("");
  const [isClick, setIsClick] = useState(false);

  const { byPageIds } = usePageListStore();
  const { project, setProject, clearPageId } = useProjectStore();
  const { projectKey, beforeVersion, afterVersion, pageId } = project;

  const navigate = useNavigate();

  useEffect(() => {
    clearPageId();
  }, []);

  const {
    data: diffingResult,
    isLoading,
    isError,
    error,
  } = getDiffingResultQuery(
    projectKey,
    beforeVersion,
    afterVersion,
    pageId,
    isClick,
  );

  useEffect(() => {
    if (diffingResult && isClick) {
      if (diffingResult.result === "error") {
        setToast({ status: true, message: diffingResult.message });
        setIsClick(false);

        return;
      }

      setIsClick(false);
      navigate("/result");
    }
  }, [diffingResult, isClick]);

  const handleChange = ev => {
    setSelectedPageId(ev.target.value);
  };

  const handleClick = ev => {
    ev.preventDefault();

    if (ev.target.classList.contains("prev")) {
      navigate("/version");

      return;
    }

    setProject({ pageId: selectedPageId });
    setIsClick(true);
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
      text: "Select pages to compare.",
    },
    selectInfo: {
      id: "selectedPage",
      label: "Compare Pages",
      selects: [
        {
          className: "selectedPage",
          options: selectOptionRenderList(),
          handleChange,
          placeholder: "Page Selection",
        },
      ],
      description:
        "Only pages that can be compared with the previous version are shown!",
    },
    buttons: [
      {
        text: "Previous",
        usingCase: "line",
        handleClick,
        className: "prev",
      },
      {
        text: "Compare",
        usingCase: "solid",
        handleClick,
        className: "diffing",
      },
    ],
  };

  if (isError) {
    return setToast({ status: true, message: error.toString() });
  }

  return (
    <>
      {isLoading && (
        <Modal>
          <Loading />
        </Modal>
      )}
      <ProjectPageWrapper>
        <Title title={contents.title} />
        <div className="select">
          <Select selectInfo={contents.selectInfo} />
        </div>
      </ProjectPageWrapper>
      <BottomNavigator buttons={contents.buttons} />
      {toast.status && (
        <ToastPopup setToast={setToast} message={toast.message} />
      )}
    </>
  );
}

const ProjectPageWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 64px;

  .select {
    width: 60%;
    margin-top: 64px;
  }
`;

export default ProjectPage;
