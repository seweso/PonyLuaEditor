HELP = (($)=>{
    "use strict";

    let firstOpen = true

    let helpContainer

    LOADER.on(LOADER.EVENT.PAGE_READY, init)

    function init(){
        $('body').find('#help-button').on('click', (evt)=>{
            evt.originalEvent.stopPropagation()
            openHelp()
        })



        $(window).on('click', (evt)=>{
            if(helpContainer.hasClass('open')){
                if($(evt.originalEvent.target).closest('#help-container .inner').length == 0){
                    closeHelp()
                }
            }
        })

        helpContainer = $('body').find('#help-container')


        helpContainer.find('.close').on('click', closeHelp)
    }

    function openHelp(){
        if(firstOpen){
            firstOpen = false
            
            REPORTER.report(REPORTER.REPORT_TYPE_IDS.openHelp)

            // add youtube video
            helpContainer.find('[youtube-embed]').each((i, el)=>{
                let id = $(el).attr('youtube-embed')
                if(typeof id === 'string' && id.trim() !== ''){
                    $(el).append(
                        $('<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/' + id +'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>')
                    )
                }
            })
        }

        setTimeout(()=>{
            helpContainer.find('.inner').find('[youtube-embed]').each((i, el)=>{  
                let $el = $(el)

                let ratio = $el.find('iframe').attr('width') / $el.find('iframe').attr('height')
                console.log(ratio, $el.width())
                $el.height($el.width() / ratio)
            })
        }, 100)

        helpContainer.addClass('open')
    }

    function closeHelp(){
        helpContainer.removeClass('open')
    }

    return {
    }


})(jQuery)
