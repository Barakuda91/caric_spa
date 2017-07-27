module.exports = {
    attributes: {

    },

    get: function (res) {
        sails.models.makers.find().sort('title ASC').exec(function(err, rows) {
            // var version = rows[0].version;
            // delete rows[0].version;

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