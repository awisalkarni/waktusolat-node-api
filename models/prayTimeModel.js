//prayTimeModel.js
var mongoose = require('mongoose');
// Setup schema
var prayTimeSchema = mongoose.Schema({
    zone: {
        type: String,
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
    pray_time: {
    	type: Number,
    	required: true
    },
    name: {
        type: String,
        required: true
    },
    pray_id: {
        type: Number
    }
});

var PrayTime = module.exports = mongoose.model('pray_time', prayTimeSchema);
module.exports.get = function (callback, limit) {
    PrayTime.find(callback).limit(limit);
}