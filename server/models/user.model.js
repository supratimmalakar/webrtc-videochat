const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    username: {
        type: String,
        required: true,
        min: 6,
        max: 255,
        validate : {
            validator : username => {
                const usernameRegex = /^[a-zA-Z0-9]+$/;
                return username.match(usernameRegex);
            },
            message : props => `${props.value} is not a valid username`
        }
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 255,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    contacts: [mongoose.SchemaTypes.ObjectId]
})

module.exports = mongoose.model("User", userSchema);