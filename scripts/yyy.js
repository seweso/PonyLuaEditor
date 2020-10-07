YYY = (($)=>{
    "use strict";

    let noExitConfirm = true /* TODO remove before production */

    let isCustomMinifiedCode = false

    LOADER.on(LOADER.EVENT.UI_READY, init)

    function init(){

        function showPerformanceHint(){
            UTIL.hint('Performance hint', 'After 30 minutes you should reload the page to reset the emulator.\nPlease save ALL of your code (editor, minified and ui builder).\nThen reload the page.', {extended: true})
        }
        setTimeout(()=>{
            showPerformanceHint()
            setInterval(()=>{
                showPerformanceHint()            
            }, 1000 * 60 * 10)
        }, 1000 * 60 * 30)

        if(document.location.pathname.indexOf('beta') >= 0 || document.location.host === 'localhost'){
            $('#beta').show()
        }

        if(!document.location.host || !document.location.href || document.location.href.indexOf('file') === 0){
            $('#offline').show()
            $('#download-offline').hide()
            $('#share').hide()
        }


        $('#download-offline').on('click', ()=>{
            REPORTER.report(REPORTER.REPORT_TYPE_IDS.downloadOffline)
            UTIL.message('How to use the offline version:', '<ul><li>extract the zip folder</li><li>doubleclick "index.html"</li><li>This opens the offline version with your default browser</li><ul>')
        })


        /* help badge */
        let firstHelpOpen = true

        $('#help-badge, #help-menu-entry').on('click', ()=>{
            REPORTER.report(REPORTER.REPORT_TYPE_IDS.openHelp)

            if(firstHelpOpen){
                firstHelpOpen = false
                $('#help-youtube-video').html('<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/Z8cLxmVd07c" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>')
            }
            $('#help').fadeIn()
            resizeYoutubeIframe()
        })
        $(window).on('resize', ()=>{
            resizeYoutubeIframe()
        })

        function resizeYoutubeIframe(){            
            $('#help-youtube-video iframe').css({
                width: $('#help-youtube-video').width(),
                height: $('#help-youtube-video').width() / (16/9)
            })
        }


        $('#help-close').on('click', closeHelp)
        $('#help').on('click', (evt)=>{
            closeHelp()
        })
        $('#help-content').on('click', (evt)=>{
            evt.stopPropagation()
        })

        function closeHelp(){
            $('#help').fadeOut()            
        }


        /* mobile menu */
        $('#mobile-menu-open').on('click', ()=>{
            $('#mobile-menu').css('display', 'flex')
        })
        $('#mobile-menu .menu_group > :not(.menu_group_title), #mobile-menu-close-sidebar').on('click', ()=>{
            $('#mobile-menu').hide()
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
