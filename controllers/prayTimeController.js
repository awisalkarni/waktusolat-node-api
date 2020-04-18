//prayTimeController.js

PrayTime = require('../models/prayTimeModel');
// Handle index actions
exports.index = function (req, res) {
    PrayTime.get(function (err, praytimes) {
    	console.log(praytimes);
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "PrayTimes retrieved successfully",
            data: praytimes
        });
    });
};

exports.view = function(req, res) {
	console.log(req.query)
	PrayTime.find({ month: 1, year: 2020, zone: 'sgr03'}, {pray_time:1, _id:0}, function(err, praytimes) {
		 if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        var count = 0;
        var prayTimesArray = [];
        console.log(praytimes);

        // praytimes.forEach(function(item, index) {
        // 	if (count == 0) {
        // 		var prayTime = [];
        // 	}
        	
        // 	prayTime.push(item.pray_time);
        // 	count++;
        // 	if (count==8) {
        // 		prayTimesArray.push(prayTime);
        // 		count = 0;
        // 	}
        // });

        res.json({
            meta: "success",
            message: "waktusolat retrieved successfully",
            data: {
            	pray: {
            		pray_time : praytimes
            	}
            }
        });
	});
}