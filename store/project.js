import { create } from "zustand";
import { devtools } from "zustand/middleware";

const projectStore = set => ({
  project: {
    username: null,
    userProfile: null,
    projectUrl: null,
    projectKey: null,
    beforeDate: null,
    beforeVersion: null,
    afterDate: null,
    afterVersion: null,
    pageId: null,
  },
  setProject: newProject =>
    set(state => ({
      ...state,
      project: {
        ...state.project,
        ...newProject,
      },
    })),
  clearPageId: () =>
    set(state => ({
      ...state,
      project: {
        ...state.project,
        pageId: null,
      },
    })),
  clearProjectVersion: () =>
    set(state => ({
      ...state,
      project: {
        ...state.project,
        beforeDate: null,
        beforeVersion: null,
        afterDate: null,
        afterVersion: null,
        pageId: null,
      },
    })),
  clearProject: () =>
    set(state => ({
      ...state,
      project: {
        username: null,
        userProfile: null,
        projectUrl: null,
        projectKey: null,
        beforeDate: null,
        beforeVersion: null,
        afterDate: null,
        afterVersion: null,
        pageId: null,
      },
    })),
});

const useProjectStore = create(devtools(projectStore));

export default useProjectStore;
