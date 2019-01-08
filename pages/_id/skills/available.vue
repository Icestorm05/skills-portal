<template lang="pug">
    #AvailableSkillsPage.text-xs-center
        skill-search(v-if="availableSkills.length"
                     :autocomplete-items="skillQueries"
                     autocomplete-item-key="skill"
                     autocomplete-item-tags-key="path"
                     :legend="legend.SkillCategories"
                     v-model="filters")
        skill-list(v-if="filteredBottomAvailableSkills.length"
                   :skills="filteredBottomAvailableSkills")
            skill-card(slot-scope="{ skill }"
                       :skill="skill"
                       :disabled="inProgress"
                       :employee-id="profile.EmployeeId"
                       :display-status-radio-buttons="currentDepth === 1"
                       :display-add-button="currentDepth === 1"
                       :display-path="filters.length ? true : false"
                       @add-skill="add"
                       @currency-change="updateCurrency(skill, $event)"
                       @level-change="updateLevel(skill, $event)")
        p(v-else-if="!inProgress").mt-3 No skills available to add.
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Getter, State } from "vuex-class";

import { ILegend } from "types/legend";
import { IProfile } from "types/profile";
import { ISkill, ISkillCategory } from "types/skill";

import {
  deepFilterByName,
  getAllSkillQueries,
  getAllSkills
} from "~/modules/skills";

import SkillCard from "~/components/SkillCard/SkillCard.vue";
import SkillList from "~/components/SkillList/SkillList.vue";
import SkillSearch from "~/components/SkillSearch/SkillSearch.vue";

@Component({
  components: {
    SkillCard,
    SkillList,
    SkillSearch
  }
})
export default class UnapprovedSkillsPage extends Vue {
  @State("legend") private legend: ILegend;
  @State("profile") private profile: IProfile;
  @Getter("profile/currentDepth") private currentDepth: number;

  @State("availableSkills") private availableSkills: ISkillCategory[];
  @Getter("progress/isVisible") private inProgress: boolean;

  private get skillQueries() {
    return getAllSkillQueries(this.availableSkills);
  }

  private filters = [];
  private get filteredAvailableSkills() {
    return deepFilterByName(
      JSON.parse(JSON.stringify(this.availableSkills)),
      this.filters
    );
  }

  private get filteredBottomAvailableSkills() {
    return this.filters.length
      ? getAllSkills(this.filteredAvailableSkills)
      : this.filteredAvailableSkills;
  }

  /**
   * Attempts to add a skill to the server.
   * If successful, adds the skill to the employee skills, and removes it from available skills.
   * @return {Promise<void>} An empty promise.
   */
  private async add(skill: ISkill, reset: () => void) {
    try {
      this.$store.commit("progress/show");
      const path = this.$store.getters["availableSkills/getPath"](skill);
      await this.$store.dispatch("skills/add", { skill, path });
      this.$store.commit("availableSkills/remove", { skill, path });
      this.$store.commit("snackbar/show", {
        message: `Successfully added skill: ${skill.name}`,
        color: "success"
      });
      reset();
    } catch (err) {
      this.$store.commit("snackbar/show", {
        message: `Failed to add skill: ${skill.name}`,
        color: "error"
      });
    } finally {
      this.$store.commit("progress/hide");
    }
  }

  private updateCurrency(skill: ISkill, SkillCurrencyId: number) {
    this.$store.commit("availableSkills/setCurrency", {
      ...skill,
      SkillCurrencyId
    });
  }

  private updateLevel(skill: ISkill, SkillLevelId: number) {
    this.$store.commit("availableSkills/setLevel", { ...skill, SkillLevelId });
  }
}
</script>
