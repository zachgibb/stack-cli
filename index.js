var SE = require('stackexchange');
var entities = require("entities");

var context = new SE({ 
  clientId: 3502,
  version: 2.2 
});

var siteFlags = {
  '-stackoverflow': 'stackoverflow',
  '-serverfault': 'serverfault',
  '-superuser': 'superuser',
  '-meta': 'meta',
  '-webapps': 'webapps',
  '-meta.webapps': 'meta.webapps',
  '-gaming': 'gaming',
  '-meta.gaming': 'meta.gaming',
  '-webmasters': 'webmasters',
  '-meta.webmasters': 'meta.webmasters',
  '-cooking': 'cooking',
  '-meta.cooking': 'meta.cooking',
  '-gamedev': 'gamedev',
  '-meta.gamedev': 'meta.gamedev',
  '-photo': 'photo',
  '-meta.photo': 'meta.photo',
  '-stats': 'stats',
  '-meta.stats': 'meta.stats',
  '-math': 'math',
  '-meta.math': 'meta.math',
  '-diy': 'diy',
  '-meta.diy': 'meta.diy',
  '-meta.superuser': 'meta.superuser',
  '-meta.serverfault': 'meta.serverfault',
  '-gis': 'gis',
  '-meta.gis': 'meta.gis',
  '-tex': 'tex',
  '-meta.tex': 'meta.tex',
  '-askubuntu': 'askubuntu',
  '-meta.askubuntu': 'meta.askubuntu'
};

var stack = function() {
  var criteria = {
    key: 'zUBS9XBccJH*ZodpviQbgw((',
    pagesize: 10,
    sort: 'relevance',
    order: 'asc',
    site: 'stackoverflow',
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