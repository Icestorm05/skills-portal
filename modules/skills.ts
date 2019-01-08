import { ISkill, ISkillCategory } from "types/skill";
import { ISkillQuery } from "types/skillQuery";

/**
 * Escapes all special characters.
 * @param {string} text The text to escape.
 * @return {string} The escaped text.
 */
const escape = (text: string) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Checks two skill objects together, determining whether any ID's match.
 * @param skill {ISkillCategory|ISkill} A skill category or skill.
 * @param skill2 {ISkillCategory|ISkill} A skill category or skill to attempt a match with.
 * @return {boolean} Whether the two objects matched or not.
 */
export const idMatch = (
  skill: ISkillCategory | ISkill,
  skill2: ISkillCategory | ISkill
) => {
  if ("AreaId" in skill && "AreaId" in skill2) {
    return skill.AreaId === skill2.AreaId;
  } else if ("SubAreaId" in skill && "SubAreaId" in skill2) {
    return skill.SubAreaId === skill2.SubAreaId;
  } else {
    return (
      (skill as ISkill).SkillAttributeId === (skill2 as ISkill).SkillAttributeId
    );
  }
};

/**
 * Takes an array of skill categories and skills, and a skill or skill category to filter by.
 * Performs a deep filter on the array, and returns the array with only the skill or skill category.
 * @param skills {Array<ISkillCategory|ISkill>} The array of skill categories and skills.
 * @param skillToFilter {ISkillCategory|ISkill} The skill category or skill to filter the array by.
 * @return {Array<ISkillCategory|ISkill>} The filtered array of skill categories and skills.
 */
export const deepFilter = (
  skills: Array<ISkillCategory | ISkill>,
  skillToFilter: ISkillCategory | ISkill
) => {
  return skills.filter(skill => {
    if (idMatch(skill, skillToFilter)) {
      return true;
    } else if ("children" in skill) {
      skill.children = deepFilter(skill.children, skillToFilter);
      return skill.children.length;
    } else {
      return false;
    }
  });
};

/**
 * Takes an array of skill categories and skills, and an array of skill names to filter by.
 * Performs a deep filter on the array, and returns the array with only the skill or skill category.
 * @param skills {Array<ISkillCategory|ISkill>} The array of skill categories and skills.
 * @param skillNames {string[]} The array of skill names to filter by.
 * @return {Array<ISkillCategory|ISkill>} The filtered array of skill categories and skills.
 */
export const deepFilterByName = (
  skills: Array<ISkillCategory | ISkill>,
  skillNames: Array<ISkillQuery | string>
) => {
  return skills.filter(skill => {
    const match = skillNames.some(skillName => {
      return typeof skillName === 'string' ?
        (skill.name.match(new RegExp(escape(skillName), 'ig')) ? true : false) :
        skillName.skill === skill.name;
    });
    if (match || !skillNames.length) {
      return true;
    } else if ("children" in skill) {
      skill.children = deepFilterByName(skill.children, skillNames);
      return skill.children.length;
    } else {
      return false;
    }
  });
};

/**
 * Takes an array of skill categories and skills, and a skill or skill category to filter by.
 * Performs a deep filter on the array, and returns the array with anything but the skill or skill category.
 * @param skills {Array<ISkillCategory|ISkill>} The array of skills and skill categories.
 * @param skillToFilter {ISkillCategory|ISkill} The skill category or skill to filter the array out of.
 * @return {Array<ISkillCategory|ISkill>} The filtered array of skills and skill categories.
 */
export const deepFilterInverse = (
  skills: Array<ISkillCategory | ISkill>,
  skillToFilter: ISkillCategory | ISkill
) => {
  return skills.filter(skill => {
    if (idMatch(skill, skillToFilter)) {
      return false;
    } else if ("children" in skill) {
      skill.children = deepFilterInverse(skill.children, skillToFilter);
      return skill.children.length;
    } else {
      return true;
    }
  });
};

/**
 * Takes an array of skills and skill categories, and a skill or skill category to find.
 * Performs a deep search on the array, and attempts to return the skill or skill category from the array.
 * @param skills {Array<ISkillCategory | ISkill} The array of skills and skill categories.
 * @param skillToFind {ISkillCategory | ISkill} The skill or skill category to find within the array.
 * @return {ISkillCategory | ISkill | null} The skill or skill category found within the array, if any.
 */
export const deepFind = (
  skills: Array<ISkillCategory | ISkill>,
  skillToFind: ISkillCategory | ISkill
): ISkillCategory | ISkill | null => {
  return skills.reduce((finalSkills, skill) => {
    if (idMatch(skill, skillToFind)) {
      return skill;
    } else if ("children" in skill) {
      const deepCategory = deepFind(skill.children, skillToFind);
      return deepCategory ? deepCategory : finalSkills;
    } else {
      return finalSkills;
    }
  }, null);
};

/**
 * Takes an array of skills and skill categories, and a skill category path leading down to a single skill.
 * Performs a deep merge on the first array, adding any elements found in the path.
 * @param skills {Array<ISkillCategory|ISkill>} The array of skill categories and skills.
 * @param path {ISkillCategory|ISkill} The path to the skill.
 * @return {Array<ISkillCategory|ISkill>} The array of skill categories and skills merged with the path.
 */
