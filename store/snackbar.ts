import { ISnackbar } from "types/snackbar";

export const state = () =>
  ({
    timeout: 5000,
    message: "",
    color: "success"
  } as ISnackbar);

export const mutations = {
  show(currentSnackbar: ISnackbar, snackbar: ISnackbar) {
    currentSnackbar.color = snackbar.color;
    currentSnackbar.message = snackbar.message;
  },
  hide(currentSnackbar: ISnackbar) {
    currentSnackbar.color = "success";
    currentSnackbar.message = "";
  }
};

export const getters = {
  hasMessage(currentSnackbar: ISnackbar) {
    return currentSnackbar.message ? true : false;
  }
};
