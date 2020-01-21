var AUTOCOMPLETE = ((global, $)=>{
  "use strict";


    const MANUAL_BASE_URL = 'https://www.lua.org/manual/5.3/manual.html#'

    const TO = 'object'
    const TF = 'function'
    const TV = 'variable'
    const TA = 'argument'

    const LIB_TITLES = {
        'stormworks': 'Stormworks API',
        'dev': 'Dev API (Editor Only)',
        'lua': 'Lua API',
        'user': 'User defined (that\'s you!)'
    }

    const AUTOCOMPLETITIONS = {
        children: {
            screen: {
                type: TO,
                lib: 'stormworks',
                description: 'Used to show stuff on the video output. Can only be called within the onDraw function!',
                children: {
                    setColor: {
                        type: TF,
                        args: '(r, g, b [, a])',
                        description: 'Set the current draw color. Values range from 0 - 255. A is optional.'
                    },
                    drawClear: {
                        type: TF,
                        args: '()',
                        description: 'Clear the screen with the current color (paints the whole screen).'
                    },
                    drawLine: {
                        type: TF,
                        args: '(x1, y1, x2, y2)',
                        description: 'Draw a line from (x1,y1) to (x2,y2).'
                    },
                    drawCircle: {
                        type: TF,
                        args: '(x, y, radius)',
                        description: 'Draw a circle at (x,y) with radius.'
                    },
                    drawCircleF: {
                        type: TF,
                        args: '(x, y, radius)',
                        description: 'Draw a filled circle at (x,y) with radius.'
                    },
                    drawRect: {
                        type: TF,
                        args: '(x, y, width, height)',
                        description: 'Draw a rectangle at (x,y) with width and height.'
                    },
                    drawRectF: {
                        type: TF,
                        args: '(x, y, width, height)',
                        description: 'Draw a filled rectangle at (x,y) with width and height.'
                    },
                    drawTriangle: {
                        type: TF,
                        args: '(x1, y1, x2, y2, x3, y3)',
                        description: 'Draw a triangle between (x1,y1), (x2,y2) and (x3,y3).'
                    },
                    drawTriangleF: {
                        type: TF,
                        args: '(x1, y1, x2, y2, x3, y3)',
                        description: 'Draw a filled triangle between (x1,y1), (x2,y2) and (x3,y3).'
                    },
                    drawText: {
                        type: TF,
                        args: '(x, y, text)',
                        description: 'Draw text at (x,y). Each character is 4 pixels wide and 5 pixels tall.'
                    },
                    drawTextBox: {
                        type: TF,
                        args: '(x, y, width, height, text [, h_align, v_align])',
                        description: 'Draw text within a rectangle at (x,y) with width and height. Text alignment can be specified using the last two parameters and ranges from -1 to 1 (left to right, top to bottom). If either of the alignment paramters are omitted, the text will be drawn top-left by default. Text will automatically wrap at spaces when possible, and will overflow the top/bottom of the specified rectangle if too large. THIS IS NOT 100% LIKE INGAME BUT ALMOST!'
                    },
                    drawMap: {
                        type: TF,
                        args: '(x, y, zoom)',
                        description: 'Draw the world map centered on map coordinate (x,y) with zoom level ranging from 0.1 to 50'
                    },
                    setMapColorOcean: {
                        type: TF,
                        args: '(r, g, b [, a])',
                        description: 'Set the color for ocean map pixels. Values range from 0 - 255, a is optional.'
                    },
                    setMapColorShallows: {
                        type: TF,
                        args: '(r, g, b [, a])',
                        description: 'Set the color for shallows map pixels. Values range from 0 - 255, a is optional.'
                    },
                    setMapColorLand: {
                        type: TF,
                        args: '(r, g, b [, a])',
                        description: 'Set the color for land map pixels. Values range from 0 - 255, a is optional.'
                    },
                    setMapColorGrass: {
                        type: TF,
                        args: '(r, g, b [, a])',
                        description: 'Set the color for grass map pixels. Values range from 0 - 255, a is optional.'
                    },
                    setMapColorSand: {
                        type: TF,
                        args: '(r, g, b [, a])',
                        description: 'Set the color for sand map pixels. Values range from 0 - 255, a is optional.'
                    },
                    setMapColorSnow: {
                        type: TF,
                        args: '(r, g, b [, a])',
                        description: 'Set the color for snow map pixels. Values range from 0 - 255, a is optional.'
                    },
                    getWidth: {
                        type: TF,
                        args: '()',
                        description: 'Returns the width of the monitor currently being rendered to'
                    },
                    getHeight: {
                        type: TF,
                        args: '()',
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
                        args: '(mapX, mapY, zoom, screenW, screenH, pixelX, pixelY)',
                        description: 'Convert pixel coordinates into world coordinates'
                    },
                    mapToScreen: {
                        type: TF,
                        args: '(mapX, mapY, zoom, screenW, screenH, worldX, worldY)',
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
                        args: '(index)',
                        description: 'Read the boolean value of the input composite on index. Index ranges from 1 - 32'                        
                    },
                    getNumber: {
                        type: TF,
                        args: '(index)',
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
                        args: '(index)',
                        description: 'Sets the boolean value of the output composite on index to value. Index ranges from 1 - 32.'                        
                    },
                    setNumber: {
                        type: TF,
                        args: '(index)',
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
                        args: '(index, value)',
                        description: 'Sets the boolean value of the output composite on index to value. Index ranges from 1 - 32'                        
                    },
                    setNumber: {
                        type: TF,
                        args: '(index, value)',
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
                        args: '(label)',
                        description: 'Reads the boolean value of the property with the specified label'                        
                    },
                    getNumber: {
                        type: TF,
                        args: '(label)',
                        description: 'Reads the number value of the property with the specified label'                        
                    },
                    getText: {
                        type: TF,
                        args: '(label)',
                        description: 'Reads the string value of the property with the specified label'                        
                    }
                }
            },
            timer: {
                type: TO,
                lib: 'dev',
                description: 'Measue how long your code needs to execute.',
                children: {
                    start: {
                        type: TF,
                        args: '()',
                        description: 'Starts the timer.'                        
                    },
                    stop: {
                        type: TF,
                        args: '()',
                        description: 'Stops the timer and prints the time to the console.'                        
                    }
                }
            },
            print: {
                type: TF,
                lib: 'dev',
                args: '(text)',
                description: 'Prints text to the console.'
            },            
            printColor: {
                type: TF,
                lib: 'dev',
                args: '(r, g, b)',
                description: 'Colorizes the console output of print().'
            },
            pairs: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: '(t)',
                description: 'If t has a metamethod __pairs, calls it with t as argument and returns the first three results from the call.\nOtherwise, returns three values: the next function, the table t, and nil, so that the construction\n     for k,v in pairs(t) do body end\nwill iterate over all key–value pairs of table t.\nSee function next for the caveats of modifying the table during its traversal.'
            },
            ipairs: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: '(t)',
                description: 'Returns three values (an iterator function, the table t, and 0) so that the construction\nfor i,v in ipairs(t) do body end\nwill iterate over the key–value pairs (1,t[1]), (2,t[2]), ..., up to the first nil value.'
            },
            next: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: '(table [, index])',
                description: 'Allows a program to traverse all fields of a table. Its first argument is a table and its second argument is an index in this table. next returns the next index of the table and its associated value. When called with nil as its second argument, next returns an initial index and its associated value. When called with the last index, or with nil in an empty table, next returns nil. If the second argument is absent, then it is interpreted as nil. In particular, you can use next(t) to check whether a table is empty.\nThe order in which the indices are enumerated is not specified, even for numeric indices. (To traverse a table in numerical order, use a numerical for.)\nThe behavior of next is undefined if, during the traversal, you assign any value to a non-existent field in the table. You may however modify existing fields. In particular, you may clear existing fields.'
            },
            tostring: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: '(v)',
                description: 'Receives a value of any type and converts it to a string in a human-readable format. (For complete control of how numbers are converted, use string.format.)\nIf the metatable of v has a __tostring field, then tostring calls the corresponding value with v as argument, and uses the result of the call as its result.'
            },
            tonumber: {
                type: TF,
                lib: 'lua',
                url: 'https://www.lua.org/manual/5.3/manual.html#6.1',
                args: '(e [,base])',
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
                        args: '(x)',
                        description: 'Returns the absolute value of x. (integer/float) '
                    },
                    acos: {
                        type: TF,
                        args: '(x)',
                        description: 'Returns the arc cosine of x (in radians). '
                    },
                    asin: {
                        type: TF,
                        args: '(x)',
                        description: 'Returns the arc sine of x (in radians). '
                    },
                    atan: {
                        type: TF,
                        args: '(y [,x])',
                        description: ' Returns the arc tangent of y/x (in radians), but uses the signs of both arguments to find the quadrant of the result. (It also handles correctly the case of x being zero.)\nThe default value for x is 1, so that the call math.atan(y) returns the arc tangent of y.'
                    },
                    ceil: {
                        type: TF,
                        args: '(x)',
                        description: 'Returns the smallest integral value larger than or equal to x.'
                    },
                    cos: {
                        type: TF,
                        args: '(x)',
                        description: 'Returns the cosine of x (assumed to be in radians).'
                    },
                    deg: {
                        type: TF,
                        args: '(x)',
                        description: 'Converts the angle x from radians to degrees.'
                    },
                    exp: {
                        type: TF,
                        args: '(x)',
                        description: 'Returns the value ex (where e is the base of natural logarithms).'
                    },
                    floor: {
                        type: TF,
                        args: '(x)',
                        description: 'Returns the largest integral value smaller than or equal to x.'
                    },
                    fmod: {
                        type: TF,
                        args: '(x, y)',
                        description: 'Returns the remainder of the division of x by y that rounds the quotient towards zero. (integer/float)'
                    },
                    huge: {
                        type: TF,
                        args: '()',
                        description: 'The float value HUGE_VAL, a value larger than any other numeric value.'
                    },
                    max: {
                        type: TF,
                        args: '(x, ···)',
                        description: 'Returns the argument with the maximum value, according to the Lua operator <. (integer/float)'
                    },
                    maxinteger: {
                        type: TF,
                        args: '()',
                        description: 'An integer with the maximum value for an integer. '
                    },
                    min: {
                        type: TF,
                        args: '(x, ···)',
                        description: 'Returns the argument with the minimum value, according to the Lua operator <. (integer/float)'
                    },
                    mininteger: {
                        type: TF,
                        args: '()',
                        description: 'An integer with the minimum value for an integer. '
                    },
                    modf: {
                        type: TF,
                        args: '(x)',
                        description: 'Returns the integral part of x and the fractional part of x. Its second result is always a float.'
                    },
                    pi: {
                        type: TV,
                        description: 'The value of π.'
                    },
                    rad: {
                        type: TF,
                        args: '(x)',
                        description: 'Converts the angle x from degrees to radians.'
                    },
                    random: {
                        type: TF,
                        args: '[m [, n]]',
                        description: ' When called without arguments, returns a pseudo-random float with uniform distribution in the range [0,1). When called with two integers m and n, math.random returns a pseudo-random integer with uniform distribution in the range [m, n]. (The value n-m cannot be negative and must fit in a Lua integer.) The call math.random(n) is equivalent to math.random(1,n).\nThis function is an interface to the underling pseudo-random generator function provided by C.'
                    },
                    randomseed: {
                        type: TF,
                        args: '(x)',
                        description: 'Sets x as the "seed" for the pseudo-random generator: equal seeds produce equal sequences of numbers.'
                    },
                    sin: {
                        type: TF,
                        args: '(x)',
                        description: 'Returns the sine of x (assumed to be in radians).'
                    },
                    sqrt: {
                        type: TF,
                        args: '(x)',
                        description: 'Returns the square root of x. (You can also use the expression x^0.5 to compute this value.)'
                    },
                    tan: {
                        type: TF,
                        args: '(x)',
                        description: 'Returns the tangent of x (assumed to be in radians).'
                    },
                    tointeger: {
                        type: TF,
                        args: '(x)',
                        description: 'If the value x is convertible to an integer, returns that integer. Otherwise, returns nil.'
                    },
                    type: {
                        type: TF,
                        args: '(x)',
                        description: 'Returns "integer" if x is an integer, "float" if it is a float, or nil if x is not a number.'
                    },
                    ult: {
                        type: TF,
                        args: '(m, n)',
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
                        args: '(list [, sep [, i [, j]]])',
                        description: 'Given a list where all elements are strings or numbers, returns the string list[i]..sep..list[i+1] ··· sep..list[j]. The default value for sep is the empty string, the default for i is 1, and the default for j is #list. If i is greater than j, returns the empty string.'
                    },
                    insert: {
                        type: TF,
                        args: '(list, [pos,] value)',
                        description: 'Inserts element value at position pos in list, shifting up the elements list[pos], list[pos+1], ···, list[#list]. The default value for pos is #list+1, so that a call table.insert(t,x) inserts x at the end of list t.'
                    },
                    move: {
                        type: TF,
                        args: '(a1, f, e, t [,a2])',
                        description: ' Moves elements from table a1 to table a2, performing the equivalent to the following multiple assignment: a2[t],··· = a1[f],···,a1[e]. The default for a2 is a1. The destination range can overlap with the source range. The number of elements to be moved must fit in a Lua integer.\nReturns the destination table a2.'
                    },
                    pack: {
                        type: TF,
                        args: '(···)',
                        description: 'Returns a new table with all arguments stored into keys 1, 2, etc. and with a field "n" with the total number of arguments. Note that the resulting table may not be a sequence.'
                    },
                    remove: {
                        type: TF,
                        args: '(list [, pos])',
                        description: ' Removes from list the element at position pos, returning the value of the removed element. When pos is an integer between 1 and #list, it shifts down the elements list[pos+1], list[pos+2], ···, list[#list] and erases element list[#list]; The index pos can also be 0 when #list is 0, or #list + 1; in those cases, the function erases the element list[pos].\nThe default value for pos is #list, so that a call table.remove(l) removes the last element of list l.'
                    },
                    sort: {
                        type: TF,
                        args: '(list [, comp])',
                        description: ' Sorts list elements in a given order, in-place, from list[1] to list[#list]. If comp is given, then it must be a function that receives two list elements and returns true when the first element must come before the second in the final order (so that, after the sort, i < j implies not comp(list[j],list[i])). If comp is not given, then the standard Lua operator < is used instead.\nNote that the comp function must define a strict partial order over the elements in the list; that is, it must be asymmetric and transitive. Otherwise, no valid sort may be possible.\nThe sort algorithm is not stable: elements considered equal by the given order may have their relative positions changed by the sort.'
                    },
                    unpack: {
                        type: TF,
                        args: '(list [, i [, j]])',
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
                        args: '(s [, i [, j]])',
                        description: 'Returns the internal numeric codes of the characters s[i], s[i+1], ..., s[j]. The default value for i is 1; the default value for j is i. These indices are corrected following the same rules of function string.sub.\nNumeric codes are not necessarily portable across platforms.'
                    },
                    char: {
                        type: TF,
                        args: '(···)',
                        description: 'Receives zero or more integers. Returns a string with length equal to the number of arguments, in which each character has the internal numeric code equal to its corresponding argument.\nNumeric codes are not necessarily portable across platforms.'
                    },
                    dump: {
                        type: TF,
                        args: 'function [, strip]',
                        description: ' Returns a string containing a binary representation (a binary chunk) of the given function, so that a later load on this string returns a copy of the function (but with new upvalues). If strip is a true value, the binary representation may not include all debug information about the function, to save space.\nFunctions with upvalues have only their number of upvalues saved. When (re)loaded, those upvalues receive fresh instances containing nil. (You can use the debug library to serialize and reload the upvalues of a function in a way adequate to your needs.)'
                    },
                    find: {
                        type: TF,
                        args: '(s, pattern [, init [, plain]])',
                        description: ' Looks for the first match of pattern (see §6.4.1) in the string s. If it finds a match, then find returns the indices of s where this occurrence starts and ends; otherwise, it returns nil. A third, optional numeric argument init specifies where to start the search; its default value is 1 and can be negative. A value of true as a fourth, optional argument plain turns off the pattern matching facilities, so the function does a plain "find substring" operation, with no characters in pattern being considered magic. Note that if plain is given, then init must be given as well.\nIf the pattern has captures, then in a successful match the captured values are also returned, after the two indices.'
                    },
                    format: {
                        type: TF,
                        args: '(formatstring, ···)',
                        description: ' Returns a formatted version of its variable number of arguments following the description given in its first argument (which must be a string). The format string follows the same rules as the ISO C function sprintf. The only differences are that the options/modifiers *, h, L, l, n, and p are not supported and that there is an extra option, q.\nThe q option formats a string between double quotes, using escape sequences when necessary to ensure that it can safely be read back by the Lua interpreter. For instance, the call\n     string.format("%q", "a string with "quotes" and \n new line")\nmay produce the string:\n     "a string with \"quotes\" and \\n      new line"\nOptions A, a, E, e, f, G, and g all expect a number as argument. Options c, d, i, o, u, X, and x expect an integer. When Lua is compiled with a C89 compiler, options A and a (hexadecimal floats) do not support any modifier (flags, width, length).\nOption s expects a string; if its argument is not a string, it is converted to one following the same rules of tostring. If the option has any modifier (flags, width, length), the string argument should not contain embedded zeros.'
                    },
                    gmatch: {
                        type: TF,
                        args: '(s, pattern)',
                        description: 'Returns an iterator function that, each time it is called, returns the next captures from pattern (see §6.4.1) over the string s. If pattern specifies no captures, then the whole match is produced in each call.\nAs an example, the following loop will iterate over all the words from string s, printing one per line:\n     s = "hello world from Lua"\n     for w in string.gmatch(s, "%a+") do\n       print(w)\n     end\nThe next example collects all pairs key=value from the given string into a table:\n     t = {}\n     s = "from=world, to=Lua"\n     for k, v in string.gmatch(s, "(%w+)=(%w+)") do\n       t[k] = v\n     end\nFor this function, a caret "^" at the start of a pattern does not work as an anchor, as this would prevent the iteration.'
                    },
                    gsub: {
                        type: TF,
                        args: '(s, pattern, repl [, n])',
                        description: '\nReturns a copy of s in which all (or the first n, if given) occurrences of the pattern (see §6.4.1) have been replaced by a replacement string specified by repl, which can be a string, a table, or a function. gsub also returns, as its second value, the total number of matches that occurred. The name gsub comes from Global SUBstitution.\nIf repl is a string, then its value is used for replacement. The character % works as an escape character: any sequence in repl of the form %d, with d between 1 and 9, stands for the value of the d-th captured substring. The sequence %0 stands for the whole match. The sequence %% stands for a single %.\nIf repl is a table, then the table is queried for every match, using the first capture as the key.\nIf repl is a function, then this function is called every time a match occurs, with all captured substrings passed as arguments, in order.\nIn any case, if the pattern specifies no captures, then it behaves as if the whole pattern was inside a capture.\nIf the value returned by the table query or by the function call is a string or a number, then it is used as the replacement string; otherwise, if it is false or nil, then there is no replacement (that is, the original match is kept in the string).'
                    },
                    len: {
                        type: TF,
                        args: '(s)',
                        description: 'Receives a string and returns its length. The empty string "" has length 0. Embedded zeros are counted, so "a\\000bc\\000" has length 5.'
                    },
                    lower: {
                        type: TF,
                        args: '(s)',
                        description: 'Receives a string and returns a copy of this string with all uppercase letters changed to lowercase. All other characters are left unchanged. The definition of what an uppercase letter is depends on the current locale.'
                    },
                    match: {
                        type: TF,
                        args: '(s, pattern [, init])',
                        description: 'Looks for the first match of pattern (see §6.4.1) in the string s. If it finds one, then match returns the captures from the pattern; otherwise it returns nil. If pattern specifies no captures, then the whole match is returned. A third, optional numeric argument init specifies where to start the search; its default value is 1 and can be negative.'
                    },
                    pack: {
                        type: TF,
                        args: '(fmt, v1, v2, ···)',
                        description: 'Returns a binary string containing the values v1, v2, etc. packed (that is, serialized in binary form) according to the format string fmt (see §6.4.2).'
                    },
                    packsize: {
                        type: TF,
                        args: '(fmt)',
                        description: 'Returns the size of a string resulting from string.pack with the given format. The format string cannot have the variable-length options "s" or "z" (see §6.4.2).'
                    },
                    rep: {
                        type: TF,
                        args: '(s, n [, sep])',
                        description: 'Returns a string that is the concatenation of n copies of the string s separated by the string sep. The default value for sep is the empty string (that is, no separator). Returns the empty string if n is not positive.\n(Note that it is very easy to exhaust the memory of your machine with a single call to this function.)'
                    }, 
                    reverse: {
                        type: TF,
                        args: '(s)',
                        description: 'Returns a string that is the string s reversed.'
                    }, 
                    sub: {
                        type: TF,
                        args: '(s, i [, j])',
                        description: 'Returns the substring of s that starts at i and continues until j; i and j can be negative. If j is absent, then it is assumed to be equal to -1 (which is the same as the string length). In particular, the call string.sub(s,1,j) returns a prefix of s with length j, and string.sub(s, -i) (for a positive i) returns a suffix of s with length i.\nIf, after the translation of negative indices, i is less than 1, it is corrected to 1. If j is greater than the string length, it is corrected to that length. If, after these corrections, i is greater than j, the function returns the empty string. '
                    }, 
                    unpack: {
                        type: TF,
                        args: '(fmt, s [, pos])',
                        description: 'Returns the values packed in string s (see string.pack) according to the format string fmt (see §6.4.2). An optional pos marks where to start reading in s (default is 1). After the read values, this function also returns the index of the first unread byte in s.'
                    }, 
                    upper: {
                        type: TF,
                        args: '(s)',
                        description: 'Receives a string and returns a copy of this string with all lowercase letters changed to uppercase. All other characters are left unchanged. The definition of what a lowercase letter is depends on the current locale.'
                    }  
                }
            }
        }
    }
    let PARSED_AUTOCOMPLETITIONS
    parseAUTOCOMPLETITIONS()

    let autocompletitionIsShown = false
    let currentAutocomplete

    $(global).on('load', init)

    function init(){
        editor.commands.addCommand({
            name: 'autocompletition',
            bindKey: {win: 'Ctrl-Space',  mac: 'Command-Space'},
            exec: (editor)=>{
                suggestAutocomplete()
            },
            readOnly: false
        })

        $('#code').contextmenu((e)=>{
            e.preventDefault()
            e.stopImmediatePropagation()
           
            suggestAutocomplete()
        })
    }

    function suggestAutocomplete(){
        let pos = editor.getCursorPosition()
        if(!pos){
            return
        }
        let word = getWordInFrontOfPosition(pos.row, pos.column)
        let [autocompletitions, part] = getAutocompletitions(word)
        console.log('suggestAutocomplete(' + word + ')', autocompletitions)
        showAutocompletitions($('#autocompletition-container'), autocompletitions, part)
    }

    function getWordInFrontOfPosition(row, column){
        let line = editor.session.getLine(row)
        let lineUntilPosition = line.substring(0, column)
        let matches = lineUntilPosition.match(/(.*[\s;\),\(\+\-\*\/\%\=])?([^\s\(]*)/)
        if(matches instanceof Array === false || matches.length !== 3){
            return ''
        }
        return matches[2]
    }

    function getAutocompletitions(text){
        let parts = text.split('.').reverse()
        let tmp = JSON.parse(JSON.stringify(PARSED_AUTOCOMPLETITIONS))

        let keywords = getKeywordsFromCode()
        for(let k of Object.keys(keywords)){
            tmp.children[k] = keywords[k]
        }
        let node = tmp
        let partLeft = ''
        let path = ''
        while(parts.length > 0){
            let p = parts.pop()
            if(parts.length > 0 && node.children && node.children[p]){
                path += '.' + p
                node = node.children[p]
            } else {
                partLeft = partLeft.length === 0 ? p : partLeft + '.' + p
            }
        }

        path = path.substring(1)

        let ret = []
        if(node.children){
            for(let [key, value] of Object.entries(node.children)) {
              if(!partLeft.length > 0 || key.indexOf(partLeft) === 0){                
                ret.push({name: key, type: value.type, lib: value.lib, url: value.url, args: value.args || '', description: value.description || '...', full: path + '.' + key})
              }
            }
        }
        return [ret, partLeft]
    }

    function getKeywordsFromCode(){
        let ret = {}

        let code = editor.getValue()
        if(typeof code === 'string'){
            let vars = [...code.matchAll(/[\s;]?([a-zA-Z0-9\.]+)[\s]*?=/g)]
            let functionHeads = [...code.matchAll(/function [\w]+[\s]*\([\s]*([^\)]+)[\s]*\)/g)]
            let functionArguments = []
            for(let fh of functionHeads){
                let split = fh[1].replace(/\s/g, '').split(',')
                for(let s of split){
                    functionArguments.push({
                        0: fh[0],
                        1: s,
                        index: fh.index,
                        input: fh.input,
                        length: 2
                    })
                }
            }
            let functions = [...code.matchAll(/function[\s]+([a-zA-Z0-9\.]+)\(/g)]

            addToRet(vars, TV)
            addToRet(functions, TF)
            addToRet(functionArguments, TA)

            function addToRet(matches, type){

                for(let m of matches){
                    let parts = m[1].split('.').reverse()

                    let documentPosition = editor.session.getDocument().indexToPosition(m.index+1, 0)

                    let node = ret

                    while(parts.length > 0){
                        let p = parts.pop()
                        if(!node[p]){
                            if(parts.length > 0){//has children
                                node[p] = {
                                    type: TO,
                                    lib: 'user',
                                    description: 'Defined on LINE ' + (1 + documentPosition.row),
                                    children: {}
                                }
                                node = node[p].children
                            } else {
                                node[p] = {
                                    type: type,
                                    lib: 'user',
                                    description: 'Defined on LINE ' + (1 + documentPosition.row)
                                }
                                node = node[p]
                            }
                        } else {
                            if(parts.length > 0){
                                if(!node[p].children){
                                    node[p] = {
                                        type: TO,
                                        lib: 'user',
                                        description: 'Defined on LINE ' + (1 + documentPosition.row),
                                        children: {}
                                    }
                                }
                                node = node[p].children
                            } else {
                                node = node[p]                                
                            }
                        }
                    }
                }
            }
        }
        return ret
    }

    function parseDescription(description){
        return description.replace(/§([\d\.]*)/g, (match, p1)=>{
            return parseUrl(MANUAL_BASE_URL + p1)
        }).replace(/\n/g, '<br>')
    }

    function parseUrl(url){
        let label = url
        if(url.indexOf(MANUAL_BASE_URL) >= 0){
            label = 'Lua Manual §' + url.split('#')[1]
        }
        return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + label + '</a>'
    }

    function parseAUTOCOMPLETITIONS(){
        PARSED_AUTOCOMPLETITIONS = JSON.parse(JSON.stringify(AUTOCOMPLETITIONS))

        function _do(node, parent){
            if(typeof node.description === 'string'){
                node.description = parseDescription(node.description)
            }
            if(typeof node.url === 'string'){
                node.url = parseUrl(node.url)
            } else if(parent && typeof parent.url === 'string'){
                node.url = parent.url
            }
            if(parent && parent.lib){
                node.lib = parent.lib
            }
            if(node.children){
                for(let k of Object.keys(node.children)){
                    _do(node.children[k], node)
                }
            }
        }

        _do(PARSED_AUTOCOMPLETITIONS)
    }

    function getAllAUTOCOMPLETITIONSParsed(){
        return PARSED_AUTOCOMPLETITIONS
    }

    function showAutocompletitions(container, completitions, part){
        if(autocompletitionIsShown){
            closeAutocomplete()
        }
        autocompletitionIsShown = true

        let $c = $(container)
        $c.html('')

        currentAutocomplete = new AutocompletitionElement(completitions, part)

        $c.append(currentAutocomplete.getDom())

        let cursor = $('#code .ace_cursor').offset()
        let containerpos = $('#code-container').offset()

        let top = cursor.top - containerpos.top
        let left = cursor.left - containerpos.left
        if(left + $c.width() > $(window).width()){
            left = left - $c.width()
        }

        $c.css({
            'top': top,//top + 'px + ' + $('#code').css('font-size'),
            'left': left + 3,
            'font-size': $('#code').css('font-size')
        })
    }

    function closeAutocomplete(){
        console.log('closing currentAutocomplete')
        autocompletitionIsShown = false
        $('#autocompletition-container').html('')
        currentAutocomplete = null
        editor.focus()
    }

    return {
        suggestAutocomplete: suggestAutocomplete,
        getWordInFrontOfPosition: getWordInFrontOfPosition,
        getAutocompletitions: getAutocompletitions,
        showAutocompletitions: showAutocompletitions,
        closeAutocomplete: closeAutocomplete,
        TO: TO,
        TF: TF,
        TV: TV,
        TA: TA,
        LIB_TITLES: LIB_TITLES,
        getAllAutocompletitions: ()=>{ return AUTOCOMPLETITIONS; },
        getAllAUTOCOMPLETITIONSParsed: getAllAUTOCOMPLETITIONSParsed
    }

})(window, jQuery)










