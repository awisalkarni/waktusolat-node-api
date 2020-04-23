//import controller
var moment = require('moment');
moment().format();

PrayTime = require('../models/prayTimeModel');
Zone = require('../models/zoneModel');

exports.praytime = async function (req, res) {

	for await (const zone of Zone.find()) {
		downloadPrayTime(zone.code, res);
	}

	res.json({
		success: true
	});

};

function downloadPrayTime(zone, res){
	
	var url = "https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=year&zone="+zone;

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

		
		var prayTimeArray = [];

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

			dateParsed = moment(date, "DD-MMM-YYYY");
			hijriDate = prayerTime[prayerDay].hijri;

			var month = dateParsed.month()+1;
			var year = dateParsed.year();
			var day = dateParsed.date();

			var imsak = moment(date + ' ' + prayerTime[prayerDay].imsak, "DD-MMM-YYYY HH:mm:ss").format('X');
			var subuh = moment(date + ' ' + prayerTime[prayerDay].fajr, "DD-MMM-YYYY HH:mm:ss").format('X');
			var syuruk = moment(date + ' ' + prayerTime[prayerDay].syuruk, "DD-MMM-YYYY HH:mm:ss").format('X');
			
			var zohor = moment(date + ' ' + prayerTime[prayerDay].dhuhr, "DD-MMM-YYYY HH:mm:ss").format('X');
			var asar = moment(date + ' ' + prayerTime[prayerDay].asr, "DD-MMM-YYYY HH:mm:ss").format('X');
			var maghrib = moment(date + ' ' + prayerTime[prayerDay].maghrib, "DD-MMM-YYYY HH:mm:ss").format('X');
			var isyak = moment(date + ' ' + prayerTime[prayerDay].isha, "DD-MMM-YYYY HH:mm:ss").format('X');

			var dhuha = (parseInt(syuruk)-parseInt(subuh))/3 + parseInt(syuruk) + "";

			
			prayTimeArray.push({ pray_id: 1, hijri_date: hijriDate, name: "imsak", prayer_time: imsak, year: year, month: month, zone: zone, day: day});
			prayTimeArray.push({ pray_id: 2, hijri_date: hijriDate, name: "subuh", prayer_time: subuh, year: year, month: month, zone: zone, day: day });
			prayTimeArray.push({ pray_id: 3, hijri_date: hijriDate, name: "syuruk", prayer_time: syuruk, year: year, month: month, zone: zone, day: day });
			prayTimeArray.push({ pray_id: 4, hijri_date: hijriDate, name: "dhuha", prayer_time: dhuha, year: year, month: month, zone: zone, day: day });
			prayTimeArray.push({ pray_id: 5, hijri_date: hijriDate, name: "zohor", prayer_time: zohor, year: year, month: month, zone: zone, day: day });
			prayTimeArray.push({ pray_id: 6, hijri_date: hijriDate, name: "asar", prayer_time: asar, year: year, month: month, zone: zone, day: day });
			prayTimeArray.push({ pray_id: 7, hijri_date: hijriDate, name: "maghrib", prayer_time: maghrib, year: year, month: month, zone: zone, day: day });
			prayTimeArray.push({ pray_id: 8, hijri_date: hijriDate, name: "isyak", prayer_time: isyak, year: year, month: month, zone: zone, day: day });
			
		}

		console.log(prayTimeArray.length);

		PrayTime.insertMany(prayTimeArray).then(function(docs){
			console.log('%d amount of pray times added for %s', docs.length, zone);
			// return docs.length;
		}).catch(function(e){
			console.log(e);
			// return 0;
		});


		

		
	});
}