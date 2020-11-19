HISTORY = (()=>{
    "use strict";
   
    /* configuration might be an empty object, contain parts of a full configuration, or a complete configuration */
    let history = {
        entries: []
    }

    let dom

    LOADER.on(LOADER.EVENT.UI_READY, init)

    function init(){
        let y = localStorage.getItem('yyy_history')
        if(y){
            try {
                let parsed = JSON.parse(y)
                if(parsed && parsed instanceof Object){
                    history = parsed
                } else {
                    throw new Error('invalid history format')
                }
            } catch (ex){
                console.warn('History: invalid history')
            }
        }


        // build UI
        dom = $('[viewable="viewable_history"]')

        for(let e of history.entries){
            makeDomHistory(e, true)
        }
        sortDomHistory()

        let relatedId = STORAGE.getConfiguration('related-history-entry')
        markRelatedHistoryEntry( relatedId )

        $('#code-title').val(STORAGE.getConfiguration('title'))

        calculateStorageSize()

        $('#history-help, #history-help-controls').on('click', (evt)=>{
            evt.originalEvent.stopPropagation()
            UTIL.message('History Help',
                'Clicking this button will save a copy of the current state fo the ide in your browsers storage. You can access this copy via the history tab.'
                + '<br>Click "Load" to load the copy, "Update" to overwrite the copy with the current state of the ide, "Trash Icon" will remove it entirely.'
                + '<br>'
                + '<br>If you click share, your browser will be able to overwrite that shared code, so you can effectively publish update of your code.'
                + '<br>If you delete cookies/website storage or uninstall your browser, you will not be able to update those sharecodes anymore!'
                + '<br>You can click "Export My Shared Codes" to get a backup of your own shared codes. You can always use "Import My Shared Codes" together with this backup, to be able to update your own shared codes again.'
            )
        })

        $('#history-export').on('click', exportHistory)
        $('#history-import').on('click', importHistory)

        LOADER.done(LOADER.EVENT.HISTORY_READY)
    }

    function makeDomHistory(e, dontSort){
        let entry = $('<div class="history_entry" type="' + e.type + '" entry-id="' + e.id + '"></div>')
        entry.append(
            $('<div class="title"></div>')
        )
        let type = $('<div class="type"></div>')
        if(e.type === 'sharekey'){
            type.text(e.content.id).append(
                $('<button class="share_link_open"><span class="icon-share2"></span></button>').on('click', ()=>{
                    window.open('https://lua.flaffipony.rocks?id=' + e.content.id)
                }).attr('title', 'https://lua.flaffipony.rocks?id=' + e.content.id)
            )
        } else {
            type.text('Local')
        }
        entry.append(type)
        entry.append(
            $('<div class="time"></div>')
        )
        let loadButton = $('<button class="load">Load</button>').on('click', ()=>{
            loadHistoryEntry(e)
        })
        let updateButton = $('<button class="special_button update">Update</button>').on('click', ()=>{
            updateHistoryEntry(e)
        })
        let deleteButton = $('<button class="special_button delete"><span class="icon-bin delete"></span></button>').on('click', ()=>{
            deleteHistoryEntry(e)
        })

        if(e.type === 'sharekey' && ! e.content.token){
            updateButton.hide()
            deleteButton.append('&nbsp;Ref')
        }

        entry.append(
            $('<div class="buttons"></div>').append(loadButton).append(updateButton).append(deleteButton)
        )
        dom.find('.entries').prepend(entry)
        updateDomHistory(e, dontSort)
    }

    function updateDomHistory(e, dontSort){
        let entry = dom.find('.history_entry[entry-id="' + e.id + '"]')

        entry.find('.title').text( (e.title || 'untitled') )

        let d = new Date(e.time)
        entry.find('.time').html('').append(
            $('<span>' + d.toLocaleDateString() + '</span><span>' + d.toLocaleTimeString() + '</span>')
        )

        if(dontSort !== true){
            sortDomHistory()
        }
    }

    function sortDomHistory(){
        history.entries.sort((a,b)=>{
            if(a.time > b.time){
                return -1
            }

            if(a.time < b.time){
                return 1
            }

            return 0
        })

        console.log('sorted', history.entries)

        let rowCounter = 1
        for(let e of history.entries){
            let entry = dom.find('.history_entry[entry-id="' + e.id + '"]')
            entry.children().attr('style', 'grid-row: ' + rowCounter + ' / ' + rowCounter)
            rowCounter++
        }
    }


    function loadHistoryEntry(entry){
        UTIL.confirm('Discard current code and settings and load historical code?').then((res)=>{
            if(res){
                console.log('loading history entry', entry)
                SHARE.removeIdFromURL()
                if(entry.type === 'code'){
                    STORAGE.set(entry.content)

                    STORAGE.setConfiguration('related-history-entry', entry.id)

                    markRelatedHistoryEntry(entry.id)

                    // TODO rework this to not use page reload
                    YYY.makeNoExitConfirm()
                    document.location.reload()
                } else if(entry.type === 'sharekey'){
                    SHARE.doReceive(entry.content.id, (success)=>{
                        if(success){
                            entry.title = STORAGE.getConfiguration('title')
                            updateDomHistory(entry)
                            updateLocalStorage()

                            STORAGE.setConfiguration('related-history-entry', entry.id)

                            markRelatedHistoryEntry(entry.id)

                            // TODO rework this to not use page reload
                            YYY.makeNoExitConfirm()
                            document.location.reload()
                        } else {
                            entry.title = 'invalid key'
                            updateDomHistory(entry)
                            updateLocalStorage()

                            STORAGE.setConfiguration('related-history-entry', entry.id)

                            markRelatedHistoryEntry(entry.id)
                        }
                    })
                }
            }
        })
    }

    function updateLocalStorage(){
        localStorage.setItem('yyy_history', JSON.stringify(history))

        calculateStorageSize()
    }

    function calculateStorageSize(){
        let localStorageSize = 0
        for(let k in localStorage){
            if(localStorage.hasOwnProperty(k)){
                localStorageSize += localStorage[k].length
            }
        }

        let usedPercent = Math.floor(localStorageSize/5000000 * 100)

        $('#storage-used').text( usedPercent + ' %' )

        if(usedPercent > 90){
            $('#storage-used').addClass('warning')
            UTIL.alert('Please remove some of your old codes in the history, your storage is almost full!', 'Storage Warning')
        } else {
            $('#storage-used').removeClass('warning')
        }
    }

    function markRelatedHistoryEntry(id){
        dom.find('.history_entry.related').removeClass('related')
        if(id){
            dom.find('.history_entry[entry-id="' + id + '"]').addClass('related')
        }
    }

    function addOthersShareKey(sharekey, title){
        createNewEntry('sharekey', {id: sharekey}, title)

        UI.viewables()['viewable_history'].addNotification()
    }

    function addMyShareKey(sharekey, token, title){
        createNewEntry('sharekey', {id: sharekey, token: token}, title)

        UI.viewables()['viewable_history'].addNotification()
    }

    function addCurrentCode(){
        createNewEntry('code', STORAGE.configurationAsString(), STORAGE.getConfiguration('title'))

        UI.viewables()['viewable_history'].focusSelf()
    }

    function createNewEntry(type, content, title){
        const id = new Date().getTime()
        let entry = {
            id: id,
            type: type,
            content: content,
            title: title,
            time: new Date().getTime()
        }
        history.entries.push(entry)

        makeDomHistory(entry)

        STORAGE.setConfiguration('related-history-entry', id)
        markRelatedHistoryEntry(id)

        updateLocalStorage()
    }

    function updateHistoryEntry(e){
        let text
        if(e.type === "sharekey"){
            if(!e.content.token){
                UTIL.alert('You cannot update a shared code of someone else!')
                return
            }
            text = 'Do you want to update the shared code? This will update it for everyone and cannot be undone!'
        } else if (e.type === "code"){
            text = 'Do you want to update the historical code? This action cannot be undone!'
        } else {
            throw new Error('unexpected history entry type "' + e.type + '"')
        }

        UTIL.confirm(text).then((res)=>{
            if(res){
                console.log('updating entry', e)

                ENGINE.saveCodesInStorage()
                if(e.type === "sharekey"){
                    SHARE.updateSharedCode(e.content.id, e.content.token, (success, res)=>{
                        if(success){
                            UTIL.success('Shared code updated successful.')
                            e.content = {id: res.key, token: res.token}
                            e.title = STORAGE.getConfiguration('title')
                            e.time = new Date().getTime()
                            updateDomHistory(e)
                            updateLocalStorage()

                            markRelatedHistoryEntry(e.id)
                        } else {
                            UTIL.fail('Shared code was not updated, please try again later.')
                        }
                    })
                } else if (e.type === "code"){
                    e.content = JSON.parse(STORAGE.configurationAsString())
                    e.title = STORAGE.getConfiguration('title')
                    e.time = new Date().getTime()
                    updateDomHistory(e)
                    updateLocalStorage()

                    markRelatedHistoryEntry(e.id)
                } else {
                    throw new Error('unexpected history entry type "' + e.type + '"')
                }
            }
        })
    }

    function deleteHistoryEntry(e){
        let text
        if(e.type === "sharekey"){
            if(e.content.token){
                text = 'You will lose access to this shared code, you will not be able to update it anymore!'
            } else {
                text = 'Do you want to remove the reference for this shared code? The code itself stays online!'
            }
        } else if (e.type === "code"){
            text = 'Do you want to remove this historical code? This action cannot be undone!'
        } else {
            throw new Error('unexpected history entry type "' + e.type + '"')
        }

        UTIL.confirm(text).then((res)=>{
            if(res){
                console.log('deleting entry', e)

                for(let i in history.entries){
                    if(history.entries[i].id === e.id){
                        history.entries.splice(i,1)
                        dom.find('.history_entry[entry-id="' + e.id + '"]').remove()
                        updateLocalStorage()
                        return
                    }
                }
            }
        })
    }

    function exportHistory(){
        let exp = []

        for(let e of history.entries){
            if(e.type === 'sharekey' && e.content.token){
                exp.push({
                    id: e.content.id,
                    token: e.content.token,
                    title: e.title
                })
            }
        }

        //let enc = new TextEncoder()
        let blob = new Blob([JSON.stringify(exp)], {type: 'text/json'})

        let filename = 'lua.flaffipony.rocks my sharecode export.json'

        if(window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename)
        } else {
            let elem = $('<a/>')
                .attr('href', window.URL.createObjectURL(blob))
                .attr('download', filename)
            elem.appendTo(document.body)
            elem.get(0).click()
            elem.hide()
        }
    }

    let importHistoryInput
    function importHistory(){
        importHistoryInput = $('<input type="file" accept=".json" style="position: absolute; left: -999999px; top: -1000px;">')
            .appendTo(document.body)
        importHistoryInput.get(0).click()

        $(window).on('focus', cleanUpImportHistory)

        importHistoryInput.on('change', ()=>{
            let files = importHistoryInput.get(0).files

            if(files[0] instanceof File){
                var reader = new FileReader()
                reader.readAsText(files[0], "UTF-8")
                reader.onload = function (evt) {                    
                    try {
                        let parsed = JSON.parse(evt.target.result)
                        if(parsed instanceof Array === false){
                            invalidHistory()
                        } else {
                            let count = 0
                            for(let e of parsed){
                                if(typeof e.id === 'string' && typeof e.token === 'string'){
                                    addMyShareKey(e.id, e.token, e.title)
                                    count++
                                }
                            }
                            UTIL.success('Added ' + count + ' keys to history.', 'Import successful')
                        }
                    } catch (ex){
                        console.error(ex)
                        invalidHistory()
                    }
                }
                reader.onerror = function (evt) {
                    invalidHistory()
                }
            } else {                
                cleanUpImportHistory()
            }

        })

        function invalidHistory(){
            UTIL.alert('Invalid history, cannot import!')  
            cleanUpImportHistory()                  
        }
    }

    function cleanUpImportHistory(){        
        $(window).off('focus', cleanUpImportHistory)
        setTimeout(()=>{
            importHistoryInput.remove()
        }, 1000)
    }

    return {
        addOthersShareKey: addOthersShareKey,
        addMyShareKey: addMyShareKey,
        addCurrentCode: addCurrentCode
    } 
})()