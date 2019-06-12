var AUTOCOMPLETE = ((global, $)=>{
  "use strict";

    const TO = 'object'
    const TF = 'function'
    const AUTOCOMPLETITIONS = {
        children: {
            screen: {
                type: TO,
                description: 'Used to show stuff on the video output. Can only be called within the onDraw function!',
                children: {
                    setColor: {
                        type: TF,
                        args: '(r, g, b, a)',
                        description: 'Set the current draw color. Values range from 0 - 255. A is optional.'
                    },
                    drawClear: {
                        type: TF,
                        args: '()',
                        description: 'Clear the screen with the current color (paints the whole screen).'
                    },
                    drawLine: {
                        type: TF,
                        args: '(x1, y1, x2, y2)',
                        description: 'Draw a line from (x1,y1) to (x2,y2).'
                    },
                    drawCircle: {
                        type: TF,
                        args: '(x, y, radius)',
                        description: 'Draw a circle at (x,y) with radius.'
                    },
                    drawCircleF: {
                        type: TF,
                        args: '(x, y, radius)',
                        description: 'Draw a filled circle at (x,y) with radius.'
                    },
                    drawRect: {
                        type: TF,
                        args: '(x, y, width, height)',
                        description: 'Draw a rectangle at (x,y) with widht and height.'
                    },
                    drawRectF: {
                        type: TF,
                        args: '(x, y, width, height)',
                        description: 'Draw a filled rectangle at (x,y) with widht and height.'
                    },
                    drawTriangle: {
                        type: TF,
                        args: '(x1, y1, x2, y2, x3, y3)',
                        description: 'Draw a triangle between (x1,y1), (x2,y2) and (x3,y3).'
                    },
                    drawTriangleF: {
                        type: TF,
                        args: '(x1, y1, x2, y2, x3, y3)',
                        description: 'Draw a filled triangle between (x1,y1), (x2,y2) and (x3,y3).'
                    },
                    drawText: {
                        type: TF,
                        args: '(x, y, text)',
                        description: 'Draw text at (x,y). Each character is 4 pixels wide and 5 pixels tall.'
                    },
                    drawTextBox: {
                        type: TF,
                        args: '(x, y, width, height, text, h_align, v_align)',
                        description: 'Draw text within a rectangle at (x,y) with widht and height. Text alignment can be specified using the last two parameters and ranges from -1 to 1 (left to right, top to bottom). If either of the alignment paramters are omitted, the text will be drawn top-left by default. Text will automatically wrap at spaces when possible, and will overflow the top/bottom of the specified rectangle if too large.'
                    },
                    drawMap: {
                        type: TF,
                        args: '(x, y, zoom)',
                        description: 'Draw the world map centered on map coordinate (x,y) with zoom level ranging from 0.1 to 50'
                    },
                    setMapColorOcean: {
                        type: TF,
                        args: '(r, g, b, a)',
                        description: 'Set the color for ocean map pixels. Values range from 0 - 255, a is optional.'
                    },
                    setMapColorShallows: {
                        type: TF,
                        args: '(r, g, b, a)',
                        description: 'Set the color for shallows map pixels. Values range from 0 - 255, a is optional.'
                    },
                    setMapColorLand: {
                        type: TF,
                        args: '(r, g, b, a)',
                        description: 'Set the color for land map pixels. Values range from 0 - 255, a is optional.'
                    },
                    setMapColorGrass: {
                        type: TF,
                        args: '(r, g, b, a)',
                        description: 'Set the color for grass map pixels. Values range from 0 - 255, a is optional.'
                    },
                    setMapColorSand: {
                        type: TF,
                        args: '(r, g, b, a)',
                        description: 'Set the color for sand map pixels. Values range from 0 - 255, a is optional.'
                    },
                    setMapColorSnow: {
                        type: TF,
                        args: '(r, g, b, a)',
                        description: 'Set the color for snow map pixels. Values range from 0 - 255, a is optional.'
                    },
                    getWidth: {
                        type: TF,
                        args: '()',
                        description: 'Returns the width of the monitor currently being rendered to'
                    },
                    getHeight: {
                        type: TF,
                        args: '()',
                        description: 'Returns the height of the monitor currently being rendered to'
                    }
                }
            },
            map: {
                type: TO,
                description: 'Functions to interact with the map.',
                children: {
                    screenToMap: {
                        type: TF,
                        args: '(mapX, mapY, zoom, screenW, screenH, pixelX, pixelY)',
                        description: 'Convert pixel coordinates into world coordinates'
                    },
                    mapToScreen: {
                        type: TF,
                        args: '(mapX, mapY, zoom, screenW, screenH, worldX, worldY)',
                        description: 'Convert world coordinates into pixel coordinates'
                    }
                }
            },
            input: {
                type: TO,
                description: 'Read values from the composite input.',
                children: {
                    getBool: {
                        type: TF,
                        args: '(index)',
                        description: 'Read the boolean value of the input composite on index. Index ranges from 1 - 32'                        
                    },
                    getNumber: {
                        type: TF,
                        args: '(index)',
                        description: 'Read the number value of the input composite on indexe. Index ranges from 1 - 32'                        
                    }
                }
            },
            output: {
                type: TO,
                description: 'Set values on the composite output.',
                children: {
                    setBool: {
                        type: TF,
                        args: '(index, value)',
                        description: 'Sets the boolean value of the output composite on index to value. Index ranges from 1 - 32'                        
                    },
                    setNumber: {
                        type: TF,
                        args: '(index, value)',
                        description: 'Sets the number value of the output composite on index to value. Index ranges from 1 - 32'                        
                    }
                }
            },
            property: {
                type: TO,
                description: 'Read the values of property components within this microcontroller directly. The label passed to each function should match the label that has been set for the property you#re trying to access (case-sensitive).',
                children: {
                    getBool: {
                        type: TF,
                        args: '(label)',
                        description: 'Reads the boolean value of the property with the specified label'                        
                    },
                    getNumber: {
                        type: TF,
                        args: '(label)',
                        description: 'Reads the number value of the property with the specified label'                        
                    },
                    getText: {
                        type: TF,
                        args: '(label)',
                        description: 'Reads the string value of the property with the specified label'                        
                    }
                }
            },
            onTick: {
                type: TF,
                args: '()',
                description: 'The tick function will be called once every logic tick and should be used for reading composite data and any required processing. "screen" functions will not work within onTick!'
            },
            onDraw: {
                type: TF,
                args: '()',
                description: 'The draw function will be called any time this script is dran by a monitor. Note that it can be called multiple times if this microcontroller is connected to multiple monitors whereas onTick is only called once. Composite input/output functions will not work within onDraw!'
            },
            pairs: {
                type: TF,
                description: 'Missing'
            },
            ipairs: {
                type: TF,
                description: 'Missing'
            },
            next: {
                type: TO,
                description: 'Missing'
            },
            tostring: {
                type: TO,
                description: 'Missing'
            },
            tonumber: {
                type: TO,
                description: 'Missing'
            },
            math: {
                type: TO,
                description: 'Missing'
            },
            table: {
                type: TO,
                description: 'Missing'
            },
            string: {
                type: TO,
                description: 'Missing'
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

        $('#code').contextmenu((e)=>{
            e.preventDefault()
            e.stopImmediatePropagation()
           
            suggestAutocomplete()
        })
    }

    function suggestAutocomplete(){
        let pos = editor.getCursorPosition()
        if(!pos){
            return
        }
        let word = getWordInFrontOfPosition(pos.row, pos.column)
        let [autocompletitions, part] = getAutocompletitions(word)
        console.log('suggestAutocomplete(' + word + ')', autocompletitions)
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
                ret.push({name: key, type: value.type, args: value.args || '', description: value.description || '...', full: path + '.' + key})
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
            'top': top,//top + 'px + ' + $('#code').css('font-size'),
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
        closeAutocomplete: closeAutocomplete,
        TO: TO,
        TF: TF,
        AUTOCOMPLETITIONS: AUTOCOMPLETITIONS
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

    this.click = false
    this.blockMouseEnter = false

    if(completitions instanceof Array === false || completitions.length === 0){
        this.$list.append('<div class="empty">nothing found</div>')
    } else {
        let id = 0
        for(let c of completitions) {
            const myid = id
            let cdescription = $('<div class="description" aid="' + id + '" atype="' + c.type + '"><div class="top"><div class="name">' + c.name + '</div><div class="args">' + c.args + '</div></div><div class="text">' + c.description + '</div></div>')
            this.$descriptions.append(cdescription)

            let centry = $('<div class="entry" aid="' + id + '" afull="' + c.full + '" atype="' + c.type + '"><div class="name">' + c.name  + (c.type === AUTOCOMPLETE.TF ? '()' : '') + '</div><div class="type">' + c.type + '</div></div>')
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
        $(this.$list.find('.entry').get(0)).addClass('selected').focus()        
        setTimeout(()=>{
            $('.description[aid="0"]').show()
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
        } else if(e.keyCode === 13) {
            e.preventDefault()
            e.stopImmediatePropagation()

            if(this.$list.find('.entry.selected').get(0)){
                this.insertAutoCompletition( this.$list.find('.entry.selected').get(0).completition )
            } else {
                AUTOCOMPLETE.closeAutocomplete()                
            }
        } else {
            editor.focus()
            $('.ace_text-input').trigger(e)
            AUTOCOMPLETE.closeAutocomplete()
        }
    })

    this.$input.on('focusout', ()=>{
        setTimeout(()=>{
            if(!this.click){
                AUTOCOMPLETE.closeAutocomplete()
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
        AUTOCOMPLETE.closeAutocomplete()
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
    }
    if(scroll){
        let top = $('.entry[aid="0"]').height() * this.selected
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
    if(completition.type === AUTOCOMPLETE.TO){
        text += '.'
    } else if(completition.type === AUTOCOMPLETE.TF){
        let args = completition.args ? completition.args : '()'
        text += args
        setTimeout(()=>{
            editor.navigateLeft(args.length - 1)
        }, 200)
    }
    editor.insert(text)
    AUTOCOMPLETE.closeAutocomplete()
}
