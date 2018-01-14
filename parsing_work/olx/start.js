var page = 'https://www.olx.ua/zapchasti-dlya-transporta/shiny-diski-i-kolesa/diski/?search%5Bphotos%5D=1';
var webdriver = require('selenium-webdriver');
var fs = require('fs');
var By = webdriver.By;
var chrome = require('selenium-webdriver/chrome');
var until = webdriver.until;
var request = require('request-promise');
var gm = require('gm');
var fs = require('fs');

var headers = {
  connection: 'keep-alive',
  'cache-control': 'no-cache',
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/60.0.3112.113 Chrome/60.0.3112.113 Safari/537.36',
  accept: '*/*',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4,bg;q=0.2'
};

var driver = new webdriver.Builder()
//  .forBrowser('chrome')
  .forBrowser('phantomjs')
  .build();

var driver2 = new webdriver.Builder()
//.forBrowser('chrome')
  .forBrowser('phantomjs')
  .build();

var pagecount = 1;
getPage(page);
var pageTry = 0;
function getPage(page) {
  driver.get(page);
  driver.findElement(By.id('offers_table'))
    .then(function(table) {
      table.findElements(By.className('wrap'))
        .then(function (wraps) {
          var count = 0;
          function next() {
            console.log('NEXT FUNCTION START')
            var responseObj = {};

            wraps[count].findElement(By.css('td > table > tbody > tr:nth-child(1) > td:nth-child(1) > a'))
              .then(function (a) {
                return a.getAttribute('href')
              })
              .then(function(text) {
                console.log(text)
                text = text.split('#')[0];
                responseObj.origin = text;
                return request
                  .post(
                    'http://localhost:1337/api/parser/checkurl',
                    {json: {origin: text}}
                  );
              })
              .then(function(data) {
                console.log(data)
                if(data.status) {
                  if(data.isSuchAdv) {
                    console.log('ТАКОЕ ОБЪЯВЛЕНИЕ ЕСТЬ В БАЗЕ')
                    count++;
                    next();
                  } else {
                    return wraps[count].findElement(By.css('td > table > tbody > tr:nth-child(1) > td.wwnormal.tright.td-price > div > p > strong'))
                  }
                }
              })
              .then(function (price) {
                return price.getText()
              })
              .then(function (price) {
                responseObj.price = price.replace(/\s|грн./g,'');
                return wraps[count].findElement(By.css('td > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > h3 > a'))
              })
              .then(function (a) {
                return a.getText()
              })
              .then(function(text) {

                var parsed = getParsedObjectFromTitle(text);
                if(parsed) {
                  console.log(count+'/'+pagecount+')',responseObj.origin)
                  getMoreInfoFromAdvert(responseObj.origin, function(obj) {
                    if(!obj) {
                      ++count;
                      return next()
                    }
                    obj.title = text;
                    obj.status = "active";
                    obj.advertType = "wheels";
                    obj.user = 'barakudatm@gmail.com';
                    obj.wheelType = 'CAST';

                    parsed = Object.assign(parsed,obj,responseObj,getParsedObjectFromTitle(obj.advertDescription));
                    if(++count < wraps.length) {
                      writeParsedData(parsed, next);
                    } else {
                      console.log('Страница ЗАКОНЧЕНА!!!!! '+pagecount);
                      pageTry = 0;
                      getPage(page+'&page='+(++pagecount))
                    }
                  })
                } else {
                  if(++count < wraps.length) {
                    next();
                  } else {
                    console.log('Страница ЗАКОНЧЕНА!!!!! '+pagecount);
                    pageTry = 0;
                    getPage(page+'&page='+(++pagecount))
                  }
                }
              })
              .catch(function(error) {
                console.log('FIND SOME ERROR 4');
                console.log(error);
                if(++count < wraps.length) {
                  next();
                } else {
                  console.log('Страница ЗАКОНЧЕНА!!!!! '+pagecount);
                  pageTry = 0;
                  getPage(page+'&page='+(++pagecount))
                }
              });
          }
          next();
        });
    })
    .catch(function(error) {
      console.log('FIND SOME ERROR 3');
      console.log(error);
      if(pageTry > 0) {
        pageTry = 0;
        getPage(page+'&page='+(++pagecount))
      } else {
        pageTry++;
        getPage(page+'&page='+pagecount)
      }
    });
}
/*
{
  "_id" : ObjectId("5a24745282bdfdaf7affabda"),
  "user" : "barakudatm@gmail.com",
  1"status" : "active",
  1"createdAt" : ISODate("2017-12-03T22:01:54.463Z"),
  1"updatedAt" : ISODate("2017-12-03T22:03:18.315Z"),
  "post_id" : "5a24745282bdfdaf7affabda",
  1"advertType" : "wheels",
  1"currency" : "usd",
  1"priceFor" : "FOR_THE_WHOLE_LOT",
  1"quantity" : "4",
  1"price" : "600",
  1"advertPhoneNumber" : "+380982611014",
  1"advertDescription" : "Отличные диски на выстовочное авто",
  1"deliveryMethod" : "DELIVERY_BY_COUNTRY",
  1"centerHole" : "69",
  1"offset" : "25",
  1"pcd" : "5x120",
  1"diameter" : "18"
}

*/

