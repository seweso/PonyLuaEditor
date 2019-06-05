var PAINT = ((c)=>{

    const FONT_SIZE = 6
    const FONT = 'px "Lucida Console", Monaco, monospace'

    let zoomFactor = 1

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
        c.ctx().fillRect(c.left() + zoom(x), c.top() + zoom(y), zoom(w), zoom(h))
    }

    function drawLine(x1, y1, x2, y2){ 
        c.ctx().beginPath()
        c.ctx().moveTo(c.left() + zoom(x1), c.top() + zoom(y1))
        c.ctx().lineTo(c.left() + zoom(x2), c.top() + zoom(y2))
        c.ctx().stroke()
        c.ctx().closePath()
    }

    function drawText(x, y, text){//4px wide 5 px tall
        c.ctx().font = FONT_SIZE * zoomFactor + FONT
        c.ctx().fillText(text, c.left() + zoom(x), c.top() + zoom(y))
    }

    /* helper functions */

    function zoom(val){
        return val * zoomFactor
    }

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

    function setZoomFactor(_zoomFactor){
        zoomFactor = _zoomFactor
    }

    return {
        setColor: setColor,
        drawRectF: drawRectF,
        drawLine: drawLine,
        drawText: drawText,
        setZoomFactor: setZoomFactor
    }

})(CANVAS)