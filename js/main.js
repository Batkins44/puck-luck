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

let db = require("./db-interaction"),
    user = require("./user");

$('#btn-teams').click(team.printTeamHeader);
$('#players-btn').click(players.printPlayerHeader);

$("#login").click(function() {
    console.log("clicked login");
    db.logInGoogle()
    .then((result) => {
      console.log("result from login", result.user.uid);
      user.setUser(result.user.uid);
      user.setName(result.user.displayName);
      $("#login").addClass("is-hidden");
      $("#logout").removeClass("is-hidden");
      $("#main-header").removeClass("is-hidden");
      $("#favorite-div").removeClass("is-hidden");
      userDisplayName = result.user.displayName;
      let welcomeName = userDisplayName.substr(0,userDisplayName.indexOf(' '));
      console.log("welcome Name",welcomeName);
      db.checkUserExist();
      $("#title").html(`<h1>Welcome ${welcomeName}</h1>`);

 

        setTimeout(dom.populateFavTeam(),1000);


    });
  });
  
  $("#logout").click(() => {
      console.log("main.logout clicked");
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
    setTimeout(favorites.refreshFavTeams(),5000);

});

// $("option").click((event) => {
//     favTeamID = event.target.id;
//     console.log("THIS IS YOUR TEAMS ID",favTeamID);
// });

$("#home-btn").click(() => {
    $("#favorite-div").removeClass("is-hidden");
    $("#player-search").addClass("is-hidden");
    $("#title").html(`<h1>Your Teams</h1>`);
    $("#tbody").html("");
    dom.populateFavTeam();
});

