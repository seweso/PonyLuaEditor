var MAP = ((c)=>{

    const FONT_SIZE = 6
    const FONT = 'px "Lucida Console", Monaco, monospace'

    let zoomFactor = 1


    function drawMap(x, y, zoom){

    }

    function setMapColorOcean(r, g, b, a){

    }

    function setMapColorShallows(r, g, b, a){

    }

    function setMapColorLand(r, g, b, a){

    }

    function setMapColorGrass(r, g, b, a){

    }

    function setMapColorSand(r, g, b, a){

    }

    function setMapColorSnow(r, g, b, a){

    }

    function screenToMap(mapX, mapY, zoom, screenW, screenH, pixelX, pixelY){

    }

    function mapToScreen(mapX, mapY, zoom, screenW, screenH, worldX, worldY){

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
        setZoomFactor: setZoomFactor
    }

})(CANVAS)