
//
// Initialisation
//

// Set monitorDiv
let monitorDiv = null;
LOADER.on(LOADER.EVENT.PAGE_READY, ()=>{
    monitorDiv = document.querySelector("#monitor");
})

STORAGE = {
    getConfiguration: key => {
        switch (key)  {
            case 'settings.monitorRotation': return 0; 
            case 'settings.zoomfactor': return 10;
            case 'settings.showOverflow': return false;      
            case 'settings.monitorSize': return monitorDiv.clientWidth < monitorDiv.clientHeight ? '5x9' : '9x5';    
            case 'settings.touchscreenEnabled': return true;     
            case 'settings.touchscreenSecondaryEnabled': return true;
            case 'settings.inputTickDelay': return 0;
            case 'inputs': return {
                    bools: {},
                    numbers: {}
                }
        }
        console.error("getConfiguration missing key", key)
    },
    setConfiguration: (key, value) => {
    },
    setFromShare: (key, value) => {
        console.log('setFromShare', key, value)
        const settings = JSON.parse(value.settings)

        // Set code
        code = settings.editors.normal
        LOADER.done(LOADER.EVENT.STORAGE_READY)
    }, 
    setConfigVal: (elem, confName, defaultValue) => {
        // TODO: Duplicate func with storage.js
        let v = STORAGE.getConfiguration(confName)
        v = ( v !== undefined && v !== null ) ? v : defaultValue 

        let setterFunc
        if(typeof defaultValue === 'boolean'){
            setterFunc = (vv)=>{elem.prop('checked', vv)}
        } else {
            setterFunc = (vv)=>{elem.val(vv)}
        }

        // Always fire events (else stuff breaks)
        setterFunc(v)
        elem.trigger('change')    
    }
}

UI = {
    supportsTouch: () => {return true}
}

CONSOLE = {
    print: msg => {
        console.log("from Lua print", msg)
    }
}    


UTIL = {
    alert: msg => {
        console.error("util alert", msg)
    }, 
    hintImportant: msg => {
        console.error("util hintImportant", msg)
    }
}

ENGINE = {
    init: () => {
        LOADER.done(LOADER.EVENT.ENGINE_READY)
    },
    isRunning: () => { return true },
    errorStop: () => {
        console.log('errorStop')
    }
}
LOADER.on(LOADER.EVENT.LUA_EMULATOR_READY, ENGINE.init);


//
// Load code
//

let code = null;

// Get code id from url
const urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get('id2'); // 'X1qORUm3lD' // 'wzSGQ3dsy9'; // TODO Use id instead of id2 (refactor share.js?)

// Load documentation when no id is supplied
if (!id) {
    id = "qjzIPO504r";

    // Set id in url
    urlParams.set('id2', id);
    let query = urlParams.toString()
    window.history.pushState(null, document.title, document.location.pathname + (query.length > 0 ? '?' + query : ''))      
}

function loadCode() {
    // Load code
    SHARE.doReceive(id, (success)=>{
        if(success){
            console.log('Shared code loaded')
        } else {
            console.error('Invalid key', id)
        }
    })
}
LOADER.on(LOADER.EVENT.CANVAS_READY, loadCode);


//
// Run code
// 
let timer = null;

function tick() {
    LUA_EMULATOR.tick()
    OUTPUT.refresh()
    CANVAS.reset()
    LUA_EMULATOR.draw()
}
function sizeChanged() {
    STORAGE.setConfigVal($('#monitor-size'), 'settings.monitorSize', '1x1')

    // Scroll down for full screen effect
    window.scrollBy(0, 100);
}
function runCode() {
    CANVAS.reset()
    CANVAS.resetTouchpoints()
    MAP.reset()
    PAINT._reset()
    console.log('running code...')
    LUA_EMULATOR.load(code)
    INPUT.reset()
    OUTPUT.reset()

    // Run lua + update canvas
    timer = setInterval(tick, 16 * 1.1)

    // Check monitor orientation
    new ResizeObserver(sizeChanged).observe(monitorDiv);
    //TODO window.onscroll = sizeChanged;
}
LOADER.on(LOADER.EVENT.STORAGE_READY, runCode);    