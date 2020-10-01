var DOCUMENTATION = ((global, $)=>{
  "use strict";


    const MANUAL_BASE_URL = 'https://www.lua.org/manual/5.3/manual.html#'

    const TO = 'object'
    const TF = 'function'
    const TV = 'variable'
    const TA = 'argument'

    const LIB_TITLES = {
        'stormworks': 'Stormworks API',
        'dev': 'Dev API (Editor Only)',
        'lua': 'Lua API',
        'user': 'User defined (that\'s you!)'
    }

    
    let DEFINITION
    
    let PARSED


    loader.on(loader.EVENT.UI_READY, init)



    function init(){
        DEFINITION = DOCUMENTATION_DEFINITION

        if(DEFINITION && DEFINITION instanceof Object){

            parseDefinition()

            buildDocumentation()

            loader.done(loader.EVENT.DOCUMENTATION_READY)
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

    function buildDocumentation(){
        for(let name of Object.keys(PARSED.children)){
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

        if(node.type === TF){
            let args = $('<div class="args">')
            if(node.args instanceof Array === false){
                throw 'args must be an array @ ' + name
            } else {
                let text = ''
                let optionalArgs = 0

                for(let i in node.args){
                    let a = node.args[i]

                    let isLastArg = (i == (node.args.length - 1))

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

                args.html( '(' + text + ')' )
            }

            definition.append(args)
        }

        if(node.lib){
            top.append(
                $('<div class="lib">' + LIB_TITLES[node.lib] + '</div>')
            )
        }

        if(node.url){
            bottom.append(
                $('<div class="url">' + node.url + '</div>')
            )
        }

        bottom.append(
            $('<div class="text">' + node.description + '</div>')
        )
        
        
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


    return {
        TO: TO,
        TF: TF,
        TV: TV,
        TA: TA,
        LIB_TITLES: LIB_TITLES,
        getRaw: ()=>{ return DEFINITION; },
        getParsed: ()=>{ return PARSED}
    }

})(window, jQuery)
