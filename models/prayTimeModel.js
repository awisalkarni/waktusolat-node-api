//prayTimeModel.js
var mongoose = require('mongoose');
// Setup schema
var prayTimeSchema = mongoose.Schema({
    pray_id: {
        type: Number,
        required: true
    },
    zone: {
        type: String,
        required: true
    },
    hijri_date: {
        type: String
    },
    day: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    prayer_time: {
    	type: String,
    	required: true
    },
    name: {
        type: String,
        required: true
    }
}, {timestamps: true});

var PrayTime = module.exports = mongoose.model('pray_time', prayTimeSchema);
module.exports.get = function (callback, limit) {
    PrayTime.find(callback).limit(limit);
}