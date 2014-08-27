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
  var result = input;
  result = result.replace(/<pre><code>/g, '|--------------------BEGIN CODE--------------------|\n');
  result = result.replace(/<\/code><\/pre>/g, '\n|---------------------END CODE---------------------|');
  var regex = /(<([^>]+)>)/ig;
  result = result.replace(regex, '');
  result = replaceSpecChars(result);
  return /*hTT.fromString()*/result;
};