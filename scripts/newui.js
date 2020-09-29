newui = (($)=>{

    $(window).on('load', init)


    let viewables = {}
    let views = {}
    let editors = {}

    let splitterVertical
    let splitterHorizontalLeft
    let splitterHorizontalRight

    const DO_LOG = true

    const VIEW_VIEW_MIN_SIZE = 100
    const SPLITTER_WIDTH = 6 /* this needs to be changed together with the css */

    const DEFAULT_LAYOUT = {
        top_left: ['viewable_editor_normal', 'viewable_editor_minified', 'viewable_editor_unminified', 'viewable_editor_uibuilder'],
        top_right: ['viewable_properties', 'viewable_inputs', 'viewable_outputs', 'viewable_documentation', 'viewable_official_manuals'],
        bottom_left: ['viewable_console'],
        bottom_right: ['viewable_monitor', 'viewable_settings']
    }

    function init(){
        $('[viewable]').each((i, el)=>{
            viewables[ $(el).attr('viewable') ] = new Viewable( el )
        })

        if(DO_LOG){
            console.log('Viewables', viewables)
        }

        $('[view]').each((i, el)=>{
            let view = new View( el )
            views[ $(el).attr('view') ] = view

            view.addListener('resize', ()=>{
                view.dom.find('code_field').each()
            })
        })

        $('[code-field]').each((i, el)=>{
            let editor = new Editor(el, viewables[$(el).closest('[viewable]').attr('viewable')] )
            editors[$(el).attr('code-field')] = editor
        })

        if(DO_LOG){
            console.log('Views', views)
        }

        splitterVertical = new Splitter($('[splitter="vertical"]').get(0), 'vertical')
        splitterHorizontalLeft = new Splitter($('[splitter="horizontal_left"]').get(0), 'horizontal', true)
        splitterHorizontalRight = new Splitter($('[splitter="horizontal_right"]').get(0), 'horizontal')


        splitterVertical.addListener('updated', onSplitterUpdate)
        splitterHorizontalLeft.addListener('updated', onSplitterUpdate)
        splitterHorizontalRight.addListener('updated', onSplitterUpdate)

        onSplitterUpdate()

        loadLayout(DEFAULT_LAYOUT)

        //$(window).trigger('yyy_ui_loaded')

        $(window).trigger('newui_loaded')
    }

    function onSplitterUpdate(){
        console.log('onSplitterUpdate')
        views.top_left.resize(0, 0, splitterVertical.x, splitterHorizontalLeft.y)
        views.top_right.resize(splitterVertical.x, 0, newui.flexview().width() - splitterVertical.x, splitterHorizontalRight.y)

        views.bottom_left.resize(0, splitterHorizontalLeft.y, splitterVertical.x, newui.flexview().height() - splitterHorizontalLeft.y)
        views.bottom_right.resize(splitterVertical.x, splitterHorizontalRight.y, newui.flexview().width() - splitterVertical.x, newui.flexview().height() - splitterHorizontalRight.y)
    }


    function loadLayout(layout){
        if(layout instanceof Object === false || layout === null){
            throw 'layout must be an object'
        }

        for(let view in layout){
            if(! views[view]){
                throw 'view does not exist: "' + view + '"'
            }

            for(let viewable of layout[view]){
                if(! viewables[viewable]){
                    throw 'viewable does not exist: "' + viewable + '"'
                }

                viewables[viewable].moveToView(views[view], true)
            }
        }
    }

    return {
        views: ()=>{
            return views
        },
        viewables: ()=>{
            return viewables
        },
        DO_LOG: DO_LOG,
        VIEW_VIEW_MIN_SIZE: VIEW_VIEW_MIN_SIZE,
        SPLITTER_WIDTH: SPLITTER_WIDTH,
        verticalSplitterPosition: ()=>{
            return splitterVertical.x
        },
        flexview: ()=>{
            return $('.ide_flex_view')
        },
        editor: (name)=>{
            return editors[name]
        }
    }

})(jQuery)





class SimpleEventor {
    constructor(){
        this.listeners = {}
    }

    addListener(event, listener){
        if(typeof event !== 'string'){
            throw 'event must be a string'
        }
        if(typeof listener !== 'function'){
            throw 'listener must be a function'
        }

        if(this.listeners[event] instanceof Array === false){
            this.listeners[event] = []
        }
        this.listeners[event].push(listener)
    }

