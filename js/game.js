

var url = 'http://statsapi.web.nhl.com/api/v1/game/2017021057/feed/live'

let game;
let nhlData;
function useGame(callBackFunction){



    $.ajax({
        url: url
    }).done(function(data) {
        // When you tell jQuery to read a file via the ajax method
        // it reads the contents, and then executes whatever function
        // that you specify here in the done() method, and passes in
        // the contents of the file as the first argument.
        console.log("fulldata",data);
        let nhlData = data
        callBackFunction(nhlData);
});
}

function listGame(nhlData){
    //console.log(articles);
    let game = nhlData.liveData.boxscore.teams.home.players;
    console.log(game);
    let playersId = Object.keys(game);
    console.log("playersId",playersId);
    console.log("player data",game);
    for(let i=0;i<playersId.length;i++){
        let id = playersId[i];

        var name = game[id].person.fullName;
        $("#print").append(`<h2>${name}</h2>`)
        if('skaterStats' in game[id].stats){
        var time = game[id].stats.skaterStats.timeOnIce;
        var assists = game[id].stats.skaterStats.assists;
        var goals = game[id].stats.skaterStats.goals;
        var shots = game[id].stats.skaterStats.shots;
        var blocks = game[id].stats.skaterStats.blocked;
        var hits = game[id].stats.skaterStats.hits;
        var plusMinus = game[id].stats.skaterStats.plusMinus;
        $("#print").append(`Time on Ice: ${time}<br>`);
        $("#print").append(`Assists: ${assists}<br>`);
        $("#print").append(`Goals: ${goals}<br>`);
        $("#print").append(`Shots on Goal: ${shots}<br>`);
        $("#print").append(`Blocks: ${blocks}<br>`);
        $("#print").append(`Hits: ${hits}<br>`);
        $("#print").append(`+/-: ${plusMinus}<br>`);
        }else{
            $("#print").append(`Did not Play`)
        }
        // console.log("assists, ",nhlData.liveData.boxscore.teams.home.players[id].skaterStats.assists);

    }

}

// function listGame(nhlData){
// let game = nhlData.liveData.boxscore.teams.home.players;
// Object.keys(game).forEach(function (key) {
//     console.log(Object.getOwnPropertyNames(key));
//  });
// }

useGame(listGame)