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
    let MODE_ZINDEX = 'zindex'

    let MODE = MODE_MOVE

    let allElements = []

    $(global).on('load', init)

    function init(){

        $('#ui-builder-container').append('<div class="element_list"></div>')
        canvas = $('<canvas/>')

        $('#monitor-size').on('change', (e)=>{
            recalculateCanvas()
        })
        recalculateCanvas()

        ctx = canvas.get(0).getContext('2d')
        let canvas_container = $('<div class="canvas_container"></div>')
        $('#ui-builder-container').append(canvas_container)
        $('#ui-builder-container').find('.canvas_container').append(canvas)


        $('#ui-builder-container').append('<div class="controls" mode="move"></div>')
        $('#ui-builder-container .controls').append('<div class="control move"><span class="icon-enlarge"></span>&nbsp;Move</div>')
        $('#ui-builder-container .controls').append('<div class="control resize"><span class="icon-enlarge2"></span>&nbsp;Size</div>')
        $('#ui-builder-container .controls').append('<div class="control settings"><span class="icon-equalizer"></span>&nbsp;Setup</div>')
        $('#ui-builder-container .controls').append('<div class="control zindex"><span class="icon-stack"></span>&nbsp;Layer</div>')

        $('#ui-builder-container .controls .control.move').on('click', ()=>{
            deactivateAllElements()
            $('#ui-builder-container .controls').attr('mode', MODE_MOVE)
            MODE = MODE_MOVE
        })
        $('#ui-builder-container .controls .control.resize').on('click', ()=>{
            deactivateAllElements()
            $('#ui-builder-container .controls').attr('mode', MODE_RESIZE)
            MODE = MODE_RESIZE
        })
        $('#ui-builder-container .controls .control.settings').on('click', ()=>{
            deactivateAllElements()
            $('#ui-builder-container .controls').attr('mode', MODE_SETTINGS)
            MODE = MODE_SETTINGS
        })
        $('#ui-builder-container .controls .control.zindex').on('click', ()=>{
            deactivateAllElements()
            $('#ui-builder-container .controls').attr('mode', MODE_ZINDEX)
            MODE = MODE_ZINDEX
        })

        
        for(let e of ELEMENTS){
            let entry = $('<div class="element">' + e.name + '</div>')
            entry.on('click', ()=>{
                currentElements.push(new e.object(false, canvas_container))
            })
            $('#ui-builder-container .element_list').append(entry)
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
            console.log('new Element')
            if(!container){
                return console.error('UI_BUILDER.Element:', 'argument "container" is missing!')
            }

            allElements.push(this)
            this.zindex = allElements.length

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

            let elem = $('<div class="element"></div>')

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
                    this.activateDrag()                
                } else if (MODE === MODE_RESIZE && evt.originalEvent.button === 0){
                    this.activateResize()
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
            this.offX = $('#ui-builder-container').find('.canvas_container').offset().left - window.scrollX
            this.offY = $('#ui-builder-container').find('.canvas_container').offset().top - window.scrollY

            $(global).on('mousemove', (evt)=>{
                this.drag(evt)
            })
            $(global).on('mouseup', ()=>{
                this.deactivateDrag()
            })
        }

        drag(evt){
            this.x = evt.clientX - this.offX
            this.y = evt.clientY - this.offY

            this.refreshPosition()
        }

        deactivateDrag(){
            $(global).off('mousemove')
            $(global).off('mouseup')
        }

        activateResize(evt){
            console.log('activate resize')
            this.offX = $('#ui-builder-container').find('.canvas_container').offset().left - window.scrollX
            this.offY = $('#ui-builder-container').find('.canvas_container').offset().top - window.scrollY

            $(global).on('mousemove', (evt)=>{
                this.resize(evt)
            })
            $(global).on('mouseup', ()=>{
                this.deactivateResize()
            })
        }

        resize(evt){
            this.width = evt.clientX - this.offX
            this.height = evt.clientY - this.offY

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
            console.log(this.x, this.y)
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
    }


    /* Element Subclasses */

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
        object: Element
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

    function moveElementZindexToFront(element){
        element.zindex = allElements.length * 2 /* to be sure its the biggest value */
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
    }


    return {
        Element: Element,
        Label: Label
    }

})(window, jQuery)


