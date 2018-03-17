"use strict";

let team = require("./team");

var playersUrl = "https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/active_players.json";
let playerResults;

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
}

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

    $("#tbody").append(`<tr><th scope="row">${printPlayer.JerseyNumber}<br>${printPlayer.Position}</th><td>${printPlayer.FirstName + " " + printPlayer.LastName}<br>${image}</td>   
    <td>Born: ${printPlayer.BirthCountry}<br>Birthday: ${printPlayer.BirthDate}<br>Height: ${printPlayer.Height}<br>Weight:${printPlayer.Weight}<br>${twitterAccount}</td>
   <td></td>
   </tr>`);
    // row = row + 1;

}}

function runSearch(){
    usePlayers(searchPlayers);
}


$("#run-player-search").click(runSearch);

module.exports = {usePlayers,searchPlayers,runSearch,printPlayerHeader};