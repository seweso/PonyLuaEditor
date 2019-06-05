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
        dom = $('<div class="output"></div>')

        dom_bools = $('<div class="bools">Booleans:</div>')
        let dom_bools_add = $('<div class="add"><input type="text"/><button>+</button></div>')
        dom_bools_add.find('button').on('click', ()=>{
            addNewBool(dom_bools_add.find('input').val())
        })
        dom_bools.append(dom_bools_add)
        dom.append(dom_bools)

        dom_numbers = $('<div class="numbers">Numbers:</div>')
        let dom_numbers_add = $('<div class="add"><input type="text"/><button>+</button></div>')
        dom_numbers_add.find('button').on('click', ()=>{
            addNewNumber(dom_numbers_add.find('input').val())
        })
        dom_numbers.append(dom_numbers_add)
        dom.append(dom_numbers)

        dom_texts = $('<div class="texts">Texts:</div>')
        let dom_texts_add = $('<div class="add"><input type="text"/><button>+</button></div>')
        dom_texts_add.find('button').on('click', ()=>{
            addNewText(dom_texts_add.find('input').val())
        })
        dom_texts.append(dom_texts_add)
        dom.append(dom_texts)


        $(container).append(dom)
    }

    function addNewBool(label){
        if(typeof label !== 'string' || label.length === 0){
            return
        }
        bools[label] = false
        let bool = addNew('bool', 'checkbox', label, (e)=>{
            bools[label] = $(e.target).prop('checked')
        }, (e)=>{
            bools[label] = false
            delete bools[label]
            $(e.target).parent().remove()
        })
        dom_bools.append(bool)  
    }

    function addNewNumber(label){
        if(typeof label !== 'string' || label.length === 0){
            return
        }
        numbers[label] = 0
        let number = addNew('number', 'number', label, (e)=>{
            numbers[label] = $(e.target).val()
        }, (e)=>{
            numbers[label] = false
            delete numbers[label]
            $(e.target).parent().remove()
        })
        dom_numbers.append(number)  
    }

    function addNewText(label){
        if(typeof label !== 'string' || label.length === 0){
            return
        }
        texts[label] = ""
        let text = addNew('text', 'text', label, (e)=>{
            texts[label] = $(e.target).val()
        }, (e)=>{
            texts[label] = false
            delete texts[label]
            $(e.target).parent().remove()
        })
        dom_texts.append(text)  
    }

    function addNew(type, inputType, label, changeCallback, removeCallback){
        
        let neww = $('<div clas="' + type + '"><label for="' + type + '_' + label + '">'+label+'</label><input type="' + inputType + '" id="' + type + '_' + label + '"/><button>x</button></div>')
        neww.find('input').on('change', changeCallback)
        neww.find('button').on('click', removeCallback)
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
        setText: setText
    }

})(window, jQuery)