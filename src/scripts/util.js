UTIL = (($)=>{
    "use strict";

    let dialogCounter = 0

    LOADER.on(LOADER.EVENT.UI_READY, init)

    function init(){

        LOADER.done(LOADER.EVENT.UTIL_READY, init)
    }

    window.onerror = (errorMsg, url, lineNumber)=>{
        if(typeof errorMsg === 'string' && errorMsg.indexOf('NS_BINDING_ABORTED') >= 0){
            /* debug error */
            return false
        }
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
            makeDialog('message', title, text, {ok: 'OK'}, ()=>{
                fulfill(true)
            })
        })
    }

    function fail(text, customTitle){
        return new Promise((fulfill, reject)=>{
            makeDialog('fail', customTitle ? customTitle : 'Failed:', text, {ok: 'OK'}, ()=>{
                fulfill(true)
            })
        })
    }

    function success(text, customTitle){
        return new Promise((fulfill, reject)=>{
            makeDialog('success', customTitle ? customTitle : 'Success:', text, {ok: 'OK'}, ()=>{
                fulfill(true)
            })
        })
    }

    function confirm(text, customTitle){
        return new Promise((fulfill, reject)=>{
            makeDialog('confirm', customTitle ? customTitle : 'Confirm Action:', text, {yes: 'Yes', no: 'No'}, (btn)=>{
                fulfill(btn == 'yes')
            })
        })
    }    

    function alert(text, customTitle){
        return new Promise((fulfill, reject)=>{
            makeDialog('alert', customTitle ? customTitle : 'Alert:', text, {ok: 'OK'}, ()=>{
                fulfill(true)
            })
        })
    }

    function makeDialog(type, title, text, buttons, callback){
        if(typeof callback !== 'function'){
            throw new Error('callback must be a function')
        }

        let dialog = $('<div class="dialog ' + type + '"/>').css('z-index', 800 + dialogCounter)
        $(window).on('keydown keyup keypress', dialogPrevent)
        let inner = $('<div class="inner"/>')
        dialog.append(inner)

        inner.append(
            $('<h3 class="title">').text(title)
        )

        inner.append(
            $('<div class="message">').html(text)
        )

        let btns = $('<div class="buttons">')

        for(let k of Object.keys(buttons)){
            btns.append(
                $('<button btn-key="' + k + '">').text(buttons[k]).on('click', ()=>{
                    dialog.remove()
                    $(window).off('keydown keyup keypress', dialogPrevent)
                    callback(k)
                })
            )
        }
        inner.append(btns)

        dialog.appendTo(document.body)

        dialogCounter++

        function dialogPrevent(evt){
            if((evt.originalEvent.ctrlKey || evt.originalEvent.metaKey) && evt.originalEvent.key === 'r' || evt.originalEvent.key === 'F5'){
                /* allow page reload */
            } else {
                evt.originalEvent.preventDefault()
                evt.originalEvent.stopPropagation()
            }

            if(evt.originalEvent.key == 'Enter'){
                if(buttons['ok']){
                    dialog.remove()
                    $(window).off('keydown keyup keypress', dialogPrevent)
                    callback('ok')
                } else if (buttons['yes']){
                    dialog.remove()
                    $(window).off('keydown keyup keypress', dialogPrevent)
                    callback('yes')
                }
            }
        }
    }

    /* custom_remove_time is optional (time in milliseconds) */
    function hint(title, text, custom_remove_time){
        makeHint('#636874', title, text, custom_remove_time)
    }

    /* custom_remove_time is optional (time in milliseconds) */
    function hintImportant(title, text, custom_remove_time){
        makeHint('#ac3d31', title, text, custom_remove_time)
        UI.viewables()['viewable_hints'].focusSelf()
    }

    /* custom_remove_time is optional (time in milliseconds) */
    function makeHint(background, title, text, custom_remove_time){
        let h = $('<div class="hint"><span class="close icon-cancel-circle"></span><h4>'+title+'</h4><div>'+(text+'').replace('\n', '<br>')+'</div></div>')
        
        h.find('h4').css('background', background).on('click', ()=>{
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
            UI.viewables()['viewable_hints'].removeNotification(not)
        }, custom_remove_time)

        let not = UI.viewables()['viewable_hints'].addNotification()
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

    function copyToClipboard(text){
        let input = $('<input style="position: fixed: left: -99999px;">').val(text)
        input.appendTo('body')

        input.get(0).select();
        document.execCommand('copy');

        input.remove()
    }

    function copyElementToClipboard(element){
        let $el = $(element)
        let text = $el.prop('tagName') === 'INPUT' ? $el.val() : $el.text()

        let input = $('<input style="position: fixed: left: -99999px;">').val(text)
        input.appendTo('body')

        input.get(0).select();
        document.execCommand('copy');

        input.remove()

        let pos = $el.offset()

        let $hint = $('<div class="copy_to_clipboard_hint">').text('Copied to clipboard').css({
            top: pos.top + $el.height(),
            left: pos.left + $el.width() / 2
        })

        $('.copy_to_clipboard_hint').hide()

        $('body').append($hint)

        setTimeout(()=>{
            $hint.remove()
        }, 3000)

        $el.focus().select()

    }

    return {
        highlight: highlight,
        unHighlight: unHighlight,
        message: message,
        fail: fail,
        success: success,
        confirm: confirm,
        alert: alert,
        hint: hint,
        hintImportant: hintImportant,
        addNavigationHint: addNavigationHint,
        copyToClipboard: copyToClipboard,
        copyElementToClipboard: copyElementToClipboard
    }
})(jQuery)