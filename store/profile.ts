import { IProfile } from "types/profile";
import { deepLevel, findProfile } from "~/modules/profile";

const defaultProfile = {
  Biography: "",
  Director: "",
  EmailAddress: "",
  EmployeeId: 0,
  FirstLineReporting: "",
  FullName: "",
  JobTitle: "",
  KnownAs: "",
  SecondLineReporting: "",
  Surname: "",
  children: []
};

export const state = () => ({ ...defaultProfile });

export const mutations = {
  set(currentProfile: IProfile, profile: IProfile) {
    Object.keys(currentProfile).forEach(
      key => (currentProfile[key] = profile[key])
    );
  },
  updateBiography(currentProfile: IProfile, biography: string) {
    currentProfile.Biography = biography;
  },
  reset(currentProfile: IProfile) {
    Object.keys(currentProfile).forEach(
      key => (currentProfile[key] = defaultProfile[key])
    );
  }
};

export const actions = {
  async get({ commit }) {
    const data = await this.$axios.$get("/profile");
    commit("set", data.profile);
  },
  async edit({ commit }, profile: IProfile) {
    const url = `/employees/${profile.EmployeeId}`;
    await this.$axios.$put(url, { employee: profile });
    commit("updateBiography", profile.Biography);
  }
};

export const getters = {
  current(currentProfile: IProfile, localGetters, globalState) {
    const id = globalState.route
      ? parseInt(globalState.route.params.id, 10)
      : 0;
    const profile = findProfile(
      [currentProfile],
      id || currentProfile.EmployeeId
    );
    return profile ? profile : currentProfile;
  },
  currentDepth(currentProfile: IProfile, localGetters) {
    return localGetters.current.EmployeeId
      ? deepLevel([currentProfile], localGetters.current)
      : 0;
  },
  hasTeam(currentProfile: IProfile, localGetters) {
    return localGetters.current.children.length ? true : false;
  }
};
