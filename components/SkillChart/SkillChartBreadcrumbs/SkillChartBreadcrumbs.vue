<template lang="pug">
    #SkillChartBreadcrumbs.mb-2.ml-2
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";

import { ECurrency } from "~/enums/currency";
import { ELevel } from "~/enums/level";

import Legend from "~/mixins/Legend";

import { ISkill, ISkillCategory } from "types/skill";

import {
  BaseType,
  HierarchyRectangularNode,
  select as d3Select,
  Selection
} from "d3";

type TSkillNode = HierarchyRectangularNode<ISkillCategory | ISkill>;

@Component({
  mixins: [Legend]
})
export default class SkillChartBreadcrumbs extends Legend {
  @Prop({ type: Number, default: 30 })
  private height: number;
  @Prop({ type: Array, required: true })
  private sequence: TSkillNode[];

  private trail: Selection<BaseType, {}, null, undefined> | undefined;

  /**
   * Sets the default breadcrumb trail.
   */
  private mounted() {
    this.trail = d3Select(this.$el)
      .append("svg")
      .attr("height", this.height + 3)
      .attr("width", "100%")
      .attr("id", "SkillTrail");
  }

  /**
   * Set the breadcrumb data, when the sequence changes.
   */
  @Watch("sequence", { deep: true })
  private sequenceChanged() {
    // Link data to SVG, ensuring that each data item is unique.
    const trail = d3Select("#SkillTrail")
      .selectAll("g")
      .data(this.sequence, (skillNode: TSkillNode) => {
        const skillData: ISkill = skillNode.data as any;
        if (skillData.SkillCurrencyId) {
          return `${skillNode.data.name}Currency${skillNode.depth}`;
        } else if (skillData.SkillLevelId) {
          return `${skillNode.data.name}Level${skillNode.depth}`;
        } else {
          return `${skillNode.data.name}${skillNode.depth}`;
        }
      });

    // Remove any unneeded breadcrumbs.
    trail.exit().remove();

    // Create a polygon for new breadcrumbs.
    const entering = trail.enter().append("g");
    entering
      .append("polygon")
      .style("fill", skillNode => this.fill(skillNode, "background-color"));

    // Create a text for new breadcrumbs.
    const height = this.height;
    const text = entering
      .append("text")
      .attr("x", "20")
      .attr("y", height / 2)
      .attr("dy", "0.4em")
      .attr("text-anchor", "start")
      .style("fill", skillNode => this.fill(skillNode, "color"))
      .text(skillNode => this.text(skillNode));

    // Get all breadcrumbs.
    const all = entering.merge(trail).attr("transform", "translate(0,0)");

    // For each breadcrumb, calculate the position.
    // Will attempt to place all breadcrumbs in a row. Any that do not fit, are wrapped down.
    let endX = 0;
    let endY = 0;
    const maxWidth = this.$el.clientWidth;
    all.each(function(skillNode, index, arr) {
      const wrapper = d3Select(this);
      const currentText = wrapper.select("text");
      const polygon = wrapper.select("polygon");
      const currentBBox = (currentText.node() as HTMLElement).getBoundingClientRect();

      const padding = 3;
      const tail = 10;
      const width = 35;

      if (!endY) {
        endY = height + padding;
      }

      endX += currentBBox.width + width + padding;
      if (endX > maxWidth) {
        endX = currentBBox.width + width + padding;
        endY += height + padding;
      }

      // Use the text bounding box width as the width for the containing polygons.
      const points: string[] = [];
      points.push("0,0");
      points.push(`${currentBBox.width + width},0`);
      if (index < arr.length - 1) {
        points.push(`${currentBBox.width + width + tail},${height / 2}`);
      }
      points.push(`${currentBBox.width + width},${height}`);
      points.push(`0,${height}`);
      if (index > 0) {
        points.push(`${tail},${height / 2}`);
      }

      polygon.attr("points", points.join(" "));

      const x = endX - currentBBox.width - width - padding;
      const y = endY - height - padding;
      wrapper.attr("transform", `translate(${x},${y})`);
    });

    // Use the height of the last wrapped element as the overall height of the trail
    // Only grows and never shrinks to reduce screen shift
    if (this.trail) {
      const trailHeight = this.trail.attr("height");
      if (endY > parseInt(trailHeight, 10)) {
        this.trail.attr("height", endY);
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
#SkillChartBreadcrumbs {
  width: 100%;
}
</style>
