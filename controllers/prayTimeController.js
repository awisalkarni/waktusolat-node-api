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

exports.view = function(req, res) {
	console.log(req.query)
	PrayTime.find({ month: 1, year: 2020, zone: 'sgr03'}, function(err, praytimes) {
		 if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }

        res.json({
            success: "success",
            message: "Contacts retrieved successfully",
            data: {
            	pray: {
            		pray_time : praytimes
            	}
            }
        });
	});
}