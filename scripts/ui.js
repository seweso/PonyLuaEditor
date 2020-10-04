ui = (($)=>{

    let viewables = {}
    let views = {}
    let editors = {}

    let splitterVertical
    let splitterHorizontalLeft
    let splitterHorizontalRight


    const VIEW_VIEW_MIN_SIZE = 100
    const SPLITTER_WIDTH = 6 /* this needs to be changed together with the css */

    const MY_CONFIGURATION_NAME = 'ui'

    const DEFAULT_LAYOUT = {
        top_left: ['viewable_editor_normal', 'viewable_editor_minified', 'viewable_editor_unminified', 'viewable_editor_uibuilder'],
        top_right: ['viewable_documentation', 'viewable_properties', 'viewable_inputs', 'viewable_outputs', 'viewable_examples', 'viewable_official_manuals'],
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



        new DynamicSizedViewableContent($('#console').get(0), viewables['viewable_console'])


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




