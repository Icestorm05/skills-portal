import TheTeamMemberTabs from "./TheTeamMemberTabs.vue";
import Vuetify from "vuetify/es5/components/Vuetify";
import VTabs from "vuetify/es5/components/VTabs";
import { createLocalVue, mount } from "@vue/test-utils";

declare const expect: jest.Expect;

const localVue = createLocalVue();
localVue.use(Vuetify, {
  components: {
    VTabs
  }
});

const stubs = {
  "nuxt-link": "<a></a>"
};

const mocks = {
  $route: {
    params: {
      id: 1
    }
  }
};

describe("The Tabs", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(TheTeamMemberTabs, {
      localVue,
      mocks,
      stubs,
      propsData: { prefix: "John" }
    });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("snapshot has not changed", () => {
    const wrapper = mount(TheTeamMemberTabs, {
      localVue,
      stubs,
      propsData: { prefix: "John" }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("color prop changes color of tabs", () => {
    const wrapper = mount(TheTeamMemberTabs, {
      localVue,
      mocks,
      stubs,
      propsData: { color: "error", prefix: "John" }
    });
    expect(wrapper.find("#TheTabs .tabs__bar").classes()).toContain("error");
  });

  test("slider color prop changes color of tab slider", () => {
    const wrapper = mount(TheTeamMemberTabs, {
      localVue,
      mocks,
      stubs,
      propsData: { sliderColor: "error", prefix: "John" }
    });
    expect(wrapper.find("#TheTabs .tabs__slider").classes()).toContain("error");
  });

  test("team tab is hidden by default", () => {
    const wrapper = mount(TheTeamMemberTabs, {
      localVue,
      mocks,
      stubs,
      propsData: { prefix: "John" }
    });
    expect(wrapper.find("#TheTabs #TeamTab").exists()).toBeFalsy();
  });

  test("team tab is visible with hasTeam prop", () => {
    const wrapper = mount(TheTeamMemberTabs, {
      localVue,
      mocks,
      stubs,
      propsData: { hasTeam: true, prefix: "John" }
    });
    expect(wrapper.find("#TheTabs #TeamTab").exists()).toBeTruthy();
  });

  test("prefix appends a 's to tab names", () => {
    const wrapper = mount(TheTeamMemberTabs, {
      localVue,
      mocks,
      stubs,
      propsData: { hasTeam: true, prefix: "John" }
    });
    expect(wrapper.find("#TheTabs #UnreviewedSkillsTab").text()).toContain(
      "John's Unreviewed Skills"
    );
    expect(wrapper.find("#TheTabs #ReviewedSkillsTab").text()).toContain(
      "John's Reviewed Skills"
    );
    expect(wrapper.find("#TheTabs #ProfileTab").text()).toContain(
      "John's Profile"
    );
    expect(wrapper.find("#TheTabs #TeamTab").text()).toContain("John's Team");
  });

  test("prefix appends a ' to tab names if name ends in a s", () => {
    const wrapper = mount(TheTeamMemberTabs, {
      localVue,
      mocks,
      stubs,
      propsData: { hasTeam: true, prefix: "James" }
    });
    expect(wrapper.find("#TheTabs #UnreviewedSkillsTab").text()).toContain(
      "James' Unreviewed Skills"
    );
    expect(wrapper.find("#TheTabs #ReviewedSkillsTab").text()).toContain(
      "James' Reviewed Skills"
    );
    expect(wrapper.find("#TheTabs #ProfileTab").text()).toContain(
      "James' Profile"
    );
    expect(wrapper.find("#TheTabs #TeamTab").text()).toContain("James' Team");
  });
});
