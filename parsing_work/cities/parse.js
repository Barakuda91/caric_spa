function getFikeStreem(lang) {
    return  lineReader.createInterface({
        input: require('fs').createReadStream('./citys/db_.txt')
    });
}

var obj = {};
var lineReader = require('readline');
var fs = require('fs');

var stream = lineReader.createInterface({
    input: fs.createReadStream('./citys/db.txt')
});
stream.on('line', function (line) {


    line = line.replace(/\*|\[|\]/g,'')
    line = line.split(' - ');
    if(line.length < 2)
        return;
    else {
        var cityName = line[0].split('(')[0].trim();
        var regionName = line[1].split('(')[0].trim();

        obj[regionName] = obj[regionName] || [];
        obj[regionName].push(cityName)

        console.log(line);
    }
});

stream.on('close', function () {
    console.log(obj)

    fs.writeFile('./citys/ru.json',JSON.stringify(obj))
});