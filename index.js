var SE = require('stackexchange');
var entities = require("entities");

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
  context.search.advanced(criteria, function(err, results){
    if (err) throw err;
    results.items.forEach(function(item, index){
      console.log('\n['+index+']: ' + entities.decodeHTML(item.title));
    });
  });
};

module.exports = {
  stack: stack,
};

stack();