var SHARE = ((global, $)=>{
    
    let currentShare

    let BASE_URL = document.location.protocol + '//' + document.location.host

    $(global).on('load', init)

    let isShareOpen = false

    function init(){

        let moreWidth = $('#share .more').width()

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
            setTimeout(doReceive, 500)
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
        log('creating new share')


        let code = editor.getValue()
        if(typeof code !== 'string' || code.length === 0){
            error('code is empty')
            return
        }
       
        $('#pastebin-create-overlay').show()

        let settings = {}
        settings.input = INPUT.getStorage()
        settings.property = PROPERTY.getStorage()
        settings.general = YYY.getStorage()

        let data = {
            code: code,
            settings: JSON.stringify(settings)
        }

        let minifiedCode = minifiedEditor.getValue()
        if(typeof minifiedCode === 'string' && minifiedCode.length > 0 && YYY.isCustomMinifiedCode()){
            data.minified_code = minifiedCode
        }

        $.post(BASE_URL + '/api/create', data).done((data)=>{
            try {
                let json = JSON.parse(data)
                let id = json.key
                setCurrentShare(id)
            } catch (e){
                console.error(e)
                error('Cannot share via pastebin')
            }
        }).fail((e)=>{
            console.error(e)
            error('Cannot share via pastebin')
        }).always(()=>{
            $('#pastebin-create-overlay').hide()
        })
    }

    function doReceive(){
        if(!currentShare){
            error('cant receive share, currentShare is not available')
            return
        }
        log('receiving share', currentShare)
        $('#pastebin-receive-overlay').show()
        $.post(BASE_URL + '/api/get', {
            key: currentShare.replace('/beta', '').replace(BASE_URL + '/?id=', '')
        }).done((data)=>{
            try {
                let json = JSON.parse(data)

                if(typeof json.luabin === 'object' && typeof json.luabin.code === 'string'){
                    editor.setValue(json.luabin.code)
                }

                if(typeof json.luabin === 'object' && typeof json.luabin.minified_code === 'string'){
                    minifiedEditor.setValue(json.luabin.minified_code)
                    $('#minified-code-container').show()
                    $('#minified-code-container .custom_hint').show()
                }

                if(typeof json.luabin === 'object' && typeof json.luabin.settings === 'string'){
                    try {
                        let parsed = JSON.parse(json.luabin.settings)
                        INPUT.setStorage(parsed.input)
                        PROPERTY.setStorage(parsed.property)
                        YYY.setStorage(parsed.general)
                        YYY.refreshAll()
                    } catch (e){
                        console.error('error parsing settings from pastebin', e)
                    }
                }
            } catch (e){
                console.error(e)
                error('Cannot get data from pastebin')
            }
        }).fail((e)=>{
            console.error(e)
            error('Cannot get data from pastebin')
        }).always(()=>{
            $('#pastebin-receive-overlay').hide()
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

    function error(msg){
        alert('An error occured while sharing:' + msg)
    }

})(window, jQuery)
