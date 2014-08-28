var clc = require('cli-color');

var htmlSpecialChars = {
  '"': /&quot;/ig,
  '<': /&lt;/ig,
  '>': /&gt;/ig,
  '&': /&amp;/ig,
  "'": /&apos;/ig
};

var syntaxColors = {
  '<pre><code>': '|--------------------BEGIN CODE--------------------|\n',
  'if': clc.blueBright('if '),
  'else': clc.blueBright('else '),
  'var': clc.blueBright('var '),
  'function': clc.blueBright('function ')
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

  var words = input.split(' ');
  var chain = '';
  var followVar = false;
  var followFunc = false;
  var comment = false;
  
  words.forEach(function(word) {
    if (comment === true || word.indexOf('//') > -1) {
      chain += clc.blackBright(word);
      comment = true;
    } else if (syntaxColors[word] !== undefined) {
      chain += syntaxColors[word];
    } else if (word.indexOf('function(') > -1) {
      i = word.indexOf('function');
      chain += clc.blueBright('function') + word.substr(8, word.length - 1) + ' ';
    } else if (word.indexOf('<') > -1) {
      chain += clc.red(word) + ' ';
    } else if (word.indexOf('"') > -1 || word.indexOf("'") > -1) {
      if (word.indexOf('"') > -1) {
        str = '"';
      } else {
        str = "'";
      }

      var i = word.indexOf(str);
      var j = word.indexOf(str, i + 1) + 1;
      chain += word.substr(0, i) + clc.red(word.substring(i, j)) + word.substr(j) + ' ';
    } else if (followVar === true) {
      chain += clc.green(word) + ' ';
      followVar = false;
    } else if (followFunc === true) {
      chain += clc.green(word.substr(0, word.length-2)) + '() ';
      followFunc = false;
    } else {
      chain += clc.white(word) + ' ';
    }

    if (word === 'function') {
      followFunc = true;
    } else if (word === 'var') {
      followVar = true;
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