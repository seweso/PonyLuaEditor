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

        MINMAX_READY: 'Minifier and Unminifier',

        ENGINE_READY: 'Engine',

        INPUTS_READY: 'Inputs',
        OUTPUTS_READY: 'Outputs',
        PROPERTIES_READY: 'Properties',
        CANVAS_READY: 'Canvas'
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
            if( allEventsDone() ){
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
        return doneEvents.length === Object.keys(EVENT).length
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
;
UTIL = (($)=>{
    "use strict";

    window.onerror = (errorMsg, url, lineNumber)=>{
        alert("Unexpected error occured:<br>Please contact me!<br><br>" + url + '<br><br>' + lineNumber + '<br><br>' + errorMsg)
        return false;
    }

    /* time: milliseconds until highlight is removed again (optional) */
    function highlight(elem, time){
        if(elem instanceof HTMLElement){
            $(elem).addClass('highlighted')

            setTimeout(()=>{
                unHighlight(elem)
            }, typeof time === 'number' ? time : (10 * 1000) )
        }
    }

    function unHighlight(elem){
        if(elem instanceof HTMLElement){
            $(elem).removeClass('highlighted')
        }
    }


    function message(title, text){
        return new Promise((fulfill, reject)=>{
            $('#message .title').html(title)
            $('#message .message').html(text)
            $('#message').show()
            $('#message .ok').on('click', ()=>{
                $('#message .ok').off('click')
                $('#message').hide()
                fulfill(true)
            })
        })
    }

     function confirm(text){
        return new Promise((fulfill, reject)=>{
            $('#confirm .message').html(text)
            $('#confirm').show()
            $('#confirm .yes').on('click', ()=>{
                $('#confirm .yes, #confirm .no').off('click')
                $('#confirm').hide()
                fulfill(true)
            })
            $('#confirm .no').on('click', ()=>{
                $('#confirm .yes, #confirm .no').off('click')
                $('#confirm').hide()
                fulfill(false)
            })
        })
    }    

    function alert(text){
        return new Promise((fulfill, reject)=>{
            $('#alert .message').html(text)
            $('#alert').show()
            $('#alert .ok').on('click', ()=>{
                $('#alert .ok').off('click')
                $('#alert').hide()
                fulfill(true)
            })
        })
    }

    function hint(title, text){
        let h = $('<div class="hint"><span class="close icon-cancel-circle"></span><h4>'+title+'</h4><div>'+(text+'').replace('\n', '<br>')+'</div></div>')
        
        h.find('h4').on('click', ()=>{
            h.find('div').css('display', 'inline-block')
        })

        h.find('.close').on('click', ()=>{
            h.remove()
        })
        $('#hints-container').append(h)

        /* automatically remove hints after 1 minute */
        setTimeout(()=>{
            h.remove()
        }, 1000 * 60)

        UI.viewables()['viewable_hints'].focusSelf()
    }

    return {
        highlight: highlight,
        unHighlight: unHighlight,
        message: message,
        confirm: confirm,
        alert: alert,
        hint: hint
    }
})(jQuery)
;
TRANSLATE = (()=>{
    "use strict";
    
    let selectedLanguage = 'en'
    const DEFAULT_LANGUAGE = 'en'

    let missingKeys = []

    const TRANSLATIONS = {
        "viewable_monitor": {en: "Monitor"},
        "viewable_settings": {en: "Settings"},
        "viewable_console": {en: "Console"},
        "viewable_hints": {en: "Hints"},
        "viewable_properties": {en: "Properties"},
        "viewable_inputs": {en: "Inputs"},
        "viewable_outputs": {en: "Outputs"},
        "viewable_documentation": {en: "Documentation"},
        "viewable_examples": {en: "Examples"},
        "viewable_learn": {en: "Learn"},
        "viewable_official_manuals": {en: "Official Manuals"},
        "viewable_editor_normal": {en: "Editor"},
        "viewable_editor_minified": {en: "Minifier"},
        "viewable_editor_unminified": {en: "Unminifier"},
        "viewable_editor_uibuilder": {en: "UI Builder"},
        "viewable_editor_uibuilder_code": {en: "UI Generated Code"},
        /* views */
        "top_left": {en: "Top Left"},
        "top_right": {en: "Top Right"},
        "bottom_left": {en: "Bottom Left"},
        "bottom_right": {en: "Bottom Right"},

        /* server editor */
        "viewable_server_editor": {en: "Server Script"}
    }

    function translateKey(key){
        if(TRANSLATIONS[key]){
            if(TRANSLATIONS[key][selectedLanguage]){
                return TRANSLATIONS[key][selectedLanguage]
            } else {
                reportMissingKey(key, selectedLanguage)
                if(TRANSLATIONS[key][DEFAULT_LANGUAGE]){
                    return TRANSLATIONS[key][DEFAULT_LANGUAGE]
                } else {
                    reportMissingKey(key, DEFAULT_LANGUAGE)
                    return '?d? ' + key + ' ?d?'
                }
            }
        } else {
            reportMissingKey(key)
            return '?x? ' + key + ' ?x?'
        }
    }

    function reportMissingKey(key, lang){
        missingKeys.push({
            key: key,
            lang: lang
        })
    }

    return {
        key: translateKey,
        showReportedlyMissingKeys: ()=>{
            let msg = ''

            missingKeys.sort((a,b)=>{
                if (a.lang < b.lang) {
                    return -1;
                }
                if (a.lang > b.lang) {
                    return 1;
                }
                return 0
            })

            for(let k of missingKeys){
                msg += k.key + ' => ' + k.lang + '<br>'
            }

            if(msg === ''){
                msg = 'none. Yay!'
            }

            UTIL.message('Reportedly missing keys:', msg)
        }
    }
})()
;
REPORTER = (()=>{
    "use strict";


    const REPORT_TYPE_IDS = {
        'startEmulator': 3,
        'downloadOffline': 4,
        'openHelp': 5,
        'minify': 6,
        'unminify': 7,
        'openAutocomplete': 8,
        'openLearnAndExamples': 9,
        'shareCode': 10,
        'receiveShareCode': 11,
        'generateUIBuilderCode': 12,
        'pauseScript': 15
    }

    function report(typeID, data){
        if(window.PonyTracking){
            window.PonyTracking.report(typeID, data)
        }
    }

    return {
        REPORT_TYPE_IDS: REPORT_TYPE_IDS,
        report: report
    }  
})()
;
var HttpLocalhost = (($)=>{

    let hasShownHttpHint = false

    let queue = [] /* allow maximum of 1 sent http request per tick */


    const REPORT_TYPE_IDS = {
        'httpUse': 16,
    }

	$(window).on('lua_tick', checkQueue)

	function get(port, url){

        if(!hasShownHttpHint){
            hasShownHttpHint = true

            UTIL.message('You must follow these steps to enable http support', 'Your browser prohibits sending and receiving data to and from localhost. To fix that, follow the <a href="http-allow-localhost" target="_blank">manual here</a>.')
        	report(REPORT_TYPE_IDS.httpUse)
        }

	    queue.push({
	    	port: port,
	    	url: url
	    })
	}

	function checkQueue(){
		if(queue.length > 0){
			queue.reverse()
			let req = queue.pop()
			queue.reverse()

			makeRequest(req)
		}
	}

	function makeRequest(req){
		$.get(makeUrl(req),{timeout: 1000 * 35}).done((res)=>{
			processResult(req, res)
		}).fail((xhr, res)=>{
			if(xhr.status === 0){
				res = "connect(): Connection refused"
			}			
			
			processResult(req, res)
		})
	}

	function makeUrl(req){
		return 'http://localhost:' + (Math.floor(req.port)) + req.url
	}

	function processResult(req, res){
		if(typeof LUA_EMULATOR.getGlobalVariable('httpReply') === 'function'){
			LUA_EMULATOR.callLuaFunction('httpReply', [req.port, req.url, typeof res === 'string' ? res : JSON.stringify(res)])	
        }
	}

	function report(typeID, data){
        if(window.PonyTracking){
            window.PonyTracking.report(typeID, data)
        }
    }

	return {
		get: get
	}
})(jQuery)
;
var PAINT = (()=>{

    const DO_LOG = false

    const FONT_SIZE = 5
    const FONT = 'px "Screen Mono", "Lucida Console", Monaco, monospace'

    const LINE_WIDTH = 1.4

    let zoomFactor = 1

    let offset = 0.5

    let lastColorUsed = false

    function setColor(r, g, b, a){
        log()
        CANVAS.ctx().fillStyle = "rgb(" + r + ', ' + g + ', ' + b + ', ' + a/255 + ')'
        CANVAS.ctx().strokeStyle = "rgb(" + r + ', ' + g + ', ' + b + ', ' + a/255 + ')'

        lastColorUsed = [r, g, b, a]
    }

    /* This function is not part of the game.
       It must be called after the canvas changed in size to set the color again.
       (Web Canvas has the color white, but we need the last color that was set by "screen.setColor()")
    */
    function _restoreLastColorUsed(){
        if(lastColorUsed === false){
            setColor(255,255,255,255)
        } else {
            setColor(lastColorUsed[0], lastColorUsed[1], lastColorUsed[2], lastColorUsed[3])
        }
    }

    /* This function is not part of the game.
       reset canvas to a state before the script starts to run
    */
    function _reset(){
        setColor(255,255,255,255)
    }

    function drawClear(){
        log()
        CANVAS.ctx().closePath()
        CANVAS.ctx().beginPath()
        CANVAS.ctx().clearRect(0, 0, CANVAS.realWidth(), CANVAS.realHeight())
        CANVAS.ctx().fillRect(0, 0, CANVAS.realWidth(), CANVAS.realHeight())
    }

    function drawLine(x1, y1, x2, y2){ 
        log()
        CANVAS.ctx().lineWidth = zoom(LINE_WIDTH)/2
        CANVAS.ctx().beginPath()
        CANVAS.ctx().moveTo(CANVAS.left() + zoom(x1) - offset, CANVAS.top() + zoom(y1) - offset)
        CANVAS.ctx().lineTo(CANVAS.left() + zoom(x2) - offset, CANVAS.top() + zoom(y2) - offset)
        CANVAS.ctx().stroke()
        CANVAS.ctx().closePath()
    }

    function drawCircle(x,y, r){
        log()

        let lineSegments = 8
        if(r >= 20){
            lineSegments = 12
        }
        if(r >= 28){
            lineSegments = 16
        }

        let step = Math.PI * 2 / lineSegments

        CANVAS.ctx().lineWidth = zoom(LINE_WIDTH)/2
        CANVAS.ctx().beginPath()

        for(let a=0; a < Math.PI * 2; a += step){
            let x1 = r * Math.cos(a) + x
            let y1 = r * Math.sin(a) + y

            let x2 = r * Math.cos(a + step) + x
            let y2 = r * Math.sin(a + step) + y

            if(a === 0){
                CANVAS.ctx().moveTo(CANVAS.left() + zoom(x1) - offset, CANVAS.top() + zoom(y1) - offset)
            }
            CANVAS.ctx().lineTo(CANVAS.left() + zoom(x2) - offset, CANVAS.top() + zoom(y2) - offset)        
        }

        CANVAS.ctx().stroke()
        CANVAS.ctx().closePath()
    }

    function drawCircleF(x,y, r){
        log()
        
        let lineSegments = 8
        if(r >= 20){
            lineSegments = 12
        }
        if(r >= 28){
            lineSegments = 16
        }

        let step = Math.PI * 2 / lineSegments

        CANVAS.ctx().lineWidth = zoom(LINE_WIDTH)/2
        CANVAS.ctx().beginPath()

        for(let a=0; a < Math.PI * 2; a += step){
            let x1 = r * Math.cos(a) + x
            let y1 = r * Math.sin(a) + y

            let x2 = r * Math.cos(a + step) + x
            let y2 = r * Math.sin(a + step) + y

            if(a === 0){
                CANVAS.ctx().moveTo(CANVAS.left() + zoom(x1) - offset, CANVAS.top() + zoom(y1) - offset)
            }
            CANVAS.ctx().lineTo(CANVAS.left() + zoom(x2) - offset, CANVAS.top() + zoom(y2) - offset)
        }

        CANVAS.ctx().fill()
        CANVAS.ctx().closePath()
    }

    function drawRect(x, y, w, h){
        log()
        CANVAS.ctx().lineWidth = zoom(LINE_WIDTH)/2
        CANVAS.ctx().strokeRect(CANVAS.left() + zoom(x) - offset, CANVAS.top() + zoom(y) - offset, zoom(w), zoom(h))
    }

    function drawRectF(x, y, w, h){
        log()
        CANVAS.ctx().lineWidth = zoom(LINE_WIDTH)/2
        CANVAS.ctx().fillRect(CANVAS.left() + zoom(x) - offset, CANVAS.top() + zoom(y) - offset, zoom(w), zoom(h))
    }

    function drawTriangle(x1, y1, x2, y2, x3, y3){
        log()
        CANVAS.ctx().lineWidth = zoom(LINE_WIDTH)/3
        CANVAS.ctx().beginPath()
        CANVAS.ctx().moveTo(CANVAS.left() + zoom(x1) - offset, CANVAS.top() + zoom(y1) - offset)
        CANVAS.ctx().lineTo(CANVAS.left() + zoom(x2) - offset, CANVAS.top() + zoom(y2) - offset)
        CANVAS.ctx().lineTo(CANVAS.left() + zoom(x3) - offset, CANVAS.top() + zoom(y3) - offset)
        CANVAS.ctx().lineTo(CANVAS.left() + zoom(x1) - offset, CANVAS.top() + zoom(y1) - offset)
        CANVAS.ctx().stroke()
        CANVAS.ctx().closePath()

    }

    function drawTriangleF(x1, y1, x2, y2, x3, y3){
        log()
        CANVAS.ctx().lineWidth = zoom(LINE_WIDTH)/3
        CANVAS.ctx().beginPath()
        CANVAS.ctx().moveTo(CANVAS.left() + zoom(x1) - offset, CANVAS.top() + zoom(y1) - offset)
        CANVAS.ctx().lineTo(CANVAS.left() + zoom(x2) - offset, CANVAS.top() + zoom(y2) - offset)
        CANVAS.ctx().lineTo(CANVAS.left() + zoom(x3) - offset, CANVAS.top() + zoom(y3) - offset)
        CANVAS.ctx().lineTo(CANVAS.left() + zoom(x1) - offset, CANVAS.top() + zoom(y1) - offset)
        CANVAS.ctx().fill()
        CANVAS.ctx().closePath()
    }

    function drawText(x, y, text){//4px wide 5 px tall
        text = text.toUpperCase()
        log()

        CANVAS.ctx().font = Math.floor(zoom(FONT_SIZE)) + FONT
        let lines = text.split('\n')
        let lineCounter = 0
        for(let l of lines){
            let xx = CANVAS.left() + zoom(x)
            let yy = CANVAS.top() + zoom(y + lineCounter*6) + zoom(FONT_SIZE)
            CANVAS.ctx().fillText(l, Math.round(xx), Math.round(yy))
            lineCounter++
        }
    }

    function drawTextBox(x, y, w, h, text, h_align, v_align){
        text = text.toUpperCase()
        
        log()

        let maxCharsPerLine = Math.floor(w / 5)
        if(maxCharsPerLine <= 0){
            return
        }

        let lines = []
        let i = 0
        while (i < text.length){
            let line = text.substring(i, i + maxCharsPerLine)
            let indexOfNewLine = line.indexOf('\n')
            if(indexOfNewLine === 0){//new line at the beginning
                lines.push('\n')
                i++
                continue
            } else if(indexOfNewLine > 0){//new line somewhere in the middle of the text
                lines.push(line.substring(0, indexOfNewLine))
                i += indexOfNewLine + 1
                continue
            }
            lines.push(line)
            i += maxCharsPerLine
        }

        CANVAS.ctx().font = Math.floor(zoom(FONT_SIZE)) + FONT

        let lineHeight = FONT_SIZE+1

        let horizontalCenter = x + w/2 + h_align * w/2
        let verticalCenter = y + h/2 + v_align * h/2

        
        let lineCounter = 0
        for(let l of lines){
            let widthOfCurrentLine = l.length * 5 - 1
            let xx = CANVAS.left() + zoom(horizontalCenter - widthOfCurrentLine/2) - zoom(h_align * widthOfCurrentLine/2)
            let yy = CANVAS.top() + zoom(lineCounter * lineHeight + verticalCenter) - zoom(v_align * lines.length * lineHeight/2) - zoom(lines.length * lineHeight/2) + zoom(lineHeight) - zoom(1-(lineCounter/lines.length))

            CANVAS.ctx().fillText(l, Math.round(xx), Math.round(yy));

            lineCounter++
        }
    }

    /* helper functions */

    function zoom(val){
        return Math.round(val) * zoomFactor
    }

    function log(){
        if(!DO_LOG){
            return
        }
        let args = []
        for(let a of arguments.callee.caller.arguments){
            args.push(a)
        }
        console.log.apply(console, ['function ' + arguments.callee.caller.name + '()'].concat(args))

        let myargs = []
        for(let a of arguments){
            myargs.push(a)
        }
        if(myargs.length > 0){
            console.log.apply(console, myargs)
        }
    }
    
    function setZoomFactor(_zoomFactor){
        zoomFactor = _zoomFactor
    }

    return {
        setColor: setColor,
        drawClear: drawClear,
        drawLine: drawLine,
        drawCircle: drawCircle,
        drawCircleF: drawCircleF,
        drawRect: drawRect,
        drawRectF: drawRectF,
        drawTriangle: drawTriangle,
        drawTriangleF: drawTriangleF,
        drawText: drawText,
        drawTextBox: drawTextBox,
        setZoomFactor: setZoomFactor,
        _reset: _reset,
        _restoreLastColorUsed: _restoreLastColorUsed
    }

})()

;
var MAP = (($)=>{

    const DO_LOG = true

    const FONT_SIZE = 6
    const FONT = 'px "Lucida Console", Monaco, monospace'
    
    let zoomFactor = 1

    let fakecanvas = document.createElement('canvas')
    let fakectx = fakecanvas.getContext('2d')

    let shownMapWarning = true

    const MAP_ZERO_X = 16000
    const MAP_ZERO_Y = -4000

    const DEFAULT_COLORS = {
        ocean: {
            r: 16,
            g: 40,
            b: 44,
            a: 255
        },
        shallows: {
            r: 33,
            g: 74,
            b: 83,
            a: 255
        },
        land: {
            r: 83,
            g: 83,
            b: 79,
            a: 255
        },
        grass: {
            r: 65,
            g: 74,
            b: 47,
            a: 255
        },
        sand: {
            r: 91,
            g: 83,
            b: 56,
            a: 255
        },
        snow: {
            r: 102,
            g: 102,
            b: 102,
            a: 255
        }
    }

    const METER_PER_MAP_PIXEL = 20

    let matches = {}

    let lastMap = false

    let colors = {}

    function drawMap(x, y, zom){//zom from 0.1 to 50
        //matches = {}
        let currentFillStyle = CANVAS.ctx().fillStyle
        try {
            let centerx = MAP_ZERO_X + x
            let centery = - MAP_ZERO_Y - y

            let sWidth = Math.max(CANVAS.width() * zom, 1)
            let sHeight = Math.max(CANVAS.height() * zom, 1)
            let sx = centerx / METER_PER_MAP_PIXEL - sWidth/2
            let sy = centery / METER_PER_MAP_PIXEL - sHeight/2

            if(!lastMap || lastMap.sWidth !== sWidth || lastMap.sHeight !== sHeight || lastMap.sx !== sx || lastMap.sy !== sy){
                /* only if something has changed then calculate a new map */
                lastMap = {
                    sWidth: sWidth,
                    sHeight: sHeight,
                    sx: sx,
                    sy: sy
                }

                fakecanvas.width = sWidth
                fakecanvas.height = sHeight
                fakectx.fillStyle = '#0000FF'
                fakectx.fillRect(0, 0, sWidth, sHeight)
                fakectx.drawImage($('#map').get(0), sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight)

                let imageData = fakectx.getImageData(0, 0, fakecanvas.width, fakecanvas.height)
                let data = imageData.data
                for(let i = 0; i < data.length; i+=4 ){

                    if(i == 50000 && shownMapWarning){
                        shownMapWarning = false
                        setTimeout(()=>{
                            UTIL.hint("Warning", "Map drawing takes a long time, reduce zoom for better performance")
                        }, 1)
                    }


                    let color = colors[ bestMatchColor(data[i], data[i+1], data[i+2]) ]
                    data[i] = color.r
                    data[i+1] = color.g
                    data[i+2] = color.b
                    data[i+3] = color.a
                }

                fakectx.clearRect(0, 0, fakecanvas.width, fakecanvas.height)
                fakectx.putImageData(imageData, 0, 0, 0, 0, fakecanvas.width, fakecanvas.height)
            } else {
                if(DO_LOG){
                    console.log('using cached map')
                }
            }

            CANVAS.ctx().drawImage(fakecanvas, 0, 0, fakecanvas.width, fakecanvas.height, CANVAS.left(), CANVAS.top(), zoom(CANVAS.width()), zoom(CANVAS.height()))
        } catch (err){
            console.error('error drawing map', err)
        }  
        CANVAS.ctx().fillStyle = currentFillStyle
    }

    function setMapColorOcean(r, g, b, a){
        onColorHasChanged()
        colors.ocean = {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }

    function setMapColorShallows(r, g, b, a){
        onColorHasChanged()
        colors.shallows = {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }

    function setMapColorLand(r, g, b, a){
        onColorHasChanged()
        colors.land = {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }

    function setMapColorGrass(r, g, b, a){
        onColorHasChanged()
        colors.grass = {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }

    function setMapColorSand(r, g, b, a){
        onColorHasChanged()
        colors.sand = {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }

    function setMapColorSnow(r, g, b, a){
        onColorHasChanged()
        colors.snow = {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }

    function screenToMap(mapX, mapY, zoom, screenW, screenH, pixelX, pixelY){
        let screenCenterX = screenW/2
        let screenCenterY = screenH/2
        let deltaPixelX = (pixelX - screenCenterX) / zoom
        let deltaPixelY = (pixelY - screenCenterY) / zoom
        return {emulatorUnpack: true, 0: METER_PER_MAP_PIXEL * deltaPixelX + mapX, 1: METER_PER_MAP_PIXEL * deltaPixelY + mapY}
    }

    function mapToScreen(mapX, mapY, zoom, screenW, screenH, worldX, worldY){
        let pixelX = (worldX - mapX) * zoom / METER_PER_MAP_PIXEL + screenW/2
        let pixelY = (worldY - mapY) * zoom / METER_PER_MAP_PIXEL + screenH/2

        return {emulatorUnpack: true, 0: pixelX, 1: pixelY}
    }

    function reset(){
        shownMapWarning = true
        colors = {}

        for(let k of Object.keys(DEFAULT_COLORS)){
            colors[k] = {
                r: DEFAULT_COLORS[k].r,
                g: DEFAULT_COLORS[k].g,
                b: DEFAULT_COLORS[k].b,
                a: DEFAULT_COLORS[k].a
            }
        }
        onColorHasChanged()

        matches = {}
    }

    /* helper functions */

    function onColorHasChanged(){
        lastMap = false
    }

    function bestMatchColor(r, g, b){
        if(matches[r+','+g+','+b]){
            return matches[r+','+g+','+b]
        }
        let distances = []
        for(let k of Object.keys(DEFAULT_COLORS)){
            let c = DEFAULT_COLORS[k]
            let dr =  Math.abs(c.r - r)
            let dg =  Math.abs(c.g - g)
            let db =  Math.abs(c.b - b)
            distances.push({key: k, distance: dr + dg + db})
        }
        distances.sort((a, b)=>{
            if(a.distance < b.distance){
                return -1
            }
            if(a.distance > b.distance){
                return 1
            }
            return 0
        })
        let bestMatch = distances[0].key
        matches[r+','+g+','+b] = ""+bestMatch
        if(DO_LOG){
            console.log('bestMatch for ', r, g, b, 'is', bestMatch)
        }
        return bestMatch
    }

    function zoom(val){
        return val * zoomFactor
    }

    function setZoomFactor(_zoomFactor){
        zoomFactor = _zoomFactor
    }

    function log(){
        if(!DO_LOG){
            return
        }
        let args = []
        for(let a of arguments.callee.caller.arguments){
            args.push(a)
        }
        console.log.apply(console, ['function ' + arguments.callee.caller.name + '()'].concat(args))

        let myargs = []
        for(let a of arguments){
            myargs.push(a)
        }
        if(myargs.length > 0){
            console.log.apply(console, myargs)
        }
    }

    return {
        drawMap: drawMap,
        setMapColorOcean: setMapColorOcean,
        setMapColorShallows: setMapColorShallows,
        setMapColorLand: setMapColorLand,
        setMapColorGrass: setMapColorGrass,
        setMapColorSand: setMapColorSand,
        setMapColorSnow: setMapColorSnow,
        screenToMap: screenToMap,
        mapToScreen: mapToScreen,
        setZoomFactor: setZoomFactor,
        reset: reset
    }

})(jQuery)

;
/* global exports:true, module:true, require:true, define:true, global:true */

(function (root, name, factory) {
  'use strict';

  // Used to determine if values are of the language type `Object`
  var objectTypes = {
        'function': true
      , 'object': true
    }
    // Detect free variable `exports`
    , freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports
    // Detect free variable `module`
    , freeModule = objectTypes[typeof module] && module && !module.nodeType && module
    // Detect free variable `global`, from Node.js or Browserified code, and
    // use it as `window`
    , freeGlobal = freeExports && freeModule && typeof global === 'object' && global
    // Detect the popular CommonJS extension `module.exports`
    , moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /* istanbul ignore else */
  if (freeGlobal && (freeGlobal.global === freeGlobal ||
                     /* istanbul ignore next */ freeGlobal.window === freeGlobal ||
                     /* istanbul ignore next */ freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }

  // Some AMD build optimizers, like r.js, check for specific condition
  // patterns like the following:
  /* istanbul ignore if */
  if (typeof define === 'function' &&
      /* istanbul ignore next */ typeof define.amd === 'object' &&
      /* istanbul ignore next */ define.amd) {
    // defined as an anonymous module.
    define(['exports'], factory);
    // In case the source has been processed and wrapped in a define module use
    // the supplied `exports` object.
    if (freeExports && moduleExports) factory(freeModule.exports);
  }
  // check for `exports` after `define` in case a build optimizer adds an
  // `exports` object
  else /* istanbul ignore else */ if (freeExports && freeModule) {
    // in Node.js or RingoJS v0.8.0+
    /* istanbul ignore else */
    if (moduleExports) factory(freeModule.exports);
    // in RingoJS v0.7.0-
    else factory(freeExports);
  }
  // in a browser or Rhino
  else {
    factory((root[name] = {}));
  }
}(this, 'luaparse', function (exports) {
  'use strict';

  exports.version = '0.2.1';

  var input, options, length, features;

  // Options can be set either globally on the parser object through
  // defaultOptions, or during the parse call.
  var defaultOptions = exports.defaultOptions = {
    // Explicitly tell the parser when the input ends.
      wait: false
    // Store comments as an array in the chunk object.
    , comments: true
    // Track identifier scopes by adding an isLocal attribute to each
    // identifier-node.
    , scope: false
    // Store location information on each syntax node as
    // `loc: { start: { line, column }, end: { line, column } }`.
    , locations: false
    // Store the start and end character locations on each syntax node as
    // `range: [start, end]`.
    , ranges: false
    // A callback which will be invoked when a syntax node has been completed.
    // The node which has been created will be passed as the only parameter.
    , onCreateNode: null
    // A callback which will be invoked when a new scope is created.
    , onCreateScope: null
    // A callback which will be invoked when the current scope is destroyed.
    , onDestroyScope: null
    // A callback which will be invoked when a local variable is declared in the current scope.
    // The variable's name will be passed as the only parameter
    , onLocalDeclaration: null
    // The version of Lua targeted by the parser (string; allowed values are
    // '5.1', '5.2', '5.3').
    , luaVersion: '5.3'
  };

  // The available tokens expressed as enum flags so they can be checked with
  // bitwise operations.

  var EOF = 1, StringLiteral = 2, Keyword = 4, Identifier = 8
    , NumericLiteral = 16, Punctuator = 32, BooleanLiteral = 64
    , NilLiteral = 128, VarargLiteral = 256;

  exports.tokenTypes = { EOF: EOF, StringLiteral: StringLiteral
    , Keyword: Keyword, Identifier: Identifier, NumericLiteral: NumericLiteral
    , Punctuator: Punctuator, BooleanLiteral: BooleanLiteral
    , NilLiteral: NilLiteral, VarargLiteral: VarargLiteral
  };

  // As this parser is a bit different from luas own, the error messages
  // will be different in some situations.

  var errors = exports.errors = {
      unexpected: 'unexpected %1 \'%2\' near \'%3\''
    , unexpectedEOF: 'unexpected symbol near \'<eof>\''
    , expected: '\'%1\' expected near \'%2\''
    , expectedToken: '%1 expected near \'%2\''
    , unfinishedString: 'unfinished string near \'%1\''
    , malformedNumber: 'malformed number near \'%1\''
    , decimalEscapeTooLarge: 'decimal escape too large near \'%1\''
    , invalidEscape: 'invalid escape sequence near \'%1\''
    , hexadecimalDigitExpected: 'hexadecimal digit expected near \'%1\''
    , braceExpected: 'missing \'%1\' near \'%2\''
    , tooLargeCodepoint: 'UTF-8 value too large near \'%1\''
    , unfinishedLongString: 'unfinished long string (starting at line %1) near \'%2\''
    , unfinishedLongComment: 'unfinished long comment (starting at line %1) near \'%2\''
    , ambiguousSyntax: 'ambiguous syntax (function call x new statement) near \'%1\''
    , noLoopToBreak: 'no loop to break near \'%1\''
    , labelAlreadyDefined: 'label \'%1\' already defined on line %2'
    , labelNotVisible: 'no visible label \'%1\' for <goto>'
    , gotoJumpInLocalScope: '<goto %1> jumps into the scope of local \'%2\''
    , cannotUseVararg: 'cannot use \'...\' outside a vararg function near \'%1\''
  };

  // ### Abstract Syntax Tree
  //
  // The default AST structure is inspired by the Mozilla Parser API but can
  // easily be customized by overriding these functions.

  var ast = exports.ast = {
      labelStatement: function(label) {
      return {
          type: 'LabelStatement'
        , label: label
      };
    }

    , breakStatement: function() {
      return {
          type: 'BreakStatement'
      };
    }

    , gotoStatement: function(label) {
      return {
          type: 'GotoStatement'
        , label: label
      };
    }

    , returnStatement: function(args) {
      return {
          type: 'ReturnStatement'
        , 'arguments': args
      };
    }

    , ifStatement: function(clauses) {
      return {
          type: 'IfStatement'
        , clauses: clauses
      };
    }
    , ifClause: function(condition, body) {
      return {
          type: 'IfClause'
        , condition: condition
        , body: body
      };
    }
    , elseifClause: function(condition, body) {
      return {
          type: 'ElseifClause'
        , condition: condition
        , body: body
      };
    }
    , elseClause: function(body) {
      return {
          type: 'ElseClause'
        , body: body
      };
    }

    , whileStatement: function(condition, body) {
      return {
          type: 'WhileStatement'
        , condition: condition
        , body: body
      };
    }

    , doStatement: function(body) {
      return {
          type: 'DoStatement'
        , body: body
      };
    }

    , repeatStatement: function(condition, body) {
      return {
          type: 'RepeatStatement'
        , condition: condition
        , body: body
      };
    }

    , localStatement: function(variables, init) {
      return {
          type: 'LocalStatement'
        , variables: variables
        , init: init
      };
    }

    , assignmentStatement: function(variables, init) {
      return {
          type: 'AssignmentStatement'
        , variables: variables
        , init: init
      };
    }

    , callStatement: function(expression) {
      return {
          type: 'CallStatement'
        , expression: expression
      };
    }

    , functionStatement: function(identifier, parameters, isLocal, body) {
      return {
          type: 'FunctionDeclaration'
        , identifier: identifier
        , isLocal: isLocal
        , parameters: parameters
        , body: body
      };
    }

    , forNumericStatement: function(variable, start, end, step, body) {
      return {
          type: 'ForNumericStatement'
        , variable: variable
        , start: start
        , end: end
        , step: step
        , body: body
      };
    }

    , forGenericStatement: function(variables, iterators, body) {
      return {
          type: 'ForGenericStatement'
        , variables: variables
        , iterators: iterators
        , body: body
      };
    }

    , chunk: function(body) {
      return {
          type: 'Chunk'
        , body: body
      };
    }

    , identifier: function(name) {
      return {
          type: 'Identifier'
        , name: name
      };
    }

    , literal: function(type, value, raw) {
      type = (type === StringLiteral) ? 'StringLiteral'
        : (type === NumericLiteral) ? 'NumericLiteral'
        : (type === BooleanLiteral) ? 'BooleanLiteral'
        : (type === NilLiteral) ? 'NilLiteral'
        : 'VarargLiteral';

      return {
          type: type
        , value: value
        , raw: raw
      };
    }

    , tableKey: function(key, value) {
      return {
          type: 'TableKey'
        , key: key
        , value: value
      };
    }
    , tableKeyString: function(key, value) {
      return {
          type: 'TableKeyString'
        , key: key
        , value: value
      };
    }
    , tableValue: function(value) {
      return {
          type: 'TableValue'
        , value: value
      };
    }


    , tableConstructorExpression: function(fields) {
      return {
          type: 'TableConstructorExpression'
        , fields: fields
      };
    }
    , binaryExpression: function(operator, left, right) {
      var type = ('and' === operator || 'or' === operator) ?
        'LogicalExpression' :
        'BinaryExpression';

      return {
          type: type
        , operator: operator
        , left: left
        , right: right
      };
    }
    , unaryExpression: function(operator, argument) {
      return {
          type: 'UnaryExpression'
        , operator: operator
        , argument: argument
      };
    }
    , memberExpression: function(base, indexer, identifier) {
      return {
          type: 'MemberExpression'
        , indexer: indexer
        , identifier: identifier
        , base: base
      };
    }

    , indexExpression: function(base, index) {
      return {
          type: 'IndexExpression'
        , base: base
        , index: index
      };
    }

    , callExpression: function(base, args) {
      return {
          type: 'CallExpression'
        , base: base
        , 'arguments': args
      };
    }

    , tableCallExpression: function(base, args) {
      return {
          type: 'TableCallExpression'
        , base: base
        , 'arguments': args
      };
    }

    , stringCallExpression: function(base, argument) {
      return {
          type: 'StringCallExpression'
        , base: base
        , argument: argument
      };
    }

    , comment: function(value, raw) {
      return {
          type: 'Comment'
        , value: value
        , raw: raw
      };
    }
  };

  // Wrap up the node object.

  function finishNode(node) {
    // Pop a `Marker` off the location-array and attach its location data.
    if (trackLocations) {
      var location = locations.pop();
      location.complete();
      location.bless(node);
    }
    if (options.onCreateNode) options.onCreateNode(node);
    return node;
  }


  // Helpers
  // -------

  var slice = Array.prototype.slice
    , toString = Object.prototype.toString
    ;

  var indexOf = /* istanbul ignore next */ function (array, element) {
    for (var i = 0, length = array.length; i < length; ++i) {
      if (array[i] === element) return i;
    }
    return -1;
  };

  /* istanbul ignore else */
  if (Array.prototype.indexOf)
    indexOf = function (array, element) {
      return array.indexOf(element);
    };

  // Iterate through an array of objects and return the index of an object
  // with a matching property.

  function indexOfObject(array, property, element) {
    for (var i = 0, length = array.length; i < length; ++i) {
      if (array[i][property] === element) return i;
    }
    return -1;
  }

  // A sprintf implementation using %index (beginning at 1) to input
  // arguments in the format string.
  //
  // Example:
  //
  //     // Unexpected function in token
  //     sprintf('Unexpected %2 in %1.', 'token', 'function');

  function sprintf(format) {
    var args = slice.call(arguments, 1);
    format = format.replace(/%(\d)/g, function (match, index) {
      return '' + args[index - 1] || /* istanbul ignore next */ '';
    });
    return format;
  }

  // Polyfill for `Object.assign`.

  var assign = /* istanbul ignore next */ function (dest) {
    var args = slice.call(arguments, 1)
      , src, prop;

    for (var i = 0, length = args.length; i < length; ++i) {
      src = args[i];
      for (prop in src)
        /* istanbul ignore else */
        if (Object.prototype.hasOwnProperty.call(src, prop)) {
          dest[prop] = src[prop];
        }
    }

    return dest;
  };

  /* istanbul ignore else */
  if (Object.assign)
    assign = Object.assign;

  // ### Error functions

  // XXX: Eliminate this function and change the error type to be different from SyntaxError.
  // This will unfortunately be a breaking change, because some downstream users depend
  // on the error thrown being an instance of SyntaxError. For example, the Ace editor:
  // <https://github.com/ajaxorg/ace/blob/4c7e5eb3f5d5ca9434847be51834a4e41661b852/lib/ace/mode/lua_worker.js#L55>

  function fixupError(e) {
    /* istanbul ignore if */
    if (!Object.create)
      return e;
    return Object.create(e, {
      'line': { 'writable': true, value: e.line },
      'index': { 'writable': true, value: e.index },
      'column': { 'writable': true, value: e.column }
    });
  }

  // #### Raise an exception.
  //
  // Raise an exception by passing a token, a string format and its paramters.
  //
  // The passed tokens location will automatically be added to the error
  // message if it exists, if not it will default to the lexers current
  // position.
  //
  // Example:
  //
  //     // [1:0] expected [ near (
  //     raise(token, "expected %1 near %2", '[', token.value);

  function raise(token) {
    var message = sprintf.apply(null, slice.call(arguments, 1))
      , error, col;

    if (token === null || typeof token.line === 'undefined') {
      col = index - lineStart + 1;
      error = fixupError(new SyntaxError(sprintf('[%1:%2] %3', line, col, message)));
      error.index = index;
      error.line = line;
      error.column = col;
    } else {
      col = token.range[0] - token.lineStart;
      error = fixupError(new SyntaxError(sprintf('[%1:%2] %3', token.line, col, message)));
      error.line = token.line;
      error.index = token.range[0];
      error.column = col;
    }
    throw error;
  }

  // #### Raise an unexpected token error.
  //
  // Example:
  //
  //     // expected <name> near '0'
  //     raiseUnexpectedToken('<name>', token);

  function raiseUnexpectedToken(type, token) {
    raise(token, errors.expectedToken, type, token.value);
  }

  // #### Raise a general unexpected error
  //
  // Usage should pass either a token object or a symbol string which was
  // expected. We can also specify a nearby token such as <eof>, this will
  // default to the currently active token.
  //
  // Example:
  //
  //     // Unexpected symbol 'end' near '<eof>'
  //     unexpected(token);
  //
  // If there's no token in the buffer it means we have reached <eof>.

  function unexpected(found) {
    var near = lookahead.value;
    if ('undefined' !== typeof found.type) {
      var type;
      switch (found.type) {
        case StringLiteral:   type = 'string';      break;
        case Keyword:         type = 'keyword';     break;
        case Identifier:      type = 'identifier';  break;
        case NumericLiteral:  type = 'number';      break;
        case Punctuator:      type = 'symbol';      break;
        case BooleanLiteral:  type = 'boolean';     break;
        case NilLiteral:
          return raise(found, errors.unexpected, 'symbol', 'nil', near);
        case EOF:
          return raise(found, errors.unexpectedEOF);
      }
      return raise(found, errors.unexpected, type, found.value, near);
    }
    return raise(found, errors.unexpected, 'symbol', found, near);
  }

  // Lexer
  // -----
  //
  // The lexer, or the tokenizer reads the input string character by character
  // and derives a token left-right. To be as efficient as possible the lexer
  // prioritizes the common cases such as identifiers. It also works with
  // character codes instead of characters as string comparisons was the
  // biggest bottleneck of the parser.
  //
  // If `options.comments` is enabled, all comments encountered will be stored
  // in an array which later will be appended to the chunk object. If disabled,
  // they will simply be disregarded.
  //
  // When the lexer has derived a valid token, it will be returned as an object
  // containing its value and as well as its position in the input string (this
  // is always enabled to provide proper debug messages).
  //
  // `lex()` starts lexing and returns the following token in the stream.

  var index
    , token
    , previousToken
    , lookahead
    , comments
    , tokenStart
    , line
    , lineStart;

  exports.lex = lex;

  function lex() {
    skipWhiteSpace();

    // Skip comments beginning with --
    while (45 === input.charCodeAt(index) &&
           45 === input.charCodeAt(index + 1)) {
      scanComment();
      skipWhiteSpace();
    }
    if (index >= length) return {
        type : EOF
      , value: '<eof>'
      , line: line
      , lineStart: lineStart
      , range: [index, index]
    };

    var charCode = input.charCodeAt(index)
      , next = input.charCodeAt(index + 1);

    // Memorize the range index where the token begins.
    tokenStart = index;
    if (isIdentifierStart(charCode)) return scanIdentifierOrKeyword();

    switch (charCode) {
      case 39: case 34: // '"
        return scanStringLiteral();

      case 48: case 49: case 50: case 51: case 52: case 53:
      case 54: case 55: case 56: case 57: // 0-9
        return scanNumericLiteral();

      case 46: // .
        // If the dot is followed by a digit it's a float.
        if (isDecDigit(next)) return scanNumericLiteral();
        if (46 === next) {
          if (46 === input.charCodeAt(index + 2)) return scanVarargLiteral();
          return scanPunctuator('..');
        }
        return scanPunctuator('.');

      case 61: // =
        if (61 === next) return scanPunctuator('==');
        return scanPunctuator('=');

      case 62: // >
        if (features.bitwiseOperators)
          if (62 === next) return scanPunctuator('>>');
        if (61 === next) return scanPunctuator('>=');
        return scanPunctuator('>');

      case 60: // <
        if (features.bitwiseOperators)
          if (60 === next) return scanPunctuator('<<');
        if (61 === next) return scanPunctuator('<=');
        return scanPunctuator('<');

      case 126: // ~
        if (61 === next) return scanPunctuator('~=');
        if (!features.bitwiseOperators)
          break;
        return scanPunctuator('~');

      case 58: // :
        if (features.labels)
          if (58 === next) return scanPunctuator('::');
        return scanPunctuator(':');

      case 91: // [
        // Check for a multiline string, they begin with [= or [[
        if (91 === next || 61 === next) return scanLongStringLiteral();
        return scanPunctuator('[');

      case 47: // /
        // Check for integer division op (//)
        if (features.integerDivision)
          if (47 === next) return scanPunctuator('//');
        return scanPunctuator('/');

      case 38: case 124: // & |
        if (!features.bitwiseOperators)
          break;

        /* fall through */
      case 42: case 94: case 37: case 44: case 123: case 125:
      case 93: case 40: case 41: case 59: case 35: case 45:
      case 43: // * ^ % , { } ] ( ) ; # - +
        return scanPunctuator(input.charAt(index));
    }

    return unexpected(input.charAt(index));
  }

  // Whitespace has no semantic meaning in lua so simply skip ahead while
  // tracking the encounted newlines. Any kind of eol sequence is counted as a
  // single line.

  function consumeEOL() {
    var charCode = input.charCodeAt(index)
      , peekCharCode = input.charCodeAt(index + 1);

    if (isLineTerminator(charCode)) {
      // Count \n\r and \r\n as one newline.
      if (10 === charCode && 13 === peekCharCode) ++index;
      if (13 === charCode && 10 === peekCharCode) ++index;
      ++line;
      lineStart = ++index;

      return true;
    }
    return false;
  }

  function skipWhiteSpace() {
    while (index < length) {
      var charCode = input.charCodeAt(index);
      if (isWhiteSpace(charCode)) {
        ++index;
      } else if (!consumeEOL()) {
        break;
      }
    }
  }

  function encodeUTF8(codepoint) {
    if (codepoint < 0x80) {
      return String.fromCharCode(codepoint);
    } else if (codepoint < 0x800) {
      return String.fromCharCode(
        0xc0 |  (codepoint >>  6)        ,
        0x80 | ( codepoint        & 0x3f)
      );
    } else if (codepoint < 0x10000) {
      return String.fromCharCode(
        0xe0 |  (codepoint >> 12)        ,
        0x80 | ((codepoint >>  6) & 0x3f),
        0x80 | ( codepoint        & 0x3f)
      );
    } else if (codepoint < 0x110000) {
      return String.fromCharCode(
        0xf0 |  (codepoint >> 18)        ,
        0x80 | ((codepoint >> 12) & 0x3f),
        0x80 | ((codepoint >>  6) & 0x3f),
        0x80 | ( codepoint        & 0x3f)
      );
    } else {
      return null;
    }
  }

  // This function takes a JavaScript string, encodes it in WTF-8 and
  // reinterprets the resulting code units as code points; i.e. it encodes
  // the string in what was the original meaning of WTF-8.
  //
  // For a detailed rationale, see the README.md file, section
  // "Note on character encodings".

  function fixupHighCharacters(s) {
    return s.replace(/[\ud800-\udbff][\udc00-\udfff]|[^\x00-\x7f]/g, function (m) {
      if (m.length === 1)
        return encodeUTF8(m.charCodeAt(0));
      return encodeUTF8(0x10000 + (((m.charCodeAt(0) & 0x3ff) << 10) | (m.charCodeAt(1) & 0x3ff)));
    });
  }

  // Identifiers, keywords, booleans and nil all look the same syntax wise. We
  // simply go through them one by one and defaulting to an identifier if no
  // previous case matched.

  function scanIdentifierOrKeyword() {
    var value, type;

    // Slicing the input string is prefered before string concatenation in a
    // loop for performance reasons.
    while (isIdentifierPart(input.charCodeAt(++index)));
    value = fixupHighCharacters(input.slice(tokenStart, index));

    // Decide on the token type and possibly cast the value.
    if (isKeyword(value)) {
      type = Keyword;
    } else if ('true' === value || 'false' === value) {
      type = BooleanLiteral;
      value = ('true' === value);
    } else if ('nil' === value) {
      type = NilLiteral;
      value = null;
    } else {
      type = Identifier;
    }

    return {
        type: type
      , value: value
      , line: line
      , lineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // Once a punctuator reaches this function it should already have been
  // validated so we simply return it as a token.

  function scanPunctuator(value) {
    index += value.length;
    return {
        type: Punctuator
      , value: value
      , line: line
      , lineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // A vararg literal consists of three dots.

  function scanVarargLiteral() {
    index += 3;
    return {
        type: VarargLiteral
      , value: '...'
      , line: line
      , lineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // Find the string literal by matching the delimiter marks used.

  function scanStringLiteral() {
    var delimiter = input.charCodeAt(index++)
      , beginLine = line
      , beginLineStart = lineStart
      , stringStart = index
      , string = ''
      , charCode;

    for (;;) {
      charCode = input.charCodeAt(index++);
      if (delimiter === charCode) break;
      // EOF or `\n` terminates a string literal. If we haven't found the
      // ending delimiter by now, raise an exception.
      if (index > length || isLineTerminator(charCode)) {
        string += input.slice(stringStart, index - 1);
        raise(null, errors.unfinishedString, String.fromCharCode(delimiter) + string);
      }
      if (92 === charCode) { // backslash
        string += fixupHighCharacters(input.slice(stringStart, index - 1)) + readEscapeSequence();
        stringStart = index;
      }
    }
    string += fixupHighCharacters(input.slice(stringStart, index - 1));

    return {
        type: StringLiteral
      , value: string
      , line: beginLine
      , lineStart: beginLineStart
      , lastLine: line
      , lastLineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // Expect a multiline string literal and return it as a regular string
  // literal, if it doesn't validate into a valid multiline string, throw an
  // exception.

  function scanLongStringLiteral() {
    var beginLine = line
      , beginLineStart = lineStart
      , string = readLongString(false);
    // Fail if it's not a multiline literal.
    if (false === string) raise(token, errors.expected, '[', token.value);

    return {
        type: StringLiteral
      , value: fixupHighCharacters(string)
      , line: beginLine
      , lineStart: beginLineStart
      , lastLine: line
      , lastLineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // Numeric literals will be returned as floating-point numbers instead of
  // strings. The raw value should be retrieved from slicing the input string
  // later on in the process.
  //
  // If a hexadecimal number is encountered, it will be converted.

  function scanNumericLiteral() {
    var character = input.charAt(index)
      , next = input.charAt(index + 1);

    var value = ('0' === character && 'xX'.indexOf(next || null) >= 0) ?
      readHexLiteral() : readDecLiteral();

    return {
        type: NumericLiteral
      , value: value
      , line: line
      , lineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // Lua hexadecimals have an optional fraction part and an optional binary
  // exoponent part. These are not included in JavaScript so we will compute
  // all three parts separately and then sum them up at the end of the function
  // with the following algorithm.
  //
  //     Digit := toDec(digit)
  //     Fraction := toDec(fraction) / 16 ^ fractionCount
  //     BinaryExp := 2 ^ binaryExp
  //     Number := ( Digit + Fraction ) * BinaryExp

  function readHexLiteral() {
    var fraction = 0 // defaults to 0 as it gets summed
      , binaryExponent = 1 // defaults to 1 as it gets multiplied
      , binarySign = 1 // positive
      , digit, fractionStart, exponentStart, digitStart;

    digitStart = index += 2; // Skip 0x part

    // A minimum of one hex digit is required.
    if (!isHexDigit(input.charCodeAt(index)))
      raise(null, errors.malformedNumber, input.slice(tokenStart, index));

    while (isHexDigit(input.charCodeAt(index))) ++index;
    // Convert the hexadecimal digit to base 10.
    digit = parseInt(input.slice(digitStart, index), 16);

    // Fraction part i optional.
    if ('.' === input.charAt(index)) {
      fractionStart = ++index;

      while (isHexDigit(input.charCodeAt(index))) ++index;
      fraction = input.slice(fractionStart, index);

      // Empty fraction parts should default to 0, others should be converted
      // 0.x form so we can use summation at the end.
      fraction = (fractionStart === index) ? 0
        : parseInt(fraction, 16) / Math.pow(16, index - fractionStart);
    }

    // Binary exponents are optional
    if ('pP'.indexOf(input.charAt(index) || null) >= 0) {
      ++index;

      // Sign part is optional and defaults to 1 (positive).
      if ('+-'.indexOf(input.charAt(index) || null) >= 0)
        binarySign = ('+' === input.charAt(index++)) ? 1 : -1;

      exponentStart = index;

      // The binary exponent sign requires a decimal digit.
      if (!isDecDigit(input.charCodeAt(index)))
        raise(null, errors.malformedNumber, input.slice(tokenStart, index));

      while (isDecDigit(input.charCodeAt(index))) ++index;
      binaryExponent = input.slice(exponentStart, index);

      // Calculate the binary exponent of the number.
      binaryExponent = Math.pow(2, binaryExponent * binarySign);
    }

    return (digit + fraction) * binaryExponent;
  }

  // Decimal numbers are exactly the same in Lua and in JavaScript, because of
  // this we check where the token ends and then parse it with native
  // functions.

  function readDecLiteral() {
    while (isDecDigit(input.charCodeAt(index))) ++index;
    // Fraction part is optional
    if ('.' === input.charAt(index)) {
      ++index;
      // Fraction part defaults to 0
      while (isDecDigit(input.charCodeAt(index))) ++index;
    }
    // Exponent part is optional.
    if ('eE'.indexOf(input.charAt(index) || null) >= 0) {
      ++index;
      // Sign part is optional.
      if ('+-'.indexOf(input.charAt(index) || null) >= 0) ++index;
      // An exponent is required to contain at least one decimal digit.
      if (!isDecDigit(input.charCodeAt(index)))
        raise(null, errors.malformedNumber, input.slice(tokenStart, index));

      while (isDecDigit(input.charCodeAt(index))) ++index;
    }

    return parseFloat(input.slice(tokenStart, index));
  }

  function readUnicodeEscapeSequence() {
    var sequenceStart = index++;

    if (input.charAt(index++) !== '{')
      raise(null, errors.braceExpected, '{', '\\' + input.slice(sequenceStart, index));
    if (!isHexDigit(input.charCodeAt(index)))
      raise(null, errors.hexadecimalDigitExpected, '\\' + input.slice(sequenceStart, index));

    while (input.charCodeAt(index) === 0x30) ++index;
    var escStart = index;

    while (isHexDigit(input.charCodeAt(index))) {
      ++index;
      if (index - escStart > 6)
        raise(null, errors.tooLargeCodepoint, '\\' + input.slice(sequenceStart, index));
    }

    var b = input.charAt(index++);
    if (b !== '}') {
      if ((b === '"') || (b === "'"))
        raise(null, errors.braceExpected, '}', '\\' + input.slice(sequenceStart, index--));
      else
        raise(null, errors.hexadecimalDigitExpected, '\\' + input.slice(sequenceStart, index));
    }

    var codepoint = parseInt(input.slice(escStart, index - 1), 16);

    codepoint = encodeUTF8(codepoint);
    if (codepoint === null) {
      raise(null, errors.tooLargeCodepoint, '\\' + input.slice(sequenceStart, index));
    }
    return codepoint;
  }

  // Translate escape sequences to the actual characters.
  function readEscapeSequence() {
    var sequenceStart = index;
    switch (input.charAt(index)) {
      // Lua allow the following escape sequences.
      case 'a': ++index; return '\x07';
      case 'n': ++index; return '\n';
      case 'r': ++index; return '\r';
      case 't': ++index; return '\t';
      case 'v': ++index; return '\x0b';
      case 'b': ++index; return '\b';
      case 'f': ++index; return '\f';

      // Backslash at the end of the line. We treat all line endings as equivalent,
      // and as representing the [LF] character (code 10). Lua 5.1 through 5.3
      // have been verified to behave the same way.
      case '\r':
      case '\n':
        consumeEOL();
        return '\n';

      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9':
        // \ddd, where ddd is a sequence of up to three decimal digits.
        while (isDecDigit(input.charCodeAt(index)) && index - sequenceStart < 3) ++index;

        var ddd = parseInt(input.slice(sequenceStart, index), 10);
        if (ddd > 255) {
          raise(null, errors.decimalEscapeTooLarge, '\\' + ddd);
        }
        return String.fromCharCode(ddd);

      case 'z':
        if (features.skipWhitespaceEscape) {
          ++index;
          skipWhiteSpace();
          return '';
        }
        break;

      case 'x':
        if (features.hexEscapes) {
          // \xXX, where XX is a sequence of exactly two hexadecimal digits
          if (isHexDigit(input.charCodeAt(index + 1)) &&
              isHexDigit(input.charCodeAt(index + 2))) {
            index += 3;
            return String.fromCharCode(parseInt(input.slice(sequenceStart + 1, index), 16));
          }
          raise(null, errors.hexadecimalDigitExpected, '\\' + input.slice(sequenceStart, index + 2));
        }
        break;

      case 'u':
        if (features.unicodeEscapes)
          return readUnicodeEscapeSequence();
        break;

      case '\\': case '"': case "'":
        return input.charAt(index++);
    }

    if (features.strictEscapes)
      raise(null, errors.invalidEscape, '\\' + input.slice(sequenceStart, index + 1));
    return input.charAt(index++);
  }

  // Comments begin with -- after which it will be decided if they are
  // multiline comments or not.
  //
  // The multiline functionality works the exact same way as with string
  // literals so we reuse the functionality.

  function scanComment() {
    tokenStart = index;
    index += 2; // --

    var character = input.charAt(index)
      , content = ''
      , isLong = false
      , commentStart = index
      , lineStartComment = lineStart
      , lineComment = line;

    if ('[' === character) {
      content = readLongString(true);
      // This wasn't a multiline comment after all.
      if (false === content) content = character;
      else isLong = true;
    }
    // Scan until next line as long as it's not a multiline comment.
    if (!isLong) {
      while (index < length) {
        if (isLineTerminator(input.charCodeAt(index))) break;
        ++index;
      }
      if (options.comments) content = input.slice(commentStart, index);
    }

    if (options.comments) {
      var node = ast.comment(content, input.slice(tokenStart, index));

      // `Marker`s depend on tokens available in the parser and as comments are
      // intercepted in the lexer all location data is set manually.
      if (options.locations) {
        node.loc = {
            start: { line: lineComment, column: tokenStart - lineStartComment }
          , end: { line: line, column: index - lineStart }
        };
      }
      if (options.ranges) {
        node.range = [tokenStart, index];
      }
      if (options.onCreateNode) options.onCreateNode(node);
      comments.push(node);
    }
  }

  // Read a multiline string by calculating the depth of `=` characters and
  // then appending until an equal depth is found.

  function readLongString(isComment) {
    var level = 0
      , content = ''
      , terminator = false
      , character, stringStart, firstLine = line;

    ++index; // [

    // Calculate the depth of the comment.
    while ('=' === input.charAt(index + level)) ++level;
    // Exit, this is not a long string afterall.
    if ('[' !== input.charAt(index + level)) return false;

    index += level + 1;

    // If the first character is a newline, ignore it and begin on next line.
    if (isLineTerminator(input.charCodeAt(index))) consumeEOL();

    stringStart = index;
    while (index < length) {
      // To keep track of line numbers run the `consumeEOL()` which increments
      // its counter.
      while (isLineTerminator(input.charCodeAt(index))) consumeEOL();

      character = input.charAt(index++);

      // Once the delimiter is found, iterate through the depth count and see
      // if it matches.
      if (']' === character) {
        terminator = true;
        for (var i = 0; i < level; ++i) {
          if ('=' !== input.charAt(index + i)) terminator = false;
        }
        if (']' !== input.charAt(index + level)) terminator = false;
      }

      // We reached the end of the multiline string. Get out now.
      if (terminator) {
        content += input.slice(stringStart, index - 1);
        index += level + 1;
        return content;
      }
    }

    raise(null, isComment ?
                errors.unfinishedLongComment :
                errors.unfinishedLongString,
          firstLine, '<eof>');
  }

  // ## Lex functions and helpers.

  // Read the next token.
  //
  // This is actually done by setting the current token to the lookahead and
  // reading in the new lookahead token.

  function next() {
    previousToken = token;
    token = lookahead;
    lookahead = lex();
  }

  // Consume a token if its value matches. Once consumed or not, return the
  // success of the operation.

  function consume(value) {
    if (value === token.value) {
      next();
      return true;
    }
    return false;
  }

  // Expect the next token value to match. If not, throw an exception.

  function expect(value) {
    if (value === token.value) next();
    else raise(token, errors.expected, value, token.value);
  }

  // ### Validation functions

  function isWhiteSpace(charCode) {
    return 9 === charCode || 32 === charCode || 0xB === charCode || 0xC === charCode;
  }

  function isLineTerminator(charCode) {
    return 10 === charCode || 13 === charCode;
  }

  function isDecDigit(charCode) {
    return charCode >= 48 && charCode <= 57;
  }

  function isHexDigit(charCode) {
    return (charCode >= 48 && charCode <= 57) || (charCode >= 97 && charCode <= 102) || (charCode >= 65 && charCode <= 70);
  }

  // From [Lua 5.2](http://www.lua.org/manual/5.2/manual.html#8.1) onwards
  // identifiers cannot use 'locale-dependent' letters (i.e. dependent on the C locale).
  // On the other hand, LuaJIT allows arbitrary octets ≥ 128 in identifiers.

  function isIdentifierStart(charCode) {
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || 95 === charCode)
      return true;
    if (features.extendedIdentifiers && charCode >= 128)
      return true;
    return false;
  }

  function isIdentifierPart(charCode) {
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || 95 === charCode || (charCode >= 48 && charCode <= 57))
      return true;
    if (features.extendedIdentifiers && charCode >= 128)
      return true;
    return false;
  }

  // [3.1 Lexical Conventions](http://www.lua.org/manual/5.2/manual.html#3.1)
  //
  // `true`, `false` and `nil` will not be considered keywords, but literals.

  function isKeyword(id) {
    switch (id.length) {
      case 2:
        return 'do' === id || 'if' === id || 'in' === id || 'or' === id;
      case 3:
        return 'and' === id || 'end' === id || 'for' === id || 'not' === id;
      case 4:
        if ('else' === id || 'then' === id)
          return true;
        if (features.labels && !features.contextualGoto)
          return ('goto' === id);
        return false;
      case 5:
        return 'break' === id || 'local' === id || 'until' === id || 'while' === id;
      case 6:
        return 'elseif' === id || 'repeat' === id || 'return' === id;
      case 8:
        return 'function' === id;
    }
    return false;
  }

  function isUnary(token) {
    if (Punctuator === token.type) return '#-~'.indexOf(token.value) >= 0;
    if (Keyword === token.type) return 'not' === token.value;
    return false;
  }

  // Check if the token syntactically closes a block.

  function isBlockFollow(token) {
    if (EOF === token.type) return true;
    if (Keyword !== token.type) return false;
    switch (token.value) {
      case 'else': case 'elseif':
      case 'end': case 'until':
        return true;
      default:
        return false;
    }
  }

  // Scope
  // -----

  // Store each block scope as a an array of identifier names. Each scope is
  // stored in an FILO-array.
  var scopes
    // The current scope index
    , scopeDepth
    // A list of all global identifier nodes.
    , globals;

  // Create a new scope inheriting all declarations from the previous scope.
  function createScope() {
    var scope = Array.apply(null, scopes[scopeDepth++]);
    scopes.push(scope);
    if (options.onCreateScope) options.onCreateScope();
  }

  // Exit and remove the current scope.
  function destroyScope() {
    var scope = scopes.pop();
    --scopeDepth;
    if (options.onDestroyScope) options.onDestroyScope();
  }

  // Add identifier name to the current scope if it doesnt already exist.
  function scopeIdentifierName(name) {
    if (options.onLocalDeclaration) options.onLocalDeclaration(name);
    if (-1 !== indexOf(scopes[scopeDepth], name)) return;
    scopes[scopeDepth].push(name);
  }

  // Add identifier to the current scope
  function scopeIdentifier(node) {
    scopeIdentifierName(node.name);
    attachScope(node, true);
  }

  // Attach scope information to node. If the node is global, store it in the
  // globals array so we can return the information to the user.
  function attachScope(node, isLocal) {
    if (!isLocal && -1 === indexOfObject(globals, 'name', node.name))
      globals.push(node);

    node.isLocal = isLocal;
  }

  // Is the identifier name available in this scope.
  function scopeHasName(name) {
    return (-1 !== indexOf(scopes[scopeDepth], name));
  }

  // Location tracking
  // -----------------
  //
  // Locations are stored in FILO-array as a `Marker` object consisting of both
  // `loc` and `range` data. Once a `Marker` is popped off the list an end
  // location is added and the data is attached to a syntax node.

  var locations = []
    , trackLocations;

  function createLocationMarker() {
    return new Marker(token);
  }

  function Marker(token) {
    if (options.locations) {
      this.loc = {
          start: {
            line: token.line
          , column: token.range[0] - token.lineStart
        }
        , end: {
            line: 0
          , column: 0
        }
      };
    }
    if (options.ranges) this.range = [token.range[0], 0];
  }

  // Complete the location data stored in the `Marker` by adding the location
  // of the *previous token* as an end location.
  Marker.prototype.complete = function() {
    if (options.locations) {
      this.loc.end.line = previousToken.lastLine || previousToken.line;
      this.loc.end.column = previousToken.range[1] - (previousToken.lastLineStart || previousToken.lineStart);
    }
    if (options.ranges) {
      this.range[1] = previousToken.range[1];
    }
  };

  Marker.prototype.bless = function (node) {
    if (this.loc) {
      var loc = this.loc;
      node.loc = {
        start: {
          line: loc.start.line,
          column: loc.start.column
        },
        end: {
          line: loc.end.line,
          column: loc.end.column
        }
      };
    }
    if (this.range) {
      node.range = [
        this.range[0],
        this.range[1]
      ];
    }
  };

  // Create a new `Marker` and add it to the FILO-array.
  function markLocation() {
    if (trackLocations) locations.push(createLocationMarker());
  }

  // Push an arbitrary `Marker` object onto the FILO-array.
  function pushLocation(marker) {
    if (trackLocations) locations.push(marker);
  }

  // Control flow tracking
  // ---------------------
  // A context object that validates loop breaks and `goto`-based control flow.

  function FullFlowContext() {
    this.scopes = [];
    this.pendingGotos = [];
  }

  FullFlowContext.prototype.isInLoop = function () {
    var i = this.scopes.length;
    while (i --> 0) {
      if (this.scopes[i].isLoop)
        return true;
    }
    return false;
  };

  FullFlowContext.prototype.pushScope = function (isLoop) {
    var scope = {
      labels: {},
      locals: [],
      deferredGotos: [],
      isLoop: !!isLoop
    };
    this.scopes.push(scope);
  };

  FullFlowContext.prototype.popScope = function () {
    for (var i = 0; i < this.pendingGotos.length; ++i) {
      var theGoto = this.pendingGotos[i];
      if (theGoto.maxDepth >= this.scopes.length)
        if (--theGoto.maxDepth <= 0)
          raise(theGoto.token, errors.labelNotVisible, theGoto.target);
    }

    this.scopes.pop();
  };

  FullFlowContext.prototype.addGoto = function (target, token) {
    var localCounts = [];

    for (var i = 0; i < this.scopes.length; ++i) {
      var scope = this.scopes[i];
      localCounts.push(scope.locals.length);
      if (Object.prototype.hasOwnProperty.call(scope.labels, target))
        return;
    }

    this.pendingGotos.push({
      maxDepth: this.scopes.length,
      target: target,
      token: token,
      localCounts: localCounts
    });
  };

  FullFlowContext.prototype.addLabel = function (name, token) {
    var scope = this.currentScope();

    if (Object.prototype.hasOwnProperty.call(scope.labels, name)) {
      raise(token, errors.labelAlreadyDefined, name, scope.labels[name].line);
    } else {
      var newGotos = [];

      for (var i = 0; i < this.pendingGotos.length; ++i) {
        var theGoto = this.pendingGotos[i];

        if (theGoto.maxDepth >= this.scopes.length && theGoto.target === name) {
          if (theGoto.localCounts[this.scopes.length - 1] < scope.locals.length) {
            scope.deferredGotos.push(theGoto);
          }
          continue;
        }

        newGotos.push(theGoto);
      }

      this.pendingGotos = newGotos;
    }

    scope.labels[name] = {
      localCount: scope.locals.length,
      line: token.line
    };
  };

  FullFlowContext.prototype.addLocal = function (name, token) {
    this.currentScope().locals.push({
      name: name,
      token: token
    });
  };

  FullFlowContext.prototype.currentScope = function () {
    return this.scopes[this.scopes.length - 1];
  };

  FullFlowContext.prototype.raiseDeferredErrors = function () {
    var scope = this.currentScope();
    var bads = scope.deferredGotos;
    for (var i = 0; i < bads.length; ++i) {
      var theGoto = bads[i];
      raise(theGoto.token, errors.gotoJumpInLocalScope, theGoto.target, scope.locals[theGoto.localCounts[this.scopes.length - 1]].name);
    }
    // Would be dead code currently, but may be useful later
    // if (bads.length)
    //   scope.deferredGotos = [];
  };

  // Simplified context that only checks the validity of loop breaks.

  function LoopFlowContext() {
    this.level = 0;
    this.loopLevels = [];
  }

  LoopFlowContext.prototype.isInLoop = function () {
    return !!this.loopLevels.length;
  };

  LoopFlowContext.prototype.pushScope = function (isLoop) {
    ++this.level;
    if (isLoop)
      this.loopLevels.push(this.level);
  };

  LoopFlowContext.prototype.popScope = function () {
    var levels = this.loopLevels;
    var levlen = levels.length;
    if (levlen) {
      if (levels[levlen - 1] === this.level)
        levels.pop();
    }
    --this.level;
  };

  LoopFlowContext.prototype.addGoto =
  LoopFlowContext.prototype.addLabel =
  /* istanbul ignore next */
  function () { throw new Error('This should never happen'); };

  LoopFlowContext.prototype.addLocal =
  LoopFlowContext.prototype.raiseDeferredErrors =
  function () {};

  function makeFlowContext() {
    return features.labels ? new FullFlowContext() : new LoopFlowContext();
  }

  // Parse functions
  // ---------------

  // Chunk is the main program object. Syntactically it's the same as a block.
  //
  //     chunk ::= block

  function parseChunk() {
    next();
    markLocation();
    if (options.scope) createScope();
    var flowContext = makeFlowContext();
    flowContext.allowVararg = true;
    flowContext.pushScope();
    var body = parseBlock(flowContext);
    flowContext.popScope();
    if (options.scope) destroyScope();
    if (EOF !== token.type) unexpected(token);
    // If the body is empty no previousToken exists when finishNode runs.
    if (trackLocations && !body.length) previousToken = token;
    return finishNode(ast.chunk(body));
  }

  // A block contains a list of statements with an optional return statement
  // as its last statement.
  //
  //     block ::= {stat} [retstat]

  function parseBlock(flowContext) {
    var block = []
      , statement;

    while (!isBlockFollow(token)) {
      // Return has to be the last statement in a block.
      // Likewise 'break' in Lua older than 5.2
      if ('return' === token.value || (!features.relaxedBreak && 'break' === token.value)) {
        block.push(parseStatement(flowContext));
        break;
      }
      statement = parseStatement(flowContext);
      consume(';');
      // Statements are only added if they are returned, this allows us to
      // ignore some statements, such as EmptyStatement.
      if (statement) block.push(statement);
    }

    // Doesn't really need an ast node
    return block;
  }

  // There are two types of statements, simple and compound.
  //
  //     statement ::= break | goto | do | while | repeat | return
  //          | if | for | function | local | label | assignment
  //          | functioncall | ';'

  function parseStatement(flowContext) {
    markLocation();

    if (Punctuator === token.type) {
      if (consume('::')) return parseLabelStatement(flowContext);
    }

    // When a `;` is encounted, simply eat it without storing it.
    if (features.emptyStatement) {
      if (consume(';')) {
        if (trackLocations) locations.pop();
        return;
      }
    }

    flowContext.raiseDeferredErrors();

    if (Keyword === token.type) {
      switch (token.value) {
        case 'local':    next(); return parseLocalStatement(flowContext);
        case 'if':       next(); return parseIfStatement(flowContext);
        case 'return':   next(); return parseReturnStatement(flowContext);
        case 'function': next();
          var name = parseFunctionName();
          return parseFunctionDeclaration(name);
        case 'while':    next(); return parseWhileStatement(flowContext);
        case 'for':      next(); return parseForStatement(flowContext);
        case 'repeat':   next(); return parseRepeatStatement(flowContext);
        case 'break':    next();
          if (!flowContext.isInLoop())
            raise(token, errors.noLoopToBreak, token.value);
          return parseBreakStatement();
        case 'do':       next(); return parseDoStatement(flowContext);
        case 'goto':     next(); return parseGotoStatement(flowContext);
      }
    }

    if (features.contextualGoto &&
        token.type === Identifier && token.value === 'goto' &&
        lookahead.type === Identifier && lookahead.value !== 'goto') {
      next(); return parseGotoStatement(flowContext);
    }

    // Assignments memorizes the location and pushes it manually for wrapper nodes.
    if (trackLocations) locations.pop();

    return parseAssignmentOrCallStatement(flowContext);
  }

  // ## Statements

  //     label ::= '::' Name '::'

  function parseLabelStatement(flowContext) {
    var nameToken = token
      , label = parseIdentifier();

    if (options.scope) {
      scopeIdentifierName('::' + nameToken.value + '::');
      attachScope(label, true);
    }

    expect('::');

    flowContext.addLabel(nameToken.value, nameToken);
    return finishNode(ast.labelStatement(label));
  }

  //     break ::= 'break'

  function parseBreakStatement() {
    return finishNode(ast.breakStatement());
  }

  //     goto ::= 'goto' Name

  function parseGotoStatement(flowContext) {
    var name = token.value
      , gotoToken = previousToken
      , label = parseIdentifier();

    flowContext.addGoto(name, gotoToken);
    return finishNode(ast.gotoStatement(label));
  }

  //     do ::= 'do' block 'end'

  function parseDoStatement(flowContext) {
    if (options.scope) createScope();
    flowContext.pushScope();
    var body = parseBlock(flowContext);
    flowContext.popScope();
    if (options.scope) destroyScope();
    expect('end');
    return finishNode(ast.doStatement(body));
  }

  //     while ::= 'while' exp 'do' block 'end'

  function parseWhileStatement(flowContext) {
    var condition = parseExpectedExpression(flowContext);
    expect('do');
    if (options.scope) createScope();
    flowContext.pushScope(true);
    var body = parseBlock(flowContext);
    flowContext.popScope();
    if (options.scope) destroyScope();
    expect('end');
    return finishNode(ast.whileStatement(condition, body));
  }

  //     repeat ::= 'repeat' block 'until' exp

  function parseRepeatStatement(flowContext) {
    if (options.scope) createScope();
    flowContext.pushScope(true);
    var body = parseBlock(flowContext);
    expect('until');
    flowContext.raiseDeferredErrors();
    var condition = parseExpectedExpression(flowContext);
    flowContext.popScope();
    if (options.scope) destroyScope();
    return finishNode(ast.repeatStatement(condition, body));
  }

  //     retstat ::= 'return' [exp {',' exp}] [';']

  function parseReturnStatement(flowContext) {
    var expressions = [];

    if ('end' !== token.value) {
      var expression = parseExpression(flowContext);
      if (null != expression) expressions.push(expression);
      while (consume(',')) {
        expression = parseExpectedExpression(flowContext);
        expressions.push(expression);
      }
      consume(';'); // grammar tells us ; is optional here.
    }
    return finishNode(ast.returnStatement(expressions));
  }

  //     if ::= 'if' exp 'then' block {elif} ['else' block] 'end'
  //     elif ::= 'elseif' exp 'then' block

  function parseIfStatement(flowContext) {
    var clauses = []
      , condition
      , body
      , marker;

    // IfClauses begin at the same location as the parent IfStatement.
    // It ends at the start of `end`, `else`, or `elseif`.
    if (trackLocations) {
      marker = locations[locations.length - 1];
      locations.push(marker);
    }
    condition = parseExpectedExpression(flowContext);
    expect('then');
    if (options.scope) createScope();
    flowContext.pushScope();
    body = parseBlock(flowContext);
    flowContext.popScope();
    if (options.scope) destroyScope();
    clauses.push(finishNode(ast.ifClause(condition, body)));

    if (trackLocations) marker = createLocationMarker();
    while (consume('elseif')) {
      pushLocation(marker);
      condition = parseExpectedExpression(flowContext);
      expect('then');
      if (options.scope) createScope();
      flowContext.pushScope();
      body = parseBlock(flowContext);
      flowContext.popScope();
      if (options.scope) destroyScope();
      clauses.push(finishNode(ast.elseifClause(condition, body)));
      if (trackLocations) marker = createLocationMarker();
    }

    if (consume('else')) {
      // Include the `else` in the location of ElseClause.
      if (trackLocations) {
        marker = new Marker(previousToken);
        locations.push(marker);
      }
      if (options.scope) createScope();
      flowContext.pushScope();
      body = parseBlock(flowContext);
      flowContext.popScope();
      if (options.scope) destroyScope();
      clauses.push(finishNode(ast.elseClause(body)));
    }

    expect('end');
    return finishNode(ast.ifStatement(clauses));
  }

  // There are two types of for statements, generic and numeric.
  //
  //     for ::= Name '=' exp ',' exp [',' exp] 'do' block 'end'
  //     for ::= namelist 'in' explist 'do' block 'end'
  //     namelist ::= Name {',' Name}
  //     explist ::= exp {',' exp}

  function parseForStatement(flowContext) {
    var variable = parseIdentifier()
      , body;

    // The start-identifier is local.

    if (options.scope) {
      createScope();
      scopeIdentifier(variable);
    }

    // If the first expression is followed by a `=` punctuator, this is a
    // Numeric For Statement.
    if (consume('=')) {
      // Start expression
      var start = parseExpectedExpression(flowContext);
      expect(',');
      // End expression
      var end = parseExpectedExpression(flowContext);
      // Optional step expression
      var step = consume(',') ? parseExpectedExpression(flowContext) : null;

      expect('do');
      flowContext.pushScope(true);
      body = parseBlock(flowContext);
      flowContext.popScope();
      expect('end');
      if (options.scope) destroyScope();

      return finishNode(ast.forNumericStatement(variable, start, end, step, body));
    }
    // If not, it's a Generic For Statement
    else {
      // The namelist can contain one or more identifiers.
      var variables = [variable];
      while (consume(',')) {
        variable = parseIdentifier();
        // Each variable in the namelist is locally scoped.
        if (options.scope) scopeIdentifier(variable);
        variables.push(variable);
      }
      expect('in');
      var iterators = [];

      // One or more expressions in the explist.
      do {
        var expression = parseExpectedExpression(flowContext);
        iterators.push(expression);
      } while (consume(','));

      expect('do');
      flowContext.pushScope(true);
      body = parseBlock(flowContext);
      flowContext.popScope();
      expect('end');
      if (options.scope) destroyScope();

      return finishNode(ast.forGenericStatement(variables, iterators, body));
    }
  }

  // Local statements can either be variable assignments or function
  // definitions. If a function definition is found, it will be delegated to
  // `parseFunctionDeclaration()` with the isLocal flag.
  //
  // This AST structure might change into a local assignment with a function
  // child.
  //
  //     local ::= 'local' 'function' Name funcdecl
  //        | 'local' Name {',' Name} ['=' exp {',' exp}]

  function parseLocalStatement(flowContext) {
    var name
      , declToken = previousToken;

    if (Identifier === token.type) {
      var variables = []
        , init = [];

      do {
        name = parseIdentifier();

        variables.push(name);
        flowContext.addLocal(name.name, declToken);
      } while (consume(','));

      if (consume('=')) {
        do {
          var expression = parseExpectedExpression(flowContext);
          init.push(expression);
        } while (consume(','));
      }

      // Declarations doesn't exist before the statement has been evaluated.
      // Therefore assignments can't use their declarator. And the identifiers
      // shouldn't be added to the scope until the statement is complete.
      if (options.scope) {
        for (var i = 0, l = variables.length; i < l; ++i) {
          scopeIdentifier(variables[i]);
        }
      }

      return finishNode(ast.localStatement(variables, init));
    }
    if (consume('function')) {
      name = parseIdentifier();
      flowContext.addLocal(name.name, declToken);

      if (options.scope) {
        scopeIdentifier(name);
        createScope();
      }

      // MemberExpressions are not allowed in local function statements.
      return parseFunctionDeclaration(name, true);
    } else {
      raiseUnexpectedToken('<name>', token);
    }
  }

  //     assignment ::= varlist '=' explist
  //     var ::= Name | prefixexp '[' exp ']' | prefixexp '.' Name
  //     varlist ::= var {',' var}
  //     explist ::= exp {',' exp}
  //
  //     call ::= callexp
  //     callexp ::= prefixexp args | prefixexp ':' Name args

  function parseAssignmentOrCallStatement(flowContext) {
    // Keep a reference to the previous token for better error messages in case
    // of invalid statement
    var previous = token
      , marker, startMarker;
    var lvalue, base, name;

    var targets = [];

    if (trackLocations) startMarker = createLocationMarker();

    do {
      if (trackLocations) marker = createLocationMarker();

      if (Identifier === token.type) {
        name = token.value;
        base = parseIdentifier();
        // Set the parent scope.
        if (options.scope) attachScope(base, scopeHasName(name));
        lvalue = true;
      } else if ('(' === token.value) {
        next();
        base = parseExpectedExpression(flowContext);
        expect(')');
        lvalue = false;
      } else {
        return unexpected(token);
      }

      both: for (;;) {
        var newBase;

        switch (StringLiteral === token.type ? '"' : token.value) {
        case '.':
        case '[':
          lvalue = true;
          break;
        case ':':
        case '(':
        case '{':
        case '"':
          lvalue = null;
          break;
        default:
          break both;
        }

        base = parsePrefixExpressionPart(base, marker, flowContext);
      }

      targets.push(base);

      if (',' !== token.value)
        break;

      if (!lvalue) {
        return unexpected(token);
      }

      next();
    } while (true);

    if (targets.length === 1 && lvalue === null) {
      pushLocation(marker);
      return finishNode(ast.callStatement(targets[0]));
    } else if (!lvalue) {
      return unexpected(token);
    }

    expect('=');

    var values = [];

    do {
      values.push(parseExpectedExpression(flowContext));
    } while (consume(','));

    pushLocation(startMarker);
    return finishNode(ast.assignmentStatement(targets, values));
  }

  // ### Non-statements

  //     Identifier ::= Name

  function parseIdentifier() {
    markLocation();
    var identifier = token.value;
    if (Identifier !== token.type) raiseUnexpectedToken('<name>', token);
    next();
    return finishNode(ast.identifier(identifier));
  }

  // Parse the functions parameters and body block. The name should already
  // have been parsed and passed to this declaration function. By separating
  // this we allow for anonymous functions in expressions.
  //
  // For local functions there's a boolean parameter which needs to be set
  // when parsing the declaration.
  //
  //     funcdecl ::= '(' [parlist] ')' block 'end'
  //     parlist ::= Name {',' Name} | [',' '...'] | '...'

  function parseFunctionDeclaration(name, isLocal) {
    var flowContext = makeFlowContext();
    flowContext.pushScope();

    var parameters = [];
    expect('(');

    // The declaration has arguments
    if (!consume(')')) {
      // Arguments are a comma separated list of identifiers, optionally ending
      // with a vararg.
      while (true) {
        if (Identifier === token.type) {
          var parameter = parseIdentifier();
          // Function parameters are local.
          if (options.scope) scopeIdentifier(parameter);

          parameters.push(parameter);

          if (consume(',')) continue;
        }
        // No arguments are allowed after a vararg.
        else if (VarargLiteral === token.type) {
          flowContext.allowVararg = true;
          parameters.push(parsePrimaryExpression(flowContext));
        } else {
          raiseUnexpectedToken('<name> or \'...\'', token);
        }
        expect(')');
        break;
      }
    }

    var body = parseBlock(flowContext);
    flowContext.popScope();
    expect('end');
    if (options.scope) destroyScope();

    isLocal = isLocal || false;
    return finishNode(ast.functionStatement(name, parameters, isLocal, body));
  }

  // Parse the function name as identifiers and member expressions.
  //
  //     Name {'.' Name} [':' Name]

  function parseFunctionName() {
    var base, name, marker;

    if (trackLocations) marker = createLocationMarker();
    base = parseIdentifier();

    if (options.scope) {
      attachScope(base, scopeHasName(base.name));
      createScope();
    }

    while (consume('.')) {
      pushLocation(marker);
      name = parseIdentifier();
      base = finishNode(ast.memberExpression(base, '.', name));
    }

    if (consume(':')) {
      pushLocation(marker);
      name = parseIdentifier();
      base = finishNode(ast.memberExpression(base, ':', name));
      if (options.scope) scopeIdentifierName('self');
    }

    return base;
  }

  //     tableconstructor ::= '{' [fieldlist] '}'
  //     fieldlist ::= field {fieldsep field} fieldsep
  //     field ::= '[' exp ']' '=' exp | Name = 'exp' | exp
  //
  //     fieldsep ::= ',' | ';'

  function parseTableConstructor(flowContext) {
    var fields = []
      , key, value;

    while (true) {
      markLocation();
      if (Punctuator === token.type && consume('[')) {
        key = parseExpectedExpression(flowContext);
        expect(']');
        expect('=');
        value = parseExpectedExpression(flowContext);
        fields.push(finishNode(ast.tableKey(key, value)));
      } else if (Identifier === token.type) {
        if ('=' === lookahead.value) {
          key = parseIdentifier();
          next();
          value = parseExpectedExpression(flowContext);
          fields.push(finishNode(ast.tableKeyString(key, value)));
        } else {
          value = parseExpectedExpression(flowContext);
          fields.push(finishNode(ast.tableValue(value)));
        }
      } else {
        if (null == (value = parseExpression(flowContext))) {
          locations.pop();
          break;
        }
        fields.push(finishNode(ast.tableValue(value)));
      }
      if (',;'.indexOf(token.value) >= 0) {
        next();
        continue;
      }
      break;
    }
    expect('}');
    return finishNode(ast.tableConstructorExpression(fields));
  }

  // Expression parser
  // -----------------
  //
  // Expressions are evaluated and always return a value. If nothing is
  // matched null will be returned.
  //
  //     exp ::= (unop exp | primary | prefixexp ) { binop exp }
  //
  //     primary ::= nil | false | true | Number | String | '...'
  //          | functiondef | tableconstructor
  //
  //     prefixexp ::= (Name | '(' exp ')' ) { '[' exp ']'
  //          | '.' Name | ':' Name args | args }
  //

  function parseExpression(flowContext) {
    var expression = parseSubExpression(0, flowContext);
    return expression;
  }

  // Parse an expression expecting it to be valid.

  function parseExpectedExpression(flowContext) {
    var expression = parseExpression(flowContext);
    if (null == expression) raiseUnexpectedToken('<expression>', token);
    else return expression;
  }


  // Return the precedence priority of the operator.
  //
  // As unary `-` can't be distinguished from binary `-`, unary precedence
  // isn't described in this table but in `parseSubExpression()` itself.
  //
  // As this function gets hit on every expression it's been optimized due to
  // the expensive CompareICStub which took ~8% of the parse time.

  function binaryPrecedence(operator) {
    var charCode = operator.charCodeAt(0)
      , length = operator.length;

    if (1 === length) {
      switch (charCode) {
        case 94: return 12; // ^
        case 42: case 47: case 37: return 10; // * / %
        case 43: case 45: return 9; // + -
        case 38: return 6; // &
        case 126: return 5; // ~
        case 124: return 4; // |
        case 60: case 62: return 3; // < >
      }
    } else if (2 === length) {
      switch (charCode) {
        case 47: return 10; // //
        case 46: return 8; // ..
        case 60: case 62:
            if('<<' === operator || '>>' === operator) return 7; // << >>
            return 3; // <= >=
        case 61: case 126: return 3; // == ~=
        case 111: return 1; // or
      }
    } else if (97 === charCode && 'and' === operator) return 2;
    return 0;
  }

  // Implement an operator-precedence parser to handle binary operator
  // precedence.
  //
  // We use this algorithm because it's compact, it's fast and Lua core uses
  // the same so we can be sure our expressions are parsed in the same manner
  // without excessive amounts of tests.
  //
  //     exp ::= (unop exp | primary | prefixexp ) { binop exp }

  function parseSubExpression(minPrecedence, flowContext) {
    var operator = token.value
    // The left-hand side in binary operations.
      , expression, marker;

    if (trackLocations) marker = createLocationMarker();

    // UnaryExpression
    if (isUnary(token)) {
      markLocation();
      next();
      var argument = parseSubExpression(10, flowContext);
      if (argument == null) raiseUnexpectedToken('<expression>', token);
      expression = finishNode(ast.unaryExpression(operator, argument));
    }
    if (null == expression) {
      // PrimaryExpression
      expression = parsePrimaryExpression(flowContext);

      // PrefixExpression
      if (null == expression) {
        expression = parsePrefixExpression(flowContext);
      }
    }
    // This is not a valid left hand expression.
    if (null == expression) return null;

    var precedence;
    while (true) {
      operator = token.value;

      precedence = (Punctuator === token.type || Keyword === token.type) ?
        binaryPrecedence(operator) : 0;

      if (precedence === 0 || precedence <= minPrecedence) break;
      // Right-hand precedence operators
      if ('^' === operator || '..' === operator) --precedence;
      next();
      var right = parseSubExpression(precedence, flowContext);
      if (null == right) raiseUnexpectedToken('<expression>', token);
      // Push in the marker created before the loop to wrap its entirety.
      if (trackLocations) locations.push(marker);
      expression = finishNode(ast.binaryExpression(operator, expression, right));

    }
    return expression;
  }

  //     prefixexp ::= prefix {suffix}
  //     prefix ::= Name | '(' exp ')'
  //     suffix ::= '[' exp ']' | '.' Name | ':' Name args | args
  //
  //     args ::= '(' [explist] ')' | tableconstructor | String

  function parsePrefixExpressionPart(base, marker, flowContext) {
    var expression, identifier;

    if (Punctuator === token.type) {
      switch (token.value) {
        case '[':
          pushLocation(marker);
          next();
          expression = parseExpectedExpression(flowContext);
          expect(']');
          return finishNode(ast.indexExpression(base, expression));
        case '.':
          pushLocation(marker);
          next();
          identifier = parseIdentifier();
          return finishNode(ast.memberExpression(base, '.', identifier));
        case ':':
          pushLocation(marker);
          next();
          identifier = parseIdentifier();
          base = finishNode(ast.memberExpression(base, ':', identifier));
          // Once a : is found, this has to be a CallExpression, otherwise
          // throw an error.
          pushLocation(marker);
          return parseCallExpression(base, flowContext);
        case '(': case '{': // args
          pushLocation(marker);
          return parseCallExpression(base, flowContext);
      }
    } else if (StringLiteral === token.type) {
      pushLocation(marker);
      return parseCallExpression(base, flowContext);
    }

    return null;
  }

  function parsePrefixExpression(flowContext) {
    var base, name, marker;

    if (trackLocations) marker = createLocationMarker();

    // The prefix
    if (Identifier === token.type) {
      name = token.value;
      base = parseIdentifier();
      // Set the parent scope.
      if (options.scope) attachScope(base, scopeHasName(name));
    } else if (consume('(')) {
      base = parseExpectedExpression(flowContext);
      expect(')');
    } else {
      return null;
    }

    // The suffix
    for (;;) {
      var newBase = parsePrefixExpressionPart(base, marker, flowContext);
      if (newBase === null)
        break;
      base = newBase;
    }

    return base;
  }

  //     args ::= '(' [explist] ')' | tableconstructor | String

  function parseCallExpression(base, flowContext) {
    if (Punctuator === token.type) {
      switch (token.value) {
        case '(':
          if (!features.emptyStatement) {
            if (token.line !== previousToken.line)
              raise(null, errors.ambiguousSyntax, token.value);
          }
          next();

          // List of expressions
          var expressions = [];
          var expression = parseExpression(flowContext);
          if (null != expression) expressions.push(expression);
          while (consume(',')) {
            expression = parseExpectedExpression(flowContext);
            expressions.push(expression);
          }

          expect(')');
          return finishNode(ast.callExpression(base, expressions));

        case '{':
          markLocation();
          next();
          var table = parseTableConstructor(flowContext);
          return finishNode(ast.tableCallExpression(base, table));
      }
    } else if (StringLiteral === token.type) {
      return finishNode(ast.stringCallExpression(base, parsePrimaryExpression(flowContext)));
    }

    raiseUnexpectedToken('function arguments', token);
  }

  //     primary ::= String | Numeric | nil | true | false
  //          | functiondef | tableconstructor | '...'

  function parsePrimaryExpression(flowContext) {
    var literals = StringLiteral | NumericLiteral | BooleanLiteral | NilLiteral | VarargLiteral
      , value = token.value
      , type = token.type
      , marker;

    if (trackLocations) marker = createLocationMarker();

    if (type === VarargLiteral && !flowContext.allowVararg) {
      raise(token, errors.cannotUseVararg, token.value);
    }

    if (type & literals) {
      pushLocation(marker);
      var raw = input.slice(token.range[0], token.range[1]);
      next();
      return finishNode(ast.literal(type, value, raw));
    } else if (Keyword === type && 'function' === value) {
      pushLocation(marker);
      next();
      if (options.scope) createScope();
      return parseFunctionDeclaration(null);
    } else if (consume('{')) {
      pushLocation(marker);
      return parseTableConstructor(flowContext);
    }
  }

  // Parser
  // ------

  // Export the main parser.
  //
  //   - `wait` Hold parsing until end() is called. Defaults to false
  //   - `comments` Store comments. Defaults to true.
  //   - `scope` Track identifier scope. Defaults to false.
  //   - `locations` Store location information. Defaults to false.
  //   - `ranges` Store the start and end character locations. Defaults to
  //     false.
  //   - `onCreateNode` Callback which will be invoked when a syntax node is
  //     created.
  //   - `onCreateScope` Callback which will be invoked when a new scope is
  //     created.
  //   - `onDestroyScope` Callback which will be invoked when the current scope
  //     is destroyed.
  //
  // Example:
  //
  //     var parser = require('luaparser');
  //     parser.parse('i = 0');

  exports.parse = parse;

  var versionFeatures = {
    '5.1': {
    },
    '5.2': {
      labels: true,
      emptyStatement: true,
      hexEscapes: true,
      skipWhitespaceEscape: true,
      strictEscapes: true,
      relaxedBreak: true
    },
    '5.3': {
      labels: true,
      emptyStatement: true,
      hexEscapes: true,
      skipWhitespaceEscape: true,
      strictEscapes: true,
      unicodeEscapes: true,
      bitwiseOperators: true,
      integerDivision: true,
      relaxedBreak: true
    },
    'LuaJIT': {
      // XXX: LuaJIT language features may depend on compilation options; may need to
      // rethink how to handle this. Specifically, there is a LUAJIT_ENABLE_LUA52COMPAT
      // that removes contextual goto. Maybe add 'LuaJIT-5.2compat' as well?
      labels: true,
      contextualGoto: true,
      hexEscapes: true,
      skipWhitespaceEscape: true,
      strictEscapes: true,
      unicodeEscapes: true
    }
  };

  function parse(_input, _options) {
    if ('undefined' === typeof _options && 'object' === typeof _input) {
      _options = _input;
      _input = undefined;
    }
    if (!_options) _options = {};

    input = _input || '';
    options = assign({}, defaultOptions, _options);

    // Rewind the lexer
    index = 0;
    line = 1;
    lineStart = 0;
    length = input.length;
    // When tracking identifier scope, initialize with an empty scope.
    scopes = [[]];
    scopeDepth = 0;
    globals = [];
    locations = [];

    if (!Object.prototype.hasOwnProperty.call(versionFeatures, options.luaVersion)) {
      throw new Error(sprintf("Lua version '%1' not supported", options.luaVersion));
    }

    features = assign({}, versionFeatures[options.luaVersion]);
    if (options.extendedIdentifiers !== void 0)
      features.extendedIdentifiers = !!options.extendedIdentifiers;

    if (options.comments) comments = [];
    if (!options.wait) return end();
    return exports;
  }

  // Write to the source code buffer without beginning the parse.
  exports.write = write;

  function write(_input) {
    input += String(_input);
    length = input.length;
    return exports;
  }

  // Send an EOF and begin parsing.
  exports.end = end;

  function end(_input) {
    if ('undefined' !== typeof _input) write(_input);

    // Ignore shebangs.
    if (input && input.substr(0, 2) === '#!') input = input.replace(/^.*/, function (line) {
      return line.replace(/./g, ' ');
    });

    length = input.length;
    trackLocations = options.locations || options.ranges;
    // Initialize with a lookahead token.
    lookahead = lex();

    var chunk = parseChunk();
    if (options.comments) chunk.comments = comments;
    if (options.scope) chunk.globals = globals;

    /* istanbul ignore if */
    if (locations.length > 0)
      throw new Error('Location tracking failed. This is most likely a bug in luaparse');

    return chunk;
  }

}));
/* vim: set sw=2 ts=2 et tw=79 : */

;
/*! https://mths.be/luamin v1.0.4 by @mathias */
;(function(root) {

    // Detect free variables `exports`
    var freeExports = typeof exports == 'object' && exports;

    // Detect free variable `module`
    var freeModule = typeof module == 'object' && module &&
        module.exports == freeExports && module;

    // Detect free variable `global`, from Node.js or Browserified code,
    // and use it as `root`
    var freeGlobal = typeof global == 'object' && global;
    if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
        root = freeGlobal;
    }

    /*--------------------------------------------------------------------------*/

    var luaparse = root.luaparse || require('luaparse');
    luaparse.defaultOptions.comments = false;
    luaparse.defaultOptions.scope = true;
    var parse = luaparse.parse;

    var regexAlphaUnderscore = /[a-zA-Z_]/;
    var regexAlphaNumUnderscore = /[a-zA-Z0-9_]/;
    var regexDigits = /[0-9]/;

    // http://www.lua.org/manual/5.2/manual.html#3.4.7
    // http://www.lua.org/source/5.2/lparser.c.html#priority
    var PRECEDENCE = {
        'or': 1,
        'and': 2,
        '<': 3, '>': 3, '<=': 3, '>=': 3, '~=': 3, '==': 3,
        '..': 5,
        '+': 6, '-': 6, // binary -
        '*': 7, '/': 7, '%': 7,
        'unarynot': 8, 'unary#': 8, 'unary-': 8, // unary -
        '^': 10
    };

    var IDENTIFIER_PARTS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a',
        'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
        'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E',
        'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z', '_'];
    var IDENTIFIER_PARTS_MAX = IDENTIFIER_PARTS.length - 1;

    var each = function(array, fn) {
        var index = -1;
        var length = array.length;
        var max = length - 1;
        while (++index < length) {
            fn(array[index], index < max);
        }
    };

    var indexOf = function(array, value) {
        var index = -1;
        var length = array.length;
        while (++index < length) {
            if (array[index] == value) {
                return index;
            }
        }
    };

    var hasOwnProperty = {}.hasOwnProperty;
    var extend = function(destination, source) {
        var key;
        if (source) {
            for (key in source) {
                if (hasOwnProperty.call(source, key)) {
                    destination[key] = source[key];
                }
            }
        }
        return destination;
    };

    var generateZeroes = function(length) {
        var zero = '0';
        var result = '';
        if (length < 1) {
            return result;
        }
        if (length == 1) {
            return zero;
        }
        while (length) {
            if (length & 1) {
                result += zero;
            }
            if (length >>= 1) {
                zero += zero;
            }
        }
        return result;
    };

    // http://www.lua.org/manual/5.2/manual.html#3.1
    function isKeyword(id) {
        switch (id.length) {
            case 2:
                return 'do' == id || 'if' == id || 'in' == id || 'or' == id;
            case 3:
                return 'and' == id || 'end' == id || 'for' == id || 'nil' == id ||
                    'not' == id;
            case 4:
                return 'else' == id || 'goto' == id || 'then' == id || 'true' == id;
            case 5:
                return 'break' == id || 'false' == id || 'local' == id ||
                    'until' == id || 'while' == id;
            case 6:
                return 'elseif' == id || 'repeat' == id || 'return' == id;
            case 8:
                return 'function' == id;
        }
        return false;
    }

    var currentIdentifier;
    var identifierMap;
    var identifiersInUse;
    var generateIdentifier = function(originalName) {
        // Preserve `self` in methods
        if (originalName == 'self') {
            return originalName;
        }

        if (hasOwnProperty.call(identifierMap, originalName)) {
            return identifierMap[originalName];
        }
        var length = currentIdentifier.length;
        var position = length - 1;
        var character;
        var index;
        while (position >= 0) {
            character = currentIdentifier.charAt(position);
            index = indexOf(IDENTIFIER_PARTS, character);
            if (index != IDENTIFIER_PARTS_MAX) {
                currentIdentifier = currentIdentifier.substring(0, position) +
                    IDENTIFIER_PARTS[index + 1] + generateZeroes(length - (position + 1));
                if (
                    isKeyword(currentIdentifier) ||
                    indexOf(identifiersInUse, currentIdentifier) > -1
                ) {
                    return generateIdentifier(originalName);
                }
                identifierMap[originalName] = currentIdentifier;
                return currentIdentifier;
            }
            --position;
        }
        currentIdentifier = 'a' + generateZeroes(length);
        if (indexOf(identifiersInUse, currentIdentifier) > -1) {
            return generateIdentifier(originalName);
        }
        identifierMap[originalName] = currentIdentifier;
        return currentIdentifier;
    };

    /*--------------------------------------------------------------------------*/

    var joinStatements = function(a, b, separator) {
        separator || (separator = ' ');

        var lastCharA = a.slice(-1);
        var firstCharB = b.charAt(0);

        if (lastCharA == '' || firstCharB == '') {
            return a + b;
        }
        if (regexAlphaUnderscore.test(lastCharA)) {
            if (regexAlphaNumUnderscore.test(firstCharB)) {
                // e.g. `while` + `1`
                // e.g. `local a` + `local b`
                return a + separator + b;
            } else {
                // e.g. `not` + `(2>3 or 3<2)`
                // e.g. `x` + `^`
                return a + b;
            }
        }
        if (regexDigits.test(lastCharA)) {
            if (
                firstCharB == '(' ||
                !(firstCharB == '.' ||
                regexAlphaUnderscore.test(firstCharB))
            ) {
                // e.g. `1` + `+`
                // e.g. `1` + `==`
                return a + b;
            } else {
                // e.g. `1` + `..`
                // e.g. `1` + `and`
                return a + separator + b;
            }
        }
        if (lastCharA == firstCharB && lastCharA == '-') {
            // e.g. `1-` + `-2`
            return a + separator + b;
        }
        var secondLastCharA = a.slice(-2, -1);
        if (lastCharA == '.' && secondLastCharA != '.' && regexAlphaNumUnderscore.test(firstCharB)) {
            // e.g. `1.` + `print`
            return a + separator + b;
        }
        return a + b;
    };

    var formatBase = function(base) {
        var result = '';
        var type = base.type;
        var needsParens = base.inParens && (
            type == 'CallExpression' ||
            type == 'BinaryExpression' ||
            type == 'FunctionDeclaration' ||
            type == 'TableConstructorExpression' ||
            type == 'LogicalExpression' ||
            type == 'StringLiteral'
        );
        if (needsParens) {
            result += '(';
        }
        result += formatExpression(base);
        if (needsParens) {
            result += ')';
        }
        return result;
    };

    var formatExpression = function(expression, options) {

        options = extend({
            'precedence': 0,
            'preserveIdentifiers': false
        }, options);

        var result = '';
        var currentPrecedence;
        var associativity;
        var operator;

        var expressionType = expression.type;

        if (expressionType == 'Identifier') {

            result = expression.isLocal && !options.preserveIdentifiers
                ? generateIdentifier(expression.name)
                : expression.name;

        } else if (
            expressionType == 'StringLiteral' ||
            expressionType == 'NumericLiteral' ||
            expressionType == 'BooleanLiteral' ||
            expressionType == 'NilLiteral' ||
            expressionType == 'VarargLiteral'
        ) {

            result = expression.raw;

        } else if (
            expressionType == 'LogicalExpression' ||
            expressionType == 'BinaryExpression'
        ) {

            // If an expression with precedence x
            // contains an expression with precedence < x,
            // the inner expression must be wrapped in parens.
            operator = expression.operator;
            currentPrecedence = PRECEDENCE[operator];
            associativity = 'left';

            result = formatExpression(expression.left, {
                'precedence': currentPrecedence,
                'direction': 'left',
                'parent': operator
            });
            result = joinStatements(result, operator);
            result = joinStatements(result, formatExpression(expression.right, {
                'precedence': currentPrecedence,
                'direction': 'right',
                'parent': operator
            }));

            if (operator == '^' || operator == '..') {
                associativity = "right";
            }

            if (
                currentPrecedence < options.precedence ||
                (
                    currentPrecedence == options.precedence &&
                    associativity != options.direction &&
                    options.parent != '+' &&
                    !(options.parent == '*' && (operator == '/' || operator == '*'))
                )
            ) {
                // The most simple case here is that of
                // protecting the parentheses on the RHS of
                // `1 - (2 - 3)` but deleting them from `(1 - 2) - 3`.
                // This is generally the right thing to do. The
                // semantics of `+` are special however: `1 + (2 - 3)`
                // == `1 + 2 - 3`. `-` and `+` are the only two operators
                // who share their precedence level. `*` also can
                // commute in such a way with `/`, but not with `%`
                // (all three share a precedence). So we test for
                // all of these conditions and avoid emitting
                // parentheses in the cases where we don’t have to.
                result = '(' + result + ')';
            }

        } else if (expressionType == 'UnaryExpression') {

            operator = expression.operator;
            currentPrecedence = PRECEDENCE['unary' + operator];

            result = joinStatements(
                operator,
                formatExpression(expression.argument, {
                    'precedence': currentPrecedence
                })
            );

            if (
                currentPrecedence < options.precedence &&
                // In principle, we should parenthesize the RHS of an
                // expression like `3^-2`, because `^` has higher precedence
                // than unary `-` according to the manual. But that is
                // misleading on the RHS of `^`, since the parser will
                // always try to find a unary operator regardless of
                // precedence.
                !(
                    (options.parent == '^') &&
                    options.direction == 'right'
                )
            ) {
                result = '(' + result + ')';
            }

        } else if (expressionType == 'CallExpression') {

            result = formatBase(expression.base) + '(';

            each(expression.arguments, function(argument, needsComma) {
                result += formatExpression(argument);
                if (needsComma) {
                    result += ',';
                }
            });
            result += ')';

        } else if (expressionType == 'TableCallExpression') {

            result = formatExpression(expression.base) +
                formatExpression(expression.arguments);

        } else if (expressionType == 'StringCallExpression') {

            result = formatExpression(expression.base) +
                formatExpression(expression.argument);

        } else if (expressionType == 'IndexExpression') {

            result = formatBase(expression.base) + '[' +
                formatExpression(expression.index) + ']';

        } else if (expressionType == 'MemberExpression') {

            result = formatBase(expression.base) + expression.indexer +
                formatExpression(expression.identifier, {
                    'preserveIdentifiers': true
                });

        } else if (expressionType == 'FunctionDeclaration') {

            result = 'function(';
            if (expression.parameters.length) {
                each(expression.parameters, function(parameter, needsComma) {
                    // `Identifier`s have a `name`, `VarargLiteral`s have a `value`
                    result += parameter.name
                        ? generateIdentifier(parameter.name)
                        : parameter.value;
                    if (needsComma) {
                        result += ',';
                    }
                });
            }
            result += ')';
            result = joinStatements(result, formatStatementList(expression.body));
            result = joinStatements(result, 'end');

        } else if (expressionType == 'TableConstructorExpression') {

            result = '{';

            each(expression.fields, function(field, needsComma) {
                if (field.type == 'TableKey') {
                    result += '[' + formatExpression(field.key) + ']=' +
                        formatExpression(field.value);
                } else if (field.type == 'TableValue') {
                    result += formatExpression(field.value);
                } else { // at this point, `field.type == 'TableKeyString'`
                    result += formatExpression(field.key, {
                        // TODO: keep track of nested scopes (#18)
                        'preserveIdentifiers': true
                    }) + '=' + formatExpression(field.value);
                }
                if (needsComma) {
                    result += ',';
                }
            });

            result += '}';

        } else {

            throw TypeError('Unknown expression type: `' + expressionType + '`');

        }

        return result;
    };

    var formatStatementList = function(body) {
        var result = '';
        each(body, function(statement) {
            result = joinStatements(result, formatStatement(statement), ';');
        });
        return result;
    };

    var formatStatement = function(statement) {
        var result = '';
        var statementType = statement.type;

        if (statementType == 'AssignmentStatement') {

            // left-hand side
            each(statement.variables, function(variable, needsComma) {
                result += formatExpression(variable);
                if (needsComma) {
                    result += ',';
                }
            });

            // right-hand side
            result += '=';
            each(statement.init, function(init, needsComma) {
                result += formatExpression(init);
                if (needsComma) {
                    result += ',';
                }
            });

        } else if (statementType == 'LocalStatement') {

            result = 'local ';

            // left-hand side
            each(statement.variables, function(variable, needsComma) {
                // Variables in a `LocalStatement` are always local, duh
                result += generateIdentifier(variable.name);
                if (needsComma) {
                    result += ',';
                }
            });

            // right-hand side
            if (statement.init.length) {
                result += '=';
                each(statement.init, function(init, needsComma) {
                    result += formatExpression(init);
                    if (needsComma) {
                        result += ',';
                    }
                });
            }

        } else if (statementType == 'CallStatement') {

            result = formatExpression(statement.expression);

        } else if (statementType == 'IfStatement') {

            result = joinStatements(
                'if',
                formatExpression(statement.clauses[0].condition)
            );
            result = joinStatements(result, 'then');
            result = joinStatements(
                result,
                formatStatementList(statement.clauses[0].body)
            );
            each(statement.clauses.slice(1), function(clause) {
                if (clause.condition) {
                    result = joinStatements(result, 'elseif');
                    result = joinStatements(result, formatExpression(clause.condition));
                    result = joinStatements(result, 'then');
                } else {
                    result = joinStatements(result, 'else');
                }
                result = joinStatements(result, formatStatementList(clause.body));
            });
            result = joinStatements(result, 'end');

        } else if (statementType == 'WhileStatement') {

            result = joinStatements('while', formatExpression(statement.condition));
            result = joinStatements(result, 'do');
            result = joinStatements(result, formatStatementList(statement.body));
            result = joinStatements(result, 'end');

        } else if (statementType == 'DoStatement') {

            result = joinStatements('do', formatStatementList(statement.body));
            result = joinStatements(result, 'end');

        } else if (statementType == 'ReturnStatement') {

            result = 'return';

            each(statement.arguments, function(argument, needsComma) {
                result = joinStatements(result, formatExpression(argument));
                if (needsComma) {
                    result += ',';
                }
            });

        } else if (statementType == 'BreakStatement') {

            result = 'break';

        } else if (statementType == 'RepeatStatement') {

            result = joinStatements('repeat', formatStatementList(statement.body));
            result = joinStatements(result, 'until');
            result = joinStatements(result, formatExpression(statement.condition))

        } else if (statementType == 'FunctionDeclaration') {

            result = (statement.isLocal ? 'local ' : '') + 'function ';
            result += formatExpression(statement.identifier);
            result += '(';

            if (statement.parameters.length) {
                each(statement.parameters, function(parameter, needsComma) {
                    // `Identifier`s have a `name`, `VarargLiteral`s have a `value`
                    result += parameter.name
                        ? generateIdentifier(parameter.name)
                        : parameter.value;
                    if (needsComma) {
                        result += ',';
                    }
                });
            }

            result += ')';
            result = joinStatements(result, formatStatementList(statement.body));
            result = joinStatements(result, 'end');

        } else if (statementType == 'ForGenericStatement') {
            // see also `ForNumericStatement`

            result = 'for ';

            each(statement.variables, function(variable, needsComma) {
                // The variables in a `ForGenericStatement` are always local
                result += generateIdentifier(variable.name);
                if (needsComma) {
                    result += ',';
                }
            });

            result += ' in';

            each(statement.iterators, function(iterator, needsComma) {
                result = joinStatements(result, formatExpression(iterator));
                if (needsComma) {
                    result += ',';
                }
            });

            result = joinStatements(result, 'do');
            result = joinStatements(result, formatStatementList(statement.body));
            result = joinStatements(result, 'end');

        } else if (statementType == 'ForNumericStatement') {

            // The variables in a `ForNumericStatement` are always local
            result = 'for ' + generateIdentifier(statement.variable.name) + '=';
            result += formatExpression(statement.start) + ',' +
                formatExpression(statement.end);

            if (statement.step) {
                result += ',' + formatExpression(statement.step);
            }

            result = joinStatements(result, 'do');
            result = joinStatements(result, formatStatementList(statement.body));
            result = joinStatements(result, 'end');

        } else if (statementType == 'LabelStatement') {

            // The identifier names in a `LabelStatement` can safely be renamed
            result = '::' + generateIdentifier(statement.label.name) + '::';

        } else if (statementType == 'GotoStatement') {

            // The identifier names in a `GotoStatement` can safely be renamed
            result = 'goto ' + generateIdentifier(statement.label.name);

        } else {

            throw TypeError('Unknown statement type: `' + statementType + '`');

        }

        return result;
    };

    var minify = function(argument) {
        // `argument` can be a Lua code snippet (string)
        // or a luaparse-compatible AST (object)
        var ast = typeof argument == 'string'
            ? parse(argument)
            : argument;

        // (Re)set temporary identifier values
        identifierMap = {};
        identifiersInUse = [];
        // This is a shortcut to help generate the first identifier (`a`) faster
        currentIdentifier = '9';

        // Make sure global variable names aren't renamed
        if (ast.globals) {
            each(ast.globals, function(object) {
                var name = object.name;
                identifierMap[name] = name;
                identifiersInUse.push(name);
            });
        } else {
            throw Error('Missing required AST property: `globals`');
        }

        return formatStatementList(ast.body);
    };

    /*--------------------------------------------------------------------------*/

    var luamin = {
        'version': '1.0.4',
        'minify': minify
    };

    // Some AMD build optimizers, like r.js, check for specific condition patterns
    // like the following:
    if (
        typeof define == 'function' &&
        typeof define.amd == 'object' &&
        define.amd
    ) {
        define(function() {
            return luamin;
        });
    }   else if (freeExports && !freeExports.nodeType) {
        if (freeModule) { // in Node.js or RingoJS v0.8.0+
            freeModule.exports = luamin;
        } else { // in Narwhal or RingoJS v0.7.0-
            extend(freeExports, luamin);
        }
    } else { // in Rhino or a web browser
        root.luamin = luamin;
    }

}(this));

;
/*! https://mths.be/luamin v1.0.4 by @mathias
    modified by CrazyFluffyPony
*/
;(function(root) {

    // Detect free variables `exports`
    var freeExports = typeof exports == 'object' && exports;

    // Detect free variable `module`
    var freeModule = typeof module == 'object' && module &&
        module.exports == freeExports && module;

    // Detect free variable `global`, from Node.js or Browserified code,
    // and use it as `root`
    var freeGlobal = typeof global == 'object' && global;
    if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
        root = freeGlobal;
    }

    /*--------------------------------------------------------------------------*/

    var luaparse = root.luaparse || require('luaparse');
    luaparse.defaultOptions.comments = false;
    luaparse.defaultOptions.scope = true;
    var parse = luaparse.parse;

    var regexAlphaUnderscore = /[a-zA-Z_]/;
    var regexAlphaNumUnderscore = /[a-zA-Z0-9_]/;
    var regexDigits = /[0-9]/;

    // http://www.lua.org/manual/5.2/manual.html#3.4.7
    // http://www.lua.org/source/5.2/lparser.c.html#priority
    var PRECEDENCE = {
        'or': 1,
        'and': 2,
        '<': 3, '>': 3, '<=': 3, '>=': 3, '~=': 3, '==': 3,
        '..': 5,
        '+': 6, '-': 6, // binary -
        '*': 7, '/': 7, '%': 7,
        'unarynot': 8, 'unary#': 8, 'unary-': 8, // unary -
        '^': 10
    };

    var IDENTIFIER_PARTS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a',
        'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
        'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E',
        'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z', '_'];
    var IDENTIFIER_PARTS_MAX = IDENTIFIER_PARTS.length - 1;

    var each = function(array, fn) {
        var index = -1;
        var length = array.length;
        var max = length - 1;
        while (++index < length) {
            fn(array[index], index < max);
        }
    };

    var indexOf = function(array, value) {
        var index = -1;
        var length = array.length;
        while (++index < length) {
            if (array[index] == value) {
                return index;
            }
        }
    };

    var hasOwnProperty = {}.hasOwnProperty;
    var extend = function(destination, source) {
        var key;
        if (source) {
            for (key in source) {
                if (hasOwnProperty.call(source, key)) {
                    destination[key] = source[key];
                }
            }
        }
        return destination;
    };

    var generateZeroes = function(length) {
        var zero = '0';
        var result = '';
        if (length < 1) {
            return result;
        }
        if (length == 1) {
            return zero;
        }
        while (length) {
            if (length & 1) {
                result += zero;
            }
            if (length >>= 1) {
                zero += zero;
            }
        }
        return result;
    };

    // http://www.lua.org/manual/5.2/manual.html#3.1
    function isKeyword(id) {
        switch (id.length) {
            case 2:
                return 'do' == id || 'if' == id || 'in' == id || 'or' == id;
            case 3:
                return 'and' == id || 'end' == id || 'for' == id || 'nil' == id ||
                    'not' == id;
            case 4:
                return 'else' == id || 'goto' == id || 'then' == id || 'true' == id;
            case 5:
                return 'break' == id || 'false' == id || 'local' == id ||
                    'until' == id || 'while' == id;
            case 6:
                return 'elseif' == id || 'repeat' == id || 'return' == id;
            case 8:
                return 'function' == id;
        }
        return false;
    }

    function isMinifyProhibited(id){
        return id == 'onTick' || id == 'onDraw'
    }

    var currentIdentifier;
    var identifierMap;
    var libIdentifierMap;
    var identifiersInUse;
    var generateIdentifier = function(originalName, library) {
        console.log('generateIdentifier', originalName, library)
        // Preserve `self` in methods
        if (originalName == 'self' || ! MINMAX.isMinificationAllowed(originalName, library)) {
            console.log(originalName)
            return originalName;
        }

        if(library){
            if (libIdentifierMap[library] && hasOwnProperty.call(libIdentifierMap[library], originalName)) {
                console.log(libIdentifierMap[library][originalName])
                return libIdentifierMap[library][originalName];
            }
        } else {
            if (hasOwnProperty.call(identifierMap, originalName)) {
                console.log(identifierMap[originalName])
                return identifierMap[originalName];
            }
        }
        var length = currentIdentifier.length;
        var position = length - 1;
        var character;
        var index;
        while (position >= 0) {
            character = currentIdentifier.charAt(position);
            index = indexOf(IDENTIFIER_PARTS, character);
            if (index != IDENTIFIER_PARTS_MAX) {
                currentIdentifier = currentIdentifier.substring(0, position) +
                    IDENTIFIER_PARTS[index + 1] + generateZeroes(length - (position + 1));
                if (
                    isKeyword(currentIdentifier) ||
                    indexOf(identifiersInUse, currentIdentifier) > -1
                ) {
                    return generateIdentifier(originalName);
                }

                if(library){
                    if(!libIdentifierMap[library]){
                        libIdentifierMap[library]={}
                    }
                    libIdentifierMap[library][originalName]=currentIdentifier
                } else {
                    identifierMap[originalName] = currentIdentifier;                    
                }

                console.log(currentIdentifier)
                return currentIdentifier;
            }
            --position;
        }
        currentIdentifier = 'a' + generateZeroes(length);
        if (indexOf(identifiersInUse, currentIdentifier) > -1) {
            let ret = generateIdentifier(originalName);
            console.log(ret)
            return ret
        }

        if(library){
            if(!libIdentifierMap[library]){
                libIdentifierMap[library]={}
            }
            libIdentifierMap[library][originalName]=currentIdentifier
        } else {
            identifierMap[originalName] = currentIdentifier;            
        }

        console.log(currentIdentifier)
        return currentIdentifier;
    };

    /*--------------------------------------------------------------------------*/

    var joinStatements = function(a, b, separator) {
        separator || (separator = ' ');

        var lastCharA = a.slice(-1);
        var firstCharB = b.charAt(0);

        if (lastCharA == '' || firstCharB == '') {
            return a + b;
        }
        if (regexAlphaUnderscore.test(lastCharA)) {
            if (regexAlphaNumUnderscore.test(firstCharB)) {
                // e.g. `while` + `1`
                // e.g. `local a` + `local b`
                return a + separator + b;
            } else {
                // e.g. `not` + `(2>3 or 3<2)`
                // e.g. `x` + `^`
                return a + b;
            }
        }
        if (regexDigits.test(lastCharA)) {
            if (
                firstCharB == '(' ||
                !(firstCharB == '.' ||
                regexAlphaUnderscore.test(firstCharB))
            ) {
                // e.g. `1` + `+`
                // e.g. `1` + `==`
                return a + b;
            } else {
                // e.g. `1` + `..`
                // e.g. `1` + `and`
                return a + separator + b;
            }
        }
        if (lastCharA == firstCharB && lastCharA == '-') {
            // e.g. `1-` + `-2`
            return a + separator + b;
        }
        var secondLastCharA = a.slice(-2, -1);
        if (lastCharA == '.' && secondLastCharA != '.' && regexAlphaNumUnderscore.test(firstCharB)) {
            // e.g. `1.` + `print`
            return a + separator + b;
        }
        return a + b;
    };

    var formatBase = function(base) {
        var result = '';
        var type = base.type;
        var needsParens = base.inParens && (
            type == 'CallExpression' ||
            type == 'BinaryExpression' ||
            type == 'FunctionDeclaration' ||
            type == 'TableConstructorExpression' ||
            type == 'LogicalExpression' ||
            type == 'StringLiteral'
        );
        if (needsParens) {
            result += '(';
        }
        result += formatExpression(base);
        if (needsParens) {
            result += ')';
        }
        return result;
    };

    var formatExpression = function(expression, options) {

        options = extend({
            'precedence': 0,
            'preserveIdentifiers': false
        }, options);

        var result = '';
        var currentPrecedence;
        var associativity;
        var operator;

        var expressionType = expression.type;

        if (expressionType == 'Identifier') {

            let r1 = indexOf(identifiersInUse, expression.name) 
            let r2 = !options.preserveIdentifiers

            result = (typeof r1 !== 'number' || r1 <= 0) && r2
                ? generateIdentifier(expression.name, options ? options.library : undefined)
                : expression.name;

        } else if (
            expressionType == 'StringLiteral' ||
            expressionType == 'NumericLiteral' ||
            expressionType == 'BooleanLiteral' ||
            expressionType == 'NilLiteral' ||
            expressionType == 'VarargLiteral'
        ) {

            result = expression.raw;

        } else if (
            expressionType == 'LogicalExpression' ||
            expressionType == 'BinaryExpression'
        ) {

            // If an expression with precedence x
            // contains an expression with precedence < x,
            // the inner expression must be wrapped in parens.
            operator = expression.operator;
            currentPrecedence = PRECEDENCE[operator];
            associativity = 'left';

            result = formatExpression(expression.left, {
                'precedence': currentPrecedence,
                'direction': 'left',
                'parent': operator
            });
            result = joinStatements(result, operator);
            result = joinStatements(result, formatExpression(expression.right, {
                'precedence': currentPrecedence,
                'direction': 'right',
                'parent': operator
            }));

            if (operator == '^' || operator == '..') {
                associativity = "right";
            }

            if (
                currentPrecedence < options.precedence ||
                (
                    currentPrecedence == options.precedence &&
                    associativity != options.direction &&
                    options.parent != '+' &&
                    !(options.parent == '*' && (operator == '/' || operator == '*'))
                )
            ) {
                // The most simple case here is that of
                // protecting the parentheses on the RHS of
                // `1 - (2 - 3)` but deleting them from `(1 - 2) - 3`.
                // This is generally the right thing to do. The
                // semantics of `+` are special however: `1 + (2 - 3)`
                // == `1 + 2 - 3`. `-` and `+` are the only two operators
                // who share their precedence level. `*` also can
                // commute in such a way with `/`, but not with `%`
                // (all three share a precedence). So we test for
                // all of these conditions and avoid emitting
                // parentheses in the cases where we don’t have to.
                result = '(' + result + ')';
            }

        } else if (expressionType == 'UnaryExpression') {

            operator = expression.operator;
            currentPrecedence = PRECEDENCE['unary' + operator];

            result = joinStatements(
                operator,
                formatExpression(expression.argument, {
                    'precedence': currentPrecedence
                })
            );

            if (
                currentPrecedence < options.precedence &&
                // In principle, we should parenthesize the RHS of an
                // expression like `3^-2`, because `^` has higher precedence
                // than unary `-` according to the manual. But that is
                // misleading on the RHS of `^`, since the parser will
                // always try to find a unary operator regardless of
                // precedence.
                !(
                    (options.parent == '^') &&
                    options.direction == 'right'
                )
            ) {
                result = '(' + result + ')';
            }

        } else if (expressionType == 'CallExpression') {

            result = formatBase(expression.base) + '(';

            each(expression.arguments, function(argument, needsComma) {
                result += formatExpression(argument);
                if (needsComma) {
                    result += ',';
                }
            });
            result += ')';

        } else if (expressionType == 'TableCallExpression') {

            result = formatExpression(expression.base) +
                formatExpression(expression.arguments);

        } else if (expressionType == 'StringCallExpression') {

            result = formatExpression(expression.base) +
                formatExpression(expression.argument);

        } else if (expressionType == 'IndexExpression') {

            result = formatBase(expression.base) + '[' +
                formatExpression(expression.index) + ']';

        } else if (expressionType == 'MemberExpression') {
			console.log('MemberExpression && default', expression)
			result = formatBase(expression.base) + expression.indexer +
				formatExpression(expression.identifier, {
					'preserveIdentifiers': true
				});


        } else if (expressionType == 'FunctionDeclaration') {

            result = 'function(';
            if (expression.parameters.length) {
                each(expression.parameters, function(parameter, needsComma) {
                    // `Identifier`s have a `name`, `VarargLiteral`s have a `value`
                    result += parameter.name
                        ? generateIdentifier(parameter.name)
                        : parameter.value;
                    if (needsComma) {
                        result += ',';
                    }
                });
            }
            result += ')';
            result = joinStatements(result, formatStatementList(expression.body));
            result = joinStatements(result, 'end');

        } else if (expressionType == 'TableConstructorExpression') {

            result = '{';

            each(expression.fields, function(field, needsComma) {
                if (field.type == 'TableKey') {
                    result += '[' + formatExpression(field.key) + ']=' +
                        formatExpression(field.value);
                } else if (field.type == 'TableValue') {
                    result += formatExpression(field.value);
                } else { // at this point, `field.type == 'TableKeyString'`
                    result += formatExpression(field.key, {
                        // TODO: keep track of nested scopes (#18)
                        'preserveIdentifiers': true
                    }) + '=' + formatExpression(field.value);
                }
                if (needsComma) {
                    result += ',';
                }
            });

            result += '}';

        } else {

            throw TypeError('Unknown expression type: `' + expressionType + '`');

        }

        return result;
    };

    var formatStatementList = function(body) {
        var result = '';
        each(body, function(statement) {
            result = joinStatements(result, formatStatement(statement), ';');
        });
        return result;
    };

    var formatStatement = function(statement) {
        var result = '';
        var statementType = statement.type;

        if (statementType == 'AssignmentStatement') {

            // left-hand side
            each(statement.variables, function(variable, needsComma) {
                result += formatExpression(variable);
                if (needsComma) {
                    result += ',';
                }
            });

            // right-hand side
            result += '=';
            each(statement.init, function(init, needsComma) {
                result += formatExpression(init);
                if (needsComma) {
                    result += ',';
                }
            });

        } else if (statementType == 'LocalStatement') {

            result = 'local ';

            // left-hand side
            each(statement.variables, function(variable, needsComma) {
                // Variables in a `LocalStatement` are always local, duh
                result += generateIdentifier(variable.name);
                if (needsComma) {
                    result += ',';
                }
            });

            // right-hand side
            if (statement.init.length) {
                result += '=';
                each(statement.init, function(init, needsComma) {
                    result += formatExpression(init);
                    if (needsComma) {
                        result += ',';
                    }
                });
            }

        } else if (statementType == 'CallStatement') {

            result = formatExpression(statement.expression);

        } else if (statementType == 'IfStatement') {

            result = joinStatements(
                'if',
                formatExpression(statement.clauses[0].condition)
            );
            result = joinStatements(result, 'then');
            result = joinStatements(
                result,
                formatStatementList(statement.clauses[0].body)
            );
            each(statement.clauses.slice(1), function(clause) {
                if (clause.condition) {
                    result = joinStatements(result, 'elseif');
                    result = joinStatements(result, formatExpression(clause.condition));
                    result = joinStatements(result, 'then');
                } else {
                    result = joinStatements(result, 'else');
                }
                result = joinStatements(result, formatStatementList(clause.body));
            });
            result = joinStatements(result, 'end');

        } else if (statementType == 'WhileStatement') {

            result = joinStatements('while', formatExpression(statement.condition));
            result = joinStatements(result, 'do');
            result = joinStatements(result, formatStatementList(statement.body));
            result = joinStatements(result, 'end');

        } else if (statementType == 'DoStatement') {

            result = joinStatements('do', formatStatementList(statement.body));
            result = joinStatements(result, 'end');

        } else if (statementType == 'ReturnStatement') {

            result = 'return';

            each(statement.arguments, function(argument, needsComma) {
                result = joinStatements(result, formatExpression(argument));
                if (needsComma) {
                    result += ',';
                }
            });

        } else if (statementType == 'BreakStatement') {

            result = 'break';

        } else if (statementType == 'RepeatStatement') {

            result = joinStatements('repeat', formatStatementList(statement.body));
            result = joinStatements(result, 'until');
            result = joinStatements(result, formatExpression(statement.condition))

        } else if (statementType == 'FunctionDeclaration') {

            result = (statement.isLocal ? 'local ' : '') + 'function ';
            result += formatExpression(statement.identifier);
            result += '(';

            if (statement.parameters.length) {
                each(statement.parameters, function(parameter, needsComma) {
                    // `Identifier`s have a `name`, `VarargLiteral`s have a `value`
                    result += parameter.name
                        ? generateIdentifier(parameter.name)
                        : parameter.value;
                    if (needsComma) {
                        result += ',';
                    }
                });
            }

            result += ')';
            result = joinStatements(result, formatStatementList(statement.body));
            result = joinStatements(result, 'end');

        } else if (statementType == 'ForGenericStatement') {
            // see also `ForNumericStatement`

            result = 'for ';

            each(statement.variables, function(variable, needsComma) {
                // The variables in a `ForGenericStatement` are always local
                result += generateIdentifier(variable.name);
                if (needsComma) {
                    result += ',';
                }
            });

            result += ' in';

            each(statement.iterators, function(iterator, needsComma) {
                result = joinStatements(result, formatExpression(iterator));
                if (needsComma) {
                    result += ',';
                }
            });

            result = joinStatements(result, 'do');
            result = joinStatements(result, formatStatementList(statement.body));
            result = joinStatements(result, 'end');

        } else if (statementType == 'ForNumericStatement') {

            // The variables in a `ForNumericStatement` are always local
            result = 'for ' + generateIdentifier(statement.variable.name) + '=';
            result += formatExpression(statement.start) + ',' +
                formatExpression(statement.end);

            if (statement.step) {
                result += ',' + formatExpression(statement.step);
            }

            result = joinStatements(result, 'do');
            result = joinStatements(result, formatStatementList(statement.body));
            result = joinStatements(result, 'end');

        } else if (statementType == 'LabelStatement') {

            // The identifier names in a `LabelStatement` can safely be renamed
            result = '::' + generateIdentifier(statement.label.name) + '::';

        } else if (statementType == 'GotoStatement') {

            // The identifier names in a `GotoStatement` can safely be renamed
            result = 'goto ' + generateIdentifier(statement.label.name);

        } else {

            throw TypeError('Unknown statement type: `' + statementType + '`');

        }

        return result;
    };

    var minify = function(argument) {
        // `argument` can be a Lua code snippet (string)
        // or a luaparse-compatible AST (object)
        var ast = typeof argument == 'string'
            ? parse(argument)
            : argument;

        // (Re)set temporary identifier values
        identifierMap = {};
        libIdentifierMap = {};
        identifiersInUse = [];
        // This is a shortcut to help generate the first identifier (`a`) faster
        currentIdentifier = '9';

        // Make sure global variable names aren't renamed
        /*if (ast.globals) {
            each(ast.globals, function(object) {
                var name = object.name;
                identifierMap[name] = name;
                identifiersInUse.push(name);
            });
        } else {
            throw Error('Missing required AST property: `globals`');
        }*/

        return formatStatementList(ast.body);
    };

    /*--------------------------------------------------------------------------*/

    var luaminy = {
        'version': '1.0.4',
        'minify': minify,
        getLastIdentifierMap: ()=>{
            return identifierMap
        },
        getLastLibIdentifierMap: ()=>{
            return libIdentifierMap
        }
    };

    // Some AMD build optimizers, like r.js, check for specific condition patterns
    // like the following:
    if (
        typeof define == 'function' &&
        typeof define.amd == 'object' &&
        define.amd
    ) {
        define(function() {
            return luaminy;
        });
    }   else if (freeExports && !freeExports.nodeType) {
        if (freeModule) { // in Node.js or RingoJS v0.8.0+
            freeModule.exports = luaminy;
        } else { // in Narwhal or RingoJS v0.7.0-
            extend(freeExports, luaminy);
        }
    } else { // in Rhino or a web browser
        root.luaminy = luaminy;
    }

}(this));

;
/*! luamax v1.0.0 by CrazyFluffyPony */
;(function(root) {

    // Detect free variables `exports`
    var freeExports = typeof exports == 'object' && exports;

    // Detect free variable `module`
    var freeModule = typeof module == 'object' && module &&
        module.exports == freeExports && module;

    // Detect free variable `global`, from Node.js or Browserified code,
    // and use it as `root`
    var freeGlobal = typeof global == 'object' && global;
    if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
        root = freeGlobal;
    }

    /*--------------------------------------------------------------------------*/

    var luaparse = root.luaparse || require('luaparse');
    luaparse.defaultOptions.comments = false;
    luaparse.defaultOptions.scope = true;
    var parse = luaparse.parse;

    var regexAlphaUnderscore = /[a-zA-Z_]/;
    var regexAlphaNumUnderscore = /[a-zA-Z0-9_]/;
    var regexDigits = /[0-9]/;

    // http://www.lua.org/manual/5.2/manual.html#3.4.7
    // http://www.lua.org/source/5.2/lparser.c.html#priority
    var PRECEDENCE = {
        'or': 1,
        'and': 2,
        '<': 3, '>': 3, '<=': 3, '>=': 3, '~=': 3, '==': 3,
        '..': 5,
        '+': 6, '-': 6, // binary -
        '*': 7, '/': 7, '%': 7,
        'unarynot': 8, 'unary#': 8, 'unary-': 8, // unary -
        '^': 10
    };

    var IDENTIFIER_PARTS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a',
        'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
        'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E',
        'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z', '_'];
    var IDENTIFIER_PARTS_MAX = IDENTIFIER_PARTS.length - 1;

    const NL = '\n'

    var tabs = function(level){
        var ret = ''
        while(level > 0){
            ret += '\t'
            level--
        }
        return ret
    }

    var each = function(array, fn) {
        var index = -1;
        var length = array.length;
        var max = length - 1;
        while (++index < length) {
            fn(array[index], index < max);
        }
    };

    var indexOf = function(array, value) {
        var index = -1;
        var length = array.length;
        while (++index < length) {
            if (array[index] == value) {
                return index;
            }
        }
    };

    var hasOwnProperty = {}.hasOwnProperty;
    var extend = function(destination, source) {
        var key;
        if (source) {
            for (key in source) {
                if (hasOwnProperty.call(source, key)) {
                    destination[key] = source[key];
                }
            }
        }
        return destination;
    };

    var generateZeroes = function(length) {
        var zero = '0';
        var result = '';
        if (length < 1) {
            return result;
        }
        if (length == 1) {
            return zero;
        }
        while (length) {
            if (length & 1) {
                result += zero;
            }
            if (length >>= 1) {
                zero += zero;
            }
        }
        return result;
    };

    // http://www.lua.org/manual/5.2/manual.html#3.1
    function isKeyword(id) {
        switch (id.length) {
            case 2:
                return 'do' == id || 'if' == id || 'in' == id || 'or' == id;
            case 3:
                return 'and' == id || 'end' == id || 'for' == id || 'nil' == id ||
                    'not' == id;
            case 4:
                return 'else' == id || 'goto' == id || 'then' == id || 'true' == id;
            case 5:
                return 'break' == id || 'false' == id || 'local' == id ||
                    'until' == id || 'while' == id;
            case 6:
                return 'elseif' == id || 'repeat' == id || 'return' == id;
            case 8:
                return 'function' == id;
        }
        return false;
    }
    var idMap
    var libIdMap
    var generateIdentifier = function(minifiedName, library) {
        // Preserve `self` in methods
        if (minifiedName == 'self') {
            return minifiedName;
        }

        if(library){
            if(libIdMap && libIdMap[library] && libIdMap[library][minifiedName]){
                return libIdMap[library][minifiedName]
            }
        } else {
            if(idMap && idMap[minifiedName]){
                return idMap[minifiedName]
            }
        }

        return minifiedName
    };

    /*--------------------------------------------------------------------------*/


    var formatBase = function(base) {
        var result = '';
        var type = base.type;
        var needsParens = base.inParens && (
            type == 'CallExpression' ||
            type == 'BinaryExpression' ||
            type == 'FunctionDeclaration' ||
            type == 'TableConstructorExpression' ||
            type == 'LogicalExpression' ||
            type == 'StringLiteral'
        );
        if (needsParens) {
            result += '(';
        }
        result += formatExpression(base);
        if (needsParens) {
            result += ')';
        }
        return result;
    };

    var formatExpression = function(expression, options) {

        options = extend({
            'precedence': 0,
            'preserveIdentifiers': false
        }, options);

        var result = '';
        var currentPrecedence;
        var associativity;
        var operator;

        var expressionType = expression.type;

        if (expressionType == 'Identifier') {

            result = !options.preserveIdentifiers || options && options.library
                ? generateIdentifier(expression.name, options ? options.library : undefined)
                : expression.name;

        } else if (
            expressionType == 'StringLiteral' ||
            expressionType == 'NumericLiteral' ||
            expressionType == 'BooleanLiteral' ||
            expressionType == 'NilLiteral' ||
            expressionType == 'VarargLiteral'
        ) {

            result = expression.raw;

        } else if (
            expressionType == 'LogicalExpression' ||
            expressionType == 'BinaryExpression'
        ) {

            // If an expression with precedence x
            // contains an expression with precedence < x,
            // the inner expression must be wrapped in parens.
            operator = expression.operator;
            currentPrecedence = PRECEDENCE[operator];
            associativity = 'left';

            result = formatExpression(expression.left, {
                'precedence': currentPrecedence,
                'direction': 'left',
                'parent': operator
            });
            result += ' ' + operator + ' ';
            result += formatExpression(expression.right, {
                'precedence': currentPrecedence,
                'direction': 'right',
                'parent': operator
            });

            if (operator == '^' || operator == '..') {
                associativity = "right";
            }

            if (
                currentPrecedence < options.precedence ||
                (
                    currentPrecedence == options.precedence &&
                    associativity != options.direction &&
                    options.parent != '+' &&
                    !(options.parent == '*' && (operator == '/' || operator == '*'))
                )
            ) {
                // The most simple case here is that of
                // protecting the parentheses on the RHS of
                // `1 - (2 - 3)` but deleting them from `(1 - 2) - 3`.
                // This is generally the right thing to do. The
                // semantics of `+` are special however: `1 + (2 - 3)`
                // == `1 + 2 - 3`. `-` and `+` are the only two operators
                // who share their precedence level. `*` also can
                // commute in such a way with `/`, but not with `%`
                // (all three share a precedence). So we test for
                // all of these conditions and avoid emitting
                // parentheses in the cases where we don’t have to.
                result = '(' + result + ')';
            }

        } else if (expressionType == 'UnaryExpression') {

            operator = expression.operator;
            currentPrecedence = PRECEDENCE['unary' + operator];

            result += formatExpression(expression.argument, {
                    'precedence': currentPrecedence
                })

            if (
                currentPrecedence < options.precedence &&
                // In principle, we should parenthesize the RHS of an
                // expression like `3^-2`, because `^` has higher precedence
                // than unary `-` according to the manual. But that is
                // misleading on the RHS of `^`, since the parser will
                // always try to find a unary operator regardless of
                // precedence.
                !(
                    (options.parent == '^') &&
                    options.direction == 'right'
                )
            ) {
                result = '(' + result + ')';
            }

        } else if (expressionType == 'CallExpression') {

            result = formatBase(expression.base) + '(';

            each(expression.arguments, function(argument, needsComma) {
                result += formatExpression(argument);
                if (needsComma) {
                    result += ',';
                }
            });
            result += ')';

        } else if (expressionType == 'TableCallExpression') {

            result = formatExpression(expression.base) +
                formatExpression(expression.arguments);

        } else if (expressionType == 'StringCallExpression') {

            result = formatExpression(expression.base) +
                formatExpression(expression.argument);

        } else if (expressionType == 'IndexExpression') {

            result = formatBase(expression.base) + '[' +
                formatExpression(expression.index) + ']';

        } else if (expressionType == 'MemberExpression') {

            result = formatBase(expression.base) + expression.indexer +
                formatExpression(expression.identifier, {
                    'preserveIdentifiers': true,
                    'library': expression.base.name
                });

        } else if (expressionType == 'FunctionDeclaration') {

            result = 'function(';
            if (expression.parameters.length) {
                each(expression.parameters, function(parameter, needsComma) {
                    // `Identifier`s have a `name`, `VarargLiteral`s have a `value`
                    result += parameter.name
                        ? generateIdentifier(parameter.name)
                        : parameter.value;
                    if (needsComma) {
                        result += ',';
                    }
                });
            }
            result += ')';
            result += formatStatementList(expression.body);
            result += 'end';

        } else if (expressionType == 'TableConstructorExpression') {

            result = '{';

            each(expression.fields, function(field, needsComma) {
                if (field.type == 'TableKey') {
                    result += '[' + formatExpression(field.key) + ']=' +
                        formatExpression(field.value);
                } else if (field.type == 'TableValue') {
                    result += formatExpression(field.value);
                } else { // at this point, `field.type == 'TableKeyString'`
                    result += formatExpression(field.key, {
                        // TODO: keep track of nested scopes (#18)
                        'preserveIdentifiers': true
                    }) + '=' + formatExpression(field.value);
                }
                if (needsComma) {
                    result += ',';
                }
            });

            result += '}';

        } else {

            throw TypeError('Unknown expression type: `' + expressionType + '`');

        }

        return result;
    };

    var formatStatementList = function(body, level) {
        var result = '';
        each(body, function(statement) {
            result += NL + formatStatement(statement, level);
        });
        return result;
    };

    var formatStatement = function(statement, level) {
        var result = '';
        var statementType = statement.type;

        if (statementType == 'AssignmentStatement') {

            // left-hand side
            each(statement.variables, function(variable, needsComma) {
                result += tabs(level) + formatExpression(variable);
                if (needsComma) {
                    result += ', ';
                }
            });

            // right-hand side
            result += ' = ';
            each(statement.init, function(init, needsComma) {
                result += formatExpression(init);
                if (needsComma) {
                    result += ', ';
                }
            });

        } else if (statementType == 'LocalStatement') {

            result = tabs(level) + 'local ';

            // left-hand side
            each(statement.variables, function(variable, needsComma) {
                // Variables in a `LocalStatement` are always local, duh
                result += generateIdentifier(variable.name);
                if (needsComma) {
                    result += ', ';
                }
            });

            // right-hand side
            if (statement.init.length) {
                result += ' = ';
                each(statement.init, function(init, needsComma) {
                    result += formatExpression(init);
                    if (needsComma) {
                        result += ', ';
                    }
                });
            }

        } else if (statementType == 'CallStatement') {

            result = tabs(level) + formatExpression(statement.expression);

        } else if (statementType == 'IfStatement') {

            result = tabs(level) + 'if ' + formatExpression(statement.clauses[0].condition)
            result += ' then'
            result += formatStatementList(statement.clauses[0].body, level+1)

            each(statement.clauses.slice(1), function(clause) {
                if (clause.condition) {
                    result += NL + tabs(level) + 'elseif'
                    result += NL + formatExpression(clause.condition, level+1)
                    result += NL + tabs(level) + 'then'
                } else {
                    result += tabs(level) + 'else'
                }
                result += formatStatementList(clause.body)
            });
            result += NL + tabs(level) + 'end'

        } else if (statementType == 'WhileStatement') {

            result += tabs(level) + 'while ' + formatExpression(statement.condition)
            result += ' do'
            result += formatStatementList(statement.body, level+1)
            result += tabs(level) + 'end'

        } else if (statementType == 'DoStatement') {

            result += ' do'
            result += formatStatementList(statement.body, level+1)
            result += tabs(level) + 'end'

        } else if (statementType == 'ReturnStatement') {

            result = tabs(level) + 'return';

            if(statement.arguments instanceof Array && statement.arguments.length > 0){
                result += ' '
            }

            each(statement.arguments, function(argument, needsComma) {
                result += formatExpression(argument)
                if (needsComma) {
                    result += ', ';
                }
            });

        } else if (statementType == 'BreakStatement') {

            result = tabs(level) + 'break';

        } else if (statementType == 'RepeatStatement') {

            result = tabs(level) + 'repeat ' + formatStatementList(statement.body)
            result += ' until'
            result += formatExpression(statement.condition)

        } else if (statementType == 'FunctionDeclaration') {

            result = tabs(level) + (statement.isLocal ? 'local ' : '') + 'function ';
            result += formatExpression(statement.identifier);
            result += '(';

            if (statement.parameters.length) {
                each(statement.parameters, function(parameter, needsComma) {
                    // `Identifier`s have a `name`, `VarargLiteral`s have a `value`
                    result += parameter.name
                        ? generateIdentifier(parameter.name)
                        : parameter.value;
                    if (needsComma) {
                        result += ',';
                    }
                });
            }

            result += ')';
            result += formatStatementList(statement.body, level+1)
            result += NL + tabs(level) + 'end'

        } else if (statementType == 'ForGenericStatement') {
            // see also `ForNumericStatement`

            result = tabs(level) + 'for ';

            each(statement.variables, function(variable, needsComma) {
                // The variables in a `ForGenericStatement` are always local
                result += generateIdentifier(variable.name);
                if (needsComma) {
                    result += ', ';
                }
            });

            result += ' in ';

            each(statement.iterators, function(iterator, needsComma) {
                result += formatExpression(iterator)
                if (needsComma) {
                    result += ', ';
                }
            });

            result += ' do'
            result += formatStatementList(statement.body, level+1)
            result += NL + tabs(level) + 'end'

        } else if (statementType == 'ForNumericStatement') {

            // The variables in a `ForNumericStatement` are always local
            result = tabs(level) + 'for ' + generateIdentifier(statement.variable.name) + '=';
            result += formatExpression(statement.start) + ', ' +
                formatExpression(statement.end);

            if (statement.step) {
                result += ', ' + formatExpression(statement.step);
            }

            result += ' do'
            result += formatStatementList(statement.body, level+1)
            result += NL + tabs(level) + 'end'

        } else if (statementType == 'LabelStatement') {

            // The identifier names in a `LabelStatement` can safely be renamed
            result = tabs(level) + '::' + generateIdentifier(statement.label.name) + '::';

        } else if (statementType == 'GotoStatement') {

            // The identifier names in a `GotoStatement` can safely be renamed
            result = tabs(level) + 'goto ' + generateIdentifier(statement.label.name);

        } else {

            throw TypeError('Unknown statement type: `' + statementType + '`');

        }

        return result;
    };

    var maxify = function(argument, _idMap, _libIdMap) {
        // `argument` can be a Lua code snippet (string)
        // or a luaparse-compatible AST (object)
        var ast = typeof argument == 'string'
            ? parse(argument)
            : argument;

        idMap = _idMap || {}
        libIdMap = _libIdMap || {}

        console.log('luamax.maxify(', idMap, libIdMap)

        return formatStatementList(ast.body, 0);
    };

    /*--------------------------------------------------------------------------*/

    var luamax = {
        'version': '1.0.1',
        'maxify': maxify
    };

    // Some AMD build optimizers, like r.js, check for specific condition patterns
    // like the following:
    if (
        typeof define == 'function' &&
        typeof define.amd == 'object' &&
        define.amd
    ) {
        define(function() {
            return luamax;
        });
    }   else if (freeExports && !freeExports.nodeType) {
        if (freeModule) { // in Node.js or RingoJS v0.8.0+
            freeModule.exports = luamax;
        } else { // in Narwhal or RingoJS v0.7.0-
            extend(freeExports, luamax);
        }
    } else { // in Rhino or a web browser
        root.luamax = luamax;
    }

}(this));

;
MINMAX = (()=>{
    "use strict";

    const IDENTIFIERS_NOT_ALLOWED_TO_MINIFY = ['onTick', 'onDraw', 'httpReply']

    let libraryIdentifiers = []

    const MINIFY_MAPPING_SEPERATOR = '--yyy--'

    let shortenedIdentifiers = []


    LOADER.on(LOADER.EVENT.DOCUMENTATION_READY, init)

    function init(){
        $('#minify').on('click', minify)

        $('#minify-help').on('click', ()=>{
            UTIL.message('Minify Help', 'You can use two different modes:<br><ul>'
                + '<li><strong>Conservative</strong><br>will only replace names of <i>local</i> declared variables and functions</li><br>'
                + '<li><strong>Agressive</strong><br>will replace almost every varable and function name.<br><span style="color: red;font-weight: bold">In rare cases, this produces errors, which you have to fix manually.</span></li>'
                + '</ul><br>Each of those modes supports output with or without line breaks.<br>Without line breaks you save a small amount of characters, but the code is very hard to read and debug')
        })

    
        $('#unminify').on('click', unminify)

        LOADER.done(LOADER.EVENT.MINMAX_READY)
    }

    function refresh(){
        libraryIdentifiers = []

        addChildrenToLibraryIdentifiers(DOCUMENTATION.getParsed())

        function addChildrenToLibraryIdentifiers(node){
            if(node.children){
                for(let k of Object.keys(node.children)){
                    libraryIdentifiers.push(k)
                    addChildrenToLibraryIdentifiers(node.children[k])
                }
            }
        }
    }

    function minify(){
        shortenedIdentifiers = []
        REPORTER.report(REPORTER.REPORT_TYPE_IDS.minify)

        try {

            let minified

            if($('#minify-type').val() === 'conservative-with-line-breaks' || $('#minify-type').val() === 'conservative-no-line-breaks'){
                let ast = luaparse.parse(EDITORS.get('normal').editor.getValue())

                minified = luamin.minify(ast).trim()
            } else {

                let ast = luaparse.parse(EDITORS.get('normal').editor.getValue())

                minified = luaminy.minify(ast).trim()


                let pre = ''
                let idMap = luaminy.getLastIdentifierMap()
                for(let k of Object.keys(idMap)){
                    if(libraryIdentifiers.indexOf(k) >= 0){
                        pre += idMap[k] + '=' + k + ';'
                    }
                }


                let libIdMap = luaminy.getLastLibIdentifierMap()
                for(let k of Object.keys(libIdMap)){
                    for(let kk of Object.keys(libIdMap[k])){
                        pre += idMap[k] + '.' + libIdMap[k][kk] + '=' + idMap[k] + '.' + kk + ';'                    
                    }
                }

                minified = pre + '\n' + MINIFY_MAPPING_SEPERATOR + '\n' + minified



                let offset = 0
                while(offset < minified.length) {
                    let localStatement = minified.substring(offset, Math.min(minified.indexOf(' ', offset), minified.indexOf(';', offset)) + 1)
                    let match = localStatement.match(/(local\s)?([\w]+)=([\w]+)(;|\s)/)
                    if(match){
                        let short = match[2]
                        let shortenedGlobal = match[3]

                        for(let s of shortenedIdentifiers){
                            if(identifierMap[s] === shortenedGlobal){
                                minified = minified.replace(localStatement, localStatement.replace(shortenedGlobal, s))
                                break
                            }
                        }
                    }
                    if(localStatement.length === 0){
                        break
                    }

                    offset += localStatement.length
                }
            }

            if($('#minify-type').val() === 'conservative-with-line-breaks' || $('#minify-type').val() === 'agressive-with-line-breaks'){
                let lineBreakMinified = ''
                let i = 0
                let inText= false
                let lastType
                while (i < minified.length){
                    let indexOf
                    let type

                    if(inText){
                        if(lastType === 'single' ){
                            indexOf = minified.indexOf("'", i)
                        } else if (lastType === 'double'){
                            indexOf = minified.indexOf('"', i)
                        }
                        type = lastType
                    } else {
                        let indexOfSingleQuote = minified.indexOf("'", i)
                        let indexOfDoubleQuote = minified.indexOf('"', i)

                        type = (indexOfSingleQuote > 0 && indexOfSingleQuote < indexOfDoubleQuote) ? 'single' : 'double'
                        indexOf = type == 'single' ? indexOfSingleQuote : indexOfDoubleQuote
                    }

                    if(indexOf < 0){// no more quotes found
                        lineBreakMinified += '\n' + ident(minified.substring(i))
                        break
                    } else {//found a quote
                        if(inText){
                            let tmp = (type == 'single' ? "'" : '"') + minified.substring(i, indexOf)
                            lineBreakMinified += tmp
                        } else {
                            lineBreakMinified += '\n' + ident(minified.substring(i, indexOf))
                        }

                        if(inText){
                            let char = minified.charAt(indexOf)
                            if(char != '\\'){// check for \" and \'
                                inText = false
                            }
                            lineBreakMinified += (type == 'single' ? "'" : '"')
                        } else {
                            inText = true
                        }

                        i = indexOf + 1
                    }

                    lastType = type
                }
                minified = lineBreakMinified

                function ident(text){
                    const replacements = [
                        [/;/g, '\n'],
                        [/\(\)/g, '()\n'],
                        [/([\w\.]+)=([\w\.]+)[;\s]/g, '$1=$2\n'],
                        [/\)([\w]+)=/g, ')\n$1='],
                        [/\)([\w\.]+)\(/g, ')\n$1('],
                        [/\}([\w\.]+[;\s=])/g, '}\n$1']
                    ]

                    for(let k of ['if', 'end', 'elseif', 'for', 'while', 'goto', 'break', 'continue', 'return', 'function', 'local']){
                        replacements.push([new RegExp('([\\s\\);])'+k+'([\\s\\(;])', 'g'), '$1\n' + k + '$2'])
                    }
                    for(let k of ['then', 'end', 'do']){
                        replacements.push([new RegExp(k+'([\\s;])', 'g'), k + '\n'])
                    }


                    let ret = text

                    for(let r of replacements){
                        ret = ret.replace(r[0], r[1])
                    }

                    return ret.replace(/[\n]{2,}/g, '\n').replace(/end\nfunction/g, 'end\n\nfunction')
                }
            }

            EDITORS.get('minified').editor.setValue(minified, -1)
        } catch (ex){
            UI.viewables()['viewable_editor_minified'].focusSelf()
            console.trace(ex)
            EDITORS.get('minified').editor.setValue('Error: ' + ex.message, -1)
        }

        let viewable = UI.viewables()['viewable_editor_minified'].focusSelf()
    }

    function unminify(){
        REPORTER.report(REPORTER.REPORT_TYPE_IDS.unminify)

        let minified = EDITORS.get('minified').editor.getValue()

        if(typeof minified !== 'string' || minified.length == 0){
            fail('empty')
            return
        }

        let split = minified.split(MINIFY_MAPPING_SEPERATOR)
        let mapping = split[0]
        let code = split[1]

        let unminified = ''


        if(split.length < 2){
            mapping = ''
            code = split[0]
        }
        if(split.length > 2){
            fail('multiple "'+MINIFY_MAPPING_SEPERATOR+'" found')
            return
        }
        if(code == ''){
            fail('code not found')
            return
        }

        if(!mapping || mapping == ''){
            unminified += '-- warning: mapping not found --\n'
        }

        let mapAST = luaparse.parse(mapping)

        let idMap = {}
        let libIdMap = {}
        console.log(mapAST)

        for(let o of mapAST.body){
            let originalName
            if(o.init[0].type == "Identifier"){
                originalName = o.init[0].name
            } else if(o.init[0].type == "MemberExpression"){
                originalName = o.init[0].identifier.name
            }

            if(o.variables[0].type == "Identifier"){
                idMap[o.variables[0].name] = originalName
            } else if(o.variables[0].type == "MemberExpression"){
                if(!libIdMap[o.variables[0].base.name]){
                    libIdMap[o.variables[0].base.name] = {}
                }
                libIdMap[o.variables[0].base.name][o.variables[0].identifier.name] = originalName
            }
        }

        unminified += luamax.maxify(code, idMap, libIdMap)


        EDITORS.get('unminified').editor.setValue(unminified, -1)

        let viewable = UI.viewables()['viewable_editor_unminified'].focusSelf()


        function fail(msg){
            
            let viewable = UI.viewables()['viewable_editor_unminified'].focusSelf()

            EDITORS.get('unminified').editor.setValue('Unminification failed:\n' + msg, -1)
        }

    }

    function isMinificationAllowed(keyword, /* optional */ library){
        if(library){
            let acs = DOCUMENTATION.getParsed()
            return acs && acs.children[library] && acs.children[library].children && acs.children[library].children[keyword]
        } else {
            return IDENTIFIERS_NOT_ALLOWED_TO_MINIFY.indexOf(keyword) === -1
        }
    }


    return {
        isMinificationAllowed: isMinificationAllowed,
        refresh: refresh
    }
})()
;
HELP = (($)=>{
    "use strict";

    let firstOpen = true

    let helpContainer

    LOADER.on(LOADER.EVENT.PAGE_READY, init)

    function init(){
        $('body').find('#help-button').on('click', (evt)=>{
            evt.originalEvent.stopPropagation()
            openHelp()
        })



        $(window).on('click', (evt)=>{
            if(helpContainer.hasClass('open')){
                if($(evt.originalEvent.target).closest('#help-container .inner').length == 0){
                    closeHelp()
                }
            }
        })

        helpContainer = $('body').find('#help-container')


        helpContainer.find('.close').on('click', closeHelp)
    }

    function openHelp(){
        if(firstOpen){
            firstOpen = false
            
            REPORTER.report(REPORTER.REPORT_TYPE_IDS.openHelp)

            // add youtube video
            helpContainer.find('[youtube-embed]').each((i, el)=>{
                let id = $(el).attr('youtube-embed')
                if(typeof id === 'string' && id.trim() !== ''){
                    $(el).append(
                        $('<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/' + id +'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>')
                    )
                }
            })
        }

        setTimeout(()=>{
            helpContainer.find('.inner').find('[youtube-embed]').each((i, el)=>{  
                let $el = $(el)

                let ratio = $el.find('iframe').attr('width') / $el.find('iframe').attr('height')
                console.log(ratio, $el.width())
                $el.height($el.width() / ratio)
            })
        }, 100)

        helpContainer.addClass('open')
    }

    function closeHelp(){
        helpContainer.removeClass('open')
    }

    return {
    }


})(jQuery)

;
var GIVEAWAY = (($)=>{
  "use strict";

    let currentGiveaway

    LOADER.on(LOADER.EVENT.PAGE_READY, init)

    function init(){
        $('#giveaway-container').find('.send').on('click', giveawaySend)
        $('#giveaway-container').find('.cancel, .close').on('click', ()=>{
            $('#giveaway-container').fadeOut()
        })
        $('#giveaway-container').find('.reload').on('click', ()=>{
            document.location.reload()
        })

        $.getJSON('/api/has-giveaway').done((data)=>{
            if(data.giveaway && data.giveaway.id && data.giveaway.message){
                currentGiveaway = data.giveaway
                $('#giveaway-container').find('.message').html(data.giveaway.message)

                $('#giveaway-container').fadeIn()
            }
        })

        LOADER.done(LOADER.EVENT.GIVEAWAY_READY)
    }

    function giveawaySend(){
        try {
            if(!currentGiveaway){
                throw new Error('currentGiveaway is not defined')
            }
            let claimed_by = $('#giveaway-container').find('.claimed_by').val()
            if(typeof claimed_by !== 'string' || claimed_by.length === 0){
                $('#giveaway-container').find('.error').html('Please enter your discord tag id or your email.').show()
            } else {
                $('#giveaway-container').find('.cancel, .send').hide()
                $('#giveaway-container').find('.error').hide()
                $('#giveaway-container').find('.progress').show()
                $.post('/api/claim-giveaway', {
                    id: currentGiveaway.id,
                    claimed_by: claimed_by
                }).done(()=>{
                    $('#giveaway-container').find('.progress').hide()
                    $('#giveaway-container').find('.success').show()
                    $('#giveaway-container').find('.close').show()
                }).fail(()=>{
                    $('#giveaway-container').find('.progress').hide()
                    $('#giveaway-container').find('.error').html('could not claim giveaway, please reload the page.').show()
                    $('#giveaway-container').find('.reload, .close').show()
                })
            }
        } catch (ex){
            console.error(ex)
            $('#giveaway-container').find('.progress, .success, .cancel, .send').hide()
            $('#giveaway-container').find('.reload, .close').show()
            $('#giveaway-container').find('.error').html('could not claim giveaway, please reload the page.').show()            
        }
    }
})(jQuery)

;
var LUA_EMULATOR = (($)=>{
    
    const DO_LOG = false

    let supportedFunctions = {}
    let namespaces = {}

    let l = fengari.L

    let fresh = true

    let isInTick = false
    let isInDraw = false

    let timer

    let stepCount = 0

    LOADER.on(LOADER.EVENT.PAGE_READY, init)

    let loaderNotified = false

    function init(){
        makeFunctionAvailableInLua(print)
        makeFunctionAvailableInLua(printColor)
        makeFunctionAvailableInLuaViaName(timeStart, 'start', 'timer')
        makeFunctionAvailableInLuaViaName(timeStop, 'stop', 'timer')

        makeFunctionAvailableInLua(function pause(){
            ENGINE.pauseScript()
        })


        /* remove unsupported libraries */
        for(let n of ["assert","collectgarbage","fengari","js","dofile","error","_G","getmetatable","load","loadfile","pcall","rawequal","rawget","rawlen","rawset","select","setmetatable","_VERSION","xpcall",
            "coroutine","require","package","utf8","io","os","debug"]){
            deleteGlobalVariable(n)
        }

        STORMWORKS_LUA_API.init()

        if(! loaderNotified){
            loaderNotified = true
            LOADER.done(LOADER.EVENT.LUA_EMULATOR_READY)
        }
    }

    let print = function(){
        let args = []
        let i = 0
        while(arguments[i] !== undefined){
            args.push(arguments[i])
            i++
        }
        console.log.apply(console, ['LUA output:'].concat(args))
        let text = ''
        for(let arg of args){
            text += luaToString(arg, 3) + ' '
        }
        CONSOLE.print(text)
    }

    let printColor = function(r,g,b){
        CONSOLE.setPrintColor(r,g,b)
    }

    let timeStart = function(){
        timer = performance.now()
        CONSOLE.print('timer started', CONSOLE.COLOR.SPECIAL)
    }   

    let timeStop = function(label){
        let time = typeof timer !== 'number' ? 0 : (performance.now() - timer)
        let ms = '' + time % 1000
        while(ms.length < 4){
            ms = '0' + ms
        }
        let s = (time-ms)/1000 % 60
        let m = (time-ms-s*1000)/1000/60
        timer = false
        CONSOLE.print('timer stopped (min:sec:milsec) = ' + m + ':' + (s < 10 ? '0'+s : s) + ':' + ms, CONSOLE.COLOR.SPECIAL)
    }   

    function createNamespace(name){    
        fengari.lua.lua_newtable(l)
        fengari.lua.lua_setglobal(l, name)
        namespaces[name] = true
        supportedFunctions[name] = {}
        log('created namespace', name)
    }

    function makeFunctionAvailableInLua(func, namespace){
        if(typeof func !== 'function'){
            throw new Error('passed variable is not a function!')
        }
        makeFunctionAvailableInLuaViaName(func, func.name, namespace)
    }

    function makeFunctionAvailableInLuaViaName(func, name, namespace){
        if(typeof func !== 'function'){
            throw new Error('passed variable is not a function!')
        }
        fengari.lua.lua_settop(l, 0)
        const callback = func
        let middleware = function(ll){
            let args = extractArgumentsFromStack(ll.stack, 'middleware')
            let ret =  callback.apply(null, convertArguments(args))
            if(ret === undefined || ret === null){
                let retlen = pushToStack(ll, null)
                return retlen
            } else if(ret.emulatorUnpack){
                let retlen = 0
                for(let k of Object.keys(ret)){
                    if(k !== 'emulatorUnpack'){
                        pushToStack(ll, ret[k])
                        retlen++
                    }
                }
                return retlen
            } else {
                let retlen = pushToStack(ll, ret)
                return retlen
            }
        }
        middleware.toString = ()=>{
            return 'emulated function()'//callback.toString()
        }
        if(typeof namespace === 'string'){
            if(! namespaces[namespace]){
                createNamespace(namespace)
            }
            fengari.lua.lua_getglobal(l, namespace)
            pushToStack(l, name)
            pushToStack(l, middleware)
            fengari.lua.lua_settable(l, l.top-3)
            fengari.lua.lua_settop(l, 0)
            supportedFunctions[namespace][name] = true
        } else {
            fengari.lua.lua_pushjsfunction(l, middleware)   
            fengari.lua.lua_setglobal(l, name)
            fengari.lua.lua_settop(l, 0)
            supportedFunctions[name] = true
        }
        log('registered function', namespace ? namespace + '.' + name : name)
    }

    function getGlobalVariable(name){
        fengari.lua.lua_settop(l, 0)
        fengari.lua.lua_getglobal(l, name)
        let res = l.stack[l.top-1]
        fengari.lua.lua_settop(l, 1)
        return convertLuaValue(res)
    }

    function deleteGlobalVariable(name){        
        fengari.lua.lua_settop(l, 0)
        fengari.lua.lua_pushnil(l)
        fengari.lua.lua_setglobal(l, name)
        fengari.lua.lua_settop(l, 0)
    }

    function callLuaFunction(name, args){
        if(typeof name !== 'string'){
            throw new Error('passed variable is not a string!')
        }
        fengari.lua.lua_settop(l, 0)
        fengari.lua.lua_getglobal(l, name)

        if(args instanceof Array === false){
            if (fengari.lua.lua_pcall(l, 0, 0, 0) != 0){
                bluescreenError(l, 'error running function `' + name + '`:', fengari.lua.lua_tostring(l, -1))
            }
        } else {
            for(let a of args){
                pushToStack(l, a)
            }
            if (fengari.lua.lua_pcall(l, args.length, 0, 0) != 0){
                bluescreenError(l, 'error running function `' + name + '`:', fengari.lua.lua_tostring(l, -1))
            }
        }
        fengari.lua.lua_settop(l, 0)
    }

    function extractArgumentsFromStack(stack, func_name){
        let args = []
        let argsBegin = false
        for(let k of Object.keys(stack).reverse()){
            let s = stack[k]
            if(typeof s === 'object' && s.type === 22 && s.value.name === func_name){
                argsBegin = true
            }
            if(!argsBegin && s !== undefined){
                args.push(s)
            }
        }
        return args.reverse()
    }

    function convertArguments(args){
        let argsConverted = {}
        let promises = []
        for(let a in args){
            argsConverted[a] = convertLuaValue(args[a])
        }
        let argArray = []
        for(let k of Object.keys(argsConverted)){
            argArray.push(argsConverted[k])
        }
        return argArray
    }

    function convertLuaValue(value){
        if(!value){
            return undefined
        }
        switch(value.type){
            case 5: {//table
                return luaTableToJSObject(value.value)
            }
            case 6: {//function
                return new Function()
            }
            case 19: {//number
                return value.value
            }
            case 7: {//TypeError
                return value.value.data.data
            }
            case 20: {//string
                return arrayBufferToString(value.value.realstring)
            }
            default: {
                return value.value
            }
        }
    }

    function luaTableToJSObject(table){
        let ret = {}
        if(table.f instanceof Object){
            let current = table.f
            ret[convertLuaValue(current.key)] = convertLuaValue(current.value)
            while(current.n instanceof Object && current.n !== null){
                current = current.n
                ret[convertLuaValue(current.key)] = convertLuaValue(current.value)
            }
            return ret
        } else {
            return {}
        }
    }

    function arrayBufferToString(buf) {
        return new TextDecoder("utf-8").decode(new Uint8Array(buf));
    }

    function pushToStack(l, ob){
        if(typeof ob === 'number'){
            fengari.lua.lua_pushnumber(l, ob)
            return 1;
        } else if (typeof ob === 'string'){
            fengari.lua.lua_pushliteral(l, ob)
            return 1;
        } else if (typeof ob === 'function'){
            fengari.lua.lua_pushjsfunction(l, ob) 
            return 1
        } else if (typeof ob === 'boolean'){
            fengari.lua.lua_pushboolean(l, ob)
            return 1
        } else if (ob === null){
            fengari.lua.lua_pushnil(l)
            return 1
        } else if (ob instanceof Array){
            fengari.lua.lua_createtable(l)
            for(let i in ob){
                pushToStack(l, parseInt(i)+1)
                pushToStack(l, ob[i])
                fengari.lua.lua_settable(l, -3)
            }
            return 1
        } else if (ob instanceof Object){
            fengari.lua.lua_createtable(l)
            for(let k of Object.keys(ob)){
                pushToStack(l, k)
                pushToStack(l, ob[k])
                fengari.lua.lua_settable(l, -3)
            }
            return 1;
        } else {
            throw new Error('return type ' + (typeof ob) + ' not supported!')
        }
    }

    function luaToString(ob, depth){//can we instead use fengari.lua.lua_tostring ???
        if(typeof ob === 'number'){
            return ob.toString()
        } else if(typeof ob === 'string'){
            return ob
        } else if(ob instanceof Uint8Array){
           return arrayBufferToString(ob)
        } else if(ob instanceof Object){
            let onlyNumberKeys = true
            for(let k of Object.keys(ob)){
                if(isNaN(parseInt(k))){
                    onlyNumberKeys = false
                }
            }     
            if(onlyNumberKeys){
                if(Object.keys(ob).length === 0){
                    return '{}'
                }
                let str = '{'
                for(let k of Object.keys(ob)){
                    str += luaToString(ob[k], depth ? depth - 1 : 0) + ', '
                }
                return str.substring(0, str.length-2) + '}'
            } else {
                let clean = {}
                for(let k of Object.keys(ob)){
                    clean[k] = depth && depth > 0 ? luaToString(ob[k], depth - 1) : ob[k].toString()//TODO this is not correct! but if not doing this we got infitine recursion (cycling)
                }
                return JSON.stringify(clean, null, " ").replace(/\n/g, '').replace(/\s\s/g, ' ').replace(/\\"/g, '"')
            }      
        } else if (ob === null) {
            return 'nil'
        } else if (ob === undefined) {
            return 'nil'
        } else {
            return ob.toString()
        }
    }

    function log(){
        if(!DO_LOG){
            return
        }
        let args = []
        for(let a of arguments.callee.caller.arguments){
            args.push(a)
        }
        console.log.apply(console, ['LUA_EMULATOR.' + arguments.callee.caller.name + '()'].concat(args))

        let myargs = []
        for(let a of arguments){
            myargs.push(a)
        }
        if(myargs.length > 0){
            console.log.apply(console, myargs)
        }
    }

    function bluescreenError(l, message, luaObject){
        ENGINE.errorStop()

        let err = luaToString(luaObject)

        let match = err.match(/^[^\:]*\:([\d]*)\:(.*)$/)
        if(match && match[1]){
            let line = parseInt(match[1])
            if(!isNaN(line)){
                EDITORS.getActiveEditor().markError(line, err)
            }
        }


        console.error('LUA_EMULATOR.bluescreenError()', message, err, convertLuaValue(l.stack[l.top-1]))
        CONSOLE.print(message + ' ' + err, CONSOLE.COLOR.ERROR)
        setTimeout(()=>{
            console.log('paint bluescreen error')
            PAINT.setColor(0,0,255, 255)
            PAINT.drawRectF(0,0,CANVAS.width(), CANVAS.height())
            PAINT.setColor(255,255,255, 255)
            PAINT.drawTextBox(2, 2, CANVAS.width(), CANVAS.height(), message + luaToString(luaObject), -1, -1)
        }, 500)
    }

    function reset(){
        return new Promise((fulfill, reject)=>{
            console.log('reseting lua vm...')
            supportedFunctions = {}
            namespaces = {}
            fresh = false

            CONSOLE.reset()

            stepCount = 0
            
            try {       
                l = fengari.lauxlib.luaL_newstate()
                fengari.lua.lua_settop(l, 0)

                /* open standard libraries */
                fengari.lualib.luaL_openlibs(l);
                fengari.lauxlib.luaL_requiref(l, fengari.to_luastring("js"), fengari.interop.luaopen_js, 1);
                fengari.lua.lua_pop(l, 1); /* remove lib */

                init()

                fresh = true
                fulfill() 
                console.log('reseted lua vm', LUA_EMULATOR.getGlobalVariable('screen'))
            } catch (err){
                console.error('error reseting lua vm', err)
                UTIL.alert('Cannot reset the Lua VM, please reload the page and tell me about this bug!')
                fresh = true
                fulfill()
            }
        })
    }

    function tick(){
        isInTick = true
        if(typeof getGlobalVariable('onTick') === 'function'){
          callLuaFunction('onTick')
        }
        isInTick = false
    }

    function draw(){
        isInDraw = true      
        if(typeof getGlobalVariable('onDraw') === 'function'){
          callLuaFunction('onDraw')
        }
        isInDraw = false
    }

    return {
        supportedFunctions: ()=>{return supportedFunctions},
        bluescreenError: bluescreenError,
        makeFunctionAvailableInLua: makeFunctionAvailableInLua,
        makeFunctionAvailableInLuaViaName: makeFunctionAvailableInLuaViaName,
        callLuaFunction: callLuaFunction,
        getGlobalVariable: getGlobalVariable,
        luaToString: luaToString,
        reset: reset,
        l: ()=>{return l},
        tick: tick,
        draw: draw,
        isInTick: ()=>{return isInTick},
        isInDraw: ()=>{return isInDraw},
        notifyPaused: ()=>{
            CONSOLE.print('-- paused script', CONSOLE.COLOR.DEBUG)
        },
        notifyUnPaused: ()=>{
            CONSOLE.print('-- resumed script', CONSOLE.COLOR.DEBUG)
        },
        notifyStep: ()=>{
            stepCount++
            CONSOLE.print('-- step forward #' + stepCount, CONSOLE.COLOR.DEBUG)
        }
    }
})(jQuery)


;
STORMWORKS_LUA_API = (($)=>{
  "use strict";


    let loaderNotified = false

    function init(){
        setScreenFunctions()
        setMapFunctions()
        setInputFunctions()
        setDevInputFunctions()
        setOutputFunctions()
        setPropertyFunctions()
        setHTTPFunctions()


        if(! loaderNotified){
            loaderNotified = true
            LOADER.done(LOADER.EVENT.STORMWORKS_LUA_API_READY)
        }        
    }


    function setScreenFunctions(){

        function getWidth(){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            return CANVAS.width()
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getWidth, 'screen')

        function getHeight(){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            return CANVAS.height()
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getHeight, 'screen')

        function setColor(r, g, b, a){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof r !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof g !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof b !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(a !== undefined && a !== null && typeof a !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 4, 'expected number or nil or undefined')
                return
            }
            if(a === null){
                a = 0
            } else if (typeof a !== 'number'){
                a=255
            }
            PAINT.setColor(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setColor, 'screen')

        function drawClear(){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            PAINT.drawClear()
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawClear, 'screen')

        function drawLine(x1, y1, x2, y2){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x1 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y1 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof x2 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof y2 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 4, 'expected number')
                return
            }
            PAINT.drawLine(x1, y1, x2, y2)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawLine, 'screen')

        function drawCircle(x, y, r){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof r !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            PAINT.drawCircle(x, y, r)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawCircle, 'screen')

        function drawCircleF(x, y, r){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof r !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            PAINT.drawCircleF(x, y, r)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawCircleF, 'screen')

        function drawRect(x, y, w, h){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof w !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof h !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 4, 'expected number')
                return
            }
            PAINT.drawRect(x, y, w, h)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawRect, 'screen')

        function drawRectF(x, y, w, h){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof w !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof h !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 4, 'expected number')
                return
            }
            PAINT.drawRectF(x, y, w, h)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawRectF, 'screen')

        function drawTriangle(x1, y1, x2, y2, x3, y3){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x1 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y1 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof x2 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof y2 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 4, 'expected number')
                return
            }
            if(typeof x3 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 5, 'expected number')
                return
            }
            if(typeof y3 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 6, 'expected number')
                return
            }
            PAINT.drawTriangle(x1, y1, x2, y2, x3, y3)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawTriangle, 'screen')

        function drawTriangleF(x1, y1, x2, y2, x3, y3){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x1 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y1 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof x2 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof y2 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 4, 'expected number')
                return
            }
            if(typeof x3 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 5, 'expected number')
                return
            }
            if(typeof y3 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 6, 'expected number')
                return
            }
            PAINT.drawTriangleF(x1, y1, x2, y2, x3, y3)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawTriangleF, 'screen')

        function drawText(x, y, text){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof text === 'number'){
                text = '' + text
            }
            if(typeof text !== 'string'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected string')
                return
            }
            PAINT.drawText(x, y, text)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawText, 'screen')

        function drawTextBox(x, y, w, h, text, h_align, v_align){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof w !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof h !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 4, 'expected number')
                return
            }
            if(typeof text === 'number'){
                text = '' + text
            }
            if(typeof text !== 'string'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 5, 'expected string')
                return
            }
            if(h_align !== undefined && h_align !== null && typeof h_align !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 6, 'expected number or nil or undefined')
                return
            }
            if(v_align !== undefined && v_align !== null && typeof v_align !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 7, 'expected number or nil or undefined')
                return
            }
            if(typeof h_align !== 'number'){
                h_align = -1
            }
            if(typeof v_align !== 'number'){
                v_align = -1
            }
            PAINT.drawTextBox(x, y, w, h, text, h_align, v_align)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawTextBox, 'screen')


        /* screen (map related) */
        function drawMap(x, y, zoom){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof zoom !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            MAP.drawMap(x, y, Math.max(0.1, Math.min(50,zoom)))
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawMap, 'screen')

        function setMapColorOcean(r, g, b, a){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof r !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof g !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof b !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof a !== 'number'){
                a = 255
            }
            MAP.setMapColorOcean(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setMapColorOcean, 'screen')

        function setMapColorShallows(r, g, b, a){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof r !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof g !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof b !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof a !== 'number'){
                a = 255
            }
            MAP.setMapColorShallows(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setMapColorShallows, 'screen')

        function setMapColorLand(r, g, b, a){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof r !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof g !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof b !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof a !== 'number'){
                a = 255
            }
            MAP.setMapColorLand(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setMapColorLand, 'screen')

        function setMapColorGrass(r, g, b, a){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof r !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof g !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof b !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof a !== 'number'){
                a = 255
            }
            MAP.setMapColorGrass(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setMapColorGrass, 'screen')

        function setMapColorSand(r, g, b, a){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof r !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof g !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof b !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof a !== 'number'){
                a = 255
            }
            MAP.setMapColorSand(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setMapColorSand, 'screen')

        function setMapColorSnow(r, g, b, a){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof r !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof g !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof b !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof a !== 'number'){
                a = 255
            }
            MAP.setMapColorSnow(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setMapColorSnow, 'screen')
    }

    function setMapFunctions(){

        //worldX, worldY = map.screenToMap(mapX, mapY, zoom, screenW, screenH, pixelX, pixelY)
        function screenToMap(mapX, mapY, zoom, screenW, screenH, pixelX, pixelY){
            if(typeof mapX !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof mapY !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof zoom !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof screenW !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 4, 'expected number')
                return
            }
            if(typeof screenH !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 5, 'expected number')
                return
            }
            if(typeof pixelX !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 6, 'expected number')
                return
            }
            if(typeof pixelY !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 7, 'expected number')
                return
            }
            return MAP.screenToMap(mapX, mapY, zoom, screenW, screenH, pixelX, pixelY)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(screenToMap, 'map')

        //pixelX, pixelY = map.mapToScreen(mapX, mapY, zoom, screenW, screenH, worldX, worldY)
        function mapToScreen(mapX, mapY, zoom, screenW, screenH, worldX, worldY){
            if(typeof mapX !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof mapY !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof zoom !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof screenW !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 4, 'expected number')
                return
            }
            if(typeof screenH !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 5, 'expected number')
                return
            }
            if(typeof worldX !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 6, 'expected number')
                return
            }
            if(typeof worldY !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 7, 'expected number')
                return
            }
            return MAP.mapToScreen(mapX, mapY, zoom, screenW, screenH, worldX, worldY)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(mapToScreen, 'map')
    }

    function setInputFunctions(){

        function getBool(i){
            if(!LUA_EMULATOR.isInTick()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'input can only be called from within onTick()')
                return
            }
            if(typeof i !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            return INPUT.getBool(i)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getBool, 'input')

        function getNumber(i){
            if(!LUA_EMULATOR.isInTick()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'input can only be called from within onTick()')
                return
            }
            if(typeof i !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            return INPUT.getNumber(i)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getNumber, 'input')        
    }

    function setDevInputFunctions(){

        function setBool(i, val){
            if(!LUA_EMULATOR.isInTick()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'devinput can only be called from within onTick()')
                return
            }
            if(typeof i !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof val !== 'boolean'){
                val = false
            }
            INPUT.setBool(i, val)
        }
        LUA_EMULATOR.makeFunctionAvailableInLuaViaName(setBool, 'setBool', 'devinput')

        function setNumber(i, val){
            if(!LUA_EMULATOR.isInTick()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'devinput can only be called from within onTick()')
                return
            }
            if(typeof i !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof val !== 'number'){
                val = 0
            }
            INPUT.setNumber(i, val)
        }
        LUA_EMULATOR.makeFunctionAvailableInLuaViaName(setNumber, 'setNumber', 'devinput')
    }

    function setOutputFunctions(){

        function setBool(i, val){
            if(!LUA_EMULATOR.isInTick()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'output can only be called from within onTick()')
                return
            }
            if(typeof i !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof val !== 'boolean'){
                val =  false
            }
            OUTPUT.setBool(i, val)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setBool, 'output')

        function setNumber(i, val){
            if(!LUA_EMULATOR.isInTick()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'output can only be called from within onTick()')
                return
            }
            if(typeof i !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof val !== 'number'){
                val = 0
            }
            OUTPUT.setNumber(i, val)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setNumber, 'output')
    }

    function setPropertyFunctions(){

        function getBool(label){
            if(typeof label !== 'string'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected string')
                return
            }
            return PROPERTY.getBool(label)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getBool, 'property')

        function getNumber(label){
            if(typeof label !== 'string'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected string')
                return
            }
            return PROPERTY.getNumber(label)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getNumber, 'property')

        function getText(label){
            if(typeof label !== 'string'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected string')
                return
            }
            return PROPERTY.getText(label)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getText, 'property')
    }

    function setHTTPFunctions(){

        function httpGet(port, url){
            if(typeof port !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof url !== 'string'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected string')
                return
            }
            HttpLocalhost.get(port, url)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(httpGet, 'async')

    }

    return {
        init: init
    }
    
})(jQuery)

;
STORAGE = (()=>{
    "use strict";
   
    const VERSION = "1"


    /* configuration might be an empty object, contain parts of a full configuration, or a complete configuration */
    let configuration = {}

    LOADER.on(LOADER.EVENT.PAGE_READY, init)

    let loaderNotified = false

    function init(){
        let y = localStorage.getItem('yyy')
        if(y){
            try {
                let parsed = JSON.parse(y)

                if(parsed.version === VERSION){
                    processStorage(parsed)
                } else {
                    console.info('Storage: found old configuration, updating ...')
                    let updated = updateConfiguration(parsed, parsed.version)
                    processStorage(updated)
                }
            } catch (ex){
                console.warn('Storage: invalid configuration, using default configuration')
                processStorage()
            }
        } else if (localStorage.getItem('general')) {
            console.info('Storage: found outdated configuration, converting ...')
            localStorage.clear()
            let converted = convertOldConfiguration()
            processStorage(converted)
        } else {            
            processStorage()
        }
    }

    /* before v1 */
    function convertOldConfiguration(){
        let general
        try {
            general = JSON.parse( localStorage.getItem('general') )
            if(!general){
                general = {}
            }
        } catch (ex){
            general = {}
        }

        return {
            version: VERSION,
            editors: {
                normal: localStorage.getItem('code'),
                minified: localStorage.getItem('minified-code')
            },
            inputs: {
                bools: localStorage.getItem('input_bools'),
                numbers: localStorage.getItem('input_numbers')
            },
            properties: {
                bools: localStorage.getItem('property_bools'),
                numbers: localStorage.getItem('property_numbers'),
                texts: localStorage.getItem('property_texts'),
            },            
            uibuilder: localStorage.getItem('ui'),
            editorFontSize: localStorage.getItem('editor-font-size'),
            settings: {
                timeBetweenTicks: general.timeBetweenTicks,
                timeBetweenDraws: general.timeBetweenDraws,
                zoomfactor: general.zoomfactor,
                monitorSize: general.monitorSize,
                showOverflow: general.showOverflow,
                touchscreenEnabled: general.touchscreenEnabled,
                touchscreenSecondaryEnabled: undefined,
                layout: undefined
            }
        }
    }

    function updateConfiguration(conf, version){
        switch(version){
            case "1": {
                /* fill this once we get a new version */
            }
        }
    }

    function processStorage(storage){
        configuration = storage
        if(!configuration || configuration instanceof Object === false){
            configuration = {
                version: VERSION
            }
        }

        if(!loaderNotified){
            loaderNotified = true
            LOADER.done(LOADER.EVENT.STORAGE_READY)
        }
    }

    function saveConfiguration(){
        localStorage.setItem('yyy', JSON.stringify(configuration))
    }

    /*
        name can include "." which allows access to nested settings
        e.g. settings.timeBetweenDraws

        value can be a simple type (e.g. number, boolean) or an object
    */
    function setConfiguration(name, value, dontSave){
        if(name === 'version'){
            throw 'field is not writable: "' + name + '"'
        }

        let currentNode = configuration
        let keyParts = name.split('.')
        
        while(keyParts.length > 1){
            keyParts.reverse()
            let kp = keyParts.pop()
            keyParts.reverse()

            if(currentNode.hasOwnProperty(kp)){
                currentNode = currentNode[kp]
            } else {
                currentNode[kp] = {}
            }
        }

        currentNode[keyParts[0]] = value

        if( !dontSave ){
            saveConfiguration()
        }
    }

    /* 
        name can include "." which allows access to nested settings
        e.g. settings.timeBetweenDraws
    */
    function getConfiguration(name){
        let currentNode = configuration
        let keyParts = name.split('.')
        
        while(keyParts.length > 1){
            keyParts.reverse()
            let kp = keyParts.pop()
            keyParts.reverse()

            if(currentNode.hasOwnProperty(kp)){
                currentNode = currentNode[kp]
            } else {
                currentNode[kp] = {}
            }
        }

        return currentNode[keyParts[0]]
    }

    function asString(){
        return localStorage.getItem('yyy')
    }

    function setFromShare(key, confJSON){

        let parsedSettings = parseOrUndefined(confJSON.settings)

        if(parsedSettings && parsedSettings.version){
            if(parsedSettings.version === VERSION){
                processStorage(parsedSettings)
            } else {
                console.info('Storage: found old configuration, updating ...')
                let updated = updateConfiguration(parsedSettings, parsedSettings.version)
                processStorage(updated)
            }
        } else {
            /* old shared information */

            setFromShare(key, {
                settings: JSON.stringify({
                    version: '1',
                    editors: {
                        normal: confJSON.code,
                        minified: confJSON.minified_code || ''
                    },
                    inputs: {
                        bools: parsedSettings && parsedSettings.input ? parsedSettings.input.bools : undefined,
                        numbers: parsedSettings && parsedSettings.input ? parsedSettings.input.numbers : undefined
                    },
                    properties: {
                        bools: parsedSettings && parsedSettings.property ? parsedSettings.property.bools : undefined,
                        numbers: parsedSettings && parsedSettings.property ? parsedSettings.property.numbers : undefined,
                        texts: parsedSettings && parsedSettings.property ? parsedSettings.property.texts : undefined
                    },
                    uibuilder: parseOrUndefined(confJSON.ui_builder),
                    editorFontSize: confJSON['editor-font-size'],
                    settings: {
                        timeBetweenTicks: parsedSettings && parsedSettings.general ? parsedSettings.general.timeBetweenTicks : undefined,
                        timeBetweenDraws: parsedSettings && parsedSettings.general ? parsedSettings.general.timeBetweenDraws : undefined,
                        zoomfactor: parsedSettings && parsedSettings.general ? parsedSettings.general.zoomfactor : undefined,
                        monitorSize: parsedSettings && parsedSettings.general ? parsedSettings.general.monitorSize : undefined,
                        showOverflow: parsedSettings && parsedSettings.general ? parsedSettings.general.showOverflow : undefined,
                        touchscreenEnabled: parsedSettings && parsedSettings.general ? parsedSettings.general.touchscreenEnabled : undefined,
                        touchscreenSecondaryEnabled: undefined,
                        layout: undefined
                    }
                })
            })
        }

        function parseOrUndefined(json){
            try {
                return JSON.parse(json)
            } catch (ex){
                /* ignored */
            }
        }
    }
    
    return {
        setConfiguration: setConfiguration,
        getConfiguration: getConfiguration,
        asString: asString,
        setFromShare: setFromShare
    } 
})()
;
var SHARE = (($)=>{
    "use strict";
    
    let currentShare

    let BASE_URL = document.location.protocol + '//' + document.location.host
    
    LOADER.on(LOADER.EVENT.STORAGE_READY, init)

    let isShareOpen = false

    function init(){

        let moreWidth = $('#share .more .currentshare_container').outerWidth()

        $('#share .more').css({
            width: 0
        })

        $('#share .docreate').on('click', ()=>{
            doCreate()

            if(isShareOpen){
                return
            }
            isShareOpen = true
            $('#share .more').animate({
                width: moreWidth
            }, 200)

            $('#share .docreate').animate({
                'margin-right': '10px'
            }, 200)
        
            $('#share .docreate').html('Share again')

            setTimeout(()=>{
                $('#share .more').css('overflow', 'visible')
            }, 300)
        })


        $('#share .currentshare').on('change', ()=>{
            $('#share .currentshare').val(currentShare)
        })

        $('#share .copy_share_to_clipboard').on('click', ()=>{
            $('#share .currentshare').focus().select()
            document.execCommand('copy')
        })

        let params = new URLSearchParams( document.location.search)
        let paramid = params.get('id')
        if(paramid){
            setCurrentShare(paramid)
            setTimeout(doReceive, 1000)
        } else {
            LOADER.done(LOADER.EVENT.SHARE_READY)
        }
    }

    function setCurrentShare(id){
        currentShare = id
        if(typeof currentShare === 'string' && currentShare.length > 0){
            $('#share').addClass('has_share')
        } else {
            $('#share').removeClass('has_share')
        }
        $('#share .currentshare').val(BASE_URL + '/?id=' + currentShare)
    }

    function doCreate(){
        ENGINE.saveCodesInStorage()

        REPORTER.report(REPORTER.REPORT_TYPE_IDS.shareCode)

        console.log('creating new share')


        let code = EDITORS.get('normal').editor.getValue()
        if(typeof code !== 'string' || code.length === 0){
            UTIL.alert('Cannot share empty code!')
            return
        }
       
        $('#ponybin-create-overlay').show()

        let data = {
            code: 'v2',
            settings: STORAGE.asString()
        }

        $.post(BASE_URL + '/api/create', data).done((data)=>{
            try {
                let json = JSON.parse(data)
                let id = json.key
                setCurrentShare(id)
            } catch (e){
                console.error(e)
                UTIL.alert('Cannot share via ponybin. Please contact me.')
            }
        }).fail((e)=>{
            console.error(e)
            UTIL.alert('Cannot share via ponybin. Please contact me!')
        }).always(()=>{
            $('#ponybin-create-overlay').hide()
        })
    }

    function doReceive(){
        if(!currentShare){
            UTIL.alert('Cannot get data from ponybin. Please contact me.')
            return
        }
        REPORTER.report(REPORTER.REPORT_TYPE_IDS.receiveShareCode)
        
        console.log('receiving share', currentShare)
        $('#ponybin-receive-overlay').show()

        $.post(BASE_URL + '/api/get', {
            key: currentShare
        }).done((data)=>{
            try {
                let json = JSON.parse(data)

                if(typeof json.luabin === 'object'){
                    STORAGE.setFromShare(currentShare, json.luabin)
                } else {
                    throw 'invalid luabin format'
                }
            } catch (e){
                console.error(e)
                UTIL.alert('Cannot get data from ponybin. Please contact me!')
            }
        }).fail((e)=>{
            console.error(e)
            UTIL.alert('Cannot get data from ponybin. Is the share key correct?')
        }).always(()=>{
            $('#ponybin-receive-overlay').hide()
            LOADER.done(LOADER.EVENT.SHARE_READY)
        })
    }

})(jQuery)

;
UI = (($)=>{

    let viewables = {}
    let views = {}
    let editors = {}

    let splitterVertical
    let splitterHorizontalLeft
    let splitterHorizontalRight

    let isServerMode = false

    const VIEW_VIEW_MIN_SIZE = 100
    const SPLITTER_WIDTH = 6 /* this needs to be changed together with the css */

    const MY_CONFIGURATION_NAME = 'ui'

    const DEFAULT_LAYOUT = {
        top_left: ['viewable_editor_normal', 'viewable_editor_minified', 'viewable_editor_unminified', 'viewable_editor_uibuilder', 'viewable_editor_uibuilder_code'],
        top_right: ['viewable_documentation', 'viewable_properties', 'viewable_inputs', 'viewable_outputs', 'viewable_examples', 'viewable_learn', 'viewable_official_manuals'],
        bottom_left: ['viewable_console', 'viewable_hints'],
        bottom_right: ['viewable_monitor', 'viewable_settings']
    }

    let config = {
        layout: DEFAULT_LAYOUT,
        lastFocused: {},
        splitters: {
            vertical: 0.66,
            horizontal_left: 0.66,
            horizontal_right: 0.5
        }
    }

    LOADER.on(LOADER.EVENT.PAGE_READY, ()=>{
        $('.ide').addClass('deactivated')
    })

    LOADER.onAllDone(()=>{
        $('.ide').removeClass('deactivated')
    })

    LOADER.on(LOADER.EVENT.SHARE_READY, init)

    function init(){
        $('[viewable]').each((i, el)=>{
            viewables[ $(el).attr('viewable') ] = new Viewable( el )
        })

        $('[view]').each((i, el)=>{
            let view = new View( el )
            let name = $(el).attr('view')
            views[ name ] = view

            view.addListener('resize', ()=>{
                Editors.resize()
            })

            view.addListener('viewable-change', ()=>{
                config.layout[name] = Object.keys(view.getViewables())
                saveConfiguration()
            })

            view.addListener('viewable-focus-changed', ()=>{
                config.lastFocused[name] = view.getSelectedViewableName()
                saveConfiguration()
            })
        })

        $('[code-field]').each((i, el)=>{
            let editor = new Editor(el, viewables[$(el).closest('[viewable]').attr('viewable')] )
            editors[$(el).attr('code-field')] = editor
        })


        splitterVertical = new Splitter($('[splitter="vertical"]').get(0), 'vertical')
        splitterHorizontalLeft = new Splitter($('[splitter="horizontal_left"]').get(0), 'horizontal', true)
        splitterHorizontalRight = new Splitter($('[splitter="horizontal_right"]').get(0), 'horizontal')


        splitterVertical.addListener('updated', ()=>{
            config.splitters.vertical = splitterVertical.getRelative()
            onSplitterUpdate()
        })
        splitterHorizontalLeft.addListener('updated', ()=>{
            config.splitters.horizontal_left = splitterHorizontalLeft.getRelative()
            onSplitterUpdate()
        })
        splitterHorizontalRight.addListener('updated', ()=>{
            config.splitters.horizontal_right = splitterHorizontalRight.getRelative()
            onSplitterUpdate()
        })

        splitterVertical.addListener('dragend', saveConfiguration)
        splitterHorizontalLeft.addListener('dragend', saveConfiguration)
        splitterHorizontalRight.addListener('dragend', saveConfiguration)

        onSplitterUpdate()

        let conf = STORAGE.getConfiguration(MY_CONFIGURATION_NAME)
        if(conf){
            if(conf.layout && conf.layout instanceof Object){
                if(countEntries(conf.layout) === countEntries(DEFAULT_LAYOUT)){
                    config.layout = conf.layout
                }

                function countEntries(lay){
                    let total = 0
                    for(let k in lay){
                        total += lay[k].length
                    }
                    return total
                }
            }
        }



        loadLayout(config.layout)

        if(conf){
            if(conf.splitters){
                for(let s of ['vertical', 'horizontal_left', 'horizontal_right']){
                    if(typeof conf.splitters[s] === 'number'){
                        config.splitters[s] = conf.splitters[s]
                    }
                }
            }
        }

        function setSplittersFromConfig(){
            let tmp = {vertical: splitterVertical, horizontal_left: splitterHorizontalLeft, horizontal_right: splitterHorizontalRight}
            for(let k in tmp){
                tmp[k].setRelative(config.splitters[k], config.splitters[k])
            }
        }

        $(window).on('resize', setSplittersFromConfig)

        setSplittersFromConfig()

        if(conf){
            if(conf.lastFocused && conf.lastFocused instanceof Object){
                for(let k of Object.keys(conf.lastFocused)){
                    let viewableToFocus = viewables[conf.lastFocused[k]]
                    if(views[k] && viewableToFocus && views[k].isViewablePartOfThisView(viewableToFocus)){
                        views[k].focus(viewableToFocus)
                    }
                }
            }
        }


        /* create special dynamic sized viewables that are not editors */

        new DynamicSizedViewableContent($('#console').get(0), viewables['viewable_console'])

        for(let v of Object.keys(viewables)){
            let vw = viewables[v]
            vw.onGainFocus(()=>{
                vw.dom.find('[youtube-embed]').each((i, el)=>{
                    let id = $(el).attr('youtube-embed')
                    if(typeof id === 'string' && id.trim() !== ''){
                        $(el).append(
                            $('<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/' + id +'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>')
                        )
                    }
                    $(el).removeAttr('youtube-embed')

                    new DynamicSizedViewableContent($(el).get(0), vw, true)
                })
            })
        }

        /* add special tracking of learn and examples */
        viewables['viewable_examples'].onGainFocus(()=>{
            REPORTER.report(REPORTER.REPORT_TYPE_IDS.openLearnAndExamples)
        })
        viewables['viewable_learn'].onGainFocus(()=>{
            REPORTER.report(REPORTER.REPORT_TYPE_IDS.openLearnAndExamples)
        })


        
        $('#ide-server-mode').on('change', ()=>{

            isServerMode = $('#ide-server-mode').prop('checked')
            STORAGE.setConfiguration('settings.servermode', isServerMode)

            if(isServerMode){            
                $('.ide').attr('mode', 'server')
                if(ENGINE.isRunning()){
                    ENGINE.stop()
                }
            } else {
                $('.ide').attr('mode', 'client')            
            }
            DOCUMENTATION.refresh()
            EDITORS.refreshCharacterCounts()
        })

        $('#ide-server-mode').prop('checked', STORAGE.getConfiguration('settings.servermode') || false).trigger('change')


        LOADER.done(LOADER.EVENT.UI_READY)
    }

    function saveConfiguration(){
        STORAGE.setConfiguration(MY_CONFIGURATION_NAME, config)
    }

    function onSplitterUpdate(){
        views.top_left.resize(0, 0, splitterVertical.x, splitterHorizontalLeft.y)
        views.top_right.resize(splitterVertical.x, 0, UI.flexview().width() - splitterVertical.x, splitterHorizontalRight.y)

        views.bottom_left.resize(0, splitterHorizontalLeft.y, splitterVertical.x, UI.flexview().height() - splitterHorizontalLeft.y)
        views.bottom_right.resize(splitterVertical.x, splitterHorizontalRight.y, UI.flexview().width() - splitterVertical.x, UI.flexview().height() - splitterHorizontalRight.y)
    }


    function loadLayout(layout){
        if(layout instanceof Object === false || layout === null){
            throw 'layout must be an object'
        }

        for(let view in layout){
            if(! views[view]){
                throw 'view does not exist: "' + view + '"'
            }

            for(let viewable of layout[view]){
                if(! viewables[viewable]){
                    throw 'viewable does not exist: "' + viewable + '"'
                }

                viewables[viewable].moveToView(views[view], true)
            }
        }
    }

    return {
        views: ()=>{
            return views
        },
        viewables: ()=>{
            return viewables
        },
        VIEW_VIEW_MIN_SIZE: VIEW_VIEW_MIN_SIZE,
        SPLITTER_WIDTH: SPLITTER_WIDTH,
        verticalSplitterPosition: ()=>{
            return splitterVertical.x
        },
        flexview: ()=>{
            return $('.ide_flex_view')
        },
        editor: (name)=>{
            return editors[name]
        },
        isServerMode: ()=>{
            return isServerMode
        }
    }

})(jQuery)





;
class DynamicSizedViewableContent {
    /* if only_width === true, then only the width will be adjusted to match the viewables width, the height will change to keep the aspect ratio */
    constructor(container, viewable, only_width){
        this.dom = $(container)
        this.viewable = viewable
        this.only_width = only_width

        this.viewable.onViewableResize(()=>{
            this.refreshSize()
        })

        this.viewable.onGainFocus(()=>{
            this.refreshSize()
        })

        setTimeout(()=>{
            this.refreshSize()
        }, 100)
    }

    refreshSize(){
        let oldRatio = this.dom.width() / this.dom.height()

        this.dom.width(this.getAvailableWidth())

        if(this.only_width){
            this.dom.height(this.dom.width() / oldRatio)
        } else {
            this.dom.height(this.getAvailableHeight())
        }        
    }

    getAvailableHeight(){
        let myCurrentView = this.viewable.myCurrentView()
        
        if(! myCurrentView){
            return 0
        }

        let avail = myCurrentView.dom.find('.viewable_container').offset().top
            + myCurrentView.dom.find('.viewable_container').height()
            - this.dom.offset().top
            - 6

        return avail < 0 ? 0 : avail
    }

    getAvailableWidth(){
        let myCurrentView = this.viewable.myCurrentView()

        if(! myCurrentView){
            return 0
        }

        let avail = myCurrentView.dom.find('.viewable_container').offset().left
            + myCurrentView.dom.find('.viewable_container').width()
            - this.dom.offset().left
            - 6

        return avail < 0 ? 0 : avail
    }
}

class SimpleEventor {
    constructor(){
        this.listeners = {}
    }

    addListener(event, listener){
        if(typeof event !== 'string'){
            throw 'event must be a string'
        }
        if(typeof listener !== 'function'){
            throw 'listener must be a function'
        }

        if(this.listeners[event] instanceof Array === false){
            this.listeners[event] = []
        }
        this.listeners[event].push(listener)
    }

    dispatchEvent(event){
        if(typeof event !== 'string'){
            throw 'event must be a string'
        }

        if(this.listeners[event] instanceof Array){
            for(let listener of this.listeners[event]){
                if(typeof listener === 'function'){
                    listener(event)
                }
            }
        }
    }
}

class Viewable extends SimpleEventor {

    constructor(domElement){
        super()

        this.dom = $(domElement)

        this.DEBUG_NAME = this.name()
    }


    moveToView(view, dontFocus){
        let curView = this.myCurrentView()

        view.addViewable(this, dontFocus !== true)

        if(curView){
            curView.afterViewablesChanged()
        }

        this.dispatchEvent('view-change')
    }

    myCurrentView(){
        let views = UI.views()
        for(let v of Object.keys(views)){
            if(views[v].isViewablePartOfThisView(this)){
                return views[v]
            }
        }
    }

    focusSelf(){
        let currView = this.myCurrentView()
        if(currView){
            currView.focus(this)
        }
    }

    getSelectDom(){
        let currView = this.myCurrentView()
        if(currView){
            return currView.dom.find('[select-viewable="' + this.name() + '"]')
        }
    }

    name(){
        return this.dom.attr('viewable')
    }

    /* EVENT STUFF */

    onViewChange(listener){
        this.addListener('view-change', listener)
    }

    onViewableResize(listener){
        this.addListener('viewable-resize', listener)
    }

    onGainFocus(listener){
        this.addListener('viewable-gain-focus', listener)
    }
}

class View extends SimpleEventor {

    constructor(domElement){
        super()

        this.dom = $(domElement)

        this.dom.append( '<div class="select"></div>' )
            .append( '<div class="viewable_container"></div>' )

        this.DEBUG_NAME = this.name()
    }

    addViewable(viewable, focus){
        this.dom.find('.viewable_container').append( viewable.dom )
        let select = $('<div select-viewable="' + viewable.name() + '" select="false">' + TRANSLATE.key(viewable.name()) + '</div>')
        select.on('click', ()=>{
            this.focus(viewable)
        })
        this.dom.find('.select').append(select)
        
        let moveto = $('<span class="moveto icon-menu">')
        let choose
        moveto.on('click', (evt)=>{
            choose = $('<div class="moveto_choose">')
            choose.append(
                $('<div class="header">Move To</div>'))

            choose.css({
                position: 'fixed',
                top: evt.originalEvent.pageY - 10,
                right: ( $(window).width() - evt.originalEvent.pageX ) - 10
            })

            choose.on('mouseleave', ()=>{
                choose.remove()
            })

            select.append(choose)

            for(let v in UI.views()){
                if(v === this.name()){
                    continue
                }
                let view = UI.views()[v]
                let entry = $('<div class="entry">' + TRANSLATE.key(v) + '</div>')
                entry.on('click', (evt)=>{
                    evt.originalEvent.stopPropagation()
                    viewable.moveToView( view )
                    choose.remove()
                    UTIL.unHighlight(view.dom.get(0))
                })

                entry.on('mouseenter', ()=>{
                    UTIL.highlight(view.dom.get(0))
                })

                entry.on('mouseleave', ()=>{
                    UTIL.unHighlight(view.dom.get(0))
                })

                choose.append(entry)
            }
        })

        select.append(moveto)

        if(focus){
            this.focus(viewable)
        } else {
            viewable.dom.attr('visible', 'false')
        }

        this.afterViewablesChanged()
    }

    /* called after viewable is removed or added */
    afterViewablesChanged(){
        /* remove old selects where the viewable has been removed */
        let myViewables = this.getViewables()

        this.dom.find('[select-viewable]').each((i, el)=>{
            if(! myViewables[ $(el).attr('select-viewable') ] ){
                $(el).remove()
            }
        })

        /* select the first viewable if no other one is already visible */
        if(this.dom.find('[viewable][visible="true"]').length === 0){
            this.dom.find('[viewable]').first().attr('visible', 'true')
            this.dom.find('[select-viewable="' + this.dom.find('[viewable]').first().attr('viewable') + '"]').attr('visible', 'true')
        }

        this.focusSelect(this.dom.find('[viewable][visible="true"]').attr('viewable'))

        this.dispatchEvent('viewable-change')
    }

    getViewables(){
        let viewables = {}

        this.dom.find('[viewable]').each((i, el)=>{
            let name = $(el).attr('viewable')
            viewables[ name ] = UI.viewables()[name]
        })

        return viewables
    }

    focus(viewable){
        if(this.isViewablePartOfThisView(viewable)){
            this.dom.find('[viewable]').attr('visible', 'false')
            viewable.dom.attr('visible', 'true')

            this.focusSelect(viewable.dom.attr('viewable'))

            viewable.dispatchEvent('viewable-gain-focus')
            this.dispatchEvent('viewable-focus-changed')
        } else {
            console.warn('cannot focus viewable that is not part of this view', viewable, this)
        }
    }

    /* same as focus, but for the selection tab */
    focusSelect(viewable_name){
        this.dom.find('[select-viewable]').attr('select', 'false')
        this.dom.find('[select-viewable="' + viewable_name + '"]').attr('select', 'true')
    }

    isViewablePartOfThisView(viewable){
        let name = viewable.name()

        let found = false
        this.dom.find('[viewable]').each((i, el)=>{
            if( $(el).attr('viewable') === name){
                found = true
            }
        })

        return found
    }

    getSelectedViewableName(){
        let sel = this.dom.find('[select-viewable][select="true"]')
        if(sel.length === 1){
            return sel.attr('select-viewable')
        }
    }

    name(){
        return this.dom.attr('view')
    }

    resize(x, y, width, height){
        this.dom.css({
            top: y + 'px',
            left: x + 'px',
            width: width + 'px',
            height: height + 'px'
        })

        this.dispatchEvent('view-resize')

        let myViewables = this.getViewables()
        for(let v of Object.keys(myViewables)){
            myViewables[v].dispatchEvent('viewable-resize')
        }
    }
}

class Splitter extends SimpleEventor {

    constructor(domElement, type, isHorizontalLeft){
        super()

        if(domElement instanceof HTMLElement === false){
            throw 'invalid HTMLElement for Splitter'
        }

        this.dom = $(domElement)
        this.type = type
        this.isHorizontalLeft = isHorizontalLeft

        this.isDragging = false
        this.isHover = false

        this.dragStartX = 0
        this.dragStartY = 0

        this.x = 0
        this.y = 0

        if(type !== 'vertical' && type !== 'horizontal'){
            throw 'unssupported Splitter type "' + type + '"'
        }
        
        this.dom.on('mouseenter', (evt)=>{
            this.isHover = true

            this.update(true)
        })

        this.dom.on('mousedown', (evt)=>{
            this.isDragging = true
            this.dragStartX = evt.originalEvent.pageX
            this.dragStartY = evt.originalEvent.pageY

            this.update(true)
        })

        this.dom.on('mousemove', (evt)=>{
            if(this.isDragging){
                evt.originalEvent.stopPropagation()
                this.x = this.x - (this.dragStartX - evt.originalEvent.pageX)
                this.y = this.y - (this.dragStartY - evt.originalEvent.pageY)

                this.dragStartX = evt.originalEvent.pageX
                this.dragStartY = evt.originalEvent.pageY


                this.checkLimits()

            }

            this.update()
        })

        this.dom.on('mouseup mouseleave ', (evt)=>{
            if(this.isDragging){
                this.isDragging = false
                this.isHover = false

                this.update(true)

                this.dispatchEvent('dragend')
            }
        })

        Splitters.push(this)

        this.update()
    }

    setRelative(xr,yr){
        this.set( UI.flexview().width() * xr, UI.flexview().height() * yr )
    }

    set(x,y){
        this.x = x
        this.y = y
        this.checkLimits()
        this.update()
    }

    getRelative(){
        if(this.type === 'vertical'){
            return this.x / UI.flexview().width()
        } else if(this.type === 'horizontal'){
            return this.y / UI.flexview().height()
        }
    }

    checkLimits(){
        if(this.x < UI.VIEW_MIN_SIZE){
            this.x = UI.VIEW_MIN_SIZE
        }
        if(this.x > UI.flexview().width() - UI.VIEW_MIN_SIZE){
            this.x = UI.flexview().width() - UI.VIEW_MIN_SIZE
        }
        if(this.y > UI.flexview().height() - UI.VIEW_MIN_SIZE){
            this.y = UI.flexview().height() - UI.VIEW_MIN_SIZE
        }

        /* only use one axis for each type */
        if(this.type === 'vertical'){
            this.y = 0
        } else if(this.type === 'horizontal'){
            this.x = 0
        }
    }

    update(preventPropagation){
        this.dom.attr('draging', this.isDragging ? 'true' : 'false')
        this.dom.attr('hover', this.isHover ? 'true' : 'false')

        this.dom.css({
            left: this.getX(),
            top: this.getY(),
            width: this.getWidth() + 'px',
            height: this.getHeight() + 'px'
        })

        if(!preventPropagation){
            for(let s of Splitters){
                s.update(true)
            }
            this.dispatchEvent('updated')
        }
    }

    getX(){
        if(this.type === 'horizontal'){
            if(! this.isHorizontalLeft){
                return UI.verticalSplitterPosition() + 3 /* tiny offset, so they dont overlay each other */
            } else {
                this.x
            }
        } else {
            return this.x - UI.SPLITTER_WIDTH / 2
        }
    }

    getY(){
        if(this.type === 'vertical'){
            return this.y
        } else {
            return this.y - UI.SPLITTER_WIDTH / 2
        }
    }

    getWidth(){
        if(this.type === 'vertical'){
            return UI.SPLITTER_WIDTH
        } else if(this.type === 'horizontal'){
            if(this.isHorizontalLeft){
                return UI.verticalSplitterPosition() - 3 /* tiny offset, so they dont overlay each other */
            } else {
                return UI.flexview().width() - UI.verticalSplitterPosition()
            }
        }
    }

    getHeight(){
        if(this.type === 'vertical'){
            return UI.flexview().height()
        } else if(this.type === 'horizontal'){
            return UI.SPLITTER_WIDTH
        }
    }
}

let Splitters = []


;
var UI_BUILDER = (($)=>{
    "use strict";

    let maxX
    let maxY

    let canvas_container

    


    let MODE_MOVE = 'move'
    let MODE_RESIZE = 'resize'
    let MODE_SETTINGS = 'settings'
    let MODE_DELETE = 'delete'
    let MODE_ZINDEX = 'zindex'

    let MODE = MODE_MOVE

    let allElements = []

    let gcontainer

    let uuid = 1

    const LIBS = {
        IS_IN_RECT: 'is_in_rect',
        IS_IN_RECT_O: 'is_in_rect_o',
        SET_COLOR: 'set_color',
        ROTATE_POINT: 'rotate_point'
    
}
    const DEFAULT_LIBS = {
        [LIBS.SET_COLOR]: true
    }

    const LIBS_CODE = {
        is_in_rect: 'function isInRect(x,y,w,h,px,py)\nreturn px>=x and px<=x+w and py>=y and py<=y+h\nend',
        is_in_rect_o: 'function isInRectO(o,px,py)\nreturn px>=o.x and px<=o.x+o.w and py>=o.y and py<=o.y+o.h\nend',
        set_color: 'function setC(r,g,b,a)\nif a==nil then a=255 end\nscreen.setColor(r,g,b,a)\nend',
        rotate_point: 'function rotatePoint(cx,cy,angle,px,py)\ns=math.sin(angle)\nc=math.cos(angle)\npx=px-cx\npy=py-cy\nxnew=px*c-py*s\nynew=px*s+py*c\npx=xnew+cx\npy=ynew+cy\nreturn {x=px,y=py}\nend'
    }

    LOADER.on(LOADER.EVENT.CANVAS_READY, ()=>{
        init($('#ui-builder-container'))
    })

    function init(container){
        gcontainer = container
        container.append('<div class="element_list"></div>')

        canvas_container = $('<div class="canvas_container" mode="move"></div>')
        container.append(canvas_container)


        $('#monitor-size').on('change', ()=>{
            setTimeout(recalculateSize, 10)
        })

        $('#ui-builder-zoom').on('change', ()=>{
            recalculateSize()
            $('[for="ui-builder-zoom"] span').html($('#ui-builder-zoom').val() + 'x')
        })

        recalculateSize()
        $('[for="ui-builder-zoom"] span').html($('#ui-builder-zoom').val() + 'x')


        container.append('<div class="controls" mode="move"></div>')
        container.find('.controls').append('<div class="control move"><span class="icon-enlarge"></span>&nbsp;Move</div>')
        container.find('.controls').append('<div class="control resize"><span class="icon-enlarge2"></span>&nbsp;Size</div>')
        container.find('.controls').append('<div class="control settings"><span class="icon-equalizer"></span>&nbsp;Setup</div>')
        container.find('.controls').append('<div class="control delete"><span class="icon-cancel-circle"></span>&nbsp;Delete</div>')
        container.find('.controls').append('<div class="control zindex"><span class="icon-stack"></span>&nbsp;To Top</div>')

        container.find('.controls .control.move').on('click', ()=>{
            deactivateAllElements()
            container.find('.controls, .canvas_container').attr('mode', MODE_MOVE)
            MODE = MODE_MOVE
        })
        container.find('.controls .control.resize').on('click', ()=>{
            deactivateAllElements()
            container.find('.controls, .canvas_container').attr('mode', MODE_RESIZE)
            MODE = MODE_RESIZE
        })
        container.find('.controls .control.settings').on('click', ()=>{
            deactivateAllElements()
            container.find('.controls, .canvas_container').attr('mode', MODE_SETTINGS)
            MODE = MODE_SETTINGS
        })
        container.find('.controls .control.delete').on('click', ()=>{
            deactivateAllElements()
            container.find('.controls, .canvas_container').attr('mode', MODE_DELETE)
            MODE = MODE_DELETE
        })
        container.find('.controls .control.zindex').on('click', ()=>{
            deactivateAllElements()
            container.find('.controls, .canvas_container').attr('mode', MODE_ZINDEX)
            MODE = MODE_ZINDEX
        })


        container.append('<div class="element_layer_list"></div>')

        
        for(let e of ELEMENTS){
            let entry = $('<div class="element ' + e.name.toLowerCase() + '">' + e.name + '</div>')
            entry.on('click', ()=>{
                new e.object(false, canvas_container)
            })
            container.find('.element_list').append(entry)
        }

        $('#generate-ui-builder-lua-code').on('click', ()=>{
            REPORTER.report(REPORTER.REPORT_TYPE_IDS.generateUIBuilderCode)

            generateLuaCode()
        })

        loadFromStorage()

        LOADER.done(LOADER.EVENT.UI_BUILDER_READY)
    }

    function deactivateAllElements(){
        for(let e of allElements){
            e.deactivate()
        }
    }

    function recalculateSize(){
        canvas_container.width( uiZoom(CANVAS.width()) )
        canvas_container.height( uiZoom(CANVAS.height()) ) 
        
        maxX = CANVAS.width()
        maxY = CANVAS.height()

        canvas_container.find('.element').css('font-size', uiZoom(6) + 'px')

        for(let e of allElements){
            e.refreshPosition()
        }
    }

    class Element {

        constructor(params, container){
            if(!container){
                return console.error('UI_BUILDER.Element:', 'argument "container" is missing!')
            }
            this.id = 'i' + uuid
            uuid++

            allElements.push(this)
            this.zindex = allElements.length

            this.layerListEntry = $('<div class="layer_list_entry" type="' + this.constructor.name.toLowerCase() + '">'
                + '<div class="left"><span class="name">' + this.constructor.name.toLowerCase() + '</span><div class="background"></div></div>'
                + '<div class="lcontrols"><span class="up icon-circle-up"></span><span class="dup icon-copy"></span><span class="down icon-circle-down"></span></div>'
                + '</div>')

            this.layerListEntry.find('.up').on('click', ()=>{
                this.layerListEntry.addClass('light_up')
                moveElementZindexUp(this)
                setTimeout(()=>{
                    this.layerListEntry.removeClass('light_up')
                }, 500)
            })
            this.layerListEntry.find('.down').on('click', ()=>{
                this.layerListEntry.addClass('light_up')
                moveElementZindexDown(this)
                setTimeout(()=>{
                    this.layerListEntry.removeClass('light_up')
                }, 500)
            })  
            this.layerListEntry.find('.dup').on('click', ()=>{
                this.layerListEntry.addClass('light_up')
                duplicateElement(this)
                setTimeout(()=>{
                    this.layerListEntry.removeClass('light_up')
                }, 500)
            })          
            this.layerListEntry.on('mouseenter', ()=>{
                this.dom.addClass('highlight')
            })
            this.layerListEntry.on('mouseleave', ()=>{
                this.dom.removeClass('highlight')
            })

            gcontainer.find('.element_layer_list').append(this.layerListEntry)

            this.x = 0
            this.y = 0
            this.width = 24
            this.height = 8

            this.minWidth = 3
            this.minHeight = 3

            let color = createRandomColor()

            this.settings = {
                background: {
                    type: 'color',
                    value: color
                },
                border: {
                    type: 'color',
                    value: color
                },
                borderWidth: {
                    type: 'number',
                    value: 1
                }
            }

            this.beforeBuild()

            if(params && params.settings){
                this.applySettings(params.settings)
            }

            this.dom = this.buildDom()
            $(container).append(this.dom)

            this.refresh()
        }

        applySettings(settings){
            if(typeof settings.x === 'number'){
                this.x = settings.x
            }
            if(typeof settings.y === 'number'){
                this.y = settings.y
            }
            if(typeof settings.width === 'number'){
                this.width = settings.width
            }
            if(typeof settings.height === 'number'){
                this.height = settings.height
            }
            for(let s in settings){
                if(typeof this.settings[s] !== 'undefined' && this.settings[s] != null){
                    if(settings[s] instanceof Object){
                        this.settings[s].value = settings[s].value
                    } else {
                        this.settings[s].value = settings[s]
                    }
                }
            }
        }

        generateSettings(){
            let ret = {}
            for(let s in this.settings){
                ret[s] = this.settings[s].value
            }
            ret.x=this.x
            ret.y=this.y
            ret.width=this.width
            ret.height=this.height
            return ret
        }

        beforeBuild(){
            /* put special logic of subclasses in here
            *  register custom settings here
            */        
        }

        buildContent(){
            /* put special logic of subclasses in here
            *  called when the content html is build (only on instantiation)
            */      
        }

        refreshContent(){
            /* put special logic of subclasses in here
            *  called everytime a setting changed
            */    
        }

        buildLuaCode(){
            /* returns the lua script code for this element
            *
            *  Structure:
            *  {
            *    init: 'code put on the beginning of the script',
            *    onTick: 'code put inside the onTick function',
            *    onDraw: 'code put inside the onDraw function',
            *    lib: 'code put at the end of the script (e.g. helper functions)'
            *  }
            */
            let onDraw = ''
            if(this.settings.border){
                onDraw += luaBuildSetColor(this.settings.border.value) + '\n'
                + 'screen.drawRectF(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ')\n'
            }
            if(this.settings.background && this.settings.borderWidth){
                onDraw += luaBuildSetColor(this.settings.background.value) + '\n'
                + 'screen.drawRectF(' + (this.x + this.settings.borderWidth.value) + ',' + (this.y + this.settings.borderWidth.value) + ',' + (this.width - 2 * this.settings.borderWidth.value) + ',' + (this.height - 2 * this.settings.borderWidth.value) + ')'
            }
            return {
                init: '',
                onTick: '',
                onDraw: onDraw,
                libs: DEFAULT_LIBS
            }
        }

        buildDom(){
            let that = this

            let elem = $('<div class="element ' + this.constructor.name.toLowerCase() + '"></div>')
            elem.css('font-size', uiZoom(6) + 'px')

            elem.on('mouseenter', ()=>{
                elem.addClass('delete_overlay')
            })
            elem.on('mouseleave', ()=>{
                elem.removeClass('delete_overlay')
            })

            this.content = $('<div class="content"></div>')
            this.content.append(this.buildContent())
            elem.append(this.content)

            elem.append('<div class="settings"><span class="name">' + this.constructor.name + '</span><span class="close">x</span></div>')

            for(let k of Object.keys(this.settings)){
                let s = this.settings[k]
                let value
                switch(s.type){
                    case 'color': {
                        value = makeValidHexOrEmpty(s.value)
                        s.value = value
                    }; break;
                    case 'checkbox': {
                        value = s.value ? '" checked="checked' : ''
                    }; break;
                    default: {
                        value = s.value
                    }
                }
                let set = $('<div class="setting"><span class="name">' + k + '</span><input type="' + s.type + '" value="' + value + '" ' + (s.type === 'number' ? 'step="0.01"' : '') + '/></div>')
                set.on('change input', ()=>{
                    let val = set.find('input').val()
                    if(s.type === 'number'){
                        let parsed = parseFloat(val)
                        if(isNaN(parsed)){
                            parsed = parseInt(val)
                        }
                        s.value = isNaN(parsed) ? val : parsed
                    } else if(s.type === 'checkbox'){
                        s.value = set.find('input').prop('checked') === true
                    } else {
                        s.value = val
                    }
                    that.refresh()
                })
                if(s.description){
                    set.append('<div class="element_description"><span class="icon-question"></span><div class="element_description_content">' + s.description + '</div></div>')
                }

                elem.find('.settings').append(set)
            }

            elem.find('.settings').on('mousedown', (evt)=>{
                evt.stopPropagation()
            })

            elem.find('.close').on('click', (evt)=>{
                evt.stopPropagation()
                this.closeSettings()
            })

            elem.on('mousedown', (evt)=>{
                if(MODE === MODE_SETTINGS){
                    this.openSettings(evt)
                } else if(MODE === MODE_MOVE && evt.originalEvent.button === 0){
                    this.activateDrag(evt)
                } else if (MODE === MODE_RESIZE && evt.originalEvent.button === 0){
                    this.activateResize(evt)
                } else if (MODE === MODE_DELETE && evt.originalEvent.button === 0){
                    this.delete()
                } else if (MODE === MODE_ZINDEX && evt.originalEvent.button === 0){
                    moveElementZindexToFront(this)
                }
            })

            elem.on('contextmenu', (evt)=>{
                evt.preventDefault()
                this.openSettings(evt)
            })

            return elem
        }

        activateDrag(evt){
            this.offX = window.scrollX + evt.clientX - uiZoom(this.x)
            this.offY = window.scrollY + evt.clientY - uiZoom(this.y)

            this.dragLambda = (evt)=>{
                this.drag(evt)
            }
            $(gcontainer).on('mousemove', this.dragLambda)
            $(gcontainer).on('mouseup', this.deactivateDrag)
        }

        drag(evt){
            this.x = uiUnzoom((window.scrollX + evt.clientX) - this.offX)
            this.y = uiUnzoom((window.scrollY + evt.clientY) - this.offY)
            this.refreshPosition()
        }

        deactivateDrag(){
            $(gcontainer).off('mousemove', this.dragLambda)
            $(gcontainer).off('mouseup', this.deactivateDrag)
        }

        activateResize(evt){
            this.offX = (window.scrollX + evt.clientX) - uiZoom(this.width)
            this.offY = (window.scrollY + evt.clientY) - uiZoom(this.height)

            this.resizeLambda = (evt)=>{
                this.resize(evt)
            }
            $(gcontainer).on('mousemove', this.resizeLambda)
            $(gcontainer).on('mouseup', this.deactivateResize)
        }

        resize(evt){
            this.width = uiUnzoom((window.scrollX + evt.clientX) - this.offX)
            this.height = uiUnzoom((window.scrollY + evt.clientY) - this.offY)

            this.refreshPosition()
        }

        deactivateResize(){
            $(gcontainer).off('mousemove', this.resizeLambda)
            $(gcontainer).off('mouseup', this.deactivateResize)
        }

        deactivate(){
            this.deactivateDrag()
            this.deactivateResize()
            this.closeSettings()
        }

        refreshPosition(){
            /* x */
            if(this.x < 0){
                this.x = 0
            }
            if(this.x >= maxX){
                this.x = maxX-1
            }
            /* y */
            if(this.y < 0){
                this.y = 0
            }
            if(this.y >= maxY){
                this.y = maxY-1
            }
            /* width limit */
            if(this.x + this.width > maxX){
                this.width = maxX - this.x
            }
            if(this.width < this.minWidth){
                this.width = this.minWidth
            }
            /* height limit */
            if(this.y + this.height > maxY){
                this.height = maxY - this.y
            }
            if(this.height < this.minHeight){
                this.height = this.minHeight
            }

            this.dom.css({
                left: uiZoom(this.x),
                top: uiZoom(this.y),
                width: uiZoom(this.width),
                height: uiZoom(this.height)
            })
            console.log(this, {
                left: uiZoom(this.x),
                top: uiZoom(this.y),
                width: uiZoom(this.width),
                height: uiZoom(this.height)
            }, maxX, maxY)
        }

        refreshZindex(){
            this.dom.css({
                'z-index': this.zindex
            })
        }

        refresh(){
            try {
                if(this.settings.background && this.settings.borderWidth){
                    this.dom.css({
                        background: makeValidHexOrEmpty(this.settings.background.value),
                        'border-style': 'solid',
                        'border-color': makeValidHexOrEmpty(this.settings.border.value),
                        'border-width': makeValidPixelOrZero(this.settings.borderWidth.value)
                    })
                }
                if(this.settings.background){
                    this.layerListEntry.find('.background').css('background', makeValidHexOrEmpty(this.settings.background.value))
                }
            } catch (ex){
                console.warn('catched error while Element.refresh():', this, ex)
            }

            this.refreshPosition()
            this.refreshZindex()
            this.refreshContent()
        }

        openSettings(evt){
            if(evt) evt.stopPropagation()
            this.dom.addClass('settings_open')
            this.closeHandler = ()=>{
                this.closeSettings()
            }
            $(gcontainer).on('mousedown', this.closeHandler)
        }

        closeSettings(){
            this.dom.removeClass('settings_open')
            $(gcontainer).off('mousedown', this.closeHandler)
        }

        delete(){
            this.dom.remove()
            this.layerListEntry.remove()
            allElements.splice(this.zindex-1,1)
            resortAllElements()
        }
    }


    /* Element Subclasses */

    class Rectangle extends Element {

    }

    class Triangle extends Element {

        beforeBuild(){
            this.settings = {
                background: {
                    type: 'color',
                    value: createRandomColor()
                },
                direction: {
                    type: 'number',
                    value: 0
                }
            }
        }

        buildContent(){
            return '<svg viewBox="0 0 ' + uiZoom(this.width) + ' ' + uiZoom(this.height) + '">'
                    +'<polygon points="0,' + uiZoom(this.height) + ' ' + uiZoom(this.width/2) + ',0 ' + uiZoom(this.width) +',' + uiZoom(this.height) + '" stroke-width="0" fill="' + makeValidHexOrEmpty(this.settings.background.value) + '"></polygon>'
                +'</svg>'
        }

        refreshContent(){
            this.content.html(this.buildContent())
            this.content.css({
                transform: 'rotate(' + this.settings.direction.value + 'deg)'
            })
        }

        refreshPosition(){
            super.refreshPosition()
            this.refreshContent()
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()

            return {
                init: superRet.init,
                onDraw: superRet.onDraw + '\n'
                    + luaBuildSetColor(this.settings.background.value) + '\n'
                    + 'cx='+(this.x + this.width/2) + '\n'
                    + 'cy='+(this.y + this.height/2) + '\n'
                    + 'angle=' + (Math.floor((this.settings.direction.value/360)*2*Math.PI*100)/100) + '\n'
                    + 'p1=rotatePoint(cx,cy,angle,' +this.x+','+(this.y + this.height)+')\n'
                    + 'p2=rotatePoint(cx,cy,angle,' +(this.x+this.width/2)+','+this.y+')\n'
                    + 'p3=rotatePoint(cx,cy,angle,' +(this.x+this.width)+','+(this.y + this.height)+')\n'
                    + 'screen.drawTriangleF(p1.x,p1.y,p2.x,p2.y,p3.x,p3.y)',
                onTick: superRet.onTick,
                libs: Object.assign(superRet.libs, {[LIBS.ROTATE_POINT]:true})
            }
        }
    }

    class Circle extends Element {

        beforeBuild(){
        }

        buildContent(){
            return '<svg viewBox="0 0 ' + uiZoom(this.width) + ' ' + uiZoom(this.height) + '">'
                    +'<circle cx="' + uiZoom(this.width/2) + '" cy="' + uiZoom(this.height/2) + '" r="' + uiZoom(Math.min(this.width, this.height)/2 - this.settings.borderWidth.value/2) +'" stroke-width="' + uiZoom(this.settings.borderWidth.value) + '" stroke="'+ makeValidHexOrEmpty(this.settings.border.value) +'" fill="' + makeValidHexOrEmpty(this.settings.background.value) + '"></circle>'
                +'</svg>'
        }

        refreshContent(){
            this.content.html(this.buildContent())
            this.dom.css({
                background: '',
                border: ''
            })
        }

        refreshPosition(){
            super.refreshPosition()
            this.refreshContent()
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()

            return {
                init: superRet.init,
                onDraw: 'cx='+(this.x + this.width/2) + '\n'
                    + 'cy='+(this.y + this.height/2) + '\n'
                    + 'ri=' + (Math.min(this.width, this.height)/2 - this.settings.borderWidth.value) + '\n'
                    + 'ro=' + (Math.min(this.width, this.height)/2) + '\n'
                    + luaBuildSetColor(this.settings.border.value) + '\n'
                    + 'screen.drawCircleF(cx,cy,ro)\n'
                    + luaBuildSetColor(this.settings.background.value) + '\n'
                    + 'screen.drawCircleF(cx,cy,ri)',
                onTick: superRet.onTick,
                libs: superRet.libs
            }
        }
    }

    class Line extends Element {

        beforeBuild(){
            this.minWidth = 1
            this.minHeight = 1

            this.settings = {
                background: {
                    type: 'color',
                    value: createRandomColor()
                },
                reverse: {
                    type: 'checkbox',
                    value: false
                }
            }
        }

        buildContent(){
            if(this.settings.reverse.value){
                return '<svg viewBox="0 0 ' + uiZoom(this.width) + ' ' + uiZoom(this.height) + '"><polyline points="0,' + uiZoom(this.height) + ' ' + uiZoom(this.width) + ',0" stroke-width="' + uiZoom(1) + '" stroke="' + makeValidHexOrEmpty(this.settings.background.value) + '"></polyline></svg>'
            } else {
                return '<svg viewBox="0 0 ' + uiZoom(this.width) + ' ' + uiZoom(this.height) + '"><polyline points="0,0 ' + uiZoom(this.width) + ',' + uiZoom(this.height) + '" stroke-width="' + uiZoom(1) + '" stroke="' + makeValidHexOrEmpty(this.settings.background.value) + '"></polyline></svg>'
            }
        }

        refreshContent(){
            this.content.html(this.buildContent())
        }

        refreshPosition(){
            super.refreshPosition()
            this.refreshContent()
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()

            if(this.settings.reverse.value){
                return {
                    init: superRet.init,
                    onDraw: superRet.onDraw + '\n'
                        + luaBuildSetColor(this.settings.background.value) + '\n'
                        + 'screen.drawLine(' + this.x + ', ' + (this.y + this.height) + ', ' + (this.x + this.width) + ', ' + this.y + ')',
                    onTick: superRet.onTick,
                    libs: superRet.libs
                }
            } else {
                return {
                    init: superRet.init,
                    onDraw: superRet.onDraw + '\n'
                        + luaBuildSetColor(this.settings.background.value) + '\n'
                        + 'screen.drawLine(' + this.x + ', ' + this.y + ', ' + (this.x + this.width) + ', ' + (this.y + this.height) + ')',
                    onTick: superRet.onTick,
                    libs: superRet.libs
                }
            }
        }
    }

    class Label extends Element {

        beforeBuild(){
            let additionalSettings = {
                color: {
                    type: 'color',
                    value: '#000'
                },
                text: {
                    type: 'text',
                    value: 'label'
                }
            }
            Object.assign(this.settings, additionalSettings)
        }

        buildContent(){
            return $('<span class="text">' + this.settings.text.value + '</span>')
        }

        refreshContent(){
            this.content.find('.text')
                .css({
                    color: makeValidHexOrEmpty(this.settings.color.value)
                })
                .html(this.settings.text.value)

            this.content.css('cssText', 'display: flex; flex-direction: column; justify-content: center; align-items: center;')
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()
            return {
                init: superRet.init,
                onDraw: superRet.onDraw + '\n'
                    + luaBuildSetColor(this.settings.color.value) + '\n'
                    + 'screen.drawTextBox(' + this.x + ', ' + this.y + ', ' + this.width + ', ' + this.height + ', "' + this.settings.text.value + '", 0, 0)',
                onTick: superRet.onTick,
                libs: superRet.libs
            }
        }
    }

    class ButtonRectangle extends Element {

        beforeBuild(){
            let additionalSettings = {
                background: {
                    type: 'color',
                    value: '#000'
                },
                backgroundOn: {
                    type: 'color',
                    value: '#fff'
                },
                borderOn: {
                    type: 'color',
                    value: '#aaa'
                },
                color: {
                    type: 'color',
                    value: '#fff'
                },
                colorOn: {
                    type: 'color',
                    value: '#000'
                },
                text: {
                    type: 'text',
                    value: 'Off'
                },
                textOn: {
                    type: 'text',
                    value: 'On'
                },
                isToggle: {
                    type: 'checkbox',
                    value: false
                },
                channel: {
                    type: 'number',
                    value: 1
                }
            }
            Object.assign(this.settings, additionalSettings)
        }

        buildContent(){
            return $('<span class="text">' + this.settings.text.value + '</span>')
        }

        refreshContent(){
            this.content.find('.text')
                .css({
                    color: makeValidHexOrEmpty(this.settings.color.value)
                })
                .html(this.settings.text.value)
        }

        refreshPosition(){
            super.refreshPosition()
            this.refreshContent()
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()
            if(this.settings.isToggle.value){
                return {
                    init: superRet.init + '\n' + this.id + 'Toggled = false\n' + this.id + 'ToggledP = false\n',
                    onDraw: superRet.onDraw + 'text="' + this.settings.text.value + '"\n'
                        + 'if ' + this.id + 'Toggled then\ntext="' + this.settings.textOn.value + '"\nend\n'
                        + 'if ' + this.id + 'Toggled then\n' + luaBuildSetColor(this.settings.backgroundOn.value) + '\n'
                        + 'screen.drawRectF(' + this.x + ', ' + this.y + ', ' + this.width + ', ' + this.height + ')\nend\n'
                        + 'if ' + this.id + 'Toggled then\n' + luaBuildSetColor(this.settings.colorOn.value) + '\n'
                        + 'else\n' + luaBuildSetColor(this.settings.color.value) + '\nend\n'
                        + 'screen.drawTextBox(' + this.x + ', ' + this.y + ', ' + this.width + ', ' + this.height + ', "' + this.settings.text.value + '", 0, 0)',
                    onTick: superRet.onTick + '\n'
                        + 'if (isP1 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in1X,in1Y)) or (isP2 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in2X,in2Y)) then\n'
                        + this.id + 'ToggledP=true\n'
                        + 'end\n'
                        + 'if not (isP1 or isP2) and ' + this.id + 'ToggledP then\n'
                        + this.id + 'ToggledP = false\n'
                        + this.id + 'Toggled = not ' + this.id + 'Toggled\n'
                        + 'end\n'
                        + 'output.setBool(' + this.settings.channel.value + ', ' + this.id + 'Toggled)',
                    libs: Object.assign(superRet.libs, {[LIBS.IS_IN_RECT]:true})
                }
            } else {
                return {
                    init: superRet.init + '\n' + this.id + 'Toggled = false\n',
                    onDraw: superRet.onDraw + 'text="' + this.settings.text.value + '"\n'
                        + 'if ' + this.id + 'Toggled then\ntext="' + this.settings.textOn.value + '"\nend\n'
                        + 'if ' + this.id + 'Toggled then\n' + luaBuildSetColor(this.settings.backgroundOn.value) + '\n'
                        + 'screen.drawRectF(' + this.x + ', ' + this.y + ', ' + this.width + ', ' + this.height + ')\nend\n'
                        + 'if ' + this.id + 'Toggled then\n' + luaBuildSetColor(this.settings.colorOn.value) + '\n'
                        + 'else\n' + luaBuildSetColor(this.settings.color.value) + '\nend\n'
                        + 'screen.drawTextBox(' + this.x + ', ' + this.y + ', ' + this.width + ', ' + this.height + ', "' + this.settings.text.value + '", 0, 0)',
                    onTick: superRet.onTick + '\n'
                        + 'if (isP1 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in1X,in1Y)) or (isP2 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in2X,in2Y)) then\n'
                        + this.id + 'Toggled=true\n'
                        + 'else\n'
                        + this.id + 'Toggled=false\n'
                        + 'end\n'
                        + 'output.setBool(' + this.settings.channel.value + ', ' + this.id + 'Toggled)',
                    libs: Object.assign(superRet.libs, {[LIBS.IS_IN_RECT]:true})
                }
            }
        }
    }

    class ButtonTriangle extends Element {

        beforeBuild(){
            this.settings = {
                background: {
                    type: 'color',
                    value: createRandomColor()
                },
                backgroundOn: {
                    type: 'color',
                    value: createRandomColor()
                },
                isToggle: {
                    type: 'checkbox',
                    value: false
                },
                direction: {
                    type: 'number',
                    value: 0
                },
                channel: {
                    type: 'number',
                    value: 1
                }
            }
        }

        buildContent(){
            return '<svg viewBox="0 0 ' + uiZoom(this.width) + ' ' + uiZoom(this.height) + '">'
                    +'<polygon points="0,' + uiZoom(this.height) + ' ' + uiZoom(this.width/2) + ',0 ' + uiZoom(this.width) +',' + uiZoom(this.height) + '" stroke-width="0" fill="' + makeValidHexOrEmpty(this.settings.background.value) + '"></polygon>'
                +'</svg>'
        }

        refreshContent(){
            this.content.html(this.buildContent())
            this.content.css({
                transform: 'rotate(' + this.settings.direction.value + 'deg)'
            })
        }

        refreshPosition(){
            super.refreshPosition()
            this.refreshContent()
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()
            if(this.settings.isToggle.value){
                return {
                    init: superRet.init + '\n' + this.id + 'Toggled = false\n' + this.id + 'ToggledP = false\n',
                    onDraw: superRet.onDraw
                        + 'if ' + this.id + 'Toggled then\n' + luaBuildSetColor(this.settings.backgroundOn.value) + '\nelse\n' + luaBuildSetColor(this.settings.background.value) + '\nend\n'
                        + 'cx='+(this.x + this.width/2) + '\n'
                        + 'cy='+(this.y + this.height/2) + '\n'
                        + 'angle=' + (Math.floor((this.settings.direction.value/360)*2*Math.PI*100)/100) + '\n'
                        + 'p1=rotatePoint(cx,cy,angle,' +this.x+','+(this.y + this.height)+')\n'
                        + 'p2=rotatePoint(cx,cy,angle,' +(this.x+this.width/2)+','+this.y+')\n'
                        + 'p3=rotatePoint(cx,cy,angle,' +(this.x+this.width)+','+(this.y + this.height)+')\n'
                        + 'screen.drawTriangleF(p1.x,p1.y,p2.x,p2.y,p3.x,p3.y)',
                    onTick: superRet.onTick + '\n'
                        + 'if (isP1 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in1X,in1Y)) or (isP2 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in2X,in2Y)) then\n'
                        + this.id + 'ToggledP=true\n'
                        + 'end\n'
                        + 'if not (isP1 or isP2) and ' + this.id + 'ToggledP then\n'
                        + this.id + 'ToggledP = false\n'
                        + this.id + 'Toggled = not ' + this.id + 'Toggled\n'
                        + 'end\n'
                        + 'output.setBool(' + this.settings.channel.value + ', ' + this.id + 'Toggled)',
                    libs: Object.assign(superRet.libs, {[LIBS.IS_IN_RECT]:true, [LIBS.ROTATE_POINT]:true})
                }
            } else {
                return {
                    init: superRet.init + '\n' + this.id + 'Toggled = false\n',
                    onDraw: superRet.onDraw
                        + 'if ' + this.id + 'Toggled then\n' + luaBuildSetColor(this.settings.backgroundOn.value) + '\nelse\n' + luaBuildSetColor(this.settings.background.value) + '\nend\n'
                        + 'cx='+(this.x + this.width/2) + '\n'
                        + 'cy='+(this.y + this.height/2) + '\n'
                        + 'angle=' + (Math.floor((this.settings.direction.value/360)*2*Math.PI*100)/100) + '\n'
                        + 'p1=rotatePoint(cx,cy,angle,' +this.x+','+(this.y + this.height)+')\n'
                        + 'p2=rotatePoint(cx,cy,angle,' +(this.x+this.width/2)+','+this.y+')\n'
                        + 'p3=rotatePoint(cx,cy,angle,' +(this.x+this.width)+','+(this.y + this.height)+')\n'
                        + 'screen.drawTriangleF(p1.x,p1.y,p2.x,p2.y,p3.x,p3.y)',
                    onTick: superRet.onTick + '\n'
                        + 'if (isP1 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in1X,in1Y)) or (isP2 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in2X,in2Y)) then\n'
                        + this.id + 'Toggled=true\n'
                        + 'else\n'
                        + this.id + 'Toggled=false\n'
                        + 'end\n'
                        + 'output.setBool(' + this.settings.channel.value + ', ' + this.id + 'Toggled)',
                    libs: Object.assign(superRet.libs, {[LIBS.IS_IN_RECT]:true, [LIBS.ROTATE_POINT]:true})
                }
            }
        }
    }

    class SliderVertical extends Element {

        beforeBuild(){
            this.width = 8
            this.height = 24

            let additionalSettings = {
                background: {
                    type: 'color',
                    value: '#000'
                },
                border: {
                    type: 'color',
                    value: '#666'
                },
                defaultValue: {
                    type: 'number',
                    value: 0
                },
                sliderColor: {
                    type: 'color',
                    value: '#fff'
                },
                sliderThresholdZero: {
                    type: 'number',
                    value: 0.1,
                    description: 'Values below this value will be outputed as 0'
                },
                sliderThresholdFull: {
                    type: 'number',
                    value: 0.9,
                    description: 'Values above this value will be outputed as 1'
                },
                channel: {
                    type: 'number',
                    value: 1
                }
            }
            this.settings = additionalSettings
        }

        buildContent(){
            return $('<div class="slider_value"></div>')
        }

        refreshContent(){
            this.content.find('.slider_value')
                .css({
                    top: uiZoom((1-this.settings.defaultValue.value)*this.height),
                    height: this.settings.defaultValue.value*100 + '%',
                    background: makeValidHexOrEmpty(this.settings.sliderColor.value)
                })
            this.content.css({
                background: makeValidHexOrEmpty(this.settings.background.value),
                border: uiZoom(1)+'px solid ' + makeValidHexOrEmpty(this.settings.border.value)
            })
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()
            return {
                init: superRet.init + '\n' + this.id + 'sliderv={x=' + this.x + ',y=' + this.y + ',w=' + this.width + ',h=' + this.height + ',v=' + this.settings.defaultValue.value + '}\n',
                onDraw: superRet.onDraw + luaBuildSetColor(this.settings.background.value) + '\nscreen.drawRectF(' + this.id + 'sliderv.x,' + this.id + 'sliderv.y,' + this.id + 'sliderv.w,' + this.id + 'sliderv.h)\n'
                    + luaBuildSetColor(this.settings.sliderColor.value) + '\nscreen.drawRectF(' + this.id + 'sliderv.x,(1-' + this.id + 'sliderv.v)*' + this.id + 'sliderv.h+' + this.id + 'sliderv.y,' + this.id + 'sliderv.w,(' + this.id + 'sliderv.v)*' + this.id + 'sliderv.h)\n'
                    + luaBuildSetColor(this.settings.border.value) + '\nscreen.drawRect(' + this.id + 'sliderv.x,' + this.id + 'sliderv.y,' + this.id + 'sliderv.w,' + this.id + 'sliderv.h)\n',
                onTick: superRet.onTick + '\n'
                    + 'if isP1 and isInRectO('+this.id+'sliderv,in1X,in1Y) then\n'
                    + this.id+'sliderv.v=(('+this.id+'sliderv.y+'+this.id+'sliderv.h)-in1Y)/'+this.id+'sliderv.h\n'
                    + 'elseif isP2 and isInRectO('+this.id+'sliderv,in2X,in2Y) then\n'
                    + this.id+'sliderv.v=(('+this.id+'sliderv.y+'+this.id+'sliderv.h)-in2Y)/'+this.id+'sliderv.h\n'
                    + 'end\n'
                    + 'if '+this.id+'sliderv.v<'+this.settings.sliderThresholdZero.value+' then\n'
                    + this.id+'sliderv.v=0\n'
                    + 'elseif '+this.id+'sliderv.v>'+this.settings.sliderThresholdFull.value+' then\n'
                    + this.id+'sliderv.v=1\n'
                    + 'end\n'
                    + 'output.setNumber(' + this.settings.channel.value + ','+this.id+'sliderv.v)\n',
                libs: Object.assign(superRet.libs, {[LIBS.IS_IN_RECT_O]:true})
            }
        }
    }

    class SliderHorizontal extends Element {

        beforeBuild(){
            let additionalSettings = {
                background: {
                    type: 'color',
                    value: '#000'
                },
                border: {
                    type: 'color',
                    value: '#666'
                },
                defaultValue: {
                    type: 'number',
                    value: 0
                },
                sliderColor: {
                    type: 'color',
                    value: '#fff'
                },
                sliderThresholdZero: {
                    type: 'number',
                    value: 0.1,
                    description: 'Values below this value will be outputed as 0'
                },
                sliderThresholdFull: {
                    type: 'number',
                    value: 0.9,
                    description: 'Values above this value will be outputed as 1'
                },
                channel: {
                    type: 'number',
                    value: 1
                }
            }
            this.settings = additionalSettings
        }

        buildContent(){
            return $('<div class="slider_value"></div>')
        }

        refreshContent(){
            this.content.find('.slider_value')
                .css({
                    left: uiZoom((1-this.settings.defaultValue.value)*this.width),
                    width: this.settings.defaultValue.value*100 + '%',
                    background: makeValidHexOrEmpty(this.settings.sliderColor.value)
                })
            this.content.css({
                background: makeValidHexOrEmpty(this.settings.background.value),
                border: uiZoom(1)+'px solid ' + makeValidHexOrEmpty(this.settings.border.value)
            })
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()
            return {
                init: superRet.init + '\n' + this.id + 'sliderh={x=' + this.x + ',y=' + this.y + ',w=' + this.width + ',h=' + this.height + ',v=' + this.settings.defaultValue.value + '}\n',
                onDraw: superRet.onDraw + luaBuildSetColor(this.settings.background.value) + '\nscreen.drawRectF(' + this.id + 'sliderh.x,' + this.id + 'sliderh.y,' + this.id + 'sliderh.w,' + this.id + 'sliderh.h)\n'
                    + luaBuildSetColor(this.settings.sliderColor.value) + '\nscreen.drawRectF(' + this.id + 'sliderh.x,' + this.id + 'sliderh.y,(' + this.id + 'sliderh.v)*' + this.id + 'sliderh.w,' + this.id + 'sliderh.h)\n'
                    + luaBuildSetColor(this.settings.border.value) + '\nscreen.drawRect(' + this.id + 'sliderh.x,' + this.id + 'sliderh.y,' + this.id + 'sliderh.w,' + this.id + 'sliderh.h)\n',
                onTick: superRet.onTick + '\n'
                    + 'if isP1 and isInRectO('+this.id+'sliderh,in1X,in1Y) then\n'
                    + this.id+'sliderh.v=(in1X-'+this.id+'sliderh.x)/'+this.id+'sliderh.w\n'
                    + 'elseif isP2 and isInRectO('+this.id+'sliderh,in2X,in2Y) then\n'
                    + this.id+'sliderh.v=(in2X-'+this.id+'sliderh.x)/'+this.id+'sliderh.w\n'
                    + 'end\n'
                    + 'if '+this.id+'sliderh.v<'+this.settings.sliderThresholdZero.value+' then\n'
                    + this.id+'sliderh.v=0\n'
                    + 'elseif '+this.id+'sliderh.v>'+this.settings.sliderThresholdFull.value+' then\n'
                    + this.id+'sliderh.v=1\n'
                    + 'end\n'
                    + 'output.setNumber(' + this.settings.channel.value + ','+this.id+'sliderh.v)\n',
                libs: Object.assign(superRet.libs, {[LIBS.IS_IN_RECT_O]:true})
            }
        }
    }

    class FlipSwitch extends Element {

        beforeBuild(){
            this.height = 12
            this.width = 12
            this.minHidth = 12
            this.minHeight = 12


            this.settings = {
                background: {
                    type: 'color',
                    value: '#bbb'
                },
                backgroundOn: {
                    type: 'color',
                    value: '#0d0'
                },
                defaultValue: {
                    type: 'number',
                    value: 0
                },
                flipSwitchBodyColor: {
                    type: 'color',
                    value: '#000'
                },
                flipSwitchHeadColor: {
                    type: 'color',
                    value: '#b00'
                },
                defaultValue: {
                    type: 'checkbox',
                    value: false
                },
                channel: {
                    type: 'number',
                    value: 1
                }
            }
        }

        buildContent(){
            if(this.settings.defaultValue.value){
                return '<svg viewBox="0 0 ' + uiZoom(this.width) + ' ' + uiZoom(this.height) + '">'
                        +'<g transform="scale(' + uiZoom(this.width/12) + ' ' + uiZoom(this.height/12) + ')">'
                            +'<polygon points="0,0 12,0 12,12, 0,12" stroke-width="0" fill="' + makeValidHexOrEmpty(this.settings.backgroundOn.value) + '"></polygon>'
                            +'<polygon points="1,4 11,4 11,1 1,1" stroke-width="0" fill="' + makeValidHexOrEmpty(this.settings.flipSwitchHeadColor.value) + '"></polygon>'
                            +'<polygon points="3,4 9,4 9,7 3,7" stroke-width="0" fill="' + makeValidHexOrEmpty(this.settings.flipSwitchBodyColor.value) + '"></polygon>'
                        + '</g>'
                    +'</svg>'
            } else {
                return '<svg viewBox="0 0 ' + uiZoom(this.width) + ' ' + uiZoom(this.height) + '">'
                        +'<g transform="scale(' + uiZoom(this.width/12) + ' ' + uiZoom(this.height/12) + ')">'
                            +'<polygon points="0,0 12,0 12,12, 0,12" stroke-width="0" fill="' + makeValidHexOrEmpty(this.settings.background.value) + '"></polygon>'
                            +'<polygon points="1,8 11,8 11,11 1,11" stroke-width="0" fill="' + makeValidHexOrEmpty(this.settings.flipSwitchHeadColor.value) + '"></polygon>'
                            +'<polygon points="3,8 9,8 9,5 3,5" stroke-width="0" fill="' + makeValidHexOrEmpty(this.settings.flipSwitchBodyColor.value) + '"></polygon>'
                        + '</g>'
                    +'</svg>'
            }
        }

        refreshContent(){
            this.content.html(this.buildContent())
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()
            return {
                init: superRet.init + '\n' + this.id + 'flip={x=' + this.x + ',y=' + this.y + ',w=' + this.width + ',h=' + this.height + ',a=' + this.settings.defaultValue.value + ',p=false}\n',
                onDraw: superRet.onDraw
                    + 'if ' + this.id + 'flip.a then\n'
                    + luaBuildSetColor(this.settings.backgroundOn.value) + '\n'
                    + 'screen.drawRectF('+this.x+','+this.y+','+this.width+','+this.height+')\n'
                    + luaBuildSetColor(this.settings.flipSwitchBodyColor.value) + '\n'
                    + 'screen.drawRectF('+(this.x+this.width/12*3)+','+(this.y+this.height/12*4)+','+(this.width/12*6)+','+(this.height/12*3)+')\n'
                    + luaBuildSetColor(this.settings.flipSwitchHeadColor.value) + '\n'
                    + 'screen.drawRectF('+(this.x+this.width/12)+','+(this.y+this.height/12*1)+','+(this.width/12*10)+','+(this.height/12*3)+')\n'
                    + 'else\n'
                    + luaBuildSetColor(this.settings.background.value) + '\n'
                    + 'screen.drawRectF('+this.x+','+this.y+','+this.width+','+this.height+')\n'
                    + luaBuildSetColor(this.settings.flipSwitchBodyColor.value) + '\n'
                    + 'screen.drawRectF('+(this.x+this.width/12*3)+','+(this.y+this.height/12*5)+','+(this.width/12*6)+','+(this.height/12*3)+')\n'
                    + luaBuildSetColor(this.settings.flipSwitchHeadColor.value) + '\n'
                    + 'screen.drawRectF('+(this.x+this.width/12)+','+(this.y+this.height/12*8)+','+(this.width/12*10)+','+(this.height/12*3)+')\n'
                    + 'end\n',
                onTick: superRet.onTick + '\n'
                    + 'if isP1 and isInRectO('+this.id+'flip,in1X,in1Y) or isP2 and isInRectO('+this.id+'flip,in2X,in2Y) then\n'
                    + 'if not '+this.id+'flip.p then\n'
                    + this.id+'flip.a=not ' + this.id+'flip.a\n'
                    + this.id+'flip.p=true\n'
                    + 'end\n'
                    + 'else\n'
                    + this.id+'flip.p=false\n'
                    + 'end\n'
                    + 'output.setBool(' + this.settings.channel.value + ','+this.id+'flip.a)\n',
                libs: Object.assign(superRet.libs, {[LIBS.IS_IN_RECT_O]:true})
            }
        }
    }

    class IndicatorLight extends Element {

        beforeBuild(){
            this.width = 8
            this.height = 8
            this.minHidth = 8
            this.minHeight = 8

            let additionalSettings = {
                border: {
                    type: 'color',
                    value: '#333'
                },
                background: {
                    type: 'color',
                    value: '#2b2b2b'
                },
                backgroundOn: {
                    type: 'color',
                    value: '#50ff00'
                },
                channel: {
                    type: 'number',
                    value: 1
                }
            }
            Object.assign(this.settings, additionalSettings)
        }

        buildContent(){
            return '<svg viewBox="0 0 ' + uiZoom(this.width) + ' ' + uiZoom(this.height) + '">'
                    +'<circle cx="' + uiZoom(this.width/2) + '" cy="' + uiZoom(this.height/2) + '" r="' + uiZoom(Math.min(this.width, this.height)/2 - this.settings.borderWidth.value/4) +'" stroke-width="' + uiZoom(this.settings.borderWidth.value) + '" stroke="'+ makeValidHexOrEmpty(this.settings.border.value) +'" fill="' + makeValidHexOrEmpty(this.settings.background.value) + '"></circle>'
                +'</svg>'
        }

        refreshContent(){
            this.content.html(this.buildContent())
            this.dom.css({
                background: '',
                border: ''
            })
        }

        refreshPosition(){
            super.refreshPosition()
            this.refreshContent()
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()

            return {
                init: superRet.init,
                onDraw: 'cx='+(this.x + this.width/2) + '\n'
                    + 'cy='+(this.y + this.height/2) + '\n'
                    + 'ri=' + (Math.min(this.width, this.height)/2 - this.settings.borderWidth.value) + '\n'
                    + 'ro=' + (Math.min(this.width, this.height)/2) + '\n'
                    + luaBuildSetColor(this.settings.border.value) + '\n'
                    + 'screen.drawCircleF(cx,cy,ro)\n'
                    + 'if ' + this.id + 'Indc then\n'
                    + luaBuildSetColor(this.settings.backgroundOn.value) + '\n'
                    + 'else\n'
                    + luaBuildSetColor(this.settings.background.value) + '\n'
                    + 'end\n'
                    + 'screen.drawCircleF(cx,cy,ri)',
                onTick: superRet.onTick + '\n' + this.id + 'Indc=input.getBool(' + this.settings.channel.value + ')',
                libs: superRet.libs
            }
        }
    }


    class IndicatorSpeed extends Element {

        beforeBuild(){
            this.width = 14
            this.height = 14
            this.minWidth = 14
            this.minHeight = 14

            this.settings = {
                background: {
                    type: 'color',
                    value: '#222'
                },
                numberBackground: {
                    type: 'color',
                    value: '#444'
                },
                lineColor: {
                    type: 'color',
                    value: '#fff'
                },
                color: {
                    type: 'color',
                    value: createRandomColor()
                },
                max: {
                    type: 'number',
                    value: 999
                },
                minDigitWidth: {
                    type: 'number',
                    value: 3
                },
                channel: {
                    type: 'number',
                    value: 1
                }
            }
        }

        buildContent(){
            return '<svg viewBox="0 0 ' + uiZoom(this.width/2+(Math.max(new String(this.settings.max.value).length, this.settings.minDigitWidth.value)*5)) + ' ' + uiZoom(this.height) + '">'
                    +'<circle cx="' + uiZoom(this.width/2) + '" cy="' + uiZoom(this.height/2) + '" r="' + uiZoom(Math.min(this.width, this.height)/2) +'" stroke-width="0" fill="' + makeValidHexOrEmpty(this.settings.background.value) + '"></circle>'
                    + '<rect x="' + uiZoom(this.width/2) + '" y="' + uiZoom(this.height/2 - Math.min(this.width, this.height)/2) + '" width="' + uiZoom(this.settings.minDigitWidth.value*5) + '" height="' + uiZoom(Math.min(this.width, this.height)/2) + '" fill="' + makeValidHexOrEmpty(this.settings.numberBackground.value) + '"/>'
                    + '<line x1="' + uiZoom(this.width/2) + '" y1="' + uiZoom(this.height/2) + '" x2="' + uiZoom(this.width/2+Math.min(this.width, this.height)/2) + '" y2="' + uiZoom(this.height/2) + '" stroke="' + makeValidHexOrEmpty(this.settings.lineColor.value) + '" stroke-width="' + uiZoom(1) + '"/>'
                    + '<text x="' + uiZoom(this.width/2 + (this.settings.minDigitWidth.value-1)*5+1) + '" y="' + uiZoom(this.height/2 - Math.min(this.width, this.height)/4 + 3) + '" fill="' + makeValidHexOrEmpty(this.settings.color.value) + '">0</text>'
                +'</svg>'
        }

        refreshContent(){
            this.content.html(this.buildContent())
            this.dom.css({
                background: '',
                border: ''
            })
        }

        refreshPosition(){
            super.refreshPosition()
            this.refreshContent()
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()

            return {
                init: superRet.init + '\n'
                    + this.id + 'Max=' + this.settings.max.value,
                onDraw: ''
                    + luaBuildSetColor(this.settings.background.value) + '\n'
                    + 'screen.drawCircleF(' + (this.x+this.width/2) + ',' + (this.y+this.height/2) + ',' + Math.min(this.width, this.height)/2 + ')\n'
                    + luaBuildSetColor(this.settings.numberBackground.value) + '\n'
                    + 'screen.drawRectF(' + (this.x+this.width/2) + ',' + (this.y+this.height/2 - Math.min(this.width, this.height)/2) + ',math.max(' + this.settings.minDigitWidth.value + '*5+1,string.len(math.floor(' + this.id + 'Val))*5+1),' + Math.min(this.width, this.height)/2 + ')\n'
                    + luaBuildSetColor(this.settings.color.value) + '\n'
                    + 'screen.drawText(' + (this.x+this.width/2) + '+math.max(0,' + this.settings.minDigitWidth.value + '-string.len(math.floor(' + this.id + 'Val)))*5+1,' + (this.y+this.height/2 - Math.min(this.width, this.height)/4) + '-3, math.floor(' + this.id + 'Val))'
                    + luaBuildSetColor(this.settings.lineColor.value) + '\n'
                    + 'p=rotatePoint(' + (this.x+this.width/2) + ',' + (this.y+this.height/2) + ',math.pi*1.5*(' + this.id + 'Val/' + this.id + 'Max),' + (this.x+this.width/2 + Math.min(this.width, this.height)/2) + ',' + (this.y+this.height/2) + ')'
                    + 'screen.drawLine(' + (this.x+this.width/2) + ',' + (this.y+this.height/2) + ',p.x,p.y)',            
                onTick: superRet.onTick + '\n' + this.id + 'Val=input.getNumber(' + this.settings.channel.value + ')',
                libs: Object.assign(superRet.libs, {[LIBS.ROTATE_POINT]:true})
            }
        }
    }

    class Graph extends Element {

        beforeBuild(){
            this.width = 32
            this.height = 32

            this.settings = {
                color: {
                    type: 'color',
                    value: createRandomColor()
                },
                min: {
                    type: 'number',
                    value: 0
                },
                max: {
                    type: 'number',
                    value: 1
                },
                channel: {
                    type: 'number',
                    value: 1
                }
            }
        }

        buildContent(){
            return '<svg viewBox="0 0 ' + uiZoom(this.width) + ' ' + uiZoom(this.height) + '">'
                    + '<path d="M 0,' + uiZoom(this.height) + ' L ' + uiZoom(this.width/4) + ',' + uiZoom(this.height) + ' L ' + uiZoom(this.width*3/4) + ',' + uiZoom(this.height/2) + ' L ' + uiZoom(this.width) + ',' + uiZoom(this.height*5/6) + '" stroke-width="' + uiZoom(1) + '" stroke="' + makeValidHexOrEmpty(this.settings.color.value) + '" fill="none"/>'
                +'</svg>'
        }

        refreshContent(){
            this.content.html(this.buildContent())
            this.dom.css({
                background: '',
                border: ''
            })
        }

        refreshPosition(){
            super.refreshPosition()
            this.refreshContent()
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()

            return {
                init: superRet.init + '\n'
                    + this.id + 'Res={}\n'
                    + this.id + 'FC=0\n'
                    + this.id + 'Min=' + this.settings.min.value + '\n'
                    + this.id + 'Max=' + this.settings.max.value + '\n',
                onDraw: ''
                    + luaBuildSetColor(this.settings.color.value) + '\n'
                    + 'for i='+ this.id + 'FC-' + this.width + ', '+ this.id + 'FC-1 do\n'
                      + 'if i >= 0 and i - ' + this.id + 'FC + ' + this.width + ' >= 0 then\n'
                        + 'value = ('+ this.id + 'Res[i]-'+ this.id + 'Min)/'+ this.id + 'Max\n'
                        + 'if not ('+ this.id + 'Res[i+1] == nil) then\n'
                            + 'valueAfter = ('+ this.id + 'Res[i+1]-'+ this.id + 'Min)/'+ this.id + 'Max\n'
                            + 'screen.drawLine(i - '+ this.id + 'FC + ' + this.width + ', ' + this.height + ' * (1 - value), i + 1 - '+ this.id + 'FC + ' + this.width + ', ' + this.height + ' * (1 - valueAfter))\n'
                        + 'end\n'
                    +   'end\n'
                    + 'end\n',
                onTick: superRet.onTick + '\n'
                    + this.id + 'Res[' + this.id + 'FC]=math.max('+ this.id + 'Min,math.min('+ this.id + 'Max,input.getNumber(' + this.settings.channel.value + ')))\n'
                    + this.id + 'FC=' + this.id + 'FC+1',
                libs: superRet.libs
            }
        }
    }
    



    const ELEMENTS = [{
        name: 'Rectangle',
        object: Rectangle
    },{
        name: 'Triangle',
        object: Triangle
    },{
        name: 'Circle',
        object: Circle
    },{
        name: 'Line',
        object: Line
    },{
        name: 'Label',
        object: Label
    },{
        name: 'Button Rectangle',
        object: ButtonRectangle
    },{
        name: 'Button Triangle',
        object: ButtonTriangle
    },{
        name: 'Slider Vertical',
        object: SliderVertical
    },{
        name: 'Slider Horizontal',
        object: SliderHorizontal
    },{
        name: 'Flip Switch',
        object: FlipSwitch
    },{
        name: 'Indicator Light',
        object: IndicatorLight
    },{
        name: 'Indicator Speed',
        object: IndicatorSpeed
    },{
        name: 'Graph',
        object: Graph
    }]

    function duplicateElement(el){
        let dup = new el.constructor(false, canvas_container)
        dup.applySettings(el.settings)
        moveElementZindexUp(dup)
    }


    function generateLuaCode(){
        try {
            const fields = ['init', 'onTick', 'onDraw']
            let code = {}
            for(let i of fields){
                code[i] = ''
            }

            let libs = {}

            for(let e of allElements){
                let c = e.buildLuaCode()
                Object.assign(libs, c.libs)
                for(let i of fields){
                    if(typeof c[i] === 'string'){
                        code[i] += '\n\n' + c[i]
                    }
                }
            }

            let libCode = ''
            for(let l in libs){
                if(!LIBS_CODE[l]){
                    throw new Error('lib "'+l+'" not found!')
                }
                libCode += LIBS_CODE[l] + '\n\n'
            }

            let allCode = code.init
                + '\nfunction onTick()\n'
                    + 'isP1 = input.getBool(1)\nisP2 = input.getBool(2)\n\nin1X = input.getNumber(3)\nin1Y = input.getNumber(4)\nin2X = input.getNumber(5)\nin2Y = input.getNumber(6)\n\n'
                    + code.onTick + '\nend\n'
                + '\nfunction onDraw()\n' + code.onDraw + '\nend\n'
                + '\n' + libCode

            allCode = allCode.replace(/[\n]{3,}/g, '\n\n')

            UI.viewables()['viewable_editor_uibuilder_code'].focusSelf()
            EDITORS.get('uibuilder').editor.setValue(allCode, -1)
        } catch (ex){
            console.error('Error building lua code', ex)
            UTIL.alert('Error building lua code.\nPlease contact the developer.')
        }
    }

    /* helpers */

    function makeValidHexOrEmpty(hexstring){
        if(!hexstring){
            return ''
        }
        hexstring = hexstring.trim()
        let match = hexstring.match(/^#?([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/)

        if(!match){
            return ''
        }

        let hex = match[1]
        if(hex.length === 3){
            return '#' + hex.split('')[0] + hex.split('')[0] + hex.split('')[1] + hex.split('')[1] + hex.split('')[2] + hex.split('')[2]
        } else {
            return '#' + hex
        }
    }

    function makeValidPixelOrZero(pxstring){
        pxstring = ('' + pxstring).replace('px', '').trim()
        let int = parseFloat(pxstring)
        if(isNaN(int)){
            let float = parseInt(pxstring)
            if(isNaN(float)){
                return '0'
            }

            return float
        }

        return int
    }

    function makeColorCorrectedRGBString(hex){
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        result = result ? {
            r: Math.floor(parseInt(result[1], 16) * 0.38),
            g: Math.floor(parseInt(result[2], 16) * 0.38),
            b: Math.floor(parseInt(result[3], 16) * 0.38)
          } : '';


        return result.r + ',' + result.g + ',' + result.b
    }

    const HEX_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
    function createRandomColor(){
        let res = '#'
        for(let i = 0; i<6; i++){
            res += HEX_CHARS[Math.floor(Math.random()*16)]
        }
        return res
    }

    function resortAllElements(){
        allElements.sort((a, b)=>{
            if(a.zindex < b.zindex){
                return -1
            }

            if(a.zindex > b.zindex){
                return 1
            }

            return 0
        })

        for(let i = 0; i < allElements.length; i++){
            allElements[i].zindex = i+1
            allElements[i].refreshZindex()
        }


        /* resort layer list */
        let tmp = $('<div></div>')
        gcontainer.find('.element_layer_list').children().appendTo(tmp)
        for(let e of allElements){
            gcontainer.find('.element_layer_list').append(e.layerListEntry)
        }
    }

    function moveElementZindexToFront(element){
        element.zindex = allElements.length * 2 /* to be sure its the biggest value */
        
        element.layerListEntry.addClass('light_up')
        resortAllElements()
        setTimeout(()=>{
            element.layerListEntry.removeClass('light_up')
        }, 500)
    }

    function moveElementZindexDown(element){
        if(element.zindex <= 1){
            return
        }
        let originalZindex = element.zindex
        element.zindex = allElements[originalZindex - 1 - 1].zindex
        allElements[originalZindex - 1 - 1].zindex = originalZindex
        resortAllElements()
    }

    function moveElementZindexUp(element){
        if(element.zindex >= allElements.length){
            return
        }
        let originalZindex = element.zindex
        element.zindex = allElements[originalZindex - 1 + 1].zindex
        allElements[originalZindex - 1 + 1].zindex = originalZindex
        resortAllElements()
    }


    function save(){
        STORAGE.setConfiguration('uibuilder', buildStorage())
    }

    function getStorage(){
        return STORAGE.getConfiguration('uibuilder')
    }

    function buildStorage(){
        let data = {elements: []}
        for(let e of allElements){
            data.elements.push({
                type: e.constructor.name,
                settings: e.generateSettings()
            })
        }
        return data
    }

    function loadFromStorage(){        
        let parsed = getStorage()
        if(!parsed){
            return
        }

        for(let e of parsed.elements){
            if(e.type && e.settings){
                let found = false
                for(let elem of ELEMENTS){
                    console.log(elem.object.prototype.constructor)
                    if(elem.object.prototype.constructor.name === e.type){
                        found = true
                        new elem.object({settings: e.settings}, canvas_container)
                        break
                    }
                }
                if(!found){
                    console.warn('cannot create element from storage (type not found)', e)
                }                    
            }
        }
    }

    /* build lua code helpers */
    function luaBuildSetColor(hex){
        return 'setC(' + makeColorCorrectedRGBString(hex) + ')'
    }

    return {
        Element: Element,
        Label: Label,
        save: save,
        allElements: ()=>{
            return allElements
        }
    }

})(jQuery)

function uiZoom(v){
    return v * $('#ui-builder-zoom').val()
}

function uiUnzoom(v){
    return v / $('#ui-builder-zoom').val()
}



;
CONSOLE = (($)=>{
    "use strict";
    

    const COLOR = {
        SPECIAL: '#4db4ea',
        DEBUG: '#b80a66',
        ERROR: '#fb3636',
        WARNING: '#e19116'
    }

    const DEFAULT_PRINT_COLOR = '#fff'

    let currentPrintColor = DEFAULT_PRINT_COLOR

    let printCounter = 0
    let hasShownPrintCounterWarning = false

    LOADER.on(LOADER.EVENT.UI_READY, init)

    function init(){

        $('#out .console_clear').on('click', ()=>{
            $('#console-inner').html('')
        })

        
        $('#console-inner').html('')

        LOADER.done(LOADER.EVENT.LUA_CONSOLE_READY)
    }


    function print(text, hexcolor){
        if(!hexcolor){
            hexcolor = currentPrintColor
        }
        text = $('<div>'+text+'</div>').text()
        if(hexcolor){
            text = '<span style="color: ' + hexcolor + '">' + text + '</span>'
        }

        $('#console-inner').append(text + '<br>')

        if($('#console-inner').children().length > 600){
            while($('#console-inner').children().length > 400){
                $('#console-inner').children().get(0).remove()
            }
            $('#console-inner').prepend('<div><span style="color: #f00">Some messages of the log output are removed for performance reasons! Don\' use print() that often for better performance!</span></div><br>')
        }

        /* scroll down console */
        $("#console-inner").each( function(){
           let scrollHeight = Math.max(this.scrollHeight, this.clientHeight);
           this.scrollTop = scrollHeight - this.clientHeight;
        });

        printCounter++
        if(printCounter === 50 && hasShownPrintCounterWarning === false){
            hasShownPrintCounterWarning = true
            UTIL.hint("Warning", "You are using print() a lot, this reduces performance!")
        }
    }

    function setPrintColor(r,g,b){
        if( typeof r === 'number' && typeof g === 'number' && typeof b === 'number' && !isNaN(r) && !isNaN(g) && !isNaN(b)){
            currentPrintColor = 'rgb(' + Math.min(255, Math.max(0, r)) + ','
                + Math.min(255, Math.max(0, g)) + ','
                + Math.min(255, Math.max(0, b)) + ')'
        }
    }

    function reset(){
        currentPrintColor = DEFAULT_PRINT_COLOR
        printCounter = 0
        hasShownPrintCounterWarning = false
    }

    function notifiyTickOrDrawOver(){
        printCounter = 0
    }


    return {
        COLOR: COLOR,
        print: print,
        setPrintColor: setPrintColor,
        reset: reset,
        notifiyTickOrDrawOver: notifiyTickOrDrawOver
    }
})(jQuery)
;
var EXAMPLES = (($)=>{
  "use strict";

	const CHAPTERS_EXAMPLE = [{
		title: 'Touchscreen',
		sections: [{
			title: 'Draw circle where player klicks',
			contents: [{
				type: 'text',
				content: 'A monitor has a composite output. When you connect that output to the lua script input you can read out interactions from the user.'
			},{
				type: 'code',
				content: 'function onTick()\n	isPressed1 = input.getBool(1)\n	isPressed2 = input.getBool(2)\n	\n	screenWidth = input.getNumber(1)\n	screenHeight = input.getNumber(2)\n	\n	input1X = input.getNumber(3)\n	input1Y = input.getNumber(4)\n	input2X = input.getNumber(5)\n	input2Y = input.getNumber(6)\nend    \n	    \nfunction onDraw()\n	if isPressed1 then\n	    screen.setColor(0, 255, 0)\n	    screen.drawCircleF(input1X, input1Y, 4)\n	end\n	\n	if isPressed2 then\n	    screen.setColor(255, 0, 0)\n	    screen.drawCircleF(input2X, input2Y, 4)\n	end\n	\n	if isPressed1 and isPressed2 then\n	    screen.setColor(0, 0, 255)\n	    screen.drawLine(input1X, input1Y, input2X, input2Y)\n	end\nend\n'
			},{
				type: 'text',
				content: 'It will draw a green circle at the position of the first press and a red circle at the position of the second press.\nIf both keys are pressed it will also draw a line between the red and green circle.'
			}]
		},{
			title: 'Button Push and Toggle',
			contents: [{
				type: 'text',
				content: 'A monitor has a composite output. When you connect that output to the lua script input you can read out interactions from the user.'
			},{
				type: 'text',
				content: 'We need to define a hitbox and check if the player press is in that hitbox. Then we can set the buttons state. In the draw function we colorize the button depending on its state.\nIf the player now clicks on that hitbox (either with q or with e) it will push the button.'
			},{
				type: 'code',
				content: 'buttonX = 0\nbuttonY = 0\nbuttonWidth = 12\nbuttonHeight = 6\nbuttonActive = false\n\n\nfunction onTick()\n	isPressed1 = input.getBool(1)\n	isPressed2 = input.getBool(2)\n	\n	screenWidth = input.getNumber(1)\n	screenHeight = input.getNumber(2)\n	\n	input1X = input.getNumber(3)\n	input1Y = input.getNumber(4)\n	input2X = input.getNumber(5)\n	input2Y = input.getNumber(6)\n	\n	if isPressed1 and input1X >= buttonX and input1X <= buttonX + buttonWidth and input1Y >= buttonY and input1Y <= buttonY + buttonHeight then\n	    buttonActive = true\n	elseif isPressed2 and input2X >= buttonX and input2X <= buttonX + buttonWidth and input2Y >= buttonY and input2Y <= buttonY + buttonHeight then\n	    buttonActive = true\n	else\n	    buttonActive = false\n	end\n	\n	output.setBool(1, buttonActive)\nend    \n	    \nfunction onDraw()\n	if buttonActive then\n	   screen.setColor(0,150,0) \n	else\n	   screen.setColor(10,10,10) \n	end\n	screen.drawRectF(buttonX, buttonY, buttonWidth, buttonHeight)\nend\n'
			},{
				type: 'text',
				content: 'The button will light up green and the output channel 1 will be true when its active.'
			},{
				type: 'text',
				content: 'A toggle button (supporting e and q) is a little bit different:'
			},{
				type: 'code',
				content: 'buttonX = 0\nbuttonY = 0\nbuttonWidth = 12\nbuttonHeight = 6\nbuttonActive = false\n\nwasButton1Pressed = false\nwasButton2Pressed = false\n\nfunction onTick()\n	isPressed1 = input.getBool(1)\n	isPressed2 = input.getBool(2)\n	\n	screenWidth = input.getNumber(1)\n	screenHeight = input.getNumber(2)\n	\n	input1X = input.getNumber(3)\n	input1Y = input.getNumber(4)\n	input2X = input.getNumber(5)\n	input2Y = input.getNumber(6)\n	\n	if isPressed1 and input1X >= buttonX and input1X <= buttonX + buttonWidth and input1Y >= buttonY and input1Y <= buttonY + buttonHeight then\n	    wasButton1Pressed = true\n	elseif isPressed2 and input2X >= buttonX and input2X <= buttonX + buttonWidth and input2Y >= buttonY and input2Y <= buttonY + buttonHeight then\n	    wasButton2Pressed = true\n	end\n	\n	if not isPressed1 and wasButton1Pressed then\n	    wasButton1Pressed = false\n	    buttonActive = not buttonActive\n	end\n	\n	if not isPressed2 and wasButton2Pressed then\n	    wasButton2Pressed = false\n	    buttonActive = not buttonActive\n	end\n	\n	output.setBool(1, buttonActive)\nend    \n	    \nfunction onDraw()\n	if buttonActive then\n	   screen.setColor(0,150,0) \n	else\n	   screen.setColor(10,10,10) \n	end\n	screen.drawRectF(buttonX, buttonY, buttonWidth, buttonHeight)\nend\n'
			}]
		}]
	},{
		title: 'Instruments',
		sections: [{
			title: 'Flying - Altimeter',
			contents: [{
				type: 'text',
				content: 'An instrument showing the altitude (meter or feet).'
			},{
				type: 'text',
				content: 'The most important function is "rotatePoint()". It rotates an xy coordinate around another coordinate.'
			},{
				type: 'code',
				content: 'height = 0\nwidth = 0\ncenterX = 0\ncenterY = 0\n\naltitude = 0\n\nunitAsFeet = false -- set to true to have units in feet\n\nfunction onTick()\n	altitude = input.getNumber(1)\n	if unitAsFeet then\n		altitude = altitude * 3.28084\n	end\nend\n\nfunction onDraw()\n	height = screen.getHeight()\n	width = screen.getWidth()\n	\n	min = math.min(height, width)\n	centerX = min/2\n	centerY = min/2\n	height = min - 2\n	width = min - 2\n	\n	-- draw lines grey\n	screen.setColor(30, 30, 30)\n	for i=0, math.pi*2, math.pi/15 do\n		p1 = rotatePoint(centerX, centerY, i, centerX, centerY+height/2)\n		p2 = rotatePoint(centerX, centerY, i, centerX, centerY+height/2.2)\n		screen.drawLine(p1.x, p1.y, p2.x, p2.y)\n	end\n	\n	-- draw lines white\n	screen.setColor(255, 255, 255)\n	for i=math.pi+0.01, math.pi*3, math.pi/5 do\n		p1 = rotatePoint(centerX, centerY, i, centerX, centerY+height/2)\n		p2 = rotatePoint(centerX, centerY, i, centerX, centerY+height/2.2)\n		screen.drawLine(p1.x, p1.y, p2.x, p2.y) \n	end\n	\n	-- draw numbers\n	counter = 0\n	for i=math.pi+0.01, math.pi*3, math.pi/5 do\n		p = rotatePoint(centerX, centerY, i, centerX, centerY+height/2.9)\n		screen.drawText(p.x-2, p.y-3, counter)\n		counter = counter+1\n	end\n	\n	-- draw inner circle\n	screen.drawCircle(centerX, centerY, width/4.5)\n	\n	-- draw 10.000m pointer\n	p10000 = altitude/10000\n	p = rotatePoint(centerX, centerY, math.pi + math.pi/5 * p10000, centerX, centerY+height/2.1)\n	screen.setColor(255,0,0)\n	screen.drawLine(centerX, centerY, p.x, p.y)\n	\n	-- draw 1000m pointer\n	p1000 = (altitude%10000)/1000\n	p = rotatePoint(centerX, centerY, math.pi + math.pi/5 * p1000, centerX, centerY+height/4.8)\n	screen.setColor(0,255,0)\n	screen.drawLine(centerX, centerY, p.x, p.y)\n	\n	-- draw 100m pointer\n	p100 = (altitude%1000)/100\n	p = rotatePoint(centerX, centerY, math.pi + math.pi/5 * p100, centerX, centerY+height/3)\n	screen.setColor(0,0,255)\n	screen.drawLine(centerX, centerY, p.x, p.y)\nend\n\nfunction rotatePoint(cx, cy, angle, px, py)\n	s = math.sin(angle);\n	c = math.cos(angle);\n\n	--translate point back to origin:\n	px = px - cx;\n	py = py - cy;\n\n	-- rotate point\n	xnew = px * c - py * s;\n	ynew = px * s + py * c;\n\n	-- translate point back:\n	px = xnew + cx;\n	py = ynew + cy;\n	return {x=px, y=py}\nend\n'
			},{
				type: 'text',
				content: 'The red line is the x10000 meter/feet value, the green line is the x1000 meter/feet value, the blue line is the x100 meter/feet value.\nHow to read the current altitude:\nred value x 10000 + green value x 1000 + blue value x 100'
			}]
		},{
			title: 'Flying - Airspeed',
			contents: [{
				type: 'text',
				content: 'An instrument showing the speed (m/s, km/h or mph).'
			},{
				type: 'text',
				content: 'The function "rotatePoint()" rotates an xy coordinate around another coordinate.\nThe function "clear" draws black triangles to create the arcs.'
			},{
				type: 'code',
				content: 'height = 0\nwidth = 0\ncenterX = 0\ncenterY = 0\n\nspeed = 0\n\nflapsDownStallSpeed = 40 -- bottom of white arc\nflapsUpStallSpeed = 50 -- bottom of green arc\nmaxFlapsExtendSpeed = 80 -- top of white arc\nmaxStructuralCruisingSpeed = 130 -- top of green arc\nneverExceedSpeed = 160 -- top of yellow arc\n\nspeedForWholeCircle = 250\n\nunit = "m/s" -- set to "m/s", "km/h" or "mph"\n\nfunction onTick()\n	speed = input.getNumber(1)\n	if unit == "km/h" then\n		speed = speed * 3.6\n	elseif unit == "mph" then\n		speed = speed * 2.23694\n	end\nend\n\nfunction onDraw()\n	height = screen.getHeight()\n	width = screen.getWidth()\n	\n	min = math.min(height, width)\n	centerX = min/2\n	centerY = min/2\n	height = min - 2\n	width = min - 2\n	\n	\n	-- draw white arc\n	screen.setColor(255,255,255)\n	screen.drawCircleF(centerX, centerY, width/2.2)\n	screen.setColor(0,0,0)\n	screen.drawCircleF(centerX, centerY, width/2.4)\n	\n	clear(math.pi + (maxFlapsExtendSpeed/speedForWholeCircle)*math.pi*2, math.pi + (flapsDownStallSpeed/speedForWholeCircle)*math.pi*2, width)\n	\n	-- draw green arc\n	screen.setColor(0,200,0)\n	screen.drawCircleF(centerX, centerY, width/2.4)\n	screen.setColor(0,0,0)\n	screen.drawCircleF(centerX, centerY, width/2.6)\n	\n	clear(math.pi + (maxStructuralCruisingSpeed/speedForWholeCircle)*math.pi*2, math.pi + (flapsUpStallSpeed/speedForWholeCircle)*math.pi*2, width/1.068) -- for 2x2 screens use width/1.068, for 1x1 screens use width/1.04\n	\n	-- draw yellow arc\n	screen.setColor(200,200,0)\n	screen.drawCircleF(centerX, centerY, width/2.6)\n	screen.setColor(0,0,0)\n	screen.drawCircleF(centerX, centerY, width/2.8)\n	\n	clear(math.pi + (neverExceedSpeed/speedForWholeCircle)*math.pi*2, math.pi + (maxStructuralCruisingSpeed/speedForWholeCircle)*math.pi*2, width/1.105) -- for 2x2 screens use width/1.105, for 1x1 screens use width/1.08\n	\n	\n	-- draw grey lines\n	screen.setColor(50, 50, 50)\n	for i=flapsDownStallSpeed, speedForWholeCircle-flapsDownStallSpeed, speedForWholeCircle/20 do\n		p1 = rotatePoint(centerX, centerY, math.pi + i/speedForWholeCircle * math.pi * 2, centerX, centerY+height/2.5)\n		p2 = rotatePoint(centerX, centerY, math.pi + i/speedForWholeCircle * math.pi * 2, centerX, centerY+height/2.1)\n		screen.drawLine(p1.x, p1.y, p2.x, p2.y)\n	end\n	\n	-- draw numbers\n	screen.setColor(255, 255, 255)\n	for i=flapsDownStallSpeed, speedForWholeCircle-flapsDownStallSpeed, speedForWholeCircle/10 do\n		label = math.floor(i)\n		p = rotatePoint(centerX, centerY, math.pi + i/speedForWholeCircle * math.pi * 2, centerX, centerY+height/3.4)\n		screen.drawText(p.x - string.len(label)*1.5, p.y-4, label)\n		\n		-- draw white line\n		p1 = rotatePoint(centerX, centerY, math.pi + i/speedForWholeCircle * math.pi * 2, centerX, centerY+height/2.6)\n		p2 = rotatePoint(centerX, centerY, math.pi + i/speedForWholeCircle * math.pi * 2, centerX, centerY+height/2.1)\n		screen.drawLine(p1.x, p1.y, p2.x, p2.y)\n	end\n	\n	\n	screen.setColor(255,255,255)\n	screen.drawTextBox(centerX - width/2, centerY - height/2, width, height/4, "Airspeed", 0, 0)\n	\n	-- draw pointer\n	p = rotatePoint(centerX, centerY, math.pi + speed / speedForWholeCircle * math.pi *2, centerX, centerY+height/2.1)\n	screen.setColor(255,255,255)\n	screen.drawLine(centerX, centerY, p.x, p.y)\nend\n\nstep = math.pi/18\nfunction clear(fromAngle, toAngle, y)\n	print("clear", fromAngle, toAngle,y)\n	fromAngle = fromAngle % (math.pi*2)\n	toAngle = toAngle % (math.pi*2)\n	print("clear", fromAngle, toAngle,y)\n	angle = fromAngle\n	while angle < toAngle-step or angle > toAngle do\n		p1 = rotatePoint(centerX, centerY, angle-step/10, centerX, y)\n		p2 = rotatePoint(centerX, centerY, angle+step+step/10, centerX, y)\n		screen.setColor(0,0,0)\n		screen.drawTriangleF(centerX, centerY, p1.x, p1.y, p2.x, p2.y)\n		\n		angle = angle + step\n		if angle >= math.pi*2 then\n			angle = 0\n		end\n	end\nend\n\nfunction rotatePoint(cx, cy, angle, px, py)\n	s = math.sin(angle);\n	c = math.cos(angle);\n\n	--translate point back to origin:\n	px = px - cx;\n	py = py - cy;\n\n	-- rotate point\n	xnew = px * c - py * s;\n	ynew = px * s + py * c;\n\n	-- translate point back:\n	px = xnew + cx;\n	py = ynew + cy;\n	return {x=px, y=py}\nend\n'
			},{
				type: 'text',
				content: 'The white area is the speed you can fly with flaps down.\nThe green area is the speed you can fly with flaps up.\nThe yellow area is emergency speed, exceeding this speed will result in structural damage of the plane.\n\nAll the speeds for these areas can be set in the code.'
			}]
		},{
			title: 'Flying - Heading Overlay',
			contents: [{
				type: 'text',
				content: 'Overlays directions, similar to a compass. You can show a special direction marker (e.g. the direction to a waypoint).'
			},{
				type: 'text',
				content: '<span style="color: red">deg90InPixels</span>(line 30) defines how many degrees the whole monitor covers horizontally. By default it\'s 180°. This value depends on the zoom/fov of the camera.'
			},{
				type: 'code',
				content: 'y = 10\nty = 30\nw = 3\nh = 10\n\nhw = 1\nhh = 5\n\n\nscrWi = 0\nscrHe = 0\n\npixelOffset = 0\ndeg90InPixels = 0\n\ndir = 0\nmarkerdir = 0\nhasMarker = false\n\nfunction onTick()\n	dir = input.getNumber(1)-- -0.5 to 0.5\n	markerdir = input.getNumber(2)-- -0.5 to 0.5\n	hasMarker = input.getBool(2)\nend\n\nfunction onDraw()\n	scrWi = screen.getWidth()\n	scrHe = screen.getHeight()\n	pixelOffset = scrWi/2\n	deg90InPixels = scrWi/2-2-- means 90° equals half of the monitors width\n	printHeadingOverlay()\nend\n\nfunction printHeadingOverlay()\n	N = -4 * dir\n	NE = N + 0.5\n	E = N + 1\n	SE = N + 1.5\n	S = N + 2\n	SW = N + 2.5\n	W = N + 3\n	NW = N + 3.5\n\n	M = -4 * markerdir\n\n	N = normalize(N)\n	NE = normalize(NE)\n	E = normalize(E)\n	SE = normalize(SE)\n	S = normalize(S)\n	SW = normalize(SW)\n	W = normalize(W)\n	NW = normalize(NW)\n\n	M = normalize(M)\n	\n	Nx = math.floor(deg90InPixels * N) + pixelOffset\n	NEx = math.floor(deg90InPixels * NE) + pixelOffset\n	Ex = math.floor(deg90InPixels * E) + pixelOffset\n	SEx = math.floor(deg90InPixels * SE) + pixelOffset\n	Sx = math.floor(deg90InPixels * S) + pixelOffset\n	SWx = math.floor(deg90InPixels * SW) + pixelOffset\n	Wx = math.floor(deg90InPixels * W) + pixelOffset\n	NWx = math.floor(deg90InPixels * NW) + pixelOffset\n\n	Mx = math.floor(deg90InPixels * M) + pixelOffset\n	\n	setColor(255,0,0)\n	drawRect(Nx, y, w, h)\n	drawText("N", Nx-2, ty)\n	setColor(37,255,0)\n	drawRect(Ex, y, w, h)\n	drawText("E", Ex-2, ty)\n	drawRect(Sx, y, w, h)\n	drawText("S", Sx-2, ty)\n	drawRect(Wx, y, w, h)\n	drawText("W", Wx-2, ty)\n\n	setColor(37,255,0)\n	drawRect(NEx, y, hw, hh)\n	drawRect(SEx, y, hw, hh)\n	drawRect(SWx, y, hw, hh)\n	drawRect(NWx, y, hw, hh)\n\n	if hasMarker then\n		setColor(251,1,253)\n		drawRect(Mx, y, w, h)\n		drawText("M", Mx-2, ty)\n	end\nend\n\nfunction normalize(xIndex)\n	if xIndex > 2 or xIndex < -2 then\n		 return xIndex % 3  - math.floor(xIndex/3)\n	else\n		return xIndex\n	end\nend\n\nfunction setColor(r,g,b)\n	screen.setColor(r, g, b)\nend\n\nfunction drawRect(x, y, w, h)\n	screen.drawRectF(x, y, w, h)   \nend\n\nfunction drawText(txt, x, y)\n	if y > scrHe or y+h < 0 or x > scrWi or x < 0 then\n		return\n	end\n	screen.drawText(x, y, txt)\nend   '
			}]
		},{
			title: 'General Instruments (made by Tajin)',
			contents: [{
				type: 'text',
				content: 'Configurable Instruments with automatic resizing to fit monitor.'
			},{
				type: 'code',
				content: '-- Shorthands\nM=math\nsi=M.sin\nco=M.cos\npi=M.pi\npi2=pi*2\nS=screen\nI=input\nO=output\nC=S.setColor\nF=string.format\n\n-- Functions\nfunction clamp(a,b,c)\n	return M.min(M.max(a,b),c)\n	end\n\nfunction drawDial(x,y,r,inp,low,high,subs,title)\n	C(99,99,99) -- Set color\n	S.drawCircleF(x,y,r) -- draw filled circle as background\n	C(22,22,22)\n	S.drawCircle(x,y,r) -- draw outline\n	S.drawCircle(x,y,r*0.95) -- draw second outline, slightly smaller\n	\n	span = 0.75 -- use 3/4 of the circle for the dial\n	range = high - low -- get difference between max and min\n	\n	-- loop to draw subdivisions:\n	for i=0,1,1/subs do -- 10 is the number of lines on the dial\n		a = i*span-span/2 -- angle for the current subdivision\n		a = pi2*a -- to radians\n		r1 = r*0.8\n		r2 = r*0.95\n		S.drawLine(x+si(a)*r1,y-co(a)*r1,x+si(a)*r2,y-co(a)*r2)\n	end\n	\n	val = clamp(inp,low,high)\n	val = (val-low)/range -- convert into a 0-1 value\n	a = pi2*(val*span-span/2) -- angle of the needle\n	a1 = a+pi/2 -- +90° so i can draw the needle as a triangle\n	r1 = r*0.9 -- length of the needle\n	r2 = r*0.08 -- half width of the needle\n	C(66,0,0) -- Needle & Text color\n	S.drawTriangleF(x+si(a)*r1,y-co(a)*r1, x+si(a1)*r2,y-co(a1)*r2, x+si(a1)*-r2,y-co(a1)*-r2)\n	S.drawTextBox(x-r,y+r*0.3,r+r,20,F("%.1f",inp),0,0)\n	S.drawTextBox(x-r,y+r,r+r,20,title,0,0)\n	\n	C(22,22,22) S.drawCircleF(x,y,r*0.1) -- draw dot in the middle\n	end\n\n-- Main\nfunction onTick()\n	val1 = input.getNumber(1)\n	val2 = input.getNumber(2)\n	val3 = input.getNumber(3)\n	end\n\nfunction onDraw()\n	w,h=S.getWidth(),S.getHeight()\n	C(0,0,0) S.drawClear() -- fill screen black\n	\n	-- drawDial( xpos, ypos, radius, input, minimum, maximum, subdivisions, title )\n	drawDial(w/6*1, h/2 ,w/7, val1, 0, 100, 10, "Weight") -- left dial\n	drawDial(w/6*3, h/2 ,w/7, val2, 50, 100, 6, "Pressure") -- middle dial\n	drawDial(w/6*5, h/2 ,w/7, val3, -100, 100, 8, "Temp") -- right dial\n	end'
			},{
				type: 'text',
				content: 'In the last few lines of this code, you can configure sizes, min and max (and more) for each dial.'
			}]
		}]
	},{
		title: 'Frameworks (Collections of helpfull functions)',
		sections: [{
				title: 'Tajins Lua Framework',
				contents: [{
					type: 'text',
					content: 'This is a collection of helpfull functions (all in one place). Copy only what you need (e.g. 3d rotation)\n\nSource: <a href="http://rising.at/Stormworks/lua/framework.lua">rising.at/Stormworks/lua/framework.lua</a>'
				},{
					type: 'code',
					content: '-- shorcuts (remove what you don\'t need)\nM=math\nsi=M.sin\nco=M.cos\npi=M.pi\npi2=pi*2\n\nS=screen\ndL=S.drawLine\ndC=S.drawCircle\ndCF=S.drawCircleF\ndR=S.drawRect\ndRF=S.drawRectF\ndT=S.drawTriangle\ndTF=S.drawTriangleF\ndTx=S.drawText\ndTxB=S.drawTextBox\n\nC=S.setColor\n\nMS=map.mapToScreen\nSM=map.screenToMap\n\nI=input\nO=output\nP=property\nprB=P.getBool\nprN=P.getNumber\nprT=P.getText\n\ntU=table.unpack\n\n\n-- useful functions (remove what you don\'t need)\nfunction getN(...)local a={}for b,c in ipairs({...})do a[b]=I.getNumber(c)end;return tU(a)end\n-- get a list of input numbers\nfunction outN(o, ...) for i,v in ipairs({...}) do O.setNumber(o+i-1,v) end end\n-- set a list of number outputs\nfunction getB(...)local a={}for b,c in ipairs({...})do a[b]=I.getBool(c)end;return tU(a)end\n-- get a list of input booleans\nfunction outB(o, ...) for i,v in ipairs({...}) do O.setBool(o+i-1,v) end end\n-- set a list of boolean outputs\nfunction round(x,...)local a=10^(... or 0)return M.floor(a*x+0.5)/a end\n-- round(x) or round(x,a) where a is the number of decimals\nfunction clamp(a,b,c) return M.min(M.max(a,b),c) end\n-- limit a between b and c\nfunction inRect(x,y,a,b,w,h) return x>a and y>b and x<a+w and y<b+h end\n-- check if x,y is inside the rectangle a,b,w,h\nfunction rot3D(x,y,z,a,b,c) return {(co(b)*co(c)*x)+(-co(a)*si(c)+si(a)*si(b)*co(z))*y+(si(a)*si(c)+co(a)*si(b)*co(c))*z,(co(b)*si(c)*x)+(co(a)*co(c)+si(a)*si(b)*si(c))*y+(-si(a)*co(c)+co(a)*si(b)*si(c))*z,-si(b)*x+si(a)*co(b)*y+co(a)*co(b)*z} end\n-- rotate point x,y,z around by a,b,c and return the resulting position\n\n-- touch handling (remove if you don\'t need it)\nTOUCH = {\n	{5,5,30,10,"1"}, --Button1\n	{5,20,30,10,"2"}, --Button2\n	{5,35,30,10,"text",0,0}, --Button3\n}\nact = {}\nbtn = {}\n\ntest = 0\nact[3] = function(i) -- function for button 3, executed on click\ntest = test+1\nend\n --\n\nfunction onTick()\n	myNumVar,myOtherNum = getN(10,15)\n	myBoolVar,myOtherBool = getB(5,9)\n\n	-- touch handling (remove if you don\'t need it)\n	w,h,tx,ty=getN(1,2,3,4,5,6);t1,t2=getB(1,2)\n\n	for i,t in ipairs(TOUCH) do\n		b = btn[i] or {}\n		if inRect(tx,ty,t[1],t[2],t[3],t[4]) then\n			b.click = t1 and not b.hold\n			b.hold = t1\n			if b.click then\n				b.toggle = not b.toggle\n				if act[i] then act[i](i) end\n			end\n		else\n				b.hold = false\n		end\n		btn[i] = b\n	end\n--\n\noutN(11, myNumVar,myOtherNum) -- output to 11 and 12\noutB(1, true,false)\nend\n\nfunction onDraw()\n	if t1==nil then return true end -- safety check to make sure variables are set\n	w = S.getWidth()\n	h = S.getHeight()\n	cx,cy = w/2,h/2 -- coordinates of the screen center (always useful)\n\n	for i,t in ipairs(TOUCH) do -- loop through defined buttons and render them\n		C(20,20,20)\n		if btn[i].hold then C(80,80,80) end -- color while holding the button\n		dRF(tU(t,1,4)) -- draw button background (tU outputs the first 4 values from the button as parameters here)\n		C(255,0,0)\n		if btn[i].toggle then C(0,255,0) end -- text green if button is toggled on\n		dTxB(tU(t)) -- draw textbox with the button text\n	end\n\n	C(255,255,255)\n	dTx(cx,cy,test) -- test output for the function of button 3\nend'
				}]
			}]
	}]

	const CHAPTERS_LEARN = [{
		title: 'Lua Basics (Learn)',
		sections: [{
			title: 'Values and Types',
			contents: [{
				type: 'text',
				content: 'The type of a variable is set automatically depending on the value.\nPossible types are: nil, boolean, number, string, function, table.\nnil can only be nil'
			},{
				type: 'code',
				content: 'variable = nil'
			},{
				type: 'text',
				content: 'booleans can be either true or false'
			},{
				type: 'code',
				content: 'variable = true\nvariable = false'
			},{
				type: 'text',
				content: 'numbers can be any numeric value (including floats)'
			},{
				type: 'code',
				content: 'variable = 0\nvariable = -123456789\nvariable = 0.6666'
			},{
				type: 'text',
				content: 'strings are empty strings, one or more characters.'
			},{
				type: 'code',
				content: 'variable = ""\nvariable = "Hello World!"\nvariable = "this is a quote: \\" "'
			},{
				type: 'text',
				content: 'functions are variables too. Read more about functions later!'
			},{
				type: 'code',
				content: 'function func()\n return "hello"\nend'
			},{
				type: 'text',
				content: 'tables are arrays or key -> value maps.'
			},{
				type: 'code',
				content: 'variable = {"a", "b"}\n-- variable[1] is "a"\n\nvariable = {a="hello", b="goodbye"}\n-- variable["a"] is "hello"\n-- variable.a is "hello"'
			}]
		},{
			title: 'Conditions if/else and expressions',
			contents: [{
				type: 'text',
				content: 'This is used to execute different code depending on a condition. Any variable or expression can be used as a condition:'
			},{
				type: 'code',
				content: 'if condition then\n    -- execute if condition is true\nelse\n    -- execute if condition is false\nend'
			},{
				type: 'text',
				content: 'Conditions / Expressions:'
			},{
				type: 'code',
				content: 'true --> true'
			},{
				type: 'code',
				content: '1 > 2 --> false'
			},{
				type: 'code',
				content: '1 < 2 => true -- less than'
			},{
				type: 'code',
				content: '2 == 2 => true -- equal'
			},{
				type: 'code',
				content: '3 >= 2 => true -- greater or equal'
			},{
				type: 'code',
				content: '3 <= 2 => false -- less or equal'
			},{
				type: 'code',
				content: 'nil => false -- nil equals to false, anything else (tables, numbers, string) ALWAYS equal true'
			},{
				type: 'code',
				content: '{} => true'
			},{
				type: 'code',
				content: '-1 => true'
			},{
				type: 'code',
				content: '"" => true'
			},{
				type: 'text',
				content: 'you can combine expressions with the keywords "not", "and", "or"'
			},{
				type: 'code',
				content: 'false or true => true'
			},{
				type: 'code',
				content: 'false and true => false'
			},{
				type: 'code',
				content: 'not true = false'
			},{
				type: 'code',
				content: '(false or true) and true => false'
			},{
				type: 'code',
				content: '(false and true) or (true and true) => true'
			},{
				type: 'text',
				content: 'Example:'
			},{
				type: 'code',
				content: 'a = 4\nif a <= 3 then\n    print("number less then or equal 3")\nelse\n    print("number greater then 3")\nend'
			}]
		},{
			title: 'Functions',
			contents: [{
				type: 'text',
				content: 'Functions are small programs inside your main program. They are usefull when you do similar things multiple times. Functions can return a value but they do not have to. They can also accept arguments.'
			},{
				type: 'code',
				content: 'varA = 5 .. "% battery"\nvarB = 10 .. "% battery"'
			},{
				type: 'text',
				content: 'This can be replaced with a function (in this case we do not save characters, but our code is easier to maintain which i will explain below)'
			},{
				type: 'code',
				content: 'varA = makeBatteryString(5)\nvarB = makeBatteryString(10)\n\nfunction makeBatteryString(percent)\n    return percent .."% battery"\nend'
			},{
				type: 'text',
				content: 'When you now want to change the string "battery" to "Bat." there is only one place where you have to change the code.\n\nIn this example our code got quite big, but in most cases, using functions will make your code shorter (see example bellow).'
			},{
				type: 'code',
				content: '-- long and ugly:\nscreen.setColor(1,1,1)\nscreen.drawRect(1,2,3,4)\nscreen.setColor(2,2,2)\nscreen.drawRect(5,6,7,8)\nscreen.setColor(3,3,3)\nscreen.drawRect(9,10,11,12)\nscreen.setColor(4,4,4)\nscreen.drawRect(13,14,15,16)\n\n\n-- shorter and beautifull:\nsC(1,1,1)\nsR(1,2,3,4)\nsC(2,2,2)\nsR(5,6,7,8)\nsC(3,3,3)\nsR(9,10,11,12)sC(4,4,4)\nsR(13,14,15,16)\nfunction sC(r,g,b)\n   screen.setColor(r,g,b)\nend\n\nfunction sR(x,y,w,h)\n   screen.drawRect(x,y,w,h)\nend'
			}]
		},{
			title: 'Loops',
			contents: [{
				type: 'text',
				content: 'The "while" loop:'
			},{
				type: 'code',
				content: 'myTable = {true, true, true, false}\n\ni=1\nwhile i < 2 do -- as long as the i < 2 the loop will run, if that is not the case, the loop will exit.\n    -- this line is called twice\n\n    i = i + 1\nend\n-- i is now 2\n\n'
			},{
				type: 'text',
				content: 'Similar to the while loop is the "for" loop. It can do exactly the same (increment a number):'
			},{
				type: 'code',
				content: 'for i=1,2 do\n    -- this line is called twice\nend'
			},{
				type: 'text',
				content: 'You can manually set a step for the loop:'
			},{
				type: 'code',
				content: 'for i=1,2,0.5 do\n    -- this line is called 4 times\nend'
			},{
				type: 'text',
				content: 'And you can choose a different max, even negative (but dont forget to choose a negative step too).'
			},{
				type: 'code',
				content: 'for i=1,-5,-1 do\n    -- this line is called 7 times\nend'
			},{
				type: 'text',
				content: 'You can also loop over the entries of a table:'
			},{
				type: 'code',
				content: 'myTable = {"a","b","c"}\nfor k,v in ipairs(myTable) do\n    -- this line will be called 3 times:\n    -- 1. k=1, v="a"\n    -- 2. k=2, v="b"\n    -- 3. k=3, v="c"\nend'
			}]
		},{
			title: 'Scope',
			contents: [{
				type: 'text',
				content: 'In lua, every variable, function, ... can be <i>local</i> or <i>global</i>.\n<i>local</i> variables can only be used inside the same scope, global variables can be used everywhere. In Stormworks, locals are not important, because every lua script is standalone (sandboxed).'
			},{
				type: 'code',
				content: 'local a=1\nfunction test()  -- this function can access a\n   print(a)\nend\n\nlocal function test2()  -- this function can access a too\n    print(a)\nend\n\n'
			},{
				type: 'code',
				content: 'function test()  -- this function can access a\n  local a=1\n print(a)\nend\n\nlocal function test2()  -- this function can NOT access a \n   print(a)  -- error\nend\n\n'
			},{
				type: 'text',
				content: 'Important: the onDraw() and onTick() function must be global!\n<i>local</i> variables and functions must be declared before they can be used:'
			},{
				type: 'code',
				content: 'local function a()\n  print("test")\nend\n\nfunction onDraw()\n   a()  -- works\nend'
			},{
				type: 'code',
				content: 'function onDraw()\n   a()  -- error: a not found\nend\n\nlocal function a()\n ...\nend'
			}]
		},{
			title: 'Formatting',
			contents: [{
				type: 'text',
				content: 'string.format() can be used to construct strings'
			},{
				type: 'code',
				content: 'string.format("%s %q", "Hello", "Lua user!")   -- string and quoted string   Hello "Lua user!"'
			},{
				type: 'text',
				content: 'it can also be used to convert numbers to numbers with a defined amount of decimals (e.g. 1.2345678 => 1.23)'
			},{
				type: 'code',
				content: 'string.format("%.2f", 1.23456789)  -- only print 2 decimals   1.23'
			},{
				type: 'text',
				content: 'It can also be used to construct strings'
			},{
				type: 'code',
				content: 'string.format("%o", -100)  -- octal   37777777634\nstring.format("%x", -100)  -- hexadecimal   ffffff9c\nstring.format("%X", -100)  -- hexadecimal   FFFFFF9C'
			}]
		}]
	},{
		title: 'Stormworks API (Learn)',
		sections: [{
			title: 'onTick / onDraw',
			contents: [{
				type: 'text',
				content: 'The onTick() <keyword>function</keyword> will be called everytime the games physics engine does a calculation. The calculation includes forces, electricity, movement and also logic states.\nUsually the function is being called 60 times a second. Everything that interacts with other logic components (input, output, property) must be calculated within this function! When the game pauses this function will not be called.'
			},{
				type: 'text',
				content: 'The onDraw() <keyword>function</keyword> is slightly different. It will also be called 60 times per second or less (that is your FPS). Everything related to "draw on screen" must be done inside this function. This function will still be called while the game is paused!'
			}]
		},{
			title: 'input, output, property',
			contents: [{
				type: 'text',
				content: 'The <obj>input</obj> object offers methods to read values from the composite connected to the lua script component.'
			},{
				type: 'code',
				content: '-- get number on composite channel 5\ninputChannel5 = input.getNumber(5)\n\n-- get boolean on composite channel 10\ninputChannel10 = input.getBool(10)'
			},{
				type: 'text',
				content: 'The <obj>output</obj> object offers methods to write values to the composite connected to the lua script component.'
			},{
				type: 'code',
				content: '-- set number on composite channel 5\nvalue = 42\noutput.setNumber(5, value)\n\n-- set boolean on composite channel 10\nvalue = true\noutput.setBool(10, value)'
			},{
				type: 'text',
				content: 'The <obj>property</obj> object offers methods to read values from property components that are in the same microcontroller.'
			},{
				type: 'code',
				content: '-- get number of a number property called "blubb"\npropertyText = property.getText("blubb")'
			}]
		},{
			title: 'Draw stuff onto the screen',
			contents: [{
				type: 'text',
				content: 'Drawing stuff onto the screen is done by calling methods of the <obj>screen</obj> object.\nBefore you draw you set the color of your "drawing tool".\nShapes will be drawn above each other (last one drawed is on top).\nExamples:\n'
			},{
				type: 'code',
				content: '-- draw a red circle (not filled)\n\n-- set paint color to red\n-- screen.setColor(r, g, b)\nscreen.setColor(255,0,0)\n\n-- screen.drawCircle(x, y, radius)\nscreen.drawCircle(20,15, 4)'
			},{
				type: 'code',
				content: '-- draw a green Triangle (filled)\n\n-- set paint color to green\n-- screen.setColor(r, g, b)\nscreen.setColor(0,255,0)\n\n-- screen.drawTriangleF(x1, y1, x2, y2, x3, y3)\nscreen.drawTriangleF(3,4,15,10,3,20)'
			},{
				type: 'text',
				content: 'The map is a special case. Instead of drawing a single shape onto the screen, it will paint a map of the world onto the whole screen.\nIf you want to draw shapes on top of the map, draw them after you draw the map.\nThe colors of the map can be adjust by calling one of the screen.setMapColorXXX() functions.'
			},{
				type: 'code',
				content: '--screen.drawMap(gpsX, gpsY, zoom)\n-- zoom ranges from 0.1 to 50\nscreen.drawMap(4000,1234,1)'
			}]
		},{
			title: 'Touchscreen',
			contents: [{
				type: 'text',
				content: 'The composite output from the monitors contains data that can be interpreted in your script to create touchscreens. The layout of the composite data is as follows:'
			},{
				type: 'text',
				content: '<b>Number Channels</b><ol><li>monitorResolutionX</li><li>monitorResolutionY</li><li>input1X</li><li>input1Y</li><li>input2X</li><li>input2Y</li></ol>'
			},{
				type: 'text',
				content: '<b>On/Off Channels</b><ol><li>isInput1Pressed</li><li>isInput2Pressed</li></ol>'
			},{
				type: 'text',
				content: 'Hint: As long as an input is pressed the x and y coordinated will not change! This means you cannot implement drag functionality!'
			}]
		}]
	},{
		title: 'Advanced Stuff (Learn)',
		sections: [{
			title: 'Trigonometry (2D and 3D calculations)',
			contents: [{
				type: 'text',
				content: 'The most important thing is the rotation of a point around another point:'
			},{
				type: 'code',
				content: '-- cx => x of rotation center\n-- cy => y of rotation center\n-- angle => the angle of rotation in radians (2pi = 360degree)\n-- x => x of point to rotate\n-- y => y of point to rotate\n\nfunction rotatePoint(cx, cy, angle, px, py)\n s = math.sin(angle);\n  c = math.cos(angle);\n\n    --translate point back to origin:\n px = px - cx;\n py = py - cy;\n\n   -- rotate point\n   xnew = px * c - py * s;\n   ynew = px * s + py * c;\n\n -- translate point back:\n  px = xnew + cx;\n   py = ynew + cy;\n   return {x=px, y=py}\nend'
			},{
				type: 'text',
				content: 'Example usage: continuisly rotate a circle around the center of the screen.'
			},{
				type: 'code',
				content: 'angle = 0\nfunction onDraw()\n    angle = angle + 0.05\n  if angle > math.pi*2 then\n     angle = 0\n end\n   p = rotatePoint(screen.getWidth()/2, screen.getHeight()/2, angle, screen.getWidth()/2, screen.getHeight()/4)\n  screen.setColor(255,0,100)\n    screen.drawCircle(p.x, p.y, 5)\nend\n\nfunction rotatePoint(cx, cy, angle, px, py)\n    s = math.sin(angle);\n  c = math.cos(angle);\n\n    --translate point back to origin:\n px = px - cx;\n py = py - cy;\n\n   -- rotate point\n   xnew = px * c - py * s;\n   ynew = px * s + py * c;\n\n -- translate point back:\n  px = xnew + cx;\n   py = ynew + cy;\n   return {x=px, y=py}\nend'
			}]
		},{
			title: 'Randomness',
			contents: [{
				type: 'text',
				content: 'To create random numbers you can use the "math.random()" functions.\nThe random numbers are distributed uniformly (which means each number will be generated in about the same amount as every other number over a couple of calls)\nThere are three options to call the function:\n<ul><li>math.random()    returns a number between 0 and 1</li><li>math.random(x)    returns a whole number between 1 and x (both inclusive)</li><li>math.random(x, y)    returns a whole number between x and y both inclusive)</li></ul>'
			},{
				type: 'text',
				content: 'In this example we will call math.random() multiple times and draw the distribution as a graph\nHINT: Input channel 1 is how often random is called for value entry in the graph.\ne.g. random is called 100 times and 53 times the result is 0, then the 0-graph (color red) will be at 53% of the screen height, while the result is only 47 times a 1, that means the 1-graph (green color) is only 47% of the screens height.'
			},{
				type: 'code',
				content: 'results = {}\n\ncolors = {{255,0,0}, {0,255,0}, {0,0,255}, {255, 255, 0}, {0, 255, 255}, {255, 0, 255}} -- colors for the \n\nmin = 0 -- minimum of math.random()\nmax = 2 -- maximum of math.random() ADD MORE COLORS IF VALUE IS ABOVE 5!!!!\n\nframeCounter = 0\ncallsPerFrame = 15 -- how often math.random is called per pixel in the graph\n\nfunction onTick()\n   callsPerFrame = input.getNumber(1)\nend\n\nfunction createRandoms()\n   -- setup results table\n    results[frameCounter] = {cpf=callsPerFrame}\n   for i=min, max do\n     results[frameCounter][i] = 0\n  end\n   -- generate random results\n    for i=1, callsPerFrame do\n     rand = math.random(min, max)\n      results[frameCounter][rand] = results[frameCounter][rand] + 1\n end\nend\n\nfunction onDraw()\n print("creating randoms for frame "..frameCounter)\n    createRandoms()\n   \n  -- draw graph\n for i=frameCounter-screen.getWidth(), frameCounter-1 do\n       if i >= 0 and i - frameCounter + screen.getWidth() >= 15 then\n         for r=min, max do\n             value = results[i][r] / results[i]["cpf"]\n             valueAfter = results[i+1][r] / results[i+1]["cpf"]\n                screen.setColor(colors[r+1][1], colors[r+1][2], colors[r+1][3])\n               screen.drawLine(i - frameCounter + screen.getWidth(), screen.getHeight() * (1 - value), i + 1 - frameCounter + screen.getWidth(), screen.getHeight() * (1 - valueAfter))\n          end\n       end\n   end\n   screen.setColor(255, 255, 255)\n    screen.drawText(1, screen.getHeight()*(1-0.75), "75%")\n    screen.drawText(1, screen.getHeight()*(1-0.5), "50%")\n screen.drawText(1, screen.getHeight()*(1-0.25), "25%")\n    \n  frameCounter = frameCounter + 1\nend\n'
			},{
				type: 'text',
				content: 'as you can see: the more often we call math.random() the more even the distribution of 1\'s and 0\'s get. Can be seen because both graphs are close to 50%.'
			},{
				type: 'text',
				content: 'Experiment with more then two possible random numbers by changing "max", BUT DONT GO OVER 5!'
			}]
		},{
			title: 'Information for Multiplayer',
			contents: [{
				type: 'text',
				content: 'The problem when using scripts in multiplayer games: the scripts do run on every client.\nThat means players can have different behaviour.'
			},{
				type: 'text',
				content: 'Since the inputs and outputs of logic components are still synchronized and calculated on the server, some parts of your vehicle may be totally in sync (e.g. the length of a winch) but your screens may look different.\nThis is also the case for camera signals shown on monitors.'
			}]
		}]
	}]


	LOADER.on(LOADER.EVENT.UI_READY, init)

	function init(){

		UI.viewables()['viewable_examples'].onGainFocus(()=>{
			REPORTER.report(REPORTER.REPORT_TYPE_IDS.openLearnAndExamples)
		})

		UI.viewables()['viewable_learn'].onGainFocus(()=>{
			REPORTER.report(REPORTER.REPORT_TYPE_IDS.openLearnAndExamples)
		})

		UI.viewables()['viewable_examples'].onViewableResize(resizeCodeBlocks)

		UI.viewables()['viewable_learn'].onViewableResize(resizeCodeBlocks)

		build(CHAPTERS_EXAMPLE, $('#examples'))

		build(CHAPTERS_LEARN, $('#learn'))

		resizeCodeBlocks()

		LOADER.done(LOADER.EVENT.EXAMPLES_READY)
	}

	function build(chapters, container){
		for(let ch of chapters){
			let chapter = $('<div class="chapter"><div class="chapter_head"><div class="chapter_title">' + ch.title + '</div></div><div class="chapter_body"></div></div>')
			for(let ex of ch.sections){
				let section = $('<div class="section"><div class="section_head"><div class="section_title">' + ex.title + '</div></div><div class="section_body"></div></div>')
				for(let co of ex.contents){
					let c
					switch(co.type){
						case 'text': {
							c = $('<div class="part_text">' + co.content + '</div>')
						}; break;
						case 'code': {
							c = $('<div class="part_code">' + co.content.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>')

							let editor = ace.edit(c.get(0),{
								maxLines: 50
							});
							editor.setTheme("ace/theme/pony_ide");
							editor.session.setMode("ace/mode/lua");
							editor.session.setUseSoftTabs(false); 
							editor.setReadOnly(true)
							c.prop('editor', editor)
							c.get(0).editor = editor
						}; break;
						default: {
							c = $('<div style="background: red; color: white">Unknown content type "' + co.type + '"</div>')
						}
					}
					section.find('.section_body').append(c)
				}
				section.find('.section_head').on('click', ()=>{
					let wasopen = false
					if(section.hasClass('open')){
						wasopen = true
					}
					container.find('.section.open').removeClass('open')
					if(!wasopen){
						section.addClass('open')
					}
				})

				chapter.find('.chapter_body').append(section)
			}

			chapter.find('.chapter_head').on('click', ()=>{
				let wasopen = false
					if(chapter.hasClass('open')){
						wasopen = true
					}
					container.find('.chapter.open').removeClass('open')
					if(!wasopen){
						chapter.addClass('open')
					}
			})

			container.append(chapter)
		}
	}
	
	function resizeCodeBlocks(){
		$('.chapter_container .part_code').each((i, elem)=>{
			if(elem.editor){
				elem.editor.resize()
			}
		})
	}

	return {
	}

})(jQuery)

;
class Editor extends DynamicSizedViewableContent {
    constructor(container, viewable){
        super(container, viewable)

        this.editor = ace.edit(this.dom.get(0))
        this.editor.setTheme("ace/theme/pony_ide")
        this.editor.session.setMode("ace/mode/lua")
        this.editor.session.setUseSoftTabs(false)

        this.dom.append( $('<div class="code_lock">') )
        this.dom.append( $('<div class="autocompletion_container">') )

        this.autocomplete = new Autocomplete(this.editor, this.dom)

        this.oldHeight = 0
        
        this.editor.on('change', ()=>{
            this.refreshCharacterCount()
            this.editor.getSession().setAnnotations([])
        })
        this.refreshCharacterCount()

        this.editor.selection.on('changeCursor', ()=>{
            this.refreshPositionHint()
        })
        this.refreshPositionHint()

        this.addEditorControls()

        EDITORS.registerEditor(this, this.name())

        viewable.onGainFocus(()=>{
            EDITORS.setActiveEditor(this.name())
        })

        let tempFunc = this.refreshSize        
        this.refreshSize = ()=>{
            tempFunc.call(this)
            this.editor.resize()
        }
    }

    name(){
        return this.dom.attr('code-field')
    }

    addEditorControls(){
        let fontMinus = $('<span class="font_minus icon-minus"></span>')
        fontMinus.on('click', ()=>{
            EDITORS.decreaseEditorFontSize()
        })            
        this.dom.append(fontMinus)


        let fontPlus = $('<span class="font_plus icon-plus"></span>')
        fontPlus.on('click', ()=>{
            EDITORS.increaseEditorFontSize()
        })
        this.dom.append(fontPlus)


        let fullscreen = $('<span class="fullscreen_toggle icon-enlarge"></span>')
        fullscreen.on('click', ()=>{
            if(this.dom.hasClass('fullscreen')){
                this.leaveFullscreen()
            } else {
                this.enterFullscreen()
            }
        })
        this.dom.on('keydown', (e)=>{
            if (e.keyCode === 27){//esc
                if(this.dom.hasClass('fullscreen')){
                    this.leaveFullscreen()
                }
            }
        })
        this.dom.append(fullscreen)
        this.editor.setShowPrintMargin(false)
    }

    enterFullscreen(){
        this.oldHeight = this.dom.height()
        this.dom.addClass('fullscreen')
        this.dom.height($(window).height())
        this.editor.resize()
    }

    leaveFullscreen(){        
        this.dom.removeClass('fullscreen')
        this.dom.height(this.oldHeight)
        this.editor.resize()
    }

    refreshCharacterCount(){
        let chars = this.countCharacters(this.editor.getValue())
        
        let max = STORAGE.getConfiguration('settings.servermode') ? 65536 : 4096

        this.viewable.dom.find('.charactercount').html(chars + '/' + max)
        if(chars >= max){
             this.viewable.dom.find('.charactercount').addClass('limit')
        } else {
             this.dom.find('.charactercount').removeClass('limit')
        }
    }

    refreshPositionHint(){
        let pos = this.editor.getCursorPosition()
        let chars = this.editor.session.doc.positionToIndex(pos)
        
        this.viewable.dom.find('.selection-information').html('Line ' + (pos.row + 1) + ', Column ' + (pos.column + 1) + ', Char ' + chars)
    }

    countCharacters(str){
        return typeof str === 'string' ? str.length : 0
    }

    markError(line, text){
        this.editor.gotoLine(line, 0, true)
        this.editor.getSession().setAnnotations([{
          row: line-1,
          column: 0,
          text: text, 
          type: "error"
        }])
    }

    unmarkError(){
        this.editor.getSession().setAnnotations([])
    }
}

EDITORS = (()=>{
    "use strict";

    let editors = {}
    let activeEditor

    const DEFAULT_EDITOR_FONTSIZE = 12

    LOADER.on(LOADER.EVENT.UI_READY, init)

    function init(){
        refreshEditorFontSize()

        LOADER.done(LOADER.EVENT.EDITORS_READY)
    }

    function registerEditor(editor, name){
        editors[name] = editor

        if(!activeEditor){
            activeEditor = name
        }
    }

    function setActiveEditor(name){
        if(!editors[name]){
            throw 'editor is unknown: "' + name + '"'
        }
        activeEditor = name
    }

    function setEditorFontSize(fontsize){
        if(fontsize < 3){
            fontsize = 3
            saveEditorFontSize(fontsize)
        }
        if(fontsize > 100){
            fontsize = 100
            saveEditorFontSize(fontsize)
        }
        for(let e of Object.keys(editors)){
            editors[e].editor.setFontSize(fontsize)
        }
    }

    function loadEditorFontSize(){
        return STORAGE.getConfiguration('editorFontSize')
    }

    function saveEditorFontSize(fontsize){
        STORAGE.setConfiguration('editorFontSize', fontsize)
    }

    function increaseEditorFontSize(){
        let fontsize = parseInt(loadEditorFontSize())
        if(typeof fontsize !== 'number' || isNaN(fontsize) || fontsize === 0){
            fontsize = DEFAULT_EDITOR_FONTSIZE
        }
        fontsize = fontsize + Math.max(1, Math.floor(fontsize/10))
        setEditorFontSize(fontsize)
        saveEditorFontSize(fontsize)
    }

    function decreaseEditorFontSize(){
        let fontsize = parseInt(loadEditorFontSize())
        if(typeof fontsize !== 'number' || isNaN(fontsize) || fontsize === 0){
            fontsize = DEFAULT_EDITOR_FONTSIZE
        }
        fontsize = fontsize - Math.max(1,Math.floor(fontsize/10))
        setEditorFontSize(fontsize)
        saveEditorFontSize(fontsize)
    }

    function refreshEditorFontSize(){        
        let fontsize = parseInt(loadEditorFontSize())
        if(typeof fontsize !== 'number' || isNaN(fontsize) || fontsize === 0){
            fontsize = DEFAULT_EDITOR_FONTSIZE
        }
        setEditorFontSize(fontsize)
    }

    function resize(){
        for(let e of Object.keys(editors)){
            editors[e].refreshSize()
        }
    }

    function refreshCharacterCounts(){
        for(let e of Object.keys(editors)){
            editors[e].refreshCharacterCount()
        }
    }

    function resetErrorMarkers(){
        for(let e of Object.keys(editors)){
            editors[e].unmarkError()
        }
    }

    return {
        registerEditor: registerEditor,
        setActiveEditor: setActiveEditor,
        getActiveEditor: ()=>{return editors[activeEditor]},
        get: (name)=>{return editors[name]},
        resize: resize,
        refreshCharacterCounts: refreshCharacterCounts,
        increaseEditorFontSize: increaseEditorFontSize,
        decreaseEditorFontSize: decreaseEditorFontSize,
        resetErrorMarkers: resetErrorMarkers
    }
})()




;
class Autocomplete {
    constructor(editor, codeField){
        this.editor = editor
        this.codeField = $(codeField)

        this.autocompletitionIsShown = false
        this.currentAutocomplete = undefined

        this.editor.commands.addCommand({
            name: 'autocompletition',
            bindKey: {win: 'Ctrl-Space',  mac: 'Command-Space'},
            exec: ()=>{
                this.suggestAutocomplete()
            },
            readOnly: false
        })

        this.codeField.contextmenu((e)=>{
            e.preventDefault()
            e.stopImmediatePropagation()
           
            this.suggestAutocomplete()
        })
    }

    suggestAutocomplete(){
        let pos = this.editor.getCursorPosition()
        if(!pos){
            return
        }
        let word = this.getWordInFrontOfPosition(pos.row, pos.column)
        let [autocompletions, part] = this.getAutocompletions(word)
        console.log('suggestAutocomplete(' + word + ')', autocompletions)
        this.showAutocompletions(this.codeField.find('.autocompletion_container'), autocompletions, part)
    }

    getWordInFrontOfPosition(row, column){
        let line = this.editor.session.getLine(row)
        let lineUntilPosition = line.substring(0, column)
        let matches = lineUntilPosition.match(/(.*[\s;\),\(\+\-\*\/\%\=\[\]#])?([^\s\(]*)/)
        if(matches instanceof Array === false || matches.length !== 3){
            return ''
        }
        return matches[2]
    }

    getAutocompletions(text){
        let parts = text.split('.').reverse()
        let tmp = JSON.parse(JSON.stringify(DOCUMENTATION.getParsed()))

        let keywords = this.getKeywordsFromCode()
        for(let k of Object.keys(keywords)){
            tmp.children[k] = keywords[k]
        }
        let node = tmp
        let partLeft = ''
        let path = ''
        while(parts.length > 0){
            let p = parts.pop()
            if(parts.length > 0 && node.children && node.children[p]){
                path += '.' + p
                node = node.children[p]
            } else {
                partLeft = partLeft.length === 0 ? p : partLeft + '.' + p
            }
        }

        path = path.substring(1)

        let ret = []
        if(node.children){
            for(let [key, value] of Object.entries(node.children)) {
              if(!partLeft.length > 0 || key.indexOf(partLeft) === 0){                
                ret.push({name: key, type: value.type, lib: value.lib, url: value.url, args: value.args, description: value.description || '...', full: path + '.' + key})
              }
            }
        }

        ret.sort((a,b)=>{
            if(a.lib > b.lib){
                return 1
            }

            if(a.lib < b.lib){
                return -1
            }

            /* else: same lib */

            if(a.name > b.name){
                return 1
            }

            if(a.name < b.name){
                return -1
            }

            return 0
        })

        return [ret, partLeft]
    }

    getKeywordsFromCode(){
        let ret = {}

        let code = this.editor.getValue()
        if(typeof code === 'string'){
            let vars = [...code.matchAll(/[\s;]?([a-zA-Z0-9\._]+)[\s]*?=/g)]
            let functionHeads = [...code.matchAll(/function[\s]+[\w_\.]+[\s]*\([\s]*([^\)]+)[\s]*\)/g)]
            let functionArguments = []
            for(let fh of functionHeads){
                let split = fh[1].replace(/\s/g, '').split(',')
                for(let s of split){
                    functionArguments.push({
                        0: fh[0],
                        1: s,
                        index: fh.index,
                        input: fh.input,
                        length: 2
                    })
                }
            }
            let functions = [...code.matchAll(/function[\s]+([\w_\.]+)[\s]*\(([^\)]*)\)/g)]

            let that = this

            addToRet(vars, DOCUMENTATION.TV)
            addToRet(functions, DOCUMENTATION.TF)
            addToRet(functionArguments, DOCUMENTATION.TA)

            function addToRet(matches, type){

                for(let m of matches){
                    let parts = m[1].split('.').reverse()

                    let args = []

                    if(typeof m[2] === 'string' && m[2] !== ''){
                        let argMatches = m[2].split(',')
                    
                        for(let am of argMatches){
                            args.push({name: am.trim()})
                        }
                    }

                    let documentPosition = that.editor.session.getDocument().indexToPosition(m.index+1, 0)

                    let node = ret

                    while(parts.length > 0){
                        let p = parts.pop()
                        if(!node[p]){
                            if(parts.length > 0){//has children
                                node[p] = {
                                    type: DOCUMENTATION.TO,
                                    lib: 'user',
                                    description: 'Defined on LINE ' + (1 + documentPosition.row),
                                    children: {}
                                }
                                node = node[p].children
                            } else {
                                node[p] = {
                                    type: type,
                                    lib: 'user',
                                    description: 'Defined on LINE ' + (1 + documentPosition.row)
                                }
                                if(type == DOCUMENTATION.TF){
                                    node[p].args = args
                                }
                                node = node[p]
                            }
                        } else {
                            if(parts.length > 0){
                                if(!node[p].children){
                                    node[p] = {
                                        type: DOCUMENTATION.TO,
                                        lib: 'user',
                                        description: 'Defined on LINE ' + (1 + documentPosition.row),
                                        children: {}
                                    }
                                }
                                node = node[p].children
                            } else {
                                node = node[p]                                
                            }
                        }
                    }
                }
            }
        }
        return ret
    }    

    showAutocompletions(container, completions, part){
        REPORTER.report(REPORTER.REPORT_TYPE_IDS.openAutocomplete)

        if(this.autocompletitionIsShown){
            this.closeAutocomplete()
        }
        this.autocompletitionIsShown = true

        let $c = $(container)
        $c.html('')

        this.currentAutocomplete = new AutocompletitionElement(completions, part, this)

        $c.append(this.currentAutocomplete.getDom())

        let cursor = this.codeField.find('.ace_cursor').offset()
        let containerpos = this.codeField.offset()

        let top = cursor.top - containerpos.top
        let left = cursor.left - containerpos.left
        if(left + $c.width() > $(window).width()){
            left = left - $c.width()
        }

        $c.css({
            'top': top,
            'left': left + 3,
            'font-size': this.codeField.css('font-size')
        })
    }

    closeAutocomplete(){
        console.log('closing currentAutocomplete')
        this.autocompletitionIsShown = false
        this.codeField.find('.autocompletion_container').html('')
        this.currentAutocomplete = null
        this.editor.focus()
    }
}







function AutocompletitionElement(completions, part, autocomplete){
    this.autocomplete = autocomplete
    this.$dom = $('<div class="autocompletition"></div>')
    this.$list = $('<div class="list"></div>')
    this.$dom.append(this.$list)
    this.$descriptions = $('<div class="descriptions"></div>')
    this.$dom.append(this.$descriptions)

    this.completions = completions
    this.part = part

    this.$input = $('<input type="text" />')
    this.$dom.append(this.$input)

    this.click = false
    this.blockMouseEnter = false

    if(completions instanceof Array === false || completions.length === 0){
        this.$list.append('<div class="empty">nothing found</div>')
    } else {
        let id = 0
        for(let c of completions) {
            const myid = id

            let cdescription = $('<div class="description" aid="' + id + '" atype="' + c.type + '" ' + (c.lib ? 'lib="' + c.lib + '"' : '') + '><div class="top"><div class="name">' + c.name + '</div><div class="args">' + ( c.args ? DOCUMENTATION.argsAsString(c.args) : '' ) + '</div></div>' + (c.lib ? '<div class="lib_title">' + DOCUMENTATION.LIB_TITLES[c.lib] + '</div>' : '') + (c.url ? '<div class="url">' + c.url + '</div>' : '') + '<div class="text">' + c.description + '</div></div>')
            this.$descriptions.append(cdescription)

            let centry = $('<div class="entry" aid="' + id + '" afull="' + c.full + '" atype="' + c.type + '" ' + (c.lib ? 'lib="' + c.lib + '"' : '') + '><div class="name">' + c.name  + (c.type === DOCUMENTATION.TF ? '()' : '') + '</div><div class="type">' + c.type + '</div></div>')
            this.$list.append(centry)
            centry.get(0).completition = c
            centry.on('click', ()=>{
                this.click = true
                this.insertAutoCompletition(c)
            })
            centry.mouseenter(()=>{
                if(this.blockMouseEnter){
                    return
                }
                this.select(myid, false)
            })
            id++
        }
        this.selected = 0
        setTimeout(()=>{
            this.select(this.selected)
        }, 200)
    }


    this.$input.on('keydown', (e)=>{
        if(e.keyCode === 40){//arrow down
            e.preventDefault()
            e.stopImmediatePropagation()

            this.arrowDown()
        } else if (e.keyCode === 38){//arrow up
            e.preventDefault()
            e.stopImmediatePropagation()

            this.arrowUp()
        } else if (e.keyCode === 27){//esc
            e.preventDefault()
            e.stopImmediatePropagation()

            this.autocomplete.closeAutocomplete()
        } else if(e.keyCode === 13) {//enter
            e.preventDefault()
            e.stopImmediatePropagation()

            if(this.$list.find('.entry.selected').get(0)){
                this.insertAutoCompletition( this.$list.find('.entry.selected').get(0).completition )
            } else {
                this.autocomplete.closeAutocomplete()                
            }
        } else {
            this.preventFocusOut = true
            this.autocomplete.editor.focus()
            this.autocomplete.codeField.find('.ace_text-input').trigger(e)
            setTimeout(()=>{
                this.autocomplete.suggestAutocomplete()
            }, 200)
        }
    })

    this.$input.on('focusout mouseleave', ()=>{
        if(this.preventFocusOut){
            this.preventFocusOut = false
            return
        }
        setTimeout(()=>{
            if(!this.click){
                this.autocomplete.closeAutocomplete()
            }
        }, 300)
    })

    setTimeout(()=>{
        this.$input.focus()
    }, 100)
}

AutocompletitionElement.prototype.arrowDown = function() {
    console.log('arrowDown')
    if(this.$list.find('.entry').length > this.selected + 1){
        this.select(this.selected + 1, true)
    }
}

AutocompletitionElement.prototype.arrowUp = function() {
    if(this.selected - 1 < 0){
        this.autocomplete.closeAutocomplete()
        return
    }
    this.select(this.selected - 1, true)
}

AutocompletitionElement.prototype.select = function(index, scroll) {
    let it = this.$list.find('.entry').get(index)
    if(it){
        this.selected = index
        this.$list.find('.entry.selected').removeClass('selected')
        $(it).addClass('selected').focus()
        
        this.$descriptions.find('.description').hide()
        $('.description[aid="' + index + '"]').show()

        $('.descriptions').css({
            left: '100%',
            top: 0,
        })

        let length = Math.max(this.$descriptions.find('.description[aid="' + index + '"] .text').html().length * 2, (this.$descriptions.find('.description[aid="' + index + '"] .name').html().length + 1 + this.$descriptions.find('.description[aid="' + index + '"] .args').html().length) * 3, this.$descriptions.find('.description[aid="' + index + '"] .lib_title').html().length * 3)
        let width = length
        if(width > 50){
            width = $('body').width() * 0.9 - this.$list.get(0).getBoundingClientRect().right
        }

        if(width < this.$list.width() && length > 50){
            width = this.$list.width()
            this.$descriptions.css({
                left: 0,
                top: this.$list.height(),
            })
        }
        this.$descriptions.css('width', width)
    }
    if(scroll){
        let top = $('.entry[aid="0"]').outerHeight() * this.selected
        this.blockMouseEnter = true
        this.$list.scrollTop(top)
        setTimeout(()=>{
            this.blockMouseEnter = false
        }, 100)
    }
}

AutocompletitionElement.prototype.getDom = function() {
    return this.$dom
}

AutocompletitionElement.prototype.insertAutoCompletition = function(completition) {
    let split = completition.full.split('.')
    let text = split[split.length-1]
    if(typeof this.part === 'string'){
        text = text.replace(this.part, '')
    }
    if(completition.type === DOCUMENTATION.TO){
        text += '.'
    } else if(completition.args){
        let args = DOCUMENTATION.argsAsString(completition.args)
        text += args
        setTimeout(()=>{
            this.autocomplete.editor.navigateLeft(args.length - 1)
        }, 10)
    }
    this.autocomplete.editor.insert(text)
    this.autocomplete.closeAutocomplete()
}

;
var DOCUMENTATION = ((global, $)=>{
  "use strict";


    const MANUAL_BASE_URL = 'https://www.lua.org/manual/5.3/manual.html#'

    const TO = 'object'
    const TF = 'function'
    const TV = 'variable'
    const TA = 'argument'
    const TE = 'event'

    const LIB_TITLES = {
        'dev': 'Pony API (This Website)',
        'stormworks': 'Stormworks API',
        'lua': 'Lua API',
        'user': 'User defined (that\'s you!)'
    }

    
    let DEFINITION
    
    let PARSED

    let fuse

    LOADER.on(LOADER.EVENT.UI_READY, init)



    function init(){

        refresh()

        LOADER.done(LOADER.EVENT.DOCUMENTATION_READY)
    }

    function refresh(){

        if(UI.isServerMode()){
            DEFINITION = DOCUMENTATION_DEFINITION_SERVER
        } else {
            DEFINITION = DOCUMENTATION_DEFINITION_CLIENT
            $('.ide').attr('mode', 'client')
        }

        if(DEFINITION && DEFINITION instanceof Object){

            parseDefinition()

            buildDocumentation()


            let fuseList = generateFuseList()

            fuse = new Fuse(fuseList, {
                includeScore: true,
                minMatchCharLength: 2,
                ignoreLocation: true,
                shouldSort: true,
                threshold: 0.2,
                keys: [{
                    name: 'name',
                    weight: 0.7
                },{
                    name: 'description',
                    weight: 0.3
                }]
            })
            
            MINMAX.refresh()
        } else {
            throw 'unable to load DOCUMENTATION_DEFINITION'
        }
    }

    function parseDefinition(){
        PARSED = JSON.parse(JSON.stringify(DEFINITION))

        function _do(node, parent){
            if(typeof node.description === 'string'){
                node.description = parseDescription(node.description)
            }
            if(typeof node.url === 'string'){
                node.url = parseUrl(node.url)
            } else if(parent && typeof parent.url === 'string'){
                node.url = parent.url
            }
            if(parent && parent.lib){
                node.lib = parent.lib
            }
            if(node.children){
                for(let k of Object.keys(node.children)){
                    _do(node.children[k], node)
                }
            }
        }

        _do(PARSED)
    }

    function parseDescription(description){
        return description.replace(/§([\d\.]*)/g, (match, p1)=>{
            return parseUrl(MANUAL_BASE_URL + p1)
        }).replace(/\n/g, '<br>')
    }

    function parseUrl(url){
        let label = url
        if(url.indexOf(MANUAL_BASE_URL) >= 0){
            label = 'Lua Manual §' + url.split('#')[1]
        }
        return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + label + '</a>'
    }

    function argsAsString(args){
        if(args instanceof Array === false){
            throw 'args must be an array @ ' + name
        } else {
            let text = ''
            let optionalArgs = 0

            for(let i in args){
                let a = args[i]

                let isLastArg = (i == (args.length - 1))

                if(a.optional){
                    if(a.optionalConnectedToPrevious !== true){
                        optionalArgs++
                        text = text.substring(0, text.length - 2) + ' [, '
                    }
                } else if (optionalArgs > 0){
                    optionalArgs--
                    text = text.substring(0, text.length - 2) + '], '
                }

                text += a.name

                if(isLastArg){
                    for(let ii = 0; ii < optionalArgs; ii++){
                        text += ']'
                    }
                } else {
                    text += ', '
                }
            }

            return '(' + text + ')'
        }
    }

    function argsAsDOM(args){
        if(args instanceof Array === false){
            throw 'args must be an array @ ' + name
        } else {
            let dom = $('<div class="args">') 
            let optionalArgs = 0

            let previousArg

            for(let i in args){
                let a = args[i]

                let currentArg = $('<div class="arg">').html(a.name)

                let help_text = ''

                if(a.help){
                    help_text += a.help
                }

                if(a.possibleValues){
                    if(help_text.length > 0){
                        help_text += '\n\n'
                    }

                    let table = '<table><tr><th>Value</th><th>Description</th></tr>'

                    for(let k in a.possibleValues){
                        table += '<tr><td>' + k + '</td><td>' + ( a.possibleValues[k] || '?' ) + '</tr>'
                    }

                    table += '</table>'

                    help_text += 'Possible Values:\n' + table
                }

                if(help_text.length > 0){
                    currentArg.addClass('has_help')
                    currentArg.append( $('<div class="arg_help_open"><span class="icon-question"></span></div>') )
                    currentArg.append( $('<div class="arg_help">').html( help_text ) )
                    currentArg.on('mouseenter', ()=>{
                        currentArg.addClass('help_open')
                    })
                    currentArg.on('mouseleave', ()=>{
                        currentArg.removeClass('help_open')
                    })
                }

                if(a.optional){
                    if(a.optionalConnectedToPrevious !== true){
                        optionalArgs++
                        currentArg.attr('before', '\xa0[,\xa0')

                        if(previousArg){
                            previousArg.attr('after', previousArg.attr('after').substring(0, previousArg.attr('after').length - 2) )
                        }
                    }
                } else if (optionalArgs > 0){
                    optionalArgs--

                    if(previousArg){
                       previousArg.attr('after', previousArg.attr('after').substring(0, previousArg.attr('after').length - 2) + '],\xa0')
                    }
                }

                let isLastArg = (i == (args.length - 1))
                if(isLastArg){
                    let brackets = ''
                    for(let ii = 0; ii < optionalArgs; ii++){
                        brackets += ']'
                    }
                    currentArg.attr('after', brackets)
                } else {
                    currentArg.attr('after', ',\xa0')
                }

                dom.append(currentArg)

                previousArg = currentArg
            }

            return dom
        }
    }

    function buildDocumentation(){
        let container = $('#documentation')
        container.html('<div class="documentation_searchbar"><input type="text" placeholder="search"><span class="icon-cross"></span></div>')

        container.find('.documentation_searchbar span').on('click', ()=>{
            container.find('.documentation_searchbar input').val('').trigger('change')
        })

        container.find('.documentation_searchbar input').on('change', ()=>{
            searchDocumenation(container.find('.documentation_searchbar input').val())
        })




        for(let name of getSortedKeysForDocsChildren(PARSED.children)){
            let child = PARSED.children[name]
            printNode(container, child, name, '', true)
        }
    }

    function printNode(container, node, name, prefix, topNode){
        let me = $('<div class="node" ntype="' + node.type + '" ' + (node.lib ? 'lib="' + node.lib + '"' : '') + ' fusename="' + (prefix ? prefix + '.' + name : name).replace('..', '.') + '">')
        container.append(me)

        let top = $('<div class="top">')
        me.append(top)

        let bottom = $('<div class="bottom">')
        me.append(bottom)


        if(node.children || topNode){
            me.addClass('contracted')
            top.on('click', ()=>{
                me.toggleClass('contracted')
            })
        }

        let definition = $('<div class="definition">')
        top.prepend(definition)

        definition.append(
            $('<div class="name">' + name + '</div>')
        )

        if(node.type === TE){
            const help_text = 'Declare this function in the code, and it will be called by the game.'
            node.help = node.help ? (help_text + '\n\n' + node.help) : help_text
        }

        if(node.help){
            let hint = $('<div class="hint"></div>')
            let hintinner = $('<div class="hint_inner"></div>').html(node.help)
            let hintopen = $('<div class="hint_open_icon icon-question"></div>')
                .on('mouseenter',()=>{
                    hint.addClass('hint_open')
                })
                .on('mouseleave',()=>{
                    hint.removeClass('hint_open')
                })
            hint.append(hintopen)
            hint.append(hintinner)
            definition.append(hint)
        }


        if(node.type === TF || node.type === TE){           
            definition.append(argsAsDOM(node.args))
        }

        if(node.lib && topNode){
            top.append(
                $('<div class="lib">' + LIB_TITLES[node.lib] + '</div>')
            )
        }

        if(node.url){
            bottom.append(
                $('<div class="url">' + node.url + '</div>')
            )
        }

        if(node.type === TF){
            bottom.append(
                $('<div class="returns">Returns: ' + (node.returns ? node.returns : '<span class="nothing">nothing</span>') + '</div>')
            )
        }

        bottom.append(
            $('<div class="text">' + node.description + '</div>')
        )

        if(node.bugs){
            bottom.append(
                $('<div class="bugs"><span class="heading">Known Bugs / Problems</span><br><div class="bug_text">' + node.bugs + '</div></div>')
            )
        }
        
        
        container.append(me)
        if(node.children){
            let childcontainer = $('<div class="children"></div>')
            me.append(childcontainer)

            for(let _name of getSortedKeysForDocsChildren(node.children)){
                let child = node.children[_name]
                printNode(childcontainer, child, '.' + _name, (prefix ? prefix + '.' + name : name).replace('..', '.'))
            }
        }
    }

    function getSortedKeysForDocsChildren(children){
        let sortedChildren = []

        for(let name of Object.keys(children)){
            let ID = (children[name].lib ? children[name].lib : '') + '.' + name
            sortedChildren[ID] = name
        }

        let sortedIDs = Object.keys(sortedChildren).sort((a,b)=>{
            if(a > b){
                return 1
            }

            if(a < b){
                return -1
            }

            return 0
        })

        let sortedKeys = []
        for(let id of sortedIDs){
            sortedKeys.push(sortedChildren[id])
        }

        return sortedKeys
    }

    function generateFuseList(){
        let entries = []

        processNode(PARSED, '')

        function processNode(node, prefix, name){
            if(name){
                entries.push({
                    description: node.description,
                    name: name,
                    fusename: prefix
                })
            }

            if(node.children){
                for(let k of Object.keys(node.children)){
                    processNode(node.children[k], (prefix ? prefix + '.' : '') + k, k)
                }
            }
        }

        return entries
    }

    function searchDocumenation(searchString){
        if(searchString === ''){
            $('#documentation .node').removeClass('fuze_hidden').addClass('contracted').css('order', '')
            return
        } else {

            $('#documentation .node').addClass('fuze_hidden')

            let res = fuse.search(searchString)
            console.log('search results', res)

            /*res.sort((a,b)=>{
                if(a.score > b.score){
                    return -1
                }
                if (a.score < b.score) {
                    return 1
                }
                return 0
            })*/

            let partOrders = {}

            let count = 1
            for(let r of res){
                let parts = r.item.fusename.split('.')
                for(let p of parts){
                    if(typeof partOrders[p] !== 'number'){
                        partOrders[p] = count
                    }
                    if(partOrders[p] > count){
                        partOrders[p] = count
                    }

                    $('#documentation .node[fusename="' + p + '"]').removeClass('fuze_hidden contracted').css('order', partOrders[p])
                }

                $('#documentation .node[fusename="' + r.item.fusename + '"]').removeClass('fuze_hidden contracted').css('order', count)

                count++
            }
        }
    }

    return {
        TO: TO,
        TF: TF,
        TV: TV,
        TA: TA,
        TE: TE,
        LIB_TITLES: LIB_TITLES,
        getRaw: ()=>{ return DEFINITION; },
        getParsed: ()=>{ return PARSED},
        argsAsString: argsAsString,
        refresh: refresh
    }

})(window, jQuery)

;
DOCUMENTATION_DEFINITION_CLIENT = (()=>{
    "use strict";

    const TO = DOCUMENTATION.TO
    const TF = DOCUMENTATION.TF
    const TV = DOCUMENTATION.TV
    const TA = DOCUMENTATION.TA
    const TE = DOCUMENTATION.TE


    const DEF = {
        children: {
            onTick: {
                type: TE,
                lib: 'stormworks',
                args: [],
                description: 'Called everytime the game calculates a physics tick (~ 60 times per second)'
            },
            onDraw: {
                type: TE,
                lib: 'stormworks',
                args: [],
                description: 'Called everytime a monitor calculates a frame (~ 60 times per second)\nIf you connected multiple monitors, it will called once per monitor, per frame'
            },
            httpReply: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'port'}, {name: 'url'}, {name: 'response_body'}],
                description: 'Called when async.httpGet() receives a server response. Port and url will be the values that you put into async.httpGet() as arguments.'
            },
            screen: {
                type: TO,
                lib: 'stormworks',
                description: 'Used to show stuff on the video output. Can only be called within the onDraw function!',
                children: {
                    setColor: {
                        type: TF,
                        args: [{name: 'r'}, {name: 'g'}, {name: 'b'}, {name: 'a', optional: true, help: 'This the alpha value and represents opacity'}],
                        description: 'Set the current draw color. Values range from 0 - 255. A is optional.'
                    },
                    drawClear: {
                        type: TF,
                        args: [],
                        description: 'Clear the screen with the current color (paints the whole screen).'
                    },
                    drawLine: {
                        type: TF,
                        args: [{name: 'x1'}, {name: 'y1'}, {name: 'x2'}, {name: 'y2'}],
                        description: 'Draw a line from (x1,y1) to (x2,y2).'
                    },
                    drawCircle: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}, {name: 'radius'}],
                        description: 'Draw a circle at (x,y) with radius.'
                    },
                    drawCircleF: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}, {name: 'radius'}],
                        description: 'Draw a filled circle at (x,y) with radius.'
                    },
                    drawRect: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}, {name: 'width'}, {name: 'height'}],
                        description: 'Draw a rectangle at (x,y) with width and height.'
                    },
                    drawRectF: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}, {name: 'width'}, {name: 'height'}],
                        description: 'Draw a filled rectangle at (x,y) with width and height.'
                    },
                    drawTriangle: {
                        type: TF,
                        args: [{name: 'x1'}, {name: 'y1'}, {name: 'x2'}, {name: 'y2'}, {name: 'x3'}, {name: 'y3'}],
                        description: 'Draw a triangle between (x1,y1), (x2,y2) and (x3,y3).'
                    },
                    drawTriangleF: {
                        type: TF,
                        args: [{name: 'x1'}, {name: 'y1'}, {name: 'x2'}, {name: 'y2'}, {name: 'x3'}, {name: 'y3'}],
                        description: 'Draw a filled triangle between (x1,y1), (x2,y2) and (x3,y3).'
                    },
                    drawText: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}, {name: 'text'}],
                        description: 'Draw text at (x,y). Each character is 4 pixels wide and 5 pixels tall.'
                    },
                    drawTextBox: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}, {name: 'width'}, {name: 'height'}, {name: 'text'}, {name: 'h_align', optional: true, help: '-1 = left, 0 = centered, 1 = right'}, {name: 'v_align', optional: true, optionalConnectedToPrevious: true, help: '-1 = top, 0 = centered, 1 = bottom'}],
                        description: 'Draw text within a rectangle at (x,y) with width and height. Text alignment can be specified using the last two parameters and ranges and defaults to top-left. Text will automatically wrap at spaces when possible, and will overflow the top/bottom of the specified rectangle if too large. THIS IS NOT 100% LIKE INGAME BUT ALMOST!'
                    },
                    drawMap: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}, {name: 'zoom', help: 'ranges from 0.1 (close) to 50 (far)'}],
                        description: 'Draw the world map centered on map coordinate (x,y)'
                    },
                    setMapColorOcean: {
                        type: TF,
                        args: [{name: 'r'}, {name: 'g'}, {name: 'b'}, {name: 'a', optional: true, help: 'This the alpha value and represents opacity'}],
                        description: 'Set the color for ocean map pixels. Values range from 0 - 255.'
                    },
                    setMapColorShallows: {
                        type: TF,
                        args: [{name: 'r'}, {name: 'g'}, {name: 'b'}, {name: 'a', optional: true, help: 'This the alpha value and represents opacity'}],
                        description: 'Set the color for shallows map pixels. Values range from 0 - 255.'
                    },
                    setMapColorLand: {
                        type: TF,
                        args: [{name: 'r'}, {name: 'g'}, {name: 'b'}, {name: 'a', optional: true, help: 'This the alpha value and represents opacity'}],
                        description: 'Set the color for land map pixels. Values range from 0 - 255.'
                    },
                    setMapColorGrass: {
                        type: TF,
                        args: [{name: 'r'}, {name: 'g'}, {name: 'b'}, {name: 'a', optional: true, help: 'This the alpha value and represents opacity'}],
                        description: 'Set the color for grass map pixels. Values range from 0 - 255.'
                    },
                    setMapColorSand: {
                        type: TF,
                        args: [{name: 'r'}, {name: 'g'}, {name: 'b'}, {name: 'a', optional: true, help: 'This the alpha value and represents opacity'}],
                        description: 'Set the color for sand map pixels. Values range from 0 - 255.'
                    },
                    setMapColorSnow: {
                        type: TF,
                        args: [{name: 'r'}, {name: 'g'}, {name: 'b'}, {name: 'a', optional: true, help: 'This the alpha value and represents opacity'}],
                        description: 'Set the color for snow map pixels. Values range from 0 - 255.'
                    },
                    getWidth: {
                        type: TF,
                        args: [],
                        returns: 'Width of the monitor currently being rendered on',
                        description: 'If multiple monitors are connected, this value might change between onDraw() calls.'
                    },
                    getHeight: {
                        type: TF,
                        args: [],
                        returns: 'Height of the monitor currently being rendered on',
                        description: 'If multiple monitors are connected, this value might change between onDraw() calls.'
                    }
                }
            },
            map: {
                type: TO,
                lib: 'stormworks',
                description: 'Functions to interact with the map.',
                children: {
                    screenToMap: {
                        type: TF,
                        args: [{name: 'mapX'}, {name: 'mapY'}, {name: 'zoom'}, {name: 'screenW'}, {name: 'screenH'}, {name: 'pixelX'}, {name: 'pixelY'}],
                        returns: 'worldX, worldY',
                        description: 'Convert pixel coordinates into world coordinates.'
                    },
                    mapToScreen: {
                        type: TF,
                        args: [{name: 'mapX'}, {name: 'mapY'}, {name: 'zoom'}, {name: 'screenW'}, {name: 'screenH'}, {name: 'worldX'}, {name: 'worldY'}],
                        returns: 'screenX, screenY',
                        description: 'Convert world coordinates into pixel coordinates.'
                    }
                }
            },
            input: {
                type: TO,
                lib: 'stormworks',
                description: 'Read values from the composite input.',
                children: {
                    getBool: {
                        type: TF,
                        args: [{name: 'index'}],
                        returns: 'boolean',
                        description: 'Read the boolean value of the input composite on index. Index ranges from 1 - 32'                        
                    },
                    getNumber: {
                        type: TF,
                        args: [{name: 'index'}],
                        returns: 'number',
                        description: 'Read the number value of the input composite on indexe. Index ranges from 1 - 32'                        
                    }
                }
            },
            output: {
                type: TO,
                lib: 'stormworks',
                description: 'Set values on the composite output.',
                children: {
                    setBool: {
                        type: TF,
                        args: [{name: 'index'}, {name: 'value'}],
                        description: 'Sets the boolean value of the output composite on index to value. Index ranges from 1 - 32'                        
                    },
                    setNumber: {
                        type: TF,
                        args: [{name: 'index'}, {name: 'value'}],
                        description: 'Sets the number value of the output composite on index to value. Index ranges from 1 - 32'                        
                    }
                }
            },
            property: {
                type: TO,
                lib: 'stormworks',
                description: 'Read the values of property components within this microcontroller directly. The label passed to each function should match the label that has been set for the property you#re trying to access (case-sensitive).',
                children: {
                    getBool: {
                        type: TF,
                        args: [{name: 'label'}],
                        returns: 'boolean',
                        description: 'Reads the boolean value of the property with the specified label'                        
                    },
                    getNumber: {
                        type: TF,
                        args: [{name: 'label'}],
                        returns: 'number',
                        description: 'Reads the number value of the property with the specified label'                        
                    },
                    getText: {
                        type: TF,
                        args: [{name: 'label'}],
                        returns: 'string',
                        description: 'Reads the string value of the property with the specified label'                        
                    }
                }
            },
            async: {
                type: TO,
                lib: 'stormworks',
                description: 'Execute HTTP requests.',
                children: {
                    httpGet: {
                        type: TF,
                        args: [{name: 'port'}, {name: 'url'}],
                        description: 'Creates a HTTP request to "http://localhost:[PORT][url]". If you call it more then once per tick, the request will be put into a queue, every tick one request will be taken from that queue and executed.\n\nIMPORTANT:\nYou must follow these steps to enable http support in this Lua IDE:\nYour browser prohibits sending and receiving data to and from localhost. To fix that, follow the <a href="http-allow-localhost" target="_blank">manual here</a>'
                    }
                }
            },
            pairs: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'table'}],
                returns: 'iterator function, table, 0 (used in a for loop)',
                description: 'If table has a metamethod __pairs, calls it with t as argument and returns the first three results from the call.\nOtherwise, returns three values: the next function, the table t, and nil, so that the construction\n     for k,v in pairs(t) do body end\nwill iterate over all key–value pairs of table t.\nSee function next for the caveats of modifying the table during its traversal.'
            },
            ipairs: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'table'}],
                returns: 'iterator function, table, 0 (used in a for loop)',
                description: 'Returns three values (an iterator function, the table t, and 0) so that the construction\nfor i,v in ipairs(t) do body end\nwill iterate over the key–value pairs (1,t[1]), (2,t[2]), ..., up to the first nil value.'
            },
            next: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'table'}, {name: 'index', optional: true}],
                returns: 'next value, next index',
                description: 'Allows a program to traverse all fields of a table. Its first argument is a table and its second argument is an index in this table. next returns the next index of the table and its associated value. When called with nil as its second argument, next returns an initial index and its associated value. When called with the last index, or with nil in an empty table, next returns nil. If the second argument is absent, then it is interpreted as nil. In particular, you can use next(t) to check whether a table is empty.\nThe order in which the indices are enumerated is not specified, even for numeric indices. (To traverse a table in numerical order, use a numerical for.)\nThe behavior of next is undefined if, during the traversal, you assign any value to a non-existent field in the table. You may however modify existing fields. In particular, you may clear existing fields.'
            },
            tostring: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'v'}],
                returns: 'string',
                description: 'Receives a value of any type and converts it to a string in a human-readable format. (For complete control of how numbers are converted, use string.format.)\nIf the metatable of v has a __tostring field, then tostring calls the corresponding value with v as argument, and uses the result of the call as its result.'
            },
            tonumber: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'e'}, {name: 'base', optional: true}],
                returns: 'number',
                description: 'When called with no base, tonumber tries to convert its argument to a number. If the argument is already a number or a string convertible to a number, then tonumber returns this number; otherwise, it returns nil.\nThe conversion of strings can result in integers or floats, according to the lexical conventions of Lua (see §3.1). (The string may have leading and trailing spaces and a sign.)\nWhen called with base, then e must be a string to be interpreted as an integer numeral in that base. The base may be any integer between 2 and 36, inclusive. In bases above 10, the letter "A" (in either upper or lower case) represents 10, "B" represents 11, and so forth, with "Z" representing 35. If the string e is not a valid numeral in the given base, the function returns nil.'
            },
            math: {
                type: TO,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.7',
                description: 'This library provides basic mathematical functions. It provides all its functions and constants inside the table math. Functions with the annotation "integer/float" give integer results for integer arguments and float results for float (or mixed) arguments. Rounding functions (math.ceil, math.floor, and math.modf) return an integer when the result fits in the range of an integer, or a float otherwise.',
                children: {                    
                    abs: {
                        type: TF,
                        args: [{name: 'x'}],
                        returns: 'number',
                        description: 'Returns the absolute value of x. (integer/float) '
                    },
                    acos: {
                        type: TF,
                        args: [{name: 'x'}],
                        returns: 'number',
                        description: 'Returns the arc cosine of x (in radians). '
                    },
                    asin: {
                        type: TF,
                        args: [{name: 'x'}],
                        returns: 'number',
                        description: 'Returns the arc sine of x (in radians). '
                    },
                    atan: {
                        type: TF,
                        args: [{name: 'y'}, {name: 'x', optional: true}],
                        returns: 'number',
                        description: ' Returns the arc tangent of y/x (in radians), but uses the signs of both arguments to find the quadrant of the result. (It also handles correctly the case of x being zero.)\nThe default value for x is 1, so that the call math.atan(y) returns the arc tangent of y.'
                    },
                    ceil: {
                        type: TF,
                        args: [{name: 'x'}],
                        returns: 'number',
                        description: 'Returns the smallest integral value larger than or equal to x.'
                    },
                    cos: {
                        type: TF,
                        args: [{name: 'x'}],
                        returns: 'number',
                        description: 'Returns the cosine of x (assumed to be in radians).'
                    },
                    deg: {
                        type: TF,
                        args: [{name: 'x'}],
                        returns: 'number',
                        description: 'Converts the angle x from radians to degrees.'
                    },
                    exp: {
                        type: TF,
                        args: [{name: 'x'}],
                        returns: 'number',
                        description: 'Returns the value e raised to the power x (where e is the base of natural logarithms).'
                    },
                    floor: {
                        type: TF,
                        args: [{name: 'x'}],
                        returns: 'number',
                        description: 'Returns the largest integral value smaller than or equal to x.'
                    },
                    fmod: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}],
                        returns: 'number',
                        description: 'Returns the remainder of the division of x by y that rounds the quotient towards zero. (integer/float)'
                    },
                    huge: {
                        type: TF,
                        args: [],
                        returns: 'number',
                        description: 'The float value HUGE_VAL, a value larger than any other numeric value.'
                    },
                    log: {
                        type: TF,
                        args: [{name: 'x'}],
                        returns: 'number',
                        description: 'Inverse function of math.exp(x).'
                    },
                    max: {
                        type: TF,
                        args: [{name: 'x'}, {name: '...'}],
                        returns: 'number',
                        description: 'Returns the argument with the maximum value, according to the Lua operator <. (integer/float)'
                    },
                    maxinteger: {
                        type: TF,
                        args: [],
                        returns: 'number',
                        description: 'An integer with the maximum value for an integer. '
                    },
                    min: {
                        type: TF,
                        args: [{name: 'x'}, {name: '...'}],
                        returns: 'number',
                        description: 'Returns the argument with the minimum value, according to the Lua operator <. (integer/float)'
                    },
                    mininteger: {
                        type: TF,
                        args: [],
                        returns: 'number',
                        description: 'An integer with the minimum value for an integer. '
                    },
                    modf: {
                        type: TF,
                        args: [{name: 'x'}],
                        returns: 'number',
                        description: 'Returns the integral part of x and the fractional part of x. Its second result is always a float.'
                    },
                    pi: {
                        type: TV,
                        description: 'The value of π.'
                    },
                    rad: {
                        type: TF,
                        args: [{name: 'x'}],
                        returns: 'number',
                        description: 'Converts the angle x from degrees to radians.'
                    },
                    random: {
                        type: TF,
                        args: [{name: 'm', optional: true}, {name: 'n', optional: true}],
                        returns: 'number',
                        description: ' When called without arguments, returns a pseudo-random float with uniform distribution in the range [0,1). When called with two integers m and n, math.random returns a pseudo-random integer with uniform distribution in the range [m, n]. (The value n-m cannot be negative and must fit in a Lua integer.) The call math.random(n) is equivalent to math.random(1,n).\nThis function is an interface to the underling pseudo-random generator function provided by C.'
                    },
                    randomseed: {
                        type: TF,
                        args: [{name: 'x'}],
                        returns: 'number',
                        description: 'Sets x as the "seed" for the pseudo-random generator: equal seeds produce equal sequences of numbers.'
                    },
                    sin: {
                        type: TF,
                        args: [{name: 'x'}],
                        returns: 'number',
                        description: 'Returns the sine of x (assumed to be in radians).'
                    },
                    sqrt: {
                        type: TF,
                        args: [{name: 'x'}],
                        returns: 'number',
                        description: 'Returns the square root of x. (You can also use the expression x^0.5 to compute this value.)'
                    },
                    tan: {
                        type: TF,
                        args: [{name: 'x'}],
                        returns: 'number',
                        description: 'Returns the tangent of x (assumed to be in radians).'
                    },
                    tointeger: {
                        type: TF,
                        args: [{name: 'x'}],
                        returns: 'number',
                        description: 'If the value x is convertible to an integer, returns that integer. Otherwise, returns nil.'
                    },
                    type: {
                        type: TF,
                        args: [{name: 'x'}],
                        returns: 'number',
                        description: 'Returns "integer" if x is an integer, "float" if it is a float, or nil if x is not a number.'
                    },
                    ult: {
                        type: TF,
                        args: [{name: 'm'}, {name: 'n'}],
                        returns: 'number',
                        description: 'Returns a boolean, true if and only if integer m is below integer n when they are compared as unsigned integers.'
                    }
                }
            },
            table: {
                type: TO,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.6',
                description: ' This library provides generic functions for table manipulation. It provides all its functions inside the table table.\nRemember that, whenever an operation needs the length of a table, all caveats about the length operator apply (see §3.4.7). All functions ignore non-numeric keys in the tables given as arguments.',
                children: {
                    concat: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'sep', optional: true}, {name: 'i', optional: true}, {name: 'j', optional: true}],
                        returns: 'string',
                        description: 'Given a list where all elements are strings or numbers, returns the string list[i]..sep..list[i+1] ... sep..list[j]. The default value for sep is the empty string, the default for i is 1, and the default for j is #list. If i is greater than j, returns the empty string.'
                    },
                    insert: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'pos', optional: true}, {name: 'value'}],
                        description: 'Inserts element value at position pos in list, shifting up the elements list[pos], list[pos+1], ..., list[#list]. The default value for pos is #list+1, so that a call table.insert(t,x) inserts x at the end of list t.'
                    },
                    move: {
                        type: TF,
                        args: [{name: 'a1'}, {name: 'f'}, {name: 'e'}, {name: 't'}, {name: 'a2', optional: true}],
                        returns: 'destination table',
                        description: ' Moves elements from table a1 to table a2, performing the equivalent to the following multiple assignment: a2[t],... = a1[f],...,a1[e]. The default for a2 is a1. The destination range can overlap with the source range. The number of elements to be moved must fit in a Lua integer.\nReturns the destination table a2.'
                    },
                    pack: {
                        type: TF,
                        args: [{name: '...'}],
                        returns: 'table',
                        description: 'Returns a new table with all arguments stored into keys 1, 2, etc. and with a field "n" with the total number of arguments. Note that the resulting table may not be a sequence.'
                    },
                    remove: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'pos', optional: true}],
                        returns: 'the removed value',
                        description: ' Removes from list the element at position pos, returning the value of the removed element. When pos is an integer between 1 and #list, it shifts down the elements list[pos+1], list[pos+2], ..., list[#list] and erases element list[#list]; The index pos can also be 0 when #list is 0, or #list + 1; in those cases, the function erases the element list[pos].\nThe default value for pos is #list, so that a call table.remove(l) removes the last element of list l.'
                    },
                    sort: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'comp', optional: true}],
                        description: ' Sorts list elements in a given order, in-place, from list[1] to list[#list]. If comp is given, then it must be a function that receives two list elements and returns true when the first element must come before the second in the final order (so that, after the sort, i < j implies not comp(list[j],list[i])). If comp is not given, then the standard Lua operator < is used instead.\nNote that the comp function must define a strict partial order over the elements in the list; that is, it must be asymmetric and transitive. Otherwise, no valid sort may be possible.\nThe sort algorithm is not stable: elements considered equal by the given order may have their relative positions changed by the sort.'
                    },
                    unpack: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'i', optional: true}, {name: 'j', optional: true}],
                        returns: '... (multiple values)',
                        description: ' Returns the elements from the given list. This function is equivalent to\n    return list[i], list[i+1], ..., list[j]\nBy default, i is 1 and j is #list.'
                    }
                }
            },
            string: {
                type: TO,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.4',
                description: ' This library provides generic functions for string manipulation, such as finding and extracting substrings, and pattern matching. When indexing a string in Lua, the first character is at position 1 (not at 0, as in C). Indices are allowed to be negative and are interpreted as indexing backwards, from the end of the string. Thus, the last character is at position -1, and so on.\nThe string library assumes one-byte character encodings.',
                children: {
                    byte: {
                        type: TF,
                        args: [{name: 's'}, {name: 'i', optional: true}, {name: 'j', optional: true}],
                        returns: 'number',
                        description: 'Returns the internal numeric codes of the characters s[i], s[i+1], ..., s[j]. The default value for i is 1; the default value for j is i. These indices are corrected following the same rules of function string.sub.\nNumeric codes are not necessarily portable across platforms.'
                    },
                    char: {
                        type: TF,
                        args: [{name: '...'}],
                        returns: 'string',
                        description: 'Receives zero or more integers. Returns a string with length equal to the number of arguments, in which each character has the internal numeric code equal to its corresponding argument.\nNumeric codes are not necessarily portable across platforms.'
                    },
                    dump: {
                        type: TF,
                        args: [{name: 'function'}, {name: 'strip', optional: true}],
                        returns: 'string',
                        description: ' Returns a string containing a binary representation (a binary chunk) of the given function, so that a later load on this string returns a copy of the function (but with new upvalues). If strip is a true value, the binary representation may not include all debug information about the function, to save space.\nFunctions with upvalues have only their number of upvalues saved. When (re)loaded, those upvalues receive fresh instances containing nil. (You can use the debug library to serialize and reload the upvalues of a function in a way adequate to your needs.)'
                    },
                    find: {
                        type: TF,
                        args: [{name: 's'}, {name: 'pattern'}, {name: 'init', optional: true}, {name: 'plain', optional: true}],
                        returns: 'number',
                        description: ' Looks for the first match of pattern (see §6.4.1) in the string s. If it finds a match, then find returns the indices of s where this occurrence starts and ends; otherwise, it returns nil. A third, optional numeric argument init specifies where to start the search; its default value is 1 and can be negative. A value of true as a fourth, optional argument plain turns off the pattern matching facilities, so the function does a plain "find substring" operation, with no characters in pattern being considered magic. Note that if plain is given, then init must be given as well.\nIf the pattern has captures, then in a successful match the captured values are also returned, after the two indices.'
                    },
                    format: {
                        type: TF,
                        args: [{name: 'formatstring'}, {name: '...'}],
                        returns: 'string',
                        description: ' Returns a formatted version of its variable number of arguments following the description given in its first argument (which must be a string). The format string follows the same rules as the ISO C function sprintf. The only differences are that the options/modifiers *, h, L, l, n, and p are not supported and that there is an extra option, q.\nThe q option formats a string between double quotes, using escape sequences when necessary to ensure that it can safely be read back by the Lua interpreter. For instance, the call\n     string.format("%q", "a string with "quotes" and \n new line")\nmay produce the string:\n     "a string with \"quotes\" and \\n      new line"\nOptions A, a, E, e, f, G, and g all expect a number as argument. Options c, d, i, o, u, X, and x expect an integer. When Lua is compiled with a C89 compiler, options A and a (hexadecimal floats) do not support any modifier (flags, width, length).\nOption s expects a string; if its argument is not a string, it is converted to one following the same rules of tostring. If the option has any modifier (flags, width, length), the string argument should not contain embedded zeros.'
                    },
                    gmatch: {
                        type: TF,
                        args: [{name: 's'}, {name: 'pattern'}],
                        returns: 'function',
                        description: 'Returns an iterator function that, each time it is called, returns the next captures from pattern (see §6.4.1) over the string s. If pattern specifies no captures, then the whole match is produced in each call.\nAs an example, the following loop will iterate over all the words from string s, printing one per line:\n     s = "hello world from Lua"\n     for w in string.gmatch(s, "%a+") do\n       print(w)\n     end\nThe next example collects all pairs key=value from the given string into a table:\n     t = {}\n     s = "from=world, to=Lua"\n     for k, v in string.gmatch(s, "(%w+)=(%w+)") do\n       t[k] = v\n     end\nFor this function, a caret "^" at the start of a pattern does not work as an anchor, as this would prevent the iteration.'
                    },
                    gsub: {
                        type: TF,
                        args: [{name: 's'}, {name: 'pattern'}, {name: 'repl'}, {name: 'n', optional: true}],
                        returns: 'string',
                        description: '\nReturns a copy of s in which all (or the first n, if given) occurrences of the pattern (see §6.4.1) have been replaced by a replacement string specified by repl, which can be a string, a table, or a function. gsub also returns, as its second value, the total number of matches that occurred. The name gsub comes from Global SUBstitution.\nIf repl is a string, then its value is used for replacement. The character % works as an escape character: any sequence in repl of the form %d, with d between 1 and 9, stands for the value of the d-th captured substring. The sequence %0 stands for the whole match. The sequence %% stands for a single %.\nIf repl is a table, then the table is queried for every match, using the first capture as the key.\nIf repl is a function, then this function is called every time a match occurs, with all captured substrings passed as arguments, in order.\nIn any case, if the pattern specifies no captures, then it behaves as if the whole pattern was inside a capture.\nIf the value returned by the table query or by the function call is a string or a number, then it is used as the replacement string; otherwise, if it is false or nil, then there is no replacement (that is, the original match is kept in the string).'
                    },
                    len: {
                        type: TF,
                        args: [{name: 's'}],
                        returns: 'number',
                        description: 'Receives a string and returns its length. The empty string "" has length 0. Embedded zeros are counted, so "a\\000bc\\000" has length 5.'
                    },
                    lower: {
                        type: TF,
                        args: [{name: 's'}],
                        returns: 'string',
                        description: 'Receives a string and returns a copy of this string with all uppercase letters changed to lowercase. All other characters are left unchanged. The definition of what an uppercase letter is depends on the current locale.'
                    },
                    match: {
                        type: TF,
                        args: [{name: 's'}, {name: 'pattern'}, {name: 'init', optional: true}],
                        returns: 'string',
                        description: 'Looks for the first match of pattern (see §6.4.1) in the string s. If it finds one, then match returns the captures from the pattern; otherwise it returns nil. If pattern specifies no captures, then the whole match is returned. A third, optional numeric argument init specifies where to start the search; its default value is 1 and can be negative.'
                    },
                    pack: {
                        type: TF,
                        args: [{name: 'fmt'}, {name: 'v1'}, {name: 'v2'}, {name: '...'}],
                        returns: 'binary string',
                        description: 'Returns a binary string containing the values v1, v2, etc. packed (that is, serialized in binary form) according to the format string fmt (see §6.4.2).'
                    },
                    packsize: {
                        type: TF,
                        args: [{name: 'fmt'}],
                        returns: 'number',
                        description: 'Returns the size of a string resulting from string.pack with the given format. The format string cannot have the variable-length options "s" or "z" (see §6.4.2).'
                    },
                    rep: {
                        type: TF,
                        args: [{name: 's'}, {name: 'n'}, {name: 'sep', optional: true}],
                        returns: 'string',
                        description: 'Returns a string that is the concatenation of n copies of the string s separated by the string sep. The default value for sep is the empty string (that is, no separator). Returns the empty string if n is not positive.\n(Note that it is very easy to exhaust the memory of your machine with a single call to this function.)'
                    }, 
                    reverse: {
                        type: TF,
                        args: [{name: 's'}],
                        returns: 'string',
                        description: 'Returns a string that is the string s reversed.'
                    }, 
                    sub: {
                        type: TF,
                        args: [{name: 's'}, {name: 'i'}, {name: 'j', optional: true}],
                        returns: 'string',
                        description: 'Returns the substring of s that starts at i and continues until j; i and j can be negative. If j is absent, then it is assumed to be equal to -1 (which is the same as the string length). In particular, the call string.sub(s,1,j) returns a prefix of s with length j, and string.sub(s, -i) (for a positive i) returns a suffix of s with length i.\nIf, after the translation of negative indices, i is less than 1, it is corrected to 1. If j is greater than the string length, it is corrected to that length. If, after these corrections, i is greater than j, the function returns the empty string. '
                    }, 
                    unpack: {
                        type: TF,
                        args: [{name: 'fmt'}, {name: 's'}, {name: 'pos', optional: true}],
                        returns: '... (multiple values)',
                        description: 'Returns the values packed in string s (see string.pack) according to the format string fmt (see §6.4.2). An optional pos marks where to start reading in s (default is 1). After the read values, this function also returns the index of the first unread byte in s.'
                    }, 
                    upper: {
                        type: TF,
                        args: [{name: 's'}],
                        returns: 'string',
                        description: 'Receives a string and returns a copy of this string with all lowercase letters changed to uppercase. All other characters are left unchanged. The definition of what a lowercase letter is depends on the current locale.'
                    }  
                }
            },
            devinput: {
                type: TO,
                lib: 'dev',
                description: 'Manipulate input values.',
                children: {
                    setBool: {
                        type: TF,
                        args: [{name: 'index'}],
                        description: 'Sets the boolean value of the output composite on index to value. Index ranges from 1 - 32.'                        
                    },
                    setNumber: {
                        type: TF,
                        args: [{name: 'index'}],
                        description: 'Sets the number value of the output composite on index to value. Index ranges from 1 - 32.'                        
                    }
                }
            },
            pause: {
                type: TF,
                lib: 'dev',
                args: [],
                description: 'Pauses the script. Note: the currently running onTick() and onDraw() functions are executed.'
            },
            timer: {
                type: TO,
                lib: 'dev',
                description: 'Measure how long your code needs to execute.',
                children: {
                    start: {
                        type: TF,
                        args: [],
                        description: 'Starts the timer.'                        
                    },
                    stop: {
                        type: TF,
                        args: [],
                        description: 'Stops the timer and prints the time to the console.'                        
                    }
                }
            },
            print: {
                type: TF,
                lib: 'dev',
                args: [{name: 'text'}],
                description: 'Prints text to the console.'
            },            
            printColor: {
                type: TF,
                lib: 'dev',
                args: [{name: 'r'}, {name: 'g'}, {name: 'b'}],
                description: 'Colorizes the console output of print().'
            }
        }
    }

    return DEF
    
})()
;
DOCUMENTATION_DEFINITION_SERVER = (()=>{
    "use strict";

    const TO = DOCUMENTATION.TO
    const TF = DOCUMENTATION.TF
    const TV = DOCUMENTATION.TV
    const TA = DOCUMENTATION.TA
    const TE = DOCUMENTATION.TE

    const OBJECT_TYPE = {
        0: 'none',
        1: 'character',
        2: 'crate_small',
        3: 'collectable',
        4: 'basketball',
        5: 'television',
        6: 'barrel',
        7: 'schematic',
        8: 'debris',
        9: 'chair',
        10: 'trolley_food',
        11: 'trolley_med',
        12: 'clothing',
        13: 'office_chair',
        14: 'book',
        15: 'bottle',
        16: 'fryingpan',
        17: 'mug',
        18: 'saucepan',
        19: 'stool',
        20: 'telescope',
        21: 'log',
        22: 'bin',
        23: 'book_2',
        24: 'loot',
        25: 'blue_barrel',
        26: 'buoyancy_ring',
        27: 'container',
        28: 'gas_canister',
        29: 'pallet',
        30: 'storage_bin',
        31: 'fire_extinguisher',
        32: 'trolley_tool',
        33: 'cafetiere',
        34: 'drawers_tools',
        35: 'glass',
        36: 'microwave',
        37: 'plate',
        38: 'box_closed',
        39: 'box_open',
        40: 'desk_lamp',
        41: 'eraser_board',
        42: 'folder',
        43: 'funnel',
        44: 'lamp',
        45: 'microscope',
        46: 'notebook',
        47: 'pen_marker',
        48: 'pencil',
        49: 'scales',
        50: 'science_beaker',
        51: 'science_cylinder',
        52: 'science_flask',
        53: 'tub_1',
        54: 'tub_2',
        55: 'filestack',
        56: 'barrel_toxic',
        57: 'flare',
        58: 'fire',
        59: 'animal',
        60: 'map_label',
        61: 'iceberg',
        62: 'small_flare',
        63: 'big_flare'
    }

    const OUTFIT_TYPE = {
        0: 'none',
        1: 'worker',
        2: 'fishing',
        3: 'waiter',
        4: 'swimsuit',
        5: 'military',
        6: 'office',
        7: 'police',
        8: 'science',
        9: 'medical',
        10: 'wetsuit',
        11: 'civilian'
    }

    const POSITION_TYPE = {
        0: 'fixed',
        1: 'vehicle',
        2: 'object'
    }

    const NOTIFICATION_TYPE = {
        0: 'new_mission',
        1: 'new_mission_critical',
        2: 'failed_mission',
        3: 'failed_mission_critical',
        4: 'complete_mission',
        5: 'network_connect',
        6: 'network_disconnect',
        7: 'network_info',
        8: 'chat_message',
        9: 'network_info_critical'
    }

    const MARKER_TYPE = {
        0: 'delivery_target',
        1: 'survivor',
        2: 'object',
        3: 'waypoint',
        4: 'tutorial',
        5: 'fire',
        6: 'shark',
        7: 'ice',
        8: 'search_radius'
    }

    const LABEL_TYPE = {
        0: 'none',
        1: 'cross',
        2: 'wreckage',
        3: 'terminal',
        4: 'military',
        5: 'heritage',
        6: 'rig',
        7: 'industrial',
        8: 'hospital',
        9: 'science',
        10: 'airport',
        11: 'coastguard',
        12: 'lighthouse',
        13: 'fuel',
        14: 'fuel_sell'
    }

    const ZONE_TYPE = {
        0: 'box',
        1: 'sphere',
        2: 'radius'
    }

    const EQUIPMENT_ID = {
        0: 'none',
        1: 'diving',
        2: 'firefighter',
        3: 'scuba',
        4: 'parachute',
        5: 'arctic',        
        6: 'binoculars',
        7: 'cable',
        8: 'compass',
        9: 'defibrillator',
        10: 'fire_extinguisher',
        11: 'first_aid',
        12: 'flare',
        13: 'flaregun',
        14: 'flaregun_ammo',
        15: 'flashlight',
        16: 'hose',
        17: 'night_vision_binoculars',
        18: 'oxygen_mask',
        19: 'radio',
        20: 'radio_signal_locator',
        21: 'remote_control',
        22: 'rope',
        23: 'strobe_light',
        24: 'strobe_light_infrared',
        25: 'transponder',
        26: 'underwater_welding_torch',
        27: 'welding_torch'
    }


    const TYPE_STRING = {
        'zone': '',
        'object': '',
        'character': '',
        'vehicle': '',
        'flare': '',
        'fire': '',
        'loot': '',
        'button': '',
        'animal': '',
        'ice': '',
        'cargo_zone': ''
    }

    const GAME_SETTINGS = {
        'third_person': '',
        'third_person_vehicle': '',
        'vehicle_damage': '',
        'player_damage': '',
        'npc_damage': '',
        'sharks': '',
        'fast_travel': '',
        'teleport_vehicle': '',
        'rogue_mode': '',
        'auto_refuel': '',
        'megalodon': '',
        'map_show_players': '',
        'map_show_vehicles': '',
        'show_3d_waypoints': '',
        'show_name_plates': '',
        'day_night_length': 'number between 0-1, currently cannot be written to',
        'sunrise': 'currently cannot be written to',
        'sunset': 'currently cannot be written to',
        'infinite_money': '',
        'settings_menu': '',
        'unlock_all_islands': '',
        'infinite_batteries': '',
        'infinite_fuel': '',
        'engine_overheating': '',
        'no_clip': '',
        'map_teleport': '',
        'cleanup_veicle': '',
        'clear_fow': 'clear fog of war',
        'vehicle_spawning': '',
        'photo_mode': '',
        'respawning': '',
        'settings_menu_lock': '',
        'despawn_on_leave': 'despawn player characters on leave',
        'unlock_all_components': '',
    }

 



    const DEF = {
        children: {            
            onTick: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'game_ticks', help: 'ticks passed since last call of onTick. If the player is sleeping, this will be 400'}],
                description: 'Called everytime the game calculates a physics tick (~ 60 times per second)'
            },
            onCreate: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'is_world_create'}],
                description: 'Is called when the script is initialized.\nIf the script was initialized together with a new game, then is_world_create is true.\nIf the world was already running, or you loaded a savegame, it will be false.'
            },
            onDestroy: {
                type: TE,
                lib: 'stormworks',
                args: [],
                description: 'Is called whenever the world is exited (game closed).'
            },
            onCustomCommand: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'full_message'}, {name: 'user_peer_id'}, {name: 'is_admin'}, {name: 'is_auth'}, {name: 'command', help: 'includes the ? at the beginning'}, {name: 'args ...', help: 'either you use the three dot operator "..." and then access them as a table "local args = table.pack(...)" or you manually add arguments (e.g. arg1, arg2, arg3)'}],
                description: 'Called when someone types "?" followed by some text in the chat.\nwhitespace splits appart the command and args: "?command arg1 arg2 arg3"'
            },
            onChatMessage: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'sender_name'}, {name: 'message'}],
                description: 'Called when someone sends a chat message. This is similar to "onCustomCommand".'
            },



            onPlayerJoin: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'steam_id'}, {name: 'name'}, {name: 'peer_id'}, {name: 'is_admin'}, {name: 'is_auth'}],
                description: 'Caller when a player joins.'
            },
            onPlayerSit: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'peer_id'}, {name: 'vehicle_id'}, {name: 'seat_name'}],
                description: 'Called when a player enters a seat.'
            },
            onPlayerRespawn: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'peer_id'}],
                description: 'Called when a player respawns.'
            },
            onPlayerLeave: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'steam_id'}, {name: 'name'}, {name: 'peer_id'}, {name: 'is_admin'}, {name: 'is_auth'}],
                description: 'Called when a player leaves the server.'
            },
            onToggleMap: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'peer_id'}, {name: 'is_open'}],
                description: 'Called when a player opens or closes the map.'
            },
            onPlayerDie: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'steam_id'}, {name: 'name'}, {name: 'peer_id'}, {name: 'is_admin'}, {name: 'is_auth'}],
                description: 'Called when a player dies.'
            },
            onVehicleSpawn: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'vehicle_id'}, {name: 'peer_id'}, {name: 'x'}, {name: 'y'}, {name: 'z'}],
                description: 'Called when a vehicle is spawned in.'
            },
            onVehicleLoad: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'vehicle_id'}],
                description: ''
            },
            onVehicleTeleport: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'vehicle_id'}, {name: 'peer_id'}, {name: 'x'}, {name: 'y'}, {name: 'z'}],
                description: 'Called when a vehicle is teleported.'
            },
            onVehicleDespawn: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'vehicle_id'}, {name: 'peer_id'}],
                description: 'Called when a vehicle is despawned.'
            },
            onSpawnMissionObject: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'object_id', help: 'can also be a vehicle_id'}, {name: 'name'}, {name: 'TYPE_STRING', possibleValues: invertKeysAndValues(OBJECT_TYPE)}, {name: 'playlist_index'}],
                description: ''
            },
            onVehicleDamaged: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'vehicle_id'}, {name: 'damage_amount', help: 'damage_amount will be negative if the component is repaired.'}, {name: 'voxel_x'}, {name: 'voxel_y'}, {name: 'voxel_z'}],
                description: ''
            },
            onFireExtinguished: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'x'}, {name: 'y'}, {name: 'z'}],
                description: 'xxxxxx'
            },
            httpReply: {
                type: TE,
                lib: 'stormworks',
                args: [{name: 'port'}, {name: 'url'}, {name: 'response_body'}],
                description: 'Called when async.httpGet() receives a server response. Port and url will be the values that you put into async.httpGet() as arguments.'
            },
            g_savedata: {
                type: TO,
                lib: 'stormworks',
                args: [],
                description: 'Globaly accessible table, that can be written to and read from. When the game closes, values from lua will be stored in the savegame XML.'
            },
            server: {
                type: TO,
                lib: 'stormworks',
                description: 'All the functionality for server scripts\n\npeer_id can be passed as -1 to send for all connected peers',
                children: {
                    getVideoTutorials: {
                        type: TF,
                        args: [],
                        returns: 'boolean',
                        description: 'Returns true when player has clicked on "Video Tutorials" in the menu already, false otherwise.'
                    },
                    getTutorial: {
                        type: TF,
                        args: [],
                        returns: 'boolean',
                        description: 'Returns true if tutorial is completed'
                    },
                    createPopup: {
                        type: TF,
                        bugs: 'Why is this here? Remove this thing please!',
                        args: [{name: 'peer_id'}, {name: 'ui_id'}],
                        description: 'Creates a popup with the text "Test", spawned at 0,0. Can only be removed by calling removePopup() without passing a ui_id.'
                    },
                    setPopup: {
                        type: TF,
                        bugs: 'This functions creates a second (unwanted) popup at 0,0,0 that shows the value of the "name" argument.',
                        args: [{name: 'peer_id'}, {name: 'ui_id'}, {name: 'name'}, {name: 'is_show'}, {name: 'text'}, {name: 'x'}, {name: 'y'}, {name: 'z'}, {name: 'is_worldspace'}, {name: 'render_distance'}],
                        description: ''
                    },
                    removePopup: {
                        type: TF,
                        bugs: 'when you ui_id is undefined, the second (unwanted) popup from setPopup is being removed.',
                        args: [{name: 'peer_id'}, {name: 'ui_id'}],
                        description: ''
                    },
                    getMapID: {
                        type: TF,
                        args: [],
                        returns: 'number',
                        description: 'Creates a new unique id that is required to create Map Objects.'
                    },
                    announce: {
                        type: TF,
                        args: [{name: 'name', help: 'The orange text on the left'}, {name: 'message'}, {name: 'peer_id', optional: true}],
                        description: 'Sends a chat message. If you omit the argument peer_id, it will be sent to everyone. If it is specified, it will be sent to only the specified player'
                    },



                    addAdmin: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: 'Assigns a player the admin role'
                    },
                    removeAdmin: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: 'Revokes a players admin role'
                    },
                    addAuth: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: 'Assigns a player the authenticated role'
                    },
                    removeAuth: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: 'Revokes a players authenticated role'
                    },
                    notify: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'title'}, {name: 'message'}, {name: 'NOTIFICATION_TYPE', possibleValues: NOTIFICATION_TYPE}],
                        description: ''
                    },
                    removeMapID: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'ui_id'}],
                        description: ''
                    },
                    addMapObject: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'ui_id'}, {name: 'POSITION_TYPE', possibleValues: POSITION_TYPE}, {name: 'MARKER_TYPE', possibleValues: MARKER_TYPE}, {name: 'x'}, {name: 'y'}, {name: 'z'}, {name: 'parent_local_x'}, {name: 'parent_local_y'}, {name: 'parent_local_z'}, {name: 'vehicle_id'}, {name: 'object_id'}, {name: 'label'}, {name: 'vehicle_parent_id'}, {name: 'radius'}, {name: 'hover_label'}],
                        description: ''
                    },
                    removeMapObject: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'ui_id'}],
                        description: ''
                    },
                    addMapLabel: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'ui_id'}, {name: 'LABEL_TYPE', possibleValues: LABEL_TYPE}, {name: 'name'}, {name: 'x'}, {name: 'y'}, {name: 'z'}],
                        description: ''
                    },
                    removeMapLabel: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'ui_id'}],
                        description: ''
                    },
                    addMapLine: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'ui_id'}, {name: 'start_matrix'}, {name: 'end_matrix'}, {name: 'width'}],
                        description: ''
                    },
                    removeMapLine: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'ui_id'}],
                        description: ''
                    },
                    getPlayerName: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: 'Returns name of the player'
                    },
                    getPlayers: {
                        type: TF,
                        args: [],
                        description: 'Returns list of all players' + '{ [peer_index] = {["id"] = peer_id, ["name"] = name, ["admin"] = is_admin, ["auth"] = is_auth}}'
                    },
                    getPlayerPos: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: 'Returns a matrix'
                    },
                    teleportPlayer: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'matrix'}],
                        description: ''
                    },
                    killPlayer: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: ''
                    },
                    setSeated: {
                        type: TF,
                        args: [{name: 'peer_id'}, {name: 'vehicle_id'}, {name: 'seat_name'}],
                        description: ''
                    },
                    getPlayerLookDirection: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: 'Returns x,y,z of the players look direction'
                    },
                    spawnVehicle: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'playlist_index'}, {name: 'component_id'}],
                        description: ''
                    },
                    spawnVehicleSavefile: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'save_name'}],
                        description: ''
                    },
                    despawnVehicle: {
                        type: TF,
                        args: [{name: 'vehicle_id'}, {name: 'is_instant', help: 'true removes the vehicle right now, false removes it when area unloads (no players nearby or keep active vehicles)'}],
                        description: ''
                    },
                    getVehiclePos: {
                        type: TF,
                        args: [{name: 'vehicle_id'}, {name: 'voxel_x'}, {name: 'voxel_y'}, {name: 'voxel_z'}],
                        description: 'Returns position as a matrix'
                    },
                    getVehicleName: {
                        type: TF,
                        args: [{name: 'vehicle_id'}],
                        description: 'Returns name of the vehicle'
                    },
                    teleportVehicle: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'vehicle_id'}],
                        description: ''
                    },
                    cleanVehicles: {
                        type: TF,
                        args: [],
                        description: ''
                    },
                    pressVehicleButton: {
                        type: TF,
                        args: [{name: 'vehicle_id'}, {name: 'button_name'}],
                        description: ''
                    },
                    getVehicleFireCount: {
                        type: TF,
                        args: [{name: 'vehicle_id'}],
                        description: ''
                    },
                    setVehicleTooltip: {
                        type: TF,
                        args: [{name: 'vehicle_id'}, {name: 'text'}],
                        description: ''
                    },
                    getVehicleSimulating: {
                        type: TF,
                        args: [{name: 'vehicle_id'}],
                        description: ''
                    },
                    setVehicleTransponder: {
                        type: TF,
                        args: [{name: 'vehicle_id'}, {name: 'is_active'}],
                        description: ''
                    },
                    pressVehicleButton: {
                        type: TF,
                        args: [{name: 'vehicle_id'}, {name: 'is_editable'}],
                        description: ''
                    },
                    getPlaylistIndexByName: {
                        type: TF,
                        args: [{name: 'name'}],
                        description: ''
                    },
                    getPlaylistIndexCurrent: {
                        type: TF,
                        args: [],
                        description: ''
                    },
                    getLocationIndexByName: {
                        type: TF,
                        args: [{name: 'playlist_index'}, {name: 'name'}],
                        description: ''
                    },
                    spawnThisPlaylistMissionLocation: {
                        type: TF,
                        args: [{name: 'name'}],
                        description: ''
                    },
                    spawnMissionLocation: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'playlist_index'}, {name: 'location_index'}],
                        description: 'if matrix = 0,0,0 it will spawn at a random location'
                    },
                    getPlaylistPath: {
                        type: TF,
                        args: [{name: 'playlist_name'}, {name: 'is_rom'}],
                        description: ''
                    },
                    spawnObject: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'OBJECT_TYPE', possibleValues: OBJECT_TYPE}],
                        description: ''
                    },
                    getObjectPos: {
                        type: TF,
                        args: [{name: 'object_id'}],
                        description: 'Returns is_found, matrix'
                    },
                    spawnFire: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'size'}, {name: 'magnitude'}, {name: 'is_lit'}, {name: 'is_initialzied'}, {name: 'is_explosive'}, {name: 'parent_vehicle_id'}, {name: 'explosion_point'}, {name: 'explosion_magnitude'}],
                        description: 'Returns object_id'
                    },
                    despawnObject: {
                        type: TF,
                        args: [{name: 'object_id'}, {name: 'is_instant'}],
                        description: ''
                    },
                    spawnCharacter: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'outfit_id', optional: true}],
                        description: 'Returns object_id'
                    },
                    spawnAnimal: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'animal_type'}, {name: 'scale'}],
                        description: 'Returns object_id'
                    },
                    despawnCharacter: {
                        type: TF,
                        args: [{name: 'object_id'}, {name: 'is_instant'}],
                        description: ''
                    },
                    getCharacterData: {
                        type: TF,
                        args: [{name: 'object_id'}],
                        description: 'Returns hp, matrix'
                    },
                    setCharacterData: {
                        type: TF,
                        args: [{name: 'object_id'}, {name: 'hp'}, {name: 'is_interactable'}],
                        description: ''
                    },
                    setCharacterItem: {
                        type: TF,
                        args: [{name: 'object_id'}, {name: 'slot'}, {name: 'EQUIPMENT_ID', possibleValues: EQUIPMENT_ID}, {name: 'is_active'}],
                        description: ''
                    },
                    setTutorial: {
                        type: TF,
                        args: [{name: '?'}],
                        description: 'Can be used to set tutorial completed (not tested yet).'
                    },
                    getZones: {
                        type: TF,
                        args: [{name: 'tag(s)'}],
                        description: 'Returns ZONE_LIST: ' + '{ [zone_index] = { ["name"] = name,["transform"] = matrix,["size"] = {x, y, z},["radius"] = radius,["type"] = ZONE_TYPE ,["tags"] = { [i] = tag } }}'
                    },
                    isInZone: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'zone_name'}],
                        description: 'Returns is_in_zone'
                    },
                    spawnMissionObject: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'playlist_index'}, {name: 'location_index'}, {name: 'object_index'}],
                        description: ''
                    },
                    despawnMissionObject: {
                        type: TF,
                        args: [{name: 'object_id'}, {name: 'is_instant'}],
                        description: ''
                    },
                    getPlaylistCount: {
                        type: TF,
                        args: [],
                        description: 'Returns count'
                    },
                    getPlaylistData: {
                        type: TF,
                        args: [{name: 'playlist_index'}],
                        description: 'Returns PLAYLIST_DATA: ' + '{ ["name"] = name, ["path_id"] = folder_path, ["file_store"] = is_app_data, ["location_count"] = location_count }'
                    },
                    getLocationData: {
                        type: TF,
                        args: [{name: 'playlist_index'}, {name: 'location_index'}],
                        description: 'Returns LOCATION_DATA: ' + '{ ["name"] = name, ["tile"] = tile_filename, ["env_spawn_count"] = spawn_count, ["env_mod"] = is_env_mod, ["object_count"] = object_count }'
                    },
                    getLocationObjectData: {
                        type: TF,
                        args: [{name: 'playlist_index'}, {name: 'location_index'}, {name: 'object_index'}],
                        description: 'Returns OBJECT_DATA: ' + '{ ["name"] = name, ["display_name"] = display_name, ["type"] = TYPE_STRING, ["id"] = component_id, ["dynamic_object_type"] = OBJECT_TYPE, ["tags"] = { [i] = tag }, ["transform"] = matrix, ["character_outfit_type"] = OUTFIT_TYPE }'
                    },
                    setFireData: {
                        type: TF,
                        args: [{name: 'object_id'}, {name: 'is_lit'}, {name: 'is_explosive'}],
                        description: ''
                    },
                    getFireData: {
                        type: TF,
                        args: [{name: 'object_id'}],
                        description: 'Returns is_lit'
                    },
                    getOceanTransform: {
                        type: TF,
                        args: [{name: 'matrix'}, {name: 'min_search_range'}, {name: 'max_search_range'}],
                        description: 'Returns matrix'
                    },
                    isInTransformArea: {
                        type: TF,
                        args: [{name: 'matrix_object'}, {name: 'matrix_zone'}, {name: 'zone_x'},{name: 'zone_y'}, {name: 'zone_z'}],
                        description: 'Returns is_in_area'
                    },
                    setGameSetting: {
                        type: TF,
                        args: [{name: 'GAME_SETTING', possibleValues: GAME_SETTINGS}, {name: 'value'}],
                        description: 'Some settings cannot be set: "day_night_length", "sunrise", "sunset"'
                    },
                    getGameSettings: {
                        type: TF,
                        args: [],
                        description: 'Returns a table with all the game settings (key = setting name, value = setting value)'
                    },
                    setCurrency: {
                        type: TF,
                        args: [{name: 'money'}, {name: 'research'}],
                        description: 'Sets the amount of money and research'
                    },
                    getCurrency: {
                        type: TF,
                        args: [],
                        description: 'Returns the amount of money'
                    },
                    getResearchPoints: {
                        type: TF,
                        args: [],
                        description: 'Returns the amount of research points'
                    },
                    getDateValue: {
                        type: TF,
                        args: [],
                        description: 'Returns time since game has started in ingame days'
                    },
                    getTimeMillisec: {
                        type: TF,
                        args: [],
                        description: ''
                    },
                    getTilePurchased: {
                        type: TF,
                        args: [{name: 'matrix'}],
                        description: 'Returns is_purchased'
                    },
                    httpGet: {
                        type: TF,
                        args: [{name: 'port'}, {name: 'request'}],
                        description: 'Returns is_purchased'
                    },
                    banPlayer: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: ''
                    },
                    kickPlayer: {
                        type: TF,
                        args: [{name: 'peer_id'}],
                        description: ''
                    },
                    setVehicleEditable: {
                        type: TF,
                        args: [],
                        description: ''
                    }
                }
            },
            matrix: {
                type: TO,
                lib: 'stormworks',
                description: 'Helpful library to work with matrices',
                children: {
                    multiply: {
                        type: TF,
                        args: [{name: 'matrix1'}, {name: 'matrix2'}],
                        returns: 'matrix',
                        description: 'Multiplies two matrix.'
                    },
                    invert: {
                        type: TF,
                        args: [{name: 'matrix'}],
                        returns: 'matrix',
                        description: 'Inverts the matrix.'
                    },
                    transpose: {
                        type: TF,
                        args: [{name: 'matrix'}],
                        returns: 'matrix',
                        description: 'Transposes the matrix.'
                    },
                    identity: {
                        type: TF,
                        args: [],
                        returns: 'matrix',
                        description: 'Returns the special identity matrix.'
                    },
                    rotationX: {
                        type: TF,
                        args: [{name: 'radians'}],
                        bugs: 'Might be as wrong as .position()',
                        returns: 'matrix',
                        description: 'Creates a rotation matrix around the x axis.'
                    },
                    rotationY: {
                        type: TF,
                        args: [{name: 'radians'}],
                        bugs: 'Might be as wrong as .position()',
                        returns: 'matrix',
                        description: 'Creates a rotation matrix around the y axis.'
                    },
                    rotationZ: {
                        type: TF,
                        args: [{name: 'radians'}],
                        bugs: 'Might be as wrong as .position()',
                        returns: 'matrix',
                        description: 'Creates a rotation matrix around the z axis.'
                    },
                    translation: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}, {name: 'z'}],
                        bugs: 'Might be as wrong as .position()',
                        returns: 'matrix',
                        description: 'Creates a translation matrix.'
                    },
                    position: {
                        type: TF,
                        args: [{name: 'matrix'}],
                        bugs: 'Documentation says it should return x,y,z but it actually returns ',
                        returns: 'x,z,y',
                        description: 'Returns x,y (map coordinates), z (altitude) values of the matrix.'
                    },
                    distance: {
                        type: TF,
                        args: [{name: 'matrix1'}, {name: 'matrix2'}],
                        returns: 'number',
                        description: 'Calculates distance between two matrixes.'
                    }
                }
            },
            async: {
                type: TO,
                lib: 'stormworks',
                description: 'Execute HTTP requests.',
                children: {
                    httpGet: {
                        type: TF,
                        args: [{name: 'port'}, {name: 'url'}],
                        description: 'Creates a HTTP request to "http://localhost:[PORT][url]". If you call it more then once per tick, the request will be put into a queue, every tick one reqeust will be taken from that queue and executed.\n\nIMPORTANT:\nYou must follow these steps to enable http support in this Lua IDE:\nYour browser prohibits sending and receiving data to and from localhost. To fix that, follow the <a href="http-allow-localhost" target="_blank">manual here</a>'
                    }
                }
            },
            pairs: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'table'}],
                description: 'If table has a metamethod __pairs, calls it with t as argument and returns the first three results from the call.\nOtherwise, returns three values: the next function, the table t, and nil, so that the construction\n     for k,v in pairs(t) do body end\nwill iterate over all key–value pairs of table t.\nSee function next for the caveats of modifying the table during its traversal.'
            },
            ipairs: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'table'}],
                description: 'Returns three values (an iterator function, the table t, and 0) so that the construction\nfor i,v in ipairs(t) do body end\nwill iterate over the key–value pairs (1,t[1]), (2,t[2]), ..., up to the first nil value.'
            },
            next: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'table'}, {name: 'index', optional: true}],
                description: 'Allows a program to traverse all fields of a table. Its first argument is a table and its second argument is an index in this table. next returns the next index of the table and its associated value. When called with nil as its second argument, next returns an initial index and its associated value. When called with the last index, or with nil in an empty table, next returns nil. If the second argument is absent, then it is interpreted as nil. In particular, you can use next(t) to check whether a table is empty.\nThe order in which the indices are enumerated is not specified, even for numeric indices. (To traverse a table in numerical order, use a numerical for.)\nThe behavior of next is undefined if, during the traversal, you assign any value to a non-existent field in the table. You may however modify existing fields. In particular, you may clear existing fields.'
            },
            tostring: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'v'}],
                description: 'Receives a value of any type and converts it to a string in a human-readable format. (For complete control of how numbers are converted, use string.format.)\nIf the metatable of v has a __tostring field, then tostring calls the corresponding value with v as argument, and uses the result of the call as its result.'
            },
            tonumber: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'e'}, {name: 'base', optional: true}],
                description: 'When called with no base, tonumber tries to convert its argument to a number. If the argument is already a number or a string convertible to a number, then tonumber returns this number; otherwise, it returns nil.\nThe conversion of strings can result in integers or floats, according to the lexical conventions of Lua (see §3.1). (The string may have leading and trailing spaces and a sign.)\nWhen called with base, then e must be a string to be interpreted as an integer numeral in that base. The base may be any integer between 2 and 36, inclusive. In bases above 10, the letter "A" (in either upper or lower case) represents 10, "B" represents 11, and so forth, with "Z" representing 35. If the string e is not a valid numeral in the given base, the function returns nil.'
            },
            math: {
                type: TO,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.7',
                description: 'This library provides basic mathematical functions. It provides all its functions and constants inside the table math. Functions with the annotation "integer/float" give integer results for integer arguments and float results for float (or mixed) arguments. Rounding functions (math.ceil, math.floor, and math.modf) return an integer when the result fits in the range of an integer, or a float otherwise.',
                children: {                    
                    abs: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the absolute value of x. (integer/float) '
                    },
                    acos: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the arc cosine of x (in radians). '
                    },
                    asin: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the arc sine of x (in radians). '
                    },
                    atan: {
                        type: TF,
                        args: [{name: 'y'}, {name: 'x', optional: true}],
                        description: ' Returns the arc tangent of y/x (in radians), but uses the signs of both arguments to find the quadrant of the result. (It also handles correctly the case of x being zero.)\nThe default value for x is 1, so that the call math.atan(y) returns the arc tangent of y.'
                    },
                    ceil: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the smallest integral value larger than or equal to x.'
                    },
                    cos: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the cosine of x (assumed to be in radians).'
                    },
                    deg: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Converts the angle x from radians to degrees.'
                    },
                    exp: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the value e raised to the power x (where e is the base of natural logarithms).'
                    },
                    floor: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the largest integral value smaller than or equal to x.'
                    },
                    fmod: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}],
                        description: 'Returns the remainder of the division of x by y that rounds the quotient towards zero. (integer/float)'
                    },
                    huge: {
                        type: TF,
                        args: [],
                        description: 'The float value HUGE_VAL, a value larger than any other numeric value.'
                    },
                    log: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Inverse function of math.exp(x).'
                    },
                    max: {
                        type: TF,
                        args: [{name: 'x'}, {name: '···'}],
                        description: 'Returns the argument with the maximum value, according to the Lua operator <. (integer/float)'
                    },
                    maxinteger: {
                        type: TF,
                        args: [],
                        description: 'An integer with the maximum value for an integer. '
                    },
                    min: {
                        type: TF,
                        args: [{name: 'x'}, {name: '···'}],
                        description: 'Returns the argument with the minimum value, according to the Lua operator <. (integer/float)'
                    },
                    mininteger: {
                        type: TF,
                        args: [],
                        description: 'An integer with the minimum value for an integer. '
                    },
                    modf: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the integral part of x and the fractional part of x. Its second result is always a float.'
                    },
                    pi: {
                        type: TV,
                        description: 'The value of π.'
                    },
                    rad: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Converts the angle x from degrees to radians.'
                    },
                    random: {
                        type: TF,
                        args: [{name: 'm', optional: true}, {name: 'n', optional: true}],
                        description: ' When called without arguments, returns a pseudo-random float with uniform distribution in the range [0,1). When called with two integers m and n, math.random returns a pseudo-random integer with uniform distribution in the range [m, n]. (The value n-m cannot be negative and must fit in a Lua integer.) The call math.random(n) is equivalent to math.random(1,n).\nThis function is an interface to the underling pseudo-random generator function provided by C.'
                    },
                    randomseed: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Sets x as the "seed" for the pseudo-random generator: equal seeds produce equal sequences of numbers.'
                    },
                    sin: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the sine of x (assumed to be in radians).'
                    },
                    sqrt: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the square root of x. (You can also use the expression x^0.5 to compute this value.)'
                    },
                    tan: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the tangent of x (assumed to be in radians).'
                    },
                    tointeger: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'If the value x is convertible to an integer, returns that integer. Otherwise, returns nil.'
                    },
                    type: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns "integer" if x is an integer, "float" if it is a float, or nil if x is not a number.'
                    },
                    ult: {
                        type: TF,
                        args: [{name: 'm'}, {name: 'n'}],
                        description: 'Returns a boolean, true if and only if integer m is below integer n when they are compared as unsigned integers.'
                    }
                }
            },
            table: {
                type: TO,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.6',
                description: ' This library provides generic functions for table manipulation. It provides all its functions inside the table table.\nRemember that, whenever an operation needs the length of a table, all caveats about the length operator apply (see §3.4.7). All functions ignore non-numeric keys in the tables given as arguments.',
                children: {
                    concat: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'sep', optional: true}, {name: 'i', optional: true}, {name: 'j', optional: true}],
                        description: 'Given a list where all elements are strings or numbers, returns the string list[i]..sep..list[i+1] ··· sep..list[j]. The default value for sep is the empty string, the default for i is 1, and the default for j is #list. If i is greater than j, returns the empty string.'
                    },
                    insert: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'pos', optional: true}, {name: 'value'}],
                        description: 'Inserts element value at position pos in list, shifting up the elements list[pos], list[pos+1], ···, list[#list]. The default value for pos is #list+1, so that a call table.insert(t,x) inserts x at the end of list t.'
                    },
                    move: {
                        type: TF,
                        args: [{name: 'a1'}, {name: 'f'}, {name: 'e'}, {name: 't'}, {name: 'a2', optional: true}],
                        description: ' Moves elements from table a1 to table a2, performing the equivalent to the following multiple assignment: a2[t],··· = a1[f],···,a1[e]. The default for a2 is a1. The destination range can overlap with the source range. The number of elements to be moved must fit in a Lua integer.\nReturns the destination table a2.'
                    },
                    pack: {
                        type: TF,
                        args: [{name: '···'}],
                        description: 'Returns a new table with all arguments stored into keys 1, 2, etc. and with a field "n" with the total number of arguments. Note that the resulting table may not be a sequence.'
                    },
                    remove: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'pos', optional: true}],
                        description: ' Removes from list the element at position pos, returning the value of the removed element. When pos is an integer between 1 and #list, it shifts down the elements list[pos+1], list[pos+2], ···, list[#list] and erases element list[#list]; The index pos can also be 0 when #list is 0, or #list + 1; in those cases, the function erases the element list[pos].\nThe default value for pos is #list, so that a call table.remove(l) removes the last element of list l.'
                    },
                    sort: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'comp', optional: true}],
                        description: ' Sorts list elements in a given order, in-place, from list[1] to list[#list]. If comp is given, then it must be a function that receives two list elements and returns true when the first element must come before the second in the final order (so that, after the sort, i < j implies not comp(list[j],list[i])). If comp is not given, then the standard Lua operator < is used instead.\nNote that the comp function must define a strict partial order over the elements in the list; that is, it must be asymmetric and transitive. Otherwise, no valid sort may be possible.\nThe sort algorithm is not stable: elements considered equal by the given order may have their relative positions changed by the sort.'
                    },
                    unpack: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'i', optional: true}, {name: 'j', optional: true}],
                        description: ' Returns the elements from the given list. This function is equivalent to\n    return list[i], list[i+1], ···, list[j]\nBy default, i is 1 and j is #list.'
                    }
                }
            },
            type: {
                type: TF,
                lib: 'lua',
                description: 'Returns a string, which is the type of the supplied argument:\n"nil"\n"number"\n"string"\n"boolean"\n"table"\n"function"\n"thread"\n"userdata"',
                args: [{name: 'v'}]
            },
            string: {
                type: TO,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.4',
                description: ' This library provides generic functions for string manipulation, such as finding and extracting substrings, and pattern matching. When indexing a string in Lua, the first character is at position 1 (not at 0, as in C). Indices are allowed to be negative and are interpreted as indexing backwards, from the end of the string. Thus, the last character is at position -1, and so on.\nThe string library assumes one-byte character encodings.',
                children: {
                    byte: {
                        type: TF,
                        args: [{name: 's'}, {name: 'i', optional: true}, {name: 'j', optional: true}],
                        description: 'Returns the internal numeric codes of the characters s[i], s[i+1], ..., s[j]. The default value for i is 1; the default value for j is i. These indices are corrected following the same rules of function string.sub.\nNumeric codes are not necessarily portable across platforms.'
                    },
                    char: {
                        type: TF,
                        args: [{name: '···'}],
                        description: 'Receives zero or more integers. Returns a string with length equal to the number of arguments, in which each character has the internal numeric code equal to its corresponding argument.\nNumeric codes are not necessarily portable across platforms.'
                    },
                    dump: {
                        type: TF,
                        args: [{name: 'function'}, {name: 'strip', optional: true}],
                        description: ' Returns a string containing a binary representation (a binary chunk) of the given function, so that a later load on this string returns a copy of the function (but with new upvalues). If strip is a true value, the binary representation may not include all debug information about the function, to save space.\nFunctions with upvalues have only their number of upvalues saved. When (re)loaded, those upvalues receive fresh instances containing nil. (You can use the debug library to serialize and reload the upvalues of a function in a way adequate to your needs.)'
                    },
                    find: {
                        type: TF,
                        args: [{name: 's'}, {name: 'patter'}, {name: 'init', optional: true}, {name: 'plain', optional: true}],
                        description: ' Looks for the first match of pattern (see §6.4.1) in the string s. If it finds a match, then find returns the indices of s where this occurrence starts and ends; otherwise, it returns nil. A third, optional numeric argument init specifies where to start the search; its default value is 1 and can be negative. A value of true as a fourth, optional argument plain turns off the pattern matching facilities, so the function does a plain "find substring" operation, with no characters in pattern being considered magic. Note that if plain is given, then init must be given as well.\nIf the pattern has captures, then in a successful match the captured values are also returned, after the two indices.'
                    },
                    format: {
                        type: TF,
                        args: [{name: 'formatstring'}, {name: '···'}],
                        description: ' Returns a formatted version of its variable number of arguments following the description given in its first argument (which must be a string). The format string follows the same rules as the ISO C function sprintf. The only differences are that the options/modifiers *, h, L, l, n, and p are not supported and that there is an extra option, q.\nThe q option formats a string between double quotes, using escape sequences when necessary to ensure that it can safely be read back by the Lua interpreter. For instance, the call\n     string.format("%q", "a string with "quotes" and \n new line")\nmay produce the string:\n     "a string with \"quotes\" and \\n      new line"\nOptions A, a, E, e, f, G, and g all expect a number as argument. Options c, d, i, o, u, X, and x expect an integer. When Lua is compiled with a C89 compiler, options A and a (hexadecimal floats) do not support any modifier (flags, width, length).\nOption s expects a string; if its argument is not a string, it is converted to one following the same rules of tostring. If the option has any modifier (flags, width, length), the string argument should not contain embedded zeros.'
                    },
                    gmatch: {
                        type: TF,
                        args: [{name: 's'}, {name: 'pattern'}],
                        description: 'Returns an iterator function that, each time it is called, returns the next captures from pattern (see §6.4.1) over the string s. If pattern specifies no captures, then the whole match is produced in each call.\nAs an example, the following loop will iterate over all the words from string s, printing one per line:\n     s = "hello world from Lua"\n     for w in string.gmatch(s, "%a+") do\n       print(w)\n     end\nThe next example collects all pairs key=value from the given string into a table:\n     t = {}\n     s = "from=world, to=Lua"\n     for k, v in string.gmatch(s, "(%w+)=(%w+)") do\n       t[k] = v\n     end\nFor this function, a caret "^" at the start of a pattern does not work as an anchor, as this would prevent the iteration.'
                    },
                    gsub: {
                        type: TF,
                        args: [{name: 's'}, {name: 'pattern'}, {name: 'repl'}, {name: 'n', optional: true}],
                        description: '\nReturns a copy of s in which all (or the first n, if given) occurrences of the pattern (see §6.4.1) have been replaced by a replacement string specified by repl, which can be a string, a table, or a function. gsub also returns, as its second value, the total number of matches that occurred. The name gsub comes from Global SUBstitution.\nIf repl is a string, then its value is used for replacement. The character % works as an escape character: any sequence in repl of the form %d, with d between 1 and 9, stands for the value of the d-th captured substring. The sequence %0 stands for the whole match. The sequence %% stands for a single %.\nIf repl is a table, then the table is queried for every match, using the first capture as the key.\nIf repl is a function, then this function is called every time a match occurs, with all captured substrings passed as arguments, in order.\nIn any case, if the pattern specifies no captures, then it behaves as if the whole pattern was inside a capture.\nIf the value returned by the table query or by the function call is a string or a number, then it is used as the replacement string; otherwise, if it is false or nil, then there is no replacement (that is, the original match is kept in the string).'
                    },
                    len: {
                        type: TF,
                        args: [{name: 's'}],
                        description: 'Receives a string and returns its length. The empty string "" has length 0. Embedded zeros are counted, so "a\\000bc\\000" has length 5.'
                    },
                    lower: {
                        type: TF,
                        args: [{name: 's'}],
                        description: 'Receives a string and returns a copy of this string with all uppercase letters changed to lowercase. All other characters are left unchanged. The definition of what an uppercase letter is depends on the current locale.'
                    },
                    match: {
                        type: TF,
                        args: [{name: 's'}, {name: 'pattern'}, {name: 'init', optional: true}],
                        description: 'Looks for the first match of pattern (see §6.4.1) in the string s. If it finds one, then match returns the captures from the pattern; otherwise it returns nil. If pattern specifies no captures, then the whole match is returned. A third, optional numeric argument init specifies where to start the search; its default value is 1 and can be negative.'
                    },
                    pack: {
                        type: TF,
                        args: [{name: 'fmt'}, {name: 'v1'}, {name: 'v2'}, {name: '···'}],
                        description: 'Returns a binary string containing the values v1, v2, etc. packed (that is, serialized in binary form) according to the format string fmt (see §6.4.2).'
                    },
                    packsize: {
                        type: TF,
                        args: [{name: 'fmt'}],
                        description: 'Returns the size of a string resulting from string.pack with the given format. The format string cannot have the variable-length options "s" or "z" (see §6.4.2).'
                    },
                    rep: {
                        type: TF,
                        args: [{name: 's'}, {name: 'n'}, {name: 'sep', optional: true}],
                        description: 'Returns a string that is the concatenation of n copies of the string s separated by the string sep. The default value for sep is the empty string (that is, no separator). Returns the empty string if n is not positive.\n(Note that it is very easy to exhaust the memory of your machine with a single call to this function.)'
                    }, 
                    reverse: {
                        type: TF,
                        args: [{name: 's'}],
                        description: 'Returns a string that is the string s reversed.'
                    }, 
                    sub: {
                        type: TF,
                        args: [{name: 's'}, {name: 'i'}, {name: 'j', optional: true}],
                        description: 'Returns the substring of s that starts at i and continues until j; i and j can be negative. If j is absent, then it is assumed to be equal to -1 (which is the same as the string length). In particular, the call string.sub(s,1,j) returns a prefix of s with length j, and string.sub(s, -i) (for a positive i) returns a suffix of s with length i.\nIf, after the translation of negative indices, i is less than 1, it is corrected to 1. If j is greater than the string length, it is corrected to that length. If, after these corrections, i is greater than j, the function returns the empty string. '
                    }, 
                    unpack: {
                        type: TF,
                        args: [{name: 'fmt'}, {name: 's'}, {name: 'pos', optional: true}],
                        description: 'Returns the values packed in string s (see string.pack) according to the format string fmt (see §6.4.2). An optional pos marks where to start reading in s (default is 1). After the read values, this function also returns the index of the first unread byte in s.'
                    }, 
                    upper: {
                        type: TF,
                        args: [{name: 's'}],
                        description: 'Receives a string and returns a copy of this string with all lowercase letters changed to uppercase. All other characters are left unchanged. The definition of what a lowercase letter is depends on the current locale.'
                    }  
                }
            }
        }
    }

    /*
        returns a new object {value1: key1, value2: key2}
        if values are not unique, the keys might be overriden!!
    */
    function invertKeysAndValues(obj){
        let ret = {}
        for(let k of Object.keys(obj)){
            ret[obj[k]] = k
        }

        return ret
    }

    return DEF
    
})()
;
YYY = (($)=>{
    "use strict";

    let noExitConfirm = false

    let isCustomMinifiedCode = false

    LOADER.on(LOADER.EVENT.UI_READY, init)

    function init(){


        if(!document.location.href || document.location.href.indexOf('file') >= 0 ||  document.location.href.indexOf('localhost') >= 0){
            $('#share').attr('style', 'display: none!important')
        }


        /* navigation menu */
        $('#menu-open, #navigation .center').on('click', ()=>{
            if($('#navigation').hasClass('open')){
                $('#navigation').removeClass('open')
                $('#navigation').animate({
                    top: '0px'
                })
            } else {
                $('#navigation').animate({
                    top: '80vh'
                }, ()=>{
                    $('#navigation').addClass('open')
                })
            }
        })

        $('#download-offline').on('click', ()=>{
            REPORTER.report(REPORTER.REPORT_TYPE_IDS.downloadOffline)
        })

        ENGINE.refresh()

        UTIL.hint('Important Change Notification', 'Due to weird drawing on Chrome (and other webkit browsers), i reverted the drawing algorithm back to the one you know from the old, orange Lua IDE. Sorry you Firefox users, you loose the new accuracy after just a few days :(')
        
        LOADER.done(LOADER.EVENT.OTHERS_READY)
    }

    return {
        noExitConfirm: noExitConfirm,
        makeNoExitConfirm: ()=>{
            noExitConfirm = true
        },
        isCustomMinifiedCode: ()=>{ return isCustomMinifiedCode },
        setCustomMinifiedCode: (s)=>{ isCustomMinifiedCode = s}
    }


})(jQuery)


window.onbeforeunload = function (e) {
    if(YYY.noExitConfirm){
        return
    }
    e = e || window.event;

    // For IE and Firefox prior to version 4
    if (e) {
        e.returnValue = 'Really want to leave?';
    }

    // For Safari
    return 'Really want to leave?';
};

;
ENGINE = (($)=>{
    "use strict";

    let intervalTick
    let timeBetweenTicks = 16

    let intervalDraw
    let timeBetweenDraws = 16

    let drawAnimationFrame = false

    let tickTimes = [0,0,0,0,0]
    let drawTimes = [0,0,0,0,0]


    let running = false
    let paused = false
    let isDoingStep = false

    let ignoreLongExecutionTimes = false

    let totalStartsInTheSession = 0

    LOADER.on(LOADER.EVENT.UI_READY, init)

    function init(){

        function showPerformanceHint(){
            UTIL.hint('Performance hint', 'After 30 minutes you should reload the page to reset the emulator.\nPlease save ALL of your code (editor, minified and ui builder).\nThen reload the page.', {extended: true})
        }

        setTimeout(()=>{
            showPerformanceHint()
            setInterval(()=>{
                showPerformanceHint()            
            }, 1000 * 60 * 10)
        }, 1000 * 60 * 30)


        $('#start').on('click', start)

        $('#pause').prop('disabled', true)
        $('#step').prop('disabled', true)

        $('#pause').on('click', ()=>{
            if(running){
                if(paused){
                    unpauseScript()
                } else {
                    pauseScript()
                }                
            }
        })

        $('#step').on('click', doStep)

        $('#stop').prop('disabled', true).on('click', stop)
        $('#reset').on('click', ()=>{
            UTIL.confirm('Are you sure? This will also remove the code in the editor!').then((result)=>{
                if(result === true){
                    localStorage.clear()
                    YYY.makeNoExitConfirm()
                    document.location = document.location.href.split('?')[0]
                }
            }).catch(()=>{
                /* do nothing */
            })
        })


        $('#timeBetweenTicks').on('input', ()=>{
            refreshTimeBetweenTicks()
            STORAGE.setConfiguration('settings.timeBetweenTicks', $('#timeBetweenTicks').val())
        })

        $('#timeBetweenTicks').on('change', ()=>{
            refreshTimeBetweenTicks(true)
            STORAGE.setConfiguration('settings.timeBetweenTicks', $('#timeBetweenTicks').val())
        })

        $('#timeBetweenDraws').on('input', ()=>{
            refreshTimeBetweenDraws()
            STORAGE.setConfiguration('settings.timeBetweenDraws', $('#timeBetweenDraws').val())
        })

        $('#timeBetweenDraws').on('change', ()=>{
            refreshTimeBetweenDraws(true)
            STORAGE.setConfiguration('settings.timeBetweenDraws', $('#timeBetweenDraws').val())
        })

        $('#save').on('click', ()=>{
            saveCodesInStorage()
        })

        
        $(window).on('keydown', (evt)=>{
            if(evt.originalEvent.key === 's' && (evt.originalEvent.ctrlKey || evt.originalEvent.metaKey)){
                evt.preventDefault()
                evt.stopPropagation()

                saveCodesInStorage()
            } else if( evt.originalEvent.key === 'e' && (evt.originalEvent.ctrlKey || evt.originalEvent.metaKey)){
                evt.preventDefault()
                evt.stopPropagation()

                if( ! running){
                	start()
                } else {
                	if (paused){
	                	unpauseScript()
	                } else {
	                	stop()
	                }
	            }
            } else if( running && paused && evt.originalEvent.key === 'ArrowRight' && (evt.originalEvent.ctrlKey || evt.originalEvent.metaKey)){
                evt.preventDefault()
                evt.stopPropagation()

                doStep()
            } else if( running && ! paused && (evt.originalEvent.key === 'Pause' || evt.originalEvent.key === 'Cancel') && (evt.originalEvent.ctrlKey || evt.originalEvent.metaKey)){
                evt.preventDefault()
                evt.stopPropagation()

                pauseScript()
            }
        })


        loadCodesFromStorage()

        LOADER.done(LOADER.EVENT.ENGINE_READY)
    }


    function refresh(){
        setConfigVal($('#timeBetweenTicks'), 'settings.timeBetweenTicks', 16)
        setConfigVal($('#timeBetweenDraws'), 'settings.timeBetweenDraws', 16)

        function setConfigVal(elem, confName, defaultValue){
            let v = STORAGE.getConfiguration(confName)

            let setterFunc
            if(typeof defaultValue === 'boolean'){
                setterFunc = (vv)=>{elem.prop('checked', vv)}
            } else {
                setterFunc = (vv)=>{elem.val(vv)}
            }
            
            setterFunc( ( v !== undefined && v !== null ) ? v : defaultValue )
            elem.trigger('change')
        }

        CANVAS.refresh()        

        refreshTimeBetweenTicks()
        refreshTimeBetweenDraws()   
    }


    function refreshTimeBetweenTicks(is_change){
        let val = $('#timeBetweenTicks').val()
        timeBetweenTicks = val
        $('#timeBetweenTicksVal').html(Math.round(1000/val*0.96))
        if(running && is_change){
            clearDrawAndTickInterval()
            setDrawAndTickInterval()
        }
    }

    function refreshTimeBetweenDraws(is_change){
        let val = $('#timeBetweenDraws').val()
        timeBetweenDraws = val
        $('#timeBetweenDrawsVal').html(Math.round(1000/val*0.96))
        if(running && is_change){
            clearDrawAndTickInterval()
            setDrawAndTickInterval()
        }
    }

    function pauseScript(){        
        REPORTER.report(REPORTER.REPORT_TYPE_IDS.pauseScript)

        paused = true
        LUA_EMULATOR.notifyPaused()

        $('#step').prop('disabled', false)
        $('#pause').html('Resume')
    }

    function unpauseScript(){
        LUA_EMULATOR.notifyUnPaused()
        
        $('#step').prop('disabled', true)
        $('#pause').html('Pause')
        
        /* make sure the button is updated before the next tick can happen */
        setTimeout(()=>{
            paused = false
        }, 10)
    }

    function doStep(){
        if(paused && !isDoingStep){
            LUA_EMULATOR.notifyStep()
            paused = false
            isDoingStep = true
            doTick()
            doDraw()
            isDoingStep = false
            paused = true
        }
    }

    function start(){
        lockUI()
        saveCodesInStorage()

        let code = EDITORS.getActiveEditor().editor.getValue()

        let ae = EDITORS.getActiveEditor()
        let selDom = ae.viewable.getSelectDom()
        if(selDom){
            selDom.addClass('is_executing_code')
        }
        console.log(selDom)

        startCode(code)

        setTimeout(()=>{
            $('#start, #start-minified, #start-generated').blur()
        }, 100)
    }

    function lockUI(){        
        
    }

    function unlockUI(){
        
    }

    function startCode(code){
        REPORTER.report(REPORTER.REPORT_TYPE_IDS.startEmulator)

        totalStartsInTheSession++

        if(totalStartsInTheSession % 50 == 0){
            UTIL.hint('Performace hint', 'After 50 starts you should reload the page to reset the emulator.\nPlease save ALL of your code (editor, minified and ui builder).\nThen reload the page.', {extended: true})
        }

        tickTimes = [0,0,0,0,0]
        drawTimes = [0,0,0,0,0]

        running = true

        $('#start, #start-minified, #start-generated').prop('disabled', true)

        $('#console-inner').html('')
        CANVAS.reset()
        CANVAS.resetTouchpoints()
        MAP.reset()
        PAINT._reset()
        EDITORS.resetErrorMarkers()
        UI.viewables()['viewable_console'].focusSelf()
        console.log('running code...')
        try {
            let feng = fengari.load(code, null, LUA_EMULATOR.l())
            feng()
        } catch (err){
            if(err.message){
                err = err.message
            }
            LUA_EMULATOR.bluescreenError(LUA_EMULATOR.l(), 'error', err)
        }
        OUTPUT.reset()

        setDrawAndTickInterval()
        $('#stop').prop('disabled', false)
        $('#pause').prop('disabled', false)
    }

    function stop(){
        $('#pause').prop('disabled', true).html('Pause')
        $('#step').prop('disabled', true)
        $('#stop').prop('disabled', true)
        clearDrawAndTickInterval()

        LUA_EMULATOR.reset().then(()=>{
            unlockUI()
            $('#start').prop('disabled', false)
        })

        $('.is_executing_code').removeClass('is_executing_code')

        running = false
        paused = false
    }

    function errorStop(){
        console.log('\nerror stop!!!\n')
        clearDrawAndTickInterval()
        setTimeout(()=>{
            stop()
        }, 500)
    }

    function setDrawAndTickInterval(){
        if(timeBetweenDraws < 20){
            drawAnimationFrame=true
            setTimeout(()=>{
                window.requestAnimationFrame(doDraw)            
            }, timeBetweenTicks * 1.1)     
        } else {
            setTimeout(()=>{
                intervalDraw = setInterval(doDraw, timeBetweenDraws)            
            }, timeBetweenTicks * 1.1)            
        }
        intervalTick = setInterval(doTick, timeBetweenTicks)
    }

    function clearDrawAndTickInterval(){ 
        drawAnimationFrame=false
        clearInterval(intervalTick)
        clearInterval(intervalDraw)
    }

    function doTick(){
        if(!running || paused){
            return
        }
        let begin = new Date().getTime()

        LUA_EMULATOR.tick()
        $(window).trigger('lua_tick')
        OUTPUT.refresh()

        let end = new Date().getTime()
        let diff = end-begin
        if(diff > 1000 || diff > timeBetweenTicks){
            $('#ticktime').addClass('warning')
        } else {
            $('#ticktime').removeClass('warning')
        }
        if(diff > 1000){
            CONSOLE.print('Warning: onTick() execution was longer then 1000ms! (Stormworks would have stopped this script by now)', CONSOLE.COLOR.WARNING)
        }
        tickTimes.reverse()
        tickTimes.pop()
        tickTimes.reverse()
        tickTimes.push(diff)
        let average = 0
        for(let t of tickTimes){
            average += t
        }

        checkLongExecutionTimes(average)

        $('#ticktime').html( Math.round(Math.min(1000/timeBetweenTicks*0.96, 1000/(average/tickTimes.length))))

        CONSOLE.notifiyTickOrDrawOver()
    }

    function doDraw(){
        if(!running || paused){
            if(drawAnimationFrame){
                window.requestAnimationFrame(doDraw)
            }
            return
        }
        let begin = new Date().getTime()

        CANVAS.reset()
        LUA_EMULATOR.draw()

        let end = new Date().getTime()
        let diff = end-begin
        if(diff > 1000 || diff > timeBetweenDraws){
            $('#drawtime').addClass('warning')
        } else {
            $('#drawtime').removeClass('warning')
        }
        if(diff > 1000){
            CONSOLE.print('Warning: onDraw() execution was longer then 1000ms! (Stormworks would have stopped this script by now)', CONSOLE.COLOR.WARNING)
        }
        drawTimes.reverse()
        drawTimes.pop()
        drawTimes.reverse()
        drawTimes.push(diff)
        let average = 0
        for(let t of drawTimes){
            average += t
        }

        checkLongExecutionTimes(average)

        $('#drawtime').html( Math.round(Math.min(drawAnimationFrame? 60 : (1000/timeBetweenDraws*0.96), 1000/(average/drawTimes.length))))

        CONSOLE.notifiyTickOrDrawOver()

        if(drawAnimationFrame){
            window.requestAnimationFrame(doDraw)
        }        
    }

    function checkLongExecutionTimes(average){        
        if(average > 2000 && ignoreLongExecutionTimes === false){
            CONSOLE.print('Error: Pony IDE stopped the script because of unusually long execution times (average > 2000ms).', CONSOLE.COLOR.ERROR)
            
            stop()
            setTimeout(()=>{
                UTIL.confirm('Script stopped because of long execution times. Do you want to ignore that in the future?').then((ret)=>{
                    if(ret){
                        ignoreLongExecutionTimes = true
                    }
                })
            }, 100)
        }
    }

    function saveCodesInStorage(){
        $('#save').addClass('saved')
        setTimeout(()=>{
            $('#save').removeClass('saved')
        }, 1000)

        let codes = {
            normal: EDITORS.get('normal').editor.getValue(),
            minified: EDITORS.get('minified').editor.getValue(),
            unminified: EDITORS.get('unminified').editor.getValue()
        }

        if(!codes.minified || codes.minified.trim() === ''){
            delete codes.minified
        }

        STORAGE.setConfiguration('editors', codes)

        UI_BUILDER.save()
    }

    function loadCodesFromStorage(){
        let codes = STORAGE.getConfiguration('editors')

        if(codes){
            for(let e of ['normal', 'minified', 'unminified']){            
                if(typeof codes[e] === 'string'){
                    EDITORS.get(e).editor.setValue(codes[e])
                }
            }
        }
    }

    return {        
        refresh: refresh,
        errorStop: errorStop,
        stop: stop,
        isRunning: ()=>{ return running },
        pauseScript: pauseScript,
        saveCodesInStorage: saveCodesInStorage
    }

})(jQuery)
;
var INPUT = (($)=>{
    "use strict";

    let bools = {}
    let numbers = {}

    let dom
    let dom_bools
    let dom_bools_add
    let dom_numbers
    let dom_numbers_add

    let initiating = true

    const SUPPORTED_INPUT_KEYS = ['e', 'q', 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

    LOADER.on(LOADER.EVENT.CANVAS_READY, init)

    function init(){

        $(window).on('keydown', handleKeyDown)
        $(window).on('keyup', handleKeyUp)

        bools = {}
        numbers = {}
        dom = $('#input')
        dom.html('')

        dom_bools = $('<div class="bools"><div class="head" sort="0"><span>Booleans:</span></div></div>')
        dom_bools_add = $('<div class="add"><select></select><button>+</button></div>')
        for(let i = 1; i < 33; i++){
            dom_bools_add.find('select').append('<option value="'+i+'">'+i+'</option>')
        }
        dom_bools_add.find('button').on('click', ()=>{
            let n = parseInt(dom_bools_add.find('select').val())
            if(isNaN(n)){
                return
            }
            addNewBool(n)
        })
        dom_bools.find('.head').append(dom_bools_add)
        dom.append(dom_bools)
        
        dom_numbers = $('<div class="numbers"><div class="head" sort="0"><span>Numbers:</span></div></div>')
        dom_numbers_add = $('<div class="add"><select></select><button>+</button></div>')
        for(let i = 1; i < 33; i++){
            dom_numbers_add.find('select').append('<option value="'+i+'">'+i+'</option>')
        }
        dom_numbers_add.find('button').on('click', ()=>{
            let n = parseInt(dom_numbers_add.find('select').val())
            if(isNaN(n)){
                return
            }
            addNewNumber(n, 0)
        })
        dom_numbers.find('.head').append(dom_numbers_add)
        dom.append(dom_numbers)

        let store = getFromStorage()
        if(store && store.bools && typeof store.bools === 'object'){
            for(let k of Object.keys(store.bools)){
                let b = store.bools[k]
                let val = b.val

                if(isNaN(parseInt(k))){
                    return
                } 
                addNewBool(parseInt(k), val, b)
            }
        }


        if(store && store.bools && typeof store.numbers === 'object'){
            for(let k of Object.keys(store.numbers)){
                let n = store.numbers[k]
                let val = parseFloat(n.val)
                if(isNaN(val)){
                    return
                }
                addNewNumber(parseInt(k), val, n)
            }
        }

        initiating = false

        LOADER.done(LOADER.EVENT.INPUTS_READY)
    }

    function handleKeyDown(evt){
        if(ENGINE.isRunning() && CANVAS.mouseIsOverMonitor()){
            for(let k of Object.keys(bools)){
                let b = bools[k]
                if(evt.originalEvent.key === b.key){
                    //evt.preventDefault()
                    //evt.stopImmediatePropagation()

                    if(b.type === 'push'){ /* push */
                        doSetBool(k, true)
                    }
                }
            }
        }
    }

    function handleKeyUp(evt){
        if(ENGINE.isRunning() && CANVAS.mouseIsOverMonitor()){
            for(let k of Object.keys(bools)){
                let b = bools[k]
                if(evt.originalEvent.key === b.key){
                    //evt.preventDefault()
                    //evt.stopImmediatePropagation()

                    if(b.type === 'push'){ /* push */
                        doSetBool(k, false)
                    } else {/* toggle */
                        doSetBool(k, !bools[k].val)
                    }
                }
            }
        }
    }

    function refreshBoolsAddSelect(){
        dom_bools.find('.bool').prop('selected', false)
        let i = dom_bools.find('.bool:last-of-type label').html()
        i = parseInt(i)
        i = isNaN(i) ? 0 : i
        dom_bools_add.find('option[value="' + (i+1) + '"]').prop('selected', true)
    }

    function refreshNumbersAddSelect(){
        dom_numbers.find('.number').prop('selected', false)
        let i = dom_numbers.find('.number:last-of-type label').html()
        i = parseInt(i)
        i = isNaN(i) ? 0 : i
        dom_numbers_add.find('option[value="' + (i+1) + '"]').prop('selected', true)
    }

    function saveToStorage(){
        if(!initiating){
            STORAGE.setConfiguration('inputs', {
                bools: bools,
                numbers: numbers
            })
        }
    }

    function getFromStorage(){
        return STORAGE.getConfiguration('inputs')
    }


    function addNewBool(label, val, config){
        if( ! (typeof label === 'number' || typeof label === 'string' && label.length > 0)){
            return
        }
        if(bools[new String(label)] !== undefined){
            return
        }

        let userLabel

        let typeSelect
        let keySelect

        if(!config){
            config = {
                val: typeof val === 'boolean' ? val : false,
                userLabel: '',
                type: 'push',
                key: typeof label !== 'number' ? SUPPORTED_INPUT_KEYS[Object.keys(bools).length] : (
                    label > 2 ? SUPPORTED_INPUT_KEYS[label+1] : SUPPORTED_INPUT_KEYS[label-1]
                    )
            }
        } else {
            if(typeof config.userLabel !== 'string'){
                config.userLabel = ''
            }
        }

        if(typeof label === 'number'){
            label = new String(label)
        }
        bools[label] = config

        let bool = addNew('bool', 'checkbox', label, (e)=>{
            bools[label] = {
                val: $(e.target).prop('checked'),
                userLabel: userLabel.val(),
                type: config.type,
                key: config.key
            }
            bool.find('.change input').prop('checked', $(e.target).prop('checked'))

            refreshBoolsAddSelect()
        }, (e)=>{
            bools[label] = false
            delete bools[label]
            $(e.target).parent().parent().remove()
            refreshBoolsAddSelect()
        }, val, config)

        userLabel = bool.find('.user_label')

        let openSettings = $('<button>?</button>')
        let settings = $('<div class="settings" style="display: none"></div>')
        openSettings.on('click', ()=>{
            settings.toggle()
        })
        openSettings.insertBefore(bool.find('button'))

        typeSelect = $('<div class="group"><span>Type</span><select><option value="push" selected>Push</option><option value="toggle">Toggle</option></select></div>')
        settings.append(typeSelect)

        typeSelect.find('option[selected]').prop('selected', false)
        typeSelect.find('option[value="' + config.type + '"]').prop('selected', true)
        typeSelect.find('select').on('change', ()=>{            
            bools[label].type = typeSelect.find('select').val()
            saveToStorage()
        })

        keySelect = $('<div class="group"><span>Key (must hover over monitor)</span><select></select></div>')
        for(let k of SUPPORTED_INPUT_KEYS){
            keySelect.find('select').append('<option value="' + k + '">' + k + '</option>')
        }
        settings.append(keySelect)

        keySelect.find('option[selected]').prop('selected', false)
        keySelect.find('option[value="' + config.key + '"]').prop('selected', true)
        keySelect.find('select').on('change', ()=>{            
            bools[label].key = keySelect.find('select').val()
            saveToStorage()
        })

        typeSelect.find('select').trigger('change')
        keySelect.find('select').trigger('change')


        bool.append(settings)



        dom_bools.append(bool)
        refreshBoolsAddSelect()
        sortBools()
    }

    function doSetBool(label, val, config){
        let bool = dom_bools.find('#input_bool_'+label).get(0)
        if(bool){
            $(bool).prop('checked', val)  
            bools[label.toString()].val = val
        } else {
            addNewBool(label, val, config)
        }
    }

    function doSetNumber(label, val, config){
        let number = dom_numbers.find('#input_number_'+label).get(0)
        if(number){
            val = parseFloat(val)
            if(isNaN(val)){
                return
            }

            numbers[label.toString()].val = val
            $(number).parent().parent().find('.change input[type="number"], .change input[type="range"]').val(val)
            $(number).parent().parent().find('.slidervalue').html(val)
        } else {
            addNewNumber(label, val, config)
        }
    }

    function addNewNumber(label, val, config){
        if(typeof label !== 'number' || label.length === 0){
            return
        }
        if(numbers[label] !== undefined){
            return
        }

        let userLabel

        let slidercheck
        let slidermin
        let slidermax
        let sliderstep

        let oscilatecheck

        if(!config){
            let lastNumber = dom_numbers.find('.number').last()
            if(lastNumber.length === 0){
                lastNumber = false
            }
            config = {
                val: typeof val === 'number' ? val : 0,
                userLabel: '',
                slidercheck:  lastNumber ? lastNumber.find('.slider_check').prop('checked') : true,
                slidermin: lastNumber ? parseFloat(lastNumber.find('.slider_min').val().replace(',','.')) : -1,
                slidermax: lastNumber ? parseFloat(lastNumber.find('.slider_max').val().replace(',','.')) : 1,
                sliderstep: lastNumber ? parseFloat(lastNumber.find('.slider_step').val().replace(',','.')) : 0.01,
                oscilatecheck: lastNumber ? lastNumber.find('.oscilate_check').prop('checked') : (typeof val === 'number' ? false : true)
            }
        } else {
            /* backwards compatibility */
            for(let x of ['slidermin', 'slidermax', 'sliderstep']){
                if(typeof config[x] !== 'number'){
                    config[x] = $(config[x]).val()
                }
            }

            for(let x of ['slidercheck', 'oscilatecheck']){
                if(typeof config[x] !== 'boolean'){
                    config[x] = $(config[x]).prop('checked')
                }
            }
            if(typeof config.userLabel !== 'string'){
                config.userLabel = ''
            }
        }

        numbers[label] = config
        let number
        number = addNew('number', 'number', label, (e)=>{
    	    let n
    	    if(slidercheck.prop('checked')){
    		    n = parseFloat(number.find('.change input[type="range"]').val())
    	    } else {
    		    n = parseFloat(number.find('.change input[type="number"]').val())
    	    }

            if(isNaN(n)){
                return
            }
            numbers[label] = {
                val: n,
                userLabel: userLabel.val(),
                slidercheck: slidercheck.prop('checked'),
                slidermin: parseFloat(slidermin.val().replace(',','.')),
                slidermax: parseFloat(slidermax.val().replace(',','.')),
                sliderstep: parseFloat(sliderstep.val().replace(',','.')),
                oscilatecheck: oscilatecheck.prop('checked')
            }
            number.find('.change input[type="range"], .change input[type="number"]').val(n).attr('step', numbers[label].sliderstep)
            number.find('.slidervalue').html(n)
            refreshNumbersAddSelect()
        }, (e)=>{
            numbers[label] = null
            delete numbers[label]
            $(e.target).parent().parent().remove()
            refreshNumbersAddSelect()
        }, val, config)

        userLabel = number.find('.user_label')

        let openSettings = $('<button>?</button>')
        let settings = $('<div class="settings" style="display: none"></div>')
        openSettings.on('click', ()=>{
            settings.toggle()
        })
        openSettings.insertBefore(number.find('button'))

        let slider = $('<div class="group">'
            +'<div><input type="checkbox" class="slider_check"/><label>Use slider</label></div>'
            +'<div><input type="text" class="slider_min" value="' + config.slidermin + '"/><label>Min</label></div>'
            +'<div><input type="text" class="slider_max" value="' + config.slidermax + '"/><label>Max</label></div>'
            +'<div><input type="text" class="slider_step" value="' + config.sliderstep + '"/><label>Step</label></div>'
            +'</div>')
        settings.append(slider)
        slidercheck = slider.find('.slider_check')
        slidercheck.on('input', ()=>{
            if(slidercheck.prop('checked')){
                number.addClass('isslider')
            } else {
                number.removeClass('isslider')
            }
            numbers[label].slidercheck = slidercheck.prop('checked')
            saveToStorage()
        })
        slidercheck.prop('checked', config.slidercheck).trigger('input')

        slidermin = slider.find('.slider_min')
        slidermin.on('input', ()=>{
            let min = parseFloat(slidermin.val().replace(',', '.'))
            if(!isNaN(min)){
                number.find('input[type="range"]').prop('min', min).trigger('change')
                numbers[label].slidermin = min
                saveToStorage()
            }
        })

        slidermax = slider.find('.slider_max')
        slidermax.on('input', ()=>{
            let max = parseFloat(slidermax.val().replace(',', '.'))
            if(!isNaN(max)){
                number.find('input[type="range"]').prop('max', max).trigger('change')
                numbers[label].slidermax = max
                saveToStorage()
            }
        })

        sliderstep = slider.find('.slider_step')
        sliderstep.on('change', ()=>{
            let step = parseFloat(sliderstep.val().replace(',', '.'))
            if(!isNaN(step)){
                number.find('input[type="range"]').prop('step', step).trigger('change')
                slidermin.prop('step', step)
                slidermax.prop('step', step)
                numbers[label].sliderstep = step
                saveToStorage()
            }
        })

        let oscilate = $('<div class="group"><div><input type="checkbox" class="oscilate_check"/><label>Use oscilate</label></div></div>')
        settings.append(oscilate)
        oscilatecheck = oscilate.find('.oscilate_check')
        oscilatecheck.on('input', ()=>{
            if(oscilatecheck.prop('checked')){
                number.addClass('isoscilate')
            } else {
                number.removeClass('isoscilate')
            }
            numbers[label].oscilatecheck = oscilatecheck.prop('checked')
            saveToStorage()
        })


        slidermin.val(config.slidermin).trigger('input')
        slidermax.val(config.slidermax).trigger('input')
        sliderstep.val(config.sliderstep).trigger('input')
        oscilatecheck.prop('checked', config.oscilatecheck).trigger('input')

        let myOscilateDirection = true

        $(window).on('lua_tick', ()=>{
            if(oscilatecheck.prop('checked')){
                let val = number.find('.change input[type="number"]').val()
                val = parseFloat(val)
                if(isNaN(val)){
                    return
                }

                let step = sliderstep.val()
                step = parseFloat(step)
                if(isNaN(step)){
                    return
                }

                val = precise(myOscilateDirection ? val + step : val - step, step.toString().length - step.toString().indexOf('.'))


                if(val >= slidermax.val()){
                    myOscilateDirection = false
                    val = parseFloat(slidermax.val())
                } else if (val <= slidermin.val()){
                    myOscilateDirection = true
                    val = parseFloat(slidermin.val())
                }
                if(numbers[label]){
                    numbers[label].val = val
                }
                number.find('.change input:not(.user_label)').val(val)
                number.find('.slidervalue').html(val)
                refreshNumbersAddSelect()
            }
        })


        number.append(settings)

        dom_numbers.append(number)
        refreshNumbersAddSelect()
        sortNumbers()
    }

    function precise(float, precision){
        const mult = Math.pow(10, precision)
        let ret =  Math.round(float * mult) / mult
        return ret
    }

    function addNew(type, inputType, label, changeCallback, removeCallback, val, config){
        let valtext = ''
        if(inputType === 'checkbox' && val === true){
            valtext = 'checked'
        } else if (val !== undefined && val !== null ){
            valtext = 'value="'+val+'"'
        }
        let neww = $('<div class="' + type + '" sort="' + label + '"><div class="change"><label class="channel" for="input_' + type + '_' + label + '">'+label+'</label><div class="user_label_container"><input type="text" class="user_label" value="' + config.userLabel + '"/></div><input type="' + inputType + '" ' + (inputType === 'number' ? 'lang="en" step="' + config.sliderstep + '"': '') + ' id="input_' + type + '_' + label + '" ' + valtext + '/>' + (inputType === 'number' ? '<input type="range" min="-10" max="10" ' + valtext + ' step="' + config.sliderstep + '"/><label class="slidervalue">' + val + '</label>': '') + '<button>x</button></div></div>')
        if(inputType === 'number'){//force value set
            setTimeout(()=>{
                neww.find('input[type="number"]').val(val)
            },1)
        }
        neww.find('input[type="number"], input[type="text"], input[type="checkbox"], .user_label').on('change paste mouseleave', (e)=>{
            changeCallback(e)
            saveToStorage()
        })
        neww.find('input[type="range"]').on('change input', (e)=>{
            changeCallback(e)
            saveToStorage()
        })
        neww.find('button').on('click', (e)=>{
            removeCallback(e)
            saveToStorage()
        })
        neww.on('keydown keyup', (e)=>{
            e.stopPropagation()
        })
        saveToStorage()
        return neww
    }

    function sortBools(){
        sortValueList('#input .bools')
    }

    function sortNumbers(){
        sortValueList('#input .numbers')
    }

    function sortValueList(list_of_sortables){
        $(list_of_sortables).children().detach().sort(function(a,b) {
            return parseInt($(a).attr('sort')) > parseInt($(b).attr('sort'))
        }).appendTo($(list_of_sortables))
    }

    function getBool(index){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(bools[index] && typeof bools[index].val === 'boolean'){
            return bools[index].val
        } else {
            return false
        }
    }

    function getBoolLabel(index){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(bools[index] && typeof bools[index].userLabel === 'string'){
            return bools[index].userLabel
        } else {
            return false
        }
    }

    function getNumber(index){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(typeof numbers[index] === 'object' && typeof numbers[index].val === 'number'){
            return numbers[index].val
        } else {
            return 0
        }
    }

    function getNumberLabel(index){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(typeof numbers[index] === 'object' && typeof numbers[index].userLabel === 'string'){
            return numbers[index].userLabel
        } else {
            return 0
        }
    }

    function setBool(index, val, config){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(typeof val !== 'boolean'){
            throw new Error('second argument must be a boolean!')
        }
        doSetBool(index, val, config)
    }

    function setNumber(index, val, config){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(typeof val !== 'number'){
            throw new Error('second argument must be a number!')
        }
        doSetNumber(index, val, config)
    }
    
    function removeNumber(index){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }

        let number = dom_numbers.find('#input_number_'+index).get(0)
        if(number){
            $(number).parent().parent().remove()
            numbers[index.toString()] = null
            delete numbers[index.toString()]
            refreshNumbersAddSelect()
            sortNumbers()
        }
    }

    function removeBool(index){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }

        let bool = dom_bools.find('#input_bool_'+index).get(0)
        if(bool){
            $(bool).parent().parent().remove()
            bools[index.toString()] = null
            delete bools[index.toString()]
            refreshBoolsAddSelect()
            sortBools()
        }
    }

    function reset(){
        dom_bools.find('.bool').remove()
        bools = {}
        refreshBoolsAddSelect()

        dom_numbers.find('number').remove()
        numbers = {}
        refreshNumbersAddSelect()
    }

    return {
        reset: reset,
        getBool: getBool,
        getBoolLabel: getBoolLabel,
        getNumber: getNumber,
        getNumberLabel: getNumberLabel,
        setBool: setBool,
        setNumber: setNumber,
        removeBool: removeBool,
        removeNumber: removeNumber
    }

})(jQuery)

;
var OUTPUT = ((global, $)=>{
  "use strict";

    let bools = {}
    let numbers = {}

    let inputBools = {}
    let inputNumbers = {}

    let dom
    let dom_bools
    let dom_numbers

    LOADER.on(LOADER.EVENT.ENGINE_READY, init)

    function init(){
        dom = $('#output')
	    dom.html('')

        dom_bools = $('<div class="bools"><div class="head"><span>Booleans:</span></div></div>')
        dom.append(dom_bools)

        dom_numbers = $('<div class="numbers"><div class="head"><span>Numbers:</span></div></div>')
        dom.append(dom_numbers)

        LOADER.done(LOADER.EVENT.OUTPUTS_READY)
    }

    function reset(){
        bools = {}
        numbers = {}

        inputBools = {}
        inputNumbers = {}


        dom_bools.find('.bool').remove()
        dom_numbers.find('.number').remove()

        for(let k of Object.keys(bools)){
            addNewBool(k, bools[k])
        }

        for(let k of Object.keys(numbers)){
            let n = parseFloat(numbers[k])
            if(isNaN(n)){
                n = parseInt(numbers[k])
            }
            if(isNaN(n)){
                return
            }
            addNewNumber(k, n)
        }
    }

    function refresh(){
        for(let k of Object.keys(bools)){
            bools[k].html(inputBools[k] === true ? 'true' : 'false')
        }
        for(let k of Object.keys(numbers)){
            numbers[k].html(inputNumbers[k])
        }
    }

    function addNewBool(label, val){
        let bool = addNew('bool', label, val === true ? 'true' : 'false')
        bools[label] = bool.find('.result')
        dom_bools.append(bool) 
    }

    function addNewNumber(label, val){
        let number = addNew('number', label, val)
        numbers[label] = number.find('.result')
        dom_numbers.append(number)
    }

    function addNew(type, label, val){
        let neww = $('<div class="' + type + '"><label for="output_' + type + '_' + label + '">'+label+'</label><span class="result" id="output_' + type + '_' + label + '">' + val + '</span></div>')        
        return neww
    }

    function setBool(index, val){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(typeof val !== 'boolean'){
            throw new Error('second argument must be a boolean!')
        }

        if(! bools[index]){
            addNewBool(index, val)
        }

        inputBools[index] = val
    }

    function setNumber(index, val){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(typeof val !== 'number'){
            throw new Error('second argument must be a number!')
        }

        if(! numbers[index]){
            addNewNumber(index, val)
        }

        inputNumbers[index] = val
    }
    
    return {
        setBool: setBool,
        setNumber: setNumber,
        refresh: refresh,
        reset: reset
    }

})(window, jQuery)

;
var PROPERTY = ((global, $)=>{
  "use strict";

    let bools = {}
    let numbers = {}
    let texts = {}

    let dom
    let dom_bools
    let dom_numbers
    let dom_texts

    LOADER.on(LOADER.EVENT.ENGINE_READY, init)

    function init(){
    	bools = {}
    	numbers = {}
    	texts = {}
        dom = $('#property')
        dom.html('')

        dom_bools = $('<div class="bools"><div class="head"><span>Booleans:</span></div></div>')
        let dom_bools_add = $('<div class="add"><input type="text"/><button>+</button></div>')
        dom_bools_add.find('button').on('click', ()=>{
            addNewBool(dom_bools_add.find('input').val())
        })
        dom_bools.find('.head').append(dom_bools_add)
        dom.append(dom_bools)

        dom_numbers = $('<div class="numbers"><div class="head"><span>Numbers:</span></div></div>')
        let dom_numbers_add = $('<div class="add"><input type="text"/><button>+</button></div>')
        dom_numbers_add.find('button').on('click', ()=>{
            addNewNumber(dom_numbers_add.find('input').val())
        })
        dom_numbers.find('.head').append(dom_numbers_add)
        dom.append(dom_numbers)

        dom_texts = $('<div class="texts"><div class="head"><span>Texts:</span></div></div>')
        let dom_texts_add = $('<div class="add"><input type="text"/><button>+</button></div>')
        dom_texts_add.find('button').on('click', ()=>{
            addNewText(dom_texts_add.find('input').val())
        })
        dom_texts.find('.head').append(dom_texts_add)
        dom.append(dom_texts)



        let store = getFromStorage()
        if(store && typeof store.bools === 'object' && store.bools !== null){
            for(let k of Object.keys(store.bools)){
                addNewBool(k, store.bools[k])
            }
        }

        if(store && store.numbers && typeof store.numbers === 'object'){
            for(let k of Object.keys(store.numbers)){
                let n = parseFloat(store.numbers[k])
                if(isNaN(n)){
                    return
                }
                addNewNumber(k, store.numbers[k])
            }
        }

        if(store && store.texts && typeof store.texts === 'object'){
            for(let k of Object.keys(store.texts)){
                addNewText(k, store.texts[k])
            }
        }

        LOADER.done(LOADER.EVENT.PROPERTIES_READY)
    }

    function saveToStorage(){
        STORAGE.setConfiguration('properties', {
            bools: bools,
            numbers: numbers,
            texts: texts
        })
    }

    function getFromStorage(){
        return STORAGE.getConfiguration('properties')
    }


    function addNewBool(label, val){
        if(typeof label !== 'string' || label.length === 0){
            return
        }
        bools[label] = val === true ? true : false
        let bool = addNew('bool', 'checkbox', label, (e)=>{
            bools[label] = $(e.target).prop('checked')
        }, (e)=>{
            bools[label] = false
            delete bools[label]
            $(e.target).parent().remove()
        }, val)
        dom_bools.append(bool)
        saveToStorage()
    }

    function addNewNumber(label, val){
        if(typeof label !== 'string' || label.length === 0){
            return
        }
        numbers[label] = typeof val === 'number' ? val : 0
        let number = addNew('number', 'number', label, (e)=>{
            let n = parseFloat($(e.target).val())
            if(isNaN(n)){
                return
            }
            numbers[label] = n 
        }, (e)=>{
            numbers[label] = 0
            delete numbers[label]
            $(e.target).parent().remove() 
        }, val)
        dom_numbers.append(number)
        saveToStorage()
    }

    function addNewText(label, val){
        if(typeof label !== 'string' || label.length === 0){
            return
        }
        texts[label] =  typeof val === 'string' ? val : ""
        let text = addNew('text', 'text', label, (e)=>{
            texts[label] = $(e.target).val()
        }, (e)=>{
            texts[label] = ""
            delete texts[label]
            $(e.target).parent().remove()
        }, val)
        dom_texts.append(text)
        saveToStorage()
    }

    function addNew(type, inputType, label, changeCallback, removeCallback, val){
        let valtext = ''
        if(inputType === 'checkbox' && val === true){
            valtext = 'checked'
        } else if (val !== undefined && val !== null ){
            valtext = 'value="'+val+'"'
        }
        let neww = $('<div class="' + type + '"><label for="property_' + type + '_' + label + '">'+label+'</label><input type="' + inputType + '" ' + (inputType === 'number' ? 'step="0.000001"': '') + ' id="property_' + type + '_' + label + '" ' + valtext + '/><button>x</button></div>')
        neww.find('input').on('change', (e)=>{
            changeCallback(e)
            saveToStorage()
        })
        neww.find('button').on('click', (e)=>{
            removeCallback(e)
            saveToStorage()
        })
        return neww
    }

    function getBool(label){
        if(typeof label !== 'string'){
            throw new Error('first argument must be a string!')
        }
        if(typeof bools[label] === 'boolean'){
            return bools[label]
        } else {
            return null
        }
    }

    function getNumber(label){
        if(typeof label !== 'string'){
            throw new Error('first argument must be a string!')
        }
        if(typeof numbers[label] === 'number'){
            return numbers[label]
        } else {
            return null
        }
    }

    function getText(label){
        if(typeof label !== 'string'){
            throw new Error('first argument must be a string!')
        }
        if(typeof texts[label] === 'string'){
            return texts[label]
        } else {
            return null
        }
    }

    function setBool(label, val){
        if(typeof label !== 'string'){
            throw new Error('first argument must be a string!')
        }
        if(typeof val !== 'boolean'){
            throw new Error('second argument must be a boolean!')
        }
        refresh()
        bools[label] = val
    }

    function setNumber(label, val){
        if(typeof label !== 'string'){
            throw new Error('first argument must be a string!')
        }
        if(typeof val !== 'number'){
            throw new Error('second argument must be a number!')
        }
        refresh()
        numbers[label] = val
    }

    function setText(label, val){
        if(typeof label !== 'string'){
            throw new Error('first argument must be a string!')
        }
        if(typeof val !== 'string'){
            throw new Error('second argument must be a string!')
        }
        refresh()
        texts[label] = val
    }


    return {
        getBool: getBool,
        getNumber: getNumber,
        getText: getText,
        setBool: setBool,
        setNumber: setNumber,
        setText: setText
    }

})(window, jQuery)

;
var CANVAS = ((global, $)=>{
    "use strict";

    const DO_LOG = false

    const LABELS = {
        BOOL: {1: 'touch1 pressed', 2: 'touch2 pressed'},
        NUMBER: {1: 'screenWidth', 2: 'screenHeight', 3: 'touch1 x', 4: 'touch1 y', 5: 'touch2 x', 6: 'touch2 y'}
    }

    let zoomFactor = 1

    let enableTouchscreenHintShown = false

    let $canvas
    let ctx

    let top = 0
    let left = 0
    let width = 0
    let height = 0

    let isTouchDown = false

    let mouseIsOverMonitor = false
    let mouseX = 0
    let mouseY = 0

    let touchpoints = []

    let secondaryTouchEnabled = true

    LOADER.on(LOADER.EVENT.ENGINE_READY, init)

    function init(){

        $('#monitor-size, #show-overflow').on('change', (e)=>{
            recalculateCanvas()
        })

        $('#monitor-size').on('change', (e)=>{
            STORAGE.setConfiguration('settings.monitorSize', $('#monitor-size').val())
        })

        $('#show-overflow').on('change', (e)=>{
            STORAGE.setConfiguration('settings.showOverflow', $('#show-overflow').prop('checked'))
        })

        $('#zoomfactor').on('change', ()=>{
            let val = $('#zoomfactor').val()

            PAINT.setZoomFactor(val)
            MAP.setZoomFactor(val)
            setZoomFactor(val)

            $('.monitor_info .zoom').html(val+'x')
            
            STORAGE.setConfiguration('settings.zoomfactor', val)
        })

        $('#monitor-container').on('mouseenter', ()=>{
            /* force focus away from the editors */
            if(ENGINE.isRunning()){
                EDITORS.getActiveEditor().editor.blur()
            }
        })

        $('#monitor-container').on('mouseleave', ()=>{
            /* force focus away from the editors */
            if(ENGINE.isRunning()){
                EDITORS.getActiveEditor().editor.focus()
            }
        })
        
        /* touchscreen */
        $('#monitor').on('mouseenter', ()=>{
            mouseIsOverMonitor = true
        })
        $('#monitor').on('mouseleave', ()=>{
            mouseIsOverMonitor = false
        })
        $('#monitor').on('focusout', ()=>{
            mouseIsOverMonitor = false
        })
        $('#monitor').on('mousemove', (evt)=>{
            if(mouseIsOverMonitor){
                mouseX = evt.originalEvent.clientX
                mouseY = evt.originalEvent.clientY + $(global).scrollTop()
            }
        })
        $('#enable-touchscreen, #enable-touchscreen-secondary').on('change', ()=>{
            /* wait until secondaryTouchEnabled is set properly */
            setTimeout(()=>{
                deleteDefaultInputs()

                calculateTouchscreenInput()
            }, 100)
        })

        $('#enable-touchscreen').on('change', ()=>{
            STORAGE.setConfiguration('settings.touchscreenEnabled', $('#enable-touchscreen').prop('checked'))
        })

        $('#enable-touchscreen-secondary').on('change', ()=>{
            secondaryTouchEnabled = $('#enable-touchscreen-secondary').prop('checked')
            STORAGE.setConfiguration('settings.touchscreenSecondaryEnabled', secondaryTouchEnabled)
        })

        $(window).on('keydown mousedown', handleKeyDown)
        $(window).on('keyup mouseup', handleKeyUp)

        let params = new URLSearchParams( document.location.search)
        let paramBigmonitor = params.get('bigmonitor')
        if(paramBigmonitor === 'true'){
            $('#zoomfactor').attr('max', '20')
            $('.ide').before($('#monitor'))
        }
        
        refresh()


        /* load config from STORAGE */
        setConfigVal($('#zoomfactor'), 'settings.zoomfactor', 1)
        setConfigVal($('#monitor-size'), 'settings.monitorSize', '1x1')
        setConfigVal($('#show-overflow'), 'settings.showOverflow', true)
        setConfigVal($('#enable-touchscreen'), 'settings.touchscreenEnabled', false)
        setConfigVal($('#enable-touchscreen-secondary'), 'settings.touchscreenSecondaryEnabled', false)

        function setConfigVal(elem, confName, defaultValue){
            let v = STORAGE.getConfiguration(confName)

            let setterFunc
            if(typeof defaultValue === 'boolean'){
                setterFunc = (vv)=>{elem.prop('checked', vv)}
            } else {
                setterFunc = (vv)=>{elem.val(vv)}
            }
            
            setterFunc( ( v !== undefined && v !== null ) ? v : defaultValue )
            elem.trigger('change')
        }
        
        LOADER.done(LOADER.EVENT.CANVAS_READY)
    }

    function handleKeyDown(evt){
        if(mouseIsOverMonitor){
            if(ENGINE.isRunning() && $('#enable-touchscreen').prop('checked')){
                if(evt.originalEvent.button === 0){
                    evt.originalEvent.key = 'e'
                }
                if(evt.originalEvent.key === 'q' || evt.originalEvent.key === 'e'){
                    evt.preventDefault()
                    evt.stopImmediatePropagation()
                    if(touchpoints[0] && touchpoints[0].key === evt.originalEvent.key || touchpoints[1] && touchpoints[1].key === evt.originalEvent.key){
                        return
                    }
                    let pX = unzoom(mouseX - $('#monitor').offset().left - left)
                    let pY = unzoom(mouseY - $('#monitor').offset().top - top)
                    if(pX > 0 && pX < width && pY > 0 && pY < height){
                        touchpoints.push({
                            key: evt.originalEvent.key,
                            x: pX,
                            y: pY
                        })
                    }
                }
                calculateTouchscreenInput()
            } else if (ENGINE.isRunning() && !enableTouchscreenHintShown){
                enableTouchscreenHintShown = true

                UTIL.hint("Touchscreen not enabled", "In order to use the touchscreen functionality, enable the touchscreen in the settings tab.")
            }
        }
    }

    function handleKeyUp(evt){
        if(ENGINE.isRunning() && $('#enable-touchscreen').prop('checked')){
            if(evt.originalEvent.button === 0 && mouseIsOverMonitor){
                evt.originalEvent.key = 'e'
                console.log('mouseup')
            }
            if(evt.originalEvent.key === 'q' || evt.originalEvent.key === 'e'){
                evt.preventDefault()
                evt.stopImmediatePropagation()

                if(touchpoints[0] && touchpoints[0].key === evt.originalEvent.key){
                    let tmp = touchpoints[1]
                    touchpoints = tmp ? [tmp] : []
                } else if (touchpoints[1] && touchpoints[1].key === evt.originalEvent.key){
                    let tmp = touchpoints[0]
                    touchpoints = tmp ? [tmp] : []
                } else {
                    console.warn('e or q keyup but no touchpoint found!', touchpoints)
                }
            }
            calculateTouchscreenInput()
        }
    }

    function calculateTouchscreenInput(){
        
        if($('#enable-touchscreen').prop('checked')){
            INPUT.setNumber(1, width, {
                val:  width,
                userLabel: LABELS.NUMBER[1],
                slidercheck: true,
                slidermin: 0,
                slidermax: width,
                sliderstep: 1,
                oscilatecheck: false
            })
            INPUT.setNumber(2, height, {
                val:  height,
                userLabel: LABELS.NUMBER[2],
                slidercheck: true,
                slidermin: 0,
                slidermax: height,
                sliderstep: 1,
                oscilatecheck: false
            })

            if(touchpoints[0]){
                let touchpoints0X = Math.floor(touchpoints[0].x)
                INPUT.setNumber(3, touchpoints0X, {
                    val:  touchpoints0X,
                    userLabel: LABELS.NUMBER[3],
                    slidercheck: true,
                    slidermin: 0,
                    slidermax: width,
                    sliderstep: 1,
                    oscilatecheck: false
                })

                let touchpoints0Y = Math.floor(touchpoints[0].y)
                INPUT.setNumber(4, touchpoints0Y, {
                    val:  touchpoints0Y,
                    userLabel: LABELS.NUMBER[4],
                    slidercheck: true,
                    slidermin: 0,
                    slidermax: height,
                    sliderstep: 1,
                    oscilatecheck: false
                })

                INPUT.setBool(1, true, {
                    val:  true,
                    userLabel: LABELS.BOOL[1],
                    type: 'push',
                    key: 'e'
                })
            } else {
                INPUT.setNumber(3, 0, {
                    val:  0,
                    userLabel: LABELS.NUMBER[3],
                    slidercheck: true,
                    slidermin: 0,
                    slidermax: width,
                    sliderstep: 1,
                    oscilatecheck: false
                })

                INPUT.setNumber(4, 0, {
                    val:  0,
                    userLabel: LABELS.NUMBER[4],
                    slidercheck: true,
                    slidermin: 0,
                    slidermax: height,
                    sliderstep: 1,
                    oscilatecheck: false
                })

                INPUT.setBool(1, false, {
                    val:  false,
                    userLabel: LABELS.BOOL[1],
                    type: 'push',
                    key: 'e'
                })
            }

            if(secondaryTouchEnabled){
                if(touchpoints[1]){
                    let touchpoints1X = Math.floor(touchpoints[1].x)
                    INPUT.setNumber(5, touchpoints1X, {
                        val:  touchpoints1X,
                        userLabel: LABELS.NUMBER[5],
                        slidercheck: true,
                        slidermin: 0,
                        slidermax: width,
                        sliderstep: 1,
                        oscilatecheck: false
                    })

                    let touchpoints1Y = Math.floor(touchpoints[1].y)
                    INPUT.setNumber(6, touchpoints1Y, {
                        val:  touchpoints1Y,
                        userLabel: LABELS.NUMBER[6],
                        slidercheck: true,
                        slidermin: 0,
                        slidermax: height,
                        sliderstep: 1,
                        oscilatecheck: false
                    })

                    INPUT.setBool(2, true, {
                        val:  true,
                        userLabel: LABELS.BOOL[2],
                        type: 'push',
                        key: 'q'
                    })
                } else {
                    INPUT.setNumber(5, 0, {
                        val:  0,
                        userLabel: LABELS.NUMBER[5],
                        slidercheck: true,
                        slidermin: 0,
                        slidermax: width,
                        sliderstep: 1,
                        oscilatecheck: false
                    })

                    INPUT.setNumber(6, 0, {
                        val:  0,
                        userLabel: LABELS.NUMBER[6],
                        slidercheck: true,
                        slidermin: 0,
                        slidermax: height,
                        sliderstep: 1,
                        oscilatecheck: false
                    })

                    INPUT.setBool(2, false, {
                        val:  false,
                        userLabel: LABELS.BOOL[2],
                        type: 'push',
                        key: 'q'
                    })
                }
            }
        } else {
            deleteDefaultInputs()
        }
    }

    function deleteDefaultInputs(){        
        /* delete inputs if they still have the default user labels */            
        for (let i=1;i<=2;i++){
            if(INPUT.getBoolLabel(i) === LABELS.BOOL[i]){
                INPUT.removeBool(i)
            }
        }   
        for (let i=1;i<=6;i++){
            if(INPUT.getNumberLabel(i) === LABELS.NUMBER[i]){
                INPUT.removeNumber(i)
            }
        }
    }

    function refresh(){
        $canvas = $('#canvas')
        ctx = $canvas.get(0).getContext('2d')
        recalculateCanvas()        
    }

    function recalculateCanvas(){
        let size = $('#monitor-size').val()
        let showOverflow = $('#show-overflow').prop('checked')
        let dim = getCanvasDimensions(size)


        width = unzoom(dim.width)
        height = unzoom(dim.height)

        $('.monitor_info .width').html(width)
        $('.monitor_info .height').html(height)

        let overflowSize = (showOverflow ? 32 : 0)

        top = overflowSize
        left = overflowSize

        let canvasWidth = dim.width + overflowSize * 2
        let canvasHeight = dim.height + overflowSize * 2

        ctx.save()
        $canvas.get(0).width = canvasWidth
        $canvas.get(0).height = canvasHeight
        ctx.restore()

        $('#monitor').css({width: canvasWidth, height: canvasHeight})
        
        $('#overflow').css('display', showOverflow ? '' : 'none')
        PAINT._restoreLastColorUsed()
    }

    function reset(){
        if(DO_LOG){
            console.log('resetting canvas')
        }

        ctx.clearRect(0, 0, $canvas.get(0).width, $canvas.get(0).height)
    }

    function resetTouchpoints(){        
        touchpoints = []
        if($('#enable-touchscreen').prop('checked')){
            calculateTouchscreenInput()
        }
    }


    /* helper functions */

    const SIZES = {
        "1x1": {width: 32, height: 32},
        "2x2": {width: 64, height: 64},
        "3x3": {width: 96, height: 96},
        "5x3": {width: 160, height: 96},
        "9x5": {width: 288, height: 160}
    }

    function getCanvasDimensions(size){
        if(! SIZES[size]){
            console.error('size not found:', size)
            return {width: 0, height: 0}
        }
        let ret =  SIZES[size]
        return {
            width: zoom(ret.width),
            height: zoom(ret.height)
        }
    }

    function zoom(val){
        return val * zoomFactor
    }

    function unzoom(val){
        return val / zoomFactor
    }

    function setZoomFactor(_zoomFactor){
        zoomFactor = _zoomFactor
        recalculateCanvas()
    }


    return {
        ctx: ()=>{return ctx},
        top: ()=>{return top},
        left: ()=>{return left},
        width: ()=>{return width},
        height: ()=>{return height},
        realWidth: ()=>{
            return $canvas.get(0).width
        },
        realHeight: ()=>{
            return $canvas.get(0).height
        },
        reset: reset,
        refresh: refresh,
        resetTouchpoints: resetTouchpoints,
        mouseIsOverMonitor: ()=>{
            return mouseIsOverMonitor
        }
    }

})(window, jQuery)