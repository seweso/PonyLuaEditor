EASTEREGG = (()=>{
	
	let cont
	let sound

	let played = false

	$(window).on('load', init)

	function init(){
		if(!shouldShowEasterEgg()){
			return
		}

		let style = '.easteregg_image {position: fixed; z-index: 999999999; top: 50%; left: 50%; height: 90vh; width: calc(( ( 388 / 690 ) ) * 90vh); transform: translateX(-50%) translateY(-50%); background: black; border: 3px solid #b80a66; border-radius: 3px;}'
			+ '.easteregg_image .easteregg_image_gif {position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; background: url("dev-docs/easteregg_image.gif"); background-size: cover;}'
			+ '.easteregg_image .easteregg_image_border {position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; background: url("dev-docs/easteregg_border.png"); background-size: 100% 100%;}'
			+ '.easteregg_image .easteregg_image_close {position: absolute; top: 15px; left: 50%; width: 50px; height: 50px; transform: translateX(-50%); display: flex; justify-content: center; align-items: center; z-index: 3; opacity: 0; transition: all 0.2s ease 0s; border-radius: 8px; color: #fff; background: #b80a66; font-size: 18px; line-height: 18px; cursor: pointer;}'
			+ '.easteregg_image:hover .easteregg_image_close {opacity: 1}'
			+ '.easteregg_image_close:hover {background: #db84b2}'

		$(document.body).append( $('<style>').text(style) )

		cont = $('<div class="easteregg_image" style="display: none"><div class="easteregg_image_gif"></div><div class="easteregg_image_border"></div><div class="easteregg_image_close"><span class="icon-cross"></span></div>')

		$(document.body).append(cont)

		cont.find('.easteregg_image_close').on('click', stop)

		sound = new Audio('dev-docs/easteregg_sound.mp3?v=qsd71h')
		sound.preload = true
		sound.onended = ()=>{
			stop()
		}

		setTimeout(()=>{
			$('#start').on('click', ()=>{
				if(Math.random() * 50 < 1){
					start()
				}
			})
			$('.docreate').on('click', ()=>{
				start()
			})
		}, 1000)
	}

	function shouldShowEasterEgg(){
		let params = new URLSearchParams(document.location.search)
		let now = new Date()
		let month = now.getMonth() + 1
		let day = now.getDate()
		return params.has('easteregg') || (month == 12 && day >= 24) || (month == 4 && day >= 1 && day <= 2)
	}

	function start(evt){
		if(played){
			return
		}
		played = true
		$('#start').off('click', start)
		$('.docreate').off('click', start)
		cont.show()
		sound.volume = 0.1
		sound.play()
	}

	function stop(){
		cont.hide()
		sound.volume = 0
	}

})()