
var maxConcurrent = 1;
var maxQueue = Infinity;
var Queue = require('promise-queue');



Queue.configure(require('vow').Promise);
var queue = new Queue(maxConcurrent, maxQueue);


var promise = new Promise(function(resolve, reject){
    resolve();
});



var qe = [];


function qwerty() {

}




qe.push(function (q) {
    var post = 'First promise';
    setTimeout(function() {
        console.log(q,post);
        next();
    },3000)
});

qe.push(function (q) {
    var post = 'second promise';
    setTimeout(function() {
        console.log(q,post);
        return 'dssss';
    },3000)
});