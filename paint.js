var PAINT = ((c)=>{

  function setColor(r, g, b){
    log()
    c.ctx().fillStyle = "rgb(" + r + ', ' + g + ', ' + b + ')'
    c.ctx().strokeStyle = "rgb(" + r + ', ' + g + ', ' + b + ')'
  }

  function drawRectF(x, y, w, h){
    log()
    c.ctx().fillRect(c.left()+x, c.top()+y, w, h)
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

  return {
    setColor: setColor,
    drawRectF: drawRectF
  }

})(CANVAS)