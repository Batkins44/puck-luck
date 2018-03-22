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
    let password = "puck-luck";
    
    
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

    $("#player-search").removeClass("is-hidden");
    $("#left-head").html("<h5>Player</h5>");
    $("#middle-head").html("<h5>Info</h5>");
    $("#right-head").html("<h5>Stats</h5>");
    $("#counter").html(`<h5>Number/Position</h5>`);
    $("#favorite-div").addClass("is-hidden");
    $("#title").html(`<h1>Search For a Player</h1>`);
    $("#run-fav-teams").addClass("is-hidden");
    $("#run-fav-players").addClass("is-hidden");

    $("#tbody").html("");
}

function usePlayerStats(idArray,playerInfoObj){
    let username = "batkins4";
    let password = "puck-luck";
    
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

                        $("#tbody").append(`<tr><th scope="row">${playerInfoObjArray[p].jersey}<br>${playerInfoObjArray[p].position}<br><button class="btn btn-light" id='addPlayer_${playerInfoObjArray[p].playerID}'>Add to Favorites</button></th><td>${playerInfoObjArray[p].name}<br>${playerInfoObjArray[p].image}</td>   
                        <td>Team: ${data.cumulativeplayerstats.playerstatsentry[z].team.City} ${data.cumulativeplayerstats.playerstatsentry[z].team.Name}<br>Born: ${playerInfoObjArray[p].country}<br>Birthday: ${playerInfoObjArray[p].bday}<br>Height: ${playerInfoObjArray[p].height}<br>Weight:${playerInfoObjArray[p].weight}<br>${playerInfoObjArray[p].twitter}<br></td><td>Goals: ${currentStats.Goals["#text"]}<br>
                        Assists: ${currentStats.Assists["#text"]}<br>Points: ${currentStats.Points["#text"]}<br>Shots: ${currentStats.Shots["#text"]}</td></tr>`);
                    }else if(currentEntry == currentID && data.cumulativeplayerstats.playerstatsentry[z].player.Position == "G"){
                        let currentStats = data.cumulativeplayerstats.playerstatsentry[z].stats.stats;
                        let ga = currentStats.GoalsAgainst["#text"];
                        ga = parseInt(ga);
                        let sv = currentStats.Saves["#text"];
                        sv = parseInt(sv);
                        let savePer = sv+ga;
            
                        savePer = sv/savePer;
                        savePer = Math.round(savePer * 10000) / 100;
                        $("#tbody").append(`<tr><th scope="row">${playerInfoObjArray[p].jersey}<br>${playerInfoObjArray[p].position}<br><button class="btn btn-light" id='addPlayer_${playerInfoObjArray[p].playerID}'>Add to Favorites</button></th><td>${playerInfoObjArray[p].name}<br>${playerInfoObjArray[p].image}</td>   
                        <td>Team: ${data.cumulativeplayerstats.playerstatsentry[z].team.City} ${data.cumulativeplayerstats.playerstatsentry[z].team.Name}<br>Born: ${playerInfoObjArray[p].country}<br>Birthday: ${playerInfoObjArray[p].bday}<br>Height: ${playerInfoObjArray[p].height}<br>Weight:${playerInfoObjArray[p].weight}<br>${playerInfoObjArray[p].twitter}</td><td>
                        Record: ${currentStats.Wins["#text"]}-${currentStats.Losses["#text"]}-${currentStats.OvertimeLosses["#text"]}<br>Shutouts: ${currentStats.Shutouts["#text"]}<br>GAA: ${currentStats.GoalsAgainstAverage["#text"]}<br>Save %: ${savePer}</td></tr>`);

                    }
                
                
                }
                    }



                }


            }
        }
         

        );
    }







function searchPlayers(playersData){
    // var date = moment().format('MM-DD-YYYY');

    $("#tbody").html("");


    let playerArray = playersData.activeplayers.playerentry;
    let playerSearch = $("#player-input").val();
    let playerResults = [];
    playerSearch = playerSearch.toLowerCase();
    for (let p=0 ; p<playerArray.length; p++){
    let currentLastName = playerArray[p].player.LastName;
    let lcLastName = currentLastName.toLowerCase();
    let currentFirstName = playerArray[p].player.FirstName;
    let lcFirstName = currentFirstName.toLowerCase();


    if (lcLastName.includes(playerSearch) || lcFirstName.includes(playerSearch)){
        let currentFullName = currentFirstName+" "+currentLastName;

        playerResults.push(playerArray[p].player);

    }

    }
    listPlayers(playerResults);

}
function listPlayers(playerResults){
    idArray =[];
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
    usePlayers(searchPlayers);
}

$(document).ready(function() {
    $("body").click(function (event) {
        let selectClass = event.target.className;

        let player = event.target.id;
        let favoritePlayer = player.slice(10, 14);
        if(selectClass == "btn btn-light"){

            db.buildFavPlayerObj(favoritePlayer,playerInfoObjArray);


}});
});


$("#run-player-search").click(runSearch);

module.exports = {usePlayers,searchPlayers,runSearch,printPlayerHeader};