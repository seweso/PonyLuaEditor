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
    let currentAutocomplete

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

        let ret = []
        if(node.children){
            for(let [key, value] of Object.entries(node.children)) {
              if(!partLeft.length > 0 || key.indexOf(partLeft) >= 0){                
                ret.push({name: key, type: value.type, description: value.description, full: path + '.' + key})
              }
            }
        }
        return [ret, partLeft]
    }

    function showAutocompletitions(container, completitions, part){
        if(autocompletitionIsShown){
            closeAutocomplete()
        }
        autocompletitionIsShown = true

        let $c = $(container)
        $c.html('')

        currentAutocomplete = new AutocompletitionElement(completitions, part)

        $c.append(currentAutocomplete.getDom())

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
        console.log('closing currentAutocomplete')
        autocompletitionIsShown = false
        $('#autocompletition-container').html('')
        currentAutocomplete = null
        editor.focus()
    }

    return {
        getWordInFrontOfPosition: getWordInFrontOfPosition,
        getAutocompletitions: getAutocompletitions,
        showAutocompletitions: showAutocompletitions,
        closeAutocomplete: closeAutocomplete
    }

})(window, jQuery)










function AutocompletitionElement(completitions, part){
    this.$dom = $('<div class="autocompletition"></div>')
    this.$list = $('<div class="list"></div>')
    this.$dom.append(this.$list)
    this.$descriptions = $('<div class="descriptions"></div>')
    this.$dom.append(this.$descriptions)

    this.completitions = completitions
    this.part = part

    this.$input = $('<input type="text" />')
    this.$dom.append(this.$input)


    if(completitions instanceof Array === false || completitions.length === 0){
        this.$list.append('<div class="empty">nothing found</div>')
    } else {
        let id = 0
        for(let c of completitions) {
            let cdescription = $('<div class="description" aid="' + id + '" atype="' + c.type + '"><div class="name">' + c.name + '</div><div class="description">' + c.description + '</div></div>')
            this.$descriptions.append(cdescription)

            let centry = $('<div class="entry" aid="' + id + '" full="' + c.full + '" atype="' + c.type + '"><div class="name">' + c.name + '</div><div class="type">' + c.type + '</div></div>')
            this.$list.append(centry)
            centry.on('click', ()=>{
                this.insertAutoCompletition(c.full)
            })
            id++
        }
        this.selected = 0
        $(this.$list.find('.entry').get(0)).addClass('selected').focus()
    }


    this.$input.on('keydown', (e)=>{
        console.log('keydown', e.keyCode)
        if(e.keyCode === 40){//arrow down
            e.preventDefault()
            e.stopImmediatePropagation()

            this.arrowDown()
        } else if (e.keyCode === 38){//arrow up
            e.preventDefault()
            e.stopImmediatePropagation()

            this.arrowUp()
        } else if(e.keyCode === 13) {
            this.insertAutoCompletition( this.$list.find('.entry.selected').attr('full') )
        } else {
            editor.focus()
            $('.ace_text-input').trigger(e)
            AUTOCOMPLETE.closeAutocomplete()
        }
    })

    this.$input.on('focusout', ()=>{
        AUTOCOMPLETE.closeAutocomplete()        
    })

    setTimeout(()=>{
        this.$input.focus()
    }, 100)
}

AutocompletitionElement.prototype.arrowDown = function() {
    if(this.$list.find('.entry').length > this.selected + 1){
        this.selected++
        let it = this.$list.find('.entry').get(this.selected)
        if(it){
            this.$list.find('.entry.selected').removeClass('selected')
            $(it).addClass('selected').focus()

            this.$descriptions.find('.description').hide()
            $('[aid="' + $(it).attr('aid') + '"]').show()
        }
    }
}

AutocompletitionElement.prototype.arrowUp = function() {
    this.selected--
    if(this.selected < 0){
        AUTOCOMPLETE.closeAutocomplete()
        return
    }
    let it = this.$list.find('.entry').get(this.selected)
    if(it){
        this.$list.find('.entry.selected').removeClass('selected')
        $(it).addClass('selected').focus()
        
        this.$descriptions.find('.description').hide()
        $('[aid="' + $(it).attr('aid') + '"]').show()
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
    AUTOCOMPLETE.closeAutocomplete()   
}
