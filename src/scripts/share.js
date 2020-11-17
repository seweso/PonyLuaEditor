var SHARE = (($)=>{
    "use strict";
    
    let currentShare

    let BASE_URL = 'https://lua.flaffipony.rocks'
    
    LOADER.on(LOADER.EVENT.STORAGE_READY, init)

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
            setTimeout(()=>{
                doReceive(currentShare)
            }, 1000)
        }
        LOADER.done(LOADER.EVENT.SHARE_READY)
    }

    function setCurrentShare(id){
        currentShare = id
        if(typeof currentShare === 'string' && currentShare.length > 0){
            $('#share').addClass('has_share')
        } else {
            $('#share').removeClass('has_share')
        }
        $('#share .currentshare').val(BASE_URL + '/?id=' + currentShare)
    }

    function doCreate(){
        ENGINE.saveCodesInStorage()

        REPORTER.report(REPORTER.REPORT_TYPE_IDS.shareCode)

        console.log('creating new share')

        let code = EDITORS.get('normal').editor.getValue()
        if(typeof code !== 'string' || code.length === 0){
            UTIL.alert('Cannot share empty code!')
            return
        }
       
        $('#ponybin-create-overlay').show()

        let data = {
            code: 'v2',
            settings: STORAGE.configurationAsString()
        }

        $.post(BASE_URL + '/api/create', data).done((data)=>{
            try {
                let json = JSON.parse(data)
                let id = json.key
                setCurrentShare(id)

                HISTORY.addShareKey(id, json.token)
            } catch (e){
                console.error(e)
                UTIL.alert('Cannot share via ponybin. Please contact me.')
            }
        }).fail((e)=>{
            console.error(e)
            UTIL.alert('Cannot share via ponybin. Please contact me!')
        }).always(()=>{
            $('#ponybin-create-overlay').hide()
        })
    }

    function updateSharedCode(sharekey, token, successCallback){
        ENGINE.saveCodesInStorage()

        REPORTER.report(REPORTER.REPORT_TYPE_IDS.updateCode)

        console.log('updating share')
       
        $('#ponybin-create-overlay').show()

        let data = {
            settings: STORAGE.configurationAsString(),
            id: sharekey,
            token: token
        }

        $.post(BASE_URL + '/api/update', data).done((data)=>{
            if(typeof successCallback === 'function'){
                successCallback()
            }
        }).fail((e)=>{
            console.error(e)
            UTIL.alert('Cannot update via ponybin. Please contact me!')
        }).always(()=>{
            $('#ponybin-create-overlay').hide()
        })
    }

    function doReceive(sharekey, successCallback){
        if(!sharekey){
            UTIL.alert('Cannot get data from ponybin. Please contact me.')
            return
        }
        REPORTER.report(REPORTER.REPORT_TYPE_IDS.receiveShareCode)

        console.log('receiving share', sharekey)
        $('#ponybin-receive-overlay').show()

        $.post(BASE_URL + '/api/get', {
            key: sharekey
        }).done((data)=>{
            try {
                let json = JSON.parse(data)

                if(typeof json.luabin === 'object'){
                    STORAGE.setFromShare(sharekey, json.luabin)
                    if(typeof successCallback === 'function'){
                        successCallback()
                    }
                } else {
                    throw 'invalid luabin format'
                }
            } catch (e){
                console.error(e)
                UTIL.alert('Cannot get data from ponybin. Please contact me!')
            }
        }).fail((e)=>{
            console.error(e)
            UTIL.alert('Cannot get data from ponybin. Is the share key correct?')
        }).always(()=>{
            $('#ponybin-receive-overlay').hide()
        })
    }

    return {
        doReceive: doReceive,
        updateSharedCode: updateSharedCode
    }

})(jQuery)
