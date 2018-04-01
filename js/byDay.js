"use strict";
var moment = require('moment');

var date = moment().format('YYYYMMDD');

let changeDate;


var dayUrl = `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/daily_game_schedule.json?fordate=${date}`;

function useDay(callBackFunction){

    let username = "batkins4";
    let password = "puck-luck";
    
    
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
            },
            url: dayUrl
        }).done(function(data) {
            // When you tell jQuery to read a file via the ajax method
            // it reads the contents, and then executes whatever function
            // that you specify here in the done() method, and passes in
            // the contents of the file as the first argument.

            let dayData = data;
            callBackFunction(dayData);
    });
    }

function listDay(dayData){
    // var date = moment().format('MM-DD-YYYY');
    let day = dayData.dailygameschedule.gameentry;
    let row = 1;
    $("#tbody").html("");
    for(let l = 0;l < day.length;l++){
    let currentGame = day[l];
    // $("#print").append(currentGame.link);

    $("#tbody").append(`<tr><th scope="row">${currentGame.time}</th><td>${currentGame.awayTeam.City} ${currentGame.awayTeam.Name}</td>   
    <td>${currentGame.homeTeam.City} ${currentGame.homeTeam.Name}</td>
   <td>${currentGame.location}</td></tr>`);

}
}

function runDay(){
    $("#tbody").html("");
    $("#low-body").html("");
    $("#main-header").html(`<tr>
    <th scope="col" id="counter"><h5>Time(Eastern)</h5></th>
    <th scope="col" id="left-head"><h5>Away</h5></th>
    <th scope="col" id="middle-head"><h5>Home</h5></th>
    <th scope="col" id="right-head"><h5>Location</h5></th>

  </tr>`);
  $("#low-title").html("");
    $("#main-header").removeClass("is-hidden");
    $("#low-header").html("");
    $("#run-fav-teams").addClass("is-hidden");
    $("#run-fav-players").addClass("is-hidden");

    $("#title").html(`<h1>Today's Games</h1><br>`);
    $("#title").append(`Or choose a different day.<br>`);
    $("#title").append(`<input type="date" id="time-get" min="2017-10-04" max="2018-04-07">`);
    $("#title").append(`<button id="time-run">Go</button>`);
    $("#favorite-div").addClass("is-hidden");
    $("#player-search").addClass("is-hidden");

    // $("#counter").html(`<h5>Time</h5>`);
    // $("#left-head").html(`<h5>Away</h5>`);
    // $("#middle-head").html(`<h5>Home</h5>`);
    // $("#right-head").html(`<h5>Time/Location</h5>`);
    useDay(listDay);
}

function changeDay(url){
    dayUrl = url;
    let displayDate  = moment(changeDate).format('MM-DD-YY');
    $("#title").html(`<h1>${displayDate}</h1><br>`);
    $("#title").append(`Or choose a different day.<br>`);
    $("#title").append(`<input type="date" id="time-get">`);
    $("#title").append(`<button id="time-run">Run</button>`);


    useDay(listDay);
}

$(document).ready(function() {
    $("body").click(function (event) {
        let selectId = event.target.id;

        if(selectId == "time-run"){
            changeDate = $("#time-get").val();
            changeDate  = moment(changeDate).format('YYYYMMDD');
            dayUrl = `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/daily_game_schedule.json?fordate=${changeDate}`;
        changeDay(dayUrl);
    }});
});

$("#day-btn").click(runDay);

module.exports = {useDay,listDay};