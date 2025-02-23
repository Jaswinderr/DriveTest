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
        // Destructure necessary fields from the request body
        const { licenseNumber, make, model, year, plateNumber } = req.body;
        // Find a user by their license number and update their car details
        const user = await User.findOneAndUpdate({ licenseNo: licenseNumber },
            {
                "car_details.make": make,
                "car_details.model": model,
                "car_details.year": year,
                "car_details.platno": plateNumber
            },
            {
                new: true
            }
        )
        user.formattedDob = formatDate(user?.dob);
        // Render the 'gTest' view with a success message
        res.render('gTest', { user, message: "You have booked your test successfully!" })
    }
    catch (error) {
        //  Log any errors to the console and render the 'gTest' view without a user or message
        console.log(error);
        res.render('gTest', { user: null, message: null })
    }
}