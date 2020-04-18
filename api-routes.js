// Filename: api-routes.js
// Initialize express router
let router = require('express').Router();
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to waktu-solat api crafted with love!'
    });
});

// Import contact controller
var contactController = require('./controllers/contactController');
var prayTimeController = require('./controllers/prayTimeController');
// Contact routes
router.route('/contacts')
    .get(contactController.index)
    .post(contactController.new);
router.route('/contacts/:contact_id')
    .get(contactController.view)
    .patch(contactController.update)
    .put(contactController.update)
    .delete(contactController.delete);

router.route('/v1/waktu-solat')
	.get(prayTimeController.view)
router.route('/v2/waktu-solat')
	.get(prayTimeController.index)
// Export API routes
module.exports = router;