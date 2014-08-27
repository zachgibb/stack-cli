var hTT = require('html-to-text');

exports.htmlToText = function(input) {
  return hTT.fromString(input);
};