const Appointment = require("../models/Appointment");

module.exports = async (req, res) => {
    const { date, times } = req.body;
    const timeArray = times.split(',');

    // Check for existing appointments for the given date and times
    const existingAppointments = await Appointment.find({ date, time: { $in: timeArray } });
    const existingTimes = existingAppointments.map(appointment => appointment.time);

    // Create new appointments only for times that do not already exist
    const newAppointments = timeArray
        .filter(time => !existingTimes.includes(time))
        .map(time => ({
            date,
            time,
            isTimeSlotAvailable: true // Initially, mark as available
        }));

    // If no new appointments to add, respond accordingly
    if (newAppointments.length === 0) {
        return res.status(400).send('No new appointment slots to add. Check for duplicates.');
    }

    try {
        await Appointment.insertMany(newAppointments);
        res.send('Appointments created successfully!');
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send('Error creating appointments: ' + error.message);
    }
}