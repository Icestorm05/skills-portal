import UserProfile from "./UserProfile.vue";
import flushPromises from "flush-promises";
import VeeValidate from "vee-validate";
import Vue from "vue";
import { createLocalVue, mount } from "@vue/test-utils";

import { IProfile } from "types/profile";

declare const expect: jest.Expect;

const profile: IProfile = {
  Biography: "Test Biography",
  Company: "Test Company",
  Director: "John Doe",
  EmailAddress: "test@test.com",
  EmployeeId: 1,
  FirstLineReporting: "Jane Doe",
  FullName: "Jake Doe",
  JobTitle: "Innovation Developer",
  KnownAs: "Jake",
  MainStaffNumber: "123",
  SecondLineReporting: "Julie Doe",
  Surname: "Doe",
  children: []
};
const profileWithBlankBio = { ...profile, Biography: "" };
const profileWithLongBio = {
  ...profile,
  Biography: `Very long bio. Very long bio. Very long bio.
Very long bio. Very long bio. Very long bio. Very long bio. Very long bio. Very long bio.
Very long bio. Very long bio. Very long bio. Very long bio. Very long bio. Very long bio.
Very long bio. Very long bio. Very long bio. Very long bio. Very long bio. Very long bio.`
};

const localVue = createLocalVue();
localVue.use(VeeValidate);

