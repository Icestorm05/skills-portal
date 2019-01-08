import TheSnackbar from "./TheSnackbar.vue";
import { mount } from "@vue/test-utils";

declare const expect: jest.Expect;

describe("The Snackbar", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(TheSnackbar);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("snapshot has not changed", () => {
    const wrapper = mount(TheSnackbar);
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("error message snapshot has not changed", () => {
    const wrapper = mount(TheSnackbar, {
      propsData: { color: "error", visible: true },
      slots: {
        default: "Test Error Message"
      }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("success message snapshot has not changed", async () => {
    const wrapper = mount(TheSnackbar, {
      propsData: { color: "success", visible: true },
      slots: {
        default: "Test Success Message"
      }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("warning message snapshot has not changed", async () => {
    const wrapper = mount(TheSnackbar, {
      propsData: { color: "warning", visible: true },
      slots: {
        default: "Test Success Message"
      }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("snackbar is hidden by default", () => {
    const wrapper = mount(TheSnackbar);
    expect(wrapper.find("#TheSnackbar").exists()).toBeFalsy();
  });

  test("snackbar is displayed with visible prop", () => {
    const wrapper = mount(TheSnackbar, { propsData: { visible: true } });
    expect(wrapper.find("#TheSnackbar").exists()).toBeTruthy();
  });

  test("color prop changes color of snackbar", () => {
    const wrapper = mount(TheSnackbar, {
      propsData: { color: "warning", visible: true }
    });
    expect(wrapper.find("#TheSnackbar .snack__wrapper").classes()).toContain(
      "warning"
    );
  });

  test("timeout-elapsed event is emitted after timeout prop elapses", async () => {
    const timeout = 1;
    const wrapper = mount(TheSnackbar, {
      propsData: { timeout, visible: true }
    });
    expect(wrapper.emitted("timeout-elapsed")).toBeFalsy();
    await new Promise((resolve, reject) => {
      window.setTimeout(resolve, timeout);
    });
    expect(wrapper.emitted("timeout-elapsed")).toBeTruthy();
  });

  test("visibility watcher is fired when visible prop changes", () => {
    const spy = jest.fn();
    const wrapper = mount(TheSnackbar, {
      propsData: { visible: true },
      watch: {
        visible: spy
      }
    });
    expect(spy).not.toBeCalled();
    wrapper.setProps({ visible: false });
    expect(spy).toBeCalled();
  });

  test("changing the visible prop to true starts a timer", () => {
    const wrapper = mount(TheSnackbar, { propsData: { visible: false } });
    const spy = jest.spyOn(window, "setTimeout");
    expect(spy).not.toBeCalled();
    wrapper.setProps({ visible: true });
    expect(spy).toBeCalled();
  });

  test("changing the visible prop to false cancels a timer", () => {
    const wrapper = mount(TheSnackbar, { propsData: { visible: true } });
    const spy = jest.spyOn(window, "clearTimeout");
    expect(spy).not.toBeCalled();
    wrapper.setProps({ visible: false });
    expect(spy).toBeCalled();
  });

  test("timer property is set with visible prop", () => {
    const wrapper = mount(TheSnackbar, { propsData: { visible: false } });
    expect(wrapper.vm.$data.timer).toBeFalsy();
    wrapper.setProps({ visible: true });
    expect(wrapper.vm.$data.timer).toBeTruthy();
  });

  test("clicking the close snackbar button fires the hide fn", () => {
    const spy = jest.fn();
    const wrapper = mount(TheSnackbar, { propsData: { visible: true } });
    wrapper.setData({ hide: spy });
    expect(spy).not.toBeCalled();
    wrapper.find("#TheSnackbar").trigger("input");
    expect(spy).toBeCalled();
  });

  test("clicking the close snackbar button fires the timeout-elapsed event", () => {
    const wrapper = mount(TheSnackbar, { propsData: { visible: true } });
    expect(wrapper.emitted("timeout-elapsed")).toBeFalsy();
    wrapper.find("#TheSnackbar #TheSnackbarCloseButton").trigger("click");
    expect(wrapper.emitted("timeout-elapsed")).toBeTruthy();
  });
});
