var EXAMPLES = (($)=>{
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
                content: 'functions are variables too. Read more about functions later!'
            },{
                type: 'code',
                content: 'function func()\n	return "hello"\nend'
            },{
                type: 'text',
                content: 'tables are arrays or key -> value maps.'
            },{
                type: 'code',
                content: 'variable = {"a", "b"}\n-- variable[1] is "a"\n\nvariable = {a="hello", b="goodbye"}\n-- variable["a"] is "hello"\n-- variable.a is "hello"'
            }]
        },{
            title: 'Conditions if/else and expressions',
            contents: [{
                type: 'text',
                content: 'This is used to execute different code depending on a condition. Any variable or expression can be used as a condition:'
            },{
                type: 'code',
                content: 'if condition then\n    -- execute if condition is true\nelse\n    -- execute if condition is false\nend'
            },{
                type: 'text',
                content: 'Conditions / Expressions:'
            },{
                type: 'code',
                content: 'true --> true'
            },{
                type: 'code',
                content: '1 > 2 --> false'
            },{
                type: 'code',
                content: '1 < 2 => true -- less than'
            },{
                type: 'code',
                content: '2 == 2 => true -- equal'
            },{
                type: 'code',
                content: '3 >= 2 => true -- greater or equal'
            },{
                type: 'code',
                content: '3 <= 2 => false -- less or equal'
            },{
                type: 'code',
                content: 'nil => false -- nil equals to false, anything else (tables, numbers, string) ALWAYS equal true'
            },{
                type: 'code',
                content: '{} => true'
            },{
                type: 'code',
                content: '-1 => true'
            },{
                type: 'code',
                content: '"" => true'
            },{
                type: 'text',
                content: 'you can combine expressions with the keywords "not", "and", "or"'
            },{
                type: 'code',
                content: 'false or true => true'
            },{
                type: 'code',
                content: 'false and true => false'
            },{
                type: 'code',
                content: 'not true = false'
            },{
                type: 'code',
                content: '(false or true) and true => false'
            },{
                type: 'code',
                content: '(false and true) or (true and true) => true'
            },{
                type: 'text',
                content: 'Example:'
            },{
                type: 'code',
                content: 'a = 4\nif a <= 3 then\n    print("number less then or equal 3")\nelse\n    print("number greater then 3")\nend'
            }]
        },{
            title: 'Functions',
            contents: [{
                type: 'text',
                content: 'Functions are small programs inside your main program. They are usefull when you do similar things multiple times. Functions can return a value but they do not have to. They can also accept arguments.'
            },{
                type: 'code',
                content: 'varA = 5 .. "% battery"\nvarB = 10 .. "% battery"'
            },{
                type: 'text',
                content: 'This can be replaced with a function (in this case we do not save characters, but our code is easier to maintain which i will explain below)'
            },{
                type: 'code',
                content: 'varA = makeBatteryString(5)\nvarB = makeBatteryString(10)\n\nfunction makeBatteryString(percent)\n	return percent .."% battery"\nend'
            },{
                type: 'text',
                content: 'When you now want to change the string "battery" to "Bat." there is only one place where you have to change the code.\n\nIn this example our code got quite big, but in most cases, using functions will make your code shorter (see example bellow).'
            },{
                type: 'code',
                content: '-- long and ugly:\nscreen.setColor(1,1,1)\nscreen.drawRect(1,2,3,4)\nscreen.setColor(2,2,2)\nscreen.drawRect(5,6,7,8)\nscreen.setColor(3,3,3)\nscreen.drawRect(9,10,11,12)\nscreen.setColor(4,4,4)\nscreen.drawRect(13,14,15,16)\n\n\n-- shorter and beautifull:\nsC(1,1,1)\nsR(1,2,3,4)\nsC(2,2,2)\nsR(5,6,7,8)\nsC(3,3,3)\nsR(9,10,11,12)sC(4,4,4)\nsR(13,14,15,16)\nfunction sC(r,g,b)\n	screen.setColor(r,g,b)\nend\n\nfunction sR(x,y,w,h)\n	screen.drawRect(x,y,w,h)\nend'
            }]
        },{
            title: 'Loops',
            contents: [{
                type: 'text',
                content: 'The "while" loop:'
            },{
                type: 'code',
                content: 'myTable = {true, true, true, false}\n\ni=1\nwhile i < 2 do -- as long as the i < 2 the loop will run, if that is not the case, the loop will exit.\n    -- this line is called twice\n\n    i = i + 1\nend\n-- i is now 2\n\n'
            },{
                type: 'text',
                content: 'Similar to the while loop is the "for" loop. It can do exactly the same (increment a number):'
            },{
                type: 'code',
                content: 'for i=1,2 do\n    -- this line is called twice\nend'
            },{
                type: 'text',
                content: 'You can manually set a step for the loop:'
            },{
                type: 'code',
                content: 'for i=1,2,0.5 do\n    -- this line is called 4 times\nend'
            },{
                type: 'text',
                content: 'And you can choose a different max, even negative (but dont forget to choose a negative step too).'
            },{
                type: 'code',
                content: 'for i=1,-5,-1 do\n    -- this line is called 7 times\nend'
            },{
                type: 'text',
                content: 'You can also loop over the entries of a table:'
            },{
                type: 'code',
                content: 'myTable = {"a","b","c"}\nfor k,v in ipairs(myTable) do\n    -- this line will be called 3 times:\n    -- 1. k=1, v="a"\n    -- 2. k=2, v="b"\n    -- 3. k=3, v="c"\nend'
            }]
        },{
            title: 'Scope',
            contents: [{
                type: 'text',
                content: 'In lua, every variable, function, ... can be <i>local</i> or <i>global</i>.\n<i>local</i> variables can only be used inside the same scope, global variables can be used everywhere. In Stormworks, locals are not important, because every lua script is standalone (sandboxed).'
            },{
                type: 'code',
                content: 'local a=1\nfunction test()  -- this function can access a\n	print(a)\nend\n\nlocal function test2()  -- this function can access a too\n	print(a)\nend\n\n'
            },{
                type: 'code',
                content: 'function test()  -- this function can access a\n	local a=1\n	print(a)\nend\n\nlocal function test2()  -- this function can NOT access a \n	print(a)  -- error\nend\n\n'
            },{
                type: 'text',
                content: 'Important: the onDraw() and onTick() function must be global!\n<i>local</i> variables and functions must be declared before they can be used:'
            },{
                type: 'code',
                content: 'local function a()\n	print("test")\nend\n\nfunction onDraw()\n	a()  -- works\nend'
            },{
                type: 'code',
                content: 'function onDraw()\n	a()  -- error: a not found\nend\n\nlocal function a()\n	...\nend'
            }]
        },{
            title: 'Formatting',
            contents: [{
                type: 'text',
                content: 'string.format() can be used to construct strings'
            },{
                type: 'code',
                content: 'string.format("%s %q", "Hello", "Lua user!")   -- string and quoted string   Hello "Lua user!"'
            },{
                type: 'text',
                content: 'it can also be used to convert numbers to numbers with a defined amount of decimals (e.g. 1.2345678 => 1.23)'
            },{
                type: 'code',
                content: 'string.format("%.2f", 1.23456789)  -- only print 2 decimals   1.23'
            },{
                type: 'text',
                content: 'It can also be used to construct strings'
            },{
                type: 'code',
                content: 'string.format("%o", -100)  -- octal   37777777634\nstring.format("%x", -100)  -- hexadecimal   ffffff9c\nstring.format("%X", -100)  -- hexadecimal   FFFFFF9C'
            }]
        }]
    },{
        title: 'Stormworks API (Learn)',
        examples: [{
            title: 'onTick / onDraw',
            contents: [{
                type: 'text',
                content: 'The onTick() <keyword>function</keyword> will be called everytime the games physics engine does a calculation. The calculation includes forces, electricity, movement and also logic states.\nUsually the function is being called 60 times a second. Everything that interacts with other logic components (input, output, property) must be calculated within this function! When the game pauses this function will not be called.'
            },{
                type: 'text',
                content: 'The onDraw() <keyword>function</keyword> is slightly different. It will also be called 60 times per second or less (that is your FPS). Everything related to "draw on screen" must be done inside this function. This function will still be called while the game is paused!'
            }]
        },{
            title: 'input, output, property',
            contents: [{
                type: 'text',
                content: 'The <obj>input</obj> object offers methods to read values from the composite connected to the lua script component.'
            },{
                type: 'code',
                content: '-- get number on composite channel 5\ninputChannel5 = input.getNumber(5)\n\n-- get boolean on composite channel 10\ninputChannel10 = input.getBool(10)'
            },{
                type: 'text',
                content: 'The <obj>output</obj> object offers methods to write values to the composite connected to the lua script component.'
            },{
                type: 'code',
                content: '-- set number on composite channel 5\nvalue = 42\noutput.setNumber(5, value)\n\n-- set boolean on composite channel 10\nvalue = true\noutput.setBool(10, value)'
            },{
                type: 'text',
                content: 'The <obj>property</obj> object offers methods to read values from property components that are in the same microcontroller.'
            },{
                type: 'code',
                content: '-- get number of a number property called "blubb"\npropertyText = property.getText("blubb")'
            }]
        },{
            title: 'Draw stuff onto the screen',
            contents: [{
                type: 'text',
                content: 'Drawing stuff onto the screen is done by calling methods of the <obj>screen</obj> object.\nBefore you draw you set the color of your "drawing tool".\nShapes will be drawn above each other (last one drawed is on top).\nExamples:\n'
            },{
                type: 'code',
                content: '-- draw a red circle (not filled)\n\n-- set paint color to red\n-- screen.setColor(r, g, b)\nscreen.setColor(255,0,0)\n\n-- screen.drawCircle(x, y, radius)\nscreen.drawCircle(20,15, 4)'
            },{
                type: 'code',
                content: '-- draw a green Triangle (filled)\n\n-- set paint color to green\n-- screen.setColor(r, g, b)\nscreen.setColor(0,255,0)\n\n-- screen.drawTriangleF(x1, y1, x2, y2, x3, y3)\nscreen.drawTriangleF(3,4,15,10,3,20)'
            },{
                type: 'text',
                content: 'The map is a special case. Instead of drawing a single shape onto the screen, it will paint a map of the world onto the whole screen.\nIf you want to draw shapes on top of the map, draw them after you draw the map.\nThe colors of the map can be adjust by calling one of the screen.setMapColorXXX() functions.'
            },{
                type: 'code',
                content: '--screen.drawMap(gpsX, gpsY, zoom)\n-- zoom ranges from 0.1 to 50\nscreen.drawMap(4000,1234,1)'
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
                content: 'The most important thing is the rotation of a point around another point:'
            },{
            	type: 'code',
            	content: '-- cx => x of rotation center\n-- cy => y of rotation center\n-- angle => the angle of rotation in radians (2pi = 360degree)\n-- x => x of point to rotate\n-- y => y of point to rotate\n\nfunction rotatePoint(cx, cy, angle, px, py)\n	s = math.sin(angle);\n	c = math.cos(angle);\n\n	--translate point back to origin:\n	px = px - cx;\n	py = py - cy;\n\n	-- rotate point\n	xnew = px * c - py * s;\n	ynew = px * s + py * c;\n\n	-- translate point back:\n	px = xnew + cx;\n	py = ynew + cy;\n	return {x=px, y=py}\nend'
            },{
                type: 'text',
                content: 'Example usage: continuisly rotate a circle around the center of the screen.'
            },{
            	type: 'code',
            	content: 'angle = 0\nfunction onDraw()\n	angle = angle + 0.05\n	if angle > math.pi*2 then\n		angle = 0\n	end\n	p = rotatePoint(screen.getWidth()/2, screen.getHeight()/2, angle, screen.getWidth()/2, screen.getHeight()/4)\n	screen.setColor(255,0,100)\n	screen.drawCircle(p.x, p.y, 5)\nend\n\nfunction rotatePoint(cx, cy, angle, px, py)\n	s = math.sin(angle);\n	c = math.cos(angle);\n\n	--translate point back to origin:\n	px = px - cx;\n	py = py - cy;\n\n	-- rotate point\n	xnew = px * c - py * s;\n	ynew = px * s + py * c;\n\n	-- translate point back:\n	px = xnew + cx;\n	py = ynew + cy;\n	return {x=px, y=py}\nend'
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
        },{
            title: 'Information for Multiplayer',
            contents: [{
                type: 'text',
                content: 'The problem when using scripts in multiplayer games: the scripts do run on every client.\nThat means players can have different behaviour.'
            },{
                type: 'text',
                content: 'Since the inputs and outputs of logic components are still synchronized and calculated on the server, some parts of your vehicle may be totally in sync (e.g. the length of a winch) but your screens may look different.\nThis is also the case for camera signals shown on monitors.'
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
                content: 'height = 0\nwidth = 0\ncenterX = 0\ncenterY = 0\n\nspeed = 0\n\nflapsDownStallSpeed = 40 -- bottom of white arc\nflapsUpStallSpeed = 50 -- bottom of green arc\nmaxFlapsExtendSpeed = 80 -- top of white arc\nmaxStructuralCruisingSpeed = 130 -- top of green arc\nneverExceedSpeed = 160 -- top of yellow arc\n\nspeedForWholeCircle = 250\n\nunit = "m/s" -- set to "m/s", "km/h" or "mph"\n\nfunction onTick()\n	speed = input.getNumber(1)\n	if unit == "km/h" then\n		speed = speed * 3.6\n	elseif unit == "mph" then\n		speed = speed * 2.23694\n	end\nend\n\nfunction onDraw()\n	height = screen.getHeight()\n	width = screen.getWidth()\n	\n	min = math.min(height, width)\n	centerX = min/2\n	centerY = min/2\n	height = min - 2\n	width = min - 2\n	\n	\n	-- draw white arc\n	screen.setColor(255,255,255)\n	screen.drawCircleF(centerX, centerY, width/2.2)\n	screen.setColor(0,0,0)\n	screen.drawCircleF(centerX, centerY, width/2.4)\n	\n	clear(math.pi + (maxFlapsExtendSpeed/speedForWholeCircle)*math.pi*2, math.pi + (flapsDownStallSpeed/speedForWholeCircle)*math.pi*2, width)\n	\n	-- draw green arc\n	screen.setColor(0,200,0)\n	screen.drawCircleF(centerX, centerY, width/2.4)\n	screen.setColor(0,0,0)\n	screen.drawCircleF(centerX, centerY, width/2.6)\n	\n	clear(math.pi + (maxStructuralCruisingSpeed/speedForWholeCircle)*math.pi*2, math.pi + (flapsUpStallSpeed/speedForWholeCircle)*math.pi*2, width/1.068) -- for 2x2 screens use width/1.068, for 1x1 screens use width/1.04\n	\n	-- draw yellow arc\n	screen.setColor(200,200,0)\n	screen.drawCircleF(centerX, centerY, width/2.6)\n	screen.setColor(0,0,0)\n	screen.drawCircleF(centerX, centerY, width/2.8)\n	\n	clear(math.pi + (neverExceedSpeed/speedForWholeCircle)*math.pi*2, math.pi + (maxStructuralCruisingSpeed/speedForWholeCircle)*math.pi*2, width/1.105) -- for 2x2 screens use width/1.105, for 1x1 screens use width/1.08\n	\n	\n	-- draw grey lines\n	screen.setColor(50, 50, 50)\n	for i=flapsDownStallSpeed, speedForWholeCircle-flapsDownStallSpeed, speedForWholeCircle/20 do\n		p1 = rotatePoint(centerX, centerY, math.pi + i/speedForWholeCircle * math.pi * 2, centerX, centerY+height/2.5)\n		p2 = rotatePoint(centerX, centerY, math.pi + i/speedForWholeCircle * math.pi * 2, centerX, centerY+height/2.1)\n		screen.drawLine(p1.x, p1.y, p2.x, p2.y)\n	end\n	\n	-- draw numbers\n	screen.setColor(255, 255, 255)\n	for i=flapsDownStallSpeed, speedForWholeCircle-flapsDownStallSpeed, speedForWholeCircle/10 do\n		label = math.floor(i)\n		p = rotatePoint(centerX, centerY, math.pi + i/speedForWholeCircle * math.pi * 2, centerX, centerY+height/3.4)\n		screen.drawText(p.x - string.len(label)*1.5, p.y-4, label)\n		\n		-- draw white line\n		p1 = rotatePoint(centerX, centerY, math.pi + i/speedForWholeCircle * math.pi * 2, centerX, centerY+height/2.6)\n		p2 = rotatePoint(centerX, centerY, math.pi + i/speedForWholeCircle * math.pi * 2, centerX, centerY+height/2.1)\n		screen.drawLine(p1.x, p1.y, p2.x, p2.y)\n	end\n	\n	\n	screen.setColor(255,255,255)\n	screen.drawTextBox(centerX - width/2, centerY - height/2, width, height/4, "Airspeed", 0, 0)\n	\n	-- draw pointer\n	p = rotatePoint(centerX, centerY, math.pi + speed / speedForWholeCircle * math.pi *2, centerX, centerY+height/2.1)\n	screen.setColor(255,255,255)\n	screen.drawLine(centerX, centerY, p.x, p.y)\nend\n\nstep = math.pi/18\nfunction clear(fromAngle, toAngle, y)\n	print("clear", fromAngle, toAngle,y)\n	fromAngle = fromAngle % (math.pi*2)\n	toAngle = toAngle % (math.pi*2)\n	print("clear", fromAngle, toAngle,y)\n	angle = fromAngle\n	while angle < toAngle-step or angle > toAngle do\n		p1 = rotatePoint(centerX, centerY, angle-step/10, centerX, y)\n		p2 = rotatePoint(centerX, centerY, angle+step+step/10, centerX, y)\n		screen.setColor(0,0,0)\n		screen.drawTriangleF(centerX, centerY, p1.x, p1.y, p2.x, p2.y)\n		\n		angle = angle + step\n		if angle >= math.pi*2 then\n			angle = 0\n		end\n	end\nend\n\nfunction rotatePoint(cx, cy, angle, px, py)\n	s = math.sin(angle);\n	c = math.cos(angle);\n\n	--translate point back to origin:\n	px = px - cx;\n	py = py - cy;\n\n	-- rotate point\n	xnew = px * c - py * s;\n	ynew = px * s + py * c;\n\n	-- translate point back:\n	px = xnew + cx;\n	py = ynew + cy;\n	return {x=px, y=py}\nend\n'
            },{
                type: 'text',
                content: 'The white area is the speed you can fly with flaps down.\nThe green area is the speed you can fly with flaps up.\nThe yellow area is emergency speed, exceeding this speed will result in structural damage of the plane.\n\nAll the speeds for these areas can be set in the code.'
            }]
        },{
            title: 'Flight Instruments - Heading Overlay',
            contents: [{
                type: 'text',
                content: 'Overlays directions, similar to a compass. You can show a special direction marker (e.g. the direction to a waypoint).'
            },{
                type: 'text',
                content: '<span style="color: red">deg90InPixels</span>(line 30) defines how many degrees the whole monitor covers horizontally. By default it\'s 180°. This value depends on the zoom/fov of the camera.'
            },{
                type: 'code',
                content: 'y = 10\nty = 30\nw = 3\nh = 10\n\nhw = 1\nhh = 5\n\n\nscrWi = 0\nscrHe = 0\n\npixelOffset = 0\ndeg90InPixels = 0\n\ndir = 0\nmarkerdir = 0\nhasMarker = false\n\nfunction onTick()\n	dir = input.getNumber(1)-- -0.5 to 0.5\n	markerdir = input.getNumber(2)-- -0.5 to 0.5\n	hasMarker = input.getBool(2)\nend\n\nfunction onDraw()\n	scrWi = screen.getWidth()\n	scrHe = screen.getHeight()\n	pixelOffset = scrWi/2\n	deg90InPixels = scrWi/2-2-- means 90° equals half of the monitors width\n	printHeadingOverlay()\nend\n\nfunction printHeadingOverlay()\n	N = -4 * dir\n	NE = N + 0.5\n	E = N + 1\n	SE = N + 1.5\n	S = N + 2\n	SW = N + 2.5\n	W = N + 3\n	NW = N + 3.5\n\n	M = -4 * markerdir\n\n	N = normalize(N)\n	NE = normalize(NE)\n	E = normalize(E)\n	SE = normalize(SE)\n	S = normalize(S)\n	SW = normalize(SW)\n	W = normalize(W)\n	NW = normalize(NW)\n\n	M = normalize(M)\n	\n	Nx = math.floor(deg90InPixels * N) + pixelOffset\n	NEx = math.floor(deg90InPixels * NE) + pixelOffset\n	Ex = math.floor(deg90InPixels * E) + pixelOffset\n	SEx = math.floor(deg90InPixels * SE) + pixelOffset\n	Sx = math.floor(deg90InPixels * S) + pixelOffset\n	SWx = math.floor(deg90InPixels * SW) + pixelOffset\n	Wx = math.floor(deg90InPixels * W) + pixelOffset\n	NWx = math.floor(deg90InPixels * NW) + pixelOffset\n\n	Mx = math.floor(deg90InPixels * M) + pixelOffset\n	\n	setColor(255,0,0)\n	drawRect(Nx, y, w, h)\n	drawText("N", Nx-2, ty)\n	setColor(37,255,0)\n	drawRect(Ex, y, w, h)\n	drawText("E", Ex-2, ty)\n	drawRect(Sx, y, w, h)\n	drawText("S", Sx-2, ty)\n	drawRect(Wx, y, w, h)\n	drawText("W", Wx-2, ty)\n\n	setColor(37,255,0)\n	drawRect(NEx, y, hw, hh)\n	drawRect(SEx, y, hw, hh)\n	drawRect(SWx, y, hw, hh)\n	drawRect(NWx, y, hw, hh)\n\n	if hasMarker then\n		setColor(251,1,253)\n		drawRect(Mx, y, w, h)\n		drawText("M", Mx-2, ty)\n	end\nend\n\nfunction normalize(xIndex)\n	if xIndex > 2 or xIndex < -2 then\n		 return xIndex % 3  - math.floor(xIndex/3)\n	else\n		return xIndex\n	end\nend\n\nfunction setColor(r,g,b)\n	screen.setColor(r, g, b)\nend\n\nfunction drawRect(x, y, w, h)\n	screen.drawRectF(x, y, w, h)   \nend\n\nfunction drawText(txt, x, y)\n	if y > scrHe or y+h < 0 or x > scrWi or x < 0 then\n		return\n	end\n	screen.drawText(x, y, txt)\nend   '
            }]
        },{
            title: 'General Instruments (made by Tajin)',
            contents: [{
                type: 'text',
                content: 'Configurable Instruments with automatic resizing to fit monitor.'
            },{
                type: 'code',
                content: '-- Shorthands\nM=math\nsi=M.sin\nco=M.cos\npi=M.pi\npi2=pi*2\nS=screen\nI=input\nO=output\nC=S.setColor\nF=string.format\n\n-- Functions\nfunction clamp(a,b,c)\n    return M.min(M.max(a,b),c)\nend\n\nfunction drawDial(x,y,r,inp,low,high,subs,title)\n    C(99,99,99) -- Set color\n    S.drawCircleF(x,y,r) -- draw filled circle as background\n    C(22,22,22)\n    S.drawCircle(x,y,r) -- draw outline\n    S.drawCircle(x,y,r*0.95) -- draw second outline, slightly smaller\n\n    span = 0.75 -- use 3/4 of the circle for the dial\n    range = high - low -- get difference between max and min\n    \n    -- loop to draw subdivisions:\n    for i=0,1,1/subs do -- 10 is the number of lines on the dial\n        a = i*span-span/2 -- angle for the current subdivision\n        a = pi2*a -- to radians\n        r1 = r*0.8\n        r2 = r*0.95\n        S.drawLine(x+si(a)*r1,y-co(a)*r1,x+si(a)*r2,y-co(a)*r2)\n    end\n    \n    val = clamp(inp,low,high)\n    val = (val-low)/range -- convert into a 0-1 value\n    a = pi2*(val*span-span/2) -- angle of the needle\n    a1 = a+pi/2 -- +90° so i can draw the needle as a triangle\n    r1 = r*0.9 -- length of the needle\n    r2 = r*0.08 -- half width of the needle\n    C(66,0,0) -- Needle & Text color\n    S.drawTriangleF(x+si(a)*r1,y-co(a)*r1, x+si(a1)*r2,y-co(a1)*r2, x+si(a1)*-r2,y-co(a1)*-r2)\n    S.drawTextBox(x-r,y+r*0.3,r+r,20,F("%.1f",inp),0,0)\n    S.drawTextBox(x-r,y+r,r+r,20,title,0,0)\n    \n    C(22,22,22) S.drawCircleF(x,y,r*0.1) -- draw dot in the middle\nend\n\n-- Main\nfunction onTick()\n    val1 = input.getNumber(1)\n    val2 = input.getNumber(2)\n    val3 = input.getNumber(3)\nend\n\nfunction onDraw()\n    w,h=S.getWidth(),S.getHeight()\n    C(0,0,0) S.drawClear() -- fill screen black\n    \n    -- drawDial( xpos, ypos, radius, input, minimum, maximum, subdivisions, title )\n    drawDial(w/6*1, h/2 ,w/7, val1, 0, 100, 10, "Weight") -- left dial\n    drawDial(w/6*3, h/2 ,w/7, val2, 50, 100, 6, "Pressure") -- middle dial\n    drawDial(w/6*5, h/2 ,w/7, val3, -100, 100, 8, "Temp") -- right dial\nend'
            },{
                type: 'text',
                content: 'In the last few lines of this code, you can configure sizes, min and max (and more) for each dial.'
            }]
        }]
    },{
        title: 'Frameworks (Collections of helpfull functions)',
        examples: [{
                title: 'Tajins Lua Framework',
                contents: [{
                    type: 'text',
                    content: 'This is a collection of helpfull functions (all in one place). Copy only what you need (e.g. 3d rotation)\n\nSource: <a href="http://rising.at/Stormworks/lua/framework.lua">rising.at/Stormworks/lua/framework.lua</a>'
                },{
                    type: 'code',
                    content: '-- shorcuts (remove what you don\'t need)\nM=math\nsi=M.sin\nco=M.cos\npi=M.pi\npi2=pi*2\n\nS=screen\ndL=S.drawLine\ndC=S.drawCircle\ndCF=S.drawCircleF\ndR=S.drawRect\ndRF=S.drawRectF\ndT=S.drawTriangle\ndTF=S.drawTriangleF\ndTx=S.drawText\ndTxB=S.drawTextBox\n\nC=S.setColor\n\nMS=map.mapToScreen\nSM=map.screenToMap\n\nI=input\nO=output\nP=property\nprB=P.getBool\nprN=P.getNumber\nprT=P.getText\n\ntU=table.unpack\n\n\n-- useful functions (remove what you don\'t need)\nfunction getN(...)local a={}for b,c in ipairs({...})do a[b]=I.getNumber(c)end;return tU(a)end\n    -- get a list of input numbers\nfunction outN(o, ...) for i,v in ipairs({...}) do O.setNumber(o+i-1,v) end end\n    -- set a list of number outputs\nfunction getB(...)local a={}for b,c in ipairs({...})do a[b]=I.getBool(c)end;return tU(a)end\n  -- get a list of input booleans\nfunction outB(o, ...) for i,v in ipairs({...}) do O.setBool(o+i-1,v) end end\n -- set a list of boolean outputs\nfunction round(x,...)local a=10^(... or 0)return M.floor(a*x+0.5)/a end\n -- round(x) or round(x,a) where a is the number of decimals\nfunction clamp(a,b,c) return M.min(M.max(a,b),c) end\n -- limit a between b and c\nfunction inRect(x,y,a,b,w,h) return x>a and y>b and x<a+w and y<b+h end\n   -- check if x,y is inside the rectangle a,b,w,h\nfunction rot3D(x,y,z,a,b,c) return {(co(b)*co(c)*x)+(-co(a)*si(c)+si(a)*si(b)*co(z))*y+(si(a)*si(c)+co(a)*si(b)*co(c))*z,(co(b)*si(c)*x)+(co(a)*co(c)+si(a)*si(b)*si(c))*y+(-si(a)*co(c)+co(a)*si(b)*si(c))*z,-si(b)*x+si(a)*co(b)*y+co(a)*co(b)*z} end\n  -- rotate point x,y,z around by a,b,c and return the resulting position\n\n-- touch handling (remove if you don\'t need it)\n    TOUCH = {\n     {5,5,30,10,"1"}, --Button1\n        {5,20,30,10,"2"}, --Button2\n       {5,35,30,10,"text",0,0}, --Button3\n    }\n act = {}\n  btn = {}\n  \n  test = 0\n  act[3] = function(i) -- function for button 3, executed on click\n      test = test+1\n end\n--\n\nfunction onTick()\n  myNumVar,myOtherNum = getN(10,15)\n myBoolVar,myOtherBool = getB(5,9)\n \n  -- touch handling (remove if you don\'t need it)\n       w,h,tx,ty=getN(1,2,3,4,5,6);t1,t2=getB(1,2)\n       \n      for i,t in ipairs(TOUCH) do\n           b = btn[i] or {}\n          if inRect(tx,ty,t[1],t[2],t[3],t[4]) then\n             b.click = t1 and not b.hold\n               b.hold = t1\n               if b.click then\n                   b.toggle = not b.toggle\n                   if act[i] then act[i](i) end\n              end\n           else\n              b.hold = false\n            end\n           btn[i] = b\n        end\n   --\n    \n  outN(11, myNumVar,myOtherNum) -- output to 11 and 12\n  outB(1, true,false)\nend\n\nfunction onDraw()\n if t1==nil then return true end -- safety check to make sure variables are set\n    w = S.getWidth()\n  h = S.getHeight()\n cx,cy = w/2,h/2 -- coordinates of the screen center (always useful)\n   \n  for i,t in ipairs(TOUCH) do -- loop through defined buttons and render them\n       C(20,20,20)\n       if btn[i].hold then C(80,80,80) end -- color while holding the button\n     dRF(tU(t,1,4)) -- draw button background (tU outputs the first 4 values from the button as parameters here)\n       C(255,0,0)\n        if btn[i].toggle then C(0,255,0) end -- text green if button is toggled on\n        dTxB(tU(t)) -- draw textbox with the button text\n  end\n   \n  C(255,255,255)\n    dTx(cx,cy,test) -- test output for the function of button 3\nend'
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


    LOADER.on(LOADER.EVENT.UI_READY, init)

    function init(){

        UI.viewables()['viewable_examples'].onGainFocus(()=>{
            REPORTER.report(REPORTER.REPORT_TYPE_IDS.openLearnAndExamples)
        })

        UI.viewables()['viewable_examples'].onViewableResize(resizeCodeBlocks)


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
                            c = $('<div class="example_code">' + co.content.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>')

                            let editor = ace.edit(c.get(0),{
                                maxLines: 50
                            });
                            editor.setTheme("ace/theme/pony_ide");
                            editor.session.setMode("ace/mode/lua");
                            editor.session.setUseSoftTabs(false); 
                            editor.setReadOnly(true)
                            c.prop('editor', editor)
                            c.get(0).editor = editor
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
            })

            $('#examples').append(chapter)
        }

        resizeCodeBlocks()

        LOADER.done(LOADER.EVENT.EXAMPLES_READY)
    }
    
    function resizeCodeBlocks(){
        $('#examples .example_code').each((i, elem)=>{
            if(elem.editor){
                elem.editor.resize()
            }
        })
    }

    return {
    }

})(jQuery)
