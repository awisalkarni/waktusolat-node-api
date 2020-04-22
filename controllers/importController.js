//import controller
var moment = require('moment');
moment().format();

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
			var date = prayerTime[prayerDay].date
			.replace('Mac', 'Mar')
			.replace('Mei', 'May')
			.replace('Jul', 'July')
			.replace('Ogos', 'Aug')
			.replace('Sep', 'Sept')
			.replace('Okt', 'Oct')
			.replace('Dis', 'Dec')
			.toLowerCase();

			dateParsed = moment(date, "D-MMM-YYYY");

			var month = dateParsed.month()+1;
			var year = dateParsed.year();
			var imsak = moment(date + ' ' + prayerTime[prayerDay].imsak, "D-MMM-YYYY HH:mm:ss").format('X');
			var subuh = moment(date + ' ' + prayerTime[prayerDay].fajr, "D-MMM-YYYY HH:mm:ss").format('X');
			var syuruk = moment(date + ' ' + prayerTime[prayerDay].syuruk, "D-MMM-YYYY HH:mm:ss").format('X');
			
			var zohor = moment(date + ' ' + prayerTime[prayerDay].dhuhr, "D-MMM-YYYY HH:mm:ss").format('X');
			var asar = moment(date + ' ' + prayerTime[prayerDay].asr, "D-MMM-YYYY HH:mm:ss").format('X');
			var maghrib = moment(date + ' ' + prayerTime[prayerDay].maghrib, "D-MMM-YYYY HH:mm:ss").format('X');
			var isyak = moment(date + ' ' + prayerTime[prayerDay].isha, "D-MMM-YYYY HH:mm:ss").format('X');

			var dhuha = (parseInt(syuruk)-parseInt(subuh))/3 + parseInt(syuruk);

			var praytime = new PrayTime();
			praytime.month = month;
			praytime.zone = req.body.zone;
			praytime.year = year;
			praytime.pray_time = imsak;
			praytime.name = imsak;
			praytime.pray_id = 1;

			praytime.save();

			
		}

		res.json({
			success: true
		})
		// console.log(data.prayerTime);
		// data.each(function(value, key){

		// });
		
	});

};