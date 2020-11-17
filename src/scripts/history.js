HISTORY = (()=>{
    "use strict";
   
    /* configuration might be an empty object, contain parts of a full configuration, or a complete configuration */
    let history = {
        entries: []
    }

    let dom

    LOADER.on(LOADER.EVENT.PAGE_READY, init)

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
            makeDomHistory(e)
        }

        let relatedId = STORAGE.getConfiguration('related-history-entry')
        markRelatedHistoryEntry( relatedId )

        $('#code-title').val(STORAGE.getConfiguration('title'))

        LOADER.done(LOADER.EVENT.HISTORY_READY)
    }

    function makeDomHistory(e){
        let entry = $('<div class="history_entry" type="' + e.type + '" entry-id="' + e.id + '"></div>')
        entry.append(
            $('<div class="title"></div>')
        )
        entry.append(
            $('<div class="time"></div>')
        )
        let loadButton = $('<button>Load</button>').on('click', ()=>{
            loadHistoryEntry(e)
        })
        let updateButton = $('<button class="special_button">Update</button>').on('click', ()=>{
            updateHistoryEntry(e)
        })
        let deleteButton = $('<button><span class="icon-bin"></span></button>').on('click', ()=>{
            deleteHistoryEntry(e)
        })
        entry.append(
            $('<div class="buttons"></div>').append(loadButton).append(updateButton).append(deleteButton)
        )
        dom.prepend(entry)
        updateDomHistory(e)
    }

    function updateDomHistory(e){
        let entry = dom.find('.history_entry[entry-id="' + e.id + '"]')
        entry.find('.title').text( (e.title || '<i>untitled</i>') )

        let d = new Date(e.time)
        entry.find('.time').html('').append(
            $('<span>' + d.toLocaleDateString() + '</span><span>' + d.toLocaleTimeString() + '</span>')
        )
    }

    function loadHistoryEntry(entry){
        UTIL.confirm('Discard current code and settings and load historical code?').then((res)=>{
            if(res){
                console.log('loading history entry', entry)
                if(entry.type === 'code'){
                    STORAGE.set(entry.content)
                } else if(entry.type === 'sharekey'){
                    SHARE.doReceive(entry.content.id, ()=>{
                        entry.title = STORAGE.getConfiguration('title')
                    })
                }
                STORAGE.setConfiguration('related-history-entry', entry.id)

                markRelatedHistoryEntry(entry.id)

                //TODO reinit everything
                YYY.makeNoExitConfirm()
                document.location.reload()
            }
        })
    }

    function updateLocalStorage(){
        localStorage.setItem('yyy_history', JSON.stringify(history))
    }

    function markRelatedHistoryEntry(id){
        dom.find('.history_entry.related').removeClass('related')
        if(id){
            dom.find('.history_entry[entry-id="' + id + '"]').addClass('related')
        }
    }

    function addShareKey(sharekey, token){
        createNewEntry('sharekey', {id: sharekey, token: token}, STORAGE.getConfiguration('title'))
    }

    function addCurrentCode(){
        createNewEntry('code', STORAGE.configurationAsString(), STORAGE.getConfiguration('title'))
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
                    SHARE.updateSharedCode(e.content.id, e.content.token, ()=>{
                        UTIL.message('Success', 'Shared code updated successfully')
                        e.content = STORAGE.configurationAsString()
                        e.title = STORAGE.getConfiguration('title')
                        e.time = new Date().getTime()
                        updateDomHistory(e)
                        updateLocalStorage()

                        markRelatedHistoryEntry(e.id)
                    })
                } else if (e.type === "code"){
                    e.content = STORAGE.configurationAsString()
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
                text = 'You will loose access to this shared code, you will not be able to update it anymore!'
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

    return {
        addShareKey: addShareKey,
        addCurrentCode: addCurrentCode
    } 
})()