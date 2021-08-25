const cheerio = require('cheerio')
const request = require('request')
const fs = require('fs')

const fieldOrder = [
  'name',
  'rank',
  'description',
  'sector',
  'jobs-created',
  'batch',
  'ycg-batch',
  'headquarters',
  'careers',
]

module.exports = () => {
  return new Promise((resolve, reject) => {
    request({ url: 'https://www.ycombinator.com/topcompanies', gzip: true }, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        const data = [];
        $('.companies-table').children('tbody').children('tr').each(function(i, element){
          const startup = {};
          $(this).children('td').each(function(i, element) {
            const currentField = fieldOrder[i];

            if (currentField === 'name') {
              startup.name = $(this).find('.company-name').text();
              const url = $(this).find('.company-name').attr('href');
              if (url) {
                startup.key = url.split('.')[0].substring(1);
              }
            } else if (currentField === 'careers') {
              const url = $(this).find('a').attr('href');
              startup[currentField] = url;
            } else {
              startup[currentField] = $(this).text();
            }
          })
          data.push(startup);
        });

        // Writing data to ycInfo.json file
        fs.writeFile("./public/ycinfo.json", JSON.stringify(data), (err) => {
          if (err) {
              reject();
              return;
          };
          console.log("File has been created");
          resolve();
        });
      }
    });
  }) 
  
}
