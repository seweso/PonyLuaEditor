var CANVAS = ((global, $)=>{
    "use strict";

    const DO_LOG = false

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
        $('#enable-touchscreen').on('change', ()=>{
            if($('#enable-touchscreen').prop('checked') === false){
            }
            INPUT.reset()

            calculateTouchscreenInput()
        })
        $(window).on('keydown mousedown', handleKeyDown)
        $(window).on('keyup mouseup', handleKeyUp)
        refresh()
    }

    function handleKeyDown(evt){
        if(YYY.isRunning() && $('#enable-touchscreen').prop('checked')){
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
        } else if (YYY.isRunning() && !enableTouchscreenHintShown){
            enableTouchscreenHintShown = true

            $('#enable-touchscreen-container').addClass('show_hint')
            setTimeout(()=>{
                $('#enable-touchscreen-container').removeClass('show_hint')
            }, 2000)
        }
    }

    function handleKeyUp(evt){
        if(YYY.isRunning() && $('#enable-touchscreen').prop('checked')){
            if(evt.originalEvent.button === 0){
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
        console.log('touchpoints', touchpoints)
        if($('#enable-touchscreen').prop('checked')){
            INPUT.setNumber(1, width, {
                val:  width,
                userLabel: 'screenWidth',
                slidercheck: true,
                slidermin: 0,
                slidermax: width,
                sliderstep: 1,
                oscilatecheck: false
            })
            INPUT.setNumber(2, height, {
                val:  height,
                userLabel: 'screenHeight',
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
                    userLabel: 'touch1 x',
                    slidercheck: true,
                    slidermin: 0,
                    slidermax: width,
                    sliderstep: 1,
                    oscilatecheck: false
                })

                let touchpoints0Y = Math.floor(touchpoints[0].y)
                INPUT.setNumber(4, touchpoints0Y, {
                    val:  touchpoints0Y,
                    userLabel: 'touch1 y',
                    slidercheck: true,
                    slidermin: 0,
                    slidermax: height,
                    sliderstep: 1,
                    oscilatecheck: false
                })

                INPUT.setBool(1, true, {
                    val:  true,
                    userLabel: 'touch1 pressed',
                    type: 'push',
                    key: 'e'
                })
            } else {
                INPUT.setNumber(3, 0, {
                    val:  0,
                    userLabel: 'touch1 x',
                    slidercheck: true,
                    slidermin: 0,
                    slidermax: width,
                    sliderstep: 1,
                    oscilatecheck: false
                })

                INPUT.setNumber(4, 0, {
                    val:  0,
                    userLabel: 'touch1 y',
                    slidercheck: true,
                    slidermin: 0,
                    slidermax: height,
                    sliderstep: 1,
                    oscilatecheck: false
                })

                INPUT.setBool(1, false, {
                    val:  false,
                    userLabel: 'touch1 pressed',
                    type: 'push',
                    key: 'e'
                })
            }

            if(touchpoints[1]){
                let touchpoints1X = Math.floor(touchpoints[1].x)
                INPUT.setNumber(5, touchpoints1X, {
                    val:  touchpoints1X,
                    userLabel: 'touch2 x',
                    slidercheck: true,
                    slidermin: 0,
                    slidermax: width,
                    sliderstep: 1,
                    oscilatecheck: false
                })

                let touchpoints1Y = Math.floor(touchpoints[1].y)
                INPUT.setNumber(6, touchpoints1Y, {
                    val:  touchpoints1Y,
                    userLabel: 'touch2 y',
                    slidercheck: true,
                    slidermin: 0,
                    slidermax: height,
                    sliderstep: 1,
                    oscilatecheck: false
                })

                INPUT.setBool(2, true, {
                    val:  true,
                    userLabel: 'touch2 pressed',
                    type: 'push',
                    key: 'q'
                })
            } else {
                INPUT.setNumber(5, 0, {
                    val:  0,
                    userLabel: 'touch2 x',
                    slidercheck: true,
                    slidermin: 0,
                    slidermax: width,
                    sliderstep: 1,
                    oscilatecheck: false
                })

                INPUT.setNumber(6, 0, {
                    val:  0,
                    userLabel: 'touch2 y',
                    slidercheck: true,
                    slidermin: 0,
                    slidermax: height,
                    sliderstep: 1,
                    oscilatecheck: false
                })

                INPUT.setBool(2, false, {
                    val:  false,
                    userLabel: 'touch1 pressed',
                    type: 'push',
                    key: 'q'
                })
            }


        } else {
            INPUT.removeNumber(1)
            INPUT.removeNumber(2)
            INPUT.removeNumber(3)
            INPUT.removeNumber(4)
            INPUT.removeNumber(5)
            INPUT.removeNumber(6)

            INPUT.removeBool(1)
            INPUT.removeBool(2)     
        }
    }

    function refresh(){
        $canvas = $('#canvas')
        ctx  = $canvas.get(0).getContext('2d')
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
        $('#monitor').css({width: canvasWidth, height: canvasHeight})
        $('#monitor-sizes, .zoomfactor').css({width: canvasWidth})

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
        setZoomFactor: setZoomFactor
    }

})(window, jQuery)