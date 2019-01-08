import TheTabs from "./TheTabs.vue";
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

describe("The Tabs", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(TheTabs, { localVue, stubs });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("snapshot has not changed", () => {
    const wrapper = mount(TheTabs, { localVue, stubs });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("color prop changes color of tabs", () => {
    const wrapper = mount(TheTabs, {
      localVue,
      stubs,
      propsData: { color: "error" }
    });
    expect(wrapper.find("#TheTabs .tabs__bar").classes()).toContain("error");
  });

  test("slider color prop changes color of tab slider", () => {
    const wrapper = mount(TheTabs, {
      localVue,
      stubs,
      propsData: { sliderColor: "error" }
    });
    expect(wrapper.find("#TheTabs .tabs__slider").classes()).toContain("error");
  });

  test("team tab is hidden by default", () => {
    const wrapper = mount(TheTabs, { localVue, stubs });
    expect(wrapper.find("#TheTabs #TeamTab").exists()).toBeFalsy();
  });

  test("team tab is visible with hasTeam prop", () => {
    const wrapper = mount(TheTabs, {
      localVue,
      stubs,
      propsData: { hasTeam: true }
    });
    expect(wrapper.find("#TheTabs #TeamTab").exists()).toBeTruthy();
  });
});
