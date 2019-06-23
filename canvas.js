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

    $(global).on('load', init)

    function init(){
        $('#monitor-size, #show-overflow').on('change', (e)=>{
            recalculateCanvas()
        })
        $('#monitor').on('mousedown', handleMouseDown)
        $('#monitor').on('mouseleave mouseup', handleMouseLeaveAndUp)
        refresh()
    }

    function handleMouseDown(evt){
        if( $('#enable-touchscreen').prop('checked') === false){
            return
        }
        let deltaX = evt.originalEvent.clientX - $('#monitor').offset().left - left
        let deltaY = evt.originalEvent.clientY - $('#monitor').offset().top - top

        let pX = unzoom(deltaX)
        let pY = unzoom(deltaY)

        if(pX > 0 && pX < width && pY > 0 && pY < height){
            // its a touch click!
            evt.preventDefault()
            evt.stopImmediatePropagation()

            isTouchDown = true

            INPUT.setNumber(1, width)
            INPUT.setNumber(2, height)
            INPUT.setNumber(3, Math.floor(pX))
            INPUT.setNumber(4, Math.floor(pY))

            INPUT.setBool(1, true)
        }
    }

    function handleMouseLeaveAndUp(){
        if(isTouchDown){
            isTouchDown = false

            INPUT.setNumber(1, 0)
            INPUT.setNumber(2, 0)
            INPUT.setNumber(3, 0)
            INPUT.setNumber(4, 0)

            INPUT.setBool(1, false)
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
        setZoomFactor: setZoomFactor
    }

})(window, jQuery)