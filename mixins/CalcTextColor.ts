import Color from "color";
import Mixin from "nuxt-class-component";
import Vue from "vue";

@Mixin
export default class CalcTextColor extends Vue {
  public textColor(hex?: string) {
    return Color(hex).isLight() ? "#000000" : "#ffffff";
  }
}
