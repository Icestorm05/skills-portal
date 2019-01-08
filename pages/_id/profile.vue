<template lang="pug">
    #ProfilePage
        user-profile(:profile="profile"
                     :disabled="inProgress"
                     :editable="currentDepth === 1"
                     @updated-biography="updateBiography")
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Getter, State } from "vuex-class";

import { IProfile } from "types/profile";

import UserProfile from "~/components/UserProfile/UserProfile.vue";

@Component({
  components: {
    UserProfile
  }
})
export default class ProfilePage extends Vue {
  @Getter("profile/current") private profile: IProfile;
  @Getter("profile/currentDepth") private currentDepth: number;

  @Getter("progress/isVisible") private inProgress: boolean;

  private async updateBiography(Biography: string) {
    try {
      this.$store.commit("progress/show");
      await this.$store.dispatch("profile/edit", {
        ...this.profile,
        Biography
      });
      this.$store.commit("snackbar/show", {
        message: "Successfully updated bio.",
        color: "success"
      });
    } catch (err) {
      this.$store.commit("snackbar/show", {
        message: "Failed to update bio.",
        color: "error"
      });
    } finally {
      this.$store.commit("progress/hide");
    }
  }
}
</script>
