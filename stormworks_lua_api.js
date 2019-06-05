((global, $)=>{
  "use strict";


    $(global).on('load', init)

    function init(){
        setScreenFunctions()
        setMapFunctions()
        setInputFunctions()
        setOutputFunctions()
        setPropertyFunctions()
        $(global).trigger('stormworks_lua_api_loaded')
    }


    function setScreenFunctions(){

        function getWidth(){
            return CANVAS.width()
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getWidth, 'screen')

        function getHeight(){
            return CANVAS.height()
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getHeight, 'screen')

        function setColor(r, g, b, a){
            PAINT.setColor(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setColor, 'screen')

        function drawClear(){
            PAINT.drawClear()
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawClear, 'screen')

        function drawLine(x1, y1, x2, y2){
            PAINT.drawLine(x1, y1, x2, y2)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawLine, 'screen')

        function drawCircle(x, y, r){
            PAINT.drawCircle(x, y, r)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawCircle, 'screen')

        function drawCircleF(x, y, r){
            PAINT.drawCircleF(x, y, r)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawCircleF, 'screen')

        function drawRect(x, y, w, h){
            PAINT.drawRect(x, y, w, h)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawRect, 'screen')

        function drawRectF(x, y, w, h){
            PAINT.drawRectF(x, y, w, h)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawRectF, 'screen')

        function drawTriangle(x1, y1, x2, y2, x3, y3){
            PAINT.drawTriangle(x1, y1, x2, y2, x3, y3)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawTriangle, 'screen')

        function drawTriangleF(x1, y1, x2, y2, x3, y3){
            PAINT.drawTriangleF(x1, y1, x2, y2, x3, y3)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawTriangleF, 'screen')

        function drawText(x, y, text){
            PAINT.drawText(x, y, text)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawText, 'screen')

        function drawTextBox(x, y, w, h, text, h_align, v_align){
            PAINT.drawTextBox(x, y, w, h, text, h_align, v_align)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawTextBox, 'screen')


        /* screen (map related) */
        function drawMap(x, y, zoom){
            MAP.drawMap(x, y, zoom)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawMap, 'screen')

        function setMapColorOcean(r, g, b, a){
            MAP.setMapColorOcean(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setMapColorOcean, 'screen')

        function setMapColorShallows(r, g, b, a){
            MAP.setMapColorShallows(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setMapColorShallows, 'screen')

        function setMapColorLand(r, g, b, a){
            MAP.setMapColorLand(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setMapColorLand, 'screen')

        function setMapColorGrass(r, g, b, a){
            MAP.setMapColorGrass(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setMapColorGrass, 'screen')

        function setMapColorSand(r, g, b, a){
            MAP.setMapColorSand(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setMapColorSand, 'screen')

        function setMapColorSnow(r, g, b, a){
            MAP.setMapColorSnow(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setMapColorSnow, 'screen')
    }

    function setMapFunctions(){  

        //worldX, worldY = map.screenToMap(mapX, mapY, zoom, screenW, screenH, pixelX, pixelY)
        function screenToMap(mapX, mapY, zoom, screenW, screenH, pixelX, pixelY){
            MAP.screenToMap(mapX, mapY, zoom, screenW, screenH, pixelX, pixelY)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(screenToMap, 'map')

        //pixelX, pixelY = map.mapToScreen(mapX, mapY, zoom, screenW, screenH, worldX, worldY)
        function mapToScreen(mapX, mapY, zoom, screenW, screenH, worldX, worldY){
            MAP.mapToScreen(mapX, mapY, zoom, screenW, screenH, worldX, worldY)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(mapToScreen, 'map')
    }

    function setInputFunctions(){

        function getBool(i){
            if(typeof i !== 'number'){
                fengari.lauxlib.luaL_argerror(fengari.L, 1, 'expected number')
                return
            }
            return INPUT.getBool(i)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getBool, 'input')

        function getNumber(i){
            if(typeof i !== 'number'){
                fengari.lauxlib.luaL_argerror(fengari.L, 1, 'expected number')
                return
            }
            return INPUT.getNumber(i)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getNumber, 'input')        
    }

    function setOutputFunctions(){

        function setBool(i, val){
            if(typeof i !== 'number'){
                fengari.lauxlib.luaL_argerror(fengari.L, 1, 'expected number')
                return
            }
            if(typeof val !== 'boolean'){
                fengari.lauxlib.luaL_argerror(fengari.L, 2, 'expected boolean')
                return
            }
            return OUTPUT.setBool(i, val)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setBool, 'output')

        function setNumber(i, val){
            //TODO
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setNumber, 'output')
    }

    function setPropertyFunctions(){

        function getBool(label){
            return PROPERTY.getBool(label)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getBool, 'property')

        function getNumber(label){
            return PROPERTY.getNumber(label)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getNumber, 'property')

        function getText(label){
            return PROPERTY.getText(label)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getText, 'property')
    }
        /* touch stuff */
        /* numberchannels:
            1 monitor width
            2 monitor height
            3 input1x
            4 input1y
            5 input2x
            6 input2y

          onoff channels
            1 isinput1pressed
            2 isinputpressed
        */


})(window, jQuery)