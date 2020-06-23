const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BugSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    assignedToId: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    reporterId: {
        type: String,
        required: true 
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateModified: {
        type: Date,
        default: Date.now
    },
    reproduce: {
        type: String,
        required: true
    }
})

var Bug = mongoose.model('Bug', BugSchema);
module.exports = Bug;