MINMAX = (()=>{
    "use strict";

    const IDENTIFIERS_NOT_ALLOWED_TO_MINIFY = ['onTick', 'onDraw', 'httpReply']

    let libraryIdentifiers = []

    const MINIFY_MAPPING_SEPERATOR = '--yyy--'

    let shortenedIdentifiers = []


    LOADER.on(LOADER.EVENT.DOCUMENTATION_READY, init)

    function init(){
        $('#minify').on('click', minify)

        $('#minify-help').on('click', ()=>{
            UTIL.message('Minify Help', 'You can use two different modes:<br><ul>'
                + '<li><strong>Conservative</strong><br>will only replace names of <i>local</i> declared variables and functions</li><br>'
                + '<li><strong>Agressive</strong><br>will replace almost every varable and function name.<br><span style="color: red;font-weight: bold">In rare cases, this produces errors, which you have to fix manually.</span></li>'
                + '</ul><br>Each of those modes supports output with or without line breaks.<br>Without line breaks you save a small amount of characters, but the code is very hard to read and debug')
        })

    
        $('#unminify').on('click', unminify)

        LOADER.done(LOADER.EVENT.MINMAX_READY)
    }

    function refresh(){
        libraryIdentifiers = []

        addChildrenToLibraryIdentifiers(DOCUMENTATION.getParsed())

        function addChildrenToLibraryIdentifiers(node){
            if(node.children){
                for(let k of Object.keys(node.children)){
                    libraryIdentifiers.push(k)
                    addChildrenToLibraryIdentifiers(node.children[k])
                }
            }
        }
    }

    function minify(){
        shortenedIdentifiers = []
        REPORTER.report(REPORTER.REPORT_TYPE_IDS.minify)

        try {

            let minified

            if($('#minify-type').val() === 'conservative-with-line-breaks' || $('#minify-type').val() === 'conservative-no-line-breaks'){
                let ast = luaparse.parse(EDITORS.get('normal').editor.getValue())

                minified = luamin.minify(ast).trim()
            } else {

                let ast = luaparse.parse(EDITORS.get('normal').editor.getValue())

                minified = luaminy.minify(ast).trim()


                let pre = ''
                let idMap = luaminy.getLastIdentifierMap()
                for(let k of Object.keys(idMap)){
                    if(libraryIdentifiers.indexOf(k) >= 0){
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
                let lineBreakMinified = ''
                let i = 0
                let inText= false
                let lastType
                while (i < minified.length){
                    let indexOf
                    let type

                    if(inText){
                        if(lastType === 'single' ){
                            indexOf = minified.indexOf("'", i)
                        } else if (lastType === 'double'){
                            indexOf = minified.indexOf('"', i)
                        }
                        type = lastType
                    } else {
                        let indexOfSingleQuote = minified.indexOf("'", i)
                        let indexOfDoubleQuote = minified.indexOf('"', i)

                        type = (indexOfSingleQuote > 0 && indexOfSingleQuote < indexOfDoubleQuote) ? 'single' : 'double'
                        indexOf = type == 'single' ? indexOfSingleQuote : indexOfDoubleQuote
                    }

                    if(indexOf < 0){// no more quotes found
                        lineBreakMinified += '\n' + ident(minified.substring(i))
                        break
                    } else {//found a quote
                        if(inText){
                            let tmp = (type == 'single' ? "'" : '"') + minified.substring(i, indexOf)
                            lineBreakMinified += tmp
                        } else {
                            lineBreakMinified += '\n' + ident(minified.substring(i, indexOf))
                        }

                        if(inText){
                            let char = minified.charAt(indexOf)
                            if(char != '\\'){// check for \" and \'
                                inText = false
                            }
                            lineBreakMinified += (type == 'single' ? "'" : '"')
                        } else {
                            inText = true
                        }

                        i = indexOf + 1
                    }

                    lastType = type
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

            EDITORS.get('minified').editor.setValue(minified, -1)
        } catch (ex){
            UI.viewables()['viewable_editor_minified'].focusSelf()
            console.trace(ex)
            EDITORS.get('minified').editor.setValue('Error: ' + ex.message, -1)
        }

        let viewable = UI.viewables()['viewable_editor_minified'].focusSelf()
    }

    function unminify(){
        REPORTER.report(REPORTER.REPORT_TYPE_IDS.unminify)

        let minified = EDITORS.get('minified').editor.getValue()

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


        EDITORS.get('unminified').editor.setValue(unminified, -1)

        let viewable = UI.viewables()['viewable_editor_unminified'].focusSelf()


        function fail(msg){
            
            let viewable = UI.viewables()['viewable_editor_unminified'].focusSelf()

            EDITORS.get('unminified').editor.setValue('Unminification failed:\n' + msg, -1)
        }

    }

    function isMinificationAllowed(keyword, /* optional */ library){
        if(library){
            let acs = DOCUMENTATION.getParsed()
            return acs && acs.children[library] && acs.children[library].children && acs.children[library].children[keyword]
        } else {
            return IDENTIFIERS_NOT_ALLOWED_TO_MINIFY.indexOf(keyword) === -1
        }
    }


    return {
        isMinificationAllowed: isMinificationAllowed,
        refresh: refresh
    }
})()