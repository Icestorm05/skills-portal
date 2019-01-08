<template lang="pug">
    v-container(fluid
                grid-list-md).SkillList.pt-0.px-0
        v-expansion-panel(v-if="skillCategoriesOnly.length"
                          expand
                          popout).SkillPanels
            v-expansion-panel-content(v-for="category in skillCategoriesOnly"
                                      :key="category.name"
                                      :lazy="lazy"
                                      ripple).SkillPanel.mb-2
                span(slot="header").white--text.SkillPanelHeader {{ category.name }}
                p.ma-3 {{ category.description }}
                skill-list(:skills="category.children"
                           :lazy="lazy").pl-3
                    template(slot-scope="{ skill }")
                        slot(:skill="skill")
        v-data-iterator(v-if="skillsOnly.length"
                        content-class="layout row wrap fill-width"
                        :rows-per-page-items="[3, 6, 12, 24, {'text': 'All', 'value': -1}]"
                        rows-per-page-text="Skills per page:"
                        :items="skillsOnly"
                        :pagination="pagination"
                        @update:pagination="updatePagination"
                        ref="dataIterator").Skills
            v-flex(slot="item"
                    slot-scope="{ item }"
                    sm4).SkillContainer
                slot(:skill="item")
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";

import { ISkillCategory } from "types/skill";

import VDataIterator from "vuetify/es5/components/VDataIterator";
import VExpansionPanel, {
  VExpansionPanelContent
} from "vuetify/es5/components/VExpansionPanel";
import { VContainer, VFlex, VLayout } from "vuetify/es5/components/VGrid";

@Component({
  components: {
    VContainer,
    VDataIterator,
    VExpansionPanel,
    VExpansionPanelContent,
    VFlex,
    VLayout
  },
  name: "skill-list"
})
export default class SkillList extends Vue {
  @Prop({ type: Boolean, default: true })
  private lazy: boolean;
  @Prop({ type: Array, required: true })
  private skills: ISkillCategory[];

  private get skillCategoriesOnly() {
    return this.skills.filter(skill => (skill.children ? true : false));
  }

  private pagination = {
    rowsPerPage: 3,
    page: 1,
    totalItems: this.skillsOnly.length
  };

  private overridePaginationUpdate: boolean = false;
  private updatePagination(pagination) {
    if (!this.overridePaginationUpdate) {
      this.pagination = pagination;
    } else {
      const page = this.pagination.page;
      this.pagination = pagination;
      Vue.set(this.pagination, "page", page);
      this.overridePaginationUpdate = false;
    }
  }

  private get skillsOnly() {
    return this.skills.filter(skill => (skill.children ? false : true));
  }

  @Watch("skillsOnly")
  private skillsOnlyChanged(curr, prev) {
    if (prev.length !== curr.length) {
      this.overridePaginationUpdate = true;
      const lastPage = Math.ceil(curr.length / this.pagination.rowsPerPage);
      this.pagination.page =
        (this.pagination.page > lastPage
          ? this.pagination.page - 1
          : this.pagination.page) || 1;
    }
  }
}
</script>

<style lang="stylus" scoped>
theme = json('../../assets/json/theme.json', { hash: true });

.SkillPanel {
  &.expansion-panel__container--active {
    margin-top: 8px;
    margin-left: 0;
    margin-right: 0;
  }

  background-color: lighten(theme.secondary, 57) !important;

  /deep/ .expansion-panel__header {
    background-color: theme.secondary;

    .icon {
      color: rgba(255, 255, 255, 0.54) !important;
    }
  }
}
</style>
