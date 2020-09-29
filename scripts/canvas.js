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
    let canvas
    let ctx
    let contextScaled = false

    let $renderCanvas
    let renderCanvas
    let renderCtx

    const RENDER_SCALING_FACTOR = 16

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

    $(global).on('load', init)

    function init(){
        $('#monitor-size, #show-overflow').on('change', (e)=>{
            recalculateCanvas()
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

        $('#enable-touchscreen-secondary').on('change', ()=>{
            secondaryTouchEnabled = $('#enable-touchscreen-secondary').prop('checked')
        })

        $(window).on('keydown mousedown', handleKeyDown)
        $(window).on('keyup mouseup', handleKeyUp)


        let params = new URLSearchParams( document.location.search)
        let paramBigmonitor = params.get('bigmonitor')
        if(paramBigmonitor === 'true'){
            setTimeout(()=>{
                $('#zoomfactor').attr('max', '20')
                $('.content').before($('#monitor'))
            }, 1000)
        }

        $renderCanvas = $('<canvas id="render-canvas">').css({display: 'none'})
        $('body').append($renderCanvas)

        refresh()
    }

    function handleKeyDown(evt){
        if(engine.isRunning() && $('#enable-touchscreen').prop('checked')){
            if(evt.originalEvent.button === 0 && mouseIsOverMonitor){
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
        } else if (engine.isRunning() && !enableTouchscreenHintShown){
            enableTouchscreenHintShown = true

            $('#enable-touchscreen-container').addClass('show_hint')
            setTimeout(()=>{
                $('#enable-touchscreen-container').removeClass('show_hint')
            }, 2000)
        }
    }

    function handleKeyUp(evt){
        if(engine.isRunning() && $('#enable-touchscreen').prop('checked')){
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
        canvas = $canvas.get(0)
        ctx  = canvas.getContext('2d')


        $renderCanvas = $('#render-canvas')
        renderCanvas = $renderCanvas.get(0)
        renderCtx  = renderCanvas.getContext('2d')

        recalculateCanvas()        
    }

    function recalculateCanvas(){
        let size = $('#monitor-size').val()
        let showOverflow = $('#show-overflow').prop('checked')
        let dim = getCanvasDimensions(size)


        width = unzoom(dim.width)
        height = unzoom(dim.height)

        $('#monitor-sizes .width').html(width)
        $('#monitor-sizes .height').html(height)

        top = showOverflow ? 32 : 0
        left = showOverflow ? 32 : 0

        let canvasWidth = dim.width + (showOverflow ? 64 : 0)
        let canvasHeight = dim.height + (showOverflow ? 64 : 0)

        ctx.save()
        $canvas.get(0).width = canvasWidth
        $canvas.get(0).height = canvasHeight
        ctx.restore()

        renderCtx.save()
        renderCanvas.width = canvasWidth * RENDER_SCALING_FACTOR
        renderCanvas.height = canvasHeight * RENDER_SCALING_FACTOR
        contextScaled = false
        renderCtx.restore()

        $('#monitor').css({width: canvasWidth, height: canvasHeight})
        $('#monitor-sizes, .zoomfactor').css({width: canvasWidth})

        $('#overflow').css('display', showOverflow ? '' : 'none')
        PAINT._restoreLastColorUsed()
    }

    function reset(){
        if(DO_LOG){
            console.log('resetting canvas')
        }
        ctx.clearRect(0, 0, canvas.width * 2, canvas.height * 2) /* multiply with 2 to make sure its enough */
        renderCtx.clearRect(0, 0, renderCanvas.width * 2, renderCanvas.height * 2)
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

    function finalizeFrame(){        
        if(!contextScaled){
            contextScaled = true  

            ctx.scale(1/RENDER_SCALING_FACTOR,1/RENDER_SCALING_FACTOR)          
        }
        ctx.drawImage(renderCanvas,0,0)
    }

    return {
        ctx: ()=>{return renderCtx},
        top: ()=>{return top * RENDER_SCALING_FACTOR},
        left: ()=>{return left * RENDER_SCALING_FACTOR},
        width: ()=>{return width},
        height: ()=>{return height},
        realWidth: ()=>{
            return $canvas.get(0).width
        },
        realHeight: ()=>{
            return $canvas.get(0).height
        },
        renderWidth: ()=>{
            return renderCanvas.width
        },
        renderHeight: ()=>{
            return renderCanvas.height
        },
        RENDER_SCALING_FACTOR: RENDER_SCALING_FACTOR,
        reset: reset,
        refresh: refresh,
        resetTouchpoints: resetTouchpoints,
        setZoomFactor: setZoomFactor,
        finalizeFrame: finalizeFrame
    }

})(window, jQuery)