((global, $)=>{
  "use strict";

  let $canvas
  let ctx

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
    let width = dim.width + (showOverflow ? 64 : 0)
    let height = dim.height + (showOverflow ? 64 : 0)
    $canvas.get(0).width = width
    $canvas.get(0).height = height
    $('#monitor').css({width: width, height: height})

    $('#overflow').css('display', showOverflow ? '' : 'none')
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

})(window, jQuery)