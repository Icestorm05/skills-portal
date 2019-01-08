import SkillCard from "./SkillCard.vue";
import VeeValidate from "vee-validate";
import { createLocalVue, mount } from "@vue/test-utils";
import vVisible from "~plugins/vVisible";

import { ISkill } from "types/skill";

declare const expect: jest.Expect;

const skill: ISkill = {
  SkillAttributeId: 1,
  name: "Test Skill",
  Area: "",
  SkillCurrencyId: 2,
  SkillLevelId: 4,
  description: "This is a test skill."
};

const unsavedSkill: ISkill = {
  SkillAttributeId: 1,
  name: "Test Skill",
  Area: "",
  description: "This is a test skill."
};

const stubs = {
  SkillCardStatus: '<div class="SkillCardStatus"></div>',
  SkillCardRadioButtons: '<div class="SkillCardRadioButtons"></div>'
};

const localVue = createLocalVue();
localVue.use(VeeValidate);
localVue.directive("visible", vVisible);

describe("Skill Card", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(SkillCard, { stubs, propsData: { skill } });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("snapshot has not changed", () => {
    const wrapper = mount(SkillCard, {
      stubs,
      propsData: { skill, displayAddButton: true, displayStatusList: true }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("buttons container is not displayed by default", () => {
    const wrapper = mount(SkillCard, { stubs, propsData: { skill } });
    expect((wrapper.vm as any).displayButton).toBeFalsy();
    expect(wrapper.find(".SkillCardButtons").exists()).toBeFalsy();
  });

  test("buttons container is displayed when display add button prop is set to true", () => {
    const wrapper = mount(SkillCard, {
      stubs,
      propsData: { skill, displayAddButton: true }
    });
    expect((wrapper.vm as any).displayButton).toBeTruthy();
    expect(wrapper.find(".SkillCardButtons").exists()).toBeTruthy();
  });

  test("buttons container is displayed when display edit button prop is set to true", () => {
    const wrapper = mount(SkillCard, {
      stubs,
      propsData: { skill, displayEditButton: true }
    });
    expect((wrapper.vm as any).displayButton).toBeTruthy();
    expect(wrapper.find(".SkillCardButtons").exists()).toBeTruthy();
  });

  test("buttons container is displayed when display remove button prop is set to true", () => {
    const wrapper = mount(SkillCard, {
      stubs,
      propsData: { skill, displayRemoveButton: true }
    });
    expect((wrapper.vm as any).displayButton).toBeTruthy();
    expect(wrapper.find(".SkillCardButtons").exists()).toBeTruthy();
  });

  test("description is visible when their is a description in the skill object", () => {
    const wrapper = mount(SkillCard, { stubs, propsData: { skill } });
    expect(wrapper.find(".SkillCardDescription").isVisible()).toBeTruthy();
  });

  test("description is invisible when their is no description in the skill object", () => {
    const wrapper = mount(SkillCard, {
      stubs,
      propsData: { skill: { ...skill, description: "" } }
    });
    expect(wrapper.find(".SkillCardDescription").isVisible()).toBeFalsy();
  });

  test("display add button prop appends an add button", () => {
    const wrapper = mount(SkillCard, {
      stubs,
      propsData: { skill, displayAddButton: true }
    });
    expect(wrapper.find(".SkillCardAddButton").exists()).toBeTruthy();
  });

  test("display edit button prop appends an edit button", () => {
    const wrapper = mount(SkillCard, {
      stubs,
      propsData: { skill, displayEditButton: true }
    });
    expect(wrapper.find(".SkillCardEditButton").exists()).toBeTruthy();
  });

  test("display remove button prop appends a remove button", () => {
    const wrapper = mount(SkillCard, {
      stubs,
      propsData: { skill, displayRemoveButton: true }
    });
    expect(wrapper.find(".SkillCardRemoveButton").exists()).toBeTruthy();
  });

  test("no skill card status list or radio buttons are displayed by default", () => {
    const wrapper = mount(SkillCard, { stubs, propsData: { skill } });
    expect(wrapper.find(".SkillCardStatus").exists()).toBeFalsy();
    expect(wrapper.find(".SkillCardRadioButtons").exists()).toBeFalsy();
  });

  test("display status list prop appends a skill card status component", () => {
    const wrapper = mount(SkillCard, {
      stubs,
      propsData: { skill, displayStatusList: true }
    });
    expect(wrapper.find(".SkillCardStatus").exists()).toBeTruthy();
  });

  test("display status radio buttons prop appends a skill card radio buttons component", () => {
    const wrapper = mount(SkillCard, {
      stubs,
      propsData: { skill, displayStatusRadioButtons: true }
    });
    expect(wrapper.find(".SkillCardRadioButtons").exists()).toBeTruthy();
  });

  test("add button click fires add fn", () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { skill, displayAddButton: true }
    });
    const spy = jest.fn();
    wrapper.setData({ add: spy });
    expect(spy).not.toHaveBeenCalled();
    wrapper.find(".SkillCardAddButton").trigger("click");
    expect(spy).toHaveBeenCalled();
  });

  test("add button click with disabled prop does not emit add-skill event", async () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { skill, disabled: true, displayAddButton: true }
    });
    wrapper.find(".SkillCardAddButton").trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("add-skill")).toBeFalsy();
  });

  test("add button click with failing validation rules does not emit add-skill event", async () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { skill, displayAddButton: true }
    });
    wrapper.vm.$validator.attach({ name: "test", rules: "required" });
    await wrapper.vm.$validator.validate("test", "");
    wrapper.find(".SkillCardAddButton").trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("add-skill")).toBeFalsy();
  });

  test("add button click emits add-skill event", async () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { skill, displayAddButton: true }
    });
    wrapper.find(".SkillCardAddButton").trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("add-skill")).toBeTruthy();
  });

  test("add button click emits skill with default attributes added", async () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { skill: unsavedSkill, displayAddButton: true }
    });
    wrapper.find(".SkillCardAddButton").trigger("click");
    await wrapper.vm.$nextTick();
    const savedSkill: ISkill = wrapper.emitted("add-skill")[0][0] as any;
    expect(savedSkill.EmployeeId).toEqual(0);
    expect(savedSkill.EmployeeSkillAttributeId).toEqual(
      unsavedSkill.SkillAttributeId
    );
    expect(savedSkill.SkillCurrencyId).toEqual(null);
    expect(savedSkill.SkillLevelId).toEqual(null);
  });

  test("add button click emits skill with employee id prop added", async () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { employeeId: 1, skill: unsavedSkill, displayAddButton: true }
    });
    wrapper.find(".SkillCardAddButton").trigger("click");
    await wrapper.vm.$nextTick();
    const savedSkill: ISkill = wrapper.emitted("add-skill")[0][0] as any;
    expect(savedSkill.EmployeeId).toEqual(1);
  });

  test("add button click emits skill with set currency and level added", async () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { skill: unsavedSkill, displayAddButton: true }
    });
    wrapper.find(".SkillCardAddButton").trigger("click");
    wrapper.setData({ currency: 2, level: 4 });
    await wrapper.vm.$nextTick();
    const savedSkill: ISkill = wrapper.emitted("add-skill")[0][0] as any;
    expect(savedSkill.SkillCurrencyId).toEqual(2);
    expect(savedSkill.SkillLevelId).toEqual(4);
  });

  test("edit button click fires add fn", () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { skill, displayEditButton: true }
    });
    const spy = jest.fn();
    wrapper.setData({ edit: spy });
    expect(spy).not.toHaveBeenCalled();
    wrapper.find(".SkillCardEditButton").trigger("click");
    expect(spy).toHaveBeenCalled();
  });

  test("edit button click with disabled prop does not emit edit-skill event", async () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { skill, disabled: true, displayEditButton: true }
    });
    wrapper.find(".SkillCardEditButton").trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("edit-skill")).toBeFalsy();
  });

  test("edit button click with failing validation rules does not emit edit-skill event", async () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { skill, displayEditButton: true }
    });
    wrapper.vm.$validator.attach({ name: "test", rules: "required" });
    await wrapper.vm.$validator.validate("test", "");
    wrapper.find(".SkillCardEditButton").trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("edit-skill")).toBeFalsy();
  });

  test("edit button click emits edit-skill event", async () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { skill, displayEditButton: true }
    });
    wrapper.find(".SkillCardEditButton").trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("edit-skill")).toBeTruthy();
  });

  test("edit button click emits skill with default currency and level added", async () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { skill: unsavedSkill, displayEditButton: true }
    });
    wrapper.find(".SkillCardEditButton").trigger("click");
    await wrapper.vm.$nextTick();
    const editedSkill: ISkill = wrapper.emitted("edit-skill")[0][0] as any;
    expect(editedSkill.SkillCurrencyId).toBeNull();
    expect(editedSkill.SkillLevelId).toBeNull();
  });

  test("edit button click emits skill with amended currency and level added", async () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { skill: unsavedSkill, displayEditButton: true }
    });
    wrapper.find(".SkillCardEditButton").trigger("click");
    wrapper.setData({ currency: 2, level: 4 });
    await wrapper.vm.$nextTick();
    const editedSkill: ISkill = wrapper.emitted("edit-skill")[0][0] as any;
    expect(editedSkill.SkillCurrencyId).toEqual(2);
    expect(editedSkill.SkillLevelId).toEqual(4);
  });

  test("remove button click fires add fn", () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { skill, displayRemoveButton: true }
    });
    const spy = jest.fn();
    wrapper.setData({ remove: spy });
    expect(spy).not.toHaveBeenCalled();
    wrapper.find(".SkillCardRemoveButton").trigger("click");
    expect(spy).toHaveBeenCalled();
  });

  test("remove button click with disabled prop does not emit remove-skill event", async () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { skill, disabled: true, displayRemoveButton: true }
    });
    wrapper.find(".SkillCardRemoveButton").trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("remove-skill")).toBeFalsy();
  });

  test("remove button click with failing validation rules does not emit remove-skill event", async () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { skill, displayRemoveButton: true }
    });
    wrapper.vm.$validator.attach({ name: "test", rules: "required" });
    await wrapper.vm.$validator.validate("test", "");
    wrapper.find(".SkillCardRemoveButton").trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("remove-skill")).toBeFalsy();
  });

  test("remove button click emits remove-skill event", async () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { skill, displayRemoveButton: true }
    });
    wrapper.find(".SkillCardRemoveButton").trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("remove-skill")).toBeTruthy();
  });

  test("remove button click emits skill", async () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { skill, displayRemoveButton: true }
    });
    wrapper.find(".SkillCardRemoveButton").trigger("click");
    await wrapper.vm.$nextTick();
    const skillToRemove: ISkill = wrapper.emitted("remove-skill")[0][0] as any;
    expect(skillToRemove.name).toEqual(skill.name);
  });

  test("currency data binds to skill currency id", () => {
    const wrapper = mount(SkillCard, { stubs, propsData: { skill } });
    expect(wrapper.vm.$data.currency).toEqual(skill.SkillCurrencyId);
  });

  test("currency data equals null with no skill currency id", () => {
    const wrapper = mount(SkillCard, {
      stubs,
      propsData: { skill: unsavedSkill }
    });
    expect(wrapper.vm.$data.currency).toBeNull();
  });

  test("level data binds to skill level id", () => {
    const wrapper = mount(SkillCard, { stubs, propsData: { skill } });
    expect(wrapper.vm.$data.level).toEqual(skill.SkillLevelId);
  });

  test("level data equals null with no skill level id", () => {
    const wrapper = mount(SkillCard, {
      stubs,
      propsData: { skill: unsavedSkill }
    });
    expect(wrapper.vm.$data.level).toBeNull();
  });

  test("reset function sets currency back to null if no skill currency id", () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { skill: unsavedSkill }
    });
    expect(wrapper.vm.$data.currency).toBeNull();
    wrapper.setData({ currency: 2 });
    expect(wrapper.vm.$data.currency).toEqual(2);
    (wrapper.vm as any).reset();
    expect(wrapper.vm.$data.currency).toBeNull();
  });

  test("reset function sets currency back to skill currency id", () => {
    const wrapper = mount(SkillCard, { localVue, stubs, propsData: { skill } });
    expect(wrapper.vm.$data.currency).toEqual(skill.SkillCurrencyId);
    wrapper.setData({ currency: 3 });
    expect(wrapper.vm.$data.currency).toEqual(3);
    (wrapper.vm as any).reset();
    expect(wrapper.vm.$data.currency).toEqual(skill.SkillCurrencyId);
  });

  test("reset function sets level back to null if no skill level id", () => {
    const wrapper = mount(SkillCard, {
      localVue,
      stubs,
      propsData: { skill: unsavedSkill }
    });
    expect(wrapper.vm.$data.level).toBeNull();
    wrapper.setData({ level: 4 });
    expect(wrapper.vm.$data.level).toEqual(4);
    (wrapper.vm as any).reset();
    expect(wrapper.vm.$data.level).toBeNull();
  });

  test("reset function sets level back to skill level id", () => {
    const wrapper = mount(SkillCard, { localVue, stubs, propsData: { skill } });
    expect(wrapper.vm.$data.level).toEqual(skill.SkillLevelId);
    wrapper.setData({ level: 3 });
    expect(wrapper.vm.$data.level).toEqual(3);
    (wrapper.vm as any).reset();
    expect(wrapper.vm.$data.level).toEqual(skill.SkillLevelId);
  });

  test("updating skills prop resets the currency and level data values", () => {
    const wrapper = mount(SkillCard, { localVue, stubs, propsData: { skill } });
    wrapper.setData({ currency: 2, level: 4 });
    expect(wrapper.vm.$data.currency).toEqual(2);
    expect(wrapper.vm.$data.level).toEqual(4);
    wrapper.setProps({ skill: unsavedSkill });
    expect(wrapper.vm.$data.currency).toBeNull();
    expect(wrapper.vm.$data.level).toBeNull();
  });

  test('updating currency emits currency-change event', () => {
    const wrapper = mount(SkillCard, { localVue, stubs, propsData: { skill } });
    expect(wrapper.emitted('currency-change')).toBeFalsy();
    (wrapper.vm as any).currencyChanged(3);
    expect(wrapper.emitted('currency-change')).toEqual([[3]]);
  });

  test('updating currency with auto update prop emits edit-skill event', async() => {
    const wrapper = mount(SkillCard, { localVue, stubs, propsData: { autoUpdate: true, skill } });
    expect(wrapper.emitted('edit-skill')).toBeFalsy();
    (wrapper.vm as any).currencyChanged(3);
    await wrapper.vm.$nextTick();
    const updatedSkill: ISkill = wrapper.emitted('edit-skill')[0][0] as any;
    expect(updatedSkill.SkillCurrencyId).toEqual(3);
  });

  test('updating level emits level-change event', () => {
    const wrapper = mount(SkillCard, { localVue, stubs, propsData: { skill } });
    expect(wrapper.emitted('level-change')).toBeFalsy();
    (wrapper.vm as any).levelChanged(3);
    expect(wrapper.emitted('level-change')).toEqual([[3]]);
  });

  test('updating level with auto update prop emits edit-skill event', async() => {
    const wrapper = mount(SkillCard, { localVue, stubs, propsData: { autoUpdate: true, skill } });
    expect(wrapper.emitted('edit-skill')).toBeFalsy();
    (wrapper.vm as any).levelChanged(3);
    await wrapper.vm.$nextTick();
    const updatedSkill: ISkill = wrapper.emitted('edit-skill')[0][0] as any;
    expect(updatedSkill.SkillLevelId).toEqual(3);
  });
});
