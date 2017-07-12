/**
 * AdvertsController
 *
 * @description :: Server-side logic for managing adverts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var currentName = 'AdvertsController';
module.exports = {
	index: function (req, res) {
	    console.log('HERE222');
    },
    save: function (req, res) {
        sails.log(currentName + '.save');
        console.log(req.body);
        var saveObject = {
            advertType: req.body.advertType,
            price: req.body.price,
            currency: req.body.currency,
            advertPhoneNumber: req.body.advertPhoneNumber,
            advertDeliveryMethod: req.body.advertDeliveryMethod,
        };

        switch (req.body.advertType) {
            case 'wheels':
                Object.assign(saveObject, {
                    pcd: req.body.pcd,
                    diameter: req.body.diameter,
                    wheelType: req.body.wheelType,
                    wheelWidth: req.body.wheelWidth,
                    centerHole: req.body.centerHole,
                    offset: req.body.offset,
                    wheelMaker: req.body.wheelMaker,
                    wheelModel: req.body.wheelModel
                });
            break;
            case 'tyres':
                Object.assign(saveObject, {
                    tyreType: req.body.tyreType,
                    tyreSpeedIndex: req.body.tyreSpeedIndex,
                    diameter: req.body.diameter,
                    tyreLoadIndex: req.body.tyreLoadIndex,
                    tyreWidth: req.body.tyreWidth,
                    productionYear: req.body.productionYear,
                    tyreHeight: req.body.tyreHeight,
                    treadRest_1: req.body.treadRest_1,
                    treadRest_2: req.body.treadRest_2
                });
            break;
            case 'spaces':
                Object.assign(saveObject, {
                    spacesType: req.body.spacesType,
                    material :req.body.material,
                    spacesCenterHole :req.body.spacesCenterHole,
                    spacesWidth :req.body.spacesWidth,
                    pcdSpacesFrom :req.body.pcdSpacesFrom,
                    pcdSpacesTo :req.body.pcdSpacesTo
                });
            break;
        }
        sails.models.adverts.create(saveObject).exec(function (err, resData) {
            if(!err) {
                res.json({status: true});
            } else {
                res.json({status: false});
            }}
        );

    }
};