function AutocompletitionElement(completitions, part){
    this.$dom = $('<div class="autocompletition"></div>')
    this.$list = $('<div class="list"></div>')
    this.$dom.append(this.$list)
    this.$descriptions = $('<div class="descriptions"></div>')
    this.$dom.append(this.$descriptions)

    this.completitions = completitions
    this.part = part

    this.$input = $('<input type="text" />')
    this.$dom.append(this.$input)

    this.click = false
    this.blockMouseEnter = false

    if(completitions instanceof Array === false || completitions.length === 0){
        this.$list.append('<div class="empty">nothing found</div>')
    } else {
        let id = 0
        for(let c of completitions) {
            const myid = id
            let cdescription = $('<div class="description" aid="' + id + '" atype="' + c.type + '" ' + (c.lib ? 'lib="' + c.lib + '"' : '') + '><div class="top"><div class="name">' + c.name + '</div><div class="args">' + c.args + '</div></div>' + (c.lib ? '<div class="lib_title">' + AUTOCOMPLETE.LIB_TITLES[c.lib] + '</div>' : '') + (c.url ? '<div class="url">' + c.url + '</div>' : '') + '<div class="text">' + c.description + '</div></div>')
            this.$descriptions.append(cdescription)

            let centry = $('<div class="entry" aid="' + id + '" afull="' + c.full + '" atype="' + c.type + '" ' + (c.lib ? 'lib="' + c.lib + '"' : '') + '><div class="name">' + c.name  + (c.type === AUTOCOMPLETE.TF ? '()' : '') + '</div><div class="type">' + c.type + '</div></div>')
            this.$list.append(centry)
            centry.get(0).completition = c
            centry.on('click', ()=>{
                this.click = true
                this.insertAutoCompletition(c)
            })
            centry.mouseenter(()=>{
                if(this.blockMouseEnter){
                    return
                }
                this.select(myid, false)
            })
            id++
        }
        this.selected = 0
        setTimeout(()=>{
            this.select(this.selected)
        }, 200)
    }


    this.$input.on('keydown', (e)=>{
        if(e.keyCode === 40){//arrow down
            e.preventDefault()
            e.stopImmediatePropagation()

            this.arrowDown()
        } else if (e.keyCode === 38){//arrow up
            e.preventDefault()
            e.stopImmediatePropagation()

            this.arrowUp()
        } else if (e.keyCode === 27){//esc
            e.preventDefault()
            e.stopImmediatePropagation()

            AUTOCOMPLETE.closeAutocomplete()
        } else if(e.keyCode === 13) {//enter
            e.preventDefault()
            e.stopImmediatePropagation()

            if(this.$list.find('.entry.selected').get(0)){
                this.insertAutoCompletition( this.$list.find('.entry.selected').get(0).completition )
            } else {
                AUTOCOMPLETE.closeAutocomplete()                
            }
        } else {
            this.preventFocusOut = true
            editor.focus()
            $('#code .ace_text-input').trigger(e)
            setTimeout(AUTOCOMPLETE.suggestAutocomplete, 10)
        }
    })

    this.$input.on('focusout', ()=>{
        if(this.preventFocusOut){
            this.preventFocusOut = false
            return
        }
        setTimeout(()=>{
            if(!this.click){
                AUTOCOMPLETE.closeAutocomplete()
            }
        }, 300)
    })

    setTimeout(()=>{
        this.$input.focus()
    }, 100)
}

