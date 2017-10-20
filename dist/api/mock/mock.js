'use strict';

exports.sample = function (req, res) {
    var user = {};
    user.username = req.param('username');
    user.password = req.param('password');
    res.json(user);
};
//# sourceMappingURL=mock.js.map