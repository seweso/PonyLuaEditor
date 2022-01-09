COLORPICKER = (($)=>{
	
	const COLOR_PRESET = [
		[255,255,255],
		[194,195,199],
		[150,150,150],
		[110,110,110],
		[69,69,69],
		[20,20,20],
		[143,0,0],
		[255,0,43],
		[255,127,39],
		[255,165,2],
		[255,231,39],
		[0,226,50],
		[0,158,29],
		[0,131,49],
		[41,173,255],
		[0,89,255],
		[32,51,123],
		[126,37,83],
		[255,119,168],
		[255,204,170],
		[171,82,54],
		[61,31,31],
		[67,52,40],
		[69,82,51],
		[45,73,46],
		[36,60,85]
	]

	const COLOR_FORMATS = [
		{
			label: '',
			noColorCorrection: true,
			convert: (hex)=>{ return hex },
			parseInput: (input)=>{
				let m = input.match(/^[\s]*#(([0-9a-fA-F]{3})|([0-9a-fA-F]{4})|([0-9a-fA-F]{6})|([0-9a-fA-F]{8}))[\s]*$/)

				if(m){
					let hex = m[1].toLowerCase().split('')

					switch(hex.length){
						case 3: {
							return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}ff`
						}
						case 4: {
							return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
						}
						case 6: {
							return `#${hex.join('')}ff`
						}
						case 8: {
							return `#${hex.join('')}`
						}
					}
				}
			}
		},{
			label: 'hex',
			convert: (hex)=>{ return hex },
			parseInput: (input)=>{
				let m = input.match(/^[\s]*#(([0-9a-fA-F]{3})|([0-9a-fA-F]{4})|([0-9a-fA-F]{6})|([0-9a-fA-F]{8}))[\s]*$/)

				if(m){
					let hex = m[1].toLowerCase().split('')

					switch(hex.length){
						case 3: {
							return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}ff`
						}
						case 4: {
							return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
						}
						case 6: {
							return `#${hex.join('')}ff`
						}
						case 8: {
							return `#${hex.join('')}`
						}
					}
				}
			}
		},
		{
			label: 'rgb',
			convert: (hex)=>{ let ret = hexToRgb(hex); return ret ? `${ret.r},${ret.g},${ret.b}` : ''},
			parseInput: (input)=>{
				let m = input.match(/^[\s]*([\d]{1,3})[\s]*,[\s]*([\d]{1,3})[\s]*,[\s]*([\d]{1,3})[\s]*[\s]*$/)

				if(m){
					return rgbToHex(sanitize0to255(m[1]), sanitize0to255(m[2]), sanitize0to255(m[3]))
				}
			}
		},
		{
			label: 'rgba',
			convert: (hex)=>{ let ret = hexToRgba(hex); return ret ? `${ret.r},${ret.g},${ret.b},${ret.a}` : ''},
			parseInput: (input)=>{
				let m = input.match(/^[\s]*([\d]{1,3})[\s]*,[\s]*([\d]{1,3})[\s]*,[\s]*([\d]{1,3})[\s]*,[\s]*([\d]{1,3})[\s]*[\s]*$/)

				if(m){
					return rgbToHex(sanitize0to255(m[1]), sanitize0to255(m[2]), sanitize0to255(m[3]), sanitize0to255(m[4]))
				}
			}
		},
		{
			label: 'Lua',
			convert: (hex)=>{ let ret = hexToRgba(hex); return ret ? `screen.setColor(${ret.r},${ret.g},${ret.b},${ret.a})` : ''},
			parseInput: (input)=>{
				let m = input.match(/^[\s]*screen[\s]*.[\s]*setColor[\s]*\([\s]*([\d]{1,3})[\s]*,[\s]*([\d]{1,3})[\s]*,[\s]*([\d]{1,3})[\s]*(,[\s]*([\d]{1,3})[\s]*)?[\s]*\)[\s]*$/)

				if(m){
					return rgbToHex(sanitize0to255(m[1]), sanitize0to255(m[2]), sanitize0to255(m[3]), m[5] ? sanitize0to255(m[5]) : 255)
				}
			}
		}
	]

	let useColorCorrection = true

	let container
	let picker

	let colorSlots = []
	let selectedSlot = 0

	let formatChangeLocked = false //used to prevent changes of color before current change propagated through the dom

    LOADER.on(LOADER.EVENT.UI_READY, init)

    function init(){
    	container = $('#colorpicker')

		// preset colors
    	for(let c of COLOR_PRESET){
    		let hex = rgbToHex(c[0], c[1], c[2])
    		let $preset = $('<div class="color_preset selectable_circle">').css('background-color', hex).on('click', ()=>{
    			setColor(hex)
    		})

    		container.find('.color_preset_container').append($preset)
    	}


    	// saved color slots
    	let store = STORAGE.getConfiguration('settings.colorSlots')
    	if(!store || store instanceof Array === false){
    		store = []
    	}

		for(let i=0; i<10; i++){
			let s = store[i]
			if(s && s.match(/\#[a-zA-Z0-9]{8}/)){
				colorSlots[i] = newColorSlot(normalizeHexOrTransparent(s), i)
			} else {
				colorSlots[i] = newColorSlot('#ffffff00', i)
			}
		}

    	picker = new Picker({
    		parent: container.find('.color_select_container').get(0),
    		onChange: (color)=>{
	    		updateColor(color.hex)
	    	},
	    	popup: false,
	    	editor: false,
	    	color: colorSlots[0].attr('color')
    	})


    	// formats

    	for(let f of COLOR_FORMATS){
    		let $format = $('<div class="color_format">').attr('format', f.label)
    		f.dom = $format

    		let $label = $('<label>').text(f.label)
    		$format.append($label)

    		let $input = $('<input type="text">')
    		$format.append($input)

    		/*$format.on('click', ()=>{
    			UTIL.copyElementToClipboard($input)
    		})*/

    		$input.on('change', (evt)=>{
    			evt.preventDefault()
    			evt.stopImmediatePropagation()
    			if(formatChangeLocked){return}

				lockFormatChange()
    			parseInput()
    		})
    		$input.on('keyup', (evt)=>{
    			evt.preventDefault()
    			evt.stopImmediatePropagation()
    			if(formatChangeLocked){return}

    			if(evt.originalEvent.key === 'Enter'){
    				lockFormatChange()
    				parseInput()
    			}
    		})

    		function parseInput(){
    			let inp = $input.val()
    			let hex = f.parseInput($input.val())

   				console.log('parseInput', inp, '=>', hex)

    			if(hex){
    				if(f.noColorCorrection !== true && useColorCorrection){
    					let ret = invertGammaFix( hexToRgba(hex) )

    					if(!ret){
    						$format.addClass('invalid')
    						return
    					}

    					hex = rgbToHex(ret.r, ret.g, ret.b, ret.a)
    				}
    				setColor(hex)
    				$format.removeClass('invalid')
    			} else {
    				$format.addClass('invalid')
    			}
    		}

    		container.find('.color_formats_container').append($format)
    	}

    	container.find('.color_formats_correction input').on('change', ()=>{
    		updateColorCorrection(container.find('.color_formats_correction input').prop('checked'))
    	})
    	container.find('.color_formats_correction').insertAfter( container.find('.color_formats_container .color_format').get(0) )

		selectColorSlot(0)

        LOADER.done(LOADER.EVENT.COLORPICKER_READY)
    }

    function lockFormatChange(){
    	formatChangeLocked = true
    	setTimeout(()=>{
    		if(formatChangeLocked){
    			formatChangeLocked = false
    		}
    	}, 500)
    }

    function getCurrentSlotColor(){
    	return colorSlots[selectedSlot].attr('color')
    }

    /* includes updating color picker */
    function setColor(hex){
    	picker.setColor(hex)
    	updateColor(hex)
    }

    /* without updating color picker */
    function updateColor(hex){
		setColorForSlot(hex, selectedSlot)
		saveToStorage()
		refreshColorFormats()
    }

    function updateColorCorrection(use){
    	useColorCorrection = use
    	refreshColorFormats()
    }

	function refreshColorFormats(){
		let hex = getCurrentSlotColor()

		let {r,g,b,a} = gammaFix( hexToRgba(hex) )
		let colorCorrectedHex = rgbToHex(r,g,b,a)



    	for(let f of COLOR_FORMATS){
    		if(f.dom){
    			f.dom.find('input').val(f.convert(
    				f.noColorCorrection !== true && useColorCorrection ? colorCorrectedHex : hex
    			))
    			f.dom.removeClass('invalid')
    		}
    	}
	}

    function selectColorSlot(index){
    	selectedSlot = index
    	picker.setColor( colorSlots[index].attr('color') )

    	container.find('.color_slot_container .color_slot.selected').removeClass('selected')
    	container.find(`.color_slot_container .color_slot[slot="${index}"]`).addClass('selected')
    }

    function setColorForSlot(hex, index){
    	colorSlots[index].attr('color', hex).css('background-color', hex)
    }

    function newColorSlot(hex, index){
    	let $slot = $('<div class="color_slot selectable_circle">').attr('slot', index)

    	colorSlots[index] = $slot

    	$slot.on('click', ()=>{
    		selectColorSlot(index)
    	})

    	container.find('.color_slot_container').append($slot)

    	setColorForSlot(hex, index)

    	return $slot
    }

    function saveToStorage(){
    	let toSave = []
    	for(let cs of colorSlots){
    		toSave.push( cs.attr('color') )
    	}
    	STORAGE.setConfiguration('settings.colorSlots', toSave)
    }

    function getCurrentColor(){
    	return colorSlots[selectedSlot].attr('color')
    }


    /* fix gamma for game monitors */
	function gammaFix(color){
		const A = 0.66 // 0 to 1 for gamma compression
		const Y = 2.35 // 2.2 to 2.4

		for(let k of Object.keys(color)){
			if(k === 'a'){
				continue
			}
			color[k] = ( (A * color[k]) ** Y) / (255**Y) * color[k]
		}

		return color
	}

	/* inverts gammaFix()

		returns undefined if results in invalid rgb color => above 255)
	*/
	function invertGammaFix(color){
		const A = 0.66 // 0 to 1 for gamma compression
		const Y = 2.35 // 2.2 to 2.4

		for(let k of Object.keys(color)){
			if(k === 'a'){
				continue
			}
			color[k] = (color[k] * (255**Y) / (A ** Y)) ** (1 / (Y+1))
			if(color[k] > 255){
				return undefined
			}
		}

		return color
	}

    /* conversions */

	function sanitize0to255(numb){
		let parsed = parseInt(numb)
		if(isNaN(parsed)){
			parsed = 255
		}
		return Math.max(0, Math.min(255, Math.round(parsed)) )
	}

    function normalizeHexOrTransparent(maybeHex){
    	let ret = hexToRgba(maybeHex)

    	if(!ret){
    		return '#ffffff00'
    	}

    	return rgbToHex(ret.r, ret.g, ret.b, ret.a)
    }

    function componentToHex(c) {
		let hex = Math.round(c).toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(r, g, b, a) {
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(typeof a === 'number' ? a : 255);
	}

	function hexToRgb(hex) {
		let result = hexToRgba(hex);
		return result ? {
			r: result.r,
			g: result.g,
			b: result.b
		} : undefined;
	}

	function hexToRgba(hex) {
		let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16),
			a: parseInt(result[4] || 255, 16)
		} : undefined;
	}

	return {

	}

})(jQuery)