describe("User Profile", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(UserProfile, { localVue, propsData: { profile } });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("snapshot has not changed", () => {
    const wrapper = mount(UserProfile, {
      localVue,
      propsData: { editable: true, profile }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("readonly snapshot has not changed", () => {
    const wrapper = mount(UserProfile, {
      localVue,
      propsData: { editable: false, profile }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("textarea is displayed when editable is set to true", () => {
    const wrapper = mount(UserProfile, {
      localVue,
      propsData: { editable: true, profile }
    });
    expect(wrapper.find("textarea").exists()).toBeTruthy();
  });

  test("textarea is not displayed when editable is set to false", () => {
    const wrapper = mount(UserProfile, {
      localVue,
      propsData: { editable: false, profile }
    });
    expect(wrapper.find("textarea").exists()).toBeFalsy();
  });

  test("save button is displayed when editable is set to true", () => {
    const wrapper = mount(UserProfile, {
      localVue,
      propsData: { editable: true, profile }
    });
    expect(wrapper.find("#UserProfileSaveButton").text()).toEqual("Save");
  });

  test("save button is not displayed when editable is set to false", () => {
    const wrapper = mount(UserProfile, {
      localVue,
      propsData: { editable: false, profile }
    });
    expect(wrapper.find("#UserProfileSaveButton").exists()).toBeFalsy();
  });

  test("left side of profile card displays avatar", async () => {
    const wrapper = mount(UserProfile, { localVue, propsData: { profile } });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const elem = wrapper.find("#UserProfileLeft #UserProfileAvatar > img");
    expect(elem.exists()).toBeTruthy();
    expect(elem.attributes().src).toEqual("/765-default-avatar.jpg");
  });

  test("left side of profile card displays full name", () => {
    const wrapper = mount(UserProfile, { localVue, propsData: { profile } });
    const elem = wrapper.find("#UserProfileLeft #UserProfileFullName");
    expect(elem.text()).toEqual(profile.FullName);
  });

  test("left side of profile card displays job title", () => {
    const wrapper = mount(UserProfile, { localVue, propsData: { profile } });
    const elem = wrapper.find("#UserProfileLeft #UserProfileJobTitle");
    expect(elem.text()).toEqual(profile.JobTitle);
  });

  test("left side of profile card displays company", () => {
    const wrapper = mount(UserProfile, { localVue, propsData: { profile } });
    const elem = wrapper.find("#UserProfileLeft #UserProfileCompany");
    expect(elem.text()).toEqual(profile.Company);
  });

  test("right side of profile card displays biography in readonly mode", () => {
    const wrapper = mount(UserProfile, {
      localVue,
      propsData: { editable: false, profile }
    });
    const elem = wrapper.find("#UserProfileRight #UserProfileBiography");
    expect(elem.text()).toEqual(profile.Biography);
  });

  test("right side of profile card displays biography in editable mode", () => {
    const wrapper = mount(UserProfile, {
      localVue,
      propsData: { editable: true, profile }
    });
    const elem = wrapper.find("#UserProfileRight #UserProfileBiography")
      .element as HTMLTextAreaElement;
    expect(elem.value).toEqual(profile.Biography);
  });

  test("right side of profile card displays email address", () => {
    const wrapper = mount(UserProfile, { localVue, propsData: { profile } });
    const elem = wrapper.find("#UserProfileRight #UserProfileEmailAddress");
    expect(elem.text()).toEqual(profile.EmailAddress);
  });

  test("right side of profile card displays director", () => {
    const wrapper = mount(UserProfile, { localVue, propsData: { profile } });
    const elem = wrapper.find("#UserProfileRight #UserProfileDirector");
    expect(elem.text()).toEqual(profile.Director);
  });

  test("right side of profile card displays first line reporting", () => {
    const wrapper = mount(UserProfile, { localVue, propsData: { profile } });
    const elem = wrapper.find(
      "#UserProfileRight #UserProfileFirstLineReporting"
    );
    expect(elem.text()).toEqual(profile.FirstLineReporting);
  });

  test("right side of profile card displays second line reporting", () => {
    const wrapper = mount(UserProfile, { localVue, propsData: { profile } });
    const elem = wrapper.find(
      "#UserProfileRight #UserProfileSecondLineReporting"
    );
    expect(elem.text()).toEqual(profile.SecondLineReporting);
  });

  test("biography counter increments and decrements", () => {
    const wrapper = mount(UserProfile, {
      localVue,
      propsData: { editable: true, profile: profileWithBlankBio }
    });
    const counter = wrapper.find("#UserProfileRight .input-group__counter");
    expect(counter.text()).toEqual("0 / 100");

    wrapper.setProps({ profile });
    expect(counter.text()).toEqual(`${profile.Biography.length} / 100`);

    wrapper.setProps({ profile: profileWithBlankBio });
    expect(counter.text()).toEqual("0 / 100");
  });

  test("clicking the save button fires the save function", () => {
    const wrapper = mount(UserProfile, {
      localVue,
      propsData: { editable: true, profile }
    });

    const spy = jest.fn();
    wrapper.setData({ save: spy });

    wrapper.find("#UserProfileForm").trigger("submit");
    expect(spy).toHaveBeenCalled();
  });

  test("clicking the save button emits the updated biography event", async () => {
    const wrapper = mount(UserProfile, {
      localVue,
      propsData: { editable: true, profile }
    });

    expect(wrapper.emitted("updated-biography")).toBeFalsy();
    wrapper.find("#UserProfileForm").trigger("submit");
    await flushPromises();

    expect(wrapper.emitted("updated-biography")).toBeTruthy();
    expect(wrapper.emitted("updated-biography")[0]).toEqual([
      profile.Biography
    ]);
  });

  test("biography required error appears when attempting to save with a blank bio", async () => {
    const wrapper = mount(UserProfile, {
      localVue,
      propsData: { editable: true, profile: profileWithBlankBio }
    });

    let error = wrapper.find(".input-group__error");
    expect(error.exists()).toBeFalsy();
    expect(wrapper.vm.$validator.errors.count()).toEqual(0);

    wrapper.find("#UserProfileForm").trigger("submit");
    await Vue.nextTick();

    error = wrapper.find(".input-group__error");
    expect(error.text()).toEqual("The biography field is required.");
    expect(wrapper.vm.$validator.errors.count()).toEqual(1);
  });

  test("biography counter error appears with a bio greater than 100 characters long", async () => {
    const wrapper = mount(UserProfile, {
      localVue,
      propsData: { editable: true, profile: profileWithLongBio }
    });

    let error = wrapper.find(".input-group__error");
    expect(error.exists()).toBeFalsy();
    expect(wrapper.vm.$validator.errors.count()).toEqual(0);

    wrapper.find("#UserProfileForm").trigger("submit");
    await Vue.nextTick();

    error = wrapper.find(".input-group__error");
    expect(error.text()).toEqual(
      "The biography field may not be greater than 100 characters."
    );
    expect(wrapper.vm.$validator.errors.count()).toEqual(1);
  });

  test("updating the profile prop updates the biography data", () => {
    const wrapper = mount(UserProfile, {
      localVue,
      propsData: { editable: true, profile }
    });
    expect(wrapper.vm.$data.biography).toEqual(profile.Biography);
    wrapper.setProps({ profile: profileWithBlankBio });
    expect(wrapper.vm.$data.biography).toEqual(profileWithBlankBio.Biography);
  });
});
