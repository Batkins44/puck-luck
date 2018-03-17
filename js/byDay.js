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
            console.log("datData",dayData);
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

    $("#tbody").append(`<tr><th scope="row">${row}</th><td>${currentGame.awayTeam.City} ${currentGame.awayTeam.Name}</td>   
    <td>${currentGame.homeTeam.City} ${currentGame.homeTeam.Name}</td>
   <td>${currentGame.time} ${currentGame.location}</td></tr>`);
    row = row + 1;

}
}

function runDay(){
    $("#tbody").html("");
    $("#title").html(`<h1>Today's Games</h1><br>`);
    $("#title").append(`Or choose a different day.<br>`);
    $("#title").append(`<input type="date" id="time-get" min="2017-10-04" max="2018-04-07">`);
    $("#title").append(`<button id="time-run">Go</button>`);


    $("#left-head").html("<h5>Away</h5>");
    $("#middle-head").html("<h5>Home</h5>");
    $("#right-head").html("<h5>Time/Location</h5>");
    useDay(listDay);
}

function changeDay(url){
    dayUrl = url;
    console.log("dayUrl",dayUrl);
    console.log("changeDate",changeDate);
    $("#title").html(`<h1>Today's Games</h1><br>`);
    $("#title").append(`Or choose a different day.<br>`);
    $("#title").append(`<input type="date" id="time-get">`);
    $("#title").append(`<button id="time-run">Run</button>`);


    $("#left").html("<h5>Skaters</h5>");
    $("#middle").html("<h5>Stats</h5>");
    $("#right").html("<h5>Goalies</h5>");
    useDay(listDay);
}

$(document).ready(function() {
    $("body").click(function (event) {
        let selectId = event.target.id;
        console.log("Id",selectId);
        // let date = event.target.value;
        // console.log("date",date);

        if(selectId == "time-run"){
            changeDate = $("#time-get").val();
            console.log("Change date",changeDate);
            changeDate  = moment(changeDate).format('YYYYMMDD');
            console.log("date formatted",changeDate);
            dayUrl = `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/daily_game_schedule.json?fordate=${changeDate}`;
        changeDay(dayUrl);
    }});
});

$("#day-btn").click(runDay);

module.exports = {useDay,listDay};