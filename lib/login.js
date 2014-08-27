/* LOGIN U
"https://stackoverflow.com/users/login?returnurl=https://stackexchange.com/oauth/login_success"
*/


var request = require('request');

var auth_token;
var site = "https://stackoverflow.com/users/login?returnurl=https://stackexchange.com/oauth/login_success";
request(site, function(err, resp, body){
  if(err){
    console.log(err.message);
  } else {
    auth_token = resp.request.headers.authorization;
    console.log(auth_token);
  }
}).auth();
