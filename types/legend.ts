export interface ILegend {
    SkillCategories: ISkillCategoryLegend;
    Levels: ISkillLevelLegend;
    Currencies: ISkillCurrencyLegend;
    fallback: string;
}

export interface ISkillCategoryLegend {
    [key: string]: string;
}

export interface ISkillLevelLegend {
    Awareness: string;
    Practitioner: string;
    Expert: string;
}

export interface ISkillCurrencyLegend {
    Historic: string;
    Fading: string;
    Current: string;
}