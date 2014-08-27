var hTT = require('html-to-text');

var htmlSpecialChars = {
  '"': /&quot;/ig,
  '<': /&lt;/ig,
  '>': /&gt;/ig,
  '&': /&amp;/ig,
  "'": /&apos;/ig
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

exports.htmlToText = function(input) {
  var regex = /(<([^>]+)>)/ig;
  var result = input.replace(regex, '');
  result = replaceSpecChars(result);
  return /*hTT.fromString()*/result;
};