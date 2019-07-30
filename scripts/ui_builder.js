var UI_BUILDER = ((global, $)=>{
    "use strict";

    let maxX
    let maxY

    let canvas
    let ctx

    

    const currentElements = []


    let MODE_MOVE = 'move'
    let MODE_RESIZE = 'resize'
    let MODE_SETTINGS = 'settings'
    let MODE_DELETE = 'delete'
    let MODE_ZINDEX = 'zindex'

    let MODE = MODE_MOVE

    let allElements = []

    let gcontainer

    $(global).on('load', ()=>{
        init($('#ui-builder-container'))
    })

    function init(container){
        gcontainer = container
        container.append('<div class="element_list"></div>')
        canvas = $('<canvas/>')

        $('#monitor-size').on('change', (e)=>{
            recalculateCanvas()
        })
        recalculateCanvas()

        ctx = canvas.get(0).getContext('2d')
        let canvas_container = $('<div class="canvas_container"></div>')
        container.append(canvas_container)
        container.find('.canvas_container').append(canvas)


        container.append('<div class="controls" mode="move"></div>')
        container.find('.controls').append('<div class="control move"><span class="icon-enlarge"></span>&nbsp;Move</div>')
        container.find('.controls').append('<div class="control resize"><span class="icon-enlarge2"></span>&nbsp;Size</div>')
        container.find('.controls').append('<div class="control settings"><span class="icon-equalizer"></span>&nbsp;Setup</div>')
        container.find('.controls').append('<div class="control delete"><span class="icon-cancel-circle"></span>&nbsp;Delete</div>')
        container.find('.controls').append('<div class="control zindex"><span class="icon-stack"></span>&nbsp;To Top</div>')

        container.find('.controls .control.move').on('click', ()=>{
            deactivateAllElements()
            container.find('.controls').attr('mode', MODE_MOVE)
            MODE = MODE_MOVE
        })
        container.find('.controls .control.resize').on('click', ()=>{
            deactivateAllElements()
            container.find('.controls').attr('mode', MODE_RESIZE)
            MODE = MODE_RESIZE
        })
        container.find('.controls .control.settings').on('click', ()=>{
            deactivateAllElements()
            container.find('.controls').attr('mode', MODE_SETTINGS)
            MODE = MODE_SETTINGS
        })
        container.find('.controls .control.delete').on('click', ()=>{
            deactivateAllElements()
            container.find('.controls').attr('mode', MODE_DELETE)
            MODE = MODE_DELETE
        })
        container.find('.controls .control.zindex').on('click', ()=>{
            deactivateAllElements()
            container.find('.controls').attr('mode', MODE_ZINDEX)
            MODE = MODE_ZINDEX
        })


        container.append('<div class="element_layer_list"></div>')

        
        for(let e of ELEMENTS){
            let entry = $('<div class="element ' + e.name.toLowerCase() + '">' + e.name + '</div>')
            entry.on('click', ()=>{
                currentElements.push(new e.object(false, canvas_container))
            })
            container.find('.element_list').append(entry)
        }
    }

    function deactivateAllElements(){
        for(let e of allElements){
            e.deactivate()
        }
    }

    function recalculateCanvas(){
        canvas.width( CANVAS.width() )
        canvas.height( CANVAS.height() ) 
        
        maxX = canvas.width()
        maxY = canvas.height()       
    }

    class Element {

        constructor(params, container){
            if(!container){
                return console.error('UI_BUILDER.Element:', 'argument "container" is missing!')
            }

            allElements.push(this)
            this.zindex = allElements.length

            this.layerListEntry = $('<div class="layer_list_entry" type="' + this.constructor.name.toLowerCase() + '">'
                + '<div class="left"><span class="name">' + this.constructor.name + '</span><div class="background"></div></div>'
                + '<div class="lcontrols"><span class="up icon-circle-up"></span><span class="down icon-circle-down"></span></div>'
                + '</div>')

            this.layerListEntry.find('.up').on('click', ()=>{
                this.layerListEntry.addClass('light_up')
                moveElementZindexUp(this)
                setTimeout(()=>{
                    this.layerListEntry.removeClass('light_up')
                }, 500)
            })
            this.layerListEntry.find('.down').on('click', ()=>{
                this.layerListEntry.addClass('light_up')
                moveElementZindexDown(this)
                setTimeout(()=>{
                    this.layerListEntry.removeClass('light_up')
                }, 500)
            })            
            this.layerListEntry.on('mouseenter', ()=>{
                this.dom.addClass('highlight')
            })
            this.layerListEntry.on('mouseleave', ()=>{
                this.dom.removeClass('highlight')
            })

            gcontainer.find('.element_layer_list').append(this.layerListEntry)

            this.x = 0
            this.y = 0
            this.width = 24
            this.height = 8

            this.minWidth = 6
            this.minHeight = 4

            let color = createRandomColor()

            this.settings = {
                background: {
                    type: 'color',
                    value: color
                },
                border: {
                    type: 'color',
                    value: color
                },
                borderWidth: {
                    type: 'number',
                    value: 1
                }
            }

            this.beforeBuild()

            this.dom = this.buildDom()
            $(container).append(this.dom)

            this.refresh()
        }

        beforeBuild(){
            /* put special logic of subclasses in here */        
        }

        buildContent(){
            /* put special logic of subclasses in here */      
        }

        refreshContent(){
            /* put special logic of subclasses in here */    
        }

        buildDom(){
            let that = this

            let elem = $('<div class="element ' + this.constructor.name.toLowerCase() + '"></div>')

            this.content = $('<div class="content"></div>')
            this.content.append(this.buildContent())
            elem.append(this.content)

            elem.append('<div class="settings"><span class="name">' + this.constructor.name + '</span><span class="close">x</span></div>')

            for(let k of Object.keys(this.settings)){
                let s = this.settings[k]
                let value
                switch(s.type){
                    case 'color': {
                        value = makeValidHexOrEmpty(s.value)
                    }; break;
                    case 'checkbox': {
                        value = s.value ? '" checked="checked' : ''
                    }; break;
                    default: {
                        value = s.value
                    }
                }
                let set = $('<div class="setting"><span class="name">' + k + '</span><input type="' + s.type + '" value="' + value + '"/></div>')
                set.on('change input', ()=>{
                    s.value = set.find('input').val()
                    that.refresh()
                })

                elem.find('.settings').append(set)
            }

            elem.find('.settings').on('mousedown', (evt)=>{
                evt.stopPropagation()
            })

            elem.find('.close').on('click', (evt)=>{
                evt.stopPropagation()
                this.closeSettings()
            })

            elem.on('mousedown', (evt)=>{
                if(MODE === MODE_SETTINGS){
                    this.openSettings(evt)
                } else if(MODE === MODE_MOVE && evt.originalEvent.button === 0){
                    this.activateDrag(evt)
                } else if (MODE === MODE_RESIZE && evt.originalEvent.button === 0){
                    this.activateResize(evt)
                } else if (MODE === MODE_DELETE && evt.originalEvent.button === 0){
                    this.delete()
                } else if (MODE === MODE_ZINDEX && evt.originalEvent.button === 0){
                    moveElementZindexToFront(this)
                }
            })

            elem.on('contextmenu', (evt)=>{
                evt.preventDefault()
                this.openSettings(evt)
            })

            return elem
        }

        activateDrag(evt){
            this.offX = window.scrollX + evt.clientX - this.x
            this.offY = window.scrollY + evt.clientY - this.y


            $(global).on('mousemove', (evt)=>{
                this.drag(evt)
            })
            $(global).on('mouseup', ()=>{
                this.deactivateDrag()
            })
        }

        drag(evt){
            this.x = (window.scrollX + evt.clientX) - this.offX
            this.y = (window.scrollY + evt.clientY) - this.offY

            this.refreshPosition()
        }

        deactivateDrag(){
            $(global).off('mousemove')
            $(global).off('mouseup')
        }

        activateResize(evt){
            this.offX = (window.scrollX + evt.clientX) - this.width
            this.offY = (window.scrollY + evt.clientY) - this.height

            $(global).on('mousemove', (evt)=>{
                this.resize(evt)
            })
            $(global).on('mouseup', ()=>{
                this.deactivateResize()
            })
        }

        resize(evt){
            this.width = (window.scrollX + evt.clientX) - this.offX
            this.height = (window.scrollY + evt.clientY) - this.offY

            this.refreshPosition()
        }

        deactivateResize(){
            $(global).off('mousemove')
            $(global).off('mouseup')
        }

        deactivate(){
            this.deactivateDrag()
            this.deactivateResize()
            this.closeSettings()
        }

        refreshPosition(){
            /* x */
            if(this.x < 0){
                this.x = 0
            }
            if(this.x >= maxX){
                this.x = maxX-1
            }
            /* y */
            if(this.y < 0){
                this.y = 0
            }
            if(this.y >= maxY){
                this.y = maxY-1
            }
            /* width limit */
            if(this.x + this.width > maxX){
                this.width = maxX - this.x
            }
            if(this.width < this.minWidth){
                this.width = this.minWidth
            }
            /* height limit */
            if(this.y + this.height > maxY){
                this.height = maxY - this.y
            }
            if(this.height < this.minHeight){
                this.height = this.minHeight
            }

            this.dom.css({
                left: this.x,
                top: this.y,
                width: this.width,
                height: this.height
            })
        }

        refreshZindex(){
            this.dom.css({
                'z-index': this.zindex
            })
        }

        refresh(){        
            this.dom.css({
                background: makeValidHexOrEmpty(this.settings.background.value),
                'border-style': 'solid',
                'border-color': makeValidHexOrEmpty(this.settings.border.value),
                'border-width': makeValidPixelOrZero(this.settings.borderWidth.value)
            })            
            this.layerListEntry.find('.background').css('background', makeValidHexOrEmpty(this.settings.background.value))

            this.refreshPosition()
            this.refreshZindex()
            this.refreshContent()
        }

        openSettings(evt){
            if(evt) evt.stopPropagation()
            this.dom.addClass('settings_open')
            this.closeHandler = ()=>{
                this.closeSettings()
            }
            $(global).on('mousedown', this.closeHandler)
        }

        closeSettings(){
            this.dom.removeClass('settings_open')
            $(global).off('mousedown', this.closeHandler)
        }

        delete(){
            this.dom.remove()
            this.layerListEntry.remove()
            allElements.splice(this.zindex-1,1)
            resortAllElements()
        }
    }


    /* Element Subclasses */

    class Rectangle extends Element {

    }

    class Label extends Element {

        beforeBuild(){
            let additionalSettings = {
                color: {
                    type: 'color',
                    value: '000'
                },
                text: {
                    type: 'text',
                    value: 'label'
                }
            }
            Object.assign(this.settings, additionalSettings)
        }

        buildContent(){
            return $('<span class="text">' + this.settings.text.value + '</span>')
        }

        refreshContent(){
            this.content.find('.text')
                .css({
                    color: makeValidHexOrEmpty(this.settings.color.value)
                })
                .html(this.settings.text.value)

            this.content.css('cssText', 'display: flex; flex-direction: column; justify-content: center; align-items: center;')
        }
    }

    class Button extends Element {

        beforeBuild(){
            let additionalSettings = {
                background: {
                    type: 'color',
                    value: '000'
                },
                backgroundOn: {
                    type: 'color',
                    value: 'fff'
                },
                borderOn: {
                    type: 'color',
                    value: 'aaa'
                },
                color: {
                    type: 'color',
                    value: 'fff'
                },
                colorOn: {
                    type: 'color',
                    value: '000'
                },
                text: {
                    type: 'text',
                    value: 'Off'
                },
                textOn: {
                    type: 'text',
                    value: 'On'
                },
                isToggle: {
                    type: 'checkbox',
                    value: false
                }
            }
            Object.assign(this.settings, additionalSettings)
        }

        buildContent(){
            return $('<span class="text">' + this.settings.text.value + '</span>')
        }

        refreshContent(){
            this.content.find('.text')
                .css({
                    color: makeValidHexOrEmpty(this.settings.color.value)
                })
                .html(this.settings.text.value)
            this.content.css('cssText', 'display: flex; flex-direction: column; justify-content: center; align-items: center;')
        }
    }

    const ELEMENTS = [{
        name: 'Rectangle',
        object: Rectangle
    },{
        name: 'Label',
        object: Label
    },{
        name: 'Button',
        object: Button
    }]



    /* helpers */

    function makeValidHexOrEmpty(hexstring){
        hexstring = hexstring.trim()
        let match = hexstring.match(/^#?([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/)

        if(!match){
            return ''
        }

        let hex = match[1]
        if(hex.length === 3){
            return '#' + hex + hex
        } else {
            return '#' + hex
        }
    }

    function makeValidPixelOrZero(pxstring){
        pxstring = ('' + pxstring).replace('px', '').trim()
        let int = parseInt(pxstring)
        if(isNaN(int)){
            let float = parseFloat(pxstring)
            if(isNaN(float)){
                return '0'
            }

            return float
        }

        return int
    }

    const HEX_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
    function createRandomColor(){
        let res = '#'
        for(let i = 0; i<6; i++){
            res += HEX_CHARS[Math.floor(Math.random()*16)]
        }
        return res
    }

    function resortAllElements(){
        allElements.sort((a, b)=>{
            if(a.zindex < b.zindex){
                return -1
            }

            if(a.zindex > b.zindex){
                return 1
            }

            return 0
        })

        for(let i = 0; i < allElements.length; i++){
            allElements[i].zindex = i+1
            allElements[i].refreshZindex()
        }


        /* resort layer list */
        let tmp = $('<div></div>')
        gcontainer.find('.element_layer_list').children().appendTo(tmp)
        for(let e of allElements){
            gcontainer.find('.element_layer_list').append(e.layerListEntry)
        }
    }

    function moveElementZindexToFront(element){
        element.zindex = allElements.length * 2 /* to be sure its the biggest value */
        
        element.layerListEntry.addClass('light_up')
        resortAllElements()
        setTimeout(()=>{
            element.layerListEntry.removeClass('light_up')
        }, 500)
    }

    function moveElementZindexDown(element){
        if(element.zindex <= 1){
            return
        }
        let originalZindex = element.zindex
        element.zindex = allElements[originalZindex - 1 - 1].zindex
        allElements[originalZindex - 1 - 1].zindex = originalZindex
        resortAllElements()
    }

     function moveElementZindexUp(element){
        if(element.zindex >= allElements.length){
            return
        }
        let originalZindex = element.zindex
        element.zindex = allElements[originalZindex - 1 + 1].zindex
        allElements[originalZindex - 1 + 1].zindex = originalZindex
        resortAllElements()
    }


    return {
        Element: Element,
        Label: Label
    }

})(window, jQuery)


