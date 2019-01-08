import Cookies from "js-cookie";
import { IAuth } from "types/auth";
import { IUser } from "types/user";

export const state = () => ({
  token: ""
});

export const mutations = {
  setToken(currentState: IAuth, token: string) {
    currentState.token = token;
  },
  resetToken(currentState: IAuth) {
    currentState.token = "";
  }
};

export const actions = {
  async login({ commit }, user: IUser) {
    const data = await this.$axios.$post("/login", user);
    this.$axios.setToken(data.token, "Bearer");
    Cookies.set("token", data.token);
    commit("setToken", data.token);
  },
  async checkPassword({ commit }, password: string) {
    await this.$axios.$post('/checkPassword', { password });
  },
  async changePassword({ commit }, password: string) {
    await this.$axios.$put('/changePassword', { password }).catch(e => {
      throw new Error('Failed to change password.');
    });
  },
  async logout({ commit }) {
    await this.$axios.$get("/logout");
    this.$axios.setToken(false);
    Cookies.remove("token");
    commit("resetToken");
  }
};

export const getters = {
  isLoggedIn(currentState: IAuth) {
    return currentState.token ? true : false;
  }
};
