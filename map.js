var MAP = ((c, $)=>{

    const FONT_SIZE = 6
    const FONT = 'px "Lucida Console", Monaco, monospace'

    let zoomFactor = 1

    let fakecanvas = document.createElement('canvas')
    let fakectx = fakecanvas.getContext('2d')


    const MAP_ZERO_X = 3274
    const MAP_ZERO_Y = 920

    const DEFAULT_COLORS = {
        ocean: {
            r: 0,
            g: 38,
            b: 255,
            a: 255
        },
        shallows: {
            r: 0,
            g: 148,
            b: 255,
            a: 255
        },
        land: {
            r: 64,
            g: 64,
            b: 64,
            a: 255
        },
        grass: {
            r: 77,
            g: 153,
            b: 55,
            a: 255
        },
        sand: {
            r: 204,
            g: 147,
            b: 67,
            a: 255
        },
        snow: {
            r: 255,
            g: 255,
            b: 255,
            a: 255
        }
    }

    function drawMap(x, y, zom){//zom from 0.1 to 50
        try {
            let centerx = MAP_ZERO_X + x
            let centery = MAP_ZERO_Y + y

            let sWidth = c.width() / zom
            let sHeight = c.height() / zom
            let sx = centerx - sWidth/2
            let sy = centery - sHeight/2


            fakectx.width = sWidth
            fakectx.height = sHeight
            fakectx.fillStyle = '#0094FF'
            fakectx.fillRect(0, 0, sWidth, sHeight)
            fakectx.drawImage($('#map').get(0), sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight)

            let imageData = fakectx.getImageData(0, 0, fakectx.width, fakectx.height)
            let data = imageData.data
            for(let i = 0; i < data.length; i+=4 ){
                let color = convertColor(data[i], data[i+1], data[i+2])
                data[i] = color.r
                data[i+1] = color.g
                data[i+2] = color.b
                data[i+3] = color.a
            }

            fakectx.clearRect(0, 0, fakectx.width, fakectx.height)
            fakectx.putImageData(imageData, 0, 0)
            c.ctx().drawImage(fakecanvas, 0, 0, fakectx.width, fakectx.height, c.left(), c.top(), c.width(), c.height())
        } catch (err){
            console.error(err)
        }
    }

    function setMapColorOcean(r, g, b, a){
        colors.ocean = {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }

    function setMapColorShallows(r, g, b, a){
        colors.shallows = {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }

    function setMapColorLand(r, g, b, a){
        colors.land = {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }

    function setMapColorGrass(r, g, b, a){
        colors.grass = {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }

    function setMapColorSand(r, g, b, a){
        colors.sand = {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }

    function setMapColorSnow(r, g, b, a){
        colors.snow = {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }

    function screenToMap(mapX, mapY, zoom, screenW, screenH, pixelX, pixelY){

    }

    function mapToScreen(mapX, mapY, zoom, screenW, screenH, worldX, worldY){

    }

    function reset(){
        colors = $.extend({}, DEFAULT_COLORS)
    }

    /* helper functions */

    function convertColor(r, g, b){
        for(let k of Object.keys(DEFAULT_COLORS)){
            let c = DEFAULT_COLORS[k]
            if(c.r === r && c.g === g && c.b === b){
                console.log('MAP.convertColor() found color', r, g, b)                
                return colors[k]
            }
        }
        console.warn('MAP.convertColor() could not find color', r, g, b)
        return {r: r, g: g, b:b}
    }

    function zoom(val){
        return val * zoomFactor
    }

    function unzoom(val){
        return val / zoomFactor
    }

    function log(){
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
        drawMap: drawMap,
        setMapColorOcean: setMapColorOcean,
        setMapColorShallows: setMapColorShallows,
        setMapColorLand: setMapColorLand,
        setMapColorGrass: setMapColorGrass,
        setMapColorSand: setMapColorSand,
        setMapColorSnow: setMapColorSnow,
        screenToMap: screenToMap,
        mapToScreen: mapToScreen,
        setZoomFactor: setZoomFactor,
        reset: reset
    }

})(CANVAS, jQuery)