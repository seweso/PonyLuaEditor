((global, $)=>{
  "use strict";

    let intervalTick
    let timeBetweenTicks = 200

    let intervalDraw
    let timeBetweenDraws = 1000

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

        editor.on('change', ()=>{
            refreshCharacterCount()
        })

        editor.selection.on('changeCursor', ()=>{
            refreshPositionHint()
        })

	  	INPUT.init($('#input'))
	  	OUTPUT.init($('#output'))
	  	PROPERTY.init($('#property'))
	  	setTimeout(()=>{
    		$('#zoomfactor').trigger('change')
            refreshCharacterCount()
	  	}, 200)
    }

    function start(){
      $('#start').prop('disabled', true)
      $('#code-container').addClass('locked')
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
            $('#code-container').removeClass('locked')
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

    function refreshCharacterCount(){
        let chars = countCharacters(editor.getValue())
        $('#charactercount').html(chars + '/4096')
        if(chars >= 4096){
            $('#charactercount').addClass('limit')
        } else {
            $('#charactercount').removeClass('limit')
        }
    }

    function refreshPositionHint(){
        let pos = editor.getCursorPosition()
        let chars = editor.session.doc.positionToIndex(pos)
        $('#selection-information').html('Line ' + (pos.row + 1) + ', Column ' + (pos.column + 1) + ', Char ' + chars)
    }

    // why ? because stormworks string length differs from javascripts string length (the one counts only /n and ignores /r, the other one coutns both)
    function countCharacters(str){
        return typeof str === 'string' ? str.length : 0
        /*let matches = str.match(/\n/g)
        return str.length + (matches ? matches.length : 0))*/
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