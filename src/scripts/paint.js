var PAINT = (()=>{

    const DO_LOG = false

    const FONT_SIZE = 5
    const FONT = 'px "Screen Mono", "Lucida Console", Monaco, monospace'

    const LINE_WIDTH = 1.4

    let zoomFactor = 1

    let offset = 0.5

    let lastColorUsed = false

    function setColor(r, g, b, a){
        log()
        CANVAS.ctx().fillStyle = "rgb(" + r + ', ' + g + ', ' + b + ', ' + a/255 + ')'
        CANVAS.ctx().strokeStyle = "rgb(" + r + ', ' + g + ', ' + b + ', ' + a/255 + ')'

        lastColorUsed = [r, g, b, a]
    }

    /* This function is not part of the game.
       It must be called after the canvas changed in size to set the color again.
       (Web Canvas has the color white, but we need the last color that was set by "screen.setColor()")
    */
    function _restoreLastColorUsed(){
        if(lastColorUsed === false){
            setColor(255,255,255,255)
        } else {
            setColor(lastColorUsed[0], lastColorUsed[1], lastColorUsed[2], lastColorUsed[3])
        }
    }

    /* This function is not part of the game.
       reset canvas to a state before the script starts to run
    */
    function _reset(){
        setColor(255,255,255,255)
    }

    function drawClear(){
        log()
        CANVAS.ctx().closePath()
        CANVAS.ctx().beginPath()
        CANVAS.ctx().clearRect(0, 0, CANVAS.realWidth(), CANVAS.realHeight())
        CANVAS.ctx().fillRect(0, 0, CANVAS.realWidth(), CANVAS.realHeight())
    }

    function drawLine(x1, y1, x2, y2){ 
        log()
        CANVAS.ctx().lineWidth = zoom(LINE_WIDTH)/2
        CANVAS.ctx().beginPath()
        CANVAS.ctx().moveTo(CANVAS.left() + zoom(x1) - offset, CANVAS.top() + zoom(y1) - offset)
        CANVAS.ctx().lineTo(CANVAS.left() + zoom(x2) - offset, CANVAS.top() + zoom(y2) - offset)
        CANVAS.ctx().stroke()
        CANVAS.ctx().closePath()
    }

    function drawCircle(x,y, r){
        log()

        let lineSegments = 8
        if(r >= 20){
            lineSegments = 12
        }
        if(r >= 28){
            lineSegments = 16
        }

        let step = Math.PI * 2 / lineSegments

        CANVAS.ctx().lineWidth = zoom(LINE_WIDTH)/2
        CANVAS.ctx().beginPath()

        for(let a=0; a < Math.PI * 2; a += step){
            let x1 = r * Math.cos(a) + x
            let y1 = r * Math.sin(a) + y

            let x2 = r * Math.cos(a + step) + x
            let y2 = r * Math.sin(a + step) + y

            if(a === 0){
                CANVAS.ctx().moveTo(CANVAS.left() + zoom(x1) - offset, CANVAS.top() + zoom(y1) - offset)
            }
            CANVAS.ctx().lineTo(CANVAS.left() + zoom(x2) - offset, CANVAS.top() + zoom(y2) - offset)        
        }

        CANVAS.ctx().stroke()
        CANVAS.ctx().closePath()
    }

    function drawCircleF(x,y, r){
        log()
        
        let lineSegments = 8
        if(r >= 20){
            lineSegments = 12
        }
        if(r >= 28){
            lineSegments = 16
        }

        let step = Math.PI * 2 / lineSegments

        CANVAS.ctx().lineWidth = zoom(LINE_WIDTH)/2
        CANVAS.ctx().beginPath()

        for(let a=0; a < Math.PI * 2; a += step){
            let x1 = r * Math.cos(a) + x
            let y1 = r * Math.sin(a) + y

            let x2 = r * Math.cos(a + step) + x
            let y2 = r * Math.sin(a + step) + y

            if(a === 0){
                CANVAS.ctx().moveTo(CANVAS.left() + zoom(x1) - offset, CANVAS.top() + zoom(y1) - offset)
            }
            CANVAS.ctx().lineTo(CANVAS.left() + zoom(x2) - offset, CANVAS.top() + zoom(y2) - offset)
        }

        CANVAS.ctx().fill()
        CANVAS.ctx().closePath()
    }

    function drawRect(x, y, w, h){
        log()
        CANVAS.ctx().lineWidth = zoom(LINE_WIDTH)/2
        CANVAS.ctx().strokeRect(CANVAS.left() + zoom(x) - offset, CANVAS.top() + zoom(y) - offset, zoom(w), zoom(h))
    }

    function drawRectF(x, y, w, h){
        log()
        CANVAS.ctx().lineWidth = zoom(LINE_WIDTH)/2
        CANVAS.ctx().fillRect(CANVAS.left() + zoom(x) - offset, CANVAS.top() + zoom(y) - offset, zoom(w), zoom(h))
    }

    function drawTriangle(x1, y1, x2, y2, x3, y3){
        log()
        CANVAS.ctx().lineWidth = zoom(LINE_WIDTH)/3
        CANVAS.ctx().beginPath()
        CANVAS.ctx().moveTo(CANVAS.left() + zoom(x1) - offset, CANVAS.top() + zoom(y1) - offset)
        CANVAS.ctx().lineTo(CANVAS.left() + zoom(x2) - offset, CANVAS.top() + zoom(y2) - offset)
        CANVAS.ctx().lineTo(CANVAS.left() + zoom(x3) - offset, CANVAS.top() + zoom(y3) - offset)
        CANVAS.ctx().lineTo(CANVAS.left() + zoom(x1) - offset, CANVAS.top() + zoom(y1) - offset)
        CANVAS.ctx().stroke()
        CANVAS.ctx().closePath()

    }

    function drawTriangleF(x1, y1, x2, y2, x3, y3){
        log()
        CANVAS.ctx().lineWidth = zoom(LINE_WIDTH)/3
        CANVAS.ctx().beginPath()
        CANVAS.ctx().moveTo(CANVAS.left() + zoom(x1) - offset, CANVAS.top() + zoom(y1) - offset)
        CANVAS.ctx().lineTo(CANVAS.left() + zoom(x2) - offset, CANVAS.top() + zoom(y2) - offset)
        CANVAS.ctx().lineTo(CANVAS.left() + zoom(x3) - offset, CANVAS.top() + zoom(y3) - offset)
        CANVAS.ctx().lineTo(CANVAS.left() + zoom(x1) - offset, CANVAS.top() + zoom(y1) - offset)
        CANVAS.ctx().fill()
        CANVAS.ctx().closePath()
    }

    function drawText(x, y, text){//4px wide 5 px tall
        text = text.toUpperCase()
        log()

        CANVAS.ctx().font = Math.floor(zoom(FONT_SIZE)) + FONT
        let lines = text.split('\n')
        let lineCounter = 0
        for(let l of lines){
            let xx = CANVAS.left() + zoom(x)
            let yy = CANVAS.top() + zoom(y + lineCounter*6) + zoom(FONT_SIZE)
            CANVAS.ctx().fillText(l, Math.round(xx), Math.round(yy))
            lineCounter++
        }
    }

    function drawTextBox(x, y, w, h, text, h_align, v_align){
        text = text.toUpperCase()
        
        log()

        let maxCharsPerLine = Math.floor(w / 5)
        if(maxCharsPerLine <= 0){
            return
        }

        let lines = []
        let i = 0
        while (i < text.length){
            let line = text.substring(i, i + maxCharsPerLine)
            let indexOfNewLine = line.indexOf('\n')
            if(indexOfNewLine === 0){//new line at the beginning
                lines.push('\n')
                i++
                continue
            } else if(indexOfNewLine > 0){//new line somewhere in the middle of the text
                lines.push(line.substring(0, indexOfNewLine))
                i += indexOfNewLine + 1
                continue
            }
            lines.push(line)
            i += maxCharsPerLine
        }

        CANVAS.ctx().font = Math.floor(zoom(FONT_SIZE)) + FONT

        let lineHeight = FONT_SIZE+1

        let horizontalCenter = x + w/2 + h_align * w/2
        let verticalCenter = y + h/2 + v_align * h/2

        
        let lineCounter = 0
        for(let l of lines){
            let widthOfCurrentLine = l.length * 5 - 1
            let xx = CANVAS.left() + zoom(horizontalCenter - widthOfCurrentLine/2) - zoom(h_align * widthOfCurrentLine/2)
            let yy = CANVAS.top() + zoom(lineCounter * lineHeight + verticalCenter) - zoom(v_align * lines.length * lineHeight/2) - zoom(lines.length * lineHeight/2) + zoom(lineHeight) - zoom(1-(lineCounter/lines.length))

            CANVAS.ctx().fillText(l, Math.round(xx), Math.round(yy));

            lineCounter++
        }
    }

    /* helper functions */

    function zoom(val){
        return Math.round(val) * zoomFactor
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
        setZoomFactor: setZoomFactor,
        _reset: _reset,
        _restoreLastColorUsed: _restoreLastColorUsed
    }

})()
