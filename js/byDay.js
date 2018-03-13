"use strict";
var moment = require('moment');

var date = moment().format('YYYY-MM-DD');

console.log(date);

var dayUrl = `https://statsapi.web.nhl.com/api/v1/schedule?startDate=${date}&expand=schedule.teams,schedule.linescore,schedule.broadcasts,schedule.ticket,schedule.game.content.media.epg&leaderCategories=&site=en_nhl&teamId=`;

function useDay(callBackFunction){



    $.ajax({
        url: dayUrl
    }).done(function(data) {
        // When you tell jQuery to read a file via the ajax method
        // it reads the contents, and then executes whatever function
        // that you specify here in the done() method, and passes in
        // the contents of the file as the first argument.
        console.log("full day",data);
        let dayData = data;
        callBackFunction(dayData);
});
}

function listDay(dayData){
    let day = dayData.dates[0].games;
    for(let l = 0;l < day.length;l++){
    let currentGame = day[l];
    console.log("Game",l+1);
    console.log("Away team",currentGame.teams.away.team.name);
    console.log("Record",currentGame.teams.away.leagueRecord.wins,"-",
    currentGame.teams.away.leagueRecord.losses,"-",
    currentGame.teams.away.leagueRecord.ot);    
    console.log("Home team",currentGame.teams.home.team.name);
    console.log("Season Wins",currentGame.teams.home.leagueRecord.wins,"-",
    currentGame.teams.home.leagueRecord.losses,"-",
    currentGame.teams.home.leagueRecord.ot);  
}
}

useDay(listDay);

module.exports = {useDay,listDay};