var MAP = ((global, c, $)=>{

    const FONT_SIZE = 6
    const FONT = 'px "Lucida Console", Monaco, monospace'

    let zoomFactor = 1

    let fakecanvas = document.createElement('canvas')
    let fakectx = fakecanvas.getContext('2d')
    $(global).on('load', ()=>{
        $('body').append(fakecanvas)    
    })    


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

    let matches = {}

    function drawMap(x, y, zom){//zom from 0.1 to 50
        console.time('drawMap')
        matches = {}
        let currentFillStyle = c.ctx().fillStyle
        try {
            let centerx = MAP_ZERO_X + x
            let centery = MAP_ZERO_Y + y

            let sWidth = unzoom(c.width()) / zom
            let sHeight = unzoom(c.height()) / zom
            let sx = centerx - sWidth/2
            let sy = centery - sHeight/2


            fakecanvas.width = sWidth
            fakecanvas.height = sHeight
            fakectx.fillStyle = '#0094FF'
            fakectx.fillRect(0, 0, sWidth, sHeight)
            fakectx.drawImage($('#map').get(0), sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight)

            let imageData = fakectx.getImageData(0, 0, fakecanvas.width, fakecanvas.height)
            let data = imageData.data
            for(let i = 0; i < data.length; i+=4 ){
                let color = bestMatchColor(data[i], data[i+1], data[i+2])
                data[i] = color.r
                data[i+1] = color.g
                data[i+2] = color.b
                data[i+3] = color.a
            }

            fakectx.clearRect(0, 0, fakecanvas.width, fakecanvas.height)
            fakectx.putImageData(imageData, 0, 0)
            c.ctx().fillStyle = 'rgb(' + DEFAULT_COLORS.shallows.r + ',' + DEFAULT_COLORS.shallows.g + ',' + DEFAULT_COLORS.shallows.b + ')'
            c.ctx().fillRect(c.left(), c.top(), c.width(), c.height())
            c.ctx().drawImage(fakecanvas, 0, 0, fakecanvas.width, fakecanvas.height, c.left(), c.top(), c.width(), c.height())
        } catch (err){
            console.error(err)
        }  
        c.ctx().fillStyle = currentFillStyle
        console.timeEnd('drawMap')
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
        let bestMatch = colors[distances[0].key]
        matches[r+','+g+','+b] = bestMatch
        console.log('bestMatch for ', r, g, b, 'is', distances[0].key, bestMatch)
        return bestMatch
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

})(window, CANVAS, jQuery)