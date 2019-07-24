var UI_BUILDER = ((global, $)=>{
    "use strict";

    let maxX
    let maxY

    let canvas
    let ctx

    const ELEMENTS = [{
        name: 'Label',
        object: Label
    }]

    const currentElements = []

    

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

        
        for(let e of ELEMENTS){
            let entry = $('<div class="element">' + e.name + '</div>')
            entry.on('click', ()=>{
                currentElements.push(e.object.apply(Object.create(Element.prototype), [false, canvas_container]))
            })
            $('#ui-builder-container .element_list').append(entry)
        }
    }

    function recalculateCanvas(){
        canvas.width( CANVAS.width() )
        canvas.height( CANVAS.height() ) 
        
        maxX = canvas.width()
        maxY = canvas.height()       
    }

    function Element(params, container){
        if(!container){
            return console.error('UI_BUILDER.Element:', 'argument "container" is missing!')
        }

        this.x = 0
        this.y = 0
        this.width = 24
        this.height = 8

        this.settings = {
            background: {
                type: 'color',
                value: 'fff'
            },
            color: {
                type: 'color',
                value: '000'
            },
            text: {
                type: 'text',
                value: ''
            }
        }

        this.dom = this.buildDom()

        $(container).append(this.dom)

        this.refresh()
    }

    Element.prototype.buildDom = function(){
        let that = this

        let elem = $('<div class="element"><span class="text">' + this.text + '</span><div class="settings"><span class="close">x</span></div></div>')

        for(let k of Object.keys(this.settings)){
            let s = this.settings[k]
            let set = $('<div class="setting"><span class="name">' + k + '</span><input type="' + s.type + '" value="' + makeValidHexOrEmpty(s.value) + '"/></div>')
            set.on('change input', ()=>{
                s.value = set.find('input').val()
                that.refresh()
            })

            elem.find('.settings').append(set)
        }

        elem.find('.settings').on('click', (evt)=>{
            evt.stopPropagation()
        })

        elem.find('.close').on('click', ()=>{
            this.closeSettings()
        })

        elem.on('mousedown', ()=>{
            this.activateDrag()
        })
        elem.on('contextmenu', (evt)=>{
            evt.preventDefault()
            this.openSettings()
        })

        return elem
    }

    Element.prototype.activateDrag = function(evt){
        this.offX = $('#ui-builder-container').find('.canvas_container').offset().left - window.scrollX
        this.offY = $('#ui-builder-container').find('.canvas_container').offset().top - window.scrollY

        $(global).on('mousemove', (evt)=>{
            this.drag(evt)
        })
        $(global).on('mouseup', ()=>{
            this.deactivateDrag()
        })
    }

    Element.prototype.drag = function(evt){
        this.x = evt.clientX - this.offX
        this.y = evt.clientY - this.offY

        this.refreshPosition()
    }

    Element.prototype.deactivateDrag = function(){
        $(global).off('mousemove')
        $(global).off('mouseup')
    }

    Element.prototype.refreshPosition = function(){
        console.log(this.x, this.y)
        if(this.x < 0){
            this.x = 0
        }
        if(this.y < 0){
            this.y = 0
        }
        if(this.x + this.width > this.maxX){
            this.x = this.maxX - this.width
        }
        if(this.y + this.height > this.maxY){
            this.y = this.maxY - this.height
        }

        this.dom.css({
            left: this.x,
            top: this.y,
            width: this.width,
            height: this.height
        })
    }

    Element.prototype.refresh = function(){        
        this.dom.css({
            background: makeValidHexOrEmpty(this.settings.background.value),
            color: makeValidHexOrEmpty(this.settings.color.value)
        })
        this.dom.find('.text').html(this.settings.text.value)
        this.refreshPosition()
    }

    Element.prototype.openSettings = function(){
        this.dom.addClass('settings_open')
        this.closeHandler = ()=>{
            this.closeSettings()
        }
        $(global).on('click', this.closeHandler)
    }

    Element.prototype.closeSettings = function(){
        console.log('closeSettings')
        this.dom.removeClass('settings_open')
        $(global).off('click', this.closeHandler)
    }


    function Label(params, container){
        Element.apply(this, arguments)
        this.text = "wuff"
        console.log("this", this)
    }

    Label.prototype = Object.create(Element.prototype)
    Label.prototype.constructor = Label




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



    return {
        Element: Element,
        Label: Label
    }

})(window, jQuery)


