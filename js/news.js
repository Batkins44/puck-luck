"use strict";

var newsUrl = `https://newsapi.org/v2/top-headlines?sources=nhl-news&pagesize=3&apiKey=d5015a5be72444f995b0ca7147f817ea`;

function useNews(callBackFunction){


    $.ajax({
        url: newsUrl
    }).done(function(data) {
        callBackFunction(data);
});
}


function listNews(newsData){
console.log("NEWS",newsData);

}

module.exports = {useNews,listNews};