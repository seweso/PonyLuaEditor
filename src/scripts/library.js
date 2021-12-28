LIBRARY = (($)=>{
	"use strict";

	let libraryAst

    LOADER.on(LOADER.EVENT.EDITORS_READY, init)

    function init(){

    	let code = STORAGE.getUnShared('library')

    	if(typeof code === 'string'){
    		EDITORS.get('library').editor.setValue(code)
    		updateLibraryAST()
    	}

    	EDITORS.get('library').editor.on('blur', updateLibraryAST)

    	EDITOR_KEYWORD_MANAGER.registerKeywordHandler((keyword)=>{
    		if(libraryAst && libraryAst.body instanceof Array){
    			for(let entry of libraryAst.body){
    				if(entry.identifier && entry.identifier.name === keyword){
    					return 'keyword_library'
    				}
    			}
    		}
    	})

        LOADER.done(LOADER.EVENT.LIBRARY_READY)
    }

    function updateLibraryAST(){
    	try {
    		libraryAst = luaparse.parse( EDITORS.get('library').editor.getValue() )
    	} catch (ex){
    		libraryAst = undefined
    	}
    	setTimeout(()=>{
    		EDITORS.forceRefresh()
    	}, 10)
    }

	function saveToStorage(){
		let code = EDITORS.get('library').editor.getValue()

		STORAGE.setUnShared('library', code)
	}

	return {
		saveToStorage: saveToStorage
	}

})(jQuery)