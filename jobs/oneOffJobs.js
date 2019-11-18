// Load All countries and write to a file;
const db = require('../controllers/db');
const util = require('../controllers/util');

async function loadFile(){ // Load File
    try {
        let results = await db.getData({}, 'countryRanking');
        util.writeFile(util.createPath(__dirname, '../staticStorage/countries.json'), results, 'json', false, true, 3);
    } catch (error) {
        throw new Error(error);
    }
}

// loadFile();

async function createCountIndexForInitiatives(){
    try {
        let table = await db.getCursor('initiatives');
        let results = await table.find({}).project({id: 1, name: 1}).toArray();
        let suppliers = await db.getCursor('initiativeData');
        for(let r in results){
            let obj = results[r];
            let count = await suppliers.find({initId: obj.id}).count()
            obj.supplierCount = count;
            delete obj['_id'];
            let operator = await suppliers.updateOne({id: obj.id}, {
                $set: obj
            });
            console.log(`Updated ${obj.name} with supplier count ${count}`);
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function removeLaborParticipation(){
   try {
    let table = await db.getCursor('countryRanking');
    await table.update({}, {$unset: {hdi: 1}}, {multi: true});
    await loadFile();
   } catch (error) {
        console.error(error);
   }
    
}

function testCountryName(){
    let obj = util.getCountryObjByCountryName('Bangladesh');
    console.log('Obj is ' + JSON.stringify(obj, null, 2));
}


function createLoaderFile(){
    try {
        let loaderFile = util.createPath(__dirname, '../staticStorage/countryCodes.json');
        let ogFile = util.createPath(__dirname, '../staticStorage/countries.json');
        let ogData = util.readFile(ogFile, true);
        let shortForm = [];
        for(let i in ogData){
            shortForm.push({
                countryName: ogData[i].countryName,
                countryCode: ogData[i].countryCode,
                id: ogData[i].id
            });
        }
        util.writeFile(loaderFile, shortForm, 'json', false, true, null);
    } catch (error) {
        throw new Error(error);
    }
}

// createLoaderFile();

// testCountryName();

// removeLaborParticipation();

// createCountIndexForInitiatives();