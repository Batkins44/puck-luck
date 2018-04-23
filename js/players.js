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