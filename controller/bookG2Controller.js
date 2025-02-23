const Appointment = require('../models/Appointment');
const User = require('../models/User');

module.exports = async (req, res) => {
    const { appointmentDate, time } = req.body;

    const appointment = await Appointment.findOne({
        date: appointmentDate,
        time: time,
        isTimeSlotAvailable: true
    });
    console.log(appointmentDate, time)

    if (!appointment) {
        return res.status(400).send('Selected time slot is not available.');
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
        return res.status(400).send('User not found.');
    }

    user.appointment = appointment._id;
    await user.save();

    appointment.isTimeSlotAvailable = false;
    await appointment.save();

    res.send('Appointment booked successfully!');
}