((global, $)=>{
  "use strict";


  $(global).on('load', init)

  function init(){
    let func = function(arg1, arg2){
      //console.log('custom func called with args', arg1, arg2)
      return 6
    }
    LUA_EMULATOR.makeFunctionAvailableInLua(func)

    let print2 = function(e){
      let args = []
      let i = 0
      while(arguments[i] !== undefined){
        args.push(arguments[i])
        i++
      }
      console.log.apply(console, ['LUA output:'].concat(args))
      for(let arg of args){
        $('#console').val($('#console').val() + LUA_EMULATOR.luaToString(arg) + " ")
      }
      $('#console').val( $('#console').val() + '\n')
      return 0
    }
    LUA_EMULATOR.makeFunctionAvailableInLua(print2)
  }




})(window, jQuery)