minmax = (()=>{
    const IDENTIFIERS_NOT_ALLOWED_TO_MINIFY = ['onTick', 'onDraw']

    const LIBRARY_IDENTIFIERS = []

    const MINIFY_MAPPING_SEPERATOR = '--yyy--'

    let shortenedIdentifiers = []


    $(window).on('newui_loaded', init)


    function init(){
        addChildrenToLibraryIdentifiers(AUTOCOMPLETE.getAllAutocompletitions())

        function addChildrenToLibraryIdentifiers(node){
            if(node.children){
                for(let k of Object.keys(node.children)){
                    LIBRARY_IDENTIFIERS.push(k)
                    addChildrenToLibraryIdentifiers(node.children[k])
                }
            }
        }

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


        $('#minify').on('click', ()=>{
            report(REPORT_TYPE_IDS.minify)

            try {

                let minified

                if($('#minify-type').val() === 'conservative-with-line-breaks' || $('#minify-type').val() === 'conservative-no-line-breaks'){
                    let ast = luaparse.parse(editors.get('normal').getValue())

                    minified = luamin.minify(ast).trim()
                } else {

                    let ast = luaparse.parse(editors.get('normal').getValue())

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
                editors.get('minified').setValue(minified, -1)
                $('#minified-code-container .custom_hint').hide()
                yyy.setCustomMinifiedCode(false)

                removeMinifiedCodeFromStorage()
            } catch (ex){
                console.trace(ex)
                $('#minified-editor').show()
                editors.get('minified').setValue('Error: ' + ex.message, -1)
            }
        })

        $('#minify-help').on('click', ()=>{
            util.message('Minify Help', 'You can use two different modes:<br><ul>'
                + '<li><strong>Conservative</strong><br>will only replace names of <i>local</i> declared variables and functions</li><br>'
                + '<li><strong>Agressive</strong><br>will replace almost every varable and function name.<br><span style="color: red;font-weight: bold">In rare cases, this produces errors, which you have to fix manually.</span></li>'
                + '</ul><br>Each of those modes supports output with or without line breaks.<br>Without line breaks you save a small amount of characters, but the code is very hard to read and debug')
        })

    
        $('#unminify').on('click', ()=>{
            report(REPORT_TYPE_IDS.unminify)

            let minified = editors.get('minified').getValue()

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
            editors.get('unminified').setValue(unminified, -1)


            function fail(msg){
                $('#unminified-editor').show()
                editors.get('unminified').setValue('Unminification failed:\n' + msg, -1)
            }

        })

    }

    function isMinificationAllowed(keyword, /* optional */ library){
        if(library){
            let acs = AUTOCOMPLETE.getAllAutocompletitions()
            return acs && acs.children[library] && acs.children[library].children && acs.children[library].children[keyword]
        } else {
            return IDENTIFIERS_NOT_ALLOWED_TO_MINIFY.indexOf(keyword) === -1
        }
    }


    return {
        isMinificationAllowed: isMinificationAllowed,
    }
})()