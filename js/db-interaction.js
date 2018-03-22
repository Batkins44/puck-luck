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
    let password = "puck-luck";
    
    
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
        let password = "puck-luck";
        
        
        
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
                uid:currentUid
            };
            let playerID = favPlayerObj.playerID;

            // favPlayerObj.team = playerTeamObject;
            addFavPlayer(favPlayerObj);
            grabFavPlayers();
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
        $("#title").html("<h1>Favorite Players<h1>");
        $("#tbody").html("");
        $("#counter").html("Player");
        $("#left-head").html("");
        $("#middle-head").html("");
        $("#right-head").html("");
        $("#favorite-div").addClass("is-hidden");
        $("#run-fav-teams").removeClass("is-hidden");
        $("#run-fav-players").addClass("is-hidden");

        for(let p=0;p<uidFavPlayers.length;p++){
            getPlayerLogs(uidFavPlayers[p]);
        }


    });
}







function getPlayerLogs(uidFavPlayers){


    let username = "batkins4";
    let password = "puck-luck";
    let playerID = uidFavPlayers.playerID;
    
    
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
            },
            url: `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/player_gamelogs.json?player=${playerID}`
        }).done(function(data) {
                
                let gamelogs = data.playergamelogs.gamelogs;

                let previousGame = gamelogs[gamelogs.length-1];
                let previousGameTwo = gamelogs[gamelogs.length-2];
                let previousGameThree = gamelogs[gamelogs.length-3];
                let previousStats;
                let previousStatsTwo;
                let previousStatsThree;




                if(previousGame.player.Position == "G"){
                    if(previousGameThree.stats.Wins["#text"] == "1"){

                        previousStatsThree = `Win<br>${previousGameThree.stats.Saves["#text"]}<br>Save %: ${previousGameThree.stats.SavePercentage["#text"]}<br>GAA: ${previousGameThree.stats.GoalsAgainstAverage["#text"]}`;
                    }else if(previousGameThree.stats.OvertimeLosses["#text"] == "1"){
                    previousStatsThree = `OverTime Loss<br>Saves: ${previousGameThree.stats.Saves["#text"]}<br>Save %: ${previousGameThree.stats.SavePercentage["#text"]}<br>GAA: ${previousGameThree.stats.GoalsAgainstAverage["#text"]}`;
                    }else{
                       previousStatsThree = `Loss<br>Saves: ${previousGameThree.stats.Saves["#text"]}<br>Save %: ${previousGameThree.stats.SavePercentage["#text"]}<br>GAA: ${previousGameThree.stats.GoalsAgainstAverage["#text"]}`;
                    }
                    if(previousGameTwo.stats.Wins["#text"] == "1"){

                        previousStatsTwo = `Win<br>Saves: ${previousGameTwo.stats.Saves["#text"]}<br>Save %: ${previousGameTwo.stats.SavePercentage["#text"]}<br>GAA: ${previousGameTwo.stats.GoalsAgainstAverage["#text"]}`;
                    }else if(previousGameTwo.stats.OvertimeLosses["#text"] == "1"){
                    previousStatsTwo = `OverTime Loss<br>Saves: ${previousGameTwo.stats.Saves["#text"]}<br>Save %: ${previousGameTwo.stats.SavePercentage["#text"]}<br>GAA: ${previousGameTwo.stats.GoalsAgainstAverage["#text"]}`;
                    }else{
                       previousStatsTwo = `Loss<br>Saves: ${previousGameTwo.stats.Saves["#text"]}<br>Save %: ${previousGameTwo.stats.SavePercentage["#text"]}<br>GAA: ${previousGameTwo.stats.GoalsAgainstAverage["#text"]}`;
                    }
                    if(previousGame.stats.Wins["#text"] == "1"){
                        previousStats = `Win<br>Saves: ${previousGame.stats.Saves["#text"]}<br>Save %: ${previousGame.stats.SavePercentage["#text"]}<br>GAA: ${previousGame.stats.GoalsAgainstAverage["#text"]}`;
                    }else if(previousGame.stats.OvertimeLosses["#text"] == "1"){
                    previousStats = `OverTime Loss<br>Saves: ${previousGame.stats.Saves["#text"]}<br>Save %: ${previousGame.stats.SavePercentage["#text"]}<br>GAA: ${previousGame.stats.GoalsAgainstAverage["#text"]}`;
                    }else{
                       previousStats = `Loss<br>Saves: ${previousGame.stats.Saves["#text"]}<br>Save %: ${previousGame.stats.SavePercentage["#text"]}<br>GAA: ${previousGame.stats.GoalsAgainstAverage["#text"]}`;
                    }

                                   }
                                    else{
                    previousStats=`Goals: ${previousGame.stats.Goals["#text"]}<br>
                    Assists: ${previousGame.stats.Assists["#text"]}<br>
                    Shots: ${previousGame.stats.Shots["#text"]}<br>
                    Hits: ${previousGame.stats.Hits["#text"]}<br>
                    Blocks: ${previousGame.stats.BlockedShots["#text"]}`;
                    previousStatsTwo=`Goals: ${previousGameTwo.stats.Goals["#text"]}<br>
                    Assists: ${previousGameTwo.stats.Assists["#text"]}<br>
                    Shots: ${previousGameTwo.stats.Shots["#text"]}<br>
                    Hits: ${previousGameTwo.stats.Hits["#text"]}<br>
                    Blocks: ${previousGameTwo.stats.BlockedShots["#text"]}`;
                    previousStatsThree=`Goals: ${previousGameThree.stats.Goals["#text"]}<br>
                    Assists: ${previousGameThree.stats.Assists["#text"]}<br>
                    Shots: ${previousGameThree.stats.Shots["#text"]}<br>
                    Hits: ${previousGameThree.stats.Hits["#text"]}<br>
                    Blocks: ${previousGame.stats.BlockedShots["#text"]}`;

                }

                let team = `${previousGame.team.City} ${previousGame.team.Name}`;

                let favPlayersObj = {
                    name:uidFavPlayers.name,
                    team: team,
                    date1: previousGame.game.date,
                    stats1: previousStats,
                    date2: previousGameTwo.game.date,
                    stats2: previousStatsTwo,
                    date3:previousGameThree.game.date,
                    stats3:previousStatsThree
 };
 favoritePlayerObjArray.push(favPlayersObj);



                $("#tbody").append(`<tr><th scope="row">${uidFavPlayers.name}<br>${previousGame.team.City} ${previousGame.team.Name}<br><button id="delete_${playerID}" class="btn btn-danger">Delete</button></th><td>${previousGame.game.date}<br>${previousStats}</td> 
                <td>${previousGameTwo.game.date}<br>${previousStatsTwo}</td>
                <td>${previousGameThree.game.date}<br>${previousStatsThree}</td></tr>`);





    });
    }

$("#run-fav-players").click(grabFavPlayers);

//example with delete
// function deleteItem(fbID) {
// 	return $.ajax({
//       	url: `${firebase.getFBsettings().databaseURL}/songs/${fbID}.json`,
//       	method: "DELETE"
// 	}).done((data) => {
// 		return data;
// 	});
// }

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
