<template lang="pug">
  #SkillChartWrapper
    #SkillChartContainer
        #SkillChart
          skill-chart-breadcrumbs(v-visible="breadcrumbs.display"
                                  :sequence="breadcrumbs.sequence"
                                  :legend="legend")#SkillChartBreadcrumbs
          svg#SkillChartSvg
            g#SkillChartSvgContainer
        skill-chart-legend(:legend="legend")#SkillChartLegend
</template>

<script lang="ts">
import Component from "nuxt-class-component";
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";

import { ECurrency } from "~/enums/currency";
import { ELevel } from "~/enums/level";

import Legend from "~/mixins/Legend";

import { splitSkills } from "~/modules/skills";

import { ISkill, ISkillCategory } from "types/skill";

import SkillChartBreadcrumbs from "./SkillChartBreadcrumbs/SkillChartBreadcrumbs.vue";
import SkillChartLegend from "./SkillChartLegend/SkillChartLegend.vue";

import {
  arc as d3Arc,
  BaseType,
  hierarchy as d3Hierarchy,
  HierarchyRectangularNode,
  interpolate as d3Interpolate,
  partition as d3Partition,
  path as d3Path,
  scaleLinear as d3ScaleLinear,
  scaleSqrt as d3ScaleSqrt,
  select as d3Select,
  selectAll as d3SelectAll,
  Selection
} from "d3";

type TSkillNode = HierarchyRectangularNode<ISkillCategory | ISkill>;

@Component({
  components: {
    SkillChartBreadcrumbs,
    SkillChartLegend
  },
  mixins: [Legend]
})
export default class SkillChart extends Legend {
  @Prop({ type: Number, default: 400 })
  private height: number;
  @Prop({ type: Boolean, default: true })
  private responsive: boolean;
  @Prop({ type: Array, required: true })
  private skills: Array<ISkillCategory | ISkill>;
  @Prop({ type: Number, default: 0 })
  private offset: number;
  @Prop({ type: Number, default: 500 })
  private width: number;

  private breadcrumbs = {
    display: false,
    sequence: [] as TSkillNode[]
  };

  private radius: number = Math.min(this.width, this.height) / 2 - 5;
  private g:
    | Selection<BaseType, ISkillCategory | ISkill, HTMLElement, undefined>
    | undefined;

  private arc = d3Arc<TSkillNode>()
    .startAngle(skill => Math.max(0, Math.min(2 * Math.PI, this.x(skill.x0))))
    .endAngle(skill => Math.max(0, Math.min(2 * Math.PI, this.x(skill.x1))))
    .innerRadius(skill => Math.max(0, this.y(skill.y0)))
    .outerRadius(skill => Math.max(0, this.y(skill.y1)));

  private x = d3ScaleLinear()
    .range([0, 2 * Math.PI])
    .clamp(true);
  private y = d3ScaleSqrt().range([0, this.radius]);

  private fontSize = "1em";
  private textSpace = 10;

  /**
   * Update chart when skill prop changes
   */
  @Watch("skills", { deep: true })
  private skillsChanged() {
    this.updateChart();
  }

  private changeHeight() {
    const skillChartContainerNode = d3Select<HTMLElement, {}>(
      "#SkillChartContainer"
    ).node();
    const skillChart = d3Select<HTMLElement, ISkillCategory>(
      "#SkillChart"
    );
    const skillChartNode = skillChart.node();
    const skillChartLegend = d3Select<HTMLElement, {}>(
      "#SkillChartLegend"
    );
    const skillChartLegendNode = skillChartLegend.node();

    if (skillChartNode && skillChartLegendNode && skillChartContainerNode) {
      const top = skillChartContainerNode.getBoundingClientRect().top;
      const calcHeight = window.innerHeight - top - window.pageYOffset - this.offset - 10;
      const height = calcHeight < this.height ? this.height : calcHeight;
      skillChart
        .style("height", `${height}px`);
      skillChartLegend
        .style("height", `${height}px`);
      this.fontSize = height > 600 ? "1em" : height > 500 ? "1.1em" : "1.2em";
      this.textSpace = height > 600 ? 10 : height > 500 ? 11 : 12;

      if (this.g) {
        this.g.selectAll("textPath")
          .attr("font-size", this.fontSize);
        this.g
          .selectAll<BaseType, TSkillNode>("text")
          .attr("display", d => this.textFits(d) ? "block" : "none");
      }
    }
  }

  /**
   * Creates a blank SVG
   */
  private mounted() {
    if (this.responsive) {
      window.addEventListener("resize", this.changeHeight);
    }

    d3Select<HTMLElement, ISkillCategory>("#SkillChartSvg")
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    this.g = d3Select<HTMLElement, ISkillCategory>("#SkillChartSvgContainer")
      .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);

