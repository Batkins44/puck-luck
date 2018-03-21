"use strict";

var moment = require('moment');
let db = require("./db-interaction");

function getGameInfo(abbr,teams){

    let username = "batkins4";
    let password = "puck-luck";

        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
            },
            url: `https://api.mysportsfeeds.com/v1.2/pull/nhl/2017-2018-regular/full_game_schedule.json?team=${abbr}`
        }).done((data) => {
            console.log("schedule data",data);
            let nextGameIndex = null;
            let today = new Date();
            today = Date.parse(today);
            console.log("what is teams",teams);
            for(let j=0;j<teams.length;j++){
                let currentTeamID = teams[j].ID;
                for (let i=0;i<data.fullgameschedule.gameentry.length;i++){
                    let currentGame = data.fullgameschedule.gameentry[i];
                    if (currentGame.awayTeam.ID == currentTeamID || currentGame.homeTeam.ID == currentTeamID){
                        // console.log("found it",currentGame.awayTeam.Name,"vs",currentGame.homeTeam.Name);
                        let currentDate = currentGame.date;
                        currentDate = Date.parse(currentDate);
                        if(currentDate > today){
                            // console.log("found it",currentGame.awayTeam.Name,"at",currentGame.homeTeam.Name);
                            teams[j].nextGame = [currentGame.awayTeam.Abbreviation,currentGame.homeTeam.Abbreviation,currentGame.id];
                            let k = i-1;
                            for(let p=k;p>0;p--){
                                let currentGame = data.fullgameschedule.gameentry[p];

                                if (currentGame.awayTeam.ID == currentTeamID || currentGame.homeTeam.ID == currentTeamID){
                                    teams[j].previousGame = [currentGame.awayTeam.Abbreviation,currentGame.homeTeam.Abbreviation,currentGame.id];
                                    break;
                                }
                            }
                            // teams[j].previousGame = `${data.fullgameschedule.gameentry[i-1].awayTeam.Name} "at" ${data.fullgameschedule.gameentry[i-1].homeTeam.Name}`;
                            console.log(teams);
                            break;

                        }
                        

                    }

                    
                }

            }
            // let yesterday = new Date(Date.UTC(2018, 2, 19));
            // yesterday = Date.parse(yesterday);
            // console.log("today",today,"yesterday",yesterday);
            // for(let i=0;i<teams.length;i++){
            //     let currentTeam = teams[i].ID;

            // }
            return data;

   
       });
    }

function favTeamSchedule(){
let stringAbbr = "";
    db.retrieveFavTeam()
    .then((userData) => {

        let favTeamArray = (Object.values(userData));
        for (let i=0;i<favTeamArray.length;i++){
            console.log(favTeamArray[i].abbr);
            stringAbbr += favTeamArray[i].abbr;
            stringAbbr += ",";
        }
        stringAbbr = stringAbbr.substring(0, stringAbbr.length - 1);
        console.log("stringAbbr",stringAbbr);
        getGameInfo(stringAbbr,favTeamArray);
    });

}


function findBestPlayer(){

}

module.exports = {getGameInfo,favTeamSchedule};