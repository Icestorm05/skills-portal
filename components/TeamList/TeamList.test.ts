import TeamList from "./TeamList.vue";
import { mount } from "@vue/test-utils";

import { IProfile } from "types/profile";
import { ITeamSkill } from "types/teamSkill";

declare const expect: jest.Expect;

const defaultProfile: IProfile = {
  Biography: "",
  Company: "",
  Director: "",
  EmailAddress: "",
  EmployeeId: 0,
  FirstLineReporting: "",
  FullName: "",
  JobTitle: "",
  KnownAs: "",
  MainStaffNumber: "",
  SecondLineReporting: "",
  Surname: "",
  children: []
};

const profile: IProfile = {
  ...defaultProfile,
  EmployeeId: 1,
  FullName: "John Doe"
};

const profile2: IProfile = {
  ...defaultProfile,
  EmployeeId: 2,
  FullName: "Jane Doe"
};

const profile3: IProfile = {
  ...defaultProfile,
  EmployeeId: 3,
  FullName: "Jake Doe",
  children: [
    {
      ...defaultProfile,
      EmployeeId: 4,
      FullName: "Janet Doe"
    }
  ]
};

const team: IProfile[] = [profile, profile2, profile3];

const teamSkills1 = {
  diff: 0,
  EmployeeId: 1,
  skills: []
};
const teamSkills2 = {
  diff: 5,
  EmployeeId: 2,
  skills: []
};
const teamSkills3 = {
  diff: 1,
  EmployeeId: 3,
  skills: []
};

const teamSkills: ITeamSkill[] = [teamSkills1, teamSkills2, teamSkills3];

const stubs = {
  "nuxt-link": "<a></a>"
};

const mocks = {
  $vuetify: {
    breakpoint: "sm"
  }
};

