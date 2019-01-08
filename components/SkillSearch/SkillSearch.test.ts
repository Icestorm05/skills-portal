import SkillSearch from "./SkillSearch.vue";
import { mount } from "@vue/test-utils";

// Add a wrapping <div data-app="true"></div> to silence Vuetify warnings.
const app = document.createElement("div");
app.setAttribute("data-app", "true");
document.body.appendChild(app);

declare const expect: jest.Expect;

describe("Skill Search", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(SkillSearch);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("snapshot has not changed", async () => {
    const wrapper = mount(SkillSearch, {
      propsData: { searchValue: ["test123"] }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("emits nothing by default", () => {
    const wrapper = mount(SkillSearch);
    expect(wrapper.emitted("search-value-changed")).toBeFalsy();
  });
});
