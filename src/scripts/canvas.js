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

    let lastMouseEvent = null
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

        $('#monitor-rotation').on('change', (e)=>{
            STORAGE.setConfiguration('settings.monitorRotation', $('#monitor-rotation').val())
            recalculateCanvas()
        })

        $('#show-overflow').on('change', (e)=>{
            STORAGE.setConfiguration('settings.showOverflow', $('#show-overflow').prop('checked'))
        })

        $('#zoomfactor').on('change', ()=>{
            let val = $('#zoomfactor').val()

            PAINT.setZoomFactor(val)
            MAP.setZoomFactor(val)
            setZoomFactor(val)

            $('.monitor_info .zoom').text(val+'x')
            
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
        
        /* touchscreen for mouse */
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
            lastMouseEvent = evt.originalEvent;
            if(mouseIsOverMonitor){
                mouseX = evt.originalEvent.clientX
                mouseY = evt.originalEvent.clientY + $(global).scrollTop()
            }
        })
        
        /* touchscreen for touch */
        $('#monitor').on('touchstart', (evt)=>{
            mouseIsOverMonitor = true
            mouseX = evt.originalEvent.touches[0].clientX
            mouseY = evt.originalEvent.touches[0].clientY + $(global).scrollTop()
        })
        $(window).on('touchend', (evt)=>{
            mouseIsOverMonitor = false            
        })
        $(window).on('touchcancel', (evt)=>{
            mouseIsOverMonitor = false            
        })
        $(window).on('touchmove', (evt)=>{
            if(mouseIsOverMonitor){
                mouseX = evt.originalEvent.touches[0].clientX
                mouseY = evt.originalEvent.touches[0].clientY + $(global).scrollTop()
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

        // TODO rewrite code style to match current code (or already coverted in app.html?)
        function absorbEvent(event) {
            event.returnValue = false;
        }
        let div1 = document.querySelector("#canvas");
        div1.addEventListener("touchstart", absorbEvent);
        div1.addEventListener("touchend", absorbEvent);
        div1.addEventListener("touchmove", absorbEvent);
        div1.addEventListener("touchcancel", absorbEvent);              

        $(window).on('keydown mousedown touchstart', handleKeyDown)
        $(window).on('keyup mouseup touchend', handleKeyUp)
        
        $("#canvas").on('touchmove mousemove touchstart', handleMove)

        let params = new URLSearchParams( document.location.search)
        let paramBigmonitor = params.get('bigmonitor')
        if(paramBigmonitor === 'true'){
            $('#zoomfactor').attr('max', '20')
            $('.ide').before($('#monitor'))
        }
        
        refresh()


        /* load config from STORAGE */
        STORAGE.setConfigVal($('#zoomfactor'), 'settings.zoomfactor', 1)
        STORAGE.setConfigVal($('#monitor-size'), 'settings.monitorSize', '1x1')
        STORAGE.setConfigVal($('#monitor-rotation'), 'settings.monitorRotation', '0')
        STORAGE.setConfigVal($('#show-overflow'), 'settings.showOverflow', true)
        STORAGE.setConfigVal($('#enable-touchscreen'), 'settings.touchscreenEnabled', false)
        STORAGE.setConfigVal($('#enable-touchscreen-secondary'), 'settings.touchscreenSecondaryEnabled', false)
        
        LOADER.done(LOADER.EVENT.CANVAS_READY)
    }

    function handleMove(e) {
        // TODO Check for multi-touch support checkmark
        if(!ENGINE.isRunning() || !$('#enable-touchscreen').prop('checked')) {
            return;
        }        
        var touch = e;
        if(UI.supportsTouch() && e.originalEvent instanceof TouchEvent) {
            touch = e.originalEvent.touches[0];
        }         
        if (!touch) {
            return;
        }
        
        var pos = getPos(e, touch);
                
        if(touchpoints[0]) {
            touchpoints[0].x = pos.x;
            touchpoints[0].y = pos.y;
        }        
                
        if(UI.supportsTouch() && e.originalEvent instanceof TouchEvent && e.originalEvent.touches[1]){
            var touch = e.originalEvent.touches[1];
            var pos = getPos(e, touch);
            var tp = touchpoints[1] 
            if (!tp) {
                const key = (touchpoints.find(element => element.key === 'e')) ? 'q' : 'e';
                touchpoints.push({
                    key: key,
                    x: pos.x,
                    y: pos.y
                })
            } else {
                tp.x = pos.x;
                tp.y = pos.y;                
            }
        }
        calculateTouchscreenInput();
    }    
    
    function handleKeyDown(evt){
        if(mouseIsOverMonitor){
            if(ENGINE.isRunning() && $('#enable-touchscreen').prop('checked')){
                let touch = lastMouseEvent;
                if((UI.supportsTouch() && evt.originalEvent instanceof TouchEvent)){
                    touch = evt.changedTouches[0];
                    if (touchpoints.find(element => element.key === 'e')) {
                        evt.originalEvent.key = 'q'    
                    } else {
                        evt.originalEvent.key = 'e'
                    }                    
                } else if(evt.originalEvent.button === 0){
                    // Mouse click
                    touch = evt.originalEvent;
                    evt.originalEvent.key = 'e'
                }
                if(evt.originalEvent.key === 'q' || evt.originalEvent.key === 'e'){
                    // Keyboard click (or touch / mouse click as keyboard event)
                    evt.preventDefault()
                    evt.stopImmediatePropagation()
                    if(touchpoints[0] && touchpoints[0].key === evt.originalEvent.key || touchpoints[1] && touchpoints[1].key === evt.originalEvent.key){
                        return
                    }
                    const pos = getPos(evt, touch);
                    
                    let pX = pos.x;
                    let pY = pos.y;                   

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

                UTIL.hintImportant("Touchscreen not enabled", "In order to use the touchscreen functionality, enable the touchscreen in the settings tab.")
            }
        }
    }

    function handleKeyUp(evt){
        if(ENGINE.isRunning() && $('#enable-touchscreen').prop('checked')){
            if((UI.supportsTouch() && evt.originalEvent instanceof TouchEvent)){
                if (touchpoints[1]) {
                    const pos = getPos(evt, evt.originalEvent.changedTouches[0]);
                    if (distance(pos, touchpoints[0]) < distance(pos, touchpoints[1])) {
                        touchpoints = [touchpoints[1]]    
                    } else {
                        touchpoints = [touchpoints[0]]
                    }
                } else {
                    touchpoints = []
                }                
                calculateTouchscreenInput()
                return
            } else if(evt.originalEvent.button === 0 && mouseIsOverMonitor){
                evt.originalEvent.key = 'e'
            }
            if(evt.originalEvent.key === 'q' || evt.originalEvent.key === 'e'){
                try {
                    evt.preventDefault()
                    evt.stopImmediatePropagation()
                } catch (ignored){}

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
            
            const eTouch = touchpoints.find(element => element.key === 'e'); // Touch 1
            const qTouch = touchpoints.find(element => element.key === 'q'); // Touch 2

            if(eTouch){
                let touchpoints0X = Math.floor(eTouch.x)
                INPUT.setNumber(3, touchpoints0X, {
                    val:  touchpoints0X,
                    userLabel: LABELS.NUMBER[3],
                    slidercheck: true,
                    slidermin: 0,
                    slidermax: width,
                    sliderstep: 1,
                    oscilatecheck: false
                })

                let touchpoints0Y = Math.floor(eTouch.y)
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
                if(qTouch){
                    let touchpoints1X = Math.floor(qTouch.x)
                    INPUT.setNumber(5, touchpoints1X, {
                        val:  touchpoints1X,
                        userLabel: LABELS.NUMBER[5],
                        slidercheck: true,
                        slidermin: 0,
                        slidermax: width,
                        sliderstep: 1,
                        oscilatecheck: false
                    })

                    let touchpoints1Y = Math.floor(qTouch.y)
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

        $('.monitor_info .width').text(width)
        $('.monitor_info .height').text(height)

        let overflowSize = (showOverflow ? 32 : 0)

        top = overflowSize
        left = overflowSize

        let canvasWidth = dim.width + overflowSize * 2
        let canvasHeight = dim.height + overflowSize * 2

        ctx.save()
        $canvas.get(0).width = canvasWidth
        $canvas.get(0).height = canvasHeight
        ctx.restore()


        let rotation = parseInt(STORAGE.getConfiguration('settings.monitorRotation'))
        // $('#monitor').css({
        //     width: rotation % 180 === 0 ? canvasWidth : canvasHeight,
        //     height: rotation % 180 === 0 ? canvasHeight : canvasWidth
        // })

        let translateXY = 'translate('
        switch(rotation){
            case 0: {
                translateXY += '0%, 0%'
            }; break;
            case 90: {
                translateXY += '0%, -100%'
            }; break;
            case 180: {
                translateXY += '-100%, -100%'
            }; break;
            case 270: {
                translateXY += '-100%, 0%'
            }; break;
        }
        translateXY += ')'

        $canvas.css({
            transform: 'rotate(' + rotation + 'deg) ' + translateXY,
            'transform-origin': 'top left'
        })
        $('#overflow').css({
            display: showOverflow ? '' : 'none',
        })

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
        "2x1": {width: 64, height: 32},
        "2x2": {width: 64, height: 64},
        "3x1": {width: 96, height: 32},
        "3x2": {width: 96, height: 64},
        "3x3": {width: 96, height: 96},
        "5x3": {width: 160, height: 96},
        "9x5": {width: 288, height: 160},
        "5x9": {width: 160, height: 288}, // For apps only
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

    function getPos(evt, touch) {
        const rect = evt.target.getBoundingClientRect();
        const p = {
            x: unzoom(touch.clientX - rect.left),
            y: unzoom(touch.clientY - rect.top)
        };

        //adjust for rotated monitor 
        switch('' + (STORAGE.getConfiguration('settings.monitorRotation') || 0) ){
            case '0':   return p;
            case '90':  return { x: p.y, y: height - p.x};
            case '180': return { x: width - p.x, y: height - p.y};
            case '270': return { x: width - p.y, y: p.x};
        }
        
        console.error("unknown rotation");
    }
    
    function distance(pos1, pos2) {
        return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);
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
        }, 
        SIZES: SIZES
    }

})(window, jQuery)