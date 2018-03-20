"use strict";
/*jshint -W069 */

let team = require("./team");

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
            // When you tell jQuery to read a file via the ajax method
            // it reads the contents, and then executes whatever function
            // that you specify here in the done() method, and passes in
            // the contents of the file as the first argument.

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
    $("#tbody").html("");
}

function usePlayerStats(idArray,playerInfoObj){
    let username = "batkins4";
    let password = "puck-luck";
    
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
            },
            url: `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/cumulative_player_stats.json?playerstats=G,A,Pts,Sh`
        }).done(function(data) {
            // When you tell jQuery to read a file via the ajax method
            // it reads the contents, and then executes whatever function
            // that you specify here in the done() method, and passes in
            // the contents of the file as the first argument.
            for(let i=0;i<idArray.length;i++){
                let currentID = idArray[i];
                // let currentID = data.cumulativeplayerstats.playerstatsentry[i].player.ID;
                console.log("currentID",currentID);
                for(let p=0;p<playerInfoObjArray.length;p++){
                    let currentCheckID = playerInfoObjArray[p].playerID;
                    console.log("checkID",currentCheckID);
                    if(currentID == currentCheckID){
                        console.log("found one",playerInfoObjArray[p].name);
                        for (let z=0;z<1000;z++){
                            let currentEntry = data.cumulativeplayerstats.playerstatsentry[z].player.ID;
                            if (currentEntry == currentID){
                                let currentStats = data.cumulativeplayerstats.playerstatsentry[z].stats.stats;
                                console.log(playerInfoObjArray[p].name,currentStats);


                            

                        
                        $("#tbody").append(`<tr><th scope="row">${playerInfoObjArray[p].jersey}<br>${playerInfoObjArray[p].position}</th><td>${playerInfoObjArray[p].name}<br>${playerInfoObjArray[p].image}</td>   
                        <td>Born: ${playerInfoObjArray[p].country}<br>Birthday: ${playerInfoObjArray[p].bday}<br>Height: ${playerInfoObjArray[p].height}<br>Weight:${playerInfoObjArray[p].weight}<br>${playerInfoObjArray[p].twitter}</td><td>${currentStats.Goals["#text"]}</td></tr>`);
                    }}
                    }



                }

            // let playerStatsGoals = data.cumulativeplayerstats.playerstatsentry["0"].stats.stats.Goals["#text"];
            // let playerStatsAssists = data.cumulativeplayerstats.playerstatsentry["0"].stats.stats.Assists["#text"];
            // let playerStatsPoints = data.cumulativeplayerstats.playerstatsentry["0"].stats.stats.Points["#text"];
            // let playerStatsShots = data.cumulativeplayerstats.playerstatsentry["0"].stats.stats.Shots["#text"];
            // playerStatsObject = {
            //     psG:playerStatsGoals,
            //     psA:playerStatsAssists,
            //     psP:playerStatsPoints,
            //     psS:playerStatsShots,
            //     psID:playerID
            }
        }
            // playerStatsArray.push(playerStatsObject);


            // console.log("right here",playerStatsObject);

            // return playerStatsObject;

        //     $("#tbody").append(`<tr><th scope="row">${playerInfoObj.jersey}<br>${playerInfoObj.position}</th><td>${playerInfoObj.name}<br>${playerInfoObj.image}</td>   
        // <td>Born: ${playerInfoObj.country}<br>Birthday: ${playerInfoObj.bday}<br>Height: ${playerInfoObj.height}<br>Weight:${playerInfoObj.weight}<br>${playerInfoObj.twitter}</td><td>hey</td></tr>`);

        );}



