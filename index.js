// argv
  // 0 stack
  // 1 question
  // 2 site

var SE = require('stackexchange');

var context = new SE({ 
  clientId: 3502,
  version: 2.2 
});

var filter = {
  key: 'zUBS9XBccJH*ZodpviQbgw((',
  pagesize: 10,
  tagged: 'node.js',
  sort: 'activity',
  order: 'asc'
};

context.questions.questions(filter, function(err, results){
  if (err) throw err;
  for (var i = 0; i < results.items.length; i++) {
    console.log('\n['+i+']: ' + results.items[i].title);
  }
  console.log(results.has_more, results.quota_remaining);
});

var stack = function() {

};

module.exports = {
  stack: stack,
};