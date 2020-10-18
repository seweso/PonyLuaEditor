var MAP = (($)=>{

    const DO_LOG = true

    const FONT_SIZE = 6
    const FONT = 'px "Lucida Console", Monaco, monospace'

    let fakecanvas = document.createElement('canvas')
    let fakectx = fakecanvas.getContext('2d')

    let shownMapWarning = true

    const MAP_ZERO_X = 16000
    const MAP_ZERO_Y = -4000

    const DEFAULT_COLORS = {
        ocean: {
            r: 16,
            g: 40,
            b: 44,
            a: 255
        },
        shallows: {
            r: 33,
            g: 74,
            b: 83,
            a: 255
        },
        land: {
            r: 83,
            g: 83,
            b: 79,
            a: 255
        },
        grass: {
            r: 65,
            g: 74,
            b: 47,
            a: 255
        },
        sand: {
            r: 91,
            g: 83,
            b: 56,
            a: 255
        },
        snow: {
            r: 102,
            g: 102,
            b: 102,
            a: 255
        }
    }

    const METER_PER_MAP_PIXEL = 20

    let matches = {}

    let lastMap = false

    function drawMap(x, y, zom){//zom from 0.1 to 50
        //matches = {}
        let currentFillStyle = CANVAS.ctx().fillStyle
        try {
            let centerx = MAP_ZERO_X + x
            let centery = - MAP_ZERO_Y - y

            let sWidth = Math.max(CANVAS.width() * zom, 1)
            let sHeight = Math.max(CANVAS.height() * zom, 1)
            let sx = centerx / METER_PER_MAP_PIXEL - sWidth/2
            let sy = centery / METER_PER_MAP_PIXEL - sHeight/2

            if(!lastMap || lastMap.sWidth !== sWidth && lastMap.sHeight !== sHeight && lastMap.sx !== sx && lastMap.sy !== sy){
                /* only if something has changed then calculate a new map */
                lastMap = {
                    sWidth: sWidth,
                    sHeight: sHeight,
                    sx: sx,
                    sy: sy
                }

                fakecanvas.width = sWidth
                fakecanvas.height = sHeight
                fakectx.fillStyle = '#0000FF'
                fakectx.fillRect(0, 0, sWidth, sHeight)
                fakectx.drawImage($('#map').get(0), sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight)

                let imageData = fakectx.getImageData(0, 0, fakecanvas.width, fakecanvas.height)
                let data = imageData.data
                for(let i = 0; i < data.length; i+=4 ){

                    if(i == 50000 && shownMapWarning){
                        shownMapWarning = false
                        setTimeout(()=>{
                            UTIL.hint("Warning", "Map drawing takes a long time, reduce zoom for better performance")
                        }, 1)
                    }


                    let color = colors[ bestMatchColor(data[i], data[i+1], data[i+2]) ]
                    data[i] = color.r
                    data[i+1] = color.g
                    data[i+2] = color.b
                    data[i+3] = color.a
                }

                fakectx.clearRect(0, 0, fakecanvas.width, fakecanvas.height)
                fakectx.putImageData(imageData, 0, 0, 0, 0, fakecanvas.width, fakecanvas.height)
            } else {
                if(DO_LOG){
                    console.log('using cached map')
                }
            }

            CANVAS.ctx().drawImage(fakecanvas, 0, 0, fakecanvas.width, fakecanvas.height, CANVAS.left(), CANVAS.top(), CANVAS.renderWidth() - CANVAS.left()*2, CANVAS.renderHeight() - CANVAS.top()*2)
        } catch (err){
            console.error('error drawing map', err)
        }  
        CANVAS.ctx().fillStyle = currentFillStyle
    }

    function setMapColorOcean(r, g, b, a){
        onColorHasChanged()
        colors.ocean = {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }

    function setMapColorShallows(r, g, b, a){
        onColorHasChanged()
        colors.shallows = {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }

    function setMapColorLand(r, g, b, a){
        onColorHasChanged()
        colors.land = {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }

    function setMapColorGrass(r, g, b, a){
        onColorHasChanged()
        colors.grass = {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }

    function setMapColorSand(r, g, b, a){
        onColorHasChanged()
        colors.sand = {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }

    function setMapColorSnow(r, g, b, a){
        onColorHasChanged()
        colors.snow = {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }

    function screenToMap(mapX, mapY, zoom, screenW, screenH, pixelX, pixelY){
        let screenCenterX = screenW/2
        let screenCenterY = screenH/2
        let deltaPixelX = (pixelX - screenCenterX) / zoom
        let deltaPixelY = (pixelY - screenCenterY) / zoom
        return {emulatorUnpack: true, 0: METER_PER_MAP_PIXEL * deltaPixelX + mapX, 1: METER_PER_MAP_PIXEL * deltaPixelY + mapY}
    }

    function mapToScreen(mapX, mapY, zoom, screenW, screenH, worldX, worldY){
        let pixelX = (worldX - mapX) * zoom / METER_PER_MAP_PIXEL + screenW/2
        let pixelY = (worldY - mapY) * zoom / METER_PER_MAP_PIXEL + screenH/2

        return {emulatorUnpack: true, 0: pixelX, 1: pixelY}
    }

    function reset(){
        shownMapWarning = true
        colors = $.extend({}, DEFAULT_COLORS)
    }

    /* helper functions */

    function onColorHasChanged(){
        lastMap = false
    }

    function bestMatchColor(r, g, b){
        if(matches[r+','+g+','+b]){
            return matches[r+','+g+','+b]
        }
        let distances = []
        for(let k of Object.keys(DEFAULT_COLORS)){
            let c = DEFAULT_COLORS[k]
            let dr =  Math.abs(c.r - r)
            let dg =  Math.abs(c.g - g)
            let db =  Math.abs(c.b - b)
            distances.push({key: k, distance: dr + dg + db})
        }
        distances.sort((a, b)=>{
            if(a.distance < b.distance){
                return -1
            }
            if(a.distance > b.distance){
                return 1
            }
            return 0
        })
        let bestMatch = distances[0].key
        matches[r+','+g+','+b] = ""+bestMatch
        if(DO_LOG){
            console.log('bestMatch for ', r, g, b, 'is', bestMatch)
        }
        return bestMatch
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

    return {
        drawMap: drawMap,
        setMapColorOcean: setMapColorOcean,
        setMapColorShallows: setMapColorShallows,
        setMapColorLand: setMapColorLand,
        setMapColorGrass: setMapColorGrass,
        setMapColorSand: setMapColorSand,
        setMapColorSnow: setMapColorSnow,
        screenToMap: screenToMap,
        mapToScreen: mapToScreen,
        reset: reset
    }

})(jQuery)
