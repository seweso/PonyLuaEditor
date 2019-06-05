var INPUT = ((global, $)=>{
  "use strict";

    let bools = {}
    let numbers = {}

    let dom
    let dom_bools
    let dom_bools_add
    let dom_numbers
    let dom_numbers_add

    function init(container){
        dom = $(container)
        dom.append('<div class="head">Inputs:</div>')

        dom_bools = $('<div class="bools"><div class="head"><span>Booleans:</span></div></div>')
        dom_bools_add = $('<div class="add"><select></select><button>+</button></div>')
        for(let i = 1; i < 33; i++){
            dom_bools_add.find('select').append('<option value="'+i+'">'+i+'</option>')
        }
        dom_bools_add.find('button').on('click', ()=>{
            let n = parseInt(dom_bools_add.find('select').val())
            if(isNaN(n)){
                return
            }
            addNewBool(n)
        })
        dom_bools.find('.head').append(dom_bools_add)
        dom.append(dom_bools)
        
        dom_numbers = $('<div class="numbers"><div class="head"><span>Numbers:</span></div></div>')
        dom_numbers_add = $('<div class="add"><select></select><button>+</button></div>')
        for(let i = 1; i < 33; i++){
            dom_numbers_add.find('select').append('<option value="'+i+'">'+i+'</option>')
        }
        dom_numbers_add.find('button').on('click', ()=>{
            let n = parseInt(dom_numbers_add.find('select').val())
            if(isNaN(n)){
                return
            }
            addNewNumber(n)
        })
        dom_numbers.find('.head').append(dom_numbers_add)
        dom.append(dom_numbers)

        $(container).append(dom)

        let store = getFromStorage()
        if(typeof store.bools === 'object' && store.bools !== null){
            for(let k of Object.keys(store.bools)){

                if(isNaN(parseInt(k))){
                    return
                } 
                addNewBool(parseInt(k), store.bools[k])
            }
        }


        if(typeof store.numbers === 'object' && store.numbers !== null){
            for(let k of Object.keys(store.numbers)){
                let n = parseInt(store.numbers[k])
                if(isNaN(n)){
                    n = parseFloat(store.numbers[k])
                }
                if(isNaN(n)){
                    return
                }

                if(isNaN(parseInt(k))){
                    return
                }                
                addNewNumber(parseInt(k), store.numbers[k])
            }
        }
    }

    function refreshBoolsAddSelect(){
        dom_bools.find('.bool').prop('selected', false)
        let i = dom_bools.find('.bool:last-of-type label').html()
        i = parseInt(i)
        i = isNaN(i) ? 0 : i
        dom_bools_add.find('option[value="' + (i+1) + '"]').prop('selected', true)
    }

    function refreshNumbersAddSelect(){
        dom_numbers.find('.number').prop('selected', false)
        let i = dom_numbers.find('.number:last-of-type label').html()
        i = parseInt(i)
        i = isNaN(i) ? 0 : i
        dom_numbers_add.find('option[value="' + (i+1) + '"]').prop('selected', true)
    }


    function saveToStorage(){
        localStorage.setItem('input_bools', JSON.stringify(bools))
        localStorage.setItem('input_numbers', JSON.stringify(numbers))
    }

    function getFromStorage(){
        let bools = localStorage.getItem('input_bools')
        try {
            bools = JSON.parse(bools)
        } catch(e){
            bools = null
        }
        let numbers = localStorage.getItem('input_numbers')
        try {
            numbers = JSON.parse(numbers)
        } catch(e){
            numbers = null
        }
        return {
            bools: bools,
            numbers: numbers
        }
    }


    function addNewBool(label, val){
        if(typeof label !== 'number' || label.length === 0){
            return
        }
        if(bools[label] !== undefined){
            return
        }
        bools[label] = val === true ? true : false
        let bool = addNew('bool', 'checkbox', label, (e)=>{
            bools[label] = $(e.target).prop('checked')
            refreshBoolsAddSelect()
        }, (e)=>{
            bools[label] = false
            delete bools[label]
            $(e.target).parent().remove()
            refreshBoolsAddSelect()
        }, val)
        dom_bools.append(bool)
        refreshBoolsAddSelect()
    }

    function addNewNumber(label, val){
        if(typeof label !== 'number' || label.length === 0){
            return
        }
        if(numbers[label] !== undefined){
            return
        }
        numbers[label] = typeof val === 'number' ? val : 0
        let number = addNew('number', 'number', label, (e)=>{
            let n = parseInt($(e.target).val())
            if(isNaN(n)){
                n = parseFloat($(e.target).val())
            }
            if(isNaN(n)){
                return
            }
            numbers[label] = n
            refreshNumbersAddSelect()
        }, (e)=>{
            numbers[label] = 0
            delete numbers[label]
            $(e.target).parent().remove()
            refreshNumbersAddSelect()
        }, val)
        dom_numbers.append(number)
        refreshNumbersAddSelect()
    }

    function addNew(type, inputType, label, changeCallback, removeCallback, val){
        let valtext = ''
        if(inputType === 'checkbox' && val === true){
            valtext = 'checked'
        } else if (val !== undefined && val !== null ){
            valtext = 'value="'+val+'"'
        }
        let neww = $('<div class="' + type + '"><label for="input_' + type + '_' + label + '">'+label+'</label><input type="' + inputType + '" id="input_' + type + '_' + label + '" ' + valtext + '/><button>x</button></div>')
        neww.find('input').on('change', (e)=>{
            changeCallback(e)
            saveToStorage()
        })
        neww.find('button').on('click', (e)=>{
            removeCallback(e)
            saveToStorage()
        })
        saveToStorage()
        return neww
    }

    function getBool(index){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(typeof bools[index] === 'boolean'){
            return bools[index]
        } else {
            return false
        }
    }

    function getNumber(index){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(typeof numbers[index] === 'number'){
            return numbers[index]
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