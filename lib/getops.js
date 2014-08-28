//Class for parsing and reacting to command line arguments
var Promise = require('bluebird');
var emitter = require('events').EventEmitter;
var Getops = function(){
  this.options = {};
};

Getops.prototype = Object.create(emitter.prototype);
Getops.prototype.constructor = Getops;
Getops.prototype.getParams = function(func, callback){
  var res = func.toString().match(/function(?:.*?)\((.*?)\)\{/);
  var params = [];
  if(res !== null){
    params = res[1].split(',');
  }
  this.emit('null', func, this);
  callback((res === null), params);
};

Getops.prototype.add = function(command, func, context){
    var err = [];
  if(Array.isArray(command)){
    command = command.join(',');
  }
  if(typeof command !== 'string'){
    err.push(new Error('command should be a string'));
  }
  if(typeof func !== 'function'){
    err.push(new Error('func should be function'));
  }
  if(err.length > 0){
    this.emit('error', err, [command, func], this);
    return false;
  } else {
    this.options[command] = {
      cmd:command,
      args:[],
      params: {},
      func:func,
      context:context
    };
    this.emit('add', this.options[command], this);
  }
  return true;
};

Getops.prototype.remove = function(command){
  delete this.options[command];
};


Getops = Promise.promisifyAll(Getops);
module.exports = Getops;