// function listPlayerStats(playerStatsData) {
//     // console.log(playerStatsData.cumulativeplayerstats.playerstatsentry["0"].stats.stats.Goals["#text"]);
//         playerInfoObj['goals'] = playerStatsData.cumulativeplayerstats.playerstatsentry["0"].stats.stats.Goals["#text"];
//         let playerStatsAssists = playerStatsData.cumulativeplayerstats.playerstatsentry["0"].stats.stats.Assists["#text"];
//         let playerStatsPoints = playerStatsData.cumulativeplayerstats.playerstatsentry["0"].stats.stats.Points["#text"];
//         let playerStatsShots = playerStatsData.cumulativeplayerstats.playerstatsentry["0"].stats.stats.Shots["#text"];
//         // playerStatsObject = {
//         //     psG:playerStatsGoals,
//         //     psA:playerStatsAssists,
//         //     psP:playerStatsPoints,
//         //     psS:playerStatsShots
            
//         // };
//         console.log("playerStats1",playerInfoObj);
//         $("#tbody").append(`<tr><th scope="row">${playerInfoObj.jersey}<br>${playerInfoObj.position}</th><td>${playerInfoObj.name}<br>${playerInfoObj.image}</td>   
//     <td>Born: ${playerInfoObj.country}<br>Birthday: ${playerInfoObj.bday}<br>Height: ${playerInfoObj.height}<br>Weight:${playerInfoObj.weight}<br>${playerInfoObj.twitter}</td><td>hey</td></tr>`);

// }



function searchPlayers(playersData){
    // var date = moment().format('MM-DD-YYYY');

    $("#tbody").html("");

    console.log("The Player Data",playersData.activeplayers.playerentry);
    let playerArray = playersData.activeplayers.playerentry;
    let playerSearch = $("#player-input").val();
    let playerResults = [];
    playerSearch = playerSearch.toLowerCase();
    for (let p=0 ; p<playerArray.length; p++){
    let currentLastName = playerArray[p].player.LastName;
    let lcLastName = currentLastName.toLowerCase();
    let currentFirstName = playerArray[p].player.FirstName;
    let lcFirstName = currentFirstName.toLowerCase();
    // console.log("search item",playerSearch);

    if (lcLastName.includes(playerSearch) || lcFirstName.includes(playerSearch)){
        let currentFullName = currentFirstName+" "+currentLastName;
        console.log("Found",currentFullName);
        playerResults.push(playerArray[p].player);
        console.log(playerResults);
    }

    }
    listPlayers(playerResults);

}
function listPlayers(playerResults){

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
    playerInfoObjArray.push(playerInfoObj);


    x=5;
    console.log(c);
    c = c+1;
    let playerID = printPlayer.ID;
    idArray.push(playerID);
    if(c==playerResults.length){
        console.log("idArray",idArray);
        usePlayerStats(idArray);
    }
    console.log(playerID);
    playerStatsUrl = `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/cumulative_player_stats.json?playerstats=G,A,Pts,Sh&player=${playerID}`;
    // usePlayerStats(playerStatsUrl);
    // setTimeout(playerPrint, 5000);
    // $.when(usePlayerStats(playerID)).done(playerPrint);



    // $("#tbody").append(`<tr><th scope="row">${playerInfoObj.jersey}<br>${playerInfoObj.position}</th><td>${playerInfoObj.name}<br>${image}</td>   
    // <td>Born: ${playerInfoObj.country}<br>Birthday: ${playerInfoObj.bday}<br>Height: ${playerInfoObj.height}<br>Weight:${playerInfoObj.weight}<br>${twitterAccount}</td><td>${playerInfoObj.goals}</td></tr>`);
   




    // row = row + 1;

}}



// function playerPrint(){
//     console.log("x",x);

//     console.log("player stats2",playerInfoObj);
//     $("#tbody").append(`<tr><th scope="row">${playerInfoObj.jersey}<br>${playerInfoObj.position}</th><td>${playerInfoObj.name}<br>${playerInfoObj.image}</td>   
//     <td>Born: ${playerInfoObj.country}<br>Birthday: ${playerInfoObj.bday}<br>Height: ${playerInfoObj.height}<br>Weight:${playerInfoObj.weight}<br>${playerInfoObj.twitter}</td><td>${playerInfoObj.goals}</td></tr>`);
// }

function runSearch(){
    usePlayers(searchPlayers);
}




$("#run-player-search").click(runSearch);

module.exports = {usePlayers,searchPlayers,runSearch,printPlayerHeader};