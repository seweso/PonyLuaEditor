ui = (($)=>{
	"use strict";

	loader.on(loader.EVENT.SHARE_READY, init)

	let views = {}
	let viewables = {}

	function init(){
		let viewMain = new View('[view="main"]')
		let viewSecondary = new View('[view="secondary"]')
		views.main = viewMain
		views.secondary = viewSecondary

		let viewableEditor = new Viewable( $('[viewable="viewable_server_editor"]') )
		viewables['viewable_server_editor'] = viewableEditor

		let viewableDocumentation = new Viewable( $('[viewable="viewable_documentation"]') )
		viewables['viewable_documentation'] = viewableDocumentation

        let editor = new Editor($('[code-field="server"]'), viewableEditor )

        viewableEditor.moveToView(viewMain)
        viewableDocumentation.moveToView(viewSecondary)

        loader.done(loader.EVENT.UI_READY)
	}

	return {
		views: ()=>{ return views },
		viewables: ()=>{ return viewables }
	}
})(jQuery)