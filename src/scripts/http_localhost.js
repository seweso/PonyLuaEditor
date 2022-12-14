var HttpLocalhost = (($)=>{

    let hasShownHttpHint = false

    let queue = [] /* allow maximum of 1 sent http request per tick */


    const REPORT_TYPE_IDS = {
        'httpUse': 16,
    }

	$(window).on('lua_tick', checkQueue)

	function get(port, url){

        if(!hasShownHttpHint){
            hasShownHttpHint = true

            UTIL.message('You must follow these steps to enable http support', 'Your browser prohibits sending and receiving data to and from localhost. To fix that, follow the <a href="http-allow-localhost" target="_blank">manual here</a>.')
        	report(REPORT_TYPE_IDS.httpUse)
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
		$.get(makeUrl(req),{timeout: 1000 * 35}).done((res)=>{
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
			LUA_EMULATOR.callLuaFunction('httpReply', [req.port, req.url, typeof res === 'string' ? res : JSON.stringify(res)])	
        }
	}

	function report(typeID, data){
        if(window.PonyTracking){
            window.PonyTracking.report(typeID, data)
        }
    }

	return {
		get: get
	}
})(jQuery)