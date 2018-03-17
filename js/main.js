"use strict";

let game = require("./game");
let day = require("./byDay");
let team = require("./team");
let players = require("./players");
let dom =require("./dom-builder");
let favoriteTeam;
let userDisplayName;
let result;

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
      userDisplayName = result.user.displayName;
      let welcomeName = userDisplayName.substr(0,userDisplayName.indexOf(' '));
      console.log("welcome Name",welcomeName);
      db.checkUserExist();
      $("#title").html(`<h1>Welcome ${welcomeName}</h1>`);

 

        dom.populateFavTeam();


    });
  });
  
  $("#logout").click(() => {
      console.log("main.logout clicked");
      db.logOut();
      $("#login").removeClass("is-hidden");
      $("#logout").addClass("is-hidden");
      $("#favorite-div").addClass("is-hidden");
      $("#title").html("Please Login To See Favorite Team");
  });

  $("#run-fav-team").click(() => {
    favoriteTeam = $("#favorite-team-select").val();
    db.buildFavTeamObj(favoriteTeam);
});
