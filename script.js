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
	  	$('#run').on('click', run)
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

    function run(){
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