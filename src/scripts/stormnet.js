"use strict";

//const {signalR} = require("../../scripts/lib/signalr");

// TODO: Turn on/off with setting?
// TODO Create class / module?

let params = new URLSearchParams(document.location.search);
let SignalR_Url = params.get('SignalR_Url');
let SignalR_Token = params.get('SignalR_Token');

console.log("from stormnet.js: " + SignalR_Url)

var connection = new signalR
    .HubConnectionBuilder()
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .withUrl(SignalR_Url)
    .build();

connection.start().then(async function () {
    await connection.invoke("SetToken", SignalR_Token);
})

connection.onreconnected(async function () {
    await connection.invoke("SetToken", SignalR_Token);
})

connection.on("GetDouble", function ( i, d) {
    INPUT.setNumber(i, d, {
        val:  d,
        userLabel: "StormNet-" + i,
        slidercheck: true,
        slidermin: -10000000,
        slidermax: 10000000,
        sliderstep: 0.0000000000001,
        oscilatecheck: false
    })
});

let STORMNET = {
    async SetDouble(i, d) {
        await connection.invoke("UpdateFromPony", i, d);
    }  
};

