/* LOGIN U
"https://stackoverflow.com/users/login?returnurl=https://stackexchange.com/oauth/login_success"

  API Access point format
  'http://api.stackexchange.com/2.2/questions/render?site=stackoverflow';

  api.stackexchange.com api
  2.2 api versionv
  questions/render method
  ?site=stackoverflow site

  response is gzip or deflate encoded, defaults to gzip
*/
var request = require('request');
var fs = require('fs');
var url = require('url');
var config = {};
try {
 config = require('../config.js');
} catch(e) {
  //no if there is an err other than the file not existing
  fs.exists('../config.js', function(bool){
    if(bool){
      console.log(e.message);
    }
  });
}


var Auth = function(token){
  this.token = token;
  this.key = 'FNozlVUcRrDd6fQgyOUP9Q((';
  this.api = 'api.stackexchange.com';
  this.site = '&site=stackoverflow';
  this.incSite = false;
  this.authAccessPoints = {
    'ppr': ['/questions/render', true],
    'inb': ['/inbox', false]
  };
};
Auth.prototype.needAuth = function() {
  console.log('To to access that you must authorize this application.');
  console.log('To authorize, go to the following link: http://bit.ly/stack-cli-oauth', "\n");
  console.log('Select allow, and login with your prefered choice');
  console.log('The following link should appear on your screen with the token following', "\n");
  console.log('https://stackexchange.com/oauth/login_success#access_token=XXXXXXXXXX', "\n");
  console.log('When you have your token, run the -login [TOKEN HERE] -s');
  return false;
};
Auth.prototype.login = function(token){
  if(token.length > 0){
    this.token = token || null;
  }
  console.log('Token is', this.token);
};
Auth.prototype.setDestination = function(key){
  var dest = this.authAccessPoints[key];
  this.incSite = dest[1];
  return dest[0];
};

//This is the main function tat will be used by this class
//It does a query against the server and returns json which is
//Converted to an object
//dest should be a key from this.authAccessPoints,
//site is the stackexchange site, prefixed with an ampersand
//callback will take 3 args, err, response, data object
Auth.prototype.query = function(dest, site, currPage, callback){
  if(!currPage || currPage < 1){
    currPage = 1;
  }
  dest = this.setDestination(dest);
  if(this.token === null){
    return this.needAuth();
  }
  site = !this.incSite ? '':
    (site) ? site: this.site;

  var target = url.format({
      protocol: 'https', 
      host: this.api, 
      pathname: '/2.2'+ dest,
      search: '?access_token='+this.token+ '&key='+ this.key + site + '&pagesize=10&'+currPage+'&filter=withbody'
  });
  this.request(target, callback);
};
//Sends requests with authorized token
//callback should expect 3 args: err, response, body
Auth.prototype.request = function(query, callback){
  if(this.token === null){
    return this.needAuth();
  }
  var req;
  if(typeof query === 'string'){
    req = query;
  } else {
    req = {url:query, encoding:null, gzip:true};
  }

  if(this.token){
    request({url:query, encoding:null, gzip:true, access_token:this.token}, function(err, resp, body){
      if(err){
        console.log('ERROR', err.message);
      } else {
        try {
          body = JSON.parse(body.toString());
          callback(err,resp,body);
        } catch(e){
          callback(e, resp, body);
        }
      }
    }).auth(null,null,null,this.token);
  }
};

//Saves token to config file
Auth.prototype.save = function(config){
  config = config || {};
  config.token = this.token;
  var toSave = "module.exports = " + JSON.stringify(config) + ";";
  fs.writeFile('./config.js', toSave, function(err){
    if(err){
      console.log('ERROR: ',err.message );
    }
  });
};
var token = config.token || process.env.scli || null;

module.exports = new Auth(token);
