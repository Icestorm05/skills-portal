<template lang="pug">
    v-tabs(:color="color"
           grow
           icons-and-text
           show-arrows)#TheTabs
        v-tabs-slider(:color="sliderColor")
        v-tab(ripple
              nuxt
              exact
              :to="{ name: 'id-profile' }").white--text.Tab#ProfileTab Your Profile
              v-icon person
        v-tab(ripple
              nuxt
              exact
              :to="{ name: 'id-skills' }").white--text.Tab#SkillsTab Your Skills
              v-icon list
        v-tab(ripple
              nuxt
              exact
              :to="{ name: 'id-skills-available' }").white--text.Tab#AvailableSkillsTab Skills Catalogue
              v-icon playlist_add
        v-tab(ripple
              nuxt
              exact
              :to="{ name: 'id-team' }"
              v-if="hasTeam").white--text.Tab#TeamTab Your Team
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
export default class TheUserTabs extends Vue {
  @Prop({ type: String, default: "secondary" })
  private color: string;
  @Prop({ type: Boolean, default: false })
  private hasTeam: boolean;
  @Prop({ type: String, default: "warning" })
  private sliderColor: string;
}
</script>

<style lang="stylus" scoped>
.Tab:hover /deep/ .tabs__item {
    opacity: 1;
}
</style>
