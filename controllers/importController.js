//import controller
PrayTime = require('../models/prayTimeModel');
exports.praytime = function (req, res) {
	var url = "https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=year&zone="+req.body.zone;

	// console.log(req)

	var request = require('request');
	var options = {
		'method': 'GET',
		'url': url
	};
	request(options, function (error, response) { 
		if (error) throw new Error(error);

		responseBody = response.body.replace('Mac', 'Mar');
		data = JSON.parse(responseBody);
		prayerTime = data.prayerTime;
		for (var prayerDay in prayerTime) {
			var date = prayerTime[prayerDay].date.replace('Mac', 'Mar').replace('Mei', 'May').replace('Jul', 'July').replace('Ogos', 'Aug').replace('Sep', 'Sept').replace('Okt', 'Oct').replace('Dis', 'Dec');
			dateParsed = Date.parse(date);
			console.log(dateParsed);

			// var zone = new Zone();
			// zone.code = req.body.code ? req.body.code : zone.code;
			// zone.location = req.body.location;

			// zone.save(function (err) {
			// 	res.json({
			// 		message: 'New zone created!',
			// 		data: zone
			// 	});
			// });
		}

		res.json({
			success: true
		})
		// console.log(data.prayerTime);
		// data.each(function(value, key){

		// });
		
	});

};