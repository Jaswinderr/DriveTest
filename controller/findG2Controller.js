const User = require('../models/User');

// Function to format the date in 'YYYY-MM-DD' format
const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

module.exports = async (req, res) => {
    try {
        // Find a user by their license number
        const user = await User.findOne({ licenseNo: req.body.licenseNumber })
        if (user) {
            // Add the formatted date of birth to the user object
            user.formattedDob = formatDate(user.dob);
            // Render the 'gTest' view with the user data
            res.render('gTest', { user, message: null });
        } else {
            // Render the 'gTest' view with a 'No User Found' message if no user is found
            res.render('gTest', { user: null, message: 'No User Found' })
        }
    } catch (error) {
        console.log(error)
    }
}