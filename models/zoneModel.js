//zoneModel.js
var mongoose = require('mongoose');
// Setup schema
var zoneSchema = mongoose.Schema({

    code: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }
});

var zone = module.exports = mongoose.model('zone', zoneSchema);
module.exports.get = function (callback, limit) {
    zone.find(callback).limit(limit);
}