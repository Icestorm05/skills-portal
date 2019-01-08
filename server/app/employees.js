var console = require('tracer').colorConsole();
var config = require('./../config.js');
var db = new (require('./../app/db_sql.js'));
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const error = require('./error');
const skills = new (require('./skills'));
var SqlString = require('sqlstring');

class Employees {

	/**
	 * Gets all employees.
	 */
	getEmployees() {
		const q = "SELECT * FROM skills.CompleteEmployeeView";
		return db.getSqlQuery(q);
	}

	/**
	 * Gets an employee by a specified field.
	 * @param {string} field The field to search upon.
	 * @param {string} name The value to find.
	 */
	getEmployeesBy(field, name) {
		const q = `SELECT * FROM skills.CompleteEmployeeView WHERE lower(${field}) = '${name.toString().replace(/'/g, "''")}'`;
		return db.getSqlQuery(q);
	}

	/**
	 * Updates an employee.
	 * @param {string} user The user ID to save to the audit.
	 * @param {Object} employee The employee to update.
	 */
	updateEmployee(user, employee) {
		const updateableFields = ['Biography'];
		let query = "UPDATE skills.EMPLOYEE SET ";

		for (var i = 0; i < updateableFields.length; i++) {
			var f = updateableFields[i];
			if (employee[f]) {
				query += f + " = " + SqlString.escape(prepForSqlServer(employee[f])) + ", ";}
		}

		query = query.slice(0, -2);
		query += " WHERE EmployeeId = " + +employee.EmployeeId;
		return db.setSqlQuery(user, query).then(result => {
			if(result.rowsAffected.includes(0)) {
				return Promise.reject(new Error('Query did not affect any rows', 500));
			}
			return result;
		});
	}

	/**
	 * Adds a skill to an employee.
	 * @param {string} user The user ID to save to the audit.
	 * @param {number} empId The employee ID.
	 * @param {Object} skill The skill.
	 * @param {string} table The table to save to.
	 */
	addSkill(user, empId, skill, table) {
		const q = `INSERT INTO ${table} ( EmployeeId, EmployeeSkillAttributeId, SkillCurrencyId, SkillLevelId )
		 VALUES ( ${empId}, ${skill.EmployeeSkillAttributeId}, ${skill.SkillCurrencyId}, ${skill.SkillLevelId} )
		 SELECT SCOPE_IDENTITY()`;
		return db.setSqlQuery(user, q).then(result => {
			if(result.rowsAffected.includes(0)) {
				return Promise.reject(new Error('Query did not affect any rows', 500));
			}
			return result;
		});
	}

	/**
	 * Updates an employee's skill.
	 * @param {string} user The user ID to save to the audit.
	 * @param {Object} skill The skill to update.
	 * @param {string} table The table to update.
	 */
	updateSkill(user, skill, table) {
		const q = `UPDATE ${table} SET EmployeeSkillAttributeId = ${skill.EmployeeSkillAttributeId},
		 SkillCurrencyId = ${skill.SkillCurrencyId},
		 SkillLevelId = ${skill.SkillLevelId}
		 WHERE EmployeeSkillId = ${skill.EmployeeSkillId}`;
		return db.setSqlQuery(user, q).then(result => {
			if(result.rowsAffected.includes(0)) {
				return Promise.reject(new Error('Query did not affect any rows', 500));
			}
			return result;
		});
	}

	/**
	 * Delete a skill from an employee.
	 * @param {string} user The user ID to save to the audit.
	 * @param {number} id The employee ID to delete from.
	 * @param {string} table The table to delete from.
	 */
	deleteSkill(user, id, table) {
		const q = `DELETE FROM ${table} WHERE EmployeeSkillId = ${id}`;
		return db.setSqlQuery(user, q).then(result => {
			if(result.rowsAffected.includes(0)) {
				return Promise.reject(new Error('Query did not affect any rows', 500));
			}
			return result;
		});
	}

	/**
	 * Delete a skill from an employees reviewed list.
	 * @param {string} user The user ID to save to the audit.
	 * @param {number} id The employee ID to delete from.
	 * @param {string} table The table to delete from.
	 */
	deleteReviewedSkill(user, id, table) {
		const q = `DELETE FROM ${table} WHERE EmployeeApprovedSkillId = ${id}`;
		return db.setSqlQuery(user, q).then(result => {
			if(result.rowsAffected.includes(0)) {
				return Promise.reject(new Error('Query did not affect any rows', 500));
			}
			return result;
		});
	}

