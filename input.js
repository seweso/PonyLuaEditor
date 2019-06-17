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
	bools = {}
	numbers = {}
        dom = $(container)
        dom.html('')
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
            addNewNumber(n, "0")
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
                let n = store.numbers[k]
                let val = parseFloat(n.val)
                if(isNaN(val)){
                    val = parseInt(n.val)
                }
                if(isNaN(val)){
                    return
                }

                if(isNaN(parseInt(k))){
                    return
                }                
                addNewNumber(parseInt(k), val, n)
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

    function setStorage(data){
        localStorage.setItem('input_bools', JSON.stringify(data.bools))
        localStorage.setItem('input_numbers', JSON.stringify(data.numbers))        
    }


    function saveToStorage(){
        setStorage({
            bools: bools,
            numbers: numbers
        })
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
            doSetBool(label, $(e.target).prop('checked'))
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

    function doSetBool(label, val){
        let bool = $('.bools .bool').get(label-1)
        if(bool){
            $(bool).find('.change input').prop('checked', val)  
            bools[label] = val
        } else {
            addNewBool(label, val)
        }
    }

    function doSetNumber(label, val){
        let number = $('.numbers .number').get(label-1)
        if(number){
            numbers[label].val = val
            $(number).find('.change input').val(val)
            $(number).find('.slidervalue').html(val)
        } else {
            addNewNumber(label, val)
        }
    }

    function addNewNumber(label, val){
        if(typeof label !== 'number' || label.length === 0){
            return
        }
        if(numbers[label] !== undefined){
            return
        }

        let slidercheck
        let slidermin
        let slidermax
        let sliderstep

        let oscilatecheck

        if(!config){
            config = {
                val: typeof val === 'number' ? val : 0,
                slidercheck: false,
                slidermin: -10,
                slidermax: 10,
                sliderstep: 0.1,
                oscilatecheck: false
            }
        }

        numbers[label] = config
        let number = addNew('number', 'number', label, (e)=>{
            let n = parseFloat($(e.target).val())
            if(isNaN(n)){
                n = parseInt($(e.target).val())
            }
            if(isNaN(n)){
                return
            }
            numbers[label] = {
                val: $(number.find('.change input').get(0)).val(),
                slidercheck: slidercheck.prop('checked'),
                slidermin: slidermin.val(),
                slidermax: slidermax.val(),
                sliderstep: sliderstep.val(),
                oscilatecheck: oscilatecheck.prop('checked')
            }
            number.find('.change input').val(n)
            number.find('.slidervalue').html(n)
            refreshNumbersAddSelect()
        }, (e)=>{
            numbers[label] = null
            delete numbers[label]
            $(e.target).parent().remove()
            refreshNumbersAddSelect()
        }, val)

        let openSettings = $('<button>&equiv;</button>')
        let settings = $('<div class="settings"></div>')
        openSettings.on('click', ()=>{
            settings.toggle()
        })
        openSettings.insertBefore(number.find('button'))

        let slider = $('<div class="group"><div><input type="checkbox" class="slider_check"/><label>Use slider</label></div><div><input type="number" class="slider_min" value="-10"/><label>Min</label></div><div><input type="number" class="slider_max" value="10"/><label>Max</label></div><div><input type="number" class="slider_step" value="0.1"/><label>Step</label></div></div>')
        settings.append(slider)
        slidercheck = slider.find('.slider_check')
        slidercheck.on('input', ()=>{
            if(slidercheck.prop('checked')){
                number.addClass('isslider')
            } else {
                number.removeClass('isslider')
            }
            numbers[label].slidercheck = slidercheck.prop('checked')
            saveToStorage()
        })
        slidercheck.prop('checked', config.slidercheck).trigger('input')

        slidermin = slider.find('.slider_min')
        slidermin.on('input', ()=>{
            number.find('input[type="range"]').prop('min', slidermin.val()).trigger('change')
            numbers[label].slidermin = slidermin.val()
            saveToStorage()
        })

        slidermax = slider.find('.slider_max')
        slidermax.on('input', ()=>{
            number.find('input[type="range"]').prop('max', slidermax.val()).trigger('change')
            numbers[label].slidermax = slidermax.val()
            saveToStorage()
        })

        sliderstep = slider.find('.slider_step')
        sliderstep.on('input', ()=>{
            number.find('input[type="range"]').prop('step', sliderstep.val()).trigger('change')
            numbers[label].sliderstep = sliderstep.val()
            saveToStorage()
        })

        let oscilate = $('<div class="group"><div><input type="checkbox" class="oscilate_check"/><label>Use oscilate</label></div></div>')
        settings.append(oscilate)
        oscilatecheck = oscilate.find('.oscilate_check')
        oscilatecheck.on('input', ()=>{
            if(oscilatecheck.prop('checked')){
                number.addClass('isoscilate')
            } else {
                number.removeClass('isoscilate')
            }
            numbers[label].oscilatecheck = oscilatecheck.prop('checked')
            saveToStorage()
        })


        slidermin.val(config.slidermin).trigger('input')
        slidermax.val(config.slidermax).trigger('input')
        sliderstep.val(config.sliderstep).trigger('input')
        oscilatecheck.prop('checked', config.oscilatecheck).trigger('input')

        let myOscilateDirection = true

        $(global).on('lua_tick', ()=>{
            if(oscilatecheck.prop('checked')){
                let val = number.find('.change input[type="number"]').val()
                val = parseFloat(val)
                if(isNaN(val)){
                    val = parseInt(val)
                }
                if(isNaN(val)){
                    return
                }

                let step = sliderstep.val()
                step = parseFloat(step)
                if(isNaN(step)){
                    step = parseInt(step)
                }
                if(isNaN(step)){
                    return
                }

                val = precise(myOscilateDirection ? val + step : val - step, step.toString().length - step.toString().indexOf('.'))


                if(val >= slidermax.val()){
                    myOscilateDirection = false
                    val = slidermax.val()
                } else if (val <= slidermin.val()){
                    myOscilateDirection = true
                    val = slidermin.val()
                }

                numbers[label].val = val
                number.find('.change input').val(val)
                number.find('.slidervalue').html(val)
                refreshNumbersAddSelect()
            }
        })


        number.append(settings)

        dom_numbers.append(number)
        refreshNumbersAddSelect()
    }

    function precise(float, precision){
        const mult = Math.pow(10, precision)
        let ret =  Math.round(float * mult) / mult
        return ret
    }

    function addNew(type, inputType, label, changeCallback, removeCallback, val){
        let valtext = ''
        if(inputType === 'checkbox' && val === true){
            valtext = 'checked'
        } else if (val !== undefined && val !== null ){
            valtext = 'value="'+val+'"'
        }
        let neww = $('<div class="' + type + '"><div class="change"><label class="channel" for="input_' + type + '_' + label + '">'+label+'</label><input type="' + inputType + '" ' + (inputType === 'number' ? 'step="0.1"': '') + ' id="input_' + type + '_' + label + '" ' + valtext + '/>' + (inputType === 'number' ? '<input type="range" min="-10" max="10" value="0" step="0.1"/><label class="slidervalue">0</label>': '') + '<button>x</button></div></div>')
        neww.find('input').on('change input', (e)=>{
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

    function setBool(index, val){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(typeof val !== 'boolean'){
            throw new Error('second argument must be a boolean!')
        }
        doSetBool(index, val)
    }

    function setNumber(index, val){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(typeof val !== 'number'){
            throw new Error('second argument must be a number!')
        }
        doSetNumber(index, val)
    }
    
    return {
        init: init,
        getBool: getBool,
        getNumber: getNumber,
        getStorage: getFromStorage,
        setStorage: setStorage,
	setBool: setBool,
        setNumber: setNumber
    }

})(window, jQuery)
