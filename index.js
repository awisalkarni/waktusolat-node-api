// Import express
let express = require('express')
// Initialize the app
let app = express();

let bodyParser = require('body-parser');
let mongoose  = require('mongoose');

// Setup server port
var port = process.env.PORT || 8080;

// Add the code below to index.js
// Import routes
let apiRoutes = require("./api-routes")

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/waktusolat-api', { useNewUrlParser: true});

var db = mongoose.connection;

// Use Api routes in the App
app.use('/api', apiRoutes)

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));



// Launch app to listen to specified port
app.listen(port, function () {
     console.log("Running waktusolat api on port " + port);
});