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
});

router.get('/initiatives', async function(req, res, next){
    try {
        let table = await db.getCursor('initiatives');
        let results = await table.find({}).project({id: 1, name: 1}).toArray();
        console.log(results);
        return res.render('initiatives.pug', {initiatives: results});
    } catch (error) {
        
    }
})

module.exports = router;