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

// TODO: Don't start right away (wait for input to be ready?)
connection.start().then(async function () {
    await connection.invoke("SetToken", SignalR_Token);
})

connection.onreconnected(async function () {
    await connection.invoke("SetToken", SignalR_Token);
})

connection.on("SetDouble", function ( i, d) {
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

connection.on("SetBool", function ( i, b) {
    INPUT.setBool(i, b, {
        val:  b,
        userLabel: "StormNet-" + i,
        type: 'push',
        key: 'e'
    })    
});

let STORMNET = {
    async SetDouble(i, d) {
        await connection.invoke("UpdateDoubleFromPony", i, d);
    },
    async SetBool(i, b) {
        await connection.invoke("UpdateBoolFromPony", i, b);
    }
};

