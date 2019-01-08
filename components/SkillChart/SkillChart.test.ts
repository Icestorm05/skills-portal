import SkillChart from "./SkillChart.vue";
import { shallow } from "@vue/test-utils";

import { ILegend } from "types/legend";
import { ISkillCategory } from "types/skill";

declare const expect: jest.Expect;

const skills: ISkillCategory[] = [
  {
    AreaId: 1,
    name: "Test Skill Area",
    children: [
      {
        SubAreaId: 1,
        name: "Test Skill Subarea",
        children: [
          {
            SkillAttributeId: 1,
            name: "Test Skill",
            Area: "Test Skill Area"
          },
          {
            SkillAttributeId: 2,
            name: "Test Skill 2",
            Area: "Test Skill Area"
          }
        ]
      },
      {
        SkillAttributeId: 3,
        name: "Test Skill 3",
        Area: "Test Skill Area"
      }
    ]
  },
  {
    AreaId: 2,
    name: "Test Skill Area 2",
    children: [
      {
        SkillAttributeId: 4,
        name: "Test Skill 4",
        Area: "Test Skill Area 2"
      }
    ]
  }
];

const legend: ILegend = {
  SkillCategories: {
    "Test Skill Area": "lightblue",
    "Test Skill Area 2": "rebeccapurple"
  },
  Levels: {
    Awareness: "red",
    Practitioner: "amber",
    Expert: "green"
  },
  Currencies: {
    Historic: "red",
    Fading: "amber",
    Current: "green"
  },
  fallback: "lightblue"
};

describe("Skill Chart", () => {
  test("is a Vue instance", () => {
    const wrapper = shallow(SkillChart, { propsData: { legend, skills } });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("snapshot has not changed", () => {
    const wrapper = shallow(SkillChart, { propsData: { legend, skills } });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
