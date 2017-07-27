var queue = [
    {
        name: 'Artur Moongose',
        rank: 2
    },{
        name: 'Stas Middleware',
        rank: 7
    },{
        name: 'Alex Skiper',
        rank: 12
    },{
        name: 'Volodomir Stylis',
        rank: 3
    },{
        name: 'Semen Seriy',
        rank: 5
    }
];

function getQueueByRank (queue) {
    return queue.sort(function(a, b) {
        return (a.rank > b.rank)
    })
}
function getMiddleRank (queue) {
    var summ = 0, count = 0;
    queue.forEach(function(el){
        summ += el.rank;
        count++;
    })
    return summ/count;
}

console.log(getQueueByRank(queue));
console.log(getMiddleRank(queue));
