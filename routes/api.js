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

module.exports = router;