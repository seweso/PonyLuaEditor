var OUTPUT = ((global, $)=>{
  "use strict";

    let bools = {}
    let numbers = {}


    let dom
    let dom_bools
    let dom_numbers

    function init(container){
        dom = $(container)
	dom.html('')
        dom.append('<div class="head">Outputs:</div>')

        dom_bools = $('<div class="bools"><div class="head"><span>Booleans:</span></div></div>')
        dom.append(dom_bools)

        dom_numbers = $('<div class="numbers"><div class="head"><span>Numbers:</span></div></div>')
        dom.append(dom_numbers)

        $(container).append(dom)
    }

    function reset(){
        bools = {}
        numbers = {}

        dom_bools.find('.bool').remove()
        dom_numbers.find('.number').remove()
    }

    function refresh(){
        console.log(numbers)

        for(let k of Object.keys(bools)){
            if(dom_bools.find('#output_bool_'+k).length == 0){
                addNewBool(k, bools[k])
            } else {
                dom_bools.find('#output_bool_'+k).find('.result').html(bools[k])
            }
        }

        for(let k of Object.keys(numbers)){
            let n = parseFloat(numbers[k])
            if(isNaN(n)){
                n = parseInt(numbers[k])
            }
            if(isNaN(n)){
                return
            }
            if(dom_numbers.find('#output_number_'+k).length == 0){
                addNewNumber(k, n)
            } else {
                dom_numbers.find('#output_number_'+k).find('.result').html(numbers[k])
            }
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
        bools[index] = val
    }

    function setNumber(index, val){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(typeof val !== 'number'){
            throw new Error('second argument must be a number!')
        }
        numbers[index] = val
    }
    
    return {
        init: init,
        setBool: setBool,
        setNumber: setNumber,
        refresh: refresh,
        reset: reset
    }

})(window, jQuery)
