var SHARE = (($)=>{
    "use strict";
    
    let currentShare

    let BASE_URL = document.location.protocol + '//' + document.location.host
    
    loader.on(loader.EVENT.STORAGE_READY, init)

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
            loader.done(loader.EVENT.SHARE_READY)
        }
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
        reporter.report(reporter.REPORT_TYPE_IDS.shareCode)

        console.log('creating new share')


        let code = editor.get('normal').editor.getValue()
        if(typeof code !== 'string' || code.length === 0){
            util.alert('Cannot share empty code!')
            return
        }
       
        $('#ponybin-create-overlay').show()

        let data = {
            code: 'v2',
            settings: storage.asString()
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
        
        console.log('receiving share', currentShare)
        $('#ponybin-receive-overlay').show()

        $.post(BASE_URL + '/api/get', {
            key: currentShare
        }).done((data)=>{
            try {
                let json = JSON.parse(data)

                if(typeof json.luabin === 'object'){
                    storage.setFromShare(currentShare, json.luabin)
                } else {
                    throw 'invalid luabin format'
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
            loader.done(loader.EVENT.SHARE_READY)
        })
    }

})(jQuery)
