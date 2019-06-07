((global, $)=>{
  "use strict";

    let intervalTick
    let timeBetweenTicks = 200

    let intervalDraw
    let timeBetweenDraws = 5000

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
		  			container.append('<div class="function">' + (prefix ? '.' + k : k) + '()</div>')
		  		}
		  	}
  		}
    })

    function init(){
    	$('#zoomfactor').on('change', ()=>{
    		let val = $('#zoomfactor').val()
    		CANVAS.setZoomFactor(val)
    		PAINT.setZoomFactor(val)
    		MAP.setZoomFactor(val)
    		$('.zoomfactor span').html(val+'x')
    	})
	  	$('#start').on('click', start)
      $('#stop').prop('disabled', true).on('click', stop)
	  	$('#console').val('')
	  	let codeFromStorage = getCodeFromStorage()
	  	if(typeof codeFromStorage === 'string' && codeFromStorage.length > 0){
	  		editor.setValue(codeFromStorage)	
	  	}

	  	INPUT.init($('#input'))
	  	OUTPUT.init($('#output'))
	  	PROPERTY.init($('#property'))
	  	setTimeout(()=>{
    		$('#zoomfactor').trigger('change')
	  	}, 200)
    }

    function start(){
      $('#start').prop('disabled', true)
	  	saveCodeInStorage()
	  	$('#console').val('')
	  	CANVAS.reset()
      MAP.reset()
      let code = editor.getValue()
	  	try {
		  	let feng = fengari.load(code)
	  		feng()
	    } catch (err){
		  	console.error(err)
		  	$('#console').val( $('#console').val() + err)
	    }
    	OUTPUT.refresh()

      intervalTick = setInterval(doTick, timeBetweenTicks)
      intervalDraw = setInterval(doDraw, timeBetweenDraws)
      $('#stop').prop('disabled', false)
    }

    function stop(){
      $('#stop').prop('disabled', true)
      clearInterval(intervalTick)
      clearInterval(intervalDraw)

      LUA_EMULATOR.reset().then(()=>{
        $('#start').prop('disabled', false)
      })

    }

    function doTick(){
        if(typeof LUA_EMULATOR.getGlobalVariable('onTick') === 'function'){
          LUA_EMULATOR.callLuaFunction('onTick')
        }
    }

    function doDraw(){
        CANVAS.reset()
        if(typeof LUA_EMULATOR.getGlobalVariable('onDraw') === 'function'){
          LUA_EMULATOR.callLuaFunction('onDraw')
        }
    }

    function saveCodeInStorage(){
  		localStorage.setItem('code', editor.getValue());
    }

    function getCodeFromStorage(){
  		return localStorage.getItem('code');
    }

})(window, jQuery)

window.onbeforeunload = function (e) {
    e = e || window.event;

    // For IE and Firefox prior to version 4
    if (e) {
        e.returnValue = 'Really want to leave?';
    }

    // For Safari
    return 'Really want to leave?';
};