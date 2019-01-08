import { IProfile } from "types/profile";
import { ITeamSkill } from "types/teamSkill";

export const state = () => [];

export const mutations = {
  set(currentTeamSkills: ITeamSkill[], teamSkills: ITeamSkill[]) {
    currentTeamSkills.push(...teamSkills);
  },
  reset(currentTeamSkills: ITeamSkill[]) {
    currentTeamSkills.splice(0, currentTeamSkills.length);
  }
};

export const actions = {
  async get({ commit }, team: IProfile[]) {
    const teamSkills = await Promise.all(
      team.map(async profile => {
        const url = `/employees/${profile.EmployeeId}/approvedskills`;
        const skills = await this.$axios.$get(url, {
          cancelToken: this.$cancelToken.token
        });
        return {
          EmployeeId: profile.EmployeeId,
          ...skills
        };
      })
    );
    commit("set", teamSkills);
  }
};
