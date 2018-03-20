"use strict";

let db = require("./db-interaction");
let user = require("./user");
let favTeams = [];

function populateFavTeam(){
    db.retrieveFavTeam()
    .then((userData) => {
        console.log("this is the fav team info",userData);
        let fbFavTeamArray = (Object.values(userData));
        // console.log("length of array",fbFavTeamArray.length);
        // console.log("FBFAVTEAM",fbFavTeamArray);
        let currentUid = user.getUser();
        favTeams = [];
        $("#tbody").html("");
        for (let i = 0;i < fbFavTeamArray.length;i++){

            let checkUid = fbFavTeamArray[i];
            checkUid = checkUid.uid;
            console.log("checkUID",checkUid,"currentUID",currentUid);
            if(currentUid == checkUid){
                let currentFavTeam = fbFavTeamArray[i];
                console.log("currentUser",currentFavTeam,"currentFavTeam",currentFavTeam.Name);
                currentFavTeam = currentFavTeam.Name;
                console.log("currentFavTeam",currentFavTeam);
                favTeams.push(currentFavTeam);
                console.log(favTeams);

                
            }
        }
        for(let q = 0;q<favTeams.length;q++){
            $("#tbody").append(`<tr><th scope="row">${favTeams[q]}</th><td></td>   
            <td></td>
           <td></td>
           </tr>`);
        }
    });
}

module.exports = {populateFavTeam};