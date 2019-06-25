var YYY = ((global, $)=>{
  "use strict";


    let intervalTick
    let timeBetweenTicks = 200

    let intervalDraw
    let timeBetweenDraws = 500

    let drawTimes = [0,0,0,0,0]

    const IDENTIFIERS_NOT_ALLOWED_TO_MINIFY = ['onTick', 'onDraw']

    const IDENTIFIERS_NOT_ALLOWED_TO_SHORTIFY = ['onTick', 'onDraw']

    let shortenedIdentifiers = []


    $(global).on('load', init)

    function init(){

        for(let k of Object.keys(AUTOCOMPLETE.getAllAutocompletitions().children)){
            IDENTIFIERS_NOT_ALLOWED_TO_MINIFY.push(k)
        }

        if(document.location.pathname.indexOf('beta') >= 0 || document.location.host === 'localhost'){
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
		  updateStorage()
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
         $('#minify').on('click', ()=>{
            try {
                let ast = luaparse.parse(editor.getValue())

                shortenedIdentifiers = []


                for(let g of ast.globals){
                    if(IDENTIFIERS_NOT_ALLOWED_TO_MINIFY.indexOf(g.name) === -1){
                        makeIdentifierLocal(g.name, ast)
                        removeFromAstGlobals(g.name, ast)
                    } else {
                        if (IDENTIFIERS_NOT_ALLOWED_TO_SHORTIFY.indexOf(g.name) === -1){
                            shortifyIdentifier(g.name, ast)
                        }
                    }
                }

                let minified = luamin.minify(ast).trim()
                let prefix = ''

                for(let s of shortenedIdentifiers){
                    let localStatement = minified.substring(0, Math.min(minified.indexOf(' '), minified.indexOf(';')) + 1)
                    let match = localStatement.match(/(local\s)?([\w]+)=([\w]+)(;|\s)/)
                    let short = match[2]
                    let shortenedGlobal = match[3]
                    prefix += short + '=' + shortenedGlobal + ';'
                    minified = minified.substring(localStatement.length)
                    minified = minified.replace(new RegExp('' + shortenedGlobal + 'tmp', 'g'), short)
                }

                let suffix = ''

                let shortenedMembers = luamin.getShortenedMembers()
                for(let sm of shortenedMembers){
                    if(sm.expression === sm.original){
                        continue
                    }
                    suffix += sm.base + '.' + sm.expression + '=' + sm.base + '.' + sm.original + ';'
                }

                minified = prefix + minified + ';' + suffix

                if($('#minify-identation').prop('checked')){
                    minified = minified
                        .replace(/;/g, '\n')
                        .replace(/\(\)/g, '()\n')
                        .replace(/end/g, '\nend')
                        .replace(/then/g, 'then\n')
                        .replace(/do/g, 'do\n')
                        .replace(/\)([\w]+)=/g, ')\n$1=')
                        .replace(/\)([\w\.]+)\(/g, ')\n$1(') 
                        .replace(/\}([\w\.]+[;\s=])/g, '}\n$1')
                }

                $('#minified-code-container').show()
                minifiedEditor.setValue(minified)
                $('#minified-charactercount').html(minified.length + '/4096')
                if(minified.length > 4096){
                    $('#minified-charactercount').addClass('limit')
                } else {
                    $('#minified-charactercount').removeClass('limit')
                }
            } catch (ex){
                console.log(ex)
                minifiedEditor.setValue('Error: ' + ex.message)
                $('#minified-charactercount').html('0/4096')
                $('#minified-charactercount').removeClass('limit')
            }
        })
        minifiedEditor.setValue('')
	  	$('#console').val('')
	  	let codeFromStorage = getCodeFromStorage()
	  	if(typeof codeFromStorage === 'string' && codeFromStorage.length > 0){
	  		editor.setValue(codeFromStorage)
	  	}

        $('#monitor-size, #show-overflow').on('change', (e)=>{
            updateStorage()
        })

        editor.on('change', ()=>{
            refreshCharacterCount()
        })

        editor.selection.on('changeCursor', ()=>{
            refreshPositionHint()
        })

        $('#timeBetweenTicks').on('input', ()=>{
            refreshTimeBetweenTicks()
            updateStorage()
        })

        $('#timeBetweenDraws').on('input', ()=>{
            refreshTimeBetweenDraws()
            updateStorage()
        })

        /* resizable ace code editors */
        $('#code').resizable().on('resize', ()=>{
            editor.resize()
        })

        $('#minified-code').resizable().on('resize', ()=>{
            minifiedEditor.resize()
        })

        setTimeout(()=>{
            refreshAll()
        }, 200)
    }

    function removeFromAstGlobals(identifier, ast){
        let newGlobals = []
        for(let g of ast.globals){
            if(g.name !== identifier){
                newGlobals.push(g)
            }
        }
        ast.globals = newGlobals
    }

    function makeIdentifierLocal(identifier, ast){
        if(ast.identifier && ast.identifier.name === identifier){
            ast.identifier.isLocal = true
            ast.isLocal = true
        }
        if(ast.name === identifier){
            ast.isLocal = true
        }
        if(ast.body instanceof Array){
            for(let e of ast.body){
                makeIdentifierLocal(identifier, e)
            }
        }
        if(ast.variables instanceof Array){
            for(let e of ast.variables){
                makeIdentifierLocal(identifier, e)
            }
        }
        if(ast.expression){
            if(ast.expression.base && ast.expression.base.base.name === identifier){
                ast.expression.base.base.isLocal = true
            }
            if(ast.expression.arguments instanceof Array){
                for(let e of ast.expression.arguments){
                    if(e.left){
                        makeIdentifierLocal(identifier, e.left)
                    }
                    if(e.right){
                        makeIdentifierLocal(identifier, e.right)
                    }
                }
            }
        }
        if (ast.init instanceof Array){
            for(let e of ast.init){
                makeIdentifierLocal(identifier, e)
            }
        }
        if(ast.base && ast.base.name === identifier){
            ast.base.isLocal = true
        }
        if(ast.base && ast.base.base){
            makeIdentifierLocal(identifier, ast.base)
        }

    }

    function replaceIdentifierName(identifier, ast, newIdentifier){
        if(ast.identifier && ast.identifier.name === identifier){
            if(newIdentifier){
                ast.identifier.name = newIdentifier
            }
        }
        if(ast.name === identifier){
            if(newIdentifier){
                ast.name = newIdentifier
            }
        }
        if(ast.body instanceof Array){
            for(let e of ast.body){
                replaceIdentifierName(identifier, e, newIdentifier)
            }
        }
        if(ast.variables instanceof Array){
            for(let e of ast.variables){
                replaceIdentifierName(identifier, e, newIdentifier)
            }
        }
        if(ast.expression){
            if(ast.expression.base){
                replaceIdentifierName(identifier, ast.expression.base, newIdentifier)
            }
            if(ast.expression.arguments instanceof Array){
                for(let e of ast.expression.arguments){
                    if(e.left){
                        replaceIdentifierName(identifier, e.left, newIdentifier)
                    }
                    if(e.right){
                        replaceIdentifierName(identifier, e.right, newIdentifier)
                    }
                }
            }
        }
        if (ast.init instanceof Array){
            for(let e of ast.init){
                replaceIdentifierName(identifier, e, newIdentifier)
            }
        }
        if(ast.base && ast.base.name === identifier && newIdentifier){
            ast.base.name = newIdentifier
        }
        if(ast.base && ast.base.base){
            replaceIdentifierName(identifier, ast.base, newIdentifier)
        }
    }

    function shortifyIdentifier(identifier, ast){
        if(shortenedIdentifiers.indexOf(identifier) >= 0){
            return
        }
        shortenedIdentifiers.push(identifier)
        //TODO
        /*
            e.g.
            local sc = screen
            
            screen.getWidth() => sc.getWidth()
        */

        replaceIdentifierName(identifier, ast, identifier+'tmp')
        makeIdentifierLocal(identifier+'tmp', ast)
        removeFromAstGlobals(identifier+'tmp', ast)

        ast.body.reverse()
        ast.body.push({
            type: 'LocalStatement',
            init: [{
                isLocal: false,
                name: identifier,
                type: 'Identifier'
            }],
            variables: [{
                isLocal: true,
                name: identifier+'tmp',
                type: 'Identifier'
            }]
        })
        ast.body.reverse()

    }

    function refreshAll(){
        INPUT.init($('#input'))
        OUTPUT.init($('#output'))
        PROPERTY.init($('#property'))

        let store = getStorage()
        if(store && isNaN(parseInt(store.timeBetweenTicks)) === false){
            $('#timeBetweenTicks').val(parseInt(store.timeBetweenTicks))
        }
        if(store && isNaN(parseInt(store.timeBetweenDraws)) === false){
            $('#timeBetweenDraws').val(parseInt(store.timeBetweenDraws))
        }
        if(store && isNaN(parseInt(store.zoomfactor)) === false){
            $('#zoomfactor').val(parseInt(store.zoomfactor))
        }
        $('#zoomfactor').trigger('change')
        if(store && typeof store.monitorSize === 'string'){
            $('#monitor-size').find('option[selected]').prop('selected', false)
            $('#monitor-size').find('option[value="'+store.monitorSize+'"]').prop('selected', true)
        }
        if(store && typeof store.showOverflow === 'boolean'){
            $('#show-overflow').prop('checked', store.showOverflow)
        }
	setStorage(store)
        CANVAS.refresh()

        refreshCharacterCount()

        refreshTimeBetweenTicks()
        refreshTimeBetweenDraws()   
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
        $('#minified-code-container').hide()
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

    function updateStorage(){
        var toStore = {
            timeBetweenTicks: parseInt($('#timeBetweenTicks').val()),
            timeBetweenDraws: parseInt($('#timeBetweenDraws').val()),
            zoomfactor: parseInt($('#zoomfactor').val()),
            monitorSize: $('#monitor-size').val(),
            showOverflow: $('#show-overflow').prop('checked')
        }
        setStorage(toStore)
    }

    function saveCodeInStorage(){
  		localStorage.setItem('code', editor.getValue());
    }

    function getCodeFromStorage(){
  		return localStorage.getItem('code');
    }

    function setStorage(data){
        localStorage.setItem('general', JSON.stringify(data));
    }

    function getStorage(){
        try {
            let parse = JSON.parse( localStorage.getItem('general') )
            return parse
        } catch (e){
            return null
        }
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

    function countCharacters(str){
        return typeof str === 'string' ? str.length : 0
    }

    function isMinificationAllowed(keyword){
        return IDENTIFIERS_NOT_ALLOWED_TO_MINIFY.indexOf(keyword) === -1
    }

    return {
        errorStop: errorStop,
        setStorage: setStorage,
        getStorage: getStorage,
        refreshAll: refreshAll,
        isMinificationAllowed: isMinificationAllowed
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
