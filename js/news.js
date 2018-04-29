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
console.log(newsData);
let article = newsData.articles;


$("#news").html(
   `<h1>News Around the League</h1>
    <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
    <div class="carousel-inner">
      <div class="carousel-item active">
      <a href="${article[0].url}">
        <img class="d-block w-100" src="${newsData.articles[0].urlToImage}" alt="First slide">
        <div class="carousel-caption d-none d-md-block">
            <h5>${article[0].title}</h5>
            <p>${article[0].description}</p>
            </div>
            </a>
      </div>
      <div class="carousel-item">
      <a href="${article[1].url}">
        <img class="d-block w-100" src="${newsData.articles[1].urlToImage}" alt="Second slide">
        <div class="carousel-caption d-none d-md-block">
        <h5>${article[1].title}</h5>
        <p>${article[1].description}</p>
        </div>
        </a>
      </div>
      <div class="carousel-item">
      <a href="${article[2].url}">
        <img class="d-block w-100" src="${newsData.articles[2].urlToImage}" alt="Third slide">
        <div class="carousel-caption d-none d-md-block">
        <h5>${article[2].title}</h5>
        <p>${article[2].description}</p>
      </div>
      </a>
    </div>
    <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>`
);

}

module.exports = {useNews,listNews};