const router = require('express').Router();
const passport = require('passport');
const Error = require('./error');
const Employees = new (require('./employees'));
const async = require('asyncawait/async');
const await = require('asyncawait/await');

router.use('/:filename', passport.authenticate('jwt', {session: false}), async((req, res, next) => {
    const filename = req.params.filename.split('.')[0];
    if (filename === req.user.MainStaffNumber || await (Employees.hasAccessToImage(req.user.FullName, filename))) {
        next();
    } else {
        next(new Error('You do not have access to view this image.', 403));
    }
}));

module.exports = router;