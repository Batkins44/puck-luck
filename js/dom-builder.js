"use strict";

let db = require("./db-interaction");
let user = require("./user");
let favorites = require("./favorites");

let favTeams = [];
function populateFavTeam(){
    favTeams = [];
    db.retrieveFavTeam()
    .then((userData) => {
        let fbFavTeamArray = (Object.values(userData));
        let currentUid = user.getUser();
        $("#tbody").html("");
$("#print").html("");
        for (let i = 0;i < fbFavTeamArray.length;i++){
            let checkUid = fbFavTeamArray[i].uid;
            if(currentUid == checkUid){
                let currentFavTeam = fbFavTeamArray[i];
                // currentFavTeam = currentFavTeam.Name;
                favTeams.push(currentFavTeam);

                
            }


        }

        // for(let q = 0;q<favTeams.length;q++){
        //     $("#tbody").append(`<tr><th scope="row">${favTeams[q]}</th><td></td>   
        //     <td></td>
        //    <td></td>
        //    </tr>`);
        // }
    });
    favorites.favTeamSchedule(favTeams);
}

module.exports = {populateFavTeam};