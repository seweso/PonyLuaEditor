LOADER = (($)=>{
    "use strict";

    let listeners = {}

    let doneEvents = []

    const LOADING_TEXTS = [
        'Saddling ponies ...',
        'Feeding ponies ...',
        'Buying carrots for the ponies ...',
        'Cleaning pony stable ...'
    ]

    $(window).on('load', ()=>{
        let rand = Math.floor(Math.random() * LOADING_TEXTS.length)

        $('.ide').attr('loading-text', LOADING_TEXTS[rand])

        done(EVENT.PAGE_READY)
    })

    const EVENT = {
        PAGE_READY: 'Page Loaded',

        STORAGE_READY: 'Storage',
        HISTORY_READY: 'History',

        SHARE_READY: 'Share',

        UI_READY: 'User Interface',
        GIVEAWAY_READY: 'Giveaway',
        LUA_EMULATOR_READY: 'Lua Emulator',

        UTIL_READY: 'Util',

        STORMWORKS_LUA_API_READY: 'Stormworks Lua API',

        UI_BUILDER_READY: 'UI Builder',
        LUA_CONSOLE_READY: 'Lua Console',
        EXAMPLES_READY: 'Examples',
        EDITORS_READY: 'Editors',
        DOCUMENTATION_READY: 'Autocomplete & Documentation',
        OTHERS_READY: 'Other',

        MINMAX_READY: 'Minifier and Unminifier',

        ENGINE_READY: 'Engine',

        INPUTS_READY: 'Inputs',
        OUTPUTS_READY: 'Outputs',
        PROPERTIES_READY: 'Properties',
        CANVAS_READY: 'Canvas',
        LIBRARY_READY: 'Library'
    }

    const EVENT_ALL_DONE = 'all_done'

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

        setTimeout(()=>{
            doneEvents.push(event)
            if(listeners[event]){
                for(let callback of listeners[event]){
                    if(typeof callback === 'function'){
                        callback()
                    }
                }
            }
            if( allEventsDone() && doneEvents.indexOf(EVENT_ALL_DONE) === -1 ){
                done(EVENT_ALL_DONE)
            }
        }, 1)
    }

    function eventExists(event){
        if(event === EVENT_ALL_DONE){
            return true
        }
        for(let e in EVENT){
            if(EVENT[e] === event){
                return true
            }
        }
        return false
    }

    function allEventsDone(){
        return doneEvents.length === Object.keys(EVENT).length || doneEvents.indexOf(EVENT_ALL_DONE) >= 0
    }

    return {
        on: on,
        done: done,
        EVENT: EVENT,
        onAllDone: (cb)=>{ on(EVENT_ALL_DONE, cb) },
        getDoneEvents: ()=>{ return doneEvents },
        allEventsDone: allEventsDone
    }
})(jQuery)