    this.updateChart();
    this.changeHeight();
  }

  private destroyed() {
    if (this.responsive) {
      window.removeEventListener("resize", this.changeHeight);
    }
  }

  /**
   * Sets the data to display on the chart
   */
  private updateChart() {
    // Create a partition
    const partition = d3Partition();

    // Split the lowest level skills down into a further level for currency and level
    const skills = splitSkills(JSON.parse(JSON.stringify(this.skills)));

    // Create a hierarchy of the data
    // Calculates the total of each level based on the currency and level on the lowest level
    // Then sorts by the total
    const hierarchy = d3Hierarchy<ISkillCategory | ISkill>({
      name: "Skills",
      children: skills,
      description: '',
    })
      .sum(skillCategory => {
        if (skillCategory.hasOwnProperty("children")) {
          return 0;
        } else {
          const skill: ISkill = skillCategory as any;
          if (skill.SkillCurrencyId) {
            return 4 - (skill.SkillCurrencyId - 1);
          }
          if (skill.SkillLevelId) {
            return skill.SkillLevelId - 1;
          }
        }
        return 0;
      })
      .sort((prev, curr) => {
        if (prev.value && curr.value) {
          return curr.value - prev.value;
        } else {
          return 0;
        }
      });

    // Calculates the position of each item in the hierarchy
    const nodes = partition(hierarchy).descendants() as TSkillNode[];

    if (this.g) {
      // Find all path elements, and attach the partition data to them
      const path = this.g.selectAll("path.mainPath").data(nodes);

      // For any path elements that exist but are no longer needed, remove them
      path.exit().remove();

      // For any path elements that do not exist but are needed, add them
      path
        .enter()
        .append("path")
        .attr("class", "mainPath")
        .style("cursor", "pointer");

      // For each path element, update their attributes
      const mainPaths = this.g
        .selectAll("path.mainPath")
        .data(nodes)
        .attr("visibility", skill => (skill.depth ? null : "hidden"))
        .attr("pointer-events", skill => (skill.depth ? null : "all"))
        .attr("fill-rule", "evenodd")
        .style("stroke", "#fff")
        .style("opacity", 1)
        .style("fill", skillNode => this.fill(skillNode, "background-color"))
        .on(
          "mouseover",
          skill => (skill.depth ? this.handleMouseover(skill) : null)
        )
        .on("click", this.handleClick);

      const hiddenPaths = this.g.selectAll("path.hiddenPath").data(nodes);

      hiddenPaths.exit().remove();

      hiddenPaths
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("class", "hiddenPath");

      this.g
        .selectAll("path.hiddenPath")
        .data(nodes)
        .attr("visibility", skill => (skill.depth ? null : "hidden"))
        .attr("id", (_, i) => `hiddenArc${i}`)
        .attr("d", this.middleArcLine);

      const text = this.g.selectAll("text").data(nodes);

      text.exit().remove();

      text.selectAll("textPath").remove();

      text
        .enter()
        .append("text")
        .style("cursor", "pointer");

      this.g
        .selectAll("text")
        .data(nodes)
        .attr("visibility", skill => (skill.depth ? null : "hidden"))
        .attr("display", d => (this.textFits(d) ? null : "none"))
        .attr("dy", ".35em")
        .attr("font-size", this.fontSize)
        .attr("fill", skillNode => this.fill(skillNode, "color"))
        .append("textPath")
        .attr("xlink:href", (_, i) => `#hiddenArc${i}`)
        .attr("startOffset", "50%")
        .style("text-anchor", "middle")
        .text(skillNode => {
          if (skillNode.depth === 1) {
            return this.textFits(skillNode, false)
              ? this.text(skillNode)
              : this.key(skillNode);
          } else {
            return this.text(skillNode);
          }
        })
        .on(
          "mouseover",
          skill => (skill.depth ? this.handleMouseover(skill) : null)
        )
        .on("click", this.handleClick);

      mainPaths.each(d => (d.parent ? null : this.handleClick(d)));

      const arc = this.arc;
      mainPaths
        .transition()
        .duration(750)
        .attrTween("d", function(skillNode) {
          const interpolateNode = d3Interpolate(
            { x0: (this as any).x0s || 0, x1: (this as any).x1s || 0 },
            skillNode
          );
          return perc => {
            const interpolatedNode = interpolateNode(perc);
            (this as any).x0s = interpolatedNode.x0;
            (this as any).x1s = interpolatedNode.x1;
            const arced = arc(interpolatedNode);
            return arced ? arced : "";
          };
        });
    }

    d3Select("path").on("mouseover", this.handleMouseleave);
    d3Select("g").on("mouseleave", this.handleMouseleave);
  }

  private textFits(skillNode: TSkillNode, key: boolean = true) {

    const deltaAngle = this.x(skillNode.x1) - this.x(skillNode.x0);
    const r = Math.max(0, (this.y(skillNode.y0) + this.y(skillNode.y1)) / 2);
    const perimeter = r * deltaAngle;

    if (skillNode.depth === 1 && key) {
      const text = this.text(skillNode);
      const fits = text.length * this.textSpace < perimeter;
      return fits ? fits : this.key(skillNode).length * this.textSpace < perimeter;
    } else {
      const text = this.text(skillNode);
      return text.length * this.textSpace < perimeter;
    }
  }

  private key(skillNode: TSkillNode) {
    const skillCategory = this.skillCategoriesSearch(skillNode.data.name);
    const i = skillCategory ? this.skillCategories.indexOf(skillCategory) : -1;
    return i > -1 ? (i + 1).toString() : skillNode.data.name;
  }

  private middleArcLine(skillNode: TSkillNode) {
    const halfPi = Math.PI / 2;
    const angles = [
      this.x(skillNode.x0) - halfPi,
      this.x(skillNode.x1) - halfPi
    ];
    const r = Math.max(0, (this.y(skillNode.y0) + this.y(skillNode.y1)) / 2);

    const middleAngle = (angles[1] + angles[0]) / 2;
    const invertDirection = middleAngle > 0 && middleAngle < Math.PI;
    if (invertDirection) {
      angles.reverse();
    }

    const path = d3Path();
    path.arc(0, 0, r, angles[0], angles[1], invertDirection);
    return path.toString();
  }

  /**
   * Displays the breadcrumbs and title of the skill being hovered over.
   * Also, lowers the opacity of all the other skills.
   * @param {TSkillNode} skillNode The node being viewed.
   */
  private handleMouseover(skillNode: TSkillNode) {
    // Change the opacity of all path elements
    d3SelectAll("path").style("opacity", 0.3);

    // Update the breadcrumb component data.
    this.breadcrumbs.display = true;
    this.breadcrumbs.sequence = skillNode
      .ancestors()
      .reverse()
      .slice(1);

    // Only display the viewed element on full opacity
    if (this.g) {
      this.g
        .selectAll("path")
        .filter(
          (node: TSkillNode) => this.breadcrumbs.sequence.indexOf(node) >= 0
        )
        .style("opacity", 1);
    }
  }

  /**
   * Hides the breadcrumbs, title and resets the opacity.
   */
  private handleMouseleave() {
    // Reset all path elements to normal opacity
    d3SelectAll("path").style("opacity", 1);

    // Hide the breadcrumbs
    this.breadcrumbs.display = false;
  }

  private handleClick(skillNode: TSkillNode) {
    if (this.g) {
      const transition = this.g
        .transition()
        .duration(750)
        .tween("scale", () => {
          const xd = d3Interpolate(this.x.domain(), [
            skillNode.x0,
            skillNode.x1
          ]);
          const yd = d3Interpolate(this.y.domain(), [skillNode.y0, 1]);
          const yr = d3Interpolate(this.y.range(), [
            skillNode.y0 ? 40 : 0,
            this.radius
          ]);
          return t => {
            this.x.domain(xd(t));
            this.y.domain(yd(t)).range(yr(t));
          };
        });

      transition
        .selectAll<BaseType, TSkillNode>("path.mainPath")
        .attrTween("d", d => {
          return () => {
            const arced = this.arc(d);
            return arced ? arced : "";
          };
        });

      transition
        .selectAll<BaseType, TSkillNode>("path.hiddenPath")
        .attrTween("d", d => () => this.middleArcLine(d));

      transition
        .selectAll<BaseType, TSkillNode>("text")
        .attrTween("display", d => () => (this.textFits(d) ? "block" : "none"));

      const key = this.key;
      const text = this.text;
      const textFits = this.textFits;

      transition
        .selectAll<BaseType, TSkillNode>("textPath")
        .tween("text", function(currSkillNode) {
          const that = this;
          return t => {
            if (currSkillNode.depth === 1) {
              const arcText = textFits(currSkillNode, false)
                ? text(currSkillNode)
                : key(currSkillNode);
              d3Select(that).text(arcText);
            } else {
              d3Select(that).text(text(currSkillNode));
            }
          };
        });
    }
  }
}
</script>

<style lang="stylus" scoped>
#SkillChartWrapper {
  display: flex;
  flex-direction: column;
}
#SkillChartContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex-wrap: wrap;

    #SkillChart {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        min-width: 400px;
        height: 100%;
        padding: 10px 0;

        #SkillChartBreadcrumbs {
          max-width: 90vw;
        }

        #SkillChartSvg {
          height: 100%;
          width: 100%;
        }
    }
}
</style>
