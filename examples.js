var EXAMPLES = ((global, $)=>{
  "use strict";

    const CHAPTERS = [{
        title: 'Lua Basics',
        examples: [{
            title: 'Values and Types',
            contents: [{
                type: 'text',
                content: 'The type of a variable is set automatically depending on the value.\nPossible types are: nil, boolean, number, string, function, table.\nnil can only be nil'
            },{
                type: 'code',
                content: 'variable = nil'
            },{
                type: 'text',
                content: 'booleans can be either true or false'
            },{
                type: 'code',
                content: 'variable = true\nvariable = false'
            },{
                type: 'text',
                content: 'numbers can be any numeric value (including floats)'
            },{
                type: 'code',
                content: 'variable = 0\nvariable = -123456789\nvariable = 0.6666'
            },{
                type: 'text',
                content: 'strings are empty strings, one or more characters.'
            },{
                type: 'code',
                content: 'variable = ""\nvariable = "Hello World!"\nvariable = "this is a quote: \\" "'
            },{
                type: 'text',
                content: 'functions are like a small programm you can execute. They can return a value but dont have to.'
            },{
                type: 'code',
                content: 'function textLength(text)\n    return text.length\nend\n\n\nvariable = textLength("abc")\n-- variable is now 3'
            },{
                type: 'text',
                content: 'tables are arrays or key -> value maps.'
            },{
                type: 'code',
                content: 'variable = {"a", "b"}\n-- variable[1] is "a"\n\nvariable = {a="hello", b="goodbye"}\n-- variable["a"] is "hello"\n-- variable.a is "hello"'
            }]
        },{
            title: 'Functions',
            contents: [{
                type: 'text',
                content: 'Coming soon.'
            }]
        }]
    },{
        title: 'Stormworks API',
        examples: [{
            title: 'onTick / onDraw',
            contents: [{
                type: 'text',
                content: 'Coming soon...'
            }]
        },{
            title: 'input, output, property',
            contents: [{
                type: 'text',
                content: 'Coming soon...'
            }]
        },{
            title: 'Draw stuff onto the screen',
            contents: [{
                type: 'text',
                content: 'Coming soon...'
            }]
        },{
            title: 'Touchscreen',
            contents: [{
                type: 'text',
                content: 'Coming soon...'
            }]
        }]
    },{
        title: 'Advanced Stuff',
        examples: [{
            title: 'Trigonometry (2D and 3D calculations)',
            contents: [{
                type: 'text',
                content: 'Coming soon...'
            }]
        },{
            title: 'Randomness',
            contents: [{
                type: 'text',
                content: 'Coming soon...'
            }]
        }]
    }]


    $(global).on('load', init)

    function init(){

        $('#learn-badge').on('click', ()=>{
            $('#editor-bottom-container').addClass('show_examples')
        })

        $('#examples-heading .close').on('click', ()=>{
            $('#editor-bottom-container').removeClass('show_examples')
        })

        for(let ch of CHAPTERS){
            let chapter = $('<div class="chapter"><div class="chapter_head"><div class="chapter_title">' + ch.title + '</div></div><div class="chapter_body"></div></div>')
            for(let ex of ch.examples){
                let example = $('<div class="example"><div class="example_head"><div class="example_title">' + ex.title + '</div></div><div class="example_body"></div></div>')
                for(let co of ex.contents){
                    let c
                    switch(co.type){
                        case 'text': {
                            c = $('<p class="example_text">' + co.content + '</p>')
                        }; break;
                        case 'code': {
                            c = $('<div class="example_code">' + co.content + '</div>')

                            let editor = ace.edit(c.get(0),{
                                maxLines: 50
                            });
                            editor.setTheme("ace/theme/monokai");
                            editor.session.setMode("ace/mode/lua");
                            editor.setReadOnly(true)
                        }; break;
                        default: {
                            c = $('<div style="background: red; color: white">Unknown content type "' + co.type + '"</div>')
                        }
                    }
                    example.find('.example_body').append(c)
                }
                example.find('.example_head').on('click', ()=>{
                    let wasopen = false
                    if(example.hasClass('open')){
                        wasopen = true
                    }
                    $('#examples .example.open').removeClass('open')
                    if(!wasopen){
                        example.addClass('open')
                    }
                    
                    $('#examples').animate({
                        scrollTop: (example.offset().top - 30 - $('#examples').offset().top)
                    }, 200);
                })

                chapter.find('.chapter_body').append(example)
            }

            chapter.find('.chapter_head').on('click', ()=>{
                let wasopen = false
                    if(chapter.hasClass('open')){
                        wasopen = true
                    }
                    $('#examples .chapter.open').removeClass('open')
                    if(!wasopen){
                        chapter.addClass('open')
                    }

                    $('#examples').animate({
                        scrollTop: (chapter.offset().top - 30 - $('#examples').offset().top)
                    }, 200);
            })

            $('#examples').append(chapter)
        }
    }
    
    return {
    }

})(window, jQuery)
