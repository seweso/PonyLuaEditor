var OUTPUT = ((global, $)=>{
  "use strict";

    let bools = {}
    let numbers = {}

    let inputBools = {}
    let inputNumbers = {}

    let dom
    let dom_bools
    let dom_numbers

    loader.on(loader.EVENT.ENGINE_READY, init)

    function init(){
        dom = $('#output')
	    dom.html('')
        dom.append('<div class="head">Outputs:</div>')

        dom_bools = $('<div class="bools"><div class="head"><span>Booleans:</span></div></div>')
        dom.append(dom_bools)

        dom_numbers = $('<div class="numbers"><div class="head"><span>Numbers:</span></div></div>')
        dom.append(dom_numbers)

        loader.done(loader.EVENT.OUTPUTS_READY)
    }

    function reset(){
        bools = {}
        numbers = {}

        inputBools = {}
        inputNumbers = {}
    }

    function refresh(){
        bools = inputBools
        numbers = inputNumbers
        inputBools = {}
        inputNumbers = {}

        dom_bools.find('.bool').remove()
        dom_numbers.find('.number').remove()

        for(let k of Object.keys(bools)){
            addNewBool(k, bools[k])
        }

        for(let k of Object.keys(numbers)){
            let n = parseFloat(numbers[k])
            if(isNaN(n)){
                n = parseInt(numbers[k])
            }
            if(isNaN(n)){
                return
            }
            addNewNumber(k, n)
        }
    }

    function addNewBool(label, val){
        let bool = addNew('bool', label, val === true ? 'true' : 'false')
        dom_bools.append(bool) 
    }

    function addNewNumber(label, val){
        let number = addNew('number', label, val)
        dom_numbers.append(number)
    }

    function addNew(type, label, val){
        let neww = $('<div class="' + type + '"><label for="output_' + type + '_' + label + '">'+label+'</label><span class="result" id="output_' + type + '_' + label + '">' + val + '</span></div>')        
        return neww
    }

    function setBool(index, val){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(typeof val !== 'boolean'){
            throw new Error('second argument must be a boolean!')
        }
        inputBools[index] = val
    }

    function setNumber(index, val){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(typeof val !== 'number'){
            throw new Error('second argument must be a number!')
        }
        inputNumbers[index] = val
    }
    
    return {
        setBool: setBool,
        setNumber: setNumber,
        refresh: refresh,
        reset: reset
    }

})(window, jQuery)
