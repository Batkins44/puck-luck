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
    $("#left").html("<h5>Skaters</h5>");
    $("#middle").html("<h5>Stats</h5>");
    $("#right").html("<h5>Goalies</h5>");
    for(let p=0;p<player.length;p++){
        let currentPlayer = player[p];
        let gp = currentPlayer.stats.GamesPlayed["#text"];

        if(gp > 0 && currentPlayer.player.Position !== "G"){
            $("#left").append(`${currentPlayer.player.FirstName}<br>${currentPlayer.player.LastName}<hr>`);
            $("#middle").append(`${currentPlayer.stats.stats.Goals["#text"]} G, `);
            $("#middle").append(`${currentPlayer.stats.stats.Assists["#text"]} A,<br>`);
            $("#middle").append(`${currentPlayer.stats.stats.Points["#text"]} P, `);
            $("#middle").append(`${currentPlayer.stats.stats.Shots["#text"]} Shots<hr>`);
        }else if(gp > 0 && currentPlayer.player.Position == "G"){
            let ga = currentPlayer.stats.stats.GoalsAgainst["#text"];
            ga = parseInt(ga);
            let sv = currentPlayer.stats.stats.Saves["#text"];
            sv = parseInt(sv);
            let savePer = sv+ga;

            savePer = sv/savePer;
            savePer = Math.round(savePer * 10000) / 100;

            $("#right").append(`${currentPlayer.player.FirstName} ${currentPlayer.player.LastName}<br>`);
            $("#right").append(`Record: ${currentPlayer.stats.stats.Wins["#text"]}-${currentPlayer.stats.stats.Losses["#text"]}-${currentPlayer.stats.stats.OvertimeLosses["#text"]}<br>`);
            $("#right").append(`Saves: ${sv}<br>`);
            $("#right").append(`Shutouts: ${currentPlayer.stats.stats.Shutouts["#text"]}<br>`);
            $("#right").append(`Goals Against Average: ${currentPlayer.stats.stats.GoalsAgainstAverage["#text"]}<br>`);
            $("#right").append(`Save %: ${savePer}<hr>`);

        }
    }

}

function printTeamHeader() {
    $("#left").html("<h5>Skaters</h5>");
    $("#middle").html("<h5>Stats</h5>");
    $("#right").html("<h5>Goalies</h5>");
    $("#title").html(
    `<h1>Stats By Team</h1><br><select id="team-select">
    <option value="c">Choose a Team</option>
    <option value="anaheim-ducks">Anaheim Ducks</option>
    <option value="arizona-coyotes">Arizona Coyotes</option>
    <option value="boston-bruins">Boston Bruins</option>
    <option value="buffalo-sabres">Buffalo Sabres</option>
    <option value="calgary-flames">Calgary Flames</option>
    <option value="carolina-hurricanes">Carolina Hurricanes</option>
    <option value="chicago-blackhawks">Chicago Blackhawks</option>
    <option value="colorado-avalanche">Colorado Avalanche</option>
    <option value="columbus-bluejackets">Columbus Blue Jackets</option>
    <option value="dallas-stars">Dallas Stars</option>
    <option value="detroit-redwings">Detroit Red Wings</option>
    <option value="edmonton-oilers">Edmonton Oilers</option>
    <option value="florida-panthers">Florida Panthers</option>
    <option value="losangeles-kings">Los Angeles Kings</option>
    <option value="minnesota-wild">Minnesota Wild</option>
    <option value="montreal-canadiens">Montreal Canadiens</option>
    <option value="nashville-predators">Nashville Predators</option>
    <option value="newjersey-devils">New Jersey Devils</option>
    <option value="newyork-islanders">New York Islanders</option>
    <option value="newyork-rangers">New York Rangers</option>
    <option value="ottawa-senators">Ottawa Senators</option>
    <option value="philadelphia-flyers">Philadelphia Flyers</option>
    <option value="pittsburgh-penguins">Pittsburgh Penguins</option>
    <option value="sanjose-sharks">San Jose Sharks</option>
    <option value="stlouis-blues">St Louis Blues</option>
    <option value="tampabay-lightning">Tampa Bay Lightning</option>
    <option value="toronto-mapleleafs">Toronto Maple Leafs</option>
    <option value="vancouver-canucks">Vancouver Canucks</option>
    <option value="vegas-goldenknights">Vegas Golden Knights</option>
    <option value="washington-capitals">Washington Capitals</option>
    <option value="winnipeg-jets">Winnipeg Jets</option>
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