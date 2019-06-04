var LUA_EMULATOR = ((global, $)=>{
  
  let supportedFunctions = {}
  let namespaces = {}

  let print = function(){
    let args = []
    let i = 0
    while(arguments[i] !== undefined){
      args.push(arguments[i])
      i++
    }
    console.log.apply(console, ['LUA output:'].concat(args))
    for(let arg of args){
      $('#console').val($('#console').val() + luaToString(arg) + " ")
    }
    $('#console').val( $('#console').val() + '\n')
    return 0
  }
  makeFunctionAvailableInLua(print)

  function createNamespace(name){    
    fengari.lua.lua_newtable(fengari.L)
    fengari.lua.lua_setglobal(fengari.L, name)
    namespaces[name] = true
    supportedFunctions[name] = {}
    log('created namespace', name)
  }

  function makeFunctionAvailableInLua(func, namespace){
    let l = fengari.L    
    if(typeof func !== 'function'){
      throw new Error('passed variable is not a function!')
    }
    const callback = func
    const name = callback.name
    let middleware = function(ll){
      let args = extractArgumentsFromStack(ll.stack, 'middleware')
      let ret =  callback.apply(null, convertArguments(args))
      let retlen = pushToStack(ll, ret)
      return retlen
    }
    if(typeof namespace === 'string'){
      if(! namespaces[namespace]){
        createNamespace(namespace)
      }

      fengari.lua.lua_getglobal(l, namespace)
      pushToStack(l, name)
      pushToStack(l, middleware)  
      fengari.lua.lua_settable(l, l.top-3)
      supportedFunctions[namespace][name] = true
    } else {
      fengari.lua.lua_pushjsfunction(fengari.L, middleware)   
      fengari.lua.lua_setglobal(fengari.L, name)
      supportedFunctions[name] = true
    }
    log('registered function', namespace ? namespace + '.' + name : name)
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
    } else if (typeof ob === 'function'){
      fengari.lua.lua_pushjsfunction(l, ob) 
      return 1
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
        let clean = {}
        for(let k of Object.keys(ob)){
          clean[k] = ob[k].toString()//TODO this is not correct! but if not doing this we got infitine recursion (cycling)
        }
        return JSON.stringify(clean, null, " ").replace(/\n/g, '').replace(/\s\s/g, ' ')
      }      
    } else if (ob === null) {
      return 'null'
    }else {
      return ob.toString()
    }
  }

  function log(){
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

  return {
    supportedFunctions: ()=>{return supportedFunctions},
    makeFunctionAvailableInLua: makeFunctionAvailableInLua,
    luaToString: luaToString
  }
})(window, jQuery)