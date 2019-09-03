var UI_BUILDER = ((global, $)=>{
    "use strict";

    let maxX
    let maxY

    let canvas_container

    

    const currentElements = []


    let MODE_MOVE = 'move'
    let MODE_RESIZE = 'resize'
    let MODE_SETTINGS = 'settings'
    let MODE_DELETE = 'delete'
    let MODE_ZINDEX = 'zindex'

    let MODE = MODE_MOVE

    let allElements = []

    let gcontainer

    let uuid = 1

    const LIBS = {
        IS_IN_RECT: 'is_in_rect',
        SET_COLOR: 'set_color'
    }

    const DEFAULT_LIBS = {
        [LIBS.SET_COLOR]: true
    }

    const LIBS_CODE = {
        is_in_rect: 'function isInRect(x,y,w,h,px,py)\nreturn px>=x and px<=x+w and py>=y and py<=y+h\nend',
        set_color: 'function setC(r,g,b,a)\nscreen.setColor(r,g,b,a)\nend'
    }

    $(global).on('load', ()=>{
        init($('#ui-builder-container'))
    })

    function init(container){
        gcontainer = container
        container.append('<div class="element_list"></div>')

        canvas_container = $('<div class="canvas_container" mode="move"></div>')
        container.append(canvas_container)


        $('#monitor-size').on('change', ()=>{
            recalculateSize()
        })

        $('#ui-builder-zoom').on('change', ()=>{
            recalculateSize()
            $('[for="ui-builder-zoom"] span').html($('#ui-builder-zoom').val() + 'x')
        })

        recalculateSize()
        $('[for="ui-builder-zoom"] span').html($('#ui-builder-zoom').val() + 'x')


        container.append('<div class="controls" mode="move"></div>')
        container.find('.controls').append('<div class="control move"><span class="icon-enlarge"></span>&nbsp;Move</div>')
        container.find('.controls').append('<div class="control resize"><span class="icon-enlarge2"></span>&nbsp;Size</div>')
        container.find('.controls').append('<div class="control settings"><span class="icon-equalizer"></span>&nbsp;Setup</div>')
        container.find('.controls').append('<div class="control delete"><span class="icon-cancel-circle"></span>&nbsp;Delete</div>')
        container.find('.controls').append('<div class="control zindex"><span class="icon-stack"></span>&nbsp;To Top</div>')

        container.find('.controls .control.move').on('click', ()=>{
            deactivateAllElements()
            container.find('.controls, .canvas_container').attr('mode', MODE_MOVE)
            MODE = MODE_MOVE
        })
        container.find('.controls .control.resize').on('click', ()=>{
            deactivateAllElements()
            container.find('.controls, .canvas_container').attr('mode', MODE_RESIZE)
            MODE = MODE_RESIZE
        })
        container.find('.controls .control.settings').on('click', ()=>{
            deactivateAllElements()
            container.find('.controls, .canvas_container').attr('mode', MODE_SETTINGS)
            MODE = MODE_SETTINGS
        })
        container.find('.controls .control.delete').on('click', ()=>{
            deactivateAllElements()
            container.find('.controls, .canvas_container').attr('mode', MODE_DELETE)
            MODE = MODE_DELETE
        })
        container.find('.controls .control.zindex').on('click', ()=>{
            deactivateAllElements()
            container.find('.controls, .canvas_container').attr('mode', MODE_ZINDEX)
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

        $('#generate-ui-builder-lua-code').on('click', ()=>{
            generateLuaCode()
        })
    }

    function deactivateAllElements(){
        for(let e of allElements){
            e.deactivate()
        }
    }

    function recalculateSize(){
        canvas_container.width( uiZoom(CANVAS.width()) )
        canvas_container.height( uiZoom(CANVAS.height()) ) 
        
        maxX = CANVAS.width()
        maxY = CANVAS.height()

        canvas_container.find('.element').css('font-size', uiZoom(6) + 'px')

        for(let e of allElements){
            e.refreshPosition()
        }
    }

    class Element {

        constructor(params, container){
            if(!container){
                return console.error('UI_BUILDER.Element:', 'argument "container" is missing!')
            }
            this.id = 'i' + uuid
            uuid++

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
            /* put special logic of subclasses in here
            *  register custom settings here
            */        
        }

        buildContent(){
            /* put special logic of subclasses in here
            *  called when the content html is build (only on instantiation)
            */      
        }

        refreshContent(){
            /* put special logic of subclasses in here
            *  called everytime a setting changed
            */    
        }

        buildLuaCode(){
            /* returns the lua script code for this element
            *
            *  Structure:
            *  {
            *    init: 'code put on the beginning of the script',
            *    onTick: 'code put inside the onTick function',
            *    onDraw: 'code put inside the onDraw function',
            *    lib: 'code put at the end of the script (e.g. helper functions)'
            *  }
            */
            let onDraw = ''
            if(this.settings.border){
                onDraw += luaBuildSetColor(this.settings.border.value) + '\n'
                + 'screen.drawRectF(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ')\n'
            }
            if(this.settings.background && this.settings.borderWidth){
                onDraw += luaBuildSetColor(this.settings.background.value) + '\n'
                + 'screen.drawRectF(' + (this.x + this.settings.borderWidth.value) + ',' + (this.y + this.settings.borderWidth.value) + ',' + (this.width - 2 * this.settings.borderWidth.value) + ',' + (this.height - 2 * this.settings.borderWidth.value) + ')'
            }
            return {
                init: '',
                onTick: '',
                onDraw: onDraw,
                libs: DEFAULT_LIBS
            }
        }

        buildDom(){
            let that = this

            let elem = $('<div class="element ' + this.constructor.name.toLowerCase() + '"></div>')
            elem.css('font-size', uiZoom(6) + 'px')

            elem.on('mouseenter', ()=>{
                elem.addClass('delete_overlay')
            })
            elem.on('mouseleave', ()=>{
                elem.removeClass('delete_overlay')
            })

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
                        s.value = value
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
                    let val = set.find('input').val()
                    if(s.type === 'number'){
                        let parsed = parseInt(val)
                        if(isNaN(parsed)){
                            parsed = parseFloat(val)
                        }
                        s.value = isNaN(parsed) ? val : parsed
                    } else if(s.type === 'checkbox'){
                        s.value = set.find('input').prop('checked') === true
                    } else {
                        s.value = val
                    }
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
            this.offX = window.scrollX + evt.clientX - uiZoom(this.x)
            this.offY = window.scrollY + evt.clientY - uiZoom(this.y)

            this.dragLambda = (evt)=>{
                this.drag(evt)
            }
            $(gcontainer).on('mousemove', this.dragLambda)
            $(gcontainer).on('mouseup', this.deactivateDrag)
        }

        drag(evt){
            this.x = uiUnzoom((window.scrollX + evt.clientX) - this.offX)
            this.y = uiUnzoom((window.scrollY + evt.clientY) - this.offY)
            this.refreshPosition()
        }

        deactivateDrag(){
            $(gcontainer).off('mousemove', this.dragLambda)
            $(gcontainer).off('mouseup', this.deactivateDrag)
        }

        activateResize(evt){
            this.offX = (window.scrollX + evt.clientX) - uiZoom(this.width)
            this.offY = (window.scrollY + evt.clientY) - uiZoom(this.height)

            this.resizeLambda = (evt)=>{
                this.resize(evt)
            }
            $(gcontainer).on('mousemove', this.resizeLambda)
            $(gcontainer).on('mouseup', this.deactivateResize)
        }

        resize(evt){
            this.width = uiUnzoom((window.scrollX + evt.clientX) - this.offX)
            this.height = uiUnzoom((window.scrollY + evt.clientY) - this.offY)

            this.refreshPosition()
        }

        deactivateResize(){
            $(gcontainer).off('mousemove', this.resizeLambda)
            $(gcontainer).off('mouseup', this.deactivateResize)
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
                left: uiZoom(this.x),
                top: uiZoom(this.y),
                width: uiZoom(this.width),
                height: uiZoom(this.height)
            })
        }

        refreshZindex(){
            this.dom.css({
                'z-index': this.zindex
            })
        }

        refresh(){
            try {
                if(this.settings.background && this.settings.borderWidth){
                    this.dom.css({
                        background: makeValidHexOrEmpty(this.settings.background.value),
                        'border-style': 'solid',
                        'border-color': makeValidHexOrEmpty(this.settings.border.value),
                        'border-width': makeValidPixelOrZero(this.settings.borderWidth.value)
                    })
                }
                this.layerListEntry.find('.background').css('background', makeValidHexOrEmpty(this.settings.background.value))
            } catch (ex){
                console.warn('catched error while Element.refresh():', this, ex)
            }

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
            $(gcontainer).on('mousedown', this.closeHandler)
        }

        closeSettings(){
            this.dom.removeClass('settings_open')
            $(gcontainer).off('mousedown', this.closeHandler)
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

    class Line extends Element {

        beforeBuild(){
            this.settings = {
                background: {
                    type: 'color',
                    value: createRandomColor()
                },
                reverse: {
                    type: 'checkbox',
                    value: false
                }
            }
        }

        buildContent(){
            if(this.settings.reverse.value){
                return '<svg viewBox="0 0 ' + uiZoom(this.width) + ' ' + uiZoom(this.height) + '"><polyline points="0,' + uiZoom(this.height) + ' ' + uiZoom(this.width) + ',0" stroke-width="' + uiZoom(1) + '" stroke="' + makeValidHexOrEmpty(this.settings.background.value) + '"></polyline></svg>'
            } else {
                return '<svg viewBox="0 0 ' + uiZoom(this.width) + ' ' + uiZoom(this.height) + '"><polyline points="0,0 ' + uiZoom(this.width) + ',' + uiZoom(this.height) + '" stroke-width="' + uiZoom(1) + '" stroke="' + makeValidHexOrEmpty(this.settings.background.value) + '"></polyline></svg>'
            }
        }

        refreshContent(){
            this.content.html(this.buildContent())
        }

        refreshPosition(){
            super.refreshPosition()
            this.refreshContent()
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()

            if(this.settings.reverse.value){
                return {
                    init: superRet.init,
                    onDraw: superRet.onDraw + '\n'
                        + luaBuildSetColor(this.settings.background.value) + '\n'
                        + 'screen.drawLine(' + this.x + ', ' + (this.y + this.height) + ', ' + (this.x + this.width) + ', ' + this.y + ')',
                    onTick: superRet.onTick,
                    libs: superRet.libs
                }
            } else {
                return {
                    init: superRet.init,
                    onDraw: superRet.onDraw + '\n'
                        + luaBuildSetColor(this.settings.background.value) + '\n'
                        + 'screen.drawLine(' + this.x + ', ' + this.y + ', ' + (this.x + this.width) + ', ' + (this.y + this.height) + ')',
                    onTick: superRet.onTick,
                    libs: superRet.libs
                }
            }
        }
    }

    class Label extends Element {

        beforeBuild(){
            let additionalSettings = {
                color: {
                    type: 'color',
                    value: '#000'
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

        buildLuaCode(){
            let superRet = super.buildLuaCode()
            return {
                init: superRet.init,
                onDraw: superRet.onDraw + '\n'
                    + luaBuildSetColor(this.settings.color.value) + '\n'
                    + 'screen.drawTextBox(' + this.x + ', ' + this.y + ', ' + this.width + ', ' + this.height + ', "' + this.settings.text.value + '", 0, 0)',
                onTick: superRet.onTick,
                libs: superRet.libs
            }
        }
    }

    class Button extends Element {

        beforeBuild(){
            let additionalSettings = {
                background: {
                    type: 'color',
                    value: '#000'
                },
                backgroundOn: {
                    type: 'color',
                    value: '#fff'
                },
                borderOn: {
                    type: 'color',
                    value: '#aaa'
                },
                color: {
                    type: 'color',
                    value: '#fff'
                },
                colorOn: {
                    type: 'color',
                    value: '#000'
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
                },
                channel: {
                    type: 'number',
                    value: 1
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

        buildLuaCode(){
            let superRet = super.buildLuaCode()
            if(this.settings.isToggle.value){
                return {
                    init: superRet.init + '\n' + this.id + 'Toggled = false\n' + this.id + 'ToggledP = false\n',
                    onDraw: superRet.onDraw + 'text="' + this.settings.text.value + '"\n'
                        + 'if ' + this.id + 'Toggled then\ntext="' + this.settings.textOn.value + '"\nend\n'
                        + 'if ' + this.id + 'Toggled then\n' + luaBuildSetColor(this.settings.backgroundOn.value) + '\n'
                        + 'screen.drawRectF(' + this.x + ', ' + this.y + ', ' + this.width + ', ' + this.height + ')\nend\n'
                        + 'if ' + this.id + 'Toggled then\n' + luaBuildSetColor(this.settings.colorOn.value) + '\n'
                        + 'else\n' + luaBuildSetColor(this.settings.color.value) + '\nend\n'
                        + 'screen.drawTextBox(' + this.x + ', ' + this.y + ', ' + this.width + ', ' + this.height + ', "' + this.settings.text.value + '", 0, 0)',
                    onTick: superRet.onTick + '\n'
                        + 'if (isP1 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in1X,in1Y)) or (isP2 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in1X,in1Y)) then\n'
                        + this.id + 'ToggledP=true\n'
                        + 'end\n'
                        + 'if not (isP1 or isP2) and ' + this.id + 'ToggledP then\n'
                        + this.id + 'ToggledP = false\n'
                        + this.id + 'Toggled = not ' + this.id + 'Toggled\n'
                        + 'end\n'
                        + 'output.setBool(' + this.settings.channel.value + ', ' + this.id + 'Toggled)',
                    libs: Object.assign(superRet.libs, {[LIBS.IS_IN_RECT]:true})
                }
            } else {
                return {
                    init: superRet.init + '\n' + this.id + 'Toggled = false\n',
                    onDraw: superRet.onDraw + 'text="' + this.settings.text.value + '"\n'
                        + 'if ' + this.id + 'Toggled then\ntext="' + this.settings.textOn.value + '"\nend\n'
                        + 'if ' + this.id + 'Toggled then\n' + luaBuildSetColor(this.settings.backgroundOn.value) + '\n'
                        + 'screen.drawRectF(' + this.x + ', ' + this.y + ', ' + this.width + ', ' + this.height + ')\nend\n'
                        + 'if ' + this.id + 'Toggled then\n' + luaBuildSetColor(this.settings.colorOn.value) + '\n'
                        + 'else\n' + luaBuildSetColor(this.settings.color.value) + '\nend\n'
                        + 'screen.drawTextBox(' + this.x + ', ' + this.y + ', ' + this.width + ', ' + this.height + ', "' + this.settings.text.value + '", 0, 0)',
                    onTick: superRet.onTick + '\n'
                        + 'if (isP1 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in1X,in1Y)) or (isP2 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in1X,in1Y)) then\n'
                        + this.id + 'Toggled=true\n'
                        + 'else\n'
                        + this.id + 'Toggled=false\n'
                        + 'end\n'
                        + 'output.setBool(' + this.settings.channel.value + ', ' + this.id + 'Toggled)',
                    libs: Object.assign(superRet.libs, {[LIBS.IS_IN_RECT]:true})
                }
            }
        }
    }

    const ELEMENTS = [{
        name: 'Rectangle',
        object: Rectangle
    },{
        name: 'Line',
        object: Line
    },{
        name: 'Label',
        object: Label
    },{
        name: 'Button',
        object: Button
    }]


    function generateLuaCode(){
        try {
            const fields = ['init', 'onTick', 'onDraw']
            let code = {}
            for(let i of fields){
                code[i] = ''
            }

            let libs = {}

            for(let e of allElements){
                let c = e.buildLuaCode()
                Object.assign(libs, c.libs)
                for(let i of fields){
                    if(typeof c[i] === 'string'){
                        code[i] += '\n\n' + c[i]
                    }
                }
            }

            let libCode = ''
            for(let l in libs){
                libCode += LIBS_CODE[l] + '\n\n'
            }

            let allCode = code.init
                + '\nfunction onTick()\n'
                    + 'isP1 = input.getBool(1)\nisP2 = input.getBool(2)\n\nin1X = input.getNumber(3)\nin1Y = input.getNumber(4)\nin2X = input.getNumber(5)\nin2Y = input.getNumber(6)\n\n'
                    + code.onTick + '\nend\n'
                + '\nfunction onDraw()\n' + code.onDraw + '\nend\n'
                + '\n' + libCode

            allCode = allCode.replace(/[\n]{3,}/g, '\n\n')

            $('#ui-builder-code').show()
            uiBuilderEditor.setValue(allCode)
        } catch (ex){
            console.error('Error building lua code', ex)
            YYY.alert('Error building lua code.\nPlease contact the developer.')
        }
    }

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

    function makeColorCorrectedRGBString(hex){
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        result = result ? {
            r: Math.floor(parseInt(result[1], 16) * 0.38),
            g: Math.floor(parseInt(result[2], 16) * 0.38),
            b: Math.floor(parseInt(result[3], 16) * 0.38)
          } : '';


        return result.r + ',' + result.g + ',' + result.b
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

    /* build lua code helpers */
    function luaBuildSetColor(hex){
        return 'setC(' + makeColorCorrectedRGBString(hex) + ')'
    }

    return {
        Element: Element,
        Label: Label,
        allElements: ()=>{
            return allElements
        }
    }

})(window, jQuery)

function uiZoom(v){
    return v * $('#ui-builder-zoom').val()
}

function uiUnzoom(v){
    return v / $('#ui-builder-zoom').val()
}


