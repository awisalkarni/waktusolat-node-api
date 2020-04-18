//prayTimeModel.js
var mongoose = require('mongoose');
// Setup schema
var prayTimeSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
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
    pray: {
    	type: Number,
    	required: true
    }
});

var PrayTime = module.exports = mongoose.model('pray_time', prayTimeSchema);
module.exports.get = function (callback, limit) {
    PrayTime.find(callback).limit(limit);
}