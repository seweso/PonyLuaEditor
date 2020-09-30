var GIVEAWAY = (($)=>{
  "use strict";

    let currentGiveaway

    loader.on(loader.EVENT.PAGE_READY, init)

    function init(){
        $('#giveaway-container').find('.send').on('click', giveawaySend)
        $('#giveaway-container').find('.cancel, .close').on('click', ()=>{
            $('#giveaway-container').fadeOut()
        })
        $('#giveaway-container').find('.reload').on('click', ()=>{
            document.location.reload()
        })

        $.getJSON('/api/has-giveaway').done((data)=>{
            if(data.giveaway && data.giveaway.id && data.giveaway.message){
                currentGiveaway = data.giveaway
                $('#giveaway-container').find('.message').html(data.giveaway.message)

                $('#giveaway-container').fadeIn()
            }
        })

        loader.done(loader.EVENT.GIVEAWAY_READY)
    }

    function giveawaySend(){
        try {
            if(!currentGiveaway){
                throw new Error('currentGiveaway is not defined')
            }
            let claimed_by = $('#giveaway-container').find('.claimed_by').val()
            if(typeof claimed_by !== 'string' || claimed_by.length === 0){
                $('#giveaway-container').find('.error').html('Please enter your discord tag id or your email.').show()
            } else {
                $('#giveaway-container').find('.cancel, .send').hide()
                $('#giveaway-container').find('.error').hide()
                $('#giveaway-container').find('.progress').show()
                $.post('/api/claim-giveaway', {
                    id: currentGiveaway.id,
                    claimed_by: claimed_by
                }).done(()=>{
                    $('#giveaway-container').find('.progress').hide()
                    $('#giveaway-container').find('.success').show()
                    $('#giveaway-container').find('.close').show()
                }).fail(()=>{
                    $('#giveaway-container').find('.progress').hide()
                    $('#giveaway-container').find('.error').html('could not claim giveaway, please reload the page.').show()
                    $('#giveaway-container').find('.reload, .close').show()
                })
            }
        } catch (ex){
            console.error(ex)
            $('#giveaway-container').find('.progress, .success, .cancel, .send').hide()
            $('#giveaway-container').find('.reload, .close').show()
            $('#giveaway-container').find('.error').html('could not claim giveaway, please reload the page.').show()            
        }
    }
})(jQuery)
