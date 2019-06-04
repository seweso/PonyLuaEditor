((global, $)=>{
  "use strict";


  $(global).on('load', init)

  function init(){

    function setColor(r, g, b){
      PAINT.setColor(r, g, b)
      return 0
    }
    LUA_EMULATOR.makeFunctionAvailableInLua(setColor)
    
    function drawRectF(x, y, w, h){
      PAINT.drawRectF(x, y, w, h)
      return 0
    }
    LUA_EMULATOR.makeFunctionAvailableInLua(drawRectF)
  }




})(window, jQuery)