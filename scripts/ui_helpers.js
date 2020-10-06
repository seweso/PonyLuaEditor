class DynamicSizedViewableContent {
    constructor(container, viewable){
        this.dom = $(container)
        this.viewable = viewable

        this.viewable.onViewableResize(()=>{
            this.refreshSize()
        })

        this.viewable.onGainFocus(()=>{
            this.refreshSize()
        })

        setTimeout(()=>{
            this.refreshSize()
        }, 100)
    }

    refreshSize(){
        this.dom.width(this.getAvailableWidth())
        this.dom.height(this.getAvailableHeight())
    }

    getAvailableHeight(){
        let myCurrentView = this.viewable.myCurrentView()
        
        if(! myCurrentView){
            return 0
        }

        let avail = myCurrentView.dom.find('.viewable_container').offset().top
            + myCurrentView.dom.find('.viewable_container').height()
            - this.dom.offset().top

        return avail < 0 ? 0 : avail
    }

    getAvailableWidth(){
        let myCurrentView = this.viewable.myCurrentView()

        if(! myCurrentView){
            return 0
        }

        let avail = myCurrentView.dom.find('.viewable_container').offset().left
            + myCurrentView.dom.find('.viewable_container').width()
            - this.dom.offset().left

        return avail < 0 ? 0 : avail
    }
}

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
        
        let moveto = $('<span class="moveto icon-menu">')
        let choose
        moveto.on('click', (evt)=>{
            choose = $('<div class="moveto_choose">')
            choose.append(
                $('<div class="header">Move To</div>'))

            choose.css({
                position: 'fixed',
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
        if(this.isViewablePartOfThisView(viewable)){
            this.dom.find('[viewable]').attr('visible', 'false')
            viewable.dom.attr('visible', 'true')

            this.focusSelect(viewable.dom.attr('viewable'))

            viewable.dispatchEvent('viewable-gain-focus')
        } else {
            console.warn('cannot focus viewable that is not part of this view', viewable, this)
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
                evt.originalEvent.stopPropagation()
                this.x = this.x - (this.dragStartX - evt.originalEvent.pageX)
                this.y = this.y - (this.dragStartY - evt.originalEvent.pageY)

                this.dragStartX = evt.originalEvent.pageX
                this.dragStartY = evt.originalEvent.pageY


                this.checkLimits()

            }

            this.update()
        })

        this.dom.on('mouseup mouseleave ', (evt)=>{
            if(this.isDragging){
                this.isDragging = false
                this.isHover = false

                this.update(true)

                this.dispatchEvent('dragend')
            }
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

