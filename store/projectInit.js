import { create } from "zustand";

const initStore = set => {
  return {
    status: {
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
    clearPage: () => {
      return set(state => {
        state.status = {
          ...state.status,
          pageId: null,
        };

        return state;
      });
    },
    clearVersion: () => {
      return set(state => {
        state.status = {
          ...state.status,
          beforeVersion: null,
          afterVersion: null,
          pageId: null,
        };

        return state;
      });
    },
    clearProject: () => {
      return set(state => {
        state.status = {
          projectKey: null,
          beforeVersion: null,
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
