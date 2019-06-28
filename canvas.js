var CANVAS = ((global, $)=>{
    "use strict";

    const DO_LOG = false

    let zoomFactor = 1

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
        $(global).on('mousemove', (evt)=>{
            if(mouseIsOverMonitor){
                mouseX = evt.originalEvent.clientX
                mouseY = evt.originalEvent.clientY + $(global).scrollTop()
            }
        })
        $(global).on('keydown', handleKeyDown)
        $(global).on('keyup', handleKeyUp)
        refresh()
    }

    function handleKeyDown(evt){
        if(YYY.isRunning() && $('#enable-touchscreen').prop('checked')){
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
        }
        calculateTouchscreenInput()
    }

    function calculateTouchscreenInput(){
        if(touchpoints.length > 0){
            INPUT.setNumber(1, width)
            INPUT.setNumber(2, height)            
        } else {
            INPUT.setNumber(1, 0)
            INPUT.setNumber(2, 0)             
        }

        if(touchpoints[0]){
            INPUT.setNumber(3, Math.floor(touchpoints[0].x))
            INPUT.setNumber(4, Math.floor(touchpoints[0].y))

            INPUT.setBool(1, true)
        } else {
            INPUT.setNumber(3, 0)
            INPUT.setNumber(4, 0)

            INPUT.setBool(1, false)
        }

        if(touchpoints[1]){
            INPUT.setNumber(5, Math.floor(touchpoints[1].x))
            INPUT.setNumber(6, Math.floor(touchpoints[1].y))

            INPUT.setBool(2, true)
        } else {
            INPUT.setNumber(5, 0)
            INPUT.setNumber(6, 0)

            INPUT.setBool(2, false)
        }
    }

    function handleKeyUp(evt){
        if(YYY.isRunning()){
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
        }
        calculateTouchscreenInput()
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
        top = showOverflow ? 32 : 0
        left = showOverflow ? 32 : 0

        let canvasWidth = dim.width + (showOverflow ? 64 : 0)
        let canvasHeight = dim.height + (showOverflow ? 64 : 0)
        ctx.save()
        $canvas.get(0).width = canvasWidth
        $canvas.get(0).height = canvasHeight
        ctx.restore()
        $('#monitor').css({width: canvasWidth, height: canvasHeight})

        $('#overflow').css('display', showOverflow ? '' : 'none')
    }
 
    function reset(){
        if(DO_LOG){
            console.log('resetting canvas')
        }
        ctx.clearRect(0, 0, $canvas.get(0).width, $canvas.get(0).height)
    }

    function resetTouchpoints(){        
        touchpoints = []
        calculateTouchscreenInput()
    }


    /* helper functions */

    const SIZES = {
        "1x1": {width: 32, height: 32},
        "2x2": {width: 64, height: 64},
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