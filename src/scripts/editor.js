
EDITOR_KEYWORD_MANAGER = (()=>{
    "use strict";

    const keywordHandlers = []

    LOADER.on(LOADER.EVENT.PAGE_READY, init)

    function init(){
        ace.require('ace/mode/text_highlight_rules').TextHighlightRules.prototype.createKeywordMapper = function(map, defaultToken, ignoreCase, splitChar){
            // all default lua keywords
            registerKeywordHandler(
                (()=>{
                    let keywords = this.$keywords = Object.create(null);
                    Object.keys(map).forEach(function(className) {
                        let a = map[className];
                        if (ignoreCase)
                            a = a.toLowerCase();
                        let list = a.split(splitChar || "|");
                        for (let i = list.length; i--; )
                            keywords[list[i]] = className;
                    });
                    if (Object.getPrototypeOf(keywords)) {
                        keywords.__proto__ = null;
                    }
                    this.$keywordList = Object.keys(keywords);
                    map = null;

                    return function(value) {return keywords[value]};
                })()
            )


            // call handlers
             return ignoreCase
                    ? function(value) {return handleKeywordSearch(value.toLowerCase()) || defaultToken; }
                    : function(value) {return handleKeywordSearch(value) || defaultToken; };
        }

        /* check for keywords in documentation */
        registerKeywordHandler(value => {
            return checkNode(DOCUMENTATION.getRaw())

            function checkNode(node, lib){

                if(node.children){

                    if(node.lib){
                        lib = node.lib
                        if(lib === 'lua'){
                            return //skip and ignore default lua keywords
                        }
                    }

                    for(let k of Object.keys(node.children)){
                        if(k === value){
                            if(node.children[k].lib){
                                lib = node.children[k].lib
                            }
                            switch(lib){
                                case 'stormworks': {
                                    return 'keyword_stormworks'
                                }; break;
                                case 'dev': {
                                    return 'keyword_dev'
                                }; break;
                            }
                        } else {
                            let ret = checkNode(node.children[k], lib)
                            if(ret){
                                return ret
                            }
                        }
                    }
                }
            }
        })
    }

    function handleKeywordSearch(keyword){
        for(let handler of keywordHandlers){
            let ret = handler(keyword)
            if(ret){
                return ret
            }
        }
    }


    /* markup is dot seperated classes. Example: "test.me" will result in <span class="ace_test ace_me"> */
    function addKeyword(name, markup){
        EDITORS.getActiveEditor().editor.session.$mode.$highlightRules.$keywords[name] = markup
    }

    function registerKeywordHandler(callback){
        if(typeof callback !== 'function'){
            throw new Error('callback must be a function')
        }

        keywordHandlers.push(callback)
    }

    return {
        registerKeywordHandler: registerKeywordHandler
    }

})()

class Editor extends DynamicSizedViewableContent {
    constructor(container, viewable){
        super(container, viewable)

        this.editor = ace.edit(this.dom.get(0))
        this.editor.setTheme("ace/theme/pony_ide")
        this.editor.session.setMode("ace/mode/lua")
        this.editor.session.setUseSoftTabs(false)
        this.editor.setOption('wrap', true)

        this.dom.append( $('<div class="code_lock">') )
        this.dom.append( $('<div class="autocompletion_container">') )

        this.autocomplete = new Autocomplete(this.editor, this.dom)

        this.oldHeight = 0

        this.lastEditorChange = new Date().getTime()
        this.lastEditorChangeChecked = false
        
        this.editor.on('change', ()=>{
            this.refreshCharacterCount()
            this.editor.getSession().setAnnotations([])

            this.lastEditorChange = new Date().getTime()
            this.lastEditorChangeChecked = false
        })
        this.refreshCharacterCount()

        let that = this
        this.syntaxCheckInterval = setInterval(()=>{
            let now = new Date().getTime()
            if(now - that.lastEditorChange > 500 && that.lastEditorChangeChecked === false){
                that.lastEditorChangeChecked = true

                that.performSyntaxCheck()
            }
        }, 200)

        this.editor.selection.on('changeCursor', ()=>{
            this.refreshPositionHint()
        })
        this.refreshPositionHint()

        this.addEditorControls()

        EDITORS.registerEditor(this, this.name())

        viewable.onGainFocus(()=>{
            EDITORS.setActiveEditor(this.name())
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
            EDITORS.decreaseEditorFontSize()
        })            
        this.dom.append(fontMinus)


        let fontPlus = $('<span class="font_plus icon-plus"></span>')
        fontPlus.on('click', ()=>{
            EDITORS.increaseEditorFontSize()
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
        
        let max = STORAGE.getConfiguration('settings.servermode') ? 131071 : 4096

        this.viewable.dom.find('.charactercount').text(chars + '/' + max)
        if(chars >= max){
             this.viewable.dom.find('.charactercount').addClass('limit')
        } else {
             this.viewable.dom.find('.charactercount').removeClass('limit')
        }
    }

    refreshPositionHint(){
        let pos = this.editor.getCursorPosition()
        let chars = this.editor.session.doc.positionToIndex(pos)
        
        this.viewable.dom.find('.selection-information').text('Line ' + (pos.row + 1) + ', Column ' + (pos.column + 1) + ', Char ' + chars)
    }

    countCharacters(str){
        return typeof str === 'string' ? str.length : 0
    }

    markError(line, text, goto){
        this.editor.getSession().setAnnotations([{
          row: line-1,
          column: 0,
          text: text, 
          type: "error"
        }])
        if(goto){
            this.editor.gotoLine(line, 0, true)
        }
    }

    unmarkError(){
        this.editor.getSession().setAnnotations([])
    }    

    performSyntaxCheck(){
        try {
            let ast = luaparse.parse(this.editor.getValue())
            this.unmarkError()
        } catch (ex) {
            this.markError(ex.line, ex.message)
        }
    }

    forceRefresh(){
        this.editor.setValue(this.editor.getValue())
    }
}

EDITORS = (()=>{
    "use strict";

    let editors = {}
    let activeEditor

    const DEFAULT_EDITOR_FONTSIZE = 12

    LOADER.on(LOADER.EVENT.UI_READY, init)

    function init(){
        refreshEditorFontSize()

        LOADER.done(LOADER.EVENT.EDITORS_READY)
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
        return STORAGE.getConfiguration('editorFontSize')
    }

    function saveEditorFontSize(fontsize){
        STORAGE.setConfiguration('editorFontSize', fontsize)
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

    function resize(){
        for(let e of Object.keys(editors)){
            editors[e].refreshSize()
        }
    }

    function refreshCharacterCounts(){
        for(let e of Object.keys(editors)){
            editors[e].refreshCharacterCount()
        }
    }

    function resetErrorMarkers(){
        for(let e of Object.keys(editors)){
            editors[e].unmarkError()
        }
    }

    function forceRefresh(){
        for(let e of Object.keys(editors)){
            editors[e].forceRefresh()
        }
    }

    return {
        registerEditor: registerEditor,
        setActiveEditor: setActiveEditor,
        getActiveEditor: ()=>{return editors[activeEditor]},
        get: (name)=>{return editors[name]},
        resize: resize,
        refreshCharacterCounts: refreshCharacterCounts,
        increaseEditorFontSize: increaseEditorFontSize,
        decreaseEditorFontSize: decreaseEditorFontSize,
        resetErrorMarkers: resetErrorMarkers,
        forceRefresh: forceRefresh
    }
})()



