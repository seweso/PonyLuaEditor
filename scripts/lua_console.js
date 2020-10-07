CONSOLE = (($)=>{
    "use strict";
    

    const COLOR = {
        SPECIAL: '#4db4ea',
        DEBUG: '#b80a66',
        ERROR: '#fb3636'
    }

    const DEFAULT_PRINT_COLOR = '#fff'

    let currentPrintColor = DEFAULT_PRINT_COLOR


    LOADER.on(LOADER.EVENT.UI_READY, init)

    function init(){

        $('#out .console_clear').on('click', ()=>{
            $('#console-inner').html('')
        })

        
        $('#console-inner').html('')

        LOADER.done(LOADER.EVENT.LUA_CONSOLE_READY)
    }


    function print(text, hexcolor){
        if(!hexcolor){
            hexcolor = currentPrintColor
        }
        text = $('<div>'+text+'</div>').text()
        if(hexcolor){
            text = '<span style="color: ' + hexcolor + '">' + text + '</span>'
        }

        $('#console-inner').append(text + '<br>')

        if($('#console-inner').children().length > 600){
            while($('#console-inner').children().length > 400){
                $('#console-inner').children().get(0).remove()
            }
            $('#console-inner').prepend('<div><span style="color: #f00">Some messages of the log output are removed for performance reasons! Don\' use print() that often for better performance!</span></div><br>')
        }

        /* scroll down console */
        $("#console-inner").each( function(){
           let scrollHeight = Math.max(this.scrollHeight, this.clientHeight);
           this.scrollTop = scrollHeight - this.clientHeight;
        });
    }

    function setPrintColor(r,g,b){
        if( typeof r === 'number' && typeof g === 'number' && typeof b === 'number' && !isNaN(r) && !isNaN(g) && !isNaN(b)){
            currentPrintColor = 'rgb(' + Math.min(255, Math.max(0, r)) + ','
                + Math.min(255, Math.max(0, g)) + ','
                + Math.min(255, Math.max(0, b)) + ')'
        }
    }

    function reset(){
        currentPrintColor = DEFAULT_PRINT_COLOR
    }


    return {
        COLOR: COLOR,
        print: print,
        setPrintColor: setPrintColor,
        reset: reset
    }
})(jQuery)