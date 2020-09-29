translate = (()=>{
    
    let selectedLanguage = 'en'
    const DEFAULT_LANGUAGE = 'en'

    let missingKeys = []

    const TRANSLATIONS = {
        "viewable_monitor": {en: "Monitor"},
        "viewable_settings": {en: "Settings"},
        "viewable_console": {en: "Console"},
        "viewable_properties": {en: "Properties"},
        "viewable_inputs": {en: "Inputs"},
        "viewable_outputs": {en: "Outputs"},
        "viewable_documentation": {en: "Documentation"},
        "viewable_editor_normal": {en: "Editor Normal"},
        "viewable_editor_minified": {en: "Editor Minified"},
        "viewable_editor_unminified": {en: "Editor Unminified"},
        "viewable_editor_uibuilder": {en: "Editor UI Builder"}
    }

    function translateKey(key){
        if(TRANSLATIONS[key]){
            if(TRANSLATIONS[key][selectedLanguage]){
                return TRANSLATIONS[key][selectedLanguage]
            } else {
                reportMissingKey(key, selectedLanguage)
                if(TRANSLATIONS[key][DEFAULT_LANGUAGE]){
                    return TRANSLATIONS[key][DEFAULT_LANGUAGE]
                } else {
                    reportMissingKey(key, DEFAULT_LANGUAGE)
                    return '?d? ' + key + ' ?d?'
                }
            }
        } else {
            reportMissingKey(key)
            return '?x? ' + key + ' ?x?'
        }
    }

    function reportMissingKey(key, lang){
        missingKeys.push({
            key: key,
            lang: lang
        })
    }

    return {
        key: translateKey,
        showReportedlyMissingKeys: ()=>{
            let msg = ''

            missingKeys.sort((a,b)=>{
                if (a.lang < b.lang) {
                    return -1;
                }
                if (a.lang > b.lang) {
                    return 1;
                }
                return 0
            })

            for(let k of missingKeys){
                msg += k.key + ' => ' + k.lang + '<br>'
            }

            if(msg === ''){
                msg = 'none. Yay!'
            }

            util.message('Reportedly missing keys:', msg)
        }
    }
})()