const cron = require('node-cron');

const scraper = require('./scraper');

// Cron Job
cron.schedule('5 12 * * *', () => {
    console.log('running a task every minute');
    scraper();
});


