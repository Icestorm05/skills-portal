import { ISkill } from 'types/skill';

export interface ITeamSkill {
    diff: number;
    EmployeeId: number;
    skills: ISkill[];
}
