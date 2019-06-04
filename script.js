((global, $)=>{
  "use strict";

  $(global).on('load', init)
  
  function init(){
  	$('#run').on('click', run)
  	$('#console').val('')
  }

  function run(){
  	$('#console').val('')
  	let code = editor.getValue()
  	try {
	  	let feng = fengari.load(code)
  		feng()
	  } catch (err){
	  	$('#console').append(err)
	  }
  }

})(window, jQuery)