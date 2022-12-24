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
    let ignoreInfiniteLoops = false

    let totalStartsInTheSession = 0

    let saveCallbacks = []
    let loadCallbacks = []

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

        $('#save').on('click', triggerSave)

        $('#save-to-history').on('click', ()=>{
            triggerSave()
            HISTORY.addCurrentCode()
        })

        $('#reset').on('click', ()=>{
            UTIL.confirm('Remove all current settings and code, but keep "History" and "My Library"?').then((res)=>{
                if(res){
                    STORAGE.set()
                    // TODO rework this to not use page reload
                    YYY.makeNoExitConfirm()
                    document.location.reload()
                }
            })
        })

        $('#code-title').on('change', ()=>{
            STORAGE.setConfiguration('title', $('#code-title').val())
        })

        
        $(window).on('keydown', (evt)=>{
            if(evt.originalEvent.key === 's' && (evt.originalEvent.ctrlKey || evt.originalEvent.metaKey)){
                evt.preventDefault()
                evt.stopPropagation()

                triggerSave()
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
            } else if( running && (evt.originalEvent.key === 'p') && (evt.originalEvent.ctrlKey || evt.originalEvent.metaKey)){
                evt.preventDefault()
                evt.stopPropagation()

                if(paused){
                	unpauseScript()
                } else {
                	pauseScript()
                }
            }
        })


        loadCodesFromStorage()

        LOADER.done(LOADER.EVENT.ENGINE_READY)
    }

    function triggerSave(){
        for(let cb of saveCallbacks){
            try {
                cb()
            } catch (err){
                console.error(err)
            }
        }

        saveCodesInStorage()
    }

    /* gets called when save button is pressed */
    function addSaveCallback(callback){
        if(typeof callback !== 'function'){
            throw new Error('callback must be a function')
        }

        saveCallbacks.push(callback)
    }

    function triggerLoad(){
        for(let cb of loadCallbacks){
            try {
                cb()
            } catch (err){
                console.error(err)
            }
        }

        loadCodesFromStorage()
    }

    /* gets called when storage was set to new configuration (e.g. after loading share) */
    function addLoadCallback(callback){
        if(typeof callback !== 'function'){
            throw new Error('callback must be a function')
        }

        loadCallbacks.push(callback)
    }

    function refresh(){
        STORAGE.setConfigVal($('#timeBetweenTicks'), 'settings.timeBetweenTicks', 16)
        STORAGE.setConfigVal($('#timeBetweenDraws'), 'settings.timeBetweenDraws', 16)

        CANVAS.refresh()        

        refreshTimeBetweenTicks()
        refreshTimeBetweenDraws()   
    }


    function refreshTimeBetweenTicks(is_change){
        let val = $('#timeBetweenTicks').val()
        timeBetweenTicks = val
        $('#timeBetweenTicksVal').text(Math.round(1000/val*0.96))
        if(running && is_change){
            clearDrawAndTickInterval()
            setDrawAndTickInterval()
        }
    }

    function refreshTimeBetweenDraws(is_change){
        let val = $('#timeBetweenDraws').val()
        timeBetweenDraws = val
        $('#timeBetweenDrawsVal').text(Math.round(1000/val*0.96))
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
        $('#pause').text('Resume')
    }

    function unpauseScript(){
        LUA_EMULATOR.notifyUnPaused()
        
        $('#step').prop('disabled', true)
        $('#pause').text('Pause')
        
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
        triggerSave()

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
        LUA_EMULATOR.load(code)
       
        INPUT.reset()
        OUTPUT.reset()

        setDrawAndTickInterval()
        $('#stop').prop('disabled', false)
        $('#pause').prop('disabled', false)
    }

    function stop(){
        $('#pause').prop('disabled', true).text('Pause')
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

        $('#ticktime').text( Math.round(Math.min(1000/timeBetweenTicks*0.96, 1000/(average/tickTimes.length))))

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

        $('#drawtime').text( Math.round(Math.min(drawAnimationFrame? 60 : (1000/timeBetweenDraws*0.96), 1000/(average/drawTimes.length))))

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

    function notifyInfiniteLoopDetected(){
        if(!ignoreInfiniteLoops){
            CONSOLE.print('Error: Pony IDE stopped the script because of unusually many function tools (might be an infinite loop).', CONSOLE.COLOR.ERROR)
            
            stop()
            setTimeout(()=>{
                UTIL.confirm('Script stopped because of possible infinite loop. Do you want to ignore that in the future?').then((ret)=>{
                    if(ret){
                        ignoreInfiniteLoops = true
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

        LIBRARY.saveToStorage()

        SHARE.removeIdFromURL()

        HISTORY.updatePageTitle()

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
        addSaveCallback: addSaveCallback,
        addLoadCallback: addLoadCallback,
        refresh: refresh,
        errorStop: errorStop,
        stop: stop,
        isRunning: ()=>{ return running },
        pauseScript: pauseScript,
        triggerSave: triggerSave,
        triggerLoad: triggerLoad,
        notifyInfiniteLoopDetected: notifyInfiniteLoopDetected
    }

})(jQuery)