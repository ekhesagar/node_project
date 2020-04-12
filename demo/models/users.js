let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: String,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    campgrounds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Campground'
        }
    ]
});

let User = mongoose.model('User', userSchema);

module.exports = User;