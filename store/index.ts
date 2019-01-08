import config from "~/server/config";

export const actions = {
  async nuxtServerInit({ commit, dispatch, state }, { $axios, req, res }) {
    const token = req.cookies.token;
    if (token) {
      $axios.setToken(token, "Bearer");
      $axios.defaults.baseURL = `http://localhost:${config.http.port}/api`;
      try {
        await dispatch("profile/get");
        commit("auth/setToken", token);
      } catch (err) {
        $axios.setToken(false);
        res.clearCookie("token");
      }
    }
  }
};
