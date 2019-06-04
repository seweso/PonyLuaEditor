var LUA_EMULATOR = ((global, $)=>{
  "use strict";


  let supportedFunctions = []



  function makeFunctionAvailableInLua(func){
    if(typeof func !== 'function'){
      throw new Error('passed variable is not a function!')
    }
    supportedFunctions.push({name: func.name})
    const callback = func
    const name = callback.name
    let middleware = function(l){
      let args = extractArgumentsFromStack(l.stack, 'middleware')
      let ret =  callback.apply(null, convertArguments(args))
      let retlen = pushToStack(l, ret)
      return retlen
    }
    fengari.lua.lua_pushjsfunction(fengari.L, middleware)   
    fengari.lua.lua_setglobal(fengari.L, name)
  }

  function extractArgumentsFromStack(stack, func_name){
    let args = []
    let argsBegin = false
    for(let s of stack){
      if(argsBegin && s !== undefined){
        args.push(s)
      } else if(typeof s === 'object' && s.type === 22 && s.value.name === func_name){
        argsBegin = true
      }
    }
    return args
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
    switch(value.type){
      case 5: {
        return luaTableToJSObject(value.value)
      }
      case 20: {
        return arrayBufferToString(value.value.realstring)
      }
      default: {
        return value.value
      }
    }
  }

  function luaTableToJSObject(table){
    let ret = {}
    if(table.l instanceof Object){
      let current = table.l
      ret[convertLuaValue(current.key)] = convertLuaValue(current.value)
      while(current.p instanceof Object){
        current = current.p
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
    } else if (ob instanceof Object){
      for(let k of Object.keys()){
        pushToStack(l, k)
        pushToStack(l, ob[k])
        fengari.lua.lua_settable(l, l.stack.top)
      }
      return 1;
    } else {
      throw new Error('return type ' + (typeof ob) + ' not supported!')
    }
  }

  function luaToString(ob){
    if(typeof ob === 'number'){
      return ob.toString()
    } else if(typeof ob === 'string'){
      return ob
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
        return JSON.stringify(ob, null, " ").replace(/\n/g, '').replace(/\s\s/g, ' ')
      }      
    } else {
      return ob.toString()
    }
  }

  return {
    supportedFunctions: supportedFunctions,
    makeFunctionAvailableInLua: makeFunctionAvailableInLua,
    luaToString: luaToString
  }
})(window, jQuery)