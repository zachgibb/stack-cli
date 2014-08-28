//Class for parsing and reacting to command line arguments
var emitter = require('events').EventEmitter;
var auth = require('./login');

var Getops = function(){
  this.commands = {};
  this.commandList = {};
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
  auth.query('inb', null, getOps.displayCallback);
}, auth, true);

module.exports = getOps;