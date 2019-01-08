<template lang="pug">
    #SkillChartLegend
        h3#SkillChartLegendTitle Legend
        #SkillChartLegendLists
            v-list(subheader dense)
                v-subheader Skill Categories
                v-list-tile(v-for="(color, category, i) in legend.SkillCategories"
                            :style="{ backgroundColor: color || legend.fallback }"
                            :key="category")
                    v-list-tile-content
                        v-list-tile-title(:style="{ color: textColor(color || legend.fallback) }")
                            b {{ i+1 }}. 
                            span {{ category }}
                v-divider.SkillChartLegendDivider
                v-subheader Levels
                v-list-tile(v-for="(color, level) in legend.Levels"
                            :style="{ backgroundColor: color || legend.fallback }"
                            :key="level")
                    v-list-tile-content
                        v-list-tile-title(:style="{ color: textColor(color || legend.fallback) }") {{ level }}
                v-divider.SkillChartLegendDivider
                v-subheader Currencies
                v-list-tile(v-for="(color, currency) in legend.Currencies"
                            :style="{ backgroundColor: color || legend.fallback }"
                            :key="currency")
                    v-list-tile-content
                        v-list-tile-title(:style="{ color: textColor(color || legend.fallback) }") {{ currency }}
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";

import Legend from "~/mixins/Legend";

import VDivider from "vuetify/es5/components/VDivider";
import VList, {
  VListTile,
  VListTileContent,
  VListTileTitle
} from "vuetify/es5/components/VList";
import VSubheader from "vuetify/es5/components/VSubheader";

import { BaseType, select as d3Select, Selection } from "d3";

@Component({
  components: {
    VDivider,
    VList,
    VListTile,
    VListTileContent,
    VListTileTitle,
    VSubheader
  },
  mixins: [Legend]
})
export default class SkillChartLegend extends Legend {
  @Prop({ type: Number, default: 30 })
  private height: number;
  @Prop({ type: Number, default: 10 })
  private paddingX: number;
  @Prop({ type: Number, default: 3 })
  private paddingY: number;
  @Prop({ type: Number, default: 3 })
  private radius: number;
}
</script>

<style lang="stylus" scoped>
#SkillChartLegend {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;
    margin-bottom: 10px;
    margin-right: 10px;

    #SkillChartLegendLists {
        flex: 1;

        .SkillChartLegendDivider {
            margin-top: 10px;
        }
    }
}
</style>
