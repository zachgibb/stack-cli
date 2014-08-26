var wat = function(){
  prompt.start();
    var paths = process.env.PATH.split(':');
    console.log('\x1B[1mChoose a path to install in\x1B[22m');
    paths.forEach(function(path){
      console.log('\t'+path);
    });
  prompt.get('path', function(err, result){
    console.log(result.path);
  });
}();