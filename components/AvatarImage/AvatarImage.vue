<template lang="pug">
    img(v-if="src"
        :src="src"
        alt="Avatar").AvatarImage
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import objectFitImages from "object-fit-images";
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";

@Component
export default class AvatarImage extends Vue {
  @Prop({ type: String, default: "" })
  private defaultImagePrefix: string;
  @Prop({ type: String, default: "765-default-avatar" })
  private defaultImageName: string;
  @Prop({ type: String, default: "jpg" })
  private defaultImageExtension: string;
  @Prop({ type: Boolean, default: false })
  private renderDefaultImageAsBase64: boolean;

  @Prop({ type: String, default: "avatars" })
  private prefix: string;
  @Prop({ type: String })
  private imageName: string | undefined;
  @Prop({ type: String, default: "jpg" })
  private extension: string;
  @Prop({ type: Boolean, default: false })
  private renderAsBase64: boolean;

  private src = "";

  @Watch("defaultImageName")
  @Watch("imageName", { immediate: true })
  private async imageNameChanged() {
    try {
      if (!this.imageName) {
        throw new Error("No image specified.");
      }
      this.src = this.renderAsBase64
        ? await this.base64(this.image, this.extension)
        : this.image;
    } catch (err) {
      if (!this.defaultImageName) {
        throw new Error("No default image specified.");
      }
      this.src = this.renderDefaultImageAsBase64
        ? await this.base64(
            this.defaultImage,
            this.defaultImageExtension
          ).catch()
        : this.defaultImage;
    } finally {
      objectFitImages();
    }
  }

  private async base64(image: string, extension: string) {
    const options = { baseURL: "", responseType: "arraybuffer" };
    const buffer = await (this as any).$axios.$get(image, options);
    const base64 = btoa(
      new Uint8Array(buffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    const mimetype = `image/${extension}`;
    return `data:${mimetype};base64,${base64}`;
  }

  private get defaultImage() {
    const prefix = this.defaultImagePrefix ? `/${this.defaultImagePrefix}` : "";
    return `${prefix}/${this.defaultImageName}.${this.defaultImageExtension}`;
  }

  private get image() {
    const prefix = this.prefix ? `/${this.prefix}` : "";
    return `${prefix}/${this.imageName}.${this.extension}`;
  }
}
</script>

<style lang="stylus" scoped>
.AvatarImage {
  object-fit: cover;
  object-position: top;
}
</style>
