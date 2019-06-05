((global, $)=>{
  "use strict";


    $(global).on('load', init)

    function init(){

        /* screen */
        function setColor(r, g, b){
            PAINT.setColor(r, g, b)
            return 0
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setColor, 'screen')
        
        function drawRectF(x, y, w, h){
            PAINT.drawRectF(x, y, w, h)
            return 0
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawRectF, 'screen')

        function drawLine(x1, y1, x2, y2){
            PAINT.drawLine(x1, y1, x2, y2)
            return 0
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawLine, 'screen')

        function drawText(x, y, text){
            PAINT.drawText(x, y, text)
            return 0
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawText, 'screen')











        $(global).trigger('stormworks_lua_api_loaded')
    }




})(window, jQuery)