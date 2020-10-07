TRANSLATE = (()=>{
    "use strict";
    
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
        "viewable_examples": {en: "Examples"},
        "viewable_official_manuals": {en: "Official Manuals"},
        "viewable_editor_normal": {en: "Editor"},
        "viewable_editor_minified": {en: "Minifier"},
        "viewable_editor_unminified": {en: "Unminifier"},
        "viewable_editor_uibuilder": {en: "UI Builder"},
        /* views */
        "top_left": {en: "Top Left"},
        "top_right": {en: "Top Right"},
        "bottom_left": {en: "Bottom Left"},
        "bottom_right": {en: "Bottom Right"},

        /* server editor */
        "viewable_server_editor": {en: "Server Script"}
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

            UTIL.message('Reportedly missing keys:', msg)
        }
    }
})()