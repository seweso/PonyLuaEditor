var EXAMPLES = (($)=>{
  "use strict";

  	let CHAPTERS_EXAMPLE

	const CHAPTERS_LEARN = [{
		title: 'Lua Basics (Learn)',
		sections: [{
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
				content: 'function func()\n return "hello"\nend'
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
				content: 'varA = makeBatteryString(5)\nvarB = makeBatteryString(10)\n\nfunction makeBatteryString(percent)\n    return percent .."% battery"\nend'
			},{
				type: 'text',
				content: 'When you now want to change the string "battery" to "Bat." there is only one place where you have to change the code.\n\nIn this example our code got quite big, but in most cases, using functions will make your code shorter (see example bellow).'
			},{
				type: 'code',
				content: '-- long and ugly:\nscreen.setColor(1,1,1)\nscreen.drawRect(1,2,3,4)\nscreen.setColor(2,2,2)\nscreen.drawRect(5,6,7,8)\nscreen.setColor(3,3,3)\nscreen.drawRect(9,10,11,12)\nscreen.setColor(4,4,4)\nscreen.drawRect(13,14,15,16)\n\n\n-- shorter and beautifull:\nsC(1,1,1)\nsR(1,2,3,4)\nsC(2,2,2)\nsR(5,6,7,8)\nsC(3,3,3)\nsR(9,10,11,12)sC(4,4,4)\nsR(13,14,15,16)\nfunction sC(r,g,b)\n   screen.setColor(r,g,b)\nend\n\nfunction sR(x,y,w,h)\n   screen.drawRect(x,y,w,h)\nend'
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
				content: 'local a=1\nfunction test()  -- this function can access a\n   print(a)\nend\n\nlocal function test2()  -- this function can access a too\n    print(a)\nend\n\n'
			},{
				type: 'code',
				content: 'function test()  -- this function can access a\n  local a=1\n print(a)\nend\n\nlocal function test2()  -- this function can NOT access a \n   print(a)  -- error\nend\n\n'
			},{
				type: 'text',
				content: 'Important: the onDraw() and onTick() function must be global!\n<i>local</i> variables and functions must be declared before they can be used:'
			},{
				type: 'code',
				content: 'local function a()\n  print("test")\nend\n\nfunction onDraw()\n   a()  -- works\nend'
			},{
				type: 'code',
				content: 'function onDraw()\n   a()  -- error: a not found\nend\n\nlocal function a()\n ...\nend'
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
		sections: [{
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
		sections: [{
			title: 'Trigonometry (2D and 3D calculations)',
			contents: [{
				type: 'text',
				content: 'The most important thing is the rotation of a point around another point:'
			},{
				type: 'code',
				content: '-- cx => x of rotation center\n-- cy => y of rotation center\n-- angle => the angle of rotation in radians (2pi = 360degree)\n-- x => x of point to rotate\n-- y => y of point to rotate\n\nfunction rotatePoint(cx, cy, angle, px, py)\n s = math.sin(angle);\n  c = math.cos(angle);\n\n    --translate point back to origin:\n px = px - cx;\n py = py - cy;\n\n   -- rotate point\n   xnew = px * c - py * s;\n   ynew = px * s + py * c;\n\n -- translate point back:\n  px = xnew + cx;\n   py = ynew + cy;\n   return {x=px, y=py}\nend'
			},{
				type: 'text',
				content: 'Example usage: continuisly rotate a circle around the center of the screen.'
			},{
				type: 'code',
				content: 'angle = 0\nfunction onDraw()\n    angle = angle + 0.05\n  if angle > math.pi*2 then\n     angle = 0\n end\n   p = rotatePoint(screen.getWidth()/2, screen.getHeight()/2, angle, screen.getWidth()/2, screen.getHeight()/4)\n  screen.setColor(255,0,100)\n    screen.drawCircle(p.x, p.y, 5)\nend\n\nfunction rotatePoint(cx, cy, angle, px, py)\n    s = math.sin(angle);\n  c = math.cos(angle);\n\n    --translate point back to origin:\n px = px - cx;\n py = py - cy;\n\n   -- rotate point\n   xnew = px * c - py * s;\n   ynew = px * s + py * c;\n\n -- translate point back:\n  px = xnew + cx;\n   py = ynew + cy;\n   return {x=px, y=py}\nend'
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
		title: 'Mission Lua',
		sections: [{
			title: 'Community Documentation',
			contents: [{
				type: 'text',
				content: 'This is a WIP documentation of the mission lua, since the official documentation is missing a lot of information.'
			},{
				type: 'text',
				content: '<a href="https://docs.google.com/spreadsheets/d/1DkjUjX6DwCBt8IhA43NoYhtxk42_f6JXb-dfxOX9lgg/edit#gid=0">Google Spreadsheet</a>'
			}]
		}]
	}]


	LOADER.on(LOADER.EVENT.UI_READY, init)

	function init(){

		UI.viewables()['viewable_examples'].onGainFocus(()=>{
			REPORTER.report(REPORTER.REPORT_TYPE_IDS.openLearnAndExamples)
		})

		UI.viewables()['viewable_learn'].onGainFocus(()=>{
			REPORTER.report(REPORTER.REPORT_TYPE_IDS.openLearnAndExamples)
		})

		UI.viewables()['viewable_examples'].onViewableResize(resizeCodeBlocks)

		UI.viewables()['viewable_learn'].onViewableResize(resizeCodeBlocks)

		refresh()

		LOADER.done(LOADER.EVENT.EXAMPLES_READY)
	}

	function refresh(){
		if(UI.isServerMode()){
            CHAPTERS_EXAMPLE = EXAMPLES_DEFINITION_SERVER
        } else {
            CHAPTERS_EXAMPLE = EXAMPLES_DEFINITION_CLIENT
        }

		build(CHAPTERS_EXAMPLE, $('#examples'))

		build(CHAPTERS_LEARN, $('#learn'))

		resizeCodeBlocks()
	}

	function build(chapters, container){
		container.html('')
		
		for(let ch of chapters){
			let chapter = $('<div class="chapter"><div class="chapter_head"><div class="chapter_title">' + ch.title + '</div></div><div class="chapter_body"></div></div>')
			for(let ex of ch.sections){
				let section = $('<div class="section"><div class="section_head"><div class="section_title">' + ex.title + '</div></div><div class="section_body"></div></div>')
				for(let co of ex.contents){
					let c
					switch(co.type){
						case 'text': {
							c = $('<div class="part_text">' + co.content + '</div>')
						}; break;
						case 'code': {
							c = $('<div class="part_code">' + co.content.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>')

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
					section.find('.section_body').append(c)
				}
				section.find('.section_head').on('click', ()=>{
					let wasopen = false
					if(section.hasClass('open')){
						wasopen = true
					}
					container.find('.section.open').removeClass('open')
					if(!wasopen){
						section.addClass('open')
					}
				})

				chapter.find('.chapter_body').append(section)
			}

			chapter.find('.chapter_head').on('click', ()=>{
				let wasopen = false
					if(chapter.hasClass('open')){
						wasopen = true
					}
					container.find('.chapter.open').removeClass('open')
					if(!wasopen){
						chapter.addClass('open')
					}
			})

			container.append(chapter)
		}
	}
	
	function resizeCodeBlocks(){
		$('.chapter_container .part_code').each((i, elem)=>{
			if(elem.editor){
				elem.editor.resize()
			}
		})
	}

	return {
		refresh: refresh
	}

})(jQuery)
