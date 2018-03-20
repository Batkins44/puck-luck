"use strict";

let team;

var teamUrl = `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/cumulative_player_stats.json?playerstats=G,A,Pts,Sh,Sv,W,L,OTL,SO,GAA,GA&team=${team}`;

function useTeam(callBackFunction){

let username = "batkins4";
let password = "puck-luck";



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
    console.log(player);
    let row = 1;
    $("#tbody").html("");
    for(let p=0;p<player.length;p++){
        let currentPlayer = player[p];
        let gp = currentPlayer.stats.GamesPlayed["#text"];

        if(gp > 0 && currentPlayer.player.Position !== "G"){
            $("#tbody").append(`<tr>
            <th scope="row">${currentPlayer.player.JerseyNumber}</th><td>${currentPlayer.player.FirstName} ${currentPlayer.player.LastName}</td><td>${currentPlayer.player.Position}</td> <td>${currentPlayer.stats.stats.Goals["#text"]} G, ${currentPlayer.stats.stats.Assists["#text"]} A, ${currentPlayer.stats.stats.Points["#text"]} P, ${currentPlayer.stats.stats.Shots["#text"]} Shots</td></tr>`);
        }else if(gp > 0 && currentPlayer.player.Position == "G"){
            let ga = currentPlayer.stats.stats.GoalsAgainst["#text"];
            ga = parseInt(ga);
            let sv = currentPlayer.stats.stats.Saves["#text"];
            sv = parseInt(sv);
            let savePer = sv+ga;

            savePer = sv/savePer;
            savePer = Math.round(savePer * 10000) / 100;
            $("#tbody").append(`<tr><th scope="row">${currentPlayer.player.JerseyNumber}</th><td><b>${currentPlayer.player.FirstName} ${currentPlayer.player.LastName}</b></td> 
            <td>${currentPlayer.player.Position}</td>
            <td>Record: ${currentPlayer.stats.stats.Wins["#text"]}-${currentPlayer.stats.stats.Losses["#text"]}-${currentPlayer.stats.stats.OvertimeLosses["#text"]}<br>
            Saves: ${sv}<br> Shutouts: ${currentPlayer.stats.stats.Shutouts["#text"]}<br>
            Goals Against Average: ${currentPlayer.stats.stats.GoalsAgainstAverage["#text"]}<br>
            Save %: ${savePer}</td></tr>`);

        }
        row = row +1;
    }

}

function printTeamHeader() {
    $("#tbody").html("");
    $("#left").html("<h5>Skaters</h5>");
    $("#middle").html("<h5>Stats</h5>");
    $("#right").html("<h5>Goalies</h5>");
    $("#favorite-div").addClass("is-hidden");
    $("#player-search").addClass("is-hidden");
    $("#left-head").html(`<h5>Skaters<h5>`);
    $("#middle-head").html(`<h5>Position</h5>`);
    $("#right-head").html(`<h5>Stats</h5>`);
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
    </select>`);
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