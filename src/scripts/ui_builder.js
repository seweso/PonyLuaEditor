var UI_BUILDER = (($)=>{
    "use strict";

    let maxX
    let maxY

    let canvas_container

    


    let MODE_MOVE = 'move'
    let MODE_RESIZE = 'resize'
    let MODE_SETTINGS = 'settings'
    let MODE_DELETE = 'delete'
    let MODE_ZINDEX = 'zindex'
    let MODE_COLORCOPY = 'colorcopy'

    let MODE = MODE_MOVE

    let allElements = []

    let gcontainer

    let uuid = 1

    const LIBS = {
        IS_IN_RECT: 'is_in_rect',
        IS_IN_RECT_O: 'is_in_rect_o',
        SET_COLOR: 'set_color',
        ROTATE_POINT: 'rotate_point'
    
}
    const DEFAULT_LIBS = {
        [LIBS.SET_COLOR]: true
    }

    const LIBS_CODE = {
        is_in_rect: 'function isInRect(x,y,w,h,px,py)\nreturn px>=x and px<=x+w and py>=y and py<=y+h\nend',
        is_in_rect_o: 'function isInRectO(o,px,py)\nreturn px>=o.x and px<=o.x+o.w and py>=o.y and py<=o.y+o.h\nend',
        set_color: 'function setC(r,g,b,a)\nif a==nil then a=255 end\nscreen.setColor(r,g,b,a)\nend',
        rotate_point: 'function rotatePoint(cx,cy,angle,px,py)\ns=math.sin(angle)\nc=math.cos(angle)\npx=px-cx\npy=py-cy\nxnew=px*c-py*s\nynew=px*s+py*c\npx=xnew+cx\npy=ynew+cy\nreturn {x=px,y=py}\nend'
    }

    LOADER.on(LOADER.EVENT.CANVAS_READY, ()=>{
        init($('#ui-builder-container'))
    })

    function init(container){
        gcontainer = container

        container.append('<div class="element_list"></div>')

        canvas_container = $('<div class="canvas_container" mode="move"></div>')
        container.append(canvas_container)


        $('#monitor-size').on('change', ()=>{
            setTimeout(recalculateSize, 10)
        })

        $('#ui-builder-zoom').on('change', ()=>{
            recalculateSize()
            $('[for="ui-builder-zoom"] span').text($('#ui-builder-zoom').val() + 'x')
        })

        recalculateSize()
        $('[for="ui-builder-zoom"] span').text($('#ui-builder-zoom').val() + 'x')


        container.append('<div class="controls" mode="move"></div>')
        container.find('.controls').append('<div class="control move"><span class="icon-enlarge"></span>&nbsp;Move</div>')
        container.find('.controls').append('<div class="control resize"><span class="icon-enlarge2"></span>&nbsp;Size</div>')
        container.find('.controls').append('<div class="control settings"><span class="icon-equalizer"></span>&nbsp;Setup</div>')
        container.find('.controls').append('<div class="control delete"><span class="icon-cancel-circle"></span>&nbsp;Delete</div>')
        container.find('.controls').append('<div class="control zindex"><span class="icon-stack"></span>&nbsp;To Top</div>')
        container.find('.controls').append('<div class="control colorcopy"><span class="icon-eyedropper"></span>&nbsp;Color&nbsp;<span class="selected_color"></span></div>')

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
        container.find('.controls .control.colorcopy').on('click', ()=>{
            deactivateAllElements()
            container.find('.controls, .canvas_container').attr('mode', MODE_COLORCOPY)
            MODE = MODE_COLORCOPY
        })


        container.append('<div class="element_layer_list"></div>')

        
        for(let e of ELEMENTS){
            let entry = $('<div class="element ' + e.name.toLowerCase() + '">' + e.name + '</div>')
            entry.on('click', ()=>{
                new e.object(false, canvas_container)
            })
            container.find('.element_list').append(entry)
        }

        $('#generate-ui-builder-lua-code').on('click', ()=>{
            REPORTER.report(REPORTER.REPORT_TYPE_IDS.generateUIBuilderCode)

            generateLuaCode()
        })

        loadFromStorage()

        LOADER.done(LOADER.EVENT.UI_BUILDER_READY)
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
                + '<div class="left"><span class="name">' + this.constructor.name.toLowerCase() + '</span><div class="background"></div></div>'
                + '<div class="lcontrols"><span class="up icon-circle-up"></span><span class="dup icon-copy"></span><span class="down icon-circle-down"></span></div>'
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
            this.layerListEntry.find('.dup').on('click', ()=>{
                this.layerListEntry.addClass('light_up')
                duplicateElement(this)
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

            this.minWidth = 3
            this.minHeight = 3

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

            if(params && params.settings){
                this.applySettings(params.settings)
            }

            this.dom = this.buildDom()
            $(container).append(this.dom)

            this.refresh()
        }

        applySettings(settings){
            if(typeof settings.x === 'number'){
                this.x = Math.round(settings.x)
            }
            if(typeof settings.y === 'number'){
                this.y = Math.round(settings.y)
            }
            if(typeof settings.width === 'number'){
                this.width = Math.round(settings.width)
            }
            if(typeof settings.height === 'number'){
                this.height = Math.round(settings.height)
            }
            for(let s in settings){
                if(typeof this.settings[s] !== 'undefined' && this.settings[s] != null){
                    if(settings[s] instanceof Object){
                        this.settings[s].value = settings[s].value
                    } else {
                        this.settings[s].value = settings[s]
                    }
                }
            }
        }

        generateSettings(){
            let ret = {}
            for(let s in this.settings){
                ret[s] = this.settings[s].value
            }
            ret.x=this.x
            ret.y=this.y
            ret.width=this.width
            ret.height=this.height
            return ret
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
                let set = $('<div class="setting"><span class="name">' + k + '</span><input type="' + s.type + '" value="' + value + '" ' + (s.type === 'number' ? 'step="0.01"' : '') + '/></div>')
                set.on('change input', ()=>{
                    let val = set.find('input').val()
                    if(s.type === 'number'){
                        let parsed = parseFloat(val)
                        if(isNaN(parsed)){
                            parsed = parseInt(val)
                        }
                        s.value = isNaN(parsed) ? val : parsed
                    } else if(s.type === 'checkbox'){
                        s.value = set.find('input').prop('checked') === true
                    } else {
                        s.value = val
                    }
                    that.refresh()
                })
                if(s.description){
                    set.append('<div class="element_description"><span class="icon-question"></span><div class="element_description_content">' + s.description + '</div></div>')
                }

                elem.find('.settings').append(set)
            }

            elem.find('.settings').on('mousedown touchstart', (evt)=>{
                evt.stopPropagation()
            })

            elem.find('.close').on('click', (evt)=>{
                evt.stopPropagation()
                this.closeSettings()
            })

            elem.on('mousedown touchstart', (evt)=>{
                if(evt.originalEvent.target !== elem.get(0) && evt.originalEvent.bubbles !== true){
                    return
                }

                evt.preventDefault()
                if(MODE === MODE_SETTINGS){
                    this.openSettings(evt)
                } else if(MODE === MODE_MOVE && (evt.originalEvent.button === 0 || (UI.supportsTouch() && evt.originalEvent instanceof TouchEvent)) ){
                    this.activateDrag(evt)
                } else if (MODE === MODE_RESIZE && (evt.originalEvent.button === 0 || (UI.supportsTouch() && evt.originalEvent instanceof TouchEvent)) ){
                    this.activateResize(evt)
                } else if (MODE === MODE_DELETE && (evt.originalEvent.button === 0 || (UI.supportsTouch() && evt.originalEvent instanceof TouchEvent)) ){
                    this.delete()
                } else if (MODE === MODE_ZINDEX && (evt.originalEvent.button === 0 || (UI.supportsTouch() && evt.originalEvent instanceof TouchEvent)) ){
                    moveElementZindexToFront(this)
                } else if (MODE === MODE_COLORCOPY && (evt.originalEvent.button === 0 || (UI.supportsTouch() && evt.originalEvent instanceof TouchEvent)) ){
                    colorCopy(this)
                }
            })

            elem.on('contextmenu', (evt)=>{
                evt.preventDefault()
                this.openSettings(evt)
            })

            return elem
        }

        activateDrag(evt){
            this.deactivate()

            if(UI.supportsTouch()){
                this.offX = window.scrollX + (evt.originalEvent instanceof TouchEvent ? evt.originalEvent.touches[0].clientX : evt.clientX) - uiZoom(this.x)
                this.offY = window.scrollY + (evt.originalEvent instanceof TouchEvent ? evt.originalEvent.touches[0].clientY : evt.clientY) - uiZoom(this.y)
            } else {
                this.offX = window.scrollX + evt.clientX - uiZoom(this.x)
                this.offY = window.scrollY + evt.clientY - uiZoom(this.y)
            }

            let func = (evt)=>{
                evt.preventDefault()
                if(UI.supportsTouch()){
                    this.x = uiUnzoom((window.scrollX + (evt.originalEvent instanceof TouchEvent ? evt.originalEvent.touches[0].clientX : evt.clientX)) - this.offX)
                    this.y = uiUnzoom((window.scrollY + (evt.originalEvent instanceof TouchEvent ? evt.originalEvent.touches[0].clientY : evt.clientY)) - this.offY)
                } else {
                    this.x = uiUnzoom((window.scrollX + evt.clientX) - this.offX)
                    this.y = uiUnzoom((window.scrollY + evt.clientY) - this.offY)
                }
                this.refreshPosition()
            }

            $(gcontainer).on('mousemove touchmove', func)
            this.dom.on('mousemove touchmove', func)

            $(gcontainer).on('mouseup touchend touchcancel', ()=>{
                this.deactivate()
            })
        }

        activateResize(evt){
            this.deactivate()

            if(UI.supportsTouch()){
                this.offX = (window.scrollX + (evt.originalEvent instanceof TouchEvent ? evt.originalEvent.touches[0].clientX : evt.clientX)) - uiZoom(this.width)
                this.offY = (window.scrollY + (evt.originalEvent instanceof TouchEvent ? evt.originalEvent.touches[0].clientY : evt.clientY)) - uiZoom(this.height)
            } else {
                this.offX = (window.scrollX + evt.clientX) - uiZoom(this.width)
                this.offY = (window.scrollY + evt.clientY) - uiZoom(this.height)
            }

            let func = (evt)=>{
                evt.preventDefault()
                if(UI.supportsTouch()){
                    this.width = uiUnzoom((window.scrollX + (evt.originalEvent instanceof TouchEvent ? evt.originalEvent.touches[0].clientX : evt.clientX)) - this.offX)
                    this.height = uiUnzoom((window.scrollY + (evt.originalEvent instanceof TouchEvent ? evt.originalEvent.touches[0].clientY : evt.clientY)) - this.offY)
                } else {
                    this.width = uiUnzoom((window.scrollX + evt.clientX) - this.offX)
                    this.height = uiUnzoom((window.scrollY + evt.clientY) - this.offY)
                }
                this.refreshPosition()
            }

            $(gcontainer).on('mousemove touchmove', func)
            this.dom.on('mousemove touchmove', func)

            $(gcontainer).on('mouseup touchend touchcancel', ()=>{
                this.deactivate()
            })
        }

        deactivate(){
            $(gcontainer).off('mousemove touchmove mouseup touchend touchcancel')
            this.dom.off('mousemove touchmove mouseup touchend touchcancel')
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

            this.width = Math.round(this.width)
            this.height = Math.round(this.height)
            this.x = Math.round(this.x)
            this.y = Math.round(this.y)

            this.dom.css({
                left: uiZoom(this.x),
                top: uiZoom(this.y),
                width: uiZoom(this.width),
                height: uiZoom(this.height)
            })
            console.log(this, {
                left: uiZoom(this.x),
                top: uiZoom(this.y),
                width: uiZoom(this.width),
                height: uiZoom(this.height)
            }, maxX, maxY)
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
                if(this.settings.background){
                    this.layerListEntry.find('.background').css('background', makeValidHexOrEmpty(this.settings.background.value))
                }
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
            $(gcontainer).on('mousedown touchstart', this.closeHandler)
        }

        closeSettings(){
            this.dom.removeClass('settings_open')
            $(gcontainer).off('mousedown touchstart', this.closeHandler)
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

    class Triangle extends Element {

        beforeBuild(){
            this.settings = {
                background: {
                    type: 'color',
                    value: createRandomColor()
                },
                direction: {
                    type: 'number',
                    value: 0
                }
            }
        }

        buildContent(){
            return '<svg viewBox="0 0 ' + uiZoom(this.width) + ' ' + uiZoom(this.height) + '">'
                    +'<polygon points="0,' + uiZoom(this.height) + ' ' + uiZoom(this.width/2) + ',0 ' + uiZoom(this.width) +',' + uiZoom(this.height) + '" stroke-width="0" fill="' + makeValidHexOrEmpty(this.settings.background.value) + '"></polygon>'
                +'</svg>'
        }

        refreshContent(){
            this.content.html(this.buildContent())
            this.content.css({
                transform: 'rotate(' + this.settings.direction.value + 'deg)'
            })
        }

        refreshPosition(){
            super.refreshPosition()
            this.refreshContent()
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()

            return {
                init: superRet.init,
                onDraw: superRet.onDraw + '\n'
                    + luaBuildSetColor(this.settings.background.value) + '\n'
                    + 'cx='+(this.x + this.width/2) + '\n'
                    + 'cy='+(this.y + this.height/2) + '\n'
                    + 'angle=' + (Math.floor((this.settings.direction.value/360)*2*Math.PI*100)/100) + '\n'
                    + 'p1=rotatePoint(cx,cy,angle,' +this.x+','+(this.y + this.height)+')\n'
                    + 'p2=rotatePoint(cx,cy,angle,' +(this.x+this.width/2)+','+this.y+')\n'
                    + 'p3=rotatePoint(cx,cy,angle,' +(this.x+this.width)+','+(this.y + this.height)+')\n'
                    + 'screen.drawTriangleF(p1.x,p1.y,p2.x,p2.y,p3.x,p3.y)',
                onTick: superRet.onTick,
                libs: Object.assign(superRet.libs, {[LIBS.ROTATE_POINT]:true})
            }
        }
    }

    class Circle extends Element {

        beforeBuild(){
        }

        buildContent(){
            return '<svg viewBox="0 0 ' + uiZoom(this.width) + ' ' + uiZoom(this.height) + '">'
                    +'<circle cx="' + uiZoom(this.width/2) + '" cy="' + uiZoom(this.height/2) + '" r="' + uiZoom(Math.min(this.width, this.height)/2 - this.settings.borderWidth.value/2) +'" stroke-width="' + uiZoom(this.settings.borderWidth.value) + '" stroke="'+ makeValidHexOrEmpty(this.settings.border.value) +'" fill="' + makeValidHexOrEmpty(this.settings.background.value) + '"></circle>'
                +'</svg>'
        }

        refreshContent(){
            this.content.html(this.buildContent())
            this.dom.css({
                background: '',
                border: ''
            })
        }

        refreshPosition(){
            super.refreshPosition()
            this.refreshContent()
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()

            return {
                init: superRet.init,
                onDraw: 'cx='+(this.x + this.width/2) + '\n'
                    + 'cy='+(this.y + this.height/2) + '\n'
                    + 'ri=' + (Math.min(this.width, this.height)/2 - this.settings.borderWidth.value) + '\n'
                    + 'ro=' + (Math.min(this.width, this.height)/2) + '\n'
                    + luaBuildSetColor(this.settings.border.value) + '\n'
                    + 'screen.drawCircleF(cx,cy,ro)\n'
                    + luaBuildSetColor(this.settings.background.value) + '\n'
                    + 'screen.drawCircleF(cx,cy,ri)',
                onTick: superRet.onTick,
                libs: superRet.libs
            }
        }
    }

    class Line extends Element {

        beforeBuild(){
            this.minWidth = 1
            this.minHeight = 1

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
                .text(this.settings.text.value)

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

    class ButtonRectangle extends Element {

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
                .text(this.settings.text.value)
        }

        refreshPosition(){
            super.refreshPosition()
            this.refreshContent()
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
                        + 'screen.drawTextBox(' + this.x + ', ' + this.y + ', ' + this.width + ', ' + this.height + ', text, 0, 0)',
                    onTick: superRet.onTick + '\n'
                        + 'if (isP1 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in1X,in1Y)) or (isP2 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in2X,in2Y)) then\n'
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
                        + 'screen.drawTextBox(' + this.x + ', ' + this.y + ', ' + this.width + ', ' + this.height + ', text, 0, 0)',
                    onTick: superRet.onTick + '\n'
                        + 'if (isP1 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in1X,in1Y)) or (isP2 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in2X,in2Y)) then\n'
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

    class ButtonTriangle extends Element {

        beforeBuild(){
            this.settings = {
                background: {
                    type: 'color',
                    value: createRandomColor()
                },
                backgroundOn: {
                    type: 'color',
                    value: createRandomColor()
                },
                isToggle: {
                    type: 'checkbox',
                    value: false
                },
                direction: {
                    type: 'number',
                    value: 0
                },
                channel: {
                    type: 'number',
                    value: 1
                }
            }
        }

        buildContent(){
            return '<svg viewBox="0 0 ' + uiZoom(this.width) + ' ' + uiZoom(this.height) + '">'
                    +'<polygon points="0,' + uiZoom(this.height) + ' ' + uiZoom(this.width/2) + ',0 ' + uiZoom(this.width) +',' + uiZoom(this.height) + '" stroke-width="0" fill="' + makeValidHexOrEmpty(this.settings.background.value) + '"></polygon>'
                +'</svg>'
        }

        refreshContent(){
            this.content.html(this.buildContent())
            this.content.css({
                transform: 'rotate(' + this.settings.direction.value + 'deg)'
            })
        }

        refreshPosition(){
            super.refreshPosition()
            this.refreshContent()
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()
            if(this.settings.isToggle.value){
                return {
                    init: superRet.init + '\n' + this.id + 'Toggled = false\n' + this.id + 'ToggledP = false\n',
                    onDraw: superRet.onDraw
                        + 'if ' + this.id + 'Toggled then\n' + luaBuildSetColor(this.settings.backgroundOn.value) + '\nelse\n' + luaBuildSetColor(this.settings.background.value) + '\nend\n'
                        + 'cx='+(this.x + this.width/2) + '\n'
                        + 'cy='+(this.y + this.height/2) + '\n'
                        + 'angle=' + (Math.floor((this.settings.direction.value/360)*2*Math.PI*100)/100) + '\n'
                        + 'p1=rotatePoint(cx,cy,angle,' +this.x+','+(this.y + this.height)+')\n'
                        + 'p2=rotatePoint(cx,cy,angle,' +(this.x+this.width/2)+','+this.y+')\n'
                        + 'p3=rotatePoint(cx,cy,angle,' +(this.x+this.width)+','+(this.y + this.height)+')\n'
                        + 'screen.drawTriangleF(p1.x,p1.y,p2.x,p2.y,p3.x,p3.y)',
                    onTick: superRet.onTick + '\n'
                        + 'if (isP1 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in1X,in1Y)) or (isP2 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in2X,in2Y)) then\n'
                        + this.id + 'ToggledP=true\n'
                        + 'end\n'
                        + 'if not (isP1 or isP2) and ' + this.id + 'ToggledP then\n'
                        + this.id + 'ToggledP = false\n'
                        + this.id + 'Toggled = not ' + this.id + 'Toggled\n'
                        + 'end\n'
                        + 'output.setBool(' + this.settings.channel.value + ', ' + this.id + 'Toggled)',
                    libs: Object.assign(superRet.libs, {[LIBS.IS_IN_RECT]:true, [LIBS.ROTATE_POINT]:true})
                }
            } else {
                return {
                    init: superRet.init + '\n' + this.id + 'Toggled = false\n',
                    onDraw: superRet.onDraw
                        + 'if ' + this.id + 'Toggled then\n' + luaBuildSetColor(this.settings.backgroundOn.value) + '\nelse\n' + luaBuildSetColor(this.settings.background.value) + '\nend\n'
                        + 'cx='+(this.x + this.width/2) + '\n'
                        + 'cy='+(this.y + this.height/2) + '\n'
                        + 'angle=' + (Math.floor((this.settings.direction.value/360)*2*Math.PI*100)/100) + '\n'
                        + 'p1=rotatePoint(cx,cy,angle,' +this.x+','+(this.y + this.height)+')\n'
                        + 'p2=rotatePoint(cx,cy,angle,' +(this.x+this.width/2)+','+this.y+')\n'
                        + 'p3=rotatePoint(cx,cy,angle,' +(this.x+this.width)+','+(this.y + this.height)+')\n'
                        + 'screen.drawTriangleF(p1.x,p1.y,p2.x,p2.y,p3.x,p3.y)',
                    onTick: superRet.onTick + '\n'
                        + 'if (isP1 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in1X,in1Y)) or (isP2 and isInRect(' + this.x + ',' + this.y + ',' + this.width + ',' + this.height + ',in2X,in2Y)) then\n'
                        + this.id + 'Toggled=true\n'
                        + 'else\n'
                        + this.id + 'Toggled=false\n'
                        + 'end\n'
                        + 'output.setBool(' + this.settings.channel.value + ', ' + this.id + 'Toggled)',
                    libs: Object.assign(superRet.libs, {[LIBS.IS_IN_RECT]:true, [LIBS.ROTATE_POINT]:true})
                }
            }
        }
    }

    class SliderVertical extends Element {

        beforeBuild(){
            this.width = 8
            this.height = 24

            let additionalSettings = {
                background: {
                    type: 'color',
                    value: '#000'
                },
                border: {
                    type: 'color',
                    value: '#666'
                },
                defaultValue: {
                    type: 'number',
                    value: 0
                },
                sliderColor: {
                    type: 'color',
                    value: '#fff'
                },
                sliderThresholdZero: {
                    type: 'number',
                    value: 0.1,
                    description: 'Values below this value will be outputed as 0'
                },
                sliderThresholdFull: {
                    type: 'number',
                    value: 0.9,
                    description: 'Values above this value will be outputed as 1'
                },
                channel: {
                    type: 'number',
                    value: 1
                }
            }
            this.settings = additionalSettings
        }

        buildContent(){
            return $('<div class="slider_value"></div>')
        }

        refreshContent(){
            this.content.find('.slider_value')
                .css({
                    top: uiZoom((1-this.settings.defaultValue.value)*this.height),
                    height: this.settings.defaultValue.value*100 + '%',
                    background: makeValidHexOrEmpty(this.settings.sliderColor.value)
                })
            this.content.css({
                background: makeValidHexOrEmpty(this.settings.background.value),
                border: uiZoom(1)+'px solid ' + makeValidHexOrEmpty(this.settings.border.value)
            })
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()
            return {
                init: superRet.init + '\n' + this.id + 'sliderv={x=' + this.x + ',y=' + this.y + ',w=' + this.width + ',h=' + this.height + ',v=' + this.settings.defaultValue.value + '}\n',
                onDraw: superRet.onDraw + luaBuildSetColor(this.settings.background.value) + '\nscreen.drawRectF(' + this.id + 'sliderv.x,' + this.id + 'sliderv.y,' + this.id + 'sliderv.w,' + this.id + 'sliderv.h)\n'
                    + luaBuildSetColor(this.settings.sliderColor.value) + '\nscreen.drawRectF(' + this.id + 'sliderv.x,(1-' + this.id + 'sliderv.v)*' + this.id + 'sliderv.h+' + this.id + 'sliderv.y,' + this.id + 'sliderv.w,(' + this.id + 'sliderv.v)*' + this.id + 'sliderv.h)\n'
                    + luaBuildSetColor(this.settings.border.value) + '\nscreen.drawRect(' + this.id + 'sliderv.x,' + this.id + 'sliderv.y,' + this.id + 'sliderv.w,' + this.id + 'sliderv.h)\n',
                onTick: superRet.onTick + '\n'
                    + 'if isP1 and isInRectO('+this.id+'sliderv,in1X,in1Y) then\n'
                    + this.id+'sliderv.v=(('+this.id+'sliderv.y+'+this.id+'sliderv.h)-in1Y)/'+this.id+'sliderv.h\n'
                    + 'elseif isP2 and isInRectO('+this.id+'sliderv,in2X,in2Y) then\n'
                    + this.id+'sliderv.v=(('+this.id+'sliderv.y+'+this.id+'sliderv.h)-in2Y)/'+this.id+'sliderv.h\n'
                    + 'end\n'
                    + 'if '+this.id+'sliderv.v<'+this.settings.sliderThresholdZero.value+' then\n'
                    + this.id+'sliderv.v=0\n'
                    + 'elseif '+this.id+'sliderv.v>'+this.settings.sliderThresholdFull.value+' then\n'
                    + this.id+'sliderv.v=1\n'
                    + 'end\n'
                    + 'output.setNumber(' + this.settings.channel.value + ','+this.id+'sliderv.v)\n',
                libs: Object.assign(superRet.libs, {[LIBS.IS_IN_RECT_O]:true})
            }
        }
    }

    class SliderHorizontal extends Element {

        beforeBuild(){
            let additionalSettings = {
                background: {
                    type: 'color',
                    value: '#000'
                },
                border: {
                    type: 'color',
                    value: '#666'
                },
                defaultValue: {
                    type: 'number',
                    value: 0
                },
                sliderColor: {
                    type: 'color',
                    value: '#fff'
                },
                sliderThresholdZero: {
                    type: 'number',
                    value: 0.1,
                    description: 'Values below this value will be outputed as 0'
                },
                sliderThresholdFull: {
                    type: 'number',
                    value: 0.9,
                    description: 'Values above this value will be outputed as 1'
                },
                channel: {
                    type: 'number',
                    value: 1
                }
            }
            this.settings = additionalSettings
        }

        buildContent(){
            return $('<div class="slider_value"></div>')
        }

        refreshContent(){
            this.content.find('.slider_value')
                .css({
                    left: uiZoom((1-this.settings.defaultValue.value)*this.width),
                    width: this.settings.defaultValue.value*100 + '%',
                    background: makeValidHexOrEmpty(this.settings.sliderColor.value)
                })
            this.content.css({
                background: makeValidHexOrEmpty(this.settings.background.value),
                border: uiZoom(1)+'px solid ' + makeValidHexOrEmpty(this.settings.border.value)
            })
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()
            return {
                init: superRet.init + '\n' + this.id + 'sliderh={x=' + this.x + ',y=' + this.y + ',w=' + this.width + ',h=' + this.height + ',v=' + this.settings.defaultValue.value + '}\n',
                onDraw: superRet.onDraw + luaBuildSetColor(this.settings.background.value) + '\nscreen.drawRectF(' + this.id + 'sliderh.x,' + this.id + 'sliderh.y,' + this.id + 'sliderh.w,' + this.id + 'sliderh.h)\n'
                    + luaBuildSetColor(this.settings.sliderColor.value) + '\nscreen.drawRectF(' + this.id + 'sliderh.x,' + this.id + 'sliderh.y,(' + this.id + 'sliderh.v)*' + this.id + 'sliderh.w,' + this.id + 'sliderh.h)\n'
                    + luaBuildSetColor(this.settings.border.value) + '\nscreen.drawRect(' + this.id + 'sliderh.x,' + this.id + 'sliderh.y,' + this.id + 'sliderh.w,' + this.id + 'sliderh.h)\n',
                onTick: superRet.onTick + '\n'
                    + 'if isP1 and isInRectO('+this.id+'sliderh,in1X,in1Y) then\n'
                    + this.id+'sliderh.v=(in1X-'+this.id+'sliderh.x)/'+this.id+'sliderh.w\n'
                    + 'elseif isP2 and isInRectO('+this.id+'sliderh,in2X,in2Y) then\n'
                    + this.id+'sliderh.v=(in2X-'+this.id+'sliderh.x)/'+this.id+'sliderh.w\n'
                    + 'end\n'
                    + 'if '+this.id+'sliderh.v<'+this.settings.sliderThresholdZero.value+' then\n'
                    + this.id+'sliderh.v=0\n'
                    + 'elseif '+this.id+'sliderh.v>'+this.settings.sliderThresholdFull.value+' then\n'
                    + this.id+'sliderh.v=1\n'
                    + 'end\n'
                    + 'output.setNumber(' + this.settings.channel.value + ','+this.id+'sliderh.v)\n',
                libs: Object.assign(superRet.libs, {[LIBS.IS_IN_RECT_O]:true})
            }
        }
    }

    class FlipSwitch extends Element {

        beforeBuild(){
            this.height = 12
            this.width = 12
            this.minHidth = 12
            this.minHeight = 12


            this.settings = {
                background: {
                    type: 'color',
                    value: '#bbb'
                },
                backgroundOn: {
                    type: 'color',
                    value: '#0d0'
                },
                defaultValue: {
                    type: 'number',
                    value: 0
                },
                flipSwitchBodyColor: {
                    type: 'color',
                    value: '#000'
                },
                flipSwitchHeadColor: {
                    type: 'color',
                    value: '#b00'
                },
                defaultValue: {
                    type: 'checkbox',
                    value: false
                },
                channel: {
                    type: 'number',
                    value: 1
                }
            }
        }

        buildContent(){
            if(this.settings.defaultValue.value){
                return '<svg viewBox="0 0 ' + uiZoom(this.width) + ' ' + uiZoom(this.height) + '">'
                        +'<g transform="scale(' + uiZoom(this.width/12) + ' ' + uiZoom(this.height/12) + ')">'
                            +'<polygon points="0,0 12,0 12,12, 0,12" stroke-width="0" fill="' + makeValidHexOrEmpty(this.settings.backgroundOn.value) + '"></polygon>'
                            +'<polygon points="1,4 11,4 11,1 1,1" stroke-width="0" fill="' + makeValidHexOrEmpty(this.settings.flipSwitchHeadColor.value) + '"></polygon>'
                            +'<polygon points="3,4 9,4 9,7 3,7" stroke-width="0" fill="' + makeValidHexOrEmpty(this.settings.flipSwitchBodyColor.value) + '"></polygon>'
                        + '</g>'
                    +'</svg>'
            } else {
                return '<svg viewBox="0 0 ' + uiZoom(this.width) + ' ' + uiZoom(this.height) + '">'
                        +'<g transform="scale(' + uiZoom(this.width/12) + ' ' + uiZoom(this.height/12) + ')">'
                            +'<polygon points="0,0 12,0 12,12, 0,12" stroke-width="0" fill="' + makeValidHexOrEmpty(this.settings.background.value) + '"></polygon>'
                            +'<polygon points="1,8 11,8 11,11 1,11" stroke-width="0" fill="' + makeValidHexOrEmpty(this.settings.flipSwitchHeadColor.value) + '"></polygon>'
                            +'<polygon points="3,8 9,8 9,5 3,5" stroke-width="0" fill="' + makeValidHexOrEmpty(this.settings.flipSwitchBodyColor.value) + '"></polygon>'
                        + '</g>'
                    +'</svg>'
            }
        }

        refreshContent(){
            this.content.html(this.buildContent())
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()
            return {
                init: superRet.init + '\n' + this.id + 'flip={x=' + this.x + ',y=' + this.y + ',w=' + this.width + ',h=' + this.height + ',a=' + this.settings.defaultValue.value + ',p=false}\n',
                onDraw: superRet.onDraw
                    + 'if ' + this.id + 'flip.a then\n'
                    + luaBuildSetColor(this.settings.backgroundOn.value) + '\n'
                    + 'screen.drawRectF('+this.x+','+this.y+','+this.width+','+this.height+')\n'
                    + luaBuildSetColor(this.settings.flipSwitchBodyColor.value) + '\n'
                    + 'screen.drawRectF('+(this.x+this.width/12*3)+','+(this.y+this.height/12*4)+','+(this.width/12*6)+','+(this.height/12*3)+')\n'
                    + luaBuildSetColor(this.settings.flipSwitchHeadColor.value) + '\n'
                    + 'screen.drawRectF('+(this.x+this.width/12)+','+(this.y+this.height/12*1)+','+(this.width/12*10)+','+(this.height/12*3)+')\n'
                    + 'else\n'
                    + luaBuildSetColor(this.settings.background.value) + '\n'
                    + 'screen.drawRectF('+this.x+','+this.y+','+this.width+','+this.height+')\n'
                    + luaBuildSetColor(this.settings.flipSwitchBodyColor.value) + '\n'
                    + 'screen.drawRectF('+(this.x+this.width/12*3)+','+(this.y+this.height/12*5)+','+(this.width/12*6)+','+(this.height/12*3)+')\n'
                    + luaBuildSetColor(this.settings.flipSwitchHeadColor.value) + '\n'
                    + 'screen.drawRectF('+(this.x+this.width/12)+','+(this.y+this.height/12*8)+','+(this.width/12*10)+','+(this.height/12*3)+')\n'
                    + 'end\n',
                onTick: superRet.onTick + '\n'
                    + 'if isP1 and isInRectO('+this.id+'flip,in1X,in1Y) or isP2 and isInRectO('+this.id+'flip,in2X,in2Y) then\n'
                    + 'if not '+this.id+'flip.p then\n'
                    + this.id+'flip.a=not ' + this.id+'flip.a\n'
                    + this.id+'flip.p=true\n'
                    + 'end\n'
                    + 'else\n'
                    + this.id+'flip.p=false\n'
                    + 'end\n'
                    + 'output.setBool(' + this.settings.channel.value + ','+this.id+'flip.a)\n',
                libs: Object.assign(superRet.libs, {[LIBS.IS_IN_RECT_O]:true})
            }
        }
    }

    class IndicatorLight extends Element {

        beforeBuild(){
            this.width = 8
            this.height = 8
            this.minHidth = 8
            this.minHeight = 8

            let additionalSettings = {
                border: {
                    type: 'color',
                    value: '#333'
                },
                background: {
                    type: 'color',
                    value: '#2b2b2b'
                },
                backgroundOn: {
                    type: 'color',
                    value: '#50ff00'
                },
                channel: {
                    type: 'number',
                    value: 1
                }
            }
            Object.assign(this.settings, additionalSettings)
        }

        buildContent(){
            return '<svg viewBox="0 0 ' + uiZoom(this.width) + ' ' + uiZoom(this.height) + '">'
                    +'<circle cx="' + uiZoom(this.width/2) + '" cy="' + uiZoom(this.height/2) + '" r="' + uiZoom(Math.min(this.width, this.height)/2 - this.settings.borderWidth.value/4) +'" stroke-width="' + uiZoom(this.settings.borderWidth.value) + '" stroke="'+ makeValidHexOrEmpty(this.settings.border.value) +'" fill="' + makeValidHexOrEmpty(this.settings.background.value) + '"></circle>'
                +'</svg>'
        }

        refreshContent(){
            this.content.html(this.buildContent())
            this.dom.css({
                background: '',
                border: ''
            })
        }

        refreshPosition(){
            super.refreshPosition()
            this.refreshContent()
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()

            return {
                init: superRet.init,
                onDraw: 'cx='+(this.x + this.width/2) + '\n'
                    + 'cy='+(this.y + this.height/2) + '\n'
                    + 'ri=' + (Math.min(this.width, this.height)/2 - this.settings.borderWidth.value) + '\n'
                    + 'ro=' + (Math.min(this.width, this.height)/2) + '\n'
                    + luaBuildSetColor(this.settings.border.value) + '\n'
                    + 'screen.drawCircleF(cx,cy,ro)\n'
                    + 'if ' + this.id + 'Indc then\n'
                    + luaBuildSetColor(this.settings.backgroundOn.value) + '\n'
                    + 'else\n'
                    + luaBuildSetColor(this.settings.background.value) + '\n'
                    + 'end\n'
                    + 'screen.drawCircleF(cx,cy,ri)',
                onTick: superRet.onTick + '\n' + this.id + 'Indc=input.getBool(' + this.settings.channel.value + ')',
                libs: superRet.libs
            }
        }
    }


    class IndicatorSpeed extends Element {

        beforeBuild(){
            this.width = 14
            this.height = 14
            this.minWidth = 14
            this.minHeight = 14

            this.settings = {
                background: {
                    type: 'color',
                    value: '#222'
                },
                numberBackground: {
                    type: 'color',
                    value: '#444'
                },
                lineColor: {
                    type: 'color',
                    value: '#fff'
                },
                color: {
                    type: 'color',
                    value: createRandomColor()
                },
                max: {
                    type: 'number',
                    value: 999
                },
                minDigitWidth: {
                    type: 'number',
                    value: 3
                },
                channel: {
                    type: 'number',
                    value: 1
                }
            }
        }

        buildContent(){
            return '<svg viewBox="0 0 ' + uiZoom(this.width/2+(Math.max(new String(this.settings.max.value).length, this.settings.minDigitWidth.value)*5)) + ' ' + uiZoom(this.height) + '">'
                    +'<circle cx="' + uiZoom(this.width/2) + '" cy="' + uiZoom(this.height/2) + '" r="' + uiZoom(Math.min(this.width, this.height)/2) +'" stroke-width="0" fill="' + makeValidHexOrEmpty(this.settings.background.value) + '"></circle>'
                    + '<rect x="' + uiZoom(this.width/2) + '" y="' + uiZoom(this.height/2 - Math.min(this.width, this.height)/2) + '" width="' + uiZoom(this.settings.minDigitWidth.value*5) + '" height="' + uiZoom(Math.min(this.width, this.height)/2) + '" fill="' + makeValidHexOrEmpty(this.settings.numberBackground.value) + '"/>'
                    + '<line x1="' + uiZoom(this.width/2) + '" y1="' + uiZoom(this.height/2) + '" x2="' + uiZoom(this.width/2+Math.min(this.width, this.height)/2) + '" y2="' + uiZoom(this.height/2) + '" stroke="' + makeValidHexOrEmpty(this.settings.lineColor.value) + '" stroke-width="' + uiZoom(1) + '"/>'
                    + '<text x="' + uiZoom(this.width/2 + (this.settings.minDigitWidth.value-1)*5+1) + '" y="' + uiZoom(this.height/2 - Math.min(this.width, this.height)/4 + 3) + '" fill="' + makeValidHexOrEmpty(this.settings.color.value) + '">0</text>'
                +'</svg>'
        }

        refreshContent(){
            this.content.html(this.buildContent())
            this.dom.css({
                background: '',
                border: ''
            })
        }

        refreshPosition(){
            super.refreshPosition()
            this.refreshContent()
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()

            return {
                init: superRet.init + '\n'
                    + this.id + 'Max=' + this.settings.max.value,
                onDraw: ''
                    + luaBuildSetColor(this.settings.background.value) + '\n'
                    + 'screen.drawCircleF(' + (this.x+this.width/2) + ',' + (this.y+this.height/2) + ',' + Math.min(this.width, this.height)/2 + ')\n'
                    + luaBuildSetColor(this.settings.numberBackground.value) + '\n'
                    + 'screen.drawRectF(' + (this.x+this.width/2) + ',' + (this.y+this.height/2 - Math.min(this.width, this.height)/2) + ',math.max(' + this.settings.minDigitWidth.value + '*5+1,string.len(math.floor(' + this.id + 'Val))*5+1),' + Math.min(this.width, this.height)/2 + ')\n'
                    + luaBuildSetColor(this.settings.color.value) + '\n'
                    + 'screen.drawText(' + (this.x+this.width/2) + '+math.max(0,' + this.settings.minDigitWidth.value + '-string.len(math.floor(' + this.id + 'Val)))*5+1,' + (this.y+this.height/2 - Math.min(this.width, this.height)/4) + '-3, math.floor(' + this.id + 'Val))'
                    + luaBuildSetColor(this.settings.lineColor.value) + '\n'
                    + 'p=rotatePoint(' + (this.x+this.width/2) + ',' + (this.y+this.height/2) + ',math.pi*1.5*(' + this.id + 'Val/' + this.id + 'Max),' + (this.x+this.width/2 + Math.min(this.width, this.height)/2) + ',' + (this.y+this.height/2) + ')'
                    + 'screen.drawLine(' + (this.x+this.width/2) + ',' + (this.y+this.height/2) + ',p.x,p.y)',            
                onTick: superRet.onTick + '\n' + this.id + 'Val=input.getNumber(' + this.settings.channel.value + ')',
                libs: Object.assign(superRet.libs, {[LIBS.ROTATE_POINT]:true})
            }
        }
    }

    class Graph extends Element {

        beforeBuild(){
            this.width = 32
            this.height = 32

            this.settings = {
                color: {
                    type: 'color',
                    value: createRandomColor()
                },
                min: {
                    type: 'number',
                    value: 0
                },
                max: {
                    type: 'number',
                    value: 1
                },
                channel: {
                    type: 'number',
                    value: 1
                }
            }
        }

        buildContent(){
            return '<svg viewBox="0 0 ' + uiZoom(this.width) + ' ' + uiZoom(this.height) + '">'
                    + '<path d="M 0,' + uiZoom(this.height) + ' L ' + uiZoom(this.width/4) + ',' + uiZoom(this.height) + ' L ' + uiZoom(this.width*3/4) + ',' + uiZoom(this.height/2) + ' L ' + uiZoom(this.width) + ',' + uiZoom(this.height*5/6) + '" stroke-width="' + uiZoom(1) + '" stroke="' + makeValidHexOrEmpty(this.settings.color.value) + '" fill="none"/>'
                +'</svg>'
        }

        refreshContent(){
            this.content.html(this.buildContent())
            this.dom.css({
                background: '',
                border: ''
            })
        }

        refreshPosition(){
            super.refreshPosition()
            this.refreshContent()
        }

        buildLuaCode(){
            let superRet = super.buildLuaCode()

            return {
                init: superRet.init + '\n'
                    + this.id + 'Res={}\n'
                    + this.id + 'FC=0\n'
                    + this.id + 'Min=' + this.settings.min.value + '\n'
                    + this.id + 'Max=' + this.settings.max.value + '\n',
                onDraw: ''
                    + luaBuildSetColor(this.settings.color.value) + '\n'
                    + 'for i='+ this.id + 'FC-' + this.width + ', '+ this.id + 'FC-1 do\n'
                      + 'if i >= 0 and i - ' + this.id + 'FC + ' + this.width + ' >= 0 then\n'
                        + 'value = ('+ this.id + 'Res[i]-'+ this.id + 'Min)/'+ this.id + 'Max\n'
                        + 'if not ('+ this.id + 'Res[i+1] == nil) then\n'
                            + 'valueAfter = ('+ this.id + 'Res[i+1]-'+ this.id + 'Min)/'+ this.id + 'Max\n'
                            + 'screen.drawLine(i - '+ this.id + 'FC + ' + this.width + ', ' + this.height + ' * (1 - value), i + 1 - '+ this.id + 'FC + ' + this.width + ', ' + this.height + ' * (1 - valueAfter))\n'
                        + 'end\n'
                    +   'end\n'
                    + 'end\n',
                onTick: superRet.onTick + '\n'
                    + this.id + 'Res[' + this.id + 'FC]=math.max('+ this.id + 'Min,math.min('+ this.id + 'Max,input.getNumber(' + this.settings.channel.value + ')))\n'
                    + this.id + 'FC=' + this.id + 'FC+1',
                libs: superRet.libs
            }
        }
    }
    



    const ELEMENTS = [{
        name: 'Rectangle',
        object: Rectangle
    },{
        name: 'Triangle',
        object: Triangle
    },{
        name: 'Circle',
        object: Circle
    },{
        name: 'Line',
        object: Line
    },{
        name: 'Label',
        object: Label
    },{
        name: 'Button Rectangle',
        object: ButtonRectangle
    },{
        name: 'Button Triangle',
        object: ButtonTriangle
    },{
        name: 'Slider Vertical',
        object: SliderVertical
    },{
        name: 'Slider Horizontal',
        object: SliderHorizontal
    },{
        name: 'Flip Switch',
        object: FlipSwitch
    },{
        name: 'Indicator Light',
        object: IndicatorLight
    },{
        name: 'Indicator Speed',
        object: IndicatorSpeed
    },{
        name: 'Graph',
        object: Graph
    }]

    function duplicateElement(el){
        let dup = new el.constructor(false, canvas_container)
        dup.applySettings(el.settings)
        moveElementZindexUp(dup)
    }


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
                if(!LIBS_CODE[l]){
                    throw new Error('lib "'+l+'" not found!')
                }
                libCode += LIBS_CODE[l] + '\n\n'
            }

            let allCode = code.init
                + '\nfunction onTick()\n'
                    + 'isP1 = input.getBool(1)\nisP2 = input.getBool(2)\n\nin1X = input.getNumber(3)\nin1Y = input.getNumber(4)\nin2X = input.getNumber(5)\nin2Y = input.getNumber(6)\n\n'
                    + code.onTick + '\nend\n'
                + '\nfunction onDraw()\n' + code.onDraw + '\nend\n'
                + '\n' + libCode

            allCode = allCode.replace(/[\n]{3,}/g, '\n\n')

            UI.viewables()['viewable_editor_uibuilder_code'].focusSelf()
            EDITORS.get('uibuilder').editor.setValue(allCode, -1)
        } catch (ex){
            console.error('Error building lua code', ex)
            UTIL.alert('Error building lua code.\nPlease contact the developer.')
        }
    }

    /* helpers */

    function makeValidHexOrEmpty(hexstring){
        if(!hexstring){
            return ''
        }
        hexstring = hexstring.trim()
        let match = hexstring.match(/^#?([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/)

        if(!match){
            return ''
        }

        let hex = match[1]
        if(hex.length === 3){
            return '#' + hex.split('')[0] + hex.split('')[0] + hex.split('')[1] + hex.split('')[1] + hex.split('')[2] + hex.split('')[2]
        } else {
            return '#' + hex
        }
    }

    function makeValidPixelOrZero(pxstring){
        pxstring = ('' + pxstring).replace('px', '').trim()
        let int = parseFloat(pxstring)
        if(isNaN(int)){
            let float = parseInt(pxstring)
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

    let selectedColorForCopy = undefined
    function colorCopy(element){
        if(selectedColorForCopy){
            element.settings.background.value = selectedColorForCopy
            element.refresh()
            selectedColorForCopy = undefined
           gcontainer.find('.control.colorcopy .selected_color').css('background-image', '')
        } else {
            selectedColorForCopy = element.settings.background.value
            gcontainer.find('.control.colorcopy .selected_color').css('background', selectedColorForCopy)
        }
    }


    function save(){
        STORAGE.setConfiguration('uibuilder', buildStorage())
    }

    function getStorage(){
        return STORAGE.getConfiguration('uibuilder')
    }

    function buildStorage(){
        let data = {elements: []}
        for(let e of allElements){
            data.elements.push({
                type: e.constructor.name,
                settings: e.generateSettings()
            })
        }
        return data
    }

    function loadFromStorage(){        
        let parsed = getStorage()
        if(!parsed){
            return
        }

        for(let e of parsed.elements){
            if(e.type && e.settings){
                let found = false
                for(let elem of ELEMENTS){
                    console.log(elem.object.prototype.constructor)
                    if(elem.object.prototype.constructor.name === e.type){
                        found = true
                        new elem.object({settings: e.settings}, canvas_container)
                        break
                    }
                }
                if(!found){
                    console.warn('cannot create element from storage (type not found)', e)
                }                    
            }
        }
    }

    /* build lua code helpers */
    function luaBuildSetColor(hex){
        return 'setC(' + makeColorCorrectedRGBString(hex) + ')'
    }

    return {
        Element: Element,
        Label: Label,
        save: save,
        allElements: ()=>{
            return allElements
        }
    }

})(jQuery)

function uiZoom(v){
    return v * $('#ui-builder-zoom').val()
}

function uiUnzoom(v){
    return v / $('#ui-builder-zoom').val()
}


