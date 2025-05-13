function openTab(tabName) {
  const tabContents = document.getElementsByClassName('tab-content');
  for (let i = 0; i < tabContents.length; i++) {
      tabContents[i].classList.remove('active');
  }
  
  const tabButtons = document.getElementsByClassName('tab-btn');
  for (let i = 0; i < tabButtons.length; i++) {
      tabButtons[i].classList.remove('active');
  }
  
  document.getElementById(tabName).classList.add('active');
  event.currentTarget.classList.add('active');
}

function analyzeLexically() {
  const inputCode = document.getElementById('input-code').value;
  const outputDiv = document.getElementById('lexical-output');
  
  if (!inputCode.trim()) {
      outputDiv.innerHTML = '<span class="error">Please enter code to analyze</span>';
      return;
  }
  
  try {
      const tokens = lexer(inputCode);
      displayTokens(tokens, outputDiv);
  } catch (error) {
      outputDiv.innerHTML = `<span class="error">Lexical analysis error: ${error.message}</span>`;
  }
}

function analyzeSyntactically() {
  const inputCode = document.getElementById('syntax-input').value;
  const outputDiv = document.getElementById('syntax-output');
  const treeDiv = document.getElementById('parse-tree');
  
  if (!inputCode.trim()) {
      outputDiv.innerHTML = '<span class="error">Please enter code to analyze</span>';
      return;
  }
  
  try {
      // First perform lexical analysis
      const tokens = lexer(inputCode);
      
      // Then perform syntax analysis
      const parseResult = parser(tokens);
      
      outputDiv.innerHTML = '<span style="color: #388e3c;">Syntax analysis successful! No syntax errors found.</span>';
      displayParseTree(parseResult, treeDiv);
  } catch (error) {
      outputDiv.innerHTML = `<span class="error">Syntax analysis error: ${error.message}</span>`;
      treeDiv.innerHTML = '';
  }
}

function displayTokens(tokens, outputDiv) {
  outputDiv.innerHTML = '';
  
  if (tokens.length === 0) {
      outputDiv.innerHTML = 'No tokens found in the input.';
      return;
  }
  
  const table = document.createElement('table');
  
  const headerRow = document.createElement('tr');
  const typeHeader = document.createElement('th');
  typeHeader.textContent = 'Type';
  const valueHeader = document.createElement('th');
  valueHeader.textContent = 'Value';
  const positionHeader = document.createElement('th');
  positionHeader.textContent = 'Position';
  
  headerRow.appendChild(typeHeader);
  headerRow.appendChild(valueHeader);
  headerRow.appendChild(positionHeader);
  table.appendChild(headerRow);
  
  tokens.forEach(token => {
      const row = document.createElement('tr');
      
      const typeCell = document.createElement('td');
      typeCell.textContent = token.type;
      
      const valueCell = document.createElement('td');
      valueCell.textContent = token.value;
      
      const positionCell = document.createElement('td');
      positionCell.textContent = `Line ${token.line}`; // Col ${token.column}`;
      
      row.appendChild(typeCell);
      row.appendChild(valueCell);
      row.appendChild(positionCell);
      table.appendChild(row);
  });
  
  outputDiv.appendChild(table);
}

function displayParseTree(parseResult, treeDiv) {
  treeDiv.innerHTML = '';
  
  if (!parseResult) {
      treeDiv.innerHTML = 'No parse tree to display.';
      return;
  }
  
  const pre = document.createElement('pre');
  pre.textContent = JSON.stringify(parseResult, null, 2);
  treeDiv.appendChild(pre);
}