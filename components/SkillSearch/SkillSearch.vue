<template lang="pug">
    #SkillSearchContainer
        v-select(prepend-icon="search"
                label="Skill Search"
                :autocomplete="autocompleteItems.length ? true : false"
                browser-autocomplete="off"
                clearable
                autofocus
                solo
                chips
                tags
                multiple
                hide-selected
                :item-text="autocompleteItemKey"
                :item-value="autocompleteItemKey"
                :return-object="autocompleteItemKey ? true : false"
                ref="select"
                :items="autocompleteItems"
                :value="searchValue"
                :filter="filter"
                @input="searchValueChanged").mb-3#SkillSearch.SkillSearch
            template(slot="item" slot-scope="{ item }")
              v-layout(align-center
                       row
                       wrap)
                v-flex
                  span(v-if="item[autocompleteItemKey]") {{ item[autocompleteItemKey] }}
                  span(v-else) {{ item }}
                skill-search-tag(v-if="Array.isArray(item[autocompleteItemTagsKey])"
                                 v-for="parent in item[autocompleteItemTagsKey]"
                                 :key="parent"
                                 :legend="legend"
                                 :text="parent"
                                 :tags="item[autocompleteItemTagsKey]").hidden-xs-only
            template(slot="selection" slot-scope="{ item }")
              skill-search-tag(close
                               :legend="legend"
                               :text="item[autocompleteItemKey] ? item[autocompleteItemKey] : item"
                               :tags="item[autocompleteItemTagsKey]"
                               prioritize-parent-color
                               :autocomplete-items="autocompleteItems"
                               :autocomplete-item-tags-key="autocompleteItemTagsKey"
                               @close-tag="remove(item)")
                template(v-if="Array.isArray(item[autocompleteItemTagsKey])"
                         v-for="parent in item[autocompleteItemTagsKey]")  ({{ parent }})
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Model, Prop, Watch } from "vue-property-decorator";

import { ISkillCategoryLegend } from "types/legend";
import { ISkillQuery } from "types/skillQuery";

import theme from "~/assets/json/theme.json";

import { VFlex, VLayout } from "vuetify/es5/components/VGrid";
import VSelect from "vuetify/es5/components/VSelect";
import SkillSearchTag from "./SkillSearchTag/SkillSearchTag.vue";

interface IAny {
  [key: string]: string | string[];
}

@Component({
  components: {
    SkillSearchTag,
    VFlex,
    VLayout,
    VSelect
  }
})
export default class SkillSearch extends Vue {
  @Prop({ type: Array, default: () => [] })
  private autocompleteItems: Array<IAny | string>;
  @Prop({ type: String })
  private autocompleteItemKey: string | undefined;
  @Prop({ type: String })
  private autocompleteItemTagsKey: string | undefined;
  @Model("search-value-changed")
  @Prop({ type: Array, default: () => [] })
  private searchValue: Array<IAny | string>;
  @Prop({ type: Object })
  private legend: ISkillCategoryLegend | undefined;

  private filter(
    item: IAny | string,
    queryText: string | undefined,
    itemText: string | {}
  ) {
    if (queryText) {
      const itemTextStr =
        typeof itemText !== "string" ? JSON.stringify(itemText) : itemText;
      const match = itemTextStr.match(new RegExp(this.escape(queryText), "ig"))
        ? true
        : false;

      const path =
        typeof item !== "string" &&
        (this.autocompleteItemTagsKey ? true : false)
          ? item[this.autocompleteItemTagsKey as string]
          : undefined;
      const pathMatch =
        path && Array.isArray(path)
          ? path.some(
              child =>
                child.match(new RegExp(this.escape(queryText), "ig"))
                  ? true
                  : false
            )
          : false;

      return match || pathMatch;
    } else {
      return true;
    }
  }

  private escape(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

  private searchValueChanged(updatedQueries: Array<string | IAny>) {
    (this.$refs.select as VSelect).hideMenu();
    this.$emit("search-value-changed", updatedQueries);
  }

  private remove(valueToRemove: ISkillQuery | string) {
    (this.$refs.select as VSelect).hideMenu();
    const filteredSearchValue = this.searchValue.filter(value => {
      const v = typeof value === "string" ? value : value.skill;
      const vToRemove =
        typeof valueToRemove === "string" ? valueToRemove : valueToRemove.skill;
      return v !== vToRemove;
    });
    this.$emit("search-value-changed", filteredSearchValue);
  }

  @Watch("autocompleteItems")
  private autocompleteItemsChanged() {
    this.$emit(
      "search-value-changed",
      this.searchValue.filter(value => {
        const query =
          typeof value === "object"
            ? this.autocompleteItemKey
              ? value[this.autocompleteItemKey]
              : undefined
            : value;

        return this.autocompleteItems.some(autocompleteItem => {
          if (typeof autocompleteItem === "object") {
            const autocompleteItemQuery = this.autocompleteItemKey
              ? autocompleteItem[this.autocompleteItemKey]
              : undefined;
            const autocompleteItemTags = this.autocompleteItemTagsKey
              ? autocompleteItem[this.autocompleteItemTagsKey]
              : undefined;

            if (
              typeof query === "string" &&
              typeof autocompleteItemQuery === "string"
            ) {
              const queryMatch =
                typeof value === "string"
                  ? autocompleteItemQuery.match(
                      new RegExp(this.escape(query), "ig")
                    )
                    ? true
                    : false
                  : query === autocompleteItemQuery;
              const tagMatch =
                Array.isArray(autocompleteItemTags) &&
                autocompleteItemTags.some(tag => {
                  return tag.match(new RegExp(this.escape(query), "ig"))
                    ? true
                    : false;
                });
              return queryMatch || tagMatch;
            } else {
              return false;
            }
          } else {
            return typeof query === "string"
              ? autocompleteItem.match(new RegExp(this.escape(query), "ig"))
                ? true
                : false
              : false;
          }
        });
      })
    );
  }
}
</script>

<style lang="stylus" scoped>
#SkillSearchContainer {
  display: flex;
  flex-direction: column;
}

.SkillSearch {
  flex-basis: auto;

  /deep/ .input-group__input {
    flex: 1;
  }
}

.SkillParent {
  font-size: 0.8em;
}
</style>
