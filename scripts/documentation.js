var DOCUMENTATION = ((global, $)=>{
  "use strict";


    const MANUAL_BASE_URL = 'https://www.lua.org/manual/5.3/manual.html#'

    const TO = 'object'
    const TF = 'function'
    const TV = 'variable'
    const TA = 'argument'
    const TE = 'event'

    const LIB_TITLES = {
        'dev': 'Pony API (This Website)',
        'stormworks': 'Stormworks API',
        'lua': 'Lua API',
        'user': 'User defined (that\'s you!)'
    }

    
    let DEFINITION
    
    let PARSED


    LOADER.on(LOADER.EVENT.UI_READY, init)



    function init(){

        refresh()

        LOADER.done(LOADER.EVENT.DOCUMENTATION_READY)
    }

    function refresh(){

        if(UI.isServerMode()){
            DEFINITION = DOCUMENTATION_DEFINITION_SERVER
        } else {
            DEFINITION = DOCUMENTATION_DEFINITION_CLIENT
            $('.ide').attr('mode', 'client')
        }

        if(DEFINITION && DEFINITION instanceof Object){

            parseDefinition()

            buildDocumentation()
        } else {
            throw 'unable to load DOCUMENTATION_DEFINITION'
        }
    }

    function parseDefinition(){
        PARSED = JSON.parse(JSON.stringify(DEFINITION))

        function _do(node, parent){
            if(typeof node.description === 'string'){
                node.description = parseDescription(node.description)
            }
            if(typeof node.url === 'string'){
                node.url = parseUrl(node.url)
            } else if(parent && typeof parent.url === 'string'){
                node.url = parent.url
            }
            if(parent && parent.lib){
                node.lib = parent.lib
            }
            if(node.children){
                for(let k of Object.keys(node.children)){
                    _do(node.children[k], node)
                }
            }
        }

        _do(PARSED)
    }

    function parseDescription(description){
        return description.replace(/§([\d\.]*)/g, (match, p1)=>{
            return parseUrl(MANUAL_BASE_URL + p1)
        }).replace(/\n/g, '<br>')
    }

    function parseUrl(url){
        let label = url
        if(url.indexOf(MANUAL_BASE_URL) >= 0){
            label = 'Lua Manual §' + url.split('#')[1]
        }
        return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + label + '</a>'
    }

    function argsAsString(args){
        if(args instanceof Array === false){
            throw 'args must be an array @ ' + name
        } else {
            let text = ''
            let optionalArgs = 0

            for(let i in args){
                let a = args[i]

                let isLastArg = (i == (args.length - 1))

                if(a.optional){
                    if(a.optionalConnectedToPrevious !== true){
                        optionalArgs++
                        text = text.substring(0, text.length - 2) + ' [, '
                    }
                } else if (optionalArgs > 0){
                    optionalArgs--
                    text = text.substring(0, text.length - 2) + '], '
                }

                text += a.name

                if(isLastArg){
                    for(let ii = 0; ii < optionalArgs; ii++){
                        text += ']'
                    }
                } else {
                    text += ', '
                }
            }

            return '(' + text + ')'
        }
    }

    function argsAsDOM(args){
        if(args instanceof Array === false){
            throw 'args must be an array @ ' + name
        } else {
            let dom = $('<div class="args">') 
            let optionalArgs = 0

            let previousArg

            for(let i in args){
                let a = args[i]

                let currentArg = $('<div class="arg">').html(a.name)

                let help_text = ''

                if(a.help){
                    help_text += a.help
                }

                if(a.possibleValues){
                    if(help_text.length > 0){
                        help_text += '\n\n'
                    }

                    let table = '<table><tr><th>Value</th><th>Description</th></tr>'

                    for(let k in a.possibleValues){
                        table += '<tr><td>' + k + '</td><td>' + ( a.possibleValues[k] || '?' ) + '</tr>'
                    }

                    table += '</table>'

                    help_text += 'Possible Values:\n' + table
                }

                if(help_text.length > 0){
                    currentArg.addClass('has_help')
                    currentArg.append( $('<div class="arg_help_open"><span class="icon-question"></span></div>') )
                    currentArg.append( $('<div class="arg_help">').html( help_text ) )
                    currentArg.on('mouseenter', ()=>{
                        currentArg.addClass('help_open')
                    })
                    currentArg.on('mouseleave', ()=>{
                        currentArg.removeClass('help_open')
                    })
                }

                if(a.optional){
                    if(a.optionalConnectedToPrevious !== true){
                        optionalArgs++
                        currentArg.attr('before', '\xa0[,\xa0')

                        if(previousArg){
                            previousArg.attr('after', previousArg.attr('after').substring(0, previousArg.attr('after').length - 2) )
                        }
                    }
                } else if (optionalArgs > 0){
                    optionalArgs--

                    if(previousArg){
                       previousArg.attr('after', previousArg.attr('after').substring(0, previousArg.attr('after').length - 2) + '],\xa0')
                    }
                }

                let isLastArg = (i == (args.length - 1))
                if(isLastArg){
                    let brackets = ''
                    for(let ii = 0; ii < optionalArgs; ii++){
                        brackets += ']'
                    }
                    currentArg.attr('after', brackets)
                } else {
                    currentArg.attr('after', ',\xa0')
                }

                dom.append(currentArg)

                previousArg = currentArg
            }

            return dom
        }
    }

    function buildDocumentation(){
        $('#documentation').html('')
        for(let name of getSortedKeysForDocsChildren(PARSED.children)){
            let child = PARSED.children[name]
            printNode($('#documentation'), child, name, true)
        }
    }

    function printNode(container, node, name, topNode){
        let me = $('<div class="node" ntype="' + node.type + '" ' + (node.lib ? 'lib="' + node.lib + '"' : '') + '>')
        container.append(me)

        let top = $('<div class="top">')
        me.append(top)

        let bottom = $('<div class="bottom">')
        me.append(bottom)


        if(node.children || topNode){
            me.addClass('contracted')
            top.on('click', ()=>{
                me.toggleClass('contracted')
            })
        }

        let definition = $('<div class="definition">')
        top.prepend(definition)

        definition.append(
            $('<div class="name">' + name + '</div>')
        )

        if(node.type === TE){
            const help_text = 'Declare this function in the code, and it will be called by the game.'
            node.help = node.help ? (help_text + '\n\n' + node.help) : help_text
        }

        if(node.help){
            let hint = $('<div class="hint"></div>')
            let hintinner = $('<div class="hint_inner"></div>').html(node.help)
            let hintopen = $('<div class="hint_open_icon icon-question"></div>')
                .on('mouseenter',()=>{
                    hint.addClass('hint_open')
                })
                .on('mouseleave',()=>{
                    hint.removeClass('hint_open')
                })
            hint.append(hintopen)
            hint.append(hintinner)
            definition.append(hint)
        }


        if(node.type === TF || node.type === TE){           
            definition.append(argsAsDOM(node.args))
        }

        if(node.lib && topNode){
            top.append(
                $('<div class="lib">' + LIB_TITLES[node.lib] + '</div>')
            )
        }

        if(node.url){
            bottom.append(
                $('<div class="url">' + node.url + '</div>')
            )
        }

        if(node.type === TF){
            bottom.append(
                $('<div class="returns">Returns: ' + (node.returns ? node.returns : '<span class="nothing">nothing</span>') + '</div>')
            )
        }

        bottom.append(
            $('<div class="text">' + node.description + '</div>')
        )

        if(node.bugs){
            bottom.append(
                $('<div class="bugs"><span class="heading">Known Bugs / Problems</span><br><div class="bug_text">' + node.bugs + '</div></div>')
            )
        }
        
        
        container.append(me)
        if(node.children){
            let childcontainer = $('<div class="children"></div>')
            me.append(childcontainer)

            for(let name of getSortedKeysForDocsChildren(node.children)){
                let child = node.children[name]
                printNode(childcontainer, child, '.' + name)
            }
        }
    }

    function getSortedKeysForDocsChildren(children){
        let sortedChildren = []

        for(let name of Object.keys(children)){
            let ID = (children[name].lib ? children[name].lib : '') + '.' + name
            sortedChildren[ID] = name
        }

        let sortedIDs = Object.keys(sortedChildren).sort((a,b)=>{
            if(a > b){
                return 1
            }

            if(a < b){
                return -1
            }

            return 0
        })

        let sortedKeys = []
        for(let id of sortedIDs){
            sortedKeys.push(sortedChildren[id])
        }

        return sortedKeys
    }


    return {
        TO: TO,
        TF: TF,
        TV: TV,
        TA: TA,
        TE: TE,
        LIB_TITLES: LIB_TITLES,
        getRaw: ()=>{ return DEFINITION; },
        getParsed: ()=>{ return PARSED},
        argsAsString: argsAsString,
        refresh: refresh
    }

})(window, jQuery)
