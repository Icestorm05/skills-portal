<template lang="pug">
    #ReviewedSkillsPage.text-xs-center
        skill-search(v-if="reviewedSkills.length"
                     :autocomplete-items="skillQueries"
                     autocomplete-item-key="skill"
                     autocomplete-item-tags-key="path"
                     :legend="legend.SkillCategories"
                     v-model="filters")
        template(v-if="filteredReviewedSkills.length")
            skill-chart(:skills="filteredReviewedSkills"
                        :legend="legend")
            v-divider
            skill-list(:skills="filteredBottomReviewedSkills").mt-3#SkillList
                skill-card(slot-scope="{ skill }"
                           :skill="skill"
                           :display-path="filters.length ? true : false"
                           display-status-list)
            scroll-button(bottom="#SkillList"
                          top="body")
        p(v-else-if="!inProgress").mt-3 No skills currently reviewed.
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

import VDivider from "vuetify/es5/components/VDivider";
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
    VDivider
  }
})
export default class ReviewedSkillsPage extends Vue {
  @State("legend") private legend: ILegend;
  @State("reviewedSkills") private reviewedSkills: ISkillCategory[];
  @Getter("progress/isVisible") private inProgress: boolean;

  private get skillQueries() {
    return getAllSkillQueries(this.reviewedSkills);
  }

  private filters = [];
  private get filteredReviewedSkills() {
    return deepFilterByName(
      JSON.parse(JSON.stringify(this.reviewedSkills)),
      this.filters
    );
  }

  private get filteredBottomReviewedSkills() {
    return this.filters.length
      ? getAllSkills(this.filteredReviewedSkills)
      : this.filteredReviewedSkills;
  }
}
</script>
