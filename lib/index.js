#! /usr/bin/env node

var SE = require('stackexchange');
var prompt = require('prompt');
var htmlToText = require('html-to-text');

var context = new SE({ 
  clientId: 3502,
  version: 2.2,
  site: process.argv[3] || 'stackoverflow', 
});
function noMore(originalAnswers) {
  var text = 'BACK TO LISTING: y, yes     EXIT: n, no, back, quit, exit';
  console.log('There are no more answers to this question. Go back to the main listing?');
  prompt.get(text, function(err, result) {
    var response = result[text];

    if (response === 'yes' || response === 'y') {
      questionSelection(originalAnswers);
    } else if (response ==='no' || response === 'n' || response === 'back' || response === 'exit' || response === 'quit') {
      console.log('Quitting');
    } else {
      noMore(originalAnswers);
    }

  }); 
}
function showAnswers(results, question, originalAnswers, text, i) {
  answer = results[i];

  console.log('\n\x1B[1mANSWER '+(i+1) + '          score: ' + answer.score + '\x1B[22m');
  console.log('\n'+htmlToText.fromString(answer.body));
  console.log('\n-- '+answer.owner.display_name);

  prompt.get(text, function(err, result){
    var response = result[text];

    if (err) throw err;

    if (response === 'yes' || response === 'y') {
      if (results[i+1]) {
        showAnswers(results, question, originalAnswers, text, i+1);
      } else {
        noMore(originalAnswers);
      }

    } else if (response ==='no' || response === 'n' || response === 'back') {

      questionSelection(originalAnswers);

    } else if (response === 'exit' || response === 'quit') {

      console.log('Quitting');

    } else {
      console.log('Input invalid. Taking you back to questions.');
      questionSelection(originalAnswers);
    }

  });

}
function fetchAnswers(question, originalAnswers) {
  var criteria = {
    key: 'zUBS9XBccJH*ZodpviQbgw((',
    sort: 'votes',
    order: 'desc',
    filter: '!)Q2ANGPRb(JF95187*15)KtD'
  };
  console.log('Fetching answers');
  context.questions.answers(criteria, function(err, results){
    if (err) throw err;

    console.log('ANSWERS    ('+ results.items.length +')');
    console.log('-------------------------------------------------------------');
    
    var text = 'SEE NEXT ANSWER: y, yes     BACK TO LISTING: n, no, back     EXIT: exit, quit';
    if (results.items.length){
      showAnswers(results.items, question, originalAnswers, text, 0);
    } else {
      console.log('No answers for this question.');
      questionSelection(originalAnswers);
    }

  }, [question.question_id]);
}

function answerSelection(question, originalAnswers) {
  var text = 'SEE ANSWERS: y, yes     BACK TO LISTING: n, no, back     EXIT: exit, quit)';
  prompt.get(text, function(err, result) {
    var answer = result[text];
    
    if (err) throw err;

    if (answer === 'yes' || answer === 'y') {

      fetchAnswers(question, originalAnswers);

    } else if (answer ==='no' || answer === 'n' || answer === 'back') {
      questionSelection(originalAnswers);
    } else if (answer === 'exit' || answer === 'quit') {
      console.log('Quitting');
    } else {
      answerSelection(question, originalAnswers);
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

      var message = 'SEE POST: 0 - 9';

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