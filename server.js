var express = require('express');
var app = express();
const cron = require('node-cron');
const scraper = require('./scraper');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function(req, res) {

    // ejs render automatically looks in the views folder
    res.send('Welcome! To get y-combinator top companies list go to /ycinfo.json');
});

// Cron Job
cron.schedule('1 25 11 * *', () => {
    console.log('running a task every minute');
    scraper();
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
