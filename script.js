/* LUA Emulator */

((global, $)=>{
  "use strict";

  let $canvas
  let ctx

  $(window).on('load', init)
  function init(){
  	$('#monitor-size, #show-overflow').on('change', (e)=>{
  		recalculateCanvas()
  	})
  	$canvas = $('#canvas')
  	ctx  = $canvas.get(0).getContext('2d')
  	recalculateCanvas()
  	$('#run').on('click', run)
  	$('#console').val('')

  	setupFengari()
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

  function run(){
  	$('#console').val('')
  	let code = editor.getValue()
  	try {
	  	let feng = fengari.load(code)
  		feng()
	  } catch (err){
	  	$('#console').append(err)
	  }
  }

  function setupFengari(){
  	let func = function(arg1, arg2){
  		//console.log('custom func called with args', arg1, arg2)
  		return 6
  	}
  	makeFunctionAvailableInLua(func)

  	let print2 = function(e){
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
    makeFunctionAvailableInLua(print2)
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


  /* lua emulating */

  function arrayBufferToString(buf) {
  	return new TextDecoder("utf-8").decode(new Uint8Array(buf));
	}

	function getLastElementInStack(stack){
		let i = 0
		while(i+1 < stack.length && stack[i+1] !== undefined && stack[i+1] !== null){
			i++
		}
		return stack[i]
	}

	function makeFunctionAvailableInLua(func){
		if(typeof func !== 'function'){
			throw new Error('passed variable is not a function!')
		}
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

  global.LUA_Emulator = {

  }

})(window, jQuery)