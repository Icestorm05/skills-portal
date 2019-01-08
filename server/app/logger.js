"use strict";
const config = require('./../config.js');
const MongoClient = require('mongodb').MongoClient;
const console = require('tracer').colorConsole();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const url = config.auditDb.user ?
	'mongodb://'  +  config.auditDb.user + ':' + config.auditDb.password + '@'  + config.auditDb.server + ':' + config.auditDb.port + '/' + config.auditDb.database
	: 'mongodb://' + config.auditDb.server + ':' + config.auditDb.port + '/' + config.auditDb.database;

module.exports = class Audit {

	/**
	 * Saves an audit record.
	 * @param {string} who who ran the query.
	 * @param {string} what What query was run.
	 * @param {Date} when When the query was run.
	 */
	save(who, what, when) {
		return MongoClient.connect(url).then(async(db => {
			const result = await (db.collection(config.auditDb.collection).insertOne({
				who: who,
				what: what,
				when: when
			}));
			db.close();
			return result;
		}));
	}

	/**
	 * Gets an audit record.
	 * @param {string} filter What to filter by.
	 * @param {string} sort What to sort by.
	 * @param {number} limit The max amount of records to return.
	 */
	get(filter, sort, limit) {
		return MongoClient.connect(url).then(async(db => {
			const result = await (db.collection(config.auditDb.collection).find(filter).sort(sort).limit(limit).toArray());
			db.close();
			return result;
		}));
	}

}
