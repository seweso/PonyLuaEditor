engine = (($)=>{
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


    let totalStartsInTheSession = 0

    $(window).on('newui_loaded', init)

    function init(){

        $('#zoomfactor').on('change', ()=>{
            let val = $('#zoomfactor').val()
            CANVAS.setZoomFactor(val)
            PAINT.setZoomFactor(val)
            MAP.setZoomFactor(val)
            $('.zoomfactor span').html(val+'x')
            updateStorage()
        })

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
            util.confirm('Are you sure? This will also remove the code in the editor!').then((result)=>{
                if(result === true){
                    localStorage.clear()
                    yyy.makeNoExitConfirm()
                    document.location = document.location.href.split('?')[0]
                }
            }).catch(()=>{
                /* do nothing */
            })
        })

        $('#monitor-size, #show-overflow, #enable-touchscreen, #enable-touchscreen-secondary').on('change', (e)=>{
            updateStorage()
        })

        $('#timeBetweenTicks').on('input', ()=>{
            refreshTimeBetweenTicks()
            updateStorage()
        })

        $('#timeBetweenTicks').on('change', ()=>{
            refreshTimeBetweenTicks(true)
            updateStorage()
        })

        $('#timeBetweenDraws').on('input', ()=>{
            refreshTimeBetweenDraws()
            updateStorage()
        })

        $('#timeBetweenDraws').on('change', ()=>{
            refreshTimeBetweenDraws(true)
            updateStorage()
        })

        $('#save').on('click', ()=>{
            saveCodeInStorage()
        })

        let controlKeyDown = false
        $(window).on('keydown', (evt)=>{
            if(evt.originalEvent.keyCode === 17 || evt.originalEvent.keyCode === 15){
                controlKeyDown = true
            } else if(controlKeyDown && evt.originalEvent.key === 's'){
                evt.preventDefault()
                evt.stopPropagation()

                saveCode()
            }
        })        
        $(window).on('keyup', (evt)=>{
            if(evt.originalEvent.keyCode === 17 || evt.originalEvent.keyCode === 15){
                controlKeyDown = false
            }
        })

        $('#save-minified').on('click', ()=>{
            saveMinifiedCodeInStorage()
            $('#minified-code-container .custom_hint').show()
        })
    }


    function refresh(){
        //TODO add load config from localStorage (currently in script.js)

        INPUT.init($('#input'))
        OUTPUT.init($('#output'))
        PROPERTY.init($('#property'))

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
        reporter.report(reporter.REPORT_TYPE_IDS.pauseScript)

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
        saveCode()

        let code = editors.get('normal').editor.getValue()

        startCode(code)

        setTimeout(()=>{
            $('#start, #start-minified, #start-generated').blur()
        }, 100)
    }

    function startMinified(){
        lockUI()
        saveCode()

        let code = editors.get('minified').editor.getValue()

        startCode(code)

        setTimeout(()=>{
            $('#start, #start-minified, #start-generated').blur()
        }, 100)
    }

    function startGenerated(){
        lockUI()

        let code = editors.get('uibuilder').editor.getValue()

        startCode(code)

        setTimeout(()=>{
            $('#start, #start-minified, #start-generated').blur()
        }, 100)
    }

    function lockUI(){        
        $('#code-container, #minified-code-container, #ui-builder').addClass('locked')
    }

    function unlockUI(){
        $('#code-container, #minified-code-container, #ui-builder').removeClass('locked')
    }

    function startCode(code){
        reporter.report(reporter.REPORT_TYPE_IDS.startEmulator)

        totalStartsInTheSession++

        if(totalStartsInTheSession % 50 == 0){
            util.hint('Performace hint', 'After 50 starts you should reload the page to reset the emulator.\nPlease save ALL of your code (editor, minified and ui builder).\nThen reload the page.', {extended: true})
        }

        running = true

        $('#start, #start-minified, #start-generated').prop('disabled', true)

        $('#console-inner').html('')
        CANVAS.reset()
        CANVAS.resetTouchpoints()
        MAP.reset()
        PAINT._reset()
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
            $('#start, #start-minified, #start-generated').prop('disabled', false)
        })

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
            LUA_EMULATOR.printToConsole('onTick() execution was longer then 1000ms!')
        }
        tickTimes.reverse()
        tickTimes.pop()
        tickTimes.reverse()
        tickTimes.push(diff)
        let average = 0
        for(let t of tickTimes){
            average += t
        }

        $('#ticktime').html( Math.round(Math.min(1000/timeBetweenTicks*0.96, 1000/(average/tickTimes.length))))
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
        CANVAS.finalizeFrame()

        let end = new Date().getTime()
        let diff = end-begin
        if(diff > 1000 || diff > timeBetweenDraws){
            $('#drawtime').addClass('warning')
        } else {
            $('#drawtime').removeClass('warning')
        }
        if(diff > 1000){
            LUA_EMULATOR.printToConsole('onDraw() execution was longer then 1000ms!')
        }
        drawTimes.reverse()
        drawTimes.pop()
        drawTimes.reverse()
        drawTimes.push(diff)
        let average = 0
        for(let t of drawTimes){
            average += t
        }

        $('#drawtime').html( Math.round(Math.min(drawAnimationFrame? 60 : (1000/timeBetweenDraws*0.96), 1000/(average/drawTimes.length))))

        if(drawAnimationFrame){
            window.requestAnimationFrame(doDraw)
        }
    }


    function saveCode(){
        saveCodeInStorage()
        saveMinifiedCodeInStorage()
    }

    function saveCodeInStorage(){
        $('#save').addClass('saved')
        setTimeout(()=>{
            $('#save').removeClass('saved')
        }, 1000)
        localStorage.setItem('code', editors.get('normal').editor.getValue());
    }

    function saveMinifiedCodeInStorage(){
        $('#save-minified').addClass('saved')
        setTimeout(()=>{
            $('#save-minified').removeClass('saved')
        }, 1000)
        localStorage.setItem('minified-code', editors.get('unminified').editor.getValue());
    }

    return {        
        refresh: refresh,
        errorStop: errorStop,
        isRunning: ()=>{ return running },
        pauseScript: pauseScript
    }

})(jQuery)