export const deepMerge = (
  skills: Array<ISkillCategory | ISkill>,
  path: ISkillCategory | ISkill
) => {
  return sort(skills, "name").reduce(mergedSkills => {
    const deepCategory = mergedSkills.find(skillCategory =>
      idMatch(skillCategory, path)
    );
    if (deepCategory) {
      if ("children" in deepCategory && "children" in path) {
        deepCategory.children = deepMerge(
          deepCategory.children,
          path.children[0]
        );
      }
    } else {
      mergedSkills.push(path);
    }
    return mergedSkills;
  }, skills);
};

/**
 * Takes two array of skills and skill categories.
 * Performs a deep filter on the first array, removing any elements found in the second array.
 * @param skills {Array<ISkillCategory|ISkill>} The array of skills to filter down.
 * @param skillsToFilter {Array<ISkillCategory|ISkill>} The array of skills to filter down by.
 * @return {Array<ISkillCategory|ISkill>} The filtered array of skills.
 */
export const deepDiff = (
  skills: Array<ISkillCategory | ISkill>,
  skillsToFilter: Array<ISkillCategory | ISkill>
) => {
  return skills.filter(skill => {
    const skillToFilter = skillsToFilter.find(deepSkillToFilter =>
      idMatch(deepSkillToFilter, skill)
    );
    if (skillToFilter) {
      if (
        idMatch(skillToFilter, skill) &&
        "children" in skill &&
        "children" in skillToFilter
      ) {
        skill.children = deepDiff(skill.children, skillToFilter.children);
        return skill.children.length;
      } else {
        return idMatch(skillToFilter, skill) ? false : true;
      }
    } else {
      return true;
    }
  });
};

/**
 * Takes an array of skills and skill categories.
 * Splits the lowest level skill into an array of children for currency and level.
 * @param skills {Array<ISkillCategory|ISkill>} The array of skills and skill categories.
 * @return {Array<ISkillCategory|ISkill>} The array of split skills and skill categories.
 */
export const splitSkills = (
  skills: Array<ISkillCategory | ISkill>
): Array<ISkillCategory | ISkill> => {
  return skills.map(skill => {
    if ("children" in skill) {
      skill.children = splitSkills(skill.children);
      return skill;
    } else {
      return {
        SkillAttributeId: skill.SkillAttributeId,
        Area: skill.Area,
        name: skill.name,
        description: skill.description,
        children: [
          {
            name: skill.name,
            SkillCurrencyId: skill.SkillCurrencyId
          },
          {
            name: skill.name,
            SkillLevelId: skill.SkillLevelId
          }
        ]
      };
    }
  });
};

/**
 * Creates an array from a hierarchy of skills and skill categories of the lowest level skills
 * @param skills {Array<ISkillCategory|ISkill>} An array of skills and skill categories.
 * @return {ISkill[]} An array of skills.
 */
export const getAllSkills = (
  skills: Array<ISkillCategory | ISkill>
): ISkill[] => {
  return skills.reduce((lowestLevelSkills: ISkill[], skill) => {
    if ("children" in skill) {
      return lowestLevelSkills.concat(getAllSkills(skill.children).map(child => {
        if (child.path) {
          child.path.push(skill.name);
        }
        return child;
      }));
    } else {
      lowestLevelSkills.push({...skill, path: []});
    }
    return lowestLevelSkills;
  }, []);
};

/**
 * Creates a sorted array of skill names from a hierarchy of skills and skill categories of the lowest level skills
 * @param skills {Array<ISkillCategory|ISkill>} An array of skills and skill categories.
 * @return {string[]} An array of sorted skills.
 */
export const getAllSkillQueries = (
  skills: Array<ISkillCategory | ISkill>
): string[] => {
  return sort(getAllSkillQueriesDeep(skills), 'skill');
};

/**
 * Creates an array of skill names from a hierarchy of skills and skill categories of the lowest level skills
 * @param skills {Array<ISkillCategory|ISkill>} An array of skills and skill categories.
 * @return {string[]} An array of skills.
 */
export const getAllSkillQueriesDeep = (
  skills: Array<ISkillCategory | ISkill>
): ISkillQuery[] => {
  return skills.reduce((lowestLevelSkills: ISkillQuery[], skill) => {
    if ("children" in skill) {
      return lowestLevelSkills.concat(getAllSkillQueriesDeep(skill.children).map(child => {
        child.path.push(skill.name);
        return child;
      }));
    } else {
      lowestLevelSkills.push({skill: skill.name, path: []});
    }
    return lowestLevelSkills;
  }, []);
};

/**
 * Takes an array, and sorts them all. Can also sort objects by passing in a key.
 * @param skills {any[]} An array to sort.
 * @param key {string} An optional key to use its value as the comparison.
 * @return {any[]} The sorted array.
 */
export const sort = (items: any[], key?: string) => {
  return items.sort((prev, curr) => {
    const previous = key ? prev[key] : prev;
    const current = key ? curr[key] : curr;
    if (previous < current) {
      return -1;
    }
    if (previous > current) {
      return 1;
    }
    return 0;
  });
};
