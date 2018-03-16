"use strict";

let game = require("./game");
let day = require("./byDay");
let team = require("./team");
let favoriteTeam;
let userDisplayName;
let result;

let db = require("./db-interaction"),
    user = require("./user");

$('#btn-teams').click(team.printTeamHeader);

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
      $("#title").html(`Welcome ${welcomeName}`);

      if (favoriteTeam){
        console.log("has a favorite team");
      }else{
        console.log("no favorite team");
        $("#favorite-div").removeClass("is-hidden");
      }  

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
