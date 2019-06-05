var INPUT = ((global, $)=>{
  "use strict";

    let bools = {}
    let numbers = {}

    function init(container){

    }

    function refresh(){

    }

    function getBool(index){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(typeof bools[label] === 'boolean'){
            return bools[label]
        } else {
            return false
        }
    }

    function getNumber(index){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(typeof numbers[label] === 'number'){
            return numbers[label]
        } else {
            return 0
        }
    }
    
    return {
        init: init,
        getBool: getBool,
        getNumber: getNumber
    }

})(window, jQuery)