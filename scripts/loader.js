loader = (()=>{
    "use strict";

    let listeners = {}

    let doneEvents = []

    function on(event, callback){
        if(typeof event !== 'string'){
            throw 'event must be a string'
        }
        if(typeof callback !== 'function'){
            throw 'callback must be a function'
        }
        if( listeners[event] instanceof Array === false ){
            listeners[event] = []
        }
        listeners[event].push(callback)
    }

    function done(event){
        if(typeof event !== 'string'){
            throw 'event must be a string'
        }
        doneEvents.push(event)
        if(listeners[event]){
            for(let callback of listeners[event]){
                if(typeof callback === 'function'){
                    callback()
                }
            }
        }
    }

    return {
        on: on,
        done: done,
        getDoneEvents: ()=>{ return doneEvents }
    }
})()