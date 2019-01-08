import Color from "color";
import Mixin from "nuxt-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

import { HierarchyRectangularNode } from "d3";
import { ILegend } from "types/legend";
import { ISkill, ISkillCategory } from "types/skill";

import { ECurrency } from "~/enums/currency";
import { ELevel } from "~/enums/level";

import CalcTextColor from "./CalcTextColor";

type TSkillNode = HierarchyRectangularNode<ISkill | ISkillCategory>;

@Mixin({
  mixins: [CalcTextColor]
})
export default class Legend extends CalcTextColor {
  @Prop({ type: Object, required: true })
  public legend: ILegend;

  public get skillCategories() {
    return Object.keys(this.legend.SkillCategories);
  }

  public fill(
    skillNode: TSkillNode,
    type: "background-color" | "color" = "background-color"
  ): string {
    const skill: ISkill = skillNode.data as any;
    const skillCategory = skillNode.ancestors().reverse()[1];

    let color: string = "#ffffff";
    if (skill.SkillCurrencyId) {
      color =
        this.legend.Currencies[ECurrency[skill.SkillCurrencyId]] ||
        this.legend.fallback;
    } else if (skill.SkillLevelId) {
      color =
        this.legend.Levels[ELevel[skill.SkillLevelId]] || this.legend.fallback;
    } else if (skill.SkillAttributeId) {
      const val = this.skillCategoriesSearchValue(
        this.skillCategoriesSearch(skillCategory.data.name)
      );
      color = Color(val || this.legend.fallback)
        .lighten(skillNode.depth === 2 ? 0.2 : 0.4)
        .hex();
    } else if (skillCategory && skillCategory.data.name !== skill.name) {
      const val = this.skillCategoriesSearchValue(
        this.skillCategoriesSearch(skillCategory.data.name)
      );
      color = Color(val || this.legend.fallback)
        .lighten(0.2)
        .hex();
    } else {
      const val = this.skillCategoriesSearchValue(
        this.skillCategoriesSearch(skillNode.data.name)
      );
      color = val || this.legend.fallback;
    }

    return type === "background-color" ? color : this.textColor(color);
  }

  public skillCategoriesSearch(name: string): string | undefined {
    return this.skillCategories.find(key => {
      const regex = new RegExp(this.replaceAnds(name), "ig");
      return this.replaceAnds(key).match(regex) ? true : false;
    });
  }

  public text(skillNode: TSkillNode): string {
    const skill: ISkill = skillNode.data as any;
    if (skill.SkillCurrencyId) {
      return `Currency: ${ECurrency[skill.SkillCurrencyId]}`;
    } else if (skill.SkillLevelId) {
      return `Level: ${ELevel[skill.SkillLevelId]}`;
    } else {
      return skill.name;
    }
  }

  private replaceAnds(text: string) {
    return text.replace(/&|and/gi, "&");
  }

  private skillCategoriesSearchValue(skillCategory: string | undefined) {
    return skillCategory
      ? this.legend.SkillCategories[skillCategory]
      : undefined;
  }
}
