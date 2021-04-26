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

        UTIL.hint('Latest Changes', makeListText([
            'support new monitor sizes'
        ]))

        function makeListText(entries){
            return '<ul><li>' + entries.join('</li><li>') + '</li></ul>'
        }
        
        UTIL.hint('New Feature', 'History of your recent codes and opened shared codes')
        UTIL.hint('New Feature', 'Edit your own shared codes and publish updates')

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

    // For IE and Firefox prior to version 4
    if (e) {
        e.returnValue = 'Really want to leave?';
    }

    // For Safari
    return 'Really want to leave?';
};
