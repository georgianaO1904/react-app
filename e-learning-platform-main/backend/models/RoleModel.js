const mongoose = require('mongoose')

const rolesSchema = new mongoose.Schema({
    role: {
        type: String,
        required: [true, "Please enter role name"],
        trim: true,
        unique: true
    },
    permissions: {
        type: [{ type: String}],
        required: [true, "Please enter permissions list"],
        trim: true
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Roles", rolesSchema)