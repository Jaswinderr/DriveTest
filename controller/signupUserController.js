const User = require('../models/User');

module.exports = async (req, res) => {
    try {
        const { username, password, confirmPassword, userType } = req.body

        const userData = {
            username: username,
            password: password,
            userType: userType
        }
        if (password === confirmPassword) {
            await User.create(userData).then(() => {
                res.redirect('/login')
            })
        } else {
            res.redirect('/signup')
        }
    } catch (error) {
        console.log(error)
    }
}