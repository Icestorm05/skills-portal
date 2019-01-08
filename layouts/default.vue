<template lang="pug">

    v-app#app
      the-toolbar(:isLoggedIn="isLoggedIn"
                  :avatar-image-name="profile.MainStaffNumber"
                  @profile-click="home"
                  @password-click="password"
                  @help-click="help"
                  @logo-click="home"
                  @logout-click="logout")
        the-tabs(slot="tabs"
                 :hasTeam="hasTeam"
                 v-if="currentDepth === 1 && isIdRoute")
        the-team-member-tabs(slot="tabs"
                             :hasTeam="hasTeam"
                             :prefix="currentProfile.KnownAs"
                             v-else-if="currentDepth > 1 && isIdRoute")
      v-content#app-content
          v-layout(column)#app-layout
              the-progress-bar(v-visible="progress.display")
              v-container(fluid)#app-container
                nuxt
      the-snackbar(:color="snackbar.color"
                   :timeout="snackbar.timeout"
                   :visible="hasSnackbarMessage"
                   @timeout-elapsed="hideSnackbar") {{ snackbar.message }}
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import "vue-router";
import "vuex";
import { Getter, Mutation, State } from "vuex-class";

import { IProfile } from "types/profile";
import { IProgress } from "types/progress";
import { ISnackbar } from "types/snackbar";

import TheSnackbar from "~/components/TheSnackbar/TheSnackbar.vue";
import TheToolbar from "~/components/TheToolbar/TheToolbar.vue";

import TheProgressBar from "~/components/TheProgressBar/TheProgressBar.vue";
import TheTabs from "~/components/TheTabs/TheTabs.vue";
import TheTeamMemberTabs from "~/components/TheTabs/TheTeamMemberTabs/TheTeamMemberTabs.vue";

import VApp from "vuetify/es5/components/VApp";
import {
  VContainer,
  VContent,
  VFlex,
  VLayout
} from "vuetify/es5/components/VGrid";

@Component({
  components: {
    TheProgressBar,
    TheSnackbar,
    TheTabs,
    TheTeamMemberTabs,
    TheToolbar,
    VApp,
    VContainer,
    VContent,
    VFlex,
    VLayout
  }
})
export default class Layout extends Vue {
  @State("profile") private profile: IProfile;
  @Getter("profile/current") private currentProfile: IProfile;
  @Getter("profile/currentDepth") private currentDepth: number;
  @Getter("profile/hasTeam") private hasTeam: boolean;

  @State("progress") private progress: IProgress;

  @State("snackbar") private snackbar: ISnackbar;
  @Mutation("snackbar/hide") private hideSnackbar: () => void;
  @Getter("snackbar/hasMessage") private hasSnackbarMessage: boolean;

  @Getter("auth/isLoggedIn") private isLoggedIn: boolean;

  private help() {
    this.$router.push("/faq");
  }

  private home() {
    this.$router.push("/profile");
  }

  private password() {
    this.$router.push("/password");
  }

  private get isIdRoute() {
    return this.$route.name && this.$route.name.includes("id");
  }

  private async logout() {
    try {
      this.$store.commit("progress/show");
      await this.$store.dispatch("auth/logout");
      this.$store.commit("profile/reset");
      this.$router.push("/login");
      this.$store.commit("snackbar/show", {
        message: "Successfully logged out.",
        color: "success"
      });
    } catch (err) {
      this.$store.commit("snackbar/show", {
        message: "Failed to log out.",
        color: "error"
      });
    } finally {
      this.$store.commit("progress/hide");
    }
  }
}
</script>

<style lang="stylus" scoped>
#app-container {
  flex: 1 1 auto;
  height: 100%;
}

#app-layout {
  height: 100%;
}

#app-content /deep/ .content--wrap {
  flex: 1 1 0%;
}
</style>
