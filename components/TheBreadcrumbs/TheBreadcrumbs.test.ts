import TheBreadcrumbs from "./TheBreadcrumbs.vue";
import { mount } from "@vue/test-utils";

import { IProfile } from "types/profile";

declare const expect: jest.Expect;

const profile: IProfile = {
  Biography: "",
  Company: "",
  Director: "",
  EmailAddress: "",
  EmployeeId: 1,
  FirstLineReporting: "",
  FullName: "John Doe",
  JobTitle: "",
  KnownAs: "",
  MainStaffNumber: "",
  SecondLineReporting: "",
  Surname: "",
  children: []
};

const profile2: IProfile = {
  ...profile,
  EmployeeId: 2,
  FullName: "Jane Doe"
};

const profile3: IProfile = {
  ...profile,
  EmployeeId: 3,
  FullName: "Jake Doe"
};

const profileWithTwoLevels: IProfile = {
  ...profile,
  children: [profile2]
};

const profileWithThreeLevels: IProfile = {
  ...profile,
  children: [
    {
      ...profile2,
      children: [profile3]
    }
  ]
};

const profileWithManyChildren: IProfile = {
  ...profile,
  children: [profile2, profile3]
};

const stubs = {
  "nuxt-link": "<a></a>"
};

describe("The Breadcrumbs", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(TheBreadcrumbs, {
      stubs,
      propsData: { employeeId: 0, profile, routeName: "id-team" }
    });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("snapshot has not changed", () => {
    const wrapper = mount(TheBreadcrumbs, {
      stubs,
      propsData: {
        employeeId: 3,
        profile: profileWithThreeLevels,
        routeName: "id-team"
      }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("displays profile full name as first breadcrumb", () => {
    const wrapper = mount(TheBreadcrumbs, {
      stubs,
      propsData: { employeeId: 0, profile, routeName: "id-team" }
    });
    expect(
      wrapper.find("#TheBreadcrumbs .BreadcrumbItem .breadcrumbs__item").text()
    ).toEqual(profile.FullName);
  });

  test("does not display second breadcrumb with invalid employee id to find in hierarchy", () => {
    const wrapper = mount(TheBreadcrumbs, {
      stubs,
      propsData: {
        employeeId: 0,
        profile: profileWithTwoLevels,
        routeName: "id-team"
      }
    });
    const breadcrumbs = wrapper.findAll(
      "#TheBreadcrumbs .BreadcrumbItem .breadcrumbs__item"
    );
    expect(breadcrumbs.length).toEqual(1);
    expect(breadcrumbs.at(0).text()).toEqual(profile.FullName);
  });

  test("displays second breadcrumb with valid employee id to find in hierarchy", () => {
    const wrapper = mount(TheBreadcrumbs, {
      stubs,
      propsData: {
        employeeId: 2,
        profile: profileWithTwoLevels,
        routeName: "id-team"
      }
    });
    const breadcrumbs = wrapper.findAll(
      "#TheBreadcrumbs .BreadcrumbItem .breadcrumbs__item"
    );
    expect(breadcrumbs.length).toEqual(2);
    expect(breadcrumbs.at(0).text()).toEqual(profile.FullName);
    expect(breadcrumbs.at(1).text()).toEqual(profile2.FullName);
  });

  test("displays second breadcrumb with valid employee id to find in many child hierarchy", () => {
    const wrapper = mount(TheBreadcrumbs, {
      stubs,
      propsData: {
        employeeId: 3,
        profile: profileWithManyChildren,
        routeName: "id-team"
      }
    });
    const breadcrumbs = wrapper.findAll(
      "#TheBreadcrumbs .BreadcrumbItem .breadcrumbs__item"
    );
    expect(breadcrumbs.length).toEqual(2);
    expect(breadcrumbs.at(0).text()).toEqual(profile.FullName);
    expect(breadcrumbs.at(1).text()).toEqual(profile3.FullName);
  });

  test("displays third breadcrumb with valid employee id to find in hierarchy", () => {
    const wrapper = mount(TheBreadcrumbs, {
      stubs,
      propsData: {
        employeeId: 3,
        profile: profileWithThreeLevels,
        routeName: "id-team"
      }
    });
    const breadcrumbs = wrapper.findAll(
      "#TheBreadcrumbs .BreadcrumbItem .breadcrumbs__item"
    );
    expect(breadcrumbs.length).toEqual(3);
    expect(breadcrumbs.at(0).text()).toEqual(profile.FullName);
    expect(breadcrumbs.at(1).text()).toEqual(profile2.FullName);
    expect(breadcrumbs.at(2).text()).toEqual(profile3.FullName);
  });
});
