//Class for parsing and reacting to command line arguments
var Promise = require('bluebird');
var emitter = require('events').EventEmitter;
var Getops = function(){
  this.commands = {};
  this.commandList = {};
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
  } else {
    coms = coms[1];
  }
  var cmd = this.commandList[coms];
  if(cmd){
    var cmdInfo = this.commands[cmd];
    return this.execCommand(cmdInfo.func, args, cmdInfo.context);
  } else {
    return false;
  }

};

Getops.prototype.execCommand = function(func, args, context){
  return func.apply(context, args);
};
Getops.prototype.add = function(command, func, context){
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
    this.options[shorten] = {
      cmd:command,
      args:[],
      func:func,
      context:context
    };
    this.emit('add', this.options[command], this);
  }
  for(var i = 0; i < command.length; i++){
    this.commandList[command[i]] = shorten;
  }
  return true;
};

Getops.prototype.remove = function(command){
  delete this.options[command];
};


var getOps = new Getops();
module.exports = getOps;