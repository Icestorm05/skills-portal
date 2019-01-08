import { IProgress } from "types/progress";

export const state = () => ({
  display: true
});

export const mutations = {
  show(currentProgress: IProgress) {
    currentProgress.display = true;
  },
  hide(currentProgress: IProgress) {
    currentProgress.display = false;
  }
};

export const getters = {
  isVisible(currentProgress: IProgress) {
    return currentProgress.display;
  }
};
