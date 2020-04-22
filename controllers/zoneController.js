// contactController.js
// Import contact model
Zone = require('../models/zoneModel');
// Handle index actions
exports.index = function (req, res) {
    Zone.find({},{_id: 0},function (err, zone) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            data: zone,
            count: zone.length
        });
    });
};
// Handle create zone actions
exports.new = function (req, res) {
    var zone = new Zone();
    zone.code = req.body.code ? req.body.code : zone.code;
    zone.location = req.body.location;

// save the contact and check for errors
    zone.save(function (err) {
        // if (err)
        //     res.json(err);
res.json({
            message: 'New zone created!',
            data: zone
        });
    });
};
// Handle view zone info
exports.view = function (req, res) {
    Zone.findById(req.params.contact_id, function (err, zone) {
        if (err)
            res.send(err);
        res.json({
            message: 'Zone details loading..',
            data: zone
        });
    });
};
// Handle update zone info
exports.update = function (req, res) {
Zone.findById(req.params.contact_id, function (err, zone) {
        if (err)
            res.send(err);
        zone.code = req.body.code ? req.body.code : zone.code;
        zone.location = req.body.location;

// save the zone and check for errors
        zone.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Zone Info updated',
                data: zone
            });
        });
    });
};
// Handle delete zone
exports.delete = function (req, res) {
    Zone.remove({
        _id: req.params.contact_id
    }, function (err, zone) {
        if (err)
            res.send(err);
res.json({
            status: "success",
            message: 'Zone deleted'
        });
    });
};