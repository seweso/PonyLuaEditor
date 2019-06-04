var CANVAS = ((global, $)=>{
  "use strict";

  let $canvas
  let ctx

  let top = 0
  let left = 0
  let width = 0
  let height = 0

  $(global).on('load', init)

  function init(){
    $('#monitor-size, #show-overflow').on('change', (e)=>{
      recalculateCanvas()
    })
    $canvas = $('#canvas')
    ctx  = $canvas.get(0).getContext('2d')
    recalculateCanvas()
  }

  function recalculateCanvas(){
    let size = $('#monitor-size').val()
    let showOverflow = $('#show-overflow').prop('checked')
    let dim = getCanvasDimensions(size)

    width = dim.width
    height = dim.height
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
    ctx.clearRect(0, 0, $canvas.get(0).width, $canvas.get(0).height)
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
    return SIZES[size]
  }

  return {
    ctx: ()=>{return ctx},
    top: ()=>{return top},
    left: ()=>{return left},
    width: ()=>{return width},
    height: ()=>{return height},
    reset: reset
  }

})(window, jQuery)