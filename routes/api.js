let router = require('express').Router();
let db = require('../controllers/db');

router.get('/getCountryInfo', async function(req, res, next){
    let countryId = req.query.id;
    console.log(countryId);
    try {
        let table = await db.getCursor('countryRanking');
        let results = await table.findOne({id: countryId});
        return res.status(200).json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
})

router.get('/getInit', async function(req, res, next){
    let id = req.query.id;
    // console.log(req.id);
    try {
        let table = await db.getCursor('initiatives');
        let results = await table.findOne({id: id});
        return res.status(200).json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
});


router.post('/updateInit', async function(req, res, next){
    try {
        console.log(req.body);
        let newData = req.body.newValues;
        let query = req.body.id;
        let table = await db.getCursor('initiatives');
        let result = await table.updateOne({id: query}, {$set: newData});
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
})

module.exports = router;