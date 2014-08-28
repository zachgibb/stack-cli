var clc = require('cli-color');

var htmlSpecialChars = {
  '"': /&quot;/ig,
  '<': /&lt;/ig,
  '>': /&gt;/ig,
  '&': /&amp;/ig,
  "'": /&apos;/ig
};

var syntaxColors = {
  'if': '',
};

function replaceSpecChars(input) {
  var output = input;

  for (var key in htmlSpecialChars) {
    if (htmlSpecialChars.hasOwnProperty(key)) {
      output = output.replace(htmlSpecialChars[key], key);
    }
  }

  return output;
}

function syntaxHighlight(input) {
  input = input.replace('<pre><code>', '<pre><code> ');
  
  if (input.indexOf('//') > -1) {
    return clc.blackBright(input);
  }

  var words = input.split(' ');
  var chain = '';
  var followVar = false;
  var followFunc = false;
  
  words.forEach(function(word) {
    if (word === '<pre><code>') {
      chain += '|--------------------BEGIN CODE--------------------|\n';
    } else if (word === 'if' || word === 'else') {
      chain += clc.blueBright(word) + ' ';
    } else if (word === 'var') {
      chain += clc.blueBright(word) + ' ';
      followVar = true;
    } else if (word === 'function') {
      chain += clc.blueBright(word) + ' ';
      followFunc = true;
    } else if (word === 'function()') {
      chain += clc.blueBright('function') + '() ';
    } else if (word.indexOf('<') > -1) {
      chain += clc.red(word) + ' ';
    } else if (word.indexOf('"') > -1) {
      if (word.indexOf(';') > -1) {
        chain += clc.red(word.substr(0, word.length-1)) + ';';
      } else {
        chain += clc.red(word) + ' ';
      }
    } else if (followVar === true) {
      chain += clc.green(word) + ' ';
      followVar = false;
    } else if (followFunc === true) {
      chain += clc.green(word.substr(0, word.length-2)) + '() ';
      followFunc = false;
    } else {
      chain += clc.white(word) + ' ';
    }
  });
  
  return chain;
}

exports.logResponse = function(input) {
  input = replaceSpecChars(input);
  var result = input.split('\n');

  var start = '<pre><code>';
  var end = '</code></pre>';
  var codeblock = false;

  result.forEach(function(line) {
    if (codeblock === true) {
      if (line.indexOf(end) > -1) {
        codeblock = false;
        console.log('|---------------------END CODE---------------------|');
      } else {
        console.log(syntaxHighlight(line));
      }
    } else {
      if (line.indexOf(start) > -1) {
        codeblock = true;
        console.log(syntaxHighlight(line));
      } else {
        line = line.replace(/(<([^>]+)>)/ig, '');
        console.log(line);
      }
    }
  });
};