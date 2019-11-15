const fs = require('fs');
const path = require('path');
const moment = require('moment');
const axios = require('axios');
const cheerio = require('cheerio');

let util = {
    createPath: function(directory, traverse){
        return path.resolve(directory, traverse);
    },
    makeGetRequest: async function(url, jquery){
        try {
            let res = await axios.get(url);
            if(jquery){
                return cheerio.load(res.data);
            } else {
                return res.data;
            }
        } catch (error) {
            throw new Error(error);
        }
    },
    getCountriesArray: function(){
        let countriesFile=  this.createPath(__dirname, '../staticStorage/countries.json')
        return this.readFile(countriesFile, true);
    },
    getCountryObjByCountryName: function(countryName){
        let regex = new RegExp(countryName, "i");
        let array = this.getCountriesArray();
        let obj = array.find((el) => regex.test(el.countryName));
        if(obj){
            delete obj['_id'];
        }
        return obj;
    },
    writeFile: function(directory, obj, type, isSample, isJson, isSpacing){
        let contents = obj
        let filePath = directory;
        if(isSample){
            filePath = this.createPath(__dirname, '../sample.'+type);
        }
        if(!isSpacing){
            isSpacing = 0;
        }
        if(isJson){
            contents = JSON.stringify(obj, null, isSpacing);
        }
        fs.writeFileSync(filePath, contents, 'utf-8');
    },
    readFile: (filename, json) => {
        let contents = fs.readFileSync(filename, 'utf-8');
        if(json){
            return JSON.parse(contents);
        } else {
            return contents;
        }
    },
    csvToArray: function(text) {
        let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
        for (l of text) {
            if ('"' === l) {
                if (s && l === p) row[i] += l;
                s = !s;
            } else if (',' === l && s) l = row[++i] = '';
            else if ('\n' === l && s) {
                if ('\r' === p) row[i] = row[i].slice(0, -1);
                row = ret[++r] = [l = '']; i = 0;
            } else row[i] += l;
            p = l;
        }
        return ret;
    },
    csvFileToArray: function(filename, skip) {
        let contents = this.readFile(filename);
        let rows = this.csvToArray(contents);
        if(skip){
            return rows.slice(skip, Infinity);
        }
        else {
            return rows;
        }
    }
}

module.exports = util;