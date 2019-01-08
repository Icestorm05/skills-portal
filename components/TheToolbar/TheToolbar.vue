<template lang="pug">
  v-toolbar(app
            :color="color"
            fixed
            :extension-height="72")#TheToolbar
    img(alt="Skills Portal Logo"
        height="65%"
        src="~/assets/img/skills_logo.png"
        width="auto"
        @click="$emit('logo-click')")#TheToolbarSkillsLogo.ml-5
    v-spacer
    v-menu(offset-y
           v-show="isLoggedIn")#TheToolbarAvatarMenu
        v-avatar(slot="activator"
                 @click="$emit('avatar-click')")#TheToolbarAvatar.mr-3
            avatar-image(v-if="isLoggedIn" :image-name="avatarImageName" :renderAsBase64="true")
        v-list
            v-list-tile(@click="$emit('profile-click')"
                        nuxt)#TheToolbarProfile View Profile
            v-list-tile(@click="$emit('password-click')"
                        nuxt)#TheToolbarPassword Change Password
    v-btn(v-show="isLoggedIn"
          color="white"
          flat
          icon
          aria-label="Help"
          @click="$emit('help-click')")#TheToolbarHelpButton
        v-icon help_outline
    v-btn(v-show="isLoggedIn"
          color="white"
          flat
          icon
          aria-label="Logout"
          @click="$emit('logout-click')")#TheToolbarLogoutButton
        v-icon exit_to_app
    slot(slot="extension" name="tabs")
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";

import VAvatar from "vuetify/es5/components/VAvatar";
import VBtn from "vuetify/es5/components/VBtn";
import { VSpacer } from "vuetify/es5/components/VGrid";
import VIcon from "vuetify/es5/components/VIcon";
import VList, { VListTile } from "vuetify/es5/components/VList";
import VMenu from "vuetify/es5/components/VMenu";
import VToolbar, { VToolbarTitle } from "vuetify/es5/components/VToolbar";
import AvatarImage from "~/components/AvatarImage/AvatarImage.vue";

@Component({
  components: {
    AvatarImage,
    VAvatar,
    VBtn,
    VSpacer,
    VIcon,
    VList,
    VListTile,
    VMenu,
    VToolbar,
    VToolbarTitle
  }
})
export default class TheToolbar extends Vue {
  @Prop({ type: String, default: "" })
  private avatarImageName: string;
  @Prop({ type: String, default: "primary" })
  private color: string;
  @Prop({ type: Boolean, default: false })
  private isLoggedIn: boolean;
}
</script>

<style lang="stylus" scoped>
#TheToolbar {
    #TheToolbarSkillsLogo {
        cursor: pointer;
    }

    #TheToolbarAvatar {
        cursor: pointer;
    }
}
</style>