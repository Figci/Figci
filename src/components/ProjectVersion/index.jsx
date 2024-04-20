import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Loading from "../shared/Loading";
import Modal from "../shared/Modal";
import Title from "../shared/Title";
import Select from "../shared/Select";
import BottomNavigator from "../shared/BottomNavigator";
import ToastPopup from "../shared/Toast";

import useProjectVersionStore from "../../store/projectVersion";
import usePageListStore from "../../store/projectPage";
import useProjectStore from "../../store/project";

import getCommonPages from "../../services/getCommonPages";

function ProjectVersion() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [toast, setToast] = useState({});
  const [projectVersion, setProjectVersion] = useState({});

  const navigate = useNavigate();

  const { project, setProject, clearProjectVersion } = useProjectStore();
  const { allDates, byDates } = useProjectVersionStore();
  const { setPages, clearPages } = usePageListStore();

  useEffect(() => {
    clearProjectVersion();
    clearPages();
  }, []);

  const handleChange = ev => {
    setProjectVersion({
      ...projectVersion,
      [ev.currentTarget.className]: ev.target.value,
    });
  };

  const handleClick = async ev => {
    ev.preventDefault();

    if (ev.target.classList.contains("prev")) {
      navigate("/new");

      return;
    }

    const { beforeDate, beforeVersion, afterDate, afterVersion } =
      projectVersion;

    if (!(beforeVersion && afterVersion)) {
      setToast({ status: true, message: "A version is not selected." });

      return;
    }

    const beforeCreatedAt = new Date(
      byDates[beforeDate][beforeVersion].createdAt,
    );
    const afterCreatedAt = new Date(byDates[afterDate][afterVersion].createdAt);

    if (beforeCreatedAt >= afterCreatedAt) {
      setToast({
        status: true,
        message: "The latest version must be newer than the previous version.",
      });

      return;
    }

    setProject(projectVersion);

    setIsLoaded(true);

    const pageList = await getCommonPages(
      project.projectKey,
      beforeVersion,
      afterVersion,
    );

    if (pageList.result === "error") {
      setIsLoaded(false);

      setToast({ statue: true, message: pageList.message });

      navigate("/new");
    }

    setPages(pageList.content);

    setIsLoaded(false);

    navigate("/page");
  };

  const createOption = versions => {
    const optionList = [];

    for (const versionId in versions) {
      const versionTitle = versions[versionId].label;

      optionList.push(
        <option value={versionId} key={versionId}>
          {versionTitle}
        </option>,
      );
    }

    return optionList;
  };

  const beforeVersionForm = {
    label: "Previous Version",
    description: "No version names? Timestamps will be used!",
    selects: [
      {
        className: "beforeDate",
        handleChange,
        placeholder: "Date Selection",
        options: allDates.map(date => (
          <option key={date} value={date}>
            {date}
          </option>
        )),
      },
      {
        className: "beforeVersion",
        handleChange,
        placeholder: "Version Selection",
        options:
          projectVersion.beforeDate &&
          createOption(byDates[projectVersion.beforeDate]),
      },
    ],
  };

  const afterVersionForm = {
    label: "Latest Version",
    description: "No version names? Timestamps will be used!",
    selects: [
      {
        className: "afterDate",
        handleChange,
        placeholder: "Date Selection",
        options: allDates.map(date => (
          <option key={date} value={date}>
            {date}
          </option>
        )),
      },
      {
        className: "afterVersion",
        handleChange,
        placeholder: "Version Selection",
        options:
          projectVersion.afterDate &&
          createOption(byDates[projectVersion.afterDate]),
      },
    ],
  };

  const contents = {
    title: {
      step: "02",
      text: "Choose previous and\nlatest versions to compare",
    },
    buttons: [
      {
        text: "Previous",
        usingCase: "line",
        handleClick,
        className: "prev",
      },
      {
        text: "Next",
        usingCase: "solid",
        handleClick,
        className: "next",
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
      <ContentsWrapper>
        <Title title={contents.title} />
        <HorizontalAlign>
          <Select selectInfo={beforeVersionForm} />
          <Select selectInfo={afterVersionForm} />
        </HorizontalAlign>
      </ContentsWrapper>
      <BottomNavigator buttons={contents.buttons} />
      {toast.status && (
        <ToastPopup setToast={setToast} message={toast.message} />
      )}
    </>
  );
}

const ContentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 64px;
`;

const HorizontalAlign = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 24px;
  width: 70%;
  margin-top: 64px;
`;

export default ProjectVersion;
