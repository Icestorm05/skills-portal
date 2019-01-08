<template lang="pug">
    v-chip(:style="{ backgroundColor }"
           :text-color="color"
           :close="close"
           class="chip--select-multi"
           @input="$emit('close-tag')").SkillSearchTag
        strong.SkillSearchTagText {{ text }}
          slot
</template>

<script lang="ts">
import Color from "color";
import Component from "nuxt-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

import CalcTextColor from "~/mixins/CalcTextColor";

import { ISkillCategoryLegend } from "types/legend";

import VChip from "vuetify/es5/components/VChip";

interface IAny {
  [key: string]: string | string[];
}

@Component({
  components: {
    VChip
  },
  mixins: [CalcTextColor]
})
export default class SkillSearchTag extends CalcTextColor {
  @Prop({ type: Array })
  private autocompleteItems: Array<IAny | string> | undefined;
  @Prop({ type: String })
  private autocompleteItemTagsKey: string | undefined;
  @Prop({ type: Boolean, default: false })
  private close: boolean;
  @Prop({ type: Object })
  private legend: ISkillCategoryLegend | undefined;
  @Prop({ type: String })
  private text: string | undefined;
  @Prop({ type: Array })
  private tags: string[] | string | undefined;
  @Prop({ type: Boolean, default: false })
  private prioritizeParentColor: boolean;

  private get backgroundColor() {
    const tags = !this.tags && this.text ? this.computedTags : this.tags;
    const key = this.text ? this.getKey(this.text) : undefined;
    const parentKey = Array.isArray(tags)
      ? this.getKey(tags[tags.length - 1])
      : undefined;

    if (this.prioritizeParentColor) {
      if (!key && parentKey && !this.tags && this.legend) {
        return Color(this.legend[parentKey])
          .lighten(0.2)
          .hex();
      } else if ((key || parentKey) && this.legend) {
        return this.legend[parentKey ? parentKey : (key as string)];
      } else {
        return "lightgrey";
      }
    } else {
      if (!key && parentKey && this.legend) {
        return Color(this.legend[parentKey])
          .lighten(0.2)
          .hex();
      } else if ((key || parentKey) && this.legend) {
        return this.legend[parentKey ? parentKey : (key as string)];
      } else {
        return "lightgrey";
      }
    }
  }

  private get color() {
    const text = this.textColor(this.backgroundColor);
    return text === "#000000" ? "black" : "white";
  }

  private get computedTags() {
    if (this.autocompleteItems && this.autocompleteItemTagsKey) {
      const autocompleteItem = this.autocompleteItems.find(item => {
        const tags =
          typeof item !== "string"
            ? item[this.autocompleteItemTagsKey as string]
            : undefined;
        return Array.isArray(tags) && this.text
          ? tags.includes(this.text)
          : false;
      });
      return typeof autocompleteItem === "object"
        ? autocompleteItem[this.autocompleteItemTagsKey]
        : undefined;
    }
  }

  private getKey(category: string) {
    if (this.legend) {
      return Object.keys(this.legend).find(
        colorKey =>
          this.replaceAnds(colorKey).toLowerCase() ===
          this.replaceAnds(category).toLowerCase()
      );
    } else {
      return "lightgrey";
    }
  }

  private replaceAnds(text: string) {
    return text.replace(/&|and/gi, "&");
  }
}
</script>

<style lang="stylus" scoped>
.SkillSearchTag {
    max-width: 100%;
    /deep/ .chip__content {
      cursor: pointer;
      width: 100%;
    }
    .SkillSearchTagText {
      overflow: hidden;
      text-overflow: ellipsis;
    }
}
</style>
