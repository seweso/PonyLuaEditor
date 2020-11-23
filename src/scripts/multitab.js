MULTITAB = (()=>{
    
    let broadC

    let listeners = {}

    const TYPE = {
        HELLO: 'TYPE_HELLO',// sent when the page is loaded
        HELLO_RESPONSE: 'TYPE_HELLO_RESPONSE'//sent when someone else sends "hello"
    }

    let warningShown = false

    $(window).on('load', init)

    function init(){
        broadC = new BroadcastChannel('pony_ide')
        broadC.onmessage = handleBroadcastMessage

        onMessage(TYPE.HELLO, ()=>{
            showMultitabWarning()

            postMessage(TYPE.HELLO_RESPONSE, '')
        })

        onMessage(TYPE.HELLO_RESPONSE, showMultitabWarning)

        postMessage(TYPE.HELLO, '')
    }

    function showMultitabWarning(){
        if(! warningShown){
            warningShown = true
            UTIL.alert('Multiple tabs running Pony IDE, only the last saved state will be persistent!<br>History is synced live')
        }
    }

    function handleBroadcastMessage(evt){
        try {
            let parsed = JSON.parse(evt.data)

            if(typeof parsed.type === 'string'){
                if(typeof parsed.message === 'string'){
                    if(listeners[parsed.type]){
                        for(let cb of listeners[parsed.type]){
                            cb(parsed.message)
                        }
                    }
                } else {
                    throw new Error('missing message')
                }
            } else {
                throw new Error('missing type')
            }
        } catch (ex){
            console.error('error parsing broadcast message', ex)
        }
    }

    function postMessage(type, msg){
        broadC.postMessage(JSON.stringify({
            type: type,
            message: msg
        }))
    }

    function onMessage(type, callback){
        if(typeof callback !== 'function'){
            throw new Error('callback must be a function')
        }
        if(! listeners[type]){
            listeners[type] = []
        }

        listeners[type].push(callback)
    }

    return {
        postMessage: postMessage,
        onMessage: onMessage
    }

})()