    dispatchEvent(event){
        if(typeof event !== 'string'){
            throw 'event must be a string'
        }

        if(this.listeners[event] instanceof Array){
            for(let listener of this.listeners[event]){
                if(typeof listener === 'function'){
                    listener(event)
                }
            }
        }
    }
}

class Viewable extends SimpleEventor {

    constructor(domElement){
        super()

        this.dom = $(domElement)

        this.DEBUG_NAME = this.name()
    }


    moveToView(view, dontFocus){
        view.addViewable(this, dontFocus !== true)

        let curView = this.myCurrentView()
        if(curView){
            curView.refreshFocus()
        }

        this.dispatchEvent('view-change')
    }

    myCurrentView(){
        let views = newui.views()
        for(let v of Object.keys(views)){
            if(views[v].isViewablePartOfThisView(this)){
                return views[v]
            }
        }
    }

    name(){
        return this.dom.attr('viewable')
    }

    /* EVENT STUFF */

    onViewChange(listener){
        this.addListener('view-change', listener)
    }

    onViewableResize(listener){
        this.addListener('viewable-resize', listener)
    }
}

class View extends SimpleEventor {

    constructor(domElement){
        super()

        this.dom = $(domElement)

        this.dom.append( '<div class="select"></div>' )
            .append( '<div class="viewable_container"></div>' )

        this.DEBUG_NAME = this.name()
    }

    addViewable(viewable, focus){
        this.dom.find('.viewable_container').append( viewable.dom )
        let select = $('<div select-viewable="' + viewable.name() + '" select="false">' + translate.key(viewable.name()) + '</div>')
        select.on('click', ()=>{
            this.focus(viewable)
        })
        this.dom.find('.select').append(select)
        
        if(focus){
            this.focus(viewable)
        } else {
            viewable.dom.attr('visible', 'false')
        }
    }

    /* called after viewable is removed */
    refreshFocus(){
        /* remove old selects where the viewable has been removed */
        let myViewables = this.getViewables()

        this.dom.find('[select-viewable]').each((i, el)=>{
            if(! myViewables[ $(el).attr('select-viewable') ] ){
                $(el).remove()
            }
        })

        /* select the first viewable if no other one is already visible */
        if(this.dom.find('[viewable][visible="true"]').length === 0){
            this.dom.find('[viewable]').first().attr('visible', 'true')
            this.dom.find('[select-viewable="' + this.dom.find('[viewable]').first().attr('viewable') + '"]').attr('visible', 'true')
        }

        this.focusSelect(this.dom.find('[viewable][visible="true"]').attr('viewable'))
    }

    getViewables(){
        let myViewables = {}

        this.dom.find('[viewable]').each((i, el)=>{
            let name = $(el).attr('viewable')
            myViewables[ name ] = newui.viewables()[name]
        })

        return myViewables
    }

    focus(viewable){
        if(this.isViewablePartOfThisView(viewable)){
            this.dom.find('[viewable]').attr('visible', 'false')
            viewable.dom.attr('visible', 'true')

            this.focusSelect(viewable.dom.attr('viewable'))
        } else {
            if(newui.DO_LOG){
                console.warn('cannot focus viewable that is not part of this view', viewable, this)
            }
        }
    }

    /* same as focus, but for the selection tab */
    focusSelect(viewable_name){
        this.dom.find('[select-viewable]').attr('select', 'false')
        this.dom.find('[select-viewable="' + viewable_name + '"]').attr('select', 'true')
    }

    isViewablePartOfThisView(viewable){
        let name = viewable.name()

        let found = false
        this.dom.find('[viewable]').each((i, el)=>{
            if( $(el).attr('viewable') === name){
                found = true
            }
        })

        return found
    }

    name(){
        return this.dom.attr('view')
    }

    resize(x, y, width, height){
        this.dom.css({
            top: y + 'px',
            left: x + 'px',
            width: width + 'px',
            height: height + 'px'
        })

        this.dispatchEvent('view-resize')

        let myViewables = this.getViewables()
        for(let v of Object.keys(myViewables)){
            myViewables[v].dispatchEvent('viewable-resize')
        }
    }
}

