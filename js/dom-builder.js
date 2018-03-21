"use strict";

let db = require("./db-interaction");
let user = require("./user");
let favorites = require("./favorites");
let favTeams = [];

function populateFavTeam(){
    console.log("made it");
    db.retrieveFavTeam()
    .then((userData) => {
        let fbFavTeamArray = (Object.values(userData));
        console.log("fbFavTeamArray",fbFavTeamArray);
        let currentUid = user.getUser();
        favTeams = [];
        $("#tbody").html("");
        for (let i = 0;i < fbFavTeamArray.length;i++){
            let checkUid = fbFavTeamArray[i];
            checkUid = checkUid.uid;
            if(currentUid == checkUid){
                console.log("currentUid",currentUid,"checkUid",checkUid);
                let currentFavTeam = fbFavTeamArray[i];
                currentFavTeam = currentFavTeam.Name;
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
    favorites.favTeamSchedule();
}

module.exports = {populateFavTeam};