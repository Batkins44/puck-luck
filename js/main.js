"use strict";

let game = require("./game");
let day = require("./byDay");
let team = require("./team");
let players = require("./players");
let dom =require("./dom-builder");
let favorites = ("./favorites");
let favoriteTeam;
let userDisplayName;
let result;
let welcomeName;
let favTeamID;

let firebase = require("./fb-config"),
    provider = new firebase.auth.GoogleAuthProvider();

let db = require("./db-interaction"),
    user = require("./user");

$('#btn-teams').click(team.printTeamHeader);
$('#players-btn').click(players.printPlayerHeader);

$("#login").click(function() {

    db.logInGoogle()
    .then((result) => {
      user.setUser(result.user.uid);
      user.setName(result.user.displayName);
      $("#login").addClass("is-hidden");
      $("#logout").removeClass("is-hidden");
      $("#main-header").removeClass("is-hidden");
      $("#favorite-div").removeClass("is-hidden");
      $("#run-fav-players").removeClass("is-hidden");
      $("run-fav-teams").addClass("is-hidden");
      $("#main-header").removeClass("is-hidden");
      userDisplayName = result.user.displayName;
      let welcomeName = userDisplayName.substr(0,userDisplayName.indexOf(' '));
      db.checkUserExist();
      $("#title").html(`<h1>Welcome ${welcomeName}</h1>`);
      setTimeout(dom.populateFavTeam(),3000);

 




    });

  });
  
  $("#logout").click(() => {
      db.logOut();
      $("#login").removeClass("is-hidden");
      $("#logout").addClass("is-hidden");
      $("#favorite-div").addClass("is-hidden");
      $("#title").html("Please Login To See Favorite Team");
      $("tbody").html("");
      
  });

  $("#run-fav-team").click((event) => {
    favoriteTeam = $("#favorite-team-select").val();


    db.buildFavTeamObj(favoriteTeam);
    setTimeout(dom.populateFavTeam, 2000 );
    // setTimeout(favorites.refreshFavTeams(),5000);

});



$("#home-btn").click(() => {
    $("#favorite-div").removeClass("is-hidden");
    $("#player-search").addClass("is-hidden");
    $("#run-fav-players").removeClass("is-hidden");
    $("#title").html(`<h1>Your Teams</h1>`);
    $("#tbody").html("");
    $("#counter").html("<h5>Favorite Teams</h5>");
    $("#left-head").html("<h5>Next Game</h5>");
    $("#middle-head").html("<h5>Previous Game</h5>");
    $("#right-head").html("<h5>Notable Players from Previous Game</h5>");
    dom.populateFavTeam();
});

$("#run-fav-teams").click(() => {
    $("#favorite-div").removeClass("is-hidden");
    $("#run-fav-teams").addClass("is-hidden");
    $("#run-fav-players").removeClass("is-hidden");
    $("#player-search").addClass("is-hidden");
    $("#title").html(`<h1>Your Teams</h1>`);
    $("#tbody").html("");
    $("#counter").html("<h5>Favorite Teams</h5>");
    $("#left-head").html("<h5>Next Game</h5>");
    $("#middle-head").html("<h5>Previous Game</h5>");
    $("#right-head").html("<h5>Notable Players from Previous Game</h5>");
    dom.populateFavTeam();
});

function deleteFavTeam(fbID) {
    return $.ajax({
          url: `${firebase.getFBsettings().databaseURL}/favTeam/${fbID}.json`,
          method: "DELETE"
    }).done((data) => {
        dom.populateFavTeam();
        return data;
    });
}

function deleteFavPlayers(fbID) {
    return $.ajax({
          url: `${firebase.getFBsettings().databaseURL}/favPlayer/${fbID}.json`,
          method: "DELETE"
    }).done((data) => {
        db.grabFavPlayers();
        return data;
    });
}




$(document).ready(function() {
    $("body").click(function (event) {
        let selectClass = event.target.className;

        let team = event.target.id;
        if(selectClass == "btn btn-danger" && team.length < 10){
            let teamID = team.substring(7, 10);

            let currentUid = user.getUser();
            db.retrieveFavTeam()
            .then((userData) => {

                let fbIDArray = (Object.keys(userData));
        
                for(let i=0;i<fbIDArray.length;i++){
                    let currentID  = fbIDArray[i];
                    if (userData[currentID].ID == teamID && userData[currentID].uid == currentUid){
                        deleteFavTeam(currentID);
                        break;
                        
                        
                    }
        
                }
        
        
            });




}});

});

$(document).ready(function() {
    $("body").click(function (event) {
        let selectClass = event.target.className;

        let player = event.target.id;
        if(selectClass == "btn btn-danger" && player.length > 10){
            let playerID = player.substring(7, 11);
            

            let currentUid = user.getUser();
            db.retrieveFavPlayers()
            .then((userData) => {

                let fbIDArray = (Object.keys(userData));
        
                for(let i=0;i<fbIDArray.length;i++){
                    let currentID  = fbIDArray[i];
                    if (userData[currentID].playerID == playerID && userData[currentID].uid == currentUid){
                        
                        deleteFavPlayers(currentID);
                        break;
                        
                        
                    }
        
                }
        
        
            });




}});

});