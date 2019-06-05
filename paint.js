var PAINT = ((c)=>{

    const FONT = '10px "Lucida Console", Monaco, monospace'

    function setColor(r, g, b, a){
        if(typeof a !== 'number'){
            a = 255
        }
        log()
        c.ctx().fillStyle = "rgb(" + r + ', ' + g + ', ' + b + ', ' + a + ')'
        c.ctx().strokeStyle = "rgb(" + r + ', ' + g + ', ' + b + ', ' + a + ')'
    }

    function drawRectF(x, y, w, h){
        log()
        c.ctx().fillRect(c.left()+x, c.top()+y, w, h)
    }

    function drawLine(x1, y1, x2, y2){ 
        c.ctx().beginPath()
        c.ctx().moveTo(c.left()+x1, c.top()+y1)
        c.ctx().lineTo(c.left()+x2, c.top()+y2)
        c.ctx().stroke()
        c.ctx().closePath()
    }

    function drawText(x, y, text){
        c.ctx().font = FONT
        c.ctx().fillText(text, c.left()+x, c.top()+y)
    }

    /* helper functions */

    function log(){
        let args = []
        for(let a of arguments.callee.caller.arguments){
            args.push(a)
        }
        console.log.apply(console, ['PAINT.' + arguments.callee.caller.name + '()'].concat(args))

        let myargs = []
        for(let a of arguments){
            myargs.push(a)
        }
        if(myargs.length > 0){
            console.log.apply(console, myargs)
        }
    }

    return {
        setColor: setColor,
        drawRectF: drawRectF,
        drawLine: drawLine,
        drawText: drawText
    }

})(CANVAS)