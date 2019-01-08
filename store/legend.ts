import Color from "color";
import { ILegend } from "types/legend";

export const state = () =>
  ({
    SkillCategories: {
      Core: "#ec4e9f",
      Technology: "#4dcf33"
    },
    Levels: {
      Awareness: "#a5a5a5",
      Practitioner: "#595959",
      Expert: "#000000"
    },
    Currencies: {
      Historic: "#a5a5a5",
      Fading: "#595959",
      Current: "#000000"
    },
    fallback: "#0080c9"
  } as ILegend);
