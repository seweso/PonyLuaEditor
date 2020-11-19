STORAGE = (()=>{
    "use strict";
   
    const VERSION = "1"


    /* configuration might be an empty object, contain parts of a full configuration, or a complete configuration */
    let configuration = {}

    LOADER.on(LOADER.EVENT.PAGE_READY, init)

    let loaderNotified = false

    function init(){
        let y = localStorage.getItem('yyy')
        if(y){
            set(y)
        } else if (localStorage.getItem('general')) {
            console.info('Storage: found outdated configuration, converting ...')
            set( convertOldConfiguration() )
        } else {
            set()
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
            uibuilder: localStorage.getItem('ui'),
            editorFontSize: localStorage.getItem('editor-font-size'),
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

        if(!loaderNotified){
            loaderNotified = true
            LOADER.done(LOADER.EVENT.STORAGE_READY)
        }

        saveConfiguration()
    }

    function saveConfiguration(){
        localStorage.setItem('yyy', JSON.stringify(configuration))
    }

    /*
        name can include "." which allows access to nested settings
        e.g. settings.timeBetweenDraws

        value can be a simple type (e.g. number, boolean) or an object
    */
    function setConfiguration(name, value, dontSave){
        if(name === 'version'){
            throw 'field is not writable: "' + name + '"'
        }

        let currentNode = configuration
        let keyParts = name.split('.')
        
        while(keyParts.length > 1){
            keyParts.reverse()
            let kp = keyParts.pop()
            keyParts.reverse()

            if(currentNode.hasOwnProperty(kp)){
                currentNode = currentNode[kp]
            } else {
                currentNode[kp] = {}
            }
        }

        currentNode[keyParts[0]] = value

        if( !dontSave ){
            saveConfiguration()
        }
    }

    /* 
        name can include "." which allows access to nested settings
        e.g. settings.timeBetweenDraws
    */
    function getConfiguration(name){
        let currentNode = configuration
        let keyParts = name.split('.')
        
        while(keyParts.length > 1){
            keyParts.reverse()
            let kp = keyParts.pop()
            keyParts.reverse()

            if(currentNode.hasOwnProperty(kp)){
                currentNode = currentNode[kp]
            } else {
                currentNode[kp] = {}
            }
        }

        return currentNode[keyParts[0]]
    }

    function configurationAsString(){
        return localStorage.getItem('yyy')
    }

    /* conf must be a json string or parsed json string */
    function set(conf){
        if(!conf){
            console.warn('Storage: invalid configuration, using default configuration')
            processStorage()
            return
        }
        try {
            if(typeof conf === 'string'){
                conf = JSON.parse(conf)
            }

            if(conf.version === VERSION){
                processStorage(conf)
            } else {
                console.info('Storage: found old configuration, updating ...')
                let updated = updateConfiguration(conf, conf.version)
                processStorage(updated)
            }
        } catch(ex) {
            console.warn('Storage: invalid configuration, using default configuration')
            processStorage()
        }
    }

    function setFromShare(key, confJSON){

        let parsedSettings = parseOrUndefined(confJSON.settings)

        if(parsedSettings){
            set(parsedSettings)
        } else {
            /* old shared information */
            console.info('share is old version, updating...')
            setFromShare(key, {
                settings: JSON.stringify({
                    version: '1',
                    editors: {
                        normal: confJSON.code,
                        minified: confJSON.minified_code || ''
                    },
                    inputs: {
                        bools: parsedSettings && parsedSettings.input ? parsedSettings.input.bools : undefined,
                        numbers: parsedSettings && parsedSettings.input ? parsedSettings.input.numbers : undefined
                    },
                    properties: {
                        bools: parsedSettings && parsedSettings.property ? parsedSettings.property.bools : undefined,
                        numbers: parsedSettings && parsedSettings.property ? parsedSettings.property.numbers : undefined,
                        texts: parsedSettings && parsedSettings.property ? parsedSettings.property.texts : undefined
                    },
                    uibuilder: parseOrUndefined(confJSON.ui_builder),
                    editorFontSize: confJSON['editor-font-size'],
                    settings: {
                        timeBetweenTicks: parsedSettings && parsedSettings.general ? parsedSettings.general.timeBetweenTicks : undefined,
                        timeBetweenDraws: parsedSettings && parsedSettings.general ? parsedSettings.general.timeBetweenDraws : undefined,
                        zoomfactor: parsedSettings && parsedSettings.general ? parsedSettings.general.zoomfactor : undefined,
                        monitorSize: parsedSettings && parsedSettings.general ? parsedSettings.general.monitorSize : undefined,
                        showOverflow: parsedSettings && parsedSettings.general ? parsedSettings.general.showOverflow : undefined,
                        touchscreenEnabled: parsedSettings && parsedSettings.general ? parsedSettings.general.touchscreenEnabled : undefined,
                        touchscreenSecondaryEnabled: undefined,
                        layout: undefined
                    }
                })
            })
        }

        function parseOrUndefined(json){
            try {
                return JSON.parse(json)
            } catch (ex){
                /* ignored */
            }
        }
    }
    
    return {
        setConfiguration: setConfiguration,
        getConfiguration: getConfiguration,
        configurationAsString: configurationAsString,
        setFromShare: setFromShare,
        set: set
    } 
})()