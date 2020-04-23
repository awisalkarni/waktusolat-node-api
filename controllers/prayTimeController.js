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

    var zoneQuery = req.query.zone.toUpperCase();
    var monthQuery = parseInt(req.query.month, 10)
    var yearQuery = parseInt(req.query.year, 10);

    var query = { month: monthQuery, year: yearQuery, zone: zoneQuery};
    
    var response = await downloadPrayTimes(query);

    if (response.success) {
        var zone = response.zone;
        var prayTimes = response.pray_times;

        var count = 0;
        var day = 1;
        var prayTimesArray = [];
        var prayTime = [];

        prayTimes.forEach(function(item, index) {
            if (count == 0) {
                prayTime = [];
                // prayTime.push({hijri_date: item.hijri_date, date: item.year + "-" + item.month + "-" + item.day})
            }
            prayTime.push(parseInt(item.prayer_time));

            count++;
            if (count==8) {
                prayTime.sort();
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
                month: monthQuery,
                year: yearQuery
            },
            meta: "success"
        });

    } else {
        res.json({
            status: "Error",
            message: "Zone not found"
        })
    }
}

async function downloadPrayTimes(query){
    var response;
    var zone;

    await Zone.findOne({code: query.zone}, {_id: 0}, function(err, row) { 
        if (err) {
            response = {success: false, message: err};
        }
        zone = row;
    });

    if (zone == undefined) {
        response = {success: false, message: "Zone not found"};
    }

    var prayTimes = await PrayTime.find(query).sort({day: 1}).exec();

    return {success: true, pray_times: prayTimes, zone: zone};
}

exports.view_version_2 = async function(req, res) {
    var zoneQuery = req.query.zone.toUpperCase();
    var monthQuery = parseInt(req.query.month, 10)
    var yearQuery = parseInt(req.query.year, 10);

    var query = { month: monthQuery, year: yearQuery, zone: zoneQuery};
    
    var response = await downloadPrayTimes(query);

    if (response.success) {
        var zone = response.zone;
        var prayTimes = response.pray_times;

        var count = 0;
        var day = 1;
        var prayTimesArray = [];
        var prayTime = {};

        prayTimes.forEach(function(item, index) {
            if (count == 0) {
                prayTime = {};
                prayTime["hijri_date"] = item.hijri_date
                prayTime["date"] = item.year + "-" + item.month + "-" + item.day;
            }
            prayTime[item.name] = parseInt(item.prayer_time);

            count++;
            if (count==8) {
                // prayTime.sort();
                prayTimesArray.push(prayTime);
                count = 0;
            }
        });

        res.json({
            success: true,
            data: {
                zone: zone,
                month: monthQuery,
                year: yearQuery,
                pray_time : prayTimesArray
            }
     
        });

    } else {
        res.json({
            status: "Error",
            message: "Zone not found"
        })
    }
}

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}