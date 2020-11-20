EASTEREGG = (()=>{
	
	let cont
	let sound

	let timesPlayed = 0

	$(window).on('load', init)

	function init(){
		if(!shouldShowEasterEgg()){
			return
		}

		let style = '.easteregg_image {position: fixed; z-index: 999999999; top: 50%; left: 50%; height: 90vh; width: calc(( ( 388 / 690 ) ) * 90vh); transform: translateX(-50%) translateY(-50%); background: black;}'
			+ '.easteregg_image .easteregg_image_gif {position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; background: url("dev-docs/easteregg_image.gif"); background-size: cover;}'
			+ '.easteregg_image .easteregg_image_border {position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; background: url("dev-docs/easteregg_border.png"); background-size: 100% 100%;}'

		$(document.body).append( $('<style>').text(style) )

		cont = $('<div class="easteregg_image" style="display: none"><div class="easteregg_image_gif"></div><div class="easteregg_image_border"></div></div>')

		$(document.body).append(cont)

		sound = new Audio('dev-docs/easteregg_sound.mp3')
		sound.preload = true
		sound.volume = 1
		sound.onended = ()=>{
			setTimeout(playOnce, 300)
		}

		setTimeout(()=>{
			$(window).on('click', start)
		}, 1000)
	}

	function shouldShowEasterEgg(){
		return false
	}

	function start(){
		cont.show()
		playOnce()
	}

	function playOnce(){
		if(timesPlayed < 5){
			sound.play()
			timesPlayed++
		} else {
			cont.hide()
			sound.volume = 0
		}
	}

})()