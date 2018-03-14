"use strict";

let game = require("./game");
let day = require("./byDay");
let team = require("./team");

$('#btn-teams').click(team.printTeamHeader);