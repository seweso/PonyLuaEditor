DOCUMENTATION_DEFINITION = (()=>{

    const TO = DOCUMENTATION.TO
    const TF = DOCUMENTATION.TF
    const TV = DOCUMENTATION.TV
    const TA = DOCUMENTATION.TA

    const DEF = {
        children: {
            screen: {
                type: TO,
                lib: 'stormworks',
                description: 'Used to show stuff on the video output. Can only be called within the onDraw function!',
                children: {
                    setColor: {
                        type: TF,
                        args: [{name: 'r'}, {name: 'g'}, {name: 'b'}, {name: 'a', optional: true}],
                        description: 'Set the current draw color. Values range from 0 - 255. A is optional.'
                    },
                    drawClear: {
                        type: TF,
                        args: [],
                        description: 'Clear the screen with the current color (paints the whole screen).'
                    },
                    drawLine: {
                        type: TF,
                        args: [{name: 'x1'}, {name: 'y1'}, {name: 'x2'}, {name: 'y2'}],
                        description: 'Draw a line from (x1,y1) to (x2,y2).'
                    },
                    drawCircle: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}, {name: 'radius'}],
                        description: 'Draw a circle at (x,y) with radius.'
                    },
                    drawCircleF: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}, {name: 'radius'}],
                        description: 'Draw a filled circle at (x,y) with radius.'
                    },
                    drawRect: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}, {name: 'width'}, {name: 'height'}],
                        description: 'Draw a rectangle at (x,y) with width and height.'
                    },
                    drawRectF: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}, {name: 'width'}, {name: 'height'}],
                        description: 'Draw a filled rectangle at (x,y) with width and height.'
                    },
                    drawTriangle: {
                        type: TF,
                        args: [{name: 'x1'}, {name: 'y1'}, {name: 'x2'}, {name: 'y2'}, {name: 'x3'}, {name: 'y3'}],
                        description: 'Draw a triangle between (x1,y1), (x2,y2) and (x3,y3).'
                    },
                    drawTriangleF: {
                        type: TF,
                        args: [{name: 'x1'}, {name: 'y1'}, {name: 'x2'}, {name: 'y2'}, {name: 'x3'}, {name: 'y3'}],
                        description: 'Draw a filled triangle between (x1,y1), (x2,y2) and (x3,y3).'
                    },
                    drawText: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}, {name: 'text'}],
                        description: 'Draw text at (x,y). Each character is 4 pixels wide and 5 pixels tall.'
                    },
                    drawTextBox: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}, {name: 'width'}, {name: 'height'}, {name: 'text'}, {name: 'h_align', optional: true}, {name: 'v_align', optional: true, optionalConnectedToPrevious: true}],
                        description: 'Draw text within a rectangle at (x,y) with width and height. Text alignment can be specified using the last two parameters and ranges from -1 to 1 (left to right, top to bottom). If either of the alignment paramters are omitted, the text will be drawn top-left by default. Text will automatically wrap at spaces when possible, and will overflow the top/bottom of the specified rectangle if too large. THIS IS NOT 100% LIKE INGAME BUT ALMOST!'
                    },
                    drawMap: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}, {name: 'zoom'}],
                        description: 'Draw the world map centered on map coordinate (x,y) with zoom level ranging from 0.1 to 50'
                    },
                    setMapColorOcean: {
                        type: TF,
                        args: [{name: 'r'}, {name: 'g'}, {name: 'b'}, {name: 'a', optional: true}],
                        description: 'Set the color for ocean map pixels. Values range from 0 - 255, a is optional.'
                    },
                    setMapColorShallows: {
                        type: TF,
                        args: [{name: 'r'}, {name: 'g'}, {name: 'b'}, {name: 'a', optional: true}],
                        description: 'Set the color for shallows map pixels. Values range from 0 - 255, a is optional.'
                    },
                    setMapColorLand: {
                        type: TF,
                        args: [{name: 'r'}, {name: 'g'}, {name: 'b'}, {name: 'a', optional: true}],
                        description: 'Set the color for land map pixels. Values range from 0 - 255, a is optional.'
                    },
                    setMapColorGrass: {
                        type: TF,
                        args: [{name: 'r'}, {name: 'g'}, {name: 'b'}, {name: 'a', optional: true}],
                        description: 'Set the color for grass map pixels. Values range from 0 - 255, a is optional.'
                    },
                    setMapColorSand: {
                        type: TF,
                        args: [{name: 'r'}, {name: 'g'}, {name: 'b'}, {name: 'a', optional: true}],
                        description: 'Set the color for sand map pixels. Values range from 0 - 255, a is optional.'
                    },
                    setMapColorSnow: {
                        type: TF,
                        args: [{name: 'r'}, {name: 'g'}, {name: 'b'}, {name: 'a', optional: true}],
                        description: 'Set the color for snow map pixels. Values range from 0 - 255, a is optional.'
                    },
                    getWidth: {
                        type: TF,
                        args: [],
                        description: 'Returns the width of the monitor currently being rendered to'
                    },
                    getHeight: {
                        type: TF,
                        args: [],
                        description: 'Returns the height of the monitor currently being rendered to'
                    }
                }
            },
            map: {
                type: TO,
                lib: 'stormworks',
                description: 'Functions to interact with the map.',
                children: {
                    screenToMap: {
                        type: TF,
                        args: [{name: 'mapX'}, {name: 'mapY'}, {name: 'zoom'}, {name: 'screenW'}, {name: 'screenH'}, {name: 'pixelX'}, {name: 'pixelY'}],
                        description: 'Convert pixel coordinates into world coordinates'
                    },
                    mapToScreen: {
                        type: TF,
                        args: [{name: 'mapX'}, {name: 'mapY'}, {name: 'zoom'}, {name: 'screenW'}, {name: 'screenH'}, {name: 'worldX'}, {name: 'worldY'}],
                        description: 'Convert world coordinates into pixel coordinates'
                    }
                }
            },
            input: {
                type: TO,
                lib: 'stormworks',
                description: 'Read values from the composite input.',
                children: {
                    getBool: {
                        type: TF,
                        args: [{name: 'index'}],
                        description: 'Read the boolean value of the input composite on index. Index ranges from 1 - 32'                        
                    },
                    getNumber: {
                        type: TF,
                        args: [{name: 'index'}],
                        description: 'Read the number value of the input composite on indexe. Index ranges from 1 - 32'                        
                    }
                }
            },
            devinput: {
                type: TO,
                lib: 'dev',
                description: 'Manipulate input values.',
                children: {
                    setBool: {
                        type: TF,
                        args: [{name: 'index'}],
                        description: 'Sets the boolean value of the output composite on index to value. Index ranges from 1 - 32.'                        
                    },
                    setNumber: {
                        type: TF,
                        args: [{name: 'index'}],
                        description: 'Sets the number value of the output composite on index to value. Index ranges from 1 - 32.'                        
                    }
                }
            },
            output: {
                type: TO,
                lib: 'stormworks',
                description: 'Set values on the composite output.',
                children: {
                    setBool: {
                        type: TF,
                        args: [{name: 'index'}, {name: 'value'}],
                        description: 'Sets the boolean value of the output composite on index to value. Index ranges from 1 - 32'                        
                    },
                    setNumber: {
                        type: TF,
                        args: [{name: 'index'}, {name: 'value'}],
                        description: 'Sets the number value of the output composite on index to value. Index ranges from 1 - 32'                        
                    }
                }
            },
            property: {
                type: TO,
                lib: 'stormworks',
                description: 'Read the values of property components within this microcontroller directly. The label passed to each function should match the label that has been set for the property you#re trying to access (case-sensitive).',
                children: {
                    getBool: {
                        type: TF,
                        args: [{name: 'label'}],
                        description: 'Reads the boolean value of the property with the specified label'                        
                    },
                    getNumber: {
                        type: TF,
                        args: [{name: 'label'}],
                        description: 'Reads the number value of the property with the specified label'                        
                    },
                    getText: {
                        type: TF,
                        args: [{name: 'label'}],
                        description: 'Reads the string value of the property with the specified label'                        
                    }
                }
            },
            async: {
                type: TO,
                lib: 'stormworks',
                description: 'Execute HTTP requests.',
                children: {
                    httpGet: {
                        type: TF,
                        args: [{name: 'port'}, {name: 'url'}],
                        description: 'Creates a HTTP request to "http://localhost:[PORT][url]". If you call it more then once per tick, the request will be put into a queue, every tick one reqeust will be taken from that queue and executed.\n\nIMPORTANT:\nYou must follow these steps to enable http support in this Lua IDE:\nYour browser prohibits sending and receiving data to and from localhost. To fix that, follow the <a href="http-allow-localhost" target="_blank">manual here</a>'
                    }
                }
            },
            pause: {
                type: TF,
                lib: 'dev',
                args: [],
                description: 'Pauses the script. Note: the currently running onTick() and onDraw() functions are executed.'
            },
            timer: {
                type: TO,
                lib: 'dev',
                description: 'Measure how long your code needs to execute.',
                children: {
                    start: {
                        type: TF,
                        args: [],
                        description: 'Starts the timer.'                        
                    },
                    stop: {
                        type: TF,
                        args: [],
                        description: 'Stops the timer and prints the time to the console.'                        
                    }
                }
            },
            print: {
                type: TF,
                lib: 'dev',
                args: [{name: 'text'}],
                description: 'Prints text to the console.'
            },            
            printColor: {
                type: TF,
                lib: 'dev',
                args: [{name: 'r'}, {name: 'g'}, {name: 'b'}],
                description: 'Colorizes the console output of print().'
            },
            pairs: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'table'}],
                description: 'If table has a metamethod __pairs, calls it with t as argument and returns the first three results from the call.\nOtherwise, returns three values: the next function, the table t, and nil, so that the construction\n     for k,v in pairs(t) do body end\nwill iterate over all key–value pairs of table t.\nSee function next for the caveats of modifying the table during its traversal.'
            },
            ipairs: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'table'}],
                description: 'Returns three values (an iterator function, the table t, and 0) so that the construction\nfor i,v in ipairs(t) do body end\nwill iterate over the key–value pairs (1,t[1]), (2,t[2]), ..., up to the first nil value.'
            },
            next: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'table'}, {name: 'index', optional: true}],
                description: 'Allows a program to traverse all fields of a table. Its first argument is a table and its second argument is an index in this table. next returns the next index of the table and its associated value. When called with nil as its second argument, next returns an initial index and its associated value. When called with the last index, or with nil in an empty table, next returns nil. If the second argument is absent, then it is interpreted as nil. In particular, you can use next(t) to check whether a table is empty.\nThe order in which the indices are enumerated is not specified, even for numeric indices. (To traverse a table in numerical order, use a numerical for.)\nThe behavior of next is undefined if, during the traversal, you assign any value to a non-existent field in the table. You may however modify existing fields. In particular, you may clear existing fields.'
            },
            tostring: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'v'}],
                description: 'Receives a value of any type and converts it to a string in a human-readable format. (For complete control of how numbers are converted, use string.format.)\nIf the metatable of v has a __tostring field, then tostring calls the corresponding value with v as argument, and uses the result of the call as its result.'
            },
            tonumber: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: [{name: 'e'}, {name: 'base', optional: true}],
                description: 'When called with no base, tonumber tries to convert its argument to a number. If the argument is already a number or a string convertible to a number, then tonumber returns this number; otherwise, it returns nil.\nThe conversion of strings can result in integers or floats, according to the lexical conventions of Lua (see §3.1). (The string may have leading and trailing spaces and a sign.)\nWhen called with base, then e must be a string to be interpreted as an integer numeral in that base. The base may be any integer between 2 and 36, inclusive. In bases above 10, the letter "A" (in either upper or lower case) represents 10, "B" represents 11, and so forth, with "Z" representing 35. If the string e is not a valid numeral in the given base, the function returns nil.'
            },
            math: {
                type: TO,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.7',
                description: 'This library provides basic mathematical functions. It provides all its functions and constants inside the table math. Functions with the annotation "integer/float" give integer results for integer arguments and float results for float (or mixed) arguments. Rounding functions (math.ceil, math.floor, and math.modf) return an integer when the result fits in the range of an integer, or a float otherwise.',
                children: {                    
                    abs: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the absolute value of x. (integer/float) '
                    },
                    acos: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the arc cosine of x (in radians). '
                    },
                    asin: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the arc sine of x (in radians). '
                    },
                    atan: {
                        type: TF,
                        args: [{name: 'y'}, {name: 'x', optional: true}],
                        description: ' Returns the arc tangent of y/x (in radians), but uses the signs of both arguments to find the quadrant of the result. (It also handles correctly the case of x being zero.)\nThe default value for x is 1, so that the call math.atan(y) returns the arc tangent of y.'
                    },
                    ceil: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the smallest integral value larger than or equal to x.'
                    },
                    cos: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the cosine of x (assumed to be in radians).'
                    },
                    deg: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Converts the angle x from radians to degrees.'
                    },
                    exp: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the value e raised to the power x (where e is the base of natural logarithms).'
                    },
                    floor: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the largest integral value smaller than or equal to x.'
                    },
                    fmod: {
                        type: TF,
                        args: [{name: 'x'}, {name: 'y'}],
                        description: 'Returns the remainder of the division of x by y that rounds the quotient towards zero. (integer/float)'
                    },
                    huge: {
                        type: TF,
                        args: [],
                        description: 'The float value HUGE_VAL, a value larger than any other numeric value.'
                    },
                    log: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Inverse function of math.exp(x).'
                    },
                    max: {
                        type: TF,
                        args: [{name: 'x'}, {name: '···'}],
                        description: 'Returns the argument with the maximum value, according to the Lua operator <. (integer/float)'
                    },
                    maxinteger: {
                        type: TF,
                        args: [],
                        description: 'An integer with the maximum value for an integer. '
                    },
                    min: {
                        type: TF,
                        args: [{name: 'x'}, {name: '···'}],
                        description: 'Returns the argument with the minimum value, according to the Lua operator <. (integer/float)'
                    },
                    mininteger: {
                        type: TF,
                        args: [],
                        description: 'An integer with the minimum value for an integer. '
                    },
                    modf: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the integral part of x and the fractional part of x. Its second result is always a float.'
                    },
                    pi: {
                        type: TV,
                        description: 'The value of π.'
                    },
                    rad: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Converts the angle x from degrees to radians.'
                    },
                    random: {
                        type: TF,
                        args: [{name: 'm', optional: true}, {name: 'n', optional: true}],
                        description: ' When called without arguments, returns a pseudo-random float with uniform distribution in the range [0,1). When called with two integers m and n, math.random returns a pseudo-random integer with uniform distribution in the range [m, n]. (The value n-m cannot be negative and must fit in a Lua integer.) The call math.random(n) is equivalent to math.random(1,n).\nThis function is an interface to the underling pseudo-random generator function provided by C.'
                    },
                    randomseed: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Sets x as the "seed" for the pseudo-random generator: equal seeds produce equal sequences of numbers.'
                    },
                    sin: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the sine of x (assumed to be in radians).'
                    },
                    sqrt: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the square root of x. (You can also use the expression x^0.5 to compute this value.)'
                    },
                    tan: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns the tangent of x (assumed to be in radians).'
                    },
                    tointeger: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'If the value x is convertible to an integer, returns that integer. Otherwise, returns nil.'
                    },
                    type: {
                        type: TF,
                        args: [{name: 'x'}],
                        description: 'Returns "integer" if x is an integer, "float" if it is a float, or nil if x is not a number.'
                    },
                    ult: {
                        type: TF,
                        args: [{name: 'm'}, {name: 'n'}],
                        description: 'Returns a boolean, true if and only if integer m is below integer n when they are compared as unsigned integers.'
                    }
                }
            },
            table: {
                type: TO,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.6',
                description: ' This library provides generic functions for table manipulation. It provides all its functions inside the table table.\nRemember that, whenever an operation needs the length of a table, all caveats about the length operator apply (see §3.4.7). All functions ignore non-numeric keys in the tables given as arguments.',
                children: {
                    concat: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'sep', optional: true}, {name: 'i', optional: true}, {name: 'j', optional: true}],
                        description: 'Given a list where all elements are strings or numbers, returns the string list[i]..sep..list[i+1] ··· sep..list[j]. The default value for sep is the empty string, the default for i is 1, and the default for j is #list. If i is greater than j, returns the empty string.'
                    },
                    insert: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'pos', optional: true}, {name: 'value'}],
                        description: 'Inserts element value at position pos in list, shifting up the elements list[pos], list[pos+1], ···, list[#list]. The default value for pos is #list+1, so that a call table.insert(t,x) inserts x at the end of list t.'
                    },
                    move: {
                        type: TF,
                        args: [{name: 'a1'}, {name: 'f'}, {name: 'e'}, {name: 't'}, {name: 'a2', optional: true}],
                        description: ' Moves elements from table a1 to table a2, performing the equivalent to the following multiple assignment: a2[t],··· = a1[f],···,a1[e]. The default for a2 is a1. The destination range can overlap with the source range. The number of elements to be moved must fit in a Lua integer.\nReturns the destination table a2.'
                    },
                    pack: {
                        type: TF,
                        args: [{name: '···'}],
                        description: 'Returns a new table with all arguments stored into keys 1, 2, etc. and with a field "n" with the total number of arguments. Note that the resulting table may not be a sequence.'
                    },
                    remove: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'pos', optional: true}],
                        description: ' Removes from list the element at position pos, returning the value of the removed element. When pos is an integer between 1 and #list, it shifts down the elements list[pos+1], list[pos+2], ···, list[#list] and erases element list[#list]; The index pos can also be 0 when #list is 0, or #list + 1; in those cases, the function erases the element list[pos].\nThe default value for pos is #list, so that a call table.remove(l) removes the last element of list l.'
                    },
                    sort: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'comp', optional: true}],
                        description: ' Sorts list elements in a given order, in-place, from list[1] to list[#list]. If comp is given, then it must be a function that receives two list elements and returns true when the first element must come before the second in the final order (so that, after the sort, i < j implies not comp(list[j],list[i])). If comp is not given, then the standard Lua operator < is used instead.\nNote that the comp function must define a strict partial order over the elements in the list; that is, it must be asymmetric and transitive. Otherwise, no valid sort may be possible.\nThe sort algorithm is not stable: elements considered equal by the given order may have their relative positions changed by the sort.'
                    },
                    unpack: {
                        type: TF,
                        args: [{name: 'list'}, {name: 'i', optional: true}, {name: 'j', optional: true}],
                        description: ' Returns the elements from the given list. This function is equivalent to\n    return list[i], list[i+1], ···, list[j]\nBy default, i is 1 and j is #list.'
                    }
                }
            },
            string: {
                type: TO,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.4',
                description: ' This library provides generic functions for string manipulation, such as finding and extracting substrings, and pattern matching. When indexing a string in Lua, the first character is at position 1 (not at 0, as in C). Indices are allowed to be negative and are interpreted as indexing backwards, from the end of the string. Thus, the last character is at position -1, and so on.\nThe string library assumes one-byte character encodings.',
                children: {
                    byte: {
                        type: TF,
                        args: [{name: 's'}, {name: 'i', optional: true}, {name: 'j', optional: true}],
                        description: 'Returns the internal numeric codes of the characters s[i], s[i+1], ..., s[j]. The default value for i is 1; the default value for j is i. These indices are corrected following the same rules of function string.sub.\nNumeric codes are not necessarily portable across platforms.'
                    },
                    char: {
                        type: TF,
                        args: [{name: '···'}],
                        description: 'Receives zero or more integers. Returns a string with length equal to the number of arguments, in which each character has the internal numeric code equal to its corresponding argument.\nNumeric codes are not necessarily portable across platforms.'
                    },
                    dump: {
                        type: TF,
                        args: [{name: 'function'}, {name: 'strip', optional: true}],
                        description: ' Returns a string containing a binary representation (a binary chunk) of the given function, so that a later load on this string returns a copy of the function (but with new upvalues). If strip is a true value, the binary representation may not include all debug information about the function, to save space.\nFunctions with upvalues have only their number of upvalues saved. When (re)loaded, those upvalues receive fresh instances containing nil. (You can use the debug library to serialize and reload the upvalues of a function in a way adequate to your needs.)'
                    },
                    find: {
                        type: TF,
                        args: [{name: 's'}, {name: 'patter'}, {name: 'init', optional: true}, {name: 'plain', optional: true}],
                        description: ' Looks for the first match of pattern (see §6.4.1) in the string s. If it finds a match, then find returns the indices of s where this occurrence starts and ends; otherwise, it returns nil. A third, optional numeric argument init specifies where to start the search; its default value is 1 and can be negative. A value of true as a fourth, optional argument plain turns off the pattern matching facilities, so the function does a plain "find substring" operation, with no characters in pattern being considered magic. Note that if plain is given, then init must be given as well.\nIf the pattern has captures, then in a successful match the captured values are also returned, after the two indices.'
                    },
                    format: {
                        type: TF,
                        args: [{name: 'formatstring'}, {name: '···'}],
                        description: ' Returns a formatted version of its variable number of arguments following the description given in its first argument (which must be a string). The format string follows the same rules as the ISO C function sprintf. The only differences are that the options/modifiers *, h, L, l, n, and p are not supported and that there is an extra option, q.\nThe q option formats a string between double quotes, using escape sequences when necessary to ensure that it can safely be read back by the Lua interpreter. For instance, the call\n     string.format("%q", "a string with "quotes" and \n new line")\nmay produce the string:\n     "a string with \"quotes\" and \\n      new line"\nOptions A, a, E, e, f, G, and g all expect a number as argument. Options c, d, i, o, u, X, and x expect an integer. When Lua is compiled with a C89 compiler, options A and a (hexadecimal floats) do not support any modifier (flags, width, length).\nOption s expects a string; if its argument is not a string, it is converted to one following the same rules of tostring. If the option has any modifier (flags, width, length), the string argument should not contain embedded zeros.'
                    },
                    gmatch: {
                        type: TF,
                        args: [{name: 's'}, {name: 'pattern'}],
                        description: 'Returns an iterator function that, each time it is called, returns the next captures from pattern (see §6.4.1) over the string s. If pattern specifies no captures, then the whole match is produced in each call.\nAs an example, the following loop will iterate over all the words from string s, printing one per line:\n     s = "hello world from Lua"\n     for w in string.gmatch(s, "%a+") do\n       print(w)\n     end\nThe next example collects all pairs key=value from the given string into a table:\n     t = {}\n     s = "from=world, to=Lua"\n     for k, v in string.gmatch(s, "(%w+)=(%w+)") do\n       t[k] = v\n     end\nFor this function, a caret "^" at the start of a pattern does not work as an anchor, as this would prevent the iteration.'
                    },
                    gsub: {
                        type: TF,
                        args: [{name: 's'}, {name: 'pattern'}, {name: 'repl'}, {name: 'n', optional: true}],
                        description: '\nReturns a copy of s in which all (or the first n, if given) occurrences of the pattern (see §6.4.1) have been replaced by a replacement string specified by repl, which can be a string, a table, or a function. gsub also returns, as its second value, the total number of matches that occurred. The name gsub comes from Global SUBstitution.\nIf repl is a string, then its value is used for replacement. The character % works as an escape character: any sequence in repl of the form %d, with d between 1 and 9, stands for the value of the d-th captured substring. The sequence %0 stands for the whole match. The sequence %% stands for a single %.\nIf repl is a table, then the table is queried for every match, using the first capture as the key.\nIf repl is a function, then this function is called every time a match occurs, with all captured substrings passed as arguments, in order.\nIn any case, if the pattern specifies no captures, then it behaves as if the whole pattern was inside a capture.\nIf the value returned by the table query or by the function call is a string or a number, then it is used as the replacement string; otherwise, if it is false or nil, then there is no replacement (that is, the original match is kept in the string).'
                    },
                    len: {
                        type: TF,
                        args: [{name: 's'}],
                        description: 'Receives a string and returns its length. The empty string "" has length 0. Embedded zeros are counted, so "a\\000bc\\000" has length 5.'
                    },
                    lower: {
                        type: TF,
                        args: [{name: 's'}],
                        description: 'Receives a string and returns a copy of this string with all uppercase letters changed to lowercase. All other characters are left unchanged. The definition of what an uppercase letter is depends on the current locale.'
                    },
                    match: {
                        type: TF,
                        args: [{name: 's'}, {name: 'pattern'}, {name: 'init', optional: true}],
                        description: 'Looks for the first match of pattern (see §6.4.1) in the string s. If it finds one, then match returns the captures from the pattern; otherwise it returns nil. If pattern specifies no captures, then the whole match is returned. A third, optional numeric argument init specifies where to start the search; its default value is 1 and can be negative.'
                    },
                    pack: {
                        type: TF,
                        args: [{name: 'fmt'}, {name: 'v1'}, {name: 'v2'}, {name: '···'}],
                        description: 'Returns a binary string containing the values v1, v2, etc. packed (that is, serialized in binary form) according to the format string fmt (see §6.4.2).'
                    },
                    packsize: {
                        type: TF,
                        args: [{name: 'fmt'}],
                        description: 'Returns the size of a string resulting from string.pack with the given format. The format string cannot have the variable-length options "s" or "z" (see §6.4.2).'
                    },
                    rep: {
                        type: TF,
                        args: [{name: 's'}, {name: 'n'}, {name: 'sep', optional: true}],
                        description: 'Returns a string that is the concatenation of n copies of the string s separated by the string sep. The default value for sep is the empty string (that is, no separator). Returns the empty string if n is not positive.\n(Note that it is very easy to exhaust the memory of your machine with a single call to this function.)'
                    }, 
                    reverse: {
                        type: TF,
                        args: [{name: 's'}],
                        description: 'Returns a string that is the string s reversed.'
                    }, 
                    sub: {
                        type: TF,
                        args: [{name: 's'}, {name: 'i'}, {name: 'j', optional: true}],
                        description: 'Returns the substring of s that starts at i and continues until j; i and j can be negative. If j is absent, then it is assumed to be equal to -1 (which is the same as the string length). In particular, the call string.sub(s,1,j) returns a prefix of s with length j, and string.sub(s, -i) (for a positive i) returns a suffix of s with length i.\nIf, after the translation of negative indices, i is less than 1, it is corrected to 1. If j is greater than the string length, it is corrected to that length. If, after these corrections, i is greater than j, the function returns the empty string. '
                    }, 
                    unpack: {
                        type: TF,
                        args: [{name: 'fmt'}, {name: 's'}, {name: 'pos', optional: true}],
                        description: 'Returns the values packed in string s (see string.pack) according to the format string fmt (see §6.4.2). An optional pos marks where to start reading in s (default is 1). After the read values, this function also returns the index of the first unread byte in s.'
                    }, 
                    upper: {
                        type: TF,
                        args: [{name: 's'}],
                        description: 'Receives a string and returns a copy of this string with all lowercase letters changed to uppercase. All other characters are left unchanged. The definition of what a lowercase letter is depends on the current locale.'
                    }  
                }
            }
        }
    }

    return DEF
    
})()