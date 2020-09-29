yyy = (($)=>{
    "use strict";

    let noExitConfirm = false

    let isCustomMinifiedCode = false

    $(window).on('newui_loaded', init)

    function init(){


        function showPerformanceHint(){
            util.hint('Performance hint', 'After 30 minutes you should reload the page to reset the emulator.\nPlease save ALL of your code (editor, minified and ui builder).\nThen reload the page.', {extended: true})
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
            report(REPORT_TYPE_IDS.downloadOffline)
            util.message('How to use the offline version:', '<ul><li>extract the zip folder</li><li>doubleclick "index.html"</li><li>This opens the offline version with your default browser</li><ul>')
        })


        /* help badge */
        let firstHelpOpen = true

        $('#help-badge, #help-menu-entry').on('click', ()=>{
            report(REPORT_TYPE_IDS.openHelp)

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



        engine.refresh()

        /*
            TODO: fetch codes from storage

            let codeFromStorage = getCodeFromStorage()
            if(typeof codeFromStorage === 'string' && codeFromStorage.length > 0){
                editors.get('normal').setValue(codeFromStorage, -1)
            }

            let minifiedCodeFromStorage = getMinifiedCodeFromStorage()
            if(typeof minifiedCodeFromStorage === 'string' && minifiedCodeFromStorage.length > 0){
                editors.get('minified').setValue(minifiedCodeFromStorage, -1)
                $('#minified-editor').show()
                $('#minified-code-container .custom_hint').show()
                isCustomMinifiedCode = true
            }







            TODO: read from storage and update viewables


            function refreshAll(){

                let store = getStorage()
                if(store){
                    if(isNaN(parseInt(store.timeBetweenTicks)) === false){
                        $('#timeBetweenTicks').val(parseInt(store.timeBetweenTicks))
                    }
                    if(isNaN(parseInt(store.timeBetweenDraws)) === false){
                        $('#timeBetweenDraws').val(parseInt(store.timeBetweenDraws))
                    }
                    if(isNaN(parseInt(store.zoomfactor)) === false){
                        $('#zoomfactor').val(parseInt(store.zoomfactor))
                    }
                    $('#zoomfactor').trigger('change')
                    if(typeof store.monitorSize === 'string'){
                        $('#monitor-size').find('option[selected]').prop('selected', false)
                        $('#monitor-size').find('option[value="'+store.monitorSize+'"]').prop('selected', true)
                    }
                    if(typeof store.showOverflow === 'boolean'){
                        $('#show-overflow').prop('checked', store.showOverflow)
                    }
                    if(typeof store.touchScreenEnabled === 'boolean'){
                        $('#enable-touchscreen').prop('checked', store.touchScreenEnabled)
                    }
                    if(typeof store.touchScreenEnabledSecondary === 'boolean'){
                        $('#enable-touchscreen-secondary').prop('checked', store.touchScreenEnabledSecondary)
                    } else {
                        $('#enable-touchscreen-secondary').prop('checked', true)
                    }
                    if(typeof store.editorLayout === 'string'){
                        $('#editor-layout').find('option[selected]').prop('selected', false)
                        $('#editor-layout').find('option[value="'+store.editorLayout+'"]').prop('selected', true)
                        $('#editor-layout').trigger('change')                
                    }
                }



                setStorage(store)
            }


            function updateStorage(){
                var toStore = {
                    timeBetweenTicks: parseInt($('#timeBetweenTicks').val()),
                    timeBetweenDraws: parseInt($('#timeBetweenDraws').val()),
                    zoomfactor: parseInt($('#zoomfactor').val()),
                    monitorSize: $('#monitor-size').val(),
                    showOverflow: $('#show-overflow').prop('checked'),
                    touchScreenEnabled: $('#enable-touchscreen').prop('checked'),
                    touchScreenEnabledSecondary: $('#enable-touchscreen-secondary').prop('checked'),
                    editorLayout: $('#editor-layout').val()
                }
                setStorage(toStore)
            }

        */

        setTimeout(()=>{
            //refreshAll()

            $(window).trigger('yyy_refresh_all') // TODO: we still need this?
        }, 200)

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
    if(yyy.noExitConfirm){
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
