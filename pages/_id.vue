<template lang="pug">
    #IndexPage
        the-breadcrumbs(v-if="$route.params.id"
                        :employee-id="parseInt($route.params.id, 10)"
                        :profile="profile"
                        route-name="id-team")
        nuxt
</template>

<script lang="ts">
import axios from "axios";
import Component from "nuxt-class-component";
import Vue from "vue";
import { Getter, State } from "vuex-class";

import { IProfile } from "types/profile";
import { ISkillCategory } from "types/skill";

import TheBreadcrumbs from "~/components/TheBreadcrumbs/TheBreadcrumbs.vue";

@Component({
  components: {
    TheBreadcrumbs,
  },
  middleware: ["isLoggedIn"],
})
export default class IndexPage extends Vue {
  @State("profile") private profile: IProfile;
  @Getter("profile/current") private currentProfile: IProfile;
  @Getter("profile/currentDepth") private currentDepth: number;

  @State("skills") private skills: ISkillCategory[];

  private pSkills() {
    const id = parseInt(this.$route.params.id, 10) || this.profile.EmployeeId;
    const promises = [
      this.$store.dispatch("skills/get", id),
      this.$store.dispatch("teamSkills/get", this.currentProfile.children),
      this.$store.dispatch("reviewedSkills/get", id)
    ];
    return Promise.all(promises);
  }

  private async mounted() {
    try {
      if (this.$route.name === "id") {
        this.$router.push({ name: "id-profile" });
      }
      this.$store.commit("progress/show");
      await this.pSkills();
      if (this.currentDepth === 1) {
        await this.$store.dispatch("availableSkills/get", this.skills);
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        this.$store.commit("snackbar/show", {
          message: "Failed to load in data.",
          color: "error"
        });
      }
    } finally {
      this.$store.commit("progress/hide");
    }
  }

  private destroyed() {
    this.$cancelAllRequests();
    this.$store.commit("skills/reset");
    this.$store.commit("reviewedSkills/reset");
    this.$store.commit("availableSkills/reset");
    this.$store.commit("teamSkills/reset");
  }
}
</script>

<style lang="stylus" scoped>
#IndexPage {
    min-height: 100%;
    width: 100%;
}
</style>
