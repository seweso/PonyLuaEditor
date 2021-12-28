STORMWORKS_LUA_API = (($)=>{
  "use strict";


    let loaderNotified = false

    function init(){
        setScreenFunctions()
        setMapFunctions()
        setInputFunctions()
        setDevInputFunctions()
        setOutputFunctions()
        setPropertyFunctions()
        setHTTPFunctions()


        if(! loaderNotified){
            loaderNotified = true
            LOADER.done(LOADER.EVENT.STORMWORKS_LUA_API_READY)
        }        
    }


    function setScreenFunctions(){

        function getWidth(){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            return CANVAS.width()
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getWidth, 'screen')

        function getHeight(){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            return CANVAS.height()
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getHeight, 'screen')

        function setColor(r, g, b, a){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof r !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof g !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof b !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(a !== undefined && a !== null && typeof a !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 4, 'expected number or nil or undefined')
                return
            }
            if(a === null){
                a = 0
            } else if (typeof a !== 'number'){
                a=255
            }
            PAINT.setColor(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setColor, 'screen')

        function drawClear(){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            PAINT.drawClear()
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawClear, 'screen')

        function drawLine(x1, y1, x2, y2){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x1 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y1 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof x2 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof y2 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 4, 'expected number')
                return
            }
            PAINT.drawLine(x1, y1, x2, y2)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawLine, 'screen')

        function drawCircle(x, y, r){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof r !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            PAINT.drawCircle(x, y, r)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawCircle, 'screen')

        function drawCircleF(x, y, r){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof r !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            PAINT.drawCircleF(x, y, r)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawCircleF, 'screen')

        function drawRect(x, y, w, h){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof w !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof h !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 4, 'expected number')
                return
            }
            PAINT.drawRect(x, y, w, h)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawRect, 'screen')

        function drawRectF(x, y, w, h){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof w !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof h !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 4, 'expected number')
                return
            }
            PAINT.drawRectF(x, y, w, h)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawRectF, 'screen')

        function drawTriangle(x1, y1, x2, y2, x3, y3){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x1 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y1 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof x2 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof y2 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 4, 'expected number')
                return
            }
            if(typeof x3 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 5, 'expected number')
                return
            }
            if(typeof y3 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 6, 'expected number')
                return
            }
            PAINT.drawTriangle(x1, y1, x2, y2, x3, y3)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawTriangle, 'screen')

        function drawTriangleF(x1, y1, x2, y2, x3, y3){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x1 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y1 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof x2 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof y2 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 4, 'expected number')
                return
            }
            if(typeof x3 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 5, 'expected number')
                return
            }
            if(typeof y3 !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 6, 'expected number')
                return
            }
            PAINT.drawTriangleF(x1, y1, x2, y2, x3, y3)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawTriangleF, 'screen')

        function drawText(x, y, text){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof text === 'number'){
                text = '' + text
            }
            if(typeof text !== 'string'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected string')
                return
            }
            PAINT.drawText(x, y, text)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawText, 'screen')

        function drawTextBox(x, y, w, h, text, h_align, v_align){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof w !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof h !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 4, 'expected number')
                return
            }
            if(typeof text === 'number'){
                text = '' + text
            }
            if(typeof text !== 'string'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 5, 'expected string')
                return
            }
            if(h_align !== undefined && h_align !== null && typeof h_align !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 6, 'expected number or nil or undefined')
                return
            }
            if(v_align !== undefined && v_align !== null && typeof v_align !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 7, 'expected number or nil or undefined')
                return
            }
            if(typeof h_align !== 'number'){
                h_align = -1
            }
            if(typeof v_align !== 'number'){
                v_align = -1
            }
            PAINT.drawTextBox(x, y, w, h, text, h_align, v_align)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawTextBox, 'screen')


        /* screen (map related) */
        function drawMap(x, y, zoom){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof x !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof y !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof zoom !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            MAP.drawMap(x, y, Math.max(0.1, Math.min(50,zoom)))
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(drawMap, 'screen')

        function setMapColorOcean(r, g, b, a){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof r !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof g !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof b !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof a !== 'number'){
                a = 255
            }
            MAP.setMapColorOcean(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setMapColorOcean, 'screen')

        function setMapColorShallows(r, g, b, a){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof r !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof g !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof b !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof a !== 'number'){
                a = 255
            }
            MAP.setMapColorShallows(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setMapColorShallows, 'screen')

        function setMapColorLand(r, g, b, a){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof r !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof g !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof b !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof a !== 'number'){
                a = 255
            }
            MAP.setMapColorLand(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setMapColorLand, 'screen')

        function setMapColorGrass(r, g, b, a){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof r !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof g !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof b !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof a !== 'number'){
                a = 255
            }
            MAP.setMapColorGrass(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setMapColorGrass, 'screen')

        function setMapColorSand(r, g, b, a){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof r !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof g !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof b !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof a !== 'number'){
                a = 255
            }
            MAP.setMapColorSand(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setMapColorSand, 'screen')

        function setMapColorSnow(r, g, b, a){
            if(!LUA_EMULATOR.isInDraw()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'screen can only be called from within onDraw()')
                return
            }
            if(typeof r !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof g !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof b !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof a !== 'number'){
                a = 255
            }
            MAP.setMapColorSnow(r, g, b, a)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setMapColorSnow, 'screen')
    }

    function setMapFunctions(){

        //worldX, worldY = map.screenToMap(mapX, mapY, zoom, screenW, screenH, pixelX, pixelY)
        function screenToMap(mapX, mapY, zoom, screenW, screenH, pixelX, pixelY){
            if(typeof mapX !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof mapY !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof zoom !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof screenW !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 4, 'expected number')
                return
            }
            if(typeof screenH !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 5, 'expected number')
                return
            }
            if(typeof pixelX !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 6, 'expected number')
                return
            }
            if(typeof pixelY !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 7, 'expected number')
                return
            }
            return MAP.screenToMap(mapX, mapY, zoom, screenW, screenH, pixelX, pixelY)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(screenToMap, 'map')

        //pixelX, pixelY = map.mapToScreen(mapX, mapY, zoom, screenW, screenH, worldX, worldY)
        function mapToScreen(mapX, mapY, zoom, screenW, screenH, worldX, worldY){
            if(typeof mapX !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof mapY !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected number')
                return
            }
            if(typeof zoom !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 3, 'expected number')
                return
            }
            if(typeof screenW !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 4, 'expected number')
                return
            }
            if(typeof screenH !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 5, 'expected number')
                return
            }
            if(typeof worldX !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 6, 'expected number')
                return
            }
            if(typeof worldY !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 7, 'expected number')
                return
            }
            return MAP.mapToScreen(mapX, mapY, zoom, screenW, screenH, worldX, worldY)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(mapToScreen, 'map')
    }

    function setInputFunctions(){

        function getBool(i){
            if(!LUA_EMULATOR.isInTick()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'input can only be called from within onTick()')
                return
            }
            if(typeof i !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(i%1 !== 0){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected integer')
                return
            }
            return INPUT.getBoolValue(i)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getBool, 'input')

        function getNumber(i){
            if(!LUA_EMULATOR.isInTick()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'input can only be called from within onTick()')
                return
            }
            if(typeof i !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(i%1 !== 0){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected integer')
                return
            }
            return INPUT.getNumberValue(i)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getNumber, 'input')        
    }

    function setDevInputFunctions(){

        function setBool(i, val){
            if(!LUA_EMULATOR.isInTick()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'devinput can only be called from within onTick()')
                return
            }
            if(typeof i !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(i%1 !== 0){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected integer')
                return
            }
            if(typeof val !== 'boolean'){
                val = false
            }
            INPUT.setBool(i, val)
        }
        LUA_EMULATOR.makeFunctionAvailableInLuaViaName(setBool, 'setBool', 'devinput')

        function setNumber(i, val){
            if(!LUA_EMULATOR.isInTick()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'devinput can only be called from within onTick()')
                return
            }
            if(typeof i !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(i%1 !== 0){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected integer')
                return
            }
            if(typeof val !== 'number'){
                val = 0
            }
            INPUT.setNumber(i, val)
        }
        LUA_EMULATOR.makeFunctionAvailableInLuaViaName(setNumber, 'setNumber', 'devinput')
    }

    function setOutputFunctions(){

        function setBool(i, val){
            if(!LUA_EMULATOR.isInTick()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'output can only be called from within onTick()')
                return
            }
            if(typeof i !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(i%1 !== 0){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected integer')
                return
            }
            if(typeof val !== 'boolean'){
                val =  false
            }
            OUTPUT.setBool(i, val)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setBool, 'output')

        function setNumber(i, val){
            if(!LUA_EMULATOR.isInTick()){
                fengari.lauxlib.luaL_error(LUA_EMULATOR.l(), 'output can only be called from within onTick()')
                return
            }
            if(typeof i !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(i%1 !== 0){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected integer')
                return
            }
            if(typeof val !== 'number'){
                val = 0
            }
            OUTPUT.setNumber(i, val)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(setNumber, 'output')
    }

    function setPropertyFunctions(){

        function getBool(label){
            if(typeof label !== 'string'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected string')
                return
            }
            return PROPERTY.getBool(label)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getBool, 'property')

        function getNumber(label){
            if(typeof label !== 'string'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected string')
                return
            }
            return PROPERTY.getNumber(label)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getNumber, 'property')

        function getText(label){
            if(typeof label !== 'string'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected string')
                return
            }
            return PROPERTY.getText(label)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(getText, 'property')
    }

    function setHTTPFunctions(){

        function httpGet(port, url){
            if(typeof port !== 'number'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 1, 'expected number')
                return
            }
            if(typeof url !== 'string'){
                fengari.lauxlib.luaL_argerror(LUA_EMULATOR.l(), 2, 'expected string')
                return
            }
            HttpLocalhost.get(port, url)
        }
        LUA_EMULATOR.makeFunctionAvailableInLua(httpGet, 'async')

    }

    return {
        init: init
    }
    
})(jQuery)