function writeParsedData(data, cb) {

  request
    .post(
      'http://localhost:1337/api/parser/createadv',
      { json: data }
    )
    .then(cb)
    .catch(function(err) {
      console.log(err);
    });


  // fs.writeFile('./db_dump/adds.json',JSON.stringify(data), function(err) {
  //   if (!err) {
  //     console.log({status: true});
  //   } else {
  //     console.log({status: false, data: err});
  //   }
  // })
}

function getMoreInfoFromAdvert(link, callback) {
  driver2.get(link);
  var response = {files: []}
  var imgCount = 0;

  function callbackFrom() {
    response.deliveryMethod = "DELIVERY_BY_COUNTRY";
    response.priceFor = "FOR_THE_WHOLE_LOT";
    response.quantity = "4";
    response.currency = 'UAH';
    response.advertDescription = response.advertDescription+'\n\tСпросить '+response.authorName;

    callback(response);
  }

  driver2.findElement(By.css('#contact_methods > li:nth-child(2) > div'))
    .then(function(div){
      div.findElement(By.css('span')).click();
      setTimeout(function() {
        driver2.findElement(By.css('#contact_methods > li:nth-child(2) > div > strong'))
          .then(function(el) {
            return el.getText()
          })
          .then(function(text) {
            text = text.replace(/\s|-/g, '');
            text = text.replace(/^380/, '0');
            response.advertPhoneNumber = text;
            return driver2.findElement(By.xpath('//*[@id="textContent"]/p'))
          })
          .then(function(desc) {
            return desc.getText()
          })
          .then(function(advertDescription) {
            response.advertDescription = advertDescription;
            return driver2.findElement(By.css('#offeractions > div.offer-sidebar__box > div.offer-user__location > div > address > p'))
          })
          .then(function(city) {
            return city.getText()
          })
          .then(function(text) {
            response.regionsAuto = text;
            return driver2.findElement(By.css('#offeractions > div.offer-sidebar__box > div.offer-user__details > h4'))
          })
          .then(function(authorName) {
            return authorName.getText()
          })
          .then(function(authorName) {
            response.authorName = authorName;
            return driver2.findElement(By.css('#photo-gallery-opener > img'))
          })
          .then(function(firstImg){
            return firstImg.getAttribute('src');
          })
          .then(function(firstImgSrc) {
            getImageParams(firstImgSrc,function(imageObject) {
              response.files.push(imageObject);
            });
            return driver2.findElements(By.css('#offerdescription > div.img-item'));
          })
          .then(function(imgBlocks) {
            if(imgBlocks.length === 0) {
              return callbackFrom();
            }

            nextImg();

            function nextImg() {
              imgBlocks[imgCount].findElement(By.css('div > img'))
                .then(function(img) {
                  return img.getAttribute('src');
                })
                .then(function(imgSrc) {

                  imgSrc = imgSrc.replace('644x461','1000x700')

                  getImageParams(imgSrc,function(imageObject) {

                    response.files.push(imageObject);
                    if(++imgCount < imgBlocks.length) {
                      nextImg()
                    } else {
                      callbackFrom()
                    }
                  })
                })
                .catch(function(error) {
                  console.log('FIND SOME ERROR 2');
                  console.log(error);
                  callbackFrom();
                });
            }
          })
          .catch(function(error) {
            console.log('FIND SOME ERROR 5');
            console.log(error);
            return callback(null);
          });
      },500);
    })
    .catch(function(error) {
      console.log('FIND SOME ERROR 1');
      console.log(error);
      return callback(null);
    });
}

