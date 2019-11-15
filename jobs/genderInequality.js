const db = require('../controllers/db');
const util = require('../controllers/util');
let genderInequalityFile = util.createPath(__dirname, '../staticStorage/csv/genderInequality.csv');
let rows = util.csvFileToArray(genderInequalityFile, 3);

// console.log(rows);

async function addgenderInequalityInfo(){
    let logs = '';
    for(let x in rows){
        let countryName = rows[x][1];
        let countryObj = util.getCountryObjByCountryName(countryName);
        if(countryObj){
            let thisRow = rows[x];
            countryObj.genderInequality = new Object();
            countryObj.genderInequality['rank'] = parseFloat(thisRow[0]);
            countryObj.genderInequality['yearly'] = new Object();
            let yIndex = 2;
            for(let y=1991;y<=2017;y++){
                countryObj.genderInequality['yearly'][`${y}`] = isNaN(parseFloat(thisRow[yIndex])) ? null : parseFloat(thisRow[yIndex])
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
    util.writeFile(util.createPath(__dirname, '../logs/genderInequality.txt'), logs, 'txt',false, false, false);
}

addgenderInequalityInfo();