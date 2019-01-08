var console = require('tracer').colorConsole();
var config = require('./../config.js');
var db = new (require('./../app/db_sql.js'));
var Error = require('./error');
var bcrypt = require('bcrypt');

const checkPassword = async(oldPassword, email) => {
	const query = `SELECT * FROM admin.[User] WHERE Username = '${email}'`;
	const user = await db.getSqlQuery(query).catch(e => false);
	if (!(user && user[0])) {
		throw new Error('User not found.', 404);
	}
	const match = await bcrypt.compare(oldPassword, user[0].Password) || oldPassword === user[0].Password;
	if (!match) {
		throw new Error('Password does not match.', 403);
	}
	return true;
}

const changePassword = async(newPassword, id, email) => {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(newPassword, salt);
	const query = `UPDATE admin.[User] SET Password = '${newPassword}' WHERE Username = '${email}'`;
	await db.setSqlQuery(id, query).catch(e => {
		throw new Error('Failed to change password.');
	});
	return 'Successfully changed password.';
}

const get = (key, val) => {
	const query = `SELECT * FROM admin.[User] WHERE ${key} = '${val}'`;
	return db.getSqlQuery(query);
}

module.exports = {
	get,
	getById: function (id, callback) {
		return getUserById(+id, callback);
	},
	getUserByEmail: function(email) {
		return getUserByEmail(email);
	},
	addUser: function (auditUser, newUser, callback) {
		return addUser(auditUser, newUser, callback);
	},
	updateUser: function (auditUser, user, callback) {
		return updateUser(auditUser, user, callback);
	},
	deleteUser: function (auditUser, id, callback) {
		return deleteUser(auditUser, +id, callback);
	},
	checkPassword,
	changePassword,
}

function getUsers(q, callback) {
	var l = 10;
	if (q && q.limit) l = +q.limit;

	var query = "SELECT TOP " + l + " UserID,  Username FROM admin.[User]";
	db.getQuery(query, function (err, r) {
		return callback([{method: "getUsers", err: err, q: query, results: r}]);
	});
}

function getUserById(id, callback) {
	var query = "SELECT UserID, Username FROM admin.[User] WHERE UserId="+ id;
	db.getQuery(query, function (err, r) {
		return callback([{method: "getUserById", err: err, q: query, results: r}]);
	});
}

function getUserByEmail(email) {
	const query = `SELECT Username FROM admin.[User] WHERE lower(Username)='${email}'`;
	return new Promise((resolve, reject) => {
		db.getQuery(query, function (err, r) {
			if(err) {
				reject(err);
			}
			resolve([{method: "getUserByEmail", err: err, q: query, results: r}]);
		});
	});
}

function addUser(auditUser, newUser, callback) {
    var query = "INSERT INTO admin.[User]( username, password ) ";
    query += " VALUES ( '" + newUser.username + "', '" + newUser.password + "' ) ";
    console.log(query)
    db.setQuery(auditUser, query, function (err, r) {
		return callback({method: "addUser", err: err, q: query, results: r});
	});
}

function updateUser(auditUser, user, callback) {
	var updateableFields = ['password'];

	var query = "UPDATE admin.[User] SET ";

	for (var i = 0; i < updateableFields.length; i++) {
		var f = updateableFields[i];
		if (user[f])  query += f + " = '" + user[f] + "', ";
	}

	query = query.slice(0, -2);
	query += " WHERE UserId = " + +user.UserId;

	console.log(query);
	db.setQuery(auditUser, query, function (err, r) {
		return callback({method: "updateEmp", err: err, q: query, results: r});
	});
}

function deleteUser(auditUser, id, callback) {
    var query = "DELETE FROM admin.[User] WHERE UserId = " + id;
    console.log(query)
    db.setQuery(auditUser, query, function (err, r) {
		return callback({method: "deleteUser", err: err, q: query, results: r});
	});
}
