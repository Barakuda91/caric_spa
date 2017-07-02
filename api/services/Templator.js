var fs = require('fs');
var config = sails.config.caric;
module.exports = {
    addvSmallBlock: function (options) {
        options = options || {};
        options.template = config.rootName+config.templates.addvBlocks.small
        options.img   = options.img || '/images/default.jpg';
        options.price = options.price || '0$';
        options.param = options.param || [
            {
                title: 'default',
                index: 'param1'
            },{
                title: 'default',
                index: 'param2'
            },{
                title: 'default',
                index: 'param3'
            }
        ];
        options.separator = options.separator || ['!% ',' !% ',' !%'];
        var template = fs.readFileSync(options.template);







    },
    addvSmallBlocksGroup: function () {

    },
    addvFullBlock: function () {

    },
    addvFullBlocksGroup: function () {

    }
}