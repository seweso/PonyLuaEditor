var SHARE = ((global, $)=>{
    
    let currentShare

    let BASE_URL = document.location.protocol + '//' + document.location.host

    $(global).on('load', init)

    function init(){
        let stored = localStorage.getItem('share')
        if(typeof stored === 'string' && stored.length > 0){
            setCurrentShare(stored)
        }

        let innerHeight = $('#share .inner').height()

        $('#share .inner').css({
            height: 0
        })

        let outerHeight = $('#share .outer').height()

        $('#share .outer').css({
            height: outerHeight
        })

        $('#share').on('click', ()=>{
            if($('#share').hasClass('isopen')){
                return
            }
            $('#share').addClass('isopen')
            $('#share .outer').animate({
                height: 0
            }, 200)
            $('#share .inner').animate({
                height: innerHeight
            }, 200)
        })
        $('#share .close').on('click', (e)=>{
            if($('#share').hasClass('isopen') === false){
                return
            }
            e.preventDefault()
            e.stopImmediatePropagation()

            $('#share .outer').animate({
                height: outerHeight
            }, 200)
            $('#share .inner').animate({
                height: 0
            }, 200)            
            $('#share').removeClass('isopen')
        })


        $('#share .docreate').on('click', ()=>{
            doCreate()
        })
        $('#share .doreceive').on('click', ()=>{
            doReceive()
        })


        $('#share .currentshare').on('input', ()=>{
            setCurrentShare( $('#share .currentshare').val() )
        })

        $('#share .copy_share_to_clipboard').on('click', ()=>{
            $('#share .currentshare').focus().select()
            document.execCommand('copy')
        })

        let params = new URLSearchParams( document.location.search)
        let paramid = params.get('id')
        if(paramid){
            setCurrentShare(paramid)
            doReceive()
        }
    }

    function setCurrentShare(id){
        currentShare = id.replace(BASE_URL + '/?id=', '')
        if(typeof currentShare === 'string' && currentShare.length > 0){
            $('#share').addClass('has_share')
            localStorage.setItem('share', currentShare)
        } else {
            $('#share').removeClass('has_share')
        }
        $('#share .currentshare').val(BASE_URL + '/?id=' + currentShare)
    }

    function doCreate(){
        let code = editor.getValue()
        if(typeof code !== 'string' || code.length === 0){
            error('code is empty')
            return
        }
        log('creating new share')
        $('#pastebin-create-overlay').show()
        $.post(BASE_URL + '/api/create', {
            code: code,
            settings: null
        }).done((data)=>{
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
            key: currentShare
        }).done((data)=>{
            try {
                let json = JSON.parse(data)

                if(typeof json.luabin === 'object' && typeof json.luabin.code === 'string'){
                    editor.setValue(json.luabin.code)
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
