import { ECurrency } from 'enums/currency';
import { ELevel } from 'enums/level';

export interface IDescription {
    name: string;
    description: string;
}

export interface ISkillCategory extends IDescription {
    AreaId?: number;
    SubAreaId?: number;
    children: (ISkill|ISkillCategory)[];
}

export interface ISkill extends IDescription {
    SkillAttributeId: number;
    Area: string;

    EmployeeSkillId?: number;
    EmployeeId?: number;
    EmployeeSkillAttributeId?: number;
    SkillCurrencyId?: number;
    SkillLevelId?: number;

    EmployeeApprovedSkillId?: number;
    EmployeeApprovedSkillAttributeId?: number;

    path?: string[];
}
