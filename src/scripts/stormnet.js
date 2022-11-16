"use strict";

//const {signalR} = require("../../scripts/lib/signalr");

console.log("from stormnet.js")

var connection = new signalR
    .HubConnectionBuilder()
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .withUrl("/signalR")
    .build();

connection.start().then(function () {
    console.log("connected");

    connection.invoke("SendMessage", "from stormnet.js").catch(function (err) {
        return console.error(err.toString());
    });
    
}).catch(function (err) {
    console.error(err.toString());
});


connection.on("ReceiveMessage", function ( message) {
   console.log("ReceiveMessage " + message);
});