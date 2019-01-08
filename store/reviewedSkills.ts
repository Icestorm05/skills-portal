import { ISkill, ISkillCategory } from "types/skill";
import { deepFilterInverse, deepFind, deepMerge } from "~/modules/skills";

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
    const url = `/employees/${employeeId}/approvedskills`;
    const res = await this.$axios.$get(url, {
      cancelToken: this.$cancelToken.token
    });
    commit("set", res.skills);
  },
  async add({ commit }, payload: { skill: ISkill; path: ISkillCategory }) {
    const url = `/employees/${payload.skill.EmployeeId}/skills?action=approve`;
    const skill = {
      EmployeeId: payload.skill.EmployeeId,
      EmployeeSkillAttributeId: payload.skill.EmployeeSkillAttributeId,
      SkillCurrencyId: payload.skill.SkillCurrencyId,
      SkillLevelId: payload.skill.SkillLevelId
    };
    await this.$axios.$put(url, { skill });
    commit("add", payload);
  },
  async remove(
    { commit, state: reviewedSkills },
    payload: { skill: ISkill; path: ISkillCategory }
  ) {
    const reviewedSkill = deepFind(
      reviewedSkills,
      payload.skill
    ) as ISkill | null;
    if (reviewedSkill) {
      const employeeId = reviewedSkill.EmployeeId;
      const skillId = reviewedSkill.EmployeeApprovedSkillId;
      const url = `/employees/${employeeId}/skills/${skillId}?action=unapprove`;
      await this.$axios.$delete(url);
      commit("remove", payload);
    }
  }
};
