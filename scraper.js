const cheerio = require('cheerio')
const request = require('request')
const fs = require('fs')

const fieldOrder = [
  'name',
  'rank',
  'description',
  'founders',
  'sector',
  'jobCreated',
  'batch'
]

request({ url: 'https://www.ycombinator.com/topcompanies', gzip: true }, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    const data = [];
    $('#main-companies').children('tr').each(function(i, element){
      const startup = {};
      $(this).children('td').each(function(i, element) {
        const currentField = fieldOrder[i];

        if (currentField === 'name') {
          startup.name = $(this).find('b').text();
          const url = $(this).find('a').attr('href');
          if (url) {
            startup.key = url.split('.')[0].substring(2);
          }
        } else if (currentField === 'founders') {
          const founders = [];
          $(this).find('li').each(function(index, e) {
            founders.push($(this).text());
          })

          startup[currentField] = founders;
        } else {
          startup[currentField] = $(this).text();
        }
      })
      data.push(startup);
    });
    
    // Writing data to ycInfo.json file
    fs.writeFile("./ycInfo.json", JSON.stringify(data), (err) => {
      if (err) {
          return;
      };
      console.log("File has been created");
    });
  }
});

