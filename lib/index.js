#! /usr/bin/env node

var SE = require('stackexchange');
var prompt = require('prompt');
var htmlToText = require('html-to-text');

var context = new SE({ 
  clientId: 3502,
  version: 2.2,
  site: process.argv[3] || 'stackoverflow', 
});
var ValidResponse = function(varsArray) {
  this.options = varsArray;
  this.isValid = function(response) {
    var result = false;
    for (var i = 0; i < this.options.length; i++) {
      if(this.options[i] === response) {
        result = true;
        break;
      } 
    }
    return result;
  };
  this.print = function() {
    return this.options.join(', ');
  };
};

var confirm = new ValidResponse(['y', 'yes']);
var deny = new ValidResponse(['n', 'no']);
var exit = new ValidResponse(['q', 'quit']);
var back = new ValidResponse(['back', 'return']);

function noMore(originalAnswers) {
  var text = 'BACK TO LISTING: ' + confirm.print() +', '+ back.print() +'     EXIT: ' +  deny.print() + ', ' +  exit.print();
  console.log('There are no more answers to this question. Go back to the main listing?');
  prompt.get(text, function(err, result) {
    var response = result[text];

    if ( confirm.isValid(response) || back.isValid(response) ) {

      questionSelection(originalAnswers);

    } else if (deny.isValid(response)|| exit.isValid(response)) {

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

    if (confirm.isValid(response)) {
      if (results[i+1]) {
        showAnswers(results, question, originalAnswers, text, i+1);
      } else {
        noMore(originalAnswers);
      }

    } else if (deny.isValid(response) || back.isValid(response)) {

      questionSelection(originalAnswers);

    } else if (exit.isValid(response)) {

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
    
    var text = 'SEE NEXT ANSWER: '+confirm.print()+'     BACK TO LISTING: '+deny.print()+ ', ' +back.print()+'     EXIT: '+exit.print();
    if (results.items.length){
      showAnswers(results.items, question, originalAnswers, text, 0);
    } else {
      console.log('No answers for this question.');
      questionSelection(originalAnswers);
    }

  }, [question.question_id]);
}

function answerSelection(question, originalAnswers) {
  var text = 'SEE ANSWERS: '+confirm.print()+'     BACK TO LISTING: '+deny.print()+', '+back.print()+'     EXIT: '+exit.print();
  prompt.get(text, function(err, result) {
    var response = result[text];
    
    if (err) throw err;

    if ( confirm.isValid(response) ) {

      fetchAnswers(question, originalAnswers);

    } else if ( deny.isValid(response) || back.isValid(response) ) {
      questionSelection(originalAnswers);
    } else if ( exit.isValid(response) ) {
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

      var message = 'SEE POST: 0 - 9     EXIT: ' + exit.print();

      prompt.get(message, function(err, result) {
        var response = result[message];
        var question = answers.items[response];
        if (err) throw err;
        if (question){
          showBody(question, answers);
        } else if (exit.isValid(response)) {
          console.log('Quitting');
        } else {
          console.log('No question "'+response+'" found. Please choose another question.');
          questionSelection(answers);
        }
        

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