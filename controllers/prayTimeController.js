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
	PrayTime.find({ month: parseInt(req.query.month, 10), year: parseInt(req.query.year, 10), zone: req.query.zone}, { pray_time:1, _id:0 }, function(err, praytimes) {
		 if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }

        // praytimes = praytimes.sort({pray_time:1});
        var count = 0;
        var prayTimesArray = [];
        var prayTime = [];

        praytimes.forEach(function(item, index) {

        	if (count == 0) {
        		prayTime = [];
        	}
        	// console.log(prayTime);
        	prayTime.push(item.pray_time);
        	count++;
        	if (count==8) {
        		prayTimesArray.push(prayTime);
        		count = 0;
        	}
        });

        res.json({
            
            data: {
            	pray: {
            		pray_time : prayTimesArray
            	}
            },
            meta: "success",
            zone: req.query.zone
        });
	}).sort( {pray_time: 1} );
}