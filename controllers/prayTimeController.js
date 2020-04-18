//prayTimeController.js

PrayTime = require('../models/prayTimeModel');
// Handle index actions
exports.index = function (req, res) {
    PrayTime.get(function (err, praytimes) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Contacts retrieved successfully",
            data: praytimes
        });
    });
};