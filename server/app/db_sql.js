const console = require('tracer').colorConsole();
const config = require('../config.js');
const sql = require('mssql');
const audit = new (require('../app/logger.js'));
const error = require('./error.js');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

/**
 * Connect to SQL Server.
 */
async(() => {
	try {
		await (sql.connect(config.db));
		console.log(`Successfully connected to db ${config.db.server}`);
	} catch(err) {
		console.log(err);
		console.error(`Failed to connect to db ${config.db.server}`);
	}
})();

module.exports = class DBSQL {

	/**
	 * Sends a query.
	 * @param {string} q The query to send.
	 */
	query(q) {
		return new sql.Request().query(q).then(result => {
			if(!result) {
				return Promise.reject(new Error('Unhandled Query', 500));
			}
			return result;
		});
	}

	/**
	 * Sends a query and returns the recordset.
	 * @param {string} q The query to send.
	 */
	getSqlQuery(q) {
		return this.query(q).then(result => result.recordset);
	}

	/**
	 * Sends a query and saves it in the audit.
	 * @param {string} user The user ID to save in the audit.
	 * @param {string} q The query to send.
	 */
	setSqlQuery(user, q) {
		return this.query(q).then(async(result => {
			await (audit.save(user, q, new Date()));
			return result;
		}));
	}

	/**
	 * Moves a skill from pending to approved.
	 * @param {string} user The user ID to save in the audit.
	 * @param {Object} row The row.
	 * @param {string} source From.
	 * @param {string} dest To.
	 */
	moveSkill(user, row, source, dest) {
		let inCols = "";
		let inVals = ""; 
		let set = "";

		for (let k in row) {
		    if (row.hasOwnProperty(k)) {
		    	if (k == 'SkillCurrencyId' || k == 'SkillLevelId') set += k + " = " + row[k] + ", ";

		    	if (k == 'EmployeeSkillId') continue;
		    	if (k == 'EmployeeSkillAttributeId') {
		    		inCols += 'EmployeeApprovedSkillAttributeId, ';
		    	} else {
		    		inCols += k + ', ';
				}
				if(typeof row[k] === 'string') {
					row[k] = "'" + row[k] + "'";
				}
		    	inVals += row[k] + ', ';
		    }
		}

		inCols = inCols.slice(0, -2);
		inVals = inVals.slice(0, -2);
		set = set.slice(0, -2);

		const x = row.EmployeeId;
		const y = row.EmployeeSkillAttributeId;

		const ins = "INSERT INTO " + dest + " ("  + inCols + ") VALUES (" +  inVals +  ") ";
		const upd = "UPDATE " + dest + " SET " + set + " WHERE EmployeeId = " + x + " AND EmployeeApprovedSkillAttributeId = " + y;
	
		const chk = "SELECT * FROM " + dest + " WHERE EmployeeID = " + x + " AND EmployeeApprovedSkillAttributeId = " + y;
		const q = "IF NOT EXISTS (" + chk + ") " + ins +  " ELSE " + upd;

		return this.setSqlQuery(user, q);
	}
}
