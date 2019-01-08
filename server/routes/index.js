var express = require('express');
var console = require('tracer').colorConsole();
var passport = require('passport');
const Error = require('../app/error');
var token = new (require('../app/token.js'));
var router = express.Router();
const async = require('asyncawait/async');
const await = require('asyncawait/await');

var db = require('./../app/db_sql.js');

var employees = new (require('../app/employees.js'));
var skills = new (require('../app/skills.js'));
var users = require('../app/users.js');
var audit = new (require('../app/logger.js'));

// server routes ===========================================================
router.post('/login', async ((req, res, next) => {
    try {
        const jwt = await (token.sign(req.body.username, req.body.password));
        res.json({token: jwt});
    } catch(err) {
        next(err);
    }
}));

router.post('/checkPassword', passport.authenticate('jwt', {session: false}), async ((req, res, next) => {
    if (typeof req.body.password !== 'string') {
        return next(new Error('Invalid parameters sent.', 400));
    }
    try {
        res.json({match: await (users.checkPassword(req.body.password, req.user.EmailAddress))});
    } catch(err) {
        next(err);
    }
}));

router.put('/changePassword', passport.authenticate('jwt', {session: false}), async ((req, res, next) => {
    if (typeof req.body.password !== 'string') {
        return next(new Error('Invalid parameters sent.', 400));
    }
    try {
        res.json({msg: await (users.changePassword(req.body.password, req.user.EmployeeId, req.user.EmailAddress))});
    } catch (err) {
        next(err);
    }
}));

router.get('/profile', passport.authenticate('jwt', {session: false}), async ((req, res, next) => {
    try {
        const profile = await (token.decode(req.get('Authorization').replace('Bearer ', '')));
        res.json({profile: profile});
    } catch(err) {
        next(err);
    }
}));

router.get('/logout', (req, res) => {
    req.logout();
    res.json({message: 'Successfully logged out.'});
});

router.get('/skills', passport.authenticate('jwt', {session: false}), async((req, res, next) => {
    try {
        res.json(await (skills.getSkills()));
    } catch(err) {
        next(err);
    }
}));

router.get('/team/:id', passport.authenticate('jwt', {session: false}), async((req, res, next) => {
    try {
        if(!(req.params.id == req.user.EmployeeId || await (employees.hasAccess(req.params.id, req.user.FullName)))) {
            return next(new Error('You do not have access to view this employee\'s team.', 403));
        }
        res.json(await (employees.getTeam(req.params.id)));
    } catch (err) {
        next(err);
    }
}));

router.get('/employees/:id/skills', passport.authenticate('jwt', {session: false}), async((req, res, next) => {
    if(!(req.params.id == req.user.EmployeeId || await (employees.hasAccess(req.params.id, req.user.FullName)))) {
        return next(new Error('You do not have access to view this employee\'s skills.', 403));
    }
    try {
        res.json(await (employees.getEmployeeSkills(req.params.id, "skills.EmployeeSkill")));
    } catch(err) {
        next(err);
    }
}));

router.get('/employees/:id/approvedskills', passport.authenticate('jwt', {session: false}), async((req, res, next) => {
    if(!(req.params.id == req.user.EmployeeId || await (employees.hasAccess(req.params.id, req.user.FullName)))) {
        return next(new Error('You do not have access to view this employee\'s skills.', 403));
    }
    try {
        res.json(await (employees.getEmployeeSkills(req.params.id, "skills.EmployeeApprovedSkill")));
    } catch(err) {
        next(err);
    }
}));

router.post('/employees/:id/skills', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    if(req.params.id != req.user.EmployeeId) {
        return next(new Error('You do not have access to add to this employee\'s skills.', 403));
    }
    try {
        const response = await(employees.addSkill(req.user.EmployeeId, req.params.id, req.body.skill, "skills.EmployeeSkill"));
        res.json({new: response.recordset[0][""]});
    } catch(err) {
        next(err);
    }
});

router.put('/employees/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    if(req.params.id != req.user.EmployeeId) {
        return next(new Error('You do not have access to edit this employee.', 403));
    }
    try {
        res.json(await(employees.updateEmployee(req.user.EmployeeId, req.body.employee)));
    } catch(err) {
        next(err);
    }
});

router.put('/employees/:empid/skills/:id?', passport.authenticate('jwt', {session: false}), function (req, res, next) {

    try {
        if(req.query && req.query.action === 'approve') {
            if(!await(employees.hasAccess(req.params.empid, req.user.FullName))) {
                return next(new Error('You do not have access to approve this employee\'s skills.', 403));
            }
            res.json(await(employees.approveSkill(req.user.EmployeeId, req.body.skill)));
        } else {
            if(req.params.empid != req.user.EmployeeId) {
                return next(new Error('You do not have access to edit this employee\'s skills.', 403));
            }
            res.json(await(employees.updateSkill(req.user.EmployeeId, req.body.skill, "skills.EmployeeSkill")));
        }
    } catch(err) {
        next(err);
    }

});

router.delete('/employees/:empid/skills/:id', passport.authenticate('jwt', {session: false}), function (req, res, next) {
    if(req.params.empid != req.user.EmployeeId) {
        return next(new Error('You do not have access to delete this employee\'s skills.', 403));
    }
    try {
        if(req.query && req.query.action === 'unapprove') {
            res.json(await(employees.deleteReviewedSkill(req.user.EmployeeId, req.params.id, "skills.EmployeeApprovedSkill")));
        } else {
            res.json(await(employees.deleteSkill(req.user.EmployeeId, req.params.id, "skills.EmployeeSkill")));
        }
    } catch(err) {
        next(err);
    }
});

module.exports = router;
