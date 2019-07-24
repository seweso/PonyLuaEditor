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
                content: 'To create random numbers you can use the "math.random()" functions.\nThe random numbers are distributed uniformly (which means each number will be generated in about the same amount as every other number over a couple of calls)\nThere are three options to call the function:\n<ul><li>math.random()    returns a number between 0 and 1</li><li>math.random(x)    returns a whole number between 1 and x (both inclusive)</li><li>math.random(x, y)    returns a whole number between x and y both inclusive)</li></ul>'
            },{
                type: 'text',
                content: 'In this example we will call math.random() multiple times and draw the distribution as a graph\nHINT: Input channel 1 is how often random is called for value entry in the graph.\ne.g. random is called 100 times and 53 times the result is 0, then the 0-graph (color red) will be at 53% of the screen height, while the result is only 47 times a 1, that means the 1-graph (green color) is only 47% of the screens height.'
            },{
                type: 'code',
                content: 'results = {}\n\ncolors = {{255,0,0}, {0,255,0}, {0,0,255}, {255, 255, 0}, {0, 255, 255}, {255, 0, 255}} -- colors for the \n\nmin = 0 -- minimum of math.random()\nmax = 2 -- maximum of math.random() ADD MORE COLORS IF VALUE IS ABOVE 5!!!!\n\nframeCounter = 0\ncallsPerFrame = 15 -- how often math.random is called per pixel in the graph\n\nfunction onTick()\n   callsPerFrame = input.getNumber(1)\nend\n\nfunction createRandoms()\n   -- setup results table\n    results[frameCounter] = {cpf=callsPerFrame}\n   for i=min, max do\n     results[frameCounter][i] = 0\n  end\n   -- generate random results\n    for i=1, callsPerFrame do\n     rand = math.random(min, max)\n      results[frameCounter][rand] = results[frameCounter][rand] + 1\n end\nend\n\nfunction onDraw()\n print("creating randoms for frame "..frameCounter)\n    createRandoms()\n   \n  -- draw graph\n for i=frameCounter-screen.getWidth(), frameCounter-1 do\n       if i >= 0 and i - frameCounter + screen.getWidth() >= 15 then\n         for r=min, max do\n             value = results[i][r] / results[i]["cpf"]\n             valueAfter = results[i+1][r] / results[i+1]["cpf"]\n                screen.setColor(colors[r+1][1], colors[r+1][2], colors[r+1][3])\n               screen.drawLine(i - frameCounter + screen.getWidth(), screen.getHeight() * (1 - value), i + 1 - frameCounter + screen.getWidth(), screen.getHeight() * (1 - valueAfter))\n          end\n       end\n   end\n   screen.setColor(255, 255, 255)\n    screen.drawText(1, screen.getHeight()*(1-0.75), "75%")\n    screen.drawText(1, screen.getHeight()*(1-0.5), "50%")\n screen.drawText(1, screen.getHeight()*(1-0.25), "25%")\n    \n  frameCounter = frameCounter + 1\nend\n'
            },{
                type: 'text',
                content: 'as you can see: the more often we call math.random() the more even the distribution of 1\'s and 0\'s get. Can be seen because both graphs are close to 50%.'
            },{
                type: 'text',
                content: 'Experiment with more then two possible random numbers by changing "max", BUT DONT GO OVER 5!'
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
        },{
            title: 'Flight Instruments - Altimeter',
            contents: [{
                type: 'text',
                content: 'An instrument showing the altitude (meter or feet).'
            },{
                type: 'text',
                content: 'The most important function is "rotatePoint()". It rotates an xy coordinate around another coordinate.'
            },{
                type: 'code',
                content: 'height = 0\nwidth = 0\ncenterX = 0\ncenterY = 0\n\naltitude = 0\n\nunitAsFeet = false -- set to true to have units in feet\n\nfunction onTick()\n	altitude = input.getNumber(1)\n	if unitAsFeet then\n		altitude = altitude * 3.28084\n	end\nend\n\nfunction onDraw()\n	height = screen.getHeight()\n	width = screen.getWidth()\n	\n	min = math.min(height, width)\n	centerX = min/2\n	centerY = min/2\n	height = min - 2\n	width = min - 2\n	\n	-- draw lines grey\n	screen.setColor(30, 30, 30)\n	for i=0, math.pi*2, math.pi/15 do\n		p1 = rotatePoint(centerX, centerY, i, centerX, centerY+height/2)\n		p2 = rotatePoint(centerX, centerY, i, centerX, centerY+height/2.2)\n		screen.drawLine(p1.x, p1.y, p2.x, p2.y)\n	end\n	\n	-- draw lines white\n	screen.setColor(255, 255, 255)\n	for i=math.pi+0.01, math.pi*3, math.pi/5 do\n		p1 = rotatePoint(centerX, centerY, i, centerX, centerY+height/2)\n		p2 = rotatePoint(centerX, centerY, i, centerX, centerY+height/2.2)\n		screen.drawLine(p1.x, p1.y, p2.x, p2.y) \n	end\n	\n	-- draw numbers\n	counter = 0\n	for i=math.pi+0.01, math.pi*3, math.pi/5 do\n		p = rotatePoint(centerX, centerY, i, centerX, centerY+height/2.9)\n		screen.drawText(p.x-2, p.y-3, counter)\n		counter = counter+1\n	end\n	\n	-- draw inner circle\n	screen.drawCircle(centerX, centerY, width/4.5)\n	\n	-- draw 10.000m pointer\n	p10000 = altitude/10000\n	p = rotatePoint(centerX, centerY, math.pi + math.pi/5 * p10000, centerX, centerY+height/2.1)\n	screen.setColor(255,0,0)\n	screen.drawLine(centerX, centerY, p.x, p.y)\n	\n	-- draw 1000m pointer\n	p1000 = (altitude%10000)/1000\n	p = rotatePoint(centerX, centerY, math.pi + math.pi/5 * p1000, centerX, centerY+height/4.8)\n	screen.setColor(0,255,0)\n	screen.drawLine(centerX, centerY, p.x, p.y)\n	\n	-- draw 100m pointer\n	p100 = (altitude%1000)/100\n	p = rotatePoint(centerX, centerY, math.pi + math.pi/5 * p100, centerX, centerY+height/3)\n	screen.setColor(0,0,255)\n	screen.drawLine(centerX, centerY, p.x, p.y)\nend\n\nfunction rotatePoint(cx, cy, angle, px, py)\n	s = math.sin(angle);\n	c = math.cos(angle);\n\n	--translate point back to origin:\n	px = px - cx;\n	py = py - cy;\n\n	-- rotate point\n	xnew = px * c - py * s;\n	ynew = px * s + py * c;\n\n	-- translate point back:\n	px = xnew + cx;\n	py = ynew + cy;\n	return {x=px, y=py}\nend\n'
            },{
                type: 'text',
                content: 'The red line is the x10000 meter/feet value, the green line is the x1000 meter/feet value, the blue line is the x100 meter/feet value.\nHow to read the current altitude:\nred value x 10000 + green value x 1000 + blue value x 100'
            }]
        },{
            title: 'Flight Instruments - Airspeed',
            contents: [{
                type: 'text',
                content: 'An instrument showing the speed (m/s, km/h or mph).'
            },{
                type: 'text',
                content: 'The function "rotatePoint()" rotates an xy coordinate around another coordinate.\nThe function "clear" draws black triangles to create the arcs.'
            },{
                type: 'code',
                content: 'height = 0\nwidth = 0\ncenterX = 0\ncenterY = 0\n\nspeed = 0\n\nflapsDownStallSpeed = 40 -- bottom of white arc\nflapsUpStallSpeed = 50 -- bottom of green arc\nmaxFlapsExtendSpeed = 80 -- top of white arc\nmaxStructuralCruisingSpeed = 130 -- top of green arc\nneverExceedSpeed = 160 -- top of yellow arc\n\nspeedForWholeCircle = 250\n\nunit = "m/s" -- set to "m/s", "km/h" or "mph"\n\nfunction onTick()\n	speed = input.getNumber(1)\n	if unit == "km/h" then\n		unit = unit * 3.6\n	elseif unit == "mph" then\n		unit = unit * 2.23694\n	end\nend\n\nfunction onDraw()\n	height = screen.getHeight()\n	width = screen.getWidth()\n	\n	min = math.min(height, width)\n	centerX = min/2\n	centerY = min/2\n	height = min - 2\n	width = min - 2\n	\n	\n	-- draw white arc\n	screen.setColor(255,255,255)\n	screen.drawCircleF(centerX, centerY, width/2.2)\n	screen.setColor(0,0,0)\n	screen.drawCircleF(centerX, centerY, width/2.4)\n	\n	clear(math.pi + (maxFlapsExtendSpeed/speedForWholeCircle)*math.pi*2, math.pi + (flapsDownStallSpeed/speedForWholeCircle)*math.pi*2, width)\n	\n	-- draw green arc\n	screen.setColor(0,200,0)\n	screen.drawCircleF(centerX, centerY, width/2.4)\n	screen.setColor(0,0,0)\n	screen.drawCircleF(centerX, centerY, width/2.6)\n	\n	clear(math.pi + (maxStructuralCruisingSpeed/speedForWholeCircle)*math.pi*2, math.pi + (flapsUpStallSpeed/speedForWholeCircle)*math.pi*2, width/1.068) -- for 2x2 screens use width/1.068, for 1x1 screens use width/1.04\n	\n	-- draw yellow arc\n	screen.setColor(200,200,0)\n	screen.drawCircleF(centerX, centerY, width/2.6)\n	screen.setColor(0,0,0)\n	screen.drawCircleF(centerX, centerY, width/2.8)\n	\n	clear(math.pi + (neverExceedSpeed/speedForWholeCircle)*math.pi*2, math.pi + (maxStructuralCruisingSpeed/speedForWholeCircle)*math.pi*2, width/1.105) -- for 2x2 screens use width/1.105, for 1x1 screens use width/1.08\n	\n	\n	-- draw grey lines\n	screen.setColor(50, 50, 50)\n	for i=flapsDownStallSpeed, speedForWholeCircle-flapsDownStallSpeed, speedForWholeCircle/20 do\n		p1 = rotatePoint(centerX, centerY, math.pi + i/speedForWholeCircle * math.pi * 2, centerX, centerY+height/2.5)\n		p2 = rotatePoint(centerX, centerY, math.pi + i/speedForWholeCircle * math.pi * 2, centerX, centerY+height/2.1)\n		screen.drawLine(p1.x, p1.y, p2.x, p2.y)\n	end\n	\n	-- draw numbers\n	screen.setColor(255, 255, 255)\n	for i=flapsDownStallSpeed, speedForWholeCircle-flapsDownStallSpeed, speedForWholeCircle/10 do\n		label = math.floor(i)\n		p = rotatePoint(centerX, centerY, math.pi + i/speedForWholeCircle * math.pi * 2, centerX, centerY+height/3.4)\n		screen.drawText(p.x - string.len(label)*1.5, p.y-4, label)\n		\n		-- draw white line\n		p1 = rotatePoint(centerX, centerY, math.pi + i/speedForWholeCircle * math.pi * 2, centerX, centerY+height/2.6)\n		p2 = rotatePoint(centerX, centerY, math.pi + i/speedForWholeCircle * math.pi * 2, centerX, centerY+height/2.1)\n		screen.drawLine(p1.x, p1.y, p2.x, p2.y)\n	end\n	\n	\n	screen.setColor(255,255,255)\n	screen.drawTextBox(centerX - width/2, centerY - height/2, width, height/4, "Airspeed", 0, 0)\n	\n	-- draw pointer\n	p = rotatePoint(centerX, centerY, math.pi + speed / speedForWholeCircle * math.pi *2, centerX, centerY+height/2.1)\n	screen.setColor(255,255,255)\n	screen.drawLine(centerX, centerY, p.x, p.y)\nend\n\nstep = math.pi/18\nfunction clear(fromAngle, toAngle, y)\n	print("clear", fromAngle, toAngle,y)\n	fromAngle = fromAngle % (math.pi*2)\n	toAngle = toAngle % (math.pi*2)\n	print("clear", fromAngle, toAngle,y)\n	angle = fromAngle\n	while angle < toAngle-step or angle > toAngle do\n		p1 = rotatePoint(centerX, centerY, angle-step/10, centerX, y)\n		p2 = rotatePoint(centerX, centerY, angle+step+step/10, centerX, y)\n		screen.setColor(0,0,0)\n		screen.drawTriangleF(centerX, centerY, p1.x, p1.y, p2.x, p2.y)\n		\n		angle = angle + step\n		if angle >= math.pi*2 then\n			angle = 0\n		end\n	end\nend\n\nfunction rotatePoint(cx, cy, angle, px, py)\n	s = math.sin(angle);\n	c = math.cos(angle);\n\n	--translate point back to origin:\n	px = px - cx;\n	py = py - cy;\n\n	-- rotate point\n	xnew = px * c - py * s;\n	ynew = px * s + py * c;\n\n	-- translate point back:\n	px = xnew + cx;\n	py = ynew + cy;\n	return {x=px, y=py}\nend\n'
            },{
                type: 'text',
                content: 'The white area is the speed you can fly with flaps down.\nThe green area is the speed you can fly with flaps up.\nThe yellow area is emergency speed, exceeding this speed will result in structural damage of the plane.\n\nAll the speeds for these areas can be set in the code.'
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
