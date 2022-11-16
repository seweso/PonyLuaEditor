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
}).catch(function (err) {
    console.error(err.toString());
});

connection.on("ReceiveMessage", function ( message) {
   console.log("ReceiveMessage " + message);
});

connection.on("GetDouble", function ( i, d) {
    INPUT.setNumber(i+1, d, {
        val:  d,
        userLabel: "StormNet-" + (i+1),
        slidercheck: true,
        slidermin: -10000000,
        slidermax: 10000000,
        sliderstep: 0.0000000000001,
        oscilatecheck: false
    })
});