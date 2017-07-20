function getArgSumm() {

    var summ = 0;
    for(var i in arguments) {
        var int = Number(arguments[i]);
        if(typeof int == 'number' && !isNaN(int)) {
            summ += Number(arguments[i])
        }
    }
    return summ;
}
var arr = [1,2,3,4,5,6,7,8];




console.log(getArgSumm.apply(this, arr));