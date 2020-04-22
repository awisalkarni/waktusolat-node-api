//prayTimeController.js

PrayTime = require('../models/prayTimeModel');
Zone = require('../models/zoneModel');
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

exports.view = async function(req, res) {
	console.log(req.query)
    var query = { month: parseInt(req.query.month, 10), year: parseInt(req.query.year, 10), zone: req.query.zone.toUpperCase()};
    var columns = { day:1, prayer_time:1, _id:0 };
    var zone;

    await Zone.findOne({code: req.query.zone.toUpperCase()}, function(err, row) { 
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        zone = row;
    });

    if (zone == undefined) {
        res.json({
            status: "Error",
            message: "Zone not found"
        })
    }
	PrayTime.find(query, columns, function(err, praytimes) {
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
        	prayTime.push(parseInt(item.prayer_time));
        	count++;
        	if (count==8) {
        		prayTimesArray.push(prayTime);
        		count = 0;
        	}
        });

        res.json({
            
        	data: {
        		pray: {
        			pray_list: [
        			"Imsak",
        			"Subuh",
        			"Syuruk",
        			"Dhuha",
        			"Zohor",
        			"Asar",
        			"Maghrib",
        			"Isyak"
        			],
        			pray_time : prayTimesArray
        		},
        		zone: zone.code,
        		origin: zone.location,
        		month: req.query.month,
            	year: req.query.year
            },
            meta: "success"
        });
	}).sort( {pray_time: 1} );
}