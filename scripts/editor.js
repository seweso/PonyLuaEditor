class DynamicSizedViewableContent {
    constructor(container, viewable){
        this.dom = $(container)
        this.viewable = viewable

        this.viewable.onViewableResize(()=>{
            this.refreshSize()
        })

        this.viewable.onGainFocus(()=>{
            this.refreshSize()
        })

        setTimeout(()=>{
            this.refreshSize()
        }, 100)
    }

    refreshSize(){
        this.dom.width(this.getAvailableWidth())
        this.dom.height(this.getAvailableHeight())
    }

    getAvailableHeight(){
        let myCurrentView = this.viewable.myCurrentView()
        
        if(! myCurrentView){
            return 0
        }

        let avail = myCurrentView.dom.find('.viewable_container').offset().top
            + myCurrentView.dom.find('.viewable_container').height()
            - this.dom.offset().top

        return avail < 0 ? 0 : avail
    }

    getAvailableWidth(){
        let myCurrentView = this.viewable.myCurrentView()

        if(! myCurrentView){
            return 0
        }

        let avail = myCurrentView.dom.find('.viewable_container').offset().left
            + myCurrentView.dom.find('.viewable_container').width()
            - this.dom.offset().left

        return avail < 0 ? 0 : avail
    }
}

class Editor extends DynamicSizedViewableContent {
    constructor(container, viewable){
        super(container, viewable)

        this.editor = ace.edit(this.dom.get(0))
        this.editor.setTheme("ace/theme/pony_ide")
        this.editor.session.setMode("ace/mode/lua")
        this.editor.session.setUseSoftTabs(false)

        this.dom.append( $('<div class="code_lock">') )
        this.dom.append( $('<div class="autocompletion_container">') )

        this.autocomplete = new Autocomplete(this.editor, this.dom)

        this.oldHeight = 0
        
        Editors.push(this)

        this.editor.on('change', ()=>{
            this.refreshCharacterCount()
        })
        this.refreshCharacterCount()

        this.editor.selection.on('changeCursor', ()=>{
            this.refreshPositionHint()
        })
        this.refreshPositionHint()

        this.addEditorControls()

        editor.registerEditor(this, this.name())

        viewable.onGainFocus(()=>{
            editor.setActiveEditor(this.name())
        })

        let tempFunc = this.refreshSize        
        this.refreshSize = ()=>{
            tempFunc.call(this)
            this.editor.resize()
        }
    }

    name(){
        return this.dom.attr('code-field')
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
                if(this.dom.hasClass('fullscreen')){
                    this.leaveFullscreen()
                }
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
        
        this.viewable.dom.find('.charactercount').html(chars + '/4096')
        if(chars >= 4096){
             this.viewable.dom.find('.charactercount').addClass('limit')
        } else {
             this.dom.find('.charactercount').removeClass('limit')
        }
    }

    refreshPositionHint(){
        let pos = this.editor.getCursorPosition()
        let chars = this.editor.session.doc.positionToIndex(pos)
        
        this.viewable.dom.find('.selection-information').html('Line ' + (pos.row + 1) + ', Column ' + (pos.column + 1) + ', Char ' + chars)
    }

    countCharacters(str){
        return typeof str === 'string' ? str.length : 0
    }
}

Editors = []

editor = (()=>{
    "use strict";

    let editors = {}
    let activeEditor

    const DEFAULT_EDITOR_FONTSIZE = 12

    loader.on(loader.EVENT.UI_READY, init)

    function init(){
        refreshEditorFontSize()

        loader.done(loader.EVENT.EDITORS_READY)
    }

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



