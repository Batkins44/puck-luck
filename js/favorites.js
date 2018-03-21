"use strict";

var moment = require('moment');
let db = require("./db-interaction");
let user = require("./user");
let urlString;
let favTeamInfoArray = [];

function getGameInfo(abbr,teams){

    let username = "batkins4";
    let password = "puck-luck";

        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
            },
            url: `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/full_game_schedule.json?team=${abbr}`
        }).done((data) => {
            console.log("schedule data",data);
            let nextGameIndex = null;
            let today = new Date();
            today = Date.parse(today);
            today = today-75000000;
            console.log(today);
            console.log("what is teams",teams);
            for(let j=0;j<teams.length;j++){
                let currentTeamID = teams[j].ID;
                for (let i=0;i<data.fullgameschedule.gameentry.length;i++){
                    let currentGame = data.fullgameschedule.gameentry[i];
                    if (currentGame.awayTeam.ID == currentTeamID || currentGame.homeTeam.ID == currentTeamID){
                        // console.log("found it",currentGame.awayTeam.Name,"vs",currentGame.homeTeam.Name);
                        let currentDate = currentGame.date;
                        currentDate = Date.parse(currentDate);
                        if(currentDate > today){
                            // console.log("found it",currentGame.awayTeam.Name,"at",currentGame.homeTeam.Name);
                            teams[j].nextGame = [currentGame.awayTeam.Abbreviation,currentGame.homeTeam.Abbreviation,currentGame.id,currentGame.date,currentGame.time];
                            let k = i-1;
                            for(let p=k;p>0;p--){
                                let currentGame = data.fullgameschedule.gameentry[p];

                                if (currentGame.awayTeam.ID == currentTeamID || currentGame.homeTeam.ID == currentTeamID){
                                    
                                    teams[j].previousGame = [currentGame.awayTeam.Abbreviation,currentGame.homeTeam.Abbreviation,currentGame.id,currentGame.date,currentGame.time];
                                    break;
                                }
                            }
                            // teams[j].previousGame = `${data.fullgameschedule.gameentry[i-1].awayTeam.Name} "at" ${data.fullgameschedule.gameentry[i-1].homeTeam.Name}`;
                            // console.log(teams);
                            break;

                        }
                        

                    }

                    
                }

            }

            formatTeams(teams);

   
       });
    }

function favTeamSchedule(favTeamArray){
let stringAbbr = "";
    // db.retrieveFavTeam()
    // .then((userData) => {
        let currentUser = user.getUser();

        // console.log("FAVTEAMARRAY",favTeamArray);

        // let favTeamArray = (Object.values(userData));
        
        for (let i=0;i<favTeamArray.length;i++){
            console.log(favTeamArray[i].abbr);
            stringAbbr += favTeamArray[i].abbr;
            stringAbbr += ",";
        }
        stringAbbr = stringAbbr.substring(0, stringAbbr.length - 1);
        console.log("stringAbbr",stringAbbr);
        getGameInfo(stringAbbr,favTeamArray);
    // });

}


function formatTeams(teams){
// console.log("please have all the data teams",teams);
let urlString = "";
for (let i=0;i<teams.length;i++){
    let currentTeam = teams[i];
    let currentDate = currentTeam.previousGame[3];
    var newDate = currentDate.replace(/-/g, "");

    urlString = (newDate + "-" + currentTeam.previousGame[0] + "-" + currentTeam.previousGame[1]);
    // console.log(urlString);
    teams[i].urlString = `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/game_boxscore.json?gameid=${urlString}&teamstats=W,L,GF,GA,Pts&playerstats=G,A,Pts,Sh`;
    usePreviousGame(getPreviousGamePlayers,teams[i]);
}

}

function usePreviousGame(callBackFunction,team){

    let username = "batkins4";
    let password = "puck-luck";
    

    
    
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
    // console.log("gameData",gameData,"teams",teams);
    let goalsArray = [];
    let assistsArray = [];
    let pointsArray = [];
    let players;

    if(teams.ID == gameData.gameboxscore.game.awayTeam.ID){
        players = gameData.gameboxscore.awayTeam.awayPlayers.playerEntry;
    }
    else{
        players = gameData.gameboxscore.homeTeam.homePlayers.playerEntry;
    }

    for(let i=0;i<players.length;i++){
        let stats = players[i].stats;

        // console.log([stats.Goals["#text"],players[i].player.ID]);
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

    let goalsLeader = idPlayerFinder(goalsArray[0][1],players);
    let assistLeader = idPlayerFinder(assistsArray[0][1],players);
    let pointsLeader = idPlayerFinder(pointsArray[0][1],players);
    teams.goalsLeader = goalsLeader;
    teams.assistLeader = assistLeader;
    teams.pointsLeader = pointsLeader;

    favTeamInfoArray.push(teams);





    $("#tbody").append(`<tr><th scope="row">${teams.Name}</th><td>${teams.nextGame[0]} @ ${teams.nextGame[1]}<br>${teams.nextGame[3]}<br>
    ${teams.nextGame[4]}</td>   
    <td>${teams.previousGame[0]} @ ${teams.previousGame[1]}<br>${teams.previousGame[3]}<br>${teams.previousGame[4]}</td>
   <td>Goals Leader: ${goalsLeader}<br>Assists Leader: ${assistLeader}<br>Points Leader: ${pointsLeader}</td>
   </tr>`);

}



function idPlayerFinder(id, players){
// console.log("GAMEDATA IS HERE",players,"id",id);
let goals = "";
let assists ="";
let points = "";

for(let q=0;q<players.length;q++){
    let currentPlayerID = players[q].player.ID;

    if (currentPlayerID == id){

        let playerInfo = (players[q].player.FirstName + " " + players[q].player.LastName + " ");
        if(players[q].stats.Goals["#text"]>0){
            goals = ((players[q].stats.Goals["#text"])+ " G ");

        }
        if(players[q].stats.Assists["#text"]>0){
            assists = ((players[q].stats.Assists["#text"])+ " A ");
        }
        if(players[q].stats.Points["#text"]>0){
            if(players[q].stats.Points["#text"]>1){
            points = ((players[q].stats.Points["#text"])+ " Pts ");
            }
            else{
                points = ((players[q].stats.Points["#text"])+ " Pt ");
            }
        }
        playerInfo = playerInfo + goals;
        playerInfo = playerInfo + assists;
        playerInfo = playerInfo + points;
        // console.log(playerInfo);
        return playerInfo;
    }
    
}

// return playerInfo;
}

// function refreshFavTeams(){
//     console.log("FAVTEAMINFOARRAY",favTeamInfoArray);
//     let teams = favTeamInfoArray;
//     $("#tbody").html("");
//     for(let i=0;i<teams.length;i++){
//     $("#tbody").append(`<tr><th scope="row">${teams[i].Name}</th><td>${teams[i].nextGame[0]} @ ${teams[i].nextGame[1]}<br>${teams[i].nextGame[3]}<br>
//     ${teams[i].nextGame[4]}</td>   
//     <td>${teams[i].previousGame[0]} @ ${teams[i].previousGame[1]}<br>${teams[i].previousGame[3]}<br>${teams[i].previousGame[4]}</td>
//    <td>Goals Leader: ${teams[i].goalsLeader}<br>Assists Leader: ${teams[i].assistLeader}<br>Points Leader: ${teams[i].pointsLeader}</td>
//    </tr>`);
// }}

// $("#refresh").click(refreshFavTeams);

module.exports = {getGameInfo,favTeamSchedule};