var YYY = ((global, $)=>{
  "use strict";


    let intervalTick
    let timeBetweenTicks = 16

    let intervalDraw
    let timeBetweenDraws = 16

    let drawAnimationFrame = false

    let tickTimes = [0,0,0,0,0]
    let drawTimes = [0,0,0,0,0]

    const IDENTIFIERS_NOT_ALLOWED_TO_MINIFY = ['onTick', 'onDraw']

    const LIBRARY_IDENTIFIERS = []

    const MINIFY_MAPPING_SEPERATOR = '--yyy--'

    let shortenedIdentifiers = []

    let running = false
    let paused = false
    let isDoingStep = false

    let isCustomMinifiedCode = false

    let lastScrollPos = 0

    let totalStartsInTheSession = 0

    $(global).on('load', init)

    const REPORT_TYPE_IDS = {
        'startEmulator': 3,
        'downloadOffline': 4,
        'openHelp': 5,
        'minify': 6,
        'unminify': 7,
        'openAutocomplete': 8,
        'openLearnAndExamples': 9,
        'shareCode': 10,
        'receiveShareCode': 11,
        'generateUIBuilderCode': 12
    }

    const DEFAULT_EDITOR_FONTSIZE = 12

    function init(){

        let scrollTop = parseInt(localStorage.getItem('scroll'))
        if(!isNaN(scrollTop)){
            setTimeout(()=>{
                $('html, body').scrollTop(scrollTop)
            }, 300)            
        }        


        addChildrenToLibraryIdentifiers(AUTOCOMPLETE.getAllAutocompletitions())

        function addChildrenToLibraryIdentifiers(node){
            if(node.children){
                for(let k of Object.keys(node.children)){
                    LIBRARY_IDENTIFIERS.push(k)
                    addChildrenToLibraryIdentifiers(node.children[k])
                }
            }
        }

        if(document.location.pathname.indexOf('beta') >= 0 || document.location.host === 'localhost'){
            $('#beta').show()
        }

        if(!document.location.host || !document.location.href || document.location.href.indexOf('file') === 0){
            $('#offline').show()
            $('#download-offline').hide()
            $('#share').hide()
        }


        $('#download-offline').on('click', ()=>{
            report(REPORT_TYPE_IDS.downloadOffline)
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

        $('#pause').prop('disabled', true)
        $('#step').prop('disabled', true)

        $('#pause').on('click', ()=>{
            if(running){
                if(paused){
                    unpauseScript()
                } else {
                    pauseScript()
                }                
            }
        })

        $('#step').on('click', doStep)

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
            report(REPORT_TYPE_IDS.minify)

            try {

                let minified

                if($('#minify-type').val() === 'conservative-with-line-breaks' || $('#minify-type').val() === 'conservative-no-line-breaks'){
                    let ast = luaparse.parse(editor.getValue())

                    minified = luamin.minify(ast).trim()
                } else {

                    let ast = luaparse.parse(editor.getValue())

                    minified = luaminy.minify(ast).trim()


                    let pre = ''
                    let idMap = luaminy.getLastIdentifierMap()
                    for(let k of Object.keys(idMap)){
                        if(LIBRARY_IDENTIFIERS.indexOf(k) >= 0){
                            pre += idMap[k] + '=' + k + ';'
                        }
                    }


                    let libIdMap = luaminy.getLastLibIdentifierMap()
                    for(let k of Object.keys(libIdMap)){
                        for(let kk of Object.keys(libIdMap[k])){
                            pre += idMap[k] + '.' + libIdMap[k][kk] + '=' + idMap[k] + '.' + kk + ';'                    
                        }
                    }

                    minified = pre + '\n' + MINIFY_MAPPING_SEPERATOR + '\n' + minified



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
                }

                if($('#minify-type').val() === 'conservative-with-line-breaks' || $('#minify-type').val() === 'agressive-with-line-breaks'){
                    let split = minified.split('"')
                    let lineBreakMinified = ''
                    let i = 0
                    let inText= false
                    while (i < minified.length){
                        let indexOf = minified.indexOf('"', i)
                        if(indexOf < 0){                            
                            lineBreakMinified += '\n' + ident(minified.substring(i))
                            break
                        } else {//found a ""
                            if(inText){
                                let tmp = '"' + minified.substring(i, indexOf)
                                lineBreakMinified += tmp
                            } else {
                                lineBreakMinified += '\n' + ident(minified.substring(i, indexOf))
                            }
                            let char = minified.charAt(indexOf-1)
                            if(char !== '\\'){// check for \"
                                if(inText){
                                    lineBreakMinified += '"'
                                }
                                inText = !inText
                            }

                            i = indexOf + 1
                        }
                    }
                    minified = lineBreakMinified

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
                minifiedEditor.setValue(minified, -1)
                refreshMinifiedEditorCharacterCount()
                $('#minified-code-container .custom_hint').hide()
                isCustomMinifiedCode = false

                removeMinifiedCodeFromStorage()
            } catch (ex){
                console.trace(ex)
                $('#minified-editor').show()
                minifiedEditor.setValue('Error: ' + ex.message, -1)
                refreshMinifiedEditorCharacterCount()
            }
        })

        $('#minify-help').on('click', ()=>{
            message('Minify Help', 'You can use two different modes:<br><ul>'
                + '<li><strong>Conservative</strong><br>will only replace names of <i>local</i> declared variables and functions</li><br>'
                + '<li><strong>Agressive</strong><br>will replace almost every varable and function name.<br><span style="color: red;font-weight: bold">In rare cases, this produces errors, which you have to fix manually.</span></li>'
                + '</ul><br>Each of those modes supports output with or without line breaks.<br>Without line breaks you save a small amount of characters, but the code is very hard to read and debug')
        })

    
        $('#unminify').on('click', ()=>{
            report(REPORT_TYPE_IDS.unminify)

            let minified = minifiedEditor.getValue()

            if(typeof minified !== 'string' || minified.length == 0){
                fail('empty')
                return
            }

            let split = minified.split(MINIFY_MAPPING_SEPERATOR)
            let mapping = split[0]
            let code = split[1]

            let unminified = ''


            if(split.length < 2){
                mapping = ''
                code = split[0]
            }
            if(split.length > 2){
                fail('multiple "'+MINIFY_MAPPING_SEPERATOR+'" found')
                return
            }
            if(code == ''){
                fail('code not found')
                return
            }

            if(!mapping || mapping == ''){
                unminified += '-- warning: mapping not found --\n'
            }

            let mapAST = luaparse.parse(mapping)

            let idMap = {}
            let libIdMap = {}
            console.log(mapAST)

            for(let o of mapAST.body){
                let originalName
                if(o.init[0].type == "Identifier"){
                    originalName = o.init[0].name
                } else if(o.init[0].type == "MemberExpression"){
                    originalName = o.init[0].identifier.name
                }

                if(o.variables[0].type == "Identifier"){
                    idMap[o.variables[0].name] = originalName
                } else if(o.variables[0].type == "MemberExpression"){
                    if(!libIdMap[o.variables[0].base.name]){
                        libIdMap[o.variables[0].base.name] = {}
                    }
                    libIdMap[o.variables[0].base.name][o.variables[0].identifier.name] = originalName
                }
            }

            unminified += luamax.maxify(code, idMap, libIdMap)

            $('#unminified-editor').show()
            unminifiedEditor.setValue(unminified, -1)


            function fail(msg){
                $('#unminified-editor').show()
                unminifiedEditor.setValue('Unminification failed:\n' + msg, -1)
            }

        })

        $('#console-inner').html('')
	  	let codeFromStorage = getCodeFromStorage()
	  	if(typeof codeFromStorage === 'string' && codeFromStorage.length > 0){
	  		editor.setValue(codeFromStorage, -1)
	  	}

        let minifiedCodeFromStorage = getMinifiedCodeFromStorage()
        if(typeof minifiedCodeFromStorage === 'string' && minifiedCodeFromStorage.length > 0){
            minifiedEditor.setValue(minifiedCodeFromStorage, -1)
            $('#minified-editor').show()
            $('#minified-code-container .custom_hint').show()
            isCustomMinifiedCode = true
            refreshMinifiedEditorCharacterCount()
        }

        $('#monitor-size, #show-overflow, #enable-touchscreen, #enable-touchscreen-secondary').on('change', (e)=>{
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

        unminifiedEditor.on('change', ()=>{
            refreshUnminifiedEditorCharacterCount()
        })

        editor.selection.on('changeCursor', ()=>{
            refreshPositionHint()
        })


        minifiedEditor.selection.on('changeCursor', ()=>{
            refreshMinifiedPositionHint()
        })

        unminifiedEditor.selection.on('changeCursor', ()=>{
            refreshUnminifiedPositionHint()
        })

        $('#timeBetweenTicks').on('input', ()=>{
            refreshTimeBetweenTicks()
            updateStorage()
        })

        $('#timeBetweenTicks').on('change', ()=>{
            refreshTimeBetweenTicks(true)
            updateStorage()
        })

        $('#timeBetweenDraws').on('input', ()=>{
            refreshTimeBetweenDraws()
            updateStorage()
        })

        $('#timeBetweenDraws').on('change', ()=>{
            refreshTimeBetweenDraws(true)
            updateStorage()
        })

        $('#editor-layout').on('change', ()=>{
            let val = $('#editor-layout').val()
            switch(val){
                case 'properties_inputs_monitor_outputs': {
                    $('#input').insertBefore('#monitor-container')
                }; break;
                case 'properties_inputs_outputs_monitor': {
                    $('#input').insertBefore('#monitor-container')
                }; break;
                case 'inputs_next_to_editor':
                default: {
                    $('#input').prependTo('#editor-bottom-container')
                };
            }
            $('#top').attr('editor-layout', val)
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
            $('#minified-code-container .custom_hint').show()
        })

        /* resizable ace code editors */
        $('#code').resizable().on('resize', ()=>{
            editor.resize()
        })

        $('#console').resizable()

        $('#minified-code').resizable().on('resize', ()=>{
            minifiedEditor.resize()
        })

        $('#unminified-code').resizable().on('resize', ()=>{
            unminifiedEditor.resize()
        })

        $('#ui-builder-code').resizable().on('resize', ()=>{
            uiBuilderEditor.resize()
        })

        /* help badge */
        let firstHelpOpen = true
        let scrollPosition = 0
        $('#help-badge, #help-menu-entry').on('click', ()=>{
            report(REPORT_TYPE_IDS.openHelp)

            if(firstHelpOpen){
                firstHelpOpen = false
                $('#help-youtube-video').html('<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/Z8cLxmVd07c" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>')
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
            lastScrollPos = $(window).scrollTop()
            $('#mobile-menu').css('display', 'flex')
            $('.content').css({
                'margin-top': -lastScrollPos + $('#navigation').height(),
                'max-height': Math.max($(window).height(), lastScrollPos + $('#mobile-menu-inner').height()),
                'overflow': 'hidden'
            })
            $('#navigation').css({
                'position': 'absolute',
                'top': 0,
                'width': '100%'
            })
            $(window).scrollTop(0)            
        })
        $('#mobile-menu .menu_group > :not(.menu_group_title), #mobile-menu-close-sidebar').on('click', ()=>{
            $('#mobile-menu').hide()
            $('.content').css({
                'margin-top': '',
                'max-height': '',
                'overflow': ''
            })            
            $('#navigation').css({
                'position': '',
                'top': ''
            })
            $(window).scrollTop(lastScrollPos)
        })

        setTimeout(()=>{
            refreshAll()

            refreshEditorFontSize()
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

    function hint(title, text, options){
        let h = $('<div class="hint"><span class="close icon-cancel-circle"></span><h4>'+title+'<span class="extend icon-circle-down"></span></h4><div style="' + ((options && options.extended) ? '' : 'display: none') + '">'+(text+'').replace('\n', '<br>')+'</div></div>')
        if(options && options.extended){
            h.find('.extend').remove()
        } else {
            h.find('h4').on('click', ()=>{
                h.find('div').css('display', 'inline-block')
            })
        }
        h.find('.close').on('click', ()=>{
            h.remove()
        })
        $('#hints-container').append(h)
        if(!options || !options.nofadeout){
            setTimeout(()=>{
                //disappear after 10 seconds
                h.remove()
            }, 10000)
        }
    }

    function refreshAll(){

        let store = getStorage()
        if(store){
            if(isNaN(parseInt(store.timeBetweenTicks)) === false){
                $('#timeBetweenTicks').val(parseInt(store.timeBetweenTicks))
            }
            if(isNaN(parseInt(store.timeBetweenDraws)) === false){
                $('#timeBetweenDraws').val(parseInt(store.timeBetweenDraws))
            }
            if(isNaN(parseInt(store.zoomfactor)) === false){
                $('#zoomfactor').val(parseInt(store.zoomfactor))
            }
            $('#zoomfactor').trigger('change')
            if(typeof store.monitorSize === 'string'){
                $('#monitor-size').find('option[selected]').prop('selected', false)
                $('#monitor-size').find('option[value="'+store.monitorSize+'"]').prop('selected', true)
            }
            if(typeof store.showOverflow === 'boolean'){
                $('#show-overflow').prop('checked', store.showOverflow)
            }
            if(typeof store.touchScreenEnabled === 'boolean'){
                $('#enable-touchscreen').prop('checked', store.touchScreenEnabled)
            }
            if(typeof store.touchScreenEnabledSecondary === 'boolean'){
                $('#enable-touchscreen-secondary').prop('checked', store.touchScreenEnabledSecondary)
            } else {
                $('#enable-touchscreen-secondary').prop('checked', true)
            }
            if(typeof store.editorLayout === 'string'){
                $('#editor-layout').find('option[selected]').prop('selected', false)
                $('#editor-layout').find('option[value="'+store.editorLayout+'"]').prop('selected', true)
                $('#editor-layout').trigger('change')                
            }
        }



        INPUT.init($('#input'))
        OUTPUT.init($('#output'))
        PROPERTY.init($('#property'))

	    setStorage(store)
        CANVAS.refresh()

        refreshEditorCharacterCount()

        refreshTimeBetweenTicks()
        refreshTimeBetweenDraws()   
    }

    function refreshTimeBetweenTicks(is_change){
        let val = $('#timeBetweenTicks').val()
        timeBetweenTicks = val
        $('#timeBetweenTicksVal').html(Math.round(1000/val*0.96))
        if(running && is_change){
            clearDrawAndTickInterval()
            setDrawAndTickInterval()
        }
    }

    function refreshTimeBetweenDraws(is_change){
        let val = $('#timeBetweenDraws').val()
        timeBetweenDraws = val
        $('#timeBetweenDrawsVal').html(Math.round(1000/val*0.96))
        if(running && is_change){
            clearDrawAndTickInterval()
            setDrawAndTickInterval()
        }
    }

    function pauseScript(){
        paused = true
        LUA_EMULATOR.notifyPaused()

        $('#step').prop('disabled', false)
        $('#pause').html('Resume')
    }

    function unpauseScript(){
        LUA_EMULATOR.notifyUnPaused()
        
        $('#step').prop('disabled', true)
        $('#pause').html('Pause')
        
        /* make sure the button is updated before the next tick can happen */
        setTimeout(()=>{
            paused = false
        }, 10)
    }

    function doStep(){
        if(paused && !isDoingStep){
            LUA_EMULATOR.notifyStep()
            paused = false
            isDoingStep = true
            doTick()
            doDraw()
            isDoingStep = false
            paused = true
        }
    }

    function start(){
        lockUI()
        saveCode()

        let code = editor.getValue()

        startCode(code)

        setTimeout(()=>{
            $('#start, #start-minified, #start-generated').blur()
        }, 100)
    }

    function startMinified(){
        lockUI()
        saveCode()

        let code = minifiedEditor.getValue()

        startCode(code)

        setTimeout(()=>{
            $('#start, #start-minified, #start-generated').blur()
        }, 100)

        $('html, body').animate({
            scrollTop: $("#monitor").offset().top
        }, 200);
    }

    function startGenerated(){
        lockUI()

        let code = uiBuilderEditor.getValue()

        startCode(code)

        setTimeout(()=>{
            $('#start, #start-minified, #start-generated').blur()
        }, 100)

        $('html, body').animate({
            scrollTop: $("#monitor").offset().top
        }, 200);
    }

    function lockUI(){        
        $('#code-container, #minified-code-container, #ui-builder').addClass('locked')
    }

    function unlockUI(){
        $('#code-container, #minified-code-container, #ui-builder').removeClass('locked')
    }

    function startCode(code){
        report(REPORT_TYPE_IDS.startEmulator)

        totalStartsInTheSession++

        if(totalStartsInTheSession % 50 == 0){
            hint('Performace hint', 'After 50 starts you should reload the page to reset the emulator.\nPlease save ALL of your code (editor, minified and ui builder).\nThen reload the page.', {extended: true})
        }

        running = true

        $('#start, #start-minified, #start-generated').prop('disabled', true)

        $('#console-inner').html('')
        CANVAS.reset()
        CANVAS.resetTouchpoints()
        MAP.reset()
        PAINT._reset()
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

        setDrawAndTickInterval()
        $('#stop').prop('disabled', false)
        $('#pause').prop('disabled', false)
    }

    function stop(){
        $('#pause').prop('disabled', true).html('Pause')
        $('#step').prop('disabled', true)
        $('#stop').prop('disabled', true)
        clearDrawAndTickInterval()

        LUA_EMULATOR.reset().then(()=>{
            unlockUI()
            $('#start, #start-minified, #start-generated').prop('disabled', false)
        })

        running = false
        paused = false
    }

    function errorStop(){
        console.log('\nerror stop!!!\n')
        clearDrawAndTickInterval()
        setTimeout(()=>{
            stop()
        }, 500)
    }

    function setDrawAndTickInterval(){
        if(timeBetweenDraws < 20){
            drawAnimationFrame=true
            setTimeout(()=>{
                window.requestAnimationFrame(doDraw)            
            }, timeBetweenTicks * 1.1)     
        } else {
            setTimeout(()=>{
                intervalDraw = setInterval(doDraw, timeBetweenDraws)            
            }, timeBetweenTicks * 1.1)            
        }
        intervalTick = setInterval(doTick, timeBetweenTicks)
    }

    function clearDrawAndTickInterval(){ 
        drawAnimationFrame=false
        clearInterval(intervalTick)
        clearInterval(intervalDraw)
    }

    function doTick(){
        if(!running || paused){
            return
        }
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
        if(!running || paused){
            if(drawAnimationFrame){
                window.requestAnimationFrame(doDraw)
            }
            return
        }
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

        $('#drawtime').html( Math.round(Math.min(drawAnimationFrame? 60 : (1000/timeBetweenDraws*0.96), 1000/(average/drawTimes.length))))

        if(drawAnimationFrame){
            window.requestAnimationFrame(doDraw)
        }
    }

    function updateStorage(){
        var toStore = {
            timeBetweenTicks: parseInt($('#timeBetweenTicks').val()),
            timeBetweenDraws: parseInt($('#timeBetweenDraws').val()),
            zoomfactor: parseInt($('#zoomfactor').val()),
            monitorSize: $('#monitor-size').val(),
            showOverflow: $('#show-overflow').prop('checked'),
            touchScreenEnabled: $('#enable-touchscreen').prop('checked'),
            touchScreenEnabledSecondary: $('#enable-touchscreen-secondary').prop('checked'),
            editorLayout: $('#editor-layout').val()
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

    function loadEditorFontSize(){
        return localStorage.getItem('editor-font-size')
    }

    function saveEditorFontSize(fontsize){
        localStorage.setItem('editor-font-size', fontsize)
    }

    function increaseEditorFontSize(){
        let fontsize = parseInt(loadEditorFontSize())
        if(typeof fontsize !== 'number' || isNaN(fontsize) || fontsize === 0){
            fontsize = DEFAULT_EDITOR_FONTSIZE
        }
        fontsize = fontsize + Math.max(1, Math.floor(fontsize/10))
        setEditorFontSize(fontsize)
        saveEditorFontSize(fontsize)
    }

    function decreaseEditorFontSize(){
        let fontsize = parseInt(loadEditorFontSize())
        if(typeof fontsize !== 'number' || isNaN(fontsize) || fontsize === 0){
            fontsize = DEFAULT_EDITOR_FONTSIZE
        }
        fontsize = fontsize - Math.max(1,Math.floor(fontsize/10))
        setEditorFontSize(fontsize)
        saveEditorFontSize(fontsize)
    }

    function refreshEditorFontSize(){        
        let fontsize = parseInt(loadEditorFontSize())
        if(typeof fontsize !== 'number' || isNaN(fontsize) || fontsize === 0){
            fontsize = DEFAULT_EDITOR_FONTSIZE
        }
        setEditorFontSize(fontsize)
    }

    function setEditorFontSize(fontsize){
        if(fontsize < 3){
            fontsize = 3
            saveEditorFontSize(fontsize)
        }
        if(fontsize > 100){
            fontsize = 100
            saveEditorFontSize(fontsize)
        }
        for(let e of [editor, minifiedEditor, unminifiedEditor, uiBuilderEditor]){
            e.setFontSize(fontsize)
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

    function refreshUnminifiedEditorCharacterCount(){
        let chars = countCharacters(unminifiedEditor.getValue())
        $('#unminified-charactercount').html(chars + '/4096')
        if(chars >= 4096){
            $('#unminified-charactercount').addClass('limit')
        } else {
            $('#unminified-charactercount').removeClass('limit')
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

    function refreshUnminifiedPositionHint(){
        let pos = unminifiedEditor.getCursorPosition()
        let chars = unminifiedEditor.session.doc.positionToIndex(pos)
        $('#unminified-selection-information').html('Line ' + (pos.row + 1) + ', Column ' + (pos.column + 1) + ', Char ' + chars)
    }

    function countCharacters(str){
        return typeof str === 'string' ? str.length : 0
    }

    function isMinificationAllowed(keyword, /* optional */ library){
        if(library){
            let acs = AUTOCOMPLETE.getAllAutocompletitions()
            return acs && acs.children[library] && acs.children[library].children && acs.children[library].children[keyword]
        } else {
            return IDENTIFIERS_NOT_ALLOWED_TO_MINIFY.indexOf(keyword) === -1
        }
    }

    function report(typeID, data){
        if(window.PonyTracking){
            window.PonyTracking.report(typeID, data)
        }
    }

    return {
        REPORT_TYPE_IDS: REPORT_TYPE_IDS,
        report: report,

        errorStop: errorStop,
        setStorage: setStorage,
        getStorage: getStorage,
        refreshAll: refreshAll,
        increaseEditorFontSize: increaseEditorFontSize,
        decreaseEditorFontSize: decreaseEditorFontSize,
        isMinificationAllowed: isMinificationAllowed,
        isRunning: ()=>{
            return running
        },
        pauseScript: pauseScript,
        isCustomMinifiedCode: ()=>{
            return isCustomMinifiedCode
        },
        message: message,
        confirm: confirm,
        alert: alert,
        hint: hint
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

$(window).on('load',()=>{
    function showPerformanceHint(){
        YYY.hint('Performance hint', 'After 30 minutes you should reload the page to reset the emulator.\nPlease save ALL of your code (editor, minified and ui builder).\nThen reload the page.', {extended: true})
    }
    setTimeout(()=>{
        showPerformanceHint()
        setInterval(()=>{
            showPerformanceHint()            
        }, 1000 * 60 * 10)
    }, 1000 * 60 * 30)
})