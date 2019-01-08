import SkillCardStatus from "./SkillCardStatus.vue";
import { mount } from "@vue/test-utils";

import { ECurrency } from "~/enums/currency";
import { ELevel } from "~/enums/level";

declare const expect: jest.Expect;

describe("Skill Card Status", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(SkillCardStatus);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("snapshot has not changed", async () => {
    const wrapper = mount(SkillCardStatus, {
      propsData: { currency: 2, level: 4 }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("currency and level prop are null by default", () => {
    const wrapper = mount(SkillCardStatus);
    expect(wrapper.vm.$props.currency).toEqual(null);
    expect(wrapper.vm.$props.level).toEqual(null);
  });

  test("currency and level prop can be set to null", () => {
    const wrapper = mount(SkillCardStatus, {
      propsData: { currency: null, level: null }
    });
    expect(wrapper.vm.$props.currency).toEqual(null);
    expect(wrapper.vm.$props.level).toEqual(null);
  });

  test("setting currency and level prop overrides default", () => {
    const wrapper = mount(SkillCardStatus, {
      propsData: { currency: 2, level: 4 }
    });
    expect(wrapper.vm.$props.currency).toEqual(2);
    expect(wrapper.vm.$props.level).toEqual(4);
  });

  test("the component by default is blank", () => {
    const wrapper = mount(SkillCardStatus);
    expect(wrapper.find(".SkillCardLevelStatus").exists()).toBeFalsy();
    expect(wrapper.find(".SkillCardCurrencyStatus").exists()).toBeFalsy();
  });

  test("setting level prop displays the level paragraph", () => {
    const wrapper = mount(SkillCardStatus, { propsData: { level: 2 } });
    const level = wrapper.find(".SkillCardLevelStatus");
    expect(level.exists()).toBeTruthy();
    expect(level.text()).toEqual(ELevel[2]);
  });

  test("level paragraph updates with prop change", () => {
    const wrapper = mount(SkillCardStatus, { propsData: { level: 2 } });
    const level = wrapper.find(".SkillCardLevelStatus");
    wrapper.setProps({ level: 3 });
    expect(level.text()).toEqual(ELevel[3]);
  });

  test("setting currency prop displays currency paragraph", () => {
    const wrapper = mount(SkillCardStatus, { propsData: { currency: 4 } });
    const currency = wrapper.find(".SkillCardCurrencyStatus");
    expect(currency.exists()).toBeTruthy();
    expect(currency.text()).toEqual(ECurrency[4]);
  });

  test("currency paragraph updates with prop change", () => {
    const wrapper = mount(SkillCardStatus, { propsData: { currency: 4 } });
    const currency = wrapper.find(".SkillCardCurrencyStatus");
    wrapper.setProps({ currency: 3 });
    expect(currency.text()).toEqual(ECurrency[3]);
  });

  test("currency color getter returns primary with currency set to 2", () => {
    const wrapper = mount(SkillCardStatus, { propsData: { currency: 2 } });
    expect((wrapper.vm as any).currencyColor).toEqual("primary");
  });

  test("currency color getter returns warning with currency set to 3", () => {
    const wrapper = mount(SkillCardStatus, { propsData: { currency: 3 } });
    expect((wrapper.vm as any).currencyColor).toEqual("warning");
  });

  test("currency color getter returns error with currency set to 4", () => {
    const wrapper = mount(SkillCardStatus, { propsData: { currency: 4 } });
    expect((wrapper.vm as any).currencyColor).toEqual("error");
  });

  test("currency color getter updates with prop change", () => {
    const wrapper = mount(SkillCardStatus, { propsData: { currency: 4 } });
    wrapper.setProps({ currency: 2 });
    expect((wrapper.vm as any).currencyColor).toEqual("primary");
  });

  test("currency color getter returns undefined with null currency", () => {
    const wrapper = mount(SkillCardStatus);
    expect((wrapper.vm as any).currencyColor).toBeUndefined();
  });

  test("level color getter returns error with level set to 2", () => {
    const wrapper = mount(SkillCardStatus, { propsData: { level: 2 } });
    expect((wrapper.vm as any).levelColor).toEqual("error");
  });

  test("level color getter returns warning with level set to 3", () => {
    const wrapper = mount(SkillCardStatus, { propsData: { level: 3 } });
    expect((wrapper.vm as any).levelColor).toEqual("warning");
  });

  test("level color getter returns success with level set to 4", () => {
    const wrapper = mount(SkillCardStatus, { propsData: { level: 4 } });
    expect((wrapper.vm as any).levelColor).toEqual("success");
  });

  test("level color getter updates with prop change", () => {
    const wrapper = mount(SkillCardStatus, { propsData: { level: 4 } });
    wrapper.setProps({ level: 2 });
    expect((wrapper.vm as any).levelColor).toEqual("error");
  });

  test("level color getter returns undefined with null level", () => {
    const wrapper = mount(SkillCardStatus);
    expect((wrapper.vm as any).levelColor).toBeUndefined();
  });
});
