import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Loading from "../shared/Loading";
import Modal from "../shared/Modal";
import Title from "../shared/Title";
import Select from "../shared/Select";
import BottomNavigator from "../shared/BottomNavigator";
import ToastPopup from "../shared/Toast";

import getCommonPages from "../../../services/getCommonPages";

import useProjectVersionStore from "../../../store/projectVersion";
import usePageListStore from "../../../store/projectPage";
import useProjectStore from "../../../store/project";

function ProjectVersion() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
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
      setToastMessage("선택하지 않은 버전이 존재합니다.");
      setToast(true);

      return;
    }

    const beforeCreatedAt = new Date(
      byDates[beforeDate][beforeVersion].createdAt,
    );
    const afterCreatedAt = new Date(byDates[afterDate][afterVersion].createdAt);

    if (beforeCreatedAt >= afterCreatedAt) {
      setToastMessage("이후 버전은 이전 버전보다 나중이여야 합니다.");
      setToast(true);

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

      setToastMessage(pageList.message);
      setToast(true);

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
    label: "이전 버전",
    description: "지정한 버전 명이 없으면 시간으로 보여요!",
    selects: [
      {
        className: "beforeDate",
        handleChange,
        placeholder: "버전 선택",
        options: allDates.map(date => (
          <option key={date} value={date}>
            {date}
          </option>
        )),
      },
      {
        className: "beforeVersion",
        handleChange,
        placeholder: "날짜 선택",
        options:
          projectVersion.beforeDate &&
          createOption(byDates[projectVersion.beforeDate]),
      },
    ],
  };

  const afterVersionForm = {
    label: "이후 버전",
    description: "지정한 버전 명이 없으면 시간으로 보여요!",
    selects: [
      {
        className: "afterDate",
        handleChange,
        placeholder: "날짜 선택",
        options: allDates.map(date => (
          <option key={date} value={date}>
            {date}
          </option>
        )),
      },
      {
        className: "afterVersion",
        handleChange,
        placeholder: "버전 선택",
        options:
          projectVersion.afterDate &&
          createOption(byDates[projectVersion.afterDate]),
      },
    ],
  };

  const contents = {
    title: {
      step: "02",
      text: "비교할 해당 피그마 파일의\n이전 / 최신 버전을 입력해 주세요",
    },
    buttons: [
      {
        text: "이전",
        usingCase: "line",
        handleClick,
        className: "prev",
      },
      {
        text: "다음",
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
      {toast && <ToastPopup setToast={setToast} message={toastMessage} />}
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
