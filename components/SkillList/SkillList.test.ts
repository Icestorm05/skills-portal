import SkillList from "./SkillList.vue";
import { mount } from "@vue/test-utils";

import { ISkill, ISkillCategory } from "types/skill";

declare const expect: jest.Expect;

// Add a wrapping <div data-app="true"></div> to silence Vuetify warnings.
const app = document.createElement("div");
app.setAttribute("data-app", "true");
document.body.appendChild(app);

const skillCategory: ISkillCategory = {
  name: "Test Skill Category 1",
  children: [],
  description: ""
};

const skillCategory2: ISkillCategory = {
  name: "Test Skill Category 2",
  children: [],
  description: ""
};

const skillSubcategory: ISkillCategory = {
  name: "Test Skill Subcategory 1",
  children: [],
  description: ""
};

const skillSubcategory2: ISkillCategory = {
  name: "Test Skill Subcategory 2",
  children: [],
  description: ""
};

const skill: ISkill = {
  SkillAttributeId: 1,
  name: "Test Skill",
  Area: "",
  description: ""
};

const skill2: ISkill = {
  SkillAttributeId: 2,
  name: "Test Skill 2",
  Area: "",
  description: ""
};

const skill3: ISkill = {
  SkillAttributeId: 3,
  name: "Test Skill 3",
  Area: "",
  description: ""
};

const skill4: ISkill = {
  SkillAttributeId: 4,
  name: "Test Skill 4",
  Area: "",
  description: ""
};

const skills: ISkillCategory[] = [
  {
    ...skillCategory,
    children: [
      {
        ...skillSubcategory,
        children: [skill]
      },
      {
        ...skillSubcategory2,
        children: [skill2]
      },
      skill3
    ]
  },
  {
    ...skillCategory2,
    children: [skill4]
  }
];

const skillsFlatMix: Array<ISkillCategory | ISkill> = [
  skillCategory,
  skillCategory2,
  skill,
  skill2
];

describe("Skill List", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(SkillList, { propsData: { skills } });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("snapshot has not changed", async () => {
    const wrapper = mount(SkillList, { propsData: { lazy: false, skills } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("lazy snapshot has not changed", async () => {
    const wrapper = mount(SkillList, { propsData: { lazy: true, skills } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("lazy prop set to true only renders first level", () => {
    const wrapper = mount(SkillList, { propsData: { lazy: true, skills } });
    expect(wrapper.find(".SkillPanel").exists()).toBeTruthy();
    expect(wrapper.find(".SkillPanel .SkillPanel").exists()).toBeFalsy();
  });

  test("lazy prop set to false renders all levels", () => {
    const wrapper = mount(SkillList, { propsData: { lazy: false, skills } });
    expect(wrapper.find(".SkillPanel").exists()).toBeTruthy();
    expect(wrapper.find(".SkillPanel .SkillPanel").exists()).toBeTruthy();
  });

  test("renders the first level categories correctly", () => {
    const wrapper = mount(SkillList, { propsData: { lazy: false, skills } });
    const headers = wrapper.findAll(".SkillPanel .SkillPanelHeader");
    expect(headers.length).toEqual(4);
    expect(headers.at(0).text()).toEqual(skillCategory.name);
    expect(headers.at(3).text()).toEqual(skillCategory2.name);
  });

  test("renders the second level subcategories correctly", () => {
    const wrapper = mount(SkillList, { propsData: { lazy: false, skills } });
    const headers = wrapper.findAll(
      ".SkillPanel .SkillPanel .SkillPanelHeader"
    );
    expect(headers.length).toEqual(2);
    expect(headers.at(0).text()).toEqual(skillSubcategory.name);
    expect(headers.at(1).text()).toEqual(skillSubcategory2.name);
  });

  test("renders the second level skills correctly", () => {
    const wrapper = mount(SkillList, { propsData: { lazy: false, skills } });
    const skillWrappers = wrapper.findAll(".SkillPanel .Skills");
    expect(skillWrappers.length).toEqual(4);
  });

  test("renders the third level correctly", () => {
    const wrapper = mount(SkillList, { propsData: { lazy: false, skills } });
    const skillWrappers = wrapper.findAll(".SkillPanel .SkillPanel .Skills");
    expect(skillWrappers.length).toEqual(2);
  });

  test("renders flat level of just skill categories mix correctly", () => {
    const wrapper = mount(SkillList, {
      propsData: { lazy: false, skills: skillsFlatMix }
    });
    const panelHeaders = wrapper.findAll(".SkillPanel .SkillPanelHeader");
    expect(panelHeaders.length).toEqual(2);
    expect(panelHeaders.at(0).text()).toEqual(skillCategory.name);
    expect(panelHeaders.at(1).text()).toEqual(skillCategory2.name);
  });

  test("joins skills on same level together", () => {
    const wrapper = mount(SkillList, {
      propsData: { lazy: false, skills: skillsFlatMix }
    });
    const skillWrappers = wrapper.findAll(".Skills");
    expect(skillWrappers.length).toEqual(1);
  });

  test("creates a computed property of skill categories only", () => {
    const wrapper = mount(SkillList, {
      propsData: { lazy: false, skills: skillsFlatMix }
    });
    const categoriesOnly = (wrapper.vm as any).skillCategoriesOnly;
    expect(categoriesOnly.length).toEqual(2);
    expect(categoriesOnly).toContain(skillCategory);
    expect(categoriesOnly).toContain(skillCategory2);
  });

  test("creates a computed property of skills only", () => {
    const wrapper = mount(SkillList, {
      propsData: { lazy: false, skills: skillsFlatMix }
    });
    const skillsOnly = (wrapper.vm as any).skillsOnly;
    expect(skillsOnly.length).toEqual(2);
    expect(skillsOnly).toContain(skill);
    expect(skillsOnly).toContain(skill2);
  });

  // TO DO: Test scoped slot
});
