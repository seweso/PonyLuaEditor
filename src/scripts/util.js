UTIL = (($)=>{
    "use strict";

    window.onerror = (errorMsg, url, lineNumber)=>{
        alert("Unexpected error occured:<br>Please contact me!<br><br>" + url + '<br><br>' + lineNumber + '<br><br>' + errorMsg)
        return false;
    }

    /* time: milliseconds until highlight is removed again (optional) */
    function highlight(elem, time){
        if(elem instanceof HTMLElement){
            $(elem).addClass('highlighted')

            setTimeout(()=>{
                unHighlight(elem)
            }, typeof time === 'number' ? time : (10 * 1000) )
        }
    }

    function unHighlight(elem){
        if(elem instanceof HTMLElement){
            $(elem).removeClass('highlighted')
        }
    }


    function message(title, text){
        return new Promise((fulfill, reject)=>{
            $('#message .title').html(title)
            $('#message .message').html(text)
            $('#message').show()
            $('#message .ok').on('click', ()=>{
                $('#message .ok').off('click')
                $('#message').hide()
                fulfill(true)
            })
        })
    }

     function confirm(text){
        return new Promise((fulfill, reject)=>{
            $('#confirm .message').html(text)
            $('#confirm').show()
            $('#confirm .yes').on('click', ()=>{
                $('#confirm .yes, #confirm .no').off('click')
                $('#confirm').hide()
                fulfill(true)
            })
            $('#confirm .no').on('click', ()=>{
                $('#confirm .yes, #confirm .no').off('click')
                $('#confirm').hide()
                fulfill(false)
            })
        })
    }    

    function alert(text){
        return new Promise((fulfill, reject)=>{
            $('#alert .message').html(text)
            $('#alert').show()
            $('#alert .ok').on('click', ()=>{
                $('#alert .ok').off('click')
                $('#alert').hide()
                fulfill(true)
            })
        })
    }

    function hint(title, text){
        let h = $('<div class="hint"><span class="close icon-cancel-circle"></span><h4>'+title+'</h4><div>'+(text+'').replace('\n', '<br>')+'</div></div>')
        
        h.find('h4').on('click', ()=>{
            h.find('div').css('display', 'inline-block')
        })

        h.find('.close').on('click', ()=>{
            h.remove()
        })
        $('#hints-container').append(h)

        /* automatically remove hints after 1 minute */
        setTimeout(()=>{
            h.remove()
        }, 1000 * 60)

        let currView = UI.viewables()['viewable_hints'].focusSelf()
    }

    return {
        highlight: highlight,
        unHighlight: unHighlight,
        message: message,
        confirm: confirm,
        alert: alert,
        hint: hint
    }
})(jQuery)