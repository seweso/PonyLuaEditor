var PAINT = ((c)=>{

    const DO_LOG = false

    const FONT_SIZE = 6
    const FONT = 'px "Lucida Console", Monaco, monospace'

    const LINE_WIDTH = 1

    let zoomFactor = 1

    function setColor(r, g, b, a){
        log()
        c.ctx().fillStyle = "rgb(" + r + ', ' + g + ', ' + b + ', ' + a/255 + ')'
        c.ctx().strokeStyle = "rgb(" + r + ', ' + g + ', ' + b + ', ' + a/255 + ')'
    }

    function drawClear(){
        log()
        c.ctx().clearRect(0, 0, c.realWidth(), c.realHeight())
        c.ctx().fillRect(0, 0, c.realWidth(), c.realHeight())
    }

    function drawLine(x1, y1, x2, y2){ 
        log()
        c.ctx().lineWidth = zoom(LINE_WIDTH)
        c.ctx().beginPath()
        c.ctx().moveTo(c.left() + zoom(x1), c.top() + zoom(y1))
        c.ctx().lineTo(c.left() + zoom(x2), c.top() + zoom(y2))
        c.ctx().stroke()
        c.ctx().closePath()
    }

    function drawCircle(x, y, r){
        log()
        c.ctx().lineWidth = zoom(LINE_WIDTH)
        c.ctx().beginPath()
        c.ctx().arc(c.left() + zoom(x), c.top()+zoom(y), zoom(r), 0, 2 * Math.PI, true)
        c.ctx().stroke()
        c.ctx().closePath()
    }

    function drawCircleF(x, y, r){
        log()
        c.ctx().lineWidth = zoom(LINE_WIDTH)
        c.ctx().beginPath()
        c.ctx().arc(c.left() + zoom(x), c.top()+zoom(y), zoom(r), 0, 2 * Math.PI, true)
        c.ctx().fill()
        c.ctx().closePath()
    }

    function drawRect(x, y, w, h){
        log()
        c.ctx().lineWidth = zoom(LINE_WIDTH)
        c.ctx().strokeRect(c.left() + zoom(x), c.top() + zoom(y), zoom(w), zoom(h))
    }

    function drawRectF(x, y, w, h){
        log()
        c.ctx().lineWidth = zoom(LINE_WIDTH)
        c.ctx().fillRect(c.left() + zoom(x), c.top() + zoom(y), zoom(w), zoom(h))
    }

    function drawTriangle(x1, y1, x2, y2, x3, y3){
        log()
        c.ctx().lineWidth = zoom(LINE_WIDTH)
        c.ctx().beginPath()
        c.ctx().moveTo(c.left() + zoom(x1), c.top() + zoom(y1))
        c.ctx().lineTo(c.left() + zoom(x2), c.top() + zoom(y2))
        c.ctx().lineTo(c.left() + zoom(x3), c.top() + zoom(y3))
        c.ctx().stroke()
        c.ctx().closePath()

    }

    function drawTriangleF(x1, y1, x2, y2, x3, y3){
        log()
        c.ctx().lineWidth = zoom(LINE_WIDTH)
        c.ctx().beginPath()
        c.ctx().moveTo(c.left() + zoom(x1), c.top() + zoom(y1))
        c.ctx().lineTo(c.left() + zoom(x2), c.top() + zoom(y2))
        c.ctx().lineTo(c.left() + zoom(x3), c.top() + zoom(y3))
        c.ctx().fill()
        c.ctx().closePath()
    }

    function drawText(x, y, text){//4px wide 5 px tall
        log()
        c.ctx().font = zoom(FONT_SIZE) + FONT
        c.ctx().fillText(text, c.left() + zoom(x), c.top() + zoom(y) + zoom(FONT_SIZE))
    }

    function drawTextBox(x, y, w, h, text, h_align, v_align){
        log()

        let maxCharsPerLine = Math.floor(w / 4)
        if(maxCharsPerLine <= 0){
            return
        }

        let lines = []
        let i = 0
        while (i < text.length){
            lines.push(text.substring(i, i + maxCharsPerLine))
            i += maxCharsPerLine
        }

        c.ctx().font = zoom(FONT_SIZE) + FONT

        let lineHeight = FONT_SIZE

        let horizontalCenter = x + w/2 + h_align * w/2
        let verticalCenter = y + h/2 + v_align * h/2

        drawRectF(horizontalCenter, verticalCenter, 1, 1)

        let lineCounter = 0
        for(let l of lines){
            let widthOfCurrentLine = l.length * 4
            let xx = c.left() + zoom(horizontalCenter - widthOfCurrentLine/2)
            let yy = c.top() + zoom(lineCounter * lineHeight + verticalCenter - lines.length * lineHeight/4) + zoom(FONT_SIZE)

            c.ctx().fillText(l, xx, yy);

            lineCounter++
        }
    }

    /* helper functions */

    function zoom(val){
        return val * zoomFactor
    }

    function log(){
        if(!DO_LOG){
            return
        }
        let args = []
        for(let a of arguments.callee.caller.arguments){
            args.push(a)
        }
        console.log.apply(console, ['function ' + arguments.callee.caller.name + '()'].concat(args))

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
        drawClear: drawClear,
        drawLine: drawLine,
        drawCircle: drawCircle,
        drawCircleF: drawCircleF,
        drawRect: drawRect,
        drawRectF: drawRectF,
        drawTriangle: drawTriangle,
        drawTriangleF: drawTriangleF,
        drawText: drawText,
        drawTextBox: drawTextBox,
        setZoomFactor: setZoomFactor
    }

})(CANVAS)