const db = require('../controllers/db');
const util = require('../controllers/util');
const uuid = require('uuid/v4');

// const url = 'https://www.labourstart.org/news/country.php?country=India&langcode=en';


function dateRegex(str){
    var regex = /\d{4}-\d{2,}-\d{2,}/;
    return str.match(regex)[0];
}

async function getCountryNews(countryName){
    try {
        let topNews = [];
        countryName = countryName.replace(" ","%20")
        let url = `https://www.labourstart.org/news/country.php?country=${countryName}&langcode=en`;
        console.log(url);
        let $ = await util.makeGetRequest(url, true);
        let data = $('.group2').text();
        $('.group2').find('p').each(function(){
            let news = {
                headline: $(this).find('a').text(),
                link: $(this).find('a').eq(1).attr('href'),
                date: dateRegex($(this).text())
            };
            let newUrl = new URL(news.link);
            news.host = newUrl.host;
            news.id = uuid();
            topNews.push(news)

        });
        // console.log(topNews);
        return topNews;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    getCountryNewsLatest: async function(countryName){
        try {
            let dataset =  await getCountryNews(countryName);
            return dataset
        } catch (error) {
            throw new Error(error);
        }
    }
}

// getCountryNews("Sri Lanka");