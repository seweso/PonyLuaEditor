util = (($)=>{

    window.onerror = (errorMsg, url, lineNumber)=>{
        alert("Unexpected error occured:<br>Please contact me!<br><br>" + url + '<br><br>' + lineNumber + '<br><br>' + errorMsg)
        return false;
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

    function hint(title, text, options){
        let h = $('<div class="hint"><span class="close icon-cancel-circle"></span><h4>'+title+'<span class="extend icon-circle-down"></span></h4><div style="' + ((options && options.extended) ? '' : 'display: none') + '">'+(text+'').replace('\n', '<br>')+'</div></div>')
        if(options && options.extended){
            h.find('.extend').remove()
        } else {
            h.find('h4').on('click', ()=>{
                h.find('div').css('display', 'inline-block')
            })
        }
        h.find('.close').on('click', ()=>{
            h.remove()
        })
        $('#hints-container').append(h)
        if(!options || !options.nofadeout){
            setTimeout(()=>{
                //disappear after 10 seconds
                h.remove()
            }, 10000)
        }
    }

    return {
        message: message,
        confirm: confirm,
        alert: alert,
        hint: hint
    }
})(jQuery)