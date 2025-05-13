function parser(tokens) {
    let current = 0;
    
    function walk() {
        let token = tokens[current];
 
        if (token.type === 'NUMBER') {
            current++;
            return {
                type: 'NumberLiteral',
                value: token.value,
                line: token.line,
                column: token.column
            };
        }
        
        if (token.type === 'STRING') {
            current++;
            return {
                type: 'StringLiteral',
                value: token.value,
                line: token.line,
                column: token.column
            };
        }
        
        if (token.type === 'IDENTIFIER') {
            current++;
            return {
                type: 'Identifier',
                name: token.value,
                line: token.line,
                column: token.column
            };
        }
        
        if (token.type === 'PUNCTUATION' && token.value === '(') {
            token = tokens[++current];
            
            let node = {
                type: 'ExpressionStatement',
                expression: walk()
            };
            
            token = tokens[current];
            if (!token || token.value !== ')') {
                throw new Error(`Expected closing parenthesis at line ${token.line}, column ${token.column}`);
            }
            
            current++;
            return node;
        }
        
        if (token.type === 'OPERATOR') {
            let node = {
                type: 'BinaryExpression',
                operator: token.value,
                left: null,
                right: null,
                line: token.line,
                column: token.column
            };
            
            current++;
            
            node.left = walk();
            node.right = walk();
            
            return node;
        }
        
  
        if (token.type === 'KEYWORD' && (token.value === 'var' || token.value === 'let' || token.value === 'const')) {
            const declarationType = token.value;
            token = tokens[++current]; 
            
            if (token.type !== 'IDENTIFIER') {
                throw new Error(`Expected identifier after ${declarationType} at line ${token.line}, column ${token.column}`);
            }
            
            const identifier = token.value;
            current++;
            
            token = tokens[current];
            if (!token || token.value !== '=') {
                throw new Error(`Expected '=' after identifier in declaration at line ${token.line}, column ${token.column}`);
            }
            
            current++;
            const init = walk();
            
            token = tokens[current];
            if (token && token.value === ';') {
                current++; 
            }
            
            return {
                type: 'VariableDeclaration',
                kind: declarationType,
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: identifier
                    },
                    init: init
                }],
                line: token.line,
                column: token.column
            };
        }
        
     
        if (token.type === 'KEYWORD' && token.value === 'if') {
            token = tokens[++current]; 
            
            if (!token || token.value !== '(') {
                throw new Error(`Expected '(' after 'if' at line ${token.line}, column ${token.column}`);
            }
            
            current++;
            const test = walk();
            
            token = tokens[current];
            if (!token || token.value !== ')') {
                throw new Error(`Expected ')' after if condition at line ${token.line}, column ${token.column}`);
            }
            
            current++;
            const consequent = walk();
            
            let alternate = null;
            token = tokens[current];
            
            if (token && token.type === 'KEYWORD' && token.value === 'else') {
                current++;
                alternate = walk();
            }
            
            return {
                type: 'IfStatement',
                test: test,
                consequent: consequent,
                alternate: alternate,
                line: token.line,
                column: token.column
            };
        }
        
        // Handle block statements
        if (token.type === 'PUNCTUATION' && token.value === '{') {
            current++;
            
            const body = [];
            token = tokens[current];
            
            while (token && token.value !== '}') {
                body.push(walk());
                token = tokens[current];
            }
            
            if (!token || token.value !== '}') {
                throw new Error(`Expected '}' to close block at line ${token.line}, column ${token.column}`);
            }
            
            current++;
            return {
                type: 'BlockStatement',
                body: body,
                line: token.line,
                column: token.column
            };
        }
        
     
        throw new Error(`Unexpected token '${token.value}' of type '${token.type}' at line ${token.line}, column ${token.column}`);
    }
    
    // Our AST will have a Program node at the root
    const ast = {
        type: 'Program',
        body: [],
        start: 0,
        end: tokens.length
    };
    
    // Fill the body of our program
    while (current < tokens.length) {
        ast.body.push(walk());
    }
    
    return ast;
}