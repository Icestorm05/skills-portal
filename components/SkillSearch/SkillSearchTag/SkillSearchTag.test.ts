import SkillSearchTag from "./SkillSearchTag.vue";
import { mount } from "@vue/test-utils";

declare const expect: jest.Expect;

describe("Skill Search", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(SkillSearchTag);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("snapshot has not changed", async () => {
    const wrapper = mount(SkillSearchTag);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
