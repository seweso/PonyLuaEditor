var YYY = ((global, $)=>{
  "use strict";


    let intervalTick
    let timeBetweenTicks = 200

    let intervalDraw
    let timeBetweenDraws = 500

    let drawTimes = [0,0,0,0,0]

    $(global).on('load', init)

    function init(){

        if(document.location.pathname.indexOf('beta') || document.location.host === 'localhost'){
            $('#beta').show()
        }

        let autocompletitions = AUTOCOMPLETE.getAllAUTOCOMPLETITIONSParsed()
        for(let name of Object.keys(autocompletitions.children)){
            let child = autocompletitions.children[name]
            printNode($('#documentation'), child, name)
        }

        function printNode(container, node, name){
            let me = $('<div class="node" ntype="' + node.type + '" isdev="' + (node.is_dev ? 'true' : 'false') + '" isstormworks="' + (node.is_stormworks ? 'true' : 'false') + '"><div class="information"><div class="name">' + name + '</div><div class="args">' + (node.args || '') + '</div>' + (node.is_dev ? '<div class="is_dev">Dev API</div>' : '') + (node.is_stormworks ? '<div class="is_stormworks">Stormworks API</div>' : '') + (node.url ? '<div class="url">' + node.url + '</div>' : '') + '<div class="text">' + node.description + '</div></div></div>')
            container.append(me)
            if(node.children){
                let childcontainer = $('<div class="children"></div>')
                me.append(childcontainer)
                for(let name of Object.keys(node.children)){
                    let child = node.children[name]
                    printNode(childcontainer, child, '.' + name)
                }
            }
        }

        global.noExitConfirm = false

    	$('#zoomfactor').on('change', ()=>{
    		let val = $('#zoomfactor').val()
    		CANVAS.setZoomFactor(val)
    		PAINT.setZoomFactor(val)
    		MAP.setZoomFactor(val)
    		$('.zoomfactor span').html(val+'x')
    	})
	  	$('#start').on('click', start)
        $('#stop').prop('disabled', true).on('click', stop)
        $('#reset').on('click', ()=>{
            if(confirm('Are you sure? This will also remove the code in the editor!')){
                localStorage.clear()
                global.noExitConfirm = true
                document.location = document.location.href.split('?')[0]
            }
        })
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

        $('#timeBetweenTicks').on('input', ()=>{
            refreshTimeBetweenTicks()
        })

        $('#timeBetweenDraws').on('input', ()=>{
            refreshTimeBetweenDraws()
        })

	  	INPUT.init($('#input'))
	  	OUTPUT.init($('#output'))
	  	PROPERTY.init($('#property'))
	  	setTimeout(()=>{
    		$('#zoomfactor').trigger('change')
            refreshCharacterCount()

            refreshTimeBetweenTicks()
            refreshTimeBetweenDraws()
	  	}, 200)
    }

    function refreshTimeBetweenTicks(){        
        let val = $('#timeBetweenTicks').val()
        timeBetweenTicks = val
        $('#timeBetweenTicksVal').html(val + ' ms')
    }

    function refreshTimeBetweenDraws(){        
        let val = $('#timeBetweenDraws').val()
        timeBetweenDraws = val
        $('#timeBetweenDrawsVal').html(val + ' ms')
    }

    function start(){
        $('#start, #timeBetweenTicks, #timeBetweenDraws').prop('disabled', true)
        $('#code-container').addClass('locked')
	  	saveCodeInStorage()
	  	$('#console').val('')
	  	CANVAS.reset()
        MAP.reset()
        let code = editor.getValue()
        console.log('running code...')
	  	try {
		  	let feng = fengari.load(code)
	  		feng()
	    } catch (err){
            if(err instanceof SyntaxError){
                err = err.message
            }
		  	LUA_EMULATOR.bluescreenError(fengari.L, 'error', err)
	    }
        OUTPUT.reset()

        intervalTick = setInterval(doTick, timeBetweenTicks)
        intervalDraw = setInterval(doDraw, timeBetweenDraws)
        $('#stop').prop('disabled', false)
    }

    function stop(){
        $('#stop').prop('disabled', true)
        clearInterval(intervalTick)
        clearInterval(intervalDraw)

        LUA_EMULATOR.reset().then(()=>{
            $('#start, #timeBetweenTicks, #timeBetweenDraws').prop('disabled', false)
            $('#code-container').removeClass('locked')
        })

    }

    function errorStop(){
        console.log('\nerror stop!!!\n')
        clearInterval(intervalTick)
        clearInterval(intervalDraw)
        setTimeout(()=>{
            stop()
        }, 500)
    }

    function doTick(){
        LUA_EMULATOR.tick()
        $(global).trigger('lua_tick')
        OUTPUT.refresh()
    }

    function doDraw(){
        let begin = new Date().getTime()
        CANVAS.reset()
        LUA_EMULATOR.draw()
        let end = new Date().getTime()
        let diff = end-begin        
        drawTimes.reverse()
        drawTimes.pop()
        drawTimes.reverse()
        drawTimes.push(diff)
        let average = 0
        for(let t of drawTimes){
            average += t
        }
        
        $('#drawtime').html(Math.floor(average/drawTimes.length) + ' ms')
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

    return {
        errorStop: errorStop
    }

})(window, jQuery)

window.onbeforeunload = function (e) {
    if(window.noExitConfirm){
        return
    }
    e = e || window.event;

    // For IE and Firefox prior to version 4
    if (e) {
        e.returnValue = 'Really want to leave?';
    }

    // For Safari
    return 'Really want to leave?';
};