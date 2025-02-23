const User = require("../models/User")

module.exports = async (req, res) => {
    const user = await User.findOne({ _id: req.session.userId })
    if (user?.licenseNo === 'default') {
        res.redirect('/g2-test');
    } else {
        res.render('gTest', { message: null })
    }
}