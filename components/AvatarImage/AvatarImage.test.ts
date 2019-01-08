import AvatarImage from "./AvatarImage.vue";
import axios from "axios";

import Vue from "vue";
import { shallow } from "@vue/test-utils";

function $get() {
  return new ArrayBuffer(1);
}

declare const expect: jest.Expect;

describe("Avatar Image", () => {
  test("is a Vue instance", () => {
    const wrapper = shallow(AvatarImage);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  test("default snapshot has not changed", async () => {
    const wrapper = shallow(AvatarImage);
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("image snapshot has not changed", async () => {
    const wrapper = shallow(AvatarImage, {
      propsData: { imageName: "test" },
      mocks: { $axios: { $get } }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("default base64 snapshot has not changed", async () => {
    const wrapper = shallow(AvatarImage, {
      propsData: { renderDefaultImageAsBase64: true },
      mocks: { $axios: { $get } }
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("image base64 snapshot has not changed", async () => {
    const wrapper = shallow(AvatarImage, {
      propsData: { renderAsBase64: true, imageName: "test" },
      mocks: { $axios: { $get } }
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  test("passing no image name prop renders the default avatar", async () => {
    const wrapper = shallow(AvatarImage, { mocks: { $axios: { $get } } });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".AvatarImage").attributes().src).toEqual(
      "/765-default-avatar.jpg"
    );
  });

  test("passing image name prop renders the image as base64", async () => {
    const wrapper = shallow(AvatarImage, {
      propsData: { imageName: "test", renderAsBase64: true },
      mocks: { $axios: { $get } }
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".AvatarImage").attributes().src).toEqual(
      "data:image/jpg;base64,AA=="
    );
  });

  test("passing default image name changes the default avatar", async () => {
    const wrapper = shallow(AvatarImage, {
      propsData: { defaultImageName: "test" },
      mocks: { $axios: { $get } }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".AvatarImage").attributes().src).toEqual("/test.jpg");
  });

  test("passing extension changes the extension of the image", async () => {
    const wrapper = shallow(AvatarImage, {
      propsData: { imageName: "test", extension: "png", renderAsBase64: true },
      mocks: { $axios: { $get } }
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".AvatarImage").attributes().src).toEqual(
      "data:image/png;base64,AA=="
    );
  });

  test("passing extension does not change the extension of the default avatar", async () => {
    const wrapper = shallow(AvatarImage, {
      propsData: { extension: "gif" },
      mocks: { $axios: { $get } }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".AvatarImage").attributes().src).toEqual(
      "/765-default-avatar.jpg"
    );
  });

  test("passing default image extension changes the extension of the default avatar", async () => {
    const wrapper = shallow(AvatarImage, {
      propsData: { defaultImageExtension: "gif" },
      mocks: { $axios: { $get } }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".AvatarImage").attributes().src).toEqual(
      "/765-default-avatar.gif"
    );
  });

  test("computed default image uses default image prefix, default image name and default image extension", async () => {
    const wrapper = shallow(AvatarImage, {
      propsData: {
        defaultImagePrefix: "test",
        defaultImageName: "test",
        defaultImageExtension: "gif"
      },
      mocks: { $axios: { $get } }
    });
    await wrapper.vm.$nextTick();
    expect((wrapper.vm as any).defaultImage).toEqual("/test/test.gif");
  });

  test("computed image uses prefix, image name and extension", async () => {
    const wrapper = shallow(AvatarImage, {
      propsData: { imageName: "test", extension: "png", prefix: "avi" },
      mocks: { $axios: { $get } }
    });
    await wrapper.vm.$nextTick();
    expect((wrapper.vm as any).image).toEqual("/avi/test.png");
  });

  test("imageNameChanged fn is fired on mount", () => {
    const spy = jest.fn();
    const wrapper = shallow(AvatarImage, {
      methods: { imageNameChanged: spy },
      mocks: { $axios: { $get } }
    });
    expect(spy).toHaveBeenCalled();
  });

  test("imageNameChanged fn is fired on image name prop change", () => {
    const spy = jest.fn();
    const wrapper = shallow(AvatarImage, {
      methods: { imageNameChanged: spy },
      mocks: { $axios: { $get } }
    });
    expect(spy).toHaveBeenCalledTimes(1);
    wrapper.setProps({ imageName: "test" });
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test("no img tag is rendered immediately when image name prop is passed in with renderAsBase64", async () => {
    const wrapper = shallow(AvatarImage, {
      propsData: { imageName: "test", renderAsBase64: true },
      mocks: { $axios: { $get } }
    });
    expect(wrapper.find(".AvatarImage").exists()).toBeFalsy();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".AvatarImage").exists()).toBeTruthy();
  });

  test("passing in renderDefaultImageAsBase64 renders the default image as base64", async () => {
    const wrapper = shallow(AvatarImage, {
      propsData: { renderDefaultImageAsBase64: true },
      mocks: { $axios: { $get } }
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".AvatarImage").attributes().src).toEqual(
      "data:image/jpg;base64,AA=="
    );
  });

  test("not passing in renderAsBase64 renders the image as specified url", async () => {
    const wrapper = shallow(AvatarImage, {
      propsData: { imageName: "test" },
      mocks: { $axios: { $get } }
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".AvatarImage").attributes().src).toEqual(
      "/avatars/test.jpg"
    );
  });

  test("passing in no default image or image displays nothing", async () => {
    const wrapper = shallow(AvatarImage, {
      propsData: { defaultImageName: "" },
      mocks: { $axios: { $get } }
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".AvatarImage").exists()).toBeFalsy();
  });

  test("image with no prefix renders correctly", async () => {
    const wrapper = shallow(AvatarImage, {
      propsData: { imageName: "test", prefix: "" },
      mocks: { $axios: { $get } }
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".AvatarImage").attributes().src).toEqual("/test.jpg");
  });
});
