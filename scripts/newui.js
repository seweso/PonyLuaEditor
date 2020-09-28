newui = (($)=>{

    $(window).on('load', ()=>{
        $('.top_left, .top_right, .bottom_left, .bottom_right').each((i, el)=>{
            let $el = $(el)


            /* initially hide contents */
            $el.find('.contents').children().hide()
            $($el.find('.contents').children().get(0)).show()

            /* setup change listener */
            $el.find('.select_tab select').on('change', ()=>{
                let selected = $el.find('.select_tab select').val()
                let contentToShow = $el.find('.contents').children().get(selected)
                if(contentToShow){
                    $el.find('.contents').children().hide()
                    $(contentToShow).show()
                }
            })
        })

        /* resize code editors */
        function resizeCodeEditors(){
            let h = $('.top_left').height() - $('.top_left .select_tab').height()
            $('.top_left .contents').css('height', h)

            $('.top_left').find('.code_field').css({
                height: h,
                width: $('.top_left .contents').width()
            })
        }
        $('.top_left').on('resize', resizeCodeEditors)
        resizeCodeEditors()
    })

})(jQuery)