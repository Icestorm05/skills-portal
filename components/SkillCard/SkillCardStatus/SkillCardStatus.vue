<template lang="pug">
    v-layout(full-width).SkillCardStatus.text-xs-left
        v-flex
            p(v-if="level")
                b Level: 
                v-chip(:color="levelColor"
                       :text-color="levelTextColor"
                       small).SkillCardLevelStatus {{ levels[level] }}
            p(v-if="currency")
                b Currency: 
                v-chip(:color="currencyColor"
                       :text-color="currencyTextColor"
                       small).SkillCardCurrencyStatus {{ currencies[currency] }}
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

import theme from '~/assets/json/theme.json';

import { ECurrency } from "~/enums/currency";
import { ELevel } from "~/enums/level";

import CalcTextColor from "~/mixins/CalcTextColor";

import VChip from "vuetify/es5/components/VChip";
import { VFlex, VLayout } from "vuetify/es5/components/VGrid";

@Component({
  components: {
    VChip,
    VFlex,
    VLayout
  },
  mixins: [CalcTextColor]
})
export default class SkillCardStatus extends CalcTextColor {
  @Prop({
    default: null,
    validator: val => val === null || typeof val === "number"
  })
  private currency: number | null;
  @Prop({
    default: null,
    validator: val => val === null || typeof val === "number"
  })
  private level: number | null;

  private currencies = ECurrency;
  private levels = ELevel;

  private get currencyColor() {
    if (this.currency === 2) {
      return "primary";
    } else if (this.currency === 3) {
      return "warning";
    } else if (this.currency === 4) {
      return "error";
    }
  }

  private get currencyTextColor() {
    return this.currencyColor && this.textColor(theme[this.currencyColor]) === "#ffffff"
      ? "white"
      : "black";
  }

  private get levelColor() {
    if (this.level === 2) {
      return "error";
    } else if (this.level === 3) {
      return "warning";
    } else if (this.level === 4) {
      return "success";
    }
  }

  private get levelTextColor() {
    return this.levelColor && this.textColor(theme[this.levelColor]) === "#ffffff"
      ? "white"
      : "black";
  }
}
</script>
