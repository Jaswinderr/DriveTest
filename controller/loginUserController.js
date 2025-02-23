const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (user) {
            const isUserSame = await bcrypt.compare(password, user.password);

            if (isUserSame) {
                req.session.userId = user._id;
                req.user = user;
                res.redirect('/')
            } else {
                res.render('login', { message: "Incorrect username or password, Please sign up if you have not yet." })
            }
        } else {
            res.render('login', { message: "Incorrect username or password, Please sign up if you have not yet." })
        }



    } catch (error) {
        console.log(error);
    }
}