function getImageParams(imgSrc, callback) {
  var imgName = imgSrc.split('/');
  imgName = imgName[imgName.length-1];
  console.log(imgName)
  request
    .get({url: imgSrc,method: 'GET', headers: headers})
    .on('end', function() {
      gm('tmp/'+imgName)
        .identify(function (err, info) {
          if (!err) {
            fs.unlink('tmp/'+imgName, function () {
              callback({url: imgSrc, width: info.size.width, height: info.size.height, contentType: 'image/'+info.format})
            });
          }
        });
    })
    .pipe(fs.createWriteStream('tmp/'+imgName));


function getParsedObjectFromTitle(title) {
// ([r|р][\s]{0,1}[-]{0,1}[\s]{0,1}[\d]{2}) - диаметр
// ((?:цо|ЦО|Цо|цО)\s{0,1}\d{2}[,\.]{0,1}[\d]{0,1}) - цо
// (\d{1,3}(?:-|x|х|\*|\/|на|\.|,)\d{1,3}(?:\.\d|,\d){0,1}) - разболтовка
// ((?:et|ет)\s{0,1}\d{2})
// ([r|р][\s]{0,1}[-]{0,1}[\s]{0,1}[\d]{2})|((?:цо|ЦО|Цо|цО)\s{0,1}\d{2}[,\.]{0,1}[\d]{0,1})|(\d{1,3}(?:-|x|х|\*|\/|на|\.|,)\d{1,3}(?:\.\d|,\d){0,1})|((?:et|ет)\s{0,1}\d{2})
  var PCDCols = '3|4|5|6';
  var PCDDia = '98|100|105|108|110|112|114.3|115|118|120|120.65|125|127|130|137|139.7|150|160|256';

  var object = {};
  var WIDTH1 = title.match(/(?:j|ж|ширина)(?:-){0,1}((?:\d){1,2}(?:\.|,){0,1}(?:\d){0,1})/i);
  var WIDTH2 = title.match(/((?:\d){1,2}(?:\.|,){0,1}(?:\d){0,1})(?:j|ж|ширина)/i);
  var DIA = title.match(/([r|р][\s]{0,1}[-]{0,1}[\s]{0,1}(\d{2}))/i);
  var CO  = title.match(/((?:цо|ЦО|Цо|цО)\s{0,1}(\d{2}[,\.]{0,1}[\d]{0,1}))/i);
  var PCD1= title.match(/((3|4|5|6){1}(?:-|x|х|\*|\/|на|\.|,|:)(98|100|105|108|110|112|114.3|115|118|120|120.65|125|127|130|137|139.7|150|160|256){1}(?:\.\d|,\d){0,1})/i);
  var PCD2= title.match(/((98|100|105|108|110|112|114.3|115|118|120|120.65|125|127|130|137|139.7|150|160|256){1}(?:-|x|х|\*|\/|на|\.|,|:)(3|4|5|6){1}(?:\.\d|,\d){0,1})/i);
  var ET  = title.match(/((?:et|ет)\s{0,1}(\d{2}))/i);
  var elCount = 0;
  if(DIA) {
    elCount++;
    object.diameter = DIA[2];
  }
  if(CO) {
    elCount++;
    object.centerHole = CO[2];
  }
  if(PCD1) {
    elCount++;
    object.pcd = PCD1[2]+'x'+PCD1[3];
  } else if(PCD2) {
    elCount++;
    object.pcd = PCD2[3]+'x'+PCD2[2];
  }

  if(WIDTH1) {
    elCount++;
    object.wheelWidth = WIDTH1[1];
  } else if(WIDTH2) {
    elCount++;
    object.wheelWidth = WIDTH2[1];
  }

  if(ET) {
    elCount++;
    object.offset = ET[2];
  }
  if(elCount > 1) {
    return object;
  } else {
    return null;
  }
}
