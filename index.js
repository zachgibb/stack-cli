var SE = require('stackexchange');
var entities = require('entities');
var prompt = require('prompt');

var context = new SE({ 
  clientId: 3502,
  version: 2.2,
  site: process.argv[3] || 'stackoverflow', 
});



var stack = function() {

  var criteria = {
    key: 'zUBS9XBccJH*ZodpviQbgw((',
    pagesize: 10,
    sort: 'relevance',
    order: 'asc',
    q: process.argv[2],
    // accepted:'',
    // answers:'',
    // body:'',
    // closed:'',
    // migrated:'',
    // notice:'',
    // nottagged:'',
    // title:'',
    // user:'',
    // url:'',
    // views:'',
    // wiki:'',
  };
  context.search.advanced(criteria, function(err, answers){
    if (err) throw err;
    if (answers.items.length === 0) {

      console.log('\x1B[31mYour search returned no matches\x1B[39m');

    } else {
      prompt.start();

      answers.items.forEach(function(item, index){
        console.log('\n['+index+']: ' + entities.decodeHTML(item.title));
      });

      var message = 'Which answers would you like to see?';

      prompt.get(message, function(err, result) {
        if (err) throw err;
        console.log(
          answers.items[
            result[message]
          ]
        );
      });

    }
  });
};

module.exports = {
  stack: stack,
};

stack();