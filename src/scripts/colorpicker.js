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

	let container
	let picker

	let colorSlots = []
	let selectedSlot = 0

    LOADER.on(LOADER.EVENT.UI_READY, init)

    function init(){
    	container = $('#colorpicker')

		// preset colors
    	for(let c of COLOR_PRESET){
    		let hex = rgbToHex(c[0], c[1], c[2])
    		let $preset = $('<div class="color_preset selectable_circle">').css('background-color', hex).on('click', ()=>{
    			picker.setColor(hex)
    			setColorForSlot(hex, selectedSlot)
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
				colorSlots[i] = newColorSlot(s, i)
			} else {
				colorSlots[i] = newColorSlot('#fff0', i)
			}
		}

    	picker = new Picker({
    		parent: container.find('.color_select_container').get(0),
    		onChange: (color)=>{
	    		setColorForSlot(color.hex, selectedSlot)
	    		saveToStorage()
	    	},
	    	popup: false,
	    	editor: false
    	})

		selectColorSlot(0)

        LOADER.done(LOADER.EVENT.COLORPICKER_READY)
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

    function componentToHex(c) {
		let hex = Math.floor(c).toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(r, g, b, a) {
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(typeof a === 'number' ? a : 255);
	}

	function hexToRgb(hex) {
		let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
		} : undefined;
	}

	function gammaFix(color){
		const A = 0.66 // 0 to 1 for gamma compression
		const Y = 2.35 // 2.2 to 2.4

		for(let k of Object.keys(color)){
			color[k] = ( (A * color[k]) ^ Y) / (255^Y) * color[k]
		}

		return color
	}

	return {
		getColoris: ()=>{return coloris}
	}

})(jQuery)