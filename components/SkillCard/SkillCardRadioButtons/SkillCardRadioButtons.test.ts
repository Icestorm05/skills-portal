import SkillCardRadioButtons from "./SkillCardRadioButtons.vue";
import VeeValidate from "vee-validate";
import { createLocalVue, mount } from "@vue/test-utils";

declare const expect: jest.Expect;

const validator = new VeeValidate.Validator({}, {});

const localVue = createLocalVue();
localVue.use(VeeValidate);

describe("Skill Card Radio Buttons", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(SkillCardRadioButtons, {
      localVue,
      provide: { validator }
    });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("snapshot has not changed", async () => {
    const wrapper = mount(SkillCardRadioButtons, {
      localVue,
      propsData: { currency: 2, level: 4 },
      provide: { validator }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("currency and level prop are null by default", () => {
    const wrapper = mount(SkillCardRadioButtons, {
      localVue,
      provide: { validator }
    });
    expect(wrapper.vm.$props.currency).toEqual(null);
    expect(wrapper.vm.$props.level).toEqual(null);
  });

  test("currency and level prop can be set to null", () => {
    const wrapper = mount(SkillCardRadioButtons, {
      localVue,
      propsData: { currency: null, level: null },
      provide: { validator }
    });
    expect(wrapper.vm.$props.currency).toEqual(null);
    expect(wrapper.vm.$props.level).toEqual(null);
  });

  test("setting currency and level prop overrides default", () => {
    const wrapper = mount(SkillCardRadioButtons, {
      localVue,
      propsData: { currency: 2, level: 4 },
      provide: { validator }
    });
    expect(wrapper.vm.$props.currency).toEqual(2);
    expect(wrapper.vm.$props.level).toEqual(4);
  });

  test("radio buttons are unselected by default", async () => {
    const wrapper = mount(SkillCardRadioButtons, {
      localVue,
      provide: { validator }
    });
    await wrapper.vm.$nextTick();
    expect(
      wrapper.findAll(".SkillCardRadioButton.input-group--active").exists()
    ).toBeFalsy();
  });

  test("currency radio button is selected by default with currency prop", async () => {
    const wrapper = mount(SkillCardRadioButtons, {
      localVue,
      propsData: { currency: 2 },
      provide: { validator }
    });
    await wrapper.vm.$nextTick();
    const selectedRadioButtons = wrapper.findAll(
      ".SkillCardRadioButton.input-group--active"
    );
    const selectedCurrency = wrapper.find(
      ".SkillCardRadioButton.input-group--active input"
    ).element as HTMLInputElement;
    expect(selectedRadioButtons.exists()).toBeTruthy();
    expect(selectedRadioButtons.length).toEqual(1);
    expect(selectedCurrency.value).toEqual("2");
  });

  test("level radio button is selected by default with level prop", async () => {
    const wrapper = mount(SkillCardRadioButtons, {
      localVue,
      propsData: { level: 4 },
      provide: { validator }
    });
    await wrapper.vm.$nextTick();
    const selectedRadioButtons = wrapper.findAll(
      ".SkillCardRadioButton.input-group--active"
    );
    const selectedLevel = wrapper.find(
      ".SkillCardRadioButton.input-group--active input"
    ).element as HTMLInputElement;
    expect(selectedRadioButtons.exists()).toBeTruthy();
    expect(selectedRadioButtons.length).toEqual(1);
    expect(selectedLevel.value).toEqual("4");
  });

  test("changing currency prop changes the radio button selected", async () => {
    const wrapper = mount(SkillCardRadioButtons, {
      localVue,
      propsData: { currency: 2 },
      provide: { validator }
    });
    wrapper.setProps({ currency: 3 });
    await wrapper.vm.$nextTick();
    const selectedLevel = wrapper.find(
      ".SkillCardRadioButton.input-group--active input"
    ).element as HTMLInputElement;
    expect(selectedLevel.value).toEqual("3");
  });

  test("changing level prop changes the radio button selected", async () => {
    const wrapper = mount(SkillCardRadioButtons, {
      localVue,
      propsData: { level: 4 },
      provide: { validator }
    });
    wrapper.setProps({ level: 3 });
    await wrapper.vm.$nextTick();
    const selectedLevel = wrapper.find(
      ".SkillCardRadioButton.input-group--active input"
    ).element as HTMLInputElement;
    expect(selectedLevel.value).toEqual("3");
  });
});
