YYY = (($)=>{
    "use strict";

    let noExitConfirm = false

    let isCustomMinifiedCode = false

    LOADER.on(LOADER.EVENT.UTIL_READY, init)

    function init(){
        /* navigation menu */
        $('#menu-open, #navigation .center').on('click', ()=>{
            if($('#navigation').hasClass('open')){
                $('#navigation').removeClass('open')
                $('#navigation').animate({
                    top: '0px'
                })
            } else {
                $('#navigation').animate({
                    top: '80vh'
                }, ()=>{
                    $('#navigation').addClass('open')
                })
            }
        })

        $('#download-offline').on('click', ()=>{
            REPORTER.report(REPORTER.REPORT_TYPE_IDS.downloadOffline)
        })

        ENGINE.refresh()

        /*
        UTIL.hint('Latest Changes', makeListText([
            'support new monitor sizes'
        ]))
        */

        function makeListText(entries){
            return '<ul><li>' + entries.join('</li><li>') + '</li></ul>'
        }

        UTIL.hint('Improvements', makeListText([
            'Improved layout for mobile devices (<1024px width in landscape)',
            'Improved highlighting of keywords and functions',
            'Improved documentation search'
        ]))

        UTIL.hintImportant('New Features', makeListText([
            'Colorpicker with monitor color correction and game color presets',
            'Custom delay of input data (0 - 60 ticks)',
            'Added My Library tab so users can manage their own private little helper functions',
            'Touch (Mobile) support for UI Builder and Monitor',
            'Copy color mode for UI Builder'
        ]))

        $('[select-viewable="viewable_history"]').addClass('animation_flash')

        UI.viewables()['viewable_history'].onGainFocus(()=>{
            let selDom = UI.viewables()['viewable_history'].getSelectDom()
            if(selDom){
                selDom.removeClass('animation_flash')
            }  
        })

        setTimeout(()=>{
            $('[select-viewable="viewable_history"]').removeClass('animation_flash')
        }, 1000 * 20)

        LOADER.done(LOADER.EVENT.OTHERS_READY)
    }

    return {
        noExitConfirm: ()=>{
            return noExitConfirm
        },
        makeNoExitConfirm: ()=>{
            noExitConfirm = true
        },
        isCustomMinifiedCode: ()=>{ return isCustomMinifiedCode },
        setCustomMinifiedCode: (s)=>{ isCustomMinifiedCode = s}
    }


})(jQuery)


window.onbeforeunload = function (e) {
    if(YYY.noExitConfirm()){
        return
    }
    e = e || window.event;

    //for electron
    let isElectron = (()=>{
        // Renderer process
        if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
            return true;
        }

        // Main process
        if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
            return true;
        }

        // Detect the user agent when the `nodeIntegration` option is set to true
        if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
            return true;
        }

        return false;
    })()
    if(isElectron){
        UTIL.message('Click again to leave without saving.')
        YYY.makeNoExitConfirm()
        return false
    }

    // For IE and Firefox prior to version 4
    if (e) {
        e.returnValue = 'Really want to leave?';
    }

    // For Safari
    return 'Really want to leave?';
};
