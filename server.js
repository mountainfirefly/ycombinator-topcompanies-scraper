var express = require('express');
var cron = require('node-cron');
var app = express();

const scraper = require('./scraper');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;
let lastCreatedDate = null

// make express look in the public directory for assets (css/js/img)

// set the home page route
app.get('/', function(req, res) {
    res.send('Welcome! To get y-combinator top companies list go to /ycinfo.json');
});

app.use(express.static(__dirname + '/public'));

cron.schedule('55 21 * * *', function () {
    scraper().then(() => {
        console.log('done');
    })
})

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

