let router = require('express').Router();
let db = require('../controllers/db');
let util = require('../controllers/util');

router.get('/', async function(req, res, next){
    try {
        let ccFile = util.createPath(__dirname, '../staticStorage/countryCodes.json');
        let results = util.readFile(ccFile, true);
        // console.log(results);
        res.render('index', {countries: results});
    } catch (error) {
        
    }
})

module.exports = router;