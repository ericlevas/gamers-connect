const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
	gameTitle:{
        type: String,
        required: true
    },
	description: {
        type: String,
        required: true
    },
	start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    creator:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Event',eventSchema);