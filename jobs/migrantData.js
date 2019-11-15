const db = require('../controllers/db');
const util = require('../controllers/util');
let migrantDataFile= util.createPath(__dirname, '../staticStorage/csv/migrantData.csv');
let rows = util.csvFileToArray(migrantDataFile, 0);

let logFile = util.createPath(__dirname, '../logs/migrant.txt')
let logFileCsv = util.createPath(__dirname, '../logs/migrantData.csv')

let headerRows = rows[0];
console.log(headerRows.length)

let checkNan = (string) => {
    string = string.replace(/\s{1,}/g, '');
    let val = parseFloat(string);
    return isNaN(val) ? null : val;
}

let migrants = [];
let migrantFile = util.createPath(__dirname, '../staticStorage/migrantData.json');
let logs = ``
loadMigrantData = async() => {

    for(let i = 1; i<rows.length; i++){
        let thisRow = rows[i]
        let countryName  = thisRow[1];
        let countryObj = util.getCountryObjByCountryName(countryName);
        let migrantObj = {};
        migrantObj.countryName = countryName;
        migrantObj.distribution = []
        if(countryObj){
            for(let r=5; r<=239; r++){
                if(checkNan(thisRow[r])){
                    migrantObj.distribution.push({
                        areaName: headerRows[r],
                        total: checkNan(thisRow[r]),
                    })
                }
            }
        }
        migrants.push(migrantObj);
    }
    util.writeFile(migrantFile, migrants, null, false, true, 4);
    util.writeFile(logFile, logs);
}


// loadMigrantData();

let analyzeMigrants = () => {
    let dataset = util.readFile(migrantFile, true);
    for(let c in dataset){
        let thisRow = dataset[c];
        if(thisRow.distribution.length > 0){
            let sortedArray = thisRow.distribution.sort((a,b) => b.total - a.total)
            console.log('Check');
            dataset[c].topSending = sortedArray.slice(0, 4);
        }
    }
    util.writeFile(migrantFile, dataset, null, false, true, 4);
}


let createCsv = () => {
    let dataset = util.readFile(migrantFile, true);
    let csvString = `Region Name, Total Migrants, #1 Migrant Sending Region, #1 Migrant Sending Total, #2 Migrant Sending Region, #2 Migrant Sending Total, #3 Migrant Sending Region, #3 Migrant Sending Region \n\n`
    for(let c in dataset){
        let topSending = dataset[c].topSending
        if(topSending){
            csvString+= `${dataset[c].countryName}, ${topSending[0].total}, ${topSending[1].areaName}, ${topSending[1].total},${topSending[2].areaName}, ${topSending[2].total},${topSending[3].areaName}, ${topSending[3].total}\n`
        }
    }
    util.writeFile(logFileCsv, csvString);
}

createCsv();