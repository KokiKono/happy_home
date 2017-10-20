exports.login = function (req, res) {
    var user = {};
    user.username = req.param('username');
    user.password = req.param('password');
    res.json(user);
}