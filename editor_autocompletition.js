var AUTOCOMPLETE = ((global, $)=>{
  "use strict";

    const TO = 'object'
    const TF = 'function'
    const AUTOCOMPLETITIONS = {
        children: {
            screen: {
                type: TO,
                children: {
                    drawCircle: {
                        type: TF,
                        description: 'This is the description of screen.drawCircle()'
                    },
                    drawRect: {
                        type: TF,
                        description: 'This is the description of screen.drawRect()'
                    }
                }
            }
        }
    }

    let autocompletitionIsShown = false

    $(global).on('load', init)

    function init(){
        editor.commands.addCommand({
            name: 'autocompletition',
            bindKey: {win: 'Ctrl-Space',  mac: 'Command-Space'},
            exec: (editor)=>{
                suggestAutocomplete()
            },
            readOnly: false
        })

        $(global).on('keydown', (e)=>{
            if(e.keyCode !== 13 && autocompletitionIsShown){
                closeAutocomplete()
            }
        })

        /*$(global).on('click', (e)=>{
            if(autocompletitionIsShown){
                closeAutocomplete()
            }
        })*/
    }

    function suggestAutocomplete(){
        console.log('suggestAutocomplete()')
        let pos = editor.getCursorPosition()
        if(!pos){
            return
        }
        let word = getWordInFrontOfPosition(pos.row, pos.column)
        let [autocompletitions, part] = getAutocompletitions(word)
        showAutocompletitions($('#autocompletition-container'), autocompletitions, part)
    }

    /*function getEditorPosition(){
        let markers = editor.session.getMarkers()
        if(!markers){
            return false
        }
        let mymarker
        for(let k of Object.keys(markers)){
            let m = markers[k]
            if(m.clazz === 'ace_active-line'){
                mymarker = m
                break
            }
        }
        if(!mymarker){
            return false
        }
        return {
            row: mymarker.range.start.row,
            column: mymarker.range.start.column
        }
    }*/

    function getWordInFrontOfPosition(row, column){
        let line = editor.session.getLine(row)
        let lineUntilPosition = line.substring(0, column)
        let matches = lineUntilPosition.match(/(.* )?([^\s]*)/)
        if(matches instanceof Array === false || matches.length !== 3){
            return ''
        }
        return matches[2]
    }

    function getAutocompletitions(text){
        let parts = text.split('.').reverse()
        let node = AUTOCOMPLETITIONS
        let partLeft = ''
        let path = ''
        while(parts.length > 0){
            let p = parts.pop()
            if(node.children && node.children[p]){
                path += '.' + p
                node = node.children[p]
            } else {
                partLeft = partLeft.length === 0 ? p : partLeft + '.' + p
            }
        }

        path = path.substring(1)

        if(partLeft){
            let ret = []
            for(let [key, value] of Object.entries(node.children)) {
              if(key.indexOf(partLeft) >= 0){                
                ret.push({name: key, type: value.type, description: value.description, full: path + '.' + key})
              }
            }
            return [ret, partLeft]
        } else {
            let ret = []
            for(let [key, value] of Object.entries(node.children)) {
              ret.push({name: key, type: value.type, description: value.description, full: path + '.' + key})
            }
            return [ret, '']
        }
    }

    function showAutocompletitions(container, completitions, part){
        if(autocompletitionIsShown){
            closeAutocomplete()
        }
        autocompletitionIsShown = true

        let $c = $(container)
        $c.html('')

        let autocompletitionElement = new AutocompletitionElement(completitions, part)

        $c.append(autocompletitionElement.getDom())

        let cursor = $('#code .ace_cursor').offset()
        let containerpos = $('#code-container').offset()

        let top = cursor.top - containerpos.top
        let left = cursor.left - containerpos.left

        $c.css({
            'top': 'calc(' + top + 'px + ' + $('#code').css('font-size') + ')',
            'left': left + 3,
            'font-size': $('#code').css('font-size')
        })
    }

    function closeAutocomplete(){
        autocompletitionIsShown = false
        $('#autocompletition-container').html('')
    }

    return {
        getWordInFrontOfPosition: getWordInFrontOfPosition,
        getAutocompletitions: getAutocompletitions,
        showAutocompletitions: showAutocompletitions
    }

})(window, jQuery)










function AutocompletitionElement(completitions, part){
    this.$dom = $('<div class"autocompletition"></div>')
    this.$list = $('<div class="list"></div>')
    this.$dom.append(this.$list)
    this.$descriptions = $('<div class="descriptions"></div>')
    this.$dom.append(this.$descriptions)

    this.completitions = completitions
    this.part = part


    if(completitions instanceof Array === false || completitions.length === 0){
        this.$list.append('<div class="empty">nothing found</div>')
    } else {
        for(let c of completitions) {
            let cdescription = $('<div class="description" atype="' + c.type + '"><div class="name">' + c.name + '</div><div class="description">' + c.description + '</div></div>')
            this.$descriptions.append(cdescription)

            let centry = $('<div class="entry" atype="' + c.type + '">' + c.name + '</div>')
            this.$list.append(centry)
            centry.on('focus', ()=>{
                this.$descriptions.find('.description').hide()
                cdescription.show()
            })
            centry.on('click', ()=>{
                this.insertAutoCompletition(c.full)
            })
            centry.on('keydown', (e)=>{
                if(e.keyCode === 13){
                    e.preventDefault()
                    e.stopPropagation()

                    this.insertAutoCompletition(c.full)
                }
            })        
        }
    }
}

AutocompletitionElement.prototype.getDom = function() {
    return this.$dom
}

AutocompletitionElement.prototype.insertAutoCompletition = function(completition) {
    let text
    if(typeof this.part === 'string'){
        if(completition.lastIndexOf(this.part) !== completition.length){
            completition = completition.substring(completition.length - completition.lastIndexOf(this.part) + 1)
        }
        text = completition.replace(this.part, '')
    } else {
        text = completition
    }
    editor.insert(text)
    this.destroy()
}

AutocompletitionElement.prototype.destroy = function() {
    this.$dom.remove()
}