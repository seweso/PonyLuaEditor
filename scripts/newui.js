newui = (($)=>{

    $(window).on('load', init)


    let viewables = {}
    let views = {}

    const DO_LOG = true

    const DEFAULT_LAYOUT = {
        top_left: ['editor_normal', 'editor_minified', 'editor_unminified', 'editor_uibuilder'],
        top_right: ['properties', 'inputs', 'outputs', 'documentation'],
        bottom_left: ['console'],
        bottom_right: ['monitor', 'settings']
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

            // TODO:
        })

        if(DO_LOG){
            console.log('Views', views)
        }

        loadLayout(DEFAULT_LAYOUT)

        //$(window).trigger('yyy_ui_loaded')
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

                viewables[viewable].moveToView(views[view])
            }
        }
    }

    return {
        views: ()=>{
            return views
        },
        DO_LOG: DO_LOG
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


    moveToView(view){
        view.addViewable(this, true)

        let curView = this.myCurrentView()
        if(curView){
            curView.refreshFocus()
        }

        this.dispatchEvent('viewable-change')
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

    onViewableChange(listener){
        this.addListener('viewable-change', listener)
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
        let select = $('<div select-viewable="' + viewable.name() + '">' + viewable.name() + '</div>')
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
        let myViewables = []

        this.dom.find('[viewable]').each((i, el)=>{
            myViewables.push( $(el).attr('viewable') )
        })

        this.dom.find('[select-viewable]').each((i, el)=>{
            if( myViewables.indexOf( $(el).attr('select-viewable') ) === -1 ){
                $(el).remove()
            }
        })

        /* select the first viewable if no other one is already visible */
        if(this.dom.find('[viewable][visible="true"]').length === 0){
            this.dom.find('[viewable]').first().attr('visible', 'true')
            this.dom.find('[select-viewable]').attr('visible', 'true')
        }
    }

    focus(viewable){
        if(this.isViewablePartOfThisView(viewable)){
            this.dom.find('[viewable]').attr('visible', 'false')
            viewable.dom.attr('visible', 'true')
        } else {
            if(newui.DO_LOG){
                console.warn('cannot focus viewable that is not part of this view', viewable, this)
            }
        }
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
}