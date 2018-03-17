"use strict";
// This module has no knowledge of the DOM, or where the data goes after it is fetched from Firebase.
// It is only concerned with getting and setting data in the db



let firebase = require("./fb-config"),
    provider = new firebase.auth.GoogleAuthProvider(),
    user = require("./user");


// ****************************************
// DB interaction using Firebase REST API
// ****************************************

// POST - Submits data to be processed to a specified resource.
// GET - Requests/read data from a specified resource
// PUT - Update data to a specified resource.

function getUserData() {
    console.log("url", firebase.getFBsettings().databaseURL);
     return $.ajax({
         url: `${firebase.getFBsettings().databaseURL}/user.json`
         // url: `https://musichistory-d16.firebaseio.com/songs.json?orderBy="uid"&equalTo="${user}"`
     }).done((userData) => {
         console.log("userData", userData);

         return userData;

    });
 }

 function checkUserExist(){

    getUserData()
    .then((userData) => {
    // userData = userData;
    console.log("this is the userData",userData);
    let userArray = (Object.values(userData));
    console.log("user Array",userArray);
    let uidArray = [];
    for (let i=0;i<userArray.length;i++){

        let currentPush = userArray[i].uid;

        uidArray.push(currentPush);
    }
    let currentUid = user.getUser();
    console.log("uid",currentUid);
    if(uidArray.includes(currentUid)){
        console.log("already exists");
        
    }else{
        console.log("this is a new user");
        let userObj = buildUserObj();
        addUserFB(userObj);

    }}
);
}


// function getFBDetails(user){
//     return $.ajax({
//         url: `${firebase.getFBsettings().databaseURL}/user.json?orderBy="uid"&equalTo="${user}"`
//      }).done((resolve) => {

//         return resolve;
//      }).fail((error) => {
//         return error;
//      });
//   }

function retrieveFavTeam() {

        console.log("url", firebase.getFBsettings().databaseURL);
         return $.ajax({
             url: `${firebase.getFBsettings().databaseURL}/favTeam.json`
             // url: `https://musichistory-d16.firebaseio.com/songs.json?orderBy="uid"&equalTo="${user}"`
         }).done((userData) => {
             console.log("favTeam", userData);
    
             return userData;
    
        });
    
}

function buildUserObj() {
    let userObj = {
    // We can use the same variable or reference that we use to display the name at the top of the page
    name: user.getName(),
    uid: user.getUser()
    };
    //console.log("userObj",userObj);
    return userObj;
    
}

function addUserFB(userObj){
    return $.ajax({
        url: `${firebase.getFBsettings().databaseURL}/user.json`,
        type: 'POST',
        data: JSON.stringify(userObj),
        dataType: 'json'
     }).done((fbID) => {
        return fbID;
     });
}

// function updateUserFB(userObj){
//     return $.ajax({
//         url: `${firebase.getFBsettings().databaseURL}/user/${userObj.fbID}.json`,
//         type: 'PUT',
//         data: JSON.stringify(userObj),
//         dataType: 'json'
//      }).done((userID) => {
//         return userID;
//      });
// }

// remember firebase returns a promise
// function createUser(userObj) {
//    return firebase.auth().createUserWithEmailAndPassword(userObj.email, userObj.password)
//       .catch(function (error) {
//          let errorCode = error.code;
//          let errorMessage = error.message;
//          console.log("error:", errorCode, errorMessage);
//       });
// }

// function loginUser(userObj) {
//    return firebase.auth().signInWithEmailAndPassword(userObj.email, userObj.password)
//       .catch(function (error) {
//          let errorCode = error.code;
//          let errorMessage = error.message;
//          console.log("error:", errorCode, errorMessage);
//       });
// }

function logInGoogle() {
   //all firebase functions return a promise!! Add a then when called
   return firebase.auth().signInWithPopup(provider);
}

function logOut() {
   return firebase.auth().signOut();
}


function addFavTeam(favTeamObj){
    return $.ajax({
        url: `${firebase.getFBsettings().databaseURL}/fav-team.json`,
        type: 'POST',
        data: JSON.stringify(favTeamObj),
        dataType: 'json'
     }).done((fbID) => {
        return fbID;
     });
}

function buildFavTeamObj(favoriteTeam){
    console.log(favoriteTeam);
    let currentUid = user.getUser();
    console.log("current user",currentUid);
    let favTeamObj = {
        "uid":currentUid,
        "favTeam":favoriteTeam
    };
    console.log("fav team obj",favTeamObj);
    addFavTeam(favTeamObj);
}

//example with delete
// function deleteItem(fbID) {
// 	return $.ajax({
//       	url: `${firebase.getFBsettings().databaseURL}/songs/${fbID}.json`,
//       	method: "DELETE"
// 	}).done((data) => {
// 		return data;
// 	});
// }

module.exports = {
    // getFBDetails,
    addUserFB,
    // updateUserFB,
    // createUser,
    // loginUser,
    logInGoogle,
    logOut,
    getUserData,
    checkUserExist,
    buildFavTeamObj,
    retrieveFavTeam
};
