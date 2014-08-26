#! /usr/bin/env node

var SE = require('stackexchange');
var prompt = require('prompt');
var htmlToText = require('html-to-text');

var context = new SE({ 
  clientId: 3502,
  version: 2.2,
  site: process.argv[3] || 'stackoverflow', 
});

function showAnswers(question, originalAnswers) {
  var criteria = {
    key: 'zUBS9XBccJH*ZodpviQbgw((',
    sort: 'votes',
    order: 'desc',
    filter: '!)Q2ANGPRb(JF95187*15)KtD'
  };
  console.log('Fetching answers');
  context.questions.answers(criteria, function(err, results){
    console.log('ANSWERS    ('+ results.items.length +')');
    console.log('-------------------------------------------------------------');
    
    results.items.forEach(function(answer, index){

      console.log('\n\x1B[1mANSWER '+(index+1) + '          score: ' + answer.score + '\x1B[22m');
      console.log('\n'+htmlToText.fromString(answer.body));
      console.log('\n-- '+answer.owner.display_name);
      
    });

  }, [question.question_id]);
}

function answerSelection(question, originalAnswers) {
  var text = 'Would you like to see the answers to this question? (acceptable responses: y, yes, n, no, back, quit)';
  prompt.get(text, function(err, result) {
    var answer = result[text];
    
    if (err) throw err;

    if (answer === 'yes' || answer === 'y') {

      showAnswers(question, originalAnswers);

    } else if (answer ==='no' || answer === 'n') {

      prompt.get('Would you like to go back to the list?', function(err, results){
        if (results['Would you like to go back to the list?'] === 'yes' || results['Would you like to go back to the list?'] === 'y' ){
          questionSelection(originalAnswers);    
        } else {
          console.log("Goodbye");
        }
      });

    } else if (answer === 'back') {
      questionSelection(originalAnswers);
    } else {
      console.log('Quitting');
    }
  });
}

function showBody (question, originalAnswers) {
  var criteria = {
    key: 'zUBS9XBccJH*ZodpviQbgw((',
    sort: 'activity',
    order: 'asc',
    filter: '!BHMsVcaG7J3bAGdyhbvtS8X)M(dQoa'
  };

  context.questions.questions(criteria, function(err, result){

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
    filter: '!5-e4GbzLCOHI37**URcMxPLbYq5McHnPC-I4s8'
  };
  context.search.advanced(criteria, function(err, answers){
    if (err) throw err;

    if (answers.items.length === 0) {

      console.log('\x1B[31mYour search returned no matches\x1B[39m');

    } else {

      questionSelection(answers);

    }
  });
}

stack();