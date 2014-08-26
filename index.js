var SE = require('stackexchange');
var prompt = require('prompt');
var htmlToText = require('html-to-text');

var context = new SE({ 
  clientId: 3502,
  version: 2.2,
  site: process.argv[3] || 'stackoverflow', 
});

function showAnswers(question, originalAnswers) {
  console.log('good. fetching answers');
  context.questions.answers({
    key: 'zUBS9XBccJH*ZodpviQbgw((',
    sort: 'votes',
    order: 'desc',
    filter: '!)skMacgeg0ntWAi.VWv5'
  }, function(err, answers){
    console.log('ANSWERS    ('+ answers.items.length +')\n-------------------------------------------------------------');
    answers.items.forEach(function(answer, index){

      console.log('\n\x1B[1mANSWER '+index + '          score: ' + answer.score + '\x1B[22m');
      console.log('\n'+htmlToText.fromString(answer.body));
      console.log('\n-- '+answer.owner.display_name);
      
    });

  }, [question.question_id]);
}

function answerSelection(question, originalAnswers) {
  var text = 'Would you like to see the answers to this question? (acceptable responses: y, yes, n, no, back, quit)';
  prompt.get(text, function(err, result) {
    if (err) throw err;

    answer = result[text];
    if (answer === 'yes' || answer === 'y') {

      showAnswers(question, originalAnswers);

    } else if (answer ==='no' || answer === 'n') {
      console.log('we are so sorry');
    } else if (answer === 'back') {
      questionSelection(originalAnswers);
    } else {
      console.log('Quitting');
    }
  });
}

function showBody (question, originalAnswers) {
  context.questions.questions({
    key: 'zUBS9XBccJH*ZodpviQbgw((',
    sort: 'activity',
    order: 'asc',
    filter: '!bA1coBfqSKVk-5'
  }, function(err, result){
    if (err) throw err;
    console.log('\x1B[1m\x1B[4m'+htmlToText.fromString(question.title)+'\x1B[24m\x1B[22m');
    console.log('\n'+htmlToText.fromString(result.items[0].body));
    console.log('\n-- '+question.owner.display_name);

    answerSelection(question, originalAnswers);

  }, [question.question_id]);
}

function questionSelection(answers) {

      prompt.start();

      answers.items.forEach(function(item, index){
        console.log('\n['+index+']: ' + htmlToText.fromString(item.title));
      });

      var message = 'Which post would you like to see?';

      prompt.get(message, function(err, result) {
        var question = answers.items[result[message]];
        if (err) throw err;

        showBody(question, answers);
        

      });

}

function stack() {
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
    console.log(answers.quota_remaining);
    if (answers.items.length === 0) {

      console.log('\x1B[31mYour search returned no matches\x1B[39m');

    } else {

      questionSelection(answers);

    }
  });
}

module.exports = {
  stack: stack,
};