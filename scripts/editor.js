class Editor {
    constructor(container, viewable){

        this.dom = $(container)
        this.viewable = viewable
        this.editor = ace.edit(this.dom.get(0))
        this.editor.setTheme("ace/theme/monokai")
        this.editor.session.setMode("ace/mode/lua")
        this.editor.session.setUseSoftTabs(false)

        this.oldHeight = 0

        this.dom.on('change', ()=>{
            this.refreshCharacterCount()
        })

        this.editor.selection.on('changeCursor', ()=>{
            this.refreshPositionHint()
        })

        this.viewable.onViewableResize(()=>{
            this.refreshSize()
        })

        setTimeout(()=>{
            this.refreshSize()
        }, 100)

        this.addEditorControls()

        editors.registerEditor(this, this.dom.attr('code-field'))
    }

    refreshSize(){
        let myCurrentView = this.viewable.myCurrentView()
        if(myCurrentView){
            this.dom.width( myCurrentView.dom.find('.viewable_container').innerWidth() - 20 )
            this.dom.height( myCurrentView.dom.find('.viewable_container').innerHeight() - 20 )
        }
        this.editor.resize()
    }

    addEditorControls(){
        let fontMinus = $('<span class="font_minus icon-minus"></span>')
        fontMinus.on('click', ()=>{
            decreaseFontSize()
        })            
        this.dom.append(fontMinus)


        let fontPlus = $('<span class="font_plus icon-plus"></span>')
        fontPlus.on('click', ()=>{
            increaseFontSize()
        })
        this.dom.append(fontPlus)


        let fullscreen = $('<span class="fullscreen_toggle icon-enlarge"></span>')
        fullscreen.on('click', ()=>{
            if(this.dom.hasClass('fullscreen')){
                this.leaveFullscreen()
            } else {
                this.enterFullscreen()
            }
        })
        this.dom.on('keydown', (e)=>{
            if (e.keyCode === 27){//esc
                this.leaveFullscreen()
            }
        })
        this.dom.append(fullscreen)
        this.editor.setShowPrintMargin(false)
    }

    enterFullscreen(){
        this.oldHeight = this.dom.height()
        this.dom.addClass('fullscreen')
        this.dom.height($(window).height())
        this.editor.resize()
    }

    leaveFullscreen(){        
        this.dom.removeClass('fullscreen')
        this.dom.height(this.oldHeight)
        this.editor.resize()
    }

    refreshCharacterCount(){
        let chars = this.countCharacters(this.editor.getValue())
        // TODO replace those static ids with relative class selectors
        $('#charactercount').html(chars + '/4096')
        if(chars >= 4096){
            $('#charactercount').addClass('limit')
        } else {
            $('#charactercount').removeClass('limit')
        }
    }

    refreshPositionHint(){
        let pos = this.editor.getCursorPosition()
        let chars = this.editor.session.doc.positionToIndex(pos)
        // TODO replace those static ids with relative class selectors
        $('#selection-information').html('Line ' + (pos.row + 1) + ', Column ' + (pos.column + 1) + ', Char ' + chars)
    }

    countCharacters(str){
        return typeof str === 'string' ? str.length : 0
    }
}



editors = (()=>{

    let editors = {}
    let activeEditor

    const DEFAULT_EDITOR_FONTSIZE = 12

    $(window).on('newui_loaded', ()=>{
        refreshEditorFontSize()
    })

    function registerEditor(editor, name){
        editors[name] = editor

        if(!activeEditor){
            activeEditor = name
        }
    }

    function setActiveEditor(name){
        if(!editors[name]){
            throw 'editor is unknown: "' + name + '"'
        }
        activeEditor = name
    }

    function setEditorFontSize(fontsize){
        if(fontsize < 3){
            fontsize = 3
            saveEditorFontSize(fontsize)
        }
        if(fontsize > 100){
            fontsize = 100
            saveEditorFontSize(fontsize)
        }
        for(let e of Object.keys(editors)){
            editors[e].editor.setFontSize(fontsize)
        }
    }

    function loadEditorFontSize(){
        return localStorage.getItem('editor-font-size')
    }

    function saveEditorFontSize(fontsize){
        localStorage.setItem('editor-font-size', fontsize)
    }

    function increaseEditorFontSize(){
        let fontsize = parseInt(loadEditorFontSize())
        if(typeof fontsize !== 'number' || isNaN(fontsize) || fontsize === 0){
            fontsize = DEFAULT_EDITOR_FONTSIZE
        }
        fontsize = fontsize + Math.max(1, Math.floor(fontsize/10))
        setEditorFontSize(fontsize)
        saveEditorFontSize(fontsize)
    }

    function decreaseEditorFontSize(){
        let fontsize = parseInt(loadEditorFontSize())
        if(typeof fontsize !== 'number' || isNaN(fontsize) || fontsize === 0){
            fontsize = DEFAULT_EDITOR_FONTSIZE
        }
        fontsize = fontsize - Math.max(1,Math.floor(fontsize/10))
        setEditorFontSize(fontsize)
        saveEditorFontSize(fontsize)
    }

    function refreshEditorFontSize(){        
        let fontsize = parseInt(loadEditorFontSize())
        if(typeof fontsize !== 'number' || isNaN(fontsize) || fontsize === 0){
            fontsize = DEFAULT_EDITOR_FONTSIZE
        }
        setEditorFontSize(fontsize)
    }

    return {
        registerEditor: registerEditor,
        setActiveEditor: setActiveEditor,
        getActiveEditor: ()=>{return editors[activeEditor]},
        get: (name)=>{return editors[name]},
    }
})()



