import { create } from "zustand";

const authStore = set => {
  return {
    authCode: null,
    authState: "figci",
    setAuth: authCode => {
      set(state => {
        state.authCode = authCode;

        return state;
      });
    },
    clearAuth: () => {
      return set(state => {
        state.authCode = null;

        return state;
      });
    },
  };
};

const useAuthStore = create(authStore);

export default useAuthStore;
