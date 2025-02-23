// Jaswinder Singh - 8972637
// import express, path and ejs 
const express = require('express');
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const User = require('./models/User');
const expressSession = require('express-session')

// Controller files
const dashboardController = require('./controller/dashboard');
const g2TestController = require('./controller/g2TestController');
const gTestController = require('./controller/gTestController');
const loginController = require('./controller/loginController');
const bookG2Controller = require('./controller/bookG2Controller.js');
const findG2Controller = require('./controller/findG2Controller');
const bookGController = require('./controller/bookGController.js');
const signupController = require('./controller/signupController.js');
const signupUserController = require('./controller/signupUserController.js');
const loginUserController = require('./controller/loginUserController.js');
const appointmentController = require('./controller/appointmentController.js');
const postAppointmentController = require('./controller/postAppointmentController.js');

// middleware files
const logoutController = require('./controller/logoutController.js');
const authMiddleware = require('./middleware/authMiddleware.js');
const isDefaultData = require('./middleware/isDefaultData.js');
const appointmentMiddleware = require('./middleware/appointmentMiddleware.js');
const isLoggedInMiddleware = require('./middleware/isLoggedInMiddleware.js');
const Appointment = require('./models/Appointment.js');

// Initialize express app
const app = express();

// setting the template engine as ejs
// Always set it after you have initialized express app
app.set('view engine', 'ejs');

// It will serve static files from the 'public' directory.
app.use(express.static('public'));
// Parse incoming JSON requests and make the payload available under req.body
app.use(express.json());
// Parse incoming URL-encoded data (form submissions) and make the payload available under req.body
app.use(express.urlencoded());

// Listening express app on 5500 port
app.listen(5500, () => {
    console.log("Server is listening at port 5500.")
})

app.use(expressSession({
    secret: 'My name is Jaswinder Singh'
}))

const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

global.loggedIn = null;
global.userType = null;
global.user = null;

app.use("*", async (req, res, next) => {
    loggedIn = req.session.userId ? true : false;
    const loggedUser = await User.findById(req.session?.userId)
    userType = loggedUser ? loggedUser?.userType : null;
    if (loggedUser) {
        loggedUser.formattedDob = formatDate(loggedUser?.dob);
    }
    user = loggedUser;
    next()
})

//Connection string to MongoDB
mongoose.connect('mongodb+srv://jaswindere9:jaswinder1234@cluster0.hr66q.mongodb.net/DriveTestApp?retryWrites=true&w=majority&appName=Cluster0');

// Rendering different pages for our app routes
app.get('/', dashboardController)

app.get('/g2-test', isDefaultData, g2TestController)

app.get('/g-test', isDefaultData, gTestController)

app.get('/login', isLoggedInMiddleware, loginController)

app.get('/signup', isLoggedInMiddleware, signupController)

app.get('/appointment', appointmentMiddleware, appointmentController)

// Route to save g2 data to database
app.post('/book-g2', bookG2Controller)

// Route to fetch g2 user data
app.post('/find-g2', findG2Controller)

// Route to book a G test
app.post('/book-g', bookGController)

// Route to signup a user
app.post('/signup/user', signupUserController)

// Route to login a user
app.post('/login/user', loginUserController)

app.get('/logout', authMiddleware, logoutController)

app.post('/appointments', postAppointmentController);

app.get('/appointments/available', async (req, res) => {
    const { date } = req.query;

    try {
        const appointments = await Appointment.find({ date, isTimeSlotAvailable: true });
        const availableTimes = appointments.map(appointment => appointment.time);

        res.json(availableTimes);
    } catch (error) {
        console.error('Error fetching available appointments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