class Splitter extends SimpleEventor {

    constructor(domElement, type, isHorizontalLeft){
        super()

        if(domElement instanceof HTMLElement === false){
            throw 'invalid HTMLElement for Splitter'
        }

        this.dom = $(domElement)
        this.type = type
        this.isHorizontalLeft = isHorizontalLeft

        this.isDragging = false
        this.isHover = false

        this.dragStartX = 0
        this.dragStartY = 0

        if(type === 'vertical'){
            this.x = newui.flexview().width() * 0.66
            this.y = 0
        } else if (type === 'horizontal'){
            if(this.isHorizontalLeft){
                this.x = 0
                this.y = newui.flexview().height() * 0.66                
            } else {                
                this.x = newui.flexview().width() * 0.66
                this.y = newui.flexview().height() * 0.5
            }
        } else {
            throw 'unssupported Splitter type "' + type + '"'
        }
        
        this.dom.on('mouseenter', (evt)=>{
            this.isHover = true

            this.update(true)
        })

        this.dom.on('mousedown', (evt)=>{
            this.isDragging = true
            this.dragStartX = evt.originalEvent.screenX
            this.dragStartY = evt.originalEvent.screenY
            console.log('dragstart', this.dragStartX, this.dragStartY)
            this.update(true)
        })

        this.dom.on('mousemove', (evt)=>{
            if(this.isDragging){
                console.log('this', this)
                console.log('dragging from', this.x, this.y)
                this.x = this.x - (this.dragStartX - evt.originalEvent.screenX)
                this.y = this.y - (this.dragStartY - evt.originalEvent.screenY)

                this.dragStartX = evt.originalEvent.screenX
                this.dragStartY = evt.originalEvent.screenY

                console.log('    to', this.x, this.y)

                /* apply limits */

                if(this.x < newui.VIEW_MIN_SIZE){
                    this.x = newui.VIEW_MIN_SIZE
                }
                if(this.x > newui.flexview().width() - newui.VIEW_MIN_SIZE){
                    this.x = newui.flexview().width() - newui.VIEW_MIN_SIZE
                }
                if(this.y > newui.flexview().height() - newui.VIEW_MIN_SIZE){
                    this.y = newui.flexview().height() - newui.VIEW_MIN_SIZE
                }

                /* only use one axis for each type */
                if(this.type === 'vertical'){
                    this.y = 0
                } else if(this.type === 'horizontal'){
                    this.x = 0
                }
            }

            this.update()
        })

        this.dom.on('mouseup mouseleave ', (evt)=>{
            this.isDragging = false
            this.isHover = false
            console.log('dragend')
            //TODO save to localStorage

            this.update(true)
        })

        Splitters.push(this)

        this.update()
    }

    update(preventPropagation){
        this.dom.attr('draging', this.isDragging ? 'true' : 'false')
        this.dom.attr('hover', this.isHover ? 'true' : 'false')

        this.dom.css({
            left: this.getX(),
            top: this.getY(),
            width: this.getWidth() + 'px',
            height: this.getHeight() + 'px'
        })

        if(!preventPropagation){
            for(let s of Splitters){
                s.update(true)
            }
            this.dispatchEvent('updated')
        }
    }

    getX(){
        if(this.type === 'horizontal'){
            if(! this.isHorizontalLeft){
                return newui.verticalSplitterPosition() + 3 /* tiny offset, so they dont overlay each other */
            } else {
                this.x
            }
        } else {
            return this.x - newui.SPLITTER_WIDTH / 2
        }
    }

    getY(){
        if(this.type === 'vertical'){
            return this.y
        } else {
            return this.y - newui.SPLITTER_WIDTH / 2
        }
    }

    getWidth(){
        if(this.type === 'vertical'){
            return newui.SPLITTER_WIDTH
        } else if(this.type === 'horizontal'){
            if(this.isHorizontalLeft){
                return newui.verticalSplitterPosition() - 3 /* tiny offset, so they dont overlay each other */
            } else {
                return newui.flexview().width() - newui.verticalSplitterPosition()
            }
        }
    }

    getHeight(){
        if(this.type === 'vertical'){
            return newui.flexview().height()
        } else if(this.type === 'horizontal'){
            return newui.SPLITTER_WIDTH
        }
    }
}

let Splitters = []

