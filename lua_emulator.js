var LUA_EMULATOR = ((global, $)=>{
    
    const DO_LOG = false

    let supportedFunctions = {}
    let namespaces = {}

    let l = fengari.L

    let fresh = true

    let isInTick = false
    let isInDraw = false

    function init(){
        makeFunctionAvailableInLua(print)
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
        printToConsole(text)
    }   

    function printToConsole(text){
        $('#console').val($('#console').val() + text + '\n')

        //scroll down console
        $("#console").each( function(){
           let scrollHeight = Math.max(this.scrollHeight, this.clientHeight);
           this.scrollTop = scrollHeight - this.clientHeight;
        });
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
            if(ret === undefined){
                let retlen = pushToStack(ll, null)
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

    function callLuaFunction(name){
        if(typeof name !== 'string'){
            throw new Error('passed variable is not a string!')
        }
        fengari.lua.lua_settop(l, 0)
        fengari.lua.lua_getglobal(l, name)
        if (fengari.lua.lua_pcall(l, 0, 0, 0) != 0){
            bluescreenError(l, 'error running function `' + name + '`:', fengari.lua.lua_tostring(l, -1))
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
            for(let i in ob){
                pushToStack(l, ob[i])                
            }
            return ob.length
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
        YYY.errorStop()
        console.error('LUA_EMULATOR.bluescreenError()', message, luaToString(luaObject), convertLuaValue(l.stack[l.top-1]))
        printToConsole(message + ' ' + luaToString(luaObject))
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

            
            try {       
                l = fengari.lauxlib.luaL_newstate()
                fengari.lua.lua_settop(l, 0)

                /* open standard libraries */
                fengari.lualib.luaL_openlibs(l);
                fengari.lauxlib.luaL_requiref(l, fengari.to_luastring("js"), fengari.interop.luaopen_js, 1);
                fengari.lua.lua_pop(l, 1); /* remove lib */

                console.log('screen after luaL_newstate()', getGlobalVariableFromState('screen', l))

                init()
                $(global).trigger('lua_emulator_loaded')
                $(global).on('stormworks_lua_api_loaded', ()=>{
                    $(global).off('stormworks_lua_api_loaded')
                    fresh = true
                    fulfill() 
                    console.log('reseted lua vm', LUA_EMULATOR.getGlobalVariable('screen'))                        
                })
            } catch (err){
                console.error('error reseting lua vm', err)
                YYY.alert('Cannot reset the Lua VM, please reload the page and tell me about this bug!')
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

    init()

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
    }
})(window, jQuery)



$(window).trigger('lua_emulator_loaded')