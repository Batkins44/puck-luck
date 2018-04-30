"use strict";

var moment = require('moment');
let db = require("./db-interaction");
let user = require("./user");
let dom = require("./dom-builder");
let news = require("./news");
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
            $("#title").append(`<h5>Season is over. See ya next October!</h5><br><h5>Feel free to browser the rest of our site!</h5><hr>`);
            $("#fav-players-btn").addClass("is-hidden");
            $("#fav-teams-btn").addClass("is-hidden");
            $("#favorite-div").html("");
            }else{
                $("#news-btn").addClass("is-hidden");
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