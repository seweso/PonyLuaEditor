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

    /* custom_remove_time is optional (time in milliseconds) */
    function hint(title, text, custom_remove_time){
        let h = $('<div class="hint"><span class="close icon-cancel-circle"></span><h4>'+title+'</h4><div>'+(text+'').replace('\n', '<br>')+'</div></div>')
        
        h.find('h4').on('click', ()=>{
            h.find('div').css('display', 'inline-block')
        })

        h.find('.close').on('click', ()=>{
            h.remove()
        })
        $('#hints-container').prepend(h)

        if(typeof custom_remove_time !== 'number'){
            /* remove hint after 30 seconds */
            custom_remove_time = 1000 * 30
        }

        setTimeout(()=>{
            h.fadeOut(()=>{
                h.remove()
            })
        }, custom_remove_time)

        UI.viewables()['viewable_hints'].focusSelf()
    }

    /*
        type defines the color
    */
    function addNavigationHint(text, type, custom_remove_time){
        const TYPE_COLORS = {
            error: {
                fill: '#EA5151',
                text: '#fff'
            },
            warning: {
                fill: '#F2E132',
                text: '#222'
            },
            success: {
                fill: '#46C948',
                text: '#fff'
            },
            neutral: {
                fill: '#ddd',
                text: '#222'
            }
        }

        if(! TYPE_COLORS[type]){
            console.error('invalid navigation hint type', type)
            return
        }

        let h = $('<div class="navigation_hint" style="background-color: ' + TYPE_COLORS[type].fill + '; color: ' + TYPE_COLORS[type].text + '"></div>').html(text)

        $('.navigation_hints').html('')
        $('.navigation_hints').append(h)

        if(typeof custom_remove_time !== 'number'){
            /* remove hint after 3 seconds */
            custom_remove_time = 1000 * 3
        }

        setTimeout(()=>{
            h.fadeOut(()=>{
                h.remove()
            })
        }, custom_remove_time)
    }

    return {
        highlight: highlight,
        unHighlight: unHighlight,
        message: message,
        confirm: confirm,
        alert: alert,
        hint: hint,
        addNavigationHint: addNavigationHint
    }
})(jQuery)