import theme from "~/assets/json/theme.json";

export enum ELevel {
  Awareness = 2,
  Practitioner = 3,
  Expert = 4
}

export const LevelColors = {
  4: theme.success,
  3: theme.warning,
  2: theme.error
};
