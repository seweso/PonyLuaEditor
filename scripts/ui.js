ui = (($)=>{

    let viewables = {}
    let views = {}
    let editors = {}

    let splitterVertical
    let splitterHorizontalLeft
    let splitterHorizontalRight

    const DO_LOG = true

    const VIEW_VIEW_MIN_SIZE = 100
    const SPLITTER_WIDTH = 6 /* this needs to be changed together with the css */

    const MY_CONFIGURATION_NAME = 'ui'

    const DEFAULT_LAYOUT = {
        top_left: ['viewable_editor_normal', 'viewable_editor_minified', 'viewable_editor_unminified', 'viewable_editor_uibuilder'],
        top_right: ['viewable_documentation', 'viewable_properties', 'viewable_inputs', 'viewable_outputs', 'viewable_official_manuals'],
        bottom_left: ['viewable_console'],
        bottom_right: ['viewable_monitor', 'viewable_settings']
    }

    let config = {
        layout: DEFAULT_LAYOUT,
        splitters: {
            vertical: 0.66,
            horizontal_left: 0.66,
            horizontal_right: 0.5
        }
    }

    loader.on(loader.EVENT.SHARE_READY, init)

    function init(){
        $('[viewable]').each((i, el)=>{
            viewables[ $(el).attr('viewable') ] = new Viewable( el )
        })

        if(DO_LOG){
            console.log('Viewables', viewables)
        }

        $('[view]').each((i, el)=>{
            let view = new View( el )
            let name = $(el).attr('view')
            views[ name ] = view

            view.addListener('resize', ()=>{
                for(let e of Editors){
                    e.refreshSize()
                }
            })

            view.addListener('viewable-change', ()=>{
                config.layout[name] = Object.keys(view.getViewables())
                saveConfiguration()
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


        splitterVertical.addListener('updated', ()=>{
            config.splitters.vertical = splitterVertical.getRelative()
            onSplitterUpdate()
        })
        splitterHorizontalLeft.addListener('updated', ()=>{
            config.splitters.horizontal_left = splitterHorizontalLeft.getRelative()
            onSplitterUpdate()
        })
        splitterHorizontalRight.addListener('updated', ()=>{
            config.splitters.horizontal_right = splitterHorizontalRight.getRelative()
            onSplitterUpdate()
        })

        splitterVertical.addListener('dragend', saveConfiguration)
        splitterHorizontalLeft.addListener('dragend', saveConfiguration)
        splitterHorizontalRight.addListener('dragend', saveConfiguration)

        onSplitterUpdate()

        let conf = storage.getConfiguration(MY_CONFIGURATION_NAME)
        if(conf){
            if(conf.layout && conf.layout instanceof Object){
                if(countEntries(conf.layout) === countEntries(DEFAULT_LAYOUT)){
                    config.layout = conf.layout
                }

                function countEntries(lay){
                    let total = 0
                    for(let k in lay){
                        total += lay[k].length
                    }
                    return total
                }
            }
        }



        loadLayout(config.layout)

        if(conf){
            if(conf.splitters){
                for(let s of ['vertical', 'horizontal_left', 'horizontal_right']){
                    if(typeof conf.splitters[s] === 'number'){
                        config.splitters[s] = conf.splitters[s]
                    }
                }
            }
        }

        function setSplittersFromConfig(){
            let tmp = {vertical: splitterVertical, horizontal_left: splitterHorizontalLeft, horizontal_right: splitterHorizontalRight}
            for(let k in tmp){
                tmp[k].setRelative(config.splitters[k], config.splitters[k])
            }
        }

        $(window).on('resize', setSplittersFromConfig)

        setSplittersFromConfig()

        loader.done(loader.EVENT.UI_READY)
    }

    function saveConfiguration(){
        storage.setConfiguration(MY_CONFIGURATION_NAME, config)
    }

    function onSplitterUpdate(){
        console.log('onSplitterUpdate')
        views.top_left.resize(0, 0, splitterVertical.x, splitterHorizontalLeft.y)
        views.top_right.resize(splitterVertical.x, 0, ui.flexview().width() - splitterVertical.x, splitterHorizontalRight.y)

        views.bottom_left.resize(0, splitterHorizontalLeft.y, splitterVertical.x, ui.flexview().height() - splitterHorizontalLeft.y)
        views.bottom_right.resize(splitterVertical.x, splitterHorizontalRight.y, ui.flexview().width() - splitterVertical.x, ui.flexview().height() - splitterHorizontalRight.y)
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
        let curView = this.myCurrentView()

        view.addViewable(this, dontFocus !== true)

        if(curView){
            curView.afterViewablesChanged()
        }

        this.dispatchEvent('view-change')
    }

    myCurrentView(){
        let views = ui.views()
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

    onGainFocus(listener){
        this.addListener('viewable-gain-focus', listener)
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
        
        let moveto = $('<span class="moveto icon-shuffle">')
        let choose
        moveto.on('mouseenter', (evt)=>{
            choose = $('<div class="moveto_choose">')
            choose.append(
                $('<div class="header">Move To</div>'))

            choose.css({
                position: 'fixed',
                'z-index': '2',
                top: evt.originalEvent.pageY - 10,
                right: ( $(window).width() - evt.originalEvent.pageX ) - 10
            })

            choose.on('mouseleave', ()=>{
                choose.remove()
            })

            select.append(choose)

            for(let v in ui.views()){
                if(v === this.name()){
                    continue
                }
                let view = ui.views()[v]
                let entry = $('<div class="entry">' + translate.key(v) + '</div>')
                entry.on('click', (evt)=>{
                    evt.originalEvent.stopPropagation()
                    viewable.moveToView( view )
                    choose.remove()
                    util.unHighlight(view.dom.get(0))
                })

                entry.on('mouseenter', ()=>{
                    util.highlight(view.dom.get(0))
                })

                entry.on('mouseleave', ()=>{
                    util.unHighlight(view.dom.get(0))
                })

                choose.append(entry)
            }
        })

        select.append(moveto)

        if(focus){
            this.focus(viewable)
        } else {
            viewable.dom.attr('visible', 'false')
        }

        this.afterViewablesChanged()
    }

    /* called after viewable is removed or added */
    afterViewablesChanged(){
        /* remove old selects where the viewable has been removed */
        let myViewables = this.getViewables()

        console.log('afterViewablesChanged', this, myViewables)

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

        this.dispatchEvent('viewable-change')
    }

    getViewables(){
        let viewables = {}

        this.dom.find('[viewable]').each((i, el)=>{
            let name = $(el).attr('viewable')
            viewables[ name ] = ui.viewables()[name]
        })

        return viewables
    }

    focus(viewable){
        console.log('focus', this)
        if(this.isViewablePartOfThisView(viewable)){
            this.dom.find('[viewable]').attr('visible', 'false')
            viewable.dom.attr('visible', 'true')

            this.focusSelect(viewable.dom.attr('viewable'))

            viewable.dispatchEvent('viewable-gain-focus')
        } else {
            if(ui.DO_LOG){
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

        this.x = 0
        this.y = 0

        if(type !== 'vertical' && type !== 'horizontal'){
            throw 'unssupported Splitter type "' + type + '"'
        }
        
        this.dom.on('mouseenter', (evt)=>{
            this.isHover = true

            this.update(true)
        })

        this.dom.on('mousedown', (evt)=>{
            this.isDragging = true
            this.dragStartX = evt.originalEvent.pageX
            this.dragStartY = evt.originalEvent.pageY

            this.update(true)
        })

        this.dom.on('mousemove', (evt)=>{
            if(this.isDragging){
                this.x = this.x - (this.dragStartX - evt.originalEvent.pageX)
                this.y = this.y - (this.dragStartY - evt.originalEvent.pageY)

                this.dragStartX = evt.originalEvent.pageX
                this.dragStartY = evt.originalEvent.pageY


                this.checkLimits()

            }

            this.update()
        })

        this.dom.on('mouseup mouseleave ', (evt)=>{
            this.isDragging = false
            this.isHover = false

            this.update(true)

            this.dispatchEvent('dragend')
        })

        Splitters.push(this)

        this.update()
    }

    setRelative(xr,yr){
        this.set( ui.flexview().width() * xr, ui.flexview().height() * yr )
    }

    set(x,y){
        this.x = x
        this.y = y
        this.checkLimits()
        this.update()
    }

    getRelative(){
        if(this.type === 'vertical'){
            return this.x / ui.flexview().width()
        } else if(this.type === 'horizontal'){
            return this.y / ui.flexview().height()
        }
    }

    checkLimits(){
        if(this.x < ui.VIEW_MIN_SIZE){
            this.x = ui.VIEW_MIN_SIZE
        }
        if(this.x > ui.flexview().width() - ui.VIEW_MIN_SIZE){
            this.x = ui.flexview().width() - ui.VIEW_MIN_SIZE
        }
        if(this.y > ui.flexview().height() - ui.VIEW_MIN_SIZE){
            this.y = ui.flexview().height() - ui.VIEW_MIN_SIZE
        }

        /* only use one axis for each type */
        if(this.type === 'vertical'){
            this.y = 0
        } else if(this.type === 'horizontal'){
            this.x = 0
        }
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
                return ui.verticalSplitterPosition() + 3 /* tiny offset, so they dont overlay each other */
            } else {
                this.x
            }
        } else {
            return this.x - ui.SPLITTER_WIDTH / 2
        }
    }

    getY(){
        if(this.type === 'vertical'){
            return this.y
        } else {
            return this.y - ui.SPLITTER_WIDTH / 2
        }
    }

    getWidth(){
        if(this.type === 'vertical'){
            return ui.SPLITTER_WIDTH
        } else if(this.type === 'horizontal'){
            if(this.isHorizontalLeft){
                return ui.verticalSplitterPosition() - 3 /* tiny offset, so they dont overlay each other */
            } else {
                return ui.flexview().width() - ui.verticalSplitterPosition()
            }
        }
    }

    getHeight(){
        if(this.type === 'vertical'){
            return ui.flexview().height()
        } else if(this.type === 'horizontal'){
            return ui.SPLITTER_WIDTH
        }
    }
}

let Splitters = []

