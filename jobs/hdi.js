// Human development Index;

const db = require('../controllers/db');
const util = require('../controllers/util');
let hdiFile = util.createPath(__dirname, '../staticStorage/csv/hdiIndex.csv');
let rows = util.csvFileToArray(hdiFile, 3);

async function addHDIInfo(){
    let logs = '';
    for(let x in rows){
        let countryName = rows[x][1];
        let countryObj = util.getCountryObjByCountryName(countryName);
        if(countryObj){
            let thisRow = rows[x];
            countryObj.hdi = new Object();
            countryObj.hdi['rank'] = parseInt(thisRow[0]);
            countryObj.hdi['yearly'] = new Object();
            let yIndex = 2;
            for(let y=1991;y<=2017;y++){
                countryObj.hdi['yearly'][`${y}`] = isNaN(parseFloat(thisRow[yIndex])) ? null : parseFloat(thisRow[yIndex])
                yIndex++;
            }
            try {
                // console.log(countryObj);
                await db.updateValue('countryRanking', { id: countryObj.id}, countryObj);
                console.log(`Updated ${countryObj.countryName}`)
            } catch (error) {
                console.error(error);
                continue;   
            }
        } else {
            logs += `Country Not found for ${countryName} \n`;
        }
    }
    util.writeFile(util.createPath(__dirname, '../logs/hdi.txt'), logs, 'txt',false, false, false);
}

addHDIInfo();