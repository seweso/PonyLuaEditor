var INPUT = ((global, $)=>{
  "use strict";

    let bools = {}
    let numbers = {}

    let dom
    let dom_bools
    let dom_bools_add
    let dom_numbers
    let dom_numbers_add

    let initiating = true

    const SUPPORTED_INPUT_KEYS = ['e', 'q', 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

    function init(container){

        $(global).on('keydown', handleKeyDown)
        $(global).on('keyup', handleKeyUp)

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
            addNewNumber(n, 0)
        })
        dom_numbers.find('.head').append(dom_numbers_add)
        dom.append(dom_numbers)

        $(container).append(dom)

        let store = getFromStorage()
        if(typeof store.bools === 'object' && store.bools !== null){
            for(let k of Object.keys(store.bools)){
                let b = store.bools[k]
                let val = b.val

                if(isNaN(parseInt(k))){
                    return
                } 
                addNewBool(parseInt(k), val, b)
            }
        }


        if(typeof store.numbers === 'object' && store.numbers !== null){
            for(let k of Object.keys(store.numbers)){
                let n = store.numbers[k]
                let val = parseFloat(n.val)
                if(isNaN(val)){
                    return
                }
                addNewNumber(parseInt(k), val, n)
            }
        }

        initiating = false
    }

    function handleKeyDown(evt){
        if(YYY.isRunning()){
            for(let k of Object.keys(bools)){
                let b = bools[k]
                if(evt.originalEvent.key === b.key){
                    evt.preventDefault()
                    evt.stopImmediatePropagation()

                    if(b.type === 'push'){ /* push */
                        doSetBool(k, true)
                    }
                }
            }
        }
    }

    function handleKeyUp(evt){
        if(YYY.isRunning()){
            for(let k of Object.keys(bools)){
                let b = bools[k]
                if(evt.originalEvent.key === b.key){
                    evt.preventDefault()
                    evt.stopImmediatePropagation()

                    if(b.type === 'push'){ /* push */
                        doSetBool(k, false)
                    } else {/* toggle */
                        doSetBool(k, !bools[k].val)
                    }
                }
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
        if(!initiating){
            setStorage({
                bools: bools,
                numbers: numbers
            })
        }
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


    function addNewBool(label, val, config){
        if( ! (typeof label === 'number' || typeof label === 'string' && label.length > 0)){
            return
        }
        if(bools[new String(label)] !== undefined){
            return
        }

        let userLabel

        let typeSelect
        let keySelect

        if(!config){
            config = {
                val: typeof val === 'boolean' ? val : false,
                userLabel: '',
                type: 'push',
                key: typeof label !== 'number' ? SUPPORTED_INPUT_KEYS[Object.keys(bools).length] : (
                    label > 2 ? SUPPORTED_INPUT_KEYS[label+1] : SUPPORTED_INPUT_KEYS[label-1]
                    )
            }
        } else {
            if(typeof config.userLabel !== 'string'){
                config.userLabel = ''
            }
        }

        if(typeof label === 'number'){
            label = new String(label)
        }
        bools[label] = config

        let bool = addNew('bool', 'checkbox', label, (e)=>{
            bools[label] = {
                val: $(e.target).prop('checked'),
                userLabel: userLabel.val(),
                type: config.type,
                key: config.key
            }
            bool.find('.change input').prop('checked', $(e.target).prop('checked'))

            refreshBoolsAddSelect()
        }, (e)=>{
            bools[label] = false
            delete bools[label]
            $(e.target).parent().parent().remove()
            refreshBoolsAddSelect()
        }, val, config)

        userLabel = bool.find('.user_label')

        let openSettings = $('<button>?</button>')
        let settings = $('<div class="settings" style="display: none"></div>')
        openSettings.on('click', ()=>{
            settings.toggle()
        })
        openSettings.insertBefore(bool.find('button'))

        typeSelect = $('<div class="group"><span>Type</span><select><option value="push" selected>Push</option><option value="toggle">Toggle</option></select></div>')
        settings.append(typeSelect)

        typeSelect.find('option[selected]').prop('selected', false)
        typeSelect.find('option[value="' + config.type + '"]').prop('selected', true)
        typeSelect.find('select').on('change', ()=>{            
            bools[label].type = typeSelect.find('select').val()
            saveToStorage()
        })

        keySelect = $('<div class="group"><span>Key</span><select></select></div>')
        for(let k of SUPPORTED_INPUT_KEYS){
            keySelect.find('select').append('<option value="' + k + '">' + k + '</option>')
        }
        settings.append(keySelect)

        keySelect.find('option[selected]').prop('selected', false)
        keySelect.find('option[value="' + config.key + '"]').prop('selected', true)
        keySelect.find('select').on('change', ()=>{            
            bools[label].key = keySelect.find('select').val()
            saveToStorage()
        })

        typeSelect.find('select').trigger('change')
        keySelect.find('select').trigger('change')


        bool.append(settings)



        dom_bools.append(bool)
        refreshBoolsAddSelect()
    }

    function doSetBool(label, val){
        let bool = dom_bools.find('#input_bool_'+label).get(0)
        if(bool){
            $(bool).prop('checked', val)  
            bools[label.toString()].val = val
        } else {
            addNewBool(label, val)
        }
    }

    function doSetNumber(label, val){
        let number = dom_numbers.find('#input_number_'+label).get(0)
        if(number){
            val = parseFloat(val)
            if(isNaN(val)){
                return
            }

            numbers[label.toString()].val = val
        $(number).parent().find('input').val(val)
            $(number).parent().find('.slidervalue').html(val)
        } else {
            addNewNumber(label, val)
        }
    }

    function addNewNumber(label, val, config){
        if(typeof label !== 'number' || label.length === 0){
            return
        }
        if(numbers[label] !== undefined){
            return
        }

        let userLabel

        let slidercheck
        let slidermin
        let slidermax
        let sliderstep

        let oscilatecheck

        if(!config){
            let lastNumber = dom_numbers.find('.number').last()
            if(lastNumber.length === 0){
                lastNumber = false
            }
            config = {
                val: typeof val === 'number' ? val : 0,
                userLabel: '',
                slidercheck:  lastNumber ? lastNumber.find('.slider_check').prop('checked') : true,
                slidermin: lastNumber ? parseFloat(lastNumber.find('.slider_min').val().replace(',','.')) : -1,
                slidermax: lastNumber ? parseFloat(lastNumber.find('.slider_max').val().replace(',','.')) : 1,
                sliderstep: lastNumber ? parseFloat(lastNumber.find('.slider_step').val().replace(',','.')) : 0.01,
                oscilatecheck: lastNumber ? lastNumber.find('.oscilate_check').prop('checked') : (typeof val === 'number' ? false : true)
            }
        } else {
            /* backwards compatibility */
            for(let x of ['slidermin', 'slidermax', 'sliderstep']){
                if(typeof config[x] !== 'number'){
                    config[x] = $(config[x]).val()
                }
            }

            for(let x of ['slidercheck', 'oscilatecheck']){
                if(typeof config[x] !== 'boolean'){
                    config[x] = $(config[x]).prop('checked')
                }
            }
            if(typeof config.userLabel !== 'string'){
                config.userLabel = ''
            }
        }

        numbers[label] = config
        let number
        number = addNew('number', 'number', label, (e)=>{
	    let n
	    if(slidercheck.prop('checked')){
		n = parseFloat(number.find('.change input[type="range"]').val())
	    } else {
		n = parseFloat(number.find('.change input[type="number"]').val())
	    }

            if(isNaN(n)){
                return
            }
            numbers[label] = {
                val: n,
                userLabel: userLabel.val(),
                slidercheck: slidercheck.prop('checked'),
                slidermin: parseFloat(slidermin.val().replace(',','.')),
                slidermax: parseFloat(slidermax.val().replace(',','.')),
                sliderstep: parseFloat(sliderstep.val().replace(',','.')),
                oscilatecheck: oscilatecheck.prop('checked')
            }
            number.find('.change input[type="range"], .change input[type="number"]').val(n).attr('step', numbers[label].sliderstep)
            number.find('.slidervalue').html(n)
            refreshNumbersAddSelect()
        }, (e)=>{
            numbers[label] = null
            delete numbers[label]
            $(e.target).parent().parent().remove()
            refreshNumbersAddSelect()
        }, val, config)

        userLabel = number.find('.user_label')

        let openSettings = $('<button>?</button>')
        let settings = $('<div class="settings" style="display: none"></div>')
        openSettings.on('click', ()=>{
            settings.toggle()
        })
        openSettings.insertBefore(number.find('button'))

        let slider = $('<div class="group">'
            +'<div><input type="checkbox" class="slider_check"/><label>Use slider</label></div>'
            +'<div><input type="text" class="slider_min" value="' + config.slidermin + '"/><label>Min</label></div>'
            +'<div><input type="text" class="slider_max" value="' + config.slidermax + '"/><label>Max</label></div>'
            +'<div><input type="text" class="slider_step" value="' + config.sliderstep + '"/><label>Step</label></div>'
            +'</div>')
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
            let min = parseFloat(slidermin.val().replace(',', '.'))
            if(!isNaN(min)){
                number.find('input[type="range"]').prop('min', min).trigger('change')
                numbers[label].slidermin = min
                saveToStorage()
            }
        })

        slidermax = slider.find('.slider_max')
        slidermax.on('input', ()=>{
            let max = parseFloat(slidermax.val().replace(',', '.'))
            if(!isNaN(max)){
                number.find('input[type="range"]').prop('max', max).trigger('change')
                numbers[label].slidermax = max
                saveToStorage()
            }
        })

        sliderstep = slider.find('.slider_step')
        sliderstep.on('change', ()=>{
            let step = parseFloat(sliderstep.val().replace(',', '.'))
            if(!isNaN(step)){
                number.find('input[type="range"]').prop('step', step).trigger('change')
                slidermin.prop('step', step)
                slidermax.prop('step', step)
                numbers[label].sliderstep = step
                saveToStorage()
            }
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
                    return
                }

                let step = sliderstep.val()
                step = parseFloat(step)
                if(isNaN(step)){
                    return
                }

                val = precise(myOscilateDirection ? val + step : val - step, step.toString().length - step.toString().indexOf('.'))


                if(val >= slidermax.val()){
                    myOscilateDirection = false
                    val = parseFloat(slidermax.val())
                } else if (val <= slidermin.val()){
                    myOscilateDirection = true
                    val = parseFloat(slidermin.val())
                }
                if(numbers[label]){
                    numbers[label].val = val
                }
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

    function addNew(type, inputType, label, changeCallback, removeCallback, val, config){
        let valtext = ''
        if(inputType === 'checkbox' && val === true){
            valtext = 'checked'
        } else if (val !== undefined && val !== null ){
            valtext = 'value="'+val+'"'
        }
        let neww = $('<div class="' + type + '"><div class="change"><label class="channel" for="input_' + type + '_' + label + '">'+label+'</label><div class="user_label_container"><input type="text" class="user_label" value="' + config.userLabel + '"/></div><input type="' + inputType + '" ' + (inputType === 'number' ? 'lang="en" step="' + config.sliderstep + '"': '') + ' id="input_' + type + '_' + label + '" ' + valtext + '/>' + (inputType === 'number' ? '<input type="range" min="-10" max="10" ' + valtext + ' step="' + config.sliderstep + '"/><label class="slidervalue">0</label>': '') + '<button>x</button></div></div>')
        if(inputType === 'number'){//force value set
            setTimeout(()=>{
                neww.find('input[type="number"]').val(val)
            },1)
        }
        neww.find('input[type="number"], input[type="text"], input[type="checkbox"], .user_label').on('change paste mouseleave', (e)=>{
            changeCallback(e)
            saveToStorage()
        })
        neww.find('input[type="range"]').on('change input', (e)=>{
            changeCallback(e)
            saveToStorage()
        })
        neww.find('button').on('click', (e)=>{
            removeCallback(e)
            saveToStorage()
        })
        neww.on('keydown keyup', (e)=>{
            e.stopPropagation()
        })
        saveToStorage()
        return neww
    }

    function getBool(index){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(bools[index] && typeof bools[index].val === 'boolean'){
            return bools[index].val
        } else {
            return false
        }
    }

    function getNumber(index){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }
        if(typeof numbers[index] === 'object' && typeof numbers[index].val === 'number'){
            return numbers[index].val
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
    
    function removeNumber(index){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }

        let number = dom_numbers.find('#input_number_'+index).get(0)
        if(number){
            $(number).parent().parent().remove()
            numbers[index.toString()] = null
            delete numbers[index.toString()]
            refreshNumbersAddSelect()
        }
    }

    function removeBool(index){
        if(typeof index !== 'number'){
            throw new Error('first argument must be a number!')
        }

        let bool = dom_bools.find('#input_bool_'+index).get(0)
        if(bool){
            $(bool).parent().parent().remove()
            bools[index.toString()] = null
            delete bools[index.toString()]
            refreshBoolsAddSelect()
        }
    }

    function reset(){
        dom_bools.find('.bool').remove()
        bools = {}
        refreshBoolsAddSelect()

        dom_numbers.find('number').remove()
        numbers = {}
        refreshNumbersAddSelect()
    }

    return {
        init: init,
        reset: reset,
        getBool: getBool,
        getNumber: getNumber,
        getStorage: getFromStorage,
        setStorage: setStorage,
        setBool: setBool,
        setNumber: setNumber,
        removeBool: removeBool,
        removeNumber: removeNumber
    }

})(window, jQuery)
