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
  set(
    currentSkills: ISkillCategory[],
    payload: { skills: ISkillCategory[]; employeeSkills: ISkillCategory[] }
  ) {
    currentSkills.push(
      ...(deepDiff(payload.skills, payload.employeeSkills) as ISkillCategory[])
    );
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
  setCurrency(
    currentSkills: ISkillCategory[],
    skill: ISkill
  ) {
    const currentSkill = deepFind(currentSkills, skill);
    if (currentSkill) {
      (currentSkill as ISkill).SkillCurrencyId = skill.SkillCurrencyId;
    }
  },
  setLevel(
    currentSkills: ISkillCategory[],
    skill: ISkill
  ) {
    const currentSkill = deepFind(currentSkills, skill);
    if (currentSkill) {
      (currentSkill as ISkill).SkillLevelId = skill.SkillLevelId;
    }
  },
  reset(currentSkills: ISkillCategory[]) {
    currentSkills.splice(0, currentSkills.length);
  }
};

export const actions = {
  async get({ commit }, employeeSkills: ISkillCategory[]) {
    const url = "/skills";
    const skills = await this.$axios.$get(url, {
      cancelToken: this.$cancelToken.token
    });
    commit("set", { skills, employeeSkills });
  }
};

export const getters = {
  getPath(currentSkills: ISkillCategory[], allGetters) {
    return (skill: ISkill) => {
      const t = deepFilter(JSON.parse(JSON.stringify(currentSkills)), skill)[0];
      return t;
    };
  }
};
