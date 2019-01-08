import FaqList from "./FaqList.vue";

import { IFaq, IFaqAnswer } from "types/faq";

import { createRenderer } from "vue-server-renderer";
import { mount } from "@vue/test-utils";

const pQuestion = {
  question: "Test Question 1",
  answers: [
    { type: "p", text: "Test Paragraph 1" },
    { type: "p", text: "Test Paragraph 2" }
  ] as IFaqAnswer[]
};

const bQuestion = {
  question: "Test Question 2",
  answers: [
    { type: "b", text: "Test Bold Answer 1" },
    { type: "b", text: "Test Bold Answer 2" }
  ] as IFaqAnswer[]
};

const ulQuestion = {
  question: "Test Question 3",
  answers: [
    { type: "ul", text: ["Test Bullet Answer 1", "Test Bullet Answer 2"] }
  ] as IFaqAnswer[]
};

const tableQuestion = {
  question: "Test Question 4",
  answers: [
    {
      type: "table",
      text: [["row1-col1", "row1-col2"], ["row2-col1", "row2-col2"]]
    }
  ] as IFaqAnswer[]
};

const faqs: IFaq[] = [pQuestion, bQuestion, ulQuestion, tableQuestion];

declare const expect: jest.Expect;

describe("FAQ List", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(FaqList, { propsData: { faqs } });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("snapshot has not changed", () => {
    const wrapper = mount(FaqList, { propsData: { faqs, lazy: false } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("lazy snapshot has not changed", () => {
    const wrapper = mount(FaqList, { propsData: { faqs, lazy: true } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("renders all questions as expansion headers", () => {
    const wrapper = mount(FaqList, { propsData: { faqs } });
    expect(
      wrapper
        .findAll(".FaqPanelHeader")
        .at(0)
        .text()
    ).toContain("Test Question 1");
    expect(
      wrapper
        .findAll(".FaqPanelHeader")
        .at(1)
        .text()
    ).toContain("Test Question 2");
    expect(
      wrapper
        .findAll(".FaqPanelHeader")
        .at(2)
        .text()
    ).toContain("Test Question 3");
    expect(
      wrapper
        .findAll(".FaqPanelHeader")
        .at(3)
        .text()
    ).toContain("Test Question 4");
  });

  test("renders nothing if blank array provided", () => {
    const wrapper = mount(FaqList, { propsData: { faqs: [] } });
    expect(wrapper.find("#FaqList").exists()).toBeFalsy();
  });

  test("does not render answers with lazy prop", () => {
    const wrapper = mount(FaqList, { propsData: { faqs, lazy: true } });
    expect(wrapper.find(".FaqPanelCardContent").exists()).toBeFalsy();
  });

  test("does render answers with no lazy prop", () => {
    const wrapper = mount(FaqList, { propsData: { faqs, lazy: false } });
    expect(wrapper.find(".FaqPanelCardContent").exists()).toBeTruthy();
  });

  test("renders p answers as paragraph tags", () => {
    const wrapper = mount(FaqList, {
      propsData: { faqs: [pQuestion], lazy: false }
    });
    const card = wrapper.find(".FaqPanelCard");
    expect(card.findAll("p").length).toEqual(2);
    expect(card.html()).toContain("Test Paragraph 1");
    expect(card.html()).toContain("Test Paragraph 2");
  });

  test("renders b answers as bold tags", () => {
    const wrapper = mount(FaqList, {
      propsData: { faqs: [bQuestion], lazy: false }
    });
    const card = wrapper.find(".FaqPanelCard");
    expect(card.findAll("b").length).toEqual(2);
    expect(card.html()).toContain("Test Bold Answer 1");
    expect(card.html()).toContain("Test Bold Answer 2");
  });

  test("renders ul answers as bold tags", () => {
    const wrapper = mount(FaqList, {
      propsData: { faqs: [ulQuestion], lazy: false }
    });
    const card = wrapper.find(".FaqPanelCard");
    expect(card.findAll("ul").length).toEqual(1);
    expect(card.findAll("li").length).toEqual(2);
    expect(card.html()).toContain("Test Bullet Answer 1");
    expect(card.html()).toContain("Test Bullet Answer 2");
  });

  test("renders table answers as table tags", () => {
    const wrapper = mount(FaqList, {
      propsData: { faqs: [tableQuestion], lazy: false }
    });
    const card = wrapper.find(".FaqPanelCard");
    expect(card.findAll("table").length).toEqual(1);
    expect(card.findAll("tr").length).toEqual(2);
    expect(card.findAll("td").length).toEqual(4);
    expect(
      card
        .findAll("tr")
        .at(0)
        .findAll("td")
        .at(0)
        .text()
    ).toEqual("row1-col1");
    expect(
      card
        .findAll("tr")
        .at(0)
        .findAll("td")
        .at(1)
        .text()
    ).toEqual("row1-col2");
    expect(
      card
        .findAll("tr")
        .at(1)
        .findAll("td")
        .at(0)
        .text()
    ).toEqual("row2-col1");
    expect(
      card
        .findAll("tr")
        .at(1)
        .findAll("td")
        .at(1)
        .text()
    ).toEqual("row2-col2");
  });
});
