// Import the mongoose library
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Get the Schema constructor from mongoose
const Schema = mongoose.Schema;

// Define the User schema with fields for personal information and car details
const UserSchema = new Schema({
    username: String,
    password: String,
    userType: String,
    firstname: { type: String, default: "default" },
    lastname: { type: String, default: 'default' },
    licenseNo: { type: String, default: 'default' },
    age: { type: Number, default: 0 },
    dob: { type: Date, default: new Date('2000-01-01') },
    car_details: {
        make: { type: String, default: 'default' },
        model: { type: String, default: 'default' },
        year: { type: Number, default: 0 },
        platno: { type: String, default: 'default' }
    }
});

UserSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, 8, (error, hash) => {
        user.password = hash
        next();
    })
})

// Create a User model using the defined schema
const User = mongoose.model('user', UserSchema);

// Export the User model to use it in other parts of the application
module.exports = User;