AutocompletitionElement.prototype.arrowDown = function() {
    console.log('arrowDown')
    if(this.$list.find('.entry').length > this.selected + 1){
        this.select(this.selected + 1, true)
    }
}

AutocompletitionElement.prototype.arrowUp = function() {
    if(this.selected - 1 < 0){
        AUTOCOMPLETE.closeAutocomplete()
        return
    }
    this.select(this.selected - 1, true)
}

AutocompletitionElement.prototype.select = function(index, scroll) {
    let it = this.$list.find('.entry').get(index)
    if(it){
        this.selected = index
        this.$list.find('.entry.selected').removeClass('selected')
        $(it).addClass('selected').focus()
        
        this.$descriptions.find('.description').hide()
        $('.description[aid="' + index + '"]').show()

        $('.descriptions').css({
            left: '100%',
            top: 0,
        })

        let length = Math.max(this.$descriptions.find('.description[aid="' + index + '"] .text').html().length * 2, (this.$descriptions.find('.description[aid="' + index + '"] .name').html().length + 1 + this.$descriptions.find('.description[aid="' + index + '"] .args').html().length) * 3, this.$descriptions.find('.description[aid="' + index + '"] .lib_title').html().length * 3)
        let width = length
        if(width > 50){
            width = $('body').width() * 0.9 - this.$list.get(0).getBoundingClientRect().right
        }

        if(width < this.$list.width() && length > 50){
            width = this.$list.width()
            this.$descriptions.css({
                left: 0,
                top: this.$list.height(),
            })
        }
        this.$descriptions.css('width', width)
    }
    if(scroll){
        let top = $('.entry[aid="0"]').outerHeight() * this.selected
        this.blockMouseEnter = true
        this.$list.scrollTop(top)
        setTimeout(()=>{
            this.blockMouseEnter = false
        }, 100)
    }
}

AutocompletitionElement.prototype.getDom = function() {
    return this.$dom
}

AutocompletitionElement.prototype.insertAutoCompletition = function(completition) {
    let split = completition.full.split('.')
    let text = split[split.length-1]
    if(typeof this.part === 'string'){
        text = text.replace(this.part, '')
    }
    if(completition.type === AUTOCOMPLETE.TO){
        text += '.'
    } else if(completition.type === AUTOCOMPLETE.TF){
        let args = completition.args ? completition.args : '()'
        text += args
        setTimeout(()=>{
            editor.navigateLeft(args.length - 1)
        }, 10)
    }
    editor.insert(text)
    AUTOCOMPLETE.closeAutocomplete()
}
