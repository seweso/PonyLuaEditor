var OUTPUT = ((global, $)=>{
  "use strict";

    let bools = {}
    let numbers = {}

    function init(container){
        
    }

    function refresh(){
        
    }

    function setBool(index, val){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(typeof val !== 'boolean'){
            throw new Error('second argument must be a boolean!')
        }
        refresh()
        bools[index] = val
    }

    function setNumber(index, val){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(typeof val !== 'number'){
            throw new Error('second argument must be a number!')
        }
        refresh()
        numbers[index] = val
    }
    
    return {
        init: init,
        setBool: setBool,
        setNumber: setNumber
    }

})(window, jQuery)