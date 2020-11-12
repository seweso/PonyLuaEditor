YYY = (($)=>{
    "use strict";

    let noExitConfirm = false

    let isCustomMinifiedCode = false

    LOADER.on(LOADER.EVENT.UI_READY, init)

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

        UTIL.hint('Important Change Notification', 'Due to weird drawing on Chrome (and other webkit browsers), i reverted the drawing algorithm back to the one you know from the old, orange Lua IDE. Sorry you Firefox users, you loose the new accuracy after just a few days :(')
        UTIL.hint('New feature', 'More hotkeys (see help, top right, scroll down)')
        
        LOADER.done(LOADER.EVENT.OTHERS_READY)
    }

    return {
        noExitConfirm: noExitConfirm,
        makeNoExitConfirm: ()=>{
            noExitConfirm = true
        },
        isCustomMinifiedCode: ()=>{ return isCustomMinifiedCode },
        setCustomMinifiedCode: (s)=>{ isCustomMinifiedCode = s}
    }


})(jQuery)


window.onbeforeunload = function (e) {
    if(YYY.noExitConfirm){
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
