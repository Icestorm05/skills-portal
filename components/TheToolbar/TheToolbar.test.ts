import TheToolbar from "./TheToolbar.vue";
import Vuetify from "vuetify/es5/components/Vuetify";
import VToolbar from "vuetify/es5/components/VToolbar";
import { createLocalVue, mount } from "@vue/test-utils";

declare const expect: jest.Expect;

const localVue = createLocalVue();
localVue.use(Vuetify, {
  components: {
    VToolbar
  }
});

// Add a wrapping <div data-app="true"></div> to silence Vuetify warnings.
const app = document.createElement("div");
app.setAttribute("data-app", "true");
document.body.appendChild(app);

describe("The Toolbar", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(TheToolbar, { localVue });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("snapshot has not changed", () => {
    const wrapper = mount(TheToolbar, { localVue });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("color prop changes color of toolbar", () => {
    const wrapper = mount(TheToolbar, {
      localVue,
      propsData: { color: "warning" }
    });
    expect(wrapper.find("#TheToolbar").classes()).toContain("warning");
  });

  test("clicking on the skills logo emits the logo-click event", () => {
    const wrapper = mount(TheToolbar, { localVue });
    wrapper.find("#TheToolbar #TheToolbarSkillsLogo").trigger("click");
    expect(wrapper.emitted("logo-click")).toBeTruthy();
  });

  test("avatar is hidden by default", () => {
    const wrapper = mount(TheToolbar, { localVue });
    expect(
      wrapper.find("#TheToolbar #TheToolbarAvatar").isVisible()
    ).toBeFalsy();
  });

  test("avatar is displayed with isLoggedIn prop", () => {
    const wrapper = mount(TheToolbar, {
      localVue,
      propsData: { isLoggedIn: true }
    });
    expect(
      wrapper.find("#TheToolbar #TheToolbarAvatar").isVisible()
    ).toBeTruthy();
  });

  test("clicking on view profile emits the profile-click event", () => {
    const wrapper = mount(TheToolbar, {
      localVue,
      propsData: { isLoggedIn: true }
    });
    wrapper.find("#TheToolbarProfile").trigger("click");
    expect(wrapper.emitted("profile-click")).toBeTruthy();
  });

  test("clicking on change password emits the password-click event", () => {
    const wrapper = mount(TheToolbar, {
      localVue,
      propsData: { isLoggedIn: true }
    });
    wrapper.find("#TheToolbarPassword").trigger("click");
    expect(wrapper.emitted("password-click")).toBeTruthy();
  });

  test("help button is hidden by default", () => {
    const wrapper = mount(TheToolbar, { localVue });
    expect(
      wrapper.find("#TheToolbar #TheToolbarHelpButton").isVisible()
    ).toBeFalsy();
  });

  test("help buton os displayed with isLoggedIn prop", () => {
    const wrapper = mount(TheToolbar, {
      localVue,
      propsData: { isLoggedIn: true }
    });
    expect(
      wrapper.find("#TheToolbar #TheToolbarHelpButton").isVisible()
    ).toBeTruthy();
  });

  test("clicking on help button emits the help-click event", () => {
    const wrapper = mount(TheToolbar, {
      localVue,
      propsData: { isLoggedIn: true }
    });
    wrapper.find("#TheToolbar #TheToolbarHelpButton").trigger("click");
    expect(wrapper.emitted("help-click")).toBeTruthy();
  });

  test("logout button is hidden by default", () => {
    const wrapper = mount(TheToolbar, { localVue });
    expect(
      wrapper.find("#TheToolbar #TheToolbarLogoutButton").isVisible()
    ).toBeFalsy();
  });

  test("logout button is displayed with isLoggedIn prop", () => {
    const wrapper = mount(TheToolbar, {
      localVue,
      propsData: { isLoggedIn: true }
    });
    expect(
      wrapper.find("#TheToolbar #TheToolbarLogoutButton").isVisible()
    ).toBeTruthy();
  });

  test("clicking on logout button emits the logout-click event", () => {
    const wrapper = mount(TheToolbar, {
      localVue,
      propsData: { isLoggedIn: true }
    });
    wrapper.find("#TheToolbar #TheToolbarLogoutButton").trigger("click");
    expect(wrapper.emitted("logout-click")).toBeTruthy();
  });

  test("tabs slot displays content", () => {
    const wrapper = mount(TheToolbar, {
      localVue,
      slots: {
        tabs: `<nav id="TestNav">
                    <a>Test Item</a>
                   </nav>`
      }
    });
    expect(wrapper.find("#TheToolbar #TestNav").exists()).toBeTruthy();
  });

  test("help button is hidden by default", () => {
    const wrapper = mount(TheToolbar, { localVue });
    expect(
      wrapper.find("#TheToolbar #TheToolbarHelpButton").isVisible()
    ).toBeFalsy();
  });

  test("help button is displayed with isLoggedIn prop", () => {
    const wrapper = mount(TheToolbar, {
      localVue,
      propsData: { isLoggedIn: true }
    });
    expect(
      wrapper.find("#TheToolbar #TheToolbarHelpButton").isVisible()
    ).toBeTruthy();
  });

  test("clicking on help button emits the help-click event", () => {
    const wrapper = mount(TheToolbar, {
      localVue,
      propsData: { isLoggedIn: true }
    });
    wrapper.find("#TheToolbar #TheToolbarHelpButton").trigger("click");
    expect(wrapper.emitted("help-click")).toBeTruthy();
  });
});
