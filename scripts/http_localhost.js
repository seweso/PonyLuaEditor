var HttpLocalhost = ((global, $)=>{

    let hasShownHttpHint = false

    let queue = [] /* allow maximum of 1 sent http request per tick */


	$(global).on('lua_tick', checkQueue)

	function get(port, url){

        if(!hasShownHttpHint){
            hasShownHttpHint = true

            YYY.message('You must follow these steps to enable http support', 'Your browser prohibits sending and receiving data to and from localhost. To fix that, follow the <a href="http-allow-localhost" target="_blank">manual here</a>.')
        }

	    queue.push({
	    	port: port,
	    	url: url
	    })
	}

	function checkQueue(){
		if(queue.length > 0){
			queue.reverse()
			let req = queue.pop()
			queue.reverse()

			makeRequest(req)
		}
	}

	function makeRequest(req){
		$.get(makeUrl(req)).done((res)=>{
			processResult(req, res)
		}).fail((xhr, res)=>{
			if(xhr.status === 0){
				res = "connect(): Connection refused"
			}			
			
			processResult(req, res)
		})
	}

	function makeUrl(req){
		return 'http://localhost:' + (Math.floor(req.port)) + req.url
	}

	function processResult(req, res){
		if(typeof LUA_EMULATOR.getGlobalVariable('httpReply') === 'function'){
			LUA_EMULATOR.callLuaFunction('httpReply', [req.port, req.url, res])	
        }
	}

	return {
		get: get
	}
})(window, jQuery)