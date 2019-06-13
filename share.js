var SHARE = ((global, $)=>{
    
    let currentShare

    /* i trust you to not mess around with my pastebin API key! */
    const API_DEV_KEY = '56db6234c64843a2e48c40d28a5834f0'
    const PASTE_NAME = 'Stormworks Lua - lua.flaffipony.rocks'
    const PASTE_FORMAT = 'lua'
    const PASTE_EXPIRE_DATE = 'N'
    const PASTE_PRIVATE = 0

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

        let params = new URLSearchParams( document.location.search)
        let paramid = params.get('id')
        if(paramid){
            setCurrentShare(paramid)
            doReceive()
        }
    }

    function setCurrentShare(val){
        currentShare = val
        if(typeof currentShare === 'string' && currentShare.length > 0){
            $('#share').addClass('has_share')
            localStorage.setItem('share', currentShare)
            $('#share .share_link').attr('href', 'https://pastebin.com/' + currentShare)
        } else {
            $('#share').removeClass('has_share')
        }
        $('#share .currentshare').val(currentShare)
    }

    function doCreate(){
        let code = editor.getValue()
        if(typeof code !== 'string' || code.length === 0){
            error('code is empty')
            return
        }
        log('creating new share')
        $('#pastebin-create-overlay').show()
        $.post('https://cors.io/?https://pastebin.com/api/api_post.php', {
            api_dev_key: API_DEV_KEY,
            api_option: 'paste',
            api_paste_code: code,
            api_paste_name: PASTE_NAME,
            api_paste_format: PASTE_FORMAT,
            api_paste_private: PASTE_PRIVATE,
            api_paste_expire_date: PASTE_EXPIRE_DATE
        }).done((data)=>{
            let id = ("" + data).replace('https://pastebin.com/', '')
            setCurrentShare(id)
            window.history.pushState(null, 'Stormworks Lua', document.location.href.split('?')[0] + '?id=' + id);
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
        $.get('https://cors.io/?https://pastebin.com/raw/' + encodeURIComponent(currentShare)).done((data)=>{
            editor.setValue(data)
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
