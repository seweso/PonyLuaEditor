VERSION_KEEPER = (()=>{
    
    let BASE_URL = 'https://lua.flaffipony.rocks'

    LOADER.on(LOADER.EVENT.UI_READY, init)

    function init(){
        let isBeta = document.location.pathname.indexOf('/beta') === 0
        let isOffline = document.location.host === 'lvh.me' || document.location.host === 'localhost' || document.location.protocol === 'file:'
        let isOriginal = document.location.host === 'lua.flaffipony.rocks'
        let isStormNet = document.location.port == 18146 && document.location.pathname.indexOf('/PonyEditor/') === 0

        if(isOffline){
            let s = document.createElement('script')
            s.onload = checkVersion
            s.onerror = onUnableToCheck
            s.src = 'version.js'
            document.body.appendChild(s)
        } else if(isBeta){
            setState('Beta', '#408DE3', '#fff')
        } else if(isStormNet){
            setState('Weird stormnet ;)', '#21F0D2', '#fff')
        } else if(!isOriginal){
            setState('Weird domain ;)', '#F021D2', '#fff')
        }
    }

    function checkVersion(){
        $.get({
            url: BASE_URL + '/version.js',
            cache: false}).done((onlineData)=>{
            if(typeof onlineData === 'string'){

                let myVersion = window.PONY_IDE_VERSION

                let matches = onlineData.match(/PONY_IDE_VERSION = "([^"]*)"/)
                if(matches){
                    let onlineVersion = matches[1]
                
                    if(onlineVersion !== myVersion){
                        onOutdated()
                    } else {
                        onUpToDate()
                    }
                } else {
                    onUnableToCheck()
                }
            } else {
                onUnableToCheck()
            }
        }).fail(onUnableToCheck)
    }

    function onUnableToCheck(){
        UTIL.addNavigationHint('Unable to check version', 'warning')
        setState('Offline', '#000', '#fff')
        $('.ide').attr('offline', true)
    }

    function onUpToDate(){
        UTIL.addNavigationHint('Version up to date', 'success')
        setState('Online', '#46C948', '#fff')
    }

    function onOutdated(){        
        UTIL.addNavigationHint('Version outdated. <a href="https://gitlab.com/stormworks-tools/editor/-/archive/master/editor-master.zip" download style="color: #fff; font-weight: bold">Download latest version here</a>', 'error')
        setState('Outdated', '#EA5151', '#fff')

        $('.ide').attr('offline', true)
    }

    function setState(text, color_fill, color_text){
        $('.version_state').html(text).css({
            color: color_text,
            'background-color': color_fill
        }).show()
    }
})()
