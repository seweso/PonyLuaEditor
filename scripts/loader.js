loader = (($)=>{
    "use strict";

    let listeners = {}

    let doneEvents = []

    $(window).on('load', ()=>{
        done(EVENT.PAGE_READY)
    })

    const EVENT = {
        PAGE_READY: 'Page Loaded',

        STORAGE_READY: 'Storage',

        SHARE_READY: 'Share',

        UI_READY: 'User Interface',
        GIVEAWAY_READY: 'Giveaway',
        LUA_EMULATOR_READY: 'Lua Emulator',

        STORMWORKS_LUA_API_READY: 'Stormworks Lua API',

        UI_BUILDER_READY: 'UI Builder',
        LUA_CONSOLE_READY: 'Lua Console',
        EXAMPLES_READY: 'Examples',
        EDITORS_READY: 'Editors',
        DOCUMENTATION_READY: 'Autocomplete & Documentation',
        OTHERS_READY: 'Other',

        ENGINE_READY: 'Engine',

        INPUTS_READY: 'Inputs',
        OUTPUTS_READY: 'Outputs',
        PROPERTIES_READY: 'Properties',
        CANVAS_READY: 'Canvas'
    }

    function on(event, callback){
        if(typeof event !== 'string'){
            throw 'event must be a string'
        }
        if(typeof callback !== 'function'){
            throw 'callback must be a function'
        }

        if(! eventExists(event)){
            throw 'unknown event "'+ event + '"'
        }

        if( listeners[event] instanceof Array === false ){
            listeners[event] = []
        }
        listeners[event].push(callback)

        /* check if event is already done */
        if(doneEvents.indexOf(event) >= 0){
            callback()
        }
    }

    function done(event){
        if(typeof event !== 'string'){
            throw 'event must be a string'
        }

        if(! eventExists(event)){
            throw 'unknown event "'+ event + '"'
        }

        if(doneEvents.indexOf(event) >= 0){
            throw 'event was already reported as done, duplicate? "' + event + '"'
        }

        //TODO maybe we need a small timeout in here? e.g. 10 ms, we had some timeouts here in the old code too
        setTimeout(()=>{
            doneEvents.push(event)
            if(listeners[event]){
                for(let callback of listeners[event]){
                    if(typeof callback === 'function'){
                        callback()
                    }
                }
            }
        }, 1)
    }

    function eventExists(event){
        for(let e in EVENT){
            if(EVENT[e] === event){
                return true
            }
        }
        return false
    }

    function allEventsDone(){
        return doneEvents.length === Object.keys(EVENT).length
    }

    return {
        on: on,
        done: done,
        EVENT: EVENT,
        getDoneEvents: ()=>{ return doneEvents },
        allEventsDone: allEventsDone
    }
})(jQuery)