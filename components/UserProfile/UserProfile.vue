<template lang="pug">
    v-card(raised)#UserProfile.elevation-12
            v-layout(row
                     wrap)
                v-flex(sm4 md3).primary#UserProfileLeft
                    v-card-title(primary-title).fill-height
                        v-layout(column
                                 align-center
                                 justify-center
                                 fill-width).text-xs-center
                            v-avatar(size="150")#UserProfileAvatar
                                avatar-image(:image-name="profile.MainStaffNumber"
                                             :renderAsBase64="true")
                            h3.headline.white--text.text-xs-center#UserProfileFullName {{ profile.FullName }}
                            i.subheading.warning--text#UserProfileJobTitle.fill-width {{ profile.JobTitle }}
                            span.white--text#UserProfileCompany.fill-width {{ profile.Company }}
                v-flex(sm8 md9)#UserProfileRight
                    v-card-text.fill-height
                        v-form(@submit.prevent="save").fill-height.layout.column#UserProfileForm
                            v-flex.white-space
                                v-text-field(v-if="editable"
                                            label="Biography"
                                            clearable
                                            color="primary"
                                            counter="100"
                                            placeholder="Enter your Biography here"
                                            multi-line
                                            name="biography"
                                            v-model="biography"
                                            data-vv-name="biography"
                                            v-validate="'required|max:100'"
                                            :error-messages="errors.collect('biography')"
                                            :disabled="disabled")#UserProfileBiography
                                template(v-else)
                                    b.pa-0.primary--text Biography
                                    p.light.mb-0#UserProfileBiography {{ biography }}
                            v-divider.no-flex.my-3
                            p.light.mb-1
                                b.primary--text.mr-1 Email Address:
                                span#UserProfileEmailAddress.break-word {{ profile.EmailAddress }}
                            p.light.mb-1
                                b.primary--text.mr-1 Director:
                                span#UserProfileDirector.break-word {{ profile.Director }}
                            p.light.mb-1
                                b.primary--text.mr-1 First Line Reporting:
                                span#UserProfileFirstLineReporting.break-word {{ profile.FirstLineReporting }}
                            p.light.mb-1
                                b.primary--text.mr-1 Second Line Reporting:
                                span#UserProfileSecondLineReporting.break-word {{ profile.SecondLineReporting }}
                            v-divider(v-if="editable").no-flex.my-3
                            v-card-actions(v-if="editable").fill-width.pa-0
                                v-layout(full-width
                                        justify-center)
                                    v-btn(color="primary"
                                          flat
                                          aria-label="Save Profile"
                                          type="submit"
                                          :disabled="disabled")#UserProfileSaveButton Save
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";

import { IProfile } from "types/profile";

import VAvatar from "vuetify/es5/components/VAvatar";
import VBtn from "vuetify/es5/components/VBtn";
import VCard, {
  VCardActions,
  VCardText,
  VCardTitle
} from "vuetify/es5/components/VCard";
import VDivider from "vuetify/es5/components/VDivider";
import VForm from "vuetify/es5/components/VForm";
import { VFlex, VLayout } from "vuetify/es5/components/VGrid";
import VTextField from "vuetify/es5/components/VTextField";
import AvatarImage from "~/components/AvatarImage/AvatarImage.vue";

@Component({
  components: {
    AvatarImage,
    VAvatar,
    VBtn,
    VCard,
    VCardActions,
    VCardText,
    VCardTitle,
    VDivider,
    VFlex,
    VForm,
    VLayout,
    VTextField
  },
  $_veeValidate: {
    validator: "new"
  }
})
export default class UserProfile extends Vue {
  @Prop({ type: Boolean, default: false })
  private disabled: boolean;
  @Prop({ type: Boolean, default: false })
  private editable: boolean;
  @Prop({ type: Object, required: true })
  private profile: IProfile;

  private biography = "";

  @Watch("profile", { deep: true, immediate: true })
  private profileChanged() {
    this.biography = this.profile.Biography.replace(/\\n/g, "\n");
  }

  private async save() {
    if (await this.$validator.validateAll()) {
      this.$emit("updated-biography", this.biography);
    }
  }
}
</script>

<style lang="stylus" scoped>
.no-flex {
    flex: none;
}

.light {
    color: rgba(0, 0, 0, 0.54);
}

.fill-width {
    width: 100%;
}

#UserProfileLeft {
    flex-basis: 100%;
}

#UserProfile /deep/ .input-group__error {
    flex: none;
}

.white-space {
    white-space: pre-wrap;
}

.break-word {
    word-break: break-word;
}
</style>
