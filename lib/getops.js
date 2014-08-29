//Class for parsing and reacting to command line arguments
var emitter = require('events').EventEmitter;
var auth = require('./login');

var Getops = function(){
  this.commands = {};
  this.commandList = {};
  this.currPage = 1;
  this.displayCallback = function (err, res, body){
    console.log(body);
  };
};

Getops.prototype = Object.create(emitter.prototype);
Getops.prototype.constructor = Getops;

Getops.prototype.checkAlt = function(string){

  var coms = [];
  var args;
  if(string.match(/\"|\'/)){
    coms = string.match(/\-(?:[a-z]|\-[a-z]+)/i);    
    args = string.split(coms);
    if(!args[0] || args[0] === ''){
      args.shift();
    }
  } else {
    coms = string.split(/\s+/);
    args = coms.slice(1);
    coms = coms[0].match(/\-(?:[a-z]|\-[a-z]+)/i) ? coms[0]: null;
  }

  if(coms === null){    
    return false;
  }

  var cmd = this.commandList[coms];
  if(cmd){
    var cmdInfo = this.commands[cmd];
    if(cmdInfo.callback === true){
      args.push(this.displayCallback);
    }
    this.execCommand(cmdInfo.func, args, cmdInfo.context);
    return true;
  } else {
    return false;
  }

};

Getops.prototype.execCommand = function(func, args, context){
  return func.apply(context, args);
};
Getops.prototype.add = function(command, func, context, hasCallback){
  var err = [];
  var shorten;
  if(!Array.isArray(command)){
    err.push(new Error('command should be an array'));
  }
  if(typeof func !== 'function'){
    err.push(new Error('func should be function'));
  }
  if(err.length > 0){
    this.emit('error', err, [command, func], this);
    return false;
  } else {
    shorten = command.join(',');
    this.commands[shorten] = {
      cmd:command,
      args:[],
      func:func,
      context:context,
      callback:false
    };
    this.emit('add', this.commands[command], this);
  }
  for(var i = 0; i < command.length; i++){
    this.commandList[command[i]] = shorten;
  }
  return true;
};

Getops.prototype.remove = function(command){
  delete this.commands[command];
};


var getOps = new Getops();

getOps.add(['-l', '--login'], auth.login, auth);
getOps.add(['-i', '--inbox'], function(){
  auth.query('inb', null, getOps.currPage, getOps.displayCallback);
}, auth, true);

getOps.add(['-t', '--tags'], function(){
  auth.query('tags', null, getOps.currPage, getOps.displayCallback);
}, auth, true);

getOps.add(['--rephist'], function(){
  auth.query('rephist', null, getOps.currPage, getOps.displayCallback);
}, auth, true);

getOps.add(['-r', '--rep'], function(){
  auth.query('rep', null, getOps.currPage, getOps.displayCallback);
}, auth, true);

getOps.add(['-q', '--quest'], function(){
  auth.query('quest', null, getOps.currPage, getOps.displayCallback);
}, auth, true);

getOps.add(['-p', '--posts'], function(){
  auth.query('posts', null, getOps.currPage, getOps.displayCallback);
}, auth, true);

getOps.add(['--ans'], function(){
  auth.query('ans', null, getOps.currPage, getOps.displayCallback);
}, auth, true);

getOps.add(['-m', '--me'], function(){
  auth.query('me', null, getOps.currPage, getOps.displayCallback);
}, auth, true);

getOps.add(['--commands'], function(){
  getOps.displayCallback({items:getOps.commandList});
}, null, true);

module.exports = getOps;