const mongoose = require('mongoose');

const peripheralSchema = mongoose.Schema(
    {
        UID: {
            type: Number,
            require: true
        },
        vendor: {
            type: String,
            require: true

        },
        dateCreated: {
            type: Date
        },
        status: {
            type: Boolean,
            require: true
        }
    }
)

module.exports = mongoose.model('peripheral', peripheralSchema)
