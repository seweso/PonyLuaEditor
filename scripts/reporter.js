reporter = (()=>{
    "use strict";


    const REPORT_TYPE_IDS = {
        'startEmulator': 3,
        'downloadOffline': 4,
        'openHelp': 5,
        'minify': 6,
        'unminify': 7,
        'openAutocomplete': 8,
        'openLearnAndExamples': 9,
        'shareCode': 10,
        'receiveShareCode': 11,
        'generateUIBuilderCode': 12,
        'pauseScript': 15
    }

    function report(typeID, data){
        if(window.PonyTracking){
            window.PonyTracking.report(typeID, data)
        }
    }

    return {
        REPORT_TYPE_IDS: REPORT_TYPE_IDS,
        report: report
    }  
})()