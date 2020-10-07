var LUA_EMULATOR = (($)=>{
    
    const DO_LOG = false

    let supportedFunctions = {}
    let namespaces = {}

    let l = fengari.L

    let fresh = true

    let isInTick = false
    let isInDraw = false

    let timer

    let stepCount = 0

    LOADER.on(LOADER.EVENT.PAGE_READY, init)

    let loaderNotified = false

    function init(){
        makeFunctionAvailableInLua(print)
        makeFunctionAvailableInLua(printColor)
        makeFunctionAvailableInLuaViaName(timeStart, 'start', 'timer')
        makeFunctionAvailableInLuaViaName(timeStop, 'stop', 'timer')

        makeFunctionAvailableInLua(function pause(){
            ENGINE.pauseScript()
        })


        /* remove unsupported libraries */
        for(let n of ["assert","collectcarbarge","dofile","error","_G","getmetatable","load","loadfile","pcall","rawequal","rawget","rawlen","rawset","select","setmetatable","type","_VERSION","xpcall",
            "coroutine","require","package","utf8","io","os","debug"]){
            deleteGlobalVariable(n)
        }

        STORMWORKS_LUA_API.init()

        if(! loaderNotified){
            loaderNotified = true
            LOADER.done(LOADER.EVENT.LUA_EMULATOR_READY)
        }
    }

    let print = function(){
        let args = []
        let i = 0
        while(arguments[i] !== undefined){
            args.push(arguments[i])
            i++
        }
        console.log.apply(console, ['LUA output:'].concat(args))
        let text = ''
        for(let arg of args){
            text += luaToString(arg) + ' '
        }
        CONSOLE.print(text)
    }

    let printColor = function(r,g,b){
        CONSOLE.setPrintColor(r,g,b)
    }

    let timeStart = function(){
        timer = performance.now()
        CONSOLE.print('timer started', CONSOLE.COLOR.SPECIAL)
    }   

    let timeStop = function(label){
        let time = typeof timer !== 'number' ? 0 : (performance.now() - timer)
        let ms = '' + time % 1000
        while(ms.length < 4){
            ms = '0' + ms
        }
        let s = (time-ms)/1000 % 60
        let m = (time-ms-s*1000)/1000/60
        timer = false
        CONSOLE.print('timer stopped (min:sec:milsec) = ' + m + ':' + (s < 10 ? '0'+s : s) + ':' + ms, CONSOLE.COLOR.SPECIAL)
    }   

    function createNamespace(name){    
        fengari.lua.lua_newtable(l)
        fengari.lua.lua_setglobal(l, name)
        namespaces[name] = true
        supportedFunctions[name] = {}
        log('created namespace', name)
    }

    function makeFunctionAvailableInLua(func, namespace){
        if(typeof func !== 'function'){
            throw new Error('passed variable is not a function!')
        }
        makeFunctionAvailableInLuaViaName(func, func.name, namespace)
    }

    function makeFunctionAvailableInLuaViaName(func, name, namespace){
        if(typeof func !== 'function'){
            throw new Error('passed variable is not a function!')
        }
        fengari.lua.lua_settop(l, 0)
        const callback = func
        let middleware = function(ll){
            let args = extractArgumentsFromStack(ll.stack, 'middleware')
            let ret =  callback.apply(null, convertArguments(args))
            if(ret === undefined || ret === null){
                let retlen = pushToStack(ll, null)
                return retlen
            } else if(ret.emulatorUnpack){
                let retlen = 0
                for(let k of Object.keys(ret)){
                    if(k !== 'emulatorUnpack'){
                        pushToStack(ll, ret[k])
                        retlen++
                    }
                }
                return retlen
            } else {
                let retlen = pushToStack(ll, ret)
                return retlen
            }
        }
        middleware.toString = ()=>{
            return 'emulated function()'//callback.toString()
        }
        if(typeof namespace === 'string'){
            if(! namespaces[namespace]){
                createNamespace(namespace)
            }
            fengari.lua.lua_getglobal(l, namespace)
            pushToStack(l, name)
            pushToStack(l, middleware)
            fengari.lua.lua_settable(l, l.top-3)
            fengari.lua.lua_settop(l, 0)
            supportedFunctions[namespace][name] = true
        } else {
            fengari.lua.lua_pushjsfunction(l, middleware)   
            fengari.lua.lua_setglobal(l, name)
            fengari.lua.lua_settop(l, 0)
            supportedFunctions[name] = true
        }
        log('registered function', namespace ? namespace + '.' + name : name)
    }

    function getGlobalVariable(name){
        fengari.lua.lua_settop(l, 0)
        fengari.lua.lua_getglobal(l, name)
        let res = l.stack[l.top-1]
        fengari.lua.lua_settop(l, 1)
        return convertLuaValue(res)
    }

    function deleteGlobalVariable(name){        
        fengari.lua.lua_settop(l, 0)
        fengari.lua.lua_pushnil(l)
        fengari.lua.lua_setglobal(l, name)
        fengari.lua.lua_settop(l, 0)
    }

    function callLuaFunction(name, args){
        if(typeof name !== 'string'){
            throw new Error('passed variable is not a string!')
        }
        fengari.lua.lua_settop(l, 0)
        fengari.lua.lua_getglobal(l, name)

        if(args instanceof Array === false){
            if (fengari.lua.lua_pcall(l, 0, 0, 0) != 0){
                bluescreenError(l, 'error running function `' + name + '`:', fengari.lua.lua_tostring(l, -1))
            }
        } else {
            for(let a of args){
                pushToStack(l, a)
            }
            if (fengari.lua.lua_pcall(l, args.length, 0, 0) != 0){
                bluescreenError(l, 'error running function `' + name + '`:', fengari.lua.lua_tostring(l, -1))
            }
        }
        fengari.lua.lua_settop(l, 0)
    }

    function extractArgumentsFromStack(stack, func_name){
        let args = []
        let argsBegin = false
        for(let k of Object.keys(stack).reverse()){
            let s = stack[k]
            if(typeof s === 'object' && s.type === 22 && s.value.name === func_name){
                argsBegin = true
            }
            if(!argsBegin && s !== undefined){
                args.push(s)
            }
        }
        return args.reverse()
    }

    function convertArguments(args){
        let argsConverted = {}
        let promises = []
        for(let a in args){
            argsConverted[a] = convertLuaValue(args[a])
        }
        let argArray = []
        for(let k of Object.keys(argsConverted)){
            argArray.push(argsConverted[k])
        }
        return argArray
    }

    function convertLuaValue(value){
        if(!value){
            return undefined
        }
        switch(value.type){
            case 5: {//table
                return luaTableToJSObject(value.value)
            }
            case 6: {//function
                return new Function()
            }
            case 19: {//number
                return value.value
            }
            case 7: {//TypeError
                return value.value.data.data
            }
            case 20: {//string
                return arrayBufferToString(value.value.realstring)
            }
            default: {
                return value.value
            }
        }
    }

    function luaTableToJSObject(table){
        let ret = {}
        if(table.f instanceof Object){
            let current = table.f
            ret[convertLuaValue(current.key)] = convertLuaValue(current.value)
            while(current.n instanceof Object && current.n !== null){
                current = current.n
                ret[convertLuaValue(current.key)] = convertLuaValue(current.value)
            }
            return ret
        } else {
            return {}
        }
    }

    function arrayBufferToString(buf) {
        return new TextDecoder("utf-8").decode(new Uint8Array(buf));
    }

    function pushToStack(l, ob){
        if(typeof ob === 'number'){
            fengari.lua.lua_pushnumber(l, ob)
            return 1;
        } else if (typeof ob === 'string'){
            fengari.lua.lua_pushliteral(l, ob)
            return 1;
        } else if (typeof ob === 'function'){
            fengari.lua.lua_pushjsfunction(l, ob) 
            return 1
        } else if (typeof ob === 'boolean'){
            fengari.lua.lua_pushboolean(l, ob)
            return 1
        } else if (ob === null){
            fengari.lua.lua_pushnil(l)
            return 1
        } else if (ob instanceof Array){
            fengari.lua.lua_createtable(l)
            for(let i in ob){
                pushToStack(l, parseInt(i)+1)
                pushToStack(l, ob[i])
                fengari.lua.lua_settable(l, -3)
            }
            return 1
        } else if (ob instanceof Object){
            fengari.lua.lua_createtable(l)
            for(let k of Object.keys(ob)){
                pushToStack(l, k)
                pushToStack(l, ob[k])
                fengari.lua.lua_settable(l, -3)
            }
            return 1;
        } else {
            throw new Error('return type ' + (typeof ob) + ' not supported!')
        }
    }

    function luaToString(ob){//can we instead use fengari.lua.lua_tostring ???
        if(typeof ob === 'number'){
            return ob.toString()
        } else if(typeof ob === 'string'){
            return ob
        } else if(ob instanceof Uint8Array){
           return arrayBufferToString(ob)
        } else if(ob instanceof Object){
            let onlyNumberKeys = true
            for(let k of Object.keys(ob)){
                if(isNaN(parseInt(k))){
                    onlyNumberKeys = false
                }
            }     
            if(onlyNumberKeys){
                if(Object.keys(ob).length === 0){
                    return '{}'
                }
                let str = '{'
                for(let k of Object.keys(ob)){
                    str += luaToString(ob[k]) + ', '
                }
                return str.substring(0, str.length-2) + '}'
            } else {
                let clean = {}
                for(let k of Object.keys(ob)){
                    clean[k] = ob[k].toString()//TODO this is not correct! but if not doing this we got infitine recursion (cycling)
                }
                return JSON.stringify(clean, null, " ").replace(/\n/g, '').replace(/\s\s/g, ' ')
            }      
        } else if (ob === null) {
            return 'nil'
        } else if (ob === undefined) {
            return 'nil'
        } else {
            return ob.toString()
        }
    }

    function log(){
        if(!DO_LOG){
            return
        }
        let args = []
        for(let a of arguments.callee.caller.arguments){
            args.push(a)
        }
        console.log.apply(console, ['LUA_EMULATOR.' + arguments.callee.caller.name + '()'].concat(args))

        let myargs = []
        for(let a of arguments){
            myargs.push(a)
        }
        if(myargs.length > 0){
            console.log.apply(console, myargs)
        }
    }

    function bluescreenError(l, message, luaObject){
        ENGINE.errorStop()
        console.error('LUA_EMULATOR.bluescreenError()', message, luaToString(luaObject), convertLuaValue(l.stack[l.top-1]))
        CONSOLE.print(message + ' ' + luaToString(luaObject), CONSOLE.COLOR.ERROR)
        setTimeout(()=>{
            console.log('paint bluescreen error')
            PAINT.setColor(0,0,255, 255)
            PAINT.drawRectF(0,0,CANVAS.width(), CANVAS.height())
            PAINT.setColor(255,255,255, 255)
            PAINT.drawTextBox(2, 2, CANVAS.width(), CANVAS.height(), message + luaToString(luaObject), -1, -1)
        }, 500)
    }

    function reset(){
        return new Promise((fulfill, reject)=>{
            console.log('reseting lua vm...')
            supportedFunctions = {}
            namespaces = {}
            fresh = false

            CONSOLE.reset()

            stepCount = 0
            
            try {       
                l = fengari.lauxlib.luaL_newstate()
                fengari.lua.lua_settop(l, 0)

                /* open standard libraries */
                fengari.lualib.luaL_openlibs(l);
                fengari.lauxlib.luaL_requiref(l, fengari.to_luastring("js"), fengari.interop.luaopen_js, 1);
                fengari.lua.lua_pop(l, 1); /* remove lib */

                init()

                fresh = true
                fulfill() 
                console.log('reseted lua vm', LUA_EMULATOR.getGlobalVariable('screen'))
            } catch (err){
                console.error('error reseting lua vm', err)
                UTIL.alert('Cannot reset the Lua VM, please reload the page and tell me about this bug!')
                fresh = true
                fulfill()
            }
        })
    }

    function tick(){
        isInTick = true
        if(typeof getGlobalVariable('onTick') === 'function'){
          callLuaFunction('onTick')
        }
        isInTick = false
    }

    function draw(){
        isInDraw = true      
        if(typeof getGlobalVariable('onDraw') === 'function'){
          callLuaFunction('onDraw')
        }
        isInDraw = false
    }

    return {
        supportedFunctions: ()=>{return supportedFunctions},
        bluescreenError: bluescreenError,
        makeFunctionAvailableInLua: makeFunctionAvailableInLua,
        makeFunctionAvailableInLuaViaName: makeFunctionAvailableInLuaViaName,
        callLuaFunction: callLuaFunction,
        getGlobalVariable: getGlobalVariable,
        luaToString: luaToString,
        reset: reset,
        l: ()=>{return l},
        tick: tick,
        draw: draw,
        isInTick: ()=>{return isInTick},
        isInDraw: ()=>{return isInDraw},
        notifyPaused: ()=>{
            CONSOLE.print('-- paused script', CONSOLE.COLOR.DEBUG)
        },
        notifyUnPaused: ()=>{
            CONSOLE.print('-- resumed script', CONSOLE.COLOR.DEBUG)
        },
        notifyStep: ()=>{
            stepCount++
            CONSOLE.print('-- step forward #' + stepCount, CONSOLE.COLOR.DEBUG)
        }
    }
})(jQuery)

