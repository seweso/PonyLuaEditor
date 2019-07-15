var EXAMPLES = ((global, $)=>{
  "use strict";

    const CHAPTERS = [{
        title: 'Lua Basics (Learn)',
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
                content: 'function textLength(text)\n	return text.length\nend\n\n\nvariable = textLength("abc")\n-- variable is now 3'
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
        title: 'Stormworks API (Learn)',
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
                content: 'The composite output from the monitors contains data that can be interpreted in your script to create touchscreens. The layout of the composite data is as follows:'
            },{
                type: 'text',
                content: '<b>Number Channels</b><ol><li>monitorResolutionX</li><li>monitorResolutionY</li><li>input1X</li><li>input1Y</li><li>input2X</li><li>input2Y</li></ol>'
            },{
                type: 'text',
                content: '<b>On/Off Channels</b><ol><li>isInput1Pressed</li><li>isInput2Pressed</li></ol>'
            },{
                type: 'text',
                content: 'Hint: As long as an input is pressed the x and y coordinated will not change! This means you cannot implement drag functionality!'
            }]
        }]
    },{
        title: 'Advanced Stuff (Learn)',
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
    },{
        title: 'Examples',
        examples: [{
            title: 'Touchscreen - Draw circle where player klicks',
            contents: [{
                type: 'text',
                content: 'A monitor has a composite output. When you connect that output to the lua script input you can read out interactions from the user.'
            },{
                type: 'code',
                content: 'function onTick()\n	isPressed1 = input.getBool(1)\n	isPressed2 = input.getBool(2)\n	\n	screenWidth = input.getNumber(1)\n	screenHeight = input.getNumber(2)\n	\n	input1X = input.getNumber(3)\n	input1Y = input.getNumber(4)\n	input2X = input.getNumber(5)\n	input2Y = input.getNumber(6)\nend    \n	    \nfunction onDraw()\n	if isPressed1 then\n	    screen.setColor(0, 255, 0)\n	    screen.drawCircleF(input1X, input1Y, 4)\n	end\n	\n	if isPressed2 then\n	    screen.setColor(255, 0, 0)\n	    screen.drawCircleF(input2X, input2Y, 4)\n	end\n	\n	if isPressed1 and isPressed2 then\n	    screen.setColor(0, 0, 255)\n	    screen.drawLine(input1X, input1Y, input2X, input2Y)\n	end\nend\n'
            },{
                type: 'text',
                content: 'It will draw a green circle at the position of the first press and a red circle at the position of the second press.\nIf both keys are pressed it will also draw a line between the red and green circle.'
            }]
        },{
            title: 'Touchscreen - Button Push and Toggle',
            contents: [{
                type: 'text',
                content: 'A monitor has a composite output. When you connect that output to the lua script input you can read out interactions from the user.'
            },{
                type: 'text',
                content: 'We need to define a hitbox and check if the player press is in that hitbox. Then we can set the buttons state. In the draw function we colorize the button depending on its state.\nIf the player now clicks on that hitbox (either with q or with e) it will push the button.'
            },{
                type: 'code',
                content: 'buttonX = 0\nbuttonY = 0\nbuttonWidth = 12\nbuttonHeight = 6\nbuttonActive = false\n\n\nfunction onTick()\n	isPressed1 = input.getBool(1)\n	isPressed2 = input.getBool(2)\n	\n	screenWidth = input.getNumber(1)\n	screenHeight = input.getNumber(2)\n	\n	input1X = input.getNumber(3)\n	input1Y = input.getNumber(4)\n	input2X = input.getNumber(5)\n	input2Y = input.getNumber(6)\n	\n	if isPressed1 and input1X >= buttonX and input1X <= buttonX + buttonWidth and input1Y >= buttonY and input1Y <= buttonY + buttonHeight then\n	    buttonActive = true\n	elseif isPressed2 and input2X >= buttonX and input2X <= buttonX + buttonWidth and input2Y >= buttonY and input2Y <= buttonY + buttonHeight then\n	    buttonActive = true\n	else\n	    buttonActive = false\n	end\n	\n	output.setBool(1, buttonActive)\nend    \n	    \nfunction onDraw()\n	if buttonActive then\n	   screen.setColor(0,150,0) \n	else\n	   screen.setColor(10,10,10) \n	end\n	screen.drawRectF(buttonX, buttonY, buttonWidth, buttonHeight)\nend\n'
            },{
                type: 'text',
                content: 'The button will light up green and the output channel 1 will be true when its active.'
            },{
                type: 'text',
                content: 'A toggle button (supporting e and q) is a little bit different:'
            },{
                type: 'code',
                content: 'buttonX = 0\nbuttonY = 0\nbuttonWidth = 12\nbuttonHeight = 6\nbuttonActive = false\n\nwasButton1Pressed = false\nwasButton2Pressed = false\n\nfunction onTick()\n	isPressed1 = input.getBool(1)\n	isPressed2 = input.getBool(2)\n	\n	screenWidth = input.getNumber(1)\n	screenHeight = input.getNumber(2)\n	\n	input1X = input.getNumber(3)\n	input1Y = input.getNumber(4)\n	input2X = input.getNumber(5)\n	input2Y = input.getNumber(6)\n	\n	if isPressed1 and input1X >= buttonX and input1X <= buttonX + buttonWidth and input1Y >= buttonY and input1Y <= buttonY + buttonHeight then\n	    wasButton1Pressed = true\n	elseif isPressed2 and input2X >= buttonX and input2X <= buttonX + buttonWidth and input2Y >= buttonY and input2Y <= buttonY + buttonHeight then\n	    wasButton2Pressed = true\n	end\n	\n	if not isPressed1 and wasButton1Pressed then\n	    wasButton1Pressed = false\n	    buttonActive = not buttonActive\n	end\n	\n	if not isPressed2 and wasButton2Pressed then\n	    wasButton2Pressed = false\n	    buttonActive = not buttonActive\n	end\n	\n	output.setBool(1, buttonActive)\nend    \n	    \nfunction onDraw()\n	if buttonActive then\n	   screen.setColor(0,150,0) \n	else\n	   screen.setColor(10,10,10) \n	end\n	screen.drawRectF(buttonX, buttonY, buttonWidth, buttonHeight)\nend\n'
            }]
        }]
    },{
        title: 'Information from the Stormworks developers',
        examples: [{
            title: 'Meta from the devs',
            contents: [{
                type: 'text',
                content: 'This scripting API is very powerful and as such there are some important reminders to take note of:'
            },{
                type: 'text',
                content: '<ul><li>Your script has a max execution time of 1000 milliseconds, however it is still possible to create scripts that significantly slow down the game. It is your responsibility to ensure your script runs efficiently.</li><li>Random number functions are provided by the Lua math library. Use of randomness in your scripts is likey to cause desync in multiplayer, so use these functions at your own risk</li><li>When your vehicle despawns and respawns, your script will be executed "fresh" and any state stored within the script will be lost. We recommend keeping your script as stateless as possible, and making use of existing logic components (e.g. memory register) to store values that you with to persist</li><li>Your scripts run as a "black box" with only the logic inputs/outputs being synced in multiplayer. Keep in mind that complex logic in your script may behave differently for different players in a multiplayer session.</li><li>A number of safeguards are in place to sandbox your script, however it is still possible to write scripts that will potentially crash your game. If you crash your game with a script it\'s likely that you\'re doing something (very) wrong. This is your own responsibility. If you suspect you have encountered a legitimate bug, please report it on the Stormworks issue tracker (accessible from the pause-menu).</li><li>Malicious and harmful scripts will not be tolerated on the Stormworks Steam Workshop</li></ul>'
            }]
        }]
    }]


    $(global).on('load', init)

    function init(){

        $('#learn-badge, #learn-menu-entry').on('click', ()=>{
            $('#editor-bottom-container').addClass('show_examples')

            $('html, body').animate({
                scrollTop: ($('#editor-bottom-container').offset().top - $(window).height()/5)
            }, 200);            
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
                            c = $('<div class="example_text">' + co.content + '</div>')
                        }; break;
                        case 'code': {
                            c = $('<div class="example_code">' + co.content + '</div>')

                            let editor = ace.edit(c.get(0),{
                                maxLines: 50
                            });
                            editor.setTheme("ace/theme/monokai");
                            editor.session.setMode("ace/mode/lua");
                            editor.session.setUseSoftTabs(false); 
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
