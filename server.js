var express = require('express');
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

const getDate = () => {
    const date = new Date();
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}

app.get('/ycinfo.json', function(req, res, next) {
    const todaysDate = getDate();

    if (!lastCreatedDate || lastCreatedDate !== todaysDate) {
        lastCreatedDate = todaysDate;
        scraper().then((res) => {
            next();
        })
    } else {
        next();
    }
});

app.use(express.static(__dirname + '/public'));

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

