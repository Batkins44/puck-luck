(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";
var moment = require('moment');
// Changed date to 04/18/2018 because the season over and retrieving the current date was causing an error.
var date = moment(1523161616000).format('YYYYMMDD');
console.log(date,"date");

let changeDate;


var dayUrl = `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/daily_game_schedule.json?fordate=${date}`;

function useDay(callBackFunction){

    let username = "batkins4";
    let password = "Cohort24";
    
    
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
  $("#print").html("");
  $("#low-print").html("");

  $("#low-title").html("");
    $("#main-header").removeClass("is-hidden");
    $("#low-header").html("");
    $("#run-fav-teams").addClass("is-hidden");
    $("#run-fav-players").addClass("is-hidden");

    $("#title").html(`<h1>04-08-18</h1><br>`);
    $("#title").append(`Or choose a different day.<br>`);
    $("#title").append(`<input type="date" id="time-get" min="2017-10-04" max="2018-04-07">`);
    $("#title").append(`<button id="time-run">Go</button><hr>`);
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
},{"moment":16}],2:[function(require,module,exports){
"use strict";
// This module has no knowledge of the DOM, or where the data goes after it is fetched from Firebase.
// It is only concerned with getting and setting data in the db



let firebase = require("./fb-config"),
    provider = new firebase.auth.GoogleAuthProvider(),
    user = require("./user");
let players = require("./players");
let playerTeamObject;
let playerID;
let favoritePlayerObjArray=[];


// ****************************************
// DB interaction using Firebase REST API
// ****************************************

// POST - Submits data to be processed to a specified resource.
// GET - Requests/read data from a specified resource
// PUT - Update data to a specified resource.

function getUserData() {
     return $.ajax({
         url: `${firebase.getFBsettings().databaseURL}/user.json`
         // url: `https://musichistory-d16.firebaseio.com/songs.json?orderBy="uid"&equalTo="${user}"`
     }).done((userData) => {

         return userData;

    });
 }

 function checkUserExist(){

    getUserData()
    .then((userData) => {
    // userData = userData;
    let userArray = (Object.values(userData));
    let uidArray = [];
    for (let i=0;i<userArray.length;i++){

        let currentPush = userArray[i].uid;

        uidArray.push(currentPush);
    }
    let currentUid = user.getUser();
    if(uidArray.includes(currentUid)){
        
    }else{
        let userObj = buildUserObj();
        addUserFB(userObj);

    }}
);
}

function usePlayersFav(callBackFunction){

    let username = "batkins4";
    let password = "Cohort24";
    
    
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
            },
            url: "https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/active_players.json"
        }).done(function(data) {


            let playersData = data;

            callBackFunction(playersData);
    });
    }


// function getFBDetails(user){
//     return $.ajax({
//         url: `${firebase.getFBsettings().databaseURL}/user.json?orderBy="uid"&equalTo="${user}"`
//      }).done((resolve) => {

//         return resolve;
//      }).fail((error) => {
//         return error;
//      });
//   }

function retrieveFavTeam() {

         return $.ajax({
             url: `${firebase.getFBsettings().databaseURL}/favTeam.json`
             // url: `https://musichistory-d16.firebaseio.com/songs.json?orderBy="uid"&equalTo="${user}"`
         }).done((userData) => {
    
             return userData;
    
        });
    
}



function buildUserObj() {
    let userObj = {
    name: user.getName(),
    uid: user.getUser()
    };
    return userObj;
    
}

function addUserFB(userObj){
    return $.ajax({
        url: `${firebase.getFBsettings().databaseURL}/user.json`,
        type: 'POST',
        data: JSON.stringify(userObj),
        dataType: 'json'
     }).done((fbID) => {
        return fbID;
     });
}



function logInGoogle() {
   //all firebase functions return a promise!! Add a then when called
   return firebase.auth().signInWithPopup(provider);
}

function logOut() {
   return firebase.auth().signOut();
}


function addFavTeam(favTeamObj){
    return $.ajax({
        url: `${firebase.getFBsettings().databaseURL}/favTeam.json`,
        type: 'POST',
        data: JSON.stringify(favTeamObj),
        dataType: 'json'
     }).done((fbID) => {
        return fbID;
     });
}

function buildFavTeamObj(favoriteTeam){
    let favTeamObj;

        let username = "batkins4";
        let password = "Cohort24";
        
        
        
            $.ajax({
                beforeSend: function (xhr) {
                    xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
                },
                url: `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/overall_team_standings.json?teamstats=W,L,GF,GA,Pts`
            }).done(function(data) {
                // When you tell jQuery to read a file via the ajax method
                // it reads the contents, and then executes whatever function
                // that you specify here in the done() method, and passes in
                // the contents of the file as the first argument.
                for (let i=0;i<data.overallteamstandings.teamstandingsentry.length;i++){

                   let currentTeam = data.overallteamstandings.teamstandingsentry[i].team;
                   if (currentTeam.ID == favoriteTeam){
                    let currentUid = user.getUser();
                    let name = (currentTeam.City + " " + currentTeam.Name);
                    let favTeamObj = {
                        uid:currentUid,
                        ID:favoriteTeam,
                        Name:name,
                        abbr:currentTeam.Abbreviation
                   };
                   addFavTeam(favTeamObj);
                }

        }

    });


}

function buildFavPlayerObj(favoritePlayer,playerInfo){
    for(let f=0;f<playerInfo.length;f++){
        let currentPlayer = playerInfo[f].playerID;
        if(favoritePlayer == currentPlayer){

            let currentUid = user.getUser();
            if (currentUid == null){
                window.alert("Please Login to add a favorite player");

            }else{

            let favPlayerObj = {
                name: playerInfo[f].name,
                playerID: playerInfo[f].playerID,
                uid:currentUid,
                img:playerInfo[f].image
            };
            let playerID = favPlayerObj.playerID;

            // favPlayerObj.team = playerTeamObject;
            addFavPlayer(favPlayerObj);
            window.alert(`Added ${favPlayerObj.name}`);
            let playerButtonID = `addPlayer_${favPlayerObj.playerID}`;
            $("#"+playerButtonID).addClass("is-hidden");
            // grabFavPlayers();
            }
        }
    }
}



function addFavPlayer(favPlayerObj){
    return $.ajax({
        url: `${firebase.getFBsettings().databaseURL}/favPlayer.json`,
        type: 'POST',
        data: JSON.stringify(favPlayerObj),
        dataType: 'json'
     }).done((fbPlayerID) => {

        return fbPlayerID;
     });
}

function retrieveFavPlayers(){
             return $.ajax({
             url: `${firebase.getFBsettings().databaseURL}/favPlayer.json`
         }).done((userData) => {
    
             return userData;
    
        });
    
}


function grabFavPlayers(){
    retrieveFavPlayers()

    .then((userData) => {
        let uidFavPlayers = [];
        let favPlayerArray = (Object.values(userData));
        let currentUid = user.getUser();

        for (let i=0;i<favPlayerArray.length;i++){
            if (currentUid == favPlayerArray[i].uid){
                uidFavPlayers.push(favPlayerArray[i]);
            }
        }
        $("#title").html("<h1>Favorite Players<h1><hr><h5>Skaters</h5>");
        $("#low-title").html("<h5>Goalies</h5><br>");
        $("#low-body").html("");
        $("#main-header").html("");
        $("#low-header").html("");
        $("#tbody").html("");
        $("#tbody").removeClass("is-hidden");
        $("#counter").html("Player");
        $("#favorite-div").addClass("is-hidden");
        $("#run-fav-teams").removeClass("is-hidden");
        $("#run-fav-players").addClass("is-hidden");
        $("#pacman").removeClass("is-hidden");
        $("#player-search").addClass("is-hidden");

        // for(let p=0;p<uidFavPlayers.length;p++){
        //     getPlayerLogs(uidFavPlayers[p]);
        // }
        let idString="";
        for(let p=0;p<uidFavPlayers.length;p++){
            let currentFavPlayer = uidFavPlayers[p];
              idString = idString + currentFavPlayer.playerID + ",";
        }
        idString = idString.substring(0, idString.length - 1);
        getPlayerLogs(uidFavPlayers,idString);
    });

}







function getPlayerLogs(uidFavPlayers,idString){


    let username = "batkins4";
    let password = "Cohort24";

    
    
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
            },
            url: `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/player_gamelogs.json?player=${idString}&date=from-3-weeks-ago-to-yesterday`
        }).done(function(data) {
            let gamelogs=data.playergamelogs.gamelogs;
            let twoWeeksGames = [];
            for(let l=0;l<uidFavPlayers.length; l++){
                let count = 0;
            for(let i=gamelogs.length-1;i>0;i--){
                if(count <3 ){
                let favPlayerID = uidFavPlayers[l].playerID;
                let gameLogPlayerID = gamelogs[i].player.ID;
                if(favPlayerID == gameLogPlayerID){
                    let teamName = gamelogs[i].team.City + " " + gamelogs[i].team.Name;
                    let playerLogObj = {
                        name:uidFavPlayers[l].name,
                        team:teamName,
                        position:gamelogs[i].player.Position,
                        stats:gamelogs[i].stats,
                        date:gamelogs[i].game.date,
                        playerID:gamelogs[i].player.ID,
                        image:uidFavPlayers[l].img

                    };
                    
                    
                    count += 1;
                    twoWeeksGames.push(playerLogObj);
                }}
  
            }}

//                 let gamelogs = data.playergamelogs.gamelogs;
//             if(gamelogs){
//                 let previousGame = gamelogs[gamelogs.length-1];
//                 let previousGameTwo = gamelogs[gamelogs.length-2];
//                 let previousGameThree = gamelogs[gamelogs.length-3];
//                 let previousStats;
//                 let previousStatsTwo;
//                 let previousStatsThree;




//                 if(previousGame.player.Position == "G"){
//                     if(previousGameThree.stats.Wins["#text"] == "1"){

//                         previousStatsThree = `Win<br>${previousGameThree.stats.Saves["#text"]}<br>Save %: ${previousGameThree.stats.SavePercentage["#text"]}<br>GAA: ${previousGameThree.stats.GoalsAgainstAverage["#text"]}`;
//                     }else if(previousGameThree.stats.OvertimeLosses["#text"] == "1"){
//                     previousStatsThree = `OverTime Loss<br>Saves: ${previousGameThree.stats.Saves["#text"]}<br>Save %: ${previousGameThree.stats.SavePercentage["#text"]}<br>GAA: ${previousGameThree.stats.GoalsAgainstAverage["#text"]}`;
//                     }else{
//                        previousStatsThree = `Loss<br>Saves: ${previousGameThree.stats.Saves["#text"]}<br>Save %: ${previousGameThree.stats.SavePercentage["#text"]}<br>GAA: ${previousGameThree.stats.GoalsAgainstAverage["#text"]}`;
//                     }
//                     if(previousGameTwo.stats.Wins["#text"] == "1"){

//                         previousStatsTwo = `Win<br>Saves: ${previousGameTwo.stats.Saves["#text"]}<br>Save %: ${previousGameTwo.stats.SavePercentage["#text"]}<br>GAA: ${previousGameTwo.stats.GoalsAgainstAverage["#text"]}`;
//                     }else if(previousGameTwo.stats.OvertimeLosses["#text"] == "1"){
//                     previousStatsTwo = `OverTime Loss<br>Saves: ${previousGameTwo.stats.Saves["#text"]}<br>Save %: ${previousGameTwo.stats.SavePercentage["#text"]}<br>GAA: ${previousGameTwo.stats.GoalsAgainstAverage["#text"]}`;
//                     }else{
//                        previousStatsTwo = `Loss<br>Saves: ${previousGameTwo.stats.Saves["#text"]}<br>Save %: ${previousGameTwo.stats.SavePercentage["#text"]}<br>GAA: ${previousGameTwo.stats.GoalsAgainstAverage["#text"]}`;
//                     }
//                     if(previousGame.stats.Wins["#text"] == "1"){
//                         previousStats = `Win<br>Saves: ${previousGame.stats.Saves["#text"]}<br>Save %: ${previousGame.stats.SavePercentage["#text"]}<br>GAA: ${previousGame.stats.GoalsAgainstAverage["#text"]}`;
//                     }else if(previousGame.stats.OvertimeLosses["#text"] == "1"){
//                     previousStats = `OverTime Loss<br>Saves: ${previousGame.stats.Saves["#text"]}<br>Save %: ${previousGame.stats.SavePercentage["#text"]}<br>GAA: ${previousGame.stats.GoalsAgainstAverage["#text"]}`;
//                     }else{
//                        previousStats = `Loss<br>Saves: ${previousGame.stats.Saves["#text"]}<br>Save %: ${previousGame.stats.SavePercentage["#text"]}<br>GAA: ${previousGame.stats.GoalsAgainstAverage["#text"]}`;
//                     }

//                                    }
//                                     else{
//                     previousStats=`Goals: ${previousGame.stats.Goals["#text"]}<br>
//                     Assists: ${previousGame.stats.Assists["#text"]}<br>
//                     Shots: ${previousGame.stats.Shots["#text"]}<br>
//                     Hits: ${previousGame.stats.Hits["#text"]}<br>
//                     Blocks: ${previousGame.stats.BlockedShots["#text"]}`;
//                     previousStatsTwo=`Goals: ${previousGameTwo.stats.Goals["#text"]}<br>
//                     Assists: ${previousGameTwo.stats.Assists["#text"]}<br>
//                     Shots: ${previousGameTwo.stats.Shots["#text"]}<br>
//                     Hits: ${previousGameTwo.stats.Hits["#text"]}<br>
//                     Blocks: ${previousGameTwo.stats.BlockedShots["#text"]}`;
//                     previousStatsThree=`Goals: ${previousGameThree.stats.Goals["#text"]}<br>
//                     Assists: ${previousGameThree.stats.Assists["#text"]}<br>
//                     Shots: ${previousGameThree.stats.Shots["#text"]}<br>
//                     Hits: ${previousGameThree.stats.Hits["#text"]}<br>
//                     Blocks: ${previousGame.stats.BlockedShots["#text"]}`;

//                 }

//                 let team = `${previousGame.team.City} ${previousGame.team.Name}`;

//                 let favPlayersObj = {
//                     name:uidFavPlayers.name,
//                     team: team,
//                     date1: previousGame.game.date,
//                     stats1: previousStats,
//                     date2: previousGameTwo.game.date,
//                     stats2: previousStatsTwo,
//                     date3:previousGameThree.game.date,
//                     stats3:previousStatsThree
//  };
//  favoritePlayerObjArray.push(favPlayersObj);



                // $("#tbody").append(`<tr><th scope="row">${uidFavPlayers.name}<br>${previousGame.team.City} ${previousGame.team.Name}<br><button id="delete_${playerID}" class="btn btn-danger">Delete</button></th><td>${previousGame.game.date}<br>${previousStats}</td> 
                // <td>${previousGameTwo.game.date}<br>${previousStatsTwo}</td>
                // <td>${previousGameThree.game.date}<br>${previousStatsThree}</td></tr>`);

//             }else{
//                 $("#tbody").append(`<tr><th scope="row">${uidFavPlayers.name}<br><button id="delete_${playerID}" class="btn btn-danger">Delete</button></th><td><h5>Player Hasn't Played</h5><td></tr>`);
//             }

    for(let z=0;z<twoWeeksGames.length;z++){
        let currentGame = twoWeeksGames[z];
        let secondGame = twoWeeksGames[z+1];
        let thirdGame = twoWeeksGames[z+2];
        if(currentGame.position == "G"){
            $("#low-print").append(`<table class="table table-striped table-dark" id="player_${currentGame.playerID}"><tr><th scope="row">${currentGame.image}</th><th>${currentGame.name}<br>${currentGame.team}</th><td></td><td></td><td></td><td><th><button id="delete_${currentGame.playerID}" class="btn btn-danger">Delete</button></th><tr><th scope="row"></th><td></td><th>W</th><th>SV</th><th>GA</th><th>GAA</th><th>SV%</th></tr>
            <tr><th>${currentGame.date}</th> <td></td><td>${currentGame.stats.Wins["#text"]}</td><td>${currentGame.stats.Saves["#text"]}</td><td>${currentGame.stats.GoalsAgainst["#text"]}</td><td>${currentGame.stats.GoalsAgainstAverage["#text"]}</td><td>${currentGame.stats.SavePercentage["#text"]}</td></tr><br>
            <tr><th>${secondGame.date}</th><td></td><td>${secondGame.stats.Wins["#text"]}</td><td>${secondGame.stats.Saves["#text"]}</td><td>${secondGame.stats.GoalsAgainst["#text"]}</td><td>${secondGame.stats.GoalsAgainstAverage["#text"]}</td><td>${secondGame.stats.SavePercentage["#text"]}</td></tr><br>
            <tr><th>${thirdGame.date}</th><td></td><td>${thirdGame.stats.Wins["#text"]}</td><td>${thirdGame.stats.Saves["#text"]}</td><td>${thirdGame.stats.GoalsAgainst["#text"]}</td><td>${thirdGame.stats.GoalsAgainstAverage["#text"]}</td><td>${thirdGame.stats.SavePercentage["#text"]}</td></tr></table>`);
        }else{
            $("#print").append(`<table class="table table-striped table-dark" id="player_${currentGame.playerID}"><tr><th scope="row">${currentGame.image}</th><th>${currentGame.name}<br>${currentGame.team}</th><td></td><td></td><td></td><td></td><td></td><td></td><td></td><th><button id="delete_${currentGame.playerID}" class="btn btn-danger">Delete</button></th><tr><th scope="row"></th><td></td><th>G</th><th>A</th><th>PTS</th><th>SOG</th><th>+/-</th><th>BLK</th><th>HIT</th><th>PIM</th></tr>
            <tr><th>${currentGame.date}</th><td></td><td>${currentGame.stats.Goals["#text"]}</td><td>${currentGame.stats.Assists["#text"]}</td><td>${currentGame.stats.Points["#text"]}</td><td>${currentGame.stats.Shots["#text"]}</td><td>${currentGame.stats.PlusMinus["#text"]}</td><td>${currentGame.stats.BlockedShots["#text"]}</td><td>${currentGame.stats.Hits["#text"]}</td><td>${currentGame.stats.PenaltyMinutes["#text"]}</td></tr><br>
            <tr><th>${secondGame.date}</th><td></td><td>${secondGame.stats.Goals["#text"]}</td><td>${secondGame.stats.Assists["#text"]}</td><td>${secondGame.stats.Points["#text"]}</td><td>${secondGame.stats.Shots["#text"]}</td><td>${secondGame.stats.PlusMinus["#text"]}</td><td>${secondGame.stats.BlockedShots["#text"]}</td><td>${secondGame.stats.Hits["#text"]}</td><td>${secondGame.stats.PenaltyMinutes["#text"]}</td></tr><br>
            <tr><th>${thirdGame.date}</th><td></td><td>${thirdGame.stats.Goals["#text"]}</td><td>${thirdGame.stats.Assists["#text"]}</td><td>${thirdGame.stats.Points["#text"]}</td><td>${thirdGame.stats.Shots["#text"]}</td><td>${thirdGame.stats.PlusMinus["#text"]}</td><td>${thirdGame.stats.BlockedShots["#text"]}</td><td>${thirdGame.stats.Hits["#text"]}</td><td>${thirdGame.stats.PenaltyMinutes["#text"]}</td></tr></table>`);
        }
        z += 2;
    }
    $("#pacman").addClass("is-hidden");
    });

    }

$("#run-fav-players,#fav-players-btn").click(grabFavPlayers);



module.exports = {
    // getFBDetails,
    addUserFB,
    // updateUserFB,
    // createUser,
    // loginUser,
    logInGoogle,
    logOut,
    getUserData,
    checkUserExist,
    buildFavTeamObj,
    retrieveFavTeam,
    buildFavPlayerObj,
    grabFavPlayers,
    retrieveFavPlayers
};

},{"./fb-config":5,"./players":10,"./user":12}],3:[function(require,module,exports){
"use strict";

let db = require("./db-interaction");
let user = require("./user");
let favorites = require("./favorites");

let favTeams = [];
function populateFavTeam(){
    favTeams = [];
    db.retrieveFavTeam()
    .then((userData) => {
        let fbFavTeamArray = (Object.values(userData));
        let currentUid = user.getUser();
        $("#tbody").html("");
$("#print").html("");
        for (let i = 0;i < fbFavTeamArray.length;i++){
            let checkUid = fbFavTeamArray[i].uid;
            if(currentUid == checkUid){
                let currentFavTeam = fbFavTeamArray[i];
                // currentFavTeam = currentFavTeam.Name;
                favTeams.push(currentFavTeam);

                
            }


        }

        // for(let q = 0;q<favTeams.length;q++){
        //     $("#tbody").append(`<tr><th scope="row">${favTeams[q]}</th><td></td>   
        //     <td></td>
        //    <td></td>
        //    </tr>`);
        // }
    });
    favorites.favTeamSchedule(favTeams);
}

module.exports = {populateFavTeam};
},{"./db-interaction":2,"./favorites":4,"./user":12}],4:[function(require,module,exports){
"use strict";

var moment = require('moment');
let db = require("./db-interaction");
let user = require("./user");
let dom = require("./dom-builder");
let urlString;
let favTeamInfoArray = [];
let c=0;

let firebase = require("./fb-config"),
    provider = new firebase.auth.GoogleAuthProvider();

function getGameInfo(abbr,teams){

    let username = "batkins4";
    let password = "Cohort24";

        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
            },
            url: `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/full_game_schedule.json?team=${abbr}&date=since-3-months-ago`
        }).done((data) => {
            console.log(data);
            let nextGameIndex = null;
            let today = new Date();
            today = Date.parse(today);
            today = today-150000000;
            let seasonEnd = false;
            let lastEntry = data.fullgameschedule.gameentry.length-1;

            let lastDate = data.fullgameschedule.gameentry[lastEntry].date;
            lastDate = Date.parse(lastDate);
            console.log(lastDate,"lastdafasdfas");
            if(today > lastDate){
            console.log("season over");
            $("#pacman").addClass("is-hidden");
            $("#run-fav-players").addClass("is-hidden");
            $("#favorite-div").html(`<h5>Season is over. See ya next October!</h5><br><h5>Feel free to browser the rest of our site!</h5>`);
            $("#fav-players-btn").addClass("is-hidden");
            $("#fav-teams-btn").addClass("is-hidden");
            }else{
            for(let j=0;j<teams.length;j++){
                let currentTeamID = teams[j].ID;
                for (let i=0;i<data.fullgameschedule.gameentry.length;i++){
                    let currentGame = data.fullgameschedule.gameentry[i];
                    if (currentGame.awayTeam.ID == currentTeamID || currentGame.homeTeam.ID == currentTeamID){

                        let currentDate = currentGame.date;
                        currentDate = Date.parse(currentDate);
                        if(currentDate > today){

                            teams[j].nextGame = [currentGame.awayTeam.Abbreviation,currentGame.homeTeam.Abbreviation,currentGame.id,currentGame.date,currentGame.time,currentGame.awayTeam.City,currentGame.awayTeam.Name,currentGame.homeTeam.City,currentGame.homeTeam.Name];
                            let k = i-1;
                            for(let p=k;p>0;p--){
                                let currentGame = data.fullgameschedule.gameentry[p];

                                if (currentGame.awayTeam.ID == currentTeamID || currentGame.homeTeam.ID == currentTeamID){
                                    
                                    teams[j].previousGame = [currentGame.awayTeam.Abbreviation,currentGame.homeTeam.Abbreviation,currentGame.id,currentGame.date,currentGame.time,currentGame.awayTeam.City,currentGame.awayTeam.Name,currentGame.homeTeam.City,currentGame.homeTeam.Name];
                                    break;
                                }
                            }

                            break;

                        }
                        

                    }

                    
                }

            }

            formatTeams(teams);
        }
   
       });
    }

function favTeamSchedule(favTeamArray){
let stringAbbr = "";

        let currentUser = user.getUser();

    setTimeout(function(){console.log("favteamlenght",favTeamArray.length);
    for (let j=0;j<favTeamArray.length;j++){
        
        stringAbbr += favTeamArray[j].abbr;
        stringAbbr += ",";

    }
    stringAbbr = stringAbbr.substring(0, stringAbbr.length - 1);
    getGameInfo(stringAbbr,favTeamArray);
},3000);



    // });

}


function formatTeams(teams){

let urlString = "";
for (let i=0;i<teams.length;i++){
    let currentTeam = teams[i];
    let currentDate = currentTeam.previousGame[3];
    var newDate = currentDate.replace(/-/g, "");

    urlString = (newDate + "-" + currentTeam.previousGame[0] + "-" + currentTeam.previousGame[1]);

    teams[i].urlString = `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/game_boxscore.json?gameid=${urlString}&teamstats=W,L,GF,GA,Pts&playerstats=G,A,Pts,Sh,ht,bs`;
    usePreviousGame(getPreviousGamePlayers,teams[i]);
}
$("#pacman").addClass("is-hidden");

}

function usePreviousGame(callBackFunction,team){

    let username = "batkins4";
    let password = "Cohort24";
    

    
    
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
            },
            url: team.urlString
        }).done(function(data) {
            // When you tell jQuery to read a file via the ajax method
            // it reads the contents, and then executes whatever function
            // that you specify here in the done() method, and passes in
            // the contents of the file as the first argument.
            let gameData = data;
            callBackFunction(gameData,team);
    });
    }

function getPreviousGamePlayers(gameData,teams){

    let goalsArray = [];
    let assistsArray = [];
    let pointsArray = [];
    let players;



    if(teams.ID == gameData.gameboxscore.game.awayTeam.ID){
        players = gameData.gameboxscore.awayTeam.awayPlayers.playerEntry;
        teams.previousScoreFor = gameData.gameboxscore.awayTeam.awayTeamStats.GoalsFor["#text"];
        teams.previousScoreAgainst = gameData.gameboxscore.homeTeam.homeTeamStats.GoalsFor["#text"];
        if(gameData.gameboxscore.awayTeam.awayTeamStats.Points["#text"] == 2){
            teams.previousGameResult = "W";
        }else if(gameData.gameboxscore.awayTeam.awayTeamStats.Points["#text"] == 1){
            teams.previousGameResult = "OTL";
        }else if(gameData.gameboxscore.awayTeam.awayTeamStats.Points["#text"] == 0){
            teams.previousGameResult = "L";
        }
    }
    else{
        players = gameData.gameboxscore.homeTeam.homePlayers.playerEntry;
        teams.previousScoreFor = gameData.gameboxscore.homeTeam.homeTeamStats.GoalsFor["#text"];
        teams.previousScoreAgainst = gameData.gameboxscore.awayTeam.awayTeamStats.GoalsFor["#text"];
        if(gameData.gameboxscore.homeTeam.homeTeamStats.Points["#text"] == 2){
            teams.previousGameResult = "W";
        }else if(gameData.gameboxscore.homeTeam.homeTeamStats.Points["#text"] == 1){
            teams.previousGameResult = "OTL";
        }else if(gameData.gameboxscore.homeTeam.homeTeamStats.Points["#text"] == 0){
            teams.previousGameResult = "L";
        }

    }

    for(let i=0;i<players.length;i++){
        let stats = players[i].stats;


        if(stats.Goals["#text"] > 0){
            goalsArray.push([stats.Goals["#text"],players[i].player.ID]);
        }
        if(stats.Assists["#text"] > 0){
            assistsArray.push([stats.Assists["#text"],players[i].player.ID]);
        }
        if(stats.Points["#text"] > 0){
            pointsArray.push([stats.Points["#text"],players[i].player.ID]);
        }

    }
    goalsArray = goalsArray.sort(function(a, b) {
        return b[0].localeCompare(a[0]);
    });


    assistsArray = assistsArray.sort(function(a, b) {
        return b[0].localeCompare(a[0]);
    });

    pointsArray = pointsArray.sort(function(a, b) {
        return b[0].localeCompare(a[0]);
    });

    let pointsLeaderName = "No player qualifies";
    let mvpGoals = "";
    let mvpAssists = "";
    let mvpPoints = "";
    let mvpShots = "";
    let mvpHits = "";
    let mvpBlocks = "";
    let pointsLeader;
    // let assistLeader = "none";
    // let pointsLeader = "none";
    if(pointsArray.length > 0){
    // goalsLeader = idPlayerFinder(goalsArray[0][1],players);

    // assistLeader = idPlayerFinder(assistsArray[0][1],players);
    pointsLeader = idPlayerFinder(pointsArray[0][1],players);
    pointsLeaderName = pointsLeader.name;
    mvpGoals = pointsLeader.goals;
    mvpAssists = pointsLeader.assists;
    mvpPoints = pointsLeader.points;
    mvpShots = pointsLeader.shots;
    mvpHits = pointsLeader.hits;
    mvpBlocks = pointsLeader.blocks;
}
    // teams.goalsLeader = goalsLeader;
    // teams.assistLeader = assistLeader;
    // teams.pointsLeader = pointsLeader;

    favTeamInfoArray.push(teams);



    $("#print").append(`<table id="team_${teams.ID}" class="table table-striped table-dark"><tr><th scope="row"><div class="teamname">${teams.Name}</div></th><td></td><td></td><td></td><td></td><td></td><th><button id="delete_${teams.ID}" class="btn btn-danger">Delete</button></th></tr>
    <tr><th>Last Game<br>${teams.previousGame[3]}<br>${teams.previousGame[4]}</th><td>${teams.previousGame[5]} ${teams.previousGame[6]}</td> <td>@ ${teams.previousGame[7]} ${teams.previousGame[8]}</td>
    <th>Final Score:</th><td class="score"><h5>${teams.previousScoreFor}-${teams.previousScoreAgainst}</h5><div id="win-or-lose_${c}">${teams.previousGameResult}</div></td></tr>
    <tr><th>Player Of The Game</th><th>G</th><th>A</th><th>PTS</th><th>SOG</th><th>HIT</th><th>BLK</th></tr><tr><td>${pointsLeaderName}</td><td>${mvpGoals}</td><td>${mvpAssists}</td><td>${mvpPoints}</td><td>${mvpShots}</td><td>${mvpHits}</td><td>${mvpBlocks}</td>
    </tr>
    <tr><th>Next Game<br>${teams.nextGame[3]}<br>${teams.nextGame[4]}</th><td>${teams.nextGame[5]} ${teams.nextGame[6]}</td><td>@ ${teams.nextGame[7]} ${teams.nextGame[8]}</td><td></td><td></td><td></td><td></td>
    </tr>
    
</table>`);
   $("#pacman").addClass("is-hidden");
    if(teams.previousGameResult == "W"){
        $(`#win-or-lose_${c}`).addClass("green");
    }else if(teams.previousGameResult == "OTL"){
        $(`#win-or-lose_${c}`).addClass("black");

    }else{
        $(`#win-or-lose_${c}`).addClass("red");
    }
    
c=c+1;
}



function idPlayerFinder(id, players){
let goals = "0";
let assists ="0";
let points = "0";
let shots = "0";
let hits = "0";
let blocks = "0";

for(let q=0;q<players.length;q++){
    let currentPlayerID = players[q].player.ID;

    if (currentPlayerID == id){
    let playerName =  (players[q].player.FirstName + " " + players[q].player.LastName + " ");
        if(players[q].stats.Goals["#text"]>0){
            goals = ((players[q].stats.Goals["#text"]));

        }
        if(players[q].stats.Assists["#text"]>0){
            assists = ((players[q].stats.Assists["#text"]));
        }
        if(players[q].stats.Points["#text"]>0){
            points = ((players[q].stats.Points["#text"]));         
        }
        if(players[q].stats.Shots["#text"]>0){
            shots = ((players[q].stats.Shots["#text"]));
        }
        if(players[q].stats.Hits["#text"]>0){
            hits = ((players[q].stats.Hits["#text"]));
        }
        if(players[q].stats.BlockedShots["#text"]>0){
            blocks = ((players[q].stats.BlockedShots["#text"]));
        }
        let playerInfoObj = {
            name: playerName,
            goals:goals,
            assists:assists,
            points:points,
            shots:shots,
            hits:hits,
            blocks:blocks
        };
        return playerInfoObj;
    }
    
}
}





module.exports = {getGameInfo,favTeamSchedule};
},{"./db-interaction":2,"./dom-builder":3,"./fb-config":5,"./user":12,"moment":16}],5:[function(require,module,exports){
"use strict";


let firebase = require("firebase/app"),
    fb = require("./fb-key"),
    fbData = fb();

require("firebase/auth");
require("firebase/database");

var config = {
  apiKey: fbData.apiKey,
  authDomain: fbData.authDomain,
  databaseURL: fbData.databaseURL
};


firebase.initializeApp(config);

firebase.getFBsettings = () => {
	// console.log("fb-config.getFBsettings", config);
	return config;
};

module.exports = firebase;



},{"./fb-key":6,"firebase/app":13,"firebase/auth":14,"firebase/database":15}],6:[function(require,module,exports){
"use strict";

function getKey() {
   return {
    apiKey: "AIzaSyCtj0Tv32FrgKRBntIh7ePzGxefG6_9EfA",
    authDomain: "puck-luck.firebaseapp.com",
    databaseURL: "https://puck-luck.firebaseio.com"
   };
}
//something is your fb address

module.exports = getKey;

},{}],7:[function(require,module,exports){
"use strict";

var gameUrl = 'http://statsapi.web.nhl.com/api/v1/game/2017021074/feed/live';

let game;
let nhlData;
function useGame(callBackFunction){



    $.ajax({
        url: gameUrl
    }).done(function(data) {
        // When you tell jQuery to read a file via the ajax method
        // it reads the contents, and then executes whatever function
        // that you specify here in the done() method, and passes in
        // the contents of the file as the first argument.
        let gameData = data;
        callBackFunction(gameData);
});
}

function listGame(gameData){
    let game = gameData.liveData.boxscore.teams.home.players;
    let playersId = Object.keys(game);
    for(let i=0;i<playersId.length;i++){
        let id = playersId[i];

        var name = game[id].person.fullName;
        $("#print").append(`<h2>${name}</h2>`);
        if('skaterStats' in game[id].stats){
        var time = game[id].stats.skaterStats.timeOnIce;
        var assists = game[id].stats.skaterStats.assists;
        var goals = game[id].stats.skaterStats.goals;
        var shots = game[id].stats.skaterStats.shots;
        var blocks = game[id].stats.skaterStats.blocked;
        var hits = game[id].stats.skaterStats.hits;
        var plusMinus = game[id].stats.skaterStats.plusMinus;
        $("#print").append(`Time on Ice: ${time}<br>`);
        $("#print").append(`Assists: ${assists}<br>`);
        $("#print").append(`Goals: ${goals}<br>`);
        $("#print").append(`Shots on Goal: ${shots}<br>`);
        $("#print").append(`Blocks: ${blocks}<br>`);
        $("#print").append(`Hits: ${hits}<br>`);
        $("#print").append(`+/-: ${plusMinus}<br>`);
        }else if('goalieStats' in game[id].stats) {
            var saves = game[id].stats.goalieStats.saves;
            var savePer = game[id].stats.goalieStats.savePercentage;
            savePer = Math.round(savePer * 100) / 100;
            $("#print").append(`Saves: ${saves}<br>`);
            $("#print").append(`Save Percentage: ${savePer} %<br>`);
        }else{
            $("#print").append(`Did not Play`);
        }


    }

}





// useGame(listGame);

module.exports = {useGame,listGame};
},{}],8:[function(require,module,exports){
"use strict";

let game = require("./game");
let day = require("./byDay");
let team = require("./team");
let players = require("./players");
let dom =require("./dom-builder");
let news = require("./news");
let favorites = ("./favorites");
let welcomeName;
let favoriteTeam;
let userDisplayName;
let result;
let favTeamID;
let deleteVar = "dt";

let firebase = require("./fb-config"),
    provider = new firebase.auth.GoogleAuthProvider();

let db = require("./db-interaction"),
    user = require("./user");

news.useNews(news.listNews);

$('#btn-teams').click(team.printTeamHeader);
$('#players-btn').click(players.printPlayerHeader);

$("#login").click(function() {

    db.logInGoogle()
    .then((result) => {
        $("#pacman").removeClass("is-hidden");
      user.setUser(result.user.uid);
      user.setName(result.user.displayName);
      $("#home-btn").removeClass("is-hidden");
      $("#fav-players-btn").removeClass("is-hidden");
      $("#fav-teams-btn").removeClass("is-hidden");
      $("#login").addClass("is-hidden");
      $("#logout").removeClass("is-hidden");
      $("#low-header").html("");
      $("#player-search").addClass("is-hidden");
      $("#low-body").html("");
      $("#low-title").html("");
      $("#favorite-div").removeClass("is-hidden");
      $("#run-fav-players").removeClass("is-hidden");
      $("run-fav-teams").addClass("is-hidden");
      $("#main-header").removeClass("is-hidden");
      $("#banner").addClass("is-hidden");
      $("#print").html("");
      $("#low-print").html("");
      deleteVar = "dt";
      $("#main-header").html("");
      userDisplayName = result.user.displayName;
      welcomeName = userDisplayName.substr(0,userDisplayName.indexOf(' '));
      db.checkUserExist();
      $("#title").html(`<h1>Welcome ${welcomeName}</h1>`);
      setTimeout(dom.populateFavTeam(),3000);

 




    });

  });
  
  $("#logout").click(() => {
      db.logOut();
      $("#fav-players-btn").addClass("is-hidden");
      $("#fav-teams-btn").addClass("is-hidden");
      $("#login").removeClass("is-hidden");
      $("#logout").addClass("is-hidden");
      $("#favorite-div").addClass("is-hidden");
      $("#title").html("<h5>Please Login To See Favorite Team</h5>");
      $("tbody").html("");
      $("#low-header").html("");
      $("#low-body").html("");
      $("#print").html("");
      $("#main-header").html("");
      $("#run-fav-players").addClass("is-hidden");
      $("run-fav-teams").addClass("is-hidden");
      $("#low-print").html("");
      $("#banner").removeClass("is-hidden");

      
  });

  $("#run-fav-team").click((event) => {
    favoriteTeam = $("#favorite-team-select").val();
    deleteVar = "dt";


    $("#pacman").removeClass("is-hidden");

    db.buildFavTeamObj(favoriteTeam);
    setTimeout(dom.populateFavTeam, 2000 );
    // setTimeout(favorites.refreshFavTeams(),5000);

});


$("#home-btn,#fav-teams-btn").click(() => {
    $("#favorite-div").removeClass("is-hidden");
    $("#player-search").addClass("is-hidden");
    $("#run-fav-players").removeClass("is-hidden");
    $("#title").html(`<h1>Welcome ${welcomeName}</h1>`);
    $("#tbody").html("");
    $("#low-body").html("");
    $("#low-title").html("");
    $("#run-fav-teams").addClass("is-hidden");
    $("#pacman").removeClass("is-hidden");
    $("#main-header").html("");
    $("print").html("");
    $("#print").html("");
    $("#low-print").html("");

//     $("#main-header").html(`<tr>
//     <th scope="col" id="counter"><h5>Favorite Team(s)</h5></th>
//     <th scope="col" id="left-head"><h5>Next Game</h5></th>
//     <th scope="col" id="middle-head"><h5>Previous Game</h5></th>
//     <th scope="col" id="right-head"><h5>Notable Players from Previous Game</h5></th>

//   </tr>`);
  $("#main-header").removeClass("is-hidden");
    $("#low-header").html("");
    // $("#counter").html("<h5>Favorite Teams</h5>");
    // $("#left-head").html("<h5>Next Game</h5>");
    // $("#middle-head").html("<h5>Previous Game</h5>");
    // $("#right-head").html("<h5>Notable Players from Previous Game</h5>");
    dom.populateFavTeam();
    deleteVar = "dt";

});

$("#run-fav-players,#fav-players-btn").click(() => {
    deleteVar = "dp";
    $("#print").html("");
    $("#low-print").html("");


});

$("#run-fav-teams").click(() => {
    $("#favorite-div").removeClass("is-hidden");
    $("#run-fav-teams").addClass("is-hidden");
    $("#run-fav-players").removeClass("is-hidden");
    $("#player-search").addClass("is-hidden");
    $("#title").html(`<h1>Your Teams</h1>`);
    $("#low-title").html("");
    $("#low-body").html("");
    $("#tbody").html("");
    $("#main-header").removeClass("is-hidden");
    $("#main-header").html("");
    $("#print").html("");
    $("#low-print").html("");

//     $("#main-header").html(`<tr>
//     <th scope="col" id="counter"><h5>Favorite Team(s)</h5></th>
//     <th scope="col" id="left-head"><h5>Next Game</h5></th>
//     <th scope="col" id="middle-head"><h5>Previous Game</h5></th>
//     <th scope="col" id="right-head"><h5>Notable Players from Previous Game</h5></th>

//   </tr>`);

$("#pacman").removeClass("is-hidden");

    deleteVar = "dt";
    dom.populateFavTeam();
});

function deleteFavTeam(fbID) {
    return $.ajax({
          url: `${firebase.getFBsettings().databaseURL}/favTeam/${fbID}.json`,
          method: "DELETE"
    }).done((data) => {
        // dom.populateFavTeam();
        return data;
    });
}

function deleteFavPlayers(fbID) {
    return $.ajax({
          url: `${firebase.getFBsettings().databaseURL}/favPlayer/${fbID}.json`,
          method: "DELETE"
    }).done((data) => {
        // db.grabFavPlayers();
        return data;
    });
}

$(document).ready(function() {
    $("body").click(function (event) {
        let selectClass = event.target.className;

        let player = event.target.id;
        let favoritePlayer = player.slice(10, 14);
        if(selectClass == "btn btn-light"){
            deleteVar = "dp";


}});
});




$(document).ready(function() {
    $("body").click(function (event) {
        let selectClass = event.target.className;

        let team = event.target.id;
        if(selectClass == "btn btn-danger" && deleteVar == "dt"){
            let teamID = team.match(/\d+/)[0];
            let teamTableID=`team_${teamID}`;
            $('#'+teamTableID).html("");

            let currentUid = user.getUser();
            db.retrieveFavTeam()
            .then((userData) => {

                let fbIDArray = (Object.keys(userData));
        
                for(let i=0;i<fbIDArray.length;i++){
                    let currentID  = fbIDArray[i];
                    if (userData[currentID].ID == teamID && userData[currentID].uid == currentUid){
                        deleteFavTeam(currentID);
                        break;
                        
                        
                    }
        
                }
        
        
            });




}});

});

$(document).ready(function() {
    $("body").click(function (event) {
        let selectClass = event.target.className;

        let player = event.target.id;
        if(selectClass == "btn btn-danger" && deleteVar == "dp"){
            let playerID = player.match(/\d+/)[0];
            let playerTableID = `player_${playerID}`;
            $('#' + playerTableID).html("");
            

            let currentUid = user.getUser();
            db.retrieveFavPlayers()
            .then((userData) => {

                let fbIDArray = (Object.keys(userData));
        
                for(let i=0;i<fbIDArray.length;i++){
                    let currentID  = fbIDArray[i];
                    if (userData[currentID].playerID == playerID && userData[currentID].uid == currentUid){
                        
                        deleteFavPlayers(currentID);
                        break;
                        
                        
                    }
        
                }
        
        
            });




}});

});
},{"./byDay":1,"./db-interaction":2,"./dom-builder":3,"./fb-config":5,"./game":7,"./news":9,"./players":10,"./team":11,"./user":12}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
"use strict";
/*jshint -W069 */

let team = require("./team");
let db = require("./db-interaction");

var playersUrl = "https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/active_players.json";
let playerResults;
let playerID;
var playerStatsUrl = `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/cumulative_player_stats.json?playerstats=G,A,Pts,Sh&player=${playerID}`;
let playerStatsObject;
let playerInfoObj;
// let playerStatsArray=[];
let playerInfoObjArray=[];
let idArray = [];
let x;
function usePlayers(callBackFunction){

    let username = "batkins4";
    let password = "Cohort24";
    
    
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
            },
            url: playersUrl
        }).done(function(data) {


            let playersData = data;

            callBackFunction(playersData);
    });
    }

function printPlayerHeader(){
    $("#main-header").html(`<tr>
    <th scope="col" id="counter"><h5>Number/Position</h5></th>
    <th scope="col" id="left-head"><h5>Player</h5></th>
    <th scope="col" id="middle-head"><h5>Info</h5></th>
    <th scope="col" id="right-head"><h5>G</h5></th>
    <th scope="col" id="5-head"><h5>A</h5></th>
    <th scope="col" id="6-head"><h5>PTS</h5></th>
    <th scope="col" id="7-head"><h5>SOG</h5></th>
  </tr>`);
  $("#main-header").removeClass("is-hidden");
  $("#low-header").html(`<th scope="col" id="counter"><h5>Number/Position</h5></th>
  <th scope="col" id="left-head"><h5>Player</h5></th>
  <th scope="col" id="middle-head"><h5>Info</h5></th>
  <th scope="col" id="right-head"><h5>Record</h5></th>
  <th scope="col" id="5-head"><h5>SO</h5></th>
  <th scope="col" id="6-head"><h5>GAA</h5></th>
  <th scope="col" id="7-head"><h5>SV%</h5></th>
  </tr>`);
    $("#player-search").removeClass("is-hidden");
    $("#low-header").removeClass("is-hidden");
    $("#low-body").html("");
    $("#low-title").html(`<h5>Goalies</h5><br>`);
    // $("#left-head").html("<h5>Player</h5>");
    // $("#middle-head").html("<h5>Info</h5>");
    // $("#right-head").html("<h5>Stats</h5>");
    $("#counter").html(`<h5>Number/Position</h5>`);
    $("#favorite-div").addClass("is-hidden");
    $("#title").html(`<h1>Search For a Player</h1>`);
    $("#run-fav-teams").addClass("is-hidden");
    $("#run-fav-players").addClass("is-hidden");
    $("#print").html("");
    $("#low-print").html("");
    $("#tbody").html("");
}

function usePlayerStats(idArray,playerInfoObj){
    let username = "batkins4";
    let password = "Cohort24";
    
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
            },
            url: `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/cumulative_player_stats.json?playerstats=G,A,Pts,Sh,Sv,W,L,OTL,SO,GAA,GA`
        }).done(function(data) {

            for(let i=0;i<idArray.length;i++){
                let currentID = idArray[i];

                for(let p=0;p<playerInfoObjArray.length;p++){
                    let currentCheckID = playerInfoObjArray[p].playerID;

                    if(currentID == currentCheckID){

                        for (let z=0;z<data.cumulativeplayerstats.playerstatsentry.length;z++){
                            let currentEntry = data.cumulativeplayerstats.playerstatsentry[z].player.ID;
                            if (currentEntry == currentID && data.cumulativeplayerstats.playerstatsentry[z].player.Position !=="G"){

                                let currentStats = data.cumulativeplayerstats.playerstatsentry[z].stats.stats;

                        $("#tbody").append(`<tr><th scope="row">#${playerInfoObjArray[p].jersey}<br>${playerInfoObjArray[p].position}<br></th><td>${playerInfoObjArray[p].name}<br>${playerInfoObjArray[p].image}</td>   
                        <td>Team: ${data.cumulativeplayerstats.playerstatsentry[z].team.City} ${data.cumulativeplayerstats.playerstatsentry[z].team.Name}<br>Born: ${playerInfoObjArray[p].country}<br>Birthday: ${playerInfoObjArray[p].bday}<br>Height: ${playerInfoObjArray[p].height}<br>Weight: ${playerInfoObjArray[p].weight}<br>${playerInfoObjArray[p].twitter}<br></td><td>${currentStats.Goals["#text"]}</td>
                        <td>${currentStats.Assists["#text"]}</td><td>${currentStats.Points["#text"]}</td><td>${currentStats.Shots["#text"]}</td></tr>`);
                    }else if(currentEntry == currentID && data.cumulativeplayerstats.playerstatsentry[z].player.Position == "G"){
                        let currentStats = data.cumulativeplayerstats.playerstatsentry[z].stats.stats;
                        let ga = currentStats.GoalsAgainst["#text"];
                        ga = parseInt(ga);
                        let sv = currentStats.Saves["#text"];
                        sv = parseInt(sv);
                        let savePer = sv+ga;
            
                        savePer = sv/savePer;
                        savePer = Math.round(savePer * 10000) / 100;
                        $("#low-body").append(`<tr><th scope="row">#${playerInfoObjArray[p].jersey}<br>${playerInfoObjArray[p].position}<br></th><td>${playerInfoObjArray[p].name}<br>${playerInfoObjArray[p].image}</td>   
                        <td>Team: ${data.cumulativeplayerstats.playerstatsentry[z].team.City} ${data.cumulativeplayerstats.playerstatsentry[z].team.Name}<br>Born: ${playerInfoObjArray[p].country}<br>Birthday: ${playerInfoObjArray[p].bday}<br>Height: ${playerInfoObjArray[p].height}<br>Weight:${playerInfoObjArray[p].weight}<br>${playerInfoObjArray[p].twitter}</td><td>
                        ${currentStats.Wins["#text"]}-${currentStats.Losses["#text"]}-${currentStats.OvertimeLosses["#text"]}</td><td>${currentStats.Shutouts["#text"]}</td><td>${currentStats.GoalsAgainstAverage["#text"]}</td><td>${savePer}</td></tr>`);
// Because the season ended and the favorite players/teams page is under construction, I removed the add Player button. When ready to reinsert for playoffs or next season, add this line of code immediately after the player position on skater and goalie
// <button class="btn btn-light" id='addPlayer_${playerInfoObjArray[p].playerID}'>Add to Favorites</button>

                    }
                
                
                }
                    }



                }


            }
            $("#pacman").addClass("is-hidden");
        }
         

        );

    }







function searchPlayers(playersData){
    // var date = moment().format('MM-DD-YYYY');

    $("#tbody").html("");
    $("#low-body").html("");


    let playerArray = playersData.activeplayers.playerentry;
    let playerSearch = $("#player-input").val();
    let playerResults = [];
    playerSearch = playerSearch.toLowerCase();
    for (let p=0 ; p<playerArray.length; p++){
    let currentLastName = playerArray[p].player.LastName;
    let lcLastName = currentLastName.toLowerCase();
    let currentFirstName = playerArray[p].player.FirstName;
    let lcFirstName = currentFirstName.toLowerCase();
    let currentFullName = lcFirstName + " " + lcLastName;
    let lcFullName = currentFullName.toLowerCase();



    if (lcFullName.includes(playerSearch)){
        let currentFullName = currentFirstName+" "+currentLastName;
        playerResults.push(playerArray[p].player);

    }

    }
    listPlayers(playerResults);

}
function listPlayers(playerResults){
    idArray =[];
    playerInfoObjArray = [];
    $("#tbody").html("");
    let c=0;
    for(let pd = 0;pd < playerResults.length;pd++){
    let printPlayer = playerResults[pd];

        let twitterAccount = "";
        let image = `(No Available Image)`;
        if(printPlayer.Twitter){
            twitterAccount = `<a href="https://twitter.com/${printPlayer.Twitter}">Twitter Account</a>`;
        }
        if(printPlayer.officialImageSrc){
            image=`<img src="${printPlayer.officialImageSrc} "height="200px" width="200px">`;
        }

    let name = printPlayer.FirstName + " " + printPlayer.LastName;

    playerInfoObj = {
        playerID:printPlayer.ID,
        name:name,
        jersey:printPlayer.JerseyNumber,
        position:printPlayer.Position,
        image:image,
        country:printPlayer.BirthCountry,
        bday:printPlayer.BirthDate,
        height:printPlayer.Height,
        weight:printPlayer.Weight,
        twitter:twitterAccount

    };

    if (playerInfoObj.country == null){
        playerInfoObj.country = "Not listed";
    }

    if (playerInfoObj.height == null){
        playerInfoObj.country = "Not listed";
    }

    if (playerInfoObj.weight == null){
        playerInfoObj.country = "Not listed";
    }

    if (playerInfoObj.jersey == null){
        playerInfoObj.country = "Not listed";
    }

    if (playerInfoObj.bday == null){
        playerInfoObj.country = "Not listed";
    }

    playerInfoObjArray.push(playerInfoObj);



    c = c+1;
    let playerID = printPlayer.ID;
    idArray.push(playerID);

    if(c==playerResults.length){
        usePlayerStats(idArray);
    }

    playerStatsUrl = `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/cumulative_player_stats.json?playerstats=G,A,Pts,Sh&player=${playerID}`;



}}





function runSearch(){
    $("#pacman").removeClass("is-hidden");
    $("#tbody").html("");
    $("#low-body").html("");
    usePlayers(searchPlayers);
}

$(document).ready(function() {
    $("body").click(function (event) {
        let selectClass = event.target.className;
        let player = event.target.id;

        let favoritePlayer = player.match(/\d+/);

        if(selectClass == "btn btn-light"){
            db.buildFavPlayerObj(favoritePlayer,playerInfoObjArray);


}});
});


$("#run-player-search").click(runSearch);

module.exports = {usePlayers,searchPlayers,runSearch,printPlayerHeader};
},{"./db-interaction":2,"./team":11}],11:[function(require,module,exports){
"use strict";

let team;

var teamUrl = `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/cumulative_player_stats.json?playerstats=G,A,Pts,Sh,Sv,W,L,OTL,SO,GAA,GA&team=${team}`;

function useTeam(callBackFunction){

let username = "batkins4";
let password = "Cohort24";



    $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
        },
        url: teamUrl
    }).done(function(data) {
        // When you tell jQuery to read a file via the ajax method
        // it reads the contents, and then executes whatever function
        // that you specify here in the done() method, and passes in
        // the contents of the file as the first argument.
        let teamData = data;
        callBackFunction(teamData);
});
}


function listTeam(teamData){
    let player = teamData.cumulativeplayerstats.playerstatsentry;
    let row = 1;
    $("#tbody").html("");
    $("#low-body").html("");
    for(let p=0;p<player.length;p++){
        let currentPlayer = player[p];
        let addPlayerButton;
        let gp = currentPlayer.stats.GamesPlayed["#text"];
        if(gp > 3 && currentPlayer.player.Position !== "G"){
            $("#tbody").append(`<tr>
            <th scope="row">#${currentPlayer.player.JerseyNumber}</th><td><b>${currentPlayer.player.FirstName} ${currentPlayer.player.LastName}</b></td><td>${currentPlayer.player.Position}</td> <td>${currentPlayer.stats.stats.Goals["#text"]} </td> <td>${currentPlayer.stats.stats.Assists["#text"]}</td><td>${currentPlayer.stats.stats.Points["#text"]}</td><td>${currentPlayer.stats.stats.Shots["#text"]}</td></tr>`);
        }else if(gp > 3 && currentPlayer.player.Position == "G"){
            let ga = currentPlayer.stats.stats.GoalsAgainst["#text"];
            ga = parseInt(ga);
            let sv = currentPlayer.stats.stats.Saves["#text"];
            sv = parseInt(sv);
            let savePer = sv+ga;

            savePer = sv/savePer;
            savePer = Math.round(savePer * 10000) / 100;
            $("#low-body").append(`<tr><th scope="row">${currentPlayer.player.JerseyNumber}</th><td><b>${currentPlayer.player.FirstName} ${currentPlayer.player.LastName}</b></td> 
            <td>${currentPlayer.player.Position}</td>
            <td>${currentPlayer.stats.stats.Wins["#text"]}-${currentPlayer.stats.stats.Losses["#text"]}-${currentPlayer.stats.stats.OvertimeLosses["#text"]}</td>
            <td>${sv}</td><td>${currentPlayer.stats.stats.Shutouts["#text"]}</td>
            <td>${currentPlayer.stats.stats.GoalsAgainstAverage["#text"]}</td>
            <td>${savePer}</td></tr>`);

        }
        row = row +1;
    }

}

function printTeamHeader() {
    $("#tbody").html("");
    $("#low-body").html("");
    $("#run-fav-teams").addClass("is-hidden");
    $("#run-fav-players").addClass("is-hidden");
    $("#favorite-div").addClass("is-hidden");
    $("#player-search").addClass("is-hidden");
    $("#print").html("");
    $("#low-print").html("");
    $("#main-header").html(`<th scope="col" id="counter"><h5>Jersey Number</h5></th>
    <th scope="col" id="left-head"><h5>Player</h5></th>
    <th scope="col" id="middle-head"><h5>Position</h5></th>
    <th scope="col" id="right-head"><h5>G</h5></th>
    <th scope="col" id="5-head"><h5>A</h5></th>
    <th scope="col" id="6-head"><h5>Pts</h5></th>
    <th scope="col" id="7-head"><h5>SOG</h5></th>
    </tr>`);
    $("#low-header").html(`<th scope="col" id="counter"><h5>Jersey Number</h5></th>
    <th scope="col" id="left-head"><h5>Player</h5></th>
    <th scope="col" id="middle-head"><h5>Position</h5></th>
    <th scope="col" id="right-head"><h5>Record</h5></th>
    <th scope="col" id="5-head"><h5>SV</h5></th>
    <th scope="col" id="6-head"><h5>SO</h5></th>
    <th scope="col" id="7-head"><h5>GAA</h5></th>
    <th scope="col" id="8-head"><h5>SV%</h5></th>
    </tr>`);
    $("#low-title").html(`<h5>Goalies</h5><br>`);
  $("#main-header").removeClass("is-hidden");
  $("#low-header").removeClass("is-hidden");
    // $("#counter").html(`<h5>Jersey Number`);
    // $("#left-head").html(`<h5>Player<h5>`);
    // $("#middle-head").html(`<h5>Position</h5>`);
    // $("#right-head").html(`<h5>Stats</h5>`);
    $("#title").html(
    `<h1>Stats By Team</h1><br><select id="team-select">
    <option value="c">Choose a Team</option>
    <option id="29" value="anaheim-ducks">Anaheim Ducks</option>
    <option id="30" value="arizona-coyotes">Arizona Coyotes</option>
    <option id="11" value="boston-bruins">Boston Bruins</option>
    <option id="15" value="buffalo-sabres">Buffalo Sabres</option>
    <option id="23" value="calgary-flames">Calgary Flames</option>
    <option id="3" value="carolina-hurricanes">Carolina Hurricanes</option>
    <option id="20" value="chicago-blackhawks">Chicago Blackhawks</option>
    <option id="22" value="colorado-avalanche">Colorado Avalanche</option>
    <option id="19" value="columbus-bluejackets">Columbus Blue Jackets</option>
    <option id="27" value="dallas-stars">Dallas Stars</option>
    <option id="16" value="detroit-redwings">Detroit Red Wings</option>
    <option id="24" value="edmonton-oilers">Edmonton Oilers</option>
    <option id="4" value="florida-panthers">Florida Panthers</option>
    <option id="28" value="losangeles-kings">Los Angeles Kings</option>
    <option id="25" value="minnesota-wild">Minnesota Wild</option>
    <option id="14" value="montreal-canadiens">Montreal Canadiens</option>
    <option id="18" value="nashville-predators">Nashville Predators</option>
    <option id="7" value="newjersey-devils">New Jersey Devils</option>
    <option id="8" value="newyork-islanders">New York Islanders</option>
    <option id="9" value="newyork-rangers">New York Rangers</option>
    <option id="13" value="ottawa-senators">Ottawa Senators</option>
    <option id="6" value="philadelphia-flyers">Philadelphia Flyers</option>
    <option id="23" value="pittsburgh-penguins">Pittsburgh Penguins</option>
    <option id="26" value="sanjose-sharks">San Jose Sharks</option>
    <option id="17" value="stlouis-blues">St Louis Blues</option>
    <option id="1" value="tampabay-lightning">Tampa Bay Lightning</option>
    <option id="12" value="toronto-mapleleafs">Toronto Maple Leafs</option>
    <option id="21" value="vancouver-canucks">Vancouver Canucks</option>
    <option id="142" value="vegas-goldenknights">Vegas Golden Knights</option>
    <option id="5" value="washington-capitals">Washington Capitals</option>
    <option id="2" value="winnipeg-jets">Winnipeg Jets</option>
    </select>
    <hr>
    <h5>Skaters</h5>`);
}


$(document).ready(function() {
    $("body").click(function (event) {
        let selectId = event.target.id;
        let team = event.target.value;
        if(team !== "c"){
        if(selectId == "team-select"){
        if (team == "c"){

        }

        teamUrl = `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/cumulative_player_stats.json?playerstats=G,A,Pts,Sh,Sv,W,L,OTL,SO,GAA,GA&team=${team}`;
        useTeam(listTeam);
    }}});
});




// useTeam(listTeam);

module.exports = {useTeam,listTeam,printTeamHeader};
},{}],12:[function(require,module,exports){
"use strict";
//install firebase into lib folder npm install firebase --save
let firebase = require("./fb-config"),
	 provider = new firebase.auth.GoogleAuthProvider(),
     currentUser = null,
     currentDisplayName = null;

//listen for changed state
firebase.auth().onAuthStateChanged((user) => {
	console.log("onAuthStateChanged", user);
	if (user){
        currentUser = user.uid;
		console.log("current user Logged in?", currentUser);
	}else {
		currentUser = null;
		console.log("current user NOT logged in:", currentUser);
	}
});

// function logInGoogle() {
// 	//all firebase functions return a promise!! Add a then when called
//     console.log("user");
// 	return firebase.auth().signInWithPopup(provider);
// }

// function logOut(){
// 	return firebase.auth().signOut();
// } 

function getUser(){
	return currentUser;
}

function setUser(val){
	currentUser = val;
}

function setName(val){
    currentDisplayName = val;
}

function getName(){
    return currentDisplayName;
}

module.exports = {getUser, setUser, setName,getName};
},{"./fb-config":5}],13:[function(require,module,exports){
/*! @license Firebase v3.9.0
Build: rev-cc77c9e
Terms: https://firebase.google.com/terms/ */

var firebase=function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=11)}([function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0});var r=void 0;if(void 0!==e)r=e;else if("undefined"!=typeof self)r=self;else try{r=Function("return this")()}catch(e){throw new Error("polyfill failed because global object is unavailable in this environment")}var i=r.Promise||n(8);t.local={Promise:i,GoogPromise:i}}).call(t,n(1))},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(5),i=(0,r.createFirebaseNamespace)();t.default=i,e.exports=t.default},function(e,t,n){"use strict";function r(e){return i(void 0,e)}function i(e,t){if(!(t instanceof Object))return t;switch(t.constructor){case Date:return new Date(t.getTime());case Object:void 0===e&&(e={});break;case Array:e=[];break;default:return t}for(var n in t)t.hasOwnProperty(n)&&(e[n]=i(e[n],t[n]));return e}function o(e,t,n){e[t]=n}Object.defineProperty(t,"__esModule",{value:!0}),t.deepCopy=r,t.deepExtend=i,t.patchProperty=o},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e){var t=a;return a=e,t}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();t.patchCapture=i;var a=Error.captureStackTrace,c=function e(t,n){if(r(this,e),this.code=t,this.message=n,a)a(this,s.prototype.create);else{var i=Error.apply(this,arguments);this.name="FirebaseError",Object.defineProperty(this,"stack",{get:function(){return i.stack}})}};c.prototype=Object.create(Error.prototype),c.prototype.constructor=c,c.prototype.name="FirebaseError";var s=t.ErrorFactory=function(){function e(t,n,i){r(this,e),this.service=t,this.serviceName=n,this.errors=i,this.pattern=/\{\$([^}]+)}/g}return o(e,[{key:"create",value:function(e,t){void 0===t&&(t={});var n=this.errors[e],r=this.service+"/"+e,i=void 0;i=void 0===n?"Error":n.replace(this.pattern,function(e,n){var r=t[n];return void 0!==r?r.toString():"<"+n+"?>"}),i=this.serviceName+": "+i+" ("+r+").";var o=new c(r,i);for(var a in t)t.hasOwnProperty(a)&&"_"!==a.slice(-1)&&(o[a]=t[a]);return o}}]),e}()},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(){function e(e){e=e||d;var t=r[e];return void 0===t&&o("no-app",{name:e}),t}function t(e,t){Object.keys(a).forEach(function(r){var i=n(e,r);null!==i&&h[i]&&h[i](t,e)})}function n(e,t){if("serverAuth"===t)return null;var n=t,r=e.options;return"auth"===t&&(r.serviceAccount||r.credential)&&(n="serverAuth","serverAuth"in a||o("sa-not-supported")),n}var r={},a={},h={},v={__esModule:!0,initializeApp:function(e,n){void 0===n?n=d:"string"==typeof n&&""!==n||o("bad-app-name",{name:n+""}),void 0!==r[n]&&o("duplicate-app",{name:n});var i=new p(e,n,v);return r[n]=i,t(i,"create"),void 0!=i.INTERNAL&&void 0!=i.INTERNAL.getToken||(0,c.deepExtend)(i,{INTERNAL:{getUid:function(){return null},getToken:function(){return l.resolve(null)},addAuthTokenListener:function(){},removeAuthTokenListener:function(){}}}),i},app:e,apps:null,Promise:l,SDK_VERSION:"3.9.0",INTERNAL:{registerService:function(t,n,r,i,s){a[t]&&o("duplicate-service",{name:t}),a[t]=s?n:function(e,t){return n(e,t,d)},i&&(h[t]=i);var u=void 0;return u=function(n){return void 0===n&&(n=e()),"function"!=typeof n[t]&&o("invalid-app-argument",{name:t}),n[t]()},void 0!==r&&(0,c.deepExtend)(u,r),v[t]=u,u},createFirebaseNamespace:i,extendNamespace:function(e){(0,c.deepExtend)(v,e)},createSubscribe:s.createSubscribe,ErrorFactory:u.ErrorFactory,removeApp:function(e){t(r[e],"delete"),delete r[e]},factories:a,useAsService:n,Promise:f.local.GoogPromise,deepExtend:c.deepExtend}};return(0,c.patchProperty)(v,"default",v),Object.defineProperty(v,"apps",{get:function(){return Object.keys(r).map(function(e){return r[e]})}}),(0,c.patchProperty)(e,"App",p),v}function o(e,t){throw v.create(e,t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();t.createFirebaseNamespace=i;var c=n(3),s=n(6),u=n(4),f=n(0),l=f.local.Promise,d="[DEFAULT]",p=function(){function e(t,n,i){var o=this;r(this,e),this.firebase_=i,this.isDeleted_=!1,this.services_={},this.name_=n,this.options_=(0,c.deepCopy)(t);var a="credential"in this.options_,s="serviceAccount"in this.options_;if(a||s){var u=s?"serviceAccount":"credential";"undefined"!=typeof console&&console.log("The '"+u+"' property specified in the first argument to initializeApp() is deprecated and will be removed in the next major version. You should instead use the 'firebase-admin' package. See https://firebase.google.com/docs/admin/setup for details on how to get started.")}Object.keys(i.INTERNAL.factories).forEach(function(e){var t=i.INTERNAL.useAsService(o,e);if(null!==t){var n=o.getService.bind(o,t);(0,c.patchProperty)(o,e,n)}})}return a(e,[{key:"delete",value:function(){var e=this;return new l(function(t){e.checkDestroyed_(),t()}).then(function(){e.firebase_.INTERNAL.removeApp(e.name_);var t=[];return Object.keys(e.services_).forEach(function(n){Object.keys(e.services_[n]).forEach(function(r){t.push(e.services_[n][r])})}),l.all(t.map(function(e){return e.INTERNAL.delete()}))}).then(function(){e.isDeleted_=!0,e.services_={}})}},{key:"getService",value:function(e,t){this.checkDestroyed_(),void 0===this.services_[e]&&(this.services_[e]={});var n=t||d;if(void 0===this.services_[e][n]){var r=this.firebase_.INTERNAL.factories[e](this,this.extendApp.bind(this),t);return this.services_[e][n]=r,r}return this.services_[e][n]}},{key:"extendApp",value:function(e){(0,c.deepExtend)(this,e)}},{key:"checkDestroyed_",value:function(){this.isDeleted_&&o("app-deleted",{name:this.name_})}},{key:"name",get:function(){return this.checkDestroyed_(),this.name_}},{key:"options",get:function(){return this.checkDestroyed_(),this.options_}}]),e}();p.prototype.name&&p.prototype.options||p.prototype.delete||console.log("dc");var h={"no-app":"No Firebase App '{$name}' has been created - call Firebase App.initializeApp()","bad-app-name":"Illegal App name: '{$name}","duplicate-app":"Firebase App named '{$name}' already exists","app-deleted":"Firebase App named '{$name}' already deleted","duplicate-service":"Firebase service named '{$name}' already registered","sa-not-supported":"Initializing the Firebase SDK with a service account is only allowed in a Node.js environment. On client devices, you should instead initialize the SDK with an api key and auth domain","invalid-app-argument":"firebase.{$name}() takes either no argument or a Firebase App instance."},v=new u.ErrorFactory("app","Firebase",h)},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){var n=new d(e,t);return n.subscribe.bind(n)}function o(e,t){return function(){for(var n=arguments.length,r=Array(n),i=0;i<n;i++)r[i]=arguments[i];l.resolve(!0).then(function(){e.apply(void 0,r)}).catch(function(e){t&&t(e)})}}function a(e,t){if("object"!==(void 0===e?"undefined":s(e))||null===e)return!1;var n=!0,r=!1,i=void 0;try{for(var o,a=t[Symbol.iterator]();!(n=(o=a.next()).done);n=!0){var c=o.value;if(c in e&&"function"==typeof e[c])return!0}}catch(e){r=!0,i=e}finally{try{!n&&a.return&&a.return()}finally{if(r)throw i}}return!1}function c(){}Object.defineProperty(t,"__esModule",{value:!0});var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();t.createSubscribe=i,t.async=o;var f=n(0),l=f.local.Promise,d=function(){function e(t,n){var i=this;r(this,e),this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=l.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(function(){t(i)}).catch(function(e){i.error(e)})}return u(e,[{key:"next",value:function(e){this.forEachObserver(function(t){t.next(e)})}},{key:"error",value:function(e){this.forEachObserver(function(t){t.error(e)}),this.close(e)}},{key:"complete",value:function(){this.forEachObserver(function(e){e.complete()}),this.close()}},{key:"subscribe",value:function(e,t,n){var r=this,i=void 0;if(void 0===e&&void 0===t&&void 0===n)throw new Error("Missing Observer.");i=a(e,["next","error","complete"])?e:{next:e,error:t,complete:n},void 0===i.next&&(i.next=c),void 0===i.error&&(i.error=c),void 0===i.complete&&(i.complete=c);var o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(function(){try{r.finalError?i.error(r.finalError):i.complete()}catch(e){}}),this.observers.push(i),o}},{key:"unsubscribeOne",value:function(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))}},{key:"forEachObserver",value:function(e){if(!this.finalized)for(var t=0;t<this.observers.length;t++)this.sendOne(t,e)}},{key:"sendOne",value:function(e,t){var n=this;this.task.then(function(){if(void 0!==n.observers&&void 0!==n.observers[e])try{t(n.observers[e])}catch(e){"undefined"!=typeof console&&console.error&&console.error(e)}})}},{key:"close",value:function(e){var t=this;this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then(function(){t.observers=void 0,t.onNoObservers=void 0}))}}]),e}()},function(e,t){function n(){throw new Error("setTimeout has not been defined")}function r(){throw new Error("clearTimeout has not been defined")}function i(e){if(f===setTimeout)return setTimeout(e,0);if((f===n||!f)&&setTimeout)return f=setTimeout,setTimeout(e,0);try{return f(e,0)}catch(t){try{return f.call(null,e,0)}catch(t){return f.call(this,e,0)}}}function o(e){if(l===clearTimeout)return clearTimeout(e);if((l===r||!l)&&clearTimeout)return l=clearTimeout,clearTimeout(e);try{return l(e)}catch(t){try{return l.call(null,e)}catch(t){return l.call(this,e)}}}function a(){v&&p&&(v=!1,p.length?h=p.concat(h):m=-1,h.length&&c())}function c(){if(!v){var e=i(a);v=!0;for(var t=h.length;t;){for(p=h,h=[];++m<t;)p&&p[m].run();m=-1,t=h.length}p=null,v=!1,o(e)}}function s(e,t){this.fun=e,this.array=t}function u(){}var f,l,d=e.exports={};!function(){try{f="function"==typeof setTimeout?setTimeout:n}catch(e){f=n}try{l="function"==typeof clearTimeout?clearTimeout:r}catch(e){l=r}}();var p,h=[],v=!1,m=-1;d.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];h.push(new s(e,t)),1!==h.length||v||i(c)},s.prototype.run=function(){this.fun.apply(null,this.array)},d.title="browser",d.browser=!0,d.env={},d.argv=[],d.version="",d.versions={},d.on=u,d.addListener=u,d.once=u,d.off=u,d.removeListener=u,d.removeAllListeners=u,d.emit=u,d.binding=function(e){throw new Error("process.binding is not supported")},d.cwd=function(){return"/"},d.chdir=function(e){throw new Error("process.chdir is not supported")},d.umask=function(){return 0}},function(e,t,n){(function(t){!function(n){function r(){}function i(e,t){return function(){e.apply(t,arguments)}}function o(e){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],l(e,this)}function a(e,t){for(;3===e._state;)e=e._value;if(0===e._state)return void e._deferreds.push(t);e._handled=!0,o._immediateFn(function(){var n=1===e._state?t.onFulfilled:t.onRejected;if(null===n)return void(1===e._state?c:s)(t.promise,e._value);var r;try{r=n(e._value)}catch(e){return void s(t.promise,e)}c(t.promise,r)})}function c(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var n=t.then;if(t instanceof o)return e._state=3,e._value=t,void u(e);if("function"==typeof n)return void l(i(n,t),e)}e._state=1,e._value=t,u(e)}catch(t){s(e,t)}}function s(e,t){e._state=2,e._value=t,u(e)}function u(e){2===e._state&&0===e._deferreds.length&&o._immediateFn(function(){e._handled||o._unhandledRejectionFn(e._value)});for(var t=0,n=e._deferreds.length;t<n;t++)a(e,e._deferreds[t]);e._deferreds=null}function f(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n}function l(e,t){var n=!1;try{e(function(e){n||(n=!0,c(t,e))},function(e){n||(n=!0,s(t,e))})}catch(e){if(n)return;n=!0,s(t,e)}}var d=setTimeout;o.prototype.catch=function(e){return this.then(null,e)},o.prototype.then=function(e,t){var n=new this.constructor(r);return a(this,new f(e,t,n)),n},o.all=function(e){var t=Array.prototype.slice.call(e);return new o(function(e,n){function r(o,a){try{if(a&&("object"==typeof a||"function"==typeof a)){var c=a.then;if("function"==typeof c)return void c.call(a,function(e){r(o,e)},n)}t[o]=a,0==--i&&e(t)}catch(e){n(e)}}if(0===t.length)return e([]);for(var i=t.length,o=0;o<t.length;o++)r(o,t[o])})},o.resolve=function(e){return e&&"object"==typeof e&&e.constructor===o?e:new o(function(t){t(e)})},o.reject=function(e){return new o(function(t,n){n(e)})},o.race=function(e){return new o(function(t,n){for(var r=0,i=e.length;r<i;r++)e[r].then(t,n)})},o._immediateFn="function"==typeof t&&function(e){t(e)}||function(e){d(e,0)},o._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)},o._setImmediateFn=function(e){o._immediateFn=e},o._setUnhandledRejectionFn=function(e){o._unhandledRejectionFn=e},void 0!==e&&e.exports?e.exports=o:n.Promise||(n.Promise=o)}(this)}).call(t,n(10).setImmediate)},function(e,t,n){(function(e,t){!function(e,n){"use strict";function r(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),n=0;n<t.length;n++)t[n]=arguments[n+1];var r={callback:e,args:t};return u[s]=r,c(s),s++}function i(e){delete u[e]}function o(e){var t=e.callback,r=e.args;switch(r.length){case 0:t();break;case 1:t(r[0]);break;case 2:t(r[0],r[1]);break;case 3:t(r[0],r[1],r[2]);break;default:t.apply(n,r)}}function a(e){if(f)setTimeout(a,0,e);else{var t=u[e];if(t){f=!0;try{o(t)}finally{i(e),f=!1}}}}if(!e.setImmediate){var c,s=1,u={},f=!1,l=e.document,d=Object.getPrototypeOf&&Object.getPrototypeOf(e);d=d&&d.setTimeout?d:e,"[object process]"==={}.toString.call(e.process)?function(){c=function(e){t.nextTick(function(){a(e)})}}():function(){if(e.postMessage&&!e.importScripts){var t=!0,n=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage("","*"),e.onmessage=n,t}}()?function(){var t="setImmediate$"+Math.random()+"$",n=function(n){n.source===e&&"string"==typeof n.data&&0===n.data.indexOf(t)&&a(+n.data.slice(t.length))};e.addEventListener?e.addEventListener("message",n,!1):e.attachEvent("onmessage",n),c=function(n){e.postMessage(t+n,"*")}}():e.MessageChannel?function(){var e=new MessageChannel;e.port1.onmessage=function(e){a(e.data)},c=function(t){e.port2.postMessage(t)}}():l&&"onreadystatechange"in l.createElement("script")?function(){var e=l.documentElement;c=function(t){var n=l.createElement("script");n.onreadystatechange=function(){a(t),n.onreadystatechange=null,e.removeChild(n),n=null},e.appendChild(n)}}():function(){c=function(e){setTimeout(a,0,e)}}(),d.setImmediate=r,d.clearImmediate=i}}("undefined"==typeof self?void 0===e?this:e:self)}).call(t,n(1),n(7))},function(e,t,n){function r(e,t){this._id=e,this._clearFn=t}var i=Function.prototype.apply;t.setTimeout=function(){return new r(i.call(setTimeout,window,arguments),clearTimeout)},t.setInterval=function(){return new r(i.call(setInterval,window,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(e){e&&e.close()},r.prototype.unref=r.prototype.ref=function(){},r.prototype.close=function(){this._clearFn.call(window,this._id)},t.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},t.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},t._unrefActive=t.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout(function(){e._onTimeout&&e._onTimeout()},t))},n(9),t.setImmediate=setImmediate,t.clearImmediate=clearImmediate},function(e,t,n){e.exports=n(2)}]);module.exports=firebase;


},{}],14:[function(require,module,exports){
(function (global){
/*! @license Firebase v3.9.0
Build: rev-cc77c9e
Terms: https://firebase.google.com/terms/ */

var firebase = require('./app');
(function(){
(function(){var h,aa=aa||{},l=this,ba=function(){},ca=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&
!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==b&&"undefined"==typeof a.call)return"object";return b},da=function(a){return null===a},ea=function(a){return"array"==ca(a)},fa=function(a){var b=ca(a);return"array"==b||"object"==b&&"number"==typeof a.length},m=function(a){return"string"==typeof a},ga=function(a){return"number"==typeof a},p=function(a){return"function"==ca(a)},ha=function(a){var b=typeof a;return"object"==b&&null!=a||"function"==b},ia=function(a,
b,c){return a.call.apply(a.bind,arguments)},ja=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}},q=function(a,b,c){q=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ia:ja;return q.apply(null,arguments)},ka=function(a,b){var c=Array.prototype.slice.call(arguments,
1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}},la=Date.now||function(){return+new Date},r=function(a,b){function c(){}c.prototype=b.prototype;a.xd=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.Tf=function(a,c,f){for(var d=Array(arguments.length-2),e=2;e<arguments.length;e++)d[e-2]=arguments[e];return b.prototype[c].apply(a,d)}};var t=function(a){if(Error.captureStackTrace)Error.captureStackTrace(this,t);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))};r(t,Error);t.prototype.name="CustomError";var ma=function(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")},na=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},oa=/&/g,pa=/</g,qa=/>/g,ra=/"/g,sa=/'/g,ta=/\x00/g,ua=/[\x00&<>"']/,u=function(a,b){return-1!=a.indexOf(b)},va=function(a,b){return a<b?-1:a>b?1:0};var wa=function(a,b){b.unshift(a);t.call(this,ma.apply(null,b));b.shift()};r(wa,t);wa.prototype.name="AssertionError";
var xa=function(a,b,c,d){var e="Assertion failed";if(c)var e=e+(": "+c),f=d;else a&&(e+=": "+a,f=b);throw new wa(""+e,f||[]);},v=function(a,b,c){a||xa("",null,b,Array.prototype.slice.call(arguments,2))},ya=function(a,b){throw new wa("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));},za=function(a,b,c){ga(a)||xa("Expected number but got %s: %s.",[ca(a),a],b,Array.prototype.slice.call(arguments,2));return a},Aa=function(a,b,c){m(a)||xa("Expected string but got %s: %s.",[ca(a),a],b,Array.prototype.slice.call(arguments,
2))},Ba=function(a,b,c){p(a)||xa("Expected function but got %s: %s.",[ca(a),a],b,Array.prototype.slice.call(arguments,2))};var Ca=Array.prototype.indexOf?function(a,b,c){v(null!=a.length);return Array.prototype.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(m(a))return m(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},w=Array.prototype.forEach?function(a,b,c){v(null!=a.length);Array.prototype.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=m(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},Da=function(a,b){for(var c=m(a)?
a.split(""):a,d=a.length-1;0<=d;--d)d in c&&b.call(void 0,c[d],d,a)},Ea=Array.prototype.map?function(a,b,c){v(null!=a.length);return Array.prototype.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=m(a)?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e},Fa=Array.prototype.some?function(a,b,c){v(null!=a.length);return Array.prototype.some.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=m(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return!0;return!1},
Ha=function(a){var b;a:{b=Ga;for(var c=a.length,d=m(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){b=e;break a}b=-1}return 0>b?null:m(a)?a.charAt(b):a[b]},Ia=function(a,b){return 0<=Ca(a,b)},Ka=function(a,b){b=Ca(a,b);var c;(c=0<=b)&&Ja(a,b);return c},Ja=function(a,b){v(null!=a.length);return 1==Array.prototype.splice.call(a,b,1).length},La=function(a,b){var c=0;Da(a,function(d,e){b.call(void 0,d,e,a)&&Ja(a,e)&&c++})},Ma=function(a){return Array.prototype.concat.apply([],arguments)},
Na=function(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]};var Oa=function(a){return Ea(a,function(a){a=a.toString(16);return 1<a.length?a:"0"+a}).join("")};var Pa;a:{var Qa=l.navigator;if(Qa){var Ra=Qa.userAgent;if(Ra){Pa=Ra;break a}}Pa=""}var x=function(a){return u(Pa,a)};var Sa=function(a,b){for(var c in a)b.call(void 0,a[c],c,a)},Ta=function(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b},Ua=function(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b},Va=function(a){for(var b in a)return!1;return!0},Wa=function(a,b){for(var c in a)if(!(c in b)||a[c]!==b[c])return!1;for(c in b)if(!(c in a))return!1;return!0},Xa=function(a){var b={},c;for(c in a)b[c]=a[c];return b},Ya="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),
Za=function(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<Ya.length;f++)c=Ya[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};var $a=function(a){$a[" "](a);return a};$a[" "]=ba;var bb=function(a,b){var c=ab;return Object.prototype.hasOwnProperty.call(c,a)?c[a]:c[a]=b(a)};var cb=x("Opera"),y=x("Trident")||x("MSIE"),eb=x("Edge"),fb=eb||y,gb=x("Gecko")&&!(u(Pa.toLowerCase(),"webkit")&&!x("Edge"))&&!(x("Trident")||x("MSIE"))&&!x("Edge"),hb=u(Pa.toLowerCase(),"webkit")&&!x("Edge"),ib=function(){var a=l.document;return a?a.documentMode:void 0},jb;
a:{var kb="",lb=function(){var a=Pa;if(gb)return/rv\:([^\);]+)(\)|;)/.exec(a);if(eb)return/Edge\/([\d\.]+)/.exec(a);if(y)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(hb)return/WebKit\/(\S+)/.exec(a);if(cb)return/(?:Version)[ \/]?(\S+)/.exec(a)}();lb&&(kb=lb?lb[1]:"");if(y){var mb=ib();if(null!=mb&&mb>parseFloat(kb)){jb=String(mb);break a}}jb=kb}
var nb=jb,ab={},z=function(a){return bb(a,function(){for(var b=0,c=na(String(nb)).split("."),d=na(String(a)).split("."),e=Math.max(c.length,d.length),f=0;0==b&&f<e;f++){var g=c[f]||"",k=d[f]||"";do{g=/(\d*)(\D*)(.*)/.exec(g)||["","","",""];k=/(\d*)(\D*)(.*)/.exec(k)||["","","",""];if(0==g[0].length&&0==k[0].length)break;b=va(0==g[1].length?0:parseInt(g[1],10),0==k[1].length?0:parseInt(k[1],10))||va(0==g[2].length,0==k[2].length)||va(g[2],k[2]);g=g[3];k=k[3]}while(0==b)}return 0<=b})},ob;var pb=l.document;
ob=pb&&y?ib()||("CSS1Compat"==pb.compatMode?parseInt(nb,10):5):void 0;var qb=null,rb=null,tb=function(a){var b="";sb(a,function(a){b+=String.fromCharCode(a)});return b},sb=function(a,b){function c(b){for(;d<a.length;){var c=a.charAt(d++),e=rb[c];if(null!=e)return e;if(!/^[\s\xa0]*$/.test(c))throw Error("Unknown base64 encoding at char: "+c);}return b}ub();for(var d=0;;){var e=c(-1),f=c(0),g=c(64),k=c(64);if(64===k&&-1===e)break;b(e<<2|f>>4);64!=g&&(b(f<<4&240|g>>2),64!=k&&b(g<<6&192|k))}},ub=function(){if(!qb){qb={};rb={};for(var a=0;65>a;a++)qb[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a),
rb[qb[a]]=a,62<=a&&(rb["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a)]=a)}};var vb=function(){this.Da=-1};var yb=function(a,b){this.Da=64;this.ec=l.Uint8Array?new Uint8Array(this.Da):Array(this.Da);this.Fc=this.hb=0;this.h=[];this.lf=a;this.Wd=b;this.Mf=l.Int32Array?new Int32Array(64):Array(64);void 0!==wb||(wb=l.Int32Array?new Int32Array(xb):xb);this.reset()},wb;r(yb,vb);for(var zb=[],Ab=0;63>Ab;Ab++)zb[Ab]=0;var Bb=Ma(128,zb);yb.prototype.reset=function(){this.Fc=this.hb=0;this.h=l.Int32Array?new Int32Array(this.Wd):Na(this.Wd)};
var Cb=function(a){var b=a.ec;v(b.length==a.Da);for(var c=a.Mf,d=0,e=0;e<b.length;)c[d++]=b[e]<<24|b[e+1]<<16|b[e+2]<<8|b[e+3],e=4*d;for(b=16;64>b;b++){var e=c[b-15]|0,d=c[b-2]|0,f=(c[b-16]|0)+((e>>>7|e<<25)^(e>>>18|e<<14)^e>>>3)|0,g=(c[b-7]|0)+((d>>>17|d<<15)^(d>>>19|d<<13)^d>>>10)|0;c[b]=f+g|0}for(var d=a.h[0]|0,e=a.h[1]|0,k=a.h[2]|0,n=a.h[3]|0,C=a.h[4]|0,db=a.h[5]|0,Pb=a.h[6]|0,f=a.h[7]|0,b=0;64>b;b++)var Ah=((d>>>2|d<<30)^(d>>>13|d<<19)^(d>>>22|d<<10))+(d&e^d&k^e&k)|0,g=C&db^~C&Pb,f=f+((C>>>6|
C<<26)^(C>>>11|C<<21)^(C>>>25|C<<7))|0,g=g+(wb[b]|0)|0,g=f+(g+(c[b]|0)|0)|0,f=Pb,Pb=db,db=C,C=n+g|0,n=k,k=e,e=d,d=g+Ah|0;a.h[0]=a.h[0]+d|0;a.h[1]=a.h[1]+e|0;a.h[2]=a.h[2]+k|0;a.h[3]=a.h[3]+n|0;a.h[4]=a.h[4]+C|0;a.h[5]=a.h[5]+db|0;a.h[6]=a.h[6]+Pb|0;a.h[7]=a.h[7]+f|0};
yb.prototype.update=function(a,b){void 0===b&&(b=a.length);var c=0,d=this.hb;if(m(a))for(;c<b;)this.ec[d++]=a.charCodeAt(c++),d==this.Da&&(Cb(this),d=0);else if(fa(a))for(;c<b;){var e=a[c++];if(!("number"==typeof e&&0<=e&&255>=e&&e==(e|0)))throw Error("message must be a byte array");this.ec[d++]=e;d==this.Da&&(Cb(this),d=0)}else throw Error("message must be string or array");this.hb=d;this.Fc+=b};
yb.prototype.digest=function(){var a=[],b=8*this.Fc;56>this.hb?this.update(Bb,56-this.hb):this.update(Bb,this.Da-(this.hb-56));for(var c=63;56<=c;c--)this.ec[c]=b&255,b/=256;Cb(this);for(c=b=0;c<this.lf;c++)for(var d=24;0<=d;d-=8)a[b++]=this.h[c]>>d&255;return a};
var xb=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,
4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];var Eb=function(){yb.call(this,8,Db)};r(Eb,yb);var Db=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225];var Fb=function(){this.Ga=this.Ga;this.tc=this.tc};Fb.prototype.Ga=!1;Fb.prototype.isDisposed=function(){return this.Ga};Fb.prototype.cb=function(){if(this.tc)for(;this.tc.length;)this.tc.shift()()};var Gb=!y||9<=Number(ob),Hb=y&&!z("9");!hb||z("528");gb&&z("1.9b")||y&&z("8")||cb&&z("9.5")||hb&&z("528");gb&&!z("8")||y&&z("9");var Ib=function(a,b){this.type=a;this.currentTarget=this.target=b;this.defaultPrevented=this.nb=!1;this.ee=!0};Ib.prototype.preventDefault=function(){this.defaultPrevented=!0;this.ee=!1};var Jb=function(a,b){Ib.call(this,a?a.type:"");this.relatedTarget=this.currentTarget=this.target=null;this.button=this.screenY=this.screenX=this.clientY=this.clientX=this.offsetY=this.offsetX=0;this.key="";this.charCode=this.keyCode=0;this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1;this.eb=this.state=null;a&&this.init(a,b)};r(Jb,Ib);
Jb.prototype.init=function(a,b){var c=this.type=a.type,d=a.changedTouches?a.changedTouches[0]:null;this.target=a.target||a.srcElement;this.currentTarget=b;if(b=a.relatedTarget){if(gb){var e;a:{try{$a(b.nodeName);e=!0;break a}catch(f){}e=!1}e||(b=null)}}else"mouseover"==c?b=a.fromElement:"mouseout"==c&&(b=a.toElement);this.relatedTarget=b;null===d?(this.offsetX=hb||void 0!==a.offsetX?a.offsetX:a.layerX,this.offsetY=hb||void 0!==a.offsetY?a.offsetY:a.layerY,this.clientX=void 0!==a.clientX?a.clientX:
a.pageX,this.clientY=void 0!==a.clientY?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0):(this.clientX=void 0!==d.clientX?d.clientX:d.pageX,this.clientY=void 0!==d.clientY?d.clientY:d.pageY,this.screenX=d.screenX||0,this.screenY=d.screenY||0);this.button=a.button;this.keyCode=a.keyCode||0;this.key=a.key||"";this.charCode=a.charCode||("keypress"==c?a.keyCode:0);this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey;this.state=a.state;this.eb=
a;a.defaultPrevented&&this.preventDefault()};Jb.prototype.preventDefault=function(){Jb.xd.preventDefault.call(this);var a=this.eb;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,Hb)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};Jb.prototype.Pe=function(){return this.eb};var Kb="closure_listenable_"+(1E6*Math.random()|0),Lb=0;var Mb=function(a,b,c,d,e){this.listener=a;this.xc=null;this.src=b;this.type=c;this.capture=!!d;this.kc=e;this.key=++Lb;this.rb=this.dc=!1},Nb=function(a){a.rb=!0;a.listener=null;a.xc=null;a.src=null;a.kc=null};var Ob=function(a){this.src=a;this.G={};this.$b=0};Ob.prototype.add=function(a,b,c,d,e){var f=a.toString();a=this.G[f];a||(a=this.G[f]=[],this.$b++);var g=Qb(a,b,d,e);-1<g?(b=a[g],c||(b.dc=!1)):(b=new Mb(b,this.src,f,!!d,e),b.dc=c,a.push(b));return b};Ob.prototype.remove=function(a,b,c,d){a=a.toString();if(!(a in this.G))return!1;var e=this.G[a];b=Qb(e,b,c,d);return-1<b?(Nb(e[b]),Ja(e,b),0==e.length&&(delete this.G[a],this.$b--),!0):!1};
var Rb=function(a,b){var c=b.type;c in a.G&&Ka(a.G[c],b)&&(Nb(b),0==a.G[c].length&&(delete a.G[c],a.$b--))};Ob.prototype.Uc=function(a,b,c,d){a=this.G[a.toString()];var e=-1;a&&(e=Qb(a,b,c,d));return-1<e?a[e]:null};var Qb=function(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e];if(!f.rb&&f.listener==b&&f.capture==!!c&&f.kc==d)return e}return-1};var Sb="closure_lm_"+(1E6*Math.random()|0),Tb={},Ub=0,Vb=function(a,b,c,d,e){if(ea(b))for(var f=0;f<b.length;f++)Vb(a,b[f],c,d,e);else c=Wb(c),a&&a[Kb]?a.listen(b,c,d,e):Xb(a,b,c,!1,d,e)},Xb=function(a,b,c,d,e,f){if(!b)throw Error("Invalid event type");var g=!!e,k=Yb(a);k||(a[Sb]=k=new Ob(a));c=k.add(b,c,d,e,f);if(!c.xc){d=Zb();c.xc=d;d.src=a;d.listener=c;if(a.addEventListener)a.addEventListener(b.toString(),d,g);else if(a.attachEvent)a.attachEvent($b(b.toString()),d);else throw Error("addEventListener and attachEvent are unavailable.");
Ub++}},Zb=function(){var a=ac,b=Gb?function(c){return a.call(b.src,b.listener,c)}:function(c){c=a.call(b.src,b.listener,c);if(!c)return c};return b},bc=function(a,b,c,d,e){if(ea(b))for(var f=0;f<b.length;f++)bc(a,b[f],c,d,e);else c=Wb(c),a&&a[Kb]?cc(a,b,c,d,e):Xb(a,b,c,!0,d,e)},dc=function(a,b,c,d,e){if(ea(b))for(var f=0;f<b.length;f++)dc(a,b[f],c,d,e);else c=Wb(c),a&&a[Kb]?a.fa.remove(String(b),c,d,e):a&&(a=Yb(a))&&(b=a.Uc(b,c,!!d,e))&&ec(b)},ec=function(a){if(!ga(a)&&a&&!a.rb){var b=a.src;if(b&&
b[Kb])Rb(b.fa,a);else{var c=a.type,d=a.xc;b.removeEventListener?b.removeEventListener(c,d,a.capture):b.detachEvent&&b.detachEvent($b(c),d);Ub--;(c=Yb(b))?(Rb(c,a),0==c.$b&&(c.src=null,b[Sb]=null)):Nb(a)}}},$b=function(a){return a in Tb?Tb[a]:Tb[a]="on"+a},gc=function(a,b,c,d){var e=!0;if(a=Yb(a))if(b=a.G[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var f=b[a];f&&f.capture==c&&!f.rb&&(f=fc(f,d),e=e&&!1!==f)}return e},fc=function(a,b){var c=a.listener,d=a.kc||a.src;a.dc&&ec(a);return c.call(d,
b)},ac=function(a,b){if(a.rb)return!0;if(!Gb){if(!b)a:{b=["window","event"];for(var c=l,d;d=b.shift();)if(null!=c[d])c=c[d];else{b=null;break a}b=c}d=b;b=new Jb(d,this);c=!0;if(!(0>d.keyCode||void 0!=d.returnValue)){a:{var e=!1;if(0==d.keyCode)try{d.keyCode=-1;break a}catch(g){e=!0}if(e||void 0==d.returnValue)d.returnValue=!0}d=[];for(e=b.currentTarget;e;e=e.parentNode)d.push(e);a=a.type;for(e=d.length-1;!b.nb&&0<=e;e--){b.currentTarget=d[e];var f=gc(d[e],a,!0,b),c=c&&f}for(e=0;!b.nb&&e<d.length;e++)b.currentTarget=
d[e],f=gc(d[e],a,!1,b),c=c&&f}return c}return fc(a,new Jb(b,this))},Yb=function(a){a=a[Sb];return a instanceof Ob?a:null},hc="__closure_events_fn_"+(1E9*Math.random()>>>0),Wb=function(a){v(a,"Listener can not be null.");if(p(a))return a;v(a.handleEvent,"An object listener must have handleEvent method.");a[hc]||(a[hc]=function(b){return a.handleEvent(b)});return a[hc]};var ic=/^[+a-zA-Z0-9_.!#$%&'*\/=?^`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,63}$/;var kc=function(){this.Cc="";this.we=jc};kc.prototype.Eb=!0;kc.prototype.Bb=function(){return this.Cc};kc.prototype.toString=function(){return"Const{"+this.Cc+"}"};var lc=function(a){if(a instanceof kc&&a.constructor===kc&&a.we===jc)return a.Cc;ya("expected object of type Const, got '"+a+"'");return"type_error:Const"},jc={},mc=function(a){var b=new kc;b.Cc=a;return b};mc("");var oc=function(){this.wc="";this.xe=nc};oc.prototype.Eb=!0;oc.prototype.Bb=function(){return this.wc};oc.prototype.toString=function(){return"TrustedResourceUrl{"+this.wc+"}"};var nc={};var qc=function(){this.pa="";this.ve=pc};qc.prototype.Eb=!0;qc.prototype.Bb=function(){return this.pa};qc.prototype.toString=function(){return"SafeUrl{"+this.pa+"}"};
var rc=function(a){if(a instanceof qc&&a.constructor===qc&&a.ve===pc)return a.pa;ya("expected object of type SafeUrl, got '"+a+"' of type "+ca(a));return"type_error:SafeUrl"},sc=/^(?:(?:https?|mailto|ftp):|[^&:/?#]*(?:[/?#]|$))/i,uc=function(a){if(a instanceof qc)return a;a=a.Eb?a.Bb():String(a);sc.test(a)||(a="about:invalid#zClosurez");return tc(a)},pc={},tc=function(a){var b=new qc;b.pa=a;return b};tc("about:blank");var xc=function(a){var b=[];vc(new wc,a,b);return b.join("")},wc=function(){this.yc=void 0},vc=function(a,b,c){if(null==b)c.push("null");else{if("object"==typeof b){if(ea(b)){var d=b;b=d.length;c.push("[");for(var e="",f=0;f<b;f++)c.push(e),e=d[f],vc(a,a.yc?a.yc.call(d,String(f),e):e,c),e=",";c.push("]");return}if(b instanceof String||b instanceof Number||b instanceof Boolean)b=b.valueOf();else{c.push("{");f="";for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(e=b[d],"function"!=typeof e&&(c.push(f),
yc(d,c),c.push(":"),vc(a,a.yc?a.yc.call(b,d,e):e,c),f=","));c.push("}");return}}switch(typeof b){case "string":yc(b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?String(b):"null");break;case "boolean":c.push(String(b));break;case "function":c.push("null");break;default:throw Error("Unknown type: "+typeof b);}}},zc={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},Ac=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g,
yc=function(a,b){b.push('"',a.replace(Ac,function(a){var b=zc[a];b||(b="\\u"+(a.charCodeAt(0)|65536).toString(16).substr(1),zc[a]=b);return b}),'"')};var Bc=function(){};Bc.prototype.Dd=null;var Cc=function(a){return a.Dd||(a.Dd=a.$c())};var Dc,Ec=function(){};r(Ec,Bc);Ec.prototype.fc=function(){var a=Fc(this);return a?new ActiveXObject(a):new XMLHttpRequest};Ec.prototype.$c=function(){var a={};Fc(this)&&(a[0]=!0,a[1]=!0);return a};
var Fc=function(a){if(!a.Vd&&"undefined"==typeof XMLHttpRequest&&"undefined"!=typeof ActiveXObject){for(var b=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],c=0;c<b.length;c++){var d=b[c];try{return new ActiveXObject(d),a.Vd=d}catch(e){}}throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");}return a.Vd};Dc=new Ec;var Gc=function(){};r(Gc,Bc);Gc.prototype.fc=function(){var a=new XMLHttpRequest;if("withCredentials"in a)return a;if("undefined"!=typeof XDomainRequest)return new Hc;throw Error("Unsupported browser");};Gc.prototype.$c=function(){return{}};
var Hc=function(){this.ua=new XDomainRequest;this.readyState=0;this.onreadystatechange=null;this.responseText="";this.status=-1;this.statusText=this.responseXML=null;this.ua.onload=q(this.Re,this);this.ua.onerror=q(this.Sd,this);this.ua.onprogress=q(this.Se,this);this.ua.ontimeout=q(this.Te,this)};h=Hc.prototype;h.open=function(a,b,c){if(null!=c&&!c)throw Error("Only async requests are supported.");this.ua.open(a,b)};
h.send=function(a){if(a)if("string"==typeof a)this.ua.send(a);else throw Error("Only string data is supported");else this.ua.send()};h.abort=function(){this.ua.abort()};h.setRequestHeader=function(){};h.Re=function(){this.status=200;this.responseText=this.ua.responseText;Ic(this,4)};h.Sd=function(){this.status=500;this.responseText="";Ic(this,4)};h.Te=function(){this.Sd()};h.Se=function(){this.status=200;Ic(this,1)};var Ic=function(a,b){a.readyState=b;if(a.onreadystatechange)a.onreadystatechange()};var Jc=function(a,b,c){this.ef=c;this.Fe=a;this.wf=b;this.sc=0;this.lc=null};Jc.prototype.get=function(){var a;0<this.sc?(this.sc--,a=this.lc,this.lc=a.next,a.next=null):a=this.Fe();return a};Jc.prototype.put=function(a){this.wf(a);this.sc<this.ef&&(this.sc++,a.next=this.lc,this.lc=a)};var Kc=function(a){l.setTimeout(function(){throw a;},0)},Lc,Mc=function(){var a=l.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!x("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,
a=q(function(a){if(("*"==d||a.origin==d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&!x("Trident")&&!x("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.Gd;c.Gd=null;a()}};return function(a){d.next={Gd:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?
function(a){var b=document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){l.setTimeout(a,0)}};var Nc=function(){this.Jc=this.Za=null},Pc=new Jc(function(){return new Oc},function(a){a.reset()},100);Nc.prototype.add=function(a,b){var c=Pc.get();c.set(a,b);this.Jc?this.Jc.next=c:(v(!this.Za),this.Za=c);this.Jc=c};Nc.prototype.remove=function(){var a=null;this.Za&&(a=this.Za,this.Za=this.Za.next,this.Za||(this.Jc=null),a.next=null);return a};var Oc=function(){this.next=this.scope=this.Tc=null};Oc.prototype.set=function(a,b){this.Tc=a;this.scope=b;this.next=null};
Oc.prototype.reset=function(){this.next=this.scope=this.Tc=null};var Uc=function(a,b){Qc||Rc();Sc||(Qc(),Sc=!0);Tc.add(a,b)},Qc,Rc=function(){if(-1!=String(l.Promise).indexOf("[native code]")){var a=l.Promise.resolve(void 0);Qc=function(){a.then(Vc)}}else Qc=function(){var a=Vc;!p(l.setImmediate)||l.Window&&l.Window.prototype&&!x("Edge")&&l.Window.prototype.setImmediate==l.setImmediate?(Lc||(Lc=Mc()),Lc(a)):l.setImmediate(a)}},Sc=!1,Tc=new Nc,Vc=function(){for(var a;a=Tc.remove();){try{a.Tc.call(a.scope)}catch(b){Kc(b)}Pc.put(a)}Sc=!1};!gb&&!y||y&&9<=Number(ob)||gb&&z("1.9.1");y&&z("9");var Xc=function(){this.pa="";this.ue=Wc};Xc.prototype.Eb=!0;Xc.prototype.Bb=function(){return this.pa};Xc.prototype.toString=function(){return"SafeHtml{"+this.pa+"}"};var Yc=function(a){if(a instanceof Xc&&a.constructor===Xc&&a.ue===Wc)return a.pa;ya("expected object of type SafeHtml, got '"+a+"' of type "+ca(a));return"type_error:SafeHtml"},Wc={};Xc.prototype.$e=function(a){this.pa=a;return this};var $c=function(a,b){Sa(b,function(b,d){b&&b.Eb&&(b=b.Bb());"style"==d?a.style.cssText=b:"class"==d?a.className=b:"for"==d?a.htmlFor=b:Zc.hasOwnProperty(d)?a.setAttribute(Zc[d],b):0==d.lastIndexOf("aria-",0)||0==d.lastIndexOf("data-",0)?a.setAttribute(d,b):a[d]=b})},Zc={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",frameborder:"frameBorder",height:"height",maxlength:"maxLength",nonce:"nonce",role:"role",rowspan:"rowSpan",type:"type",usemap:"useMap",valign:"vAlign",width:"width"};var ad=function(a){a.prototype.then=a.prototype.then;a.prototype.$goog_Thenable=!0},bd=function(a){if(!a)return!1;try{return!!a.$goog_Thenable}catch(b){return!1}};var A=function(a,b){this.N=0;this.ra=void 0;this.bb=this.na=this.s=null;this.jc=this.Sc=!1;if(a!=ba)try{var c=this;a.call(b,function(a){cd(c,2,a)},function(a){if(!(a instanceof dd))try{if(a instanceof Error)throw a;throw Error("Promise rejected.");}catch(e){}cd(c,3,a)})}catch(d){cd(this,3,d)}},ed=function(){this.next=this.context=this.jb=this.Oa=this.child=null;this.xb=!1};ed.prototype.reset=function(){this.context=this.jb=this.Oa=this.child=null;this.xb=!1};
var fd=new Jc(function(){return new ed},function(a){a.reset()},100),gd=function(a,b,c){var d=fd.get();d.Oa=a;d.jb=b;d.context=c;return d},B=function(a){if(a instanceof A)return a;var b=new A(ba);cd(b,2,a);return b},D=function(a){return new A(function(b,c){c(a)})},id=function(a,b,c){hd(a,b,c,null)||Uc(ka(b,a))},jd=function(a){return new A(function(b){var c=a.length,d=[];if(c)for(var e=function(a,e,f){c--;d[a]=e?{Ne:!0,value:f}:{Ne:!1,reason:f};0==c&&b(d)},f=0,g;f<a.length;f++)g=a[f],id(g,ka(e,f,!0),
ka(e,f,!1));else b(d)})};A.prototype.then=function(a,b,c){null!=a&&Ba(a,"opt_onFulfilled should be a function.");null!=b&&Ba(b,"opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");return kd(this,p(a)?a:null,p(b)?b:null,c)};ad(A);var md=function(a,b){b=gd(b,b,void 0);b.xb=!0;ld(a,b);return a};A.prototype.f=function(a,b){return kd(this,null,a,b)};A.prototype.cancel=function(a){0==this.N&&Uc(function(){var b=new dd(a);nd(this,b)},this)};
var nd=function(a,b){if(0==a.N)if(a.s){var c=a.s;if(c.na){for(var d=0,e=null,f=null,g=c.na;g&&(g.xb||(d++,g.child==a&&(e=g),!(e&&1<d)));g=g.next)e||(f=g);e&&(0==c.N&&1==d?nd(c,b):(f?(d=f,v(c.na),v(null!=d),d.next==c.bb&&(c.bb=d),d.next=d.next.next):od(c),pd(c,e,3,b)))}a.s=null}else cd(a,3,b)},ld=function(a,b){a.na||2!=a.N&&3!=a.N||qd(a);v(null!=b.Oa);a.bb?a.bb.next=b:a.na=b;a.bb=b},kd=function(a,b,c,d){var e=gd(null,null,null);e.child=new A(function(a,g){e.Oa=b?function(c){try{var e=b.call(d,c);a(e)}catch(C){g(C)}}:
a;e.jb=c?function(b){try{var e=c.call(d,b);void 0===e&&b instanceof dd?g(b):a(e)}catch(C){g(C)}}:g});e.child.s=a;ld(a,e);return e.child};A.prototype.Jf=function(a){v(1==this.N);this.N=0;cd(this,2,a)};A.prototype.Kf=function(a){v(1==this.N);this.N=0;cd(this,3,a)};
var cd=function(a,b,c){0==a.N&&(a===c&&(b=3,c=new TypeError("Promise cannot resolve to itself")),a.N=1,hd(c,a.Jf,a.Kf,a)||(a.ra=c,a.N=b,a.s=null,qd(a),3!=b||c instanceof dd||rd(a,c)))},hd=function(a,b,c,d){if(a instanceof A)return null!=b&&Ba(b,"opt_onFulfilled should be a function."),null!=c&&Ba(c,"opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?"),ld(a,gd(b||ba,c||null,d)),!0;if(bd(a))return a.then(b,c,d),!0;if(ha(a))try{var e=a.then;if(p(e))return sd(a,
e,b,c,d),!0}catch(f){return c.call(d,f),!0}return!1},sd=function(a,b,c,d,e){var f=!1,g=function(a){f||(f=!0,c.call(e,a))},k=function(a){f||(f=!0,d.call(e,a))};try{b.call(a,g,k)}catch(n){k(n)}},qd=function(a){a.Sc||(a.Sc=!0,Uc(a.Je,a))},od=function(a){var b=null;a.na&&(b=a.na,a.na=b.next,b.next=null);a.na||(a.bb=null);null!=b&&v(null!=b.Oa);return b};A.prototype.Je=function(){for(var a;a=od(this);)pd(this,a,this.N,this.ra);this.Sc=!1};
var pd=function(a,b,c,d){if(3==c&&b.jb&&!b.xb)for(;a&&a.jc;a=a.s)a.jc=!1;if(b.child)b.child.s=null,td(b,c,d);else try{b.xb?b.Oa.call(b.context):td(b,c,d)}catch(e){ud.call(null,e)}fd.put(b)},td=function(a,b,c){2==b?a.Oa.call(a.context,c):a.jb&&a.jb.call(a.context,c)},rd=function(a,b){a.jc=!0;Uc(function(){a.jc&&ud.call(null,b)})},ud=Kc,dd=function(a){t.call(this,a)};r(dd,t);dd.prototype.name="cancel";
var vd=function(a,b){this.zc=[];this.$d=a;this.Jd=b||null;this.Cb=this.fb=!1;this.ra=void 0;this.ud=this.Cd=this.Nc=!1;this.Gc=0;this.s=null;this.Oc=0};vd.prototype.cancel=function(a){if(this.fb)this.ra instanceof vd&&this.ra.cancel();else{if(this.s){var b=this.s;delete this.s;a?b.cancel(a):(b.Oc--,0>=b.Oc&&b.cancel())}this.$d?this.$d.call(this.Jd,this):this.ud=!0;this.fb||wd(this,new xd)}};vd.prototype.Hd=function(a,b){this.Nc=!1;yd(this,a,b)};
var yd=function(a,b,c){a.fb=!0;a.ra=c;a.Cb=!b;zd(a)},Bd=function(a){if(a.fb){if(!a.ud)throw new Ad;a.ud=!1}};vd.prototype.callback=function(a){Bd(this);Cd(a);yd(this,!0,a)};
var wd=function(a,b){Bd(a);Cd(b);yd(a,!1,b)},Cd=function(a){v(!(a instanceof vd),"An execution sequence may not be initiated with a blocking Deferred.")},Gd=function(a){var b=Dd("https://apis.google.com/js/client.js?onload="+Ed);Fd(b,null,a,void 0)},Fd=function(a,b,c,d){v(!a.Cd,"Blocking Deferreds can not be re-used");a.zc.push([b,c,d]);a.fb&&zd(a)};vd.prototype.then=function(a,b,c){var d,e,f=new A(function(a,b){d=a;e=b});Fd(this,d,function(a){a instanceof xd?f.cancel():e(a)});return f.then(a,b,c)};
ad(vd);
var Hd=function(a){return Fa(a.zc,function(a){return p(a[1])})},zd=function(a){if(a.Gc&&a.fb&&Hd(a)){var b=a.Gc,c=Id[b];c&&(l.clearTimeout(c.Db),delete Id[b]);a.Gc=0}a.s&&(a.s.Oc--,delete a.s);for(var b=a.ra,d=c=!1;a.zc.length&&!a.Nc;){var e=a.zc.shift(),f=e[0],g=e[1],e=e[2];if(f=a.Cb?g:f)try{var k=f.call(e||a.Jd,b);void 0!==k&&(a.Cb=a.Cb&&(k==b||k instanceof Error),a.ra=b=k);if(bd(b)||"function"===typeof l.Promise&&b instanceof l.Promise)d=!0,a.Nc=!0}catch(n){b=n,a.Cb=!0,Hd(a)||(c=!0)}}a.ra=b;d&&
(k=q(a.Hd,a,!0),d=q(a.Hd,a,!1),b instanceof vd?(Fd(b,k,d),b.Cd=!0):b.then(k,d));c&&(b=new Jd(b),Id[b.Db]=b,a.Gc=b.Db)},Ad=function(){t.call(this)};r(Ad,t);Ad.prototype.message="Deferred has already fired";Ad.prototype.name="AlreadyCalledError";var xd=function(){t.call(this)};r(xd,t);xd.prototype.message="Deferred was canceled";xd.prototype.name="CanceledError";var Jd=function(a){this.Db=l.setTimeout(q(this.If,this),0);this.P=a};
Jd.prototype.If=function(){v(Id[this.Db],"Cannot throw an error that is not scheduled.");delete Id[this.Db];throw this.P;};var Id={};var Dd=function(a){var b=new oc;b.wc=a;return Kd(b)},Kd=function(a){var b={},c=b.document||document,d;a instanceof oc&&a.constructor===oc&&a.xe===nc?d=a.wc:(ya("expected object of type TrustedResourceUrl, got '"+a+"' of type "+ca(a)),d="type_error:TrustedResourceUrl");var e=document.createElement("SCRIPT");a={fe:e,Zb:void 0};var f=new vd(Ld,a),g=null,k=null!=b.timeout?b.timeout:5E3;0<k&&(g=window.setTimeout(function(){Md(e,!0);wd(f,new Nd(1,"Timeout reached for loading script "+d))},k),a.Zb=g);e.onload=
e.onreadystatechange=function(){e.readyState&&"loaded"!=e.readyState&&"complete"!=e.readyState||(Md(e,b.Uf||!1,g),f.callback(null))};e.onerror=function(){Md(e,!0,g);wd(f,new Nd(0,"Error while loading script "+d))};a=b.attributes||{};Za(a,{type:"text/javascript",charset:"UTF-8",src:d});$c(e,a);Od(c).appendChild(e);return f},Od=function(a){var b;return(b=(a||document).getElementsByTagName("HEAD"))&&0!=b.length?b[0]:a.documentElement},Ld=function(){if(this&&this.fe){var a=this.fe;a&&"SCRIPT"==a.tagName&&
Md(a,!0,this.Zb)}},Md=function(a,b,c){null!=c&&l.clearTimeout(c);a.onload=ba;a.onerror=ba;a.onreadystatechange=ba;b&&window.setTimeout(function(){a&&a.parentNode&&a.parentNode.removeChild(a)},0)},Nd=function(a,b){var c="Jsloader error (code #"+a+")";b&&(c+=": "+b);t.call(this,c);this.code=a};r(Nd,t);var Pd="StopIteration"in l?l.StopIteration:{message:"StopIteration",stack:""},Qd=function(){};Qd.prototype.next=function(){throw Pd;};Qd.prototype.ye=function(){return this};var Rd=function(a,b){this.ga={};this.w=[];this.wb=this.o=0;var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)this.set(arguments[d],arguments[d+1])}else a&&this.addAll(a)};Rd.prototype.Z=function(){Sd(this);for(var a=[],b=0;b<this.w.length;b++)a.push(this.ga[this.w[b]]);return a};Rd.prototype.oa=function(){Sd(this);return this.w.concat()};Rd.prototype.yb=function(a){return Td(this.ga,a)};
Rd.prototype.remove=function(a){return Td(this.ga,a)?(delete this.ga[a],this.o--,this.wb++,this.w.length>2*this.o&&Sd(this),!0):!1};var Sd=function(a){if(a.o!=a.w.length){for(var b=0,c=0;b<a.w.length;){var d=a.w[b];Td(a.ga,d)&&(a.w[c++]=d);b++}a.w.length=c}if(a.o!=a.w.length){for(var e={},c=b=0;b<a.w.length;)d=a.w[b],Td(e,d)||(a.w[c++]=d,e[d]=1),b++;a.w.length=c}};h=Rd.prototype;h.get=function(a,b){return Td(this.ga,a)?this.ga[a]:b};
h.set=function(a,b){Td(this.ga,a)||(this.o++,this.w.push(a),this.wb++);this.ga[a]=b};h.addAll=function(a){var b;a instanceof Rd?(b=a.oa(),a=a.Z()):(b=Ua(a),a=Ta(a));for(var c=0;c<b.length;c++)this.set(b[c],a[c])};h.forEach=function(a,b){for(var c=this.oa(),d=0;d<c.length;d++){var e=c[d],f=this.get(e);a.call(b,f,e,this)}};h.clone=function(){return new Rd(this)};
h.ye=function(a){Sd(this);var b=0,c=this.wb,d=this,e=new Qd;e.next=function(){if(c!=d.wb)throw Error("The map has changed since the iterator was created");if(b>=d.w.length)throw Pd;var e=d.w[b++];return a?e:d.ga[e]};return e};var Td=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)};var Ud=function(a){if(a.Z&&"function"==typeof a.Z)return a.Z();if(m(a))return a.split("");if(fa(a)){for(var b=[],c=a.length,d=0;d<c;d++)b.push(a[d]);return b}return Ta(a)},Vd=function(a){if(a.oa&&"function"==typeof a.oa)return a.oa();if(!a.Z||"function"!=typeof a.Z){if(fa(a)||m(a)){var b=[];a=a.length;for(var c=0;c<a;c++)b.push(c);return b}return Ua(a)}},Wd=function(a,b){if(a.forEach&&"function"==typeof a.forEach)a.forEach(b,void 0);else if(fa(a)||m(a))w(a,b,void 0);else for(var c=Vd(a),d=Ud(a),e=
d.length,f=0;f<e;f++)b.call(void 0,d[f],c&&c[f],a)};var Xd=function(a,b,c,d,e){this.reset(a,b,c,d,e)};Xd.prototype.Md=null;var Yd=0;Xd.prototype.reset=function(a,b,c,d,e){"number"==typeof e||Yd++;d||la();this.Ib=a;this.hf=b;delete this.Md};Xd.prototype.ie=function(a){this.Ib=a};var Zd=function(a){this.jf=a;this.Td=this.Pc=this.Ib=this.s=null},$d=function(a,b){this.name=a;this.value=b};$d.prototype.toString=function(){return this.name};var ae=new $d("SEVERE",1E3),be=new $d("CONFIG",700),ce=new $d("FINE",500);Zd.prototype.getParent=function(){return this.s};Zd.prototype.ie=function(a){this.Ib=a};var de=function(a){if(a.Ib)return a.Ib;if(a.s)return de(a.s);ya("Root logger has no level set.");return null};
Zd.prototype.log=function(a,b,c){if(a.value>=de(this).value)for(p(b)&&(b=b()),a=new Xd(a,String(b),this.jf),c&&(a.Md=c),c="log:"+a.hf,l.console&&(l.console.timeStamp?l.console.timeStamp(c):l.console.markTimeline&&l.console.markTimeline(c)),l.msWriteProfilerMark&&l.msWriteProfilerMark(c),c=this;c;){var d=c,e=a;if(d.Td)for(var f=0;b=d.Td[f];f++)b(e);c=c.getParent()}};
var ee={},fe=null,ge=function(a){fe||(fe=new Zd(""),ee[""]=fe,fe.ie(be));var b;if(!(b=ee[a])){b=new Zd(a);var c=a.lastIndexOf("."),d=a.substr(c+1),c=ge(a.substr(0,c));c.Pc||(c.Pc={});c.Pc[d]=b;b.s=c;ee[a]=b}return b};var he=function(){Fb.call(this);this.fa=new Ob(this);this.ze=this;this.hd=null};r(he,Fb);he.prototype[Kb]=!0;h=he.prototype;h.addEventListener=function(a,b,c,d){Vb(this,a,b,c,d)};h.removeEventListener=function(a,b,c,d){dc(this,a,b,c,d)};
h.dispatchEvent=function(a){ie(this);var b,c=this.hd;if(c){b=[];for(var d=1;c;c=c.hd)b.push(c),v(1E3>++d,"infinite loop")}c=this.ze;d=a.type||a;if(m(a))a=new Ib(a,c);else if(a instanceof Ib)a.target=a.target||c;else{var e=a;a=new Ib(d,c);Za(a,e)}var e=!0,f;if(b)for(var g=b.length-1;!a.nb&&0<=g;g--)f=a.currentTarget=b[g],e=je(f,d,!0,a)&&e;a.nb||(f=a.currentTarget=c,e=je(f,d,!0,a)&&e,a.nb||(e=je(f,d,!1,a)&&e));if(b)for(g=0;!a.nb&&g<b.length;g++)f=a.currentTarget=b[g],e=je(f,d,!1,a)&&e;return e};
h.cb=function(){he.xd.cb.call(this);if(this.fa){var a=this.fa,b=0,c;for(c in a.G){for(var d=a.G[c],e=0;e<d.length;e++)++b,Nb(d[e]);delete a.G[c];a.$b--}}this.hd=null};h.listen=function(a,b,c,d){ie(this);return this.fa.add(String(a),b,!1,c,d)};
var cc=function(a,b,c,d,e){a.fa.add(String(b),c,!0,d,e)},je=function(a,b,c,d){b=a.fa.G[String(b)];if(!b)return!0;b=b.concat();for(var e=!0,f=0;f<b.length;++f){var g=b[f];if(g&&!g.rb&&g.capture==c){var k=g.listener,n=g.kc||g.src;g.dc&&Rb(a.fa,g);e=!1!==k.call(n,d)&&e}}return e&&0!=d.ee};he.prototype.Uc=function(a,b,c,d){return this.fa.Uc(String(a),b,c,d)};var ie=function(a){v(a.fa,"Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?")};var E=function(a,b){a&&a.log(ce,b,void 0)};var ke=function(a,b,c){if(p(a))c&&(a=q(a,c));else if(a&&"function"==typeof a.handleEvent)a=q(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(b)?-1:l.setTimeout(a,b||0)},le=function(a){var b=null;return(new A(function(c,d){b=ke(function(){c(void 0)},a);-1==b&&d(Error("Failed to schedule timer."))})).f(function(a){l.clearTimeout(b);throw a;})};var me=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/,ne=function(a,b){if(a){a=a.split("&");for(var c=0;c<a.length;c++){var d=a[c].indexOf("="),e,f=null;0<=d?(e=a[c].substring(0,d),f=a[c].substring(d+1)):e=a[c];b(e,f?decodeURIComponent(f.replace(/\+/g," ")):"")}}};var F=function(a){he.call(this);this.headers=new Rd;this.Lc=a||null;this.va=!1;this.Kc=this.b=null;this.Hb=this.Zd=this.qc="";this.Ka=this.Yc=this.oc=this.Rc=!1;this.sb=0;this.Ec=null;this.de="";this.Hc=this.sf=this.te=!1};r(F,he);var oe=F.prototype,pe=ge("goog.net.XhrIo");oe.U=pe;var qe=/^https?$/i,re=["POST","PUT"];
F.prototype.send=function(a,b,c,d){if(this.b)throw Error("[goog.net.XhrIo] Object is active with another request="+this.qc+"; newUri="+a);b=b?b.toUpperCase():"GET";this.qc=a;this.Hb="";this.Zd=b;this.Rc=!1;this.va=!0;this.b=this.Lc?this.Lc.fc():Dc.fc();this.Kc=this.Lc?Cc(this.Lc):Cc(Dc);this.b.onreadystatechange=q(this.be,this);this.sf&&"onprogress"in this.b&&(this.b.onprogress=q(function(a){this.ae(a,!0)},this),this.b.upload&&(this.b.upload.onprogress=q(this.ae,this)));try{E(this.U,se(this,"Opening Xhr")),
this.Yc=!0,this.b.open(b,String(a),!0),this.Yc=!1}catch(f){E(this.U,se(this,"Error opening Xhr: "+f.message));this.P(5,f);return}a=c||"";var e=this.headers.clone();d&&Wd(d,function(a,b){e.set(b,a)});d=Ha(e.oa());c=l.FormData&&a instanceof l.FormData;!Ia(re,b)||d||c||e.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");e.forEach(function(a,b){this.b.setRequestHeader(b,a)},this);this.de&&(this.b.responseType=this.de);"withCredentials"in this.b&&this.b.withCredentials!==this.te&&(this.b.withCredentials=
this.te);try{te(this),0<this.sb&&(this.Hc=ue(this.b),E(this.U,se(this,"Will abort after "+this.sb+"ms if incomplete, xhr2 "+this.Hc)),this.Hc?(this.b.timeout=this.sb,this.b.ontimeout=q(this.Zb,this)):this.Ec=ke(this.Zb,this.sb,this)),E(this.U,se(this,"Sending request")),this.oc=!0,this.b.send(a),this.oc=!1}catch(f){E(this.U,se(this,"Send error: "+f.message)),this.P(5,f)}};var ue=function(a){return y&&z(9)&&ga(a.timeout)&&void 0!==a.ontimeout},Ga=function(a){return"content-type"==a.toLowerCase()};
F.prototype.Zb=function(){"undefined"!=typeof aa&&this.b&&(this.Hb="Timed out after "+this.sb+"ms, aborting",E(this.U,se(this,this.Hb)),this.dispatchEvent("timeout"),this.abort(8))};F.prototype.P=function(a,b){this.va=!1;this.b&&(this.Ka=!0,this.b.abort(),this.Ka=!1);this.Hb=b;ve(this);we(this)};var ve=function(a){a.Rc||(a.Rc=!0,a.dispatchEvent("complete"),a.dispatchEvent("error"))};
F.prototype.abort=function(){this.b&&this.va&&(E(this.U,se(this,"Aborting")),this.va=!1,this.Ka=!0,this.b.abort(),this.Ka=!1,this.dispatchEvent("complete"),this.dispatchEvent("abort"),we(this))};F.prototype.cb=function(){this.b&&(this.va&&(this.va=!1,this.Ka=!0,this.b.abort(),this.Ka=!1),we(this,!0));F.xd.cb.call(this)};F.prototype.be=function(){this.isDisposed()||(this.Yc||this.oc||this.Ka?xe(this):this.nf())};F.prototype.nf=function(){xe(this)};
var xe=function(a){if(a.va&&"undefined"!=typeof aa)if(a.Kc[1]&&4==ye(a)&&2==ze(a))E(a.U,se(a,"Local request error detected and ignored"));else if(a.oc&&4==ye(a))ke(a.be,0,a);else if(a.dispatchEvent("readystatechange"),4==ye(a)){E(a.U,se(a,"Request complete"));a.va=!1;try{var b=ze(a),c;a:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:c=!0;break a;default:c=!1}var d;if(!(d=c)){var e;if(e=0===b){var f=String(a.qc).match(me)[1]||null;if(!f&&l.self&&l.self.location)var g=l.self.location.protocol,
f=g.substr(0,g.length-1);e=!qe.test(f?f.toLowerCase():"")}d=e}if(d)a.dispatchEvent("complete"),a.dispatchEvent("success");else{var k;try{k=2<ye(a)?a.b.statusText:""}catch(n){E(a.U,"Can not get status: "+n.message),k=""}a.Hb=k+" ["+ze(a)+"]";ve(a)}}finally{we(a)}}};F.prototype.ae=function(a,b){v("progress"===a.type,"goog.net.EventType.PROGRESS is of the same type as raw XHR progress.");this.dispatchEvent(Ae(a,"progress"));this.dispatchEvent(Ae(a,b?"downloadprogress":"uploadprogress"))};
var Ae=function(a,b){return{type:b,lengthComputable:a.lengthComputable,loaded:a.loaded,total:a.total}},we=function(a,b){if(a.b){te(a);var c=a.b,d=a.Kc[0]?ba:null;a.b=null;a.Kc=null;b||a.dispatchEvent("ready");try{c.onreadystatechange=d}catch(e){(a=a.U)&&a.log(ae,"Problem encountered resetting onreadystatechange: "+e.message,void 0)}}},te=function(a){a.b&&a.Hc&&(a.b.ontimeout=null);ga(a.Ec)&&(l.clearTimeout(a.Ec),a.Ec=null)},ye=function(a){return a.b?a.b.readyState:0},ze=function(a){try{return 2<ye(a)?
a.b.status:-1}catch(b){return-1}},Be=function(a){try{return a.b?a.b.responseText:""}catch(b){return E(a.U,"Can not get responseText: "+b.message),""}},se=function(a,b){return b+" ["+a.Zd+" "+a.qc+" "+ze(a)+"]"};var G=function(a,b){this.ea=this.Xa=this.ha="";this.lb=null;this.Ja=this.xa="";this.S=this.df=!1;var c;a instanceof G?(this.S=void 0!==b?b:a.S,Ce(this,a.ha),c=a.Xa,H(this),this.Xa=c,De(this,a.ea),Ee(this,a.lb),Fe(this,a.xa),Ge(this,a.W.clone()),a=a.Ja,H(this),this.Ja=a):a&&(c=String(a).match(me))?(this.S=!!b,Ce(this,c[1]||"",!0),a=c[2]||"",H(this),this.Xa=He(a),De(this,c[3]||"",!0),Ee(this,c[4]),Fe(this,c[5]||"",!0),Ge(this,c[6]||"",!0),a=c[7]||"",H(this),this.Ja=He(a)):(this.S=!!b,this.W=new I(null,
0,this.S))};G.prototype.toString=function(){var a=[],b=this.ha;b&&a.push(Ie(b,Je,!0),":");var c=this.ea;if(c||"file"==b)a.push("//"),(b=this.Xa)&&a.push(Ie(b,Je,!0),"@"),a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c=this.lb,null!=c&&a.push(":",String(c));if(c=this.xa)this.ea&&"/"!=c.charAt(0)&&a.push("/"),a.push(Ie(c,"/"==c.charAt(0)?Ke:Le,!0));(c=this.W.toString())&&a.push("?",c);(c=this.Ja)&&a.push("#",Ie(c,Me));return a.join("")};
G.prototype.resolve=function(a){var b=this.clone(),c=!!a.ha;c?Ce(b,a.ha):c=!!a.Xa;if(c){var d=a.Xa;H(b);b.Xa=d}else c=!!a.ea;c?De(b,a.ea):c=null!=a.lb;d=a.xa;if(c)Ee(b,a.lb);else if(c=!!a.xa){if("/"!=d.charAt(0))if(this.ea&&!this.xa)d="/"+d;else{var e=b.xa.lastIndexOf("/");-1!=e&&(d=b.xa.substr(0,e+1)+d)}e=d;if(".."==e||"."==e)d="";else if(u(e,"./")||u(e,"/.")){for(var d=0==e.lastIndexOf("/",0),e=e.split("/"),f=[],g=0;g<e.length;){var k=e[g++];"."==k?d&&g==e.length&&f.push(""):".."==k?((1<f.length||
1==f.length&&""!=f[0])&&f.pop(),d&&g==e.length&&f.push("")):(f.push(k),d=!0)}d=f.join("/")}else d=e}c?Fe(b,d):c=""!==a.W.toString();c?Ge(b,a.W.clone()):c=!!a.Ja;c&&(a=a.Ja,H(b),b.Ja=a);return b};G.prototype.clone=function(){return new G(this)};
var Ce=function(a,b,c){H(a);a.ha=c?He(b,!0):b;a.ha&&(a.ha=a.ha.replace(/:$/,""))},De=function(a,b,c){H(a);a.ea=c?He(b,!0):b},Ee=function(a,b){H(a);if(b){b=Number(b);if(isNaN(b)||0>b)throw Error("Bad port number "+b);a.lb=b}else a.lb=null},Fe=function(a,b,c){H(a);a.xa=c?He(b,!0):b},Ge=function(a,b,c){H(a);b instanceof I?(a.W=b,a.W.td(a.S)):(c||(b=Ie(b,Ne)),a.W=new I(b,0,a.S))},J=function(a,b,c){H(a);a.W.set(b,c)},Oe=function(a,b){return a.W.get(b)};
G.prototype.removeParameter=function(a){H(this);this.W.remove(a);return this};var H=function(a){if(a.df)throw Error("Tried to modify a read-only Uri");};G.prototype.td=function(a){this.S=a;this.W&&this.W.td(a);return this};
var Pe=function(a){return a instanceof G?a.clone():new G(a,void 0)},Qe=function(a,b){var c=new G(null,void 0);Ce(c,"https");a&&De(c,a);b&&Fe(c,b);return c},He=function(a,b){return a?b?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""},Ie=function(a,b,c){return m(a)?(a=encodeURI(a).replace(b,Re),c&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null},Re=function(a){a=a.charCodeAt(0);return"%"+(a>>4&15).toString(16)+(a&15).toString(16)},Je=/[#\/\?@]/g,Le=/[\#\?:]/g,Ke=/[\#\?]/g,Ne=/[\#\?@]/g,
Me=/#/g,I=function(a,b,c){this.o=this.l=null;this.O=a||null;this.S=!!c},Se=function(a){a.l||(a.l=new Rd,a.o=0,a.O&&ne(a.O,function(b,c){a.add(decodeURIComponent(b.replace(/\+/g," ")),c)}))},Ue=function(a){var b=Vd(a);if("undefined"==typeof b)throw Error("Keys are undefined");var c=new I(null,0,void 0);a=Ud(a);for(var d=0;d<b.length;d++){var e=b[d],f=a[d];ea(f)?Te(c,e,f):c.add(e,f)}return c};h=I.prototype;
h.add=function(a,b){Se(this);this.O=null;a=this.R(a);var c=this.l.get(a);c||this.l.set(a,c=[]);c.push(b);this.o=za(this.o)+1;return this};h.remove=function(a){Se(this);a=this.R(a);return this.l.yb(a)?(this.O=null,this.o=za(this.o)-this.l.get(a).length,this.l.remove(a)):!1};h.yb=function(a){Se(this);a=this.R(a);return this.l.yb(a)};h.oa=function(){Se(this);for(var a=this.l.Z(),b=this.l.oa(),c=[],d=0;d<b.length;d++)for(var e=a[d],f=0;f<e.length;f++)c.push(b[d]);return c};
h.Z=function(a){Se(this);var b=[];if(m(a))this.yb(a)&&(b=Ma(b,this.l.get(this.R(a))));else{a=this.l.Z();for(var c=0;c<a.length;c++)b=Ma(b,a[c])}return b};h.set=function(a,b){Se(this);this.O=null;a=this.R(a);this.yb(a)&&(this.o=za(this.o)-this.l.get(a).length);this.l.set(a,[b]);this.o=za(this.o)+1;return this};h.get=function(a,b){a=a?this.Z(a):[];return 0<a.length?String(a[0]):b};var Te=function(a,b,c){a.remove(b);0<c.length&&(a.O=null,a.l.set(a.R(b),Na(c)),a.o=za(a.o)+c.length)};
I.prototype.toString=function(){if(this.O)return this.O;if(!this.l)return"";for(var a=[],b=this.l.oa(),c=0;c<b.length;c++)for(var d=b[c],e=encodeURIComponent(String(d)),d=this.Z(d),f=0;f<d.length;f++){var g=e;""!==d[f]&&(g+="="+encodeURIComponent(String(d[f])));a.push(g)}return this.O=a.join("&")};I.prototype.clone=function(){var a=new I;a.O=this.O;this.l&&(a.l=this.l.clone(),a.o=this.o);return a};I.prototype.R=function(a){a=String(a);this.S&&(a=a.toLowerCase());return a};
I.prototype.td=function(a){a&&!this.S&&(Se(this),this.O=null,this.l.forEach(function(a,c){var b=c.toLowerCase();c!=b&&(this.remove(c),Te(this,b,a))},this));this.S=a};var Ve=function(){var a=K();return y&&!!ob&&11==ob||/Edge\/\d+/.test(a)},We=function(){return l.window&&l.window.location.href||""},Xe=function(a,b){b=b||l.window;var c="about:blank";a&&(c=rc(uc(a)));b.location.href=c},Ye=function(a,b){var c=[],d;for(d in a)d in b?typeof a[d]!=typeof b[d]?c.push(d):ea(a[d])?Wa(a[d],b[d])||c.push(d):"object"==typeof a[d]&&null!=a[d]&&null!=b[d]?0<Ye(a[d],b[d]).length&&c.push(d):a[d]!==b[d]&&c.push(d):c.push(d);for(d in b)d in a||c.push(d);return c},$e=function(){var a;
a=K();a="Chrome"!=Ze(a)?null:(a=a.match(/\sChrome\/(\d+)/i))&&2==a.length?parseInt(a[1],10):null;return a&&30>a?!1:!y||!ob||9<ob},af=function(a){a=(a||K()).toLowerCase();return a.match(/android/)||a.match(/webos/)||a.match(/iphone|ipad|ipod/)||a.match(/blackberry/)||a.match(/windows phone/)||a.match(/iemobile/)?!0:!1},bf=function(a){a=a||l.window;try{a.close()}catch(b){}},cf=function(a,b,c){var d=Math.floor(1E9*Math.random()).toString();b=b||500;c=c||600;var e=(window.screen.availHeight-c)/2,f=(window.screen.availWidth-
b)/2;b={width:b,height:c,top:0<e?e:0,left:0<f?f:0,location:!0,resizable:!0,statusbar:!0,toolbar:!1};c=K().toLowerCase();d&&(b.target=d,u(c,"crios/")&&(b.target="_blank"));"Firefox"==Ze(K())&&(a=a||"http://localhost",b.scrollbars=!0);var g;c=a||"about:blank";(d=b)||(d={});a=window;b=c instanceof qc?c:uc("undefined"!=typeof c.href?c.href:String(c));c=d.target||c.target;e=[];for(g in d)switch(g){case "width":case "height":case "top":case "left":e.push(g+"="+d[g]);break;case "target":case "noreferrer":break;
default:e.push(g+"="+(d[g]?1:0))}g=e.join(",");(x("iPhone")&&!x("iPod")&&!x("iPad")||x("iPad")||x("iPod"))&&a.navigator&&a.navigator.standalone&&c&&"_self"!=c?(g=a.document.createElement("A"),"undefined"!=typeof HTMLAnchorElement&&"undefined"!=typeof Location&&"undefined"!=typeof Element&&(e=g&&(g instanceof HTMLAnchorElement||!(g instanceof Location||g instanceof Element)),f=ha(g)?g.constructor.displayName||g.constructor.name||Object.prototype.toString.call(g):void 0===g?"undefined":null===g?"null":
typeof g,v(e,"Argument is not a HTMLAnchorElement (or a non-Element mock); got: %s",f)),b=b instanceof qc?b:uc(b),g.href=rc(b),g.setAttribute("target",c),d.noreferrer&&g.setAttribute("rel","noreferrer"),d=document.createEvent("MouseEvent"),d.initMouseEvent("click",!0,!0,a,1),g.dispatchEvent(d),g={}):d.noreferrer?(g=a.open("",c,g),d=rc(b),g&&(fb&&u(d,";")&&(d="'"+d.replace(/'/g,"%27")+"'"),g.opener=null,a=mc("b/12014412, meta tag with sanitized URL"),ua.test(d)&&(-1!=d.indexOf("&")&&(d=d.replace(oa,
"&amp;")),-1!=d.indexOf("<")&&(d=d.replace(pa,"&lt;")),-1!=d.indexOf(">")&&(d=d.replace(qa,"&gt;")),-1!=d.indexOf('"')&&(d=d.replace(ra,"&quot;")),-1!=d.indexOf("'")&&(d=d.replace(sa,"&#39;")),-1!=d.indexOf("\x00")&&(d=d.replace(ta,"&#0;"))),d='<META HTTP-EQUIV="refresh" content="0; url='+d+'">',Aa(lc(a),"must provide justification"),v(!/^[\s\xa0]*$/.test(lc(a)),"must provide non-empty justification"),g.document.write(Yc((new Xc).$e(d))),g.document.close())):g=a.open(rc(b),c,g);if(g)try{g.focus()}catch(k){}return g},
df=function(a){return new A(function(b){var c=function(){le(2E3).then(function(){if(!a||a.closed)b();else return c()})};return c()})},ef=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,ff=function(){var a=null;return(new A(function(b){"complete"==l.document.readyState?b():(a=function(){b()},bc(window,"load",a))})).f(function(b){dc(window,"load",a);throw b;})},hf=function(){return gf(void 0)?ff().then(function(){return new A(function(a,b){var c=l.document,d=setTimeout(function(){b(Error("Cordova framework is not ready."))},
1E3);c.addEventListener("deviceready",function(){clearTimeout(d);a()},!1)})}):D(Error("Cordova must run in an Android or iOS file scheme."))},gf=function(a){a=a||K();return!("file:"!==jf()||!a.toLowerCase().match(/iphone|ipad|ipod|android/))},kf=function(){var a=l.window;try{return!(!a||a==a.top)}catch(b){return!1}},L=function(){return firebase.INTERNAL.hasOwnProperty("reactNative")?"ReactNative":firebase.INTERNAL.hasOwnProperty("node")?"Node":"Browser"},lf=function(){var a=L();return"ReactNative"===
a||"Node"===a},Ze=function(a){var b=a.toLowerCase();if(u(b,"opera/")||u(b,"opr/")||u(b,"opios/"))return"Opera";if(u(b,"iemobile"))return"IEMobile";if(u(b,"msie")||u(b,"trident/"))return"IE";if(u(b,"edge/"))return"Edge";if(u(b,"firefox/"))return"Firefox";if(u(b,"silk/"))return"Silk";if(u(b,"blackberry"))return"Blackberry";if(u(b,"webos"))return"Webos";if(!u(b,"safari/")||u(b,"chrome/")||u(b,"crios/")||u(b,"android"))if(!u(b,"chrome/")&&!u(b,"crios/")||u(b,"edge/")){if(u(b,"android"))return"Android";
if((a=a.match(/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/))&&2==a.length)return a[1]}else return"Chrome";else return"Safari";return"Other"},mf=function(a){var b=L();return("Browser"===b?Ze(K()):b)+"/JsCore/"+a},K=function(){return l.navigator&&l.navigator.userAgent||""},M=function(a,b){a=a.split(".");b=b||l;for(var c=0;c<a.length&&"object"==typeof b&&null!=b;c++)b=b[a[c]];c!=a.length&&(b=void 0);return b},pf=function(){var a;if(a=(nf()||"chrome-extension:"===jf()||gf())&&!lf())a:{try{var b=l.localStorage,c=
of();if(b){b.setItem(c,"1");b.removeItem(c);a=Ve()?!!l.indexedDB:!0;break a}}catch(d){}a=!1}return a},nf=function(){return"http:"===jf()||"https:"===jf()},jf=function(){return l.location&&l.location.protocol||null},qf=function(a){a=a||K();return af(a)||"Firefox"==Ze(a)?!1:!0},rf=function(a){return"undefined"===typeof a?null:xc(a)},sf=function(a){var b={},c;for(c in a)a.hasOwnProperty(c)&&null!==a[c]&&void 0!==a[c]&&(b[c]=a[c]);return b},tf=function(a){if(null!==a)return JSON.parse(a)},of=function(a){return a?
a:""+Math.floor(1E9*Math.random()).toString()},uf=function(a){a=a||K();return"Safari"==Ze(a)||a.toLowerCase().match(/iphone|ipad|ipod/)?!1:!0},vf=function(){var a=l.___jsl;if(a&&a.H)for(var b in a.H)if(a.H[b].r=a.H[b].r||[],a.H[b].L=a.H[b].L||[],a.H[b].r=a.H[b].L.concat(),a.CP)for(var c=0;c<a.CP.length;c++)a.CP[c]=null},wf=function(){return l.navigator&&"boolean"===typeof l.navigator.onLine?l.navigator.onLine:!0},xf=function(a,b,c,d){if(a>b)throw Error("Short delay should be less than long delay!");
this.Ff=a;this.gf=b;a=c||K();d=d||L();this.cf=af(a)||"ReactNative"===d};xf.prototype.get=function(){return this.cf?this.gf:this.Ff};
var yf=function(){var a=l.document;return a&&"undefined"!==typeof a.visibilityState?"visible"==a.visibilityState:!0},zf=function(){var a=l.document,b=null;return yf()||!a?B():(new A(function(c){b=function(){yf()&&(a.removeEventListener("visibilitychange",b,!1),c())};a.addEventListener("visibilitychange",b,!1)})).f(function(c){a.removeEventListener("visibilitychange",b,!1);throw c;})};var Af={},Bf=function(a){Af[a]||(Af[a]=!0,"undefined"!==typeof console&&"function"===typeof console.warn&&console.warn(a))};var Cf;try{var Df={};Object.defineProperty(Df,"abcd",{configurable:!0,enumerable:!0,value:1});Object.defineProperty(Df,"abcd",{configurable:!0,enumerable:!0,value:2});Cf=2==Df.abcd}catch(a){Cf=!1}
var N=function(a,b,c){Cf?Object.defineProperty(a,b,{configurable:!0,enumerable:!0,value:c}):a[b]=c},Ef=function(a,b){Cf?Object.defineProperty(a,"provider",{configurable:!0,enumerable:!0,get:function(){Bf("firebase.auth.AuthCredential.provider is deprecated. Please use the providerId field instead.");return b}}):a.provider=b},Ff=function(a,b){if(b)for(var c in b)b.hasOwnProperty(c)&&N(a,c,b[c])},Gf=function(a){var b={};Ff(b,a);return b},Hf=function(a){var b={},c;for(c in a)a.hasOwnProperty(c)&&(b[c]=
a[c]);return b},If=function(a,b){if(!b||!b.length)return!0;if(!a)return!1;for(var c=0;c<b.length;c++){var d=a[b[c]];if(void 0===d||null===d||""===d)return!1}return!0},Jf=function(a){var b=a;if("object"==typeof a&&null!=a){var b="length"in a?[]:{},c;for(c in a)N(b,c,Jf(a[c]))}return b};var Kf="oauth_consumer_key oauth_nonce oauth_signature oauth_signature_method oauth_timestamp oauth_token oauth_version".split(" "),Lf=["client_id","response_type","scope","redirect_uri","state"],Mf={Pf:{Mb:500,Lb:600,providerId:"facebook.com",qd:Lf},Qf:{Mb:500,Lb:620,providerId:"github.com",qd:Lf},Rf:{Mb:515,Lb:680,providerId:"google.com",qd:Lf},Sf:{Mb:485,Lb:705,providerId:"twitter.com",qd:Kf}},Nf=function(a){for(var b in Mf)if(Mf[b].providerId==a)return Mf[b];return null};var O=function(a,b){this.code="auth/"+a;this.message=b||Of[a]||""};r(O,Error);O.prototype.C=function(){return{code:this.code,message:this.message}};O.prototype.toJSON=function(){return this.C()};
var Pf=function(a){var b=a&&a.code;return b?new O(b.substring(5),a.message):null},Of={"argument-error":"","app-not-authorized":"This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.","app-not-installed":"The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.","captcha-check-failed":"",
"code-expired":"","cordova-not-ready":"Cordova framework is not ready.","cors-unsupported":"This browser is not supported.","credential-already-in-use":"This credential is already associated with a different user account.","custom-token-mismatch":"The custom token corresponds to a different audience.","requires-recent-login":"This operation is sensitive and requires recent authentication. Log in again before retrying this request.","dynamic-link-not-activated":"Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.",
"email-already-in-use":"The email address is already in use by another account.","expired-action-code":"The action code has expired. ","cancelled-popup-request":"This operation has been cancelled due to another conflicting popup being opened.","internal-error":"An internal error has occurred.","invalid-app-credential":"","invalid-app-id":"The mobile app identifier is not registed for the current project.","invalid-user-token":"The user's credential is no longer valid. The user must sign in again.",
"invalid-auth-event":"An internal error has occurred.","invalid-verification-code":"","invalid-cordova-configuration":"The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.","invalid-custom-token":"The custom token format is incorrect. Please check the documentation.","invalid-email":"The email address is badly formatted.","invalid-api-key":"Your API key is invalid, please check you have copied it correctly.",
"invalid-credential":"The supplied auth credential is malformed or has expired.","invalid-message-payload":"The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-oauth-provider":"EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.","unauthorized-domain":"This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.",
"invalid-action-code":"The action code is invalid. This can happen if the code is malformed, expired, or has already been used.","wrong-password":"The password is invalid or the user does not have a password.","invalid-identifier-number":"","invalid-recipient-email":"The email corresponding to this action failed to send as the provided recipient email address is invalid.","invalid-sender":"The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.",
"invalid-verification-id":"","missing-iframe-start":"An internal error has occurred.","auth-domain-config-required":"Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.","missing-app-credential":"","missing-verification-code":"","missing-identifier-number":"","missing-verification-id":"","app-deleted":"This instance of FirebaseApp has been deleted.","account-exists-with-different-credential":"An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.",
"network-request-failed":"A network error (such as timeout, interrupted connection or unreachable host) has occurred.","no-auth-event":"An internal error has occurred.","no-such-provider":"User was not linked to an account with the given provider.","operation-not-allowed":"The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.","operation-not-supported-in-this-environment":'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',
"popup-blocked":"Unable to establish a connection with the popup. It may have been blocked by the browser.","popup-closed-by-user":"The popup has been closed by the user before finalizing the operation.","provider-already-linked":"User can only be linked to one identity for the given provider.","quota-exceeded":"","redirect-cancelled-by-user":"The redirect operation has been cancelled by the user before finalizing.","redirect-operation-pending":"A redirect sign-in operation is already pending.",timeout:"The operation has timed out.",
"user-token-expired":"The user's credential is no longer valid. The user must sign in again.","too-many-requests":"We have blocked all requests from this device due to unusual activity. Try again later.","user-cancelled":"User did not grant your application the permissions it requested.","user-not-found":"There is no user record corresponding to this identifier. The user may have been deleted.","user-disabled":"The user account has been disabled by an administrator.","user-mismatch":"The supplied credentials do not correspond to the previously signed in user.",
"user-signed-out":"","weak-password":"The password must be 6 characters long or more.","web-storage-unsupported":"This browser is not supported or 3rd party cookies and data may be disabled."};var P=function(a,b,c,d,e){this.da=a;this.J=b||null;this.tb=c||null;this.sd=d||null;this.P=e||null;if(this.tb||this.P){if(this.tb&&this.P)throw new O("invalid-auth-event");if(this.tb&&!this.sd)throw new O("invalid-auth-event");}else throw new O("invalid-auth-event");};P.prototype.ic=function(){return this.sd};P.prototype.getError=function(){return this.P};P.prototype.C=function(){return{type:this.da,eventId:this.J,urlResponse:this.tb,sessionId:this.sd,error:this.P&&this.P.C()}};
var Qf=function(a){a=a||{};return a.type?new P(a.type,a.eventId,a.urlResponse,a.sessionId,a.error&&Pf(a.error)):null};var Rf=function(a){var b="unauthorized-domain",c=void 0,d=Pe(a);a=d.ea;d=d.ha;"chrome-extension"==d?c=ma("This chrome extension ID (chrome-extension://%s) is not authorized to run this operation. Add it to the OAuth redirect domains list in the Firebase console -> Auth section -> Sign in method tab.",a):"http"==d||"https"==d?c=ma("This domain (%s) is not authorized to run this operation. Add it to the OAuth redirect domains list in the Firebase console -> Auth section -> Sign in method tab.",a):b=
"operation-not-supported-in-this-environment";O.call(this,b,c)};r(Rf,O);var Sf=function(a){this.ff=a.sub;la();this.gc=a.email||null};var Tf=function(a,b){return a.then(function(a){if(a.idToken){var c;a:{var e=a.idToken.split(".");if(3==e.length){for(var e=e[1],f=(4-e.length%4)%4,g=0;g<f;g++)e+=".";try{var k=JSON.parse(tb(e));if(k.sub&&k.iss&&k.aud&&k.exp){c=new Sf(k);break a}}catch(n){}}c=null}if(!c||b!=c.ff)throw new O("user-mismatch");return a}throw new O("user-mismatch");}).f(function(a){throw a&&a.code&&"auth/user-not-found"==a.code?new O("user-mismatch"):a;})},Uf=function(a,b){if(b.idToken||b.accessToken)b.idToken&&N(this,
"idToken",b.idToken),b.accessToken&&N(this,"accessToken",b.accessToken);else if(b.oauthToken&&b.oauthTokenSecret)N(this,"accessToken",b.oauthToken),N(this,"secret",b.oauthTokenSecret);else throw new O("internal-error","failed to construct a credential");Ef(this,a);N(this,"providerId",a)};Uf.prototype.Ab=function(a){return Vf(a,Wf(this))};Uf.prototype.cd=function(a,b){var c=Wf(this);c.idToken=b;return Xf(a,c)};Uf.prototype.ed=function(a,b){var c=Wf(this);return Tf(Yf(a,c),b)};
var Wf=function(a){var b={};a.idToken&&(b.id_token=a.idToken);a.accessToken&&(b.access_token=a.accessToken);a.secret&&(b.oauth_token_secret=a.secret);b.providerId=a.providerId;return{postBody:Ue(b).toString(),requestUri:"http://localhost"}};Uf.prototype.C=function(){var a={providerId:this.providerId};this.idToken&&(a.oauthIdToken=this.idToken);this.accessToken&&(a.oauthAccessToken=this.accessToken);this.secret&&(a.oauthTokenSecret=this.secret);return a};
var Zf=function(a,b){this.vf=b||[];Ff(this,{providerId:a,isOAuthProvider:!0});this.Id={}};Zf.prototype.setCustomParameters=function(a){this.Id=Xa(a);return this};var Q=function(a){Zf.call(this,a,Lf);this.rd=[]};r(Q,Zf);Q.prototype.addScope=function(a){Ia(this.rd,a)||this.rd.push(a);return this};Q.prototype.Rd=function(){return Na(this.rd)};
Q.prototype.credential=function(a,b){if(!a&&!b)throw new O("argument-error","credential failed: must provide the ID token and/or the access token.");return new Uf(this.providerId,{idToken:a||null,accessToken:b||null})};var $f=function(){Q.call(this,"facebook.com")};r($f,Q);N($f,"PROVIDER_ID","facebook.com");
var ag=function(a){if(!a)throw new O("argument-error","credential failed: expected 1 argument (the OAuth access token).");var b=a;ha(a)&&(b=a.accessToken);return(new $f).credential(null,b)},bg=function(){Q.call(this,"github.com")};r(bg,Q);N(bg,"PROVIDER_ID","github.com");
var cg=function(a){if(!a)throw new O("argument-error","credential failed: expected 1 argument (the OAuth access token).");var b=a;ha(a)&&(b=a.accessToken);return(new bg).credential(null,b)},dg=function(){Q.call(this,"google.com");this.addScope("profile")};r(dg,Q);N(dg,"PROVIDER_ID","google.com");var eg=function(a,b){var c=a;ha(a)&&(c=a.idToken,b=a.accessToken);return(new dg).credential(c,b)},fg=function(){Zf.call(this,"twitter.com",Kf)};r(fg,Zf);N(fg,"PROVIDER_ID","twitter.com");
var gg=function(a,b){var c=a;ha(c)||(c={oauthToken:a,oauthTokenSecret:b});if(!c.oauthToken||!c.oauthTokenSecret)throw new O("argument-error","credential failed: expected 2 arguments (the OAuth access token and secret).");return new Uf("twitter.com",c)},hg=function(a,b){this.gc=a;this.jd=b;Ef(this,"password");N(this,"providerId","password")};hg.prototype.Ab=function(a){return R(a,ig,{email:this.gc,password:this.jd})};hg.prototype.cd=function(a,b){return R(a,jg,{idToken:b,email:this.gc,password:this.jd})};
hg.prototype.ed=function(a,b){return Tf(this.Ab(a),b)};hg.prototype.C=function(){return{email:this.gc,password:this.jd}};var kg=function(){Ff(this,{providerId:"password",isOAuthProvider:!1})};Ff(kg,{PROVIDER_ID:"password"});var lg=function(a){if(!(a.Bd&&a.Ad||a.Yb&&a.ya))throw new O("internal-error");this.I=a;N(this,"providerId","identifier")};lg.prototype.Ab=function(a){return a.se(mg(this))};lg.prototype.cd=function(a,b){var c=mg(this);c.idToken=b;return R(a,ng,c)};
lg.prototype.ed=function(a,b){var c=mg(this);c.operation="REAUTH";a=R(a,og,c);return Tf(a,b)};lg.prototype.C=function(){var a={providerId:"identifier"};this.I.Bd&&(a.verificationId=this.I.Bd);this.I.Ad&&(a.verificationCode=this.I.Ad);this.I.Yb&&(a.temporaryProof=this.I.Yb);this.I.ya&&(a.identifierNumber=this.I.ya);return a};
var mg=function(a){return a.I.Yb&&a.I.ya?{temporaryProof:a.I.Yb,identifierNumber:a.I.ya}:{sessionInfo:a.I.Bd,code:a.I.Ad}},pg=function(a){try{this.Ce=a||firebase.auth()}catch(b){throw new O("argument-error","Either an instance of firebase.auth.Auth must be passed as an argument to the firebase.auth.identifierAuthProvider constructor, or the default firebase App instance must be initialized via firebase.initializeApp().");}Ff(this,{providerId:"identifier",isOAuthProvider:!1})};
pg.prototype.se=function(a,b){var c=this.Ce.g;return B(b.verify()).then(function(d){if(!m(d))throw new O("argument-error","An implementation of firebase.auth.ApplicationVerifier.prototype.verify() must return a firebase.Promise that resolves with a string.");switch(b.type){case "recaptcha":return R(c,qg,{identifierNumber:a,recaptchaToken:d});default:throw new O("argument-error",'Only firebase.auth.ApplicationVerifiers with type="recaptcha" are currently supported.');}})};Ff(pg,{PROVIDER_ID:"identifier"});
var rg=function(a){if(a.temporaryProof&&a.identifierNumber)return new lg({Yb:a.temporaryProof,ya:a.identifierNumber});var b=a&&a.providerId;if(!b||"password"===b)return null;var c=a&&a.oauthAccessToken,d=a&&a.oauthTokenSecret;a=a&&a.oauthIdToken;try{switch(b){case "google.com":return eg(a,c);case "facebook.com":return ag(c);case "github.com":return cg(c);case "twitter.com":return gg(c,d);default:return(new Q(b)).credential(a,c)}}catch(e){return null}},sg=function(a){if(!a.isOAuthProvider)throw new O("invalid-oauth-provider");
};var tg=function(a,b,c){O.call(this,a,c);a=b||{};a.email&&N(this,"email",a.email);a.ya&&N(this,"identifierNumber",a.ya);a.credential&&N(this,"credential",a.credential)};r(tg,O);tg.prototype.C=function(){var a={code:this.code,message:this.message};this.email&&(a.email=this.email);this.identifierNumber&&(a.identifierNumber=this.identifierNumber);var b=this.credential&&this.credential.C();b&&Za(a,b);return a};tg.prototype.toJSON=function(){return this.C()};
var ug=function(a){if(a.code){var b=a.code||"";0==b.indexOf("auth/")&&(b=b.substring(5));var c={credential:rg(a)};if(a.email)c.email=a.email;else if(a.identifierNumber)c.ya=a.identifierNumber;else return new O(b,a.message||void 0);return new tg(b,c,a.message)}return null};var vg=function(a){this.Of=a};r(vg,Bc);vg.prototype.fc=function(){return new this.Of};vg.prototype.$c=function(){return{}};
var S=function(a,b,c){var d;d="Node"==L();d=l.XMLHttpRequest||d&&firebase.INTERNAL.node&&firebase.INTERNAL.node.XMLHttpRequest;if(!d)throw new O("internal-error","The XMLHttpRequest compatibility library was not found.");this.j=a;a=b||{};this.Bf=a.secureTokenEndpoint||"https://securetoken.googleapis.com/v1/token";this.Cf=a.secureTokenTimeout||wg;this.ge=Xa(a.secureTokenHeaders||xg);this.Le=a.firebaseEndpoint||"https://www.googleapis.com/identitytoolkit/v3/relyingparty/";this.Me=a.firebaseTimeout||
yg;this.Pd=Xa(a.firebaseHeaders||zg);c&&(this.Pd["X-Client-Version"]=c,this.ge["X-Client-Version"]=c);this.Ee=new Gc;this.Nf=new vg(d)},Ag,wg=new xf(3E4,6E4),xg={"Content-Type":"application/x-www-form-urlencoded"},yg=new xf(3E4,6E4),zg={"Content-Type":"application/json"},Cg=function(a,b,c,d,e,f,g){wf()?($e()?a=q(a.Ef,a):(Ag||(Ag=new A(function(a,b){Bg(a,b)})),a=q(a.Df,a)),a(b,c,d,e,f,g)):c&&c(null)};
S.prototype.Ef=function(a,b,c,d,e,f){var g="Node"==L(),k=lf()?g?new F(this.Nf):new F:new F(this.Ee),n;f&&(k.sb=Math.max(0,f),n=setTimeout(function(){k.dispatchEvent("timeout")},f));k.listen("complete",function(){n&&clearTimeout(n);var a=null;try{a=JSON.parse(Be(this))||null}catch(db){a=null}b&&b(a)});cc(k,"ready",function(){n&&clearTimeout(n);this.Ga||(this.Ga=!0,this.cb())});cc(k,"timeout",function(){n&&clearTimeout(n);this.Ga||(this.Ga=!0,this.cb());b&&b(null)});k.send(a,c,d,e)};
var Ed="__fcb"+Math.floor(1E6*Math.random()).toString(),Bg=function(a,b){((window.gapi||{}).client||{}).request?a():(l[Ed]=function(){((window.gapi||{}).client||{}).request?a():b(Error("CORS_UNSUPPORTED"))},Gd(function(){b(Error("CORS_UNSUPPORTED"))}))};
S.prototype.Df=function(a,b,c,d,e){var f=this;Ag.then(function(){window.gapi.client.setApiKey(f.j);var g=window.gapi.auth.getToken();window.gapi.auth.setToken(null);window.gapi.client.request({path:a,method:c,body:d,headers:e,authType:"none",callback:function(a){window.gapi.auth.setToken(g);b&&b(a)}})}).f(function(a){b&&b({error:{message:a&&a.message||"CORS_UNSUPPORTED"}})})};
var Eg=function(a,b){return new A(function(c,d){"refresh_token"==b.grant_type&&b.refresh_token||"authorization_code"==b.grant_type&&b.code?Cg(a,a.Bf+"?key="+encodeURIComponent(a.j),function(a){a?a.error?d(Dg(a)):a.access_token&&a.refresh_token?c(a):d(new O("internal-error")):d(new O("network-request-failed"))},"POST",Ue(b).toString(),a.ge,a.Cf.get()):d(new O("internal-error"))})},Fg=function(a,b,c,d,e,f){var g=Pe(a.Le+b);J(g,"key",a.j);f&&J(g,"cb",la().toString());var k="GET"==c;if(k)for(var n in d)d.hasOwnProperty(n)&&
J(g,n,d[n]);return new A(function(b,f){Cg(a,g.toString(),function(a){a?a.error?f(Dg(a,e||{})):b(a):f(new O("network-request-failed"))},c,k?void 0:xc(sf(d)),a.Pd,a.Me.get())})},Gg=function(a){if(!ic.test(a.email))throw new O("invalid-email");},Hg=function(a){"email"in a&&Gg(a)},Jg=function(a,b){return R(a,Ig,{identifier:b,continueUri:nf()?We():"http://localhost"}).then(function(a){return a.allProviders||[]})},Lg=function(a){return R(a,Kg,{}).then(function(a){return a.authorizedDomains||[]})},Mg=function(a){if(!a.idToken)throw new O("internal-error");
},Ng=function(a){if(a.identifierNumber||a.temporaryProof){if(!a.identifierNumber||!a.temporaryProof)throw new O("internal-error");}else{if(!a.sessionInfo)throw new O("missing-verification-id");if(!a.code)throw new O("missing-verification-code");}};S.prototype.signInAnonymously=function(){return R(this,Og,{})};S.prototype.updateEmail=function(a,b){return R(this,Pg,{idToken:a,email:b})};S.prototype.updatePassword=function(a,b){return R(this,jg,{idToken:a,password:b})};var Qg={displayName:"DISPLAY_NAME",photoUrl:"PHOTO_URL"};
S.prototype.updateProfile=function(a,b){var c={idToken:a},d=[];Sa(Qg,function(a,f){var e=b[f];null===e?d.push(a):f in b&&(c[f]=e)});d.length&&(c.deleteAttribute=d);return R(this,Pg,c)};S.prototype.sendPasswordResetEmail=function(a){return R(this,Rg,{requestType:"PASSWORD_RESET",email:a})};S.prototype.sendEmailVerification=function(a){return R(this,Sg,{requestType:"VERIFY_EMAIL",idToken:a})};S.prototype.se=function(a){return R(this,Tg,a)};
var Vg=function(a,b,c){return R(a,Ug,{idToken:b,deleteProvider:c})},Wg=function(a){if(!a.requestUri||!a.sessionId&&!a.postBody)throw new O("internal-error");},Xg=function(a){var b=null;a.needConfirmation?(a.code="account-exists-with-different-credential",b=ug(a)):"FEDERATED_USER_ID_ALREADY_LINKED"==a.errorMessage?(a.code="credential-already-in-use",b=ug(a)):"EMAIL_EXISTS"==a.errorMessage&&(a.code="email-already-in-use",b=ug(a));if(b)throw b;if(!a.idToken)throw new O("internal-error");},Vf=function(a,
b){b.returnIdpCredential=!0;return R(a,Yg,b)},Xf=function(a,b){b.returnIdpCredential=!0;return R(a,Zg,b)},Yf=function(a,b){b.returnIdpCredential=!0;b.autoCreate=!1;return R(a,$g,b)},ah=function(a){if(!a.oobCode)throw new O("invalid-action-code");};S.prototype.confirmPasswordReset=function(a,b){return R(this,bh,{oobCode:a,newPassword:b})};S.prototype.checkActionCode=function(a){return R(this,ch,{oobCode:a})};S.prototype.applyActionCode=function(a){return R(this,dh,{oobCode:a})};
var dh={endpoint:"setAccountInfo",A:ah,Wa:"email"},ch={endpoint:"resetPassword",A:ah,Y:function(a){if(!a.email||!a.requestType)throw new O("internal-error");}},eh={endpoint:"signupNewUser",A:function(a){Gg(a);if(!a.password)throw new O("weak-password");},Y:Mg,sa:!0},Ig={endpoint:"createAuthUri"},fh={endpoint:"deleteAccount",Ua:["idToken"]},Ug={endpoint:"setAccountInfo",Ua:["idToken","deleteProvider"],A:function(a){if(!ea(a.deleteProvider))throw new O("internal-error");}},gh={endpoint:"getAccountInfo"},
Sg={endpoint:"getOobConfirmationCode",Ua:["idToken","requestType"],A:function(a){if("VERIFY_EMAIL"!=a.requestType)throw new O("internal-error");},Wa:"email"},Rg={endpoint:"getOobConfirmationCode",Ua:["requestType"],A:function(a){if("PASSWORD_RESET"!=a.requestType)throw new O("internal-error");Gg(a)},Wa:"email"},Kg={De:!0,endpoint:"getProjectConfig",We:"GET"},bh={endpoint:"resetPassword",A:ah,Wa:"email"},qg={endpoint:"sendVerificationCode",Ua:["identifierNumber","recaptchaToken"],Wa:"sessionInfo"},Pg={endpoint:"setAccountInfo",
Ua:["idToken"],A:Hg,sa:!0},jg={endpoint:"setAccountInfo",Ua:["idToken"],A:function(a){Hg(a);if(!a.password)throw new O("weak-password");},Y:Mg,sa:!0},Og={endpoint:"signupNewUser",Y:Mg,sa:!0},Yg={endpoint:"verifyAssertion",A:Wg,Y:Xg,sa:!0},$g={endpoint:"verifyAssertion",A:Wg,Y:function(a){if(a.errorMessage&&"USER_NOT_FOUND"==a.errorMessage)throw new O("user-not-found");if(!a.idToken)throw new O("internal-error");},sa:!0},Zg={endpoint:"verifyAssertion",A:function(a){Wg(a);if(!a.idToken)throw new O("internal-error");
},Y:Xg,sa:!0},hh={endpoint:"verifyCustomToken",A:function(a){if(!a.token)throw new O("invalid-custom-token");},Y:Mg,sa:!0},ig={endpoint:"verifyPassword",A:function(a){Gg(a);if(!a.password)throw new O("wrong-password");},Y:Mg,sa:!0},Tg={endpoint:"verifyidentifierNumber",A:Ng,Y:Mg},ng={endpoint:"verifyidentifierNumber",A:function(a){if(!a.idToken)throw new O("internal-error");Ng(a)},Y:function(a){if(a.temporaryProof)throw a.code="credential-already-in-use",ug(a);Mg(a)}},og={Ge:{USER_NOT_FOUND:"user-not-found"},
endpoint:"verifyidentifierNumber",A:Ng,Y:Mg},R=function(a,b,c){if(!If(c,b.Ua))return D(new O("internal-error"));var d=b.We||"POST",e;return B(c).then(b.A).then(function(){b.sa&&(c.returnSecureToken=!0);return Fg(a,b.endpoint,d,c,b.Ge,b.De||!1)}).then(function(a){return e=a}).then(b.Y).then(function(){if(!b.Wa)return e;if(!(b.Wa in e))throw new O("internal-error");return e[b.Wa]})},Dg=function(a,b){var c;c=(a.error&&a.error.errors&&a.error.errors[0]||{}).reason||"";var d={keyInvalid:"invalid-api-key",ipRefererBlocked:"app-not-authorized"};
if(c=d[c]?new O(d[c]):null)return c;c=a.error&&a.error.message||"";d={INVALID_CUSTOM_TOKEN:"invalid-custom-token",CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_EMAIL:"invalid-email",INVALID_PASSWORD:"wrong-password",USER_DISABLED:"user-disabled",MISSING_PASSWORD:"internal-error",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",
FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",INVALID_MESSAGE_PAYLOAD:"invalid-message-payload",INVALID_RECIPIENT_EMAIL:"invalid-recipient-email",INVALID_SENDER:"invalid-sender",EMAIL_NOT_FOUND:"user-not-found",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",
CORS_UNSUPPORTED:"cors-unsupported",DYNAMIC_LINK_NOT_ACTIVATED:"dynamic-link-not-activated",INVALID_APP_ID:"invalid-app-id",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",WEAK_PASSWORD:"weak-password",OPERATION_NOT_ALLOWED:"operation-not-allowed",USER_CANCELLED:"user-cancelled",CAPTCHA_CHECK_FAILED:"captcha-check-failed",INVALID_APP_CREDENTIAL:"invalid-app-credential",INVALID_CODE:"invalid-verification-code",INVALID_identifier_NUMBER:"invalid-identifier-number",INVALID_SESSION_INFO:"invalid-verification-id",
INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_APP_CREDENTIAL:"missing-app-credential",MISSING_CODE:"missing-verification-code",MISSING_identifier_NUMBER:"missing-identifier-number",MISSING_SESSION_INFO:"missing-verification-id",QUOTA_EXCEEDED:"quota-exceeded",SESSION_EXPIRED:"code-expired"};Za(d,b||{});b=(b=c.match(/^[^\s]+\s*:\s*(.*)$/))&&1<b.length?b[1]:void 0;for(var e in d)if(0===c.indexOf(e))return new O(d[e],b);!b&&a&&(b=rf(a));return new O("internal-error",b)};var ih=function(a){this.V=a};ih.prototype.value=function(){return this.V};ih.prototype.je=function(a){this.V.style=a;return this};var jh=function(a){this.V=a||{}};jh.prototype.value=function(){return this.V};jh.prototype.je=function(a){this.V.style=a;return this};var lh=function(a){this.Lf=a;this.nc=null;this.gd=kh(this)},mh=function(a){var b=new jh;b.V.where=document.body;b.V.url=a.Lf;b.V.messageHandlersFilter=M("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER");b.V.attributes=b.V.attributes||{};(new ih(b.V.attributes)).je({position:"absolute",top:"-100px",width:"1px",height:"1px"});b.V.dontclear=!0;return b},kh=function(a){return nh().then(function(){return new A(function(b,c){M("gapi.iframes.getContext")().open(mh(a).value(),function(d){a.nc=d;a.nc.restyle({setHideOnLeave:!1});
var e=setTimeout(function(){c(Error("Network Error"))},oh.get()),f=function(){clearTimeout(e);b()};d.ping(f).then(f,function(){c(Error("Network Error"))})})})})};lh.prototype.sendMessage=function(a){var b=this;return this.gd.then(function(){return new A(function(c){b.nc.send(a.type,a,c,M("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER"))})})};
var ph=function(a,b){a.gd.then(function(){a.nc.register("authEvent",b,M("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER"))})},qh=new xf(3E4,6E4),oh=new xf(5E3,15E3),nh=function(){return new A(function(a,b){if(wf()){var c=function(){vf();M("gapi.load")("gapi.iframes",{callback:a,ontimeout:function(){vf();b(Error("Network Error"))},timeout:qh.get()})};if(M("gapi.iframes.Iframe"))a();else if(M("gapi.load"))c();else{var d="__iframefcb"+Math.floor(1E6*Math.random()).toString();l[d]=function(){M("gapi.load")?
c():b(Error("Network Error"))};B(Dd("https://apis.google.com/js/api.js?onload="+d)).f(function(){b(Error("Network Error"))})}}else b(Error("Network Error"))})};var rh=function(a,b,c){this.v=a;this.j=b;this.D=c;this.Ya=null;this.ac=Qe(this.v,"/__/auth/iframe");J(this.ac,"apiKey",this.j);J(this.ac,"appName",this.D)};rh.prototype.setVersion=function(a){this.Ya=a;return this};rh.prototype.toString=function(){this.Ya?J(this.ac,"v",this.Ya):this.ac.removeParameter("v");return this.ac.toString()};var sh=function(a,b,c,d,e){this.v=a;this.j=b;this.D=c;this.Be=d;this.Ya=this.J=this.pd=null;this.Pb=e};sh.prototype.setVersion=function(a){this.Ya=a;return this};
sh.prototype.toString=function(){var a=Qe(this.v,"/__/auth/handler");J(a,"apiKey",this.j);J(a,"appName",this.D);J(a,"authType",this.Be);if(this.Pb.isOAuthProvider){J(a,"providerId",this.Pb.providerId);var b=this.Pb,c=sf(b.Id),d;for(d in c)c[d]=c[d].toString();b=b.vf;c=Xa(c);for(d=0;d<b.length;d++){var e=b[d];e in c&&delete c[e]}Va(c)||J(a,"customParameters",rf(c))}"function"===typeof this.Pb.Rd&&(b=this.Pb.Rd(),b.length&&J(a,"scopes",b.join(",")));this.pd?J(a,"redirectUrl",this.pd):a.removeParameter("redirectUrl");
this.J?J(a,"eventId",this.J):a.removeParameter("eventId");this.Ya?J(a,"v",this.Ya):a.removeParameter("v");if(this.bc)for(var f in this.bc)this.bc.hasOwnProperty(f)&&!Oe(a,f)&&J(a,f,this.bc[f]);return a.toString()};
var th=function(a,b,c,d){this.v=a;this.j=b;this.D=c;this.Oe=(this.Ea=d||null)?mf(this.Ea):null;d=this.Ea;this.Xe=(new rh(a,b,c)).setVersion(d).toString();this.ma=[];this.g=new S(b,null,this.Oe);this.pc=this.wa=null},uh=function(a){var b=We();return Lg(a).then(function(a){a:{for(var c=Pe(b),e=c.ha,c=c.ea,f=0;f<a.length;f++){var g;var k=a[f];g=c;var n=e;0==k.indexOf("chrome-extension://")?g=Pe(k).ea==g&&"chrome-extension"==n:"http"!=n&&"https"!=n?g=!1:ef.test(k)?g=g==k:(k=k.split(".").join("\\."),g=
(new RegExp("^(.+\\."+k+"|"+k+")$","i")).test(g));if(g){a=!0;break a}}a=!1}if(!a)throw new Rf(We());})};h=th.prototype;h.Gb=function(){if(this.pc)return this.pc;var a=this;return this.pc=ff().then(function(){a.mc=new lh(a.Xe);vh(a)})};h.Vb=function(a,b,c){var d=new O("popup-closed-by-user"),e=new O("web-storage-unsupported"),f=this,g=!1;return this.La().then(function(){wh(f).then(function(c){c||(a&&bf(a),b(e),g=!0)})}).f(function(){}).then(function(){if(!g)return df(a)}).then(function(){if(!g)return le(c).then(function(){b(d)})})};
h.ke=function(){var a=K();return!qf(a)&&!uf(a)};h.Ud=function(){return!1};h.Nb=function(a,b,c,d,e,f,g){if(!a)return D(new O("popup-blocked"));if(g&&!qf())return this.La().f(function(b){bf(a);e(b)}),d(),B();this.wa||(this.wa=uh(this.g));var k=this;return this.wa.then(function(){var b=k.La().f(function(b){bf(a);e(b);throw b;});d();return b}).then(function(){sg(c);if(!g){var d=xh(k.v,k.j,k.D,b,c,null,f,k.Ea);Xe(d,a)}}).f(function(a){"auth/network-request-failed"==a.code&&(k.wa=null);throw a;})};
h.Ob=function(a,b,c){this.wa||(this.wa=uh(this.g));var d=this;return this.wa.then(function(){sg(b);var e=xh(d.v,d.j,d.D,a,b,We(),c,d.Ea);Xe(e)})};h.La=function(){var a=this;return this.Gb().then(function(){return a.mc.gd}).f(function(){a.wa=null;throw new O("network-request-failed");})};h.ne=function(){return!0};
var xh=function(a,b,c,d,e,f,g,k,n){a=new sh(a,b,c,d,e);a.pd=f;a.J=g;f=a.setVersion(k);f.bc=Xa(n||null);return f.toString()},vh=function(a){if(!a.mc)throw Error("IfcHandler must be initialized!");ph(a.mc,function(b){var c={};if(b&&b.authEvent){var d=!1;b=Qf(b.authEvent);for(c=0;c<a.ma.length;c++)d=a.ma[c](b)||d;c={};c.status=d?"ACK":"ERROR";return B(c)}c.status="ERROR";return B(c)})},wh=function(a){var b={type:"webStorageSupport"};return a.Gb().then(function(){return a.mc.sendMessage(b)}).then(function(a){if(a&&
a.length&&"undefined"!==typeof a[0].webStorageSupport)return a[0].webStorageSupport;throw Error();})};th.prototype.$a=function(a){this.ma.push(a)};th.prototype.Tb=function(a){La(this.ma,function(b){return b==a})};var yh=function(a){this.B=a||firebase.INTERNAL.reactNative&&firebase.INTERNAL.reactNative.AsyncStorage;if(!this.B)throw new O("internal-error","The React Native compatibility library was not found.");};h=yh.prototype;h.get=function(a){return B(this.B.getItem(a)).then(function(a){return a&&tf(a)})};h.set=function(a,b){return B(this.B.setItem(a,rf(b)))};h.remove=function(a){return B(this.B.removeItem(a))};h.ab=function(){};h.Ta=function(){};var zh=function(){this.B={}};h=zh.prototype;h.get=function(a){return B(this.B[a])};h.set=function(a,b){this.B[a]=b;return B()};h.remove=function(a){delete this.B[a];return B()};h.ab=function(){};h.Ta=function(){};var Ch=function(){if(!Bh()){if("Node"==L())throw new O("internal-error","The LocalStorage compatibility library was not found.");throw new O("web-storage-unsupported");}this.B=l.localStorage||firebase.INTERNAL.node.localStorage},Bh=function(){var a="Node"==L(),a=l.localStorage||a&&firebase.INTERNAL.node&&firebase.INTERNAL.node.localStorage;if(!a)return!1;try{return a.setItem("__sak","1"),a.removeItem("__sak"),!0}catch(b){return!1}};h=Ch.prototype;
h.get=function(a){var b=this;return B().then(function(){var c=b.B.getItem(a);return tf(c)})};h.set=function(a,b){var c=this;return B().then(function(){var d=rf(b);null===d?c.remove(a):c.B.setItem(a,d)})};h.remove=function(a){var b=this;return B().then(function(){b.B.removeItem(a)})};h.ab=function(a){l.window&&Vb(l.window,"storage",a)};h.Ta=function(a){l.window&&dc(l.window,"storage",a)};var Dh=function(){this.B={}};h=Dh.prototype;h.get=function(){return B(null)};h.set=function(){return B()};h.remove=function(){return B()};h.ab=function(){};h.Ta=function(){};var Fh=function(){if(!Eh()){if("Node"==L())throw new O("internal-error","The SessionStorage compatibility library was not found.");throw new O("web-storage-unsupported");}this.B=l.sessionStorage||firebase.INTERNAL.node.sessionStorage},Eh=function(){var a="Node"==L(),a=l.sessionStorage||a&&firebase.INTERNAL.node&&firebase.INTERNAL.node.sessionStorage;if(!a)return!1;try{return a.setItem("__sak","1"),a.removeItem("__sak"),!0}catch(b){return!1}};h=Fh.prototype;
h.get=function(a){var b=this;return B().then(function(){var c=b.B.getItem(a);return tf(c)})};h.set=function(a,b){var c=this;return B().then(function(){var d=rf(b);null===d?c.remove(a):c.B.setItem(a,d)})};h.remove=function(a){var b=this;return B().then(function(){b.B.removeItem(a)})};h.ab=function(){};h.Ta=function(){};var Gh=function(a,b,c,d,e,f){if(!window.indexedDB)throw new O("web-storage-unsupported");this.He=a;this.fd=b;this.Qc=c;this.re=d;this.wb=e;this.$={};this.Wb=[];this.Jb=0;this.Ye=f||l.indexedDB},Hh,Ih=function(a){return new A(function(b,c){var d=a.Ye.open(a.He,a.wb);d.onerror=function(a){c(Error(a.target.errorCode))};d.onupgradeneeded=function(b){b=b.target.result;try{b.createObjectStore(a.fd,{keyPath:a.Qc})}catch(f){c(f)}};d.onsuccess=function(a){b(a.target.result)}})},Jh=function(a){a.Xd||(a.Xd=
Ih(a));return a.Xd},Kh=function(a,b){return b.objectStore(a.fd)},Lh=function(a,b,c){return b.transaction([a.fd],c?"readwrite":"readonly")},Mh=function(a){return new A(function(b,c){a.onsuccess=function(a){a&&a.target?b(a.target.result):b()};a.onerror=function(a){c(Error(a.target.errorCode))}})};h=Gh.prototype;
h.set=function(a,b){var c=!1,d,e=this;return md(Jh(this).then(function(b){d=b;b=Kh(e,Lh(e,d,!0));return Mh(b.get(a))}).then(function(f){var g=Kh(e,Lh(e,d,!0));if(f)return f.value=b,Mh(g.put(f));e.Jb++;c=!0;f={};f[e.Qc]=a;f[e.re]=b;return Mh(g.add(f))}).then(function(){e.$[a]=b}),function(){c&&e.Jb--})};h.get=function(a){var b=this;return Jh(this).then(function(c){return Mh(Kh(b,Lh(b,c,!1)).get(a))}).then(function(a){return a&&a.value})};
h.remove=function(a){var b=!1,c=this;return md(Jh(this).then(function(d){b=!0;c.Jb++;return Mh(Kh(c,Lh(c,d,!0))["delete"](a))}).then(function(){delete c.$[a]}),function(){b&&c.Jb--})};
h.Hf=function(){var a=this;return Jh(this).then(function(b){var c=Kh(a,Lh(a,b,!1));return c.getAll?Mh(c.getAll()):new A(function(a,b){var d=[],e=c.openCursor();e.onsuccess=function(b){(b=b.target.result)?(d.push(b.value),b["continue"]()):a(d)};e.onerror=function(a){b(Error(a.target.errorCode))}})}).then(function(b){var c={},d=[];if(0==a.Jb){for(d=0;d<b.length;d++)c[b[d][a.Qc]]=b[d][a.re];d=Ye(a.$,c);a.$=c}return d})};h.ab=function(a){0==this.Wb.length&&this.vd();this.Wb.push(a)};
h.Ta=function(a){La(this.Wb,function(b){return b==a});0==this.Wb.length&&this.Bc()};h.vd=function(){var a=this;this.Bc();var b=function(){a.kd=le(800).then(q(a.Hf,a)).then(function(b){0<b.length&&w(a.Wb,function(a){a(b)})}).then(b).f(function(a){"STOP_EVENT"!=a.message&&b()});return a.kd};b()};h.Bc=function(){this.kd&&this.kd.cancel("STOP_EVENT")};var Qh=function(){this.Ld={Browser:Nh,Node:Oh,ReactNative:Ph}[L()]},Rh,Nh={M:Ch,yd:Fh},Oh={M:Ch,yd:Fh},Ph={M:yh,yd:Dh};var Sh=function(a){var b={},c=a.email,d=a.newEmail;a=a.requestType;if(!c||!a)throw Error("Invalid provider user info!");b.fromEmail=d||null;b.email=c;N(this,"operation",a);N(this,"data",Jf(b))};var Th=function(a,b,c,d,e,f){this.pf=a;this.xf=b;this.Qe=c;this.rc=d;this.zd=e;this.yf=!!f;this.kb=null;this.Ma=this.rc;if(this.zd<this.rc)throw Error("Proactive refresh lower bound greater than upper bound!");};Th.prototype.start=function(){this.Ma=this.rc;Uh(this,!0)};
var Vh=function(a,b){if(b)return a.Ma=a.rc,a.Qe();b=a.Ma;a.Ma*=2;a.Ma>a.zd&&(a.Ma=a.zd);return b},Uh=function(a,b){a.stop();a.kb=le(Vh(a,b)).then(function(){return a.yf?B():zf()}).then(function(){return a.pf()}).then(function(){Uh(a,!0)}).f(function(b){a.xf(b)&&Uh(a,!1)})};Th.prototype.stop=function(){this.kb&&(this.kb.cancel(),this.kb=null)};var ai=function(a){var b={};b["facebook.com"]=Wh;b["google.com"]=Xh;b["github.com"]=Yh;b["twitter.com"]=Zh;var c=a&&a.providerId;return c?b[c]?new b[c](a):new $h(a):null},$h=function(a){var b=tf(a.rawUserInfo||"{}");a=a.providerId;if(!a)throw Error("Invalid additional user info!");N(this,"profile",Jf(b||{}));N(this,"providerId",a)},Wh=function(a){$h.call(this,a);if("facebook.com"!=this.providerId)throw Error("Invalid provider id!");};r(Wh,$h);
var Yh=function(a){$h.call(this,a);if("github.com"!=this.providerId)throw Error("Invalid provider id!");N(this,"username",this.profile&&this.profile.login||null)};r(Yh,$h);var Xh=function(a){$h.call(this,a);if("google.com"!=this.providerId)throw Error("Invalid provider id!");};r(Xh,$h);var Zh=function(a){$h.call(this,a);if("twitter.com"!=this.providerId)throw Error("Invalid provider id!");N(this,"username",a.screenName||null)};r(Zh,$h);var bi=function(a,b,c,d){this.kf=a;this.he=b;this.zf=c;this.Ub=d;this.T={};Rh||(Rh=new Qh);a=Rh;try{var e;Ve()?(Hh||(Hh=new Gh("firebaseLocalStorageDb","firebaseLocalStorage","fbase_key","value",1)),e=Hh):e=new a.Ld.M;this.Qa=e}catch(f){this.Qa=new zh,this.Ub=!0}try{this.Dc=new a.Ld.yd}catch(f){this.Dc=new zh}this.wd=q(this.le,this);this.$={}},ci,di=function(){ci||(ci=new bi("firebase",":",!uf(K())&&kf()?!0:!1,qf()));return ci};h=bi.prototype;
h.R=function(a,b){return this.kf+this.he+a.name+(b?this.he+b:"")};h.get=function(a,b){return(a.M?this.Qa:this.Dc).get(this.R(a,b))};h.remove=function(a,b){b=this.R(a,b);a.M&&!this.Ub&&(this.$[b]=null);return(a.M?this.Qa:this.Dc).remove(b)};h.set=function(a,b,c){var d=this.R(a,c),e=this,f=a.M?this.Qa:this.Dc;return f.set(d,b).then(function(){return f.get(d)}).then(function(b){a.M&&!this.Ub&&(e.$[d]=b)})};
h.addListener=function(a,b,c){a=this.R(a,b);this.Ub||(this.$[a]=l.localStorage.getItem(a));Va(this.T)&&this.vd();this.T[a]||(this.T[a]=[]);this.T[a].push(c)};h.removeListener=function(a,b,c){a=this.R(a,b);this.T[a]&&(La(this.T[a],function(a){return a==c}),0==this.T[a].length&&delete this.T[a]);Va(this.T)&&this.Bc()};h.vd=function(){this.Qa.ab(this.wd);this.Ub||Ve()||ei(this)};
var ei=function(a){fi(a);a.dd=setInterval(function(){for(var b in a.T){var c=l.localStorage.getItem(b),d=a.$[b];c!=d&&(a.$[b]=c,c=new Jb({type:"storage",key:b,target:window,oldValue:d,newValue:c,rf:!0}),a.le(c))}},1E3)},fi=function(a){a.dd&&(clearInterval(a.dd),a.dd=null)};bi.prototype.Bc=function(){this.Qa.Ta(this.wd);fi(this)};
bi.prototype.le=function(a){if(a&&a.Pe){var b=a.eb.key;"undefined"!==typeof a.eb.rf?this.Qa.Ta(this.wd):fi(this);if(this.zf){var c=l.localStorage.getItem(b);a=a.eb.newValue;a!=c&&(a?l.localStorage.setItem(b,a):a||l.localStorage.removeItem(b))}this.$[b]=l.localStorage.getItem(b);this.Ed(b)}else w(a,q(this.Ed,this))};bi.prototype.Ed=function(a){this.T[a]&&w(this.T[a],function(a){a()})};var gi=function(a,b){this.u=a;this.i=b||di()},hi={name:"authEvent",M:!0},ii=function(a){return a.i.get(hi,a.u).then(function(a){return Qf(a)})};gi.prototype.$a=function(a){this.i.addListener(hi,this.u,a)};gi.prototype.Tb=function(a){this.i.removeListener(hi,this.u,a)};var ji=function(a){this.i=a||di()},ki={name:"sessionId",M:!1};ji.prototype.ic=function(a){return this.i.get(ki,a)};var li=function(a,b,c,d,e,f){this.v=a;this.j=b;this.D=c;this.Ea=d||null;this.me=b+":"+c;this.Af=new ji;this.Qd=new gi(this.me);this.Zc=null;this.ma=[];this.bf=e||500;this.tf=f||2E3;this.Fb=this.uc=null},mi=function(a){return new O("invalid-cordova-configuration",a)};
li.prototype.La=function(){return this.ad?this.ad:this.ad=hf().then(function(){if("function"!==typeof M("universalLinks.subscribe",l))throw mi("cordova-universal-links-plugin is not installed");if("undefined"===typeof M("BuildInfo.packageName",l))throw mi("cordova-plugin-buildinfo is not installed");if("function"!==typeof M("cordova.plugins.browsertab.openUrl",l))throw mi("cordova-plugin-browsertab is not installed");if("function"!==typeof M("cordova.InAppBrowser.open",l))throw mi("cordova-plugin-inappbrowser is not installed");
},function(){throw new O("cordova-not-ready");})};var ni=function(){for(var a=20,b=[];0<a;)b.push("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(62*Math.random()))),a--;return b.join("")},oi=function(a){var b=new Eb;b.update(a);return Oa(b.digest())};h=li.prototype;h.Vb=function(a,b){b(new O("operation-not-supported-in-this-environment"));return B()};h.Nb=function(){return D(new O("operation-not-supported-in-this-environment"))};h.ne=function(){return!1};h.ke=function(){return!0};
h.Ud=function(){return!0};
h.Ob=function(a,b,c){if(this.uc)return D(new O("redirect-operation-pending"));var d=this,e=l.document,f=null,g=null,k=null,n=null;return this.uc=md(B().then(function(){sg(b);return pi(d)}).then(function(){return qi(d,a,b,c)}).then(function(){return(new A(function(a,b){g=function(){var b=M("cordova.plugins.browsertab.close",l);a();"function"===typeof b&&b();d.Fb&&"function"===typeof d.Fb.close&&(d.Fb.close(),d.Fb=null);return!1};d.$a(g);k=function(){f||(f=le(d.tf).then(function(){b(new O("redirect-cancelled-by-user"))}))};n=
function(){yf()&&k()};e.addEventListener("resume",k,!1);K().toLowerCase().match(/android/)||e.addEventListener("visibilitychange",n,!1)})).f(function(a){return ri(d).then(function(){throw a;})})}),function(){k&&e.removeEventListener("resume",k,!1);n&&e.removeEventListener("visibilitychange",n,!1);f&&f.cancel();g&&d.Tb(g);d.uc=null})};
var qi=function(a,b,c,d){var e=ni(),f=new P(b,d,null,e,new O("no-auth-event")),g=M("BuildInfo.packageName",l);if("string"!==typeof g)throw new O("invalid-cordova-configuration");var k=M("BuildInfo.displayName",l),n={};if(K().toLowerCase().match(/iphone|ipad|ipod/))n.ibi=g;else if(K().toLowerCase().match(/android/))n.apn=g;else return D(new O("operation-not-supported-in-this-environment"));k&&(n.appDisplayName=k);e=oi(e);n.sessionId=e;var C=xh(a.v,a.j,a.D,b,c,null,d,a.Ea,n);return a.La().then(function(){var b=
a.me;return a.Af.i.set(hi,f.C(),b)}).then(function(){var b=M("cordova.plugins.browsertab.isAvailable",l);if("function"!==typeof b)throw new O("invalid-cordova-configuration");var c=null;b(function(b){if(b){c=M("cordova.plugins.browsertab.openUrl",l);if("function"!==typeof c)throw new O("invalid-cordova-configuration");c(C)}else{c=M("cordova.InAppBrowser.open",l);if("function"!==typeof c)throw new O("invalid-cordova-configuration");b=c;var d;d=K();d=!(!d.match(/(iPad|iPhone|iPod).*OS 7_\d/i)&&!d.match(/(iPad|iPhone|iPod).*OS 8_\d/i));
a.Fb=b(C,d?"_blank":"_system","location=yes")}})})},si=function(a,b){for(var c=0;c<a.ma.length;c++)try{a.ma[c](b)}catch(d){}},pi=function(a){a.Zc||(a.Zc=a.La().then(function(){return new A(function(b){var c=function(d){b(d);a.Tb(c);return!1};a.$a(c);ti(a)})}));return a.Zc},ri=function(a){var b=null;return ii(a.Qd).then(function(c){b=c;c=a.Qd;return c.i.remove(hi,c.u)}).then(function(){return b})},ti=function(a){var b=M("universalLinks.subscribe",l);if("function"!==typeof b)throw new O("invalid-cordova-configuration");
var c=new P("unknown",null,null,null,new O("no-auth-event")),d=!1,e=le(a.bf).then(function(){return ri(a).then(function(){d||si(a,c)})}),f=function(b){d=!0;e&&e.cancel();ri(a).then(function(d){var e=c;if(d&&b&&b.url){var e=null,f;f=b.url;var g=Pe(f),k=Oe(g,"link"),n=Oe(Pe(k),"link"),g=Oe(g,"deep_link_id");f=Oe(Pe(g),"link")||g||n||k||f;-1!=f.indexOf("/__/auth/callback")&&(e=Pe(f),e=tf(Oe(e,"firebaseError")||null),e=(e="object"===typeof e?Pf(e):null)?new P(d.da,d.J,null,null,e):new P(d.da,d.J,f,d.ic()));
e=e||c}si(a,e)})},g=l.handleOpenURL;l.handleOpenURL=function(a){0==a.indexOf(M("BuildInfo.packageName",l)+"://")&&f({url:a});if("function"===typeof g)try{g(a)}catch(n){console.error(n)}};b(null,f)};li.prototype.$a=function(a){this.ma.push(a);pi(this).f(function(b){"auth/invalid-cordova-configuration"===b.code&&(b=new P("unknown",null,null,null,new O("no-auth-event")),a(b))})};li.prototype.Tb=function(a){La(this.ma,function(b){return b==a})};var ui=function(a){this.u=a;this.i=di()},vi={name:"pendingRedirect",M:!1},wi=function(a){return a.i.set(vi,"pending",a.u)},xi=function(a){return a.i.remove(vi,a.u)},yi=function(a){return a.i.get(vi,a.u).then(function(a){return"pending"==a})};var T=function(a,b,c){this.v=a;this.j=b;this.D=c;this.Xb=[];this.ib=!1;this.Mc=q(this.Wc,this);this.Ra=new zi(this);this.ld=new Ai(this);this.Kb=new ui(this.j+":"+this.D);this.Aa={};this.Aa.unknown=this.Ra;this.Aa.signInViaRedirect=this.Ra;this.Aa.linkViaRedirect=this.Ra;this.Aa.reauthViaRedirect=this.Ra;this.Aa.signInViaPopup=this.ld;this.Aa.linkViaPopup=this.ld;this.Aa.reauthViaPopup=this.ld;this.K=Bi(this.v,this.j,this.D)},Bi=function(a,b,c){var d=firebase.SDK_VERSION||null;return gf()?new li(a,
b,c,d):new th(a,b,c,d)};T.prototype.reset=function(){this.ib=!1;this.K.Tb(this.Mc);this.K=Bi(this.v,this.j,this.D)};T.prototype.Gb=function(){var a=this;this.ib||(this.ib=!0,this.K.$a(this.Mc));var b=this.K;return this.K.La().f(function(c){a.K==b&&a.reset();throw c;})};var Ei=function(a){a.K.ke()&&a.Gb().f(function(b){var c=new P("unknown",null,null,null,new O("operation-not-supported-in-this-environment"));Ci(b)&&a.Wc(c)});a.K.Ud()||Di(a.Ra)};
T.prototype.subscribe=function(a){Ia(this.Xb,a)||this.Xb.push(a);if(!this.ib){var b=this;yi(this.Kb).then(function(a){a?xi(b.Kb).then(function(){b.Gb().f(function(a){var c=new P("unknown",null,null,null,new O("operation-not-supported-in-this-environment"));Ci(a)&&b.Wc(c)})}):Ei(b)}).f(function(){Ei(b)})}};T.prototype.unsubscribe=function(a){La(this.Xb,function(b){return b==a})};
T.prototype.Wc=function(a){if(!a)throw new O("invalid-auth-event");for(var b=!1,c=0;c<this.Xb.length;c++){var d=this.Xb[c];if(d.Fd(a.da,a.J)){(b=this.Aa[a.da])&&b.ce(a,d);b=!0;break}}Di(this.Ra);return b};var Fi=new xf(2E3,1E4),Gi=new xf(3E4,6E4);T.prototype.getRedirectResult=function(){return this.Ra.getRedirectResult()};T.prototype.Nb=function(a,b,c,d,e){var f=this;return this.K.Nb(a,b,c,function(){f.ib||(f.ib=!0,f.K.$a(f.Mc))},function(){f.reset()},d,e)};
var Ci=function(a){return a&&"auth/cordova-not-ready"==a.code?!0:!1};T.prototype.Ob=function(a,b,c){var d=this,e;return wi(this.Kb).then(function(){return d.K.Ob(a,b,c).f(function(a){if(Ci(a))throw new O("operation-not-supported-in-this-environment");e=a;return xi(d.Kb).then(function(){throw e;})}).then(function(){return d.K.ne()?new A(function(){}):xi(d.Kb).then(function(){return d.getRedirectResult()}).then(function(){}).f(function(){})})})};
T.prototype.Vb=function(a,b,c,d){return this.K.Vb(c,function(c){a.Va(b,null,c,d)},Fi.get())};var Hi={},Ii=function(a,b,c){var d=b+":"+c;Hi[d]||(Hi[d]=new T(a,b,c));return Hi[d]},zi=function(a){this.i=a;this.qb=null;this.Rb=[];this.Qb=[];this.ob=null;this.od=!1};zi.prototype.reset=function(){this.qb=null;this.ob&&(this.ob.cancel(),this.ob=null)};
zi.prototype.ce=function(a,b){if(!a)return D(new O("invalid-auth-event"));this.reset();this.od=!0;var c=a.da,d=a.J,e=a.getError()&&"auth/web-storage-unsupported"==a.getError().code,f=a.getError()&&"auth/operation-not-supported-in-this-environment"==a.getError().code;"unknown"!=c||e||f?a=a.P?this.md(a,b):b.zb(c,d)?this.nd(a,b):D(new O("invalid-auth-event")):(Ji(this,!1,null,null),a=B());return a};var Di=function(a){a.od||(a.od=!0,Ji(a,!1,null,null))};
zi.prototype.md=function(a){Ji(this,!0,null,a.getError());return B()};zi.prototype.nd=function(a,b){var c=this;b=b.zb(a.da,a.J);var d=a.tb,e=a.ic(),f=!!a.da.match(/Redirect$/);return b(d,e).then(function(a){Ji(c,f,a,null)}).f(function(a){Ji(c,f,null,a)})};
var Ki=function(a,b){a.qb=function(){return D(b)};if(a.Qb.length)for(var c=0;c<a.Qb.length;c++)a.Qb[c](b)},Li=function(a,b){a.qb=function(){return B(b)};if(a.Rb.length)for(var c=0;c<a.Rb.length;c++)a.Rb[c](b)},Ji=function(a,b,c,d){b?d?Ki(a,d):Li(a,c):Li(a,{user:null});a.Rb=[];a.Qb=[]};zi.prototype.getRedirectResult=function(){var a=this;return new A(function(b,c){a.qb?a.qb().then(b,c):(a.Rb.push(b),a.Qb.push(c),Mi(a))})};
var Mi=function(a){var b=new O("timeout");a.ob&&a.ob.cancel();a.ob=le(Gi.get()).then(function(){a.qb||Ji(a,!0,null,b)})},Ai=function(a){this.i=a};Ai.prototype.ce=function(a,b){if(!a)return D(new O("invalid-auth-event"));var c=a.da,d=a.J;return a.P?this.md(a,b):b.zb(c,d)?this.nd(a,b):D(new O("invalid-auth-event"))};Ai.prototype.md=function(a,b){b.Va(a.da,null,a.getError(),a.J);return B()};
Ai.prototype.nd=function(a,b){var c=a.J,d=a.da,e=b.zb(d,c),f=a.tb;a=a.ic();return e(f,a).then(function(a){b.Va(d,a,null,c)}).f(function(a){b.Va(d,null,a,c)})};var Ni=function(a){this.g=a;this.Ba=this.X=null;this.Ha=0};Ni.prototype.C=function(){return{apiKey:this.g.j,refreshToken:this.X,accessToken:this.Ba,expirationTime:this.Ha}};
var Pi=function(a,b){var c=b.idToken,d=b.refreshToken;b=Oi(b.expiresIn);a.Ba=c;a.Ha=b;a.X=d},Oi=function(a){return la()+1E3*parseInt(a,10)},Qi=function(a,b){return Eg(a.g,b).then(function(b){a.Ba=b.access_token;a.Ha=Oi(b.expires_in);a.X=b.refresh_token;return{accessToken:a.Ba,expirationTime:a.Ha,refreshToken:a.X}}).f(function(b){"auth/user-token-expired"==b.code&&(a.X=null);throw b;})};
Ni.prototype.getToken=function(a){a=!!a;return this.Ba&&!this.X?D(new O("user-token-expired")):a||!this.Ba||la()>this.Ha-3E4?this.X?Qi(this,{grant_type:"refresh_token",refresh_token:this.X}):B(null):B({accessToken:this.Ba,expirationTime:this.Ha,refreshToken:this.X})};var Ri=function(a,b,c,d,e){Ff(this,{uid:a,displayName:d||null,photoURL:e||null,email:c||null,providerId:b})},Si=function(a,b){Ib.call(this,a);for(var c in b)this[c]=b[c]};r(Si,Ib);
var U=function(a,b,c){this.ba=[];this.j=a.apiKey;this.D=a.appName;this.v=a.authDomain||null;a=firebase.SDK_VERSION?mf(firebase.SDK_VERSION):null;this.g=new S(this.j,null,a);this.ia=new Ni(this.g);Ti(this,b.idToken);Pi(this.ia,b);N(this,"refreshToken",this.ia.X);Ui(this,c||{});he.call(this);this.vc=!1;this.v&&pf()&&(this.m=Ii(this.v,this.j,this.D));this.Ac=[];this.ka=null;this.mb=Vi(this);this.vb=q(this.Xc,this)};r(U,he);U.prototype.Xc=function(){this.mb.kb&&(this.mb.stop(),this.mb.start())};
var Vi=function(a){return new Th(function(){return a.getToken(!0)},function(a){return a&&"auth/network-request-failed"==a.code?!0:!1},function(){var b=a.ia.Ha-la()-3E5;return 0<b?b:0},3E4,96E4,!1)},Wi=function(a){a.Kd||a.mb.kb||(a.mb.start(),dc(a,"tokenChanged",a.vb),Vb(a,"tokenChanged",a.vb))},Xi=function(a){dc(a,"tokenChanged",a.vb);a.mb.stop()},Ti=function(a,b){a.Yd=b;N(a,"_lat",b)},Yi=function(a,b){La(a.Ac,function(a){return a==b})},Zi=function(a){for(var b=[],c=0;c<a.Ac.length;c++)b.push(a.Ac[c](a));
return jd(b).then(function(){return a})},$i=function(a){a.m&&!a.vc&&(a.vc=!0,a.m.subscribe(a))},Ui=function(a,b){Ff(a,{uid:b.uid,displayName:b.displayName||null,photoURL:b.photoURL||null,email:b.email||null,emailVerified:b.emailVerified||!1,identifierNumber:b.identifierNumber||null,isAnonymous:b.isAnonymous||!1,providerData:[]})};N(U.prototype,"providerId","firebase");
var aj=function(){},bj=function(a){return B().then(function(){if(a.Kd)throw new O("app-deleted");})},cj=function(a){return Ea(a.providerData,function(a){return a.providerId})},ej=function(a,b){b&&(dj(a,b.providerId),a.providerData.push(b))},dj=function(a,b){La(a.providerData,function(a){return a.providerId==b})},fj=function(a,b,c){("uid"!=b||c)&&a.hasOwnProperty(b)&&N(a,b,c)};
U.prototype.copy=function(a){var b=this;b!=a&&(Ff(this,{uid:a.uid,displayName:a.displayName,photoURL:a.photoURL,email:a.email,emailVerified:a.emailVerified,identifierNumber:a.identifierNumber,isAnonymous:a.isAnonymous,providerData:[]}),w(a.providerData,function(a){ej(b,a)}),this.ia=a.ia,N(this,"refreshToken",this.ia.X))};U.prototype.reload=function(){var a=this;return this.c(bj(this).then(function(){return gj(a).then(function(){return Zi(a)}).then(aj)}))};
var gj=function(a){return a.getToken().then(function(b){var c=a.isAnonymous;return hj(a,b).then(function(){c||fj(a,"isAnonymous",!1);return b})})};U.prototype.getToken=function(a){var b=this;return this.c(bj(this).then(function(){return b.ia.getToken(a)}).then(function(a){if(!a)throw new O("internal-error");a.accessToken!=b.Yd&&(Ti(b,a.accessToken),b.Na());fj(b,"refreshToken",a.refreshToken);return a.accessToken}))};
var ij=function(a,b){b.idToken&&a.Yd!=b.idToken&&(Pi(a.ia,b),a.Na(),Ti(a,b.idToken),fj(a,"refreshToken",a.ia.X))};U.prototype.Na=function(){this.dispatchEvent(new Si("tokenChanged"))};var hj=function(a,b){return R(a.g,gh,{idToken:b}).then(q(a.qf,a))};
U.prototype.qf=function(a){a=a.users;if(!a||!a.length)throw new O("internal-error");a=a[0];Ui(this,{uid:a.localId,displayName:a.displayName,photoURL:a.photoUrl,email:a.email,emailVerified:!!a.emailVerified,identifierNumber:a.identifierNumber});for(var b=jj(a),c=0;c<b.length;c++)ej(this,b[c]);fj(this,"isAnonymous",!(this.email&&a.passwordHash)&&!(this.providerData&&this.providerData.length))};
var jj=function(a){return(a=a.providerUserInfo)&&a.length?Ea(a,function(a){return new Ri(a.rawId,a.providerId,a.email,a.displayName,a.photoUrl)}):[]},lj=function(a,b){var c=null;return a.c(b.ed(a.g,a.uid).then(function(b){ij(a,b);c=kj(a,b,"reauthenticate");a.ka=null;return a.reload()}).then(function(){return c}),!0)};U.prototype.reauthenticate=function(a){Bf("firebase.User.prototype.reauthenticate is deprecated. Please use firebase.User.prototype.reauthenticateWithCredential instead.");return this.reauthenticateWithCredential(a)};
U.prototype.reauthenticateWithCredential=function(a){return lj(this,a).then(function(){})};var mj=function(a,b){return gj(a).then(function(){if(Ia(cj(a),b))return Zi(a).then(function(){throw new O("provider-already-linked");})})},oj=function(a,b){var c=null;return a.c(mj(a,b.providerId).then(function(){return a.getToken()}).then(function(c){return b.cd(a.g,c)}).then(function(b){c=kj(a,b,"link");return nj(a,b)}).then(function(){return c}))};
U.prototype.link=function(a){Bf("firebase.User.prototype.link is deprecated. Please use firebase.User.prototype.linkWithCredential instead.");return this.linkWithCredential(a)};U.prototype.linkWithCredential=function(a){return oj(this,a).then(function(a){return a.user})};var kj=function(a,b,c){var d=rg(b);b=ai(b);return Gf({user:a,credential:d,additionalUserInfo:b,operationType:c})},nj=function(a,b){ij(a,b);return a.reload().then(function(){return a})};h=U.prototype;
h.updateEmail=function(a){var b=this;return this.c(this.getToken().then(function(c){return b.g.updateEmail(c,a)}).then(function(a){ij(b,a);return b.reload()}))};h.updatePassword=function(a){var b=this;return this.c(this.getToken().then(function(c){return b.g.updatePassword(c,a)}).then(function(a){ij(b,a);return b.reload()}))};
h.updateProfile=function(a){if(void 0===a.displayName&&void 0===a.photoURL)return bj(this);var b=this;return this.c(this.getToken().then(function(c){return b.g.updateProfile(c,{displayName:a.displayName,photoUrl:a.photoURL})}).then(function(a){ij(b,a);fj(b,"displayName",a.displayName||null);fj(b,"photoURL",a.photoUrl||null);return Zi(b)}).then(aj))};
h.unlink=function(a){var b=this;return this.c(gj(this).then(function(c){return Ia(cj(b),a)?Vg(b.g,c,[a]).then(function(a){var c={};w(a.providerUserInfo||[],function(a){c[a.providerId]=!0});w(cj(b),function(a){c[a]||dj(b,a)});return Zi(b)}):Zi(b).then(function(){throw new O("no-such-provider");})}))};
h["delete"]=function(){var a=this;return this.c(this.getToken().then(function(b){return R(a.g,fh,{idToken:b})}).then(function(){a.dispatchEvent(new Si("userDeleted"))})).then(function(){for(var b=0;b<a.ba.length;b++)a.ba[b].cancel("app-deleted");a.ba=[];a.Kd=!0;Xi(a);N(a,"refreshToken",null);a.m&&a.m.unsubscribe(a)})};
h.Fd=function(a,b){return"linkViaPopup"==a&&(this.ca||null)==b&&this.aa||"reauthViaPopup"==a&&(this.ca||null)==b&&this.aa||"linkViaRedirect"==a&&(this.za||null)==b||"reauthViaRedirect"==a&&(this.za||null)==b?!0:!1};h.Va=function(a,b,c,d){"linkViaPopup"!=a&&"reauthViaPopup"!=a||d!=(this.ca||null)||(c&&this.Pa?this.Pa(c):b&&!c&&this.aa&&this.aa(b),this.F&&(this.F.cancel(),this.F=null),delete this.aa,delete this.Pa)};
h.zb=function(a,b){return"linkViaPopup"==a&&b==(this.ca||null)?q(this.Nd,this):"reauthViaPopup"==a&&b==(this.ca||null)?q(this.Od,this):"linkViaRedirect"==a&&(this.za||null)==b?q(this.Nd,this):"reauthViaRedirect"==a&&(this.za||null)==b?q(this.Od,this):null};h.hc=function(){return of(this.uid+":::")};var qj=function(a,b){return pj(a,"linkViaPopup",b,function(){return mj(a,b.providerId).then(function(){return Zi(a)})},!1)};
U.prototype.linkWithPopup=function(a){return qj(this,a).then(function(a){return a?Gf({user:a.user,credential:a.credential,operationType:a.operationType}):a})};var rj=function(a,b){return pj(a,"reauthViaPopup",b,function(){return B()},!0)};U.prototype.reauthenticateWithPopup=function(a){return rj(this,a).then(function(a){return a?Gf({user:a.user,credential:a.credential,operationType:a.operationType}):a})};
var pj=function(a,b,c,d,e){if(!pf())return D(new O("operation-not-supported-in-this-environment"));if(a.ka&&!e)return D(a.ka);var f=Nf(c.providerId),g=a.hc(),k=null;(!qf()||kf())&&a.v&&c.isOAuthProvider&&(k=xh(a.v,a.j,a.D,b,c,null,g,firebase.SDK_VERSION||null));var n=cf(k,f&&f.Mb,f&&f.Lb);d=d().then(function(){sj(a);if(!e)return a.getToken().then(function(){})}).then(function(){return a.m.Nb(n,b,c,g,!!k)}).then(function(){return new A(function(c,d){a.Va(b,null,new O("cancelled-popup-request"),a.ca||
null);a.aa=c;a.Pa=d;a.ca=g;a.F=a.m.Vb(a,b,n,g)})}).then(function(a){n&&bf(n);return a}).f(function(a){n&&bf(n);throw a;});return a.c(d,e)};U.prototype.linkWithRedirect=function(a){var b=this;return tj(this,"linkViaRedirect",a,function(){return mj(b,a.providerId)},!1)};U.prototype.reauthenticateWithRedirect=function(a){return tj(this,"reauthViaRedirect",a,function(){return B()},!0)};
var tj=function(a,b,c,d,e){if(!pf())return D(new O("operation-not-supported-in-this-environment"));if(a.ka&&!e)return D(a.ka);var f=null,g=a.hc();d=d().then(function(){sj(a);if(!e)return a.getToken().then(function(){})}).then(function(){a.za=g;return Zi(a)}).then(function(b){a.Sa&&(b=a.Sa,b=b.i.set(uj,a.C(),b.u));return b}).then(function(){return a.m.Ob(b,c,g)}).f(function(b){f=b;if(a.Sa)return vj(a.Sa);throw f;}).then(function(){if(f)throw f;});return a.c(d,e)},sj=function(a){if(!a.m||!a.vc){if(a.m&&
!a.vc)throw new O("internal-error");throw new O("auth-domain-config-required");}};U.prototype.Nd=function(a,b){var c=this;this.F&&(this.F.cancel(),this.F=null);var d=null,e=this.getToken().then(function(d){return Xf(c.g,{requestUri:a,sessionId:b,idToken:d})}).then(function(a){d=kj(c,a,"link");return nj(c,a)}).then(function(){return d});return this.c(e)};
U.prototype.Od=function(a,b){var c=this;this.F&&(this.F.cancel(),this.F=null);var d=null,e=B().then(function(){return Tf(Yf(c.g,{requestUri:a,sessionId:b}),c.uid)}).then(function(a){d=kj(c,a,"reauthenticate");ij(c,a);c.ka=null;return c.reload()}).then(function(){return d});return this.c(e,!0)};U.prototype.sendEmailVerification=function(){var a=this;return this.c(this.getToken().then(function(b){return a.g.sendEmailVerification(b)}).then(function(b){if(a.email!=b)return a.reload()}).then(function(){}))};
U.prototype.c=function(a,b){var c=this,d=wj(this,a,b);this.ba.push(d);md(d,function(){Ka(c.ba,d)});return d};var wj=function(a,b,c){return a.ka&&!c?(b.cancel(),D(a.ka)):b.f(function(b){!b||"auth/user-disabled"!=b.code&&"auth/user-token-expired"!=b.code||(a.ka||a.dispatchEvent(new Si("userInvalidated")),a.ka=b);throw b;})};U.prototype.toJSON=function(){return this.C()};
U.prototype.C=function(){var a={uid:this.uid,displayName:this.displayName,photoURL:this.photoURL,email:this.email,emailVerified:this.emailVerified,identifierNumber:this.identifierNumber,isAnonymous:this.isAnonymous,providerData:[],apiKey:this.j,appName:this.D,authDomain:this.v,stsTokenManager:this.ia.C(),redirectEventId:this.za||null};w(this.providerData,function(b){a.providerData.push(Hf(b))});return a};
var xj=function(a){if(!a.apiKey)return null;var b={apiKey:a.apiKey,authDomain:a.authDomain,appName:a.appName},c={};if(a.stsTokenManager&&a.stsTokenManager.accessToken&&a.stsTokenManager.expirationTime)c.idToken=a.stsTokenManager.accessToken,c.refreshToken=a.stsTokenManager.refreshToken||null,c.expiresIn=(a.stsTokenManager.expirationTime-la())/1E3;else return null;var d=new U(b,c,a);a.providerData&&w(a.providerData,function(a){a&&ej(d,Gf(a))});a.redirectEventId&&(d.za=a.redirectEventId);return d},
yj=function(a,b,c){var d=new U(a,b);c&&(d.Sa=c);return d.reload().then(function(){return d})};var zj=function(a){this.u=a;this.i=di()},uj={name:"redirectUser",M:!1},vj=function(a){return a.i.remove(uj,a.u)},Aj=function(a,b){return a.i.get(uj,a.u).then(function(a){a&&b&&(a.authDomain=b);return xj(a||{})})};var Bj=function(a){this.u=a;this.i=di()},Cj={name:"authUser",M:!0},Dj=function(a,b){return a.i.set(Cj,b.C(),a.u)},Ej=function(a){return a.i.remove(Cj,a.u)},Fj=function(a,b){return a.i.get(Cj,a.u).then(function(a){a&&b&&(a.authDomain=b);return xj(a||{})})};var W=function(a){this.Fa=!1;N(this,"app",a);if(V(this).options&&V(this).options.apiKey)a=firebase.SDK_VERSION?mf(firebase.SDK_VERSION):null,this.g=new S(V(this).options&&V(this).options.apiKey,null,a);else throw new O("invalid-api-key");this.ba=[];this.Ca=[];this.ub=[];this.mf=firebase.INTERNAL.createSubscribe(q(this.Ze,this));this.Ic=void 0;firebase.INTERNAL.createSubscribe(q(this.af,this));Gj(this,null);this.ta=new Bj(V(this).options.apiKey+":"+V(this).name);this.pb=new zj(V(this).options.apiKey+
":"+V(this).name);this.cc=this.c(Hj(this));this.qa=this.c(Ij(this));this.bd=!1;this.Vc=q(this.Gf,this);this.qe=q(this.gb,this);this.vb=q(this.Xc,this);this.oe=q(this.Ue,this);this.pe=q(this.Ve,this);Jj(this);this.INTERNAL={};this.INTERNAL["delete"]=q(this["delete"],this);this.Ia=0};W.prototype.toJSON=function(){return{apiKey:V(this).options.apiKey,authDomain:V(this).options.authDomain,appName:V(this).name,currentUser:X(this)&&X(this).C()}};
var Kj=function(a){return a.Ie||D(new O("auth-domain-config-required"))},Jj=function(a){var b=V(a).options.authDomain,c=V(a).options.apiKey;b&&pf()&&(a.Ie=a.cc.then(function(){if(!a.Fa)return a.m=Ii(b,c,V(a).name),a.m.subscribe(a),X(a)&&$i(X(a)),a.Sb&&($i(a.Sb),a.Sb=null),a.m}))};h=W.prototype;h.Fd=function(a,b){switch(a){case "unknown":case "signInViaRedirect":return!0;case "signInViaPopup":return this.ca==b&&!!this.aa;default:return!1}};
h.Va=function(a,b,c,d){"signInViaPopup"==a&&this.ca==d&&(c&&this.Pa?this.Pa(c):b&&!c&&this.aa&&this.aa(b),this.F&&(this.F.cancel(),this.F=null),delete this.aa,delete this.Pa)};h.zb=function(a,b){return"signInViaRedirect"==a||"signInViaPopup"==a&&this.ca==b&&this.aa?q(this.Ke,this):null};
h.Ke=function(a,b){var c=this;a={requestUri:a,sessionId:b};this.F&&(this.F.cancel(),this.F=null);var d=null,e=null,f=Vf(c.g,a).then(function(a){d=rg(a);e=ai(a);return a});a=c.cc.then(function(){return f}).then(function(a){return Lj(c,a)}).then(function(){return Gf({user:X(c),credential:d,additionalUserInfo:e,operationType:"signIn"})});return this.c(a)};h.hc=function(){return of()};
var Mj=function(a,b){if(!pf())return D(new O("operation-not-supported-in-this-environment"));var c=Nf(b.providerId),d=a.hc(),e=null;(!qf()||kf())&&V(a).options.authDomain&&b.isOAuthProvider&&(e=xh(V(a).options.authDomain,V(a).options.apiKey,V(a).name,"signInViaPopup",b,null,d,firebase.SDK_VERSION||null));var f=cf(e,c&&c.Mb,c&&c.Lb),c=Kj(a).then(function(a){return a.Nb(f,"signInViaPopup",b,d,!!e)}).then(function(){return new A(function(b,c){a.Va("signInViaPopup",null,new O("cancelled-popup-request"),
a.ca);a.aa=b;a.Pa=c;a.ca=d;a.F=a.m.Vb(a,"signInViaPopup",f,d)})}).then(function(a){f&&bf(f);return a}).f(function(a){f&&bf(f);throw a;});return a.c(c)};W.prototype.signInWithPopup=function(a){return Mj(this,a).then(function(a){return a?Gf({user:a.user,credential:a.credential,operationType:a.operationType}):a})};W.prototype.getRedirectResult=function(){return Nj(this).then(function(a){return a?Gf({user:a.user,credential:a.credential,operationType:a.operationType}):a})};
W.prototype.signInWithRedirect=function(a){if(!pf())return D(new O("operation-not-supported-in-this-environment"));var b=this,c=Kj(this).then(function(){return b.m.Ob("signInViaRedirect",a)});return this.c(c)};
var Nj=function(a){if(!pf())return D(new O("operation-not-supported-in-this-environment"));var b=Kj(a).then(function(){return a.m.getRedirectResult()});return a.c(b)},Lj=function(a,b){var c={};c.apiKey=V(a).options.apiKey;c.authDomain=V(a).options.authDomain;c.appName=V(a).name;return a.cc.then(function(){return yj(c,b,a.pb)}).then(function(b){if(X(a)&&b.uid==X(a).uid)return X(a).copy(b),a.gb(b);Gj(a,b);$i(b);return a.gb(b)}).then(function(){a.Na()})},Gj=function(a,b){X(a)&&(Yi(X(a),a.qe),dc(X(a),
"tokenChanged",a.vb),dc(X(a),"userDeleted",a.oe),dc(X(a),"userInvalidated",a.pe),Xi(X(a)));b&&(b.Ac.push(a.qe),Vb(b,"tokenChanged",a.vb),Vb(b,"userDeleted",a.oe),Vb(b,"userInvalidated",a.pe),0<a.Ia&&Wi(b));N(a,"currentUser",b)};W.prototype.signOut=function(){var a=this,b=this.qa.then(function(){if(!X(a))return B();Gj(a,null);return Ej(a.ta).then(function(){a.Na()})});return this.c(b)};
var Oj=function(a){var b=Aj(a.pb,V(a).options.authDomain).then(function(b){if(a.Sb=b)b.Sa=a.pb;return vj(a.pb)});return a.c(b)},Hj=function(a){var b=V(a).options.authDomain,c=Oj(a).then(function(){return Fj(a.ta,b)}).then(function(b){return b?(b.Sa=a.pb,a.Sb&&(a.Sb.za||null)==(b.za||null)?b:b.reload().then(function(){return Dj(a.ta,b).then(function(){return b})}).f(function(c){return"auth/network-request-failed"==c.code?b:Ej(a.ta)})):null}).then(function(b){Gj(a,b||null)});return a.c(c)},Ij=function(a){return a.cc.then(function(){return a.getRedirectResult()}).f(function(){}).then(function(){if(!a.Fa)return a.Vc()}).f(function(){}).then(function(){if(!a.Fa){a.bd=
!0;var b=a.ta;b.i.addListener(Cj,b.u,a.Vc)}})};h=W.prototype;h.Gf=function(){var a=this;return Fj(this.ta,V(this).options.authDomain).then(function(b){if(!a.Fa){var c;if(c=X(a)&&b){c=X(a).uid;var d=b.uid;c=void 0===c||null===c||""===c||void 0===d||null===d||""===d?!1:c==d}if(c)return X(a).copy(b),X(a).getToken();if(X(a)||b)Gj(a,b),b&&($i(b),b.Sa=a.pb),a.m&&a.m.subscribe(a),a.Na()}})};h.gb=function(a){return Dj(this.ta,a)};h.Xc=function(){this.Na();this.gb(X(this))};h.Ue=function(){this.signOut()};
h.Ve=function(){this.signOut()};var Pj=function(a,b){var c=null,d=null;return a.c(b.then(function(b){c=rg(b);d=ai(b);return Lj(a,b)}).then(function(){return Gf({user:X(a),credential:c,additionalUserInfo:d,operationType:"signIn"})}))};h=W.prototype;h.Ze=function(a){var b=this;this.addAuthTokenListener(function(){a.next(X(b))})};h.af=function(a){var b=this;Qj(this,function(){a.next(X(b))})};
h.onAuthStateChanged=function(a,b,c){var d=this;this.bd&&firebase.Promise.resolve().then(function(){p(a)?a(X(d)):p(a.next)&&a.next(X(d))});return this.mf(a,b,c)};h.getToken=function(a){var b=this,c=this.qa.then(function(){return X(b)?X(b).getToken(a).then(function(a){return{accessToken:a}}):null});return this.c(c)};h.signInWithCustomToken=function(a){var b=this;return this.qa.then(function(){return Pj(b,R(b.g,hh,{token:a}))}).then(function(a){a=a.user;fj(a,"isAnonymous",!1);return b.gb(a)}).then(function(){return X(b)})};
h.signInWithEmailAndPassword=function(a,b){var c=this;return this.qa.then(function(){return Pj(c,R(c.g,ig,{email:a,password:b}))}).then(function(a){return a.user})};h.createUserWithEmailAndPassword=function(a,b){var c=this;return this.qa.then(function(){return Pj(c,R(c.g,eh,{email:a,password:b}))}).then(function(a){return a.user})};h.signInWithCredential=function(a){return Rj(this,a).then(function(a){return a.user})};var Rj=function(a,b){return a.qa.then(function(){return Pj(a,b.Ab(a.g))})};
W.prototype.signInAnonymously=function(){var a=X(this),b=this;return a&&a.isAnonymous?B(a):this.qa.then(function(){return Pj(b,b.g.signInAnonymously())}).then(function(a){a=a.user;fj(a,"isAnonymous",!0);return b.gb(a)}).then(function(){return X(b)})};var V=function(a){return a.app},X=function(a){return a.currentUser};W.prototype.getUid=function(){return X(this)&&X(this).uid||null};var Sj=function(a){return X(a)&&X(a)._lat||null};h=W.prototype;
h.Na=function(){if(this.bd){for(var a=0;a<this.Ca.length;a++)if(this.Ca[a])this.Ca[a](Sj(this));if(this.Ic!==this.getUid()&&this.ub.length)for(this.Ic=this.getUid(),a=0;a<this.ub.length;a++)if(this.ub[a])this.ub[a](Sj(this))}};h.Ae=function(a){this.addAuthTokenListener(a);this.Ia++;0<this.Ia&&X(this)&&Wi(X(this))};h.uf=function(a){var b=this;w(this.Ca,function(c){c==a&&b.Ia--});0>this.Ia&&(this.Ia=0);0==this.Ia&&X(this)&&Xi(X(this));this.removeAuthTokenListener(a)};
h.addAuthTokenListener=function(a){var b=this;this.Ca.push(a);this.c(this.qa.then(function(){b.Fa||Ia(b.Ca,a)&&a(Sj(b))}))};h.removeAuthTokenListener=function(a){La(this.Ca,function(b){return b==a})};var Qj=function(a,b){a.ub.push(b);a.c(a.qa.then(function(){!a.Fa&&Ia(a.ub,b)&&a.Ic!==a.getUid()&&(a.Ic=a.getUid(),b(Sj(a)))}))};h=W.prototype;
h["delete"]=function(){this.Fa=!0;for(var a=0;a<this.ba.length;a++)this.ba[a].cancel("app-deleted");this.ba=[];this.ta&&(a=this.ta,a.i.removeListener(Cj,a.u,this.Vc));this.m&&this.m.unsubscribe(this);return firebase.Promise.resolve()};h.c=function(a){var b=this;this.ba.push(a);md(a,function(){Ka(b.ba,a)});return a};h.fetchProvidersForEmail=function(a){return this.c(Jg(this.g,a))};h.verifyPasswordResetCode=function(a){return this.checkActionCode(a).then(function(a){return a.data.email})};
h.confirmPasswordReset=function(a,b){return this.c(this.g.confirmPasswordReset(a,b).then(function(){}))};h.checkActionCode=function(a){return this.c(this.g.checkActionCode(a).then(function(a){return new Sh(a)}))};h.applyActionCode=function(a){return this.c(this.g.applyActionCode(a).then(function(){}))};h.sendPasswordResetEmail=function(a){return this.c(this.g.sendPasswordResetEmail(a).then(function(){}))};var Tj="First Second Third Fourth Fifth Sixth Seventh Eighth Ninth".split(" "),Y=function(a,b){return{name:a||"",ja:"a valid string",optional:!!b,la:m}},Z=function(a){return{name:a||"",ja:"a valid object",optional:!1,la:ha}},Uj=function(a,b){return{name:a||"",ja:"a function",optional:!!b,la:p}},Vj=function(){return{name:"",ja:"null",optional:!1,la:da}},Wj=function(){return{name:"credential",ja:"a valid credential",optional:!1,la:function(a){return a?!!a.Ab:!1}}},Xj=function(){return{name:"authProvider",
ja:"a valid Auth provider",optional:!1,la:function(a){return!!(a&&a.providerId&&a.hasOwnProperty&&a.hasOwnProperty("isOAuthProvider"))}}},Yj=function(a,b,c,d){return{name:c||"",ja:a.ja+" or "+b.ja,optional:!!d,la:function(c){return a.la(c)||b.la(c)}}};var ak=function(a,b){for(var c in b){var d=b[c].name;a[d]=Zj(d,a[c],b[c].a)}},bk=function(a,b,c,d){a[b]=Zj(b,c,d)},Zj=function(a,b,c){if(!c)return b;var d=ck(a);a=function(){var a=Array.prototype.slice.call(arguments),e;a:{e=Array.prototype.slice.call(a);var k;k=0;for(var n=!1,C=0;C<c.length;C++)if(c[C].optional)n=!0;else{if(n)throw new O("internal-error","Argument validator encountered a required argument after an optional argument.");k++}n=c.length;if(e.length<k||n<e.length)e="Expected "+(k==n?
1==k?"1 argument":k+" arguments":k+"-"+n+" arguments")+" but got "+e.length+".";else{for(k=0;k<e.length;k++)if(n=c[k].optional&&void 0===e[k],!c[k].la(e[k])&&!n){e=c[k];if(0>k||k>=Tj.length)throw new O("internal-error","Argument validator received an unsupported number of arguments.");e=Tj[k]+" argument "+(e.name?'"'+e.name+'" ':"")+"must be "+e.ja+".";break a}e=null}}if(e)throw new O("argument-error",d+" failed: "+e);return b.apply(this,a)};for(var e in b)a[e]=b[e];for(e in b.prototype)a.prototype[e]=
b.prototype[e];return a},ck=function(a){a=a.split(".");return a[a.length-1]};ak(W.prototype,{applyActionCode:{name:"applyActionCode",a:[Y("code")]},checkActionCode:{name:"checkActionCode",a:[Y("code")]},confirmPasswordReset:{name:"confirmPasswordReset",a:[Y("code"),Y("newPassword")]},createUserWithEmailAndPassword:{name:"createUserWithEmailAndPassword",a:[Y("email"),Y("password")]},fetchProvidersForEmail:{name:"fetchProvidersForEmail",a:[Y("email")]},getRedirectResult:{name:"getRedirectResult",a:[]},onAuthStateChanged:{name:"onAuthStateChanged",a:[Yj(Z(),Uj(),"nextOrObserver"),
Uj("opt_error",!0),Uj("opt_completed",!0)]},sendPasswordResetEmail:{name:"sendPasswordResetEmail",a:[Y("email")]},signInAnonymously:{name:"signInAnonymously",a:[]},signInWithCredential:{name:"signInWithCredential",a:[Wj()]},signInWithCustomToken:{name:"signInWithCustomToken",a:[Y("token")]},signInWithEmailAndPassword:{name:"signInWithEmailAndPassword",a:[Y("email"),Y("password")]},signInWithPopup:{name:"signInWithPopup",a:[Xj()]},signInWithRedirect:{name:"signInWithRedirect",a:[Xj()]},signOut:{name:"signOut",
a:[]},toJSON:{name:"toJSON",a:[Y(null,!0)]},verifyPasswordResetCode:{name:"verifyPasswordResetCode",a:[Y("code")]}});
ak(U.prototype,{"delete":{name:"delete",a:[]},getToken:{name:"getToken",a:[{name:"opt_forceRefresh",ja:"a boolean",optional:!0,la:function(a){return"boolean"==typeof a}}]},link:{name:"link",a:[Wj()]},linkWithCredential:{name:"linkWithCredential",a:[Wj()]},linkWithPopup:{name:"linkWithPopup",a:[Xj()]},linkWithRedirect:{name:"linkWithRedirect",a:[Xj()]},reauthenticate:{name:"reauthenticate",a:[Wj()]},reauthenticateWithCredential:{name:"reauthenticateWithCredential",a:[Wj()]},reauthenticateWithPopup:{name:"reauthenticateWithPopup",
a:[Xj()]},reauthenticateWithRedirect:{name:"reauthenticateWithRedirect",a:[Xj()]},reload:{name:"reload",a:[]},sendEmailVerification:{name:"sendEmailVerification",a:[]},toJSON:{name:"toJSON",a:[Y(null,!0)]},unlink:{name:"unlink",a:[Y("provider")]},updateEmail:{name:"updateEmail",a:[Y("email")]},updatePassword:{name:"updatePassword",a:[Y("password")]},updateProfile:{name:"updateProfile",a:[Z("profile")]}});ak(A.prototype,{f:{name:"catch"},then:{name:"then"}});
bk(kg,"credential",function(a,b){return new hg(a,b)},[Y("email"),Y("password")]);ak($f.prototype,{addScope:{name:"addScope",a:[Y("scope")]},setCustomParameters:{name:"setCustomParameters",a:[Z("customOAuthParameters")]}});bk($f,"credential",ag,[Yj(Y(),Z(),"token")]);ak(bg.prototype,{addScope:{name:"addScope",a:[Y("scope")]},setCustomParameters:{name:"setCustomParameters",a:[Z("customOAuthParameters")]}});bk(bg,"credential",cg,[Yj(Y(),Z(),"token")]);
ak(dg.prototype,{addScope:{name:"addScope",a:[Y("scope")]},setCustomParameters:{name:"setCustomParameters",a:[Z("customOAuthParameters")]}});bk(dg,"credential",eg,[Yj(Y(),Yj(Z(),Vj()),"idToken"),Yj(Y(),Vj(),"accessToken",!0)]);ak(fg.prototype,{setCustomParameters:{name:"setCustomParameters",a:[Z("customOAuthParameters")]}});bk(fg,"credential",gg,[Yj(Y(),Z(),"token"),Y("secret",!0)]);ak(O.prototype,{toJSON:{name:"toJSON",a:[Y(null,!0)]}});ak(tg.prototype,{toJSON:{name:"toJSON",a:[Y(null,!0)]}});
ak(Rf.prototype,{toJSON:{name:"toJSON",a:[Y(null,!0)]}});
(function(){if("undefined"!==typeof firebase&&firebase.INTERNAL&&firebase.INTERNAL.registerService){var a={Auth:W,Error:O};bk(a,"EmailAuthProvider",kg,[]);bk(a,"FacebookAuthProvider",$f,[]);bk(a,"GithubAuthProvider",bg,[]);bk(a,"GoogleAuthProvider",dg,[]);bk(a,"TwitterAuthProvider",fg,[]);firebase.INTERNAL.registerService("auth",function(a,c){a=new W(a);c({INTERNAL:{getUid:q(a.getUid,a),getToken:q(a.getToken,a),addAuthTokenListener:q(a.Ae,a),removeAuthTokenListener:q(a.uf,a)}});return a},a,function(a,
c){if("create"===a)try{c.auth()}catch(d){}});firebase.INTERNAL.extendNamespace({User:U})}else throw Error("Cannot find the firebase namespace; be sure to include firebase-app.js before this library.");})();}).call(this);
}).call(typeof global !== undefined ? global : typeof self !== undefined ? self : typeof window !== undefined ? window : {});
module.exports = firebase.auth;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./app":13}],15:[function(require,module,exports){
(function (global){
/*! @license Firebase v3.9.0
Build: rev-cc77c9e
Terms: https://firebase.google.com/terms/

---

typedarray.js
Copyright (c) 2010, Linden Research, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

var firebase = require('./app');
(function(){
(function() {var g,aa=this;function n(a){return void 0!==a}function ba(){}function ca(a){a.Vb=function(){return a.Ye?a.Ye:a.Ye=new a}}
function da(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function ea(a){return"array"==da(a)}function fa(a){var b=da(a);return"array"==b||"object"==b&&"number"==typeof a.length}function p(a){return"string"==typeof a}function ga(a){return"number"==typeof a}function ha(a){return"function"==da(a)}function ia(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}function ja(a,b,c){return a.call.apply(a.bind,arguments)}
function ka(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function q(a,b,c){q=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ja:ka;return q.apply(null,arguments)}
function la(a,b){function c(){}c.prototype=b.prototype;a.wg=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.sg=function(a,c,f){for(var h=Array(arguments.length-2),k=2;k<arguments.length;k++)h[k-2]=arguments[k];return b.prototype[c].apply(a,h)}};function ma(a){a=String(a);if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);}function na(){this.Fd=void 0}
function oa(a,b,c){switch(typeof b){case "string":pa(b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(null==b){c.push("null");break}if(ea(b)){var d=b.length;c.push("[");for(var e="",f=0;f<d;f++)c.push(e),e=b[f],oa(a,a.Fd?a.Fd.call(b,String(f),e):e,c),e=",";c.push("]");break}c.push("{");d="";for(f in b)Object.prototype.hasOwnProperty.call(b,f)&&(e=b[f],"function"!=typeof e&&(c.push(d),pa(f,c),
c.push(":"),oa(a,a.Fd?a.Fd.call(b,f,e):e,c),d=","));c.push("}");break;case "function":break;default:throw Error("Unknown type: "+typeof b);}}var qa={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},ra=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;
function pa(a,b){b.push('"',a.replace(ra,function(a){if(a in qa)return qa[a];var b=a.charCodeAt(0),e="\\u";16>b?e+="000":256>b?e+="00":4096>b&&(e+="0");return qa[a]=e+b.toString(16)}),'"')};function sa(){this.Wa=-1};function ta(){this.Wa=-1;this.Wa=64;this.M=[];this.Wd=[];this.Af=[];this.zd=[];this.zd[0]=128;for(var a=1;a<this.Wa;++a)this.zd[a]=0;this.Pd=this.$b=0;this.reset()}la(ta,sa);ta.prototype.reset=function(){this.M[0]=1732584193;this.M[1]=4023233417;this.M[2]=2562383102;this.M[3]=271733878;this.M[4]=3285377520;this.Pd=this.$b=0};
function ua(a,b,c){c||(c=0);var d=a.Af;if(p(b))for(var e=0;16>e;e++)d[e]=b.charCodeAt(c)<<24|b.charCodeAt(c+1)<<16|b.charCodeAt(c+2)<<8|b.charCodeAt(c+3),c+=4;else for(e=0;16>e;e++)d[e]=b[c]<<24|b[c+1]<<16|b[c+2]<<8|b[c+3],c+=4;for(e=16;80>e;e++){var f=d[e-3]^d[e-8]^d[e-14]^d[e-16];d[e]=(f<<1|f>>>31)&4294967295}b=a.M[0];c=a.M[1];for(var h=a.M[2],k=a.M[3],m=a.M[4],l,e=0;80>e;e++)40>e?20>e?(f=k^c&(h^k),l=1518500249):(f=c^h^k,l=1859775393):60>e?(f=c&h|k&(c|h),l=2400959708):(f=c^h^k,l=3395469782),f=(b<<
5|b>>>27)+f+m+l+d[e]&4294967295,m=k,k=h,h=(c<<30|c>>>2)&4294967295,c=b,b=f;a.M[0]=a.M[0]+b&4294967295;a.M[1]=a.M[1]+c&4294967295;a.M[2]=a.M[2]+h&4294967295;a.M[3]=a.M[3]+k&4294967295;a.M[4]=a.M[4]+m&4294967295}
ta.prototype.update=function(a,b){if(null!=a){n(b)||(b=a.length);for(var c=b-this.Wa,d=0,e=this.Wd,f=this.$b;d<b;){if(0==f)for(;d<=c;)ua(this,a,d),d+=this.Wa;if(p(a))for(;d<b;){if(e[f]=a.charCodeAt(d),++f,++d,f==this.Wa){ua(this,e);f=0;break}}else for(;d<b;)if(e[f]=a[d],++f,++d,f==this.Wa){ua(this,e);f=0;break}}this.$b=f;this.Pd+=b}};var r;a:{var va=aa.navigator;if(va){var wa=va.userAgent;if(wa){r=wa;break a}}r=""};var t=Array.prototype,xa=t.indexOf?function(a,b,c){return t.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(p(a))return p(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},ya=t.forEach?function(a,b,c){t.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=p(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},za=t.filter?function(a,b,c){return t.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,h=p(a)?
a.split(""):a,k=0;k<d;k++)if(k in h){var m=h[k];b.call(c,m,k,a)&&(e[f++]=m)}return e},Aa=t.map?function(a,b,c){return t.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=p(a)?a.split(""):a,h=0;h<d;h++)h in f&&(e[h]=b.call(c,f[h],h,a));return e},Ba=t.reduce?function(a,b,c,d){for(var e=[],f=1,h=arguments.length;f<h;f++)e.push(arguments[f]);d&&(e[0]=q(b,d));return t.reduce.apply(a,e)}:function(a,b,c,d){var e=c;ya(a,function(c,h){e=b.call(d,e,c,h,a)});return e},Ca=t.every?function(a,b,
c){return t.every.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=p(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&!b.call(c,e[f],f,a))return!1;return!0};function Da(a,b){var c=Ea(a,b,void 0);return 0>c?null:p(a)?a.charAt(c):a[c]}function Ea(a,b,c){for(var d=a.length,e=p(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return f;return-1}function Fa(a,b){var c=xa(a,b);0<=c&&t.splice.call(a,c,1)}function Ga(a,b,c){return 2>=arguments.length?t.slice.call(a,b):t.slice.call(a,b,c)}
function Ha(a,b){a.sort(b||Ia)}function Ia(a,b){return a>b?1:a<b?-1:0};function v(a,b){for(var c in a)b.call(void 0,a[c],c,a)}function Ja(a,b){var c={},d;for(d in a)c[d]=b.call(void 0,a[d],d,a);return c}function Ka(a,b){for(var c in a)if(!b.call(void 0,a[c],c,a))return!1;return!0}function La(a){var b=0,c;for(c in a)b++;return b}function Ma(a){for(var b in a)return b}function Na(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b}function Oa(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b}function Pa(a,b){for(var c in a)if(a[c]==b)return!0;return!1}
function Qa(a,b,c){for(var d in a)if(b.call(c,a[d],d,a))return d}function Ra(a,b){var c=Qa(a,b,void 0);return c&&a[c]}function Sa(a){for(var b in a)return!1;return!0}function Ta(a){var b={},c;for(c in a)b[c]=a[c];return b};var Ua=-1!=r.indexOf("Opera")||-1!=r.indexOf("OPR"),Va=-1!=r.indexOf("Trident")||-1!=r.indexOf("MSIE"),Wa=-1!=r.indexOf("Gecko")&&-1==r.toLowerCase().indexOf("webkit")&&!(-1!=r.indexOf("Trident")||-1!=r.indexOf("MSIE")),Xa=-1!=r.toLowerCase().indexOf("webkit");
(function(){var a="",b;if(Ua&&aa.opera)return a=aa.opera.version,ha(a)?a():a;Wa?b=/rv\:([^\);]+)(\)|;)/:Va?b=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:Xa&&(b=/WebKit\/(\S+)/);b&&(a=(a=b.exec(r))?a[1]:"");return Va&&(b=(b=aa.document)?b.documentMode:void 0,b>parseFloat(a))?String(b):a})();var Ya=null,Za=null,$a=null;function ab(a,b){if(!fa(a))throw Error("encodeByteArray takes an array as a parameter");bb();for(var c=b?Za:Ya,d=[],e=0;e<a.length;e+=3){var f=a[e],h=e+1<a.length,k=h?a[e+1]:0,m=e+2<a.length,l=m?a[e+2]:0,u=f>>2,f=(f&3)<<4|k>>4,k=(k&15)<<2|l>>6,l=l&63;m||(l=64,h||(k=64));d.push(c[u],c[f],c[k],c[l])}return d.join("")}
function bb(){if(!Ya){Ya={};Za={};$a={};for(var a=0;65>a;a++)Ya[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a),Za[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a),$a[Za[a]]=a,62<=a&&($a["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a)]=a)}};function cb(a,b){if(!a)throw db(b);}function db(a){return Error("Firebase Database ("+firebase.SDK_VERSION+") INTERNAL ASSERT FAILED: "+a)};function eb(a,b){return Object.prototype.hasOwnProperty.call(a,b)}function w(a,b){if(Object.prototype.hasOwnProperty.call(a,b))return a[b]}function fb(a,b){for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&b(c,a[c])};function gb(a){var b=[];fb(a,function(a,d){ea(d)?ya(d,function(d){b.push(encodeURIComponent(a)+"="+encodeURIComponent(d))}):b.push(encodeURIComponent(a)+"="+encodeURIComponent(d))});return b.length?"&"+b.join("&"):""};var hb=firebase.Promise;function ib(){var a=this;this.reject=this.resolve=null;this.ra=new hb(function(b,c){a.resolve=b;a.reject=c})}function jb(a,b){return function(c,d){c?a.reject(c):a.resolve(d);ha(b)&&(kb(a.ra),1===b.length?b(c):b(c,d))}}function kb(a){a.then(void 0,ba)};function lb(a){return"undefined"!==typeof JSON&&n(JSON.parse)?JSON.parse(a):ma(a)}function x(a){if("undefined"!==typeof JSON&&n(JSON.stringify))a=JSON.stringify(a);else{var b=[];oa(new na,a,b);a=b.join("")}return a};function mb(a){for(var b=[],c=0,d=0;d<a.length;d++){var e=a.charCodeAt(d);55296<=e&&56319>=e&&(e-=55296,d++,cb(d<a.length,"Surrogate pair missing trail surrogate."),e=65536+(e<<10)+(a.charCodeAt(d)-56320));128>e?b[c++]=e:(2048>e?b[c++]=e>>6|192:(65536>e?b[c++]=e>>12|224:(b[c++]=e>>18|240,b[c++]=e>>12&63|128),b[c++]=e>>6&63|128),b[c++]=e&63|128)}return b}function nb(a){for(var b=0,c=0;c<a.length;c++){var d=a.charCodeAt(c);128>d?b++:2048>d?b+=2:55296<=d&&56319>=d?(b+=4,c++):b+=3}return b};function y(a,b,c,d){var e;d<b?e="at least "+b:d>c&&(e=0===c?"none":"no more than "+c);if(e)throw Error(a+" failed: Was called with "+d+(1===d?" argument.":" arguments.")+" Expects "+e+".");}function A(a,b,c){var d="";switch(b){case 1:d=c?"first":"First";break;case 2:d=c?"second":"Second";break;case 3:d=c?"third":"Third";break;case 4:d=c?"fourth":"Fourth";break;default:throw Error("errorPrefix called with argumentNumber > 4.  Need to update it?");}return a=a+" failed: "+(d+" argument ")}
function B(a,b,c,d){if((!d||n(c))&&!ha(c))throw Error(A(a,b,d)+"must be a valid function.");}function ob(a,b,c){if(n(c)&&(!ia(c)||null===c))throw Error(A(a,b,!0)+"must be a valid context object.");};function pb(){return"undefined"!==typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test("undefined"!==typeof navigator&&"string"===typeof navigator.userAgent?navigator.userAgent:"")};function C(a,b){this.name=a;this.R=b}function qb(a,b){return new C(a,b)};function rb(a,b){return sb(a.name,b.name)}function tb(a,b){return sb(a,b)};function ub(a){this.uc=a;this.Cd="firebase:"}g=ub.prototype;g.set=function(a,b){null==b?this.uc.removeItem(this.Cd+a):this.uc.setItem(this.Cd+a,x(b))};g.get=function(a){a=this.uc.getItem(this.Cd+a);return null==a?null:lb(a)};g.remove=function(a){this.uc.removeItem(this.Cd+a)};g.Ze=!1;g.toString=function(){return this.uc.toString()};function vb(){this.pc={}}vb.prototype.set=function(a,b){null==b?delete this.pc[a]:this.pc[a]=b};vb.prototype.get=function(a){return eb(this.pc,a)?this.pc[a]:null};vb.prototype.remove=function(a){delete this.pc[a]};vb.prototype.Ze=!0;function wb(a){try{if("undefined"!==typeof window&&"undefined"!==typeof window[a]){var b=window[a];b.setItem("firebase:sentinel","cache");b.removeItem("firebase:sentinel");return new ub(b)}}catch(c){}return new vb}var xb=wb("localStorage"),yb=wb("sessionStorage");function zb(a,b,c,d,e){this.host=a.toLowerCase();this.domain=this.host.substr(this.host.indexOf(".")+1);this.Sc=b;this.pe=c;this.qg=d;this.gf=e||"";this.$a=xb.get("host:"+a)||this.host}function Ab(a,b){b!==a.$a&&(a.$a=b,"s-"===a.$a.substr(0,2)&&xb.set("host:"+a.host,a.$a))}
function Bb(a,b,c){D("string"===typeof b,"typeof type must == string");D("object"===typeof c,"typeof params must == object");if(b===Cb)b=(a.Sc?"wss://":"ws://")+a.$a+"/.ws?";else if(b===Db)b=(a.Sc?"https://":"http://")+a.$a+"/.lp?";else throw Error("Unknown connection type: "+b);a.host!==a.$a&&(c.ns=a.pe);var d=[];v(c,function(a,b){d.push(b+"="+a)});return b+d.join("&")}zb.prototype.toString=function(){var a=(this.Sc?"https://":"http://")+this.host;this.gf&&(a+="<"+this.gf+">");return a};function Eb(a,b){return a&&"object"===typeof a?(D(".sv"in a,"Unexpected leaf node or priority contents"),b[a[".sv"]]):a}function Fb(a,b){var c=new Gb;Hb(a,new E(""),function(a,e){Ib(c,a,Jb(e,b))});return c}function Jb(a,b){var c=a.C().H(),c=Eb(c,b),d;if(a.J()){var e=Eb(a.Ca(),b);return e!==a.Ca()||c!==a.C().H()?new Kb(e,G(c)):a}d=a;c!==a.C().H()&&(d=d.fa(new Kb(c)));a.O(H,function(a,c){var e=Jb(c,b);e!==c&&(d=d.T(a,e))});return d};var Lb=function(){var a=1;return function(){return a++}}(),D=cb,Mb=db;
function Nb(a){try{var b;bb();for(var c=$a,d=[],e=0;e<a.length;){var f=c[a.charAt(e++)],h=e<a.length?c[a.charAt(e)]:0;++e;var k=e<a.length?c[a.charAt(e)]:64;++e;var m=e<a.length?c[a.charAt(e)]:64;++e;if(null==f||null==h||null==k||null==m)throw Error();d.push(f<<2|h>>4);64!=k&&(d.push(h<<4&240|k>>2),64!=m&&d.push(k<<6&192|m))}if(8192>d.length)b=String.fromCharCode.apply(null,d);else{a="";for(c=0;c<d.length;c+=8192)a+=String.fromCharCode.apply(null,Ga(d,c,c+8192));b=a}return b}catch(l){I("base64Decode failed: ",
l)}return null}function Ob(a){var b=mb(a);a=new ta;a.update(b);var b=[],c=8*a.Pd;56>a.$b?a.update(a.zd,56-a.$b):a.update(a.zd,a.Wa-(a.$b-56));for(var d=a.Wa-1;56<=d;d--)a.Wd[d]=c&255,c/=256;ua(a,a.Wd);for(d=c=0;5>d;d++)for(var e=24;0<=e;e-=8)b[c]=a.M[d]>>e&255,++c;return ab(b)}function Pb(a){for(var b="",c=0;c<arguments.length;c++)b=fa(arguments[c])?b+Pb.apply(null,arguments[c]):"object"===typeof arguments[c]?b+x(arguments[c]):b+arguments[c],b+=" ";return b}var Qb=null,Rb=!0;
function Sb(a,b){cb(!b||!0===a||!1===a,"Can't turn on custom loggers persistently.");!0===a?("undefined"!==typeof console&&("function"===typeof console.log?Qb=q(console.log,console):"object"===typeof console.log&&(Qb=function(a){console.log(a)})),b&&yb.set("logging_enabled",!0)):ha(a)?Qb=a:(Qb=null,yb.remove("logging_enabled"))}function I(a){!0===Rb&&(Rb=!1,null===Qb&&!0===yb.get("logging_enabled")&&Sb(!0));if(Qb){var b=Pb.apply(null,arguments);Qb(b)}}
function Tb(a){return function(){I(a,arguments)}}function Ub(a){if("undefined"!==typeof console){var b="FIREBASE INTERNAL ERROR: "+Pb.apply(null,arguments);"undefined"!==typeof console.error?console.error(b):console.log(b)}}function Vb(a){var b=Pb.apply(null,arguments);throw Error("FIREBASE FATAL ERROR: "+b);}function J(a){if("undefined"!==typeof console){var b="FIREBASE WARNING: "+Pb.apply(null,arguments);"undefined"!==typeof console.warn?console.warn(b):console.log(b)}}
function Wb(a){var b,c,d,e,f,h=a;f=c=a=b="";d=!0;e="https";if(p(h)){var k=h.indexOf("//");0<=k&&(e=h.substring(0,k-1),h=h.substring(k+2));k=h.indexOf("/");-1===k&&(k=h.length);b=h.substring(0,k);f="";h=h.substring(k).split("/");for(k=0;k<h.length;k++)if(0<h[k].length){var m=h[k];try{m=decodeURIComponent(m.replace(/\+/g," "))}catch(l){}f+="/"+m}h=b.split(".");3===h.length?(a=h[1],c=h[0].toLowerCase()):2===h.length&&(a=h[0]);k=b.indexOf(":");0<=k&&(d="https"===e||"wss"===e)}"firebase"===a&&Vb(b+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead");
c&&"undefined"!=c||Vb("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com");d||"undefined"!==typeof window&&window.location&&window.location.protocol&&-1!==window.location.protocol.indexOf("https:")&&J("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().");return{jc:new zb(b,d,c,"ws"===e||"wss"===e),path:new E(f)}}function Xb(a){return ga(a)&&(a!=a||a==Number.POSITIVE_INFINITY||a==Number.NEGATIVE_INFINITY)}
function Yb(a){if("complete"===document.readyState)a();else{var b=!1,c=function(){document.body?b||(b=!0,a()):setTimeout(c,Math.floor(10))};document.addEventListener?(document.addEventListener("DOMContentLoaded",c,!1),window.addEventListener("load",c,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",function(){"complete"===document.readyState&&c()}),window.attachEvent("onload",c))}}
function sb(a,b){if(a===b)return 0;if("[MIN_NAME]"===a||"[MAX_NAME]"===b)return-1;if("[MIN_NAME]"===b||"[MAX_NAME]"===a)return 1;var c=Zb(a),d=Zb(b);return null!==c?null!==d?0==c-d?a.length-b.length:c-d:-1:null!==d?1:a<b?-1:1}function $b(a,b){if(b&&a in b)return b[a];throw Error("Missing required key ("+a+") in object: "+x(b));}
function ac(a){if("object"!==typeof a||null===a)return x(a);var b=[],c;for(c in a)b.push(c);b.sort();c="{";for(var d=0;d<b.length;d++)0!==d&&(c+=","),c+=x(b[d]),c+=":",c+=ac(a[b[d]]);return c+"}"}function bc(a,b){if(a.length<=b)return[a];for(var c=[],d=0;d<a.length;d+=b)d+b>a?c.push(a.substring(d,a.length)):c.push(a.substring(d,d+b));return c}function cc(a,b){if(ea(a))for(var c=0;c<a.length;++c)b(c,a[c]);else v(a,b)}
function dc(a){D(!Xb(a),"Invalid JSON number");var b,c,d,e;0===a?(d=c=0,b=-Infinity===1/a?1:0):(b=0>a,a=Math.abs(a),a>=Math.pow(2,-1022)?(d=Math.min(Math.floor(Math.log(a)/Math.LN2),1023),c=d+1023,d=Math.round(a*Math.pow(2,52-d)-Math.pow(2,52))):(c=0,d=Math.round(a/Math.pow(2,-1074))));e=[];for(a=52;a;--a)e.push(d%2?1:0),d=Math.floor(d/2);for(a=11;a;--a)e.push(c%2?1:0),c=Math.floor(c/2);e.push(b?1:0);e.reverse();b=e.join("");c="";for(a=0;64>a;a+=8)d=parseInt(b.substr(a,8),2).toString(16),1===d.length&&
(d="0"+d),c+=d;return c.toLowerCase()}var ec=/^-?\d{1,10}$/;function Zb(a){return ec.test(a)&&(a=Number(a),-2147483648<=a&&2147483647>=a)?a:null}function fc(a){try{a()}catch(b){setTimeout(function(){J("Exception was thrown by user callback.",b.stack||"");throw b;},Math.floor(0))}}function gc(a,b,c){Object.defineProperty(a,b,{get:c})}function hc(a,b){var c=setTimeout(a,b);"object"===typeof c&&c.unref&&c.unref();return c};function ic(a){var b={},c={},d={},e="";try{var f=a.split("."),b=lb(Nb(f[0])||""),c=lb(Nb(f[1])||""),e=f[2],d=c.d||{};delete c.d}catch(h){}return{tg:b,Je:c,data:d,mg:e}}function jc(a){a=ic(a);var b=a.Je;return!!a.mg&&!!b&&"object"===typeof b&&b.hasOwnProperty("iat")}function kc(a){a=ic(a).Je;return"object"===typeof a&&!0===w(a,"admin")};function lc(){}var mc={};function nc(a){return q(a.compare,a)}lc.prototype.nd=function(a,b){return 0!==this.compare(new C("[MIN_NAME]",a),new C("[MIN_NAME]",b))};lc.prototype.Hc=function(){return oc};function pc(a){D(!a.e()&&".priority"!==K(a),"Can't create PathIndex with empty path or .priority key");this.bc=a}la(pc,lc);g=pc.prototype;g.xc=function(a){return!a.P(this.bc).e()};g.compare=function(a,b){var c=a.R.P(this.bc),d=b.R.P(this.bc),c=c.sc(d);return 0===c?sb(a.name,b.name):c};
g.Ec=function(a,b){var c=G(a),c=L.F(this.bc,c);return new C(b,c)};g.Fc=function(){var a=L.F(this.bc,qc);return new C("[MAX_NAME]",a)};g.toString=function(){return this.bc.slice().join("/")};function rc(){}la(rc,lc);g=rc.prototype;g.compare=function(a,b){var c=a.R.C(),d=b.R.C(),c=c.sc(d);return 0===c?sb(a.name,b.name):c};g.xc=function(a){return!a.C().e()};g.nd=function(a,b){return!a.C().Z(b.C())};g.Hc=function(){return oc};g.Fc=function(){return new C("[MAX_NAME]",new Kb("[PRIORITY-POST]",qc))};
g.Ec=function(a,b){var c=G(a);return new C(b,new Kb("[PRIORITY-POST]",c))};g.toString=function(){return".priority"};var H=new rc;function sc(){}la(sc,lc);g=sc.prototype;g.compare=function(a,b){return sb(a.name,b.name)};g.xc=function(){throw Mb("KeyIndex.isDefinedOn not expected to be called.");};g.nd=function(){return!1};g.Hc=function(){return oc};g.Fc=function(){return new C("[MAX_NAME]",L)};g.Ec=function(a){D(p(a),"KeyIndex indexValue must always be a string.");return new C(a,L)};g.toString=function(){return".key"};
var tc=new sc;function uc(){}la(uc,lc);g=uc.prototype;g.compare=function(a,b){var c=a.R.sc(b.R);return 0===c?sb(a.name,b.name):c};g.xc=function(){return!0};g.nd=function(a,b){return!a.Z(b)};g.Hc=function(){return oc};g.Fc=function(){return vc};g.Ec=function(a,b){var c=G(a);return new C(b,c)};g.toString=function(){return".value"};var wc=new uc;function xc(a,b){this.od=a;this.cc=b}xc.prototype.get=function(a){var b=w(this.od,a);if(!b)throw Error("No index defined for "+a);return b===mc?null:b};function yc(a,b,c){var d=Ja(a.od,function(d,f){var h=w(a.cc,f);D(h,"Missing index implementation for "+f);if(d===mc){if(h.xc(b.R)){for(var k=[],m=c.Wb(qb),l=M(m);l;)l.name!=b.name&&k.push(l),l=M(m);k.push(b);return zc(k,nc(h))}return mc}h=c.get(b.name);k=d;h&&(k=k.remove(new C(b.name,h)));return k.Oa(b,b.R)});return new xc(d,a.cc)}
function Ac(a,b,c){var d=Ja(a.od,function(a){if(a===mc)return a;var d=c.get(b.name);return d?a.remove(new C(b.name,d)):a});return new xc(d,a.cc)}var Bc=new xc({".priority":mc},{".priority":H});function Kb(a,b){this.B=a;D(n(this.B)&&null!==this.B,"LeafNode shouldn't be created with null/undefined value.");this.aa=b||L;Cc(this.aa);this.Db=null}var Dc=["object","boolean","number","string"];g=Kb.prototype;g.J=function(){return!0};g.C=function(){return this.aa};g.fa=function(a){return new Kb(this.B,a)};g.Q=function(a){return".priority"===a?this.aa:L};g.P=function(a){return a.e()?this:".priority"===K(a)?this.aa:L};g.Da=function(){return!1};g.Ve=function(){return null};
g.T=function(a,b){return".priority"===a?this.fa(b):b.e()&&".priority"!==a?this:L.T(a,b).fa(this.aa)};g.F=function(a,b){var c=K(a);if(null===c)return b;if(b.e()&&".priority"!==c)return this;D(".priority"!==c||1===Ec(a),".priority must be the last token in a path");return this.T(c,L.F(N(a),b))};g.e=function(){return!1};g.Eb=function(){return 0};g.O=function(){return!1};g.H=function(a){return a&&!this.C().e()?{".value":this.Ca(),".priority":this.C().H()}:this.Ca()};
g.hash=function(){if(null===this.Db){var a="";this.aa.e()||(a+="priority:"+Fc(this.aa.H())+":");var b=typeof this.B,a=a+(b+":"),a="number"===b?a+dc(this.B):a+this.B;this.Db=Ob(a)}return this.Db};g.Ca=function(){return this.B};g.sc=function(a){if(a===L)return 1;if(a instanceof O)return-1;D(a.J(),"Unknown node type");var b=typeof a.B,c=typeof this.B,d=xa(Dc,b),e=xa(Dc,c);D(0<=d,"Unknown leaf type: "+b);D(0<=e,"Unknown leaf type: "+c);return d===e?"object"===c?0:this.B<a.B?-1:this.B===a.B?0:1:e-d};
g.nb=function(){return this};g.yc=function(){return!0};g.Z=function(a){return a===this?!0:a.J()?this.B===a.B&&this.aa.Z(a.aa):!1};g.toString=function(){return x(this.H(!0))};function Gc(){this.set={}}g=Gc.prototype;g.add=function(a,b){this.set[a]=null!==b?b:!0};g.contains=function(a){return eb(this.set,a)};g.get=function(a){return this.contains(a)?this.set[a]:void 0};g.remove=function(a){delete this.set[a]};g.clear=function(){this.set={}};g.e=function(){return Sa(this.set)};g.count=function(){return La(this.set)};function Hc(a,b){v(a.set,function(a,d){b(d,a)})}g.keys=function(){var a=[];v(this.set,function(b,c){a.push(c)});return a};function Ic(a){D(ea(a)&&0<a.length,"Requires a non-empty array");this.Bf=a;this.Dc={}}Ic.prototype.Ge=function(a,b){var c;c=this.Dc[a]||[];var d=c.length;if(0<d){for(var e=Array(d),f=0;f<d;f++)e[f]=c[f];c=e}else c=[];for(d=0;d<c.length;d++)c[d].Ie.apply(c[d].Ma,Array.prototype.slice.call(arguments,1))};Ic.prototype.gc=function(a,b,c){Jc(this,a);this.Dc[a]=this.Dc[a]||[];this.Dc[a].push({Ie:b,Ma:c});(a=this.Ue(a))&&b.apply(c,a)};
Ic.prototype.Ic=function(a,b,c){Jc(this,a);a=this.Dc[a]||[];for(var d=0;d<a.length;d++)if(a[d].Ie===b&&(!c||c===a[d].Ma)){a.splice(d,1);break}};function Jc(a,b){D(Da(a.Bf,function(a){return a===b}),"Unknown event: "+b)};var Kc=function(){var a=0,b=[];return function(c){var d=c===a;a=c;for(var e=Array(8),f=7;0<=f;f--)e[f]="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c%64),c=Math.floor(c/64);D(0===c,"Cannot push at time == 0");c=e.join("");if(d){for(f=11;0<=f&&63===b[f];f--)b[f]=0;b[f]++}else for(f=0;12>f;f++)b[f]=Math.floor(64*Math.random());for(f=0;12>f;f++)c+="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);D(20===c.length,"nextPushId: Length should be 20.");
return c}}();function Lc(){Ic.call(this,["online"]);this.hc=!0;if("undefined"!==typeof window&&"undefined"!==typeof window.addEventListener&&!pb()){var a=this;window.addEventListener("online",function(){a.hc||(a.hc=!0,a.Ge("online",!0))},!1);window.addEventListener("offline",function(){a.hc&&(a.hc=!1,a.Ge("online",!1))},!1)}}la(Lc,Ic);Lc.prototype.Ue=function(a){D("online"===a,"Unknown event type: "+a);return[this.hc]};ca(Lc);function Mc(){Ic.call(this,["visible"]);var a,b;"undefined"!==typeof document&&"undefined"!==typeof document.addEventListener&&("undefined"!==typeof document.hidden?(b="visibilitychange",a="hidden"):"undefined"!==typeof document.mozHidden?(b="mozvisibilitychange",a="mozHidden"):"undefined"!==typeof document.msHidden?(b="msvisibilitychange",a="msHidden"):"undefined"!==typeof document.webkitHidden&&(b="webkitvisibilitychange",a="webkitHidden"));this.Mb=!0;if(b){var c=this;document.addEventListener(b,
function(){var b=!document[a];b!==c.Mb&&(c.Mb=b,c.Ge("visible",b))},!1)}}la(Mc,Ic);Mc.prototype.Ue=function(a){D("visible"===a,"Unknown event type: "+a);return[this.Mb]};ca(Mc);function E(a,b){if(1==arguments.length){this.o=a.split("/");for(var c=0,d=0;d<this.o.length;d++)0<this.o[d].length&&(this.o[c]=this.o[d],c++);this.o.length=c;this.Y=0}else this.o=a,this.Y=b}function P(a,b){var c=K(a);if(null===c)return b;if(c===K(b))return P(N(a),N(b));throw Error("INTERNAL ERROR: innerPath ("+b+") is not within outerPath ("+a+")");}
function Nc(a,b){for(var c=a.slice(),d=b.slice(),e=0;e<c.length&&e<d.length;e++){var f=sb(c[e],d[e]);if(0!==f)return f}return c.length===d.length?0:c.length<d.length?-1:1}function K(a){return a.Y>=a.o.length?null:a.o[a.Y]}function Ec(a){return a.o.length-a.Y}function N(a){var b=a.Y;b<a.o.length&&b++;return new E(a.o,b)}function Oc(a){return a.Y<a.o.length?a.o[a.o.length-1]:null}g=E.prototype;
g.toString=function(){for(var a="",b=this.Y;b<this.o.length;b++)""!==this.o[b]&&(a+="/"+this.o[b]);return a||"/"};g.slice=function(a){return this.o.slice(this.Y+(a||0))};g.parent=function(){if(this.Y>=this.o.length)return null;for(var a=[],b=this.Y;b<this.o.length-1;b++)a.push(this.o[b]);return new E(a,0)};
g.n=function(a){for(var b=[],c=this.Y;c<this.o.length;c++)b.push(this.o[c]);if(a instanceof E)for(c=a.Y;c<a.o.length;c++)b.push(a.o[c]);else for(a=a.split("/"),c=0;c<a.length;c++)0<a[c].length&&b.push(a[c]);return new E(b,0)};g.e=function(){return this.Y>=this.o.length};g.Z=function(a){if(Ec(this)!==Ec(a))return!1;for(var b=this.Y,c=a.Y;b<=this.o.length;b++,c++)if(this.o[b]!==a.o[c])return!1;return!0};
g.contains=function(a){var b=this.Y,c=a.Y;if(Ec(this)>Ec(a))return!1;for(;b<this.o.length;){if(this.o[b]!==a.o[c])return!1;++b;++c}return!0};var Q=new E("");function Pc(a,b){this.Qa=a.slice();this.Ha=Math.max(1,this.Qa.length);this.Qe=b;for(var c=0;c<this.Qa.length;c++)this.Ha+=nb(this.Qa[c]);Qc(this)}Pc.prototype.push=function(a){0<this.Qa.length&&(this.Ha+=1);this.Qa.push(a);this.Ha+=nb(a);Qc(this)};Pc.prototype.pop=function(){var a=this.Qa.pop();this.Ha-=nb(a);0<this.Qa.length&&--this.Ha};
function Qc(a){if(768<a.Ha)throw Error(a.Qe+"has a key path longer than 768 bytes ("+a.Ha+").");if(32<a.Qa.length)throw Error(a.Qe+"path specified exceeds the maximum depth that can be written (32) or object contains a cycle "+Rc(a));}function Rc(a){return 0==a.Qa.length?"":"in property '"+a.Qa.join(".")+"'"};function Sc(){this.children={};this.bd=0;this.value=null}function Tc(a,b,c){this.ud=a?a:"";this.Pc=b?b:null;this.A=c?c:new Sc}function Uc(a,b){for(var c=b instanceof E?b:new E(b),d=a,e;null!==(e=K(c));)d=new Tc(e,d,w(d.A.children,e)||new Sc),c=N(c);return d}g=Tc.prototype;g.Ca=function(){return this.A.value};function Vc(a,b){D("undefined"!==typeof b,"Cannot set value to undefined");a.A.value=b;Wc(a)}g.clear=function(){this.A.value=null;this.A.children={};this.A.bd=0;Wc(this)};
g.kd=function(){return 0<this.A.bd};g.e=function(){return null===this.Ca()&&!this.kd()};g.O=function(a){var b=this;v(this.A.children,function(c,d){a(new Tc(d,b,c))})};function Xc(a,b,c,d){c&&!d&&b(a);a.O(function(a){Xc(a,b,!0,d)});c&&d&&b(a)}function Yc(a,b){for(var c=a.parent();null!==c&&!b(c);)c=c.parent()}g.path=function(){return new E(null===this.Pc?this.ud:this.Pc.path()+"/"+this.ud)};g.name=function(){return this.ud};g.parent=function(){return this.Pc};
function Wc(a){if(null!==a.Pc){var b=a.Pc,c=a.ud,d=a.e(),e=eb(b.A.children,c);d&&e?(delete b.A.children[c],b.A.bd--,Wc(b)):d||e||(b.A.children[c]=a.A,b.A.bd++,Wc(b))}};function Zc(a,b){this.La=a;this.ba=b?b:$c}g=Zc.prototype;g.Oa=function(a,b){return new Zc(this.La,this.ba.Oa(a,b,this.La).X(null,null,!1,null,null))};g.remove=function(a){return new Zc(this.La,this.ba.remove(a,this.La).X(null,null,!1,null,null))};g.get=function(a){for(var b,c=this.ba;!c.e();){b=this.La(a,c.key);if(0===b)return c.value;0>b?c=c.left:0<b&&(c=c.right)}return null};
function ad(a,b){for(var c,d=a.ba,e=null;!d.e();){c=a.La(b,d.key);if(0===c){if(d.left.e())return e?e.key:null;for(d=d.left;!d.right.e();)d=d.right;return d.key}0>c?d=d.left:0<c&&(e=d,d=d.right)}throw Error("Attempted to find predecessor key for a nonexistent key.  What gives?");}g.e=function(){return this.ba.e()};g.count=function(){return this.ba.count()};g.Gc=function(){return this.ba.Gc()};g.ec=function(){return this.ba.ec()};g.ha=function(a){return this.ba.ha(a)};
g.Wb=function(a){return new bd(this.ba,null,this.La,!1,a)};g.Xb=function(a,b){return new bd(this.ba,a,this.La,!1,b)};g.Zb=function(a,b){return new bd(this.ba,a,this.La,!0,b)};g.We=function(a){return new bd(this.ba,null,this.La,!0,a)};function bd(a,b,c,d,e){this.Hd=e||null;this.le=d;this.Pa=[];for(e=1;!a.e();)if(e=b?c(a.key,b):1,d&&(e*=-1),0>e)a=this.le?a.left:a.right;else if(0===e){this.Pa.push(a);break}else this.Pa.push(a),a=this.le?a.right:a.left}
function M(a){if(0===a.Pa.length)return null;var b=a.Pa.pop(),c;c=a.Hd?a.Hd(b.key,b.value):{key:b.key,value:b.value};if(a.le)for(b=b.left;!b.e();)a.Pa.push(b),b=b.right;else for(b=b.right;!b.e();)a.Pa.push(b),b=b.left;return c}function cd(a){if(0===a.Pa.length)return null;var b;b=a.Pa;b=b[b.length-1];return a.Hd?a.Hd(b.key,b.value):{key:b.key,value:b.value}}function dd(a,b,c,d,e){this.key=a;this.value=b;this.color=null!=c?c:!0;this.left=null!=d?d:$c;this.right=null!=e?e:$c}g=dd.prototype;
g.X=function(a,b,c,d,e){return new dd(null!=a?a:this.key,null!=b?b:this.value,null!=c?c:this.color,null!=d?d:this.left,null!=e?e:this.right)};g.count=function(){return this.left.count()+1+this.right.count()};g.e=function(){return!1};g.ha=function(a){return this.left.ha(a)||a(this.key,this.value)||this.right.ha(a)};function ed(a){return a.left.e()?a:ed(a.left)}g.Gc=function(){return ed(this).key};g.ec=function(){return this.right.e()?this.key:this.right.ec()};
g.Oa=function(a,b,c){var d,e;e=this;d=c(a,e.key);e=0>d?e.X(null,null,null,e.left.Oa(a,b,c),null):0===d?e.X(null,b,null,null,null):e.X(null,null,null,null,e.right.Oa(a,b,c));return gd(e)};function hd(a){if(a.left.e())return $c;a.left.ea()||a.left.left.ea()||(a=id(a));a=a.X(null,null,null,hd(a.left),null);return gd(a)}
g.remove=function(a,b){var c,d;c=this;if(0>b(a,c.key))c.left.e()||c.left.ea()||c.left.left.ea()||(c=id(c)),c=c.X(null,null,null,c.left.remove(a,b),null);else{c.left.ea()&&(c=jd(c));c.right.e()||c.right.ea()||c.right.left.ea()||(c=kd(c),c.left.left.ea()&&(c=jd(c),c=kd(c)));if(0===b(a,c.key)){if(c.right.e())return $c;d=ed(c.right);c=c.X(d.key,d.value,null,null,hd(c.right))}c=c.X(null,null,null,null,c.right.remove(a,b))}return gd(c)};g.ea=function(){return this.color};
function gd(a){a.right.ea()&&!a.left.ea()&&(a=ld(a));a.left.ea()&&a.left.left.ea()&&(a=jd(a));a.left.ea()&&a.right.ea()&&(a=kd(a));return a}function id(a){a=kd(a);a.right.left.ea()&&(a=a.X(null,null,null,null,jd(a.right)),a=ld(a),a=kd(a));return a}function ld(a){return a.right.X(null,null,a.color,a.X(null,null,!0,null,a.right.left),null)}function jd(a){return a.left.X(null,null,a.color,null,a.X(null,null,!0,a.left.right,null))}
function kd(a){return a.X(null,null,!a.color,a.left.X(null,null,!a.left.color,null,null),a.right.X(null,null,!a.right.color,null,null))}function md(){}g=md.prototype;g.X=function(){return this};g.Oa=function(a,b){return new dd(a,b,null)};g.remove=function(){return this};g.count=function(){return 0};g.e=function(){return!0};g.ha=function(){return!1};g.Gc=function(){return null};g.ec=function(){return null};g.ea=function(){return!1};var $c=new md;function O(a,b,c){this.k=a;(this.aa=b)&&Cc(this.aa);a.e()&&D(!this.aa||this.aa.e(),"An empty node cannot have a priority");this.yb=c;this.Db=null}g=O.prototype;g.J=function(){return!1};g.C=function(){return this.aa||L};g.fa=function(a){return this.k.e()?this:new O(this.k,a,this.yb)};g.Q=function(a){if(".priority"===a)return this.C();a=this.k.get(a);return null===a?L:a};g.P=function(a){var b=K(a);return null===b?this:this.Q(b).P(N(a))};g.Da=function(a){return null!==this.k.get(a)};
g.T=function(a,b){D(b,"We should always be passing snapshot nodes");if(".priority"===a)return this.fa(b);var c=new C(a,b),d,e;b.e()?(d=this.k.remove(a),c=Ac(this.yb,c,this.k)):(d=this.k.Oa(a,b),c=yc(this.yb,c,this.k));e=d.e()?L:this.aa;return new O(d,e,c)};g.F=function(a,b){var c=K(a);if(null===c)return b;D(".priority"!==K(a)||1===Ec(a),".priority must be the last token in a path");var d=this.Q(c).F(N(a),b);return this.T(c,d)};g.e=function(){return this.k.e()};g.Eb=function(){return this.k.count()};
var nd=/^(0|[1-9]\d*)$/;g=O.prototype;g.H=function(a){if(this.e())return null;var b={},c=0,d=0,e=!0;this.O(H,function(f,h){b[f]=h.H(a);c++;e&&nd.test(f)?d=Math.max(d,Number(f)):e=!1});if(!a&&e&&d<2*c){var f=[],h;for(h in b)f[h]=b[h];return f}a&&!this.C().e()&&(b[".priority"]=this.C().H());return b};g.hash=function(){if(null===this.Db){var a="";this.C().e()||(a+="priority:"+Fc(this.C().H())+":");this.O(H,function(b,c){var d=c.hash();""!==d&&(a+=":"+b+":"+d)});this.Db=""===a?"":Ob(a)}return this.Db};
g.Ve=function(a,b,c){return(c=od(this,c))?(a=ad(c,new C(a,b)))?a.name:null:ad(this.k,a)};function pd(a,b){var c;c=(c=od(a,b))?(c=c.Gc())&&c.name:a.k.Gc();return c?new C(c,a.k.get(c)):null}function qd(a,b){var c;c=(c=od(a,b))?(c=c.ec())&&c.name:a.k.ec();return c?new C(c,a.k.get(c)):null}g.O=function(a,b){var c=od(this,a);return c?c.ha(function(a){return b(a.name,a.R)}):this.k.ha(b)};g.Wb=function(a){return this.Xb(a.Hc(),a)};
g.Xb=function(a,b){var c=od(this,b);if(c)return c.Xb(a,function(a){return a});for(var c=this.k.Xb(a.name,qb),d=cd(c);null!=d&&0>b.compare(d,a);)M(c),d=cd(c);return c};g.We=function(a){return this.Zb(a.Fc(),a)};g.Zb=function(a,b){var c=od(this,b);if(c)return c.Zb(a,function(a){return a});for(var c=this.k.Zb(a.name,qb),d=cd(c);null!=d&&0<b.compare(d,a);)M(c),d=cd(c);return c};g.sc=function(a){return this.e()?a.e()?0:-1:a.J()||a.e()?1:a===qc?-1:0};
g.nb=function(a){if(a===tc||Pa(this.yb.cc,a.toString()))return this;var b=this.yb,c=this.k;D(a!==tc,"KeyIndex always exists and isn't meant to be added to the IndexMap.");for(var d=[],e=!1,c=c.Wb(qb),f=M(c);f;)e=e||a.xc(f.R),d.push(f),f=M(c);d=e?zc(d,nc(a)):mc;e=a.toString();c=Ta(b.cc);c[e]=a;a=Ta(b.od);a[e]=d;return new O(this.k,this.aa,new xc(a,c))};g.yc=function(a){return a===tc||Pa(this.yb.cc,a.toString())};
g.Z=function(a){if(a===this)return!0;if(a.J())return!1;if(this.C().Z(a.C())&&this.k.count()===a.k.count()){var b=this.Wb(H);a=a.Wb(H);for(var c=M(b),d=M(a);c&&d;){if(c.name!==d.name||!c.R.Z(d.R))return!1;c=M(b);d=M(a)}return null===c&&null===d}return!1};function od(a,b){return b===tc?null:a.yb.get(b.toString())}g.toString=function(){return x(this.H(!0))};function G(a,b){if(null===a)return L;var c=null;"object"===typeof a&&".priority"in a?c=a[".priority"]:"undefined"!==typeof b&&(c=b);D(null===c||"string"===typeof c||"number"===typeof c||"object"===typeof c&&".sv"in c,"Invalid priority type found: "+typeof c);"object"===typeof a&&".value"in a&&null!==a[".value"]&&(a=a[".value"]);if("object"!==typeof a||".sv"in a)return new Kb(a,G(c));if(a instanceof Array){var d=L,e=a;v(e,function(a,b){if(eb(e,b)&&"."!==b.substring(0,1)){var c=G(a);if(c.J()||!c.e())d=
d.T(b,c)}});return d.fa(G(c))}var f=[],h=!1,k=a;fb(k,function(a){if("string"!==typeof a||"."!==a.substring(0,1)){var b=G(k[a]);b.e()||(h=h||!b.C().e(),f.push(new C(a,b)))}});if(0==f.length)return L;var m=zc(f,rb,function(a){return a.name},tb);if(h){var l=zc(f,nc(H));return new O(m,G(c),new xc({".priority":l},{".priority":H}))}return new O(m,G(c),Bc)}var rd=Math.log(2);
function sd(a){this.count=parseInt(Math.log(a+1)/rd,10);this.Oe=this.count-1;this.Cf=a+1&parseInt(Array(this.count+1).join("1"),2)}function td(a){var b=!(a.Cf&1<<a.Oe);a.Oe--;return b}
function zc(a,b,c,d){function e(b,d){var f=d-b;if(0==f)return null;if(1==f){var l=a[b],u=c?c(l):l;return new dd(u,l.R,!1,null,null)}var l=parseInt(f/2,10)+b,f=e(b,l),z=e(l+1,d),l=a[l],u=c?c(l):l;return new dd(u,l.R,!1,f,z)}a.sort(b);var f=function(b){function d(b,h){var k=u-b,z=u;u-=b;var z=e(k+1,z),k=a[k],F=c?c(k):k,z=new dd(F,k.R,h,null,z);f?f.left=z:l=z;f=z}for(var f=null,l=null,u=a.length,z=0;z<b.count;++z){var F=td(b),fd=Math.pow(2,b.count-(z+1));F?d(fd,!1):(d(fd,!1),d(fd,!0))}return l}(new sd(a.length));
return null!==f?new Zc(d||b,f):new Zc(d||b)}function Fc(a){return"number"===typeof a?"number:"+dc(a):"string:"+a}function Cc(a){if(a.J()){var b=a.H();D("string"===typeof b||"number"===typeof b||"object"===typeof b&&eb(b,".sv"),"Priority must be a string or number.")}else D(a===qc||a.e(),"priority of unexpected type.");D(a===qc||a.C().e(),"Priority nodes can't have a priority of their own.")}var L=new O(new Zc(tb),null,Bc);function ud(){O.call(this,new Zc(tb),L,Bc)}la(ud,O);g=ud.prototype;
g.sc=function(a){return a===this?0:1};g.Z=function(a){return a===this};g.C=function(){return this};g.Q=function(){return L};g.e=function(){return!1};var qc=new ud,oc=new C("[MIN_NAME]",L),vc=new C("[MAX_NAME]",qc);function vd(a,b){this.value=a;this.children=b||wd}var wd=new Zc(function(a,b){return a===b?0:a<b?-1:1});function xd(a){var b=R;v(a,function(a,d){b=b.set(new E(d),a)});return b}g=vd.prototype;g.e=function(){return null===this.value&&this.children.e()};function yd(a,b,c){if(null!=a.value&&c(a.value))return{path:Q,value:a.value};if(b.e())return null;var d=K(b);a=a.children.get(d);return null!==a?(b=yd(a,N(b),c),null!=b?{path:(new E(d)).n(b.path),value:b.value}:null):null}
function zd(a,b){return yd(a,b,function(){return!0})}g.subtree=function(a){if(a.e())return this;var b=this.children.get(K(a));return null!==b?b.subtree(N(a)):R};g.set=function(a,b){if(a.e())return new vd(b,this.children);var c=K(a),d=(this.children.get(c)||R).set(N(a),b),c=this.children.Oa(c,d);return new vd(this.value,c)};
g.remove=function(a){if(a.e())return this.children.e()?R:new vd(null,this.children);var b=K(a),c=this.children.get(b);return c?(a=c.remove(N(a)),b=a.e()?this.children.remove(b):this.children.Oa(b,a),null===this.value&&b.e()?R:new vd(this.value,b)):this};g.get=function(a){if(a.e())return this.value;var b=this.children.get(K(a));return b?b.get(N(a)):null};
function Ad(a,b,c){if(b.e())return c;var d=K(b);b=Ad(a.children.get(d)||R,N(b),c);d=b.e()?a.children.remove(d):a.children.Oa(d,b);return new vd(a.value,d)}function Bd(a,b){return Cd(a,Q,b)}function Cd(a,b,c){var d={};a.children.ha(function(a,f){d[a]=Cd(f,b.n(a),c)});return c(b,a.value,d)}function Dd(a,b,c){return Ed(a,b,Q,c)}function Ed(a,b,c,d){var e=a.value?d(c,a.value):!1;if(e)return e;if(b.e())return null;e=K(b);return(a=a.children.get(e))?Ed(a,N(b),c.n(e),d):null}
function Fd(a,b,c){Gd(a,b,Q,c)}function Gd(a,b,c,d){if(b.e())return a;a.value&&d(c,a.value);var e=K(b);return(a=a.children.get(e))?Gd(a,N(b),c.n(e),d):R}function Hd(a,b){Id(a,Q,b)}function Id(a,b,c){a.children.ha(function(a,e){Id(e,b.n(a),c)});a.value&&c(b,a.value)}function Jd(a,b){a.children.ha(function(a,d){d.value&&b(a,d.value)})}var R=new vd(null);vd.prototype.toString=function(){var a={};Hd(this,function(b,c){a[b.toString()]=c.toString()});return x(a)};var Kd=/[\[\].#$\/\u0000-\u001F\u007F]/,Ld=/[\[\].#$\u0000-\u001F\u007F]/;function Md(a){return p(a)&&0!==a.length&&!Kd.test(a)}function Nd(a){return null===a||p(a)||ga(a)&&!Xb(a)||ia(a)&&eb(a,".sv")}function Od(a,b,c,d){d&&!n(b)||Pd(A(a,1,d),b,c)}
function Pd(a,b,c){c instanceof E&&(c=new Pc(c,a));if(!n(b))throw Error(a+"contains undefined "+Rc(c));if(ha(b))throw Error(a+"contains a function "+Rc(c)+" with contents: "+b.toString());if(Xb(b))throw Error(a+"contains "+b.toString()+" "+Rc(c));if(p(b)&&b.length>10485760/3&&10485760<nb(b))throw Error(a+"contains a string greater than 10485760 utf8 bytes "+Rc(c)+" ('"+b.substring(0,50)+"...')");if(ia(b)){var d=!1,e=!1;fb(b,function(b,h){if(".value"===b)d=!0;else if(".priority"!==b&&".sv"!==b&&(e=
!0,!Md(b)))throw Error(a+" contains an invalid key ("+b+") "+Rc(c)+'.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');c.push(b);Pd(a,h,c);c.pop()});if(d&&e)throw Error(a+' contains ".value" child '+Rc(c)+" in addition to actual children.");}}
function Qd(a,b){var c,d;for(c=0;c<b.length;c++){d=b[c];for(var e=d.slice(),f=0;f<e.length;f++)if((".priority"!==e[f]||f!==e.length-1)&&!Md(e[f]))throw Error(a+"contains an invalid key ("+e[f]+") in path "+d.toString()+'. Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');}b.sort(Nc);e=null;for(c=0;c<b.length;c++){d=b[c];if(null!==e&&e.contains(d))throw Error(a+"contains a path "+e.toString()+" that is ancestor of another path "+d.toString());e=d}}
function Rd(a,b,c){var d=A(a,1,!1);if(!ia(b)||ea(b))throw Error(d+" must be an object containing the children to replace.");var e=[];fb(b,function(a,b){var k=new E(a);Pd(d,b,c.n(k));if(".priority"===Oc(k)&&!Nd(b))throw Error(d+"contains an invalid value for '"+k.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");e.push(k)});Qd(d,e)}
function Sd(a,b,c){if(Xb(c))throw Error(A(a,b,!1)+"is "+c.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!Nd(c))throw Error(A(a,b,!1)+"must be a valid Firebase priority (a string, finite number, server value, or null).");}
function Td(a,b,c){if(!c||n(b))switch(b){case "value":case "child_added":case "child_removed":case "child_changed":case "child_moved":break;default:throw Error(A(a,1,c)+'must be a valid event type: "value", "child_added", "child_removed", "child_changed", or "child_moved".');}}function Ud(a,b){if(n(b)&&!Md(b))throw Error(A(a,2,!0)+'was an invalid key: "'+b+'".  Firebase keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]").');}
function Vd(a,b){if(!p(b)||0===b.length||Ld.test(b))throw Error(A(a,1,!1)+'was an invalid path: "'+b+'". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"');}function Wd(a,b){if(".info"===K(b))throw Error(a+" failed: Can't modify data under /.info/");}
function Xd(a,b){var c=b.path.toString(),d;!(d=!p(b.jc.host)||0===b.jc.host.length||!Md(b.jc.pe))&&(d=0!==c.length)&&(c&&(c=c.replace(/^\/*\.info(\/|$)/,"/")),d=!(p(c)&&0!==c.length&&!Ld.test(c)));if(d)throw Error(A(a,1,!1)+'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".');};function Gb(){this.k=this.B=null}Gb.prototype.find=function(a){if(null!=this.B)return this.B.P(a);if(a.e()||null==this.k)return null;var b=K(a);a=N(a);return this.k.contains(b)?this.k.get(b).find(a):null};function Ib(a,b,c){if(b.e())a.B=c,a.k=null;else if(null!==a.B)a.B=a.B.F(b,c);else{null==a.k&&(a.k=new Gc);var d=K(b);a.k.contains(d)||a.k.add(d,new Gb);a=a.k.get(d);b=N(b);Ib(a,b,c)}}
function Yd(a,b){if(b.e())return a.B=null,a.k=null,!0;if(null!==a.B){if(a.B.J())return!1;var c=a.B;a.B=null;c.O(H,function(b,c){Ib(a,new E(b),c)});return Yd(a,b)}return null!==a.k?(c=K(b),b=N(b),a.k.contains(c)&&Yd(a.k.get(c),b)&&a.k.remove(c),a.k.e()?(a.k=null,!0):!1):!0}function Hb(a,b,c){null!==a.B?c(b,a.B):a.O(function(a,e){var f=new E(b.toString()+"/"+a);Hb(e,f,c)})}Gb.prototype.O=function(a){null!==this.k&&Hc(this.k,function(b,c){a(b,c)})};function Zd(a,b){this.type=$d;this.source=a;this.path=b}Zd.prototype.Mc=function(){return this.path.e()?new Zd(this.source,Q):new Zd(this.source,N(this.path))};Zd.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" listen_complete)"};function ae(a,b,c){this.type=be;this.source=a;this.path=b;this.children=c}ae.prototype.Mc=function(a){if(this.path.e())return a=this.children.subtree(new E(a)),a.e()?null:a.value?new ce(this.source,Q,a.value):new ae(this.source,Q,a);D(K(this.path)===a,"Can't get a merge for a child not on the path of the operation");return new ae(this.source,N(this.path),this.children)};ae.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"};function de(a,b,c){this.type=ee;this.source=fe;this.path=a;this.Ob=b;this.Id=c}de.prototype.Mc=function(a){if(this.path.e()){if(null!=this.Ob.value)return D(this.Ob.children.e(),"affectedTree should not have overlapping affected paths."),this;a=this.Ob.subtree(new E(a));return new de(Q,a,this.Id)}D(K(this.path)===a,"operationForChild called for unrelated child.");return new de(N(this.path),this.Ob,this.Id)};
de.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" ack write revert="+this.Id+" affectedTree="+this.Ob+")"};function ce(a,b,c){this.type=ge;this.source=a;this.path=b;this.Ga=c}ce.prototype.Mc=function(a){return this.path.e()?new ce(this.source,Q,this.Ga.Q(a)):new ce(this.source,N(this.path),this.Ga)};ce.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" overwrite: "+this.Ga.toString()+")"};var ge=0,be=1,ee=2,$d=3;function he(a,b,c,d){this.ee=a;this.Se=b;this.Hb=c;this.Ee=d;D(!d||b,"Tagged queries must be from server.")}var fe=new he(!0,!1,null,!1),ie=new he(!1,!0,null,!1);he.prototype.toString=function(){return this.ee?"user":this.Ee?"server(queryID="+this.Hb+")":"server"};function je(a,b,c){this.A=a;this.da=b;this.Sb=c}function ke(a){return a.da}function le(a){return a.Sb}function me(a,b){return b.e()?a.da&&!a.Sb:ne(a,K(b))}function ne(a,b){return a.da&&!a.Sb||a.A.Da(b)}je.prototype.j=function(){return this.A};function oe(a,b){this.N=a;this.Ld=b}function pe(a,b,c,d){return new oe(new je(b,c,d),a.Ld)}function qe(a){return a.N.da?a.N.j():null}oe.prototype.w=function(){return this.Ld};function re(a){return a.Ld.da?a.Ld.j():null};function se(){}se.prototype.Te=function(){return null};se.prototype.fe=function(){return null};var te=new se;function ue(a,b,c){this.xf=a;this.Ka=b;this.yd=c}ue.prototype.Te=function(a){var b=this.Ka.N;if(ne(b,a))return b.j().Q(a);b=null!=this.yd?new je(this.yd,!0,!1):this.Ka.w();return this.xf.qc(a,b)};ue.prototype.fe=function(a,b,c){var d=null!=this.yd?this.yd:re(this.Ka);a=this.xf.Xd(d,b,1,c,a);return 0===a.length?null:a[0]};function ve(a,b){this.Sd=a;this.Df=b}function we(a){this.U=a}
we.prototype.eb=function(a,b,c,d){var e=new xe,f;if(b.type===ge)b.source.ee?c=ye(this,a,b.path,b.Ga,c,d,e):(D(b.source.Se,"Unknown source."),f=b.source.Ee||le(a.w())&&!b.path.e(),c=ze(this,a,b.path,b.Ga,c,d,f,e));else if(b.type===be)b.source.ee?c=Ae(this,a,b.path,b.children,c,d,e):(D(b.source.Se,"Unknown source."),f=b.source.Ee||le(a.w()),c=Be(this,a,b.path,b.children,c,d,f,e));else if(b.type===ee)if(b.Id)if(b=b.path,null!=c.lc(b))c=a;else{f=new ue(c,a,d);d=a.N.j();if(b.e()||".priority"===K(b))ke(a.w())?
b=c.Aa(re(a)):(b=a.w().j(),D(b instanceof O,"serverChildren would be complete if leaf node"),b=c.rc(b)),b=this.U.ya(d,b,e);else{var h=K(b),k=c.qc(h,a.w());null==k&&ne(a.w(),h)&&(k=d.Q(h));b=null!=k?this.U.F(d,h,k,N(b),f,e):a.N.j().Da(h)?this.U.F(d,h,L,N(b),f,e):d;b.e()&&ke(a.w())&&(d=c.Aa(re(a)),d.J()&&(b=this.U.ya(b,d,e)))}d=ke(a.w())||null!=c.lc(Q);c=pe(a,b,d,this.U.Na())}else c=Ce(this,a,b.path,b.Ob,c,d,e);else if(b.type===$d)d=b.path,b=a.w(),f=b.j(),h=b.da||d.e(),c=De(this,new oe(a.N,new je(f,
h,b.Sb)),d,c,te,e);else throw Mb("Unknown operation type: "+b.type);e=Na(e.fb);d=c;b=d.N;b.da&&(f=b.j().J()||b.j().e(),h=qe(a),(0<e.length||!a.N.da||f&&!b.j().Z(h)||!b.j().C().Z(h.C()))&&e.push(Ee(qe(d))));return new ve(c,e)};
function De(a,b,c,d,e,f){var h=b.N;if(null!=d.lc(c))return b;var k;if(c.e())D(ke(b.w()),"If change path is empty, we must have complete server data"),le(b.w())?(e=re(b),d=d.rc(e instanceof O?e:L)):d=d.Aa(re(b)),f=a.U.ya(b.N.j(),d,f);else{var m=K(c);if(".priority"==m)D(1==Ec(c),"Can't have a priority with additional path components"),f=h.j(),k=b.w().j(),d=d.ad(c,f,k),f=null!=d?a.U.fa(f,d):h.j();else{var l=N(c);ne(h,m)?(k=b.w().j(),d=d.ad(c,h.j(),k),d=null!=d?h.j().Q(m).F(l,d):h.j().Q(m)):d=d.qc(m,
b.w());f=null!=d?a.U.F(h.j(),m,d,l,e,f):h.j()}}return pe(b,f,h.da||c.e(),a.U.Na())}function ze(a,b,c,d,e,f,h,k){var m=b.w();h=h?a.U:a.U.Ub();if(c.e())d=h.ya(m.j(),d,null);else if(h.Na()&&!m.Sb)d=m.j().F(c,d),d=h.ya(m.j(),d,null);else{var l=K(c);if(!me(m,c)&&1<Ec(c))return b;var u=N(c);d=m.j().Q(l).F(u,d);d=".priority"==l?h.fa(m.j(),d):h.F(m.j(),l,d,u,te,null)}m=m.da||c.e();b=new oe(b.N,new je(d,m,h.Na()));return De(a,b,c,e,new ue(e,b,f),k)}
function ye(a,b,c,d,e,f,h){var k=b.N;e=new ue(e,b,f);if(c.e())h=a.U.ya(b.N.j(),d,h),a=pe(b,h,!0,a.U.Na());else if(f=K(c),".priority"===f)h=a.U.fa(b.N.j(),d),a=pe(b,h,k.da,k.Sb);else{c=N(c);var m=k.j().Q(f);if(!c.e()){var l=e.Te(f);d=null!=l?".priority"===Oc(c)&&l.P(c.parent()).e()?l:l.F(c,d):L}m.Z(d)?a=b:(h=a.U.F(k.j(),f,d,c,e,h),a=pe(b,h,k.da,a.U.Na()))}return a}
function Ae(a,b,c,d,e,f,h){var k=b;Hd(d,function(d,l){var u=c.n(d);ne(b.N,K(u))&&(k=ye(a,k,u,l,e,f,h))});Hd(d,function(d,l){var u=c.n(d);ne(b.N,K(u))||(k=ye(a,k,u,l,e,f,h))});return k}function Fe(a,b){Hd(b,function(b,d){a=a.F(b,d)});return a}
function Be(a,b,c,d,e,f,h,k){if(b.w().j().e()&&!ke(b.w()))return b;var m=b;c=c.e()?d:Ad(R,c,d);var l=b.w().j();c.children.ha(function(c,d){if(l.Da(c)){var F=b.w().j().Q(c),F=Fe(F,d);m=ze(a,m,new E(c),F,e,f,h,k)}});c.children.ha(function(c,d){var F=!ne(b.w(),c)&&null==d.value;l.Da(c)||F||(F=b.w().j().Q(c),F=Fe(F,d),m=ze(a,m,new E(c),F,e,f,h,k))});return m}
function Ce(a,b,c,d,e,f,h){if(null!=e.lc(c))return b;var k=le(b.w()),m=b.w();if(null!=d.value){if(c.e()&&m.da||me(m,c))return ze(a,b,c,m.j().P(c),e,f,k,h);if(c.e()){var l=R;m.j().O(tc,function(a,b){l=l.set(new E(a),b)});return Be(a,b,c,l,e,f,k,h)}return b}l=R;Hd(d,function(a){var b=c.n(a);me(m,b)&&(l=l.set(a,m.j().P(b)))});return Be(a,b,c,l,e,f,k,h)};function Ge(a){this.V=a;this.g=a.m.g}function He(a,b,c,d){var e=[],f=[];ya(b,function(b){b.type===Ie&&a.g.nd(b.qe,b.Ja)&&f.push(new S(Je,b.Ja,b.Xa))});Ke(a,e,Le,b,d,c);Ke(a,e,Me,b,d,c);Ke(a,e,Je,f,d,c);Ke(a,e,Ie,b,d,c);Ke(a,e,Ne,b,d,c);return e}function Ke(a,b,c,d,e,f){d=za(d,function(a){return a.type===c});Ha(d,q(a.Ff,a));ya(d,function(c){var d=Oe(a,c,f);ya(e,function(e){e.nf(c.type)&&b.push(e.createEvent(d,a.V))})})}
function Oe(a,b,c){"value"!==b.type&&"child_removed"!==b.type&&(b.Dd=c.Ve(b.Xa,b.Ja,a.g));return b}Ge.prototype.Ff=function(a,b){if(null==a.Xa||null==b.Xa)throw Mb("Should only compare child_ events.");return this.g.compare(new C(a.Xa,a.Ja),new C(b.Xa,b.Ja))};function Pe(a,b){this.V=a;var c=a.m,d=new Qe(c.g),c=T(c)?new Qe(c.g):c.xa?new Re(c):new Se(c);this.hf=new we(c);var e=b.w(),f=b.N,h=d.ya(L,e.j(),null),k=c.ya(L,f.j(),null);this.Ka=new oe(new je(k,f.da,c.Na()),new je(h,e.da,d.Na()));this.Za=[];this.Jf=new Ge(a)}function Te(a){return a.V}g=Pe.prototype;g.w=function(){return this.Ka.w().j()};g.hb=function(a){var b=re(this.Ka);return b&&(T(this.V.m)||!a.e()&&!b.Q(K(a)).e())?b.P(a):null};g.e=function(){return 0===this.Za.length};g.Nb=function(a){this.Za.push(a)};
g.kb=function(a,b){var c=[];if(b){D(null==a,"A cancel should cancel all event registrations.");var d=this.V.path;ya(this.Za,function(a){(a=a.Me(b,d))&&c.push(a)})}if(a){for(var e=[],f=0;f<this.Za.length;++f){var h=this.Za[f];if(!h.matches(a))e.push(h);else if(a.Xe()){e=e.concat(this.Za.slice(f+1));break}}this.Za=e}else this.Za=[];return c};
g.eb=function(a,b,c){a.type===be&&null!==a.source.Hb&&(D(re(this.Ka),"We should always have a full cache before handling merges"),D(qe(this.Ka),"Missing event cache, even though we have a server cache"));var d=this.Ka;a=this.hf.eb(d,a,b,c);b=this.hf;c=a.Sd;D(c.N.j().yc(b.U.g),"Event snap not indexed");D(c.w().j().yc(b.U.g),"Server snap not indexed");D(ke(a.Sd.w())||!ke(d.w()),"Once a server snap is complete, it should never go back");this.Ka=a.Sd;return Ue(this,a.Df,a.Sd.N.j(),null)};
function Ve(a,b){var c=a.Ka.N,d=[];c.j().J()||c.j().O(H,function(a,b){d.push(new S(Me,b,a))});c.da&&d.push(Ee(c.j()));return Ue(a,d,c.j(),b)}function Ue(a,b,c,d){return He(a.Jf,b,c,d?[d]:a.Za)};function We(a,b,c,d){this.ae=b;this.Md=c;this.Dd=d;this.hd=a}We.prototype.Yb=function(){var a=this.Md.wb();return"value"===this.hd?a.path:a.getParent().path};We.prototype.ge=function(){return this.hd};We.prototype.Tb=function(){return this.ae.Tb(this)};We.prototype.toString=function(){return this.Yb().toString()+":"+this.hd+":"+x(this.Md.be())};function Xe(a,b,c){this.ae=a;this.error=b;this.path=c}Xe.prototype.Yb=function(){return this.path};Xe.prototype.ge=function(){return"cancel"};
Xe.prototype.Tb=function(){return this.ae.Tb(this)};Xe.prototype.toString=function(){return this.path.toString()+":cancel"};function Ye(){this.vb=[]}function Ze(a,b){for(var c=null,d=0;d<b.length;d++){var e=b[d],f=e.Yb();null===c||f.Z(c.Yb())||(a.vb.push(c),c=null);null===c&&(c=new $e(f));c.add(e)}c&&a.vb.push(c)}function af(a,b,c){Ze(a,c);bf(a,function(a){return a.Z(b)})}function cf(a,b,c){Ze(a,c);bf(a,function(a){return a.contains(b)||b.contains(a)})}
function bf(a,b){for(var c=!0,d=0;d<a.vb.length;d++){var e=a.vb[d];if(e)if(e=e.Yb(),b(e)){for(var e=a.vb[d],f=0;f<e.jd.length;f++){var h=e.jd[f];if(null!==h){e.jd[f]=null;var k=h.Tb();Qb&&I("event: "+h.toString());fc(k)}}a.vb[d]=null}else c=!1}c&&(a.vb=[])}function $e(a){this.qa=a;this.jd=[]}$e.prototype.add=function(a){this.jd.push(a)};$e.prototype.Yb=function(){return this.qa};function Qe(a){this.g=a}g=Qe.prototype;g.F=function(a,b,c,d,e,f){D(a.yc(this.g),"A node must be indexed if only a child is updated");e=a.Q(b);if(e.P(d).Z(c.P(d))&&e.e()==c.e())return a;null!=f&&(c.e()?a.Da(b)?df(f,new S(Le,e,b)):D(a.J(),"A child remove without an old child only makes sense on a leaf node"):e.e()?df(f,new S(Me,c,b)):df(f,new S(Ie,c,b,e)));return a.J()&&c.e()?a:a.T(b,c).nb(this.g)};
g.ya=function(a,b,c){null!=c&&(a.J()||a.O(H,function(a,e){b.Da(a)||df(c,new S(Le,e,a))}),b.J()||b.O(H,function(b,e){if(a.Da(b)){var f=a.Q(b);f.Z(e)||df(c,new S(Ie,e,b,f))}else df(c,new S(Me,e,b))}));return b.nb(this.g)};g.fa=function(a,b){return a.e()?L:a.fa(b)};g.Na=function(){return!1};g.Ub=function(){return this};function Se(a){this.he=new Qe(a.g);this.g=a.g;var b;a.ka?(b=ef(a),b=a.g.Ec(ff(a),b)):b=a.g.Hc();this.Uc=b;a.na?(b=gf(a),a=a.g.Ec(hf(a),b)):a=a.g.Fc();this.vc=a}g=Se.prototype;g.matches=function(a){return 0>=this.g.compare(this.Uc,a)&&0>=this.g.compare(a,this.vc)};g.F=function(a,b,c,d,e,f){this.matches(new C(b,c))||(c=L);return this.he.F(a,b,c,d,e,f)};
g.ya=function(a,b,c){b.J()&&(b=L);var d=b.nb(this.g),d=d.fa(L),e=this;b.O(H,function(a,b){e.matches(new C(a,b))||(d=d.T(a,L))});return this.he.ya(a,d,c)};g.fa=function(a){return a};g.Na=function(){return!0};g.Ub=function(){return this.he};function Re(a){this.sa=new Se(a);this.g=a.g;D(a.xa,"Only valid if limit has been set");this.oa=a.oa;this.Ib=!jf(a)}g=Re.prototype;g.F=function(a,b,c,d,e,f){this.sa.matches(new C(b,c))||(c=L);return a.Q(b).Z(c)?a:a.Eb()<this.oa?this.sa.Ub().F(a,b,c,d,e,f):kf(this,a,b,c,e,f)};
g.ya=function(a,b,c){var d;if(b.J()||b.e())d=L.nb(this.g);else if(2*this.oa<b.Eb()&&b.yc(this.g)){d=L.nb(this.g);b=this.Ib?b.Zb(this.sa.vc,this.g):b.Xb(this.sa.Uc,this.g);for(var e=0;0<b.Pa.length&&e<this.oa;){var f=M(b),h;if(h=this.Ib?0>=this.g.compare(this.sa.Uc,f):0>=this.g.compare(f,this.sa.vc))d=d.T(f.name,f.R),e++;else break}}else{d=b.nb(this.g);d=d.fa(L);var k,m,l;if(this.Ib){b=d.We(this.g);k=this.sa.vc;m=this.sa.Uc;var u=nc(this.g);l=function(a,b){return u(b,a)}}else b=d.Wb(this.g),k=this.sa.Uc,
m=this.sa.vc,l=nc(this.g);for(var e=0,z=!1;0<b.Pa.length;)f=M(b),!z&&0>=l(k,f)&&(z=!0),(h=z&&e<this.oa&&0>=l(f,m))?e++:d=d.T(f.name,L)}return this.sa.Ub().ya(a,d,c)};g.fa=function(a){return a};g.Na=function(){return!0};g.Ub=function(){return this.sa.Ub()};
function kf(a,b,c,d,e,f){var h;if(a.Ib){var k=nc(a.g);h=function(a,b){return k(b,a)}}else h=nc(a.g);D(b.Eb()==a.oa,"");var m=new C(c,d),l=a.Ib?pd(b,a.g):qd(b,a.g),u=a.sa.matches(m);if(b.Da(c)){for(var z=b.Q(c),l=e.fe(a.g,l,a.Ib);null!=l&&(l.name==c||b.Da(l.name));)l=e.fe(a.g,l,a.Ib);e=null==l?1:h(l,m);if(u&&!d.e()&&0<=e)return null!=f&&df(f,new S(Ie,d,c,z)),b.T(c,d);null!=f&&df(f,new S(Le,z,c));b=b.T(c,L);return null!=l&&a.sa.matches(l)?(null!=f&&df(f,new S(Me,l.R,l.name)),b.T(l.name,l.R)):b}return d.e()?
b:u&&0<=h(l,m)?(null!=f&&(df(f,new S(Le,l.R,l.name)),df(f,new S(Me,d,c))),b.T(c,d).T(l.name,L)):b};function S(a,b,c,d){this.type=a;this.Ja=b;this.Xa=c;this.qe=d;this.Dd=void 0}function Ee(a){return new S(Ne,a)}var Me="child_added",Le="child_removed",Ie="child_changed",Je="child_moved",Ne="value";function xe(){this.fb={}}
function df(a,b){var c=b.type,d=b.Xa;D(c==Me||c==Ie||c==Le,"Only child changes supported for tracking");D(".priority"!==d,"Only non-priority child changes can be tracked.");var e=w(a.fb,d);if(e){var f=e.type;if(c==Me&&f==Le)a.fb[d]=new S(Ie,b.Ja,d,e.Ja);else if(c==Le&&f==Me)delete a.fb[d];else if(c==Le&&f==Ie)a.fb[d]=new S(Le,e.qe,d);else if(c==Ie&&f==Me)a.fb[d]=new S(Me,b.Ja,d);else if(c==Ie&&f==Ie)a.fb[d]=new S(Ie,b.Ja,d,e.qe);else throw Mb("Illegal combination of changes: "+b+" occurred after "+
e);}else a.fb[d]=b};function lf(){this.Rb=this.na=this.Kb=this.ka=this.xa=!1;this.oa=0;this.mb="";this.dc=null;this.zb="";this.ac=null;this.xb="";this.g=H}var mf=new lf;function jf(a){return""===a.mb?a.ka:"l"===a.mb}function ff(a){D(a.ka,"Only valid if start has been set");return a.dc}function ef(a){D(a.ka,"Only valid if start has been set");return a.Kb?a.zb:"[MIN_NAME]"}function hf(a){D(a.na,"Only valid if end has been set");return a.ac}
function gf(a){D(a.na,"Only valid if end has been set");return a.Rb?a.xb:"[MAX_NAME]"}function nf(a){var b=new lf;b.xa=a.xa;b.oa=a.oa;b.ka=a.ka;b.dc=a.dc;b.Kb=a.Kb;b.zb=a.zb;b.na=a.na;b.ac=a.ac;b.Rb=a.Rb;b.xb=a.xb;b.g=a.g;b.mb=a.mb;return b}g=lf.prototype;g.ne=function(a){var b=nf(this);b.xa=!0;b.oa=a;b.mb="l";return b};g.oe=function(a){var b=nf(this);b.xa=!0;b.oa=a;b.mb="r";return b};g.Nd=function(a,b){var c=nf(this);c.ka=!0;n(a)||(a=null);c.dc=a;null!=b?(c.Kb=!0,c.zb=b):(c.Kb=!1,c.zb="");return c};
g.gd=function(a,b){var c=nf(this);c.na=!0;n(a)||(a=null);c.ac=a;n(b)?(c.Rb=!0,c.xb=b):(c.vg=!1,c.xb="");return c};function of(a,b){var c=nf(a);c.g=b;return c}function pf(a){var b={};a.ka&&(b.sp=a.dc,a.Kb&&(b.sn=a.zb));a.na&&(b.ep=a.ac,a.Rb&&(b.en=a.xb));if(a.xa){b.l=a.oa;var c=a.mb;""===c&&(c=jf(a)?"l":"r");b.vf=c}a.g!==H&&(b.i=a.g.toString());return b}function T(a){return!(a.ka||a.na||a.xa)}function qf(a){return T(a)&&a.g==H}
function rf(a){var b={};if(qf(a))return b;var c;a.g===H?c="$priority":a.g===wc?c="$value":a.g===tc?c="$key":(D(a.g instanceof pc,"Unrecognized index type!"),c=a.g.toString());b.orderBy=x(c);a.ka&&(b.startAt=x(a.dc),a.Kb&&(b.startAt+=","+x(a.zb)));a.na&&(b.endAt=x(a.ac),a.Rb&&(b.endAt+=","+x(a.xb)));a.xa&&(jf(a)?b.limitToFirst=a.oa:b.limitToLast=a.oa);return b}g.toString=function(){return x(pf(this))};function sf(a){this.W=a}var tf=new sf(new vd(null));function uf(a,b,c){if(b.e())return new sf(new vd(c));var d=zd(a.W,b);if(null!=d){var e=d.path,d=d.value;b=P(e,b);d=d.F(b,c);return new sf(a.W.set(e,d))}a=Ad(a.W,b,new vd(c));return new sf(a)}function vf(a,b,c){var d=a;fb(c,function(a,c){d=uf(d,b.n(a),c)});return d}sf.prototype.Ed=function(a){if(a.e())return tf;a=Ad(this.W,a,R);return new sf(a)};function wf(a,b){var c=zd(a.W,b);return null!=c?a.W.get(c.path).P(P(c.path,b)):null}
function xf(a){var b=[],c=a.W.value;null!=c?c.J()||c.O(H,function(a,c){b.push(new C(a,c))}):a.W.children.ha(function(a,c){null!=c.value&&b.push(new C(a,c.value))});return b}function yf(a,b){if(b.e())return a;var c=wf(a,b);return null!=c?new sf(new vd(c)):new sf(a.W.subtree(b))}sf.prototype.e=function(){return this.W.e()};sf.prototype.apply=function(a){return zf(Q,this.W,a)};
function zf(a,b,c){if(null!=b.value)return c.F(a,b.value);var d=null;b.children.ha(function(b,f){".priority"===b?(D(null!==f.value,"Priority writes must always be leaf nodes"),d=f.value):c=zf(a.n(b),f,c)});c.P(a).e()||null===d||(c=c.F(a.n(".priority"),d));return c};function Af(){this.Jd=L}Af.prototype.j=function(a){return this.Jd.P(a)};Af.prototype.toString=function(){return this.Jd.toString()};function Bf(a){this.oc=a}Bf.prototype.getToken=function(a){return this.oc.INTERNAL.getToken(a).then(null,function(a){return a&&"auth/token-not-initialized"===a.code?(I("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(a)})};function Cf(a,b){a.oc.INTERNAL.addAuthTokenListener(b)};function Df(){this.S=tf;this.la=[];this.Bc=-1}function Ef(a,b){for(var c=0;c<a.la.length;c++){var d=a.la[c];if(d.Zc===b)return d}return null}g=Df.prototype;
g.Ed=function(a){var b=Ea(this.la,function(b){return b.Zc===a});D(0<=b,"removeWrite called with nonexistent writeId.");var c=this.la[b];this.la.splice(b,1);for(var d=c.visible,e=!1,f=this.la.length-1;d&&0<=f;){var h=this.la[f];h.visible&&(f>=b&&Ff(h,c.path)?d=!1:c.path.contains(h.path)&&(e=!0));f--}if(d){if(e)this.S=Gf(this.la,Hf,Q),this.Bc=0<this.la.length?this.la[this.la.length-1].Zc:-1;else if(c.Ga)this.S=this.S.Ed(c.path);else{var k=this;v(c.children,function(a,b){k.S=k.S.Ed(c.path.n(b))})}return!0}return!1};
g.Aa=function(a,b,c,d){if(c||d){var e=yf(this.S,a);return!d&&e.e()?b:d||null!=b||null!=wf(e,Q)?(e=Gf(this.la,function(b){return(b.visible||d)&&(!c||!(0<=xa(c,b.Zc)))&&(b.path.contains(a)||a.contains(b.path))},a),b=b||L,e.apply(b)):null}e=wf(this.S,a);if(null!=e)return e;e=yf(this.S,a);return e.e()?b:null!=b||null!=wf(e,Q)?(b=b||L,e.apply(b)):null};
g.rc=function(a,b){var c=L,d=wf(this.S,a);if(d)d.J()||d.O(H,function(a,b){c=c.T(a,b)});else if(b){var e=yf(this.S,a);b.O(H,function(a,b){var d=yf(e,new E(a)).apply(b);c=c.T(a,d)});ya(xf(e),function(a){c=c.T(a.name,a.R)})}else e=yf(this.S,a),ya(xf(e),function(a){c=c.T(a.name,a.R)});return c};g.ad=function(a,b,c,d){D(c||d,"Either existingEventSnap or existingServerSnap must exist");a=a.n(b);if(null!=wf(this.S,a))return null;a=yf(this.S,a);return a.e()?d.P(b):a.apply(d.P(b))};
g.qc=function(a,b,c){a=a.n(b);var d=wf(this.S,a);return null!=d?d:ne(c,b)?yf(this.S,a).apply(c.j().Q(b)):null};g.lc=function(a){return wf(this.S,a)};g.Xd=function(a,b,c,d,e,f){var h;a=yf(this.S,a);h=wf(a,Q);if(null==h)if(null!=b)h=a.apply(b);else return[];h=h.nb(f);if(h.e()||h.J())return[];b=[];a=nc(f);e=e?h.Zb(c,f):h.Xb(c,f);for(f=M(e);f&&b.length<d;)0!==a(f,c)&&b.push(f),f=M(e);return b};
function Ff(a,b){return a.Ga?a.path.contains(b):!!Qa(a.children,function(c,d){return a.path.n(d).contains(b)})}function Hf(a){return a.visible}
function Gf(a,b,c){for(var d=tf,e=0;e<a.length;++e){var f=a[e];if(b(f)){var h=f.path;if(f.Ga)c.contains(h)?(h=P(c,h),d=uf(d,h,f.Ga)):h.contains(c)&&(h=P(h,c),d=uf(d,Q,f.Ga.P(h)));else if(f.children)if(c.contains(h))h=P(c,h),d=vf(d,h,f.children);else{if(h.contains(c))if(h=P(h,c),h.e())d=vf(d,Q,f.children);else if(f=w(f.children,K(h)))f=f.P(N(h)),d=uf(d,Q,f)}else throw Mb("WriteRecord should have .snap or .children");}}return d}function If(a,b){this.Lb=a;this.W=b}g=If.prototype;
g.Aa=function(a,b,c){return this.W.Aa(this.Lb,a,b,c)};g.rc=function(a){return this.W.rc(this.Lb,a)};g.ad=function(a,b,c){return this.W.ad(this.Lb,a,b,c)};g.lc=function(a){return this.W.lc(this.Lb.n(a))};g.Xd=function(a,b,c,d,e){return this.W.Xd(this.Lb,a,b,c,d,e)};g.qc=function(a,b){return this.W.qc(this.Lb,a,b)};g.n=function(a){return new If(this.Lb.n(a),this.W)};function Jf(a,b){this.rf={};this.Vc=new Kf(a);this.va=b;var c=1E4+2E4*Math.random();hc(q(this.lf,this),Math.floor(c))}Jf.prototype.lf=function(){var a=this.Vc.get(),b={},c=!1,d;for(d in a)0<a[d]&&eb(this.rf,d)&&(b[d]=a[d],c=!0);c&&this.va.ye(b);hc(q(this.lf,this),Math.floor(6E5*Math.random()))};function Lf(){this.tc={}}function Mf(a,b,c){n(c)||(c=1);eb(a.tc,b)||(a.tc[b]=0);a.tc[b]+=c}Lf.prototype.get=function(){return Ta(this.tc)};function Kf(a){this.Ef=a;this.rd=null}Kf.prototype.get=function(){var a=this.Ef.get(),b=Ta(a);if(this.rd)for(var c in this.rd)b[c]-=this.rd[c];this.rd=a;return b};var Nf={},Of={};function Pf(a){a=a.toString();Nf[a]||(Nf[a]=new Lf);return Nf[a]}function Qf(a,b){var c=a.toString();Of[c]||(Of[c]=b());return Of[c]};function Rf(a,b,c){this.f=Tb("p:rest:");this.L=a;this.Gb=b;this.$c=c;this.$={}}function Sf(a,b){if(n(b))return"tag$"+b;D(qf(a.m),"should have a tag if it's not a default query.");return a.path.toString()}g=Rf.prototype;
g.$e=function(a,b,c,d){var e=a.path.toString();this.f("Listen called for "+e+" "+a.ja());var f=Sf(a,c),h={};this.$[f]=h;a=rf(a.m);var k=this;Tf(this,e+".json",a,function(a,b){var u=b;404===a&&(a=u=null);null===a&&k.Gb(e,u,!1,c);w(k.$,f)===h&&d(a?401==a?"permission_denied":"rest_error:"+a:"ok",null)})};g.uf=function(a,b){var c=Sf(a,b);delete this.$[c]};g.kf=function(){};g.re=function(){};g.cf=function(){};g.xd=function(){};g.put=function(){};g.af=function(){};g.ye=function(){};
function Tf(a,b,c,d){c=c||{};c.format="export";a.$c.getToken(!1).then(function(e){(e=e&&e.accessToken)&&(c.auth=e);var f=(a.L.Sc?"https://":"http://")+a.L.host+b+"?"+gb(c);a.f("Sending REST request for "+f);var h=new XMLHttpRequest;h.onreadystatechange=function(){if(d&&4===h.readyState){a.f("REST Response for "+f+" received. status:",h.status,"response:",h.responseText);var b=null;if(200<=h.status&&300>h.status){try{b=lb(h.responseText)}catch(c){J("Failed to parse JSON response for "+f+": "+h.responseText)}d(null,
b)}else 401!==h.status&&404!==h.status&&J("Got unsuccessful REST response for "+f+" Status: "+h.status),d(h.status);d=null}};h.open("GET",f,!0);h.send()})};function Uf(a){this.te=a;this.Bd=[];this.Qb=0;this.Yd=-1;this.Fb=null}function Vf(a,b,c){a.Yd=b;a.Fb=c;a.Yd<a.Qb&&(a.Fb(),a.Fb=null)}function Wf(a,b,c){for(a.Bd[b]=c;a.Bd[a.Qb];){var d=a.Bd[a.Qb];delete a.Bd[a.Qb];for(var e=0;e<d.length;++e)if(d[e]){var f=a;fc(function(){f.te(d[e])})}if(a.Qb===a.Yd){a.Fb&&(clearTimeout(a.Fb),a.Fb(),a.Fb=null);break}a.Qb++}};var Cb="websocket",Db="long_polling";var Xf=null;"undefined"!==typeof MozWebSocket?Xf=MozWebSocket:"undefined"!==typeof WebSocket&&(Xf=WebSocket);function Yf(a,b,c,d){this.Zd=a;this.f=Tb(this.Zd);this.frames=this.zc=null;this.pb=this.qb=this.Fe=0;this.Va=Pf(b);a={v:"5"};"undefined"!==typeof location&&location.href&&-1!==location.href.indexOf("firebaseio.com")&&(a.r="f");c&&(a.s=c);d&&(a.ls=d);this.Ke=Bb(b,Cb,a)}var Zf;
Yf.prototype.open=function(a,b){this.ib=b;this.Xf=a;this.f("Websocket connecting to "+this.Ke);this.wc=!1;xb.set("previous_websocket_failure",!0);try{this.Ia=new Xf(this.Ke)}catch(c){this.f("Error instantiating WebSocket.");var d=c.message||c.data;d&&this.f(d);this.bb();return}var e=this;this.Ia.onopen=function(){e.f("Websocket connected.");e.wc=!0};this.Ia.onclose=function(){e.f("Websocket connection was disconnected.");e.Ia=null;e.bb()};this.Ia.onmessage=function(a){if(null!==e.Ia)if(a=a.data,e.pb+=
a.length,Mf(e.Va,"bytes_received",a.length),$f(e),null!==e.frames)ag(e,a);else{a:{D(null===e.frames,"We already have a frame buffer");if(6>=a.length){var b=Number(a);if(!isNaN(b)){e.Fe=b;e.frames=[];a=null;break a}}e.Fe=1;e.frames=[]}null!==a&&ag(e,a)}};this.Ia.onerror=function(a){e.f("WebSocket error.  Closing connection.");(a=a.message||a.data)&&e.f(a);e.bb()}};Yf.prototype.start=function(){};
Yf.isAvailable=function(){var a=!1;if("undefined"!==typeof navigator&&navigator.userAgent){var b=navigator.userAgent.match(/Android ([0-9]{0,}\.[0-9]{0,})/);b&&1<b.length&&4.4>parseFloat(b[1])&&(a=!0)}return!a&&null!==Xf&&!Zf};Yf.responsesRequiredToBeHealthy=2;Yf.healthyTimeout=3E4;g=Yf.prototype;g.sd=function(){xb.remove("previous_websocket_failure")};function ag(a,b){a.frames.push(b);if(a.frames.length==a.Fe){var c=a.frames.join("");a.frames=null;c=lb(c);a.Xf(c)}}
g.send=function(a){$f(this);a=x(a);this.qb+=a.length;Mf(this.Va,"bytes_sent",a.length);a=bc(a,16384);1<a.length&&bg(this,String(a.length));for(var b=0;b<a.length;b++)bg(this,a[b])};g.Tc=function(){this.Ab=!0;this.zc&&(clearInterval(this.zc),this.zc=null);this.Ia&&(this.Ia.close(),this.Ia=null)};g.bb=function(){this.Ab||(this.f("WebSocket is closing itself"),this.Tc(),this.ib&&(this.ib(this.wc),this.ib=null))};g.close=function(){this.Ab||(this.f("WebSocket is being closed"),this.Tc())};
function $f(a){clearInterval(a.zc);a.zc=setInterval(function(){a.Ia&&bg(a,"0");$f(a)},Math.floor(45E3))}function bg(a,b){try{a.Ia.send(b)}catch(c){a.f("Exception thrown from WebSocket.send():",c.message||c.data,"Closing connection."),setTimeout(q(a.bb,a),0)}};function cg(a,b,c,d){this.Zd=a;this.f=Tb(a);this.jc=b;this.pb=this.qb=0;this.Va=Pf(b);this.tf=c;this.wc=!1;this.Cb=d;this.Yc=function(a){return Bb(b,Db,a)}}var dg,eg;
cg.prototype.open=function(a,b){this.Ne=0;this.ia=b;this.bf=new Uf(a);this.Ab=!1;var c=this;this.sb=setTimeout(function(){c.f("Timed out trying to connect.");c.bb();c.sb=null},Math.floor(3E4));Yb(function(){if(!c.Ab){c.Ta=new fg(function(a,b,d,k,m){gg(c,arguments);if(c.Ta)if(c.sb&&(clearTimeout(c.sb),c.sb=null),c.wc=!0,"start"==a)c.id=b,c.ff=d;else if("close"===a)b?(c.Ta.Kd=!1,Vf(c.bf,b,function(){c.bb()})):c.bb();else throw Error("Unrecognized command received: "+a);},function(a,b){gg(c,arguments);
Wf(c.bf,a,b)},function(){c.bb()},c.Yc);var a={start:"t"};a.ser=Math.floor(1E8*Math.random());c.Ta.Qd&&(a.cb=c.Ta.Qd);a.v="5";c.tf&&(a.s=c.tf);c.Cb&&(a.ls=c.Cb);"undefined"!==typeof location&&location.href&&-1!==location.href.indexOf("firebaseio.com")&&(a.r="f");a=c.Yc(a);c.f("Connecting via long-poll to "+a);hg(c.Ta,a,function(){})}})};
cg.prototype.start=function(){var a=this.Ta,b=this.ff;a.Vf=this.id;a.Wf=b;for(a.Ud=!0;ig(a););a=this.id;b=this.ff;this.fc=document.createElement("iframe");var c={dframe:"t"};c.id=a;c.pw=b;this.fc.src=this.Yc(c);this.fc.style.display="none";document.body.appendChild(this.fc)};
cg.isAvailable=function(){return dg||!eg&&"undefined"!==typeof document&&null!=document.createElement&&!("object"===typeof window&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))&&!("object"===typeof Windows&&"object"===typeof Windows.rg)&&!0};g=cg.prototype;g.sd=function(){};g.Tc=function(){this.Ab=!0;this.Ta&&(this.Ta.close(),this.Ta=null);this.fc&&(document.body.removeChild(this.fc),this.fc=null);this.sb&&(clearTimeout(this.sb),this.sb=null)};
g.bb=function(){this.Ab||(this.f("Longpoll is closing itself"),this.Tc(),this.ia&&(this.ia(this.wc),this.ia=null))};g.close=function(){this.Ab||(this.f("Longpoll is being closed."),this.Tc())};g.send=function(a){a=x(a);this.qb+=a.length;Mf(this.Va,"bytes_sent",a.length);a=mb(a);a=ab(a,!0);a=bc(a,1840);for(var b=0;b<a.length;b++){var c=this.Ta;c.Qc.push({jg:this.Ne,pg:a.length,Pe:a[b]});c.Ud&&ig(c);this.Ne++}};function gg(a,b){var c=x(b).length;a.pb+=c;Mf(a.Va,"bytes_received",c)}
function fg(a,b,c,d){this.Yc=d;this.ib=c;this.ve=new Gc;this.Qc=[];this.$d=Math.floor(1E8*Math.random());this.Kd=!0;this.Qd=Lb();window["pLPCommand"+this.Qd]=a;window["pRTLPCB"+this.Qd]=b;a=document.createElement("iframe");a.style.display="none";if(document.body){document.body.appendChild(a);try{a.contentWindow.document||I("No IE domain setting required")}catch(e){a.src="javascript:void((function(){document.open();document.domain='"+document.domain+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";
a.contentDocument?a.gb=a.contentDocument:a.contentWindow?a.gb=a.contentWindow.document:a.document&&(a.gb=a.document);this.Ea=a;a="";this.Ea.src&&"javascript:"===this.Ea.src.substr(0,11)&&(a='<script>document.domain="'+document.domain+'";\x3c/script>');a="<html><body>"+a+"</body></html>";try{this.Ea.gb.open(),this.Ea.gb.write(a),this.Ea.gb.close()}catch(f){I("frame writing exception"),f.stack&&I(f.stack),I(f)}}
fg.prototype.close=function(){this.Ud=!1;if(this.Ea){this.Ea.gb.body.innerHTML="";var a=this;setTimeout(function(){null!==a.Ea&&(document.body.removeChild(a.Ea),a.Ea=null)},Math.floor(0))}var b=this.ib;b&&(this.ib=null,b())};
function ig(a){if(a.Ud&&a.Kd&&a.ve.count()<(0<a.Qc.length?2:1)){a.$d++;var b={};b.id=a.Vf;b.pw=a.Wf;b.ser=a.$d;for(var b=a.Yc(b),c="",d=0;0<a.Qc.length;)if(1870>=a.Qc[0].Pe.length+30+c.length){var e=a.Qc.shift(),c=c+"&seg"+d+"="+e.jg+"&ts"+d+"="+e.pg+"&d"+d+"="+e.Pe;d++}else break;jg(a,b+c,a.$d);return!0}return!1}function jg(a,b,c){function d(){a.ve.remove(c);ig(a)}a.ve.add(c,1);var e=setTimeout(d,Math.floor(25E3));hg(a,b,function(){clearTimeout(e);d()})}
function hg(a,b,c){setTimeout(function(){try{if(a.Kd){var d=a.Ea.gb.createElement("script");d.type="text/javascript";d.async=!0;d.src=b;d.onload=d.onreadystatechange=function(){var a=d.readyState;a&&"loaded"!==a&&"complete"!==a||(d.onload=d.onreadystatechange=null,d.parentNode&&d.parentNode.removeChild(d),c())};d.onerror=function(){I("Long-poll script failed to load: "+b);a.Kd=!1;a.close()};a.Ea.gb.body.appendChild(d)}}catch(e){}},Math.floor(1))};function kg(a){lg(this,a)}var mg=[cg,Yf];function lg(a,b){var c=Yf&&Yf.isAvailable(),d=c&&!(xb.Ze||!0===xb.get("previous_websocket_failure"));b.qg&&(c||J("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),d=!0);if(d)a.Wc=[Yf];else{var e=a.Wc=[];cc(mg,function(a,b){b&&b.isAvailable()&&e.push(b)})}}function ng(a){if(0<a.Wc.length)return a.Wc[0];throw Error("No transports available");};function og(a,b,c,d,e,f,h){this.id=a;this.f=Tb("c:"+this.id+":");this.te=c;this.Lc=d;this.ia=e;this.se=f;this.L=b;this.Ad=[];this.Le=0;this.sf=new kg(b);this.Ua=0;this.Cb=h;this.f("Connection created");pg(this)}
function pg(a){var b=ng(a.sf);a.I=new b("c:"+a.id+":"+a.Le++,a.L,void 0,a.Cb);a.xe=b.responsesRequiredToBeHealthy||0;var c=qg(a,a.I),d=rg(a,a.I);a.Xc=a.I;a.Rc=a.I;a.D=null;a.Bb=!1;setTimeout(function(){a.I&&a.I.open(c,d)},Math.floor(0));b=b.healthyTimeout||0;0<b&&(a.md=hc(function(){a.md=null;a.Bb||(a.I&&102400<a.I.pb?(a.f("Connection exceeded healthy timeout but has received "+a.I.pb+" bytes.  Marking connection healthy."),a.Bb=!0,a.I.sd()):a.I&&10240<a.I.qb?a.f("Connection exceeded healthy timeout but has sent "+
a.I.qb+" bytes.  Leaving connection alive."):(a.f("Closing unhealthy connection after timeout."),a.close()))},Math.floor(b)))}function rg(a,b){return function(c){b===a.I?(a.I=null,c||0!==a.Ua?1===a.Ua&&a.f("Realtime connection lost."):(a.f("Realtime connection failed."),"s-"===a.L.$a.substr(0,2)&&(xb.remove("host:"+a.L.host),a.L.$a=a.L.host)),a.close()):b===a.D?(a.f("Secondary connection lost."),c=a.D,a.D=null,a.Xc!==c&&a.Rc!==c||a.close()):a.f("closing an old connection")}}
function qg(a,b){return function(c){if(2!=a.Ua)if(b===a.Rc){var d=$b("t",c);c=$b("d",c);if("c"==d){if(d=$b("t",c),"d"in c)if(c=c.d,"h"===d){var d=c.ts,e=c.v,f=c.h;a.qf=c.s;Ab(a.L,f);0==a.Ua&&(a.I.start(),sg(a,a.I,d),"5"!==e&&J("Protocol version mismatch detected"),c=a.sf,(c=1<c.Wc.length?c.Wc[1]:null)&&tg(a,c))}else if("n"===d){a.f("recvd end transmission on primary");a.Rc=a.D;for(c=0;c<a.Ad.length;++c)a.wd(a.Ad[c]);a.Ad=[];ug(a)}else"s"===d?(a.f("Connection shutdown command received. Shutting down..."),
a.se&&(a.se(c),a.se=null),a.ia=null,a.close()):"r"===d?(a.f("Reset packet received.  New host: "+c),Ab(a.L,c),1===a.Ua?a.close():(vg(a),pg(a))):"e"===d?Ub("Server Error: "+c):"o"===d?(a.f("got pong on primary."),wg(a),xg(a)):Ub("Unknown control packet command: "+d)}else"d"==d&&a.wd(c)}else if(b===a.D)if(d=$b("t",c),c=$b("d",c),"c"==d)"t"in c&&(c=c.t,"a"===c?yg(a):"r"===c?(a.f("Got a reset on secondary, closing it"),a.D.close(),a.Xc!==a.D&&a.Rc!==a.D||a.close()):"o"===c&&(a.f("got pong on secondary."),
a.pf--,yg(a)));else if("d"==d)a.Ad.push(c);else throw Error("Unknown protocol layer: "+d);else a.f("message on old connection")}}og.prototype.ua=function(a){zg(this,{t:"d",d:a})};function ug(a){a.Xc===a.D&&a.Rc===a.D&&(a.f("cleaning up and promoting a connection: "+a.D.Zd),a.I=a.D,a.D=null)}
function yg(a){0>=a.pf?(a.f("Secondary connection is healthy."),a.Bb=!0,a.D.sd(),a.D.start(),a.f("sending client ack on secondary"),a.D.send({t:"c",d:{t:"a",d:{}}}),a.f("Ending transmission on primary"),a.I.send({t:"c",d:{t:"n",d:{}}}),a.Xc=a.D,ug(a)):(a.f("sending ping on secondary."),a.D.send({t:"c",d:{t:"p",d:{}}}))}og.prototype.wd=function(a){wg(this);this.te(a)};function wg(a){a.Bb||(a.xe--,0>=a.xe&&(a.f("Primary connection is healthy."),a.Bb=!0,a.I.sd()))}
function tg(a,b){a.D=new b("c:"+a.id+":"+a.Le++,a.L,a.qf);a.pf=b.responsesRequiredToBeHealthy||0;a.D.open(qg(a,a.D),rg(a,a.D));hc(function(){a.D&&(a.f("Timed out trying to upgrade."),a.D.close())},Math.floor(6E4))}function sg(a,b,c){a.f("Realtime connection established.");a.I=b;a.Ua=1;a.Lc&&(a.Lc(c,a.qf),a.Lc=null);0===a.xe?(a.f("Primary connection is healthy."),a.Bb=!0):hc(function(){xg(a)},Math.floor(5E3))}
function xg(a){a.Bb||1!==a.Ua||(a.f("sending ping on primary."),zg(a,{t:"c",d:{t:"p",d:{}}}))}function zg(a,b){if(1!==a.Ua)throw"Connection is not connected";a.Xc.send(b)}og.prototype.close=function(){2!==this.Ua&&(this.f("Closing realtime connection."),this.Ua=2,vg(this),this.ia&&(this.ia(),this.ia=null))};function vg(a){a.f("Shutting down all connections");a.I&&(a.I.close(),a.I=null);a.D&&(a.D.close(),a.D=null);a.md&&(clearTimeout(a.md),a.md=null)};function Ag(a,b,c,d,e,f){this.id=Bg++;this.f=Tb("p:"+this.id+":");this.qd={};this.$={};this.pa=[];this.Oc=0;this.Kc=[];this.ma=!1;this.Sa=1E3;this.td=3E5;this.Gb=b;this.Jc=c;this.ue=d;this.L=a;this.ob=this.Fa=this.Cb=this.ze=null;this.$c=e;this.de=!1;this.ke=0;if(f)throw Error("Auth override specified in options, but not supported on non Node.js platforms");this.Vd=f;this.ub=null;this.Mb=!1;this.Gd={};this.ig=0;this.Re=!0;this.Ac=this.me=null;Cg(this,0);Mc.Vb().gc("visible",this.Zf,this);-1===a.host.indexOf("fblocal")&&
Lc.Vb().gc("online",this.Yf,this)}var Bg=0,Dg=0;g=Ag.prototype;g.ua=function(a,b,c){var d=++this.ig;a={r:d,a:a,b:b};this.f(x(a));D(this.ma,"sendRequest call when we're not connected not allowed.");this.Fa.ua(a);c&&(this.Gd[d]=c)};
g.$e=function(a,b,c,d){var e=a.ja(),f=a.path.toString();this.f("Listen called for "+f+" "+e);this.$[f]=this.$[f]||{};D(qf(a.m)||!T(a.m),"listen() called for non-default but complete query");D(!this.$[f][e],"listen() called twice for same path/queryId.");a={G:d,ld:b,eg:a,tag:c};this.$[f][e]=a;this.ma&&Eg(this,a)};
function Eg(a,b){var c=b.eg,d=c.path.toString(),e=c.ja();a.f("Listen on "+d+" for "+e);var f={p:d};b.tag&&(f.q=pf(c.m),f.t=b.tag);f.h=b.ld();a.ua("q",f,function(f){var k=f.d,m=f.s;if(k&&"object"===typeof k&&eb(k,"w")){var l=w(k,"w");ea(l)&&0<=xa(l,"no_index")&&J("Using an unspecified index. Consider adding "+('".indexOn": "'+c.m.g.toString()+'"')+" at "+c.path.toString()+" to your security rules for better performance")}(a.$[d]&&a.$[d][e])===b&&(a.f("listen response",f),"ok"!==m&&Fg(a,d,e),b.G&&b.G(m,
k))})}g.kf=function(a){this.ob=a;this.f("Auth token refreshed");this.ob?Gg(this):this.ma&&this.ua("unauth",{},function(){});if(a&&40===a.length||kc(a))this.f("Admin auth credential detected.  Reducing max reconnect time."),this.td=3E4};function Gg(a){if(a.ma&&a.ob){var b=a.ob,c=jc(b)?"auth":"gauth",d={cred:b};null===a.Vd?d.noauth=!0:"object"===typeof a.Vd&&(d.authvar=a.Vd);a.ua(c,d,function(c){var d=c.s;c=c.d||"error";a.ob===b&&("ok"===d?a.ke=0:Hg(a,d,c))})}}
g.uf=function(a,b){var c=a.path.toString(),d=a.ja();this.f("Unlisten called for "+c+" "+d);D(qf(a.m)||!T(a.m),"unlisten() called for non-default but complete query");if(Fg(this,c,d)&&this.ma){var e=pf(a.m);this.f("Unlisten on "+c+" for "+d);c={p:c};b&&(c.q=e,c.t=b);this.ua("n",c)}};g.re=function(a,b,c){this.ma?Ig(this,"o",a,b,c):this.Kc.push({we:a,action:"o",data:b,G:c})};g.cf=function(a,b,c){this.ma?Ig(this,"om",a,b,c):this.Kc.push({we:a,action:"om",data:b,G:c})};
g.xd=function(a,b){this.ma?Ig(this,"oc",a,null,b):this.Kc.push({we:a,action:"oc",data:null,G:b})};function Ig(a,b,c,d,e){c={p:c,d:d};a.f("onDisconnect "+b,c);a.ua(b,c,function(a){e&&setTimeout(function(){e(a.s,a.d)},Math.floor(0))})}g.put=function(a,b,c,d){Jg(this,"p",a,b,c,d)};g.af=function(a,b,c,d){Jg(this,"m",a,b,c,d)};function Jg(a,b,c,d,e,f){d={p:c,d:d};n(f)&&(d.h=f);a.pa.push({action:b,mf:d,G:e});a.Oc++;b=a.pa.length-1;a.ma?Kg(a,b):a.f("Buffering put: "+c)}
function Kg(a,b){var c=a.pa[b].action,d=a.pa[b].mf,e=a.pa[b].G;a.pa[b].fg=a.ma;a.ua(c,d,function(d){a.f(c+" response",d);delete a.pa[b];a.Oc--;0===a.Oc&&(a.pa=[]);e&&e(d.s,d.d)})}g.ye=function(a){this.ma&&(a={c:a},this.f("reportStats",a),this.ua("s",a,function(a){"ok"!==a.s&&this.f("reportStats","Error sending stats: "+a.d)}))};
g.wd=function(a){if("r"in a){this.f("from server: "+x(a));var b=a.r,c=this.Gd[b];c&&(delete this.Gd[b],c(a.b))}else{if("error"in a)throw"A server-side error has occurred: "+a.error;"a"in a&&(b=a.a,a=a.b,this.f("handleServerMessage",b,a),"d"===b?this.Gb(a.p,a.d,!1,a.t):"m"===b?this.Gb(a.p,a.d,!0,a.t):"c"===b?Lg(this,a.p,a.q):"ac"===b?Hg(this,a.s,a.d):"sd"===b?this.ze?this.ze(a):"msg"in a&&"undefined"!==typeof console&&console.log("FIREBASE: "+a.msg.replace("\n","\nFIREBASE: ")):Ub("Unrecognized action received from server: "+
x(b)+"\nAre you using the latest client?"))}};g.Lc=function(a,b){this.f("connection ready");this.ma=!0;this.Ac=(new Date).getTime();this.ue({serverTimeOffset:a-(new Date).getTime()});this.Cb=b;if(this.Re){var c={};c["sdk.js."+firebase.SDK_VERSION.replace(/\./g,"-")]=1;pb()?c["framework.cordova"]=1:"object"===typeof navigator&&"ReactNative"===navigator.product&&(c["framework.reactnative"]=1);this.ye(c)}Mg(this);this.Re=!1;this.Jc(!0)};
function Cg(a,b){D(!a.Fa,"Scheduling a connect when we're already connected/ing?");a.ub&&clearTimeout(a.ub);a.ub=setTimeout(function(){a.ub=null;Ng(a)},Math.floor(b))}g.Zf=function(a){a&&!this.Mb&&this.Sa===this.td&&(this.f("Window became visible.  Reducing delay."),this.Sa=1E3,this.Fa||Cg(this,0));this.Mb=a};g.Yf=function(a){a?(this.f("Browser went online."),this.Sa=1E3,this.Fa||Cg(this,0)):(this.f("Browser went offline.  Killing connection."),this.Fa&&this.Fa.close())};
g.df=function(){this.f("data client disconnected");this.ma=!1;this.Fa=null;for(var a=0;a<this.pa.length;a++){var b=this.pa[a];b&&"h"in b.mf&&b.fg&&(b.G&&b.G("disconnect"),delete this.pa[a],this.Oc--)}0===this.Oc&&(this.pa=[]);this.Gd={};Og(this)&&(this.Mb?this.Ac&&(3E4<(new Date).getTime()-this.Ac&&(this.Sa=1E3),this.Ac=null):(this.f("Window isn't visible.  Delaying reconnect."),this.Sa=this.td,this.me=(new Date).getTime()),a=Math.max(0,this.Sa-((new Date).getTime()-this.me)),a*=Math.random(),this.f("Trying to reconnect in "+
a+"ms"),Cg(this,a),this.Sa=Math.min(this.td,1.3*this.Sa));this.Jc(!1)};
function Ng(a){if(Og(a)){a.f("Making a connection attempt");a.me=(new Date).getTime();a.Ac=null;var b=q(a.wd,a),c=q(a.Lc,a),d=q(a.df,a),e=a.id+":"+Dg++,f=a.Cb,h=!1,k=null,m=function(){k?k.close():(h=!0,d())};a.Fa={close:m,ua:function(a){D(k,"sendRequest call when we're not connected not allowed.");k.ua(a)}};var l=a.de;a.de=!1;a.$c.getToken(l).then(function(l){h?I("getToken() completed but was canceled"):(I("getToken() completed. Creating connection."),a.ob=l&&l.accessToken,k=new og(e,a.L,b,c,d,function(b){J(b+
" ("+a.L.toString()+")");a.ab("server_kill")},f))}).then(null,function(b){a.f("Failed to get token: "+b);h||m()})}}g.ab=function(a){I("Interrupting connection for reason: "+a);this.qd[a]=!0;this.Fa?this.Fa.close():(this.ub&&(clearTimeout(this.ub),this.ub=null),this.ma&&this.df())};g.kc=function(a){I("Resuming connection for reason: "+a);delete this.qd[a];Sa(this.qd)&&(this.Sa=1E3,this.Fa||Cg(this,0))};
function Lg(a,b,c){c=c?Aa(c,function(a){return ac(a)}).join("$"):"default";(a=Fg(a,b,c))&&a.G&&a.G("permission_denied")}function Fg(a,b,c){b=(new E(b)).toString();var d;n(a.$[b])?(d=a.$[b][c],delete a.$[b][c],0===La(a.$[b])&&delete a.$[b]):d=void 0;return d}
function Hg(a,b,c){I("Auth token revoked: "+b+"/"+c);a.ob=null;a.de=!0;a.Fa.close();if("invalid_token"===b||"permission_denied"===b)a.ke++,3<=a.ke&&(a.Sa=3E4,a=a.$c,b='Provided authentication credentials for the app named "'+a.oc.name+'" are invalid. This usually indicates your app was not initialized correctly. ',b="credential"in a.oc.options?b+'Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in
a.oc.options?b+'Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':b+'Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',J(b))}
function Mg(a){Gg(a);v(a.$,function(b){v(b,function(b){Eg(a,b)})});for(var b=0;b<a.pa.length;b++)a.pa[b]&&Kg(a,b);for(;a.Kc.length;)b=a.Kc.shift(),Ig(a,b.action,b.we,b.data,b.G)}function Og(a){var b;b=Lc.Vb().hc;return Sa(a.qd)&&b};function Pg(a){a instanceof Qg||Vb("Don't call new Database() directly - please use firebase.database().");this.ta=a;this.ba=new U(a,Q);this.INTERNAL=new Rg(this)}var Sg={TIMESTAMP:{".sv":"timestamp"}};g=Pg.prototype;g.app=null;g.jf=function(a){Tg(this,"ref");y("database.ref",0,1,arguments.length);return n(a)?this.ba.n(a):this.ba};
g.gg=function(a){Tg(this,"database.refFromURL");y("database.refFromURL",1,1,arguments.length);var b=Wb(a);Xd("database.refFromURL",b);var c=b.jc;c.host!==this.ta.L.host&&Vb("database.refFromURL: Host name does not match the current database: (found "+c.host+" but expected "+this.ta.L.host+")");return this.jf(b.path.toString())};function Tg(a,b){null===a.ta&&Vb("Cannot call "+b+" on a deleted database.")}g.Pf=function(){y("database.goOffline",0,0,arguments.length);Tg(this,"goOffline");this.ta.ab()};
g.Qf=function(){y("database.goOnline",0,0,arguments.length);Tg(this,"goOnline");this.ta.kc()};Object.defineProperty(Pg.prototype,"app",{get:function(){return this.ta.app}});function Rg(a){this.Ya=a}Rg.prototype.delete=function(){Tg(this.Ya,"delete");var a=Ug.Vb(),b=this.Ya.ta;w(a.lb,b.app.name)!==b&&Vb("Database "+b.app.name+" has already been deleted.");b.ab();delete a.lb[b.app.name];this.Ya.ta=null;this.Ya.ba=null;this.Ya=this.Ya.INTERNAL=null;return firebase.Promise.resolve()};
Pg.prototype.ref=Pg.prototype.jf;Pg.prototype.refFromURL=Pg.prototype.gg;Pg.prototype.goOnline=Pg.prototype.Qf;Pg.prototype.goOffline=Pg.prototype.Pf;Rg.prototype["delete"]=Rg.prototype.delete;function V(a,b,c){this.A=a;this.V=b;this.g=c}V.prototype.H=function(){y("Firebase.DataSnapshot.val",0,0,arguments.length);return this.A.H()};V.prototype.val=V.prototype.H;V.prototype.be=function(){y("Firebase.DataSnapshot.exportVal",0,0,arguments.length);return this.A.H(!0)};V.prototype.exportVal=V.prototype.be;V.prototype.toJSON=function(){y("Firebase.DataSnapshot.toJSON",0,1,arguments.length);return this.be()};V.prototype.toJSON=V.prototype.toJSON;
V.prototype.Lf=function(){y("Firebase.DataSnapshot.exists",0,0,arguments.length);return!this.A.e()};V.prototype.exists=V.prototype.Lf;V.prototype.n=function(a){y("Firebase.DataSnapshot.child",0,1,arguments.length);ga(a)&&(a=String(a));Vd("Firebase.DataSnapshot.child",a);var b=new E(a),c=this.V.n(b);return new V(this.A.P(b),c,H)};V.prototype.child=V.prototype.n;
V.prototype.Da=function(a){y("Firebase.DataSnapshot.hasChild",1,1,arguments.length);Vd("Firebase.DataSnapshot.hasChild",a);var b=new E(a);return!this.A.P(b).e()};V.prototype.hasChild=V.prototype.Da;V.prototype.C=function(){y("Firebase.DataSnapshot.getPriority",0,0,arguments.length);return this.A.C().H()};V.prototype.getPriority=V.prototype.C;
V.prototype.forEach=function(a){y("Firebase.DataSnapshot.forEach",1,1,arguments.length);B("Firebase.DataSnapshot.forEach",1,a,!1);if(this.A.J())return!1;var b=this;return!!this.A.O(this.g,function(c,d){return a(new V(d,b.V.n(c),H))})};V.prototype.forEach=V.prototype.forEach;V.prototype.kd=function(){y("Firebase.DataSnapshot.hasChildren",0,0,arguments.length);return this.A.J()?!1:!this.A.e()};V.prototype.hasChildren=V.prototype.kd;
V.prototype.getKey=function(){y("Firebase.DataSnapshot.key",0,0,arguments.length);return this.V.getKey()};gc(V.prototype,"key",V.prototype.getKey);V.prototype.Eb=function(){y("Firebase.DataSnapshot.numChildren",0,0,arguments.length);return this.A.Eb()};V.prototype.numChildren=V.prototype.Eb;V.prototype.wb=function(){y("Firebase.DataSnapshot.ref",0,0,arguments.length);return this.V};gc(V.prototype,"ref",V.prototype.wb);function Vg(a,b,c){this.Pb=a;this.rb=b;this.tb=c||null}g=Vg.prototype;g.nf=function(a){return"value"===a};g.createEvent=function(a,b){var c=b.m.g;return new We("value",this,new V(a.Ja,b.wb(),c))};g.Tb=function(a){var b=this.tb;if("cancel"===a.ge()){D(this.rb,"Raising a cancel event on a listener with no cancel callback");var c=this.rb;return function(){c.call(b,a.error)}}var d=this.Pb;return function(){d.call(b,a.Md)}};g.Me=function(a,b){return this.rb?new Xe(this,a,b):null};
g.matches=function(a){return a instanceof Vg?a.Pb&&this.Pb?a.Pb===this.Pb&&a.tb===this.tb:!0:!1};g.Xe=function(){return null!==this.Pb};function Wg(a,b,c){this.ga=a;this.rb=b;this.tb=c}g=Wg.prototype;g.nf=function(a){a="children_added"===a?"child_added":a;return("children_removed"===a?"child_removed":a)in this.ga};g.Me=function(a,b){return this.rb?new Xe(this,a,b):null};
g.createEvent=function(a,b){D(null!=a.Xa,"Child events should have a childName.");var c=b.wb().n(a.Xa);return new We(a.type,this,new V(a.Ja,c,b.m.g),a.Dd)};g.Tb=function(a){var b=this.tb;if("cancel"===a.ge()){D(this.rb,"Raising a cancel event on a listener with no cancel callback");var c=this.rb;return function(){c.call(b,a.error)}}var d=this.ga[a.hd];return function(){d.call(b,a.Md,a.Dd)}};
g.matches=function(a){if(a instanceof Wg){if(!this.ga||!a.ga)return!0;if(this.tb===a.tb){var b=La(a.ga);if(b===La(this.ga)){if(1===b){var b=Ma(a.ga),c=Ma(this.ga);return c===b&&(!a.ga[b]||!this.ga[c]||a.ga[b]===this.ga[c])}return Ka(this.ga,function(b,c){return a.ga[c]===b})}}}return!1};g.Xe=function(){return null!==this.ga};function Xg(){this.za={}}g=Xg.prototype;g.e=function(){return Sa(this.za)};g.eb=function(a,b,c){var d=a.source.Hb;if(null!==d)return d=w(this.za,d),D(null!=d,"SyncTree gave us an op for an invalid query."),d.eb(a,b,c);var e=[];v(this.za,function(d){e=e.concat(d.eb(a,b,c))});return e};g.Nb=function(a,b,c,d,e){var f=a.ja(),h=w(this.za,f);if(!h){var h=c.Aa(e?d:null),k=!1;h?k=!0:(h=d instanceof O?c.rc(d):L,k=!1);h=new Pe(a,new oe(new je(h,k,!1),new je(d,e,!1)));this.za[f]=h}h.Nb(b);return Ve(h,b)};
g.kb=function(a,b,c){var d=a.ja(),e=[],f=[],h=null!=Yg(this);if("default"===d){var k=this;v(this.za,function(a,d){f=f.concat(a.kb(b,c));a.e()&&(delete k.za[d],T(a.V.m)||e.push(a.V))})}else{var m=w(this.za,d);m&&(f=f.concat(m.kb(b,c)),m.e()&&(delete this.za[d],T(m.V.m)||e.push(m.V)))}h&&null==Yg(this)&&e.push(new U(a.u,a.path));return{hg:e,Kf:f}};function Zg(a){return za(Na(a.za),function(a){return!T(a.V.m)})}g.hb=function(a){var b=null;v(this.za,function(c){b=b||c.hb(a)});return b};
function $g(a,b){if(T(b.m))return Yg(a);var c=b.ja();return w(a.za,c)}function Yg(a){return Ra(a.za,function(a){return T(a.V.m)})||null};function ah(a){this.wa=R;this.jb=new Df;this.De={};this.ic={};this.Cc=a}function bh(a,b,c,d,e){var f=a.jb,h=e;D(d>f.Bc,"Stacking an older write on top of newer ones");n(h)||(h=!0);f.la.push({path:b,Ga:c,Zc:d,visible:h});h&&(f.S=uf(f.S,b,c));f.Bc=d;return e?ch(a,new ce(fe,b,c)):[]}function dh(a,b,c,d){var e=a.jb;D(d>e.Bc,"Stacking an older merge on top of newer ones");e.la.push({path:b,children:c,Zc:d,visible:!0});e.S=vf(e.S,b,c);e.Bc=d;c=xd(c);return ch(a,new ae(fe,b,c))}
function eh(a,b,c){c=c||!1;var d=Ef(a.jb,b);if(a.jb.Ed(b)){var e=R;null!=d.Ga?e=e.set(Q,!0):fb(d.children,function(a,b){e=e.set(new E(a),b)});return ch(a,new de(d.path,e,c))}return[]}function fh(a,b,c){c=xd(c);return ch(a,new ae(ie,b,c))}function gh(a,b,c,d){d=hh(a,d);if(null!=d){var e=ih(d);d=e.path;e=e.Hb;b=P(d,b);c=new ce(new he(!1,!0,e,!0),b,c);return jh(a,d,c)}return[]}
function kh(a,b,c,d){if(d=hh(a,d)){var e=ih(d);d=e.path;e=e.Hb;b=P(d,b);c=xd(c);c=new ae(new he(!1,!0,e,!0),b,c);return jh(a,d,c)}return[]}
ah.prototype.Nb=function(a,b){var c=a.path,d=null,e=!1;Fd(this.wa,c,function(a,b){var f=P(a,c);d=d||b.hb(f);e=e||null!=Yg(b)});var f=this.wa.get(c);f?(e=e||null!=Yg(f),d=d||f.hb(Q)):(f=new Xg,this.wa=this.wa.set(c,f));var h;null!=d?h=!0:(h=!1,d=L,Jd(this.wa.subtree(c),function(a,b){var c=b.hb(Q);c&&(d=d.T(a,c))}));var k=null!=$g(f,a);if(!k&&!T(a.m)){var m=lh(a);D(!(m in this.ic),"View does not exist, but we have a tag");var l=mh++;this.ic[m]=l;this.De["_"+l]=m}h=f.Nb(a,b,new If(c,this.jb),d,h);k||
e||(f=$g(f,a),h=h.concat(nh(this,a,f)));return h};
ah.prototype.kb=function(a,b,c){var d=a.path,e=this.wa.get(d),f=[];if(e&&("default"===a.ja()||null!=$g(e,a))){f=e.kb(a,b,c);e.e()&&(this.wa=this.wa.remove(d));e=f.hg;f=f.Kf;b=-1!==Ea(e,function(a){return T(a.m)});var h=Dd(this.wa,d,function(a,b){return null!=Yg(b)});if(b&&!h&&(d=this.wa.subtree(d),!d.e()))for(var d=oh(d),k=0;k<d.length;++k){var m=d[k],l=m.V,m=ph(this,m);this.Cc.Ae(qh(l),rh(this,l),m.ld,m.G)}if(!h&&0<e.length&&!c)if(b)this.Cc.Od(qh(a),null);else{var u=this;ya(e,function(a){a.ja();
var b=u.ic[lh(a)];u.Cc.Od(qh(a),b)})}sh(this,e)}return f};ah.prototype.Aa=function(a,b){var c=this.jb,d=Dd(this.wa,a,function(b,c){var d=P(b,a);if(d=c.hb(d))return d});return c.Aa(a,d,b,!0)};function oh(a){return Bd(a,function(a,c,d){if(c&&null!=Yg(c))return[Yg(c)];var e=[];c&&(e=Zg(c));v(d,function(a){e=e.concat(a)});return e})}function sh(a,b){for(var c=0;c<b.length;++c){var d=b[c];if(!T(d.m)){var d=lh(d),e=a.ic[d];delete a.ic[d];delete a.De["_"+e]}}}
function qh(a){return T(a.m)&&!qf(a.m)?a.wb():a}function nh(a,b,c){var d=b.path,e=rh(a,b);c=ph(a,c);b=a.Cc.Ae(qh(b),e,c.ld,c.G);d=a.wa.subtree(d);if(e)D(null==Yg(d.value),"If we're adding a query, it shouldn't be shadowed");else for(e=Bd(d,function(a,b,c){if(!a.e()&&b&&null!=Yg(b))return[Te(Yg(b))];var d=[];b&&(d=d.concat(Aa(Zg(b),function(a){return a.V})));v(c,function(a){d=d.concat(a)});return d}),d=0;d<e.length;++d)c=e[d],a.Cc.Od(qh(c),rh(a,c));return b}
function ph(a,b){var c=b.V,d=rh(a,c);return{ld:function(){return(b.w()||L).hash()},G:function(b){if("ok"===b){if(d){var f=c.path;if(b=hh(a,d)){var h=ih(b);b=h.path;h=h.Hb;f=P(b,f);f=new Zd(new he(!1,!0,h,!0),f);b=jh(a,b,f)}else b=[]}else b=ch(a,new Zd(ie,c.path));return b}f="Unknown Error";"too_big"===b?f="The data requested exceeds the maximum size that can be accessed with a single request.":"permission_denied"==b?f="Client doesn't have permission to access the desired data.":"unavailable"==b&&
(f="The service is unavailable");f=Error(b+" at "+c.path.toString()+": "+f);f.code=b.toUpperCase();return a.kb(c,null,f)}}}function lh(a){return a.path.toString()+"$"+a.ja()}function ih(a){var b=a.indexOf("$");D(-1!==b&&b<a.length-1,"Bad queryKey.");return{Hb:a.substr(b+1),path:new E(a.substr(0,b))}}function hh(a,b){var c=a.De,d="_"+b;return d in c?c[d]:void 0}function rh(a,b){var c=lh(b);return w(a.ic,c)}var mh=1;
function jh(a,b,c){var d=a.wa.get(b);D(d,"Missing sync point for query tag that we're tracking");return d.eb(c,new If(b,a.jb),null)}function ch(a,b){return th(a,b,a.wa,null,new If(Q,a.jb))}function th(a,b,c,d,e){if(b.path.e())return uh(a,b,c,d,e);var f=c.get(Q);null==d&&null!=f&&(d=f.hb(Q));var h=[],k=K(b.path),m=b.Mc(k);if((c=c.children.get(k))&&m)var l=d?d.Q(k):null,k=e.n(k),h=h.concat(th(a,m,c,l,k));f&&(h=h.concat(f.eb(b,e,d)));return h}
function uh(a,b,c,d,e){var f=c.get(Q);null==d&&null!=f&&(d=f.hb(Q));var h=[];c.children.ha(function(c,f){var l=d?d.Q(c):null,u=e.n(c),z=b.Mc(c);z&&(h=h.concat(uh(a,z,f,l,u)))});f&&(h=h.concat(f.eb(b,e,d)));return h};function Qg(a,b,c){this.app=c;var d=new Bf(c);this.L=a;this.Va=Pf(a);this.Vc=null;this.ca=new Ye;this.vd=1;this.Ra=null;if(b||0<=("object"===typeof window&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i))this.va=new Rf(this.L,q(this.Gb,this),d),setTimeout(q(this.Jc,this,!0),0);else{b=c.options.databaseAuthVariableOverride;if("undefined"!==da(b)&&null!==b){if("object"!==da(b))throw Error("Only objects are supported for option databaseAuthVariableOverride");
try{x(b)}catch(e){throw Error("Invalid authOverride provided: "+e);}}this.va=this.Ra=new Ag(this.L,q(this.Gb,this),q(this.Jc,this),q(this.ue,this),d,b)}var f=this;Cf(d,function(a){f.va.kf(a)});this.og=Qf(a,q(function(){return new Jf(this.Va,this.va)},this));this.mc=new Tc;this.ie=new Af;this.pd=new ah({Ae:function(a,b,c,d){b=[];c=f.ie.j(a.path);c.e()||(b=ch(f.pd,new ce(ie,a.path,c)),setTimeout(function(){d("ok")},0));return b},Od:ba});vh(this,"connected",!1);this.ia=new Gb;this.Ya=new Pg(this);this.fd=
0;this.je=null;this.K=new ah({Ae:function(a,b,c,d){f.va.$e(a,c,b,function(b,c){var e=d(b,c);cf(f.ca,a.path,e)});return[]},Od:function(a,b){f.va.uf(a,b)}})}g=Qg.prototype;g.toString=function(){return(this.L.Sc?"https://":"http://")+this.L.host};g.name=function(){return this.L.pe};function wh(a){a=a.ie.j(new E(".info/serverTimeOffset")).H()||0;return(new Date).getTime()+a}function xh(a){a=a={timestamp:wh(a)};a.timestamp=a.timestamp||(new Date).getTime();return a}
g.Gb=function(a,b,c,d){this.fd++;var e=new E(a);b=this.je?this.je(a,b):b;a=[];d?c?(b=Ja(b,function(a){return G(a)}),a=kh(this.K,e,b,d)):(b=G(b),a=gh(this.K,e,b,d)):c?(d=Ja(b,function(a){return G(a)}),a=fh(this.K,e,d)):(d=G(b),a=ch(this.K,new ce(ie,e,d)));d=e;0<a.length&&(d=yh(this,e));cf(this.ca,d,a)};g.Jc=function(a){vh(this,"connected",a);!1===a&&zh(this)};g.ue=function(a){var b=this;cc(a,function(a,d){vh(b,d,a)})};
function vh(a,b,c){b=new E("/.info/"+b);c=G(c);var d=a.ie;d.Jd=d.Jd.F(b,c);c=ch(a.pd,new ce(ie,b,c));cf(a.ca,b,c)}g.Jb=function(a,b,c,d){this.f("set",{path:a.toString(),value:b,ug:c});var e=xh(this);b=G(b,c);var e=Jb(b,e),f=this.vd++,e=bh(this.K,a,e,f,!0);Ze(this.ca,e);var h=this;this.va.put(a.toString(),b.H(!0),function(b,c){var e="ok"===b;e||J("set at "+a+" failed: "+b);e=eh(h.K,f,!e);cf(h.ca,a,e);Ah(d,b,c)});e=Bh(this,a);yh(this,e);cf(this.ca,e,[])};
g.update=function(a,b,c){this.f("update",{path:a.toString(),value:b});var d=!0,e=xh(this),f={};v(b,function(a,b){d=!1;var c=G(a);f[b]=Jb(c,e)});if(d)I("update() called with empty data.  Don't do anything."),Ah(c,"ok");else{var h=this.vd++,k=dh(this.K,a,f,h);Ze(this.ca,k);var m=this;this.va.af(a.toString(),b,function(b,d){var e="ok"===b;e||J("update at "+a+" failed: "+b);var e=eh(m.K,h,!e),f=a;0<e.length&&(f=yh(m,a));cf(m.ca,f,e);Ah(c,b,d)});v(b,function(b,c){var d=Bh(m,a.n(c));yh(m,d)});cf(this.ca,
a,[])}};function zh(a){a.f("onDisconnectEvents");var b=xh(a),c=[];Hb(Fb(a.ia,b),Q,function(b,e){c=c.concat(ch(a.K,new ce(ie,b,e)));var f=Bh(a,b);yh(a,f)});a.ia=new Gb;cf(a.ca,Q,c)}g.xd=function(a,b){var c=this;this.va.xd(a.toString(),function(d,e){"ok"===d&&Yd(c.ia,a);Ah(b,d,e)})};function Ch(a,b,c,d){var e=G(c);a.va.re(b.toString(),e.H(!0),function(c,h){"ok"===c&&Ib(a.ia,b,e);Ah(d,c,h)})}
function Dh(a,b,c,d,e){var f=G(c,d);a.va.re(b.toString(),f.H(!0),function(c,d){"ok"===c&&Ib(a.ia,b,f);Ah(e,c,d)})}function Eh(a,b,c,d){var e=!0,f;for(f in c)e=!1;e?(I("onDisconnect().update() called with empty data.  Don't do anything."),Ah(d,"ok")):a.va.cf(b.toString(),c,function(e,f){if("ok"===e)for(var m in c){var l=G(c[m]);Ib(a.ia,b.n(m),l)}Ah(d,e,f)})}function Fh(a,b,c){c=".info"===K(b.path)?a.pd.Nb(b,c):a.K.Nb(b,c);af(a.ca,b.path,c)}g.ab=function(){this.Ra&&this.Ra.ab("repo_interrupt")};
g.kc=function(){this.Ra&&this.Ra.kc("repo_interrupt")};g.Be=function(a){if("undefined"!==typeof console){a?(this.Vc||(this.Vc=new Kf(this.Va)),a=this.Vc.get()):a=this.Va.get();var b=Ba(Oa(a),function(a,b){return Math.max(b.length,a)},0),c;for(c in a){for(var d=a[c],e=c.length;e<b+2;e++)c+=" ";console.log(c+d)}}};g.Ce=function(a){Mf(this.Va,a);this.og.rf[a]=!0};g.f=function(a){var b="";this.Ra&&(b=this.Ra.id+":");I(b,arguments)};
function Ah(a,b,c){a&&fc(function(){if("ok"==b)a(null);else{var d=(b||"error").toUpperCase(),e=d;c&&(e+=": "+c);e=Error(e);e.code=d;a(e)}})};function Gh(a,b,c,d,e){function f(){}a.f("transaction on "+b);var h=new U(a,b);h.gc("value",f);c={path:b,update:c,G:d,status:null,ef:Lb(),He:e,of:0,Rd:function(){h.Ic("value",f)},Td:null,Ba:null,cd:null,dd:null,ed:null};d=a.K.Aa(b,void 0)||L;c.cd=d;d=c.update(d.H());if(n(d)){Pd("transaction failed: Data returned ",d,c.path);c.status=1;e=Uc(a.mc,b);var k=e.Ca()||[];k.push(c);Vc(e,k);"object"===typeof d&&null!==d&&eb(d,".priority")?(k=w(d,".priority"),D(Nd(k),"Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")):
k=(a.K.Aa(b)||L).C().H();e=xh(a);d=G(d,k);e=Jb(d,e);c.dd=d;c.ed=e;c.Ba=a.vd++;c=bh(a.K,b,e,c.Ba,c.He);cf(a.ca,b,c);Hh(a)}else c.Rd(),c.dd=null,c.ed=null,c.G&&(a=new V(c.cd,new U(a,c.path),H),c.G(null,!1,a))}function Hh(a,b){var c=b||a.mc;b||Ih(a,c);if(null!==c.Ca()){var d=Jh(a,c);D(0<d.length,"Sending zero length transaction queue");Ca(d,function(a){return 1===a.status})&&Kh(a,c.path(),d)}else c.kd()&&c.O(function(b){Hh(a,b)})}
function Kh(a,b,c){for(var d=Aa(c,function(a){return a.Ba}),e=a.K.Aa(b,d)||L,d=e,e=e.hash(),f=0;f<c.length;f++){var h=c[f];D(1===h.status,"tryToSendTransactionQueue_: items in queue should all be run.");h.status=2;h.of++;var k=P(b,h.path),d=d.F(k,h.dd)}d=d.H(!0);a.va.put(b.toString(),d,function(d){a.f("transaction put response",{path:b.toString(),status:d});var e=[];if("ok"===d){d=[];for(f=0;f<c.length;f++){c[f].status=3;e=e.concat(eh(a.K,c[f].Ba));if(c[f].G){var h=c[f].ed,k=new U(a,c[f].path);d.push(q(c[f].G,
null,null,!0,new V(h,k,H)))}c[f].Rd()}Ih(a,Uc(a.mc,b));Hh(a);cf(a.ca,b,e);for(f=0;f<d.length;f++)fc(d[f])}else{if("datastale"===d)for(f=0;f<c.length;f++)c[f].status=4===c[f].status?5:1;else for(J("transaction at "+b.toString()+" failed: "+d),f=0;f<c.length;f++)c[f].status=5,c[f].Td=d;yh(a,b)}},e)}function yh(a,b){var c=Lh(a,b),d=c.path(),c=Jh(a,c);Mh(a,c,d);return d}
function Mh(a,b,c){if(0!==b.length){for(var d=[],e=[],f=za(b,function(a){return 1===a.status}),f=Aa(f,function(a){return a.Ba}),h=0;h<b.length;h++){var k=b[h],m=P(c,k.path),l=!1,u;D(null!==m,"rerunTransactionsUnderNode_: relativePath should not be null.");if(5===k.status)l=!0,u=k.Td,e=e.concat(eh(a.K,k.Ba,!0));else if(1===k.status)if(25<=k.of)l=!0,u="maxretry",e=e.concat(eh(a.K,k.Ba,!0));else{var z=a.K.Aa(k.path,f)||L;k.cd=z;var F=b[h].update(z.H());n(F)?(Pd("transaction failed: Data returned ",F,
k.path),m=G(F),"object"===typeof F&&null!=F&&eb(F,".priority")||(m=m.fa(z.C())),z=k.Ba,F=xh(a),F=Jb(m,F),k.dd=m,k.ed=F,k.Ba=a.vd++,Fa(f,z),e=e.concat(bh(a.K,k.path,F,k.Ba,k.He)),e=e.concat(eh(a.K,z,!0))):(l=!0,u="nodata",e=e.concat(eh(a.K,k.Ba,!0)))}cf(a.ca,c,e);e=[];l&&(b[h].status=3,setTimeout(b[h].Rd,Math.floor(0)),b[h].G&&("nodata"===u?(k=new U(a,b[h].path),d.push(q(b[h].G,null,null,!1,new V(b[h].cd,k,H)))):d.push(q(b[h].G,null,Error(u),!1,null))))}Ih(a,a.mc);for(h=0;h<d.length;h++)fc(d[h]);Hh(a)}}
function Lh(a,b){for(var c,d=a.mc;null!==(c=K(b))&&null===d.Ca();)d=Uc(d,c),b=N(b);return d}function Jh(a,b){var c=[];Nh(a,b,c);c.sort(function(a,b){return a.ef-b.ef});return c}function Nh(a,b,c){var d=b.Ca();if(null!==d)for(var e=0;e<d.length;e++)c.push(d[e]);b.O(function(b){Nh(a,b,c)})}function Ih(a,b){var c=b.Ca();if(c){for(var d=0,e=0;e<c.length;e++)3!==c[e].status&&(c[d]=c[e],d++);c.length=d;Vc(b,0<c.length?c:null)}b.O(function(b){Ih(a,b)})}
function Bh(a,b){var c=Lh(a,b).path(),d=Uc(a.mc,b);Yc(d,function(b){Oh(a,b)});Oh(a,d);Xc(d,function(b){Oh(a,b)});return c}
function Oh(a,b){var c=b.Ca();if(null!==c){for(var d=[],e=[],f=-1,h=0;h<c.length;h++)4!==c[h].status&&(2===c[h].status?(D(f===h-1,"All SENT items should be at beginning of queue."),f=h,c[h].status=4,c[h].Td="set"):(D(1===c[h].status,"Unexpected transaction status in abort"),c[h].Rd(),e=e.concat(eh(a.K,c[h].Ba,!0)),c[h].G&&d.push(q(c[h].G,null,Error("set"),!1,null))));-1===f?Vc(b,null):c.length=f+1;cf(a.ca,b.path(),e);for(h=0;h<d.length;h++)fc(d[h])}};function Ug(){this.lb={};this.wf=!1}Ug.prototype.ab=function(){for(var a in this.lb)this.lb[a].ab()};Ug.prototype.kc=function(){for(var a in this.lb)this.lb[a].kc()};Ug.prototype.ce=function(a){this.wf=a};ca(Ug);Ug.prototype.interrupt=Ug.prototype.ab;Ug.prototype.resume=Ug.prototype.kc;var W={};W.nc=Ag;W.DataConnection=W.nc;Ag.prototype.ng=function(a,b){this.ua("q",{p:a},b)};W.nc.prototype.simpleListen=W.nc.prototype.ng;Ag.prototype.Hf=function(a,b){this.ua("echo",{d:a},b)};W.nc.prototype.echo=W.nc.prototype.Hf;Ag.prototype.interrupt=Ag.prototype.ab;W.zf=og;W.RealTimeConnection=W.zf;og.prototype.sendRequest=og.prototype.ua;og.prototype.close=og.prototype.close;
W.Rf=function(a){var b=Ag.prototype.put;Ag.prototype.put=function(c,d,e,f){n(f)&&(f=a());b.call(this,c,d,e,f)};return function(){Ag.prototype.put=b}};W.hijackHash=W.Rf;W.yf=zb;W.ConnectionTarget=W.yf;W.ja=function(a){return a.ja()};W.queryIdentifier=W.ja;W.Uf=function(a){return a.u.Ra.$};W.listens=W.Uf;W.ce=function(a){Ug.Vb().ce(a)};W.forceRestClient=W.ce;W.Context=Ug;function Ph(a,b){this.committed=a;this.snapshot=b};function X(a,b,c,d){this.u=a;this.path=b;this.m=c;this.Nc=d}
function Qh(a){var b=null,c=null;a.ka&&(b=ff(a));a.na&&(c=hf(a));if(a.g===tc){if(a.ka){if("[MIN_NAME]"!=ef(a))throw Error("Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().");if("string"!==typeof b)throw Error("Query: When ordering by key, the argument passed to startAt(), endAt(),or equalTo() must be a string.");}if(a.na){if("[MAX_NAME]"!=gf(a))throw Error("Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().");if("string"!==
typeof c)throw Error("Query: When ordering by key, the argument passed to startAt(), endAt(),or equalTo() must be a string.");}}else if(a.g===H){if(null!=b&&!Nd(b)||null!=c&&!Nd(c))throw Error("Query: When ordering by priority, the first argument passed to startAt(), endAt(), or equalTo() must be a valid priority value (null, a number, or a string).");}else if(D(a.g instanceof pc||a.g===wc,"unknown index type."),null!=b&&"object"===typeof b||null!=c&&"object"===typeof c)throw Error("Query: First argument passed to startAt(), endAt(), or equalTo() cannot be an object.");
}function Rh(a){if(a.ka&&a.na&&a.xa&&(!a.xa||""===a.mb))throw Error("Query: Can't combine startAt(), endAt(), and limit(). Use limitToFirst() or limitToLast() instead.");}function Sh(a,b){if(!0===a.Nc)throw Error(b+": You can't combine multiple orderBy calls.");}g=X.prototype;g.wb=function(){y("Query.ref",0,0,arguments.length);return new U(this.u,this.path)};
g.gc=function(a,b,c,d){y("Query.on",2,4,arguments.length);Td("Query.on",a,!1);B("Query.on",2,b,!1);var e=Th("Query.on",c,d);if("value"===a)Fh(this.u,this,new Vg(b,e.cancel||null,e.Ma||null));else{var f={};f[a]=b;Fh(this.u,this,new Wg(f,e.cancel,e.Ma))}return b};
g.Ic=function(a,b,c){y("Query.off",0,3,arguments.length);Td("Query.off",a,!0);B("Query.off",2,b,!0);ob("Query.off",3,c);var d=null,e=null;"value"===a?d=new Vg(b||null,null,c||null):a&&(b&&(e={},e[a]=b),d=new Wg(e,null,c||null));e=this.u;d=".info"===K(this.path)?e.pd.kb(this,d):e.K.kb(this,d);af(e.ca,this.path,d)};
g.$f=function(a,b){function c(k){f&&(f=!1,e.Ic(a,c),b&&b.call(d.Ma,k),h.resolve(k))}y("Query.once",1,4,arguments.length);Td("Query.once",a,!1);B("Query.once",2,b,!0);var d=Th("Query.once",arguments[2],arguments[3]),e=this,f=!0,h=new ib;kb(h.ra);this.gc(a,c,function(b){e.Ic(a,c);d.cancel&&d.cancel.call(d.Ma,b);h.reject(b)});return h.ra};
g.ne=function(a){y("Query.limitToFirst",1,1,arguments.length);if(!ga(a)||Math.floor(a)!==a||0>=a)throw Error("Query.limitToFirst: First argument must be a positive integer.");if(this.m.xa)throw Error("Query.limitToFirst: Limit was already set (by another call to limit, limitToFirst, or limitToLast).");return new X(this.u,this.path,this.m.ne(a),this.Nc)};
g.oe=function(a){y("Query.limitToLast",1,1,arguments.length);if(!ga(a)||Math.floor(a)!==a||0>=a)throw Error("Query.limitToLast: First argument must be a positive integer.");if(this.m.xa)throw Error("Query.limitToLast: Limit was already set (by another call to limit, limitToFirst, or limitToLast).");return new X(this.u,this.path,this.m.oe(a),this.Nc)};
g.ag=function(a){y("Query.orderByChild",1,1,arguments.length);if("$key"===a)throw Error('Query.orderByChild: "$key" is invalid.  Use Query.orderByKey() instead.');if("$priority"===a)throw Error('Query.orderByChild: "$priority" is invalid.  Use Query.orderByPriority() instead.');if("$value"===a)throw Error('Query.orderByChild: "$value" is invalid.  Use Query.orderByValue() instead.');Vd("Query.orderByChild",a);Sh(this,"Query.orderByChild");var b=new E(a);if(b.e())throw Error("Query.orderByChild: cannot pass in empty path.  Use Query.orderByValue() instead.");
b=new pc(b);b=of(this.m,b);Qh(b);return new X(this.u,this.path,b,!0)};g.bg=function(){y("Query.orderByKey",0,0,arguments.length);Sh(this,"Query.orderByKey");var a=of(this.m,tc);Qh(a);return new X(this.u,this.path,a,!0)};g.cg=function(){y("Query.orderByPriority",0,0,arguments.length);Sh(this,"Query.orderByPriority");var a=of(this.m,H);Qh(a);return new X(this.u,this.path,a,!0)};
g.dg=function(){y("Query.orderByValue",0,0,arguments.length);Sh(this,"Query.orderByValue");var a=of(this.m,wc);Qh(a);return new X(this.u,this.path,a,!0)};g.Nd=function(a,b){y("Query.startAt",0,2,arguments.length);Od("Query.startAt",a,this.path,!0);Ud("Query.startAt",b);var c=this.m.Nd(a,b);Rh(c);Qh(c);if(this.m.ka)throw Error("Query.startAt: Starting point was already set (by another call to startAt or equalTo).");n(a)||(b=a=null);return new X(this.u,this.path,c,this.Nc)};
g.gd=function(a,b){y("Query.endAt",0,2,arguments.length);Od("Query.endAt",a,this.path,!0);Ud("Query.endAt",b);var c=this.m.gd(a,b);Rh(c);Qh(c);if(this.m.na)throw Error("Query.endAt: Ending point was already set (by another call to endAt or equalTo).");return new X(this.u,this.path,c,this.Nc)};
g.If=function(a,b){y("Query.equalTo",1,2,arguments.length);Od("Query.equalTo",a,this.path,!1);Ud("Query.equalTo",b);if(this.m.ka)throw Error("Query.equalTo: Starting point was already set (by another call to startAt or equalTo).");if(this.m.na)throw Error("Query.equalTo: Ending point was already set (by another call to endAt or equalTo).");return this.Nd(a,b).gd(a,b)};
g.toString=function(){y("Query.toString",0,0,arguments.length);for(var a=this.path,b="",c=a.Y;c<a.o.length;c++)""!==a.o[c]&&(b+="/"+encodeURIComponent(String(a.o[c])));return this.u.toString()+(b||"/")};g.toJSON=function(){y("Query.toJSON",0,1,arguments.length);return this.toString()};g.ja=function(){var a=ac(pf(this.m));return"{}"===a?"default":a};
g.isEqual=function(a){y("Query.isEqual",1,1,arguments.length);if(!(a instanceof X))throw Error("Query.isEqual failed: First argument must be an instance of firebase.database.Query.");var b=this.u===a.u,c=this.path.Z(a.path),d=this.ja()===a.ja();return b&&c&&d};
function Th(a,b,c){var d={cancel:null,Ma:null};if(b&&c)d.cancel=b,B(a,3,d.cancel,!0),d.Ma=c,ob(a,4,d.Ma);else if(b)if("object"===typeof b&&null!==b)d.Ma=b;else if("function"===typeof b)d.cancel=b;else throw Error(A(a,3,!0)+" must either be a cancel callback or a context object.");return d}X.prototype.on=X.prototype.gc;X.prototype.off=X.prototype.Ic;X.prototype.once=X.prototype.$f;X.prototype.limitToFirst=X.prototype.ne;X.prototype.limitToLast=X.prototype.oe;X.prototype.orderByChild=X.prototype.ag;
X.prototype.orderByKey=X.prototype.bg;X.prototype.orderByPriority=X.prototype.cg;X.prototype.orderByValue=X.prototype.dg;X.prototype.startAt=X.prototype.Nd;X.prototype.endAt=X.prototype.gd;X.prototype.equalTo=X.prototype.If;X.prototype.toString=X.prototype.toString;X.prototype.isEqual=X.prototype.isEqual;gc(X.prototype,"ref",X.prototype.wb);function Y(a,b){this.ta=a;this.qa=b}Y.prototype.cancel=function(a){y("Firebase.onDisconnect().cancel",0,1,arguments.length);B("Firebase.onDisconnect().cancel",1,a,!0);var b=new ib;this.ta.xd(this.qa,jb(b,a));return b.ra};Y.prototype.cancel=Y.prototype.cancel;Y.prototype.remove=function(a){y("Firebase.onDisconnect().remove",0,1,arguments.length);Wd("Firebase.onDisconnect().remove",this.qa);B("Firebase.onDisconnect().remove",1,a,!0);var b=new ib;Ch(this.ta,this.qa,null,jb(b,a));return b.ra};
Y.prototype.remove=Y.prototype.remove;Y.prototype.set=function(a,b){y("Firebase.onDisconnect().set",1,2,arguments.length);Wd("Firebase.onDisconnect().set",this.qa);Od("Firebase.onDisconnect().set",a,this.qa,!1);B("Firebase.onDisconnect().set",2,b,!0);var c=new ib;Ch(this.ta,this.qa,a,jb(c,b));return c.ra};Y.prototype.set=Y.prototype.set;
Y.prototype.Jb=function(a,b,c){y("Firebase.onDisconnect().setWithPriority",2,3,arguments.length);Wd("Firebase.onDisconnect().setWithPriority",this.qa);Od("Firebase.onDisconnect().setWithPriority",a,this.qa,!1);Sd("Firebase.onDisconnect().setWithPriority",2,b);B("Firebase.onDisconnect().setWithPriority",3,c,!0);var d=new ib;Dh(this.ta,this.qa,a,b,jb(d,c));return d.ra};Y.prototype.setWithPriority=Y.prototype.Jb;
Y.prototype.update=function(a,b){y("Firebase.onDisconnect().update",1,2,arguments.length);Wd("Firebase.onDisconnect().update",this.qa);if(ea(a)){for(var c={},d=0;d<a.length;++d)c[""+d]=a[d];a=c;J("Passing an Array to Firebase.onDisconnect().update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}Rd("Firebase.onDisconnect().update",a,this.qa);B("Firebase.onDisconnect().update",2,b,!0);
c=new ib;Eh(this.ta,this.qa,a,jb(c,b));return c.ra};Y.prototype.update=Y.prototype.update;var Z={Mf:function(){dg=Zf=!0}};Z.forceLongPolling=Z.Mf;Z.Nf=function(){eg=!0};Z.forceWebSockets=Z.Nf;Z.Tf=function(){return Yf.isAvailable()};Z.isWebSocketsAvailable=Z.Tf;Z.lg=function(a,b){a.u.Ra.ze=b};Z.setSecurityDebugCallback=Z.lg;Z.Be=function(a,b){a.u.Be(b)};Z.stats=Z.Be;Z.Ce=function(a,b){a.u.Ce(b)};Z.statsIncrementCounter=Z.Ce;Z.fd=function(a){return a.u.fd};Z.dataUpdateCount=Z.fd;Z.Sf=function(a,b){a.u.je=b};Z.interceptServerData=Z.Sf;function U(a,b){if(!(a instanceof Qg))throw Error("new Firebase() no longer supported - use app.database().");X.call(this,a,b,mf,!1);this.then=void 0;this["catch"]=void 0}la(U,X);g=U.prototype;g.getKey=function(){y("Firebase.key",0,0,arguments.length);return this.path.e()?null:Oc(this.path)};
g.n=function(a){y("Firebase.child",1,1,arguments.length);if(ga(a))a=String(a);else if(!(a instanceof E))if(null===K(this.path)){var b=a;b&&(b=b.replace(/^\/*\.info(\/|$)/,"/"));Vd("Firebase.child",b)}else Vd("Firebase.child",a);return new U(this.u,this.path.n(a))};g.getParent=function(){y("Firebase.parent",0,0,arguments.length);var a=this.path.parent();return null===a?null:new U(this.u,a)};
g.Of=function(){y("Firebase.ref",0,0,arguments.length);for(var a=this;null!==a.getParent();)a=a.getParent();return a};g.Gf=function(){return this.u.Ya};g.set=function(a,b){y("Firebase.set",1,2,arguments.length);Wd("Firebase.set",this.path);Od("Firebase.set",a,this.path,!1);B("Firebase.set",2,b,!0);var c=new ib;this.u.Jb(this.path,a,null,jb(c,b));return c.ra};
g.update=function(a,b){y("Firebase.update",1,2,arguments.length);Wd("Firebase.update",this.path);if(ea(a)){for(var c={},d=0;d<a.length;++d)c[""+d]=a[d];a=c;J("Passing an Array to Firebase.update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}Rd("Firebase.update",a,this.path);B("Firebase.update",2,b,!0);c=new ib;this.u.update(this.path,a,jb(c,b));return c.ra};
g.Jb=function(a,b,c){y("Firebase.setWithPriority",2,3,arguments.length);Wd("Firebase.setWithPriority",this.path);Od("Firebase.setWithPriority",a,this.path,!1);Sd("Firebase.setWithPriority",2,b);B("Firebase.setWithPriority",3,c,!0);if(".length"===this.getKey()||".keys"===this.getKey())throw"Firebase.setWithPriority failed: "+this.getKey()+" is a read-only object.";var d=new ib;this.u.Jb(this.path,a,b,jb(d,c));return d.ra};
g.remove=function(a){y("Firebase.remove",0,1,arguments.length);Wd("Firebase.remove",this.path);B("Firebase.remove",1,a,!0);return this.set(null,a)};
g.transaction=function(a,b,c){y("Firebase.transaction",1,3,arguments.length);Wd("Firebase.transaction",this.path);B("Firebase.transaction",1,a,!1);B("Firebase.transaction",2,b,!0);if(n(c)&&"boolean"!=typeof c)throw Error(A("Firebase.transaction",3,!0)+"must be a boolean.");if(".length"===this.getKey()||".keys"===this.getKey())throw"Firebase.transaction failed: "+this.getKey()+" is a read-only object.";"undefined"===typeof c&&(c=!0);var d=new ib;ha(b)&&kb(d.ra);Gh(this.u,this.path,a,function(a,c,h){a?
d.reject(a):d.resolve(new Ph(c,h));ha(b)&&b(a,c,h)},c);return d.ra};g.kg=function(a,b){y("Firebase.setPriority",1,2,arguments.length);Wd("Firebase.setPriority",this.path);Sd("Firebase.setPriority",1,a);B("Firebase.setPriority",2,b,!0);var c=new ib;this.u.Jb(this.path.n(".priority"),a,null,jb(c,b));return c.ra};
g.push=function(a,b){y("Firebase.push",0,2,arguments.length);Wd("Firebase.push",this.path);Od("Firebase.push",a,this.path,!0);B("Firebase.push",2,b,!0);var c=wh(this.u),d=Kc(c),c=this.n(d),e=this.n(d),d=null!=a?c.set(a,b).then(function(){return e}):hb.resolve(e);c.then=q(d.then,d);c["catch"]=q(d.then,d,void 0);ha(b)&&kb(d);return c};g.ib=function(){Wd("Firebase.onDisconnect",this.path);return new Y(this.u,this.path)};U.prototype.child=U.prototype.n;U.prototype.set=U.prototype.set;
U.prototype.update=U.prototype.update;U.prototype.setWithPriority=U.prototype.Jb;U.prototype.remove=U.prototype.remove;U.prototype.transaction=U.prototype.transaction;U.prototype.setPriority=U.prototype.kg;U.prototype.push=U.prototype.push;U.prototype.onDisconnect=U.prototype.ib;gc(U.prototype,"database",U.prototype.Gf);gc(U.prototype,"key",U.prototype.getKey);gc(U.prototype,"parent",U.prototype.getParent);gc(U.prototype,"root",U.prototype.Of);if("undefined"===typeof firebase)throw Error("Cannot install Firebase Database - be sure to load firebase-app.js first.");
try{firebase.INTERNAL.registerService("database",function(a){var b=Ug.Vb(),c=a.options.databaseURL;n(c)||Vb("Can't determine Firebase Database URL.  Be sure to include databaseURL option when calling firebase.intializeApp().");var d=Wb(c),c=d.jc;Xd("Invalid Firebase Database URL",d);d.path.e()||Vb("Database URL must point to the root of a Firebase Database (not including a child path).");(d=w(b.lb,a.name))&&Vb("FIREBASE INTERNAL ERROR: Database initialized multiple times.");d=new Qg(c,b.wf,a);b.lb[a.name]=
d;return d.Ya},{Reference:U,Query:X,Database:Pg,enableLogging:Sb,INTERNAL:Z,TEST_ACCESS:W,ServerValue:Sg})}catch(Uh){Vb("Failed to register the Firebase Database Service ("+Uh+")")};})();

}).call(typeof global !== undefined ? global : typeof self !== undefined ? self : typeof window !== undefined ? window : {});
module.exports = firebase.database;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./app":13}],16:[function(require,module,exports){
//! moment.js

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, (function () { 'use strict';

var hookCallback;

function hooks () {
    return hookCallback.apply(null, arguments);
}

// This is done to register the method called with moment()
// without creating circular dependencies.
function setHookCallback (callback) {
    hookCallback = callback;
}

function isArray(input) {
    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
}

function isObject(input) {
    // IE8 will treat undefined and null as object if it wasn't for
    // input != null
    return input != null && Object.prototype.toString.call(input) === '[object Object]';
}

function isObjectEmpty(obj) {
    if (Object.getOwnPropertyNames) {
        return (Object.getOwnPropertyNames(obj).length === 0);
    } else {
        var k;
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                return false;
            }
        }
        return true;
    }
}

function isUndefined(input) {
    return input === void 0;
}

function isNumber(input) {
    return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
}

function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}

function map(arr, fn) {
    var res = [], i;
    for (i = 0; i < arr.length; ++i) {
        res.push(fn(arr[i], i));
    }
    return res;
}

function hasOwnProp(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
}

function extend(a, b) {
    for (var i in b) {
        if (hasOwnProp(b, i)) {
            a[i] = b[i];
        }
    }

    if (hasOwnProp(b, 'toString')) {
        a.toString = b.toString;
    }

    if (hasOwnProp(b, 'valueOf')) {
        a.valueOf = b.valueOf;
    }

    return a;
}

function createUTC (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, true).utc();
}

function defaultParsingFlags() {
    // We need to deep clone this object.
    return {
        empty           : false,
        unusedTokens    : [],
        unusedInput     : [],
        overflow        : -2,
        charsLeftOver   : 0,
        nullInput       : false,
        invalidMonth    : null,
        invalidFormat   : false,
        userInvalidated : false,
        iso             : false,
        parsedDateParts : [],
        meridiem        : null,
        rfc2822         : false,
        weekdayMismatch : false
    };
}

function getParsingFlags(m) {
    if (m._pf == null) {
        m._pf = defaultParsingFlags();
    }
    return m._pf;
}

var some;
if (Array.prototype.some) {
    some = Array.prototype.some;
} else {
    some = function (fun) {
        var t = Object(this);
        var len = t.length >>> 0;

        for (var i = 0; i < len; i++) {
            if (i in t && fun.call(this, t[i], i, t)) {
                return true;
            }
        }

        return false;
    };
}

function isValid(m) {
    if (m._isValid == null) {
        var flags = getParsingFlags(m);
        var parsedParts = some.call(flags.parsedDateParts, function (i) {
            return i != null;
        });
        var isNowValid = !isNaN(m._d.getTime()) &&
            flags.overflow < 0 &&
            !flags.empty &&
            !flags.invalidMonth &&
            !flags.invalidWeekday &&
            !flags.weekdayMismatch &&
            !flags.nullInput &&
            !flags.invalidFormat &&
            !flags.userInvalidated &&
            (!flags.meridiem || (flags.meridiem && parsedParts));

        if (m._strict) {
            isNowValid = isNowValid &&
                flags.charsLeftOver === 0 &&
                flags.unusedTokens.length === 0 &&
                flags.bigHour === undefined;
        }

        if (Object.isFrozen == null || !Object.isFrozen(m)) {
            m._isValid = isNowValid;
        }
        else {
            return isNowValid;
        }
    }
    return m._isValid;
}

function createInvalid (flags) {
    var m = createUTC(NaN);
    if (flags != null) {
        extend(getParsingFlags(m), flags);
    }
    else {
        getParsingFlags(m).userInvalidated = true;
    }

    return m;
}

// Plugins that add properties should also add the key here (null value),
// so we can properly clone ourselves.
var momentProperties = hooks.momentProperties = [];

function copyConfig(to, from) {
    var i, prop, val;

    if (!isUndefined(from._isAMomentObject)) {
        to._isAMomentObject = from._isAMomentObject;
    }
    if (!isUndefined(from._i)) {
        to._i = from._i;
    }
    if (!isUndefined(from._f)) {
        to._f = from._f;
    }
    if (!isUndefined(from._l)) {
        to._l = from._l;
    }
    if (!isUndefined(from._strict)) {
        to._strict = from._strict;
    }
    if (!isUndefined(from._tzm)) {
        to._tzm = from._tzm;
    }
    if (!isUndefined(from._isUTC)) {
        to._isUTC = from._isUTC;
    }
    if (!isUndefined(from._offset)) {
        to._offset = from._offset;
    }
    if (!isUndefined(from._pf)) {
        to._pf = getParsingFlags(from);
    }
    if (!isUndefined(from._locale)) {
        to._locale = from._locale;
    }

    if (momentProperties.length > 0) {
        for (i = 0; i < momentProperties.length; i++) {
            prop = momentProperties[i];
            val = from[prop];
            if (!isUndefined(val)) {
                to[prop] = val;
            }
        }
    }

    return to;
}

var updateInProgress = false;

// Moment prototype object
function Moment(config) {
    copyConfig(this, config);
    this._d = new Date(config._d != null ? config._d.getTime() : NaN);
    if (!this.isValid()) {
        this._d = new Date(NaN);
    }
    // Prevent infinite loop in case updateOffset creates new moment
    // objects.
    if (updateInProgress === false) {
        updateInProgress = true;
        hooks.updateOffset(this);
        updateInProgress = false;
    }
}

function isMoment (obj) {
    return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
}

function absFloor (number) {
    if (number < 0) {
        // -0 -> 0
        return Math.ceil(number) || 0;
    } else {
        return Math.floor(number);
    }
}

function toInt(argumentForCoercion) {
    var coercedNumber = +argumentForCoercion,
        value = 0;

    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
        value = absFloor(coercedNumber);
    }

    return value;
}

// compare two arrays, return the number of differences
function compareArrays(array1, array2, dontConvert) {
    var len = Math.min(array1.length, array2.length),
        lengthDiff = Math.abs(array1.length - array2.length),
        diffs = 0,
        i;
    for (i = 0; i < len; i++) {
        if ((dontConvert && array1[i] !== array2[i]) ||
            (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
            diffs++;
        }
    }
    return diffs + lengthDiff;
}

function warn(msg) {
    if (hooks.suppressDeprecationWarnings === false &&
            (typeof console !==  'undefined') && console.warn) {
        console.warn('Deprecation warning: ' + msg);
    }
}

function deprecate(msg, fn) {
    var firstTime = true;

    return extend(function () {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(null, msg);
        }
        if (firstTime) {
            var args = [];
            var arg;
            for (var i = 0; i < arguments.length; i++) {
                arg = '';
                if (typeof arguments[i] === 'object') {
                    arg += '\n[' + i + '] ';
                    for (var key in arguments[0]) {
                        arg += key + ': ' + arguments[0][key] + ', ';
                    }
                    arg = arg.slice(0, -2); // Remove trailing comma and space
                } else {
                    arg = arguments[i];
                }
                args.push(arg);
            }
            warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
            firstTime = false;
        }
        return fn.apply(this, arguments);
    }, fn);
}

var deprecations = {};

function deprecateSimple(name, msg) {
    if (hooks.deprecationHandler != null) {
        hooks.deprecationHandler(name, msg);
    }
    if (!deprecations[name]) {
        warn(msg);
        deprecations[name] = true;
    }
}

hooks.suppressDeprecationWarnings = false;
hooks.deprecationHandler = null;

function isFunction(input) {
    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
}

function set (config) {
    var prop, i;
    for (i in config) {
        prop = config[i];
        if (isFunction(prop)) {
            this[i] = prop;
        } else {
            this['_' + i] = prop;
        }
    }
    this._config = config;
    // Lenient ordinal parsing accepts just a number in addition to
    // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
    // TODO: Remove "ordinalParse" fallback in next major release.
    this._dayOfMonthOrdinalParseLenient = new RegExp(
        (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
            '|' + (/\d{1,2}/).source);
}

function mergeConfigs(parentConfig, childConfig) {
    var res = extend({}, parentConfig), prop;
    for (prop in childConfig) {
        if (hasOwnProp(childConfig, prop)) {
            if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                res[prop] = {};
                extend(res[prop], parentConfig[prop]);
                extend(res[prop], childConfig[prop]);
            } else if (childConfig[prop] != null) {
                res[prop] = childConfig[prop];
            } else {
                delete res[prop];
            }
        }
    }
    for (prop in parentConfig) {
        if (hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])) {
            // make sure changes to properties don't modify parent config
            res[prop] = extend({}, res[prop]);
        }
    }
    return res;
}

function Locale(config) {
    if (config != null) {
        this.set(config);
    }
}

var keys;

if (Object.keys) {
    keys = Object.keys;
} else {
    keys = function (obj) {
        var i, res = [];
        for (i in obj) {
            if (hasOwnProp(obj, i)) {
                res.push(i);
            }
        }
        return res;
    };
}

var defaultCalendar = {
    sameDay : '[Today at] LT',
    nextDay : '[Tomorrow at] LT',
    nextWeek : 'dddd [at] LT',
    lastDay : '[Yesterday at] LT',
    lastWeek : '[Last] dddd [at] LT',
    sameElse : 'L'
};

function calendar (key, mom, now) {
    var output = this._calendar[key] || this._calendar['sameElse'];
    return isFunction(output) ? output.call(mom, now) : output;
}

var defaultLongDateFormat = {
    LTS  : 'h:mm:ss A',
    LT   : 'h:mm A',
    L    : 'MM/DD/YYYY',
    LL   : 'MMMM D, YYYY',
    LLL  : 'MMMM D, YYYY h:mm A',
    LLLL : 'dddd, MMMM D, YYYY h:mm A'
};

function longDateFormat (key) {
    var format = this._longDateFormat[key],
        formatUpper = this._longDateFormat[key.toUpperCase()];

    if (format || !formatUpper) {
        return format;
    }

    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
        return val.slice(1);
    });

    return this._longDateFormat[key];
}

var defaultInvalidDate = 'Invalid date';

function invalidDate () {
    return this._invalidDate;
}

var defaultOrdinal = '%d';
var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

function ordinal (number) {
    return this._ordinal.replace('%d', number);
}

var defaultRelativeTime = {
    future : 'in %s',
    past   : '%s ago',
    s  : 'a few seconds',
    ss : '%d seconds',
    m  : 'a minute',
    mm : '%d minutes',
    h  : 'an hour',
    hh : '%d hours',
    d  : 'a day',
    dd : '%d days',
    M  : 'a month',
    MM : '%d months',
    y  : 'a year',
    yy : '%d years'
};

function relativeTime (number, withoutSuffix, string, isFuture) {
    var output = this._relativeTime[string];
    return (isFunction(output)) ?
        output(number, withoutSuffix, string, isFuture) :
        output.replace(/%d/i, number);
}

function pastFuture (diff, output) {
    var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
    return isFunction(format) ? format(output) : format.replace(/%s/i, output);
}

var aliases = {};

function addUnitAlias (unit, shorthand) {
    var lowerCase = unit.toLowerCase();
    aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
}

function normalizeUnits(units) {
    return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
}

function normalizeObjectUnits(inputObject) {
    var normalizedInput = {},
        normalizedProp,
        prop;

    for (prop in inputObject) {
        if (hasOwnProp(inputObject, prop)) {
            normalizedProp = normalizeUnits(prop);
            if (normalizedProp) {
                normalizedInput[normalizedProp] = inputObject[prop];
            }
        }
    }

    return normalizedInput;
}

var priorities = {};

function addUnitPriority(unit, priority) {
    priorities[unit] = priority;
}

function getPrioritizedUnits(unitsObj) {
    var units = [];
    for (var u in unitsObj) {
        units.push({unit: u, priority: priorities[u]});
    }
    units.sort(function (a, b) {
        return a.priority - b.priority;
    });
    return units;
}

function zeroFill(number, targetLength, forceSign) {
    var absNumber = '' + Math.abs(number),
        zerosToFill = targetLength - absNumber.length,
        sign = number >= 0;
    return (sign ? (forceSign ? '+' : '') : '-') +
        Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
}

var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

var formatFunctions = {};

var formatTokenFunctions = {};

// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
function addFormatToken (token, padded, ordinal, callback) {
    var func = callback;
    if (typeof callback === 'string') {
        func = function () {
            return this[callback]();
        };
    }
    if (token) {
        formatTokenFunctions[token] = func;
    }
    if (padded) {
        formatTokenFunctions[padded[0]] = function () {
            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
        };
    }
    if (ordinal) {
        formatTokenFunctions[ordinal] = function () {
            return this.localeData().ordinal(func.apply(this, arguments), token);
        };
    }
}

function removeFormattingTokens(input) {
    if (input.match(/\[[\s\S]/)) {
        return input.replace(/^\[|\]$/g, '');
    }
    return input.replace(/\\/g, '');
}

function makeFormatFunction(format) {
    var array = format.match(formattingTokens), i, length;

    for (i = 0, length = array.length; i < length; i++) {
        if (formatTokenFunctions[array[i]]) {
            array[i] = formatTokenFunctions[array[i]];
        } else {
            array[i] = removeFormattingTokens(array[i]);
        }
    }

    return function (mom) {
        var output = '', i;
        for (i = 0; i < length; i++) {
            output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
        }
        return output;
    };
}

// format date using native date object
function formatMoment(m, format) {
    if (!m.isValid()) {
        return m.localeData().invalidDate();
    }

    format = expandFormat(format, m.localeData());
    formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

    return formatFunctions[format](m);
}

function expandFormat(format, locale) {
    var i = 5;

    function replaceLongDateFormatTokens(input) {
        return locale.longDateFormat(input) || input;
    }

    localFormattingTokens.lastIndex = 0;
    while (i >= 0 && localFormattingTokens.test(format)) {
        format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
        localFormattingTokens.lastIndex = 0;
        i -= 1;
    }

    return format;
}

var match1         = /\d/;            //       0 - 9
var match2         = /\d\d/;          //      00 - 99
var match3         = /\d{3}/;         //     000 - 999
var match4         = /\d{4}/;         //    0000 - 9999
var match6         = /[+-]?\d{6}/;    // -999999 - 999999
var match1to2      = /\d\d?/;         //       0 - 99
var match3to4      = /\d\d\d\d?/;     //     999 - 9999
var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
var match1to3      = /\d{1,3}/;       //       0 - 999
var match1to4      = /\d{1,4}/;       //       0 - 9999
var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

var matchUnsigned  = /\d+/;           //       0 - inf
var matchSigned    = /[+-]?\d+/;      //    -inf - inf

var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

// any word (or two) characters or numbers including two/three word month in arabic.
// includes scottish gaelic two word and hyphenated months
var matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;

var regexes = {};

function addRegexToken (token, regex, strictRegex) {
    regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
        return (isStrict && strictRegex) ? strictRegex : regex;
    };
}

function getParseRegexForToken (token, config) {
    if (!hasOwnProp(regexes, token)) {
        return new RegExp(unescapeFormat(token));
    }

    return regexes[token](config._strict, config._locale);
}

// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function unescapeFormat(s) {
    return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
        return p1 || p2 || p3 || p4;
    }));
}

function regexEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

var tokens = {};

function addParseToken (token, callback) {
    var i, func = callback;
    if (typeof token === 'string') {
        token = [token];
    }
    if (isNumber(callback)) {
        func = function (input, array) {
            array[callback] = toInt(input);
        };
    }
    for (i = 0; i < token.length; i++) {
        tokens[token[i]] = func;
    }
}

function addWeekParseToken (token, callback) {
    addParseToken(token, function (input, array, config, token) {
        config._w = config._w || {};
        callback(input, config._w, config, token);
    });
}

function addTimeToArrayFromToken(token, input, config) {
    if (input != null && hasOwnProp(tokens, token)) {
        tokens[token](input, config._a, config, token);
    }
}

var YEAR = 0;
var MONTH = 1;
var DATE = 2;
var HOUR = 3;
var MINUTE = 4;
var SECOND = 5;
var MILLISECOND = 6;
var WEEK = 7;
var WEEKDAY = 8;

// FORMATTING

addFormatToken('Y', 0, 0, function () {
    var y = this.year();
    return y <= 9999 ? '' + y : '+' + y;
});

addFormatToken(0, ['YY', 2], 0, function () {
    return this.year() % 100;
});

addFormatToken(0, ['YYYY',   4],       0, 'year');
addFormatToken(0, ['YYYYY',  5],       0, 'year');
addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

// ALIASES

addUnitAlias('year', 'y');

// PRIORITIES

addUnitPriority('year', 1);

// PARSING

addRegexToken('Y',      matchSigned);
addRegexToken('YY',     match1to2, match2);
addRegexToken('YYYY',   match1to4, match4);
addRegexToken('YYYYY',  match1to6, match6);
addRegexToken('YYYYYY', match1to6, match6);

addParseToken(['YYYYY', 'YYYYYY'], YEAR);
addParseToken('YYYY', function (input, array) {
    array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
});
addParseToken('YY', function (input, array) {
    array[YEAR] = hooks.parseTwoDigitYear(input);
});
addParseToken('Y', function (input, array) {
    array[YEAR] = parseInt(input, 10);
});

// HELPERS

function daysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// HOOKS

hooks.parseTwoDigitYear = function (input) {
    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
};

// MOMENTS

var getSetYear = makeGetSet('FullYear', true);

function getIsLeapYear () {
    return isLeapYear(this.year());
}

function makeGetSet (unit, keepTime) {
    return function (value) {
        if (value != null) {
            set$1(this, unit, value);
            hooks.updateOffset(this, keepTime);
            return this;
        } else {
            return get(this, unit);
        }
    };
}

function get (mom, unit) {
    return mom.isValid() ?
        mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
}

function set$1 (mom, unit, value) {
    if (mom.isValid() && !isNaN(value)) {
        if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
        }
        else {
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }
}

// MOMENTS

function stringGet (units) {
    units = normalizeUnits(units);
    if (isFunction(this[units])) {
        return this[units]();
    }
    return this;
}


function stringSet (units, value) {
    if (typeof units === 'object') {
        units = normalizeObjectUnits(units);
        var prioritized = getPrioritizedUnits(units);
        for (var i = 0; i < prioritized.length; i++) {
            this[prioritized[i].unit](units[prioritized[i].unit]);
        }
    } else {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units](value);
        }
    }
    return this;
}

function mod(n, x) {
    return ((n % x) + x) % x;
}

var indexOf;

if (Array.prototype.indexOf) {
    indexOf = Array.prototype.indexOf;
} else {
    indexOf = function (o) {
        // I know
        var i;
        for (i = 0; i < this.length; ++i) {
            if (this[i] === o) {
                return i;
            }
        }
        return -1;
    };
}

function daysInMonth(year, month) {
    if (isNaN(year) || isNaN(month)) {
        return NaN;
    }
    var modMonth = mod(month, 12);
    year += (month - modMonth) / 12;
    return modMonth === 1 ? (isLeapYear(year) ? 29 : 28) : (31 - modMonth % 7 % 2);
}

// FORMATTING

addFormatToken('M', ['MM', 2], 'Mo', function () {
    return this.month() + 1;
});

addFormatToken('MMM', 0, 0, function (format) {
    return this.localeData().monthsShort(this, format);
});

addFormatToken('MMMM', 0, 0, function (format) {
    return this.localeData().months(this, format);
});

// ALIASES

addUnitAlias('month', 'M');

// PRIORITY

addUnitPriority('month', 8);

// PARSING

addRegexToken('M',    match1to2);
addRegexToken('MM',   match1to2, match2);
addRegexToken('MMM',  function (isStrict, locale) {
    return locale.monthsShortRegex(isStrict);
});
addRegexToken('MMMM', function (isStrict, locale) {
    return locale.monthsRegex(isStrict);
});

addParseToken(['M', 'MM'], function (input, array) {
    array[MONTH] = toInt(input) - 1;
});

addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
    var month = config._locale.monthsParse(input, token, config._strict);
    // if we didn't find a month name, mark the date as invalid.
    if (month != null) {
        array[MONTH] = month;
    } else {
        getParsingFlags(config).invalidMonth = input;
    }
});

// LOCALES

var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
function localeMonths (m, format) {
    if (!m) {
        return isArray(this._months) ? this._months :
            this._months['standalone'];
    }
    return isArray(this._months) ? this._months[m.month()] :
        this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
}

var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
function localeMonthsShort (m, format) {
    if (!m) {
        return isArray(this._monthsShort) ? this._monthsShort :
            this._monthsShort['standalone'];
    }
    return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
        this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
}

function handleStrictParse(monthName, format, strict) {
    var i, ii, mom, llc = monthName.toLocaleLowerCase();
    if (!this._monthsParse) {
        // this is not used
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
        for (i = 0; i < 12; ++i) {
            mom = createUTC([2000, i]);
            this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
            this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'MMM') {
            ii = indexOf.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'MMM') {
            ii = indexOf.call(this._shortMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf.call(this._longMonthsParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeMonthsParse (monthName, format, strict) {
    var i, mom, regex;

    if (this._monthsParseExact) {
        return handleStrictParse.call(this, monthName, format, strict);
    }

    if (!this._monthsParse) {
        this._monthsParse = [];
        this._longMonthsParse = [];
        this._shortMonthsParse = [];
    }

    // TODO: add sorting
    // Sorting makes sure if one month (or abbr) is a prefix of another
    // see sorting in computeMonthsParse
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        if (strict && !this._longMonthsParse[i]) {
            this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
            this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
        }
        if (!strict && !this._monthsParse[i]) {
            regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
            this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
            return i;
        } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
            return i;
        } else if (!strict && this._monthsParse[i].test(monthName)) {
            return i;
        }
    }
}

// MOMENTS

function setMonth (mom, value) {
    var dayOfMonth;

    if (!mom.isValid()) {
        // No op
        return mom;
    }

    if (typeof value === 'string') {
        if (/^\d+$/.test(value)) {
            value = toInt(value);
        } else {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (!isNumber(value)) {
                return mom;
            }
        }
    }

    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
    mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
    return mom;
}

function getSetMonth (value) {
    if (value != null) {
        setMonth(this, value);
        hooks.updateOffset(this, true);
        return this;
    } else {
        return get(this, 'Month');
    }
}

function getDaysInMonth () {
    return daysInMonth(this.year(), this.month());
}

var defaultMonthsShortRegex = matchWord;
function monthsShortRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsShortStrictRegex;
        } else {
            return this._monthsShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsShortRegex')) {
            this._monthsShortRegex = defaultMonthsShortRegex;
        }
        return this._monthsShortStrictRegex && isStrict ?
            this._monthsShortStrictRegex : this._monthsShortRegex;
    }
}

var defaultMonthsRegex = matchWord;
function monthsRegex (isStrict) {
    if (this._monthsParseExact) {
        if (!hasOwnProp(this, '_monthsRegex')) {
            computeMonthsParse.call(this);
        }
        if (isStrict) {
            return this._monthsStrictRegex;
        } else {
            return this._monthsRegex;
        }
    } else {
        if (!hasOwnProp(this, '_monthsRegex')) {
            this._monthsRegex = defaultMonthsRegex;
        }
        return this._monthsStrictRegex && isStrict ?
            this._monthsStrictRegex : this._monthsRegex;
    }
}

function computeMonthsParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom;
    for (i = 0; i < 12; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, i]);
        shortPieces.push(this.monthsShort(mom, ''));
        longPieces.push(this.months(mom, ''));
        mixedPieces.push(this.months(mom, ''));
        mixedPieces.push(this.monthsShort(mom, ''));
    }
    // Sorting makes sure if one month (or abbr) is a prefix of another it
    // will match the longer piece.
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 12; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
    }
    for (i = 0; i < 24; i++) {
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._monthsShortRegex = this._monthsRegex;
    this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
}

function createDate (y, m, d, h, M, s, ms) {
    // can't just apply() to create a date:
    // https://stackoverflow.com/q/181348
    var date = new Date(y, m, d, h, M, s, ms);

    // the date constructor remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
        date.setFullYear(y);
    }
    return date;
}

function createUTCDate (y) {
    var date = new Date(Date.UTC.apply(null, arguments));

    // the Date.UTC function remaps years 0-99 to 1900-1999
    if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
        date.setUTCFullYear(y);
    }
    return date;
}

// start-of-first-week - start-of-year
function firstWeekOffset(year, dow, doy) {
    var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
        fwd = 7 + dow - doy,
        // first-week day local weekday -- which local weekday is fwd
        fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

    return -fwdlw + fwd - 1;
}

// https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
    var localWeekday = (7 + weekday - dow) % 7,
        weekOffset = firstWeekOffset(year, dow, doy),
        dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
        resYear, resDayOfYear;

    if (dayOfYear <= 0) {
        resYear = year - 1;
        resDayOfYear = daysInYear(resYear) + dayOfYear;
    } else if (dayOfYear > daysInYear(year)) {
        resYear = year + 1;
        resDayOfYear = dayOfYear - daysInYear(year);
    } else {
        resYear = year;
        resDayOfYear = dayOfYear;
    }

    return {
        year: resYear,
        dayOfYear: resDayOfYear
    };
}

function weekOfYear(mom, dow, doy) {
    var weekOffset = firstWeekOffset(mom.year(), dow, doy),
        week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
        resWeek, resYear;

    if (week < 1) {
        resYear = mom.year() - 1;
        resWeek = week + weeksInYear(resYear, dow, doy);
    } else if (week > weeksInYear(mom.year(), dow, doy)) {
        resWeek = week - weeksInYear(mom.year(), dow, doy);
        resYear = mom.year() + 1;
    } else {
        resYear = mom.year();
        resWeek = week;
    }

    return {
        week: resWeek,
        year: resYear
    };
}

function weeksInYear(year, dow, doy) {
    var weekOffset = firstWeekOffset(year, dow, doy),
        weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
}

// FORMATTING

addFormatToken('w', ['ww', 2], 'wo', 'week');
addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

// ALIASES

addUnitAlias('week', 'w');
addUnitAlias('isoWeek', 'W');

// PRIORITIES

addUnitPriority('week', 5);
addUnitPriority('isoWeek', 5);

// PARSING

addRegexToken('w',  match1to2);
addRegexToken('ww', match1to2, match2);
addRegexToken('W',  match1to2);
addRegexToken('WW', match1to2, match2);

addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
    week[token.substr(0, 1)] = toInt(input);
});

// HELPERS

// LOCALES

function localeWeek (mom) {
    return weekOfYear(mom, this._week.dow, this._week.doy).week;
}

var defaultLocaleWeek = {
    dow : 0, // Sunday is the first day of the week.
    doy : 6  // The week that contains Jan 1st is the first week of the year.
};

function localeFirstDayOfWeek () {
    return this._week.dow;
}

function localeFirstDayOfYear () {
    return this._week.doy;
}

// MOMENTS

function getSetWeek (input) {
    var week = this.localeData().week(this);
    return input == null ? week : this.add((input - week) * 7, 'd');
}

function getSetISOWeek (input) {
    var week = weekOfYear(this, 1, 4).week;
    return input == null ? week : this.add((input - week) * 7, 'd');
}

// FORMATTING

addFormatToken('d', 0, 'do', 'day');

addFormatToken('dd', 0, 0, function (format) {
    return this.localeData().weekdaysMin(this, format);
});

addFormatToken('ddd', 0, 0, function (format) {
    return this.localeData().weekdaysShort(this, format);
});

addFormatToken('dddd', 0, 0, function (format) {
    return this.localeData().weekdays(this, format);
});

addFormatToken('e', 0, 0, 'weekday');
addFormatToken('E', 0, 0, 'isoWeekday');

// ALIASES

addUnitAlias('day', 'd');
addUnitAlias('weekday', 'e');
addUnitAlias('isoWeekday', 'E');

// PRIORITY
addUnitPriority('day', 11);
addUnitPriority('weekday', 11);
addUnitPriority('isoWeekday', 11);

// PARSING

addRegexToken('d',    match1to2);
addRegexToken('e',    match1to2);
addRegexToken('E',    match1to2);
addRegexToken('dd',   function (isStrict, locale) {
    return locale.weekdaysMinRegex(isStrict);
});
addRegexToken('ddd',   function (isStrict, locale) {
    return locale.weekdaysShortRegex(isStrict);
});
addRegexToken('dddd',   function (isStrict, locale) {
    return locale.weekdaysRegex(isStrict);
});

addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
    var weekday = config._locale.weekdaysParse(input, token, config._strict);
    // if we didn't get a weekday name, mark the date as invalid
    if (weekday != null) {
        week.d = weekday;
    } else {
        getParsingFlags(config).invalidWeekday = input;
    }
});

addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
    week[token] = toInt(input);
});

// HELPERS

function parseWeekday(input, locale) {
    if (typeof input !== 'string') {
        return input;
    }

    if (!isNaN(input)) {
        return parseInt(input, 10);
    }

    input = locale.weekdaysParse(input);
    if (typeof input === 'number') {
        return input;
    }

    return null;
}

function parseIsoWeekday(input, locale) {
    if (typeof input === 'string') {
        return locale.weekdaysParse(input) % 7 || 7;
    }
    return isNaN(input) ? null : input;
}

// LOCALES

var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
function localeWeekdays (m, format) {
    if (!m) {
        return isArray(this._weekdays) ? this._weekdays :
            this._weekdays['standalone'];
    }
    return isArray(this._weekdays) ? this._weekdays[m.day()] :
        this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
}

var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
function localeWeekdaysShort (m) {
    return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
}

var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
function localeWeekdaysMin (m) {
    return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
}

function handleStrictParse$1(weekdayName, format, strict) {
    var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._minWeekdaysParse = [];

        for (i = 0; i < 7; ++i) {
            mom = createUTC([2000, 1]).day(i);
            this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
            this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
            this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
        }
    }

    if (strict) {
        if (format === 'dddd') {
            ii = indexOf.call(this._weekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    } else {
        if (format === 'dddd') {
            ii = indexOf.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else if (format === 'ddd') {
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        } else {
            ii = indexOf.call(this._minWeekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._weekdaysParse, llc);
            if (ii !== -1) {
                return ii;
            }
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
        }
    }
}

function localeWeekdaysParse (weekdayName, format, strict) {
    var i, mom, regex;

    if (this._weekdaysParseExact) {
        return handleStrictParse$1.call(this, weekdayName, format, strict);
    }

    if (!this._weekdaysParse) {
        this._weekdaysParse = [];
        this._minWeekdaysParse = [];
        this._shortWeekdaysParse = [];
        this._fullWeekdaysParse = [];
    }

    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already

        mom = createUTC([2000, 1]).day(i);
        if (strict && !this._fullWeekdaysParse[i]) {
            this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
            this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
            this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
        }
        if (!this._weekdaysParse[i]) {
            regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
            this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
        }
        // test the regex
        if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
            return i;
        } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
            return i;
        }
    }
}

// MOMENTS

function getSetDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    if (input != null) {
        input = parseWeekday(input, this.localeData());
        return this.add(input - day, 'd');
    } else {
        return day;
    }
}

function getSetLocaleDayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
    return input == null ? weekday : this.add(input - weekday, 'd');
}

function getSetISODayOfWeek (input) {
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }

    // behaves the same as moment#day except
    // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
    // as a setter, sunday should belong to the previous week.

    if (input != null) {
        var weekday = parseIsoWeekday(input, this.localeData());
        return this.day(this.day() % 7 ? weekday : weekday - 7);
    } else {
        return this.day() || 7;
    }
}

var defaultWeekdaysRegex = matchWord;
function weekdaysRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysStrictRegex;
        } else {
            return this._weekdaysRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            this._weekdaysRegex = defaultWeekdaysRegex;
        }
        return this._weekdaysStrictRegex && isStrict ?
            this._weekdaysStrictRegex : this._weekdaysRegex;
    }
}

var defaultWeekdaysShortRegex = matchWord;
function weekdaysShortRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysShortStrictRegex;
        } else {
            return this._weekdaysShortRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysShortRegex')) {
            this._weekdaysShortRegex = defaultWeekdaysShortRegex;
        }
        return this._weekdaysShortStrictRegex && isStrict ?
            this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
    }
}

var defaultWeekdaysMinRegex = matchWord;
function weekdaysMinRegex (isStrict) {
    if (this._weekdaysParseExact) {
        if (!hasOwnProp(this, '_weekdaysRegex')) {
            computeWeekdaysParse.call(this);
        }
        if (isStrict) {
            return this._weekdaysMinStrictRegex;
        } else {
            return this._weekdaysMinRegex;
        }
    } else {
        if (!hasOwnProp(this, '_weekdaysMinRegex')) {
            this._weekdaysMinRegex = defaultWeekdaysMinRegex;
        }
        return this._weekdaysMinStrictRegex && isStrict ?
            this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
    }
}


function computeWeekdaysParse () {
    function cmpLenRev(a, b) {
        return b.length - a.length;
    }

    var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
        i, mom, minp, shortp, longp;
    for (i = 0; i < 7; i++) {
        // make the regex if we don't have it already
        mom = createUTC([2000, 1]).day(i);
        minp = this.weekdaysMin(mom, '');
        shortp = this.weekdaysShort(mom, '');
        longp = this.weekdays(mom, '');
        minPieces.push(minp);
        shortPieces.push(shortp);
        longPieces.push(longp);
        mixedPieces.push(minp);
        mixedPieces.push(shortp);
        mixedPieces.push(longp);
    }
    // Sorting makes sure if one weekday (or abbr) is a prefix of another it
    // will match the longer piece.
    minPieces.sort(cmpLenRev);
    shortPieces.sort(cmpLenRev);
    longPieces.sort(cmpLenRev);
    mixedPieces.sort(cmpLenRev);
    for (i = 0; i < 7; i++) {
        shortPieces[i] = regexEscape(shortPieces[i]);
        longPieces[i] = regexEscape(longPieces[i]);
        mixedPieces[i] = regexEscape(mixedPieces[i]);
    }

    this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
    this._weekdaysShortRegex = this._weekdaysRegex;
    this._weekdaysMinRegex = this._weekdaysRegex;

    this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
    this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
}

// FORMATTING

function hFormat() {
    return this.hours() % 12 || 12;
}

function kFormat() {
    return this.hours() || 24;
}

addFormatToken('H', ['HH', 2], 0, 'hour');
addFormatToken('h', ['hh', 2], 0, hFormat);
addFormatToken('k', ['kk', 2], 0, kFormat);

addFormatToken('hmm', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
});

addFormatToken('hmmss', 0, 0, function () {
    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

addFormatToken('Hmm', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2);
});

addFormatToken('Hmmss', 0, 0, function () {
    return '' + this.hours() + zeroFill(this.minutes(), 2) +
        zeroFill(this.seconds(), 2);
});

function meridiem (token, lowercase) {
    addFormatToken(token, 0, 0, function () {
        return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
    });
}

meridiem('a', true);
meridiem('A', false);

// ALIASES

addUnitAlias('hour', 'h');

// PRIORITY
addUnitPriority('hour', 13);

// PARSING

function matchMeridiem (isStrict, locale) {
    return locale._meridiemParse;
}

addRegexToken('a',  matchMeridiem);
addRegexToken('A',  matchMeridiem);
addRegexToken('H',  match1to2);
addRegexToken('h',  match1to2);
addRegexToken('k',  match1to2);
addRegexToken('HH', match1to2, match2);
addRegexToken('hh', match1to2, match2);
addRegexToken('kk', match1to2, match2);

addRegexToken('hmm', match3to4);
addRegexToken('hmmss', match5to6);
addRegexToken('Hmm', match3to4);
addRegexToken('Hmmss', match5to6);

addParseToken(['H', 'HH'], HOUR);
addParseToken(['k', 'kk'], function (input, array, config) {
    var kInput = toInt(input);
    array[HOUR] = kInput === 24 ? 0 : kInput;
});
addParseToken(['a', 'A'], function (input, array, config) {
    config._isPm = config._locale.isPM(input);
    config._meridiem = input;
});
addParseToken(['h', 'hh'], function (input, array, config) {
    array[HOUR] = toInt(input);
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
    getParsingFlags(config).bigHour = true;
});
addParseToken('hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
    getParsingFlags(config).bigHour = true;
});
addParseToken('Hmm', function (input, array, config) {
    var pos = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos));
    array[MINUTE] = toInt(input.substr(pos));
});
addParseToken('Hmmss', function (input, array, config) {
    var pos1 = input.length - 4;
    var pos2 = input.length - 2;
    array[HOUR] = toInt(input.substr(0, pos1));
    array[MINUTE] = toInt(input.substr(pos1, 2));
    array[SECOND] = toInt(input.substr(pos2));
});

// LOCALES

function localeIsPM (input) {
    // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
    // Using charAt should be more compatible.
    return ((input + '').toLowerCase().charAt(0) === 'p');
}

var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
function localeMeridiem (hours, minutes, isLower) {
    if (hours > 11) {
        return isLower ? 'pm' : 'PM';
    } else {
        return isLower ? 'am' : 'AM';
    }
}


// MOMENTS

// Setting the hour should keep the time, because the user explicitly
// specified which hour he wants. So trying to maintain the same hour (in
// a new timezone) makes sense. Adding/subtracting hours does not follow
// this rule.
var getSetHour = makeGetSet('Hours', true);

var baseConfig = {
    calendar: defaultCalendar,
    longDateFormat: defaultLongDateFormat,
    invalidDate: defaultInvalidDate,
    ordinal: defaultOrdinal,
    dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
    relativeTime: defaultRelativeTime,

    months: defaultLocaleMonths,
    monthsShort: defaultLocaleMonthsShort,

    week: defaultLocaleWeek,

    weekdays: defaultLocaleWeekdays,
    weekdaysMin: defaultLocaleWeekdaysMin,
    weekdaysShort: defaultLocaleWeekdaysShort,

    meridiemParse: defaultLocaleMeridiemParse
};

// internal storage for locale config files
var locales = {};
var localeFamilies = {};
var globalLocale;

function normalizeLocale(key) {
    return key ? key.toLowerCase().replace('_', '-') : key;
}

// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
function chooseLocale(names) {
    var i = 0, j, next, locale, split;

    while (i < names.length) {
        split = normalizeLocale(names[i]).split('-');
        j = split.length;
        next = normalizeLocale(names[i + 1]);
        next = next ? next.split('-') : null;
        while (j > 0) {
            locale = loadLocale(split.slice(0, j).join('-'));
            if (locale) {
                return locale;
            }
            if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                //the next array item is better than a shallower substring of this one
                break;
            }
            j--;
        }
        i++;
    }
    return globalLocale;
}

function loadLocale(name) {
    var oldLocale = null;
    // TODO: Find a better way to register and load all the locales in Node
    if (!locales[name] && (typeof module !== 'undefined') &&
            module && module.exports) {
        try {
            oldLocale = globalLocale._abbr;
            var aliasedRequire = require;
            aliasedRequire('./locale/' + name);
            getSetGlobalLocale(oldLocale);
        } catch (e) {}
    }
    return locales[name];
}

// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
function getSetGlobalLocale (key, values) {
    var data;
    if (key) {
        if (isUndefined(values)) {
            data = getLocale(key);
        }
        else {
            data = defineLocale(key, values);
        }

        if (data) {
            // moment.duration._locale = moment._locale = data;
            globalLocale = data;
        }
        else {
            if ((typeof console !==  'undefined') && console.warn) {
                //warn user if arguments are passed but the locale could not be set
                console.warn('Locale ' + key +  ' not found. Did you forget to load it?');
            }
        }
    }

    return globalLocale._abbr;
}

function defineLocale (name, config) {
    if (config !== null) {
        var locale, parentConfig = baseConfig;
        config.abbr = name;
        if (locales[name] != null) {
            deprecateSimple('defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                    'an existing locale. moment.defineLocale(localeName, ' +
                    'config) should only be used for creating a new locale ' +
                    'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
            parentConfig = locales[name]._config;
        } else if (config.parentLocale != null) {
            if (locales[config.parentLocale] != null) {
                parentConfig = locales[config.parentLocale]._config;
            } else {
                locale = loadLocale(config.parentLocale);
                if (locale != null) {
                    parentConfig = locale._config;
                } else {
                    if (!localeFamilies[config.parentLocale]) {
                        localeFamilies[config.parentLocale] = [];
                    }
                    localeFamilies[config.parentLocale].push({
                        name: name,
                        config: config
                    });
                    return null;
                }
            }
        }
        locales[name] = new Locale(mergeConfigs(parentConfig, config));

        if (localeFamilies[name]) {
            localeFamilies[name].forEach(function (x) {
                defineLocale(x.name, x.config);
            });
        }

        // backwards compat for now: also set the locale
        // make sure we set the locale AFTER all child locales have been
        // created, so we won't end up with the child locale set.
        getSetGlobalLocale(name);


        return locales[name];
    } else {
        // useful for testing
        delete locales[name];
        return null;
    }
}

function updateLocale(name, config) {
    if (config != null) {
        var locale, tmpLocale, parentConfig = baseConfig;
        // MERGE
        tmpLocale = loadLocale(name);
        if (tmpLocale != null) {
            parentConfig = tmpLocale._config;
        }
        config = mergeConfigs(parentConfig, config);
        locale = new Locale(config);
        locale.parentLocale = locales[name];
        locales[name] = locale;

        // backwards compat for now: also set the locale
        getSetGlobalLocale(name);
    } else {
        // pass null for config to unupdate, useful for tests
        if (locales[name] != null) {
            if (locales[name].parentLocale != null) {
                locales[name] = locales[name].parentLocale;
            } else if (locales[name] != null) {
                delete locales[name];
            }
        }
    }
    return locales[name];
}

// returns locale data
function getLocale (key) {
    var locale;

    if (key && key._locale && key._locale._abbr) {
        key = key._locale._abbr;
    }

    if (!key) {
        return globalLocale;
    }

    if (!isArray(key)) {
        //short-circuit everything else
        locale = loadLocale(key);
        if (locale) {
            return locale;
        }
        key = [key];
    }

    return chooseLocale(key);
}

function listLocales() {
    return keys(locales);
}

function checkOverflow (m) {
    var overflow;
    var a = m._a;

    if (a && getParsingFlags(m).overflow === -2) {
        overflow =
            a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
            a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
            a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
            a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
            a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
            a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
            -1;

        if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
            overflow = DATE;
        }
        if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
            overflow = WEEK;
        }
        if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
            overflow = WEEKDAY;
        }

        getParsingFlags(m).overflow = overflow;
    }

    return m;
}

// Pick the first defined of two or three arguments.
function defaults(a, b, c) {
    if (a != null) {
        return a;
    }
    if (b != null) {
        return b;
    }
    return c;
}

function currentDateArray(config) {
    // hooks is actually the exported moment object
    var nowValue = new Date(hooks.now());
    if (config._useUTC) {
        return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
    }
    return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
}

// convert an array to a date.
// the array should mirror the parameters below
// note: all values past the year are optional and will default to the lowest possible value.
// [year, month, day , hour, minute, second, millisecond]
function configFromArray (config) {
    var i, date, input = [], currentDate, expectedWeekday, yearToUse;

    if (config._d) {
        return;
    }

    currentDate = currentDateArray(config);

    //compute day of the year from weeks and weekdays
    if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
        dayOfYearFromWeekInfo(config);
    }

    //if the day of the year is set, figure out what it is
    if (config._dayOfYear != null) {
        yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

        if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
            getParsingFlags(config)._overflowDayOfYear = true;
        }

        date = createUTCDate(yearToUse, 0, config._dayOfYear);
        config._a[MONTH] = date.getUTCMonth();
        config._a[DATE] = date.getUTCDate();
    }

    // Default to current date.
    // * if no year, month, day of month are given, default to today
    // * if day of month is given, default month and year
    // * if month is given, default only year
    // * if year is given, don't default anything
    for (i = 0; i < 3 && config._a[i] == null; ++i) {
        config._a[i] = input[i] = currentDate[i];
    }

    // Zero out whatever was not defaulted, including time
    for (; i < 7; i++) {
        config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
    }

    // Check for 24:00:00.000
    if (config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0) {
        config._nextDay = true;
        config._a[HOUR] = 0;
    }

    config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
    expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();

    // Apply timezone offset from input. The actual utcOffset can be changed
    // with parseZone.
    if (config._tzm != null) {
        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
    }

    if (config._nextDay) {
        config._a[HOUR] = 24;
    }

    // check for mismatching day of week
    if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
        getParsingFlags(config).weekdayMismatch = true;
    }
}

function dayOfYearFromWeekInfo(config) {
    var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

    w = config._w;
    if (w.GG != null || w.W != null || w.E != null) {
        dow = 1;
        doy = 4;

        // TODO: We need to take the current isoWeekYear, but that depends on
        // how we interpret now (local, utc, fixed offset). So create
        // a now version of current config (take local/utc/offset flags, and
        // create now).
        weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
        week = defaults(w.W, 1);
        weekday = defaults(w.E, 1);
        if (weekday < 1 || weekday > 7) {
            weekdayOverflow = true;
        }
    } else {
        dow = config._locale._week.dow;
        doy = config._locale._week.doy;

        var curWeek = weekOfYear(createLocal(), dow, doy);

        weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

        // Default to current week.
        week = defaults(w.w, curWeek.week);

        if (w.d != null) {
            // weekday -- low day numbers are considered next week
            weekday = w.d;
            if (weekday < 0 || weekday > 6) {
                weekdayOverflow = true;
            }
        } else if (w.e != null) {
            // local weekday -- counting starts from begining of week
            weekday = w.e + dow;
            if (w.e < 0 || w.e > 6) {
                weekdayOverflow = true;
            }
        } else {
            // default to begining of week
            weekday = dow;
        }
    }
    if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
        getParsingFlags(config)._overflowWeeks = true;
    } else if (weekdayOverflow != null) {
        getParsingFlags(config)._overflowWeekday = true;
    } else {
        temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }
}

// iso 8601 regex
// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

var isoDates = [
    ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
    ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
    ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
    ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
    ['YYYY-DDD', /\d{4}-\d{3}/],
    ['YYYY-MM', /\d{4}-\d\d/, false],
    ['YYYYYYMMDD', /[+-]\d{10}/],
    ['YYYYMMDD', /\d{8}/],
    // YYYYMM is NOT allowed by the standard
    ['GGGG[W]WWE', /\d{4}W\d{3}/],
    ['GGGG[W]WW', /\d{4}W\d{2}/, false],
    ['YYYYDDD', /\d{7}/]
];

// iso time formats and regexes
var isoTimes = [
    ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
    ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
    ['HH:mm:ss', /\d\d:\d\d:\d\d/],
    ['HH:mm', /\d\d:\d\d/],
    ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
    ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
    ['HHmmss', /\d\d\d\d\d\d/],
    ['HHmm', /\d\d\d\d/],
    ['HH', /\d\d/]
];

var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

// date from iso format
function configFromISO(config) {
    var i, l,
        string = config._i,
        match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
        allowTime, dateFormat, timeFormat, tzFormat;

    if (match) {
        getParsingFlags(config).iso = true;

        for (i = 0, l = isoDates.length; i < l; i++) {
            if (isoDates[i][1].exec(match[1])) {
                dateFormat = isoDates[i][0];
                allowTime = isoDates[i][2] !== false;
                break;
            }
        }
        if (dateFormat == null) {
            config._isValid = false;
            return;
        }
        if (match[3]) {
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(match[3])) {
                    // match[2] should be 'T' or space
                    timeFormat = (match[2] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (timeFormat == null) {
                config._isValid = false;
                return;
            }
        }
        if (!allowTime && timeFormat != null) {
            config._isValid = false;
            return;
        }
        if (match[4]) {
            if (tzRegex.exec(match[4])) {
                tzFormat = 'Z';
            } else {
                config._isValid = false;
                return;
            }
        }
        config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
        configFromStringAndFormat(config);
    } else {
        config._isValid = false;
    }
}

// RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;

function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
    var result = [
        untruncateYear(yearStr),
        defaultLocaleMonthsShort.indexOf(monthStr),
        parseInt(dayStr, 10),
        parseInt(hourStr, 10),
        parseInt(minuteStr, 10)
    ];

    if (secondStr) {
        result.push(parseInt(secondStr, 10));
    }

    return result;
}

function untruncateYear(yearStr) {
    var year = parseInt(yearStr, 10);
    if (year <= 49) {
        return 2000 + year;
    } else if (year <= 999) {
        return 1900 + year;
    }
    return year;
}

function preprocessRFC2822(s) {
    // Remove comments and folding whitespace and replace multiple-spaces with a single space
    return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').trim();
}

function checkWeekday(weekdayStr, parsedInput, config) {
    if (weekdayStr) {
        // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
        var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
            weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
        if (weekdayProvided !== weekdayActual) {
            getParsingFlags(config).weekdayMismatch = true;
            config._isValid = false;
            return false;
        }
    }
    return true;
}

var obsOffsets = {
    UT: 0,
    GMT: 0,
    EDT: -4 * 60,
    EST: -5 * 60,
    CDT: -5 * 60,
    CST: -6 * 60,
    MDT: -6 * 60,
    MST: -7 * 60,
    PDT: -7 * 60,
    PST: -8 * 60
};

function calculateOffset(obsOffset, militaryOffset, numOffset) {
    if (obsOffset) {
        return obsOffsets[obsOffset];
    } else if (militaryOffset) {
        // the only allowed military tz is Z
        return 0;
    } else {
        var hm = parseInt(numOffset, 10);
        var m = hm % 100, h = (hm - m) / 100;
        return h * 60 + m;
    }
}

// date and time from ref 2822 format
function configFromRFC2822(config) {
    var match = rfc2822.exec(preprocessRFC2822(config._i));
    if (match) {
        var parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
        if (!checkWeekday(match[1], parsedArray, config)) {
            return;
        }

        config._a = parsedArray;
        config._tzm = calculateOffset(match[8], match[9], match[10]);

        config._d = createUTCDate.apply(null, config._a);
        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

        getParsingFlags(config).rfc2822 = true;
    } else {
        config._isValid = false;
    }
}

// date from iso format or fallback
function configFromString(config) {
    var matched = aspNetJsonRegex.exec(config._i);

    if (matched !== null) {
        config._d = new Date(+matched[1]);
        return;
    }

    configFromISO(config);
    if (config._isValid === false) {
        delete config._isValid;
    } else {
        return;
    }

    configFromRFC2822(config);
    if (config._isValid === false) {
        delete config._isValid;
    } else {
        return;
    }

    // Final attempt, use Input Fallback
    hooks.createFromInputFallback(config);
}

hooks.createFromInputFallback = deprecate(
    'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
    'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
    'discouraged and will be removed in an upcoming major release. Please refer to ' +
    'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
    function (config) {
        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
    }
);

// constant that refers to the ISO standard
hooks.ISO_8601 = function () {};

// constant that refers to the RFC 2822 form
hooks.RFC_2822 = function () {};

// date from string and format string
function configFromStringAndFormat(config) {
    // TODO: Move this to another part of the creation flow to prevent circular deps
    if (config._f === hooks.ISO_8601) {
        configFromISO(config);
        return;
    }
    if (config._f === hooks.RFC_2822) {
        configFromRFC2822(config);
        return;
    }
    config._a = [];
    getParsingFlags(config).empty = true;

    // This array is used to make a Date, either with `new Date` or `Date.UTC`
    var string = '' + config._i,
        i, parsedInput, tokens, token, skipped,
        stringLength = string.length,
        totalParsedInputLength = 0;

    tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

    for (i = 0; i < tokens.length; i++) {
        token = tokens[i];
        parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
        // console.log('token', token, 'parsedInput', parsedInput,
        //         'regex', getParseRegexForToken(token, config));
        if (parsedInput) {
            skipped = string.substr(0, string.indexOf(parsedInput));
            if (skipped.length > 0) {
                getParsingFlags(config).unusedInput.push(skipped);
            }
            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
            totalParsedInputLength += parsedInput.length;
        }
        // don't parse if it's not a known token
        if (formatTokenFunctions[token]) {
            if (parsedInput) {
                getParsingFlags(config).empty = false;
            }
            else {
                getParsingFlags(config).unusedTokens.push(token);
            }
            addTimeToArrayFromToken(token, parsedInput, config);
        }
        else if (config._strict && !parsedInput) {
            getParsingFlags(config).unusedTokens.push(token);
        }
    }

    // add remaining unparsed input length to the string
    getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
    if (string.length > 0) {
        getParsingFlags(config).unusedInput.push(string);
    }

    // clear _12h flag if hour is <= 12
    if (config._a[HOUR] <= 12 &&
        getParsingFlags(config).bigHour === true &&
        config._a[HOUR] > 0) {
        getParsingFlags(config).bigHour = undefined;
    }

    getParsingFlags(config).parsedDateParts = config._a.slice(0);
    getParsingFlags(config).meridiem = config._meridiem;
    // handle meridiem
    config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

    configFromArray(config);
    checkOverflow(config);
}


function meridiemFixWrap (locale, hour, meridiem) {
    var isPm;

    if (meridiem == null) {
        // nothing to do
        return hour;
    }
    if (locale.meridiemHour != null) {
        return locale.meridiemHour(hour, meridiem);
    } else if (locale.isPM != null) {
        // Fallback
        isPm = locale.isPM(meridiem);
        if (isPm && hour < 12) {
            hour += 12;
        }
        if (!isPm && hour === 12) {
            hour = 0;
        }
        return hour;
    } else {
        // this is not supposed to happen
        return hour;
    }
}

// date from string and array of format strings
function configFromStringAndArray(config) {
    var tempConfig,
        bestMoment,

        scoreToBeat,
        i,
        currentScore;

    if (config._f.length === 0) {
        getParsingFlags(config).invalidFormat = true;
        config._d = new Date(NaN);
        return;
    }

    for (i = 0; i < config._f.length; i++) {
        currentScore = 0;
        tempConfig = copyConfig({}, config);
        if (config._useUTC != null) {
            tempConfig._useUTC = config._useUTC;
        }
        tempConfig._f = config._f[i];
        configFromStringAndFormat(tempConfig);

        if (!isValid(tempConfig)) {
            continue;
        }

        // if there is any input that was not parsed add a penalty for that format
        currentScore += getParsingFlags(tempConfig).charsLeftOver;

        //or tokens
        currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

        getParsingFlags(tempConfig).score = currentScore;

        if (scoreToBeat == null || currentScore < scoreToBeat) {
            scoreToBeat = currentScore;
            bestMoment = tempConfig;
        }
    }

    extend(config, bestMoment || tempConfig);
}

function configFromObject(config) {
    if (config._d) {
        return;
    }

    var i = normalizeObjectUnits(config._i);
    config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
        return obj && parseInt(obj, 10);
    });

    configFromArray(config);
}

function createFromConfig (config) {
    var res = new Moment(checkOverflow(prepareConfig(config)));
    if (res._nextDay) {
        // Adding is smart enough around DST
        res.add(1, 'd');
        res._nextDay = undefined;
    }

    return res;
}

function prepareConfig (config) {
    var input = config._i,
        format = config._f;

    config._locale = config._locale || getLocale(config._l);

    if (input === null || (format === undefined && input === '')) {
        return createInvalid({nullInput: true});
    }

    if (typeof input === 'string') {
        config._i = input = config._locale.preparse(input);
    }

    if (isMoment(input)) {
        return new Moment(checkOverflow(input));
    } else if (isDate(input)) {
        config._d = input;
    } else if (isArray(format)) {
        configFromStringAndArray(config);
    } else if (format) {
        configFromStringAndFormat(config);
    }  else {
        configFromInput(config);
    }

    if (!isValid(config)) {
        config._d = null;
    }

    return config;
}

function configFromInput(config) {
    var input = config._i;
    if (isUndefined(input)) {
        config._d = new Date(hooks.now());
    } else if (isDate(input)) {
        config._d = new Date(input.valueOf());
    } else if (typeof input === 'string') {
        configFromString(config);
    } else if (isArray(input)) {
        config._a = map(input.slice(0), function (obj) {
            return parseInt(obj, 10);
        });
        configFromArray(config);
    } else if (isObject(input)) {
        configFromObject(config);
    } else if (isNumber(input)) {
        // from milliseconds
        config._d = new Date(input);
    } else {
        hooks.createFromInputFallback(config);
    }
}

function createLocalOrUTC (input, format, locale, strict, isUTC) {
    var c = {};

    if (locale === true || locale === false) {
        strict = locale;
        locale = undefined;
    }

    if ((isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)) {
        input = undefined;
    }
    // object construction must be done this way.
    // https://github.com/moment/moment/issues/1423
    c._isAMomentObject = true;
    c._useUTC = c._isUTC = isUTC;
    c._l = locale;
    c._i = input;
    c._f = format;
    c._strict = strict;

    return createFromConfig(c);
}

function createLocal (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, false);
}

var prototypeMin = deprecate(
    'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other < this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

var prototypeMax = deprecate(
    'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
    function () {
        var other = createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other > this ? this : other;
        } else {
            return createInvalid();
        }
    }
);

// Pick a moment m from moments so that m[fn](other) is true for all
// other. This relies on the function fn to be transitive.
//
// moments should either be an array of moment objects or an array, whose
// first element is an array of moment objects.
function pickBy(fn, moments) {
    var res, i;
    if (moments.length === 1 && isArray(moments[0])) {
        moments = moments[0];
    }
    if (!moments.length) {
        return createLocal();
    }
    res = moments[0];
    for (i = 1; i < moments.length; ++i) {
        if (!moments[i].isValid() || moments[i][fn](res)) {
            res = moments[i];
        }
    }
    return res;
}

// TODO: Use [].sort instead?
function min () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isBefore', args);
}

function max () {
    var args = [].slice.call(arguments, 0);

    return pickBy('isAfter', args);
}

var now = function () {
    return Date.now ? Date.now() : +(new Date());
};

var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

function isDurationValid(m) {
    for (var key in m) {
        if (!(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
            return false;
        }
    }

    var unitHasDecimal = false;
    for (var i = 0; i < ordering.length; ++i) {
        if (m[ordering[i]]) {
            if (unitHasDecimal) {
                return false; // only allow non-integers for smallest unit
            }
            if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                unitHasDecimal = true;
            }
        }
    }

    return true;
}

function isValid$1() {
    return this._isValid;
}

function createInvalid$1() {
    return createDuration(NaN);
}

function Duration (duration) {
    var normalizedInput = normalizeObjectUnits(duration),
        years = normalizedInput.year || 0,
        quarters = normalizedInput.quarter || 0,
        months = normalizedInput.month || 0,
        weeks = normalizedInput.week || 0,
        days = normalizedInput.day || 0,
        hours = normalizedInput.hour || 0,
        minutes = normalizedInput.minute || 0,
        seconds = normalizedInput.second || 0,
        milliseconds = normalizedInput.millisecond || 0;

    this._isValid = isDurationValid(normalizedInput);

    // representation for dateAddRemove
    this._milliseconds = +milliseconds +
        seconds * 1e3 + // 1000
        minutes * 6e4 + // 1000 * 60
        hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
    // Because of dateAddRemove treats 24 hours as different from a
    // day when working around DST, we need to store them separately
    this._days = +days +
        weeks * 7;
    // It is impossible to translate months into days without knowing
    // which months you are are talking about, so we have to store
    // it separately.
    this._months = +months +
        quarters * 3 +
        years * 12;

    this._data = {};

    this._locale = getLocale();

    this._bubble();
}

function isDuration (obj) {
    return obj instanceof Duration;
}

function absRound (number) {
    if (number < 0) {
        return Math.round(-1 * number) * -1;
    } else {
        return Math.round(number);
    }
}

// FORMATTING

function offset (token, separator) {
    addFormatToken(token, 0, 0, function () {
        var offset = this.utcOffset();
        var sign = '+';
        if (offset < 0) {
            offset = -offset;
            sign = '-';
        }
        return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
    });
}

offset('Z', ':');
offset('ZZ', '');

// PARSING

addRegexToken('Z',  matchShortOffset);
addRegexToken('ZZ', matchShortOffset);
addParseToken(['Z', 'ZZ'], function (input, array, config) {
    config._useUTC = true;
    config._tzm = offsetFromString(matchShortOffset, input);
});

// HELPERS

// timezone chunker
// '+10:00' > ['10',  '00']
// '-1530'  > ['-15', '30']
var chunkOffset = /([\+\-]|\d\d)/gi;

function offsetFromString(matcher, string) {
    var matches = (string || '').match(matcher);

    if (matches === null) {
        return null;
    }

    var chunk   = matches[matches.length - 1] || [];
    var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
    var minutes = +(parts[1] * 60) + toInt(parts[2]);

    return minutes === 0 ?
      0 :
      parts[0] === '+' ? minutes : -minutes;
}

// Return a moment from input, that is local/utc/zone equivalent to model.
function cloneWithOffset(input, model) {
    var res, diff;
    if (model._isUTC) {
        res = model.clone();
        diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
        // Use low-level api, because this fn is low-level api.
        res._d.setTime(res._d.valueOf() + diff);
        hooks.updateOffset(res, false);
        return res;
    } else {
        return createLocal(input).local();
    }
}

function getDateOffset (m) {
    // On Firefox.24 Date#getTimezoneOffset returns a floating point.
    // https://github.com/moment/moment/pull/1871
    return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
}

// HOOKS

// This function will be called whenever a moment is mutated.
// It is intended to keep the offset in sync with the timezone.
hooks.updateOffset = function () {};

// MOMENTS

// keepLocalTime = true means only change the timezone, without
// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
// +0200, so we adjust the time as needed, to be valid.
//
// Keeping the time actually adds/subtracts (one hour)
// from the actual represented time. That is why we call updateOffset
// a second time. In case it wants us to change the offset again
// _changeInProgress == true case, then we have to adjust, because
// there is no such time in the given timezone.
function getSetOffset (input, keepLocalTime, keepMinutes) {
    var offset = this._offset || 0,
        localAdjust;
    if (!this.isValid()) {
        return input != null ? this : NaN;
    }
    if (input != null) {
        if (typeof input === 'string') {
            input = offsetFromString(matchShortOffset, input);
            if (input === null) {
                return this;
            }
        } else if (Math.abs(input) < 16 && !keepMinutes) {
            input = input * 60;
        }
        if (!this._isUTC && keepLocalTime) {
            localAdjust = getDateOffset(this);
        }
        this._offset = input;
        this._isUTC = true;
        if (localAdjust != null) {
            this.add(localAdjust, 'm');
        }
        if (offset !== input) {
            if (!keepLocalTime || this._changeInProgress) {
                addSubtract(this, createDuration(input - offset, 'm'), 1, false);
            } else if (!this._changeInProgress) {
                this._changeInProgress = true;
                hooks.updateOffset(this, true);
                this._changeInProgress = null;
            }
        }
        return this;
    } else {
        return this._isUTC ? offset : getDateOffset(this);
    }
}

function getSetZone (input, keepLocalTime) {
    if (input != null) {
        if (typeof input !== 'string') {
            input = -input;
        }

        this.utcOffset(input, keepLocalTime);

        return this;
    } else {
        return -this.utcOffset();
    }
}

function setOffsetToUTC (keepLocalTime) {
    return this.utcOffset(0, keepLocalTime);
}

function setOffsetToLocal (keepLocalTime) {
    if (this._isUTC) {
        this.utcOffset(0, keepLocalTime);
        this._isUTC = false;

        if (keepLocalTime) {
            this.subtract(getDateOffset(this), 'm');
        }
    }
    return this;
}

function setOffsetToParsedOffset () {
    if (this._tzm != null) {
        this.utcOffset(this._tzm, false, true);
    } else if (typeof this._i === 'string') {
        var tZone = offsetFromString(matchOffset, this._i);
        if (tZone != null) {
            this.utcOffset(tZone);
        }
        else {
            this.utcOffset(0, true);
        }
    }
    return this;
}

function hasAlignedHourOffset (input) {
    if (!this.isValid()) {
        return false;
    }
    input = input ? createLocal(input).utcOffset() : 0;

    return (this.utcOffset() - input) % 60 === 0;
}

function isDaylightSavingTime () {
    return (
        this.utcOffset() > this.clone().month(0).utcOffset() ||
        this.utcOffset() > this.clone().month(5).utcOffset()
    );
}

function isDaylightSavingTimeShifted () {
    if (!isUndefined(this._isDSTShifted)) {
        return this._isDSTShifted;
    }

    var c = {};

    copyConfig(c, this);
    c = prepareConfig(c);

    if (c._a) {
        var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
        this._isDSTShifted = this.isValid() &&
            compareArrays(c._a, other.toArray()) > 0;
    } else {
        this._isDSTShifted = false;
    }

    return this._isDSTShifted;
}

function isLocal () {
    return this.isValid() ? !this._isUTC : false;
}

function isUtcOffset () {
    return this.isValid() ? this._isUTC : false;
}

function isUtc () {
    return this.isValid() ? this._isUTC && this._offset === 0 : false;
}

// ASP.NET json date format regex
var aspNetRegex = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
// and further modified to allow for strings containing both week and day
var isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

function createDuration (input, key) {
    var duration = input,
        // matching against regexp is expensive, do it on demand
        match = null,
        sign,
        ret,
        diffRes;

    if (isDuration(input)) {
        duration = {
            ms : input._milliseconds,
            d  : input._days,
            M  : input._months
        };
    } else if (isNumber(input)) {
        duration = {};
        if (key) {
            duration[key] = input;
        } else {
            duration.milliseconds = input;
        }
    } else if (!!(match = aspNetRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : 1;
        duration = {
            y  : 0,
            d  : toInt(match[DATE])                         * sign,
            h  : toInt(match[HOUR])                         * sign,
            m  : toInt(match[MINUTE])                       * sign,
            s  : toInt(match[SECOND])                       * sign,
            ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
        };
    } else if (!!(match = isoRegex.exec(input))) {
        sign = (match[1] === '-') ? -1 : (match[1] === '+') ? 1 : 1;
        duration = {
            y : parseIso(match[2], sign),
            M : parseIso(match[3], sign),
            w : parseIso(match[4], sign),
            d : parseIso(match[5], sign),
            h : parseIso(match[6], sign),
            m : parseIso(match[7], sign),
            s : parseIso(match[8], sign)
        };
    } else if (duration == null) {// checks for null or undefined
        duration = {};
    } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
        diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

        duration = {};
        duration.ms = diffRes.milliseconds;
        duration.M = diffRes.months;
    }

    ret = new Duration(duration);

    if (isDuration(input) && hasOwnProp(input, '_locale')) {
        ret._locale = input._locale;
    }

    return ret;
}

createDuration.fn = Duration.prototype;
createDuration.invalid = createInvalid$1;

function parseIso (inp, sign) {
    // We'd normally use ~~inp for this, but unfortunately it also
    // converts floats to ints.
    // inp may be undefined, so careful calling replace on it.
    var res = inp && parseFloat(inp.replace(',', '.'));
    // apply sign while we're at it
    return (isNaN(res) ? 0 : res) * sign;
}

function positiveMomentsDifference(base, other) {
    var res = {milliseconds: 0, months: 0};

    res.months = other.month() - base.month() +
        (other.year() - base.year()) * 12;
    if (base.clone().add(res.months, 'M').isAfter(other)) {
        --res.months;
    }

    res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

    return res;
}

function momentsDifference(base, other) {
    var res;
    if (!(base.isValid() && other.isValid())) {
        return {milliseconds: 0, months: 0};
    }

    other = cloneWithOffset(other, base);
    if (base.isBefore(other)) {
        res = positiveMomentsDifference(base, other);
    } else {
        res = positiveMomentsDifference(other, base);
        res.milliseconds = -res.milliseconds;
        res.months = -res.months;
    }

    return res;
}

// TODO: remove 'name' arg after deprecation is removed
function createAdder(direction, name) {
    return function (val, period) {
        var dur, tmp;
        //invert the arguments, but complain about it
        if (period !== null && !isNaN(+period)) {
            deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
            'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
            tmp = val; val = period; period = tmp;
        }

        val = typeof val === 'string' ? +val : val;
        dur = createDuration(val, period);
        addSubtract(this, dur, direction);
        return this;
    };
}

function addSubtract (mom, duration, isAdding, updateOffset) {
    var milliseconds = duration._milliseconds,
        days = absRound(duration._days),
        months = absRound(duration._months);

    if (!mom.isValid()) {
        // No op
        return;
    }

    updateOffset = updateOffset == null ? true : updateOffset;

    if (months) {
        setMonth(mom, get(mom, 'Month') + months * isAdding);
    }
    if (days) {
        set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
    }
    if (milliseconds) {
        mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
    }
    if (updateOffset) {
        hooks.updateOffset(mom, days || months);
    }
}

var add      = createAdder(1, 'add');
var subtract = createAdder(-1, 'subtract');

function getCalendarFormat(myMoment, now) {
    var diff = myMoment.diff(now, 'days', true);
    return diff < -6 ? 'sameElse' :
            diff < -1 ? 'lastWeek' :
            diff < 0 ? 'lastDay' :
            diff < 1 ? 'sameDay' :
            diff < 2 ? 'nextDay' :
            diff < 7 ? 'nextWeek' : 'sameElse';
}

function calendar$1 (time, formats) {
    // We want to compare the start of today, vs this.
    // Getting start-of-today depends on whether we're local/utc/offset or not.
    var now = time || createLocal(),
        sod = cloneWithOffset(now, this).startOf('day'),
        format = hooks.calendarFormat(this, sod) || 'sameElse';

    var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

    return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
}

function clone () {
    return new Moment(this);
}

function isAfter (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() > localInput.valueOf();
    } else {
        return localInput.valueOf() < this.clone().startOf(units).valueOf();
    }
}

function isBefore (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input);
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() < localInput.valueOf();
    } else {
        return this.clone().endOf(units).valueOf() < localInput.valueOf();
    }
}

function isBetween (from, to, units, inclusivity) {
    inclusivity = inclusivity || '()';
    return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
        (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
}

function isSame (input, units) {
    var localInput = isMoment(input) ? input : createLocal(input),
        inputMs;
    if (!(this.isValid() && localInput.isValid())) {
        return false;
    }
    units = normalizeUnits(units || 'millisecond');
    if (units === 'millisecond') {
        return this.valueOf() === localInput.valueOf();
    } else {
        inputMs = localInput.valueOf();
        return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
    }
}

function isSameOrAfter (input, units) {
    return this.isSame(input, units) || this.isAfter(input,units);
}

function isSameOrBefore (input, units) {
    return this.isSame(input, units) || this.isBefore(input,units);
}

function diff (input, units, asFloat) {
    var that,
        zoneDelta,
        output;

    if (!this.isValid()) {
        return NaN;
    }

    that = cloneWithOffset(input, this);

    if (!that.isValid()) {
        return NaN;
    }

    zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

    units = normalizeUnits(units);

    switch (units) {
        case 'year': output = monthDiff(this, that) / 12; break;
        case 'month': output = monthDiff(this, that); break;
        case 'quarter': output = monthDiff(this, that) / 3; break;
        case 'second': output = (this - that) / 1e3; break; // 1000
        case 'minute': output = (this - that) / 6e4; break; // 1000 * 60
        case 'hour': output = (this - that) / 36e5; break; // 1000 * 60 * 60
        case 'day': output = (this - that - zoneDelta) / 864e5; break; // 1000 * 60 * 60 * 24, negate dst
        case 'week': output = (this - that - zoneDelta) / 6048e5; break; // 1000 * 60 * 60 * 24 * 7, negate dst
        default: output = this - that;
    }

    return asFloat ? output : absFloor(output);
}

function monthDiff (a, b) {
    // difference in months
    var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
        // b is in (anchor - 1 month, anchor + 1 month)
        anchor = a.clone().add(wholeMonthDiff, 'months'),
        anchor2, adjust;

    if (b - anchor < 0) {
        anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor - anchor2);
    } else {
        anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor2 - anchor);
    }

    //check for negative zero, return zero if negative zero
    return -(wholeMonthDiff + adjust) || 0;
}

hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

function toString () {
    return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
}

function toISOString(keepOffset) {
    if (!this.isValid()) {
        return null;
    }
    var utc = keepOffset !== true;
    var m = utc ? this.clone().utc() : this;
    if (m.year() < 0 || m.year() > 9999) {
        return formatMoment(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
    }
    if (isFunction(Date.prototype.toISOString)) {
        // native implementation is ~50x faster, use it when we can
        if (utc) {
            return this.toDate().toISOString();
        } else {
            return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace('Z', formatMoment(m, 'Z'));
        }
    }
    return formatMoment(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
}

/**
 * Return a human readable representation of a moment that can
 * also be evaluated to get a new moment which is the same
 *
 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
 */
function inspect () {
    if (!this.isValid()) {
        return 'moment.invalid(/* ' + this._i + ' */)';
    }
    var func = 'moment';
    var zone = '';
    if (!this.isLocal()) {
        func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
        zone = 'Z';
    }
    var prefix = '[' + func + '("]';
    var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
    var datetime = '-MM-DD[T]HH:mm:ss.SSS';
    var suffix = zone + '[")]';

    return this.format(prefix + year + datetime + suffix);
}

function format (inputString) {
    if (!inputString) {
        inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
    }
    var output = formatMoment(this, inputString);
    return this.localeData().postformat(output);
}

function from (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function fromNow (withoutSuffix) {
    return this.from(createLocal(), withoutSuffix);
}

function to (time, withoutSuffix) {
    if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
             createLocal(time).isValid())) {
        return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    } else {
        return this.localeData().invalidDate();
    }
}

function toNow (withoutSuffix) {
    return this.to(createLocal(), withoutSuffix);
}

// If passed a locale key, it will set the locale for this
// instance.  Otherwise, it will return the locale configuration
// variables for this instance.
function locale (key) {
    var newLocaleData;

    if (key === undefined) {
        return this._locale._abbr;
    } else {
        newLocaleData = getLocale(key);
        if (newLocaleData != null) {
            this._locale = newLocaleData;
        }
        return this;
    }
}

var lang = deprecate(
    'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
    function (key) {
        if (key === undefined) {
            return this.localeData();
        } else {
            return this.locale(key);
        }
    }
);

function localeData () {
    return this._locale;
}

function startOf (units) {
    units = normalizeUnits(units);
    // the following switch intentionally omits break keywords
    // to utilize falling through the cases.
    switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
        case 'date':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
    }

    // weeks are a special case
    if (units === 'week') {
        this.weekday(0);
    }
    if (units === 'isoWeek') {
        this.isoWeekday(1);
    }

    // quarters are also special
    if (units === 'quarter') {
        this.month(Math.floor(this.month() / 3) * 3);
    }

    return this;
}

function endOf (units) {
    units = normalizeUnits(units);
    if (units === undefined || units === 'millisecond') {
        return this;
    }

    // 'date' is an alias for 'day', so it should be considered as such.
    if (units === 'date') {
        units = 'day';
    }

    return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
}

function valueOf () {
    return this._d.valueOf() - ((this._offset || 0) * 60000);
}

function unix () {
    return Math.floor(this.valueOf() / 1000);
}

function toDate () {
    return new Date(this.valueOf());
}

function toArray () {
    var m = this;
    return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
}

function toObject () {
    var m = this;
    return {
        years: m.year(),
        months: m.month(),
        date: m.date(),
        hours: m.hours(),
        minutes: m.minutes(),
        seconds: m.seconds(),
        milliseconds: m.milliseconds()
    };
}

function toJSON () {
    // new Date(NaN).toJSON() === null
    return this.isValid() ? this.toISOString() : null;
}

function isValid$2 () {
    return isValid(this);
}

function parsingFlags () {
    return extend({}, getParsingFlags(this));
}

function invalidAt () {
    return getParsingFlags(this).overflow;
}

function creationData() {
    return {
        input: this._i,
        format: this._f,
        locale: this._locale,
        isUTC: this._isUTC,
        strict: this._strict
    };
}

// FORMATTING

addFormatToken(0, ['gg', 2], 0, function () {
    return this.weekYear() % 100;
});

addFormatToken(0, ['GG', 2], 0, function () {
    return this.isoWeekYear() % 100;
});

function addWeekYearFormatToken (token, getter) {
    addFormatToken(0, [token, token.length], 0, getter);
}

addWeekYearFormatToken('gggg',     'weekYear');
addWeekYearFormatToken('ggggg',    'weekYear');
addWeekYearFormatToken('GGGG',  'isoWeekYear');
addWeekYearFormatToken('GGGGG', 'isoWeekYear');

// ALIASES

addUnitAlias('weekYear', 'gg');
addUnitAlias('isoWeekYear', 'GG');

// PRIORITY

addUnitPriority('weekYear', 1);
addUnitPriority('isoWeekYear', 1);


// PARSING

addRegexToken('G',      matchSigned);
addRegexToken('g',      matchSigned);
addRegexToken('GG',     match1to2, match2);
addRegexToken('gg',     match1to2, match2);
addRegexToken('GGGG',   match1to4, match4);
addRegexToken('gggg',   match1to4, match4);
addRegexToken('GGGGG',  match1to6, match6);
addRegexToken('ggggg',  match1to6, match6);

addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
    week[token.substr(0, 2)] = toInt(input);
});

addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
    week[token] = hooks.parseTwoDigitYear(input);
});

// MOMENTS

function getSetWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy);
}

function getSetISOWeekYear (input) {
    return getSetWeekYearHelper.call(this,
            input, this.isoWeek(), this.isoWeekday(), 1, 4);
}

function getISOWeeksInYear () {
    return weeksInYear(this.year(), 1, 4);
}

function getWeeksInYear () {
    var weekInfo = this.localeData()._week;
    return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
}

function getSetWeekYearHelper(input, week, weekday, dow, doy) {
    var weeksTarget;
    if (input == null) {
        return weekOfYear(this, dow, doy).year;
    } else {
        weeksTarget = weeksInYear(input, dow, doy);
        if (week > weeksTarget) {
            week = weeksTarget;
        }
        return setWeekAll.call(this, input, week, weekday, dow, doy);
    }
}

function setWeekAll(weekYear, week, weekday, dow, doy) {
    var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
        date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

    this.year(date.getUTCFullYear());
    this.month(date.getUTCMonth());
    this.date(date.getUTCDate());
    return this;
}

// FORMATTING

addFormatToken('Q', 0, 'Qo', 'quarter');

// ALIASES

addUnitAlias('quarter', 'Q');

// PRIORITY

addUnitPriority('quarter', 7);

// PARSING

addRegexToken('Q', match1);
addParseToken('Q', function (input, array) {
    array[MONTH] = (toInt(input) - 1) * 3;
});

// MOMENTS

function getSetQuarter (input) {
    return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
}

// FORMATTING

addFormatToken('D', ['DD', 2], 'Do', 'date');

// ALIASES

addUnitAlias('date', 'D');

// PRIOROITY
addUnitPriority('date', 9);

// PARSING

addRegexToken('D',  match1to2);
addRegexToken('DD', match1to2, match2);
addRegexToken('Do', function (isStrict, locale) {
    // TODO: Remove "ordinalParse" fallback in next major release.
    return isStrict ?
      (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
      locale._dayOfMonthOrdinalParseLenient;
});

addParseToken(['D', 'DD'], DATE);
addParseToken('Do', function (input, array) {
    array[DATE] = toInt(input.match(match1to2)[0]);
});

// MOMENTS

var getSetDayOfMonth = makeGetSet('Date', true);

// FORMATTING

addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

// ALIASES

addUnitAlias('dayOfYear', 'DDD');

// PRIORITY
addUnitPriority('dayOfYear', 4);

// PARSING

addRegexToken('DDD',  match1to3);
addRegexToken('DDDD', match3);
addParseToken(['DDD', 'DDDD'], function (input, array, config) {
    config._dayOfYear = toInt(input);
});

// HELPERS

// MOMENTS

function getSetDayOfYear (input) {
    var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
    return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
}

// FORMATTING

addFormatToken('m', ['mm', 2], 0, 'minute');

// ALIASES

addUnitAlias('minute', 'm');

// PRIORITY

addUnitPriority('minute', 14);

// PARSING

addRegexToken('m',  match1to2);
addRegexToken('mm', match1to2, match2);
addParseToken(['m', 'mm'], MINUTE);

// MOMENTS

var getSetMinute = makeGetSet('Minutes', false);

// FORMATTING

addFormatToken('s', ['ss', 2], 0, 'second');

// ALIASES

addUnitAlias('second', 's');

// PRIORITY

addUnitPriority('second', 15);

// PARSING

addRegexToken('s',  match1to2);
addRegexToken('ss', match1to2, match2);
addParseToken(['s', 'ss'], SECOND);

// MOMENTS

var getSetSecond = makeGetSet('Seconds', false);

// FORMATTING

addFormatToken('S', 0, 0, function () {
    return ~~(this.millisecond() / 100);
});

addFormatToken(0, ['SS', 2], 0, function () {
    return ~~(this.millisecond() / 10);
});

addFormatToken(0, ['SSS', 3], 0, 'millisecond');
addFormatToken(0, ['SSSS', 4], 0, function () {
    return this.millisecond() * 10;
});
addFormatToken(0, ['SSSSS', 5], 0, function () {
    return this.millisecond() * 100;
});
addFormatToken(0, ['SSSSSS', 6], 0, function () {
    return this.millisecond() * 1000;
});
addFormatToken(0, ['SSSSSSS', 7], 0, function () {
    return this.millisecond() * 10000;
});
addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
    return this.millisecond() * 100000;
});
addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
    return this.millisecond() * 1000000;
});


// ALIASES

addUnitAlias('millisecond', 'ms');

// PRIORITY

addUnitPriority('millisecond', 16);

// PARSING

addRegexToken('S',    match1to3, match1);
addRegexToken('SS',   match1to3, match2);
addRegexToken('SSS',  match1to3, match3);

var token;
for (token = 'SSSS'; token.length <= 9; token += 'S') {
    addRegexToken(token, matchUnsigned);
}

function parseMs(input, array) {
    array[MILLISECOND] = toInt(('0.' + input) * 1000);
}

for (token = 'S'; token.length <= 9; token += 'S') {
    addParseToken(token, parseMs);
}
// MOMENTS

var getSetMillisecond = makeGetSet('Milliseconds', false);

// FORMATTING

addFormatToken('z',  0, 0, 'zoneAbbr');
addFormatToken('zz', 0, 0, 'zoneName');

// MOMENTS

function getZoneAbbr () {
    return this._isUTC ? 'UTC' : '';
}

function getZoneName () {
    return this._isUTC ? 'Coordinated Universal Time' : '';
}

var proto = Moment.prototype;

proto.add               = add;
proto.calendar          = calendar$1;
proto.clone             = clone;
proto.diff              = diff;
proto.endOf             = endOf;
proto.format            = format;
proto.from              = from;
proto.fromNow           = fromNow;
proto.to                = to;
proto.toNow             = toNow;
proto.get               = stringGet;
proto.invalidAt         = invalidAt;
proto.isAfter           = isAfter;
proto.isBefore          = isBefore;
proto.isBetween         = isBetween;
proto.isSame            = isSame;
proto.isSameOrAfter     = isSameOrAfter;
proto.isSameOrBefore    = isSameOrBefore;
proto.isValid           = isValid$2;
proto.lang              = lang;
proto.locale            = locale;
proto.localeData        = localeData;
proto.max               = prototypeMax;
proto.min               = prototypeMin;
proto.parsingFlags      = parsingFlags;
proto.set               = stringSet;
proto.startOf           = startOf;
proto.subtract          = subtract;
proto.toArray           = toArray;
proto.toObject          = toObject;
proto.toDate            = toDate;
proto.toISOString       = toISOString;
proto.inspect           = inspect;
proto.toJSON            = toJSON;
proto.toString          = toString;
proto.unix              = unix;
proto.valueOf           = valueOf;
proto.creationData      = creationData;
proto.year       = getSetYear;
proto.isLeapYear = getIsLeapYear;
proto.weekYear    = getSetWeekYear;
proto.isoWeekYear = getSetISOWeekYear;
proto.quarter = proto.quarters = getSetQuarter;
proto.month       = getSetMonth;
proto.daysInMonth = getDaysInMonth;
proto.week           = proto.weeks        = getSetWeek;
proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
proto.weeksInYear    = getWeeksInYear;
proto.isoWeeksInYear = getISOWeeksInYear;
proto.date       = getSetDayOfMonth;
proto.day        = proto.days             = getSetDayOfWeek;
proto.weekday    = getSetLocaleDayOfWeek;
proto.isoWeekday = getSetISODayOfWeek;
proto.dayOfYear  = getSetDayOfYear;
proto.hour = proto.hours = getSetHour;
proto.minute = proto.minutes = getSetMinute;
proto.second = proto.seconds = getSetSecond;
proto.millisecond = proto.milliseconds = getSetMillisecond;
proto.utcOffset            = getSetOffset;
proto.utc                  = setOffsetToUTC;
proto.local                = setOffsetToLocal;
proto.parseZone            = setOffsetToParsedOffset;
proto.hasAlignedHourOffset = hasAlignedHourOffset;
proto.isDST                = isDaylightSavingTime;
proto.isLocal              = isLocal;
proto.isUtcOffset          = isUtcOffset;
proto.isUtc                = isUtc;
proto.isUTC                = isUtc;
proto.zoneAbbr = getZoneAbbr;
proto.zoneName = getZoneName;
proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

function createUnix (input) {
    return createLocal(input * 1000);
}

function createInZone () {
    return createLocal.apply(null, arguments).parseZone();
}

function preParsePostFormat (string) {
    return string;
}

var proto$1 = Locale.prototype;

proto$1.calendar        = calendar;
proto$1.longDateFormat  = longDateFormat;
proto$1.invalidDate     = invalidDate;
proto$1.ordinal         = ordinal;
proto$1.preparse        = preParsePostFormat;
proto$1.postformat      = preParsePostFormat;
proto$1.relativeTime    = relativeTime;
proto$1.pastFuture      = pastFuture;
proto$1.set             = set;

proto$1.months            =        localeMonths;
proto$1.monthsShort       =        localeMonthsShort;
proto$1.monthsParse       =        localeMonthsParse;
proto$1.monthsRegex       = monthsRegex;
proto$1.monthsShortRegex  = monthsShortRegex;
proto$1.week = localeWeek;
proto$1.firstDayOfYear = localeFirstDayOfYear;
proto$1.firstDayOfWeek = localeFirstDayOfWeek;

proto$1.weekdays       =        localeWeekdays;
proto$1.weekdaysMin    =        localeWeekdaysMin;
proto$1.weekdaysShort  =        localeWeekdaysShort;
proto$1.weekdaysParse  =        localeWeekdaysParse;

proto$1.weekdaysRegex       =        weekdaysRegex;
proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

proto$1.isPM = localeIsPM;
proto$1.meridiem = localeMeridiem;

function get$1 (format, index, field, setter) {
    var locale = getLocale();
    var utc = createUTC().set(setter, index);
    return locale[field](utc, format);
}

function listMonthsImpl (format, index, field) {
    if (isNumber(format)) {
        index = format;
        format = undefined;
    }

    format = format || '';

    if (index != null) {
        return get$1(format, index, field, 'month');
    }

    var i;
    var out = [];
    for (i = 0; i < 12; i++) {
        out[i] = get$1(format, i, field, 'month');
    }
    return out;
}

// ()
// (5)
// (fmt, 5)
// (fmt)
// (true)
// (true, 5)
// (true, fmt, 5)
// (true, fmt)
function listWeekdaysImpl (localeSorted, format, index, field) {
    if (typeof localeSorted === 'boolean') {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    } else {
        format = localeSorted;
        index = format;
        localeSorted = false;

        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';
    }

    var locale = getLocale(),
        shift = localeSorted ? locale._week.dow : 0;

    if (index != null) {
        return get$1(format, (index + shift) % 7, field, 'day');
    }

    var i;
    var out = [];
    for (i = 0; i < 7; i++) {
        out[i] = get$1(format, (i + shift) % 7, field, 'day');
    }
    return out;
}

function listMonths (format, index) {
    return listMonthsImpl(format, index, 'months');
}

function listMonthsShort (format, index) {
    return listMonthsImpl(format, index, 'monthsShort');
}

function listWeekdays (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
}

function listWeekdaysShort (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
}

function listWeekdaysMin (localeSorted, format, index) {
    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
}

getSetGlobalLocale('en', {
    dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal : function (number) {
        var b = number % 10,
            output = (toInt(number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
            (b === 3) ? 'rd' : 'th';
        return number + output;
    }
});

// Side effect imports

hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

var mathAbs = Math.abs;

function abs () {
    var data           = this._data;

    this._milliseconds = mathAbs(this._milliseconds);
    this._days         = mathAbs(this._days);
    this._months       = mathAbs(this._months);

    data.milliseconds  = mathAbs(data.milliseconds);
    data.seconds       = mathAbs(data.seconds);
    data.minutes       = mathAbs(data.minutes);
    data.hours         = mathAbs(data.hours);
    data.months        = mathAbs(data.months);
    data.years         = mathAbs(data.years);

    return this;
}

function addSubtract$1 (duration, input, value, direction) {
    var other = createDuration(input, value);

    duration._milliseconds += direction * other._milliseconds;
    duration._days         += direction * other._days;
    duration._months       += direction * other._months;

    return duration._bubble();
}

// supports only 2.0-style add(1, 's') or add(duration)
function add$1 (input, value) {
    return addSubtract$1(this, input, value, 1);
}

// supports only 2.0-style subtract(1, 's') or subtract(duration)
function subtract$1 (input, value) {
    return addSubtract$1(this, input, value, -1);
}

function absCeil (number) {
    if (number < 0) {
        return Math.floor(number);
    } else {
        return Math.ceil(number);
    }
}

function bubble () {
    var milliseconds = this._milliseconds;
    var days         = this._days;
    var months       = this._months;
    var data         = this._data;
    var seconds, minutes, hours, years, monthsFromDays;

    // if we have a mix of positive and negative values, bubble down first
    // check: https://github.com/moment/moment/issues/2166
    if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
            (milliseconds <= 0 && days <= 0 && months <= 0))) {
        milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
        days = 0;
        months = 0;
    }

    // The following code bubbles up values, see the tests for
    // examples of what that means.
    data.milliseconds = milliseconds % 1000;

    seconds           = absFloor(milliseconds / 1000);
    data.seconds      = seconds % 60;

    minutes           = absFloor(seconds / 60);
    data.minutes      = minutes % 60;

    hours             = absFloor(minutes / 60);
    data.hours        = hours % 24;

    days += absFloor(hours / 24);

    // convert days to months
    monthsFromDays = absFloor(daysToMonths(days));
    months += monthsFromDays;
    days -= absCeil(monthsToDays(monthsFromDays));

    // 12 months -> 1 year
    years = absFloor(months / 12);
    months %= 12;

    data.days   = days;
    data.months = months;
    data.years  = years;

    return this;
}

function daysToMonths (days) {
    // 400 years have 146097 days (taking into account leap year rules)
    // 400 years have 12 months === 4800
    return days * 4800 / 146097;
}

function monthsToDays (months) {
    // the reverse of daysToMonths
    return months * 146097 / 4800;
}

function as (units) {
    if (!this.isValid()) {
        return NaN;
    }
    var days;
    var months;
    var milliseconds = this._milliseconds;

    units = normalizeUnits(units);

    if (units === 'month' || units === 'year') {
        days   = this._days   + milliseconds / 864e5;
        months = this._months + daysToMonths(days);
        return units === 'month' ? months : months / 12;
    } else {
        // handle milliseconds separately because of floating point math errors (issue #1867)
        days = this._days + Math.round(monthsToDays(this._months));
        switch (units) {
            case 'week'   : return days / 7     + milliseconds / 6048e5;
            case 'day'    : return days         + milliseconds / 864e5;
            case 'hour'   : return days * 24    + milliseconds / 36e5;
            case 'minute' : return days * 1440  + milliseconds / 6e4;
            case 'second' : return days * 86400 + milliseconds / 1000;
            // Math.floor prevents floating point math errors here
            case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
            default: throw new Error('Unknown unit ' + units);
        }
    }
}

// TODO: Use this.as('ms')?
function valueOf$1 () {
    if (!this.isValid()) {
        return NaN;
    }
    return (
        this._milliseconds +
        this._days * 864e5 +
        (this._months % 12) * 2592e6 +
        toInt(this._months / 12) * 31536e6
    );
}

function makeAs (alias) {
    return function () {
        return this.as(alias);
    };
}

var asMilliseconds = makeAs('ms');
var asSeconds      = makeAs('s');
var asMinutes      = makeAs('m');
var asHours        = makeAs('h');
var asDays         = makeAs('d');
var asWeeks        = makeAs('w');
var asMonths       = makeAs('M');
var asYears        = makeAs('y');

function clone$1 () {
    return createDuration(this);
}

function get$2 (units) {
    units = normalizeUnits(units);
    return this.isValid() ? this[units + 's']() : NaN;
}

function makeGetter(name) {
    return function () {
        return this.isValid() ? this._data[name] : NaN;
    };
}

var milliseconds = makeGetter('milliseconds');
var seconds      = makeGetter('seconds');
var minutes      = makeGetter('minutes');
var hours        = makeGetter('hours');
var days         = makeGetter('days');
var months       = makeGetter('months');
var years        = makeGetter('years');

function weeks () {
    return absFloor(this.days() / 7);
}

var round = Math.round;
var thresholds = {
    ss: 44,         // a few seconds to seconds
    s : 45,         // seconds to minute
    m : 45,         // minutes to hour
    h : 22,         // hours to day
    d : 26,         // days to month
    M : 11          // months to year
};

// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
    return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
}

function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
    var duration = createDuration(posNegDuration).abs();
    var seconds  = round(duration.as('s'));
    var minutes  = round(duration.as('m'));
    var hours    = round(duration.as('h'));
    var days     = round(duration.as('d'));
    var months   = round(duration.as('M'));
    var years    = round(duration.as('y'));

    var a = seconds <= thresholds.ss && ['s', seconds]  ||
            seconds < thresholds.s   && ['ss', seconds] ||
            minutes <= 1             && ['m']           ||
            minutes < thresholds.m   && ['mm', minutes] ||
            hours   <= 1             && ['h']           ||
            hours   < thresholds.h   && ['hh', hours]   ||
            days    <= 1             && ['d']           ||
            days    < thresholds.d   && ['dd', days]    ||
            months  <= 1             && ['M']           ||
            months  < thresholds.M   && ['MM', months]  ||
            years   <= 1             && ['y']           || ['yy', years];

    a[2] = withoutSuffix;
    a[3] = +posNegDuration > 0;
    a[4] = locale;
    return substituteTimeAgo.apply(null, a);
}

// This function allows you to set the rounding function for relative time strings
function getSetRelativeTimeRounding (roundingFunction) {
    if (roundingFunction === undefined) {
        return round;
    }
    if (typeof(roundingFunction) === 'function') {
        round = roundingFunction;
        return true;
    }
    return false;
}

// This function allows you to set a threshold for relative time strings
function getSetRelativeTimeThreshold (threshold, limit) {
    if (thresholds[threshold] === undefined) {
        return false;
    }
    if (limit === undefined) {
        return thresholds[threshold];
    }
    thresholds[threshold] = limit;
    if (threshold === 's') {
        thresholds.ss = limit - 1;
    }
    return true;
}

function humanize (withSuffix) {
    if (!this.isValid()) {
        return this.localeData().invalidDate();
    }

    var locale = this.localeData();
    var output = relativeTime$1(this, !withSuffix, locale);

    if (withSuffix) {
        output = locale.pastFuture(+this, output);
    }

    return locale.postformat(output);
}

var abs$1 = Math.abs;

function sign(x) {
    return ((x > 0) - (x < 0)) || +x;
}

function toISOString$1() {
    // for ISO strings we do not use the normal bubbling rules:
    //  * milliseconds bubble up until they become hours
    //  * days do not bubble at all
    //  * months bubble up until they become years
    // This is because there is no context-free conversion between hours and days
    // (think of clock changes)
    // and also not between days and months (28-31 days per month)
    if (!this.isValid()) {
        return this.localeData().invalidDate();
    }

    var seconds = abs$1(this._milliseconds) / 1000;
    var days         = abs$1(this._days);
    var months       = abs$1(this._months);
    var minutes, hours, years;

    // 3600 seconds -> 60 minutes -> 1 hour
    minutes           = absFloor(seconds / 60);
    hours             = absFloor(minutes / 60);
    seconds %= 60;
    minutes %= 60;

    // 12 months -> 1 year
    years  = absFloor(months / 12);
    months %= 12;


    // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
    var Y = years;
    var M = months;
    var D = days;
    var h = hours;
    var m = minutes;
    var s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
    var total = this.asSeconds();

    if (!total) {
        // this is the same as C#'s (Noda) and python (isodate)...
        // but not other JS (goog.date)
        return 'P0D';
    }

    var totalSign = total < 0 ? '-' : '';
    var ymSign = sign(this._months) !== sign(total) ? '-' : '';
    var daysSign = sign(this._days) !== sign(total) ? '-' : '';
    var hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

    return totalSign + 'P' +
        (Y ? ymSign + Y + 'Y' : '') +
        (M ? ymSign + M + 'M' : '') +
        (D ? daysSign + D + 'D' : '') +
        ((h || m || s) ? 'T' : '') +
        (h ? hmsSign + h + 'H' : '') +
        (m ? hmsSign + m + 'M' : '') +
        (s ? hmsSign + s + 'S' : '');
}

var proto$2 = Duration.prototype;

proto$2.isValid        = isValid$1;
proto$2.abs            = abs;
proto$2.add            = add$1;
proto$2.subtract       = subtract$1;
proto$2.as             = as;
proto$2.asMilliseconds = asMilliseconds;
proto$2.asSeconds      = asSeconds;
proto$2.asMinutes      = asMinutes;
proto$2.asHours        = asHours;
proto$2.asDays         = asDays;
proto$2.asWeeks        = asWeeks;
proto$2.asMonths       = asMonths;
proto$2.asYears        = asYears;
proto$2.valueOf        = valueOf$1;
proto$2._bubble        = bubble;
proto$2.clone          = clone$1;
proto$2.get            = get$2;
proto$2.milliseconds   = milliseconds;
proto$2.seconds        = seconds;
proto$2.minutes        = minutes;
proto$2.hours          = hours;
proto$2.days           = days;
proto$2.weeks          = weeks;
proto$2.months         = months;
proto$2.years          = years;
proto$2.humanize       = humanize;
proto$2.toISOString    = toISOString$1;
proto$2.toString       = toISOString$1;
proto$2.toJSON         = toISOString$1;
proto$2.locale         = locale;
proto$2.localeData     = localeData;

proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
proto$2.lang = lang;

// Side effect imports

// FORMATTING

addFormatToken('X', 0, 0, 'unix');
addFormatToken('x', 0, 0, 'valueOf');

// PARSING

addRegexToken('x', matchSigned);
addRegexToken('X', matchTimestamp);
addParseToken('X', function (input, array, config) {
    config._d = new Date(parseFloat(input, 10) * 1000);
});
addParseToken('x', function (input, array, config) {
    config._d = new Date(toInt(input));
});

// Side effect imports


hooks.version = '2.21.0';

setHookCallback(createLocal);

hooks.fn                    = proto;
hooks.min                   = min;
hooks.max                   = max;
hooks.now                   = now;
hooks.utc                   = createUTC;
hooks.unix                  = createUnix;
hooks.months                = listMonths;
hooks.isDate                = isDate;
hooks.locale                = getSetGlobalLocale;
hooks.invalid               = createInvalid;
hooks.duration              = createDuration;
hooks.isMoment              = isMoment;
hooks.weekdays              = listWeekdays;
hooks.parseZone             = createInZone;
hooks.localeData            = getLocale;
hooks.isDuration            = isDuration;
hooks.monthsShort           = listMonthsShort;
hooks.weekdaysMin           = listWeekdaysMin;
hooks.defineLocale          = defineLocale;
hooks.updateLocale          = updateLocale;
hooks.locales               = listLocales;
hooks.weekdaysShort         = listWeekdaysShort;
hooks.normalizeUnits        = normalizeUnits;
hooks.relativeTimeRounding  = getSetRelativeTimeRounding;
hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
hooks.calendarFormat        = getCalendarFormat;
hooks.prototype             = proto;

// currently HTML5 input type only supports 24-hour formats
hooks.HTML5_FMT = {
    DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',             // <input type="datetime-local" />
    DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss',  // <input type="datetime-local" step="1" />
    DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS',   // <input type="datetime-local" step="0.001" />
    DATE: 'YYYY-MM-DD',                             // <input type="date" />
    TIME: 'HH:mm',                                  // <input type="time" />
    TIME_SECONDS: 'HH:mm:ss',                       // <input type="time" step="1" />
    TIME_MS: 'HH:mm:ss.SSS',                        // <input type="time" step="0.001" />
    WEEK: 'YYYY-[W]WW',                             // <input type="week" />
    MONTH: 'YYYY-MM'                                // <input type="month" />
};

return hooks;

})));

},{}]},{},[8]);
