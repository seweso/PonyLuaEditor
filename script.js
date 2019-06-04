((global, $)=>{
  "use strict";

  $(global).on('load', init)

  $(global).on('stormworks_lua_api_loaded', ()=>{
  	
  	printSupportedFunctions(LUA_EMULATOR.supportedFunctions(), $('#functions'))

  	function printSupportedFunctions(supportedFunctions, container, prefix){
  		for(let k of Object.keys(supportedFunctions)){
	  		let sf = supportedFunctions[k]
	  		if(sf instanceof Object){
	  			let namespace = $('<div class="namespace"><span>' + (prefix ? prefix + '.' + k : k) + '</span></div>')
  				container.append(namespace)
  				printSupportedFunctions(sf, namespace, prefix ? prefix + '.' + k : k)
	  		} else {
	  			container.append('<div class="function">' + (prefix ? prefix + '.' + k : k) + '()</div>')
	  		}
	  	}
  	}
  })

  function init(){
  	$('#run').on('click', run)
  	$('#console').val('')
  }

  function run(){
  	$('#console').val('')
  	CANVAS.reset()
  	let code = editor.getValue()
  	try {
	  	let feng = fengari.load(code)
  		feng()
	  } catch (err){
	  	console.error(err)
	  	$('#console').val( $('#console').val() + err)
	  }
  }

})(window, jQuery)