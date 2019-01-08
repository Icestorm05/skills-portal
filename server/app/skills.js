var console = require('tracer').colorConsole();
var config = require('./../config.js');
var db = new (require('./../app/db_sql.js'));
const async = require('asyncawait/async');
const await = require('asyncawait/await');

class Skills {

	/**
	 * Converts an array of skills into a hierarchy of skills.
	 * @param {Array} skills The array of skills.
	 * @param {Array} areas The array of skill areas.
	 * @param {Array} subareas The array of skill subareas.
	 */
	getHierarchy(skills, areas, subareas) {
		const mappedSkills = skills.map(skill => {
			skill.name = skill.SkillName;
			skill.description = skill.SkillDescription;
			delete skill.SkillName;
			delete skill.SkillDescription;
			delete skill.AreaDescription;

			if(skill.SubArea.match(/no subarea defined/ig)) {
				delete skill.SubArea;
			}
			return skill;
		});
		return areas.filter(area => {
			return skills.some(skill => skill.Area === area.Name);
		}).map(area => {
			const subarea = subareas.filter(subarea => subarea.AreaId === area.AreaId);
			if (subarea.length) {
				area.children = subarea.filter(subarea => {
					return mappedSkills.some(skill => skill.SubArea === subarea.Name);
				}).map(subarea => {
					subarea.children = mappedSkills.filter(skill => skill.SubArea === subarea.Name);
					subarea.name = subarea.Name;
					subarea.description = subarea.Description;
					delete subarea.Name;
					delete subarea.AreaId;
					delete subarea.Description;
					return subarea;
				});
			} else {
				area.children = mappedSkills.filter(skill => skill.Area === area.Name);
			}
			area.name = area.Name;
			area.description = area.Description;
			delete area.Name;
			delete area.Description;
			return area;
		});
	}

}

/**
 * Gets all the skills.
 */
Skills.prototype.getSkills = async(() => {
	const [skills, areas, subareas] = await (Promise.all([
		db.getSqlQuery("SELECT * from skills.AllSkill"),
		db.getSqlQuery("SELECT * from skills.Area"),
		db.getSqlQuery("SELECT * from skills.SubArea"),
	]));
	return Skills.prototype.getHierarchy(skills, areas, subareas);
});

/**
 * Converts skill references to skill objects.
 * @param {Array} empSkills The array of employee skill references.
 */
Skills.prototype.refToSkills = async((refs) => {
	const pSkills = Promise.all(refs.map(async(ref => {
		const attributeId = ref.EmployeeSkillAttributeId || ref.EmployeeApprovedSkillAttributeId;
		const query = `SELECT * from skills.AllSkill WHERE SkillAttributeId = ${attributeId}`;
		const skill = (await (db.getSqlQuery(query)))[0];
		return Object.assign(skill, ref);
	})));
	const [skills, areas, subareas] = await (Promise.all([
		pSkills,
		db.getSqlQuery("SELECT * from skills.Area"),
		db.getSqlQuery("SELECT * from skills.SubArea"),
	]));
	return Skills.prototype.getHierarchy(skills, areas, subareas);
});

module.exports = Skills;
