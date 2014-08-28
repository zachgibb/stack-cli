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
var zlib = require('zlib');
var url = require('url');
var config = {};
try {
 config = requre('./config.js');
} catch(e) {
  //no config file is found
}

var site = "https://stackoverflow.com/users/login?returnurl=https://stackexchange.com/oauth/login_success";
var Auth = function(user, pass){
  this.user = user;
  this.pass = pass;
  this.token = null;
  this.api = 'api.stackexchange.com';
  this.site = '?site=stackoverflow';
  this.authAccessPoints = {
    'ppr': '/questions/render'
  };
};

Auth.prototype.login = function(user, pass){
  if(user !== undefined){
    this.user = user;
  }
  if(pass !== undefined){
    this.pass = pass;
  }

  if(this.user !== null || this.pass !== null){
    var self = this;

    request(site, function(err, resp, body){
      if(err){
        console.log('ERROR: ', err.message);
      } else {
        self.token = resp.request.headers.authorization;
        console.log('Logged in');
      }
    }).auth(this.user, this.pass);
  } else {
    console.log('You must provide a Username and Password');
    return false;
  }
};

Auth.prototype.query = function(destination, site, callback){
  site = site || this.site;

  var dest = url.format({
      protocol: 'http', 
      host: this.api, 
      pathname: '/2.2' + destination,
      search: site
  });
  console.log(dest);
  this.request(dest, callback);
};
//Sends requests with authorized token
//callback should expect 3 args: err, response, body
Auth.prototype.request = function(query, callback){
  var req;
  if(typeof query === 'string'){
    req = query;
  } else {
    req = {url:query, encoding:null, gzip:true};
  }
  console.log({url:query, encoding:null, gzip:true});
  if(this.token){
    request({url:query, encoding:null, gzip:true}, function(err, resp, body){
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

//Saves username and password to config file
Auth.prototype.save = function(config){
  config = config || {};
  config.user = this.user;
  config.pass = this.pass;
  var toSave = "module.exports = " + JSON.stringify(config) + ";";
  fs.writeFile('./config.js', toSave, function(err){
    if(err){
      console.log('ERROR: ',err.message );
    }
  });
};
var user = config.user || null;
var pass = config.pass || null;

module.exports = new Auth(user,pass);
