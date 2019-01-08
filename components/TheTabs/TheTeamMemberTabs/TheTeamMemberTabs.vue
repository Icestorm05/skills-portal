<template lang="pug">
    v-tabs(:color="color"
           grow
           icons-and-text
           show-arrows)#TheTabs
        v-tabs-slider(:color="sliderColor")
        v-tab(ripple
              nuxt
              :to="{ name: 'id-profile', params: { id: $route.params.id } }").white--text.Tab#ProfileTab {{ amendedPrefix }} Profile
              v-icon person
        v-tab(ripple
              nuxt
              exact
              :to="{ name: 'id-skills-unreviewed', params: { id: $route.params.id } }").white--text.Tab#UnreviewedSkillsTab {{ amendedPrefix }} Unreviewed Skills
              v-icon list
        v-tab(ripple
              nuxt
              exact
              :to="{ name: 'id-skills-reviewed', params: { id: $route.params.id } }").white--text.Tab#ReviewedSkillsTab {{ amendedPrefix }} Reviewed Skills
              v-icon playlist_add_check
        v-tab(ripple
              nuxt
              :to="{ name: 'id-team', params: { id: $route.params.id } }"
              v-if="hasTeam").white--text.Tab#TeamTab {{ amendedPrefix }} Team
              v-icon people
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

import VIcon from "vuetify/es5/components/VIcon";
import VTabs, { VTab, VTabsSlider } from "vuetify/es5/components/VTabs";

@Component({
  components: {
    VIcon,
    VTab,
    VTabs,
    VTabsSlider,
  }
})
export default class TheTeamMemberTabs extends Vue {
  @Prop({ type: String, default: "accent" })
  private color: string;
  @Prop({ type: Boolean, default: false })
  private hasTeam: boolean;
  @Prop({ type: String, required: true })
  private prefix: string;
  @Prop({ type: String, default: "warning" })
  private sliderColor: string;

  private get amendedPrefix() {
    return this.prefix.charAt(this.prefix.length - 1) === "s"
      ? `${this.prefix}'`
      : `${this.prefix}'s`;
  }
}
</script>

<style lang="stylus" scoped>
.Tab:hover /deep/ .tabs__item {
    opacity: 1;
}
</style>