	/**
	 * Delete all skills from an employee.
	 * @param {string} user The user ID to save to the audit.
	 * @param {number} id The employee ID to delete from.
	 * @param {string} table The table to delete from.
	 */
	deleteSkills(user, id, table) {
		const q = `DELETE FROM ${table} WHERE EmployeeId = ${id}`;
		return db.setSqlQuery(user, q).then(result => {
			if(result.rowsAffected.includes(0)) {
				return Promise.reject(new Error('Query did not affect any rows', 500));
			}
			return result;
		});
	}

	/**
	 * Approves an employee's skill.
	 * @param {string} user The user ID to save to the audit.
	 * @param {Object} skill The skill to approve.
	 */
	approveSkill(user, skill) {
		return db.moveSkill(user, skill, "skills.EmployeeSkill", "skills.EmployeeApprovedSkill");
	}

}

Employees.prototype.getTeam = async((id => {
	const profile = await (Employees.prototype.getEmployeesBy('EmployeeId', id))[0];
	if(profile) {
		return (Employees.prototype.getEmployeesBy('FirstLineReporting', profile.FullName));
	} else {
		return [];
	}
}));

/**
 * Recursively creates a hierarchy of employees.
 * @param {Object} employee The employee to get their team for.
 * @param {string?} id An optional employee ID to find in the hierarchy. 
 */
Employees.prototype.getHierarchy = async(((employee) => {
	const employees = await (Employees.prototype.getEmployees());
	employee.children = getTeam(employees, employee);
	return employee;
}));

const getTeam = (employees, employee) => {
	const firstLine = employees.filter(emp => emp.FirstLineReporting === employee.FullName);
	return firstLine.map(emp => {
		emp.children = getTeam(employees, emp);
		return emp;
	});
}

/**
 * Gets an employee's skills from references.
 * @param {number} id The employee ID.
 * @param {string} table The table to get the skills from.
 */
Employees.prototype.getEmployeeSkills = async(((id, table) => {
	const query = "SELECT * FROM skills.EmployeeSkill WHERE EmployeeId = " + id;
	const query2 = "SELECT * FROM skills.EmployeeApprovedSkill WHERE EmployeeId = " + id;
	const main = table === 'skills.EmployeeSkill';

	const [pending, approved] = await (Promise.all([db.getSqlQuery(query), db.getSqlQuery(query2)]));
	const diff = pending.reduce((count, skill) => {
		const approvedSkill = approved.find(approvedSkill => approvedSkill.EmployeeApprovedSkillAttributeId === skill.EmployeeSkillAttributeId);
		const isSame = approvedSkill &&
			approvedSkill.SkillLevelId === skill.SkillLevelId &&
			approvedSkill.SkillCurrencyId === skill.SkillCurrencyId;
		if (!isSame) {
			count++;
		}
		return count;
	}, 0);
	return {diff: diff, skills: await (skills.refToSkills(main ? pending : approved))};
}));

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function prepForSqlServer(text) {
	var retVal = text;
	retVal = retVal.replaceAll("'", "&apos;");
	return retVal;
}

/**
 * Determines whether or not an employee ID exists in an employee's hierarchy.
 * @param {string} EmployeeId The employee ID to find.
 * @param {string} FullName The full name of the employee's hierarchy to search.
 * @param {boolean} deep Whether or not to search deep.
 */
Employees.prototype.hasAccess = async(((EmployeeId, FullName, deep) => {
	const employees = (await (Employees.prototype.getEmployees()));
	return deepSearch(employees, EmployeeId, FullName);
}));

const deepSearch = (employees, EmployeeId, FullName) => {
	const firstLine = employees.filter(employee => employee.FirstLineReporting == FullName);
	return firstLine.length ? firstLine.some(employee => {
		const isEqual = employee.EmployeeId == EmployeeId;
		return isEqual || deepSearch(employees, EmployeeId, employee.FullName);
	}) : false;
}

/**
 * Determines whether or not a MainStaffNumber exists in an employee's hierarchy.
 * @param {string} FullName The full name of the employee.
 * @param {string} MainStaffNumber The main staff number to find in the hierarchy.
 */
Employees.prototype.hasAccessToImage = async(((FullName, MainStaffNumber) => {
	const employees = (await (Employees.prototype.getEmployees()));
	return deepSearchForImage(employees, FullName, MainStaffNumber);
}));

const deepSearchForImage = (employees, FullName, MainStaffNumber) => {
	const firstLine = employees.filter(employee => employee.FirstLineReporting == FullName);
	return firstLine.length ? firstLine.some(employee => {
		const isEqual = employee.MainStaffNumber == MainStaffNumber;
		return isEqual || deepSearchForImage(employees, employee.FullName, MainStaffNumber);
	}) : false;
}

module.exports = Employees;
