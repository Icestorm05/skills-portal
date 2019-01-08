import ScrollButton from "./ScrollButton.vue";

import VueScrollTo from "vue-scrollto";
import { createLocalVue, mount } from "@vue/test-utils";

const localVue = createLocalVue();
localVue.use(VueScrollTo);

declare const expect: jest.Expect;

describe("Scroll Button", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(ScrollButton, {
      localVue,
      propsData: { top: "body", bottom: "body" }
    });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("snapshot has not changed", () => {
    const wrapper = mount(ScrollButton, {
      localVue,
      propsData: { top: "body", bottom: "body" }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("by default displays keyboard_arrow_down icon", () => {
    const wrapper = mount(ScrollButton, {
      localVue,
      propsData: { top: "body", bottom: "body" }
    });
    expect(wrapper.find(".ScrollButtonIcon").text()).toEqual(
      "keyboard_arrow_down"
    );
  });

  test("by default pageYOffset is 0", () => {
    const wrapper = mount(ScrollButton, {
      localVue,
      propsData: { top: "body", bottom: "body" }
    });
    expect(wrapper.vm.$data.pageYOffset).toEqual(0);
  });

  test("adds a scroll event listener on mount", () => {
    const spy = jest.spyOn(window, "addEventListener");
    const wrapper = mount(ScrollButton, {
      localVue,
      propsData: { top: "body", bottom: "body" }
    });
    expect(spy).toHaveBeenCalled();
  });

  test("pageYOffset updates with scroll event", () => {
    const wrapper = mount(ScrollButton, {
      localVue,
      propsData: { top: "body", bottom: "body" }
    });
    Object.defineProperty(window, "pageYOffset", { value: 10 });
    const event = new UIEvent("scroll", { detail: 1, view: window });
    window.dispatchEvent(event);
    expect(wrapper.vm.$data.pageYOffset).toEqual(10);
  });
});
