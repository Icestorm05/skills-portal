import axios from "axios";
import Cookies from "js-cookie";

export default async ({ $axios, store, redirect, req, route }, inject) => {
  let cancelToken = axios.CancelToken.source();
  const cancelAllRequests = () => {
    cancelToken.cancel();
    cancelToken = axios.CancelToken.source();
    inject("cancelToken", cancelToken);
  };
  inject("cancelAllRequests", cancelAllRequests);
  inject("cancelToken", cancelToken);

  const token = process.server ? req.cookies.token : Cookies.get("token");
  if (token) {
    $axios.setToken(token, "Bearer");
  }

  $axios.onError(err => {
    const code = parseInt(err.response && err.response.status, 10);
    if (code === 401) {
      store.commit("auth/resetToken");
      store.commit("profile/reset");
      store.commit("snackbar/show", {
        message: "Session timed out. Please re-login.",
        color: "error"
      });
      Cookies.remove("token");
      $axios.setToken(false);
      const query = route.query.redirect;
      redirect(`/login?redirect=${query ? query : route.path}`);
    }
  });
};
