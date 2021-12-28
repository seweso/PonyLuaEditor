LIBRARY = (($)=>{
	"use strict";

    LOADER.on(LOADER.EVENT.EDITORS_READY, init)

    function init(){

    	let code = STORAGE.getUnShared('library')

    	if(typeof code === 'string'){
    		EDITORS.get('library').editor.setValue(code)
    	}

        LOADER.done(LOADER.EVENT.LIBRARY_READY)
    }

	function saveToStorage(){
		let code = EDITORS.get('library').editor.getValue()

		STORAGE.setUnShared('library', code)
	}

	return {
		saveToStorage: saveToStorage
	}

})(jQuery)