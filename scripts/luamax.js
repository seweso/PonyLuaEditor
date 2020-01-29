/*! luamax v1.0.0 by CrazyFluffyPony */
;(function(root) {

    // Detect free variables `exports`
    var freeExports = typeof exports == 'object' && exports;

    // Detect free variable `module`
    var freeModule = typeof module == 'object' && module &&
        module.exports == freeExports && module;

    // Detect free variable `global`, from Node.js or Browserified code,
    // and use it as `root`
    var freeGlobal = typeof global == 'object' && global;
    if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
        root = freeGlobal;
    }

    /*--------------------------------------------------------------------------*/

    var luaparse = root.luaparse || require('luaparse');
    luaparse.defaultOptions.comments = false;
    luaparse.defaultOptions.scope = true;
    var parse = luaparse.parse;

    var regexAlphaUnderscore = /[a-zA-Z_]/;
    var regexAlphaNumUnderscore = /[a-zA-Z0-9_]/;
    var regexDigits = /[0-9]/;

    // http://www.lua.org/manual/5.2/manual.html#3.4.7
    // http://www.lua.org/source/5.2/lparser.c.html#priority
    var PRECEDENCE = {
        'or': 1,
        'and': 2,
        '<': 3, '>': 3, '<=': 3, '>=': 3, '~=': 3, '==': 3,
        '..': 5,
        '+': 6, '-': 6, // binary -
        '*': 7, '/': 7, '%': 7,
        'unarynot': 8, 'unary#': 8, 'unary-': 8, // unary -
        '^': 10
    };

    var IDENTIFIER_PARTS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a',
        'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
        'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E',
        'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z', '_'];
    var IDENTIFIER_PARTS_MAX = IDENTIFIER_PARTS.length - 1;

    const NL = '\n'

    var tabs = function(level){
        var ret = ''
        while(level > 0){
            ret += '\t'
            level--
        }
        return ret
    }

    var each = function(array, fn) {
        var index = -1;
        var length = array.length;
        var max = length - 1;
        while (++index < length) {
            fn(array[index], index < max);
        }
    };

    var indexOf = function(array, value) {
        var index = -1;
        var length = array.length;
        while (++index < length) {
            if (array[index] == value) {
                return index;
            }
        }
    };

    var hasOwnProperty = {}.hasOwnProperty;
    var extend = function(destination, source) {
        var key;
        if (source) {
            for (key in source) {
                if (hasOwnProperty.call(source, key)) {
                    destination[key] = source[key];
                }
            }
        }
        return destination;
    };

    var generateZeroes = function(length) {
        var zero = '0';
        var result = '';
        if (length < 1) {
            return result;
        }
        if (length == 1) {
            return zero;
        }
        while (length) {
            if (length & 1) {
                result += zero;
            }
            if (length >>= 1) {
                zero += zero;
            }
        }
        return result;
    };

    // http://www.lua.org/manual/5.2/manual.html#3.1
    function isKeyword(id) {
        switch (id.length) {
            case 2:
                return 'do' == id || 'if' == id || 'in' == id || 'or' == id;
            case 3:
                return 'and' == id || 'end' == id || 'for' == id || 'nil' == id ||
                    'not' == id;
            case 4:
                return 'else' == id || 'goto' == id || 'then' == id || 'true' == id;
            case 5:
                return 'break' == id || 'false' == id || 'local' == id ||
                    'until' == id || 'while' == id;
            case 6:
                return 'elseif' == id || 'repeat' == id || 'return' == id;
            case 8:
                return 'function' == id;
        }
        return false;
    }
    var idMap
    var libIdMap
    var generateIdentifier = function(minifiedName, library) {
        // Preserve `self` in methods
        if (minifiedName == 'self') {
            return minifiedName;
        }

        if(library){
            if(libIdMap && libIdMap[library] && libIdMap[library][minifiedName]){
                return libIdMap[library][minifiedName]
            }
        } else {
            if(idMap && idMap[minifiedName]){
                return idMap[minifiedName]
            }
        }

        return minifiedName
    };

    /*--------------------------------------------------------------------------*/


    var formatBase = function(base) {
        var result = '';
        var type = base.type;
        var needsParens = base.inParens && (
            type == 'CallExpression' ||
            type == 'BinaryExpression' ||
            type == 'FunctionDeclaration' ||
            type == 'TableConstructorExpression' ||
            type == 'LogicalExpression' ||
            type == 'StringLiteral'
        );
        if (needsParens) {
            result += '(';
        }
        result += formatExpression(base);
        if (needsParens) {
            result += ')';
        }
        return result;
    };

    var formatExpression = function(expression, options) {

        options = extend({
            'precedence': 0,
            'preserveIdentifiers': false
        }, options);

        var result = '';
        var currentPrecedence;
        var associativity;
        var operator;

        var expressionType = expression.type;

        if (expressionType == 'Identifier') {

            result = !options.preserveIdentifiers || options && options.library
                ? generateIdentifier(expression.name, options ? options.library : undefined)
                : expression.name;

        } else if (
            expressionType == 'StringLiteral' ||
            expressionType == 'NumericLiteral' ||
            expressionType == 'BooleanLiteral' ||
            expressionType == 'NilLiteral' ||
            expressionType == 'VarargLiteral'
        ) {

            result = expression.raw;

        } else if (
            expressionType == 'LogicalExpression' ||
            expressionType == 'BinaryExpression'
        ) {

            // If an expression with precedence x
            // contains an expression with precedence < x,
            // the inner expression must be wrapped in parens.
            operator = expression.operator;
            currentPrecedence = PRECEDENCE[operator];
            associativity = 'left';

            result = formatExpression(expression.left, {
                'precedence': currentPrecedence,
                'direction': 'left',
                'parent': operator
            });
            result += ' ' + operator + ' ';
            result += formatExpression(expression.right, {
                'precedence': currentPrecedence,
                'direction': 'right',
                'parent': operator
            });

            if (operator == '^' || operator == '..') {
                associativity = "right";
            }

            if (
                currentPrecedence < options.precedence ||
                (
                    currentPrecedence == options.precedence &&
                    associativity != options.direction &&
                    options.parent != '+' &&
                    !(options.parent == '*' && (operator == '/' || operator == '*'))
                )
            ) {
                // The most simple case here is that of
                // protecting the parentheses on the RHS of
                // `1 - (2 - 3)` but deleting them from `(1 - 2) - 3`.
                // This is generally the right thing to do. The
                // semantics of `+` are special however: `1 + (2 - 3)`
                // == `1 + 2 - 3`. `-` and `+` are the only two operators
                // who share their precedence level. `*` also can
                // commute in such a way with `/`, but not with `%`
                // (all three share a precedence). So we test for
                // all of these conditions and avoid emitting
                // parentheses in the cases where we don’t have to.
                result = '(' + result + ')';
            }

        } else if (expressionType == 'UnaryExpression') {

            operator = expression.operator;
            currentPrecedence = PRECEDENCE['unary' + operator];

            result += formatExpression(expression.argument, {
                    'precedence': currentPrecedence
                })

            if (
                currentPrecedence < options.precedence &&
                // In principle, we should parenthesize the RHS of an
                // expression like `3^-2`, because `^` has higher precedence
                // than unary `-` according to the manual. But that is
                // misleading on the RHS of `^`, since the parser will
                // always try to find a unary operator regardless of
                // precedence.
                !(
                    (options.parent == '^') &&
                    options.direction == 'right'
                )
            ) {
                result = '(' + result + ')';
            }

        } else if (expressionType == 'CallExpression') {

            result = formatBase(expression.base) + '(';

            each(expression.arguments, function(argument, needsComma) {
                result += formatExpression(argument);
                if (needsComma) {
                    result += ',';
                }
            });
            result += ')';

        } else if (expressionType == 'TableCallExpression') {

            result = formatExpression(expression.base) +
                formatExpression(expression.arguments);

        } else if (expressionType == 'StringCallExpression') {

            result = formatExpression(expression.base) +
                formatExpression(expression.argument);

        } else if (expressionType == 'IndexExpression') {

            result = formatBase(expression.base) + '[' +
                formatExpression(expression.index) + ']';

        } else if (expressionType == 'MemberExpression') {

            result = formatBase(expression.base) + expression.indexer +
                formatExpression(expression.identifier, {
                    'preserveIdentifiers': true,
                    'library': expression.base.name
                });

        } else if (expressionType == 'FunctionDeclaration') {

            result = 'function(';
            if (expression.parameters.length) {
                each(expression.parameters, function(parameter, needsComma) {
                    // `Identifier`s have a `name`, `VarargLiteral`s have a `value`
                    result += parameter.name
                        ? generateIdentifier(parameter.name)
                        : parameter.value;
                    if (needsComma) {
                        result += ',';
                    }
                });
            }
            result += ')';
            result += formatStatementList(expression.body);
            result += 'end';

        } else if (expressionType == 'TableConstructorExpression') {

            result = '{';

            each(expression.fields, function(field, needsComma) {
                if (field.type == 'TableKey') {
                    result += '[' + formatExpression(field.key) + ']=' +
                        formatExpression(field.value);
                } else if (field.type == 'TableValue') {
                    result += formatExpression(field.value);
                } else { // at this point, `field.type == 'TableKeyString'`
                    result += formatExpression(field.key, {
                        // TODO: keep track of nested scopes (#18)
                        'preserveIdentifiers': true
                    }) + '=' + formatExpression(field.value);
                }
                if (needsComma) {
                    result += ',';
                }
            });

            result += '}';

        } else {

            throw TypeError('Unknown expression type: `' + expressionType + '`');

        }

        return result;
    };

    var formatStatementList = function(body, level) {
        var result = '';
        each(body, function(statement) {
            result += NL + formatStatement(statement, level);
        });
        return result;
    };

    var formatStatement = function(statement, level) {
        var result = '';
        var statementType = statement.type;

        if (statementType == 'AssignmentStatement') {

            // left-hand side
            each(statement.variables, function(variable, needsComma) {
                result += tabs(level) + formatExpression(variable);
                if (needsComma) {
                    result += ', ';
                }
            });

            // right-hand side
            result += ' = ';
            each(statement.init, function(init, needsComma) {
                result += formatExpression(init);
                if (needsComma) {
                    result += ', ';
                }
            });

        } else if (statementType == 'LocalStatement') {

            result = tabs(level) + 'local ';

            // left-hand side
            each(statement.variables, function(variable, needsComma) {
                // Variables in a `LocalStatement` are always local, duh
                result += generateIdentifier(variable.name);
                if (needsComma) {
                    result += ', ';
                }
            });

            // right-hand side
            if (statement.init.length) {
                result += ' = ';
                each(statement.init, function(init, needsComma) {
                    result += formatExpression(init);
                    if (needsComma) {
                        result += ', ';
                    }
                });
            }

        } else if (statementType == 'CallStatement') {

            result = tabs(level) + formatExpression(statement.expression);

        } else if (statementType == 'IfStatement') {

            result = tabs(level) + 'if ' + formatExpression(statement.clauses[0].condition)
            result += ' then'
            result += formatStatementList(statement.clauses[0].body, level+1)

            each(statement.clauses.slice(1), function(clause) {
                if (clause.condition) {
                    result += NL + tabs(level) + 'elseif'
                    result += NL + formatExpression(clause.condition, level+1)
                    result += NL + tabs(level) + 'then'
                } else {
                    result += tabs(level) + 'else'
                }
                result += formatStatementList(clause.body)
            });
            result += NL + tabs(level) + 'end'

        } else if (statementType == 'WhileStatement') {

            result += tabs(level) + 'while ' + formatExpression(statement.condition)
            result += ' do'
            result += formatStatementList(statement.body, level+1)
            result += tabs(level) + 'end'

        } else if (statementType == 'DoStatement') {

            result += ' do'
            result += formatStatementList(statement.body, level+1)
            result += tabs(level) + 'end'

        } else if (statementType == 'ReturnStatement') {

            result = tabs(level) + 'return';

            if(statement.arguments instanceof Array && statement.arguments.length > 0){
                result += ' '
            }

            each(statement.arguments, function(argument, needsComma) {
                result += formatExpression(argument)
                if (needsComma) {
                    result += ', ';
                }
            });

        } else if (statementType == 'BreakStatement') {

            result = tabs(level) + 'break';

        } else if (statementType == 'RepeatStatement') {

            result = tabs(level) + 'repeat ' + formatStatementList(statement.body)
            result += ' until'
            result += formatExpression(statement.condition)

        } else if (statementType == 'FunctionDeclaration') {

            result = tabs(level) + (statement.isLocal ? 'local ' : '') + 'function ';
            result += formatExpression(statement.identifier);
            result += '(';

            if (statement.parameters.length) {
                each(statement.parameters, function(parameter, needsComma) {
                    // `Identifier`s have a `name`, `VarargLiteral`s have a `value`
                    result += parameter.name
                        ? generateIdentifier(parameter.name)
                        : parameter.value;
                    if (needsComma) {
                        result += ',';
                    }
                });
            }

            result += ')';
            result += formatStatementList(statement.body, level+1)
            result += NL + tabs(level) + 'end'

        } else if (statementType == 'ForGenericStatement') {
            // see also `ForNumericStatement`

            result = tabs(level) + 'for ';

            each(statement.variables, function(variable, needsComma) {
                // The variables in a `ForGenericStatement` are always local
                result += generateIdentifier(variable.name);
                if (needsComma) {
                    result += ', ';
                }
            });

            result += ' in ';

            each(statement.iterators, function(iterator, needsComma) {
                result += formatExpression(iterator)
                if (needsComma) {
                    result += ', ';
                }
            });

            result += ' do'
            result += formatStatementList(statement.body, level+1)
            result += NL + tabs(level) + 'end'

        } else if (statementType == 'ForNumericStatement') {

            // The variables in a `ForNumericStatement` are always local
            result = tabs(level) + 'for ' + generateIdentifier(statement.variable.name) + '=';
            result += formatExpression(statement.start) + ', ' +
                formatExpression(statement.end);

            if (statement.step) {
                result += ', ' + formatExpression(statement.step);
            }

            result += ' do'
            result += formatStatementList(statement.body, level+1)
            result += NL + tabs(level) + 'end'

        } else if (statementType == 'LabelStatement') {

            // The identifier names in a `LabelStatement` can safely be renamed
            result = tabs(level) + '::' + generateIdentifier(statement.label.name) + '::';

        } else if (statementType == 'GotoStatement') {

            // The identifier names in a `GotoStatement` can safely be renamed
            result = tabs(level) + 'goto ' + generateIdentifier(statement.label.name);

        } else {

            throw TypeError('Unknown statement type: `' + statementType + '`');

        }

        return result;
    };

    var maxify = function(argument, _idMap, _libIdMap) {
        // `argument` can be a Lua code snippet (string)
        // or a luaparse-compatible AST (object)
        var ast = typeof argument == 'string'
            ? parse(argument)
            : argument;

        idMap = _idMap || {}
        libIdMap = _libIdMap || {}

        console.log('luamax.maxify(', idMap, libIdMap)

        return formatStatementList(ast.body, 0);
    };

    /*--------------------------------------------------------------------------*/

    var luamax = {
        'version': '1.0.1',
        'maxify': maxify
    };

    // Some AMD build optimizers, like r.js, check for specific condition patterns
    // like the following:
    if (
        typeof define == 'function' &&
        typeof define.amd == 'object' &&
        define.amd
    ) {
        define(function() {
            return luamax;
        });
    }   else if (freeExports && !freeExports.nodeType) {
        if (freeModule) { // in Node.js or RingoJS v0.8.0+
            freeModule.exports = luamax;
        } else { // in Narwhal or RingoJS v0.7.0-
            extend(freeExports, luamax);
        }
    } else { // in Rhino or a web browser
        root.luamax = luamax;
    }

}(this));
