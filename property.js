var PROPERTY = ((global, $)=>{
  "use strict";

    let bools = {}
    let numbers = {}
    let texts = {}

    let dom
    let dom_bools
    let dom_numbers
    let dom_texts

    function init(container){
        dom = $(container)
        dom.html('')
        dom.append('<div class="head">Properties:</div>')

        dom_bools = $('<div class="bools"><div class="head"><span>Booleans:</span></div></div>')
        let dom_bools_add = $('<div class="add"><input type="text"/><button>+</button></div>')
        dom_bools_add.find('button').on('click', ()=>{
            addNewBool(dom_bools_add.find('input').val())
        })
        dom_bools.find('.head').append(dom_bools_add)
        dom.append(dom_bools)

        dom_numbers = $('<div class="numbers"><div class="head"><span>Numbers:</span></div></div>')
        let dom_numbers_add = $('<div class="add"><input type="text"/><button>+</button></div>')
        dom_numbers_add.find('button').on('click', ()=>{
            addNewNumber(dom_numbers_add.find('input').val())
        })
        dom_numbers.find('.head').append(dom_numbers_add)
        dom.append(dom_numbers)

        dom_texts = $('<div class="texts"><div class="head"><span>Texts:</span></div></div>')
        let dom_texts_add = $('<div class="add"><input type="text"/><button>+</button></div>')
        dom_texts_add.find('button').on('click', ()=>{
            addNewText(dom_texts_add.find('input').val())
        })
        dom_texts.find('.head').append(dom_texts_add)
        dom.append(dom_texts)


        $(container).append(dom)

        let store = getFromStorage()
        if(typeof store.bools === 'object' && store.bools !== null){
            for(let k of Object.keys(store.bools)){
                addNewBool(k, store.bools[k])
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
                addNewNumber(k, store.numbers[k])
            }
        }

        if(typeof store.texts === 'object' && store.texts !== null){
            for(let k of Object.keys(store.texts)){
                addNewText(k, store.texts[k])
            }
        }
    }

    function setStorage(data){
        localStorage.setItem('property_bools', JSON.stringify(data.bools))
        localStorage.setItem('property_numbers', JSON.stringify(data.numbers))
        localStorage.setItem('property_texts', JSON.stringify(data.texts))
    }

    function saveToStorage(){
        setStorage({
            bools: bools,
            numbers: numbers,
            texts: texts
        })
    }

    function getFromStorage(){
        let bools = localStorage.getItem('property_bools')
        try {
            bools = JSON.parse(bools)
        } catch(e){
            bools = null
        }
        let numbers = localStorage.getItem('property_numbers')
        try {
            numbers = JSON.parse(numbers)
        } catch(e){
            numbers = null
        }
        let texts = localStorage.getItem('property_texts')
        try {
            texts = JSON.parse(texts)
        } catch(e){
            texts = null
        }
        return {
            bools: bools,
            numbers: numbers,
            texts: texts
        }
    }


    function addNewBool(label, val){
        if(typeof label !== 'string' || label.length === 0){
            return
        }
        bools[label] = val === true ? true : false
        let bool = addNew('bool', 'checkbox', label, (e)=>{
            bools[label] = $(e.target).prop('checked')
        }, (e)=>{
            bools[label] = false
            delete bools[label]
            $(e.target).parent().remove()
        }, val)
        dom_bools.append(bool)  
    }

    function addNewNumber(label, val){
        if(typeof label !== 'string' || label.length === 0){
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
        }, (e)=>{
            numbers[label] = 0
            delete numbers[label]
            $(e.target).parent().remove()
        }, val)
        dom_numbers.append(number)  
    }

    function addNewText(label, val){
        if(typeof label !== 'string' || label.length === 0){
            return
        }
        texts[label] =  typeof val === 'string' ? val : ""
        let text = addNew('text', 'text', label, (e)=>{
            texts[label] = $(e.target).val()
        }, (e)=>{
            texts[label] = ""
            delete texts[label]
            $(e.target).parent().remove()
        }, val)
        dom_texts.append(text)  
    }

    function addNew(type, inputType, label, changeCallback, removeCallback, val){
        let valtext = ''
        if(inputType === 'checkbox' && val === true){
            valtext = 'checked'
        } else if (val !== undefined && val !== null ){
            valtext = 'value="'+val+'"'
        }
        let neww = $('<div class="' + type + '"><label for="property_' + type + '_' + label + '">'+label+'</label><input type="' + inputType + '" id="property_' + type + '_' + label + '" ' + valtext + '/><button>x</button></div>')
        neww.find('input').on('change', (e)=>{
            changeCallback(e)
            saveToStorage()
        })
        neww.find('button').on('click', (e)=>{
            removeCallback(e)
            saveToStorage()
        })
        return neww
    }

    function getBool(label){
        if(typeof label !== 'string'){
            throw new Error('first argument must be a string!')
        }
        if(typeof bools[label] === 'boolean'){
            return bools[label]
        } else {
            return null
        }
    }

    function getNumber(label){
        if(typeof label !== 'string'){
            throw new Error('first argument must be a string!')
        }
        if(typeof numbers[label] === 'number'){
            return numbers[label]
        } else {
            return null
        }
    }

    function getText(label){
        if(typeof label !== 'string'){
            throw new Error('first argument must be a string!')
        }
        if(typeof texts[label] === 'string'){
            return texts[label]
        } else {
            return null
        }
    }

    function setBool(label, val){
        if(typeof label !== 'string'){
            throw new Error('first argument must be a string!')
        }
        if(typeof val !== 'boolean'){
            throw new Error('second argument must be a boolean!')
        }
        refresh()
        bools[label] = val
    }

    function setNumber(label, val){
        if(typeof label !== 'string'){
            throw new Error('first argument must be a string!')
        }
        if(typeof val !== 'number'){
            throw new Error('second argument must be a number!')
        }
        refresh()
        numbers[label] = val
    }

    function setText(label, val){
        if(typeof label !== 'string'){
            throw new Error('first argument must be a string!')
        }
        if(typeof val !== 'string'){
            throw new Error('second argument must be a string!')
        }
        refresh()
        texts[label] = val
    }


    return {
        init: init,
        getBool: getBool,
        getNumber: getNumber,
        getText: getText,
        setBool: setBool,
        setNumber: setNumber,
        setText: setText,
        getStorage: getFromStorage,
        setStorage: setStorage
    }

})(window, jQuery)