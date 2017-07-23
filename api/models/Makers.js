module.exports = {
    attributes: {

    },

    get: function (res) {
        sails.models.makers.find().sort('title ASC').exec(function(err, rows) {


            if(!err) {
                res.json({
                    status: true,
                    data: rows
                });
            } else {
                res.json({
                    status: false,
                    data: err
                });
            }
        });
    }
}