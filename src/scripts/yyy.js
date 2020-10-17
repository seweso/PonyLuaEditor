YYY = (($)=>{
    "use strict";

    let noExitConfirm = false

    let isCustomMinifiedCode = false

    LOADER.on(LOADER.EVENT.UI_READY, init)

    function init(){


        if(!document.location.href || document.location.href.indexOf('file') >= 0 ||  document.location.href.indexOf('localhost') >= 0){
            $('#share').attr('style', 'display: none!important')
        }


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
