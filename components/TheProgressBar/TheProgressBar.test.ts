import TheProgressBar from "./TheProgressBar.vue";
import { mount } from "@vue/test-utils";

declare const expect: jest.Expect;

describe("The Progress Bar", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(TheProgressBar);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("snapshot has not changed", () => {
    const wrapper = mount(TheProgressBar);
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("color prop changes the progress bar color", () => {
    const wrapper = mount(TheProgressBar, { propsData: { color: "error" } });
    expect(
      wrapper.find("#TheProgressBar .progress-linear__background").classes()
    ).toContain("error");
  });

  test("height prop changes the progress bar height", () => {
    const wrapper = mount(TheProgressBar, { propsData: { height: 5 } });
    expect(wrapper.find("#TheProgressBar").element.style.height).toEqual("5px");
  });
});
