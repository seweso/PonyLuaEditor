var YYY = ((global, $)=>{
  "use strict";


    let intervalTick
    let timeBetweenTicks = 16

    let intervalDraw
    let timeBetweenDraws = 16

    let tickTimes = [0,0,0,0,0]
    let drawTimes = [0,0,0,0,0]

    const IDENTIFIERS_NOT_ALLOWED_TO_MINIFY = ['onTick', 'onDraw']

    const IDENTIFIERS_NOT_ALLOWED_TO_SHORTIFY = ['onTick', 'onDraw']

    let shortenedIdentifiers = []

    let running = false

    let isCustomMinifiedCode = false


    $(global).on('load', init)

    function init(){

        let scrollTop = parseInt(localStorage.getItem('scroll'))
        if(!isNaN(scrollTop)){
            setTimeout(()=>{
                $('html, body').scrollTop(scrollTop)
            }, 300)            
        }        

        for(let k of Object.keys(AUTOCOMPLETE.getAllAutocompletitions().children)){
            IDENTIFIERS_NOT_ALLOWED_TO_MINIFY.push(k)
        }

        if(document.location.pathname.indexOf('beta') >= 0 || document.location.host === 'localhost'){
            $('#beta').show()
        }

        if(!document.location.host || !document.location.href || document.location.href.indexOf('file') === 0){
            $('#offline').show()
            $('#download-offline').hide()
            $('#share').parent().hide()
        }


        $('#download-offline').on('click', ()=>{
            message('How to use the offline version:', '<ul><li>extract the zip folder</li><li>doubleclick "index.html"</li><li>This opens the offline version with your default browser</li><ul>')
        })

        let autocompletitions = AUTOCOMPLETE.getAllAUTOCOMPLETITIONSParsed()
        for(let name of Object.keys(autocompletitions.children)){
            let child = autocompletitions.children[name]
            printNode($('#documentation'), child, name)
        }

        function printNode(container, node, name){
            let me = $('<div class="node" ntype="' + node.type + '" ' + (node.lib ? 'lib="' + node.lib + '"' : '') + '><div class="information"><div class="name">' + name + '</div><div class="args">' + (node.args || '') + '</div>' + (node.lib ? '<div class="lib_title">' + AUTOCOMPLETE.LIB_TITLES[node.lib] + '</div>' : '') + (node.url ? '<div class="url">' + node.url + '</div>' : '') + '<div class="text">' + node.description + '</div></div></div>')
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
        $('#start-minified').on('click', startMinified)
        $('#start-generated').on('click', startGenerated)
        $('#stop').prop('disabled', true).on('click', stop)
        $('#reset').on('click', ()=>{
            confirm('Are you sure? This will also remove the code in the editor!').then((result)=>{
                if(result === true){
                    localStorage.clear()
                    global.noExitConfirm = true
                    document.location = document.location.href.split('?')[0]
                }
            }).catch(()=>{
                /* do nothing */
            })
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


                let identifierMap = luamin.getIdentifierMap()
                console.log('Mappings:')
                for(let k in identifierMap){
                    console.log(k, '=>', identifierMap[k])
                }

                let offset = 0
                while(offset < minified.length) {
                    let localStatement = minified.substring(offset, Math.min(minified.indexOf(' ', offset), minified.indexOf(';', offset)) + 1)
                    let match = localStatement.match(/(local\s)?([\w]+)=([\w]+)(;|\s)/)
                    if(match){
                        let short = match[2]
                        let shortenedGlobal = match[3]

                        for(let s of shortenedIdentifiers){
                            if(identifierMap[s] === shortenedGlobal){
                                minified = minified.replace(localStatement, localStatement.replace(shortenedGlobal, s))
                                break
                            }
                        }
                    }
                    if(localStatement.length === 0){
                        break
                    }

                    offset += localStatement.length
                }

                let suffix = ''

                let shortenedMembers = luamin.getShortenedMembers()
                for(let sm of shortenedMembers){
                    if(sm.expression === sm.original){
                        continue
                    }
                    suffix += sm.base + '.' + sm.expression + '=' + sm.base + '.' + sm.original + ';'
                }

                minified = minified + ';' + suffix

                if($('#minify-identation').prop('checked')){
                    let split = minified.split('"')
                    let identedMinified = ''
                    let i = 0
                    let inText= false
                    while (i < minified.length){
                        let indexOf = minified.indexOf('"', i)
                        if(indexOf < 0){                            
                            identedMinified += '\n' + ident(minified.substring(i))
                            break
                        } else {//found a ""
                            if(inText){
                                let tmp = '"' + minified.substring(i, indexOf)
                                identedMinified += tmp
                            } else {
                                identedMinified += '\n' + ident(minified.substring(i, indexOf))
                            }
                            let char = minified.charAt(indexOf-1)
                            if(char !== '\\'){// check for \"
                                if(inText){
                                    identedMinified += '"'
                                }
                                inText = !inText
                            }

                            i = indexOf + 1
                        }
                    }
                    minified = identedMinified

                    function ident(text){
                        const replacements = [
                            [/;/g, '\n'],
                            [/\(\)/g, '()\n'],
                            [/([\w\.]+)=([\w\.]+)[;\s]/g, '$1=$2\n'],
                            [/\)([\w]+)=/g, ')\n$1='],
                            [/\)([\w\.]+)\(/g, ')\n$1('],
                            [/\}([\w\.]+[;\s=])/g, '}\n$1']
                        ]

                        for(let k of ['if', 'end', 'elseif', 'for', 'while', 'goto', 'break', 'continue', 'return', 'function', 'local']){
                            replacements.push([new RegExp('([\\s\\);])'+k+'([\\s\\(;])', 'g'), '$1\n' + k + '$2'])
                        }
                        for(let k of ['then', 'end', 'do']){
                            replacements.push([new RegExp(k+'([\\s;])', 'g'), k + '\n'])
                        }


                        let ret = text

                        for(let r of replacements){
                            ret = ret.replace(r[0], r[1])
                        }

                        return ret.replace(/[\n]{2,}/g, '\n').replace(/end\nfunction/g, 'end\n\nfunction')
                    }
                }

                $('#minified-editor').show()
                minifiedEditor.setValue(minified)
                refreshMinifiedEditorCharacterCount()
                $('#minified-code-container .custom_hint').hide()
                isCustomMinifiedCode = false

                removeMinifiedCodeFromStorage()
            } catch (ex){
                console.log(ex)
                $('#minified-editor').show()
                minifiedEditor.setValue('Error: ' + ex.message)
                refreshMinifiedEditorCharacterCount()
            }
        })
        $('#console').val('')
	  	let codeFromStorage = getCodeFromStorage()
	  	if(typeof codeFromStorage === 'string' && codeFromStorage.length > 0){
	  		editor.setValue(codeFromStorage)
	  	}

        let minifiedCodeFromStorage = getMinifiedCodeFromStorage()
        if(typeof minifiedCodeFromStorage === 'string' && minifiedCodeFromStorage.length > 0){
            minifiedEditor.setValue(minifiedCodeFromStorage)
            $('#minified-editor').show()
            $('#minified-code-container .custom_hint').show()
            isCustomMinifiedCode = true
        }

        $('#monitor-size, #show-overflow').on('change', (e)=>{
            updateStorage()
        })

        editor.on('change', ()=>{
            refreshEditorCharacterCount()
        })

        minifiedEditor.on('change', ()=>{
            refreshMinifiedEditorCharacterCount()
            $('#minified-code-container .custom_hint').show()
            isCustomMinifiedCode = true
        })

        editor.selection.on('changeCursor', ()=>{
            refreshPositionHint()
        })


        minifiedEditor.selection.on('changeCursor', ()=>{
            refreshMinifiedPositionHint()
        })

        $('#timeBetweenTicks').on('input', ()=>{
            refreshTimeBetweenTicks()
            updateStorage()
        })

        $('#timeBetweenDraws').on('input', ()=>{
            refreshTimeBetweenDraws()
            updateStorage()
        })

        $('#save').on('click', ()=>{
            saveCodeInStorage()
        })

        let controlKeyDown = false
        $(window).on('keydown', (evt)=>{
            if(evt.originalEvent.keyCode === 17 || evt.originalEvent.keyCode === 15){
                controlKeyDown = true
            } else if(controlKeyDown && evt.originalEvent.key === 's'){
                evt.preventDefault()
                evt.stopPropagation()

                saveCode()
            }
        })        
        $(window).on('keyup', (evt)=>{
            if(evt.originalEvent.keyCode === 17 || evt.originalEvent.keyCode === 15){
                controlKeyDown = false
            }
        })

        $('#save-minified').on('click', ()=>{
            saveMinifiedCodeInStorage()
        })

        /* resizable ace code editors */
        $('#code').resizable().on('resize', ()=>{
            editor.resize()
        })

        $('#minified-code').resizable().on('resize', ()=>{
            minifiedEditor.resize()
        })

        $('#ui-builder-code').resizable().on('resize', ()=>{
            uiBuilderEditor.resize()
        })

        /* help badge */
        let firstHelpOpen = true
        let scrollPosition = 0
        $('#help-badge, #help-menu-entry').on('click', ()=>{
            if(firstHelpOpen){
                firstHelpOpen = false
                $('#help-youtube-video').html('<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/hHgnNmwmZCY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>')
            }
            scrollPosition = $(window).scrollTop()
            $('body').css({
                'max-height': '100vh',
                'overflow-y': 'hidden'
            })
            $('#help').fadeIn()
            resizeYoutubeIframe()
        })
        $(window).on('resize', ()=>{
            resizeYoutubeIframe()
        })

        function resizeYoutubeIframe(){            
            $('#help-youtube-video iframe').css({
                width: $('#help-youtube-video').width(),
                height: $('#help-youtube-video').width() / (16/9)
            })
        }


        $('#help-close').on('click', closeHelp)
        $('#help').on('click', (evt)=>{
            closeHelp()
        })
        $('#help-content').on('click', (evt)=>{
            evt.stopPropagation()
        })

        function closeHelp(){
            $('body').css({
                'max-height': '',
                'overflow-y': ''
            })
            $(window).scrollTop(scrollPosition)
            $('#help').fadeOut()            
        }


        /* mobile menu */
        $('#mobile-menu-open').on('click', ()=>{
            $('#mobile-menu').css('display', 'flex')
        })
        $('#mobile-menu .menu_group > :not(.menu_group_title), #mobile-menu-close-sidebar').on('click', ()=>{
            $('#mobile-menu').hide()
        })

        setTimeout(()=>{
            refreshAll()
        }, 200)
    }

    function message(title, text){
        return new Promise((fulfill, reject)=>{
            $('#message .title').html(title)
            $('#message .message').html(text)
            $('#message').show()
            $('#message .ok').on('click', ()=>{
                $('#message .ok').off('click')
                $('#message').hide()
                fulfill(true)
            })
        })
    }

     function confirm(text){
        return new Promise((fulfill, reject)=>{
            $('#confirm .message').html(text)
            $('#confirm').show()
            $('#confirm .yes').on('click', ()=>{
                $('#confirm .yes, #confirm .no').off('click')
                $('#confirm').hide()
                fulfill(true)
            })
            $('#confirm .no').on('click', ()=>{
                $('#confirm .yes, #confirm .no').off('click')
                $('#confirm').hide()
                fulfill(false)
            })
        })
    }    

    function alert(text){
        return new Promise((fulfill, reject)=>{
            $('#alert .message').html(text)
            $('#alert').show()
            $('#alert .ok').on('click', ()=>{
                $('#alert .ok').off('click')
                $('#alert').hide()
                fulfill(true)
            })
        })
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
        if(ast.variable && ast.variable.name === identifier){
            ast.variable.isLocal = true
        }
        if(ast.arguments instanceof Array){
            for(let a of ast.arguments){
                makeIdentifierLocal(identifier, a)
            }
        }
        if(ast.expression){
            if(ast.expression.base && ast.expression.base.base && ast.expression.base.base.name === identifier){
                ast.expression.base.base.isLocal = true
            }
            if(ast.expression.arguments instanceof Array){
                for(let e of ast.expression.arguments){
                    makeIdentifierLocal(identifier, e)
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
        if(ast.end){
            makeIdentifierLocal(identifier, ast.end)
        }
        if(ast.start){
            makeIdentifierLocal(identifier, ast.start)
        }
        if(ast.step){
            makeIdentifierLocal(identifier, ast.step)
        }
        if(ast.left){
            makeIdentifierLocal(identifier, ast.left)
        }
        if(ast.right){
            makeIdentifierLocal(identifier, ast.right)
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
        if(ast.variable && ast.variable.name === identifier){
            ast.variable.name = newIdentifier
        }
        if(ast.arguments instanceof Array){
            for(let a of ast.arguments){
                replaceIdentifierName(identifier, a, newIdentifier)
            }
        }
        if(ast.expression){
            if(ast.expression.base){
                replaceIdentifierName(identifier, ast.expression.base, newIdentifier)
            }
            if(ast.expression.arguments instanceof Array){
                for(let e of ast.expression.arguments){
                    replaceIdentifierName(identifier, e, newIdentifier)
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
        if(ast.end){
            replaceIdentifierName(identifier, ast.end, newIdentifier)
        }
        if(ast.start){
            replaceIdentifierName(identifier, ast.start, newIdentifier)
        }
        if(ast.step){
            replaceIdentifierName(identifier, ast.step, newIdentifier)
        }
        if(ast.left){
            replaceIdentifierName(identifier, ast.left, newIdentifier)
        }
        if(ast.right){
            replaceIdentifierName(identifier, ast.right, newIdentifier)
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

        refreshEditorCharacterCount()

        refreshTimeBetweenTicks()
        refreshTimeBetweenDraws()   
    }

    function refreshTimeBetweenTicks(){
        let val = $('#timeBetweenTicks').val()
        timeBetweenTicks = val
        $('#timeBetweenTicksVal').html(Math.round(1000/val*0.96))
    }

    function refreshTimeBetweenDraws(){
        let val = $('#timeBetweenDraws').val()
        timeBetweenDraws = val
        $('#timeBetweenDrawsVal').html(Math.round(1000/val*0.96))
    }

    function start(){
        $('#code-container, #minified-code-container').addClass('locked')
        saveCode()

        let code = editor.getValue()

        startCode(code)

        setTimeout(()=>{
            $('#start').blur()
            $('#start-minified').blur()
        }, 100)
    }

    function startMinified(){
        $('#code-container, #minified-code-container').addClass('locked')
        saveCode()

        let code = minifiedEditor.getValue()

        startCode(code)

        setTimeout(()=>{
            $('#start').blur()
            $('#start-minified').blur()
        }, 100)

        $('html, body').animate({
            scrollTop: $("#monitor").offset().top
        }, 200);
    }

    function startGenerated(){
        $('#code-container, #minified-code-container').addClass('locked')

        let code = uiBuilderEditor.getValue()

        startCode(code)

        setTimeout(()=>{
            $('#start').blur()
            $('#start-minified').blur()
            $('#start-generated').blur()
        }, 100)

        $('html, body').animate({
            scrollTop: $("#monitor").offset().top
        }, 200);
    }

    function startCode(code){
        running = true
        $('#start, #start-minified, #timeBetweenTicks, #timeBetweenDraws').prop('disabled', true)
        $('#console').val('')
        CANVAS.reset()
        CANVAS.resetTouchpoints()
        MAP.reset()
        console.log('running code...')
        try {
            let feng = fengari.load(code, null, LUA_EMULATOR.l())
            feng()
        } catch (err){
            if(err.message){
                err = err.message
            }
            LUA_EMULATOR.bluescreenError(LUA_EMULATOR.l(), 'error', err)
        }
        OUTPUT.reset()

        intervalTick = setInterval(doTick, timeBetweenTicks)
        setTimeout(()=>{
            intervalDraw = setInterval(doDraw, timeBetweenDraws)            
        }, timeBetweenTicks * 1.1)
        $('#stop').prop('disabled', false)
    }

    function stop(){
        $('#stop').prop('disabled', true)
        clearInterval(intervalTick)
        clearInterval(intervalDraw)

        LUA_EMULATOR.reset().then(()=>{
            $('#start, #start-minified, #start-generated, #timeBetweenTicks, #timeBetweenDraws').prop('disabled', false)
            $('#code-container, #minified-code-container').removeClass('locked')
        })

        running = false
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
        let begin = new Date().getTime()

        LUA_EMULATOR.tick()
        $(global).trigger('lua_tick')
        OUTPUT.refresh()

        let end = new Date().getTime()
        let diff = end-begin
        if(diff > 1000 || diff > timeBetweenTicks){
            $('#ticktime').addClass('warning')
        } else {
            $('#ticktime').removeClass('warning')
        }
        if(diff > 1000){
            LUA_EMULATOR.printToConsole('onTick() execution was longer then 1000ms!')
        }
        tickTimes.reverse()
        tickTimes.pop()
        tickTimes.reverse()
        tickTimes.push(diff)
        let average = 0
        for(let t of tickTimes){
            average += t
        }

        $('#ticktime').html( Math.round(Math.min(1000/timeBetweenTicks*0.96, 1000/(average/tickTimes.length))))
    }

    function doDraw(){
        let begin = new Date().getTime()

        CANVAS.reset()
        LUA_EMULATOR.draw()

        let end = new Date().getTime()
        let diff = end-begin
        if(diff > 1000 || diff > timeBetweenDraws){
            $('#drawtime').addClass('warning')
        } else {
            $('#drawtime').removeClass('warning')
        }
        if(diff > 1000){
            LUA_EMULATOR.printToConsole('onDraw() execution was longer then 1000ms!')
        }
        drawTimes.reverse()
        drawTimes.pop()
        drawTimes.reverse()
        drawTimes.push(diff)
        let average = 0
        for(let t of drawTimes){
            average += t
        }

        $('#drawtime').html( Math.round(Math.min(1000/timeBetweenDraws*0.96, 1000/(average/drawTimes.length))))
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

    function saveCode(){
        saveCodeInStorage()
        saveMinifiedCodeInStorage()
    }

    function saveCodeInStorage(){
        $('#save').addClass('saved')
        setTimeout(()=>{
            $('#save').removeClass('saved')
        }, 1000)
  		localStorage.setItem('code', editor.getValue());
    }

    function saveMinifiedCodeInStorage(){
        $('#save-minified').addClass('saved')
        setTimeout(()=>{
            $('#save-minified').removeClass('saved')
        }, 1000)
        localStorage.setItem('minified-code', minifiedEditor.getValue());
    }

    function removeMinifiedCodeFromStorage(){
        localStorage.removeItem('minified-code')
    }

    function getCodeFromStorage(){
  		return localStorage.getItem('code');
    }

    function getMinifiedCodeFromStorage(){
        return localStorage.getItem('minified-code');
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

    function refreshEditorCharacterCount(){
        let chars = countCharacters(editor.getValue())
        $('#charactercount').html(chars + '/4096')
        if(chars >= 4096){
            $('#charactercount').addClass('limit')
        } else {
            $('#charactercount').removeClass('limit')
        }
    }
    
    function refreshMinifiedEditorCharacterCount(){
        let chars = countCharacters(minifiedEditor.getValue())
        $('#minified-charactercount').html(chars + '/4096')
        if(chars >= 4096){
            $('#minified-charactercount').addClass('limit')
        } else {
            $('#minified-charactercount').removeClass('limit')
        }
    }

    function refreshPositionHint(){
        let pos = editor.getCursorPosition()
        let chars = editor.session.doc.positionToIndex(pos)
        $('#selection-information').html('Line ' + (pos.row + 1) + ', Column ' + (pos.column + 1) + ', Char ' + chars)
    }

    function refreshMinifiedPositionHint(){
        let pos = minifiedEditor.getCursorPosition()
        let chars = minifiedEditor.session.doc.positionToIndex(pos)
        $('#minified-selection-information').html('Line ' + (pos.row + 1) + ', Column ' + (pos.column + 1) + ', Char ' + chars)
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
        isMinificationAllowed: isMinificationAllowed,
        isRunning: ()=>{
            return running
        },
        isCustomMinifiedCode: ()=>{
            return isCustomMinifiedCode
        },
        message: message,
        confirm: confirm,
        alert: alert
    }

})(window, jQuery)

window.onbeforeunload = function (e) {
    const scrollTop = $(window).scrollTop()
    console.log('saved scrollTop', scrollTop)
    localStorage.setItem('scroll', scrollTop)
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