describe("Team List", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(TeamList, {
      mocks,
      stubs,
      propsData: { team, teamSkills }
    });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("snapshot has not changed", () => {
    const wrapper = mount(TeamList, {
      mocks,
      stubs,
      propsData: { team, teamSkills }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("team list does not display with blank team array", () => {
    const wrapper = mount(TeamList, {
      mocks,
      stubs,
      propsData: { team: [], teamSkills }
    });
    expect(wrapper.find("#TeamList").exists()).toBeFalsy();
  });

  test("renders all team list member components", () => {
    const wrapper = mount(TeamList, {
      mocks,
      stubs,
      propsData: { team, teamSkills }
    });
    expect(wrapper.findAll(".TeamMember").length).toEqual(3);
  });

  test("skills fn returns correct skills object", () => {
    const wrapper = mount(TeamList, {
      mocks,
      stubs,
      propsData: { team, teamSkills }
    });
    expect((wrapper.vm as any).skills(1).diff).toEqual(teamSkills1.diff);
    expect((wrapper.vm as any).skills(2).diff).toEqual(teamSkills2.diff);
    expect((wrapper.vm as any).skills(3).diff).toEqual(teamSkills3.diff);
    expect((wrapper.vm as any).skills(4)).toBeUndefined();
  });

  test("displays team member names within list", () => {
    const wrapper = mount(TeamList, {
      mocks,
      stubs,
      propsData: { lazy: false, team, teamSkills }
    });
    const names = wrapper.findAll(".TeamMember .TeamMemberFullName");
    expect(names.length).toEqual(3);
    expect(names.at(0).text()).toEqual(profile.FullName);
    expect(names.at(1).text()).toEqual(profile2.FullName);
    expect(names.at(2).text()).toEqual(profile3.FullName);
  });

  test("displays team member job titles within list", () => {
    const wrapper = mount(TeamList, {
      mocks,
      stubs,
      propsData: { lazy: false, team, teamSkills }
    });
    const jobs = wrapper.findAll(".TeamMember .TeamMemberJobTitle");
    expect(jobs.length).toEqual(3);
    expect(jobs.at(0).text()).toEqual(profile.JobTitle);
    expect(jobs.at(1).text()).toEqual(profile2.JobTitle);
    expect(jobs.at(2).text()).toEqual(profile3.JobTitle);
  });

  test("displays team member avatars within list", () => {
    const wrapper = mount(TeamList, {
      mocks,
      stubs,
      propsData: { lazy: false, team, teamSkills }
    });
    const avatars = wrapper.findAll(".TeamMember .TeamMemberAvatar img");
    expect(avatars.length).toEqual(3);
    expect(avatars.at(0).attributes().src).toEqual("/765-default-avatar.jpg");
    expect(avatars.at(1).attributes().src).toEqual("/765-default-avatar.jpg");
    expect(avatars.at(2).attributes().src).toEqual("/765-default-avatar.jpg");
  });

  test("displays correct icon if team member has unreviwed skills or not", () => {
    const wrapper = mount(TeamList, {
      mocks,
      stubs,
      propsData: { lazy: false, team, teamSkills }
    });
    const icons = wrapper.findAll(
      ".TeamMember .list__group__header__prepend-icon .material-icons"
    );
    expect(icons.length).toEqual(3);
    expect(icons.at(0).text()).toEqual("verified_user");
    expect(icons.at(1).text()).toEqual("warning");
    expect(icons.at(2).text()).toEqual("warning");
  });

  test("does not display sublist by default", () => {
    const wrapper = mount(TeamList, {
      mocks,
      stubs,
      propsData: { lazy: false, team, teamSkills }
    });
    expect(wrapper.find(".TeamMemberUnreviewedSkills").isVisible()).toBeFalsy();
  });

  test("displays correct list of pages in sublist", () => {
    const wrapper = mount(TeamList, {
      mocks,
      stubs,
      propsData: { lazy: false, team, teamSkills }
    });
    const teamMembers = wrapper.findAll(".TeamMember");
    expect(
      teamMembers
        .at(0)
        .find(".TeamMemberUnreviewedSkills")
        .exists()
    ).toBeTruthy();
    expect(
      teamMembers
        .at(0)
        .find(".TeamMemberReviewedSkills")
        .exists()
    ).toBeTruthy();
    expect(
      teamMembers
        .at(0)
        .find(".TeamMemberProfile")
        .exists()
    ).toBeTruthy();
  });

  test("does not display team page link if profile has no children", () => {
    const wrapper = mount(TeamList, {
      mocks,
      stubs,
      propsData: { lazy: false, team, teamSkills }
    });
    const teamMembers = wrapper.findAll(".TeamMember");
    expect(
      teamMembers
        .at(0)
        .find(".TeamMemberTeam")
        .exists()
    ).toBeFalsy();
  });

  test("displays team page link if profile has children", () => {
    const wrapper = mount(TeamList, {
      mocks,
      stubs,
      propsData: { lazy: false, team, teamSkills }
    });
    const teamMembers = wrapper.findAll(".TeamMember");
    expect(
      teamMembers
        .at(2)
        .find(".TeamMemberTeam")
        .exists()
    ).toBeTruthy();
  });

  test("displays correct number of skill differences as a badge on the unreviewed skills page link", () => {
    const wrapper = mount(TeamList, {
      mocks,
      stubs,
      propsData: { lazy: false, team, teamSkills }
    });
    const teamMembers = wrapper.findAll(".TeamMember");
    expect(
      teamMembers
        .at(1)
        .find(".TeamMemberUnreviewedSkillBadge .badge__badge")
        .text()
    ).toEqual(teamSkills[1].diff.toString());
    expect(
      teamMembers
        .at(2)
        .find(".TeamMemberUnreviewedSkillBadge .badge__badge")
        .text()
    ).toEqual(teamSkills[2].diff.toString());
  });

  test("does not display icon as a badge if no skill differences on the unreviewed skills page link", () => {
    const wrapper = mount(TeamList, {
      mocks,
      stubs,
      propsData: { lazy: false, team, teamSkills }
    });
    const teamMembers = wrapper.findAll(".TeamMember");
    expect(
      teamMembers
        .at(0)
        .find(".TeamMemberUnreviewedSkillBadge .badge__badge")
        .exists()
    ).toBeFalsy();
  });

  test("defaults to displaying no badge when no matching team skills", () => {
    const wrapper = mount(TeamList, {
      mocks,
      stubs,
      propsData: { lazy: false, team, teamSkills: [] }
    });
    const teamMembers = wrapper.findAll(".TeamMember");
    expect(
      teamMembers
        .at(0)
        .find(".TeamMemberUnreviewedSkillBadge .badge__badge")
        .exists()
    ).toBeFalsy();
    expect(
      teamMembers
        .at(1)
        .find(".TeamMemberUnreviewedSkillBadge .badge__badge")
        .exists()
    ).toBeFalsy();
    expect(
      teamMembers
        .at(2)
        .find(".TeamMemberUnreviewedSkillBadge .badge__badge")
        .exists()
    ).toBeFalsy();
  });

  test("defaults to displaying verified user when no matching team skills", () => {
    const wrapper = mount(TeamList, {
      mocks,
      stubs,
      propsData: { lazy: false, team, teamSkills: [] }
    });
    const icons = wrapper.findAll(
      ".TeamMember .list__group__header__prepend-icon .material-icons"
    );
    expect(icons.length).toEqual(3);
    expect(icons.at(0).text()).toEqual("verified_user");
    expect(icons.at(1).text()).toEqual("verified_user");
    expect(icons.at(2).text()).toEqual("verified_user");
  });

  test("displays blank page with no team", () => {
    const wrapper = mount(TeamList, {
      mocks,
      stubs,
      propsData: { lazy: false, team: [], teamSkills: [] }
    });
    expect(wrapper.find("#TeamList").exists()).toBeFalsy();
  });
});
