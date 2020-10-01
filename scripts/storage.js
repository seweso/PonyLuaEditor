storage = (()=>{
   
    const VERSION = "1"


    /* configuration might be an empty object, contain parts of a full configuration, or a complete configuration */
    let configuration = {}

    loader.on(loader.EVENT.PAGE_READY, init)

    function init(){
        let yyy = localStorage.getItem('yyy')
        if(yyy){
            try {
                let parsed = JSON.parse(yyy)

                if(parsed.version === VERSION){
                    processStorage(parsed)
                } else {
                    console.info('Storage: found old configuration, updating ...')
                    let updated = updateConfiguration(parsed, parsed.version)
                    processStorage(updated)
                }
            } catch (ex){
                console.warn('Storage: invalid configuration, using default configuration')
                processStorage()
            }
        } else if (localStorage.getItem('general')) {
            console.info('Storage: found outdated configuration, converting ...')
            let converted = convertOldConfiguration()
            processStorage(converted)
        } else {            
            processStorage()
        }
    }

    /* before v1 */
    function convertOldConfiguration(){
        let general
        try {
            general = JSON.parse( localStorage.getItem('general') )
            if(!general){
                general = {}
            }
        } catch (ex){
            general = {}
        }

        return {
            version: VERSION,
            editors: {
                normal: localStorage.getItem('code'),
                minified: localStorage.getItem('minified-code')
            },
            inputs: {
                bools: localStorage.getItem('input_bools'),
                numbers: localStorage.getItem('input_numbers')
            },
            properties: {
                bools: localStorage.getItem('property_bools'),
                numbers: localStorage.getItem('property_numbers'),
                texts: localStorage.getItem('property_texts'),
            },
            settings: {
                timeBetweenTicks: general.timeBetweenTicks,
                timeBetweenDraws: general.timeBetweenDraws,
                zoomfactor: general.zoomfactor,
                monitorSize: general.monitorSize,
                showOverflow: general.showOverflow,
                touchscreenEnabled: general.touchscreenEnabled,
                touchscreenSecondaryEnabled: undefined,
                layout: undefined
            }
        }
    }

    function updateConfiguration(conf, version){
        switch(version){
            case "1": {
                /* fill this once we get a new version */
            }
        }
    }

    function processStorage(storage){
        configuration = storage
        if(!configuration || configuration instanceof Object === false){
            configuration = {
                version: VERSION
            }
        }

        loader.done(loader.EVENT.STORAGE_READY)
    }

    function saveConfiguration(){
        localStorage.setItem('yyy', JSON.stringify(configuration))
    }

    /* value can be a simple type (e.g. number, boolean) or an object */
    function setConfiguration(name, value, dontSave){
        if(name === 'version'){
            throw 'field is not writable: "' + name + '"'
        }
        configuration[name] = value

        if( !dontSave ){
            saveConfiguration()
        }
    }

    function getConfiguration(name){
        return configuration[name]
    }
    
    return {
        setConfiguration: setConfiguration,
        getConfiguration: getConfiguration
    } 
})()