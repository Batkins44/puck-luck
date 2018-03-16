"use strict";

let game = require("./game");
let day = require("./byDay");
let team = require("./team");
let favoriteTeam;

let db = require("./db-interaction"),
    user = require("./user");

$('#btn-teams').click(team.printTeamHeader);

$("#login").click(function() {
    console.log("clicked login");
    db.logInGoogle()
    .then((result) => {
      console.log("result from login", result.user.uid);
      user.setUser(result.user.uid);
      console.log("should remove");
      $("#login").addClass("is-hidden");
      $("#logout").removeClass("is-hidden");
    //   if (favoriteTeam){
    //     console.log("has a favorite team");
    //   }else{
    //     console.log("no favorite team");
    //     $("#favorite-div").removeClass("is-hidden");
    //   }  

      user.checkUserFB(result.user.uid);
    });
  });
  
  $("#logout").click(() => {
      console.log("main.logout clicked");
      db.logOut();
      $("#login").removeClass("is-hidden");
      $("#logout").addClass("is-hidden");
  });

  $("#run-fav-team").click(() => {
    favoriteTeam = $("#favorite-team-select").val();
    db.buildFavTeamObj(favoriteTeam);
});
