class Autocomplete {
    constructor(editor, codeField){
        this.editor = editor
        this.codeField = $(codeField)

        this.autocompletitionIsShown = false
        this.currentAutocomplete = undefined

        this.editor.commands.addCommand({
            name: 'autocompletition',
            bindKey: {win: 'Ctrl-Space',  mac: 'Command-Space'},
            exec: ()=>{
                this.suggestAutocomplete()
            },
            readOnly: false
        })

        this.codeField.contextmenu((e)=>{
            e.preventDefault()
            e.stopImmediatePropagation()
           
            this.suggestAutocomplete()
        })
    }

    suggestAutocomplete(){
        let pos = this.editor.getCursorPosition()
        if(!pos){
            return
        }
        let word = this.getWordInFrontOfPosition(pos.row, pos.column)
        let [autocompletions, part] = this.getAutocompletions(word)
        console.log('suggestAutocomplete(' + word + ')', autocompletions)
        this.showAutocompletions(this.codeField.find('.autocompletion_container'), autocompletions, part)
    }

    getWordInFrontOfPosition(row, column){
        let line = this.editor.session.getLine(row)
        let lineUntilPosition = line.substring(0, column)
        let matches = lineUntilPosition.match(/(.*[\s;\),\(\+\-\*\/\%\=\[\]#])?([^\s\(]*)/)
        if(matches instanceof Array === false || matches.length !== 3){
            return ''
        }
        return matches[2]
    }

    getAutocompletions(text){
        let parts = text.split('.').reverse()
        let tmp = JSON.parse(JSON.stringify(DOCUMENTATION.getParsed()))

        let keywords = this.getKeywordsFromCode()
        for(let k of Object.keys(keywords)){
            tmp.children[k] = keywords[k]
        }
        let node = tmp
        let partLeft = ''
        let path = ''
        while(parts.length > 0){
            let p = parts.pop()
            if(parts.length > 0 && node.children && node.children[p]){
                path += '.' + p
                node = node.children[p]
            } else {
                partLeft = partLeft.length === 0 ? p : partLeft + '.' + p
            }
        }

        path = path.substring(1)

        let ret = []
        if(node.children){
            for(let [key, value] of Object.entries(node.children)) {
              if(!partLeft.length > 0 || key.indexOf(partLeft) === 0){                
                ret.push({name: key, type: value.type, lib: value.lib, url: value.url, args: value.args, description: value.description || '...', full: path + '.' + key})
              }
            }
        }

        ret.sort((a,b)=>{
            if(a.lib > b.lib){
                return 1
            }

            if(a.lib < b.lib){
                return -1
            }

            /* else: same lib */

            if(a.name > b.name){
                return 1
            }

            if(a.name < b.name){
                return -1
            }

            return 0
        })

        return [ret, partLeft]
    }

    getKeywordsFromCode(){
        let ret = {}

        let code = this.editor.getValue()
        if(typeof code === 'string'){
            let vars = [...code.matchAll(/[\s;]?([a-zA-Z0-9\._]+)[\s]*?=/g)]
            let functionHeads = [...code.matchAll(/function[\s]+[\w_\.]+[\s]*\([\s]*([^\)]+)[\s]*\)/g)]
            let functionArguments = []
            for(let fh of functionHeads){
                let split = fh[1].replace(/\s/g, '').split(',')
                for(let s of split){
                    functionArguments.push({
                        0: fh[0],
                        1: s,
                        index: fh.index,
                        input: fh.input,
                        length: 2
                    })
                }
            }
            let functions = [...code.matchAll(/function[\s]+([\w_\.]+)[\s]*\(([^\)]*)\)/g)]

            let that = this

            addToRet(vars, DOCUMENTATION.TV)
            addToRet(functions, DOCUMENTATION.TF)
            addToRet(functionArguments, DOCUMENTATION.TA)

            function addToRet(matches, type){

                for(let m of matches){
                    let parts = m[1].split('.').reverse()

                    let args = []

                    if(typeof m[2] === 'string' && m[2] !== ''){
                        let argMatches = m[2].split(',')
                    
                        for(let am of argMatches){
                            args.push({name: am.trim()})
                        }
                    }

                    let documentPosition = that.editor.session.getDocument().indexToPosition(m.index+1, 0)

                    let node = ret

                    while(parts.length > 0){
                        let p = parts.pop()
                        if(!node[p]){
                            if(parts.length > 0){//has children
                                node[p] = {
                                    type: DOCUMENTATION.TO,
                                    lib: 'user',
                                    description: 'Defined on LINE ' + (1 + documentPosition.row),
                                    children: {}
                                }
                                node = node[p].children
                            } else {
                                node[p] = {
                                    type: type,
                                    lib: 'user',
                                    description: 'Defined on LINE ' + (1 + documentPosition.row)
                                }
                                if(type == DOCUMENTATION.TF){
                                    node[p].args = args
                                }
                                node = node[p]
                            }
                        } else {
                            if(parts.length > 0){
                                if(!node[p].children){
                                    node[p] = {
                                        type: DOCUMENTATION.TO,
                                        lib: 'user',
                                        description: 'Defined on LINE ' + (1 + documentPosition.row),
                                        children: {}
                                    }
                                }
                                node = node[p].children
                            } else {
                                node = node[p]                                
                            }
                        }
                    }
                }
            }
        }
        return ret
    }    

    showAutocompletions(container, completions, part){
        REPORTER.report(REPORTER.REPORT_TYPE_IDS.openAutocomplete)

        if(this.autocompletitionIsShown){
            this.closeAutocomplete()
        }
        this.autocompletitionIsShown = true

        let $c = $(container)
        $c.html('')

        this.currentAutocomplete = new AutocompletitionElement(completions, part, this)

        $c.append(this.currentAutocomplete.getDom())

        let cursor = this.codeField.find('.ace_cursor').offset()
        let containerpos = this.codeField.offset()

        let top = cursor.top - containerpos.top
        let left = cursor.left - containerpos.left
        if(left + $c.width() > $(window).width()){
            left = left - $c.width()
        }

        $c.css({
            'top': top,
            'left': left + 3,
            'font-size': this.codeField.css('font-size')
        })
    }

    closeAutocomplete(){
        console.log('closing currentAutocomplete')
        this.autocompletitionIsShown = false
        this.codeField.find('.autocompletion_container').html('')
        this.currentAutocomplete = null
        this.editor.focus()
    }
}







function AutocompletitionElement(completions, part, autocomplete){
    this.autocomplete = autocomplete
    this.$dom = $('<div class="autocompletition"></div>')
    this.$list = $('<div class="list"></div>')
    this.$dom.append(this.$list)
    this.$descriptions = $('<div class="descriptions"></div>')
    this.$dom.append(this.$descriptions)

    this.completions = completions
    this.part = part

    this.$input = $('<input type="text" />')
    this.$dom.append(this.$input)

    this.click = false
    this.blockMouseEnter = false

    if(completions instanceof Array === false || completions.length === 0){
        this.$list.append('<div class="empty">nothing found</div>')
    } else {
        let id = 0
        for(let c of completions) {
            const myid = id

            let cdescription = $('<div class="description" aid="' + id + '" atype="' + c.type + '" ' + (c.lib ? 'lib="' + c.lib + '"' : '') + '><div class="top"><div class="name">' + c.name + '</div><div class="args">' + ( c.args ? DOCUMENTATION.argsAsString(c.args) : '' ) + '</div></div>' + (c.lib ? '<div class="lib_title">' + DOCUMENTATION.LIB_TITLES[c.lib] + '</div>' : '') + (c.url ? '<div class="url">' + c.url + '</div>' : '') + '<div class="text">' + c.description + '</div></div>')
            this.$descriptions.append(cdescription)

            let centry = $('<div class="entry" aid="' + id + '" afull="' + c.full + '" atype="' + c.type + '" ' + (c.lib ? 'lib="' + c.lib + '"' : '') + '><div class="name">' + c.name  + (c.type === DOCUMENTATION.TF ? '()' : '') + '</div><div class="type">' + c.type + '</div></div>')
            this.$list.append(centry)
            centry.get(0).completition = c
            centry.on('click', ()=>{
                this.click = true
                this.insertAutoCompletition(c)
            })
            centry.mouseenter(()=>{
                if(this.blockMouseEnter){
                    return
                }
                this.select(myid, false)
            })
            id++
        }
        this.selected = 0
        setTimeout(()=>{
            this.select(this.selected)
        }, 200)
    }


    this.$input.on('keydown', (e)=>{
        if(e.keyCode === 40){//arrow down
            e.preventDefault()
            e.stopImmediatePropagation()

            this.arrowDown()
        } else if (e.keyCode === 38){//arrow up
            e.preventDefault()
            e.stopImmediatePropagation()

            this.arrowUp()
        } else if (e.keyCode === 27){//esc
            e.preventDefault()
            e.stopImmediatePropagation()

            this.autocomplete.closeAutocomplete()
        } else if(e.keyCode === 13) {//enter
            e.preventDefault()
            e.stopImmediatePropagation()

            if(this.$list.find('.entry.selected').get(0)){
                this.insertAutoCompletition( this.$list.find('.entry.selected').get(0).completition )
            } else {
                this.autocomplete.closeAutocomplete()                
            }
        } else {
            this.preventFocusOut = true
            this.autocomplete.editor.focus()
            this.autocomplete.codeField.find('.ace_text-input').trigger(e)
            setTimeout(()=>{
                this.autocomplete.suggestAutocomplete()
            }, 200)
        }
    })

    this.$input.on('focusout mouseleave', ()=>{
        if(this.preventFocusOut){
            this.preventFocusOut = false
            return
        }
        setTimeout(()=>{
            if(!this.click){
                this.autocomplete.closeAutocomplete()
            }
        }, 300)
    })

    setTimeout(()=>{
        this.$input.focus()
    }, 100)
}

AutocompletitionElement.prototype.arrowDown = function() {
    console.log('arrowDown')
    if(this.$list.find('.entry').length > this.selected + 1){
        this.select(this.selected + 1, true)
    }
}

AutocompletitionElement.prototype.arrowUp = function() {
    if(this.selected - 1 < 0){
        this.autocomplete.closeAutocomplete()
        return
    }
    this.select(this.selected - 1, true)
}

AutocompletitionElement.prototype.select = function(index, scroll) {
    let it = this.$list.find('.entry').get(index)
    if(it){
        this.selected = index
        this.$list.find('.entry.selected').removeClass('selected')
        $(it).addClass('selected').focus()
        
        this.$descriptions.find('.description').hide()
        $('.description[aid="' + index + '"]').show()

        $('.descriptions').css({
            left: '100%',
            top: 0,
        })

        let length = Math.max(this.$descriptions.find('.description[aid="' + index + '"] .text').html().length * 2, (this.$descriptions.find('.description[aid="' + index + '"] .name').html().length + 1 + this.$descriptions.find('.description[aid="' + index + '"] .args').html().length) * 3, this.$descriptions.find('.description[aid="' + index + '"] .lib_title').html().length * 3)
        let width = length
        if(width > 50){
            width = $('body').width() * 0.9 - this.$list.get(0).getBoundingClientRect().right
        }

        if(width < this.$list.width() && length > 50){
            width = this.$list.width()
            this.$descriptions.css({
                left: 0,
                top: this.$list.height(),
            })
        }
        this.$descriptions.css('width', width)
    }
    if(scroll){
        let top = $('.entry[aid="0"]').outerHeight() * this.selected
        this.blockMouseEnter = true
        this.$list.scrollTop(top)
        setTimeout(()=>{
            this.blockMouseEnter = false
        }, 100)
    }
}

AutocompletitionElement.prototype.getDom = function() {
    return this.$dom
}

AutocompletitionElement.prototype.insertAutoCompletition = function(completition) {
    let split = completition.full.split('.')
    let text = split[split.length-1]
    if(typeof this.part === 'string'){
        text = text.replace(this.part, '')
    }
    if(completition.type === DOCUMENTATION.TO){
        text += '.'
    } else if(completition.args){
        let args = DOCUMENTATION.argsAsString(completition.args)
        text += args
        setTimeout(()=>{
            this.autocomplete.editor.navigateLeft(args.length - 1)
        }, 10)
    }
    this.autocomplete.editor.insert(text)
    this.autocomplete.closeAutocomplete()
}
