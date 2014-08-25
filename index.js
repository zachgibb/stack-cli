var SE = require('stackexchange');
var prompt = require('prompt');
var htmlToText = require('html-to-text');

var context = new SE({ 
  clientId: 3502,
  version: 2.2,
  site: process.argv[3] || 'stackoverflow', 
});



var stack = function() {
  console.log(context);
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
    // filter: '!bA1coBfqSKVk-5'
  };
  context.search.advanced(criteria, function(err, answers){
    if (err) throw err;
    if (answers.items.length === 0) {

      console.log('\x1B[31mYour search returned no matches\x1B[39m');

    } else {
      prompt.start();

      answers.items.forEach(function(item, index){
        console.log('\n['+index+']: ' + htmlToText.fromString(item.title));
      });

      var message = 'Which post would you like to see?';

      prompt.get(message, function(err, result) {
        var question = answers.items[result[message]];
        if (err) throw err;


        context.questions.questions({
          key: 'zUBS9XBccJH*ZodpviQbgw((',
          sort: 'activity',
          order: 'asc',
          filter: '!bA1coBfqSKVk-5'
        }, function(err, result){

          console.log('\x1B[1m\x1B[4m'+htmlToText.fromString(question.title)+'\x1B[24m\x1B[22m');
          console.log('\n'+htmlToText.fromString(result.items[0].body));
          console.log('\n-- '+question.owner.display_name);


        }, [question.question_id]);

      });

    }
  });
};

module.exports = {
  stack: stack,
};

stack();