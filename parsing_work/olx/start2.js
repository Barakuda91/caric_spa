
var url = 'https://img01-olxua.akamaized.net/img-olxua/570145346_5_644x461_rezina-diski-5-112-r16-r17-folksvagen-audi-kievskaya-oblast_rev001.jpg';


var request = require('request');
var fs = require('fs');

var headers = {
  connection: 'keep-alive',
  'cache-control': 'no-cache',
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/60.0.3112.113 Chrome/60.0.3112.113 Safari/537.36',
  accept: '*/*',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4,bg;q=0.2'
};


request
  .get({url: url,method: 'GET', headers: headers})
  .on('end', function() {
    fs.exists('doodle.png', function(exists) {
      console.log(exists ? 'it\'s there' : 'no passwd!');
    });
  })
  .pipe(fs.createWriteStream('doodle.png'));
