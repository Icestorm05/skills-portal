<template lang="pug">
    #SkillsPage.text-xs-center
        skill-search(v-if="skills.length"
                     :autocomplete-items="skillQueries"
                     autocomplete-item-key="skill"
                     autocomplete-item-tags-key="path"
                     :legend="legend.SkillCategories"
                     v-model="filters")
        template(v-if="filteredSkills.length")
            skill-chart(:skills="filteredSkills"
                        :legend="legend")
            v-divider
            skill-list(:skills="filteredBottomSkills").mt-3#SkillList
                skill-card(slot-scope="{ skill }"
                           :skill="skill"
                           :disabled="inProgress"
                           display-status-radio-buttons
                           auto-update
                           display-remove-button
                           :display-path="filters.length ? true : false"
                           @edit-skill="edit"
                           @remove-skill="remove")
            scroll-button(bottom="#SkillList"
                          top="body")
        p(v-else-if="!inProgress").mt-3 No skills currently added.
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
import { ISkill, ISkillCategory } from "types/skill";

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
export default class SkillsPage extends Vue {
  @State("legend") private legend: ILegend;
  @State("skills") private skills: ISkillCategory[];
  @Getter("progress/isVisible") private inProgress: boolean;

  private get skillQueries() {
    return getAllSkillQueries(this.skills);
  }

  private filters = [];
  private get filteredSkills() {
    return deepFilterByName(
      JSON.parse(JSON.stringify(this.skills)),
      this.filters
    );
  }

  private get filteredBottomSkills() {
    return this.filters.length
      ? getAllSkills(this.filteredSkills)
      : this.filteredSkills;
  }

  /**
   * Attempts to edit a skill on the server.
   * If successful, edits the skill in the employee skills.
   * If it fails, resets the currency and level to its previous state.
   */
  private async edit(skill: ISkill, reset: () => void) {
    try {
      this.$store.commit("progress/show");
      const path = this.$store.getters["skills/getPath"](skill);
      const removeReviewedSkill = this.$store.dispatch(
        "reviewedSkills/remove",
        {
          skill,
          path
        }
      );
      const editSkill = this.$store.dispatch("skills/edit", skill);
      await Promise.all([removeReviewedSkill, editSkill]);
      this.$store.commit("snackbar/show", {
        message: `Successfully edited skill: ${skill.name}`,
        color: "success"
      });
    } catch (err) {
      this.$store.commit("snackbar/show", {
        message: `Failed to edit skill: ${skill.name}`,
        color: "error"
      });
      reset();
    } finally {
      this.$store.commit("progress/hide");
    }
  }

  /**
   * Attempts to remove the employee skill from the server.
   * If successful: removes the skill from the employee skills, and adds it to the available skills.
   * @return {Promise<void>} An empty promise.
   */
  private async remove(skill: ISkill, reset: () => void) {
    const path = this.$store.getters["skills/getPath"](skill);
    try {
      this.$store.commit("progress/show");
      const removeReviewedSkill = this.$store.dispatch(
        "reviewedSkills/remove",
        {
          skill,
          path
        }
      );
      const removeSkill = this.$store.dispatch("skills/remove", {
        skill,
        path
      });
      await Promise.all([removeReviewedSkill, removeSkill]);
      this.$store.commit("availableSkills/add", {
        skill: {
          ...skill,
          EmployeeId: undefined,
          EmployeeSkillAttributeId: undefined,
          SkillCurrencyId: undefined,
          SkillLevelId: undefined
        },
        path
      });
      this.$store.commit("snackbar/show", {
        message: `Successfully removed skill: ${skill.name}`,
        color: "success"
      });
    } catch (err) {
      this.$store.commit("snackbar/show", {
        message: `Failed to remove skill: ${skill.name}`,
        color: "error"
      });
    } finally {
      this.$store.commit("progress/hide");
    }
  }
}
</script>
