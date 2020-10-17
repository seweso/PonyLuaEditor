UI = (($)=>{

    let viewables = {}
    let views = {}
    let editors = {}

    let splitterVertical
    let splitterHorizontalLeft
    let splitterHorizontalRight

    let isServerMode = false

    const VIEW_VIEW_MIN_SIZE = 100
    const SPLITTER_WIDTH = 6 /* this needs to be changed together with the css */

    const MY_CONFIGURATION_NAME = 'ui'

    const DEFAULT_LAYOUT = {
        top_left: ['viewable_editor_normal', 'viewable_editor_minified', 'viewable_editor_unminified', 'viewable_editor_uibuilder', 'viewable_editor_uibuilder_code'],
        top_right: ['viewable_documentation', 'viewable_properties', 'viewable_inputs', 'viewable_outputs', 'viewable_examples', 'viewable_learn', 'viewable_official_manuals'],
        bottom_left: ['viewable_console', 'viewable_hints'],
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

    LOADER.on(LOADER.EVENT.SHARE_READY, init)

    function init(){
        $('[viewable]').each((i, el)=>{
            viewables[ $(el).attr('viewable') ] = new Viewable( el )
        })

        $('[view]').each((i, el)=>{
            let view = new View( el )
            let name = $(el).attr('view')
            views[ name ] = view

            view.addListener('resize', ()=>{
                Editors.resize()
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

        let conf = STORAGE.getConfiguration(MY_CONFIGURATION_NAME)
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


        /* create special dynamic sized viewables that are not editors */

        new DynamicSizedViewableContent($('#console').get(0), viewables['viewable_console'])

        for(let v of Object.keys(viewables)){
            let vw = viewables[v]
            vw.onGainFocus(()=>{
                vw.dom.find('[youtube-embed]').each((i, el)=>{
                    let id = $(el).attr('youtube-embed')
                    if(typeof id === 'string' && id.trim() !== ''){
                        $(el).append(
                            $('<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/' + id +'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>')
                        )
                    }
                    $(el).removeAttr('youtube-embed')

                    new DynamicSizedViewableContent($(el).get(0), vw, true)
                })
            })
        }

        
        $('#ide-server-mode').on('change', ()=>{

            isServerMode = $('#ide-server-mode').prop('checked')
            STORAGE.setConfiguration('settings.servermode', isServerMode)

            if(isServerMode){            
                $('.ide').attr('mode', 'server')
                if(ENGINE.isRunning()){
                    ENGINE.stop()
                }
            } else {
                $('.ide').attr('mode', 'client')            
            }
            DOCUMENTATION.refresh()
            EDITORS.refreshCharacterCounts()
        })

        $('#ide-server-mode').prop('checked', STORAGE.getConfiguration('settings.servermode') || false).trigger('change')


        LOADER.done(LOADER.EVENT.UI_READY)
    }

    function saveConfiguration(){
        STORAGE.setConfiguration(MY_CONFIGURATION_NAME, config)
    }

    function onSplitterUpdate(){
        views.top_left.resize(0, 0, splitterVertical.x, splitterHorizontalLeft.y)
        views.top_right.resize(splitterVertical.x, 0, UI.flexview().width() - splitterVertical.x, splitterHorizontalRight.y)

        views.bottom_left.resize(0, splitterHorizontalLeft.y, splitterVertical.x, UI.flexview().height() - splitterHorizontalLeft.y)
        views.bottom_right.resize(splitterVertical.x, splitterHorizontalRight.y, UI.flexview().width() - splitterVertical.x, UI.flexview().height() - splitterHorizontalRight.y)
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
        },
        isServerMode: ()=>{
            return isServerMode
        }
    }

})(jQuery)




