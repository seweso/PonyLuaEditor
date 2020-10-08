var PROPERTY = ((global, $)=>{
  "use strict";

    let bools = {}
    let numbers = {}
    let texts = {}

    let dom
    let dom_bools
    let dom_numbers
    let dom_texts

    LOADER.on(LOADER.EVENT.ENGINE_READY, init)

    function init(){
    	bools = {}
    	numbers = {}
    	texts = {}
        dom = $('#property')
        dom.html('')

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



        let store = getFromStorage()
        if(store && typeof store.bools === 'object' && store.bools !== null){
            for(let k of Object.keys(store.bools)){
                addNewBool(k, store.bools[k])
            }
        }

        if(store && store.numbers && typeof store.numbers === 'object'){
            for(let k of Object.keys(store.numbers)){
                let n = parseFloat(store.numbers[k])
                if(isNaN(n)){
                    return
                }
                addNewNumber(k, store.numbers[k])
            }
        }

        if(store && store.texts && typeof store.texts === 'object'){
            for(let k of Object.keys(store.texts)){
                addNewText(k, store.texts[k])
            }
        }

        LOADER.done(LOADER.EVENT.PROPERTIES_READY)
    }

    function saveToStorage(){
        STORAGE.setConfiguration('properties', {
            bools: bools,
            numbers: numbers,
            texts: texts
        })
    }

    function getFromStorage(){
        return STORAGE.getConfiguration('properties')
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
        saveToStorage()
    }

    function addNewNumber(label, val){
        if(typeof label !== 'string' || label.length === 0){
            return
        }
        numbers[label] = typeof val === 'number' ? val : 0
        let number = addNew('number', 'number', label, (e)=>{
            let n = parseFloat($(e.target).val())
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
        saveToStorage()
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
        saveToStorage()
    }

    function addNew(type, inputType, label, changeCallback, removeCallback, val){
        let valtext = ''
        if(inputType === 'checkbox' && val === true){
            valtext = 'checked'
        } else if (val !== undefined && val !== null ){
            valtext = 'value="'+val+'"'
        }
        let neww = $('<div class="' + type + '"><label for="property_' + type + '_' + label + '">'+label+'</label><input type="' + inputType + '" ' + (inputType === 'number' ? 'step="0.000001"': '') + ' id="property_' + type + '_' + label + '" ' + valtext + '/><button>x</button></div>')
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
        getBool: getBool,
        getNumber: getNumber,
        getText: getText,
        setBool: setBool,
        setNumber: setNumber,
        setText: setText
    }

})(window, jQuery)
