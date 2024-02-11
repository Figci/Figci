import { create } from "zustand";

const initStore = set => {
  return {
    status: {
      projectUrl: null,
      projectKey: null,
      beforeDate: null,
      beforeVersion: null,
      afterDate: null,
      afterVersion: null,
      pageId: null,
    },
    setStatus: newStatus => {
      set(state => {
        state.status = {
          ...state.status,
          ...newStatus,
        };

        return state;
      });
    },
    clearPageStatus: () => {
      return set(state => {
        state.status = {
          ...state.status,
          pageId: null,
        };

        return state;
      });
    },
    clearVersionStatus: () => {
      return set(state => {
        state.status = {
          ...state.status,
          beforeDate: null,
          beforeVersion: null,
          afterDate: null,
          afterVersion: null,
          pageId: null,
        };

        return state;
      });
    },
    clearProjectStatus: () => {
      return set(state => {
        state.status = {
          projectUrl: null,
          projectKey: null,
          beforeDate: null,
          beforeVersion: null,
          afterDate: null,
          afterVersion: null,
          pageId: null,
        };

        return state;
      });
    },
  };
};

const usePageStatusStore = create(initStore);

export default usePageStatusStore;
