<template lang="pug">
    #UnreviewedSkillsPage.text-xs-center
        skill-search(v-if="unreviewedSkills.length"
                     :autocomplete-items="skillQueries"
                     autocomplete-item-key="skill"
                     autocomplete-item-tags-key="path"
                     :legend="legend.SkillCategories"
                     v-model="filters")
        template(v-if="filteredUnreviewedSkills.length")
            skill-chart(:skills="filteredUnreviewedSkills"
                        :legend="legend"
                        :offset="55")
            v-btn(flat
                  color="primary"
                  :disabled="inProgress"
                  @click="approveAll").mt-3 Reviewed with Mentor / Line Manager
            v-divider
            skill-list(:skills="filteredBottomUnreviewedSkills").mt-3#SkillList
                skill-card(slot-scope="{ skill }"
                           :skill="skill"
                           :disabled="inProgress"
                           :display-path="filters.length ? true : false"
                           display-status-list)
            scroll-button(bottom="#SkillList"
                          top="body")
        p(v-else-if="!inProgress").mt-3 No skills to review.
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Getter, State } from "vuex-class";

import {
  deepFilterByName,
  getAllSkillQueries,
  getAllSkills
} from "~/modules/skills";

import { ILegend } from "types/legend";
import { ISkillCategory } from "types/skill";

import VBtn from "vuetify/es5/components/VBtn";
import VDivider from "vuetify/es5/components/VDivider";
import { VContainer, VFlex, VLayout } from "vuetify/es5/components/VGrid";
import ScrollButton from "~/components/ScrollButton/ScrollButton.vue";
import SkillCard from "~/components/SkillCard/SkillCard.vue";
import SkillChart from "~/components/SkillChart/SkillChart.vue";
import SkillList from "~/components/SkillList/SkillList.vue";
import SkillSearch from "~/components/SkillSearch/SkillSearch.vue";

@Component({
  components: {
    ScrollButton,
    SkillCard,
    SkillChart,
    SkillList,
    SkillSearch,
    VBtn,
    VContainer,
    VDivider,
    VFlex,
    VLayout
  }
})
export default class UnreviewedSkillsPage extends Vue {
  @State("legend") private legend: ILegend;
  @Getter("skills/unreviewed") private unreviewedSkills: ISkillCategory[];
  @Getter("progress/isVisible") private inProgress: boolean;

  private get skillQueries() {
    return getAllSkillQueries(this.unreviewedSkills);
  }

  private filters = [];
  private get filteredUnreviewedSkills() {
    return deepFilterByName(
      JSON.parse(JSON.stringify(this.unreviewedSkills)),
      this.filters
    );
  }

  private get filteredBottomUnreviewedSkills() {
    return this.filters.length
      ? getAllSkills(this.filteredUnreviewedSkills)
      : this.filteredUnreviewedSkills;
  }

  /**
   * Attempts to approve all skills.
   * If successful, adds the skills to the reviewed employee skills.
   * @return {Promise<void>} An empty promise.
   */
  private async approveAll() {
    const skills = getAllSkills(this.unreviewedSkills);
    try {
      this.$store.commit("progress/show");
      await Promise.all(
        skills.map(async skill => {
          const path = this.$store.getters["skills/getPath"](skill);
          return this.$store.dispatch("reviewedSkills/add", {
            skill,
            path
          });
        })
      );
      this.$store.commit("snackbar/show", {
        message: "Successfully reviewed all skills.",
        color: "success"
      });
    } catch (err) {
      this.$store.commit("snackbar/show", {
        message: "Failed to review all skills.",
        color: "error"
      });
    } finally {
      this.$store.commit("progress/hide");
    }
  }
}
</script>
