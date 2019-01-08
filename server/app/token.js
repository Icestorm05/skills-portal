const passport = require('passport');
const users = require('./users.js');
const employees = new (require('./employees.js'));
const { ExtractJwt, Strategy } = require('passport-jwt');
const { sign, decode } = require('jsonwebtoken');
const Error = require('./error.js');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const secret = 'skills_portal_1736927';

passport.use(new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}, async((jwt_payload, done) => {
    if(!jwt_payload.EmployeeId) {
        return done(new Error('Unauthorised', 401));
    }
    const employee = (await (employees.getEmployeesBy('EmployeeId', jwt_payload.EmployeeId)))[0];
    if(employee) {
        done(null, {
            EmployeeId: jwt_payload.EmployeeId,
            FullName: jwt_payload.FullName,
            MainStaffNumber: jwt_payload.MainStaffNumber,
            EmailAddress: jwt_payload.EmailAddress
        });
    } else {
        done(new Error('Unauthorised', 401));
    }
})));

module.exports = class Token {
    
    /**
     * Creates a JWT if user is valid.
     * @param {string} email The email address.
     * @param {string} password The password.
     */
    sign(email, password) {
        const [employee, user] = await (Promise.all([
            employees.getEmployeesBy('EmailAddress', email),
            users.get('Username', email)
        ]));
        if(!employee[0]) {
            throw new Error('No employee found.', 404);
        }
        if(password && password !== user[0].Password) {
            throw new Error('Incorrect password.', 401);
        }
        const token = sign({
            EmployeeId: employee[0].EmployeeId,
            FullName: employee[0].FullName,
            MainStaffNumber: employee[0].MainStaffNumber,
            EmailAddress: employee[0].EmailAddress
        }, secret, { expiresIn: '5h' });
        return token;
    }

    /**
     * Decodes a token and gets the user associated with it.
     * @param {string} token The JWT.
     */
    decode(token) {
        const payload = decode(token);
        if(!payload) {
            throw new Error('Invalid token.', 403);
        }
        let employee = (await (employees.getEmployeesBy('EmployeeId', payload.EmployeeId.toString())))[0];
        if(!employee) {
            throw new Error('No employee found.', 404);
        }
        employee = await (employees.getHierarchy(employee));
        return employee;
    }

};
