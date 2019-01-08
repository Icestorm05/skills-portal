<template lang="pug">
    #TeamPage
        team-list(v-if="profile.children && teamSkills.length"
                  :team="profile.children"
                  :team-skills="teamSkills")
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Getter, State } from "vuex-class";

import { IProfile } from "types/profile";
import { ITeamSkill } from "types/teamSkill";

import TeamList from "~/components/TeamList/TeamList.vue";

@Component({
  components: {
    TeamList
  }
})
export default class TeamPage extends Vue {
  @Getter("profile/current") private profile: IProfile;
  @State("teamSkills") private teamSkills: ITeamSkill[];
}
</script>
