import { ISkill, ISkillCategory } from "types/skill";
import {
  deepDiff,
  deepFilter,
  deepFilterInverse,
  deepFind,
  deepMerge
} from "~/modules/skills";

export const state = () => [];

export const mutations = {
  set(currentSkills: ISkillCategory[], skills: ISkillCategory[]) {
    currentSkills.push(...skills);
  },
  add(
    currentSkills: ISkillCategory[],
    payload: { skill: ISkill; path: ISkillCategory }
  ) {
    const skill = deepFind([payload.path], payload.skill) as ISkill;
    Object.keys(payload.skill).forEach(
      key => (skill[key] = payload.skill[key])
    );
    if (currentSkills.length) {
      currentSkills = deepMerge(
        currentSkills,
        payload.path
      ) as ISkillCategory[];
    } else {
      currentSkills.push(payload.path);
    }
  },
  edit(currentSkills: ISkillCategory[], skill: ISkill) {
    const currentSkill = deepFind(currentSkills, skill) as ISkill;
    currentSkill.SkillLevelId = skill.SkillLevelId;
    currentSkill.SkillCurrencyId = skill.SkillCurrencyId;
  },
  remove(
    currentSkills: ISkillCategory[],
    payload: { skill: ISkill; path: ISkillCategory }
  ) {
    const updatedHierarchy = deepFilterInverse(
      currentSkills,
      payload.skill
    ) as ISkillCategory[];
    currentSkills.splice(0, currentSkills.length);
    currentSkills.push(...updatedHierarchy);
  },
  reset(currentSkills: ISkillCategory[]) {
    currentSkills.splice(0, currentSkills.length);
  }
};

export const actions = {
  async get({ commit }, employeeId: number) {
    const url = `/employees/${employeeId}/skills`;
    const res = await this.$axios.$get(url, {
      cancelToken: this.$cancelToken.token
    });
    commit("set", res.skills);
  },
  async add({ commit }, payload: { skill: ISkill; path: ISkillCategory }) {
    const url = `/employees/${payload.skill.EmployeeId}/skills`;
    const employeeSkillId = (await this.$axios.$post(url, {
      skill: payload.skill
    })).new;
    payload.skill.EmployeeSkillId = employeeSkillId;
    commit("add", payload);
  },
  async edit({ commit }, skill: ISkill) {
    const url = `/employees/${skill.EmployeeId}/skills/${
      skill.EmployeeSkillId
    }`;
    await this.$axios.$put(url, { skill });
    commit("edit", skill);
  },
  async remove({ commit }, payload: { skill: ISkill; path: ISkillCategory }) {
    const url = `/employees/${payload.skill.EmployeeId}/skills/${
      payload.skill.EmployeeSkillId
    }`;
    await this.$axios.$delete(url);
    commit("remove", payload);
  }
};

export const getters = {
  getPath(currentSkills: ISkillCategory[]) {
    return (skill: ISkill) => {
      return deepFilter(JSON.parse(JSON.stringify(currentSkills)), skill)[0];
    };
  },
  unreviewed(currentSkills: ISkillCategory[], localGetters, globalState) {
    return deepDiff(
      JSON.parse(JSON.stringify(currentSkills)),
      globalState.reviewedSkills
    );
  }
};
