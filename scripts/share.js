var SHARE = ((global, $)=>{
    
    let currentShare

    let BASE_URL = document.location.protocol + '//' + document.location.host

    $(global).on('load', init)

    let isShareOpen = false

    function init(){


        let moreWidth = $('#share .more .currentshare_container').outerWidth()

        $('#share .more').css({
            width: 0
        })

        $('#share .docreate').on('click', ()=>{
            doCreate()

            if(isShareOpen){
                return
            }
            isShareOpen = true
            $('#share .more').animate({
                width: moreWidth
            }, 200)

            $('#share .docreate').animate({
                'margin-right': '10px'
            }, 200)
        
            $('#share .docreate').html('Share again')

            setTimeout(()=>{
                $('#share .more').css('overflow', 'visible')
            }, 300)
        })


        $('#share .currentshare').on('change', ()=>{
            $('#share .currentshare').val(currentShare)
        })

        $('#share .copy_share_to_clipboard').on('click', ()=>{
            $('#share .currentshare').focus().select()
            document.execCommand('copy')
        })

        let params = new URLSearchParams( document.location.search)
        let paramid = params.get('id')
        if(paramid){
            setCurrentShare(paramid)
            setTimeout(doReceive, 1000)
        } else {
            $(window).trigger('yyy_prepared')
        }
    }

    function setCurrentShare(id){
        currentShare = id.replace('/beta', '').replace(BASE_URL + '/?id=', '')
        if(typeof currentShare === 'string' && currentShare.length > 0){
            $('#share').addClass('has_share')
        } else {
            $('#share').removeClass('has_share')
        }
        $('#share .currentshare').val(BASE_URL + '/?id=' + currentShare)
    }

    function doCreate(){
        reporter.report(reporter.REPORT_TYPE_IDS.shareCode)

        log('creating new share')


        let code = editors.get('normal').editor.getValue()
        if(typeof code !== 'string' || code.length === 0){
            util.alert('Cannot share empty code!')
            return
        }
       
        $('#ponybin-create-overlay').show()

        let settings = {}
        settings.input = INPUT.getStorage()
        settings.property = PROPERTY.getStorage()
        settings.general = storage.getStorage()

        let data = {
            code: code,
            settings: JSON.stringify(settings)
        }

        let minifiedCode = editors.get('minified').editor.getValue()
        if(typeof minifiedCode === 'string' && minifiedCode.length > 0 && yyy.isCustomMinifiedCode()){
            data.minified_code = minifiedCode
        }

        let uiBuilder = UI_BUILDER.buildStorage()
        if(uiBuilder.elements instanceof Array && uiBuilder.elements.length > 0){
            data.ui_builder = JSON.stringify(uiBuilder)
        }

        $.post(BASE_URL + '/api/create', data).done((data)=>{
            try {
                let json = JSON.parse(data)
                let id = json.key
                setCurrentShare(id)
            } catch (e){
                console.error(e)
                util.alert('Cannot share via ponybin. Please contact me.')
            }
        }).fail((e)=>{
            console.error(e)
            util.alert('Cannot share via ponybin. Please contact me!')
        }).always(()=>{
            $('#ponybin-create-overlay').hide()
        })
    }

    function doReceive(){
        if(!currentShare){
            util.alert('Cannot get data from ponybin. Please contact me.')
            return
        }
        reporter.report(reporter.REPORT_TYPE_IDS.receiveShareCode)
        
        log('receiving share', currentShare)
        $('#ponybin-receive-overlay').show()
        $.post(BASE_URL + '/api/get', {
            key: currentShare.replace('/beta', '').replace(BASE_URL + '/?id=', '')
        }).done((data)=>{
            try {
                let json = JSON.parse(data)

                if(typeof json.luabin === 'object' && typeof json.luabin.code === 'string'){
                    editor.setValue(json.luabin.code, -1)
                }

                if(typeof json.luabin === 'object' && typeof json.luabin.minified_code === 'string'){
                    minifiedEditor.setValue(json.luabin.minified_code, -1)
                    $('#minified-code-container').show()
                    $('#minified-code-container .custom_hint').show()
                }

                if(typeof json.luabin === 'object' && typeof json.luabin.settings === 'string'){
                    try {
                        let parsed = JSON.parse(json.luabin.settings)
                        INPUT.setStorage(parsed.input)
                        PROPERTY.setStorage(parsed.property)
                        storage.setStorage(parsed.general)
                        //YYY.refreshAll() TODO enable this again
                    } catch (e){
                        console.error('error parsing settings from ponybin', e)
                    }
                }

                if(typeof json.luabin === 'object' && typeof json.luabin.ui_builder === 'string'){
                    try {
                        let parsed = JSON.parse(json.luabin.ui_builder)
                        UI_BUILDER.setStorage(parsed)
                        UI_BUILDER.loadFromStorage()
                    } catch (e){
                        console.error('error parsing ui_builder from ponybin', e)
                    }
                }
            } catch (e){
                console.error(e)
                util.alert('Cannot get data from ponybin. Please contact me!')
            }
        }).fail((e)=>{
            console.error(e)
            util.alert('Cannot get data from ponybin. Is the share key correct?')
        }).always(()=>{
            $('#ponybin-receive-overlay').hide()
            $(window).trigger('yyy_prepared')
        })
    }

    /* helper */

    function log(){
        let args = []
        for(let a of arguments){
            args.push(a)
        }
        console.log.apply(console, ['SHARE.' + arguments.callee.caller.name + '()'].concat(args))
    }

})(window, jQuery)
