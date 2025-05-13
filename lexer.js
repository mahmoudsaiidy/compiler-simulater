// Lexical Analyzer (Lexer)
function lexer(input) {
    const tokens = [];
    let current = 0;
    let line = 1;
    let column = 1;
    
    const keywords = ['if', 'else', 'while', 'for', 'function', 'return', 'var', 'let', 'const'];
    const operators = ['+', '-', '*', '/', '=', '==', '!=', '<', '>', '<=', '>='];
    const punctuations = [';', '(', ')', '{', '}', ',', '[', ']'];
    
    const WHITESPACE = /\s/;
    const NUMBERS = /[0-9]/;
    const LETTERS = /[a-zA-Z_]/;
    
    while (current < input.length) {
        let char = input[current];
        
        // Handle whitespace
        if (WHITESPACE.test(char)) {
            if (char === '\n') {
                line++;
                column = 1;
            } else {
                column++;
            }
            current++;
            continue;
        }
        

        if (char === '/' && input[current + 1] === '/') {
            while (current < input.length && input[current] !== '\n') {
                current++;
                column++;
            }
            continue;
        }
        
        if (NUMBERS.test(char)) {
            let value = '';
            while (current < input.length && NUMBERS.test(input[current])) {
                value += input[current];
                current++;
                column++;
            }
            
            tokens.push({
                type: 'NUMBER',
                value: value,
                line: line,
                column: column - value.length
            });
            
            continue;
        }
        
        if (LETTERS.test(char)) {
            let value = '';
            while (current < input.length && (LETTERS.test(input[current]) || NUMBERS.test(input[current]))) {
                value += input[current];
                current++;
                column++;
            }
            
            const type = keywords.includes(value) ? 'KEYWORD' : 'IDENTIFIER';
            
            tokens.push({
                type: type,
                value: value,
                line: line,
                column: column - value.length
            });
            
            continue;
        }

        if (operators.includes(char)) {
            let value = char;
            const nextChar = input[current + 1];
            const potentialOperator = char + nextChar;
            
            if (operators.includes(potentialOperator)) {
                value = potentialOperator;
                current++;
                column++;
            }
            
            tokens.push({
                type: 'OPERATOR',
                value: value,
                line: line,
                column: column
            });
            
            current++;
            column++;
            continue;
        }
        
        if (punctuations.includes(char)) {
            tokens.push({
                type: 'PUNCTUATION',
                value: char,
                line: line,
                column: column
            });
            
            current++;
            column++;
            continue;
        }
        

        if (char === '"' || char === "'") {
            const quoteType = char;
            let value = '';
            current++;
            column++;
            
            while (current < input.length && input[current] !== quoteType) {
                if (input[current] === '\n') {
                    throw new Error(`Unterminated string at line ${line}, column ${column}`);
                }
                value += input[current];
                current++;
                column++;
            }
            
            if (current >= input.length) {
                throw new Error(`Unterminated string at line ${line}, column ${column}`);
            }
            
            tokens.push({
                type: 'STRING',
                value: value,
                line: line,
                column: column - value.length - 1
            });
            
            current++;
            column++;
            continue;
        }
        
        throw new Error(`Unrecognized character '${char}' at line ${line}, column ${column}`);
    }
    
    return tokens;
}